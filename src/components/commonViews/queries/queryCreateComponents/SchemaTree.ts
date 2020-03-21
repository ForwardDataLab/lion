import {VizNode} from "./QueryCreateViz";
import {QueryFieldInputs} from "./QuerySchemaNodeInput";

interface VizNodeExtended extends VizNode {
    arguments: QueryFieldInputs | null;
}

export interface SchemaTree {
    [baseObjectName: string]: VizNodeExtended[]
}

export function addNodeToTree(node: VizNodeExtended, tree: SchemaTree) {
    const newTree = {...tree};
    if (!newTree.hasOwnProperty(node.baseObjectName)) {
        newTree[node.baseObjectName] = [node];
        return newTree;
    } else {
        if (findIndex(node, tree) >= 0) {
            return tree
        } else {
            newTree[node.baseObjectName].push(node);
            return newTree;
        }
    }
}

export function findIndex(node: VizNode | VizNodeExtended, tree: SchemaTree) {
    if (!tree.hasOwnProperty(node.baseObjectName)) {
        return -1;
    }
    const children = tree[node.baseObjectName];
    return children.findIndex(item => {
        return item.name === node.name && item.baseObjectName === node.baseObjectName;
    });
}

export function removeNodeFromTree(node: VizNode | VizNodeExtended, tree: SchemaTree) {
    const index = findIndex(node, tree);
    if (index < 0) {
        throw new Error("Tree does not have specified node");
    }
    const newTree = {...tree};
    newTree[node.baseObjectName].splice(index, 1);
    return newTree;
}

export function replaceNodeinTree(node: VizNodeExtended, tree: SchemaTree) {
    const index = findIndex(node, tree);
    if (index < 0) {
        throw new Error("Tree does not have specified node");
    }
    const newTree = {...tree};
    newTree[node.baseObjectName][index] = node;
    return newTree;
}