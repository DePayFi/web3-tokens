import { getMetaData } from './metadata'

export default async ({ blockchain, address })=>{
  let metaData = await getMetaData({ blockchain, address })
  return metaData?.symbol
}
