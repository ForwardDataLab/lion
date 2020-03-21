import {JSONObject} from "../../../../types/Json";
import * as d3 from "d3";
import {isTypeConsidered, VizNode, VizTypeMemoization} from "../queryCreateComponents/QueryCreateViz";
import {findIndex, SchemaTree} from "../queryCreateComponents/SchemaTree";

interface QueryCreateDetailVizProps {
    rawSchema: JSONObject,
    selectedTree: SchemaTree,
    containerElem: HTMLElement
}

interface StaticVizTreeNode {
    data: VizNode,
    isPreexisting: boolean,
    selected: boolean,
    children: StaticVizTreeNode[] | null,
}

function createTree(currentObject: JSONObject, allTypes: VizTypeMemoization, existingNodes: SchemaTree, parentName: string | null, parentBaseObjectName: string | null): StaticVizTreeNode {
    const selected = false;
    if (currentObject.hasOwnProperty('fields')) {
        // a base object
        const name = currentObject.name as string;
        const children = [];
        for (const item of currentObject.fields as JSONObject[]) {
            children.push(createTree(item, allTypes, existingNodes, name, name));
        }
        const node = {
            parentBaseObjectName,
            parentName,
            baseObjectName: name,
            name
        };
        return {
            data: node,
            isPreexisting: findIndex(node, existingNodes) >= 0,
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
            const node = {
                parentBaseObjectName,
                parentName,
                baseObjectName,
                name
            };
            return {
                data: node,
                isPreexisting: findIndex(node, existingNodes) >= 0,
                selected,
                children: null
            };
        } else {
            const newBaseObject = allTypes[(type.ofType as JSONObject).name as string];
            const node = {
                parentBaseObjectName,
                parentName,
                baseObjectName,
                name
            };
            return {
                data: node,
                isPreexisting: findIndex(node, existingNodes) >= 0,
                selected,
                children: [createTree(newBaseObject, allTypes, existingNodes, name, parentBaseObjectName)],
            };
        }
    }
}

let cachedRawSchema: any = null;

export const cleanUpDetailViz = () => cachedRawSchema = null;

// todo: merge this function with the original create function
export const createDetailViz = (props: QueryCreateDetailVizProps) => {
    if (props.rawSchema === cachedRawSchema) {
        return;
    }
    cachedRawSchema = props.rawSchema;
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
    const rootData = createTree(allTypeObjects[startingString], allTypeObjects, props.selectedTree, null, null);
    // calculate all locations prehand
    const root = d3.hierarchy(rootData);
    (root as any).x0 = height / 2;
    (root as any).y0 = 0;
    root.descendants().forEach((item: any) => {
        item.savedChildren = item.children;
        item.children = null;
    });
    const $svg = d3.select(props.containerElem)
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
        if (d.data.isPreexisting) {
            return `#ed1250`;
        } else {
            return d.data.children != null ? `#0277bd` : `#90a4ae`;
        }
    };

    function update(source: any) {
        const nodes = root.descendants();
        const links = root.links();
        tree(root);
        const $nodes = $nodesWrapper.selectAll('g.nodes')
            .data(nodes, (datum: any) => {
                return datum.data.data.name;
            });
        const $nodesEnter = $nodes.enter()
            .append('g')
            .attr('class', 'nodes')
            .attr("transform", (d: any) => `translate(${source.y0},${source.x0})`)
            .attr("cursor", "pointer")
            .on('click', function clickCallback(d: any) {
                d3.event.stopPropagation();
                const data = d.data;
                data.selected = !data.selected;
                if (!data.selected) {
                    d.savedChildren = d.children;
                    d.children = null;
                } else {
                    d.children = d.savedChildren;
                    d.savedChildren = null;
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