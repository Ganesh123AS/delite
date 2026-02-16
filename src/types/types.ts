/* -------------------TYPES------------------- */

export type MetaValues = Record<string, [string, any?]>;

export type Serialized<T> = {
    json: any;
    meta?: {
        values?: MetaValues;
        v: number;
    };
};