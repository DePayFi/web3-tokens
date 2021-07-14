import CONSTANTS from 'depay-blockchain-constants';
import { request } from 'depay-blockchain-client';
import { ethers } from 'ethers';

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

class Token {
  constructor({ blockchain, address }) {
    this.blockchain = blockchain;
    this.address = ethers.utils.getAddress(address);
  }

  async decimals() {
    if (this.address == CONSTANTS[this.blockchain].NATIVE) {
      return CONSTANTS[this.blockchain].DECIMALS
    }
    return await request(['ethereum://', this.address, '/decimals'].join(''), {
      api: ERC20,
      cache: 86400000, // 1 day
    })
  }

  async symbol() {
    if (this.address == CONSTANTS[this.blockchain].NATIVE) {
      return CONSTANTS[this.blockchain].SYMBOL
    }
    return await request(['ethereum://', this.address, '/symbol'].join(''), {
      api: ERC20,
      cache: 86400000, // 1 day
    })
  }

  async name() {
    if (this.address == CONSTANTS[this.blockchain].NATIVE) {
      return CONSTANTS[this.blockchain].NAME
    }
    return await request(['ethereum://', this.address, '/name'].join(''), {
      api: ERC20,
      cache: 86400000, // 1 day
    })
  }

  transferable() {
    return new Promise(async (resolve, reject) => {
      if (this.address == CONSTANTS[this.blockchain].NATIVE) {
        resolve(true);
      }
      let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let signer = provider.getSigner();
      let contract = new ethers.Contract(this.address, ERC20, provider);
      let estimate = contract
        .connect(signer)
        .estimateGas.transfer(accounts[0], '1')
        .then(() => resolve(true))
        .catch(() => resolve(false));
    })
  }

  async balance(account) {
    if (this.address == CONSTANTS[this.blockchain].NATIVE) {
      return await request(['ethereum://', account, '/balance'].join(''), {
        cache: 30000, // 30 seconds
      })
    } else {
      return await request(['ethereum://', this.address, '/balanceOf'].join(''), {
        api: ERC20,
        params: [account],
        cache: 30000, // 30 seconds
      })
    }
  }

  async BigNumber(amount) {
    let decimals = await this.decimals();
    return ethers.BigNumber.from(amount).mul(ethers.BigNumber.from(10).pow(decimals))
  }
}

Token.BigNumber = async ({ amount, blockchain, address }) => {
  let token = new Token({ blockchain, address });
  return token.BigNumber(amount)
};

export { ERC20, Token };
