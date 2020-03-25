export interface Application {
    readonly callbackURL: string,
    readonly home: string,
    readonly name: string,
    readonly description?: string
}