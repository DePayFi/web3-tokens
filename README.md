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

expect(token.address).toEqual('0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb')
expect(await token.decimals()).toEqual(18)
expect(await token.symbol()).toEqual('DEPAY')
expect(await token.name()).toEqual('DePay')
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

### BigNumber

Provides the BigNumber amount for a given token (based on the tokens decimals) based on a humand readable amount:

```javascript
Token.BigNumber({
  amount: 1,
  blockchain: 'ethereum',
  address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb'
}) // BigNumber '1000000000000000000'
```

## Development

### Get started

```
yarn install
yarn start
```

### Release

```
npm publish
```
