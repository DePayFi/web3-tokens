import { request } from '@depay/web3-client'

export default ({ blockchain, address, api })=>{
  return request(
    {
      blockchain: blockchain,
      address: address,
      api,
      method: 'name',
      cache: 86400000, // 1 day
    },
  )
}
