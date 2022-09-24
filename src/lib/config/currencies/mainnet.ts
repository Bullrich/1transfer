import type { CurrencyMetadata } from "./types"
import logo from "../../../assets/tokens/tether.webp";
import busd from "../../../assets/tokens/busd.webp";
import usdc from "../../../assets/tokens/usdc.webp";
import dai from "../../../assets/tokens/dai.webp";
import aave from "../../../assets/tokens/aave.webp";

export const mainnetCurrencies: CurrencyMetadata[] = [
    {
        symbol: "usdc",
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        image: usdc,
        name: "USD Coin",
        decimals: 6,
        isToken: true,
    },
    {
        symbol: "usdt",
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        image: logo,
        name: "Tether",
        decimals: 6,
        isToken: true,
    },
    {
        symbol: "aave",
        address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
        image: aave,
        name: "Aave",
        decimals: 18,
        isToken: true,
    },
    {
        symbol: "busd",
        address: "0x4Fabb145d64652a948d72533023f6E7A623C7C53",
        image: busd,
        name: "Binance USD",
        decimals: 18,
        isToken: true,
    },
    {
        symbol: "dai",
        address: "0x6b175474e89094c44da98b954eedeac495271d0f",
        image: dai,
        name: "Dai Stablecoin",
        decimals: 18,
        isToken: true,
    }
]
