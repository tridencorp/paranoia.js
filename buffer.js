export class Buffer {
  constructor(bytes) {
    if(bytes.constructor.name != "Uint8") {
      throw new Error("You must use Uint8")
    }

    this.buffer = bytes
    this.offset = 0
  }

  // Read n bytes and return them as ArrayBuffer.
  read(n) {
    const slice = this.buffer.slice(this.offset, this.offset + n)
    this.offset += n
    
    return slice.buffer
  }  
}
