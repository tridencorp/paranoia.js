export class Buffer {
  // TODO: check types.
  constructor(bytes) {
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
