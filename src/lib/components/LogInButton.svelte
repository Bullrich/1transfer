<script lang="ts">
    import {signer} from "../stores/crypto";
</script>

<button class="btn btn-primary" on:click={signer.signIn}>Sign In</button>
