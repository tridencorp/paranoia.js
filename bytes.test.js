import { encode, decode } from './bytes.js';
import { Buffer } from './buffer.js';

import {
  Big, Int8, Int16, Int32, Int64, Uint8, Uint16, Uint32, Uint64, Float32, Float64
} from './types.js';

import assert from 'assert';

class TestUser {
  constructor() {
    this.name   = "name";
    this.age    = 21;
    this.prices = new Uint8();
  }
}

let tests = [
  // Uints
  { object: new Uint8([1, 2, 3]),    type: Uint8,   want: new Uint8([3, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3])},
  { object: new Uint16([1, 2, 3]),   type: Uint16,  want: new Uint8([3, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 0, 3, 0])},
  { object: new Uint32([1]),         type: Uint32,  want: new Uint8([1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0])},
  { object: new Uint64([BigInt(2)]), type: Uint64,  want: new Uint8([1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0])},

  // Ints
  { object: new Int8([1, 2, 3]),     type: Int8,    want: new Uint8([3, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3])},
  { object: new Int16([1, 2, 3]),    type: Int16,   want: new Uint8([3, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 0, 3, 0])},
  { object: new Int32([1]),          type: Int32,   want: new Uint8([1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]) },
  { object: new Int64([BigInt(2)]),  type: Int64,   want: new Uint8([1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0])},

  // Floats
  { object: new Float32([1.0]),      type: Float32, want: new Uint8([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128, 63])},
  { object: new Float64([1.0]),      type: Float64, want: new Uint8([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 240, 63])},
  
  // Strings and Numbers
  { object: "paranoia test",               type: String,        want: new Uint8([13, 0, 0, 0, 0, 0, 0, 0, 112, 97, 114, 97, 110, 111, 105, 97, 32, 116, 101, 115, 116])},
  { object: 666,                           type: Number,        want: new Uint8([154, 2, 0, 0, 0, 0, 0, 0])},
]

describe('#encode/decode', () => {
  for (let test of tests) {
    let name = test.object.constructor.name;

    describe(`${name}`, () => {
      let bytes  = encode(test.object);
      let buffer = new Buffer(bytes);

      let res = new test.type;
      res = decode(buffer, res);

      it(`encodes ${name}`, () => { assert.deepEqual(bytes, test.want) });
      it(`decodes ${name}`, () => { assert.deepEqual(test.object, res) });
    })
  }

  describe('Nested array', () => {
    let data  = [new Uint16([1]), new Uint16([2])]
    let want  = new Uint8([2, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0]);
    let bytes = encode(data);
    
    it('encodes nested Uint16Array', () => { assert.deepEqual(bytes, want) });

    let buffer = new Buffer(bytes);
    let got    = [Uint16];    

    decode(buffer, got);
    it('decodes nested Uint16Array', () => { assert.deepEqual(data, got) });
  });

  describe('Class', () => {
    let object = new TestUser();
    let bytes  = encode(object);

    let want = new Uint8([
      28, 0, 0, 0, 0, 0, 0, 0,  // 8 bytes: Total length
      4, 0, 0, 0, 0, 0, 0, 0,   // 8 bytes: String length
      110, 97, 109, 101,        // 4 bytes: String value
      21, 0, 0, 0, 0, 0, 0, 0,  // 8 bytes: Number value
      0, 0, 0, 0, 0, 0, 0, 0    // 8 bytes: Length of Uint8Array
    ]);

    it('encodes classes', () => { assert.deepEqual(bytes, want) });

    let buffer = new Buffer(bytes);
    let got    = new TestUser();

    decode(buffer, got);
    it('decodes classes', () => { assert.deepEqual(got, object) });
  });

  describe('BigInt', () => {
    let big   = Big('99999999999');
    let want  = new Uint8([10, 0, 0, 0, 0, 0, 0, 0, 49, 55, 52, 56, 55, 54, 101, 55, 102, 102]);
    let bytes = encode(big);

    it('encodes BigInt', () => { assert.deepEqual(bytes, want) });

    let buffer = new Buffer(bytes);
    let got    = Big('');

    got = decode(buffer, got);
    it('decodes BigInt', () => { assert.deepEqual(got, big) });
  });
})
