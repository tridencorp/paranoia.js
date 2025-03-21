import { log } from "console";

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

      default:
        // Encode Object.
        if (object instanceof Object) {
          let attrs = []

          // Iterate all attributes and encode them. 
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

export function decode(bytes, item, type) {
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
      let _class = global[item.constructor.name];

      size = new BigUint64Array(bytes.read(8).buffer);
      return new _class(bytes.read(size).buffer);

    case "Array":
      size = new BigUint64Array(bytes.read(8).buffer);
      item.push(1, 2, 3);

    default:
      break;
  }
}

export function size(bytes) {
  let size = new BigUint64Array([BigInt(bytes.length)]);
  return new Uint8Array(size.buffer);
}
