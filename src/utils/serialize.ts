/* -------------------SERIALIZE------------------- */

import { MetaValues, Serialized } from "../types/types";

export function serialize<T>(input: T): Serialized<T> {
  const meta: MetaValues = {};
  const seen = new WeakMap<object, string[]>();

  function pathKey(path: string[]) {
    return path.join(".");
  }

  function walk(value: any, path: string[] = []): any {
    // Circular reference
    if (value && typeof value === "object") {
      if (seen.has(value)) {
        meta[pathKey(path)] = ["Ref", pathKey(seen.get(value)!)];
        return null;
      }
      seen.set(value, path);
    }

    // undefined
    if (value === undefined) {
      meta[pathKey(path)] = ["Undefined"];
      return null;
    }

    // Numbers
    if (typeof value === "number") {
      if (Number.isNaN(value)) {
        meta[pathKey(path)] = ["NaN"];
        return null;
      }
      if (value === Infinity) {
        meta[pathKey(path)] = ["Infinity"];
        return null;
      }
      if (value === -Infinity) {
        meta[pathKey(path)] = ["-Infinity"];
        return null;
      }
      if (Object.is(value, -0)) {
        meta[pathKey(path)] = ["-0"];
        return 0;
      }
      return value;
    }

    // BigInt
    if (typeof value === "bigint") {
      meta[pathKey(path)] = ["BigInt"];
      return value.toString();
    }

    // Symbol
    if (typeof value === "symbol") {
      meta[pathKey(path)] = ["Symbol"];
      return value.description ?? "";
    }

    // Date
    if (value instanceof Date) {
      meta[pathKey(path)] = ["Date"];
      return value.toISOString();
    }

    // RegExp
    if (value instanceof RegExp) {
      meta[pathKey(path)] = ["RegExp"];
      return value.toString();
    }

    // Set
    if (value instanceof Set) {
      meta[pathKey(path)] = ["Set"];
      return Array.from(value).map((v, i) => walk(v, [...path, String(i)]));
    }

    // Map
    if (value instanceof Map) {
      meta[pathKey(path)] = ["Map"];
      return Array.from(value.entries()).map(([k, v], i) => [
        walk(k, [...path, "k", String(i)]),
        walk(v, [...path, "v", String(i)])
      ]);
    }

    // Array
    if (Array.isArray(value)) {
      return value.map((v, i) => walk(v, [...path, String(i)]));
    }

    // Object
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
