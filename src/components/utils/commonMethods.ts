export function isBlank(str: string) {
    return (!str || 0 === str.length || /^\s*$/.test(str));
}