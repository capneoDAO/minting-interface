import { whitelist } from "./whitelistArray";
import { getProof } from "../lib/utilities";
import { isAddress, } from "ethers/lib/utils";

export const isAddressWhitelisted = (address: any): Boolean => {
    if(! isAddress(address)) return false;

    return whitelist.includes(address.toLowerCase());
}

export const getProofForAddress = (address: any): Array<string> => {
    if(! isAddress(address)) return [];

    return getProof(address, whitelist);
}