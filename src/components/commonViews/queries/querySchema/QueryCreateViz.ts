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
            children
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
                children: null
            };
        } else {
            const newBaseObject = allTypes[(type.ofType as JSONObject).name as string];
            return {
                parentName: parentName as string,
                baseObjectName,
                name,
                children: [createTree(newBaseObject, allTypes, name)]
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
    const tree = d3.tree().size([width, height]);
    const rootData = createTree(allTypeObjects[startingString], allTypeObjects, null);
    const root = d3.hierarchy(rootData, (d: any) => d.children);

    function findChildren(d: any) {
        // assume a flat structure
        // a base type
        if (allTypeObjects.hasOwnProperty(d.name)) {
            const baseObject = allTypeObjects[d.name];
            return (baseObject.fields as JSONObject[]).map(item => ({
                parentName: d.name,
                name: item.name,
                baseObjectName: baseObject.name,
                hasChildren: (item.type as JSONObject).name != null
            }));
        }
        // a field
        let baseObject = findNode(allTypeObjects[d.baseObjectName as string], d.name);
        if (baseObject == null) {
            throw new Error('Base object cannot be null');
        }
        const typeObject = baseObject.type as JSONObject;
        if (typeObject.name == null) {
            const ofType = typeObject.ofType as JSONObject;
            const name = ofType.name as string;
            if (allTypeObjects.hasOwnProperty(name)) {
                baseObject = allTypeObjects[name];
            }
            if (baseObject == null) {
                throw new Error('Base object cannot be null');
            }
        }
        const baseObjectName = baseObject.name as string;
        return (baseObject.fields as JSONObject[]).map(item => ({
            parentName: d.name,
            name: item.name,
            baseObjectName: baseObjectName,
            hasChildren: (item.type as JSONObject).name != null
        }));
    }

    function update(source: any) {
        tree(root);
        console.log(root)
        const nodes = root.descendants();
        console.log(nodes);
        const links = root.links();
        console.log(links)
        const $nodes = $svg.selectAll('g.nodes').data(nodes);
        const $nodesEnter = $nodes.enter()
            .append('g')
            .attr('class', 'nodes')
            .attr("transform", (d: any) => {
                return `translate(${width/2}, ${height/2})`;
            });
        $nodesEnter.append('circle')
            .attr('class', 'node')
            .attr('r', '5px')
            .attr("cursor", (d: any) => {
                console.log('\n\n')
                console.log(d);
                return d.data.hasChildren ? "pointer" : `none`
            })
            .style('fill', (d: any) => d.data.hasChildren ? `#388e3c` : `#795548`)
            .on('click', (d: any) => {
                if (d.hasOwnProperty('children')) {
                    props.onDeselectNode(d as VizNode);
                    d.savedChildren = d.children;
                    delete d.children;
                } else {
                    props.onSelectNode(d as VizNode, findNode(allTypeObjects[d.data.baseObjectName as string], d.data.name as string) as JSONObject);
                    if (d.hasOwnProperty('savedChildren')) {
                        d.children = d.savedChildren;
                        delete d.savedChildren;
                    } else {
                        d.children = findChildren(d.data).map(item => ({data: item}));
                    }
                }
                update(d);
            });

        $nodesEnter.append("text")
            .attr("dy", "0.3em")
            .attr("x", (d: any) => d.data.hasChildren ? -10 : 10)
            .attr("text-anchor", (d: any) => d.data.hasChildren ? "end" : "start")
            .text((d: any) => d.data.name)
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", 3);

        const $links = $svg.append("g")
            .attr("fill", "none")
            .attr("stroke", `#424242`)
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", 1.5)
            .selectAll("path")
            .data(links, (d: any) => d.target.name);

        const diagonal = d3.linkHorizontal().x((d: any) => d.y).y((d: any) => d.x);
        $links.enter().append("path")
            .attr("d", d => {
                console.log(d)
                return diagonal(d as any);
            });
        root.eachBefore((d: any) => {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    update(root);
};