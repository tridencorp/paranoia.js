```
██████╗  █████╗ ██████╗  █████╗ ███╗   ██╗ ██████╗ ██╗ █████╗         ██╗███████╗
██╔══██╗██╔══██╗██╔══██╗██╔══██╗████╗  ██║██╔═══██╗██║██╔══██╗        ██║██╔════╝
██████╔╝███████║██████╔╝███████║██╔██╗ ██║██║   ██║██║███████║        ██║███████╗
██╔═══╝ ██╔══██║██╔══██╗██╔══██║██║╚██╗██║██║   ██║██║██╔══██║   ██   ██║╚════██║
██║     ██║  ██║██║  ██║██║  ██║██║ ╚████║╚██████╔╝██║██║  ██║██╗╚█████╔╝███████║
╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝╚═╝  ╚═╝╚═╝ ╚════╝ ╚══════╝
                                                  
                                                --- for all maniacs out there 💊
```

It will be efficient library for sending bytes over the internet. No JSON only 
raw bytes !!! It will be optimized for crypto/financial data. 


```js
class Transaction {
  constructor(attrs) {
    this.nonce  = Uint32;
    this.from   = new Uint8(20); // 20 bytes
    this.to     = new Uint8(20); // 20 bytes
    this.gas    = Uint32;
    this.amount = Uint32;
  }
}

let tx = new Transaction()

tx.nonce  = new Uint32([1_000])
tx.from   = new Uint8([111, 143, 87, 113, 80, 144, 218, 38, 50, 69, 57, 136, 217, 161, 80, 27, 154, 250, 29, 11])
tx.to     = new Uint8([112, 120, 42, 113, 80, 144, 218, 32, 50, 69, 57, 136, 217, 134, 80, 27, 154, 144, 22, 14])
tx.gas    = new Uint32([100_000])
tx.amount = new Uint32([10_000])

let bytes = encode(tx)
console.log(bytes)


// Decode
```
