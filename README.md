## Quickstart

```
yarn add depay-blockchain-token
```

or 

```
npm install --save depay-blockchain-token
```

```javascript
import { Token } from 'depay-blockchain-token';

let token = new Token({
  blockchain: 'ethereum',
  address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb'
});

token.address // '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb'
await token.decimals() // 18
await token.symbol() // 'DEPAY'
await token.name() // 'DePay'
await token.transferable() // true
```

## Functionalities

### initalize (new)

```javascript
import { Token } from 'depay-blockchain-token';

let token = new Token({
  blockchain: 'ethereum',
  address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb'
});
```

### decimals

Retrieves token decimals

```javascript
await token.decimals() // 18
```

### symbol

Retrieves token symbol

```javascript
await token.symbol() // DEPAY
```

### name

Retrieves token name

```javascript
await token.name() // DePay
```

### transferable

Checks if token is transferable:

```javascript
await token.transferable() // true
```

### balance

Provides the balance (BigNumber) of the given account:

```javascript
await token.balance('0xb0252f13850a4823706607524de0b146820F2240') // BigNumber {_hex: "0x0b896d5e9eeaabf4f1", _isBigNumber: true}
```

this also works for the native token of the given blockchain:

```javascript
await token.balance('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE') // BigNumber {_hex: "0x0b896d5e9eeaabf4f1", _isBigNumber: true}
```

### BigNumber

Provides the BigNumber amount for a given token (based on the tokens decimals) based on a human readable amount:

```javascript
let token = new Token({
  blockchain: 'ethereum',
  address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb'
}) 

token.BigNumber(1) // BigNumber '1000000000000000000'
```

```javascript
Token.BigNumber({
  amount: 1,
  blockchain: 'ethereum',
  address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb'
}) // BigNumber '1000000000000000000'
```

### Token Standards

`depay-blockchain-token` exports standard token apis, like `ERC20`, `BEP20` etc.:

```javascript
import { ERC20 } from 'depay-blockchain-token'
```

## Development

### Get started

```
yarn install
yarn dev
```

### Release

```
npm publish
```
