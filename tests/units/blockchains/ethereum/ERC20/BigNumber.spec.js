import { Token } from '../../../../../src'
import ERC20 from '../../../../../src/blockchains/ethereum/ERC20'
import { mock, resetMocks } from 'depay-web3-mock'

describe('BigNumber', () => {

  beforeEach(resetMocks)
  afterEach(resetMocks)

  let blockchain = 'ethereum'

  it('provides a BigNumber function to convert humand readable amounts to blockchain BigNumbers', async ()=> {

    let tokenCallMock = mock({
      blockchain,
      call: {
        to: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
        api: ERC20,
        method: 'decimals',
        return: 18
      }
    })

    expect(
      (await Token.BigNumber({
        amount: 1,
        blockchain,
        address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb'
      })).toString()
    ).toEqual('1000000000000000000')
  });

  it('provides a BigNumber for a given float amount', async ()=> {

    let tokenCallMock = mock({
      blockchain,
      call: {
        to: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
        api: ERC20,
        method: 'decimals',
        return: 18
      }
    })

    expect(
      (await Token.BigNumber({
        amount: 0.1,
        blockchain,
        address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb'
      })).toString()
    ).toEqual('100000000000000000')
  });

  it('also provides a BigNumber if the passed token address is the placeholder for the native token itself', async ()=>{
    expect(
      (await Token.BigNumber({
        amount: 2,
        blockchain,
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
      })).toString()
    ).toEqual('2000000000000000000')
  })

  it('also allows to convert a BigNumber directly on an already initialized token', async ()=>{
    let tokenCallMock = mock({
      blockchain,
      call: {
        to: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
        api: ERC20,
        method: 'decimals',
        return: 18
      }
    })

    let token = new Token({ blockchain, address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb' })

    let amountBN = await token.BigNumber(20)

    expect(amountBN.toString()).toEqual('20000000000000000000')
  })
});
