(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@depay/web3-client'), require('@depay/web3-constants'), require('ethers'), require('@depay/solana-web3.js')) :
  typeof define === 'function' && define.amd ? define(['exports', '@depay/web3-client', '@depay/web3-constants', 'ethers', '@depay/solana-web3.js'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Web3Tokens = {}, global.Web3Client, global.Web3Constants, global.ethers, global.SolanaWeb3js));
}(this, (function (exports, web3Client, web3Constants, ethers, solanaWeb3_js) { 'use strict';

  var allowanceOnEVM = ({ blockchain, address, api, owner, spender })=>{
    return web3Client.request(
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
      return await web3Client.request(
        {
          blockchain: blockchain,
          address: account,
          method: 'balance',
          cache: 10000, // 10 seconds
        },
      )
    } else {
      return await web3Client.request(
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

    if(address == web3Constants.CONSTANTS[blockchain].NATIVE) {

       return ethers.ethers.BigNumber.from(await web3Client.request(`solana://${account}/balance`))

    } else {

      let filters = [
        { dataSize: 165 },
        { memcmp: { offset: 32, bytes: account }},
        { memcmp: { offset: 0, bytes: address }}
      ];

      let tokenAccounts  = await web3Client.request(`solana://TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA/getProgramAccounts`, { params: { filters } });

      let totalBalance = ethers.ethers.BigNumber.from('0');

      await Promise.all(tokenAccounts.map((tokenAccount)=>{
        return web3Client.request(`solana://${tokenAccount.pubkey.toString()}/getTokenAccountBalance`)
      })).then((balances)=>{
        balances.forEach((balance)=>{
          totalBalance = totalBalance.add(ethers.ethers.BigNumber.from(balance.value.amount));
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

  const TOKEN_PROGRAM = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
  const ASSOCIATED_TOKEN_PROGRAM = 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';

  function _optionalChain$3(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  var findProgramAddress = async ({ token, owner })=>{

    const [address] = await solanaWeb3_js.PublicKey.findProgramAddress(
      [
        (new solanaWeb3_js.PublicKey(owner)).toBuffer(),
        (new solanaWeb3_js.PublicKey(TOKEN_PROGRAM)).toBuffer(),
        (new solanaWeb3_js.PublicKey(token)).toBuffer()
      ],
      new solanaWeb3_js.PublicKey(ASSOCIATED_TOKEN_PROGRAM)
    );

    let exists = await web3Client.provider('solana').getAccountInfo(address);

    if(exists) {
      return _optionalChain$3([address, 'optionalAccess', _ => _.toString, 'call', _2 => _2()])
    }
  };

  const MINT_LAYOUT = solanaWeb3_js.struct([
    solanaWeb3_js.u32('mintAuthorityOption'),
    solanaWeb3_js.publicKey('mintAuthority'),
    solanaWeb3_js.u64('supply'),
    solanaWeb3_js.u8('decimals'),
    solanaWeb3_js.bool('isInitialized'),
    solanaWeb3_js.u32('freezeAuthorityOption'),
    solanaWeb3_js.publicKey('freezeAuthority')
  ]);

  const KEY_LAYOUT = solanaWeb3_js.rustEnum([
    solanaWeb3_js.struct([], 'uninitialized'),
    solanaWeb3_js.struct([], 'editionV1'),
    solanaWeb3_js.struct([], 'masterEditionV1'),
    solanaWeb3_js.struct([], 'reservationListV1'),
    solanaWeb3_js.struct([], 'metadataV1'),
    solanaWeb3_js.struct([], 'reservationListV2'),
    solanaWeb3_js.struct([], 'masterEditionV2'),
    solanaWeb3_js.struct([], 'editionMarker'),
  ]);

  const CREATOR_LAYOUT = solanaWeb3_js.struct([
    solanaWeb3_js.publicKey('address'),
    solanaWeb3_js.bool('verified'),
    solanaWeb3_js.u8('share'),
  ]);

  const DATA_LAYOUT = solanaWeb3_js.struct([
    solanaWeb3_js.str('name'),
    solanaWeb3_js.str('symbol'),
    solanaWeb3_js.str('uri'),
    solanaWeb3_js.u16('sellerFeeBasisPoints'),
    solanaWeb3_js.option(
      solanaWeb3_js.vec(
        CREATOR_LAYOUT.replicate('creators')
      ),
      'creators'
    )
  ]);

  const METADATA_LAYOUT = solanaWeb3_js.struct([
    KEY_LAYOUT.replicate('key'),
    solanaWeb3_js.publicKey('updateAuthority'),
    solanaWeb3_js.publicKey('mint'),
    DATA_LAYOUT.replicate('data'),
    solanaWeb3_js.bool('primarySaleHappened'),
    solanaWeb3_js.bool('isMutable'),
    solanaWeb3_js.option(solanaWeb3_js.u8(), 'editionNonce'),
  ]);

  const TRANSFER_LAYOUT = solanaWeb3_js.struct([
    solanaWeb3_js.u8('instruction'),
    solanaWeb3_js.u64('amount'),
  ]);

  var createTransferInstructions = async ({ token, amount, from, to })=>{

    let fromTokenAccount = await findProgramAddress({ token, owner: from });
    let toTokenAccount = await findProgramAddress({ token, owner: to });

    const keys = [
      { pubkey: new solanaWeb3_js.PublicKey(fromTokenAccount), isSigner: false, isWritable: true },
      { pubkey: new solanaWeb3_js.PublicKey(toTokenAccount), isSigner: false, isWritable: true },
      { pubkey: new solanaWeb3_js.PublicKey(from), isSigner: true, isWritable: false }
    ];

    const data = solanaWeb3_js.Buffer.alloc(TRANSFER_LAYOUT.span);
    TRANSFER_LAYOUT.encode({
      instruction: 3, // TRANSFER
      amount: new solanaWeb3_js.BN(amount)
    }, data);
    
    return [new solanaWeb3_js.TransactionInstruction({ keys, programId: new solanaWeb3_js.PublicKey(TOKEN_PROGRAM), data })]
  };

  var decimalsOnEVM = ({ blockchain, address, api })=>{
    return web3Client.request({
      blockchain,
      address,
      api,
      method: 'decimals',
      cache: 86400000, // 1 day
    })
  };

  var decimalsOnSolana = async ({ blockchain, address })=>{
    let data = await web3Client.request({ blockchain, address, api: MINT_LAYOUT });
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
    return web3Client.request(
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
      solanaWeb3_js.Buffer.from('metadata'),
      metaDataPublicKey.toBuffer(),
      mintPublicKey.toBuffer()  
    ];

    return (await solanaWeb3_js.PublicKey.findProgramAddress(seed, metaDataPublicKey))[0]
  };

  const getMetaData = async ({ blockchain, address })=> {

    let mintPublicKey = new solanaWeb3_js.PublicKey(address);
    let metaDataPublicKey = new solanaWeb3_js.PublicKey(METADATA_ACCOUNT);
    let tokenMetaDataPublicKey = await getMetaDataPDA({ metaDataPublicKey, mintPublicKey });

    let metaData = await web3Client.request({
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
    return web3Client.request(
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
        this.address = ethers.ethers.utils.getAddress(address);
      } else if(supported.solana.includes(this.blockchain)) {
        this.address = address;
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
        } else if(supported.solana.includes(this.blockchain)) {
          decimals = await decimalsOnSolana({ blockchain: this.blockchain, address: this.address });
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
      } else if(supported.solana.includes(this.blockchain)) {
        return await symbolOnSolana({ blockchain: this.blockchain, address: this.address })
      }
    }

    async name() {
      if (this.address == web3Constants.CONSTANTS[this.blockchain].NATIVE) {
        return web3Constants.CONSTANTS[this.blockchain].CURRENCY
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
      if (this.address == web3Constants.CONSTANTS[this.blockchain].NATIVE) {
        return ethers.ethers.BigNumber.from(web3Constants.CONSTANTS[this.blockchain].MAXINT)
      }
      if(supported.evm.includes(this.blockchain)) {
        return await allowanceOnEVM({ blockchain: this.blockchain, address: this.address, api: Token[this.blockchain].DEFAULT, owner, spender })
      } else if(supported.solana.includes(this.blockchain)) {
        return ethers.ethers.BigNumber.from(web3Constants.CONSTANTS[this.blockchain].MAXINT)
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

  Token.solana = {
    MINT_LAYOUT,
    METADATA_LAYOUT,
    TRANSFER_LAYOUT,
    METADATA_ACCOUNT,
    TOKEN_PROGRAM,
    ASSOCIATED_TOKEN_PROGRAM,
    findProgramAddress,
    createTransferInstructions,
  };

  exports.Token = Token;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
