import { mock, resetMocks } from '@depay/web3-mock'
import { Token } from 'src'
import { resetCache, provider } from '@depay/web3-client'
import { CONSTANTS } from '@depay/web3-constants'

describe('Token', () => {

  ['ethereum', 'bsc', 'polygon'].forEach((blockchain)=>{

    beforeEach(resetCache)
    beforeEach(resetMocks)

    it('returns 0 if decimal request fails', async ()=> {

      let tokenDecimalMock = mock({
        provider: provider(blockchain),
        blockchain,
        call: {
          to: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
          api: Token[blockchain].DEFAULT,
          method: 'decimals',
          return: Error('SOMETHING WENT WRONG')
        }
      })

      let token = new Token({
        blockchain,
        address: '0xa0bed124a09ac2bd941b10349d8d224fe3c955eb'
      });

      expect(token.address).toEqual('0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb')
      expect(await token.decimals()).toEqual(0)
    });
  });
});
