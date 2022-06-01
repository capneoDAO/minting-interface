import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { formatEther } from "@ethersproject/units"

import { getContractInfo } from "./contractInteraction"
import { Chains } from "../lib/chains"


export default function useContractInfo(web3Provider: ethers.providers.Web3Provider | undefined, address: string | undefined, chainId: number | undefined) {

    const [activePhase, setActivePhase] = useState(0)
    const [maxSupply, setMaxSupply] = useState(0)
    const [mintingFee, setMintingFee] = useState(0)
    const [totalSupply, setTotalSupply] = useState(0)

    const [loading, setLoading] = useState(true)


    useEffect(() => { 
        let active = true

        const setStates = async () => {
            let activePhase = 0
            let maxSupply = 0
            let mintingFee = 0
            let totalSupply = 0

            const contractInfo  = await getContractInfo(web3Provider, chainId)
            activePhase = contractInfo.activePhase
            maxSupply = parseInt(contractInfo.phaseConfig.maxSupply)
            mintingFee = parseInt(contractInfo.phaseConfig.mintingFee)/1000000
            totalSupply = parseInt(contractInfo.totalSupply)

            // if (web3Provider && address && chainId === Chains.MATIC_MAINNET.chainId) {
            //     const reward = await calcReward(web3Provider, address)
            //     totalStaked = formatEther(reward.staked)
            //     earned = formatEther(reward.earned)

            //     allowance = formatEther(await getMGHAllowance(web3Provider, address))

            //     if (+allowance) {
            //         balance = formatEther(await getMGHBalance(web3Provider, address))
            //     } 
            // }

            return { activePhase, maxSupply, mintingFee, totalSupply }
        }

        setStates().then(({ activePhase, maxSupply, mintingFee, totalSupply }) => {
            if (active) {
                setActivePhase(activePhase)
                setMaxSupply(maxSupply)
                setMintingFee(mintingFee)
                setTotalSupply(totalSupply)
                setLoading(false)
            }
        })

        return () => { active = false; setLoading(true) }

    }, [web3Provider, address, chainId])


    return { activePhase, maxSupply, mintingFee, totalSupply }
}