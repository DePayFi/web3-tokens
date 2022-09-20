import { ACCOUNT_LAYOUT } from '@depay/solana-web3.js'
import { mock, resetMocks } from '@depay/web3-mock'
import { resetCache, provider } from '@depay/web3-client'
import { supported } from 'src/blockchains'
import { Token } from 'src'

describe('createTransferInstruction', () => {

  supported.solana.forEach((blockchain)=>{

    beforeEach(resetCache)
    beforeEach(resetMocks)

    it('creates a basic token transfer instruction', async ()=> {

      let token = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
      let amount = '1000000'
      let from = '2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1'
      let to = '5AcFMJZkXo14r3Hj99iYd1HScPiM4hAcLZf552DfZkxa'
      let fromTokenAccount = 'F7e4iBrxoSmHhEzhuBcXXs1KAknYvEoZWieiocPvrCD9'
      let toTokenAccount = '9vNeT1wshV1hgicUYJj7E68CXwU4oZRgtfDf5a2mMn7y'

      mock({
        blockchain,
        provider: provider(blockchain),
        request: {
          to: fromTokenAccount,
          api: ACCOUNT_LAYOUT,
          return: {
            amount: '6774847',
            mint: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
            owner: from,
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

      mock({
        blockchain,
        provider: provider(blockchain),
        request: {
          to: toTokenAccount,
          api: ACCOUNT_LAYOUT,
          return: {
            amount: '6774847',
            mint: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
            owner: to,
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

      let instruction = await Token.solana.createTransferInstruction({ 
        token,
        amount,
        from,
        to
      })

      expect(instruction.keys[0].pubkey.toString()).toEqual(fromTokenAccount)
      expect(instruction.keys[1].pubkey.toString()).toEqual(toTokenAccount)
      expect(instruction.keys[2].pubkey.toString()).toEqual(from)
      expect(instruction.programId.toString()).toEqual(Token.solana.TOKEN_PROGRAM)

      let decoded = Token.solana.TRANSFER_LAYOUT.decode(instruction.data)
      
      expect(decoded.instruction).toEqual(3)
      expect(decoded.amount.toString()).toEqual(amount)
    })
  })
})
