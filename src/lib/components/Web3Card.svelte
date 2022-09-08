<script lang="ts">
    import { chain } from "../stores/chain";
    import { address,signer } from "../stores/crypto";
    import ChainSelect from "./ChainSelect.svelte";
</script>

<div class="card w-96 bg-base-100 shadow-xl">
    <div class="card-body">
        <h2 class="card-title">Web3 Stores preview</h2>
        <h3>Address</h3>
        {#if !$address}
            <button class="btn btn-primary" on:click={signer.signIn}>
                Connect
            </button>
        {:else}
            <h5>Your address is {$address}</h5>
        {/if}

        <h2>Chain</h2>
        <h5>You are on chain {$chain}</h5>

        <h3>Change network</h3>
        <ChainSelect />
    </div>
</div>
