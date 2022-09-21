<script lang="ts">
    import { APP_NAME } from "../stores";
    import ChainSelect from "./ChainSelect.svelte";
    import { signer } from "../stores/crypto";
    import LogInButton from "./LogInButton.svelte";
    import Logo from "../../assets/logo.svg";
</script>

<div class="navbar bg-base-100">
    <div class="flex-1">
        <a class="btn btn-ghost normal-case text-xl" href="/">
            <img class="logo" src={Logo} alt="logo" />{APP_NAME}
        </a>
    </div>
    <div class="flex-none gap-2">
        {#if $signer}
            <ChainSelect />
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
