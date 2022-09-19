import { Chains } from "../../utils/chains";
import { mainnetCurrencies } from "./mainnet";
import { optimismGoerliCurrencies } from "./optimismGoerli";
import type { CurrencyMetadata } from "./types";

export function getTokensFromNetwork(chain: Chains): CurrencyMetadata[] {
    switch (chain) {
        case Chains.MAINNET:
            return [mainnetCurrencies];
        case Chains.OPTIMISM_GOERLI:
            return [optimismGoerliCurrencies];
        default:
            return [];
    }
}
