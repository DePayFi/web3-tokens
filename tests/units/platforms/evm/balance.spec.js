import { CONSTANTS } from '@depay/web3-constants'
import { mock, resetMocks } from '@depay/web3-mock'
import { resetCache, getProvider } from '@depay/web3-client'
import { supported } from 'src/blockchains'
import { Token } from 'src'

describe('Token balance', () => {

  supported.evm.forEach((blockchain)=>{

    describe(blockchain, ()=>{

      let provider
      
      beforeEach(async()=>{
        resetCache()
        resetMocks()
        provider = await getProvider(blockchain)
      })

      it('provides the balance of the token for the given account', async ()=> {
        mock({ 
          provider,
          blockchain,
          request: {
            to: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb',
            api: Token[blockchain].DEFAULT,
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
          provider,
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
})
