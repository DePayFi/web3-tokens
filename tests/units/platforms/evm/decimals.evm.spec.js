import { mock, resetMocks } from '@depay/web3-mock'
import { resetCache, getProvider } from '@depay/web3-client/dist/umd/index.evm'
import { supported } from 'src/blockchains.evm'
import { Token } from 'src/index.evm'

describe('Token decimals (evm)', () => {

  supported.evm.forEach((blockchain)=>{

    describe(blockchain, ()=>{

      let provider
      
      beforeEach(async()=>{
        resetCache()
        resetMocks()
        provider = await getProvider(blockchain)
      })

      it('returns decimals', async ()=> {

        let tokenDecimalMock = mock({
          provider,
          blockchain,
          request: {
            to: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
            api: Token[blockchain].DEFAULT,
            method: 'decimals',
            return: 18
          }
        })

        let token = new Token({
          blockchain,
          address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb'
        })

        expect(token.address).toEqual('0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb')
        expect(await token.decimals()).toEqual(18)
      })

      it('returns "undefined" if decimal request fails', async ()=> {

        let tokenDecimalMock = mock({
          provider,
          blockchain,
          request: {
            to: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
            api: Token[blockchain].DEFAULT,
            method: 'decimals',
            return: Error('SOMETHING WENT WRONG')
          }
        })

        let token = new Token({
          blockchain,
          address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb'
        })

        expect(token.address).toEqual('0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb')
        expect(await token.decimals()).toEqual(undefined)
      })
    })
  })
})
