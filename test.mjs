import { stringify, parse } from "./dist/index.js";

const data = {
    normalNumber: 42,
    bigNumber: 1234567890, // BigInt
};

// Serialize using SuperJSON
const serialized = stringify(data);
console.log('Serialized:', JSON.stringify(data));

// Deserialize back
const deserialized = parse(serialized);
console.log('Deserialized:', deserialized);