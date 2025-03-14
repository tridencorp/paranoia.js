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
      case "BigIint64Array":

      case "Float32Array":
      case "Float64Array":
        let size = new BigUint64Array([BigInt(item.length)]);

        bytes.push.apply(bytes, new Uint8Array(size.buffer));
        bytes.push.apply(bytes, new Uint8Array(item.buffer));
        break;

      case "Array":
        log(items[i].constructor.name);
        break;

      default:
        log(items[i].constructor.name)
        break;
    };
  });

  return new Uint8Array(bytes)
}
