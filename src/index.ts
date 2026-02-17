import { serialize } from "./utils/serialize";
import { deserialize } from "./utils/deserialize";

/*-----------Stringify using custom serializer-----------*/
export function stringify<T>(value: T): string {
  return JSON.stringify(serialize(value));
}

/*-----------Parse using custom deserializer-----------*/
export function parse<T>(value: string): T {
  return deserialize(JSON.parse(value));
}

export { serialize, deserialize };
