
/*-----------------------------------------------
    Custom JSON serializer supporting:
        - Circular references
        - BigInt
        - Symbol
        - Date
        - RegExp
        - Map
        - Set
        - Special numeric values (NaN, Infinity, -0)
-----------------------------------------------*/

/*-----------------------------------------------
    Design Decisions:
        - Metadata stored separately (non-invasive JSON)
        - WeakMap used to avoid memory leaks
        - Path-based reference tracking
-----------------------------------------------*/

/*-----------------------------------------------
    Tradeoffs:
        - Path string generation increases memory
        - Prototype chains not preserved
        - Functions not supported
-----------------------------------------------*/


import { MetaValues, Serialized } from "../types/types";
export function serialize<T>(input: T): Serialized<T> {
  const meta: MetaValues = {};

  /*-----------------------------------------------
      WeakMap is used instead of Map:
          - Keys must be objects
          - Prevents memory leaks (garbage collectible)
          - We only need lookup, not iteration
  -----------------------------------------------*/

  const seen = new WeakMap<object, string[]>();

  const pathKey = (path: string[]) => path.join(".");

  function walk(value: any, path: string[] = []): any {
    const currentPath = pathKey(path);

    // Circular reference detection
    if (value && typeof value === "object") {
      if (seen.has(value)) {
        meta[currentPath] = ["Ref", pathKey(seen.get(value)!)];
        return null;
      }
      seen.set(value, path);
    }

    // Undefined
    if (value === undefined) {
      meta[currentPath] = ["Undefined"];
      return null;
    }

    // Numbers
    if (typeof value === "number") {
      if (Number.isNaN(value)) {
        meta[currentPath] = ["NaN"];
        return null;
      }
      if (value === Infinity) {
        meta[currentPath] = ["Infinity"];
        return null;
      }
      if (value === -Infinity) {
        meta[currentPath] = ["-Infinity"];
        return null;
      }
      if (Object.is(value, -0)) {
        meta[currentPath] = ["-0"];
        return 0;
      }
      return value;
    }

    // BigInt (JSON unsupported natively)
    if (typeof value === "bigint") {
      meta[currentPath] = ["BigInt"];
      return value.toString();
    }

    // Symbol (description only; identity not preserved)
    if (typeof value === "symbol") {
      meta[currentPath] = ["Symbol"];
      return value.description ?? "";
    }

    // Date
    if (value instanceof Date) {
      meta[currentPath] = ["Date"];
      return value.toISOString();
    }

    // RegExp
    if (value instanceof RegExp) {
      meta[currentPath] = ["RegExp"];
      return value.toString();
    }

    // Set
    if (value instanceof Set) {
      meta[currentPath] = ["Set"];
      return Array.from(value).map((v, i) =>
        walk(v, [...path, String(i)])
      );
    }

    // Map
    if (value instanceof Map) {
      meta[currentPath] = ["Map"];
      return Array.from(value.entries()).map(([k, v], i) => [
        walk(k, [...path, "k", String(i)]),
        walk(v, [...path, "v", String(i)])
      ]);
    }

    // Array
    if (Array.isArray(value)) {
      return value.map((v, i) =>
        walk(v, [...path, String(i)])
      );
    }

    // Plain Object
    if (value && typeof value === "object") {
      const out: any = {};
      for (const [key, val] of Object.entries(value)) {
        out[key] = walk(val, [...path, key]);
      }
      return out;
    }

    return value;
  }

  const json = walk(input);

  return Object.keys(meta).length
    ? { json, meta: { values: meta, v: 1 } }
    : { json };
}
