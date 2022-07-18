import { request } from '@depay/web3-client';
import { CONSTANTS } from '@depay/web3-constants';
import { ethers } from 'ethers';
import { struct, u32, publicKey, u64, u8, bool, rustEnum, str, u16, option, vec, PublicKey, Buffer } from '@depay/solana-web3.js';

var allowanceOnEVM = ({ blockchain, address, api, owner, spender })=>{
  return request(
    {
      blockchain,
      address,
      api,
      method: 'allowance',
      params: [owner, spender],
      cache: 5000, // 5 seconds
    },
  )
};

var balanceOnEVM = async ({ blockchain, address, account, api })=>{
  if (address == CONSTANTS[blockchain].NATIVE) {
    return await request(
      {
        blockchain: blockchain,
        address: account,
        method: 'balance',
        cache: 10000, // 10 seconds
      },
    )
  } else {
    return await request(
      {
        blockchain: blockchain,
        address: address,
        method: 'balanceOf',
        api,
        params: [account],
        cache: 10000, // 10 seconds
      },
    )
  }
};

var balanceOnSolana = async ({ blockchain, address, account, api })=>{

  if(address == CONSTANTS[blockchain].NATIVE) {

     return ethers.BigNumber.from(await request(`solana://${account}/balance`))

  } else {

    let filters = [
      { dataSize: 165 },
      { memcmp: { offset: 32, bytes: account }},
      { memcmp: { offset: 0, bytes: address }}
    ];

    let tokenAccounts  = await request(`solana://TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA/getProgramAccounts`, { params: { filters } });

    let totalBalance = ethers.BigNumber.from('0');

    await Promise.all(tokenAccounts.map((tokenAccount)=>{
      return request(`solana://${tokenAccount.pubkey.toString()}/getTokenAccountBalance`)
    })).then((balances)=>{
      balances.forEach((balance)=>{
        totalBalance = totalBalance.add(ethers.BigNumber.from(balance.value.amount));
      });
    });

    return totalBalance
  }
};

var BEP20 = [
  {
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "subtractedValue",
        "type": "uint256"
      }
    ],
    "name": "decreaseAllowance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getOwner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "addedValue",
        "type": "uint256"
      }
    ],
    "name": "increaseAllowance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "mint",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

var decimalsOnEVM = ({ blockchain, address, api })=>{
  return request({
    blockchain,
    address,
    api,
    method: 'decimals',
    cache: 86400000, // 1 day
  })
};

const MINT_LAYOUT = struct([
  u32('mintAuthorityOption'),
  publicKey('mintAuthority'),
  u64('supply'),
  u8('decimals'),
  bool('isInitialized'),
  u32('freezeAuthorityOption'),
  publicKey('freezeAuthority')
]);

const KEY_LAYOUT = rustEnum([
  struct([], 'uninitialized'),
  struct([], 'editionV1'),
  struct([], 'masterEditionV1'),
  struct([], 'reservationListV1'),
  struct([], 'metadataV1'),
  struct([], 'reservationListV2'),
  struct([], 'masterEditionV2'),
  struct([], 'editionMarker'),
]);

const CREATOR_LAYOUT = struct([
  publicKey('address'),
  bool('verified'),
  u8('share'),
]);

const DATA_LAYOUT = struct([
  str('name'),
  str('symbol'),
  str('uri'),
  u16('sellerFeeBasisPoints'),
  option(
    vec(
      CREATOR_LAYOUT.replicate('creators')
    ),
    'creators'
  )
]);

const METADATA_LAYOUT = struct([
  KEY_LAYOUT.replicate('key'),
  publicKey('updateAuthority'),
  publicKey('mint'),
  DATA_LAYOUT.replicate('data'),
  bool('primarySaleHappened'),
  bool('isMutable'),
  option(u8(), 'editionNonce'),
]);

var decimalsOnSolana = async ({ blockchain, address })=>{
  let data = await request({ blockchain, address, api: MINT_LAYOUT });
  return data.decimals
};

var ERC20 = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_from', type: 'address' },
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  { payable: true, stateMutability: 'payable', type: 'fallback' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'owner', type: 'address' },
      { indexed: true, name: 'spender', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
];

var ERC20onPolygon = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_from', type: 'address' },
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  { payable: true, stateMutability: 'payable', type: 'fallback' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'owner', type: 'address' },
      { indexed: true, name: 'spender', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event'
  },
];

var nameOnEVM = ({ blockchain, address, api })=>{
  return request(
    {
      blockchain: blockchain,
      address: address,
      api,
      method: 'name',
      cache: 86400000, // 1 day
    },
  )
};

