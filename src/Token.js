import allowanceOnEVM from './platforms/evm/allowance'
import balanceOnEVM from './platforms/evm/balance'
import balanceOnSolana from './platforms/solana/balance'
import BEP20 from './blockchains/bsc/BEP20'
import decimalsOnEVM from './platforms/evm/decimals'
import decimalsOnSolana from './platforms/solana/decimals'
import ERC20 from './blockchains/ethereum/ERC20'
import ERC20onPolygon from './blockchains/polygon/ERC20'
import findProgramAddress from './platforms/solana/findProgramAddress'
import nameOnEVM from './platforms/evm/name'
import nameOnSolana from './platforms/solana/name'
import symbolOnEVM from './platforms/evm/symbol'
import symbolOnSolana from './platforms/solana/symbol'
import { CONSTANTS } from '@depay/web3-constants'
import { ethers } from 'ethers'
import { METADATA_ACCOUNT } from './platforms/solana/metadata'
import { MINT_LAYOUT, METADATA_LAYOUT } from './platforms/solana/layouts'
import { request } from '@depay/web3-client'
import { supported } from './blockchains'
import { TOKEN_PROGRAM, ASSOCIATED_TOKEN_PROGRAM } from './platforms/solana/constants'

class Token {
  
  constructor({ blockchain, address }) {
    this.blockchain = blockchain
    if(supported.evm.includes(this.blockchain)) {
      this.address = ethers.utils.getAddress(address)
    } else if(supported.solana.includes(this.blockchain)) {
      this.address = address
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
      } else if(supported.solana.includes(this.blockchain)) {
        decimals = await decimalsOnSolana({ blockchain: this.blockchain, address: this.address })
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
    } else if(supported.solana.includes(this.blockchain)) {
      return await symbolOnSolana({ blockchain: this.blockchain, address: this.address })
    }
  }

  async name() {
    if (this.address == CONSTANTS[this.blockchain].NATIVE) {
      return CONSTANTS[this.blockchain].CURRENCY
    }
    if(supported.evm.includes(this.blockchain)) {
      return await nameOnEVM({ blockchain: this.blockchain, address: this.address, api: Token[this.blockchain].DEFAULT })
    } else if(supported.solana.includes(this.blockchain)) {
      return await nameOnSolana({ blockchain: this.blockchain, address: this.address })
    }
  }

  async balance(account) {
    if(supported.evm.includes(this.blockchain)) {
      return await balanceOnEVM({ blockchain: this.blockchain, account, address: this.address, api: Token[this.blockchain].DEFAULT })
    } else if(supported.solana.includes(this.blockchain)) {
      return await balanceOnSolana({ blockchain: this.blockchain, account, address: this.address, api: Token[this.blockchain].DEFAULT })
    }
  }

  async allowance(owner, spender) {
    if (this.address == CONSTANTS[this.blockchain].NATIVE) {
      return ethers.BigNumber.from(CONSTANTS[this.blockchain].MAXINT)
    }
    if(supported.evm.includes(this.blockchain)) {
      return await allowanceOnEVM({ blockchain: this.blockchain, address: this.address, api: Token[this.blockchain].DEFAULT, owner, spender })
    } else if(supported.solana.includes(this.blockchain)) {
      return ethers.BigNumber.from(CONSTANTS[this.blockchain].MAXINT)
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
  ERC20
}

Token.bsc = { 
  DEFAULT: BEP20,
  BEP20
}

Token.polygon = { 
  DEFAULT: ERC20onPolygon,
  ERC20: ERC20onPolygon
}

Token.solana = {
  MINT_LAYOUT,
  METADATA_LAYOUT,
  METADATA_ACCOUNT,
  TOKEN_PROGRAM,
  ASSOCIATED_TOKEN_PROGRAM,
  findProgramAddress,
}

export default Token
