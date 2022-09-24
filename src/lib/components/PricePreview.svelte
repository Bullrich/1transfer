<script lang="ts">
    import { splitPayment } from "../stores/contract";
    import { addressesLength as aLength, amount } from "../stores/form";
</script>

<div>
    {#if $amount > 0 && $aLength > 0}
        <h1 class="text-5xl font-bold">Payment details</h1>
        <p class="py-6">
            Payment will be split between {$aLength} accounts. Each account will
            receive {$splitPayment}
        </p>
    {:else}
        <h1 class="text-5xl font-bold">1 Transfer</h1>
        <p class="py-6">
            Transfer native and ERC20 coins to multiple accounts in a single
            transfer.<br />
            Supports multiple chains and tokens, transfer to many using the
            <b>zero hassle single push</b> system.
        </p>
    {/if}
</div>
