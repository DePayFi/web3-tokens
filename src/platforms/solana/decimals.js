import { request } from '@depay/web3-client'
import { MINT_LAYOUT } from './layouts'

export default async ({ blockchain, address })=>{
  let data = await request({ blockchain, address, api: MINT_LAYOUT })
  return data.decimals
}
