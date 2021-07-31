import BEP20 from './blockchains/bsc/BEP20'
import ERC20 from './blockchains/ethereum/ERC20'
import { CONSTANTS } from 'depay-web3-constants'
import { ethers } from 'ethers'
import { getWallet } from 'depay-web3-wallets'
import { request, estimate } from 'depay-web3-client'

class Token {
  
  constructor({ blockchain, address }) {
    this.blockchain = blockchain
    this.address = ethers.utils.getAddress(address)
  }

  async decimals() {
    if (this.address == CONSTANTS[this.blockchain].NATIVE) {
      return CONSTANTS[this.blockchain].DECIMALS
    }
    return await request(
      {
        blockchain: this.blockchain,
        address: this.address,
        method: 'decimals',
      },
      {
        api: ERC20,
        cache: 86400000, // 1 day
      },
    )
  }

  async symbol() {
    if (this.address == CONSTANTS[this.blockchain].NATIVE) {
      return CONSTANTS[this.blockchain].SYMBOL
    }
    return await request(
      {
        blockchain: this.blockchain,
        address: this.address,
        method: 'symbol',
      },
      {
        api: ERC20,
        cache: 86400000, // 1 day
      },
    )
  }

  async name() {
    if (this.address == CONSTANTS[this.blockchain].NATIVE) {
      return CONSTANTS[this.blockchain].NAME
    }
    return await request(
      {
        blockchain: this.blockchain,
        address: this.address,
        method: 'name',
      },
      {
        api: ERC20,
        cache: 86400000, // 1 day
      },
    )
  }

  transferable() {
    return new Promise(async (resolve, reject) => {
      if (this.address == CONSTANTS[this.blockchain].NATIVE) {
        resolve(true)
      }

      estimate(
        {
          blockchain: this.blockchain,
          address: this.address,
          method: 'transfer',
        },
        {
          api: ERC20,
          params: [await getWallet().account(), '1'],
        },
      )
        .then(() => resolve(true))
        .catch(() => resolve(false))
    })
  }

  async balance(account) {
    if (this.address == CONSTANTS[this.blockchain].NATIVE) {
      return await request(
        {
          blockchain: this.blockchain,
          address: account,
          method: 'balance',
        },
        {
          cache: 30000, // 30 seconds
        },
      )
    } else {
      return await request(
        {
          blockchain: this.blockchain,
          address: this.address,
          method: 'balanceOf',
        },
        {
          api: ERC20,
          params: [account],
          cache: 30000, // 30 seconds
        },
      )
    }
  }

  async allowance(spender) {
    if (this.address == CONSTANTS[this.blockchain].NATIVE) {
      return ethers.BigNumber.from(CONSTANTS[this.blockchain].MAXINT)
    } else {
      return await request(
        {
          blockchain: this.blockchain,
          address: this.address,
          method: 'allowance',
        },
        {
          api: ERC20,
          params: [await getWallet().account(), spender],
          cache: 30000, // 30 seconds
        },
      )
    }
  }

  async BigNumber(amount) {
    let decimals = await this.decimals()
    return ethers.utils.parseUnits(amount.toString(), decimals)
  }
}

Token.BigNumber = async ({ amount, blockchain, address }) => {
  let token = new Token({ blockchain, address })
  return token.BigNumber(amount)
}

Token.ethereum = { ERC20 }
Token.bsc = { BEP20 }

export default Token
