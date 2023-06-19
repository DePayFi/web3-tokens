import Token from 'src'

describe('Token', () => {
  describe('standards', () => {

    it('exports the "ethreum" standard token', async ()=> {
      expect(typeof(Token.ethereum.DEFAULT) != 'undefined').toEqual(true)
      expect(Token.ethereum.DEFAULT).toEqual(Token.ethereum.ERC20)
      expect(Token.ethereum['20']).toEqual(Token.ethereum.ERC20)
    })

    it('exports the "bsc" standard token', async ()=> {
      expect(typeof(Token.bsc.DEFAULT) != 'undefined').toEqual(true)
      expect(Token.bsc.DEFAULT).toEqual(Token.bsc.BEP20)
      expect(Token.bsc['20']).toEqual(Token.bsc.BEP20)
    })

    it('exports the "polygon" standard token', async ()=> {
      expect(typeof(Token.polygon.DEFAULT) != 'undefined').toEqual(true)
      expect(Token.polygon.DEFAULT).toEqual(Token.polygon.ERC20)
      expect(Token.polygon['20']).toEqual(Token.polygon.ERC20)
    })

    it('exports Solana standards for layout and metadata account', async ()=> {
      expect(typeof(Token.solana.MINT_LAYOUT) != 'undefined').toEqual(true)
      expect(typeof(Token.solana.METADATA_LAYOUT) != 'undefined').toEqual(true)
      expect(typeof(Token.solana.METADATA_ACCOUNT) != 'undefined').toEqual(true)
    })
  })
})
