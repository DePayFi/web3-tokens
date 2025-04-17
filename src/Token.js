/*#if _EVM

import allowanceOnEVM from './platforms/evm/allowance'
import balanceOnEVM from './platforms/evm/balance'
import decimalsOnEVM from './platforms/evm/decimals'
import ERC1155 from './standards/ERC1155'
import ERC20 from './standards/ERC20'
import WETH from './standards/WETH'
import nameOnEVM from './platforms/evm/name'
import symbolOnEVM from './platforms/evm/symbol'

/*#elif _SVM

import * as instructions from './platforms/solana/instructions'
import balanceOnSolana from './platforms/solana/balance'
import decimalsOnSolana from './platforms/solana/decimals'
import findAccount from './platforms/solana/findAccount'
import findProgramAddress from './platforms/solana/findProgramAddress'
import nameOnSolana from './platforms/solana/name'
import symbolOnSolana from './platforms/solana/symbol'
import { getMetaData, getMetaDataPDA } from './platforms/solana/metadata'
import { METADATA_ACCOUNT } from './platforms/solana/metadata'
import { MINT_LAYOUT, METADATA_LAYOUT, TRANSFER_LAYOUT, TOKEN_LAYOUT } from './platforms/solana/layouts'
import { TOKEN_PROGRAM, ASSOCIATED_TOKEN_PROGRAM } from './platforms/solana/constants'

//#else */

import allowanceOnEVM from './platforms/evm/allowance'
import balanceOnEVM from './platforms/evm/balance'
import decimalsOnEVM from './platforms/evm/decimals'
import ERC1155 from './standards/ERC1155'
import ERC20 from './standards/ERC20'
import WETH from './standards/WETH'
import nameOnEVM from './platforms/evm/name'
import symbolOnEVM from './platforms/evm/symbol'

import * as instructions from './platforms/solana/instructions'
import balanceOnSolana from './platforms/solana/balance'
import decimalsOnSolana from './platforms/solana/decimals'
import findAccount from './platforms/solana/findAccount'
import findProgramAddress from './platforms/solana/findProgramAddress'
import nameOnSolana from './platforms/solana/name'
import symbolOnSolana from './platforms/solana/symbol'
import { getMetaData, getMetaDataPDA } from './platforms/solana/metadata'
import { METADATA_ACCOUNT } from './platforms/solana/metadata'
import { MINT_LAYOUT, METADATA_LAYOUT, TRANSFER_LAYOUT, TOKEN_LAYOUT } from './platforms/solana/layouts'
import { TOKEN_PROGRAM, ASSOCIATED_TOKEN_PROGRAM } from './platforms/solana/constants'

//#endif

import Blockchains from '@depay/web3-blockchains'
import { ethers } from 'ethers'
import { supported } from './blockchains'

class Token {
  
  constructor({ blockchain, address, name, decimals, symbol }) {
    this.blockchain = blockchain
    if(supported.evm.includes(this.blockchain)) {
      this.address = ethers.utils.getAddress(address)
    } else if(supported.svm.includes(this.blockchain)) {
      this.address = address
    }
    this._name = name
    this._decimals = decimals
    this._symbol = symbol
  }

  async decimals() {
    if(this._decimals) { return this._decimals }
    if (this.address == Blockchains.findByName(this.blockchain).currency.address) {
      this._decimals = Blockchains.findByName(this.blockchain).currency.decimals
      return this._decimals
    }
    let decimals
    try {
      if(supported.evm.includes(this.blockchain)) {
        /*#if _EVM

        decimals = await decimalsOnEVM({ blockchain: this.blockchain, address: this.address, api: Token[this.blockchain].DEFAULT })

        /*#elif _SVM

        //#else */

        decimals = await decimalsOnEVM({ blockchain: this.blockchain, address: this.address, api: Token[this.blockchain].DEFAULT })

        //#endif
      } else if(supported.svm.includes(this.blockchain)) {
        /*#if _EVM

        /*#elif _SVM

        decimals = await decimalsOnSolana({ blockchain: this.blockchain, address: this.address })

        //#else */

        decimals = await decimalsOnSolana({ blockchain: this.blockchain, address: this.address })

        //#endif
        
      }
    } catch {}
    this._decimals = decimals
    return decimals
  }

