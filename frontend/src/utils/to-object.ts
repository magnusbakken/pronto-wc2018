export function toObject<T>(array: Array<[string | number, T]>): { [key: string]: T } {
    const d: { [key: string]: T } = {};
    for (const [key, value] of array) {
        d[key] = value;
    }
    return d;
}