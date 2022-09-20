import { derived, type Readable } from "svelte/store";
import { getContractAddress } from "../config/contracts";
import { changeNetwork } from "../utils/chain";
import { Chains } from "../utils/chains";
import { signer } from "./crypto";

function createChainStore() {
    const { subscribe }: Readable<Chains> = derived(signer, () => parseInt(window.ethereum?.networkVersion) ?? Chains.MAINNET);

    window.ethereum?.on("chainChanged", () => window.location.reload());

    return {
        subscribe,
        changeNetwork
    }
}
export const chain = createChainStore();

export const validChain: Readable<boolean> = derived(chain, ch => !!getContractAddress(ch));
