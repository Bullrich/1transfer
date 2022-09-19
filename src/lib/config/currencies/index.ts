import { Chains } from "../../utils/chains";
import { optimismGoerliCurrencies } from "./optimismGoerli";
import type { CurrencyMetadata } from "./types";

export function getTokensFromNetwork(chain: Chains): CurrencyMetadata[] {
    switch (chain) {
        case Chains.OPTIMISM_GOERLI:
            return [optimismGoerliCurrencies];
        default:
            return [];
    }
}
