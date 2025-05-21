// We need this to run it in the browser or node.js
const ctx = (typeof window !== 'undefined' ? window : global);

export class Big {
  constructor(value) {
    this.big = BigInt(value)
  }

  valueOf() {
    return this.big;
  }
}

export class Int8  extends Int8Array     {}
export class Int16 extends Int16Array    {}
export class Int32 extends Int32Array    {}
export class Int64 extends BigInt64Array {}

export class Uint8  extends Uint8Array     {}
export class Uint16 extends Uint16Array    {}
export class Uint32 extends Uint32Array    {}
export class Uint64 extends BigUint64Array {}

export class Float32 extends Float32Array {}
export class Float64 extends Float64Array {}

export function Number(value) {
  return ctx.Number(value) || ctx.Number(0);
}

export function String(value) {
  return value ? ctx.String(value) : ctx.String("");
}
