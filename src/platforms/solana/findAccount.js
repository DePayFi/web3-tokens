import { PublicKey, Buffer } from '@depay/solana-web3.js'
import { request } from '@depay/web3-client'
import { TOKEN_LAYOUT } from './layouts'
import { TOKEN_PROGRAM } from './constants'
import findProgramAddress from './findProgramAddress'

export default async ({ token, owner })=>{

  const address = await findProgramAddress({ token, owner })

  const existingAccount = await request({
    blockchain: 'solana',
    address,
    api: TOKEN_LAYOUT,
    cache: 1000 // 1s
  })

  return existingAccount
}
