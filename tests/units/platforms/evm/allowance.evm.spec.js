import Blockchains from '@depay/web3-blockchains'
import { mock, resetMocks } from '@depay/web3-mock'
import { resetCache, getProvider } from '@depay/web3-client-evm'
import { supported } from 'src/blockchains'
import Token from 'dist/esm/index.evm'

describe('Token allowance (evm)', ()=> {

  supported.evm.forEach((blockchain)=>{

    describe(blockchain, ()=>{

      let provider
      const accounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']
      
      beforeEach(async()=>{
        resetCache()
        resetMocks()
        provider = await getProvider(blockchain)
      })

      it('retrieves allowance amount for given address', async ()=> {
        let owner = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
        let spender = '0xb0252f13850a4823706607524de0b146820F2240'

        mock({ provider, blockchain, accounts: { return: accounts } })
        mock({ 
          provider,
          blockchain,
          request: {
            to: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb',
            api: Token[blockchain].DEFAULT,
            method: 'allowance',
            params: [owner, spender],
            return: Blockchains[blockchain].maxInt
          }
        })
        
        let token = new Token({ blockchain, address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb' })
        let allowance = await token.allowance(accounts[0], '0xb0252f13850a4823706607524de0b146820F2240')
        
        expect(allowance.toString()).toEqual(Blockchains[blockchain].maxInt)
      })

      it('retrieves allowance amount for given address for the native token', async ()=> {
        let owner = '0xb0252f13850a4823706607524de0b146820F2240'
        let spender = '0xb0252f13850a4823706607524de0b146820F2240'

        let token = new Token({ blockchain, address: Blockchains[blockchain].currency.address })
        let allowance = await token.allowance(accounts[0], '0xb0252f13850a4823706607524de0b146820F2240')
        
        expect(allowance.toString()).toEqual(Blockchains[blockchain].maxInt)
      })
    })
  })
})
