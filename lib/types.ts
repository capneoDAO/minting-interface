import { Network } from "./enums";

export interface NetworkState {
    value: Network
}

export interface AccountState {
    connected: boolean,
    address: string | undefined,
    chainId: number | undefined
}

export interface AddEthereumChainParameter {
    chainId: string; // A 0x-prefixed hexadecimal string
    chainName: string;
    nativeCurrency: {
        name: string;
        symbol: string; // 2-6 characters long
        decimals: 18;
    };
    rpcUrls: string[];
}


export interface IAssetData {
    name: string
    symbol: string
    decimals: number
    contractAddress?: string
}

export interface IChainData {
    name: string,
    chainId: number,
    chainIdHex: string,
    rpcUrl: string,
    nativeCurrency: IAssetData,
    blockExplorer: string,
}