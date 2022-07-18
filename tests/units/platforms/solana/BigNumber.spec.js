import { CONSTANTS } from '@depay/web3-constants'
import { mock, resetMocks } from '@depay/web3-mock'
import { resetCache, provider } from '@depay/web3-client'
import { supported } from 'src/blockchains'
import { Token } from 'src'

describe('BigNumber', () => {

  supported.solana.forEach((blockchain)=>{

    beforeEach(resetCache)
    beforeEach(resetMocks)

    beforeEach(()=>{
      mock({
        blockchain,
        provider: provider(blockchain),
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

    it('provides a BigNumber function to convert humand readable amounts to blockchain BigNumbers', async ()=> {

      expect(
        (await Token.BigNumber({
          amount: 1,
          blockchain,
          address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
        })).toString()
      ).toEqual('1000000')
    });

    it('provides a BigNumber for a given float amount', async ()=> {

      expect(
        (await Token.BigNumber({
          amount: 0.1,
          blockchain,
          address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
        })).toString()
      ).toEqual('100000')
    });

    it('also provides a BigNumber if the passed token address is the placeholder for the native token itself', async ()=>{
      expect(
        (await Token.BigNumber({
          amount: 2,
          blockchain,
          address: CONSTANTS[blockchain].NATIVE
        })).toString()
      ).toEqual('2000000000')
    })

    it('also allows to convert a BigNumber directly on an already initialized token', async ()=>{

      let token = new Token({ blockchain, address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' })

      let amountBN = await token.BigNumber(20)

      expect(amountBN.toString()).toEqual('20000000')
    })

    it('shortens the input decimal number before converting it to big number if passed decimal has more decimals than supported', async ()=> {
      let token = new Token({ blockchain, address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' })

      let amountBN = await token.BigNumber(0.00001912690397719563)

      expect(amountBN.toString()).toEqual('19')
    })
  })
});
