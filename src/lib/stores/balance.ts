import { utils, type BigNumber } from "ethers";
import { derived, type Readable } from "svelte/store";
import { chain } from "./chain";
import { signer } from "./crypto";

export const balance: Readable<BigNumber> = derived([signer, chain], ([signer, chain], set) => {
    if (signer && chain) {
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
