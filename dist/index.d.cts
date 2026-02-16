type MetaValues = Record<string, [string, any?]>;
type Serialized<T> = {
    json: any;
    meta?: {
        values?: MetaValues;
        v: number;
    };
};

declare function serialize<T>(input: T): Serialized<T>;

declare function deserialize<T>(data: Serialized<T>): T;

declare function stringify<T>(value: T): string;
declare function parse<T>(value: string): T;

export { deserialize, parse, serialize, stringify };
