export interface Server {
    readonly name: string, // assume that name is unique
    readonly url: string,
    readonly slug: string, // todo: change this into enum
    readonly description: string,
    readonly requireAuthentication: boolean,
    readonly requireAuthorization: boolean
}

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