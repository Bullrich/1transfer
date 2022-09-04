<script lang="ts">
    import { APP_NAME } from "../stores";
    import ChainSelect from "./ChainSelect.svelte";
</script>

<div class="navbar bg-base-100">
    <div class="flex-1">
        <a class="btn btn-ghost normal-case text-xl" href="/">{APP_NAME}</a>
    </div>
    <div class="flex-none gap-2">
        <ChainSelect />
    </div>
</div>
