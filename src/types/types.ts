/* -------------------TYPES------------------- */

export type MetaEntry =
  | ["Ref", string]
  | ["Undefined"]
  | ["NaN"]
  | ["Infinity"]
  | ["-Infinity"]
  | ["-0"]
  | ["BigInt"]
  | ["Symbol"]
  | ["Date"]
  | ["RegExp"]
  | ["Set"]
  | ["Map"];

export interface MetaValues {
  [path: string]: MetaEntry;
}

export interface Serialized<T> {
  json: any;
  meta?: {
    values: MetaValues;
    v: 1;
  };
}
