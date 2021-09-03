import { Token } from 'src'
import ERC20 from 'src/blockchains/ethereum/ERC20'
import { mock, resetMocks } from 'depay-web3-mock'
import { resetCache, provider } from 'depay-web3-client'

describe('readable', () => {

  beforeEach(resetCache)
  beforeEach(resetMocks)

  let blockchain = 'ethereum'

  beforeEach(()=> {
    mock({
      provider: provider(blockchain),
      blockchain,
      call: {
        to: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
        api: ERC20,
        method: 'decimals',
        return: 18
      }
    })
  })

  it('turns a given BigInt number into a human-readable number', async ()=> {

    expect(
      (await Token.readable({
        amount: '1231251211232111000000000',
        blockchain,
        address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb'
      })).toString()
    ).toEqual('1231251.211232111')

    expect(
      await (new Token({ blockchain, address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb' }))
      .readable('1231251211232111000000000')
    ).toEqual('1231251.211232111')

    expect(
      (await Token.readable({
        amount: '1231251000000000000000000',
        blockchain,
        address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb'
      })).toString()
    ).toEqual('1231251')

    expect(
      await (new Token({ blockchain, address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb' }))
      .readable('1231251000000000000000000')
    ).toEqual('1231251')

    expect(
      (await Token.readable({
        amount: '1231251100000000000000000',
        blockchain,
        address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb'
      })).toString()
    ).toEqual('1231251.1')

    expect(
      await (new Token({ blockchain, address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb' }))
      .readable('1231251100000000000000000')
    ).toEqual('1231251.1')
  })
});
