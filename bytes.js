import { log } from "console";

// Encode data to bytes.
export function encode(...items) {
  let bytes = [];

  items.forEach((item, i) => {
    switch (items[i].constructor.name) {
      case "Uint8Array":
      case "Uint16Array":
      case "Uint32Array":
      case "BigUint64Array":

      case "Int8Array":
      case "Int16Array":
      case "Int32Array":
      case "BigInt64Array":

      case "Float32Array":
      case "Float64Array":
        bytes.push.apply(bytes, size(item));
        bytes.push.apply(bytes, new Uint8Array(item.buffer));
        break;

      case "Array":
        // Nested arrays
        let res = []
        
        item.forEach((elem, i) => {
          res.push.apply(res, encode(elem))
        });

        bytes.push.apply(bytes, size(res));
        bytes.push.apply(bytes, res);
        break;

      case "String":
        const encoder = new TextEncoder();
        const string  = encoder.encode(item);

        bytes.push.apply(bytes, size(string));
        bytes.push.apply(bytes, new Uint8Array(string.buffer));
        break;

      default:
        log(items[i].constructor.name)
        break;
    };
  });

  return new Uint8Array(bytes)
}

export function size(bytes) {
  let size = new BigUint64Array([BigInt(bytes.length)]);
  return new Uint8Array(size.buffer)
}