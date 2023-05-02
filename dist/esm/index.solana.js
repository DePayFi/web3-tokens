import { PublicKey, struct, u32, publicKey, u64, u8, bool, rustEnum, str, u16, option, vec, Buffer, BN, TransactionInstruction, SystemProgram, ACCOUNT_LAYOUT, Connection } from '@depay/solana-web3.js';
import Blockchains from '@depay/web3-blockchains';
import { ethers } from 'ethers';

const TOKEN_PROGRAM = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
const ASSOCIATED_TOKEN_PROGRAM = 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';

function _optionalChain$3(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
var findProgramAddress = async ({ token, owner })=>{

  const [address] = await PublicKey.findProgramAddress(
    [
      (new PublicKey(owner)).toBuffer(),
      (new PublicKey(TOKEN_PROGRAM)).toBuffer(),
      (new PublicKey(token)).toBuffer()
    ],
    new PublicKey(ASSOCIATED_TOKEN_PROGRAM)
  );

  return _optionalChain$3([address, 'optionalAccess', _ => _.toString, 'call', _2 => _2()])
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

const TRANSFER_LAYOUT = struct([
  u8('instruction'),
  u64('amount'),
]);

const TOKEN_LAYOUT = struct([
  publicKey('mint'),
  publicKey('owner'),
  u64('amount'),
  u32('delegateOption'),
  publicKey('delegate'),
  u8('state'),
  u32('isNativeOption'),
  u64('isNative'),
  u64('delegatedAmount'),
  u32('closeAuthorityOption'),
  publicKey('closeAuthority')
]);

const INITIALIZE_LAYOUT = struct([
  u8('instruction'),
  publicKey('owner')
]);

const CLOSE_LAYOUT = struct([
  u8('instruction')
]);

const createTransferInstruction = async ({ token, amount, from, to })=>{

  let fromTokenAccount = await findProgramAddress({ token, owner: from });
  let toTokenAccount = await findProgramAddress({ token, owner: to });

  const keys = [
    { pubkey: new PublicKey(fromTokenAccount), isSigner: false, isWritable: true },
    { pubkey: new PublicKey(toTokenAccount), isSigner: false, isWritable: true },
    { pubkey: new PublicKey(from), isSigner: true, isWritable: false }
  ];

  const data = Buffer.alloc(TRANSFER_LAYOUT.span);
  TRANSFER_LAYOUT.encode({
    instruction: 3, // TRANSFER
    amount: new BN(amount)
  }, data);
  
  return new TransactionInstruction({ 
    keys,
    programId: new PublicKey(TOKEN_PROGRAM),
    data 
  })
};

const createAssociatedTokenAccountInstruction = async ({ token, owner, payer }) => {

  let associatedToken = await findProgramAddress({ token, owner });

  const keys = [
    { pubkey: new PublicKey(payer), isSigner: true, isWritable: true },
    { pubkey: new PublicKey(associatedToken), isSigner: false, isWritable: true },
    { pubkey: new PublicKey(owner), isSigner: false, isWritable: false },
    { pubkey: new PublicKey(token), isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: new PublicKey(TOKEN_PROGRAM), isSigner: false, isWritable: false },
  ];

 return new TransactionInstruction({
    keys,
    programId: new PublicKey(ASSOCIATED_TOKEN_PROGRAM),
    data: Buffer.alloc(0)
  })
};

const initializeAccountInstruction = ({ account, token, owner })=>{

  const keys = [
    { pubkey: new PublicKey(account), isSigner: false, isWritable: true },
    { pubkey: new PublicKey(token), isSigner: false, isWritable: false },
  ];

  const data = Buffer.alloc(INITIALIZE_LAYOUT.span);
  INITIALIZE_LAYOUT.encode({
    instruction: 18, // InitializeAccount3
    owner: new PublicKey(owner)
  }, data);
  
  return new TransactionInstruction({ keys, programId: new PublicKey(TOKEN_PROGRAM), data })
};


const closeAccountInstruction = ({ account, owner })=>{

  const keys = [
    { pubkey: new PublicKey(account), isSigner: false, isWritable: true },
    { pubkey: new PublicKey(owner), isSigner: false, isWritable: true },
    { pubkey: new PublicKey(owner), isSigner: true, isWritable: false }
  ];

  const data = Buffer.alloc(CLOSE_LAYOUT.span);
  CLOSE_LAYOUT.encode({
    instruction: 9 // CloseAccount
  }, data);

  return new TransactionInstruction({ keys, programId: new PublicKey(TOKEN_PROGRAM), data })
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

class StaticJsonRpcBatchProvider extends ethers.providers.JsonRpcProvider {

  constructor(url, network, endpoints, failover) {
    super(url);
    this._network = network;
    this._endpoint = url;
    this._endpoints = endpoints;
    this._failover = failover;
  }

  detectNetwork() {
    return Promise.resolve(Blockchains.findByName(this._network).id)
  }

  requestChunk(chunk, endpoint) {
    
    const request = chunk.map((inflight) => inflight.request);

    return ethers.utils.fetchJson(endpoint, JSON.stringify(request))
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
          this._failover();
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

const getAllProviders$1 = ()=> {
  if(getWindow()._Web3ClientProviders == undefined) {
    getWindow()._Web3ClientProviders = {};
  }
  return getWindow()._Web3ClientProviders
};

const setProvider$2 = (blockchain, provider)=> {
  if(getAllProviders$1()[blockchain] === undefined) { getAllProviders$1()[blockchain] = []; }
  const index = getAllProviders$1()[blockchain].indexOf(provider);
  if(index > -1) {
    getAllProviders$1()[blockchain].splice(index, 1);
  }
  getAllProviders$1()[blockchain].unshift(provider);
};

const setProviderEndpoints$2 = async (blockchain, endpoints, detectFastest = true)=> {
  
  getAllProviders$1()[blockchain] = endpoints.map((endpoint, index)=>
    new StaticJsonRpcBatchProvider(endpoint, blockchain, endpoints, ()=>{
      if(getAllProviders$1()[blockchain].length === 1) {
        setProviderEndpoints$2(blockchain, endpoints, detectFastest);
      } else {
        getAllProviders$1()[blockchain].splice(index, 1);
      }
    })
  );
  
  let provider;
  let window = getWindow();

  if(
    window.fetch == undefined ||
    (typeof process != 'undefined' && process['env'] && process['env']['NODE_ENV'] == 'test') ||
    (typeof window.cy != 'undefined') ||
    detectFastest === false
  ) {
    provider = getAllProviders$1()[blockchain][0];
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
    provider = getAllProviders$1()[blockchain][fastestIndex];
  }
  
  setProvider$2(blockchain, provider);
};

const getProvider$2 = async (blockchain)=> {

  let providers = getAllProviders$1();
  if(providers && providers[blockchain]){ return providers[blockchain][0] }
  
  let window = getWindow();
  if(window._Web3ClientGetProviderPromise && window._Web3ClientGetProviderPromise[blockchain]) { return await window._Web3ClientGetProviderPromise[blockchain] }

  if(!window._Web3ClientGetProviderPromise){ window._Web3ClientGetProviderPromise = {}; }
  window._Web3ClientGetProviderPromise[blockchain] = new Promise(async(resolve)=> {
    await setProviderEndpoints$2(blockchain, Blockchains[blockchain].endpoints);
    resolve(getWindow()._Web3ClientProviders[blockchain][0]);
  });

  return await window._Web3ClientGetProviderPromise[blockchain]
};

const getProviders$2 = async(blockchain)=>{

  let providers = getAllProviders$1();
  if(providers && providers[blockchain]){ return providers[blockchain] }
  
  let window = getWindow();
  if(window._Web3ClientGetProvidersPromise && window._Web3ClientGetProvidersPromise[blockchain]) { return await window._Web3ClientGetProvidersPromise[blockchain] }

  if(!window._Web3ClientGetProvidersPromise){ window._Web3ClientGetProvidersPromise = {}; }
  window._Web3ClientGetProvidersPromise[blockchain] = new Promise(async(resolve)=> {
    await setProviderEndpoints$2(blockchain, Blockchains[blockchain].endpoints);
    resolve(getWindow()._Web3ClientProviders[blockchain]);
  });

  return await window._Web3ClientGetProvidersPromise[blockchain]
};

var EVM = {
  getProvider: getProvider$2,
  getProviders: getProviders$2,
  setProviderEndpoints: setProviderEndpoints$2,
  setProvider: setProvider$2,
};

class StaticJsonRpcSequentialProvider extends Connection {

  constructor(url, network, endpoints, failover) {
    super(url);
    this._network = network;
    this._endpoint = url;
    this._endpoints = endpoints;
    this._failover = failover;
  }
}

const getAllProviders = ()=> {
  if(getWindow()._Web3ClientProviders == undefined) {
    getWindow()._Web3ClientProviders = {};
  }
  return getWindow()._Web3ClientProviders
};

const setProvider$1 = (blockchain, provider)=> {
  if(getAllProviders()[blockchain] === undefined) { getAllProviders()[blockchain] = []; }
  const index = getAllProviders()[blockchain].indexOf(provider);
  if(index > -1) {
    getAllProviders()[blockchain].splice(index, 1);
  }
  getAllProviders()[blockchain].unshift(provider);
};

const setProviderEndpoints$1 = async (blockchain, endpoints, detectFastest = true)=> {
  
  getAllProviders()[blockchain] = endpoints.map((endpoint, index)=>
    new StaticJsonRpcSequentialProvider(endpoint, blockchain, endpoints)
  );

  let provider;
  let window = getWindow();

  if(
    window.fetch == undefined ||
    (typeof process != 'undefined' && process['env'] && process['env']['NODE_ENV'] == 'test') ||
    (typeof window.cy != 'undefined') ||
    detectFastest === false
  ) {
    provider = getAllProviders()[blockchain][0];
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
    provider = getAllProviders()[blockchain][fastestIndex];
  }
  
  setProvider$1(blockchain, provider);
};

const getProvider$1 = async (blockchain)=> {

  let providers = getAllProviders();
  if(providers && providers[blockchain]){ return providers[blockchain][0] }
  
  let window = getWindow();
  if(window._Web3ClientGetProviderPromise && window._Web3ClientGetProviderPromise[blockchain]) { return await window._Web3ClientGetProviderPromise[blockchain] }

  if(!window._Web3ClientGetProviderPromise){ window._Web3ClientGetProviderPromise = {}; }
  window._Web3ClientGetProviderPromise[blockchain] = new Promise(async(resolve)=> {
    await setProviderEndpoints$1(blockchain, Blockchains[blockchain].endpoints);
    resolve(getWindow()._Web3ClientProviders[blockchain][0]);
  });

  return await window._Web3ClientGetProviderPromise[blockchain]
};

const getProviders$1 = async(blockchain)=>{

  let providers = getAllProviders();
  if(providers && providers[blockchain]){ return providers[blockchain] }
  
  let window = getWindow();
  if(window._Web3ClientGetProvidersPromise && window._Web3ClientGetProvidersPromise[blockchain]) { return await window._Web3ClientGetProvidersPromise[blockchain] }

  if(!window._Web3ClientGetProvidersPromise){ window._Web3ClientGetProvidersPromise = {}; }
  window._Web3ClientGetProvidersPromise[blockchain] = new Promise(async(resolve)=> {
    await setProviderEndpoints$1(blockchain, Blockchains[blockchain].endpoints);
    resolve(getWindow()._Web3ClientProviders[blockchain]);
  });

  return await window._Web3ClientGetProvidersPromise[blockchain]
};

var Solana = {
  getProvider: getProvider$1,
  getProviders: getProviders$1,
  setProviderEndpoints: setProviderEndpoints$1,
  setProvider: setProvider$1,
};

let supported$1 = ['ethereum', 'bsc', 'polygon', 'solana', 'fantom', 'velas'];
supported$1.evm = ['ethereum', 'bsc', 'polygon', 'fantom', 'velas'];
supported$1.solana = ['solana'];

function _optionalChain$1$1(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
let getCacheStore = () => {
  if (getWindow()._Web3ClientCacheStore == undefined) {
    getWindow()._Web3ClientCacheStore = {};
  }
  return getWindow()._Web3ClientCacheStore
};

let getPromiseStore = () => {
  if (getWindow()._Web3ClientPromiseStore == undefined) {
    getWindow()._Web3ClientPromiseStore = {};
  }
  return getWindow()._Web3ClientPromiseStore
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

const getConfiguration = () =>{
  if(getWindow()._Web3ClientConfiguration === undefined) {
    getWindow()._Web3ClientConfiguration = {};
  }
  return getWindow()._Web3ClientConfiguration
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

const contractCall = ({ address, api, method, params, provider, block }) => {
  let contract = new ethers.Contract(address, api, provider);
  let args = paramsToContractArgs({ contract, method, params });
  return contract[method](...args, { blockTag: block })
};

const balance$1 = ({ address, provider }) => {
  return provider.getBalance(address)
};

const transactionCount = ({ address, provider }) => {
  return provider.getTransactionCount(address)
};

const singleRequest$1 = ({ blockchain, address, api, method, params, block, provider }) =>{
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

var requestEVM = async ({ blockchain, address, api, method, params, block, timeout, strategy }) => {

  strategy = strategy ? strategy : (getConfiguration().strategy || 'failover');
  timeout = timeout ? timeout : (getConfiguration().timeout || undefined);

  if(strategy === 'fastest') {

    return Promise.race((await EVM.getProviders(blockchain)).map((provider)=>{

      const request = singleRequest$1({ blockchain, address, api, method, params, block, provider });
    
      if(timeout) {
        const timeoutPromise = new Promise((_, reject)=>setTimeout(()=>{ reject(new Error("Web3ClientTimeout")); }, timeout));
        return Promise.race([request, timeoutPromise])
      } else {
        return request
      }
    }))

  } else { // failover

    const provider = await EVM.getProvider(blockchain);
    const request = singleRequest$1({ blockchain, address, api, method, params, block, provider });
    
    if(timeout) {
      timeout = new Promise((_, reject)=>setTimeout(()=>{ reject(new Error("Web3ClientTimeout")); }, timeout));
      return Promise.race([request, timeout])
    } else {
      return request
    }
  }
};

const accountInfo = async ({ address, api, method, params, provider, block }) => {
  const info = await provider.getAccountInfo(new PublicKey(address));
  return api.decode(info.data)
};

const balance = ({ address, provider }) => {
  return provider.getBalance(new PublicKey(address))
};

const singleRequest = async({ blockchain, address, api, method, params, block, provider, providers })=> {

  try {

    if(method == undefined || method === 'getAccountInfo') {
      if(api == undefined) {
        api = ACCOUNT_LAYOUT; 
      }
      return await accountInfo({ address, api, method, params, provider, block })
    } else if(method === 'getProgramAccounts') {
      return await provider.getProgramAccounts(new PublicKey(address), params).then((accounts)=>{
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
      return await provider.getTokenAccountBalance(new PublicKey(address))
    } else if (method === 'latestBlockNumber') {
      return await provider.getBlockHeight()  
    } else if (method === 'balance') {
      return await balance({ address, provider })
    }

  } catch (error){
    if(providers && error && [
      'Failed to fetch', '504', '503', '502', '500', '429', '426', '422', '413', '409', '408', '406', '405', '404', '403', '402', '401', '400'
    ].some((errorType)=>error.toString().match(errorType))) {
      let nextProvider = providers[providers.indexOf(provider)+1] || providers[0];
      return singleRequest({ blockchain, address, api, method, params, block, provider: nextProvider, providers })
    } else {
      throw error
    }
  }
};

var requestSolana = async ({ blockchain, address, api, method, params, block, timeout, strategy }) => {

  strategy = strategy ? strategy : (getConfiguration().strategy || 'failover');
  timeout = timeout ? timeout : (getConfiguration().timeout || undefined);

  const providers = await Solana.getProviders(blockchain);

  if(strategy === 'fastest') {

    return Promise.race(providers.map((provider)=>{

      const succeedingRequest = new Promise((resolve)=>{
        singleRequest({ blockchain, address, api, method, params, block, provider }).then(resolve);
      }); // failing requests are ignored during race/fastest
    
      const timeoutPromise = new Promise((_, reject)=>setTimeout(()=>{ reject(new Error("Web3ClientTimeout")); }, timeout || 10000));
        
      return Promise.race([succeedingRequest, timeoutPromise])
    }))
    
  } else { // failover

    const provider = await Solana.getProvider(blockchain);
    const request = singleRequest({ blockchain, address, api, method, params, block, provider, providers });

    if(timeout) {
      timeout = new Promise((_, reject)=>setTimeout(()=>{ reject(new Error("Web3ClientTimeout")); }, timeout));
      return Promise.race([request, timeout])
    } else {
      return request
    }
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

const request = async function (url, options) {
  
  const { blockchain, address, method } = parseUrl(url);
  const { api, params, cache: cache$1, block, timeout, strategy } = (typeof(url) == 'object' ? url : options) || {};

  return await cache({
    expires: cache$1 || 0,
    key: [blockchain, address, method, params, block],
    call: async()=>{
      if(supported$1.evm.includes(blockchain)) {


        return await requestEVM({ blockchain, address, api, method, params, block, strategy, timeout })


      } else if(supported$1.solana.includes(blockchain)) {


        return await requestSolana({ blockchain, address, api, method, params, block, strategy, timeout })


      } else {
        throw 'Unknown blockchain: ' + blockchain
      }  
    }
  })
};

var balanceOnSolana = async ({ blockchain, address, account, api })=>{

  if(address == Blockchains[blockchain].currency.address) {

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
      this.address = ethers.utils.getAddress(address);
    } else if(supported.solana.includes(this.blockchain)) {
      this.address = address;
    }
  }

  async decimals() {
    if (this.address == Blockchains.findByName(this.blockchain).currency.address) {
      return Blockchains.findByName(this.blockchain).currency.decimals
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
    if (this.address == Blockchains.findByName(this.blockchain).currency.address) {
      return Blockchains.findByName(this.blockchain).currency.symbol
    }
    if(supported.evm.includes(this.blockchain)) ; else if(supported.solana.includes(this.blockchain)) {

      return await symbolOnSolana({ blockchain: this.blockchain, address: this.address })

    }
  }

  async name(args) {
    if (this.address == Blockchains.findByName(this.blockchain).currency.address) {
      return Blockchains.findByName(this.blockchain).currency.name
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
    if (this.address == Blockchains.findByName(this.blockchain).currency.address) {
      return ethers.BigNumber.from(Blockchains.findByName(this.blockchain).maxInt)
    }
    if(supported.evm.includes(this.blockchain)) ; else if(supported.solana.includes(this.blockchain)) {
      return ethers.BigNumber.from(Blockchains.findByName(this.blockchain).maxInt)
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

export { Token };
