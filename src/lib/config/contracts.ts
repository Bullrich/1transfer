import { Chains } from "../utils/chains/chain";

const OPTIMISM_KOVAN = "0xA40267BED8Bbe77a65eD1D318F8F0C32E7eB2B66";

export function getContractAddress(chain: Chains): string {
    switch (chain) {
        case Chains.OPTIMISM_KOVAN:
            return OPTIMISM_KOVAN;
        default:
            return null;
    }
}
