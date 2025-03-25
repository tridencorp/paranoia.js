import { log } from "console";
import { buffer } from "stream/consumers";

// Encode data to bytes.
export function encode(...objects) {
  let bytes = [];

  objects.forEach((object, i) => {
    switch (object.constructor.name) {
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
        bytes.push.apply(bytes, size(object));
        bytes.push.apply(bytes, new Uint8Array(object.buffer));
        break;

      case "Array":
        // Nested arrays
        let res = []

        object.forEach((elem, i) => {
          res.push.apply(res, encode(elem))
        });

        bytes.push.apply(bytes, size(object));
        bytes.push.apply(bytes, res);
        break;

      case "String":
        const encoder = new TextEncoder();
        const string  = encoder.encode(object);

        bytes.push.apply(bytes, size(string));
        bytes.push.apply(bytes, new Uint8Array(string.buffer));
        break;

      case "Number":
        const num = new BigInt64Array([BigInt(object)]);
        bytes.push.apply(bytes, new Uint8Array(num.buffer));
        break;
      
      case "BigInt":
        // Big ints are encoded as string.
        bytes.push.apply(bytes, encode(object.toString(16)))
        break;
      
      default:
        // Encode Object.
        if (object instanceof Object) {
          let attrs = []

          // Iterate attributes and encode them. 
          for (let attr in object) {
            attrs.push.apply(attrs, encode(object[attr]))
          }

          bytes.push.apply(bytes, size(attrs));
          bytes.push.apply(bytes, attrs);
        }
        break;
    };
  });

  return new Uint8Array(bytes)
}

export function decode(buffer, item, type) {
  let size = 0;

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
      // Get object name, ex: Uint8Array, Int32Array, ...
      let _class = global[item.constructor.name];

      size = new BigUint64Array(buffer.read(8).buffer);
      size = Number(size[0]) * _class.BYTES_PER_ELEMENT

      return new _class(buffer.read(size).buffer);

    // Nested array.
    case "Array":
      size = new BigUint64Array(buffer.read(8).buffer);
      for (let i = 0; i < size; i++) {
        item.push(decode(buffer, new type))
      }
      return item

    case "String":
      const decoder = new TextDecoder();

      size = new BigUint64Array(buffer.read(8).buffer);
      size = Number(size[0])

      return decoder.decode(buffer.read(size).buffer);

    case "Number":
      return Number(new BigInt64Array(buffer.read(8).buffer)[0]);

    case "BigInt":
      // Big ints are decoded to string.
      return BigInt("0x" + decode(buffer, ""))

    default:
      // Decode Object.
      if (item instanceof Object) {
        size = new BigUint64Array(buffer.read(8).buffer);
        size = Number(size[0])

        // Decode attributes.
        for (let attr in item) {
          item[attr] = decode(buffer, item[attr])
        }
      }
      break;
  }
}

export function size(bytes) {
  let size = new BigUint64Array([BigInt(bytes.length)]);
  return new Uint8Array(size.buffer);
}
