import type { JsonRpcSigner } from "@ethersproject/providers";
import { derived, writable, type Readable } from "svelte/store";
import { getAccounts, getSigner } from "../utils/wallet";

function createSigner() {
    const { subscribe, set } = writable<JsonRpcSigner>();

    getAccounts().then(async accounts => {
        // If accounts exist then the user has already authorized the application
        if (accounts && accounts.length > 0) {
            getSigner().then(set);
        }
    })

    return {
        subscribe,
        signIn: async () => {
            const signer = await getSigner();
            set(signer);
        }
    }
}

export const signer = createSigner();

export const address: Readable<string> = derived(signer, (signer, set) => {
    if (signer) {
        signer.getAddress().then(address => set(address));
    }
});

export const ensName: Readable<string> = derived([signer, address], ([signer, address], set) => {
    if (signer && address) {
        signer.provider.lookupAddress(address).then(set).catch(console.warn);
    }
});
