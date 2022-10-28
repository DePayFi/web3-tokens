import { CONSTANTS } from '@depay/web3-constants'
import { request } from '@depay/web3-client-evm'

export default async ({ blockchain, address, account, api })=>{
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
}
