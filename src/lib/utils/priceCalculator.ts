import { utils } from "ethers";
import type { PaymentSplitter } from "../contracts";

const ETH_DECIMALS = 18;

export async function calculatePaymentSplit(contract: PaymentSplitter | undefined, amount: number, targets: number, decimals:number = ETH_DECIMALS) {
    const amountInEth = utils.parseUnits(amount.toString(), decimals);
    if (contract) {
        const paymentCalculator = await contract.calculatePayment(amountInEth, targets, decimals);
        return utils.formatEther(paymentCalculator.toString());
    }
    const parsedTarget = utils.parseUnits(targets.toString(), decimals);
    const remaining = amountInEth.mod(parsedTarget);
    const result = amountInEth.sub(remaining).div(targets);
    console.log(
        `Total: ${amountInEth} % ${parsedTarget} = ${remaining.toString()}`
    );
    return utils.formatEther(result.toString());
}

export async function calculateRemaining(contract: PaymentSplitter | undefined, amount: number, targets: number, decimals: number = ETH_DECIMALS) {
    const amountInEth = utils.parseUnits(amount.toString(), decimals);
    if (contract) {
        const paymentCalculator = await contract.calculateRemaining(amountInEth, targets, decimals);
        return utils.formatEther(paymentCalculator.toString());
    }
    const parsedTarget = utils.parseUnits(targets.toString(), decimals);
    const remaining = amountInEth.mod(parsedTarget);
    return utils.formatEther(remaining.toString());
}
