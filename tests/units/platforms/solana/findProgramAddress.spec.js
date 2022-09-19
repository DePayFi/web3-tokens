import { ACCOUNT_LAYOUT } from '@depay/solana-web3.js'
import { mock, resetMocks } from '@depay/web3-mock'
import { resetCache, provider } from '@depay/web3-client'
import { supported } from 'src/blockchains'
import { Token } from 'src'

describe('findProgramAddress', () => {

  supported.solana.forEach((blockchain)=>{

    beforeEach(resetCache)
    beforeEach(resetMocks)

    it('finds programAddress for given mint/owner', async ()=> {

      mock({
        blockchain,
        provider: provider(blockchain),
        request: {
          to: 'F7e4iBrxoSmHhEzhuBcXXs1KAknYvEoZWieiocPvrCD9',
          api: ACCOUNT_LAYOUT,
          return: {
            amount: '6774847',
            mint: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
            owner: '2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1',
            delegateOption: 0,
            delegate: '11111111111111111111111111111111',
            state: 1,
            isNativeOption: 0,
            isNative: '0',
            delegatedAmount: '0',
            closeAuthorityOption: 0,
            closeAuthority: '11111111111111111111111111111111'
          }
        }
      })

      let tokenAccountAddress = await Token.solana.findProgramAddress({ 
        owner: '2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1',
        token: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' 
      })

      expect(tokenAccountAddress).toEqual('F7e4iBrxoSmHhEzhuBcXXs1KAknYvEoZWieiocPvrCD9')
    })

    it('returns associated programAddress if account has not been created yet', async ()=> {

      mock({
        blockchain,
        provider: provider(blockchain),
        request: {
          to: 'F7e4iBrxoSmHhEzhuBcXXs1KAknYvEoZWieiocPvrCD9',
          api: ACCOUNT_LAYOUT,
          return: null
        }
      })

      let tokenAccountAddress = await Token.solana.findProgramAddress({ 
        owner: '2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1',
        token: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
      })

      expect(tokenAccountAddress).toEqual('F7e4iBrxoSmHhEzhuBcXXs1KAknYvEoZWieiocPvrCD9')
    })
  })
})
