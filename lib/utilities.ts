import { supportedChains } from './chains'
import { IChainData } from './types'
import { MerkleTree } from "merkletreejs"
import { keccak256 } from "ethereum-cryptography/keccak"
import { ethers } from "ethers";


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



export function splitSig(sig: string) {
  if (sig.length != 132) throw "invalid signature length";
  let signatureWithoutPrefix = sig.slice(2);
  return {
    v: '0x' + signatureWithoutPrefix.slice(128, 130),
    r: '0x' + signatureWithoutPrefix.slice(0, 64),
    s: '0x' + signatureWithoutPrefix.slice(64, 128)
  }
}

export function getLeaf(account: string) {
  return Buffer.from(
    ethers.utils.solidityKeccak256(['address'], [account]).slice(2), 'hex'
  );
}

export function getProof(account: string, WhitelistArray: any[]): string[] {
  const leaves = WhitelistArray.map(address => getLeaf(address));
  const tree = new MerkleTree(leaves, keccak256, { sort: true });
  return tree.getHexProof(getLeaf(account));
}