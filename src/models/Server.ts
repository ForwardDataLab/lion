export interface Server {
    readonly name: string, // assume that name is unique
    readonly url: string,
    readonly slug: string, // todo: change this into enum
    readonly description: string,
    readonly requireAuthentication: boolean,
    readonly requireAuthorization: boolean
}