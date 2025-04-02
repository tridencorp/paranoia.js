import { encode, decode } from './bytes.js';
import { Buffer } from './buffer.js';

import {
  Big, Int64, Uint8, Uint16, Uint32, Uint64
} from './types.js';

class Transaction {
  constructor() {
    this.nonce  = Uint32;
    this.from   = new Uint8(20); // 20 bytes
    this.to     = new Uint8(20); // 20 bytes
    this.gas    = Uint32;
    this.amount = Uint32;
  }
}

// Example of encode
let tx1 = new Transaction()

tx1.nonce  = new Uint32([1_000])
tx1.from   = new Uint8([111, 143, 87, 113, 80, 144, 218, 38, 50, 69, 57, 136, 217, 161, 80, 27, 154, 250, 29, 11])
tx1.to     = new Uint8([112, 120, 42, 113, 80, 144, 218, 32, 50, 69, 57, 136, 217, 134, 80, 27, 154, 144, 22, 14])
tx1.gas    = new Uint32([100_000])
tx1.amount = new Uint32([10_000])

let bytes = encode(tx1)
console.log(bytes)

let a = new Uint32(1)

// Example of decode
let buffer = new Buffer(bytes);
let tx2    = new Transaction()

decode(buffer, tx2)
console.log(tx2)
