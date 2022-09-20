import { derived, type Readable } from "svelte/store";
import { getTokensFromNetwork } from "../config/currencies";
import type { CurrencyMetadata } from "../config/currencies/types";
import { defaultNative, getNativeCurrencyData } from "../utils/chains";
import type { NativeCurrencyData } from "../utils/chains/types";
import { chain } from "./chain";

export type CurrencyData = NativeCurrencyData | CurrencyMetadata;

export const tokens: Readable<CurrencyData[]> = derived([chain], ([chain]) => {
    if (!chain) {
        console.warn("No chain selected");
        return [defaultNative];
    }
    const nativeCurrency = getNativeCurrencyData(chain);
    const tokens = getTokensFromNetwork(chain) ?? [];
    if (tokens && tokens.length > 0) {
        return [nativeCurrency, ...tokens];
    }
    return [nativeCurrency];
});
