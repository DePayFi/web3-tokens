/*#if _EVM

import allowanceOnEVM from './platforms/evm/allowance'
import balanceOnEVM from './platforms/evm/balance'
import BEP20 from './blockchains/bsc/20'
import bsc1155 from './blockchains/bsc/1155'
import decimalsOnEVM from './platforms/evm/decimals'
import ERC20 from './blockchains/ethereum/20'
import ERC20onPolygon from './blockchains/polygon/20'
import ethereum1155 from './blockchains/ethereum/1155'
import ftm1155 from './blockchains/fantom/1155'
import FTM20 from './blockchains/fantom/20'
import nameOnEVM from './platforms/evm/name'
import polygon1155 from './blockchains/polygon/1155'
import symbolOnEVM from './platforms/evm/symbol'
import velas1155 from './blockchains/velas/1155'
import VRC20 from './blockchains/velas/20'

/*#elif _SOLANA

import * as instructions from './platforms/solana/instructions'
import balanceOnSolana from './platforms/solana/balance'
import decimalsOnSolana from './platforms/solana/decimals'
import findAccount from './platforms/solana/findAccount'
import findProgramAddress from './platforms/solana/findProgramAddress'
import nameOnSolana from './platforms/solana/name'
import symbolOnSolana from './platforms/solana/symbol'
import { getMetaData } from './platforms/solana/metadata'
import { METADATA_ACCOUNT } from './platforms/solana/metadata'
import { MINT_LAYOUT, METADATA_LAYOUT, TRANSFER_LAYOUT, TOKEN_LAYOUT } from './platforms/solana/layouts'
import { TOKEN_PROGRAM, ASSOCIATED_TOKEN_PROGRAM } from './platforms/solana/constants'

//#else */

import allowanceOnEVM from './platforms/evm/allowance'
import balanceOnEVM from './platforms/evm/balance'
import BEP20 from './blockchains/bsc/20'
import bsc1155 from './blockchains/bsc/1155'
import decimalsOnEVM from './platforms/evm/decimals'
import ERC20 from './blockchains/ethereum/20'
import ERC20onPolygon from './blockchains/polygon/20'
import ethereum1155 from './blockchains/ethereum/1155'
import ftm1155 from './blockchains/fantom/1155'
import FTM20 from './blockchains/fantom/20'
import nameOnEVM from './platforms/evm/name'
import polygon1155 from './blockchains/polygon/1155'
import symbolOnEVM from './platforms/evm/symbol'
import velas1155 from './blockchains/velas/1155'
import VRC20 from './blockchains/velas/20'

import * as instructions from './platforms/solana/instructions'
import balanceOnSolana from './platforms/solana/balance'
import decimalsOnSolana from './platforms/solana/decimals'
import findAccount from './platforms/solana/findAccount'
import findProgramAddress from './platforms/solana/findProgramAddress'
import nameOnSolana from './platforms/solana/name'
import symbolOnSolana from './platforms/solana/symbol'
import { getMetaData } from './platforms/solana/metadata'
import { METADATA_ACCOUNT } from './platforms/solana/metadata'
import { MINT_LAYOUT, METADATA_LAYOUT, TRANSFER_LAYOUT, TOKEN_LAYOUT } from './platforms/solana/layouts'
import { TOKEN_PROGRAM, ASSOCIATED_TOKEN_PROGRAM } from './platforms/solana/constants'

//#endif

