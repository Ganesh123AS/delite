/* -------------------DESERIALIZE------------------- */

import { Serialized } from "../types/types";
export function deserialize<T>(data: Serialized<T>): T {
    const { json, meta } = data;
    const values = meta?.values ?? {};
    const refs = new Map<string, any>();

    function walk(value: any, path: string): any {
        const m = values[path];

        if (m) {
            const [type, refPath] = m;

            switch (type) {
                case "Ref":
                    return refs.get(refPath);

                case "Undefined":
                    return undefined;

                case "NaN":
                    return NaN;

                case "Infinity":
                    return Infinity;

                case "-Infinity":
                    return -Infinity;

                case "-0":
                    return -0;

                case "BigInt":
                    return BigInt(value);

                case "Date":
                    return new Date(value);

                case "Symbol":
                    return Symbol(value);

                case "RegExp": {
                    const lastSlash = value.lastIndexOf("/");
                    const body = value.slice(1, lastSlash);
                    const flags = value.slice(lastSlash + 1);
                    return new RegExp(body, flags);
                }

                case "Set": {
                    const set = new Set(
                        value.map((v: any, i: number) =>
                            walk(v, path ? `${path}.${i}` : `${i}`)
                        )
                    );
                    refs.set(path, set);
                    return set;
                }

                case "Map": {
                    const map = new Map(
                        value.map(([k, v]: any, i: number) => [
                            walk(k, `${path}.k.${i}`),
                            walk(v, `${path}.v.${i}`)
                        ])
                    );
                    refs.set(path, map);
                    return map;
                }
            }
        }

        if (Array.isArray(value)) {
            const arr = value.map((v, i) =>
                walk(v, path ? `${path}.${i}` : `${i}`)
            );
            refs.set(path, arr);
            return arr;
        }

        if (value && typeof value === "object") {
            const obj: any = {};
            refs.set(path, obj);
            for (const [key, val] of Object.entries(value)) {
                const newPath = path ? `${path}.${key}` : key;
                obj[key] = walk(val, newPath);
            }
            return obj;
        }

        return value;
    }

    return walk(json, "") as T;
}