export interface Application {
    readonly callbackURL: string,
    readonly home: string,
    readonly name: string,
    readonly description?: string,
    readonly id?: string, // this field is used internally by this application; however, it may be the best if this value can be provided by the server
    readonly [index: string]: string | undefined, // this field is used by TypeScript internally only
}