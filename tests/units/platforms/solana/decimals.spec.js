import { mock, resetMocks } from '@depay/web3-mock'
import { resetCache, getProvider } from '@depay/web3-client'
import { supported } from 'src/blockchains'
import Token from 'src'

describe('Token', () => {

  supported.solana.forEach((blockchain)=>{

    describe(blockchain, ()=>{

      let provider
      
      beforeEach(async()=>{
        resetCache()
        resetMocks()
        provider = await getProvider(blockchain)
      })

      it('returns decimals', async ()=> {

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

        let token = new Token({
          blockchain,
          address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
        })

        expect(token.address).toEqual('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
        expect(await token.decimals()).toEqual(6)
      })

      it('returns "undefined" if decimal request fails', async ()=> {

        let tokenDecimalMock = mock({
          blockchain,
          provider,
          request: {
            to: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
            api: Token[blockchain].MINT_LAYOUT,
            return: Error('SOMETHING WENT WRONG!')
          }
        })

        let token = new Token({
          blockchain,
          address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
        })

        expect(await token.decimals()).toEqual(undefined)
      })
    })
  })
})
