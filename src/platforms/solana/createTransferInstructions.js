import findProgramAddress from './findProgramAddress'
import { PublicKey, TransactionInstruction, Buffer, BN } from '@depay/solana-web3.js'
import { TOKEN_PROGRAM } from './constants'
import { TRANSFER_LAYOUT } from './layouts'

export default async ({ token, amount, from, to })=>{

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
  
  return [new TransactionInstruction({ keys, programId: new PublicKey(TOKEN_PROGRAM), data })]
}
