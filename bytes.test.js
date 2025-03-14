import { encode } from './bytes.js';
import { log } from "console";
import assert from 'assert';

describe('#encode', () => {
  // Uints
  let array = new Uint8Array([1, 2, 3]);
  let want  = new Uint8Array([3, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3]);
  it('encodes Uint8Array', () => { assert.deepEqual(encode(array), want) });

  array = new Uint16Array([1, 2, 3]);
  want  = new Uint8Array([3, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 0, 3, 0]);
  it('encodes Uint16Array', () => { assert.deepEqual(encode(array), want) });

  array = new Uint32Array([1]);
  want  = new Uint8Array([1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]);
  it('encodes Uint32Array', () => { assert.deepEqual(encode(array), want) });

  array = new BigUint64Array([BigInt(2)]);
  want  = new Uint8Array([1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0]);
  it('encodes BigUint64Array', () => { assert.deepEqual(encode(array), want) });

  // Ints
  array = new Int8Array([1, 2, 3]);
  want  = new Uint8Array([3, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3]);
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
