<script lang="ts">
    import truncateEthAddress from "truncate-eth-address";
    import Logo from "../../assets/logo.svg";
    import { APP_NAME } from "../stores";
    import { address, ensName, signer } from "../stores/crypto";
    import ChainSelect from "./ChainSelect.svelte";
    import LogInButton from "./LogInButton.svelte";

    $: shortAddress = $address ? truncateEthAddress($address) : "";
</script>

<div class="navbar bg-base-100">
    <div class="flex-1">
        <a class="btn btn-ghost normal-case text-xl" href="/">
            <img class="logo" src={Logo} alt="logo" />{APP_NAME}
        </a>
    </div>
    <div class="flex-none gap-2">
        {#if $signer}
            <ul class="menu menu-horizontal p-0">
                <li>
                    <ChainSelect />
                </li>
                <li>
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <a>
                        {$ensName ? $ensName : shortAddress}
                    </a>
                </li>
            </ul>
        {:else}
            <LogInButton />
        {/if}
    </div>
</div>

<style>
    .logo {
        max-height: 70%;
    }
</style>
