import CONSTANTS from 'depay-blockchain-constants'
import ERC20 from './ERC20'
import { request } from 'depay-blockchain-client'
import { ethers } from 'ethers'

class Token {
  constructor({ blockchain, address }) {
    this.blockchain = blockchain
    this.address = ethers.utils.getAddress(address)
  }

  async decimals() {
    if (this.address == CONSTANTS[this.blockchain].NATIVE) {
      return CONSTANTS[this.blockchain].DECIMALS
    }
    return await request(['ethereum://', this.address, '/decimals'].join(''), {
      api: ERC20,
      cache: 86400000, // 1 day
    })
  }

  async symbol() {
    if (this.address == CONSTANTS[this.blockchain].NATIVE) {
      return CONSTANTS[this.blockchain].SYMBOL
    }
    return await request(['ethereum://', this.address, '/symbol'].join(''), {
      api: ERC20,
      cache: 86400000, // 1 day
    })
  }

  async name() {
    if (this.address == CONSTANTS[this.blockchain].NATIVE) {
      return CONSTANTS[this.blockchain].NAME
    }
    return await request(['ethereum://', this.address, '/name'].join(''), {
      api: ERC20,
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

  async balance(account) {
    if (this.address == CONSTANTS[this.blockchain].NATIVE) {
      return await request(['ethereum://', account, '/balance'].join(''), {
        cache: 30000, // 30 seconds
      })
    } else {
      return await request(['ethereum://', this.address, '/balanceOf'].join(''), {
        api: ERC20,
        params: [account],
        cache: 30000, // 30 seconds
      })
    }
  }

  async BigNumber(amount) {
    let decimals = await this.decimals()
    return ethers.BigNumber.from(amount).mul(ethers.BigNumber.from(10).pow(decimals))
  }
}

Token.BigNumber = async ({ amount, blockchain, address }) => {
  let token = new Token({ blockchain, address })
  return token.BigNumber(amount)
}

export default Token
