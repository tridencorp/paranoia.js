export class Big {
  constructor(value) { this.big = BigInt(value) }

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
