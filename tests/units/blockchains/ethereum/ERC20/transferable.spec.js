import { CONSTANTS } from 'depay-web3-constants'
import ERC20 from 'src/blockchains/ethereum/ERC20'
import { mock, resetMocks } from 'depay-web3-mock'
import { Token } from 'src'

describe('Token', () => {
  describe('transferable', () => {

    let token
    let tokenAddress = '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb'
    let blockchain = 'ethereum'
    const accounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']

    beforeEach(()=>{
      resetMocks()
      mock({ blockchain, accounts: { return: accounts } })

      token = new Token({
        blockchain,
        address: tokenAddress
      })
    })

    afterEach(resetMocks)

    it('confirms that a token is transferable', async ()=> {
      let estimateMock = mock({
        blockchain,
        estimate: {
          api: ERC20,
          to: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb',
          method: 'transfer',
          return: '100'
        }
      })
      let transferable = await token.transferable()
      expect(transferable).toEqual(true)
      expect(estimateMock).toHaveBeenCalled()
    })

    it('informs you that a token is not transferable', async ()=> {
      let estimateMock = mock({
        blockchain,
        estimate: {
          api: ERC20,
          to: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb',
          method: 'transfer',
          return: Error("Couldn't transfer token")
        }
      })
      let transferable = await token.transferable()
      expect(transferable).toEqual(false)
      expect(estimateMock).toHaveBeenCalled()
    })

    it('returns true for native tokens immediatelly', async ()=> {

      mock({ blockchain, require: 'estimate' })

      let token = new Token({ blockchain, address: CONSTANTS.ethereum.NATIVE })
      let transferable = await token.transferable()

      expect(transferable).toEqual(true)
    })
  })
})
