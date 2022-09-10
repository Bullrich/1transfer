<script lang="ts">
    import { utils } from "ethers";
    import { chain } from "../stores/chain";
    import { contract, remaining, splitPayment } from "../stores/contract";
    import { addresses, amount } from "../stores/form";
    import { price } from "../stores/price";
    import { toast } from "../stores/toast";
    import Price from "./Price.svelte";

    $: parsedAddresses = $addresses.filter((a) => a.length > 0);

    $: fee = Number($remaining) > 0;

    let loading = false;
    let btnMessage = "Approve operation";

    async function executeSplitPayment() {
        loading = true;
        btnMessage = "Waiting for user approval";
        console.log("yes", loading, btnMessage);
        const tx = await $contract.splitPayment(parsedAddresses, {
            value: utils.parseEther($amount.toString()),
        });
        btnMessage = "Waiting for transaction to finish";
        await tx.wait();
        btnMessage = "Transaction completed!";
        toast.push("Transaction completed", "alert-success");
    }
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
        {#if fee}
            <p class="py-4">
                A remaining fee of
                <Price amount={$remaining} currency={$price.get("eth")} />
                will be taken
            </p>
        {/if}
        <div class="overflow-x-auto mt-6">
            <table class="table w-full">
                <thead>
                    <tr>
                        <th>NR</th>
                        <th>Address</th>
                        <th>Amount</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {#each parsedAddresses as address, index}
                        <tr>
                            <th>{index + 1}</th>
                            <td>{address}</td>
                            <td>{$splitPayment}</td>
                            <td>
                                <Price
                                    amount={$splitPayment}
                                    currency={$price.get("eth")}
                                />
                            </td>
                        </tr>
                    {/each}
                    {#if fee}
                        <tr>
                            <th>{parsedAddresses.length + 1}</th>
                            <td>Fee</td>
                            <td>{$remaining}</td>
                            <td>
                                <Price
                                    amount={$remaining}
                                    currency={$price.get("eth")}
                                />
                            </td>
                        </tr>
                    {/if}
                </tbody>
            </table>
        </div>
        <div class="modal-action">
            <label for="confirmation-modal" class="btn btn-warning w-half">
                Cancel
            </label>
            <button
                class="btn btn-success w-half"
                disabled={!$contract || loading}
                on:click={executeSplitPayment}
            >
                {btnMessage}
            </button>
        </div>
    </div>
</div>

<style>
    .w-half {
        width: 50%;
    }
</style>
