import { whitelists } from "./whitelistArray";
import { getProof } from "../lib/utilities";
import { isAddress, } from "ethers/lib/utils";

export const isAddressWhitelisted = (address: any, activePhase: number): boolean => {
    if(! isAddress(address)) return false;

    return whitelists[activePhase].includes(address.toLowerCase());
}

export const getProofForAddress = (address: any, activePhase: number): Array<string> => {
    console.log(activePhase)
    if(! isAddress(address)) return [];

    return getProof(address, whitelists[activePhase]);
}