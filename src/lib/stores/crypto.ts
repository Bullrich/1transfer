import { derived, readable, writable, type Readable } from "svelte/store";
import { getSigner } from "../utils/wallet";
import type { JsonRpcSigner } from "@ethersproject/providers";

function createSigner() {
    const { subscribe, set } = writable<JsonRpcSigner>();

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

function createWalletAuth() {
    const { subscribe, set } = writable<string>();

    return {
        subscribe,
        signIn: async () => {
            const signer = await getSigner();
            const address = await signer.getAddress();
            set(address);
        }
    }
}
export const wallet = createWalletAuth();
