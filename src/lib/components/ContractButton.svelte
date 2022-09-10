<script lang="ts">
    import { utils } from "ethers";
    import { SpinLine } from "svelte-loading-spinners";
    import { chain } from "../stores/chain";
    import { contract } from "../stores/contract";
    import { toast } from "../stores/toast";
    import { getTxAddress } from "../utils/chain";
    import RounderCross from "./icons/RounderCross.svelte";

    export let totalAmount: number;
    export let addresses: string[];

    let executionPromise: Promise<string>;

    let btnMessage = "Approve operation";

    function startPayment() {
        executionPromise = executeSplitPayment();
    }

    async function executeSplitPayment(): Promise<string> {
        btnMessage = "Waiting for user approval";
        const tx = await $contract.splitPayment(addresses, {
            value: utils.parseEther(totalAmount.toString()),
        });
        btnMessage = "Waiting for transaction to finish";
        await tx.wait();

        btnMessage = "Transaction completed!";
        toast.push("Transaction completed", "alert-success");
        return getTxAddress($chain, tx.hash);
    }
</script>

{#if !executionPromise}
    <button
        class="btn btn-success w-half"
        disabled={!$contract}
        on:click={startPayment}
    >
        {btnMessage}
    </button>
{:else}
    {#await executionPromise}
        <SpinLine size="60" color="#FF3E00" unit="px" />
        {btnMessage}
    {:then txUrl}
        <div class="card w-96 bg-base-100 shadow-xl">
            <div class="card-body">
                <h2 class="card-title">Transaction complee</h2>
                <p>Transaction has been successfully executed</p>
                <div class="card-actions justify-end">
                    <a href={txUrl} target="_blank">
                        <button class="btn btn-primary">
                            See in the block explorer
                        </button>
                    </a>
                </div>
            </div>
        </div>
    {:catch error}
        <div class="alert alert-error shadow-lg">
            <div>
                <RounderCross />
                <span>Error! {error.code}</span>
            </div>
        </div>
    {/await}
{/if}
