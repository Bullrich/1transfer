import type { JsonRpcSigner } from "@ethersproject/providers";
import { utils, type BigNumber } from "ethers";
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

export const balance: Readable<BigNumber> = derived(signer, (signer, set) => {
    if (signer) {
        signer.getBalance().then(set);
    }
});

export const ethBalance = derived(balance, (balance) => {
    if (!balance) {
        return "";
    }
    const stringBalance = utils.formatEther(balance);
    if (stringBalance.includes(".")) {
        const [abs, decimals] = stringBalance.split(".");
        if (decimals.length > 4) {
            return [abs, decimals.slice(0, 4)].join(".");
        }
    }
    return stringBalance;

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
