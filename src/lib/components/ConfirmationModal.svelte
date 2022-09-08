<script lang="ts">
    import { remaining, splitPayment } from "../stores/contract";
    import { addresses, amount } from "../stores/form";
    import { price } from "../stores/price";

    $: parsedAddresses = $addresses.filter((a) => a.length > 0);

    $: remainingPrice =
        $remaining !== "0.0"
            ? parseFloat($remaining) *
              $price.find((p) => p.symbol === "eth").current_price
            : 0;
</script>

<input type="checkbox" id="confirmation-modal" class="modal-toggle" />
<div class="modal">
    <div class="modal-box w-11/12 max-w-5xl">
        <h3 class="font-bold text-lg">Confirm operation</h3>
        <p class="py-4">
            The following operation will split an amount of {$amount} ETH into {parsedAddresses.length}
            accounts.
        </p>
        <p class="py-4">Each account will receive {$splitPayment} ETH</p>
        {#if remainingPrice > 0}
            <p class="py-4">A remaining fee of</p>
            <div class="tooltip tooltip-left" data-tip={$remaining}>
                <kbd class="kbd kbd-sm">{remainingPrice.toFixed(2)}$</kbd>
                will be taken
            </div>
            <!-- </p> -->
        {/if}
        <div class="overflow-x-auto mt-6">
            <table class="table w-full">
                <thead>
                    <tr>
                        <th>NR</th>
                        <th>Address</th>
                    </tr>
                </thead>
                <tbody>
                    {#each parsedAddresses as address, index}
                        <tr>
                            <th>{index + 1}</th>
                            <td>{address}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
        <div class="modal-action">
            <label for="confirmation-modal" class="btn btn-warning w-half">
                Cancel
            </label>
            <button class="btn btn-success w-half">Approve operation</button>
        </div>
    </div>
</div>

<style>
    .w-half {
        width: 50%;
    }
</style>