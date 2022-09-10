<script lang="ts">
    import { flip } from "svelte/animate";
    import { fade, fly } from "svelte/transition";
    import { toast } from "../stores/toast";
    import ToastAlert from "./toast/ToastAlert.svelte";
</script>

<div class="toast toast-end">
    {#each $toast as alert, index (alert.message + alert.alert + index)}
        <div in:fly out:fade animate:flip={{ duration: 200 }}>
            <ToastAlert {alert} />
        </div>
    {/each}
</div>
