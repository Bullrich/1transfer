import { Chains } from "../../utils/chains";
import { goerliCurrencies } from "./goerli";
import { mainnetCurrencies } from "./mainnet";
import { optimismCurrencies } from "./optimism";
import { optimismGoerliCurrencies } from "./optimismGoerli";
import { polygonCurrencies } from "./polygon";
import type { CurrencyMetadata } from "./types";

export function getTokensFromNetwork(chain: Chains): CurrencyMetadata[] {
    switch (chain) {
        case Chains.MAINNET:
            return mainnetCurrencies;
        case Chains.OPTIMISM_GOERLI:
            return [optimismGoerliCurrencies];
        case Chains.GOERLI:
            return [goerliCurrencies];
        case Chains.OPTIMISM:
            return optimismCurrencies;
        case Chains.POLYGON:
            return polygonCurrencies
        default:
            return [];
    }
}
