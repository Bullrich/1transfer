<script lang="ts">
    import { onDestroy } from "svelte";
    import { cubicIn } from "svelte/easing";
    import { tweened } from "svelte/motion";
    import { toast, type ToastAlert } from "../../stores/toast";

    export let alert: ToastAlert;

    const durationInMl = 3000;

    const progress = tweened(0, { duration: durationInMl, easing: cubicIn });
    progress.set(100);
    const unsubscribe = progress.subscribe((p) => {
        if (p === 100) {
            toast.remove(alert);
        }
    });

    onDestroy(unsubscribe);
</script>

<div class={`alert ${alert.alert}`}>
    <div>
        {alert.message}
    </div>
</div>
