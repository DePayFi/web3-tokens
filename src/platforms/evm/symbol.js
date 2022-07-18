import { request } from '@depay/web3-client'

export default ({ blockchain, address, api })=>{
  return request(
    {
      blockchain,
      address,
      api,
      method: 'symbol',
      cache: 86400000, // 1 day
    }
  )
}
