(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@depay/web3-client-evm'), require('@depay/web3-constants'), require('ethers')) :
  typeof define === 'function' && define.amd ? define(['exports', '@depay/web3-client-evm', '@depay/web3-constants', 'ethers'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Web3Tokens = {}, global.Web3Client, global.Web3Constants, global.ethers));
})(this, (function (exports, web3ClientEvm, web3Constants, ethers) { 'use strict';

  var allowanceOnEVM = ({ blockchain, address, api, owner, spender })=>{
    return web3ClientEvm.request(
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
    if (address == web3Constants.CONSTANTS[blockchain].NATIVE) {
      return await web3ClientEvm.request(
        {
          blockchain: blockchain,
          address: account,
          method: 'balance',
          cache: 10000, // 10 seconds
        },
      )
    } else {
      return await web3ClientEvm.request(
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
    return web3ClientEvm.request({
      blockchain,
      address,
      api,
      method: 'decimals',
      cache: 86400000, // 1 day
    })
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
    return web3ClientEvm.request(
      {
        blockchain: blockchain,
        address: address,
        api,
        method: 'name',
        cache: 86400000, // 1 day
      },
    )
  };

  var symbolOnEVM = ({ blockchain, address, api })=>{
    return web3ClientEvm.request(
      {
        blockchain,
        address,
        api,
        method: 'symbol',
        cache: 86400000, // 1 day
      }
    )
  };

  var VRC20 = [{"name": "Approval", "type": "event", "inputs": [{"name": "src", "type": "address", "indexed": true, "internalType": "address"}, {"name": "guy", "type": "address", "indexed": true, "internalType": "address"}, {"name": "wad", "type": "uint256", "indexed": false, "internalType": "uint256"}], "anonymous": false}, {"name": "Deposit", "type": "event", "inputs": [{"name": "dst", "type": "address", "indexed": true, "internalType": "address"}, {"name": "wad", "type": "uint256", "indexed": false, "internalType": "uint256"}], "anonymous": false}, {"name": "Transfer", "type": "event", "inputs": [{"name": "src", "type": "address", "indexed": true, "internalType": "address"}, {"name": "dst", "type": "address", "indexed": true, "internalType": "address"}, {"name": "wad", "type": "uint256", "indexed": false, "internalType": "uint256"}], "anonymous": false}, {"name": "Withdrawal", "type": "event", "inputs": [{"name": "src", "type": "address", "indexed": true, "internalType": "address"}, {"name": "wad", "type": "uint256", "indexed": false, "internalType": "uint256"}], "anonymous": false}, {"type": "fallback", "stateMutability": "payable"}, {"name": "allowance", "type": "function", "inputs": [{"name": "", "type": "address", "internalType": "address"}, {"name": "", "type": "address", "internalType": "address"}], "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}], "stateMutability": "view"}, {"name": "approve", "type": "function", "inputs": [{"name": "guy", "type": "address", "internalType": "address"}, {"name": "wad", "type": "uint256", "internalType": "uint256"}], "outputs": [{"name": "", "type": "bool", "internalType": "bool"}], "stateMutability": "nonpayable"}, {"name": "balanceOf", "type": "function", "inputs": [{"name": "", "type": "address", "internalType": "address"}], "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}], "stateMutability": "view"}, {"name": "decimals", "type": "function", "inputs": [], "outputs": [{"name": "", "type": "uint8", "internalType": "uint8"}], "stateMutability": "view"}, {"name": "deposit", "type": "function", "inputs": [], "outputs": [], "stateMutability": "payable"}, {"name": "name", "type": "function", "inputs": [], "outputs": [{"name": "", "type": "string", "internalType": "string"}], "stateMutability": "view"}, {"name": "symbol", "type": "function", "inputs": [], "outputs": [{"name": "", "type": "string", "internalType": "string"}], "stateMutability": "view"}, {"name": "totalSupply", "type": "function", "inputs": [], "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}], "stateMutability": "view"}, {"name": "transfer", "type": "function", "inputs": [{"name": "dst", "type": "address", "internalType": "address"}, {"name": "wad", "type": "uint256", "internalType": "uint256"}], "outputs": [{"name": "", "type": "bool", "internalType": "bool"}], "stateMutability": "nonpayable"}, {"name": "transferFrom", "type": "function", "inputs": [{"name": "src", "type": "address", "internalType": "address"}, {"name": "dst", "type": "address", "internalType": "address"}, {"name": "wad", "type": "uint256", "internalType": "uint256"}], "outputs": [{"name": "", "type": "bool", "internalType": "bool"}], "stateMutability": "nonpayable"}, {"name": "withdraw", "type": "function", "inputs": [{"name": "wad", "type": "uint256", "internalType": "uint256"}], "outputs": [], "stateMutability": "nonpayable"}];

  let supported = ['ethereum', 'bsc', 'polygon'];
  supported.evm = ['ethereum', 'bsc', 'polygon'];
  supported.solana = [];

  class Token {
    
    constructor({ blockchain, address }) {
      this.blockchain = blockchain;
      if(supported.evm.includes(this.blockchain)) {
        this.address = ethers.ethers.utils.getAddress(address);
      }
    }

    async decimals() {
      if (this.address == web3Constants.CONSTANTS[this.blockchain].NATIVE) {
        return web3Constants.CONSTANTS[this.blockchain].DECIMALS
      }
      let decimals;
      try {
        if(supported.evm.includes(this.blockchain)) {
          decimals = await decimalsOnEVM({ blockchain: this.blockchain, address: this.address, api: Token[this.blockchain].DEFAULT });
        }
      } catch (e) {}
      return decimals
    }

    async symbol() {
      if (this.address == web3Constants.CONSTANTS[this.blockchain].NATIVE) {
        return web3Constants.CONSTANTS[this.blockchain].SYMBOL
      }
      if(supported.evm.includes(this.blockchain)) {
        return await symbolOnEVM({ blockchain: this.blockchain, address: this.address, api: Token[this.blockchain].DEFAULT })
      }
    }

    async name() {
      if (this.address == web3Constants.CONSTANTS[this.blockchain].NATIVE) {
        return web3Constants.CONSTANTS[this.blockchain].CURRENCY
      }
      if(supported.evm.includes(this.blockchain)) {
        return await nameOnEVM({ blockchain: this.blockchain, address: this.address, api: Token[this.blockchain].DEFAULT })
      }
    }

    async balance(account) {
      if(supported.evm.includes(this.blockchain)) {
        return await balanceOnEVM({ blockchain: this.blockchain, account, address: this.address, api: Token[this.blockchain].DEFAULT })
      }
    }

    async allowance(owner, spender) {
      if (this.address == web3Constants.CONSTANTS[this.blockchain].NATIVE) {
        return ethers.ethers.BigNumber.from(web3Constants.CONSTANTS[this.blockchain].MAXINT)
      }
      if(supported.evm.includes(this.blockchain)) {
        return await allowanceOnEVM({ blockchain: this.blockchain, address: this.address, api: Token[this.blockchain].DEFAULT, owner, spender })
      } 
    }

    async BigNumber(amount) {
      let decimals = await this.decimals();
      return ethers.ethers.utils.parseUnits(
        Token.safeAmount({ amount: parseFloat(amount), decimals }).toString(),
        decimals
      )
    }

    async readable(amount) {
      let decimals = await this.decimals();
      let readable = ethers.ethers.utils.formatUnits(amount.toString(), decimals);
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

  Token.velas = {
    DEFAULT: VRC20,
    VRC20
  };

  exports.Token = Token;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
