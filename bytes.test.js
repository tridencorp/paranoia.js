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

let tests = [
  // Uints
  { object: new Uint8Array([1, 2, 3]),       type: Uint8Array,     want: new Uint8Array([3, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3])},
  { object: new Uint16Array([1, 2, 3]),      type: Uint16Array,    want: new Uint8Array([3, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 0, 3, 0])},
  { object: new Uint32Array([1]),            type: Uint32Array,    want: new Uint8Array([1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0])},
  { object: new BigUint64Array([BigInt(2)]), type: BigUint64Array, want: new Uint8Array([1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0])},

  // Ints
  { object: new Int8Array([1, 2, 3]),        type: Int8Array,      want: new Uint8Array([3, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3])},
  { object: new Int16Array([1, 2, 3]),       type: Int16Array,     want: new Uint8Array([3, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 0, 3, 0])},
  { object: new Int32Array([1]),             type: Int32Array,     want: new Uint8Array([1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]) },
  { object: new BigInt64Array([BigInt(2)]),  type: BigInt64Array,  want: new Uint8Array([1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0])},

  // Floats
  { object: new Float32Array([1.0]),         type: Float32Array,   want: new Uint8Array([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128, 63])},
  { object: new Float64Array([1.0]),         type: Float64Array,   want: new Uint8Array([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 240, 63])},
]

for (let test of tests) {
  describe('encode/decode', () => {
    let name = test.object.constructor.name

    let bytes = encode(test.object);
    let buffer = new Buffer(bytes)

    let res = new test.type;
    res = decode(buffer, res)

    it(`encodes ${name}`, () => { assert.deepEqual(bytes, test.want) });
    it(`decodes ${name}`, () => { assert.deepEqual(test.object, res) });
  })
}

describe('encode/decode', () => {
  let array = [new Uint16Array([1]), new Uint16Array([2])];
  let want  = new Uint8Array([2, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0]);
  let bytes = encode(array);

  it('encodes nested Uint16Array', () => { assert.deepEqual(bytes, want) });

  let buffer = new Buffer(bytes);
  let got    = [];

  decode(buffer, got, Uint16Array);
  // it('decodes nested Uint16Array', () => { assert.deepEqual(array, got) });
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
