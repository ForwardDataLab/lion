import {JSONObject} from "../types/Json";

export enum QuerySchedule {
    AD_HOC = 'Ad hoc',
    PER_MINUTE = 'Once a minute',
    PER_HOUR = 'Once an hour',
    PER_DAY = 'Once a day',
    PER_WEEK = 'Once a week',
    PER_MONTH = 'Once a month'
}

export interface QueryHistoryRecord {
    executionTimestamp: string,
    runtime: number,
    data: JSONObject
}

export interface QueryGeneral {
    name: string,
    source: string,
    schedule: QuerySchedule,
}