import {Server} from "../models/Server";
import {ViewCommonProps} from "./ViewProps";

export enum ServerUpdateType {
    ADD, DELETE, UPDATE
}

export interface ServerUpdateRequest {
    readonly data: Server,
    readonly type: ServerUpdateType
}

export interface ServerUpdateResult {
    readonly isSuccess: boolean,
    readonly errorMessage: string | null
}

export enum ServerRouteType {
    LIST, NEW, EDIT
}

export interface ServerProps extends ViewCommonProps {
    routeType: ServerRouteType
}

export interface ServerRouteParams {
    [index: string]: string
}

export interface ServerListDetailPanelProps {
    server: Server
}

export interface ServerListProps {
    servers: Server[]
}

export enum ServerListOption { NEW, DETAIL, NONE }

export interface ServerCreateProps {
    onSave(server: Server): void,
}

export interface ServerEditProps extends ServerCreateProps {
    server: Server,

    onDelete(server: Server): void,
}

export enum ServerEditOption {
    DELETE, SAVE, NONE, BACK
}