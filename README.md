```
██████╗  █████╗ ██████╗  █████╗ ███╗   ██╗ ██████╗ ██╗ █████╗         ██╗███████╗
██╔══██╗██╔══██╗██╔══██╗██╔══██╗████╗  ██║██╔═══██╗██║██╔══██╗        ██║██╔════╝
██████╔╝███████║██████╔╝███████║██╔██╗ ██║██║   ██║██║███████║        ██║███████╗
██╔═══╝ ██╔══██║██╔══██╗██╔══██║██║╚██╗██║██║   ██║██║██╔══██║   ██   ██║╚════██║
██║     ██║  ██║██║  ██║██║  ██║██║ ╚████║╚██████╔╝██║██║  ██║██╗╚█████╔╝███████║
╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝╚═╝  ╚═╝╚═╝ ╚════╝ ╚══════╝
                                                  
                                                --- for all maniacs out there 💊
```

# Paranoia

Efficient library for encoding/decoding and sending bytes over the internet.
No JSON only raw bytes ⚡️⚡️⚡️ It will be optimized for crypto/financial data. 


# Encode

Lets say we have simple class

```js
class Transaction {
  constructor() {
    this.nonce  = Uint32;
    this.from   = new Uint8(20); // 20 bytes
    this.to     = new Uint8(20); // 20 bytes
    this.gas    = Uint32;
    this.amount = Uint32;
  }
}
```

We can initialize it

```js
let tx = new Transaction()

tx.nonce  = new Uint32([1_000])
tx.from   = new Uint8([111, 143, 87, 113, 80, 144, 218, 38, 50, 69, 57, 136, 217, 161, 80, 27, 154, 250, 29, 11])
tx.to     = new Uint8([112, 120, 42, 113, 80, 144, 218, 32, 50, 69, 57, 136, 217, 134, 80, 27, 154, 144, 22, 14])
tx.gas    = new Uint32([100_000])
tx.amount = new Uint32([10_000])
```

Now we can encode it using encode().

```js
let bytes = encode(tx)
```

This should give us output like this:

```js
92, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 232, 3, 0, 0, 20, 0, 0, 0, 0, 0, 
0, 0, 111, 143, 87, 113, 80, 144, 218, 38, 50, 69, 57, 136, 217, 161, 80, 27, 154, 
250, 29, 11, 20, 0, 0, 0, 0, 0, 0, 0, 112, 120, 42, 113, 80, 144, 218, 32, 50, 69, 
57, 136, 217, 134, 80, 27, 154, 144, 22, 14, 1, 0, 0, 0, 0, 0, 0, 0, 160, 134, 1, 
0, 1, 0, 0, 0, 0, 0, 0, 0, 16, 39, 0, 0
```

We got 92 bytes - I will try to work on it and optimize the size. Btw, json gives us 396 bytes 
for the same struct.

# Decode

Decoding is done by decode() function

```js
let buffer = new Buffer(bytes);
let tx2    = new Transaction()

decode(buffer, tx2)
```

To see if encode/decode is working, we can make simple comparison.

```js
JSON.stringify(tx1) === JSON.stringify(tx2)
```

# Tests
 
For testing I'm using mocha. 

```js
npx mocha bytes.test.js
```

# Status

Currently it's WIP - not production ready yet. I'm working on it ⚒️, in the next months it will be optimized
and well tested 🤞