  async symbol() {
    if(this._symbol) { return this._symbol }
    if (this.address == Blockchains.findByName(this.blockchain).currency.address) {
      this._symbol = Blockchains.findByName(this.blockchain).currency.symbol
      return this._symbol
    }
    let symbol
    if(supported.evm.includes(this.blockchain)) {
      /*#if _EVM

      return await symbolOnEVM({ blockchain: this.blockchain, address: this.address, api: Token[this.blockchain].DEFAULT })

      /*#elif _SVM

      //#else */

      symbol = await symbolOnEVM({ blockchain: this.blockchain, address: this.address, api: Token[this.blockchain].DEFAULT })

      //#endif
    } else if(supported.svm.includes(this.blockchain)) {
      /*#if _EVM

      /*#elif _SVM

      return await symbolOnSolana({ blockchain: this.blockchain, address: this.address })

      //#else */

      symbol = await symbolOnSolana({ blockchain: this.blockchain, address: this.address })

      //#endif
    }
    this._symbol = symbol
    return symbol
  }

  async name(args) {
    if(this._name) { return this._name }
    if (this.address == Blockchains.findByName(this.blockchain).currency.address) {
      this._name = Blockchains.findByName(this.blockchain).currency.name
      return this._name
    }
    let name
    if(supported.evm.includes(this.blockchain)) {
      /*#if _EVM

      return await nameOnEVM({ blockchain: this.blockchain, address: this.address, api: Token[this.blockchain].DEFAULT, id: args?.id })

      /*#elif _SVM

      //#else */

      name = await nameOnEVM({ blockchain: this.blockchain, address: this.address, api: Token[this.blockchain].DEFAULT, id: args?.id })

      //#endif
    } else if(supported.svm.includes(this.blockchain)) {
      /*#if _EVM

      /*#elif _SVM

      return await nameOnSolana({ blockchain: this.blockchain, address: this.address })

      //#else */

      name = await nameOnSolana({ blockchain: this.blockchain, address: this.address })

      //#endif
    }
    this._name = name
    return name
  }

  async balance(account, id) {
    if(supported.evm.includes(this.blockchain)) {
      /*#if _EVM

      return await balanceOnEVM({ blockchain: this.blockchain, account, address: this.address, api: id ? Token[this.blockchain][1155] : Token[this.blockchain].DEFAULT, id })

      /*#elif _SVM

      //#else */

      return await balanceOnEVM({ blockchain: this.blockchain, account, address: this.address, api: id ? Token[this.blockchain][1155] : Token[this.blockchain].DEFAULT, id })

      //#endif
    } else if(supported.svm.includes(this.blockchain)) {
      /*#if _EVM

      /*#elif _SVM

      return await balanceOnSolana({ blockchain: this.blockchain, account, address: this.address, api: Token[this.blockchain].DEFAULT })

      //#else */

      return await balanceOnSolana({ blockchain: this.blockchain, account, address: this.address, api: Token[this.blockchain].DEFAULT })

      //#endif
    }
  }

  async allowance(owner, spender) {
    if (this.address == Blockchains.findByName(this.blockchain).currency.address) {
      return ethers.BigNumber.from(Blockchains.findByName(this.blockchain).maxInt)
    }
    if(supported.evm.includes(this.blockchain)) {
      /*#if _EVM

      return await allowanceOnEVM({ blockchain: this.blockchain, address: this.address, api: Token[this.blockchain].DEFAULT, owner, spender })

      /*#elif _SVM

      //#else */

      return await allowanceOnEVM({ blockchain: this.blockchain, address: this.address, api: Token[this.blockchain].DEFAULT, owner, spender })

      //#endif
    } else if(supported.svm.includes(this.blockchain)) {
      return ethers.BigNumber.from(Blockchains.findByName(this.blockchain).maxInt)
    } 
  }

  async BigNumber(amount) {
    const decimals = await this.decimals()
    if(typeof(amount) != 'string') {
      amount = amount.toString()
    }
    if(amount.match('e')) {
      amount = parseFloat(amount).toFixed(decimals).toString()
    }
    const decimalsMatched = amount.match(/\.(\d+)/)
    if(decimalsMatched && decimalsMatched[1] && decimalsMatched[1].length > decimals) {
      amount = parseFloat(amount).toFixed(decimals).toString()
    }
    return ethers.utils.parseUnits(
      amount,
      decimals
    )
  }

