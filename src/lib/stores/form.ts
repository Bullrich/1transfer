import { derived, writable } from "svelte/store";
import type { CurrencyData } from "./tokens";

export const addresses = writable<string[]>([""]);

export const addressesLength = derived(addresses, $addresses => $addresses.filter(a => a.length > 0).length);

export const amount = writable<number>();

export const currency = writable<CurrencyData>({ name: "eth", symbol: "eth", decimals: 18 });
