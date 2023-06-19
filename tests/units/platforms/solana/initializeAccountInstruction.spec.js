import { mock, resetMocks } from '@depay/web3-mock'
import { resetCache, getProvider } from '@depay/web3-client'
import { supported } from 'src/blockchains'
import { SystemProgram } from '@depay/solana-web3.js'
import Token from 'src'
import { TOKEN_PROGRAM } from 'src/platforms/solana/constants'

describe('initializeAccountInstruction', () => {

  supported.solana.forEach((blockchain)=>{

    describe(blockchain, ()=>{

      let provider
      
      beforeEach(async()=>{
        resetCache()
        resetMocks()
        provider = await getProvider(blockchain)
      })

      it('provides a initialize token account instruction', async ()=> {

        let account = 'EFjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
        let token = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
        let owner = '2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1'

        mock({
          blockchain,
          provider,
        })

        let instruction = Token.solana.initializeAccountInstruction({ 
          account,
          token,
          owner,
        })

        expect(instruction.keys[0].pubkey.toString()).toEqual(account)
        expect(instruction.keys[1].pubkey.toString()).toEqual(token)
        expect(instruction.programId.toString()).toEqual(Token.solana.TOKEN_PROGRAM)
      })
    })
  })
})