  async readable(amount) {
    let decimals = await this.decimals()
    let readable = ethers.utils.formatUnits(amount.toString(), decimals)
    readable = readable.replace(/\.0+$/, '')
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

/*#if _EVM

Token.ethereum = { 
  DEFAULT: ERC20,
  ERC20: ERC20,
  20: ERC20,
  1155: ERC1155,
  WRAPPED: WETH,
}

Token.bsc = { 
  DEFAULT: ERC20,
  BEP20: ERC20,
  20: ERC20,
  1155: ERC1155,
  WRAPPED: WETH,
}

Token.polygon = { 
  DEFAULT: ERC20,
  ERC20: ERC20,
  20: ERC20,
  1155: ERC1155,
  WRAPPED: WETH,
}

Token.fantom = {
  DEFAULT: ERC20,
  FTM20: ERC20,
  20: ERC20,
  1155: ERC1155,
  WRAPPED: WETH,
}

Token.arbitrum = {
  DEFAULT: ERC20,
  ERC20: ERC20,
  20: ERC20,
  1155: ERC1155,
  WRAPPED: WETH,
}

Token.avalanche = {
  DEFAULT: ERC20,
  ERC20: ERC20,
  ARC20: ERC20,
  20: ERC20,
  1155: ERC1155,
  WRAPPED: WETH,
}

Token.gnosis = {
  DEFAULT: ERC20,
  ERC20: ERC20,
  20: ERC20,
  1155: ERC1155,
  WRAPPED: WETH,
}

Token.optimism = {
  DEFAULT: ERC20,
  ERC20: ERC20,
  20: ERC20,
  1155: ERC1155,
  WRAPPED: WETH,
}

Token.base = {
  DEFAULT: ERC20,
  ERC20: ERC20,
  20: ERC20,
  1155: ERC1155,
  WRAPPED: WETH,
}

Token.worldchain = { 
  DEFAULT: ERC20,
  ERC20: ERC20,
  20: ERC20,
  1155: ERC1155,
  WRAPPED: WETH,
}

/*#elif _SVM

Token.solana = {
  MINT_LAYOUT,
  METADATA_LAYOUT,
  TRANSFER_LAYOUT,
  METADATA_ACCOUNT,
  TOKEN_PROGRAM,
  TOKEN_LAYOUT,
  ASSOCIATED_TOKEN_PROGRAM,
  findProgramAddress,
  findAccount,
  getMetaData,
  ...instructions
}

//#else */

Token.ethereum = { 
  DEFAULT: ERC20,
  ERC20: ERC20,
  20: ERC20,
  1155: ERC1155,
  WRAPPED: WETH,
}

Token.bsc = { 
  DEFAULT: ERC20,
  BEP20: ERC20,
  20: ERC20,
  1155: ERC1155,
  WRAPPED: WETH,
}

Token.polygon = { 
  DEFAULT: ERC20,
  ERC20: ERC20,
  20: ERC20,
  1155: ERC1155,
  WRAPPED: WETH,
}

Token.fantom = {
  DEFAULT: ERC20,
  FTM20: ERC20,
  20: ERC20,
  1155: ERC1155,
  WRAPPED: WETH,
}

Token.arbitrum = {
  DEFAULT: ERC20,
  ERC20: ERC20,
  20: ERC20,
  1155: ERC1155,
  WRAPPED: WETH,
}

Token.avalanche = {
  DEFAULT: ERC20,
  ERC20: ERC20,
  ARC20: ERC20,
  20: ERC20,
  1155: ERC1155,
  WRAPPED: WETH,
}

Token.gnosis = {
  DEFAULT: ERC20,
  ERC20: ERC20,
  20: ERC20,
  1155: ERC1155,
  WRAPPED: WETH,
}

Token.optimism = {
  DEFAULT: ERC20,
  ERC20: ERC20,
  20: ERC20,
  1155: ERC1155,
  WRAPPED: WETH,
}

Token.base = {
  DEFAULT: ERC20,
  ERC20: ERC20,
  20: ERC20,
  1155: ERC1155,
  WRAPPED: WETH,
}

Token.worldchain = {
  DEFAULT: ERC20,
  ERC20: ERC20,
  20: ERC20,
  1155: ERC1155,
  WRAPPED: WETH,
}

Token.solana = {
  MINT_LAYOUT,
  METADATA_LAYOUT,
  TRANSFER_LAYOUT,
  METADATA_ACCOUNT,
  TOKEN_PROGRAM,
  TOKEN_LAYOUT,
  ASSOCIATED_TOKEN_PROGRAM,
  findProgramAddress,
  findAccount,
  getMetaData,
  getMetaDataPDA,
  ...instructions
}

//#endif

export default Token
