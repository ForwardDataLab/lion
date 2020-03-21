import * as d3 from "d3";
import {JSONObject} from "../../../../types/Json";

const MAX_CHILDREN_COUNT = 10;

interface QueryCreateResponseVizProps {
    data: JSONObject,
    containerElem: HTMLElement
}

interface QueryResponseNode {
    isHandle: boolean,
    value: string,
    children: QueryResponseNode[] | null
}

function isObject(obj: any) {
    // https://stackoverflow.com/questions/11182924/how-to-check-if-javascript-object-is-json
    return obj !== undefined && obj !== null && obj.constructor === Object;
}

const PREVIOUS_HANDLE_TOKEN = `Previous page`;
const NEXT_HANDLE_TOKEN = `Next page`;

function createTree(obj: JSONObject): QueryResponseNode[] {
    const result: QueryResponseNode[] = [];
    for (const [key, value] of Object.entries(obj)) {
        const node: QueryResponseNode = {value: key, children: null, isHandle: false};
        if (Array.isArray(value)) {
            node.children = createTree(value.reduce((acc: any, cur: any, i) => {
                acc[i+1] = cur;
                return acc;
            }, {}) as JSONObject);
        } else if (isObject(value)) {
            node.children = createTree(value as JSONObject);
        } else {
            node.value = `${key}: ${value}`;
        }
        if (node.children != null && node.children.length > MAX_CHILDREN_COUNT) {
            const childrenSize = node.children.length;
            node.children = [
                {value: `${PREVIOUS_HANDLE_TOKEN} (total ${childrenSize} items)`, children: null, isHandle: true},
                ...node.children,
                {value: `${NEXT_HANDLE_TOKEN} (total ${childrenSize} items)`, children: null, isHandle: true},
            ]
        }
        result.push(node);
    }
    return result;
}

let previousData: any = null;

export const cleanUpResponseViz = () => {
    previousData = null
};

export const createResponseViz = (props: QueryCreateResponseVizProps) => {
    const {data, containerElem} = props;
    if (data === previousData) {
        return;
    } else {
        previousData = data;
    }
    const width = 900;
    const height = 500;
    const tree = d3.tree().nodeSize([30, 300]);
    // assume that there is only one root node called "data"
    const cleanedData = {'Query Result': data['data'] as JSONObject};
    const rootData = createTree(cleanedData)[0];
    // calculate all locations prehand
    const root = d3.hierarchy(rootData);
    (root as any).x0 = height / 2;
    (root as any).y0 = 0;
    root.descendants().forEach((item: any, index) => {
        // todo: remove those dynamically added attributes
        item.id = index;
        item.savedChildren = item.children;
        item.children = null;
        item.selected = false;
        item.pageIndex = 0;
        item.isPaginationNeeded = item.savedChildren ? item.savedChildren.length > MAX_CHILDREN_COUNT : false;
    });
    const $svg = d3.select(containerElem)
        .append('svg')
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${width} ${height}`);
    const $svgContainer = $svg.append('svg')
        .style('overflow', 'visible')
        .attr('x', width / 2)
        .attr('y', height / 2);
    const $container = $svgContainer.append('g');
    $svg.call(
        d3.zoom().on("zoom", () => {
            const newCoordinate = d3.event.transform.apply([width / 2, height / 2]);
            const newScale = d3.event.transform.scale(1);
            $svgContainer.attr("x", newCoordinate[0]);
            $svgContainer.attr('y', newCoordinate[1]);
            $container.attr('transform', `scale(${newScale.k})`)
        }) as any).on("dblclick.zoom", null);
    const $linksWrapper = $container.append('g');
    const $nodesWrapper = $container.append('g');
    const diagonal = d3.linkHorizontal().x((d: any) => d.y).y((d: any) => d.x);
    const transition = $svg.transition()
        .duration(200)
        .attr("viewBox", `0, 0, ${width}, ${height}`);
    const circleFillCallback = (d: any) => {
        if (d.data.isHandle) {
            return `#4caf50`;
        }
        return d.data.children != null ? `#0277bd` : `#90a4ae`;
    };

    function update(source: any) {
        const nodes = root.descendants();
        const links = root.links();
        tree(root);
        const $nodes = $nodesWrapper.selectAll('g.nodes')
            .data(nodes, (item: any) => item.id);
        const $nodesEnter = $nodes.enter()
            .append('g')
            .attr('class', 'nodes')
            .attr("transform", (d: any) => `translate(${source.y0},${source.x0})`)
            .attr("cursor", "pointer")
            .on('click', function clickCallback(d: any) {
                d3.event.stopPropagation();
                const switchChildren = (d: any) => {
                    const rawNodes = d.savedChildren.slice(1, -1);
                    const index = d.pageIndex;
                    const lower = index * MAX_CHILDREN_COUNT;
                    const higher = (index+1) * MAX_CHILDREN_COUNT;
                    d.children = rawNodes.slice(lower, higher);
                    if (lower !== 0) {
                        d.children.unshift(d.savedChildren[0]);
                    }
                    if (higher < d.savedChildren.length) {
                        d.children.push(d.savedChildren[d.savedChildren.length - 1])
                    }
                };
                const data = d.data;
                data.selected = !data.selected;
                if (!data.selected) {
                    d.children = null;
                } else {
                    d.children = d.savedChildren;
                    if (d.isPaginationNeeded) {
                        switchChildren(d)
                    }
                }
                if (data.isHandle) {
                    console.log('before', d.parent.children);
                    if (data.value.includes(PREVIOUS_HANDLE_TOKEN)) {
                        d.parent.pageIndex -= 1;
                    } else {
                        d.parent.pageIndex += 1;
                    }
                    switchChildren(d.parent);
                    console.log('after', d.parent.children);
                }
                update(d);
            });
        $nodesEnter.append('circle')
            .attr('class', 'node')
            .attr('r', '5px')
            .attr('fill', circleFillCallback);

        $nodesEnter.append("text")
            .attr("dy", "0.31em")
            .attr("x", (d: any) => d.data.children != null ? -10 : 10)
            .attr("text-anchor", (d: any) => d.data.children != null ? "end" : "start")
            .text((d: any) => d.data.value)
            .clone(true).lower()
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", 5)
            .attr("stroke", "white");

        $nodes.merge($nodesEnter as any).transition(transition as any)
            .attr("transform", (d: any) => `translate(${d.y},${d.x})`)
            .attr("fill-opacity", 1)
            .attr("stroke-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        $nodes.exit().transition(transition as any).remove()
            .attr("transform", (d: any) => `translate(${source.y},${source.x})`)
            .attr("fill-opacity", 0)
            .attr("stroke-opacity", 0);

        const $links = $linksWrapper.selectAll("path")
            .data(links, (item: any) => item.target.id);
        const $linksEnter = $links.enter()
            .append('path')
            .attr("fill", "none")
            .attr("stroke", `#424242`)
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", 1.5)
            .attr("d", (d: any) => {
                const o = {x: source.x0, y: source.y0};
                return diagonal({source: o, target: o} as any);
            });

        // Transition links to their new position.
        $links.merge($linksEnter as any).transition(transition as any)
            .attr("d", (d: any) => diagonal(d));

        // Transition exiting nodes to the parent's new position.
        $links.exit().transition(transition as any).remove()
            .attr("d", (d: any) => {
                const o = {x: source.x, y: source.y};
                return diagonal({source: o, target: o} as any);
            });

        root.eachBefore((d: any) => {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    update(root);
};