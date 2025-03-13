import { encode } from './bytes.js';
import assert from 'assert';

describe('encode', () => {
  const data = [new ArrayBuffer(20)];

  it('should be able to encode arrays', () => {
    encode(data)
    assert.equal(true, true);
  });
});