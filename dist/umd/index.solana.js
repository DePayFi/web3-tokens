(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@depay/solana-web3.js'), require('@depay/web3-blockchains'), require('ethers')) :
  typeof define === 'function' && define.amd ? define(['exports', '@depay/solana-web3.js', '@depay/web3-blockchains', 'ethers'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Web3Tokens = {}, global.SolanaWeb3js, global.Web3Blockchains, global.ethers));
})(this, (function (exports, solanaWeb3_js, Blockchains, ethers) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var Blockchains__default = /*#__PURE__*/_interopDefaultLegacy(Blockchains);

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

    return _optionalChain$3([address, 'optionalAccess', _ => _.toString, 'call', _2 => _2()])
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

  const TOKEN_LAYOUT = solanaWeb3_js.struct([
    solanaWeb3_js.publicKey('mint'),
    solanaWeb3_js.publicKey('owner'),
    solanaWeb3_js.u64('amount'),
    solanaWeb3_js.u32('delegateOption'),
    solanaWeb3_js.publicKey('delegate'),
    solanaWeb3_js.u8('state'),
    solanaWeb3_js.u32('isNativeOption'),
    solanaWeb3_js.u64('isNative'),
    solanaWeb3_js.u64('delegatedAmount'),
    solanaWeb3_js.u32('closeAuthorityOption'),
    solanaWeb3_js.publicKey('closeAuthority')
  ]);

  const INITIALIZE_LAYOUT = solanaWeb3_js.struct([
    solanaWeb3_js.u8('instruction'),
    solanaWeb3_js.publicKey('owner')
  ]);

  const CLOSE_LAYOUT = solanaWeb3_js.struct([
    solanaWeb3_js.u8('instruction')
  ]);

  const createTransferInstruction = async ({ token, amount, from, to })=>{

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
    
    return new solanaWeb3_js.TransactionInstruction({ 
      keys,
      programId: new solanaWeb3_js.PublicKey(TOKEN_PROGRAM),
      data 
    })
  };

  const createAssociatedTokenAccountInstruction = async ({ token, owner, payer }) => {

    let associatedToken = await findProgramAddress({ token, owner });

    const keys = [
      { pubkey: new solanaWeb3_js.PublicKey(payer), isSigner: true, isWritable: true },
      { pubkey: new solanaWeb3_js.PublicKey(associatedToken), isSigner: false, isWritable: true },
      { pubkey: new solanaWeb3_js.PublicKey(owner), isSigner: false, isWritable: false },
      { pubkey: new solanaWeb3_js.PublicKey(token), isSigner: false, isWritable: false },
      { pubkey: solanaWeb3_js.SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: new solanaWeb3_js.PublicKey(TOKEN_PROGRAM), isSigner: false, isWritable: false },
    ];

   return new solanaWeb3_js.TransactionInstruction({
      keys,
      programId: ASSOCIATED_TOKEN_PROGRAM,
      data: solanaWeb3_js.Buffer.alloc(0)
    })
  };

  const initializeAccountInstruction = ({ account, token, owner })=>{

    const keys = [
      { pubkey: new solanaWeb3_js.PublicKey(account), isSigner: false, isWritable: true },
      { pubkey: new solanaWeb3_js.PublicKey(token), isSigner: false, isWritable: false },
    ];

    const data = solanaWeb3_js.Buffer.alloc(INITIALIZE_LAYOUT.span);
    INITIALIZE_LAYOUT.encode({
      instruction: 18, // InitializeAccount3
      owner: new solanaWeb3_js.PublicKey(owner)
    }, data);
    
    return new solanaWeb3_js.TransactionInstruction({ keys, programId: new solanaWeb3_js.PublicKey(TOKEN_PROGRAM), data })
  };


  const closeAccountInstruction = ({ account, owner })=>{

    const keys = [
      { pubkey: new solanaWeb3_js.PublicKey(account), isSigner: false, isWritable: true },
      { pubkey: new solanaWeb3_js.PublicKey(owner), isSigner: false, isWritable: true },
      { pubkey: new solanaWeb3_js.PublicKey(owner), isSigner: true, isWritable: false }
    ];

    const data = solanaWeb3_js.Buffer.alloc(CLOSE_LAYOUT.span);
    CLOSE_LAYOUT.encode({
      instruction: 9 // CloseAccount
    }, data);

    return new solanaWeb3_js.TransactionInstruction({ keys, programId: new solanaWeb3_js.PublicKey(TOKEN_PROGRAM), data })
  };

  var instructions = /*#__PURE__*/Object.freeze({
    __proto__: null,
    createTransferInstruction: createTransferInstruction,
    createAssociatedTokenAccountInstruction: createAssociatedTokenAccountInstruction,
    initializeAccountInstruction: initializeAccountInstruction,
    closeAccountInstruction: closeAccountInstruction
  });

  const BATCH_INTERVAL = 10;
  const CHUNK_SIZE = 99;

  class StaticJsonRpcBatchProvider extends ethers.ethers.providers.JsonRpcProvider {

    constructor(url, network, endpoints) {
      super(url);
      this._network = network;
      this._endpoint = url;
      this._endpoints = endpoints;
    }

    detectNetwork() {
      return Promise.resolve(Blockchains__default["default"].findByName(this._network).id)
    }

    requestChunk(chunk, endpoint) {
      
      const request = chunk.map((inflight) => inflight.request);

      return ethers.ethers.utils.fetchJson(endpoint, JSON.stringify(request))
        .then((result) => {
          // For each result, feed it to the correct Promise, depending
          // on whether it was a success or error
          chunk.forEach((inflightRequest, index) => {
            const payload = result[index];
            if (payload.error) {
              const error = new Error(payload.error.message);
              error.code = payload.error.code;
              error.data = payload.error.data;
              inflightRequest.reject(error);
            }
            else {
              inflightRequest.resolve(payload.result);
            }
          });
        }).catch((error) => {
          if(error && error.code == 'SERVER_ERROR') {
            const index = this._endpoints.indexOf(this._endpoint)+1;
            this._endpoint = index >= this._endpoints.length ? this._endpoints[0] : this._endpoints[index];
            this.requestChunk(chunk, this._endpoint);
          } else {
            chunk.forEach((inflightRequest) => {
              inflightRequest.reject(error);
            });
          }
        })
    }
      
    send(method, params) {

      const request = {
        method: method,
        params: params,
        id: (this._nextId++),
        jsonrpc: "2.0"
      };

      if (this._pendingBatch == null) {
        this._pendingBatch = [];
      }

      const inflightRequest = { request, resolve: null, reject: null };

      const promise = new Promise((resolve, reject) => {
        inflightRequest.resolve = resolve;
        inflightRequest.reject = reject;
      });

      this._pendingBatch.push(inflightRequest);

      if (!this._pendingBatchAggregator) {
        // Schedule batch for next event loop + short duration
        this._pendingBatchAggregator = setTimeout(() => {
          // Get the current batch and clear it, so new requests
          // go into the next batch
          const batch = this._pendingBatch;
          this._pendingBatch = null;
          this._pendingBatchAggregator = null;
          // Prepare Chunks of CHUNK_SIZE
          const chunks = [];
          for (let i = 0; i < Math.ceil(batch.length / CHUNK_SIZE); i++) {
            chunks[i] = batch.slice(i*CHUNK_SIZE, (i+1)*CHUNK_SIZE);
          }
          chunks.forEach((chunk)=>{
            // Get the request as an array of requests
            chunk.map((inflight) => inflight.request);
            return this.requestChunk(chunk, this._endpoint)
          });
        }, BATCH_INTERVAL);
      }

      return promise
    }

  }

  let _window;

  let getWindow = () => {
    if(_window) { return _window }
    if (typeof global == 'object') {
      _window = global;
    } else {
      _window = window;
    }
    return _window
  };

  // MAKE SURE PROVIDER SUPPORT BATCH SIZE OF 99 BATCH REQUESTS!
  const ENDPOINTS$1 = {
    ethereum: ['https://rpc.ankr.com/eth', 'https://eth.llamarpc.com', 'https://ethereum.publicnode.com'],
    bsc: ['https://bsc-dataseed.binance.org', 'https://bsc-dataseed1.ninicoin.io', 'https://bsc-dataseed3.defibit.io'],
    polygon: ['https://polygon-rpc.com', 'https://poly-rpc.gateway.pokt.network', 'https://matic-mainnet.chainstacklabs.com'],
    fantom: ['https://fantom.blockpi.network/v1/rpc/public', 'https://rpcapi.fantom.network', 'https://rpc.ftm.tools'],
    velas: ['https://mainnet.velas.com/rpc', 'https://evmexplorer.velas.com/rpc', 'https://explorer.velas.com/rpc'],
  };

  const getProviders$1 = ()=> {
    if(getWindow()._clientProviders == undefined) {
      getWindow()._clientProviders = {};
    }
    return getWindow()._clientProviders
  };

  const setProvider$2 = (blockchain, provider)=> {
    getProviders$1()[blockchain] = provider;
  };

  const setProviderEndpoints$2 = async (blockchain, endpoints)=> {
    
    let endpoint;
    let window = getWindow();

    if(
      window.fetch == undefined ||
      (typeof process != 'undefined' && process['env'] && process['env']['NODE_ENV'] == 'test') ||
      (typeof window.cy != 'undefined')
    ) {
      endpoint = endpoints[0];
    } else {
      
      let responseTimes = await Promise.all(endpoints.map((endpoint)=>{
        return new Promise(async (resolve)=>{
          let timeout = 900;
          let before = new Date().getTime();
          setTimeout(()=>resolve(timeout), timeout);
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ method: 'net_version', id: 1, jsonrpc: '2.0' })
          });
          if(!response.ok) { return resolve(999) }
          let after = new Date().getTime();
          resolve(after-before);
        })
      }));

      const fastestResponse = Math.min(...responseTimes);
      const fastestIndex = responseTimes.indexOf(fastestResponse);
      endpoint = endpoints[fastestIndex];
    }
    
    setProvider$2(
      blockchain,
      new StaticJsonRpcBatchProvider(endpoint, blockchain, endpoints)
    );
  };

  const getProvider$2 = async (blockchain)=> {

    let providers = getProviders$1();
    if(providers && providers[blockchain]){ return providers[blockchain] }
    
    let window = getWindow();
    if(window._getProviderPromise && window._getProviderPromise[blockchain]) { return await window._getProviderPromise[blockchain] }

    if(!window._getProviderPromise){ window._getProviderPromise = {}; }
    window._getProviderPromise[blockchain] = new Promise(async(resolve)=> {
      await setProviderEndpoints$2(blockchain, ENDPOINTS$1[blockchain]);
      resolve(getWindow()._clientProviders[blockchain]);
    });

    return await window._getProviderPromise[blockchain]
  };

  var EVM = {
    getProvider: getProvider$2,
    setProviderEndpoints: setProviderEndpoints$2,
    setProvider: setProvider$2,
  };

  class StaticJsonRpcSequentialProvider extends solanaWeb3_js.Connection {

    constructor(url, network, endpoints) {
      super(url);
      this._network = network;
      this._endpoint = url;
      this._endpoints = endpoints;
    }
  }

  const ENDPOINTS = {
    solana: ['https://solana-mainnet.phantom.app/YBPpkkN4g91xDiAnTE9r0RcMkjg0sKUIWvAfoFVJ', 'https://mainnet-beta.solflare.network', 'https://solana-mainnet.rpc.extrnode.com']
  };

  const getProviders = ()=> {
    if(getWindow()._clientProviders == undefined) {
      getWindow()._clientProviders = {};
    }
    return getWindow()._clientProviders
  };

  const setProvider$1 = (blockchain, provider)=> {
    getProviders()[blockchain] = provider;
  };

  const setProviderEndpoints$1 = async (blockchain, endpoints)=> {
    
    let endpoint;
    let window = getWindow();

    if(
      window.fetch == undefined ||
      (typeof process != 'undefined' && process['env'] && process['env']['NODE_ENV'] == 'test') ||
      (typeof window.cy != 'undefined')
    ) {
      endpoint = endpoints[0];
    } else {
      
      let responseTimes = await Promise.all(endpoints.map((endpoint)=>{
        return new Promise(async (resolve)=>{
          let timeout = 900;
          let before = new Date().getTime();
          setTimeout(()=>resolve(timeout), timeout);
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ method: 'getIdentity', id: 1, jsonrpc: '2.0' })
          });
          if(!response.ok) { return resolve(999) }
          let after = new Date().getTime();
          resolve(after-before);
        })
      }));

      const fastestResponse = Math.min(...responseTimes);
      const fastestIndex = responseTimes.indexOf(fastestResponse);
      endpoint = endpoints[fastestIndex];
    }
    
    setProvider$1(
      blockchain,
      new StaticJsonRpcSequentialProvider(endpoint, blockchain, endpoints)
    );
  };

  const getProvider$1 = async (blockchain)=> {

    let providers = getProviders();
    if(providers && providers[blockchain]){ return providers[blockchain] }
    
    let window = getWindow();
    if(window._getProviderPromise && window._getProviderPromise[blockchain]) { return await window._getProviderPromise[blockchain] }

    if(!window._getProviderPromise){ window._getProviderPromise = {}; }
    window._getProviderPromise[blockchain] = new Promise(async(resolve)=> {
      await setProviderEndpoints$1(blockchain, ENDPOINTS[blockchain]);
      resolve(getWindow()._clientProviders[blockchain]);
    });

    return await window._getProviderPromise[blockchain]
  };

  var Solana = {
    getProvider: getProvider$1,
    setProviderEndpoints: setProviderEndpoints$1,
    setProvider: setProvider$1,
  };

  let supported$1 = ['ethereum', 'bsc', 'polygon', 'solana', 'fantom', 'velas'];
  supported$1.evm = ['ethereum', 'bsc', 'polygon', 'fantom', 'velas'];
  supported$1.solana = ['solana'];

  function _optionalChain$1$1(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  let getCacheStore = () => {
    if (getWindow()._cacheStore == undefined) {
      resetCache();
    }
    return getWindow()._cacheStore
  };

  let getPromiseStore = () => {
    if (getWindow()._promiseStore == undefined) {
      resetCache();
    }
    return getWindow()._promiseStore
  };

  let resetCache = () => {
    getWindow()._cacheStore = {};
    getWindow()._promiseStore = {};
    getWindow()._clientProviders = {};
  };

  let set = function ({ key, value, expires }) {
    getCacheStore()[key] = {
      expiresAt: Date.now() + expires,
      value,
    };
  };

  let get = function ({ key, expires }) {
    let cachedEntry = getCacheStore()[key];
    if (_optionalChain$1$1([cachedEntry, 'optionalAccess', _ => _.expiresAt]) > Date.now()) {
      return cachedEntry.value
    }
  };

  let getPromise = function({ key }) {
    return getPromiseStore()[key]
  };

  let setPromise = function({ key, promise }) {
    getPromiseStore()[key] = promise;
    return promise
  };

  let deletePromise = function({ key }) {
    getPromiseStore()[key] = undefined; 
  };

  let cache = function ({ call, key, expires = 0 }) {
    return new Promise((resolve, reject)=>{
      let value;
      key = JSON.stringify(key);
      
      // get existing promise (of a previous pending request asking for the exact same thing)
      let existingPromise = getPromise({ key });
      if(existingPromise) { 
        return existingPromise
          .then(resolve)
          .catch(reject)
      }

      setPromise({ key, promise: new Promise((resolveQueue, rejectQueue)=>{
        if (expires === 0) {
          return call()
            .then((value)=>{
              resolve(value);
              resolveQueue(value);
            })
            .catch((error)=>{
              reject(error);
              rejectQueue(error);
            })
        }
        
        // get cached value
        value = get({ key, expires });
        if (value) {
          resolve(value);
          resolveQueue(value);
          return value
        }

        // set new cache value
        call()
          .then((value)=>{
            if (value) {
              set({ key, value, expires });
            }
            resolve(value);
            resolveQueue(value);
          })
          .catch((error)=>{
            reject(error);
            rejectQueue(error);
          });
        })
      }).then(()=>{
        deletePromise({ key });
      }).catch(()=>{
        deletePromise({ key });
      });
    })
  };

  let paramsToContractArgs = ({ contract, method, params }) => {
    let fragment = contract.interface.fragments.find((fragment) => {
      return fragment.name == method
    });

    return fragment.inputs.map((input, index) => {
      if (Array.isArray(params)) {
        return params[index]
      } else {
        return params[input.name]
      }
    })
  };

  let contractCall = ({ address, api, method, params, provider, block }) => {
    let contract = new ethers.ethers.Contract(address, api, provider);
    let args = paramsToContractArgs({ contract, method, params });
    return contract[method](...args, { blockTag: block })
  };

  let balance$1 = ({ address, provider }) => {
    return provider.getBalance(address)
  };

  let transactionCount = ({ address, provider }) => {
    return provider.getTransactionCount(address)
  };

  var requestEVM = async ({ blockchain, address, api, method, params, block }) => {
    const provider = await EVM.getProvider(blockchain);
    
    if (api) {
      return contractCall({ address, api, method, params, provider, block })
    } else if (method === 'latestBlockNumber') {
      return provider.getBlockNumber()
    } else if (method === 'balance') {
      return balance$1({ address, provider })
    } else if (method === 'transactionCount') {
      return transactionCount({ address, provider })
    }
  };

  let accountInfo = async ({ address, api, method, params, provider, block }) => {
    const info = await provider.getAccountInfo(new solanaWeb3_js.PublicKey(address));
    return api.decode(info.data)
  };

  let balance = ({ address, provider }) => {
    return provider.getBalance(new solanaWeb3_js.PublicKey(address))
  };

  var requestSolana = async ({ blockchain, address, api, method, params, block }) => {
    const provider = await Solana.getProvider(blockchain);

    if(method == undefined || method === 'getAccountInfo') {
      if(api == undefined) { 
        api = solanaWeb3_js.ACCOUNT_LAYOUT; 
      }
      return accountInfo({ address, api, method, params, provider, block })
    } else if(method === 'getProgramAccounts') {
      return provider.getProgramAccounts(new solanaWeb3_js.PublicKey(address), params).then((accounts)=>{
        if(api){
          return accounts.map((account)=>{
            account.data = api.decode(account.account.data);
            return account
          })
        } else {
          return accounts
        }
      })
    } else if(method === 'getTokenAccountBalance') {
      return provider.getTokenAccountBalance(new solanaWeb3_js.PublicKey(address))
    } else if (method === 'latestBlockNumber') {
      return provider.getBlockHeight()  
    } else if (method === 'balance') {
      return balance({ address, provider })
    }
  };

  var parseUrl = (url) => {
    if (typeof url == 'object') {
      return url
    }
    let deconstructed = url.match(/(?<blockchain>\w+):\/\/(?<part1>[\w\d]+)(\/(?<part2>[\w\d]+)*)?/);

    if(deconstructed.groups.part2 == undefined) {
      if(deconstructed.groups.part1.match(/\d/)) {
        return {
          blockchain: deconstructed.groups.blockchain,
          address: deconstructed.groups.part1
        }
      } else {
        return {
          blockchain: deconstructed.groups.blockchain,
          method: deconstructed.groups.part1
        }
      }
    } else {
      return {
        blockchain: deconstructed.groups.blockchain,
        address: deconstructed.groups.part1,
        method: deconstructed.groups.part2
      }
    }
  };

  let request = async function (url, options) {
    let { blockchain, address, method } = parseUrl(url);
    let { api, params, cache: cache$1, block } = (typeof(url) == 'object' ? url : options) || {};

    return await cache({
      expires: cache$1 || 0,
      key: [blockchain, address, method, params, block],
      call: async()=>{
        if(supported$1.evm.includes(blockchain)) {


          return requestEVM({ blockchain, address, api, method, params, block })


        } else if(supported$1.solana.includes(blockchain)) {


          return requestSolana({ blockchain, address, api, method, params, block })


        } else {
          throw 'Unknown blockchain: ' + blockchain
        }  
      }
    })
  };

  var balanceOnSolana = async ({ blockchain, address, account, api })=>{

    if(address == Blockchains__default["default"][blockchain].currency.address) {

       return ethers.ethers.BigNumber.from(await request(`solana://${account}/balance`))

    } else {

      let filters = [
        { dataSize: 165 },
        { memcmp: { offset: 32, bytes: account }},
        { memcmp: { offset: 0, bytes: address }}
      ];

      let tokenAccounts  = await request(`solana://TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA/getProgramAccounts`, { params: { filters } });

      let totalBalance = ethers.ethers.BigNumber.from('0');

      await Promise.all(tokenAccounts.map((tokenAccount)=>{
        return request(`solana://${tokenAccount.pubkey.toString()}/getTokenAccountBalance`)
      })).then((balances)=>{
        balances.forEach((balance)=>{
          totalBalance = totalBalance.add(ethers.ethers.BigNumber.from(balance.value.amount));
        });
      });

      return totalBalance
    }
  };

  var decimalsOnSolana = async ({ blockchain, address })=>{
    let data = await request({ blockchain, address, api: MINT_LAYOUT });
    return data.decimals
  };

  var findAccount = async ({ token, owner })=>{

    let existingAccounts = await request(`solana://${TOKEN_PROGRAM}/getProgramAccounts`, {
      api: TOKEN_LAYOUT,
      params: { filters: [
        { dataSize: 165 },
        { memcmp: { offset: 32, bytes: owner }},
        { memcmp: { offset: 0, bytes: token }}
      ]} 
    });

    let existingAccount = existingAccounts.sort((a, b) => (a.account.data.amount.lt(b.account.data.amount) ? 1 : -1))[0];

    if(existingAccount){
      return existingAccount.pubkey.toString()
    } 
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

  function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  var symbolOnSolana = async ({ blockchain, address })=>{
    let metaData = await getMetaData({ blockchain, address });
    return _optionalChain([metaData, 'optionalAccess', _ => _.symbol])
  };

  let supported = ['solana'];
  supported.evm = [];
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
      if (this.address == Blockchains__default["default"].findByName(this.blockchain).currency.address) {
        return Blockchains__default["default"].findByName(this.blockchain).currency.decimals
      }
      let decimals;
      try {
        if(supported.evm.includes(this.blockchain)) {

        } else if(supported.solana.includes(this.blockchain)) {

          decimals = await decimalsOnSolana({ blockchain: this.blockchain, address: this.address });

          
        }
      } catch (e) {}
      return decimals
    }

    async symbol() {
      if (this.address == Blockchains__default["default"].findByName(this.blockchain).currency.address) {
        return Blockchains__default["default"].findByName(this.blockchain).currency.symbol
      }
      if(supported.evm.includes(this.blockchain)) ; else if(supported.solana.includes(this.blockchain)) {

        return await symbolOnSolana({ blockchain: this.blockchain, address: this.address })

      }
    }

    async name(args) {
      if (this.address == Blockchains__default["default"].findByName(this.blockchain).currency.address) {
        return Blockchains__default["default"].findByName(this.blockchain).currency.name
      }
      if(supported.evm.includes(this.blockchain)) ; else if(supported.solana.includes(this.blockchain)) {

        return await nameOnSolana({ blockchain: this.blockchain, address: this.address })

      }
    }

    async balance(account, id) {
      if(supported.evm.includes(this.blockchain)) ; else if(supported.solana.includes(this.blockchain)) {

        return await balanceOnSolana({ blockchain: this.blockchain, account, address: this.address, api: Token[this.blockchain].DEFAULT })

      }
    }

    async allowance(owner, spender) {
      if (this.address == Blockchains__default["default"].findByName(this.blockchain).currency.address) {
        return ethers.ethers.BigNumber.from(Blockchains__default["default"].findByName(this.blockchain).maxInt)
      }
      if(supported.evm.includes(this.blockchain)) ; else if(supported.solana.includes(this.blockchain)) {
        return ethers.ethers.BigNumber.from(Blockchains__default["default"].findByName(this.blockchain).maxInt)
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
      readable = readable.replace(/\.0+$/, '');
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


  Token.solana = {
    MINT_LAYOUT,
    METADATA_LAYOUT,
    TRANSFER_LAYOUT,
    METADATA_ACCOUNT,
    TOKEN_PROGRAM,
    TOKEN_LAYOUT,
    ASSOCIATED_TOKEN_PROGRAM,
    findProgramAddress,
    findAccount,
    getMetaData,
    ...instructions
  };

  exports.Token = Token;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
