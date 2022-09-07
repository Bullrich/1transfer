<script lang="ts">
    import Cross from "./icons/Cross.svelte";
    import { addresses, amount } from "../stores/form";
    import { insertInArray } from "../utils/arrayHelper";
    import { fly } from "svelte/transition";
    import PriceStat from "./PriceStat.svelte";

    let disabled: boolean = true;

    function submitEnabled() {
        disabled = !(
            $amount > 0 && $addresses.filter((a) => a.length > 0).length > 1
        );
    }

    function handleNumber(e: Event) {
        let oldValue = $amount ?? 0;
        const target = e.target as HTMLInputElement;
        let newValue = target.value;

        if (parseFloat(newValue) && newValue.length < 17) {
            amount.set(parseFloat(newValue));
        } else {
            target.value = oldValue.toString();
        }
        submitEnabled();
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

        submitEnabled();
    }

    function removeAddress(index: number) {
        const add = $addresses;

        add.splice(index, 1);
        addresses.set(add);
    }

    function submit() {
        console.log("sending", $amount, $addresses);
    }
</script>

<div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
    <div class="card-body">
        <div class="form-control">
            <label class="label" for="amount">
                <span class="label-text">Amount</span>
            </label>
            <input
                type="number"
                on:input|preventDefault={handleNumber}
                placeholder="0"
                min="0.00002"
                id="amount"
                required
                class="input input-bordered"
            />
        </div>
        <div class="form-control">
            <label class="label" for="address">
                <span class="label-text">Address</span>
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
            <button
                class="btn btn-primary"
                type="submit"
                on:click={submit}
                {disabled}
            >
                {#if !disabled}
                    Preview Operation
                {:else if !$amount}
                    Enter an amount
                {:else if $addresses.length === 2}
                    Add at least 2 addresses
                {:else}
                    Add an address
                {/if}
            </button>
        </div>
    </div>
</div>
