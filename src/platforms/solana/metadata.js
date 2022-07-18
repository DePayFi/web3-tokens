import { METADATA_LAYOUT } from './layouts'
import { PublicKey, Buffer } from '@depay/solana-web3.js'
import { request } from '@depay/web3-client'

const METADATA_ACCOUNT = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'

const METADATA_REPLACE = new RegExp('\u0000', 'g')

const getMetaDataPDA = async ({ metaDataPublicKey, mintPublicKey }) => {
  let seed = [
    Buffer.from('metadata'),
    metaDataPublicKey.toBuffer(),
    mintPublicKey.toBuffer()  
  ]

  return (await PublicKey.findProgramAddress(seed, metaDataPublicKey))[0]
}

const getMetaData = async ({ blockchain, address })=> {

  let mintPublicKey = new PublicKey(address)
  let metaDataPublicKey = new PublicKey(METADATA_ACCOUNT)
  let tokenMetaDataPublicKey = await getMetaDataPDA({ metaDataPublicKey, mintPublicKey })

  let metaData = await request({
    blockchain, 
    address: tokenMetaDataPublicKey.toString(),
    api: METADATA_LAYOUT,
    cache: 86400000, // 1 day
  })

  return {
    name: metaData?.data?.name?.replace(METADATA_REPLACE, ''),
    symbol: metaData?.data?.symbol?.replace(METADATA_REPLACE, '')
  }
}

export {
  getMetaData,
  getMetaDataPDA,
  METADATA_ACCOUNT,
}
