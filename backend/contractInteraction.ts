import { Interface } from "@ethersproject/abi";
import { ethers, providers } from "ethers";

import mintAbi from "./abi/mintAbi.json"


const NFTContract = "0x657c7E3b1D32bc4e757a2648A004D2F50D83d6a0"
const NFTContractAbi = new Interface(mintAbi)


export const mintNFT = async (provider: providers.Web3Provider | undefined, quantity: number) => {
    if (!provider) {
        return
    }

    const signer = provider.getSigner()

    const contract = new ethers.Contract(
        NFTContract,
        NFTContractAbi,
        signer
    );
    
    let value;
    if (process.env.NEXT_PUBLIC_PRICE) {
        value = +process.env.NEXT_PUBLIC_PRICE * quantity
        value = ethers.utils.parseEther(value.toString())
    }

    const transaction = await contract.mint(quantity, {value})
    return transaction
}

export const getNFTQuantity = async (provider: providers.Web3Provider | undefined, address: string | undefined) => {
    if (!provider || !address) {
        return
    }

    const contract = new ethers.Contract(
        NFTContract,
        NFTContractAbi,
        provider
    );

    const transaction = await contract.balanceOf(address)
    return transaction
}



export const getNFTs = async (provider: providers.Web3Provider | undefined, address: string | undefined, quantity: number) => {
    if (!provider || !address) {
        return
    }

    const contract = new ethers.Contract(
        NFTContract,
        NFTContractAbi,
        provider
    );

    let NFTData: {[key: number]: string} = {}
    for (let i = 0; i < quantity; i++) {
        const id = (await (contract.tokenOfOwnerByIndex(address, i))).toNumber()
        const response = await fetch(`https://herodev.mypinata.cloud/ipfs/QmZkBRtq8ZGNSbtThv8ppJwgY8dYsyhmmA8dUgAPmQ2cMD/${id}.json`)
        const data = await response.json()
        NFTData[id] = data.image
    }

    return NFTData
}
