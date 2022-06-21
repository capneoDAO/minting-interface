import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { formatEther, formatUnits } from "@ethersproject/units"

import { getBalances, getContractInfo } from "./contractInteraction"
import { Chains } from "../lib/chains"

interface Balances {
    usdcBalance: number;
    usdtBalance: number;
    ethBalance: number;
}

export default function useContractInfo(web3Provider: ethers.providers.Web3Provider | undefined, address: string | undefined, chainId: number | undefined) {

    const [activePhase, setActivePhase] = useState(0)
    const [maxSupply, setMaxSupply] = useState(0)
    const [mintingFee, setMintingFee] = useState(0)
    const [currentEthPrice, setCurrentEthPrice] = useState(0)
    const [totalSupply, setTotalSupply] = useState(0)
    const [balances, setBalances] = useState<Balances>()

    const [loading, setLoading] = useState(true)


    useEffect(() => {
        let active = true

        const setStates = async () => {
            let activePhase = 0
            let maxSupply = 0
            let mintingFee = 0
            let currentEthPrice = 0
            let totalSupply = 0
            let balances;

            const contractInfo = await getContractInfo(web3Provider, chainId)
            activePhase = contractInfo.activePhase
            maxSupply = parseInt(contractInfo.phaseConfig.maxSupply)
            mintingFee = parseInt(contractInfo.phaseConfig.mintingFee) / 1000000
            currentEthPrice = +formatUnits(contractInfo.currentEthPrice, 6)
            totalSupply = parseInt(contractInfo.totalSupply)

            if (address) {
                balances = await getBalances(web3Provider, chainId, address)
                setBalances(balances)
            }

            return { activePhase, maxSupply, mintingFee, currentEthPrice, totalSupply, balances }
        }

        setStates().then(({ activePhase, maxSupply, mintingFee, currentEthPrice, totalSupply, balances }) => {
            if (active) {
                setActivePhase(activePhase)
                setMaxSupply(maxSupply)
                setMintingFee(mintingFee)
                setCurrentEthPrice(currentEthPrice)
                setTotalSupply(totalSupply)
                setBalances(balances)
                setLoading(false)
            }
        })

        return () => { active = false; setLoading(true) }

    }, [web3Provider, address, chainId])


    return { activePhase, maxSupply, mintingFee, currentEthPrice, totalSupply, balances }
}