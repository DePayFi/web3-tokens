import { CONSTANTS } from '@depay/web3-constants'
import { mock, resetMocks } from '@depay/web3-mock'
import { resetCache, provider } from '@depay/web3-client'
import { supported } from 'src/blockchains'
import { Token } from 'src'

describe('Token', () => {
  describe('allowance', () => {

    supported.solana.forEach((blockchain)=>{

      beforeEach(resetCache)
      beforeEach(resetMocks)

      it('provides MAXINT as Solana does not have token allowances', async ()=> {
        let token = new Token({ blockchain, address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' })
        let allowance = await token.allowance()
        expect(allowance.toString()).toEqual(CONSTANTS[blockchain].MAXINT)
      })
    })
  })
})
