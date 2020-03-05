import {JSONObject} from "../types/Json";

export enum QuerySchedule {
    AD_HOC = 'Ad hoc',
    PER_MINUTE = 'Once a minute',
    PER_HOUR = 'Once an hour',
    PER_DAY = 'Once a day',
    PER_WEEK = 'Once a week',
    PER_MONTH = 'Once a month'
}

export type QueryData = JSONObject;

export interface QueryRecord {
    executionTime: string,
    runtime: number,
    data: QueryData
}

export interface QueryGeneral {
    name: string,
    source: string,
    schedule: QuerySchedule,
}

export interface QueryHistory {
    name: string,
    records: QueryRecord[],
}

export interface QuerySchema {
    name: string,
    schema: JSONObject,
}