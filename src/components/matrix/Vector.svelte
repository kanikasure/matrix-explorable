<script>
	import VectorTex from "./VectorTex.svelte";
	import { HTML } from "@threlte/extras";
	import katex from "katex";
	import { formatCoord } from "$utils";
	import { Color } from "three";
	import { onMount } from "svelte";

	export let view;
	export let coords = [0, 0, 0, -1, 2, 0];
	export let color = "white";
	export let tex = true;
	export let texOpacity = 1;
	export let scalar = false;
	export let scalarOpacity = 1;
	export let scalarAlign = "center";
	export let visible = true;
	export let dim3 = false;
	export let label = false;
	export let labelOpacity = 1;
	// Which side of the vector the name label sits on (+1 / -1)
	export let labelSide = 1;

	$: [x1, y1, z1, x2, y2, z2] = coords;

	const vectorProps = {
		end: true,
		width: 3,
		// zBias: 10_000,
		zBias: 1_000,
    zIndex: 3,
		// size: 10,
		width: 3,
		// color: new Color(color).convertLinearToSRGB(),
		color,
		visible
	};

	const data = view.array({
		data: coords,
		width: 2,
		items: 2,
		channels: 3
	});

	const vector = view.vector({
		...vectorProps
	});

	$: data.set("data", coords);
	$: vector.set("visible", visible);

	// const alignOpts = {
	// 	center: "translate-x-0",
	// 	left: "translate-x-2/3",
	// 	top: "translate-y-2/3"
	// };

	const offset = 0.4;
	let dx;
	let dy;

	$: if (scalarAlign == "center") {
		dx = 0;
		dy = 0;
	} else if (scalarAlign == "left") {
		dx = offset * 1.5;
		dy = 0;
	} else if (scalarAlign == "top") {
		dx = 0;
		dy = -offset;
	} else if (scalarAlign == "right") {
		dx = -offset;
		dy = 0;
	} else if (scalarAlign == "bottom") {
		dx = 0;
		dy = offset;
	}

	let ref;
	let labelRef;

	onMount(() => {
		// HACK
		if (ref) ref.parentElement.style.pointerEvents = "none";
		if (labelRef) labelRef.parentElement.style.pointerEvents = "none";
	});

	// Name label (e.g. "\vec{v}"), offset perpendicular to the vector so it
	// doesn't collide with the coordinate/scalar labels at the tip
	const labelOffset = 0.45;
	$: midX = (x1 + x2) / 2;
	$: midY = (y1 + y2) / 2;
	$: midZ = (z1 + z2) / 2;
	$: labelAngle = Math.atan2(y2 - y1, x2 - x1);
	$: labelPosition = dim3
		? [midX, midY, midZ + labelOffset]
		: [
				midX + labelSide * labelOffset * Math.sin(labelAngle),
				midY - labelSide * labelOffset * Math.cos(labelAngle),
				midZ
		  ];
</script>

{#if tex}
	<VectorTex {coords} opacity={texOpacity} {dim3} />

	<!-- Scalar label -->
	{#if scalar !== false}
		{@const position = dim3
			? [x2 / 2, y2 / 2, z2 / 2]
			: [x2 / 2 + dx, y2 / 2 + dy, z2 / 2]}
		<HTML {position} center>
			<span
				bind:this={ref}
				class="text-xl whitespace-nowrap"
				style:opacity={scalarOpacity}
			>
				{@html katex.renderToString(String.raw`\times ${formatCoord(scalar)}`)}
			</span>
		</HTML>
	{/if}
{/if}

<!-- Name label, e.g. vector v with an arrow on top -->
{#if label}
	<HTML position={labelPosition} center>
		<span
			bind:this={labelRef}
			class="text-2xl whitespace-nowrap bg-base-300/50 inline-block px-1"
			style:opacity={labelOpacity}
			style:color
		>
			{@html katex.renderToString(label)}
		</span>
	</HTML>
{/if}
