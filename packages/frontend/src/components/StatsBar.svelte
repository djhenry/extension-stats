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
  class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700"
>
  <div
    class="bg-blue-600 h-2.5 rounded-full"
    style="width: {percentage}%"
  ></div>
</div>
