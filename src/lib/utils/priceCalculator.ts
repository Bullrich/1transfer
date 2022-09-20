import { BigNumber, utils } from "ethers";
import type { PaymentSplitter } from "../contracts";
import type { CurrencyData } from "../stores";


export class PaymentCalculator {
    private readonly amount: BigNumber;
    private readonly decimalsToSplit: number;

    constructor(
        amount: number,
        private readonly targets: number,
        private readonly currency: CurrencyData,
        private readonly contract?: PaymentSplitter,) {
        this.amount = utils.parseUnits(amount.toString(), currency.decimals);
        if (currency.decimals <= 4) {
            this.decimalsToSplit = currency.decimals;
        } else {
            this.decimalsToSplit = currency.isToken ? currency.decimals - 3 : currency.decimals - 4;
        }
    }

    public async calculatePaymentSplit() {
        const parsedTarget = utils.parseUnits(this.targets.toString(), this.decimalsToSplit);
        const remaining = this.amount.mod(parsedTarget);
        const result = this.amount.sub(remaining).div(this.targets);
        console.log(
            `Total: ${this.amount} % ${parsedTarget} = ${remaining.toString()}`
        );
        return utils.formatUnits(result.toString(), this.currency.decimals);
    }

    public async calculatePaymentSplitInContract() {
        const paymentCalculator = await this.contract.calculatePayment(this.amount, this.targets, this.decimalsToSplit);
        return utils.formatUnits(paymentCalculator.toString(), this.currency.decimals);
    }

    public async calculateRemaining() {
        const parsedTarget = utils.parseUnits(this.targets.toString(), this.decimalsToSplit);
        const remaining = this.amount.mod(parsedTarget);
        return utils.formatUnits(remaining.toString(), this.currency.decimals);
    }

    public async calculateRemainingInContract() {
        const paymentCalculator = await this.contract.calculateRemaining(this.amount, this.targets, this.decimalsToSplit);
        return utils.formatUnits(paymentCalculator.toString(), this.currency.decimals);
    }
}
