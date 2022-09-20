<script lang="ts">
    import { remaining, splitPayment, addresses, amount, price, currency as currencyStore } from "../stores";
    import ContractButton from "./ContractButton.svelte";
    import Price from "./Price.svelte";

    $: parsedAddresses = $addresses.filter((a) => a.length > 0);

    $: fee = Number($remaining) > 0;

    $: currency = $currencyStore ? $price?.get($currencyStore.symbol) : $price?.get("eth");
    $: currencySymbol = currency.symbol.toUpperCase();
</script>

<input type="checkbox" id="confirmation-modal" class="modal-toggle" />
<div class="modal">
    <div class="modal-box w-11/12 max-w-5xl">
        <label
            for="confirmation-modal"
            class="btn btn-sm btn-circle absolute right-2 top-2"
        >
            ✕
        </label>
        <h3 class="font-bold text-lg">Confirm operation</h3>
        <p class="py-4">
            The following operation will split an amount of {$amount} {currencySymbol} into {parsedAddresses.length}
            accounts.
        </p>
        <p class="py-4">Each account will receive {$splitPayment} {currencySymbol}</p>
        {#if fee}
            <p class="py-4">
                A remaining fee of
                <Price amount={$remaining} {currency} />
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
                                <Price amount={$splitPayment} {currency} />
                            </td>
                        </tr>
                    {/each}
                    {#if fee}
                        <tr>
                            <th>{parsedAddresses.length + 1}</th>
                            <td>Fee</td>
                            <td>{$remaining}</td>
                            <td>
                                <Price amount={$remaining} {currency} />
                            </td>
                        </tr>
                    {/if}
                </tbody>
            </table>
        </div>
        <div class="modal-action">
            <ContractButton totalAmount={$amount} addresses={parsedAddresses} />
        </div>
    </div>
</div>
