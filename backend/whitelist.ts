import { whitelists } from "./whitelistArray";
import { getProof } from "../lib/utilities";
import { isAddress, } from "ethers/lib/utils";

export const isAddressWhitelisted = (address: any, activePhase: number): Boolean => {
    if(! isAddress(address)) return false;

    return whitelists[activePhase].includes(address.toLowerCase());
}

export const getProofForAddress = (address: any, activePhase: number): Array<string> => {
    if(! isAddress(address)) return [];

    return getProof(address, whitelists[activePhase]);
}