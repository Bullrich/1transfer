import aave from "../../../assets/tokens/aave.webp";
import bnb from "../../../assets/tokens/bnb.webp";
import busd from "../../../assets/tokens/busd.webp";
import link from "../../../assets/tokens/chainlink.webp";
import cronos from "../../../assets/tokens/cronos.webp";
import dai from "../../../assets/tokens/dai.webp";
import logo from "../../../assets/tokens/tether.webp";
import usdc from "../../../assets/tokens/usdc.webp";
import type { CurrencyMetadata } from "./types";

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
    },
    {
        symbol: "link",
        address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
        image: link,
        name: "Chainlink",
        decimals: 18,
        isToken: true,
    },
    {
        symbol: "cro",
        address: "0xA0b73E1Ff0B80914AB6fe0444E65848C4C34450b",
        image: cronos,
        name: "Cronos",
        decimals: 8,
        isToken: true,
    },
    {
        symbol: "bnb",
        address: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
        image: bnb,
        name: "BNB",
        decimals: 18,
        isToken: true,
    }
]
