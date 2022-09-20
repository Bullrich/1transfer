<script lang="ts">
    import type { CurrencyType } from "../stores/price";
    import { stringToUsd } from "../utils/priceConverter";

    export let amount: string;
    export let currency: CurrencyType;

    $: priceValue = `1 ${currency?.symbol} = ${currency?.current_price}$`;
    $: usdValue = currency ? stringToUsd(amount, currency) : 0;
</script>

{#if usdValue > 0}
    <div class="tooltip tooltip-left" data-tip={priceValue}>
        <kbd class="kbd kbd-sm">
            {usdValue}$
        </kbd>
    </div>
{:else}
    <kbd class="kbd kbd-sm">
        {amount}
    </kbd>
{/if}
