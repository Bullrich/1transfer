import { derived, type Readable } from "svelte/store";
import { getContractAddress } from "../config/contracts";
import { PaymentSplitter__factory, type PaymentSplitter } from "../contracts";
import { calculatePaymentSplit, calculateRemaining } from "../utils/priceCalculator";
import { chain } from "./chain";
import { signer } from "./crypto";
import { addressesLength, amount, currency } from "./form";

export const contract: Readable<PaymentSplitter> = derived([signer, chain], ([signer, chain]) => {
    const contractAddress = getContractAddress(chain);
    console.assert(contractAddress, `No contract found for ${chain}`);
    if (contractAddress && signer) {
        console.log("got contract")
        return PaymentSplitter__factory.connect(contractAddress, signer);
    }
});

export const splitPayment: Readable<string> = derived([contract, amount, addressesLength, currency], ([cntrct, amnt, length, currency], set) => {
    if (amnt > 0 && length > 0) {
        const decimals = currency.address ? currency.decimals - 2 : currency.decimals - 4;
        calculatePaymentSplit(cntrct, amnt, length, decimals).then(set);
    }
});

export const remaining: Readable<string> = derived([contract, amount, addressesLength, currency], ([cntrct, amnt, length, currency], set) => {
    if (amnt > 0 && length > 0) {
        const decimals = currency.address ? currency.decimals - 2 : currency.decimals - 4;
        calculateRemaining(cntrct, amnt, length, decimals).then(set);
    }
});
