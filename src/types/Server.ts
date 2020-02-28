export interface Server {
    name: string, // assume that name is unique
    url: string,
    slug: string, // todo: change this into enum
    description: string,
    requireAuthentication: boolean,
    requireAuthorization: boolean
}

export enum ServerUpdateType {
    ADD, DELETE, UPDATE
}

export interface ServerUpdateRequest {
    data: Server,
    type: ServerUpdateType
}

export interface ServerUpdateResult {
    isSuccess: boolean,
    errorMessage: string | null
}