/*#if _EVM

import { request } from '@depay/web3-client-evm'

/*#elif _SVM

import { request } from '@depay/web3-client-svm'

//#else */

import { request } from '@depay/web3-client'

//#endif

export default ({ blockchain, address, api })=>{
  return request({
    blockchain,
    address,
    api,
    method: 'decimals',
    cache: 86400000, // 1 day
  })
}
