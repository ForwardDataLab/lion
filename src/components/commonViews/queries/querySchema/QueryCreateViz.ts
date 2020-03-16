import {JSONObject} from "../../../../types/Json";
import * as d3 from 'd3';

const builtInTypes = new Set(['String', 'Int', 'Float', 'Boolean', 'ID']);

function isTypeConsidered(name: string) {
    if (name.startsWith('__')) {
        return false;
    }
    return !builtInTypes.has(name);
}

export function findNode(schema: JSONObject | JSONObject[], currentName: string): JSONObject | null {
    if (Array.isArray(schema)) {
        for (const item of schema) {
            const result = findNode(item, currentName);
            if (result != null) {
                return result;
            }
        }
    } else {
        if (schema.hasOwnProperty('name') && schema.name as string === currentName) {
            return schema;
        }
        if (schema.hasOwnProperty('fields')) {
            return findNode(schema.fields as JSONObject[], currentName);
        }
    }
    return null;
}

function createTree(currentObject: JSONObject, allTypes: VizTypeMemoization, parentName: string | null): VizTreeNode {
    const selected = false;
    if (currentObject.hasOwnProperty('fields')) {
        // a base object
        const name = currentObject.name as string;
        const children = [];
        for (const item of currentObject.fields as JSONObject[]) {
            children.push(createTree(item, allTypes, name));
        }
        return {
            data: {
                parentName,
                baseObjectName: name,
                name
            },
            selected,
            children
        };
    } else {
        // a field object
        const type = currentObject.type as JSONObject;
        const hasChildren = type.name == null;
        const baseObjectName = parentName as string;
        const name = currentObject.name as string;
        if (!hasChildren) {
            return {
                data: {
                    parentName: parentName as string,
                        baseObjectName,
                        name
                },
                selected,
                children: null
            };
        } else {
            const newBaseObject = allTypes[(type.ofType as JSONObject).name as string];
            return {
                data: {
                    parentName: parentName as string,
                    baseObjectName,
                    name
                },
                selected,
                children: [createTree(newBaseObject, allTypes, name)],
            };
        }
    }
}

interface QueryVizProps {
    rawSchema: JSONObject,
    containerElem: HTMLElement,

    onSelectNode(data: VizNode, actualNode: JSONObject): void,

    onDeselectNode(data: VizNode): void,
}

export interface VizNode {
    parentName: string | null,
    baseObjectName: string,
    name: string
}

interface VizTreeNode {
    data: VizNode,
    selected: boolean,
    children: VizTreeNode[] | null,
}

interface VizTypeMemoization {
    [index: string]: JSONObject;
}


const svgID = `query-create-viz`;

/**
 * Source: https://observablehq.com/@d3/collapsible-tree
 */
export const createViz = (props: QueryVizProps) => {
    if (document.getElementById(svgID)) {
        return;
    }
    const schema = (props.rawSchema.data as JSONObject).__schema as JSONObject;
    const startingString = (schema.queryType as JSONObject).name as string;
    const allTypeObjects: VizTypeMemoization = (schema.types as JSONObject[]).reduce((acc: VizTypeMemoization, item) => {
        const name = item.name as string;
        if (isTypeConsidered(name)) {
            acc[name] = item;
        }
        return acc
    }, {});
    if (!allTypeObjects.hasOwnProperty(startingString)) {
        throw new Error('Starting query name does not exist');
    }

    const width = 900;
    const height = 500;
    const tree = d3.tree().nodeSize([30, 300]);
    const rootData = createTree(allTypeObjects[startingString], allTypeObjects, null);
    // calculate all locations prehand
    const root = d3.hierarchy(rootData);
    console.log('computed root', root);
    (root as any).x0 = height/2;
    (root as any).y0 = 0;
    root.descendants().forEach((item: any) => {
        item.savedChildren = item.children;
        item.children = null;
    });
    const $svg = d3.select(props.containerElem)
        .append('svg')
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr('id', svgID);
    const $svgContainer = $svg.append('svg')
        .style('overflow', 'visible')
        .attr('x', width/2)
        .attr('y', height/2);
    const $container = $svgContainer.append('g');
    $svg.call(
        d3.zoom().on("zoom", () => {
            const newCoordinate = d3.event.transform.apply([width/2, height/2]);
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

    function update(source: any) {
        const nodes = root.descendants();
        const links = root.links();
        tree(root);
        console.log('root', root);
        const $nodes = $nodesWrapper.selectAll('g.nodes')
            .data(nodes, (datum: any) => {
                return datum.data.data.name;
            });
        const $nodesEnter = $nodes.enter()
            .append('g')
            .attr('class', 'nodes')
            .attr("transform", (d: any) => `translate(${source.y0},${source.x0})`)
            .attr("cursor", "pointer")
            .on('click', (d: any) => {
                d3.event.stopPropagation();
                const data = d.data;
                if (d.children != null) {
                    props.onDeselectNode(data.data as VizNode);
                    d.savedChildren = d.children;
                    d.children = null;
                    data.selected = false;
                } else {
                    props.onSelectNode(
                        data.data as VizNode,
                        findNode(
                            allTypeObjects[data.data.baseObjectName as string],
                            data.data.name as string
                        ) as JSONObject
                    );
                    data.selected = true;
                    d.children = d.savedChildren;
                    d.savedChildren = null;
                }
                console.log('onClick', d);
                update(d);
            });
        $nodesEnter.append('circle')
            .attr('class', 'node')
            .attr('r', '5px')
            .style('fill', (d: any) => {
                if (d.data.data.selected) {
                    return `#ed1250`;
                } else {
                    return d.data.children != null ? `#0277bd` : `#90a4ae`;
                }
            });

        $nodesEnter.append("text")
            .attr("dy", "0.31em")
            .attr("x", (d: any) => d.data.children != null ? -10 : 10)
            .attr("text-anchor", (d: any) => d.data.children != null ? "end" : "start")
            .text((d: any) => d.data.data.name)
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
                .data(links, (d: any) => d.target.data.data.name);
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