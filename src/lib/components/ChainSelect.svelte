<script lang="ts">
    import { onDestroy } from "svelte";
    import { chain } from "../stores/chain";
    import { Chains, getChainCollection, isKnownNetwork } from "../utils/chain";

    const collection = getChainCollection();
    let bindValue: Chains = $chain;
    onNetworkChange($chain);

    function onNetworkChange(id: number) {
        bindValue = isKnownNetwork(id) ? id : -1;
    }

    onDestroy(chain.subscribe(onNetworkChange));

    function changeChain() {
        chain.changeNetwork(bindValue);
    }
</script>

<select
    class="select w-full max-w-xs select-primary"
    bind:value={bindValue}
    on:change={changeChain}
>
    <option disabled selected value={-1}>Unknown network</option>
    {#each collection as chain}
        <option value={chain.id}>{chain.name}</option>
    {/each}
</select>
