import { writable } from "svelte/store";
import { getSigner } from "../utils/wallet";

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
