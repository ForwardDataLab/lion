import {QueryGeneral, QueryHistoryRecord} from "../../models/Query";
import {HTTPResponse} from "./httpResponses";
import {JSONObject} from "../Json";
import {SchemaTree} from "../../components/commonViews/queries/queryCreateComponents/SchemaTree";

export interface QueryListResponse extends HTTPResponse{
    data: QueryGeneral[]
}

export interface QuerySourcesListResponse extends HTTPResponse{
    data: string[]
}

export interface QueryFullSchemaResponse extends HTTPResponse{
    data: JSONObject
}

export interface QuerySelectedSchemaResponse extends HTTPResponse{
    data: SchemaTree
}

// data is not used
export interface QueryUpdateResponse extends HTTPResponse {
}

export interface QueryHistoryRecordsResponse extends HTTPResponse{
    data: QueryHistoryRecord[]
}