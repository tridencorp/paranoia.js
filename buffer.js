import { Uint64 } from './types.js';

export class Buffer {
  constructor(bytes) {
    if(bytes.constructor.name != "Uint8") {
      throw new Error("You must use Uint8")
    }

    this.buffer = bytes
    this.offset = 0
  }

  // Read and return next elements in buffer based on theirs byte size.
  next()   { return this.read(this.size() * 1) }
  next16() { return this.read(this.size() * 2) }
  next32() { return this.read(this.size() * 4) }
  next64() { return this.read(this.size() * 8) }

  // Read the next size from buffer.
  size() {
    let size = new Uint64(this.read(8));
    return Number(size[0])
  }
  
  // Read n bytes and return them as ArrayBuffer.
  read(n) {
    return this.buffer.slice(this.offset, this.offset += n).buffer
  }  
}
