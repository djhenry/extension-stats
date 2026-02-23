<script lang="ts">
  interface Props {
    value: number;
    max: number;
  }

  let { value, max }: Props = $props();

  const percentage = $derived(Math.min(100, (value / max) * 100));
</script>

<div
  role="progressbar"
  aria-valuenow={value}
  aria-valuemin={0}
  aria-valuemax={max}
  class="w-full bg-[var(--pd-content-divider)] rounded-full h-2.5 mt-2"
>
  <div
    class="bg-[var(--pd-state-info)] h-2.5 rounded-full"
    style="width: {percentage}%"
  ></div>
</div>
