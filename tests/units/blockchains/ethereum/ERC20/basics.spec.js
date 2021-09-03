import ERC20 from 'src/blockchains/ethereum/ERC20'
import { mock, resetMocks } from 'depay-web3-mock'
import { Token } from 'src'
import { resetCache, provider } from 'depay-web3-client'

describe('Token', () => {

  beforeEach(resetCache)
  beforeEach(resetMocks)

  let blockchain = 'ethereum'

  it('retrieves basic token data from the blockchain', async ()=> {

    let tokenNameMock = mock({
      provider: provider(blockchain),
      blockchain,
      call: {
        to: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
        api: ERC20,
        method: 'name',
        return: "DePay"
      }
    })

    let tokenSymbolMock = mock({
      provider: provider(blockchain),
      blockchain,
      call: {
        to: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
        api: ERC20,
        method: 'symbol',
        return: "DEPAY"
      }
    })

    let tokenDecimalMock = mock({
      provider: provider(blockchain),
      blockchain,
      call: {
        to: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
        api: ERC20,
        method: 'decimals',
        return: 18
      }
    })

    let token = new Token({
      blockchain,
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
      blockchain,
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
    });

    expect(token.address).toEqual('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')
    expect(await token.decimals()).toEqual(18)
    expect(await token.symbol()).toEqual('ETH')
    expect(await token.name()).toEqual('Ether')

  });
});
