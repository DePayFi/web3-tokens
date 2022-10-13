import { PublicKey, Buffer } from '@depay/solana-web3.js'
import { request } from '@depay/web3-client'
import { TOKEN_LAYOUT } from './layouts'
import { TOKEN_PROGRAM } from './constants'

export default async ({ token, owner })=>{

  let existingAccounts = await request(`solana://${TOKEN_PROGRAM}/getProgramAccounts`, {
    api: TOKEN_LAYOUT,
    params: { filters: [
      { dataSize: 165 },
      { memcmp: { offset: 32, bytes: owner }},
      { memcmp: { offset: 0, bytes: token }}
    ]} 
  })

  let existingAccount = existingAccounts.sort((a, b) => (a.account.data.amount.lt(b.account.data.amount) ? 1 : -1))[0]

  if(existingAccount){
    return existingAccount.pubkey.toString()
  } 
}
