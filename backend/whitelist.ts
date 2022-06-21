import { whitelists } from "./whitelistArray";
import { getProof } from "../lib/utilities";
import { isAddress, getAddress } from "ethers/lib/utils";

export const isAddressWhitelisted = (address: any, activePhase: number): boolean => {
    if(! isAddress(address)) return false;

    return whitelists[activePhase].includes(getAddress(address));
}

export const getProofForAddress = (address: any, activePhase: number): Array<string> => {
    console.log({activePhase}, whitelists[activePhase], "proof: ", getProof(address, whitelists[activePhase]))
    if(! isAddress(address)) return [];

    return getProof(address, whitelists[activePhase]);
}