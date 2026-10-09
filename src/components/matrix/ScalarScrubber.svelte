<script>
	import { scalarDemoValue } from "$stores";
</script>

<div class="flex flex-col gap-1 w-full pointer-events-auto not-prose">
	<span class="text-sm opacity-70">Scalar — {$scalarDemoValue.toFixed(1)}</span>
	<input
		bind:value={$scalarDemoValue}
		type="range"
		min={-2}
		max={2}
		step={0.1}
		class="range range-sm range-info"
	/>
</div>
