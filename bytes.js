import {
  Big, Int8, Int16, Int32, Int64, Uint8, Uint16, Uint32, Uint64, Float32, Float64
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
        const num = new Int64([BigInt(object)]);
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

          bytes.push.apply(bytes, encodeSize(attrs));
          bytes.push.apply(bytes, attrs);
        }
        break;
    };
  });

  return new Uint8(bytes)
}

export function decode(buffer, item) {
  let size  = 0;
  let bytes = [];
  
  switch (item.constructor.name) {
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
      // Get object name, ex: Uint8Array, Int32Array, ...
      let _class = global[parentName(item)];

      size = decodeSize(buffer, _class.BYTES_PER_ELEMENT)
      return new _class(buffer.read(size).buffer);

    case "Array":
      size = decodeSize(buffer)

      // First element should always be array type.
      let type = item.shift()

      for (let i = 0; i < size; i++) {
        item.push(decode(buffer, new type))
      }
      return item

    case "String":
      size  = decodeSize(buffer)
      bytes = buffer.read(size);

      return new TextDecoder().decode(bytes.buffer)

    case "Number":
      bytes = buffer.read(8).buffer
      return Number(new Int64(bytes)[0]);

    case "Big":
      let hex = decode(buffer, "")
      return new Big("0x" + hex)

    default:
      // Decode Object.
      if (item instanceof Object) {
        size = decodeSize(buffer)

        // Decode attributes.
        for (let attr in item) {
          item[attr] = decode(buffer, item[attr])
        }
      }
      break;
  }
}

export function encodeSize(bytes) {
  let size = new Uint64([BigInt(bytes.length)]);
  return new Uint8(size.buffer);
}

export function decodeSize(buffer, len = 1) {
  let size = new Uint64(buffer.read(8).buffer);
  return Number(size[0]) * len
}

export function parentName(object) {
  return Object.getPrototypeOf(Object.getPrototypeOf(object)).constructor.name;
}