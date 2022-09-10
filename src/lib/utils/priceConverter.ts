import type { CurrencyType } from "../stores/price";

export function stringToUsd(amount: string, currency: CurrencyType, decimals: number = 2): number {
    const amountToNumber = parseFloat(amount);
    if (amountToNumber < 0) {
        return 0;
    }
    const decimalsMultiplier = Math.pow(10, decimals);
    const price = amountToNumber * currency.current_price;
    return Math.round(price * decimalsMultiplier) / decimalsMultiplier;
}
