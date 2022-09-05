<script lang="ts">
    import { remaining, splitPayment } from "../stores/contract";
    import { addressesLength as aLength, amount } from "../stores/form";
</script>

<div>
    {#if $amount > 0 && $aLength > 0}
        <h1 class="text-5xl font-bold">Payment details</h1>
        <p class="py-6">
            Payment will be split between {$aLength} accounts. Each account will
            receive {$splitPayment} and the difference is {$remaining}
        </p>
    {:else}
        <h1 class="text-5xl font-bold">Split payment</h1>
        <p class="py-6">
            Split your crypto payment equally between different accounts!
        </p>
    {/if}
</div>
