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
        bytes.push.apply(bytes, encodeSize(object));
        bytes.push.apply(bytes, new Uint8(object.buffer));
        break;

      case "Array":
        let res = []

        object.forEach((elem, i) => {
          res.push.apply(res, encode(elem))
        });

        bytes.push.apply(bytes, encodeSize(object));
        bytes.push.apply(bytes, res);
        break;

      case "String":
        const encoder = new TextEncoder();
        const string  = encoder.encode(object);

        bytes.push.apply(bytes, encodeSize(string));
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
    case "Int8":
      return set(item, buffer.next());

    case "Uint16":
    case "Int16":
      return set(item, buffer.next(Uint16));

    case "Uint32":
    case "Int32":
    case "Float32":
      return set(item, buffer.next(Uint32));  

    case "Uint64":
    case "Int64":
    case "Float64":
      return set(item, buffer.next(Uint64));

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
        // Check if we have class constructor function.
        if (item.constructor.name == 'Function') {
          item = new item()
        }

        // Decode attributes.
        for (let attr in item) {
          item[attr] = decode(buffer, item[attr])
        }

        return item
      }
  }
}

export function set(item, bytes) {
  // Item is class instance.
  if (item.constructor.name != 'Function') {
    item.set(bytes)
    return item
  }

  // Item is constructor function so we can call new.
  return new item(bytes.buffer);
}

export function encodeSize(bytes) {
  let size = new Uint32([bytes.length]);
  return new Uint8(size.buffer);
}
