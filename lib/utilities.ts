import { supportedChains } from './chains'
import { IChainData } from './types'


export function getChainData(chainId: number | undefined): IChainData | undefined {
  if (!chainId) {
    return
  }

  const chainData = supportedChains.filter(
    (chain: IChainData) => chain.chainId === chainId
  )[0]

  return chainData
}

export function ellipseAddress(address = '', width = 5): string {
  if (!address) {
    return ''
  }
  return `${address.slice(0, width)}...${address.slice(-width)}`
}
