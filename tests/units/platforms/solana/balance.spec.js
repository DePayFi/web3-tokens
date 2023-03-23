import { Buffer } from '@depay/solana-web3.js'
import Blockchains from '@depay/web3-blockchains'
import { mock, resetMocks } from '@depay/web3-mock'
import { resetCache, getProvider } from '@depay/web3-client'
import { supported } from 'src/blockchains'
import { Token } from 'src'

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
          let tokenAccounts = ['3JdKXacGdntfNKXzSGC2EwUDKFPrXdsqowbuc9hEiNBb', 'FjtHL8ki3GXMhCqY2Lum9CCAv5tSQMkhJEnXbEkajTrZ', 'F7e4iBrxoSmHhEzhuBcXXs1KAknYvEoZWieiocPvrCD9']

          mock({
            provider,
            blockchain,
            request: {
              method: 'getProgramAccounts',
              to: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
              params: { 
                filters: [
                  { dataSize: 165 },
                  { memcmp: { offset: 32, bytes: account }},
                  { memcmp: { offset: 0, bytes: tokenAddress }}
                ]
              },
              return: tokenAccounts.map((account)=>{
                return {
                  account: { data: new Buffer([]), executable: false, lamports: 2039280, owner: tokenAddress, rentEpoch: 327 },
                  pubkey: account
                }
              })
            }
          })

          tokenAccounts.forEach((account)=>{
            mock({
              provider,
              blockchain,
              request: {
                method: 'getTokenAccountBalance',
                to: account,
                return: {
                  amount: "10000617",
                  decimals: 6,
                  uiAmount: 10.000617,
                  uiAmountString: "10.000617"
                }
              }
            })
          })
          
          let token = new Token({ blockchain, address: tokenAddress })
          let balance = await token.balance(account)
          expect(balance.toString()).toEqual('30001851')
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
