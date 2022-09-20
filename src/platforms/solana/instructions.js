import findProgramAddress from './findProgramAddress'
import { SystemProgram, PublicKey, TransactionInstruction, Buffer, BN } from '@depay/solana-web3.js'
import { TOKEN_PROGRAM, ASSOCIATED_TOKEN_PROGRAM } from './constants'
import { TRANSFER_LAYOUT } from './layouts'

const createTransferInstruction = async ({ token, amount, from, to })=>{

  let fromTokenAccount = await findProgramAddress({ token, owner: from })
  let toTokenAccount = await findProgramAddress({ token, owner: to })

  const keys = [
    { pubkey: new PublicKey(fromTokenAccount), isSigner: false, isWritable: true },
    { pubkey: new PublicKey(toTokenAccount), isSigner: false, isWritable: true },
    { pubkey: new PublicKey(from), isSigner: true, isWritable: false }
  ]

  const data = Buffer.alloc(TRANSFER_LAYOUT.span)
  TRANSFER_LAYOUT.encode({
    instruction: 3, // TRANSFER
    amount: new BN(amount)
  }, data)
  
  return new TransactionInstruction({ 
    keys,
    programId: new PublicKey(TOKEN_PROGRAM),
    data 
  })
}

const createAssociatedTokenAccountInstruction = async ({ token, owner, payer }) => {

  let associatedToken = await findProgramAddress({ token, owner })

  const keys = [
    { pubkey: new PublicKey(payer), isSigner: true, isWritable: true },
    { pubkey: new PublicKey(associatedToken), isSigner: false, isWritable: true },
    { pubkey: new PublicKey(owner), isSigner: false, isWritable: false },
    { pubkey: new PublicKey(token), isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: new PublicKey(TOKEN_PROGRAM), isSigner: false, isWritable: false },
  ]

 return new TransactionInstruction({
    keys,
    programId: ASSOCIATED_TOKEN_PROGRAM,
    data: Buffer.alloc(0)
  })
}

export {
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
}
