import { CONSTANTS } from 'depay-web3-constants'
import BEP20 from 'src/blockchains/bsc/BEP20'
import { mock, resetMocks } from 'depay-web3-mock'
import { Token } from 'src'
import { resetCache, provider as getProvider } from 'depay-web3-client'

describe('Token', () => {
  describe('allowance', () => {

    let provider
    beforeEach(async()=>{ provider = await getProvider('bsc') })
    beforeEach(resetCache)
    beforeEach(resetMocks)
    afterEach(resetMocks)

    let blockchain = 'bsc'

    it('retrieves allowance amount for given address for an BEP20', async ()=> {
      let owner = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
      let spender = '0xb0252f13850a4823706607524de0b146820F2240'

      mock(blockchain)
      mock({ 
        provider,
        blockchain,
        call: {
          to: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb',
          api: BEP20,
          method: 'allowance',
          params: [owner, spender],
          return: CONSTANTS[blockchain].MAXINT
        }
      })
      
      let token = new Token({ blockchain, address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb' })
      let allowance = await token.allowance('0xb0252f13850a4823706607524de0b146820F2240')
      
      expect(allowance.toString()).toEqual(CONSTANTS[blockchain].MAXINT)
    })

    it('retrieves allowance amount for given address for the native token', async ()=> {
      let owner = '0xb0252f13850a4823706607524de0b146820F2240'
      let spender = '0xb0252f13850a4823706607524de0b146820F2240'

      let token = new Token({ blockchain, address: CONSTANTS[blockchain].NATIVE })
      let allowance = await token.allowance('0xb0252f13850a4823706607524de0b146820F2240')
      
      expect(allowance.toString()).toEqual(CONSTANTS[blockchain].MAXINT)
    })
  })
})
