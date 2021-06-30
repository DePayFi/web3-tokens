(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('depay-blockchain-constants'), require('depay-blockchain-call'), require('ethers')) :
  typeof define === 'function' && define.amd ? define(['exports', 'depay-blockchain-constants', 'depay-blockchain-call', 'ethers'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.BlockchainToken = {}, global.CONSTANTS, global.BlockchainCall, global.ethers));
}(this, (function (exports, CONSTANTS, depayBlockchainCall, ethers) { 'use strict';

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

    callBasics() {
      return {
        blockchain: 'ethereum',
        address: this.address,
        api: ERC20,
      }
    }

    async decimals() {
      if(this.address == CONSTANTS__default['default'][this.blockchain].NATIVE) {
        return CONSTANTS__default['default'][this.blockchain].DECIMALS
      }
      return await depayBlockchainCall.call({
        ...this.callBasics(),
        method: 'decimals',
        cache: 86400000, // 1 day
      })
    }

    async symbol() {
      if(this.address == CONSTANTS__default['default'][this.blockchain].NATIVE) {
        return CONSTANTS__default['default'][this.blockchain].SYMBOL
      }
      return await depayBlockchainCall.call({
        ...this.callBasics(),
        method: 'symbol',
        cache: 86400000, // 1 day
      })
    }

    async name() {
      if(this.address == CONSTANTS__default['default'][this.blockchain].NATIVE) {
        return CONSTANTS__default['default'][this.blockchain].NAME
      }
      return await depayBlockchainCall.call({
        ...this.callBasics(),
        method: 'name',
        cache: 86400000, // 1 day
      })
    }
  }

  Token.BigNumber = async ({ amount, blockchain, address }) => {
    let token = new Token({ blockchain, address });
    let decimals = await token.decimals();
    return ethers.ethers.BigNumber.from(amount).mul(ethers.ethers.BigNumber.from(10).pow(decimals))
  };

  exports.Token = Token;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
