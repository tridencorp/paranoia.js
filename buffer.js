import { Uint8, Uint32 } from './types.js';

export class Buffer {
  constructor(bytes) {
    if(bytes.constructor.name != "Uint8") {
      throw new Error("You must use Uint8")
    }

    this.buffer = bytes
    this.offset = 0
  }

  // Read and return next elements based on their byte size.
  next(type = Uint8) {
    return this.read(this.num() * type.BYTES_PER_ELEMENT)
  }

  // Read the next number of elements in buffer.
  num() {
    let size = new Uint32(this.read(4).buffer);
    return Number(size[0])
  }

  // Read n bytes and return them as Uint8.
  read(n) {
    return this.buffer.slice(this.offset, this.offset += n)
  }  
}
