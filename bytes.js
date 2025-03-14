import { log } from "console";

// Encode data to bytes.
export function encode(...items) {
  let bytes = [];

  items.forEach((item, i) => {
    switch (item.constructor.name) {
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

      case "Number":
        const num = new BigInt64Array([BigInt(item)]);
        bytes.push.apply(bytes, new Uint8Array(num.buffer));
        break;

      default:
        // Check if we have object.
        if (item instanceof Object) {
          let attrs = []

          // Iterate all attributes and encode them. 
          for (let key in item) {
            attrs.push.apply(attrs, encode(item[key]))
          }

          bytes.push.apply(bytes, size(attrs));
          bytes.push.apply(bytes, attrs);
        }
        break;
    };
  });

  return new Uint8Array(bytes)
}

export function decode(bytes, item) {
  let offset = 0
  let size   = 0

  switch (item.constructor.name) {
    case "Uint8Array":
      size = new BigUint64Array(bytes.slice(offset, offset + 8).buffer)
      offset += 8

      item = new Uint8Array(bytes.slice(offset, offset + size))
      offset += size

      return item

    default:
      break;
  }
}

export function size(bytes) {
  let size = new BigUint64Array([BigInt(bytes.length)]);
  return new Uint8Array(size.buffer)
}
