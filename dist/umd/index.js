(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('depay-blockchain-constants'), require('depay-blockchain-client'), require('ethers')) :
  typeof define === 'function' && define.amd ? define(['exports', 'depay-blockchain-constants', 'depay-blockchain-client', 'ethers'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.BlockchainToken = {}, global.BlockchainConstants, global.BlockchainClient, global.ethers));
}(this, (function (exports, CONSTANTS, depayBlockchainClient, ethers) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var CONSTANTS__default = /*#__PURE__*/_interopDefaultLegacy(CONSTANTS);

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
      this.address = ethers.ethers.utils.getAddress(address);
    }

    async decimals() {
      if (this.address == CONSTANTS__default['default'][this.blockchain].NATIVE) {
        return CONSTANTS__default['default'][this.blockchain].DECIMALS
      }
      return await depayBlockchainClient.request(['ethereum://', this.address, '/decimals'].join(''), {
        api: ERC20,
        cache: 86400000, // 1 day
      })
    }

    async symbol() {
      if (this.address == CONSTANTS__default['default'][this.blockchain].NATIVE) {
        return CONSTANTS__default['default'][this.blockchain].SYMBOL
      }
      return await depayBlockchainClient.request(['ethereum://', this.address, '/symbol'].join(''), {
        api: ERC20,
        cache: 86400000, // 1 day
      })
    }

    async name() {
      if (this.address == CONSTANTS__default['default'][this.blockchain].NATIVE) {
        return CONSTANTS__default['default'][this.blockchain].NAME
      }
      return await depayBlockchainClient.request(['ethereum://', this.address, '/name'].join(''), {
        api: ERC20,
        cache: 86400000, // 1 day
      })
    }

    transferable() {
      return new Promise(async (resolve, reject) => {
        if (this.address == CONSTANTS__default['default'][this.blockchain].NATIVE) {
          resolve(true);
        }
        let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        let provider = new ethers.ethers.providers.Web3Provider(window.ethereum);
        let signer = provider.getSigner();
        let contract = new ethers.ethers.Contract(this.address, ERC20, provider);
        let estimate = contract
          .connect(signer)
          .estimateGas.transfer(accounts[0], '1')
          .then(() => resolve(true))
          .catch(() => resolve(false));
      })
    }

    async balance(account) {
      if (this.address == CONSTANTS__default['default'][this.blockchain].NATIVE) {
        return await depayBlockchainClient.request(['ethereum://', account, '/balance'].join(''), {
          cache: 30000, // 30 seconds
        })
      } else {
        return await depayBlockchainClient.request(['ethereum://', this.address, '/balanceOf'].join(''), {
          api: ERC20,
          params: [account],
          cache: 30000, // 30 seconds
        })
      }
    }

    async BigNumber(amount) {
      let decimals = await this.decimals();
      return ethers.ethers.BigNumber.from(amount).mul(ethers.ethers.BigNumber.from(10).pow(decimals))
    }
  }

  Token.BigNumber = async ({ amount, blockchain, address }) => {
    let token = new Token({ blockchain, address });
    return token.BigNumber(amount)
  };

  exports.ERC20 = ERC20;
  exports.Token = Token;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
