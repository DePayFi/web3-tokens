import Blockchains from '@depay/web3-blockchains'
import findProgramAddress from './findProgramAddress'
import { ethers } from 'ethers'
import { request } from '@depay/web3-client'

export default async ({ blockchain, address, account, api })=>{

  if(address == Blockchains[blockchain].currency.address) {

     return ethers.BigNumber.from(await request(`solana://${account}/balance`))

  } else {

    const tokenAccountAddress = await findProgramAddress({ token: address, owner: account })

    const balance = await request(`solana://${tokenAccountAddress}/getTokenAccountBalance`)

    if (balance) {
      return ethers.BigNumber.from(balance.value.amount)
    } else {
      return ethers.BigNumber.from('0')
    }
  }
}
