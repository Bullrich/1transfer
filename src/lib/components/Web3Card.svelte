<script lang="ts">
    import { chain } from "../stores/chain";
    import { wallet } from "../stores/crypto";
    import { Chains } from "../utils/chain";

    const chains = Object.values(Chains).filter(
        (v) => !isNaN(Number(v))
    ) as number[];

    let bindValue: Chains;
</script>

<div class="card w-96 bg-base-100 shadow-xl">
    <div class="card-body">
        <h2 class="card-title">Web3 Stores preview</h2>
        <h3>Address</h3>
        {#if !$wallet}
            <button class="btn btn-primary" on:click={wallet.signIn}>
                Connect
            </button>
        {:else}
            <h5>Your address is {$wallet}</h5>
        {/if}

        <h2>Chain</h2>
        <h5>You are on chain {$chain}</h5>

        <h3>Change network</h3>
        <select
            class="select w-full max-w-xs"
            bind:value={bindValue}
            on:change={(e) => chain.changeNetwork(bindValue)}
        >
            <option disabled selected>Pick your chain</option>
            {#each chains as chainNr}
                <option value={chainNr}>{Chains[chainNr]}</option>
            {/each}
        </select>
    </div>
</div>
