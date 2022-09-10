<script lang="ts">
    import type { CurrencyType } from "../stores/price";
    import { stringToUsd } from "../utils/priceConverter";

    export let amount: string;
    export let currency: CurrencyType;

    const priceValue = `1 ${currency.symbol} = ${currency.current_price}$`;
    $: usdValue = stringToUsd(amount, currency);
</script>

<div class="tooltip tooltip-left" data-tip={priceValue}>
    <kbd class="kbd kbd-sm">
        {usdValue}$
    </kbd>
</div>
