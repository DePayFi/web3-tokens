import { Buffer } from '@depay/solana-web3.js'
import Blockchains from '@depay/web3-blockchains'
import { mock, resetMocks } from '@depay/web3-mock'
import { resetCache, getProvider } from '@depay/web3-client'
import { supported } from 'src/blockchains'
import Token from 'src'

describe('Token', () => {
  describe('balance', () => {

    supported.solana.forEach((blockchain)=>{

      describe(blockchain, ()=>{

        let provider
        
        beforeEach(async()=>{
          resetCache()
          resetMocks()
          provider = await getProvider(blockchain)
        })

        it('provides the balance of the token for the given account', async ()=> {

          let account = '2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1'
          let tokenAddress = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
          let tokenAccount = 'F7e4iBrxoSmHhEzhuBcXXs1KAknYvEoZWieiocPvrCD9'

          mock({
            provider,
            blockchain,
            request: {
              method: 'getTokenAccountBalance',
              to: tokenAccount,
              return: {
                amount: "10000617",
                decimals: 6,
                uiAmount: 10.000617,
                uiAmountString: "10.000617"
              }
            }
          })
          
          let token = new Token({ blockchain, address: tokenAddress })
          let balance = await token.balance(account)
          expect(balance.toString()).toEqual('10000617')
        })

        it('provides the balance of the native token for the given account', async ()=> {

          mock({
            provider,
            blockchain,
            balance: {
              for: '2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1',
              return: 232111122321
            }
          })

          let token = new Token({ blockchain, address: Blockchains[blockchain].currency.address })
          let balance = await token.balance('2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1')

          expect(balance.toString()).toEqual('232111122321')
        })
      })
    })
  })
})
