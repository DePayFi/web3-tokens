import CONSTANTS from 'depay-blockchain-constants'
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
      blockchain: this.blockchain,
      address: this.address,
      api: ERC20,
    }
  }

  async decimals() {
    if (this.address == CONSTANTS[this.blockchain].NATIVE) {
      return CONSTANTS[this.blockchain].DECIMALS
    }
    return await call({
      ...this.callBasics(),
      method: 'decimals',
      cache: 86400000, // 1 day
    })
  }

  async symbol() {
    if (this.address == CONSTANTS[this.blockchain].NATIVE) {
      return CONSTANTS[this.blockchain].SYMBOL
    }
    return await call({
      ...this.callBasics(),
      method: 'symbol',
      cache: 86400000, // 1 day
    })
  }

  async name() {
    if (this.address == CONSTANTS[this.blockchain].NATIVE) {
      return CONSTANTS[this.blockchain].NAME
    }
    return await call({
      ...this.callBasics(),
      method: 'name',
      cache: 86400000, // 1 day
    })
  }

  transferable() {
    return new Promise(async (resolve, reject) => {
      if (this.address == CONSTANTS[this.blockchain].NATIVE) {
        resolve(true)
      }
      let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      let provider = new ethers.providers.Web3Provider(window.ethereum)
      let signer = provider.getSigner()
      let contract = new ethers.Contract(this.address, ERC20, provider)
      let estimate = contract
        .connect(signer)
        .estimateGas.transfer(accounts[0], '1')
        .then(() => resolve(true))
        .catch(() => resolve(false))
    })
  }
}

Token.BigNumber = async ({ amount, blockchain, address }) => {
  let token = new Token({ blockchain, address })
  let decimals = await token.decimals()
  return ethers.BigNumber.from(amount).mul(ethers.BigNumber.from(10).pow(decimals))
}

export default Token
