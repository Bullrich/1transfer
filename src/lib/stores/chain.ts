import { derived, writable, type Readable } from "svelte/store";
import { getContractAddress } from "../config/contracts";
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

export const validChain: Readable<boolean> = derived(chain, ch => !!getContractAddress(ch));
