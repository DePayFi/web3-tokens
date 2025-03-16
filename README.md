## Quickstart

```
yarn add @depay/web3-tokens
```

or 

```
npm install --save @depay/web3-tokens
```

```javascript
import Token from '@depay/web3-tokens'

let token = new Token({
  blockchain: 'ethereum',
  address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb'
});

token.address // '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb'
await token.decimals() // 18
await token.symbol() // 'DEPAY'
await token.name() // 'DePay'
```

## Support

This library supports the following blockchains:

- [Ethereum](https://ethereum.org)
- [BNB Smart Chain](https://www.binance.org/smartChain)
- [Polygon](https://polygon.technology)
- [Solana](https://solana.com)
- [Fantom](https://fantom.foundation)
- [Arbitrum](https://arbitrum.io)
- [Avalanche](https://www.avax.network)
- [Gnosis](https://gnosis.io)
- [Optimism](https://www.optimism.io)
- [Base](https://base.org)
- [Worldchain](https://worldcoin.org/world-chain)

## Platform specific packaging

In case you want to use and package only specific platforms, use platform-specific packages:

### EVM (Ethereum Virtual Machine) specific packaging

```javascript
import Token from '@depay/web3-tokens-evm'
```

### SVM (Solana Virtual Machine) specific packaging

```javascript
import Token from '@depay/web3-tokens-solana'
```

## Functionalities

### initalize (new)

```javascript
import Token from '@depay/web3-tokens'

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

### name for NFT by id

Retrieves token name for token address by NFT id:

```javascript
await token.name({ id: '42745998150656004690816543961586238000273307462307754421658803578179357246440' }) // NFT Butler Lifetime License
```

### balance

Provides the balance (BigNumber) of the given account:

```javascript
await token.balance('0xb0252f13850a4823706607524de0b146820F2240') // BigNumber {_hex: "0x0b896d5e9eeaabf4f1", _isBigNumber: true}
```

this also works for the native token of the given blockchain:

```javascript
let token = new Token({ ..., address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' })
await token.balance('0xb0252f13850a4823706607524de0b146820F2240') // BigNumber {_hex: "0x0b896d5e9eeaabf4f1", _isBigNumber: true}
```

#### balance for NFTs (by id)

If you pass a second parameter, it will be used to get the balance for the given account for the given token id:

```javascript
await token.balance('0xb0252f13850a4823706607524de0b146820F2240', '42745998150656004690816543961586238000273307462307754421658803578179357246440')
```

### BigNumber

Provides the BigNumber amount for a given token (based on the tokens decimals) based on a human readable amount:

```javascript
let token = new Token({
  blockchain: 'ethereum',
  address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb'
}) 

await token.BigNumber(1) // BigNumber '1000000000000000000'
```

```javascript
await Token.BigNumber({
  amount: 1,
  blockchain: 'ethereum',
  address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb'
}) // BigNumber '1000000000000000000'
```

### readable

Provides a human readable amount based on a given BigInt number.

- Ending zeros will be eliminated `1.30000` -> `1.3`

- Decimals are dropped if there are none `1.00000` -> `1`

```javascript
await Token.readable({
  amount: '1231211111210000000',
  blockchain: 'ethereum',
  address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb'
}) // "1.23121111121"
```

```javascript
let token = new Token({
  blockchain: 'ethereum',
  address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb'
})

await token.readable('1231211111210000000') // "1.23121111121"
```

### Token Standards

#### EVM: Token Standards

```javascript
import Token from '@depay/web3-tokens'

Token.ethereum['20'] // [...] <XYZ>20 standard
Token.bsc['20'] // [...] <XYZ>20 standard

Token.ethereum.ERC20 // [...] ERC20 ABI
Token.bsc.BEP20 // [...] BEP20 ABI

Token.ethereum.WRAPPED // [...] WETH ABI
Token.bsc.WRAPPED // [...] WETH ABI

```

`DEFAULT` references the broad default token standard on the respective blockchain:

```javascript
import Token from '@depay/web3-tokens'

Token.ethereum.DEFAULT // ERC20
Token.bsc.DEFAULT // BEP20

Token[blockchain].DEFAULT
```

#### Solana: Token Standards, Constants, Layouts and helper methods

```javascript
import Token from '@depay/web3-tokens'

Token.solana
// MINT_LAYOUT,
// METADATA_LAYOUT,
// TRANSFER_LAYOUT,
// METADATA_ACCOUNT,
// TOKEN_PROGRAM,
// ASSOCIATED_TOKEN_PROGRAM,
// findProgramAddress({ token, owner })
// findAccount({ token, owner })
// async createTransferInstruction({ token, amount, from, to })
// async createAssociatedTokenAccountInstruction({ token, owner, payer })
// initializeAccountInstruction({ account, token, owner })
// closeAccountInstruction({ account, owner })
// getMetaData
// getMetaDataPDA
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
