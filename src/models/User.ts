export interface User {
    readonly name: string,
    readonly isAdmin: boolean
}

export interface UserExtended extends User {
    readonly email: string,
    readonly quota: number
    readonly usedQuota: number
}