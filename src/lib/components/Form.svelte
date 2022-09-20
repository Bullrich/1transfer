<script lang="ts">
    import { fly } from "svelte/transition";
    import { insertInArray } from "../utils/arrayHelper";
    import ConfirmationModal from "./ConfirmationModal.svelte";
    import Cross from "./icons/Cross.svelte";
    import PriceStat from "./PriceStat.svelte";
    import {
        contract,
        ethBalance,
        addresses,
        amount,
        tokens,
        currency,
    } from "../stores";

    $: disabled =
        !$contract ||
        !($amount > 0 && $addresses.filter((a) => a.length > 0).length > 1);

    $: setBalance = $amount;

    const defaultToken = $tokens?.length > 0 ? $tokens[0].symbol : "eth";

    $: selectedToken = defaultToken;

    $: btnMessage = !$contract
        ? "Network not supported"
        : !$amount
        ? "Enter an amount"
        : $addresses.length === 2
        ? "Add at least 2 addresses"
        : "Add an address";

    function handleNumber(e: Event) {
        let oldValue = $amount ?? 0;
        const target = e.target as HTMLInputElement;
        let newValue = target.value;

        if (parseFloat(newValue) && newValue.length < 17) {
            amount.set(parseFloat(newValue));
        } else {
            target.value = oldValue.toString();
        }
    }

    function handleAddress(e: Event, index: number) {
        if (index === $addresses.length - 1) {
            addresses.set([...$addresses, ""]);
        }

        const target = e.target as HTMLInputElement;
        if (target.value.indexOf(",") > -1) {
            const newAddresses = target.value.split(",");
            const updatedAddress = insertInArray(
                $addresses,
                index + 1,
                newAddresses
            );
            target.value = newAddresses[0];
            addresses.set(updatedAddress);
        } else {
            $addresses[index] = target.value;
            addresses.set($addresses);
        }
    }

    function setMaxBalance() {
        amount.set(parseFloat($ethBalance));
    }

    function removeAddress(index: number) {
        const add = $addresses;

        add.splice(index, 1);
        addresses.set(add);
    }

    function changeCurrency() {
        $currency = $tokens.find((t) => t.symbol === selectedToken);
    }
</script>

<div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
    <div class="card-body">
        <div class="form-control">
            <label class="label" for="amount">
                <span class="label-text">Amount</span>
            </label>
            <div class="flex items-center border-b border-teal-500 py-2">
                <input
                    type="number"
                    on:input|preventDefault={handleNumber}
                    placeholder="0"
                    bind:value={setBalance}
                    min="0.00002"
                    id="amount"
                    required
                    class="input input-bordered w-full focus:outline-none"
                />
                <select
                    class="flex-shrink-0 select select-primary py-1 px-2 rounded"
                    bind:value={selectedToken}
                    on:change={changeCurrency}
                >
                    {#each $tokens as token}
                        <option
                            value={token.symbol}
                            disabled={$tokens.length < 2}
                            selected={token.symbol === $currency.symbol}
                        >
                            {token.symbol.toUpperCase()}
                        </option>
                    {/each}
                </select>
            </div>
            {#if $ethBalance}
                <label class="label" for="amount">
                    <span class="label-text-alt">Balance {$ethBalance}</span>
                    <span
                        class="label-text-alt cursor-pointer"
                        on:click={setMaxBalance}
                    >
                        Max
                    </span>
                </label>
            {/if}
        </div>
        <div class="form-control">
            <label class="label" for="address">
                <span class="label-text">Addresses</span>
            </label>
            {#each $addresses as address, index}
                <div class="justify-between mt-4 flex" in:fly={{ y: -20 }}>
                    <input
                        type="text"
                        on:input|preventDefault={(e) => handleAddress(e, index)}
                        placeholder="0x0000000"
                        value={address}
                        class="input input-bordered"
                    />
                    {#if index > 0}
                        <button
                            class="btn btn-square"
                            on:click={() => removeAddress(index)}
                        >
                            <Cross />
                        </button>
                    {/if}
                </div>
            {/each}
        </div>
        <PriceStat />
        <div class="form-control mt-6">
            <ConfirmationModal />
            {#if !disabled}
                <label for="confirmation-modal" class="btn btn-primary">
                    Preview Operation
                </label>
            {:else}
                <button class="btn btn-primary" {disabled}>
                    {btnMessage}
                </button>
            {/if}
        </div>
    </div>
</div>

<style>
    select {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        padding: 2px 30px 2px 2px;
        border: none;
    }

    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    /* Firefox */
    input[type="number"] {
        -moz-appearance: textfield;
    }
</style>