function _optionalChain$2(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
const METADATA_ACCOUNT = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s';

const METADATA_REPLACE = new RegExp('\u0000', 'g');

const getMetaDataPDA = async ({ metaDataPublicKey, mintPublicKey }) => {
  let seed = [
    Buffer.from('metadata'),
    metaDataPublicKey.toBuffer(),
    mintPublicKey.toBuffer()  
  ];

  return (await PublicKey.findProgramAddress(seed, metaDataPublicKey))[0]
};

const getMetaData = async ({ blockchain, address })=> {

  let mintPublicKey = new PublicKey(address);
  let metaDataPublicKey = new PublicKey(METADATA_ACCOUNT);
  let tokenMetaDataPublicKey = await getMetaDataPDA({ metaDataPublicKey, mintPublicKey });

  let metaData = await request({
    blockchain, 
    address: tokenMetaDataPublicKey.toString(),
    api: METADATA_LAYOUT,
    cache: 86400000, // 1 day
  });

  return {
    name: _optionalChain$2([metaData, 'optionalAccess', _ => _.data, 'optionalAccess', _2 => _2.name, 'optionalAccess', _3 => _3.replace, 'call', _4 => _4(METADATA_REPLACE, '')]),
    symbol: _optionalChain$2([metaData, 'optionalAccess', _5 => _5.data, 'optionalAccess', _6 => _6.symbol, 'optionalAccess', _7 => _7.replace, 'call', _8 => _8(METADATA_REPLACE, '')])
  }
};

function _optionalChain$1(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
var nameOnSolana = async ({ blockchain, address })=>{
  let metaData = await getMetaData({ blockchain, address });
  return _optionalChain$1([metaData, 'optionalAccess', _ => _.name])
};

var symbolOnEVM = ({ blockchain, address, api })=>{
  return request(
    {
      blockchain,
      address,
      api,
      method: 'symbol',
      cache: 86400000, // 1 day
    }
  )
};

function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
var symbolOnSolana = async ({ blockchain, address })=>{
  let metaData = await getMetaData({ blockchain, address });
  return _optionalChain([metaData, 'optionalAccess', _ => _.symbol])
};

let supported = ['ethereum', 'bsc', 'polygon', 'solana'];
supported.evm = ['ethereum', 'bsc', 'polygon'];
supported.solana = ['solana'];

class Token {
  
  constructor({ blockchain, address }) {
    this.blockchain = blockchain;
    if(supported.evm.includes(this.blockchain)) {
      this.address = ethers.utils.getAddress(address);
    } else if(supported.solana.includes(this.blockchain)) {
      this.address = address;
    }
  }

  async decimals() {
    if (this.address == CONSTANTS[this.blockchain].NATIVE) {
      return CONSTANTS[this.blockchain].DECIMALS
    }
    let decimals;
    try {
      if(supported.evm.includes(this.blockchain)) {
        decimals = await decimalsOnEVM({ blockchain: this.blockchain, address: this.address, api: Token[this.blockchain].DEFAULT });
      } else if(supported.solana.includes(this.blockchain)) {
        decimals = await decimalsOnSolana({ blockchain: this.blockchain, address: this.address });
      }
    } catch (e) {}
    return decimals
  }

  async symbol() {
    if (this.address == CONSTANTS[this.blockchain].NATIVE) {
      return CONSTANTS[this.blockchain].SYMBOL
    }
    if(supported.evm.includes(this.blockchain)) {
      return await symbolOnEVM({ blockchain: this.blockchain, address: this.address, api: Token[this.blockchain].DEFAULT })
    } else if(supported.solana.includes(this.blockchain)) {
      return await symbolOnSolana({ blockchain: this.blockchain, address: this.address })
    }
  }

  async name() {
    if (this.address == CONSTANTS[this.blockchain].NATIVE) {
      return CONSTANTS[this.blockchain].CURRENCY
    }
    if(supported.evm.includes(this.blockchain)) {
      return await nameOnEVM({ blockchain: this.blockchain, address: this.address, api: Token[this.blockchain].DEFAULT })
    } else if(supported.solana.includes(this.blockchain)) {
      return await nameOnSolana({ blockchain: this.blockchain, address: this.address })
    }
  }

  async balance(account) {
    if(supported.evm.includes(this.blockchain)) {
      return await balanceOnEVM({ blockchain: this.blockchain, account, address: this.address, api: Token[this.blockchain].DEFAULT })
    } else if(supported.solana.includes(this.blockchain)) {
      return await balanceOnSolana({ blockchain: this.blockchain, account, address: this.address, api: Token[this.blockchain].DEFAULT })
    }
  }

  async allowance(owner, spender) {
    if (this.address == CONSTANTS[this.blockchain].NATIVE) {
      return ethers.BigNumber.from(CONSTANTS[this.blockchain].MAXINT)
    }
    if(supported.evm.includes(this.blockchain)) {
      return await allowanceOnEVM({ blockchain: this.blockchain, address: this.address, api: Token[this.blockchain].DEFAULT, owner, spender })
    } else if(supported.solana.includes(this.blockchain)) {
      return ethers.BigNumber.from(CONSTANTS[this.blockchain].MAXINT)
    } 
  }

  async BigNumber(amount) {
    let decimals = await this.decimals();
    return ethers.utils.parseUnits(
      Token.safeAmount({ amount: parseFloat(amount), decimals }).toString(),
      decimals
    )
  }

  async readable(amount) {
    let decimals = await this.decimals();
    let readable = ethers.utils.formatUnits(amount.toString(), decimals);
    readable = readable.replace(/0+$/, '');
    readable = readable.replace(/\.$/, '');
    return readable
  }
}

Token.BigNumber = async ({ amount, blockchain, address }) => {
  let token = new Token({ blockchain, address });
  return token.BigNumber(amount)
};

Token.readable = async ({ amount, blockchain, address }) => {
  let token = new Token({ blockchain, address });
  return token.readable(amount)
};

Token.safeAmount = ({ amount, decimals }) => {
  return parseFloat(amount.toFixed(decimals))
};

Token.ethereum = { 
  DEFAULT: ERC20,
  ERC20
};

Token.bsc = { 
  DEFAULT: BEP20,
  BEP20
};

Token.polygon = { 
  DEFAULT: ERC20onPolygon,
  ERC20: ERC20onPolygon
};

Token.solana = { 
  MINT_LAYOUT,
  METADATA_LAYOUT,
  METADATA_ACCOUNT,
};

export { Token };
