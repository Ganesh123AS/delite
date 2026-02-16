# Delite Stringify

A lightweight and powerful JSON serializer/deserializer that safely handles special JavaScript values that `JSON.stringify()` normally breaks.

---

## ✨ Features

Supports:

- ✅ undefined
- ✅ NaN
- ✅ Infinity
- ✅ -Infinity
- ✅ -0
- ✅ BigInt
- ✅ Date
- ✅ Symbol
- ✅ RegExp
- ✅ Set
- ✅ Map
- ✅ Circular References

Zero dependencies. Works in Node.js and Browser.

---

## 📦 Installation

```bash
npm install delite-stringify
```

Or scoped:

```bash
npm install @ganesh123as/delite-stringify
```

---

## 🤔 Why Not JSON.stringify?

Normal JSON has limitations:

```js
JSON.stringify({
  undef: undefined,
  nan: NaN,
  infinity: Infinity,
  big: 10n,
  set: new Set([1, 2])
});
```

Problems:

- ❌ undefined is removed
- ❌ NaN becomes null
- ❌ Infinity becomes null
- ❌ BigInt throws error
- ❌ Set becomes {}
- ❌ Circular references crash

👉 Delite Stringify solves all of this.

---

## Basic Usage

```ts
import { stringify, parse } from "delite-stringify";

const data = {
  name: "Ganesh",
  big: 12345678901234567890n,
  date: new Date(),
  set: new Set([1, 2, 3]),
  map: new Map([["a", 1]]),
  undef: undefined,
  nan: NaN
};

const str = stringify(data);
const restored = parse<typeof data>(str);

console.log(restored);
```

Everything is restored correctly 🎉

---

## 🔄 Circular Reference Example

```ts
const obj: any = { name: "test" };
obj.self = obj;

const str = stringify(obj);
const restored = parse(str);

console.log(restored.self === restored); // true
```

No crash. Fully restored.

---

## 📚 API

### stringify(value)

Works like `JSON.stringify()` but supports advanced types.

```ts
const str = stringify(value);
```

---

### parse(string)

Works like `JSON.parse()` but restores special types.

```ts
const data = parse<MyType>(stringValue);
```

---

### serialize(value)

Returns structured data:

```ts
{
  json: any,
  meta?: {
    values: Record<string, any>,
    v: 1
  }
}
```

Used internally by `stringify()`.

---

### deserialize(data)

Restores original value from serialized data.

Used internally by `parse()`.

---

## 🔥 Supported Types

| Type            | Supported |
|-----------------|-----------|
| undefined       | ✅ |
| NaN             | ✅ |
| Infinity        | ✅ |
| -Infinity       | ✅ |
| -0              | ✅ |
| BigInt          | ✅ |
| Date            | ✅ |
| Symbol          | ✅ |
| RegExp          | ✅ |
| Set             | ✅ |
| Map             | ✅ |
| Circular Ref    | ✅ |

---

## ⚡ How It Works

1. Recursively walks through your object.
2. Converts special values into safe JSON format.
3. Stores type information in metadata.
4. Restores everything back during parsing.

---

## 📄 License

MIT

---

## 👨‍💻 Author

Ganesh Bhatt

If you found this useful, ⭐ star the repository!
