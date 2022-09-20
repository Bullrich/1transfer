<script lang="ts">
    import { utils, type ContractTransaction } from "ethers";
    import { SpinLine } from "svelte-loading-spinners";
    import type { CurrencyMetadata } from "../config/currencies/types";
    import { ERC20__factory } from "../contracts";
    import {
        address,
        chain,
        contract,
        currency,
        signer,
        toast,
    } from "../stores";
    import { getTxAddress } from "../utils/chain";
    import RounderCross from "./icons/RounderCross.svelte";

    enum TokenAllowanceState {
        NotAproved,
        Waiting,
        Approved,
    }

    export let totalAmount: number;
    export let addresses: string[];

    $: needsToApproveTokens = $currency.isToken
        ? TokenAllowanceState.NotAproved
        : TokenAllowanceState.Approved;

    let executionPromise: Promise<string>;

    let btnMessage = "Transfer";

    function startPayment() {
        executionPromise = executeSplitPayment();
    }

    async function approveToken(): Promise<boolean> {
        if ($currency.isToken) {
            needsToApproveTokens = TokenAllowanceState.Waiting;
            const token: CurrencyMetadata = $currency as CurrencyMetadata;
            const tokenContract = ERC20__factory.connect(
                token.address,
                $signer
            );
            const approvenTokens = await tokenContract.allowance(
                $address,
                $contract.address
            );

            const tokenUnits = utils.parseUnits(
                totalAmount.toString(),
                token.decimals
            );
            if (approvenTokens.lt(tokenUnits)) {
                const tx = await tokenContract.approve(
                    $contract.address,
                    tokenUnits
                );
                await tx.wait();
            }
            needsToApproveTokens = TokenAllowanceState.Approved;
            return true;
        }
    }

    async function executeSplitPayment(): Promise<string> {
        btnMessage = "Waiting for user approval";
        let tx: ContractTransaction;
        if ($currency.isToken) {
            const token: CurrencyMetadata = $currency as CurrencyMetadata;
            const tokenUnits = utils.parseUnits(
                totalAmount.toString(),
                token.decimals
            );
            tx = await $contract.splitTokenPayment(
                addresses,
                tokenUnits,
                token.address
            );
        } else {
            tx = await $contract.splitPayment(addresses, {
                value: utils.parseEther(totalAmount.toString()),
            });
        }
        btnMessage = "Waiting for transaction to finish";
        await tx.wait();

        btnMessage = "Transaction completed!";
        toast.push("Transaction completed", "alert-success");
        return getTxAddress($chain, tx.hash);
    }
</script>

{#if !executionPromise}
    {#if needsToApproveTokens !== TokenAllowanceState.Approved}
        <button
            class="btn btn-success w-half"
            disabled={!$contract ||
                needsToApproveTokens !== TokenAllowanceState.NotAproved}
            on:click={approveToken}
        >
            {#if needsToApproveTokens === TokenAllowanceState.NotAproved}
                Allow the 1Transfer protocol to use your {$currency.symbol.toUpperCase()}
            {:else}
                Waiting for token approval
            {/if}
        </button>
    {:else}
        <button
            class="btn btn-success w-half"
            disabled={!$contract}
            on:click={startPayment}
        >
            {btnMessage}
        </button>
    {/if}
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
