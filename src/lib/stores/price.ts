import { readable } from "svelte/store";
import { getWithExpiry, setWithExpiry } from "../utils/storage";
import downloadPrices from "../config/prices.json";
import type { CryptoSymbol } from "../utils/chains/types";

const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd";

const KEY = "API_PRICES_GECKO";

export const fetchLatest = async (): Promise<CurrencyType[]> => {
    const data = await fetch(API_URL);
    return data.json();
}

function cryptoArrayToMap(currencies: CurrencyType[]): Map<CryptoSymbol, CurrencyType> {
    return new Map(currencies.map(c => [c.symbol, c]));
}

/** Remove values not in the interface */
const cleanPrice = ({ id, symbol, name, image, current_price }: CurrencyType): CurrencyType => ({ id, symbol, name, image, current_price });

export const price = readable<Map<CryptoSymbol, CurrencyType>>(undefined, (set) => {
    const prices = getWithExpiry<CurrencyType[]>(KEY, false);
    if (!prices || prices.expired) {
        fetchLatest().then(fullPrices => {
            const prices = fullPrices.map(cleanPrice);
            // save the price for 30 minutes
            setWithExpiry(KEY, prices, 30);
            set(cryptoArrayToMap(prices));
        }).catch(e => {
            console.error("Error fetching prices", e);
            if (prices?.data) {
                console.warn("Using expired data as backup", prices.data);
                set(cryptoArrayToMap(prices.data));
            } else {
                console.warn("Using build prices as backup", downloadPrices);
                const mappedData = cryptoArrayToMap(downloadPrices as CurrencyType[]);
                set(mappedData);
            }
        })
    } else {
        set(cryptoArrayToMap(prices.data));
    }
});

export interface CurrencyType {
    id: string;
    symbol: CryptoSymbol;
    name: string;
    image: string;
    current_price: number;
}
