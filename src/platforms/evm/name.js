/*#if _EVM

import { request } from '@depay/web3-client-evm'

/*#elif _SVM

import { request } from '@depay/web3-client-svm'

//#else */

import { request } from '@depay/web3-client'

//#endif

const uriAPI = [{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"uri","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}]

const uriToName = (tokenURI)=>{
  return new Promise((resolve)=>{
    if(tokenURI.match(/^ipfs/)) {
      tokenURI = `https://ipfs.io/ipfs/${tokenURI.split('://')[1]}`
    }
    fetch(tokenURI).then((response) => {
      if (response.ok) { return response.json() }
      resolve()
    })
    .then((responseJson) => {
      if(responseJson) {
        let name = responseJson.name
        if(name){
          resolve(name)
        } else {
          resolve()
        }
      }
    }).catch(()=>resolve())
  })
}

export default ({ blockchain, address, api, id })=>{

  if(id) {
    return new Promise((resolve)=>{
      request({ blockchain, address, api: uriAPI, method: 'uri', params: [id] }).then((uri)=>{
        uri = uri.match('0x{id}') ? uri.replace('0x{id}', id) : uri
        uriToName(uri).then(resolve)
      }).catch((error)=>{
        console.log('error', error)
        resolve()
      })
    })
  } else {
    return request(
      {
        blockchain: blockchain,
        address: address,
        api,
        method: 'name',
        cache: 86400000, // 1 day
      },
    )
  }
}
