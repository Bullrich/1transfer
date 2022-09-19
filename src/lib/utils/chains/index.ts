import { chainData } from "../../config/chains";
import { Chains, Chains as ChainsType, type ChainData } from "./types";

export function getChain(chain: Chains): ChainData {
    return chainData.get(chain);
}

export function getNativeCurrencyData(chain: Chains) {
    switch (chain) {
        case ChainsType.MAINNET:
        case ChainsType.RINKEBY:
        case ChainsType.ROPSTEN:
            return { name: 'ETH', decimals: 18, symbol: 'ETH' };
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
    }
}

export { Chains } from "./types";

