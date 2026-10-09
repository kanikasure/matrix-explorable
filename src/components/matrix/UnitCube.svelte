<script>
	// The six faces of the unit cube. Attached to the transformed view, the
	// matrix carries it into the parallelepiped whose volume is |det A|.
	export let view;
	export let color = "white";
	export let opacity = 0.22;
	export let zBias = -3;
	export let t = 0;
	// Outlines each face, so a cube flattened onto a plane is still visible
	export let outline = false;

	// Scaling the emitted corners by t collapses the cube to a point when it
	// isn't wanted.
	let amount = 0;
	$: amount = t;

	// origin + two edge directions for each face
	const faces = [
		[[0, 0, 0], [1, 0, 0], [0, 1, 0]],
		[[0, 0, 1], [1, 0, 0], [0, 1, 0]],
		[[0, 0, 0], [1, 0, 0], [0, 0, 1]],
		[[0, 1, 0], [1, 0, 0], [0, 0, 1]],
		[[0, 0, 0], [0, 1, 0], [0, 0, 1]],
		[[1, 0, 0], [0, 1, 0], [0, 0, 1]]
	];

	// Each surface is bound to its own data explicitly. Left implicit, mathbox
	// resolves to the nearest preceding source, which with six interleaved
	// pairs can latch onto another component's area and draw a stray quad.
	const prefix = "unit-cube-" + Math.random().toString(36).slice(2, 10);
	const surfaces = [];

	faces.forEach(([o, u, v], i) => {
		const id = `${prefix}-${i}`;

		view.area({
			id,
			expr: function (emit, x, y) {
				emit(
					(o[0] + x * u[0] + y * v[0]) * amount,
					(o[1] + x * u[1] + y * v[1]) * amount,
					(o[2] + x * u[2] + y * v[2]) * amount
				);
			},
			width: 2,
			height: 2,
			channels: 3,
			rangeX: [0, 1],
			rangeY: [0, 1]
		});

		surfaces.push(
			view.surface({
				points: `#${id}`,
				fill: true,
				lineX: outline,
				lineY: outline,
				width: 2,
				color,
				opacity,
				zBias
			})
		);
	});

	$: surfaces.forEach((s) => s.set("color", color));
</script>
