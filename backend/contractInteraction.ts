import { Interface } from "@ethersproject/abi";
import { ethers, providers } from "ethers";
import { formatEther, formatUnits, parseUnits, splitSignature } from "ethers/lib/utils";
import { Chains } from "../lib/chains";
import { Currency } from "../lib/enums";

import mintAbi from "./abi/mintAbi.json"
import usdtAbi from "./abi/usdtAbi.json"
import { getProofForAddress } from "./whitelist";

const NFTContract = "0x90bf94f2b24021eeA74De30fF9a6849CCB450a3f"
const NFTContractAbi = new Interface(mintAbi)

const USDTContract = "0xFe2cB7E38262FAa2Aaf1a9B5eD6b3DAFd0A98Af6"
const USDTContractAbi = new Interface(usdtAbi)

// we let the user pay a little more eth, so the amount is sufficient, 
// even if the oracle price drops, while the tx is processed. The overpaid amount is refunded.
const ETH_PAYMENT_MULTIPLIER: number = 1.02;

// console.log(NFTContractAbi)

const DOMAIN = {
    name: "USD Coin",
    version: "2",
    chainId: "0x04",
    verifyingContract: "0x1F8F51a93930D106C22Fc96c5DC0A6A518a78789"
}
const types = {
    ReceiveWithAuthorization: [
        {
            name: "from",
            type: "address"
        },
        {
            name: "to",
            type: "address"
        },
        {
            name: "value",
            type: "uint256"
        },
        {
            name: "validAfter",
            type: "uint256"
        },
        {
            name: "validBefore",
            type: "uint256"
        },
        {
            name: "nonce",
            type: "bytes32"
        }
    ]
}


export const mintSingle = async (provider: providers.Web3Provider | undefined, address: string, mintingFee: number, currency: Currency, activePhase: number) => {
    if (!provider) {
        return
    }

    const signer = provider.getSigner()

    const contract = new ethers.Contract(
        NFTContract,
        NFTContractAbi,
        signer
    );

    const proof = activePhase === 3 ? [] : getProofForAddress(address, activePhase)

    if (currency === Currency.USDT) {
        const transaction = await contract.mintSingle("0xFe2cB7E38262FAa2Aaf1a9B5eD6b3DAFd0A98Af6", proof)
        return transaction

    } else if (currency === Currency.ETH) {

        const currentEthPrice = +formatUnits(await contract.getLatestEthPrice(), 6)
        const finalMintingFee = mintingFee * ETH_PAYMENT_MULTIPLIER
        const value = ethers.utils.parseEther((finalMintingFee / currentEthPrice).toString())

        if (address && +formatEther(await provider.getBalance(address)) > (finalMintingFee / currentEthPrice)) {
            const transaction = await contract.mintSingle("0x0000000000000000000000000000000000000000", proof, { value })
            return transaction
        }


    } else if (currency === Currency.USDC) {
        const usdcContract = new ethers.Contract(
            "0x1F8F51a93930D106C22Fc96c5DC0A6A518a78789",
            USDTContractAbi,
            signer
        );

        const hexNonce = ethers.utils.keccak256('0xfff' + Date.now())
        const value = {
            from: address,
            to: NFTContract,  // testing contract address on rinkeby or prod address on mainnet
            value: +parseUnits('' + mintingFee, 6), // minting fee * amount
            validAfter: 0,  // 0
            validBefore: ethers.constants.MaxUint256, // approximate end of sale is specified in the contract. For Testing:  2**256 - 1
            nonce: hexNonce // has to be unique for the user
        }

        const sig = await signer._signTypedData(DOMAIN, types, value)
        const splittedSig = splitSignature(sig)

        const transaction = await contract.mintWithUSDCPermit(1, proof, hexNonce, splittedSig.v, splittedSig.r, splittedSig.s)
        return transaction
    }

}


export const mintMany = async (provider: providers.Web3Provider | undefined, address: string, mintingFee: number, currency: Currency, quantity: number, activePhase: number) => {
    if (!provider) {
        return
    }

    const signer = provider.getSigner()

    const contract = new ethers.Contract(
        NFTContract,
        NFTContractAbi,
        signer
    );

    const proof = activePhase === 3 ? [] : getProofForAddress(address, activePhase)

    if (currency === Currency.USDT) {

        const transaction = await contract.mintMany("0xFe2cB7E38262FAa2Aaf1a9B5eD6b3DAFd0A98Af6", quantity, proof)
        return transaction

    } else if (currency === Currency.ETH) {

        const currentEthPrice = +formatUnits(await contract.getLatestEthPrice(), 6)
        const finalMintingFee = quantity * mintingFee * ETH_PAYMENT_MULTIPLIER
        const value = ethers.utils.parseEther((finalMintingFee / currentEthPrice).toString())

        if (address && +formatEther(await provider.getBalance(address)) > (finalMintingFee / currentEthPrice)) {
            const transaction = await contract.mintMany("0x0000000000000000000000000000000000000000", quantity, proof, { value })
            return transaction
        }


    } else if (currency === Currency.USDC) {
        const usdcContract = new ethers.Contract(
            "0x1F8F51a93930D106C22Fc96c5DC0A6A518a78789",
            USDTContractAbi,
            signer
        );

        const hexNonce = ethers.utils.keccak256('0xfff' + Date.now())
        const value = {
            from: address,
            to: NFTContract,  // testing contract address on rinkeby or prod address on mainnet
            value: +parseUnits('' + (mintingFee * quantity), 6), // minting fee * amount
            validAfter: 0,  // 0
            validBefore: ethers.constants.MaxUint256, // approximate end of sale is specified in the contract. For Testing:  2**256 - 1
            nonce: hexNonce // has to be unique for the user
        }

        const sig = await signer._signTypedData(DOMAIN, types, value)
        const splittedSig = splitSignature(sig)

        const transaction = await contract.mintWithUSDCPermit(quantity, proof, hexNonce, splittedSig.v, splittedSig.r, splittedSig.s)
        return transaction
    }

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
    const currentEthPrice = await contract.getLatestEthPrice()
    const phaseConfig = await contract.getPhaseConfig(activePhase)

    return { activePhase, totalSupply, currentEthPrice, phaseConfig }
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

export const getBalances = async (provider: providers.Web3Provider | undefined, chainId: number | undefined, address: string) => {

    let contractProvider;
    if (!provider || chainId !== Chains.ETHEREUM_RINKEBY.chainId) {
        contractProvider = new ethers.providers.InfuraProvider(Chains.ETHEREUM_RINKEBY.chainId, "03bfd7b76f3749c8bb9f2c91bdba37f3")
    } else {
        contractProvider = provider
    }

    const usdcContract = new ethers.Contract(
        "0x1F8F51a93930D106C22Fc96c5DC0A6A518a78789",
        USDTContractAbi,
        contractProvider
    );

    const usdtContract = new ethers.Contract(
        "0xFe2cB7E38262FAa2Aaf1a9B5eD6b3DAFd0A98Af6",
        USDTContractAbi,
        contractProvider
    );

    const usdcBalance = +(await usdcContract.balanceOf(address)) / 1000000
    const usdtBalance = +(await usdtContract.balanceOf(address)) / 1000000
    const ethBalance = Math.round(+formatEther(await contractProvider.getBalance(address)) * 1000) / 1000
    console.log(usdcBalance, usdtBalance, ethBalance)

    return { usdcBalance, usdtBalance, ethBalance }
}
