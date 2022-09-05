import { derived, type Readable } from "svelte/store";
import { getContractAddress } from "../config/contracts";
import { PaymentSplitter__factory, type PaymentSplitter } from "../contracts";
import { calculatePaymentSplit, calculateRemaining } from "../utils/priceCalculator";
import { chain } from "./chain";
import { signer } from "./crypto";
import { addressesLength, amount } from "./form";

export const contract: Readable<PaymentSplitter> = derived([signer, chain], ([signer, chain]) => {
    const contractAddress = getContractAddress(chain);
    if (contractAddress && signer) {
        console.log("got contract")
        return PaymentSplitter__factory.connect(contractAddress, signer)
    }
});

export const splitPayment: Readable<string> = derived([contract, amount, addressesLength], ([cntrct, amnt, length], set) => {
    if (amnt > 0 && length > 0) {
        calculatePaymentSplit(cntrct, amnt, length).then(set);
    }
})

export const remaining: Readable<string> = derived([contract, amount, addressesLength], ([cntrct, amnt, length], set) => {
    if (amnt > 0 && length > 0) {
        calculateRemaining(cntrct, amnt, length).then(set);
    }
})
