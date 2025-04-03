import { Uint8, Uint32 } from './types.js';

export class Buffer {
  constructor(bytes) {
    if(bytes.constructor.name != "Uint8") {
      throw new Error("You must use Uint8")
    }

    this.buffer = bytes
    this.offset = 0
  }

  // Read and return next number of bytes from buffer.
  next() {
    return this.read(this.num())
  }

  // Read the number of next elements in buffer.
  num() {
    return new Uint32(this.read(4).buffer)[0];
  }

  // Read n bytes and return them as Uint8.
  read(n) {
    return this.buffer.slice(this.offset, this.offset += n)
  }  
}
