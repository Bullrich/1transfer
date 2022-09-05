<script lang="ts">
  import Form from "./components/Form.svelte";
  import PricePreview from "./components/PricePreview.svelte";
</script>

<div class="hero min-h-full flex-grow bg-base-200">
  <div class="hero-content flex-col lg:flex-row-reverse">
    <div class="text-center lg:text-left">
      <PricePreview />
    </div>
    <Form />
  </div>
</div>
