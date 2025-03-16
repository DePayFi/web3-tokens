/*#if _EVM

import { request } from '@depay/web3-client-evm'

/*#elif _SVM

import { request } from '@depay/web3-client-svm'

//#else */

import { request } from '@depay/web3-client'

//#endif

export default ({ blockchain, address, api, owner, spender })=>{
  return request(
    {
      blockchain,
      address,
      api,
      method: 'allowance',
      params: [owner, spender],
      // no cache for allowance!
    },
  )
}
