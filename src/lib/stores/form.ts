import { derived, writable } from "svelte/store";

export const addresses = writable<string[]>([""]);

export const addressesLength = derived(addresses, $addresses => $addresses.filter(a => a.length > 0).length);

export const amount = writable<number>();

export const currency = writable<{ address?: string }>({address:""});
