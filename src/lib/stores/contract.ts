import { derived, type Readable } from "svelte/store";
import { getContractAddress } from "../config/contracts";
import { PaymentSplitter__factory, type PaymentSplitter } from "../contracts";
import { PaymentCalculator } from "../utils/priceCalculator";
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
        const calculator = new PaymentCalculator(amnt, length, currency, cntrct);
        calculator.calculatePaymentSplit().then(set);
    }
});

export const remaining: Readable<string> = derived([contract, amount, addressesLength, currency], ([cntrct, amnt, length, currency], set) => {
    if (amnt > 0 && length > 0) {
        const calculator = new PaymentCalculator(amnt, length, currency, cntrct);
        calculator.calculateRemaining().then(set);
    }
});
