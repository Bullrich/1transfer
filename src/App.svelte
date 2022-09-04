<script lang="ts">
  import { chain } from "./lib/stores/chain";
  import { wallet } from "./lib/stores/crypto";
</script>

<main>
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

      <h3>Chain</h3>
      <h5>You are on chain {$chain}</h5>
    </div>
  </div>
</main>
