import { Interface } from "@ethersproject/abi";
import { ethers, providers } from "ethers";
import { formatEther, formatUnits, parseUnits } from "ethers/lib/utils";
import { Chains } from "../lib/chains";
import { Currency } from "../lib/enums";

import mintAbi from "./abi/mintAbi.json"
import usdtAbi from "./abi/usdtAbi.json"


const NFTContract = "0xe9c832BD6c97b38E066092861E3A26793507Db38"
const NFTContractAbi = new Interface(mintAbi)

const USDTContract = "0xFe2cB7E38262FAa2Aaf1a9B5eD6b3DAFd0A98Af6"
const USDTContractAbi = new Interface(usdtAbi)

console.log(USDTContractAbi)


export const mintSingle = async (provider: providers.Web3Provider | undefined, mintingFee: number, currency: Currency) => {
    if (!provider) {
        return
    }

    const signer = provider.getSigner()

    const contract = new ethers.Contract(
        NFTContract,
        NFTContractAbi,
        signer
    );



    if (currency === Currency.USDT) {
        const transaction = await contract.mintSingle("0xFe2cB7E38262FAa2Aaf1a9B5eD6b3DAFd0A98Af6", [])
        return transaction
    } else if (currency === Currency.ETH) {
        const ethContract = new ethers.Contract(
            "0x01BE23585060835E02B77ef475b0Cc51aA1e0709",
            USDTContractAbi,
            signer
        );
        console.log(formatEther(await ethContract.balanceOf("0xFca6b83AfBBB0d66A13a06Ec31fA8e27E5188ca8")))
        const currentEthPrice = +formatUnits(await contract.getLatestEthPrice(), 6) * 1.01
        let value
        value = (+mintingFee * 1) * 1.01
        value = ethers.utils.parseEther((value / currentEthPrice).toString())
        // console.log(value)
        console.log()
        const transaction = await contract.mintSingle("0x01BE23585060835E02B77ef475b0Cc51aA1e0709", [], { value })
        return transaction
    } else if (currency === Currency.USDC) {
        const usdcContract = new ethers.Contract(
            "0x1F8F51a93930D106C22Fc96c5DC0A6A518a78789",
            USDTContractAbi,
            signer
        );
        const nonce = await usdcContract.nonces("0xFca6b83AfBBB0d66A13a06Ec31fA8e27E5188ca8")
        console.log(nonce)
        console.log(formatEther(await usdcContract.nonces("0xFca6b83AfBBB0d66A13a06Ec31fA8e27E5188ca8")))
        const transaction = await contract.mintWithUSDCPermit(1, [], nonce, )
        // return transaction
    }


}


export const mintMany = async (provider: providers.Web3Provider | undefined, quantity: number) => {
    if (!provider) {
        return
    }

    const signer = provider.getSigner()

    const contract = new ethers.Contract(
        NFTContract,
        NFTContractAbi,
        signer
    );


    const transaction = await contract.mintMany("0xFe2cB7E38262FAa2Aaf1a9B5eD6b3DAFd0A98Af6", quantity, [])
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
