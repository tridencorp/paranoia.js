import { log } from "console";

// Encode data to bytes.
export function encode(...items) {
  let bytes = [];
  let size  = 0

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
        size = new BigUint64Array([BigInt(item.length)]);

        bytes.push.apply(bytes, new Uint8Array(size.buffer));
        bytes.push.apply(bytes, new Uint8Array(item.buffer));
        break;

      case "Array":
        // Nested arrays
        let res = []
        
        item.forEach((elem, i) => {
          res.push.apply(res, encode(elem))
        });

        size = new BigUint64Array([BigInt(res.length)]);

        bytes.push.apply(bytes, new Uint8Array(size.buffer));
        bytes.push.apply(bytes, res);
        break;

      case "String":
        const encoder = new TextEncoder();
        const string  = encoder.encode(item);

        size = new BigUint64Array([BigInt(string.length)]);

        bytes.push.apply(bytes, new Uint8Array(size.buffer));
        bytes.push.apply(bytes, new Uint8Array(string.buffer));
        break;

      default:
        log(items[i].constructor.name)
        break;
    };
  });

  return new Uint8Array(bytes)
}
