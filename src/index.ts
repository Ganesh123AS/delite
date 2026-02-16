import { serialize } from "./utils/serialize";
import { deserialize } from "./utils/deserialize";

export function stringify<T>(value: T): string {
  return JSON.stringify(serialize(value));
}

export function parse<T>(value: string): T {
  return deserialize(JSON.parse(value));
}

export { serialize, deserialize };
