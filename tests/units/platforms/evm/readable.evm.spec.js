import { mock, resetMocks } from '@depay/web3-mock'
import { resetCache, getProvider } from '@depay/web3-client-evm'
import { supported } from 'src/blockchains'
import { Token } from 'dist/esm/index.evm'

describe('readable (evm)', () => {

  supported.evm.forEach((blockchain)=>{

    describe(blockchain, ()=>{

      let provider
      
      beforeEach(async()=>{
        resetCache()
        resetMocks()
        provider = await getProvider(blockchain)
      })

      it('turns a given BigInt number into a human-readable number', async ()=> {
        mock({
          provider,
          blockchain,
          request: {
            to: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
            api: Token[blockchain].DEFAULT,
            method: 'decimals',
            return: 18
          }
        })

        expect(
          (await Token.readable({
            amount: '1231251211232111000000000',
            blockchain,
            address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb'
          })).toString()
        ).toEqual('1231251.211232111')

        expect(
          await (new Token({ blockchain, address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb' }))
          .readable('1231251211232111000000000')
        ).toEqual('1231251.211232111')

        expect(
          (await Token.readable({
            amount: '1231251000000000000000000',
            blockchain,
            address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb'
          })).toString()
        ).toEqual('1231251')

        expect(
          await (new Token({ blockchain, address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb' }))
          .readable('1231251000000000000000000')
        ).toEqual('1231251')

        expect(
          (await Token.readable({
            amount: '1231251100000000000000000',
            blockchain,
            address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb'
          })).toString()
        ).toEqual('1231251.1')

        expect(
          await (new Token({ blockchain, address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb' }))
          .readable('1231251100000000000000000')
        ).toEqual('1231251.1')
      })
    })
  })
})
