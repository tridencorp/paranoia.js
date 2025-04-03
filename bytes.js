import {
  Big, Int64, Uint8, Uint16, Uint32, Uint64
} from './types.js';

// Encode data to bytes.
export function encode(...objects) {
  let bytes = [];

  objects.forEach((object, i) => {
    switch (object.constructor.name) {
      case "Uint8":
      case "Uint16":
      case "Uint32":
      case "Uint64":
      case "Int8":
      case "Int16":
      case "Int32":
      case "Int64":
      case "Float32":
      case "Float64":
        bytes.push.apply(bytes, encodeSize(object.buffer.byteLength));
        bytes.push.apply(bytes, new Uint8(object.buffer));
        break;

      case "Array":
        let res = []

        object.forEach((elem, i) => {
          res.push.apply(res, encode(elem))
        });

        bytes.push.apply(bytes, encodeSize(object.length));
        bytes.push.apply(bytes, res);
        break;

      case "String":
        const encoder = new TextEncoder();
        const string  = encoder.encode(object);

        bytes.push.apply(bytes, encodeSize(string.length));
        bytes.push.apply(bytes, new Uint8(string.buffer));
        break;

      case "Number":
        const num = new Int64([new Big(object)]);
        bytes.push.apply(bytes, new Uint8(num.buffer));
        break;

      case "Big":
        bytes.push.apply(bytes, encode(object.big.toString(16)))
        break;

      default:
        // Encode Object.
        if (object instanceof Object) {
          let attrs = []

          // Encode attributes. 
          for (let attr in object) {
            attrs.push.apply(attrs, encode(object[attr]))
          }

          bytes.push.apply(bytes, attrs);
        }
        break;
    };
  });

  return new Uint8(bytes)
}

export function decode(buffer, item) {
  let num   = 0;
  let bytes = [];

  let name = item.constructor.name;

  if (name == "Function") {
    name = item.name;
  }

  switch (name) {
    case "Uint8":
    case "Uint16":
    case "Uint32":
    case "Uint64":
    case "Int8":
    case "Int16":
    case "Int32":
    case "Int64":
    case "Float32":
    case "Float64":
      return set(item, buffer.next().buffer);

    case "Array":
      num = buffer.num()

      // First element should always be array type, ex: [Uint8], [Uint16] ...
      let type = item.shift()

      for (let i = 0; i < num; i++) {
        item.push(decode(buffer, type))
      }
      return item

    case "String":
      bytes = buffer.next();
      return new TextDecoder().decode(bytes)

    case "Number":
      bytes = buffer.read(8).buffer
      return Number(new Int64(bytes)[0]); 

    case "Big":
      let hex = decode(buffer, String)
      return new Big("0x" + hex)

    default:
      // Decode Object.
      if (item instanceof Object) {
        item = set(item)

        // Decode attributes.
        for (let attr in item) {
          item[attr] = decode(buffer, item[attr])
        }

        return item
      }
  }
}

export function set(item, bytes) {
  // Class function constructor, we can call new.
  if (item.constructor.name == 'Function') {
    return bytes ? new item(bytes) : new item()
  }

  // We have class instance so we can try to call set.
  return bytes ? item.set(bytes) : item
}

export function encodeSize(size) {
  size = new Uint32([size]);
  return new Uint8(size.buffer);
}
