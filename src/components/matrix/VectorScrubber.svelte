<script>
	import { introVectorAngleDeg, introVectorLength } from "$stores";
</script>

<div class="flex flex-col gap-4 w-full pointer-events-auto not-prose">
	<label class="flex flex-col gap-1">
		<span class="text-sm opacity-70"
			>Direction — {Math.round($introVectorAngleDeg)}°</span
		>
		<input
			bind:value={$introVectorAngleDeg}
			type="range"
			min={0}
			max={359}
			step={1}
			class="range range-sm range-info"
		/>
	</label>

	<label class="flex flex-col gap-1">
		<span class="text-sm opacity-70">Length — {$introVectorLength.toFixed(1)}</span
		>
		<input
			bind:value={$introVectorLength}
			type="range"
			min={0.2}
			max={3}
			step={0.1}
			class="range range-sm range-info"
		/>
	</label>
</div>
