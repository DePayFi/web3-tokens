import { ACCOUNT_LAYOUT, PublicKey, Buffer, BN } from '@depay/solana-web3.js'
import { mock, resetMocks } from '@depay/web3-mock'
import { resetCache, getProvider } from '@depay/web3-client'
import { supported } from 'src/blockchains'
import Token from 'src'
import { TOKEN_PROGRAM } from 'src/platforms/solana/constants'

describe('findAccount', () => {

  supported.svm.forEach((blockchain)=>{

    describe(blockchain, ()=>{

      let provider
      
      beforeEach(async()=>{
        resetCache()
        resetMocks()
        provider = await getProvider(blockchain)
      })

      describe('token account already exists', ()=> {

        it('returns existing account', async ()=>{

          const data = Buffer.alloc(ACCOUNT_LAYOUT.span)
          ACCOUNT_LAYOUT.encode({
            amount: new BN('6774847'),
            mint: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
            owner: new PublicKey('2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1'),
            delegateOption: 0,
            delegate: new PublicKey('11111111111111111111111111111111'),
            state: 1,
            isNativeOption: 0,
            isNative: new BN('0'),
            delegatedAmount: new BN('0'),
            closeAuthorityOption: 0,
            closeAuthority: new PublicKey('11111111111111111111111111111111')
          }, data)
          
          mock({
            blockchain,
            provider,
            request: {
              to: 'F7e4iBrxoSmHhEzhuBcXXs1KAknYvEoZWieiocPvrCD9',
              method: 'getAccountInfo',
              return: data
            }
          })

          let tokenAccount = await Token.solana.findAccount({ 
            owner: '2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1',
            token: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' 
          })

          expect(tokenAccount.mint.toString()).toEqual('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
          expect(tokenAccount.owner.toString()).toEqual('2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1')
          expect(tokenAccount.amount.toString()).toEqual('6774847')
        })
      })

      describe('token account does not exists (yet)', ()=> {

        it('returns nothing', async ()=>{
          
          mock({
            blockchain,
            provider,
            request: {
              to: 'F7e4iBrxoSmHhEzhuBcXXs1KAknYvEoZWieiocPvrCD9',
              method: 'getAccountInfo',
              return: null
            }
          })

          let tokenAccount = await Token.solana.findAccount({ 
            owner: '2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1',
            token: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' 
          })

          expect(tokenAccount).toEqual(undefined)
        })
      })
    })
  })
})
