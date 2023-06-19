import Blockchains from '@depay/web3-blockchains'
import { mock, resetMocks } from '@depay/web3-mock'
import { resetCache, getProvider } from '@depay/web3-client'
import { supported } from 'src/blockchains'
import Token from 'src'

describe('Token', () => {
  describe('allowance', () => {

    supported.solana.forEach((blockchain)=>{

      describe(blockchain, ()=>{

        let provider
        
        beforeEach(async()=>{
          resetCache()
          resetMocks()
          provider = await getProvider(blockchain)
        })

        it('provides MAXINT as Solana does not have token allowances', async ()=> {
          let token = new Token({ blockchain, address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' })
          let allowance = await token.allowance()
          expect(allowance.toString()).toEqual(Blockchains[blockchain].maxInt)
        })
      })
    })
  })
})
