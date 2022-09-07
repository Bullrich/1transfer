<script lang="ts">
    import { fly } from "svelte/transition";
    import { remaining,splitPayment } from "../stores/contract";
    import { addressesLength as aLength,amount } from "../stores/form";
    import Information from "./icons/Information.svelte";
</script>

{#if $splitPayment && $aLength > 1}
    <div class="stats shadow" in:fly>
        <div class="stat">
            <div class="stat-figure text-secondary">
                <div
                    class="tooltip tooltip-left"
                    data-tip={`${$amount} / ${$aLength} = ${$splitPayment}` +
                        ($remaining !== "0.0"
                            ? `. Remaining is ${$remaining}`
                            : "")}
                >
                    <Information />
                </div>
            </div>
            <div class="stat-title">Distribution</div>
            <div class="stat-value">{$splitPayment}</div>
            <div class="stat-desc">Each user will get from {$amount} ETH</div>
        </div>
    </div>
{/if}
