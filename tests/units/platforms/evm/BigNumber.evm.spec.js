import { mock, resetMocks } from '@depay/web3-mock'
import { resetCache, getProvider } from '@depay/web3-client-evm'
import { supported } from 'src/blockchains'
import Token from 'dist/esm/index.evm'

describe('BigNumber (evm)', () => {

  supported.evm.forEach((blockchain)=>{

   describe(blockchain, ()=>{

      let provider
      
      beforeEach(async()=>{
        resetCache()
        resetMocks()
        provider = await getProvider(blockchain)
      })

      it('provides a BigNumber function to convert humand readable amounts to blockchain BigNumbers', async ()=> {

        let tokenCallMock = mock({
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
          (await Token.BigNumber({
            amount: 1,
            blockchain,
            address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb'
          })).toString()
        ).toEqual('1000000000000000000')
      })

      it('provides a BigNumber for a given float amount', async ()=> {

        let tokenCallMock = mock({
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
          (await Token.BigNumber({
            amount: 0.1,
            blockchain,
            address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb'
          })).toString()
        ).toEqual('100000000000000000')
      })

      it('also provides a BigNumber if the passed token address is the placeholder for the native token itself', async ()=>{
        expect(
          (await Token.BigNumber({
            amount: 2,
            blockchain,
            address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
          })).toString()
        ).toEqual('2000000000000000000')
      })

      it('also allows to convert a BigNumber directly on an already initialized token', async ()=>{
        let tokenCallMock = mock({
          provider,
          blockchain,
          request: {
            to: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
            api: Token[blockchain].DEFAULT,
            method: 'decimals',
            return: 18
          }
        })

        let token = new Token({ blockchain, address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb' })

        let amountBN = await token.BigNumber(20)

        expect(amountBN.toString()).toEqual('20000000000000000000')
      })

      it('shortens the input decimal number before converting it to big number if passed decimal has more decimals than supported', async ()=> {
        let tokenCallMock = mock({
          provider,
          blockchain,
          request: {
            to: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
            api: Token[blockchain].DEFAULT,
            method: 'decimals',
            return: 18
          }
        })

        let token = new Token({ blockchain, address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb' })

        let amountBN = await token.BigNumber(0.00001912690397719563)

        expect(amountBN.toString()).toEqual('19126903977196')
      })
    })
  })
})
