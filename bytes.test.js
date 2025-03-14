import { encode, decode } from './bytes.js';
import { Buffer } from './buffer.js';
import { log } from "console";
import assert from 'assert';

class TestUser {
  constructor() {
    this.name  = "name";
    this.age   = 21;
    this.price = new Uint8Array();
  }
}

describe('encode/decode', () => {
  let array = new Uint8Array([1, 2, 3]);
  let want  = new Uint8Array([3, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3]);
  let bytes = encode(array);

  it('encodes Uint8Array', () => { assert.deepEqual(bytes, want) });

  let buffer = new Buffer(bytes)
  let got    = new Uint8Array();

  got = decode(buffer, got)
  it('decodes Uint8Array', () => { assert.deepEqual(array, got) });
})

describe('encode/decode', () => {
  let array = new Uint16Array([1, 2, 3]);
  let want  = new Uint8Array([3, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 0, 3, 0]);
  let bytes = encode(array);
  
  it('encodes Uint16Array', () => { assert.deepEqual(bytes, want) });

  let buffer = new Buffer(bytes)
  let got    = new Uint16Array();

  got = decode(buffer, got)
  it('decodes Uint16Array', () => { assert.deepEqual(array, got) });
});


describe('encode/decode', () => {
  let array = new Uint32Array([1]);
  let want  = new Uint8Array([1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]);
  let bytes = encode(array);
  
  it('encodes Uint32Array', () => { assert.deepEqual(bytes, want) });

  let buffer = new Buffer(bytes)
  let got    = new Uint32Array();

  got = decode(buffer, got)
  it('decodes Uint32Array', () => { assert.deepEqual(array, got) });
});

describe('encode/decode', () => {
  let array = new BigUint64Array([BigInt(2)]);
  let want  = new Uint8Array([1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0]);
  let bytes = encode(array);
  
  it('encodes BigUint64Array', () => { assert.deepEqual(bytes, want) });

  let buffer = new Buffer(bytes)
  let got    = new BigUint64Array();

  got = decode(buffer, got)
  it('decodes BigUint64Array', () => { assert.deepEqual(array, got) });
});

describe('#encode', () => {
  let array = new Int8Array([1, 2, 3]);
  let want  = new Uint8Array([3, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3]);
  it('encodes Int8Array', () => { assert.deepEqual(encode(array), want) });

  array = new Int16Array([1, 2, 3]);
  want  = new Uint8Array([3, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 0, 3, 0]);
  it('encodes Int16Array', () => { assert.deepEqual(encode(array), want) });

  array = new Int32Array([1]);
  want  = new Uint8Array([1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]);
  it('encodes Int32Array', () => { assert.deepEqual(encode(array), want) });

  array = new BigInt64Array([BigInt(2)]);
  want  = new Uint8Array([1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0]);
  it('encodes BigInt64Array', () => { assert.deepEqual(encode(array), want) });

  // Floats
  array = new Float32Array([1.0]);
  want  = new Uint8Array([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128, 63]);
  it('encodes Float32Array', () => { assert.deepEqual(encode(array), want) });

  array = new Float64Array([1.0]);
  want  = new Uint8Array([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 240, 63]);
  it('encodes Float64Array', () => { assert.deepEqual(encode(array), want) });
});

describe('#encode', () => {
  let array = [new Uint16Array([1]), new Uint16Array([2])];
  let want  = new Uint8Array([20, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0]);
  it('encodes nested Uint16Array', () => { assert.deepEqual(encode(array), want) });
});

describe('#encode', () => {
  let str  = "paranoia test";
  let want = new Uint8Array([13, 0, 0, 0, 0, 0, 0, 0, 112, 97, 114, 97, 110, 111, 105, 97, 32, 116, 101, 115, 116]);
  it('encodes string', () => { assert.deepEqual(encode(str), want) });
});

describe('#encode', () => {
  let num  = 666;
  let want = new Uint8Array([154, 2, 0, 0, 0, 0, 0, 0]);
  it('encodes numbers', () => { assert.deepEqual(encode(num), want) });
});

describe('#encode', () => {
  let object = new TestUser();

  let want = new Uint8Array([
    28, 0, 0, 0, 0, 0, 0, 0,  // 8 bytes: Total length
    4, 0, 0, 0, 0, 0, 0, 0,   // 8 bytes: String length
    110, 97, 109, 101,        // 4 bytes: String value
    21, 0, 0, 0, 0, 0, 0, 0,  // 8 bytes: Number value
    0, 0, 0, 0, 0, 0, 0, 0    // 8 bytes: Length of Uint8Array
  ]);

  it('encodes classes', () => { assert.deepEqual(encode(object), want) });
});
