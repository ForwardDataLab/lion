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

function createTree(currentObject: JSONObject, allTypes: VizTypeMemoization, parentName: string | null): VizNode {
    if (currentObject.hasOwnProperty('fields')) {
        // a base object
        const name = currentObject.name as string;
        const children = [];
        for (const item of currentObject.fields as JSONObject[]) {
            children.push(createTree(item, allTypes, name));
        }
        return {
            parentName,
            baseObjectName: name,
            name,
            children,
            hasChildren: true
        };
    } else {
        // a field object
        const type = currentObject.type as JSONObject;
        const hasChildren = type.name != null;
        const baseObjectName = parentName as string;
        const name = currentObject.name as string;
        if (!hasChildren) {
            return {
                parentName: parentName as string,
                baseObjectName,
                name,
                children: null,
                hasChildren: false
            };
        } else {
            const newBaseObject = allTypes[(type.ofType as JSONObject).name as string];
            return {
                parentName: parentName as string,
                baseObjectName,
                name,
                children: [createTree(newBaseObject, allTypes, name)],
                hasChildren: true
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
    name: string,
    hasChildren: boolean,
    children: VizNode[] | null
}

interface VizTypeMemoization {
    [index: string]: JSONObject;
}

export const createViz = (props: QueryVizProps) => {
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
    const $svg = d3.select(props.containerElem)
        .append('svg')
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${width} ${height}`);
    const $container = $svg.call(
        d3.zoom().on("zoom", () => {
            const newCoord = d3.event.transform.apply([width/2, -height/2]);
            const newScale = d3.event.transform.scale(1);
            $container.attr("x", newCoord[0]);
            $container.attr('y', newCoord[1]);
            $container.attr('transform', `scale(${newScale.k})`)
        }) as any)
        .append('svg')
        .style('overflow', 'visible')
        .attr('x', width/2)
        .attr('y', -height/2);
    const tree = d3.tree().size([width, height]);
    const rootData = createTree(allTypeObjects[startingString], allTypeObjects, null);
    (rootData as any).savedChildren = rootData.children;
    rootData.children = null;
    const root = d3.hierarchy(rootData, d => d.children);
    (root as any).x0 = height/2;
    (root as any).y0 = 0;
    // root.descendants().forEach((item: any) => {
    //     console.log(item)
    //     item.data.savedChildren = item.data.children;
    //     item.data.children = null;
    // });
    const transition = $svg.transition()
        .duration(200)
        .attr("viewBox", `0, 0, ${width}, ${height}`);

    function update(source: any) {
        console.log(root)
        const nodes = root.descendants();
        const links = root.links();
        tree(root);
        const $nodes = $container.selectAll('g.nodes').data(nodes, datum => (datum as any).data.name);
        const $nodesEnter = $nodes.enter()
            .append('g')
            .attr('class', 'nodes')
            .attr("transform", (d: any) => `translate(${source.y0},${source.x0})`)
            .attr("cursor", (d: any) => {
                return d.data.hasChildren ? "pointer" : `default`
            })
            .on('click', (d: any) => {
                const data = d.data;
                console.log('before', data);
                if (data.children != null) {
                    props.onDeselectNode(data as VizNode);
                    data.savedChildren = data.children;
                    data.children = null;
                } else {
                    props.onSelectNode(data as VizNode, findNode(allTypeObjects[data.baseObjectName as string], data.name as string) as JSONObject);
                    data.children = data.savedChildren;
                    data.savedChildren = null;
                }
                console.log('after', data);
                update(d);
            });
        $nodesEnter.append('circle')
            .attr('class', 'node')
            .attr('r', '5px')
            .style('fill', (d: any) => d.data.hasChildren ? `#388e3c` : `#212121`);

        $nodesEnter.append("text")
            .attr("dy", "0.3em")
            .attr("x", (d: any) => d.data.hasChildren ? -10 : 10)
            .attr("text-anchor", (d: any) => d.data.hasChildren ? "end" : "start")
            .text((d: any) => d.data.name)
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", 3);

        $nodes.merge($nodesEnter as any).transition(transition as any)
            .attr("transform", (d: any) => `translate(${d.y},${d.x})`)
            .attr("fill-opacity", 1)
            .attr("stroke-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        $nodes.exit().transition(transition as any).remove()
            .attr("transform", (d: any) => `translate(${source.y},${source.x})`)
            .attr("fill-opacity", 0)
            .attr("stroke-opacity", 0);

        const diagonal = d3.linkHorizontal().x((d: any) => d.y).y((d: any) => d.x);
        const $links = $container.selectAll("path")
                .data(links, (d: any) => d.target.data.name);
        const $linksEnter = $links.enter()
            .append('path')
            .attr("fill", "none")
            .attr("stroke", `#424242`)
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", 1.5)
            .attr("d", (d: any) => {
                console.log(d)
                return diagonal(d);
            });

        // Transition links to their new position.
        $links.merge($linksEnter as any).transition(transition as any)
            .attr("d", (d: any) => diagonal(d));

        // Transition exiting nodes to the parent's new position.
        $links.exit().transition(transition as any).remove()
            .attr("d", (d: any) => {
                return diagonal(d);
            });

        root.eachBefore((d: any) => {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    update(root);
};