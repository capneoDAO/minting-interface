import { Interface } from "ethers/lib/utils"

import stakingAbiTestnet from "../backend/abi/stakingAbiTestnet.json"
import tokenAbiTestnet from "../backend/abi/tokenAbiTestnet.json"
import stakingAbiMainnet from "../backend/abi/stakingAbiMainnet.json"
import tokenAbiMainnet from "../backend/abi/tokenAbiMainnet.json"


export const Contracts = {
    MGH_TOKEN: {
        MATIC_TESTNET: {
            address: "0xA26fcc9847F24C7D78f4e77Ba39A37B8A9eaFB02",
            abi: new Interface(tokenAbiTestnet)
        },
        MATIC_MAINNET: {
            address: "0xc3C604F1943B8C619c5D65cd11A876e9C8eDCF10",
            abi: new Interface(tokenAbiMainnet)
        },
        ETHEREUM_MAINNET: {
            address: "0x8765b1a0eb57ca49be7eacd35b24a574d0203656",
            abi: undefined
        }
    },
    MGH_STAKING: {
        MATIC_TESTNET: {
            address: "0x7d267713502F979ffE3c49622fd0DC24d6D607D0",
            abi: new Interface(stakingAbiTestnet)
        },
        MATIC_MAINNET: {
            address: "0xb2Cc21271f2D3Ac2Aaaffa8Ed2F40fDe1C63d894",
            abi: new Interface(stakingAbiMainnet)
        }
    }

}