import { chainData } from "../../config/chains";
import { Chains, Chains as ChainsType, type ChainData, type NativeCurrencyData } from "./types";

export function getChain(chain: Chains): ChainData {
    return chainData.get(chain);
}

export const defaultNative: NativeCurrencyData = { name: 'ETH', decimals: 18, symbol: 'eth' };

export function getNativeCurrencyData(chain: Chains) {
    switch (chain) {
        case ChainsType.MAINNET:
        case ChainsType.RINKEBY:
        case ChainsType.ROPSTEN:
        case ChainsType.GOERLI:
            return defaultNative;
        case ChainsType.MUMBAI:
            return chainData.get(ChainsType.MUMBAI).nativeCurrency;
        case ChainsType.POLYGON:
            return chainData.get(ChainsType.POLYGON).nativeCurrency;
        case ChainsType.OPTIMISM:
            return chainData.get(ChainsType.OPTIMISM).nativeCurrency;
        case ChainsType.OPTIMISM_GOERLI:
            return chainData.get(ChainsType.OPTIMISM_GOERLI).nativeCurrency;
        case ChainsType.OPTIMISM_KOVAN:
            return chainData.get(ChainsType.OPTIMISM_KOVAN).nativeCurrency;
        default:
            console.error("Chain not found", chain);
    }
}

export { Chains } from "./types";

