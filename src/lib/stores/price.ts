import { readable } from "svelte/store";
import { getWithExpiry, setWithExpiry } from "../utils/storage";

const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd";

const KEY = "API_PRICES_GECKO";

export const fetchLatest = async (): Promise<CurrencyType[]> => {
    const data = await fetch(API_URL);
    return data.json();
}

/** Remove values not in the interface */
const cleanPrice = ({ id, symbol, name, image, current_price }: CurrencyType): CurrencyType => ({ id, symbol, name, image, current_price });

export const price = readable<CurrencyType[]>(null, (set) => {
    const prices = getWithExpiry<CurrencyType[]>(KEY);
    if (prices) {
        set(prices);
    } else {
        fetchLatest().then(fullPrices => {
            const prices = fullPrices.map(cleanPrice);
            // save the price for 15 minutes
            setWithExpiry(KEY, prices, 15);
            set(prices);
        })
    }
})

interface CurrencyType {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
}
