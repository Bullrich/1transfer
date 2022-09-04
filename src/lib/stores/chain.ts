import { writable } from "svelte/store";
import { Chains, changeNetwork } from "../utils/chain";

function createChainStore() {
    const { subscribe, set } = writable<Chains>(parseInt(window.ethereum.networkVersion));

    window.ethereum.on("chainChanged", (chainId) => {
        const idNumber = parseInt(chainId);
        set(idNumber);
    });

    return {
        subscribe,
        changeNetwork
    }
}
export const chain = createChainStore();
