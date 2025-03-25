export class Buffer {
  constructor(bytes) {
    if(bytes.constructor.name != "Uint8Array") {
      throw new Error("You must use Uint8Array")
    }

    this.buffer = bytes
    this.offset = 0
  }

  // Read n bytes and return them as Uint8Array.
  read(n) {
    const slice = this.buffer.slice(this.offset, this.offset + n)
    this.offset += n
    
    return slice
  }  
}
