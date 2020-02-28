import {JSONObject} from "./Json";

export const enum QuerySchedule {
    AD_HOC = 'Ad hoc',
    PER_MINUTE = 'Once a minute',
    PER_HOUR = 'Once an hour',
    PER_DAY = 'Once a day',
    PER_WEEK = 'Once a week',
    PER_MONTH = 'Once a month'
}

export type QueryNode = JSONObject;

export type QueryData = JSONObject;

export interface QueryRecord {
    executionTime: string,
    runtime: number,
    data: QueryData
}
export interface Query {
    name: string,
    source: string,
    schedule: QuerySchedule,
    history: QueryRecord[],
    structure: QueryNode
}