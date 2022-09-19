import { utils, type BigNumber } from "ethers";
import { derived, type Readable } from "svelte/store";
import { ERC20__factory } from "../contracts";
import { chain } from "./chain";
import { signer } from "./crypto";
import { currency } from "./form"

export const balance: Readable<BigNumber> = derived([signer, chain, currency], ([signer, chain, currency], set) => {
    if (signer && chain) {
        // if not token address is assigned use the default balance
        if (!currency?.address) {
            signer.getBalance().then(set);
        }
        else if (currency?.address) {
            // if there is a token address let's get the address of the wallet and then the balance for that token
            signer.getAddress().then(address => {
                ERC20__factory.connect(currency.address, signer).balanceOf(address).then(set);
            });
        }
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
