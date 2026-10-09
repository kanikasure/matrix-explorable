<script>
	// A filled quad over the unit square. Attached to the plain view it is the
	// original unit square; attached to the transformed view the matrix carries
	// it into the unit parallelogram, so its area is |det A|.
	export let view;
	export let color = "white";
	export let opacity = 0.35;
	export let zBias = -2;
	export let t = 0;
	// Outlines the quad, so a region collapsed to a line is still visible
	export let outline = false;

	// Scaling the emitted corners by t collapses the quad to a point when it
	// isn't wanted.
	let amount = 0;
	$: amount = t;

	// The surface is bound to its own data explicitly. Left implicit, mathbox
	// resolves it to the nearest preceding source, which in this scene can be
	// another component's area entirely.
	const id = "unit-area-" + Math.random().toString(36).slice(2, 10);

	view.area({
		id,
		expr: function (emit, x, y) {
			emit(x * amount, y * amount);
		},
		width: 2,
		height: 2,
		channels: 2,
		rangeX: [0, 1],
		rangeY: [0, 1]
	});

	const surface = view.surface({
		points: `#${id}`,
		fill: true,
		lineX: outline,
		lineY: outline,
		width: 3,
		color,
		opacity,
		zBias
	});

	$: surface.set("color", color);
</script>
