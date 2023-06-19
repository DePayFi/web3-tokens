import { mock, resetMocks } from '@depay/web3-mock'
import { resetCache, getProvider } from '@depay/web3-client'
import { supported } from 'src/blockchains'
import { SystemProgram } from '@depay/solana-web3.js'
import Token from 'src'
import { TOKEN_PROGRAM, ASSOCIATED_TOKEN_PROGRAM } from 'src/platforms/solana/constants'

describe('createAssociatedTokenAccountInstruction', () => {

  supported.solana.forEach((blockchain)=>{

    describe(blockchain, ()=>{

      let provider
      
      beforeEach(async()=>{
        resetCache()
        resetMocks()
        provider = await getProvider(blockchain)
      })

      it('provides a create associated token account instruction', async ()=> {

        let token = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
        let from = '2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1'
        let fromTokenAccount = 'F7e4iBrxoSmHhEzhuBcXXs1KAknYvEoZWieiocPvrCD9'

        mock({
          blockchain,
          provider,
        })

        let instruction = await Token.solana.createAssociatedTokenAccountInstruction({ 
          token,
          owner: from,
          payer: from
        })

        expect(instruction.keys[0].pubkey.toString()).toEqual(from)
        expect(instruction.keys[1].pubkey.toString()).toEqual(fromTokenAccount)
        expect(instruction.keys[2].pubkey.toString()).toEqual(from)
        expect(instruction.keys[3].pubkey.toString()).toEqual(token)
        expect(instruction.keys[4].pubkey.toString()).toEqual(SystemProgram.programId.toString())
        expect(instruction.keys[5].pubkey.toString()).toEqual(TOKEN_PROGRAM)
        expect(instruction.programId.toString()).toEqual(Token.solana.ASSOCIATED_TOKEN_PROGRAM)
      })
    })
  })
})
