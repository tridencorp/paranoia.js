export class Buffer {
  constructor(bytes) {
    this.buffer = bytes
    this.offset = 0
  }

  // Read number of bytes and return them as Uint8Array.
  read(number) {
    const slice = this.buffer.slice(this.offset, this.offset + number)
    this.offset += number

    return slice
  }  
}
