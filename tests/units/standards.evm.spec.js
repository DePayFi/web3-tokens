import { Token } from 'src/index.evm'

describe('Token', () => {
  describe('standards', () => {

    it('exports the "ethreum" standard token', async ()=> {
      expect(typeof(Token.ethereum.DEFAULT) != 'undefined').toEqual(true)
      expect(Token.ethereum.DEFAULT).toEqual(Token.ethereum.ERC20)
    })

    it('exports the "bsc" standard token', async ()=> {
      expect(typeof(Token.bsc.DEFAULT) != 'undefined').toEqual(true)
      expect(Token.bsc.DEFAULT).toEqual(Token.bsc.BEP20)
    })

    it('exports the "polygon" standard token', async ()=> {
      expect(typeof(Token.polygon.DEFAULT) != 'undefined').toEqual(true)
      expect(Token.polygon.DEFAULT).toEqual(Token.polygon.ERC20)
    })

    it('exports the "velas" standard token', async ()=> {
      expect(typeof(Token.velas.DEFAULT) != 'undefined').toEqual(true)
      expect(Token.velas.DEFAULT).toEqual(Token.velas.VRC20)
    })
  })
})
