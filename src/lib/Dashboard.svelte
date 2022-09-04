<script lang="ts">
    import { utils } from "ethers";
    import Form from "./components/Form.svelte";
    import { addressesLength, amount } from "./stores/form";
  
    function splitPayment(amount: number, targets: number) {
      const amountInEth = utils.parseUnits(amount.toString());
      const parsedTarget = utils.parseUnits(`${targets}00000`, "gwei");
      const remaining = amountInEth.mod(parsedTarget);
      const result = amountInEth.sub(remaining).div(targets);
      console.log(
        `Total: ${amountInEth} % ${parsedTarget} = ${remaining.toString()}`
      );
      return utils.formatEther(result.toString());
    }
  </script>
  
  <div class="hero min-h-full flex-grow bg-base-200">
    <div class="hero-content flex-col lg:flex-row-reverse">
      <div class="text-center lg:text-left">
        {#if $amount > 0 && $addressesLength > 0}
          <h1 class="text-5xl font-bold">Payment details</h1>
          <p class="py-6">
            Payment will be split between {$addressesLength} accounts. Each account
            will receive {splitPayment($amount, $addressesLength)}
          </p>
        {:else}
          <h1 class="text-5xl font-bold">Split payment</h1>
          <p class="py-6">
            Split your crypto payment equally between different accounts!
          </p>
        {/if}
      </div>
      <Form />
    </div>
  </div>
  