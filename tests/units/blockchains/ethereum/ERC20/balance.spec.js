import { CONSTANTS } from 'depay-web3-constants'
import ERC20 from 'src/blockchains/ethereum/ERC20'
import { mock, resetMocks } from 'depay-web3-mock'
import { Token } from 'src'
import { resetCache, provider } from 'depay-web3-client'

describe('Token', () => {
  describe('balance', () => {

    beforeEach(resetCache)
    beforeEach(resetMocks)

    let blockchain = 'ethereum'

    it('provides the balance of the token for the given account', async ()=> {
      mock({ 
        provider: provider(blockchain),
        blockchain,
        call: {
          to: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb',
          api: ERC20,
          method: 'balanceOf',
          params: '0xb0252f13850a4823706607524de0b146820F2240',
          return: '1022222211'
        }
      })
      let token = new Token({ blockchain, address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb' })
      let balance = await token.balance('0xb0252f13850a4823706607524de0b146820F2240')
      expect(balance.toString()).toEqual('1022222211')
    })

    it('provides the balance of the native token for the given account', async ()=> {
      mock({ 
        provider: provider(blockchain),
        blockchain,
        balance: {
          for: '0xb0252f13850a4823706607524de0b146820F2240',
          return: '12345'
        }
      })
      let token = new Token({ blockchain, address: CONSTANTS[blockchain].NATIVE })
      let balance = await token.balance('0xb0252f13850a4823706607524de0b146820F2240')
      expect(balance.toString()).toEqual('12345')
    })
  })
})
