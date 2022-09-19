import { ACCOUNT_LAYOUT, Buffer } from '@depay/solana-web3.js'
import { mock, resetMocks } from '@depay/web3-mock'
import { resetCache, provider } from '@depay/web3-client'
import { supported } from 'src/blockchains'
import { Token } from 'src'
import { TOKEN_PROGRAM } from 'src/platforms/solana/constants'

describe('findAccount', () => {

  supported.solana.forEach((blockchain)=>{

    beforeEach(resetCache)
    beforeEach(resetMocks)

    describe('token account already exists', ()=> {

      it('returns existing account with highest amount', async ()=>{
        
        mock({
          blockchain,
          provider: provider(blockchain),
          request: {
            to: TOKEN_PROGRAM,
            method: 'getProgramAccounts',
            params: { filters: [
              { dataSize: 165 },
              { memcmp: { offset: 32, bytes: '2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1' }},
              { memcmp: { offset: 0, bytes: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' }}
            ]},
            return: [{
              account: { data: new Buffer([]), executable: false, lamports: 2039280, owner: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', rentEpoch: 327 },
              pubkey: 'F7e4iBrxoSmHhEzhuBcXXs1KAknYvEoZWieiocPvrCD9'
            }]
          }
        })

        let tokenAccountAddress = await Token.solana.findAccount({ 
          owner: '2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1',
          token: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' 
        })

        expect(tokenAccountAddress).toEqual('F7e4iBrxoSmHhEzhuBcXXs1KAknYvEoZWieiocPvrCD9')
      })
    })
  })
})
