import ERC20 from '../../src/ERC20'
import { mock, resetMocks } from 'depay-web3mock'
import { Token } from 'dist/cjs/index.js'

describe('Token', () => {

  beforeEach(resetMocks)
  afterEach(resetMocks)

  it('retrieves basic token data from the blockchain', async ()=> {

    let tokenNameMock = mock({
      blockchain: 'ethereum',
      call: {
        to: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
        api: ERC20,
        method: 'name',
        return: "DePay"
      }
    })

    let tokenSymbolMock = mock({
      blockchain: 'ethereum',
      call: {
        to: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
        api: ERC20,
        method: 'symbol',
        return: "DEPAY"
      }
    })

    let tokenDecimalMock = mock({
      blockchain: 'ethereum',
      call: {
        to: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
        api: ERC20,
        method: 'decimals',
        return: 18
      }
    })

    let token = new Token({
      blockchain: 'ethereum',
      address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb'
    });

    expect(token.address).toEqual('0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb')
    expect(await token.decimals()).toEqual(18)
    expect(await token.symbol()).toEqual('DEPAY')
    expect(await token.name()).toEqual('DePay')

    expect(tokenNameMock).toHaveBeenCalledTimes(1)
    expect(tokenSymbolMock).toHaveBeenCalledTimes(1)
    expect(tokenDecimalMock).toHaveBeenCalledTimes(1)

    // caches calls up to 1 day:

    expect(await token.decimals()).toEqual(18)
    expect(await token.symbol()).toEqual('DEPAY')
    expect(await token.name()).toEqual('DePay')

    expect(tokenNameMock).toHaveBeenCalledTimes(1) // still just 1
    expect(tokenSymbolMock).toHaveBeenCalledTimes(1) // still just 1
    expect(tokenDecimalMock).toHaveBeenCalledTimes(1) // still just 1
  });

  it('provides basic token data also for the native tokens', async ()=> {

    let token = new Token({
      blockchain: 'ethereum',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
    });

    expect(token.address).toEqual('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')
    expect(await token.decimals()).toEqual(18)
    expect(await token.symbol()).toEqual('ETH')
    expect(await token.name()).toEqual('Ether')

  });
});
