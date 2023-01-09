import allowanceOnEVM from './platforms/evm/allowance.evm'
import balanceOnEVM from './platforms/evm/balance.evm'
import BEP20 from './blockchains/bsc/20'
import bsc1155 from './blockchains/bsc/1155'
import decimalsOnEVM from './platforms/evm/decimals.evm'
import ERC20 from './blockchains/ethereum/20'
import ERC20onPolygon from './blockchains/polygon/20'
import ethereum1155 from './blockchains/ethereum/1155'
import nameOnEVM from './platforms/evm/name.evm'
import polygon1155 from './blockchains/polygon/1155'
import symbolOnEVM from './platforms/evm/symbol.evm'
import velas1155 from './blockchains/velas/1155'
import VRC20 from './blockchains/velas/20'
import { CONSTANTS } from '@depay/web3-constants'
import { ethers } from 'ethers'
import { request } from '@depay/web3-client-evm'
import { supported } from './blockchains.evm'

class Token {
  
  constructor({ blockchain, address }) {
    this.blockchain = blockchain
    if(supported.evm.includes(this.blockchain)) {
      this.address = ethers.utils.getAddress(address)
    }
  }

  async decimals() {
    if (this.address == CONSTANTS[this.blockchain].NATIVE) {
      return CONSTANTS[this.blockchain].DECIMALS
    }
    let decimals
    try {
      if(supported.evm.includes(this.blockchain)) {
        decimals = await decimalsOnEVM({ blockchain: this.blockchain, address: this.address, api: Token[this.blockchain].DEFAULT })
      }
    } catch {}
    return decimals
  }

  async symbol() {
    if (this.address == CONSTANTS[this.blockchain].NATIVE) {
      return CONSTANTS[this.blockchain].SYMBOL
    }
    if(supported.evm.includes(this.blockchain)) {
      return await symbolOnEVM({ blockchain: this.blockchain, address: this.address, api: Token[this.blockchain].DEFAULT })
    }
  }

  async name(args) {
    if (this.address == CONSTANTS[this.blockchain].NATIVE) {
      return CONSTANTS[this.blockchain].CURRENCY
    }
    if(supported.evm.includes(this.blockchain)) {
      return await nameOnEVM({ blockchain: this.blockchain, address: this.address, api: Token[this.blockchain].DEFAULT, id: args?.id })
    }
  }

  async balance(account, id) {
    if(supported.evm.includes(this.blockchain)) {
      return await balanceOnEVM({ blockchain: this.blockchain, account, address: this.address, api: id ? Token[this.blockchain][1155] : Token[this.blockchain].DEFAULT, id })
    }
  }

  async allowance(owner, spender) {
    if (this.address == CONSTANTS[this.blockchain].NATIVE) {
      return ethers.BigNumber.from(CONSTANTS[this.blockchain].MAXINT)
    }
    if(supported.evm.includes(this.blockchain)) {
      return await allowanceOnEVM({ blockchain: this.blockchain, address: this.address, api: Token[this.blockchain].DEFAULT, owner, spender })
    } 
  }

  async BigNumber(amount) {
    let decimals = await this.decimals()
    return ethers.utils.parseUnits(
      Token.safeAmount({ amount: parseFloat(amount), decimals }).toString(),
      decimals
    )
  }

  async readable(amount) {
    let decimals = await this.decimals()
    let readable = ethers.utils.formatUnits(amount.toString(), decimals)
    readable = readable.replace(/0+$/, '')
    readable = readable.replace(/\.$/, '')
    return readable
  }
}

Token.BigNumber = async ({ amount, blockchain, address }) => {
  let token = new Token({ blockchain, address })
  return token.BigNumber(amount)
}

Token.readable = async ({ amount, blockchain, address }) => {
  let token = new Token({ blockchain, address })
  return token.readable(amount)
}

Token.safeAmount = ({ amount, decimals }) => {
  return parseFloat(amount.toFixed(decimals))
}

Token.ethereum = { 
  DEFAULT: ERC20,
  ERC20,
  20: ERC20,
  1155: ethereum1155,
}

Token.bsc = { 
  DEFAULT: BEP20,
  BEP20,
  20: BEP20,
  1155: bsc1155,
}

Token.polygon = { 
  DEFAULT: ERC20onPolygon,
  ERC20: ERC20onPolygon,
  20: ERC20onPolygon,
  1155: bsc1155,
}

Token.velas = {
  DEFAULT: VRC20,
  VRC20,
  20: VRC20,
  1155: bsc1155,
}

export default Token