import Blockchains from '@depay/web3-blockchains'
import { ethers } from 'ethers'
import { supported } from './blockchains'

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
    if (this.address == Blockchains.findByName(this.blockchain).currency.address) {
      return Blockchains.findByName(this.blockchain).currency.decimals
    }
    let decimals
    try {
      if(supported.evm.includes(this.blockchain)) {
        /*#if _EVM

        decimals = await decimalsOnEVM({ blockchain: this.blockchain, address: this.address, api: Token[this.blockchain].DEFAULT })

        /*#elif _SOLANA

        //#else */

        decimals = await decimalsOnEVM({ blockchain: this.blockchain, address: this.address, api: Token[this.blockchain].DEFAULT })

        //#endif
      } else if(supported.solana.includes(this.blockchain)) {
        /*#if _EVM

        /*#elif _SOLANA

        decimals = await decimalsOnSolana({ blockchain: this.blockchain, address: this.address })

        //#else */

        decimals = await decimalsOnSolana({ blockchain: this.blockchain, address: this.address })

        //#endif
        
      }
    } catch {}
    return decimals
  }

  async symbol() {
    if (this.address == Blockchains.findByName(this.blockchain).currency.address) {
      return Blockchains.findByName(this.blockchain).currency.symbol
    }
    if(supported.evm.includes(this.blockchain)) {
      /*#if _EVM

      return await symbolOnEVM({ blockchain: this.blockchain, address: this.address, api: Token[this.blockchain].DEFAULT })

      /*#elif _SOLANA

      //#else */

      return await symbolOnEVM({ blockchain: this.blockchain, address: this.address, api: Token[this.blockchain].DEFAULT })

      //#endif
    } else if(supported.solana.includes(this.blockchain)) {
      /*#if _EVM

      /*#elif _SOLANA

      return await symbolOnSolana({ blockchain: this.blockchain, address: this.address })

      //#else */

      return await symbolOnSolana({ blockchain: this.blockchain, address: this.address })

      //#endif
    }
  }

  async name(args) {
    if (this.address == Blockchains.findByName(this.blockchain).currency.address) {
      return Blockchains.findByName(this.blockchain).currency.name
    }
    if(supported.evm.includes(this.blockchain)) {
      /*#if _EVM

      return await nameOnEVM({ blockchain: this.blockchain, address: this.address, api: Token[this.blockchain].DEFAULT, id: args?.id })

      /*#elif _SOLANA

      //#else */

      return await nameOnEVM({ blockchain: this.blockchain, address: this.address, api: Token[this.blockchain].DEFAULT, id: args?.id })

      //#endif
    } else if(supported.solana.includes(this.blockchain)) {
      /*#if _EVM

      /*#elif _SOLANA

      return await nameOnSolana({ blockchain: this.blockchain, address: this.address })

      //#else */

      return await nameOnSolana({ blockchain: this.blockchain, address: this.address })

      //#endif
    }
  }

  async balance(account, id) {
    if(supported.evm.includes(this.blockchain)) {
      /*#if _EVM

      return await balanceOnEVM({ blockchain: this.blockchain, account, address: this.address, api: id ? Token[this.blockchain][1155] : Token[this.blockchain].DEFAULT, id })

      /*#elif _SOLANA

      //#else */

      return await balanceOnEVM({ blockchain: this.blockchain, account, address: this.address, api: id ? Token[this.blockchain][1155] : Token[this.blockchain].DEFAULT, id })

      //#endif
    } else if(supported.solana.includes(this.blockchain)) {
      /*#if _EVM

      /*#elif _SOLANA

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

      /*#elif _SOLANA

      //#else */

      return await allowanceOnEVM({ blockchain: this.blockchain, address: this.address, api: Token[this.blockchain].DEFAULT, owner, spender })

      //#endif
    } else if(supported.solana.includes(this.blockchain)) {
      return ethers.BigNumber.from(Blockchains.findByName(this.blockchain).maxInt)
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

/*#if _EVM

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

Token.fantom = {
  DEFAULT: FTM20,
  FTM20,
  20: FTM20,
  1155: ftm1155,
}

Token.velas = {
  DEFAULT: VRC20,
  VRC20,
  20: VRC20,
  1155: bsc1155,
}

/*#elif _SOLANA

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

Token.fantom = {
  DEFAULT: FTM20,
  FTM20,
  20: FTM20,
  1155: ftm1155,
}

Token.velas = {
  DEFAULT: VRC20,
  VRC20,
  20: VRC20,
  1155: bsc1155,
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
  ...instructions
}

//#endif

export default Token
