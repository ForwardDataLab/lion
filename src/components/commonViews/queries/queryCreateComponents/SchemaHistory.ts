import {VizNode} from "./QueryCreateViz";
import {JSONObject} from "../../../../types/Json";
import {QueryFieldInputs} from "./QuerySchemaNodeInput";

export interface SchemaSelectRecord {
    readonly vizNode: VizNode,
    readonly rawNode: JSONObject,
    readonly inputs: QueryFieldInputs,
}

export type SchemaHistory = ReadonlyArray<SchemaSelectRecord>;

export function addRecordToHistory(record: SchemaSelectRecord, history: SchemaHistory): SchemaHistory {
    return [...history, record];
}

function findIndex(node: VizNode, history: SchemaHistory) {
    return history.findIndex(record => {
        return record.vizNode.name === node.name && record.vizNode.baseObjectName === node.baseObjectName;
    });
}

export function removeRecordsInHistory(startingNode: VizNode, history: SchemaHistory): SchemaHistory | null {
    const index = findIndex(startingNode, history);
    if (index < 0) {
        return null;
    }
    return history.slice(0, index);
}

export function replaceRecordInHistory(startingNode: VizNode, record: SchemaSelectRecord, history: SchemaHistory): SchemaHistory | null {
    const newHistory = removeRecordsInHistory(startingNode, history);
    if (newHistory == null) {
        return null;
    }
    return [...newHistory, record];
}