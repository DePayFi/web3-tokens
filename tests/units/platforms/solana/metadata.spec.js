import { CONSTANTS } from '@depay/web3-constants'
import { mock, resetMocks } from '@depay/web3-mock'
import { resetCache, getProvider } from '@depay/web3-client'
import { supported } from 'src/blockchains'
import { Token } from 'src'

describe('Token', () => {

  supported.solana.forEach((blockchain)=>{

    describe(blockchain, ()=>{

      let provider
      
      beforeEach(async()=>{
        resetCache()
        resetMocks()
        provider = await getProvider(blockchain)
      })

      it('retrieves meta data from the blockchain', async ()=> {

        let tokenMetaDataMock = mock({
          blockchain,
          provider,
          request: {
            to: '5x38Kp4hvdomTCnCrAny4UtMUt5rQBdB6px2K1Ui45Wq',
            api: Token[blockchain].METADATA_LAYOUT,
            return: {
              key: { metadataV1: {} },
              isMutable: true,
              editionNonce: 252,
              primarySaleHappened: false,
              updateAuthority: '2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9',
              mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
              data: {
                creators: null,
                name: "USD Coin",
                sellerFeeBasisPoints: 0,
                symbol: "USDC",
                uri: ""
              }
            }
          }
        })

        let token = new Token({
          blockchain,
          address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
        })

        expect(token.address).toEqual('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
        expect(await token.symbol()).toEqual('USDC')
        expect(await token.name()).toEqual('USD Coin')

        expect(tokenMetaDataMock).toHaveBeenCalledTimes(1)

        // caches calls up to 1 day:

        expect(await token.symbol()).toEqual('USDC')
        expect(await token.name()).toEqual('USD Coin')

        expect(tokenMetaDataMock).toHaveBeenCalledTimes(1) // still just 1
      })

      it('provides basic token data also for the native tokens', async ()=> {

        let token = new Token({
          blockchain,
          address: CONSTANTS[blockchain].NATIVE
        })

        expect(token.address).toEqual(CONSTANTS[blockchain].NATIVE)
        expect(await token.symbol()).toEqual(CONSTANTS[blockchain].SYMBOL)
        expect(await token.name()).toEqual(CONSTANTS[blockchain].CURRENCY)
      })
    })
  })
})
