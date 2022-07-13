import { mock, resetMocks } from '@depay/web3-mock'
import { Token } from 'src'
import { resetCache, provider } from '@depay/web3-client'
import { CONSTANTS } from '@depay/web3-constants'

describe('Token', () => {

  ['ethereum', 'bsc', 'polygon'].forEach((blockchain)=>{

    beforeEach(resetCache)
    beforeEach(resetMocks)

    it('retrieves basic token data from the blockchain', async ()=> {

      let tokenNameMock = mock({
        provider: provider(blockchain),
        blockchain,
        request: {
          to: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
          api: Token[blockchain].DEFAULT,
          method: 'name',
          return: "DePay"
        }
      })

      let tokenSymbolMock = mock({
        provider: provider(blockchain),
        blockchain,
        request: {
          to: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
          api: Token[blockchain].DEFAULT,
          method: 'symbol',
          return: "DEPAY"
        }
      })

      let tokenDecimalMock = mock({
        provider: provider(blockchain),
        blockchain,
        request: {
          to: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
          api: Token[blockchain].DEFAULT,
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
      expect(await token.symbol()).toEqual(CONSTANTS[blockchain].SYMBOL)
      expect(await token.name()).toEqual(CONSTANTS[blockchain].CURRENCY)
    });
  });
});
