import Token from 'src'
import { mock, resetMocks } from '@depay/web3-mock'
import { resetCache, getProvider } from '@depay/web3-client'
import { supported } from 'src/blockchains'

describe('readable', () => {

  supported.solana.forEach((blockchain)=>{

   describe(blockchain, ()=>{

      let provider
      
      beforeEach(async()=>{
        resetCache()
        resetMocks()
        provider = await getProvider(blockchain)
      })

      beforeEach(()=>{
        mock({
          blockchain,
          provider,
          request: {
            to: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
            api: Token[blockchain].MINT_LAYOUT,
            return: {
              mintAuthorityOption: 1,
              mintAuthority: "2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9",
              supply: "5034999492452932",
              decimals: 6,
              isInitialized: true,
              freezeAuthorityOption: 1,
              freezeAuthority: "3sNBr7kMccME5D55xNgsmYpZnzPgP2g12CixAajXypn6"
            }
          }
        })
      })

      it('turns a given BigInt number into a human-readable number', async ()=> {
        expect(
          (await Token.readable({
            amount: '123125121',
            blockchain,
            address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
          })).toString()
        ).toEqual('123.125121')

        expect(
          await (new Token({ blockchain, address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' }))
          .readable('123125121')
        ).toEqual('123.125121')

        expect(
          (await Token.readable({
            amount: '12312000000',
            blockchain,
            address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
          })).toString()
        ).toEqual('12312')

        expect(
          await (new Token({ blockchain, address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' }))
          .readable('1231251000000')
        ).toEqual('1231251')

        expect(
          (await Token.readable({
            amount: '1231251100000',
            blockchain,
            address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
          })).toString()
        ).toEqual('1231251.1')

        expect(
          await (new Token({ blockchain, address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' }))
          .readable('1231251100000')
        ).toEqual('1231251.1')
      })
    })
  })
})
