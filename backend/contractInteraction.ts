import { Interface } from "@ethersproject/abi";
import { ethers, providers } from "ethers";
import { Chains } from "../lib/chains";

import mintAbi from "./abi/mintAbi.json"
import usdtAbi from "./abi/usdtAbi.json"


const NFTContract = "0x3DB9a7E0BB5c6A87dBe2419DAA9320d7B508322A"
const NFTContractAbi = new Interface(mintAbi)

const USDTContract = "0xFe2cB7E38262FAa2Aaf1a9B5eD6b3DAFd0A98Af6"
const USDTContractAbi = new Interface(usdtAbi)

console.log(NFTContractAbi)


export const mintOne = async (provider: providers.Web3Provider | undefined) => {
    if (!provider) {
        return
    }

    const signer = provider.getSigner()

    const contract = new ethers.Contract(
        NFTContract,
        NFTContractAbi,
        signer
    );


    const transaction = await contract.mint("0xFe2cB7E38262FAa2Aaf1a9B5eD6b3DAFd0A98Af6", [])
    return transaction
}


export const mintNFTs = async (provider: providers.Web3Provider | undefined, quantity: number) => {
    if (!provider) {
        return
    }

    const signer = provider.getSigner()

    const contract = new ethers.Contract(
        NFTContract,
        NFTContractAbi,
        signer
    );


    const transaction = await contract.mint("0xFe2cB7E38262FAa2Aaf1a9B5eD6b3DAFd0A98Af6", quantity, [])
    return transaction
}


export const getContractInfo = async (provider: providers.Web3Provider | undefined, chainId: number | undefined) => {

    let contractProvider;
    if (!provider || chainId !== Chains.ETHEREUM_RINKEBY.chainId) {
        contractProvider = new ethers.providers.InfuraProvider(Chains.ETHEREUM_RINKEBY.chainId, "03bfd7b76f3749c8bb9f2c91bdba37f3")
    } else {
        contractProvider = provider
    }

    const contract = new ethers.Contract(
        NFTContract,
        NFTContractAbi,
        contractProvider
    );

    const activePhase = await contract.getActivePhase()
    const totalSupply = await contract.totalSupply()
    const phaseConfig = await contract.getPhaseConfig(activePhase)

    return { activePhase, totalSupply, phaseConfig }
}


export const getUSDTAllowance = async (provider: providers.Web3Provider | undefined, address: string | undefined) => {
    if (!provider || !address) {
        return
    }

    const contract = new ethers.Contract(
        USDTContract,
        USDTContractAbi,
        provider
    );

    const result = await contract.allowance(address, NFTContract)
    return result
}


export const approveUSDT = async (provider: providers.Web3Provider | undefined, address: string | undefined) => {
    if (!provider || !address) {
        return
    }

    const signer = provider.getSigner()

    const contract = new ethers.Contract(
        USDTContract,
        USDTContractAbi,
        signer
    );

    const result = await contract.approve(NFTContract, ethers.constants.MaxUint256)
    return result
}
