import ERC20 from './ERC20'
import { call } from 'depay-blockchain-call'
import { ethers } from 'ethers'

class Token {
  constructor({ blockchain, address }) {
    this.blockchain = blockchain
    this.address = ethers.utils.getAddress(address)
  }

  callBasics() {
    return {
      blockchain: 'ethereum',
      address: this.address,
      api: ERC20,
    }
  }

  async decimals() {
    return await call({
      ...this.callBasics(),
      method: 'decimals',
      cache: 86400000, // 1 day
    })
  }

  async symbol() {
    return await call({
      ...this.callBasics(),
      method: 'symbol',
      cache: 86400000, // 1 day
    })
  }

  async name() {
    return await call({
      ...this.callBasics(),
      method: 'name',
      cache: 86400000, // 1 day
    })
  }
}

Token.BigNumber = async ({ amount, blockchain, address }) => {
  let token = new Token({ blockchain, address })
  let decimals = await token.decimals()
  return ethers.BigNumber.from(amount).mul(ethers.BigNumber.from(10).pow(decimals))
}

export default Token
