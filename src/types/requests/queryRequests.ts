import {QueryGeneral} from "../../models/Query";

export interface QueryFullSchemaRequest {
    source: string
}

export interface QuerySelectedSchemaRequest extends QueryFullSchemaRequest {}

export enum QueryUpdateType {
    ADD, DELETE, UPDATE
}

export interface QueryUpdateRequest {
    type: QueryUpdateType,
    data: QueryGeneral,
}

export interface QueryHistoryRecordsRequest {
    queryName: string
}