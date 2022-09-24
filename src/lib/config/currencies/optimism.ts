import aave from "../../../assets/tokens/aave.webp";
import usdc from "../../../assets/tokens/usdc.webp";
import type { CurrencyMetadata } from "./types";

export const optimismCurrencies: CurrencyMetadata[] = [
    {
        symbol: "aave",
        address: "0x76FB31fb4af56892A25e32cFC43De717950c9278",
        image: aave,
        name: "Aave",
        decimals: 18,
        isToken: true,
    },
    {
        symbol: "usdc",
        address: "0x7f5c764cbc14f9669b88837ca1490cca17c31607",
        image: usdc,
        name: "USD Coin",
        decimals: 6,
        isToken: true,
    },
];
