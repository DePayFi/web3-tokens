import Blockchains from '@depay/web3-blockchains'
import { ethers } from 'ethers'
import { request } from '@depay/web3-client'

export default async ({ blockchain, address, account, api })=>{

  if(address == Blockchains[blockchain].currency.address) {

     return ethers.BigNumber.from(await request(`solana://${account}/balance`))

  } else {

    let filters = [
      { dataSize: 165 },
      { memcmp: { offset: 32, bytes: account }},
      { memcmp: { offset: 0, bytes: address }}
    ]

    let tokenAccounts  = await request(`solana://TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA/getProgramAccounts`, { params: { filters } })

    let totalBalance = ethers.BigNumber.from('0')

    await Promise.all(tokenAccounts.map((tokenAccount)=>{
      return request(`solana://${tokenAccount.pubkey.toString()}/getTokenAccountBalance`)
    })).then((balances)=>{
      balances.forEach((balance)=>{
        totalBalance = totalBalance.add(ethers.BigNumber.from(balance.value.amount))
      })
    })

    return totalBalance
  }
}
