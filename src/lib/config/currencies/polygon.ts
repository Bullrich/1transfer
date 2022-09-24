import aave from "../../../assets/tokens/aave.webp";
import logo from "../../../assets/tokens/tether.webp";
import usdc from "../../../assets/tokens/usdc.webp";
import type { CurrencyMetadata } from "./types";

export const polygonCurrencies: CurrencyMetadata[] = [
    {
        symbol: "usdc",
        address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
        image: usdc,
        name: "USD Coin",
        decimals: 6,
        isToken: true,
    },
    {
        symbol: "usdt",
        address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
        image: logo,
        name: "Tether",
        decimals: 6,
        isToken: true,
    },
    {
        symbol: "aave",
        address: "0xd6df932a45c0f255f85145f286ea0b292b21c90b",
        image: aave,
        name: "Aave",
        decimals: 18,
        isToken: true,
    },
]
