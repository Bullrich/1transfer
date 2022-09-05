import { utils } from "ethers";
import type { PaymentSplitter } from "../contracts";

export async function calculatePaymentSplit(contract: PaymentSplitter | undefined, amount: number, targets: number) {
    const amountInEth = utils.parseUnits(amount.toString());
    if (contract) {
        const paymentCalculator = await contract.calculatePayment(amountInEth, targets);
        return utils.formatEther(paymentCalculator.toString());
    }
    const parsedTarget = utils.parseUnits(`${targets}00000`, "gwei");
    const remaining = amountInEth.mod(parsedTarget);
    const result = amountInEth.sub(remaining).div(targets);
    console.log(
        `Total: ${amountInEth} % ${parsedTarget} = ${remaining.toString()}`
    );
    return utils.formatEther(result.toString());
}

export async function calculateRemaining(contract: PaymentSplitter | undefined, amount: number, targets: number) {
    const amountInEth = utils.parseUnits(amount.toString());
    if (contract) {
        const paymentCalculator = await contract.calculateRemaining(amountInEth, targets);
        return utils.formatEther(paymentCalculator.toString());
    }
    const parsedTarget = utils.parseUnits(`${targets}00000`, "gwei");
    const remaining = amountInEth.mod(parsedTarget);
    return utils.formatEther(remaining.toString());
}
