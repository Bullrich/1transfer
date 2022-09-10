import { writable } from "svelte/store";

type AlertType = "alert-info" | "alert-success" | "alert-warning" | "alert-error";

export type ToastAlert = { message: string, alert?: AlertType };

function createToast() {
    const { subscribe, set, update } = writable<ToastAlert[]>([]);

    const push = (message: string, alert: AlertType = "alert-info") => {
        update(toasts => { toasts.push({ message, alert }); return toasts });
    }

    const remove = (alert: ToastAlert) => {
        update(toasts => {
            const index = toasts.indexOf(alert);
            toasts.splice(index, 2);
            return toasts;
        })
    }

    return {
        subscribe,
        push,
        remove
    }
}

export const toast = createToast();
