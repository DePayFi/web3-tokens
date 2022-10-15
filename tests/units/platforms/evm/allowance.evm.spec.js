import { CONSTANTS } from '@depay/web3-constants'
import { mock, resetMocks } from '@depay/web3-mock'
import { resetCache, provider } from '@depay/web3-client/umd/index.evm'
import { supported } from 'src/blockchains.evm'
import { Token } from 'src/index.evm'

describe('Token allowance (evm)', () => {

  supported.evm.forEach((blockchain)=>{

    beforeEach(resetCache)
    beforeEach(resetMocks)

    const accounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']

    it('retrieves allowance amount for given address', async ()=> {
      let owner = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
      let spender = '0xb0252f13850a4823706607524de0b146820F2240'

      mock({ blockchain, accounts: { return: accounts } })
      mock({ 
        provider: provider(blockchain),
        blockchain,
        request: {
          to: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb',
          api: Token[blockchain].DEFAULT,
          method: 'allowance',
          params: [owner, spender],
          return: CONSTANTS[blockchain].MAXINT
        }
      })
      
      let token = new Token({ blockchain, address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb' })
      let allowance = await token.allowance(accounts[0], '0xb0252f13850a4823706607524de0b146820F2240')
      
      expect(allowance.toString()).toEqual(CONSTANTS[blockchain].MAXINT)
    })

    it('retrieves allowance amount for given address for the native token', async ()=> {
      let owner = '0xb0252f13850a4823706607524de0b146820F2240'
      let spender = '0xb0252f13850a4823706607524de0b146820F2240'

      let token = new Token({ blockchain, address: CONSTANTS[blockchain].NATIVE })
      let allowance = await token.allowance(accounts[0], '0xb0252f13850a4823706607524de0b146820F2240')
      
      expect(allowance.toString()).toEqual(CONSTANTS[blockchain].MAXINT)
    })
  })
})
