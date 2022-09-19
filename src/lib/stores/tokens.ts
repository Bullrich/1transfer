import { derived, type Readable } from "svelte/store";
import { getTokensFromNetwork } from "../config/currencies";
import type { CurrencyMetadata } from "../config/currencies/types";
import { getNativeCurrencyData } from "../utils/chains";
import type { NativeCurrencyData } from "../utils/chains/types";
import { chain } from "./chain";

type CurrencyData = NativeCurrencyData | CurrencyMetadata;

export const tokens: Readable<CurrencyData[]> = derived([chain], ([chain]) => {
    const nativeCurrency = getNativeCurrencyData(chain);
    const tokens = getTokensFromNetwork(chain);
    return [nativeCurrency, ...tokens];
});
