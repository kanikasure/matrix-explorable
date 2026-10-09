<script>
	// import Grid from "./Grid.svelte";
	import { Grid, useGltf, useTexture } from "@threlte/extras";
	import { useTweakpane } from "$utils/useTweakpane";
	import { T, useThrelte } from "@threlte/core";
	import Points from "./Points.svelte";
	import Sphere from "./Sphere.svelte";
	import Circle from "./Circle.svelte";
	import Planes from "./Planes.svelte";
	import Plane from "./Plane.svelte";
	import Grid3d from "./Grid3d.svelte";
	import Sky from "./Sky.svelte";
	import Gridlines from "./Gridlines.svelte";
	import {
		endMatrix,
		playhead,
		playToggle,
		matrixTween,
		gridToggled,
		grid3dToggled,
		transformedGridToggled,
		dataToggled,
		showHero,
		heroMatrix,
		afterImageEnabled,
		cameraAutoRotate,
		show3d,
		showPlayground,
		customMatrix,
		debug,
		inputVectorToggled,
		rgbShiftEnabled,
		resetViewToggle,
    show2d
	} from "$stores";
	import Vector from "./Vector.svelte";
	import { ScrollTrigger, gsap } from "$utils/gsap.js";
	import { onMount } from "svelte";
	import {
		sceneMounted,
		titleMounted,
		loaded,
		cameraProps,
		cameraControls,
		playgroundSt,
		vectorCoordsInput,
		introVectorAngleDeg,
		introVectorLength,
		scalarDemoValue
	} from "$stores";
	import {
		colorVector,
		colorX,
		colorY,
		colorZ,
		egVector,
		egMatrixX,
		egMatrixY,
		egOutputVector,
		eg3dMatrix,
		eg3dMatrixX,
		eg3dMatrixY,
		eg3dMatrixZ,
		eg3dVector,
		eg3dOutputVector,
		egEndMatrix,
		initMatrix,
		scalarDemoVector,
		addVectorA,
		addVectorB,
		addVectorSum,
		colorAddA,
		colorAddB,
		colorAreaOld,
		colorAreaNew,
		colorAreaZero,
		negDetMatrixX,
		negDetMatrixY,
		negDetEndMatrix,
		zeroDetMatrixX,
		zeroDetMatrixY,
		zeroDetEndMatrix,
		singularP,
		singularQ,
		colorGrid,
		colorGridAlt
	} from "$data/variables";
	import colors from "tailwindcss/colors";
	import CameraControls from "camera-controls";
	import {
		Color,
		MeshBasicMaterial,
		PlaneGeometry,
		SRGBColorSpace,
		sRGBEncoding
	} from "three";
	import Hero from "./Hero.svelte";
	import { spring } from "svelte/motion";
	import { base, assets } from "$app/paths";
	import Vectors from "./Vectors.svelte";
	import UnitArea from "./UnitArea.svelte";
	import UnitCube from "./UnitCube.svelte";

	export let mathbox;

	// const map = useTexture("/maxwell.jpg");
	const map = useTexture(`${assets}/maxwell.jpg`);
	$: if ($map) $map.encoding = sRGBEncoding;

	let mounted;

	// Set this to the z-position of the camera
	// mathbox.set("focus", 15);
	mathbox.set("focus", 20);

	// Set up coordinate system
	const dim = 1;
	const range = [
		[-dim, dim],
		[-dim, dim],
		[-dim, dim]
	];
	const view = mathbox.cartesian({
		range
	});

	const planeDim = 10;

	// States
	const startMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
	// Object that gets animated
	let matrix = [...startMatrix];
	// `$endMatrix` records the final state of the matrix

	// const transformedView = view.transform();
	// FIXME: Or should I just set manually?
	// const transformedView = view.transform({}, { matrix: () => matrix });
	const transformedView = view.transform();

	// Matrix animation
	// TODO: Make the ease linear
	// So that the playhead corresponds to the animation progress
	// Tween the animation's progress separately instead
	$matrixTween = gsap.to(matrix, {
		ease: "linear",
		duration: 2,
		paused: true,
		endArray: $endMatrix,
		onUpdate() {
			// Sync playhead with animation progress
			$playhead = this.progress();
			matrix = matrix;
		},
		onComplete() {
			// Toggle play icon
			$playToggle = true;
			// FIXME:
			this.pause();
		}
	});
	// $matrixTween.progress(1);

	// FIXME: Setting $endMatrix directly doesn't work for some reason
	// FIXME: Use different matrix transformation states during narrative, and during interaction time
	$: onMatrixChange($endMatrix);

	let nudgeFlag = true;

	// FIXME: This has to run first!!
	function onMatrixChange(endMatrix) {
		// Reset matrix
		matrix.forEach((_, i) => {
			matrix[i] = startMatrix[i];
		});

		// Update tween
		$matrixTween.invalidate();

		// HACK: Nudge
		const nudgeAmt = nudgeFlag ? 0.0001 : -0.0001;
		$matrixTween.progress($matrixTween.progress() + nudgeAmt);
		nudgeFlag = !nudgeFlag;

		// FIXME: Stays the same
		matrix = matrix;
	}

	// Use different states during interaction and during narrative
	const matrixTransform = spring(initMatrix);
	$: {
		if ($showHero) {
			$matrixTransform = $heroMatrix;
			// } else if (!$showPlayground) {
			// 	$matrixTransform = $customMatrix;
		} else {
			$matrixTransform = matrix;
		}
	}

	// Update transformed view
	$: transformedView.set("matrix", $matrixTransform);

	// $: console.log(matrixTransform)

	// Grid props
	const gridCellSize = 1;
	const gridSectionSize = 5;

	const defaultGridProps = {
		cellSize: gridCellSize,
		cellColor: colors.slate["700"],
		cellThickness: 1.5,
		sectionSize: gridSectionSize,
		sectionColor: colors.slate["700"],
		sectionThickness: 3,
		infiniteGrid: true
	};

	$: gridSettings = $show3d
		? {
				fadeDistance: 150,
				fadeStrength: 4
		  }
		: {
				fadeDistance: 50,
				fadeStrength: 5
		  };

	$: transformedGridSettings = $show3d
		? {
				fadeDistance: 150,
				fadeStrength: 4
		  }
		: {
				// fadeDistance: 50,
				// fadeStrength: 9
				fadeDistance: 100,
				fadeStrength: 8
		  };

	let gridProps = {
		...defaultGridProps,
		// sectionThickness: 2.5,
		...gridSettings
	};

	let transformedGridProps = {
		...defaultGridProps,
		cellColor: colorGridAlt,
		sectionColor: colorGrid,
		...transformedGridSettings
	};

	let grid3dProps = {
		...defaultGridProps,
		infiniteGrid: false,
		cellColor: colorGridAlt,
		sectionColor: colorGrid,
		gridSize: [10, 10],
		cellThickness: 0,
		sectionThickness: 0,
		t: 0
	};

	let gridVars = {
		fadeDistance: gridProps.fadeDistance,
		transformedFadeDistance: 0,
		fadeStrength: gridProps.fadeStrength,
		transformedFadeStrength: transformedGridProps.fadeStrength
	};

	// let grid3dProps = {
	// 	t: 0
	// };

	$: onGridToggle($gridToggled);
	function onGridToggle(toggled) {
		if (toggled) {
			gsap.to(gridProps, {
				fadeDistance: gridSettings.fadeDistance,
				onUpdate: function () {
					gridProps = gridProps;
				}
			});
		} else {
			gsap.to(gridProps, {
				fadeDistance: 0,
				onUpdate: function () {
					gridProps = gridProps;
				}
			});
		}
	}

	$: onTransformedGridToggle($transformedGridToggled);
	function onTransformedGridToggle(toggled) {
		if (toggled) {
			gsap.to(transformedGridProps, {
				fadeDistance: transformedGridSettings.fadeDistance,
				onUpdate: function () {
					transformedGridProps = transformedGridProps;
				}
			});
		} else {
			gsap.to(transformedGridProps, {
				fadeDistance: 0,
				onUpdate: function () {
					transformedGridProps = transformedGridProps;
				}
			});
		}
	}

	$: onGrid3dToggle($grid3dToggled);
	function onGrid3dToggle(toggled) {
		if (toggled) {
			gsap.to(grid3dProps, {
				t: 1,
				cellThickness: defaultGridProps.cellThickness,
				sectionThickness: defaultGridProps.sectionThickness,
				onUpdate: function () {
					grid3dProps = grid3dProps;
				}
			});
		} else {
			gsap.to(grid3dProps, {
				t: 0,
				cellThickness: 0,
				sectionThickness: 0,
				onUpdate: function () {
					grid3dProps = grid3dProps;
				}
			});
		}
	}

	const cachePlaygroundSettings = {
		dataToggled: undefined,
		gridToggled: true,
		transformedGridToggled: true
	};

	let prevDataToggled;
	$: onDataToggle($dataToggled);
	function onDataToggle(toggled) {
		// Animate out
		if (prevDataToggled == "points") {
			gsap.to(pointsProps, {
				t: 0,
				onUpdate: function () {
					pointsProps = pointsProps;
				}
			});
		} else if (prevDataToggled == "3d points") {
			gsap.to(points3dProps, {
				t: 0,
				onUpdate: function () {
					points3dProps = points3dProps;
				}
			});
		} else if (prevDataToggled == "planes") {
			gsap.to(planesProps, {
				t: 0,
				onUpdate: function () {
					planesProps = planesProps;
				}
			});
		} else if (prevDataToggled == "3d planes") {
			gsap.to(planes3dProps, {
				t: 0,
				onUpdate: function () {
					planes3dProps = planes3dProps;
				}
			});
		} else if (prevDataToggled == "model") {
			gsap.to(modelProps, {
				scale: 0,
				onUpdate: function () {
					modelProps = modelProps;
				}
			});
		} else if (prevDataToggled == "image") {
			gsap.to(imageProps, {
				scale: 0,
				onUpdate: function () {
					imageProps = imageProps;
				}
			});
		}

		// Animate in
		if (toggled == "points") {
			gsap.to(pointsProps, {
				t: 1,
				onUpdate: function () {
					pointsProps = pointsProps;
				}
			});
		} else if (toggled == "3d points") {
			gsap.to(points3dProps, {
				t: 1,
				onUpdate: function () {
					points3dProps = points3dProps;
				}
			});
		} else if (toggled == "planes") {
			gsap.to(planesProps, {
				t: 1,
				onUpdate: function () {
					planesProps = planesProps;
				}
			});
		} else if (toggled == "3d planes") {
			gsap.to(planes3dProps, {
				t: 1,
				onUpdate: function () {
					planes3dProps = planes3dProps;
				}
			});
		} else if (toggled == "model") {
			gsap.to(modelProps, {
				scale: 0.25,
				onUpdate: function () {
					modelProps = modelProps;
				}
			});
		} else if (toggled == "image") {
			gsap.to(imageProps, {
				scale: 1,
				onUpdate: function () {
					imageProps = imageProps;
				}
			});
		}

		// Update prev value
		prevDataToggled = toggled;
	}

	// Have a show 3d trigger?
	$: toggle3d($show3d);
	function toggle3d(toggle) {
		if ($gridToggled) {
			gsap.to(gridProps, {
				duration,
				fadeDistance: gridSettings.fadeDistance,
				fadeStrength: gridSettings.fadeStrength,
				onUpdate: () => (gridProps = gridProps)
			});
		}

		if ($transformedGridToggled) {
			gsap.to(transformedGridProps, {
				duration,
				fadeDistance: transformedGridSettings.fadeDistance,
				fadeStrength: transformedGridSettings.fadeStrength,
				onUpdate: () => (transformedGridProps = transformedGridProps)
			});
		}

		if ($showPlayground) {
			if (!$show3d) {
				// Hide any toggled 3d objects
				$dataToggled = undefined;
				onDataToggle(undefined);

				// Reset camera to 2d view
				$resetViewToggle = !$resetViewToggle;

				// Hide z basis vector
				basisAltProps.zVisible = false;

				// Remove z-coord of input vector
				$vectorCoordsInput[2] = 0;
				// $vectorCoordsInput = $vectorCoordsInput

				// $endMatrix[2] = 0
				// $endMatrix[6] = 0
				// $endMatrix[8] = 0
				// $endMatrix[9] = 0
				// $endMatrix[10] = 1
				gsap.to($endMatrix, {
					endArray: initMatrix,
					onUpdate: () => {
						$endMatrix = $endMatrix;
					},
					duration
				});

				$grid3dToggled = false;
				onGrid3dToggle(false);
			} else {
				basisAltProps.zVisible = true;
			}
		}
	}

	// ScrollTrigger
	const delay = 0.1;
	const transitionDuration = 0.1;

	let vectorCoords = [0, 0, 0, 0, 0, 0];
	let xCoords = [0, 0, 0, 0, 0, 0];
	let yCoords = [0, 0, 0, 0, 0, 0];
	let zCoords = [0, 0, 0, 0, 0, 0];

	// Lets the direction/length scrubbers drive the example vector once its
	// scroll-triggered "grow-in" animation (trigger "#st-0a") has finished
	let introVectorRevealed = false;
	$: if (introVectorRevealed) {
		const angleRad = ($introVectorAngleDeg * Math.PI) / 180;
		vectorCoords[3] = $introVectorLength * Math.cos(angleRad);
		vectorCoords[4] = $introVectorLength * Math.sin(angleRad);
		vectorCoords = vectorCoords;
	}

	// Puts the example vector back to the canonical -i + 2j. Mutated in place:
	// reassigning would detach the array from the tweens that own it.
	function resetExampleVector() {
		vectorCoords[0] = 0;
		vectorCoords[1] = 0;
		vectorCoords[2] = 0;
		vectorCoords[3] = egVector[0];
		vectorCoords[4] = egVector[1];
		vectorCoords[5] = 0;
		vectorCoords = vectorCoords;
	}

	// Fixed vector, scaled live by the scalar scrubber (trigger "#st-0b")
	let scalarVectorCoords = [0, 0, 0, 0, 0, 0];
	let scalarVectorRevealed = false;
	$: if (scalarVectorRevealed) {
		scalarVectorCoords[3] = $scalarDemoValue * scalarDemoVector[0];
		scalarVectorCoords[4] = $scalarDemoValue * scalarDemoVector[1];
		scalarVectorCoords = scalarVectorCoords;
	}

	// Vector addition demo (head-to-tail), triggers "#st-0c" / "#st-0d" / "#st-0e"
	let addVectorACoords = [0, 0, 0, 0, 0, 0];
	let addVectorBCoords = [0, 0, 0, 0, 0, 0];
	let addSumCoords = [0, 0, 0, 0, 0, 0];
	let addProps = {
		aOpacity: 0,
		bOpacity: 0,
		sumOpacity: 0,
		// Coordinate columns, shown only while a and b both start at the origin.
		// Once b slides head-to-tail they collide with the joint, so they fade.
		aTex: 0,
		bTex: 0
	};

	// Retracts a demo's vectors back to the origin once its section is over.
	// This is a separate tween target on purpose: the coords arrays above are
	// owned by scroll-scrubbed timelines, so anything that tweens or kills them
	// directly would fight (or permanently detach) those timelines.
	let demoFade = {
		intro: 1,
		scalar: 1,
		add: 1,
		det: 1,
		det3d: 1,
		// The two vectors that collapse onto one point under a singular matrix
		singular: 0,
		// Owned by the 3D playground alone, so it never fights st-12's clear
		det3dPlay: 0
	};

	function retract(coords, f) {
		return coords.map((c) => c * f);
	}

	// Determinant section: reveal factors for the shaded unit regions
	let detProps = {
		square: 0,
		para: 0,
		cube: 0,
		box: 0
	};

	// The negative/zero/restore beats each own a separate scalar. Three scrubbed
	// timelines cannot share one target: while inactive each asserts its own
	// start value, and whichever renders last wins.
	let detMorph = { neg: 0, zero: 0, back: 0 };
	let detMorphActive = false;

	function lerpArr(a, b, t) {
		return a.map((v, i) => v + (b[i] - v) * t);
	}

	$: detMorphMatrix = lerpArr(
		lerpArr(
			lerpArr(egEndMatrix, negDetEndMatrix, detMorph.neg),
			zeroDetEndMatrix,
			detMorph.zero
		),
		egEndMatrix,
		detMorph.back
	);

	// Only ever drives the 2D determinant beats — never leaks into 3D.
	// Everything here is mutated in place: reassigning these arrays would
	// detach them from the gsap tweens that own them elsewhere.
	// Inverse section: identity -> A -> (times A inverse) back to identity ->
	// a singular matrix. One scalar per beat, same reason as detMorph.
	let invMorph = { a: 0, back: 0, singular: 0 };
	let invMorphActive = false;

	$: invMorphMatrix = lerpArr(
		lerpArr(
			lerpArr(initMatrix, egEndMatrix, invMorph.a),
			initMatrix,
			invMorph.back
		),
		zeroDetEndMatrix,
		invMorph.singular
	);

	// Applied here rather than by parenting to transformedView: the HTML
	// labels are positioned from the raw coords and would not follow the
	// view's matrix, so they'd sit at the untransformed spot.
	function applyMatrix2d(m, v) {
		return [m[0] * v[0] + m[1] * v[1], m[4] * v[0] + m[5] * v[1]];
	}

	$: singularPRender = [0, 0, 0, ...applyMatrix2d(invMorphMatrix, singularP), 0];
	$: singularQRender = [0, 0, 0, ...applyMatrix2d(invMorphMatrix, singularQ), 0];

	$: if (invMorphActive && !$show3d) {
		invMorphMatrix.forEach((v, i) => {
			$endMatrix[i] = v;
		});
		$endMatrix = $endMatrix;

		xCoords[3] = invMorphMatrix[0];
		xCoords[4] = invMorphMatrix[4];
		xCoords = xCoords;

		yCoords[3] = invMorphMatrix[1];
		yCoords[4] = invMorphMatrix[5];
		yCoords = yCoords;
	}

	$: if (detMorphActive && !$show3d) {
		detMorphMatrix.forEach((v, i) => {
			$endMatrix[i] = v;
		});
		$endMatrix = $endMatrix;

		xCoords[3] = detMorphMatrix[0];
		xCoords[4] = detMorphMatrix[4];
		xCoords = xCoords;

		yCoords[3] = detMorphMatrix[1];
		yCoords[4] = detMorphMatrix[5];
		yCoords = yCoords;
	}

	// Determinant of the transformation actually on screen, so the shaded
	// region can flag the moment space collapses — during the worked example
	// and equally while the reader is dragging the matrix in the playground.
	const degenerateEpsilon = 0.08;

	$: liveDet2d =
		$matrixTransform[0] * $matrixTransform[5] -
		$matrixTransform[1] * $matrixTransform[4];

	$: liveDet3d =
		$matrixTransform[0] *
			($matrixTransform[5] * $matrixTransform[10] -
				$matrixTransform[6] * $matrixTransform[9]) -
		$matrixTransform[1] *
			($matrixTransform[4] * $matrixTransform[10] -
				$matrixTransform[6] * $matrixTransform[8]) +
		$matrixTransform[2] *
			($matrixTransform[4] * $matrixTransform[9] -
				$matrixTransform[5] * $matrixTransform[8]);

	// The narrative clears the cube before the cat; the playground brings it
	// back. Separate scalars, so neither timeline overwrites the other.
	$: cubeFade = Math.max(demoFade.det3d, demoFade.det3dPlay);

	$: areaColor =
		Math.abs(liveDet2d) < degenerateEpsilon ? colorAreaZero : colorAreaNew;
	$: volumeColor =
		Math.abs(liveDet3d) < degenerateEpsilon ? colorAreaZero : colorAreaNew;

	$: introVectorRender = retract(vectorCoords, demoFade.intro);
	$: scalarVectorRender = retract(scalarVectorCoords, demoFade.scalar);
	$: addVectorARender = retract(addVectorACoords, demoFade.add);
	$: addVectorBRender = retract(addVectorBCoords, demoFade.add);
	$: addSumRender = retract(addSumCoords, demoFade.add);

	const vectorCoordsSpring = spring([0, 0, 0]);
	$: $vectorCoordsSpring = $vectorCoordsInput;

	// FIXME: Do we have to set visibility to false?
	// Hide vector input on toggle
	$: onInputVectorToggle($inputVectorToggled);
	function onInputVectorToggle(toggled) {
		if (toggled) {
			$vectorCoordsSpring = $vectorCoordsInput;
		} else {
			$vectorCoordsSpring = [0, 0, 0];
		}
	}

	// TODO: Separate this?
	let props = {
		vectorTexOpacity: 0,
		scalarLabelOpacity: 0,
		xTexOpacity: 0,
		yTexOpacity: 0,
		zTexOpacity: 0,
		xScalar: 1,
		yScalar: 1,
		zScalar: 1,
		xScalarOpacity: 0,
		yScalarOpacity: 0,
		zScalarOpacity: 0,
		xScalarAlign: "top",
		yScalarAlign: "left",
		zScalarAlign: "bottom",
		vectorVisible: false,
		xVisible: true,
		yVisible: true,
		zVisible: true,
		xDim3: false,
		yDim3: false,
		zDim3: false,
		vectorDim3: false
	};

	let pointsProps = {
		t: 0
	};

	let planesProps = {
		t: 0
	};

	let points3dProps = {
		t: 0
	};

	let planes3dProps = {
		t: 0
	};
	let modelProps = {
		scale: 0
	};
	let imageProps = {
		scale: 0
	};
	let vectorsProps = {
		enter: 0,
		exit: 1
	};

	let basisAltProps = {
		vectorVisible: true,
		xVisible: false,
		yVisible: false,
		zVisible: false
	};

	$: if ($debug) {
		basisAltProps.xVisible = true;
		basisAltProps.yVisible = true;
		basisAltProps.zVisible = true;
	}

	// $: basisAltProps.zVisible = $show3d;

	const stProps = {
		fastScrollEnd: true,
		pin: "#article",
		pinnedContainer: "#article",
		start: "center center",
		scrub: 1,
		pinSpacing: true,
		toggleClass: "active",
		invalidateOnRefresh: true,
		onEnter: function () {
			animateInStProgress();
		},
		onLeave: function () {
			animateOutStProgress();
		},
		onEnterBack: function () {
			animateInStProgress();
		},
		onLeaveBack: function () {
			animateOutStProgress();
		}
	};

	const stPropsAlt = {
		start: "bottom center",
		pinnedContainer: "#article",
		toggleActions: "play none none reverse",
		fastScrollEnd: true,
		end: 200
	};

	const timelineProps = {
		onUpdate: function () {
			updateStProgress(this.progress());
		}
	};

	const timelinePropsAlt = {
		ease: "power2.in"
	};

	const duration = 0.3;

	const scrollUnit = 1_000;

	function animate() {
		// FIXME: Review scroll amounts

		// Animate in vector
		gsap
			.timeline({
				...timelineProps,
				scrollTrigger: {
					...stProps,
					trigger: "#st-0a",
					end: `+=${scrollUnit * 1}`,
					onLeave: () => {
						stProps.onLeave();

						// Hand control of the vector over to the direction/length scrubbers
						introVectorRevealed = true;
					},
					onLeaveBack: () => {
						stProps.onLeaveBack();

						// Back at the top of the vector narrative. The coords and
						// opacities are owned by scrubbed timelines, which rewind
						// themselves — so only the non-scroll state is reset here.
						introVectorRevealed = false;
						scalarVectorRevealed = false;

						gsap.killTweensOf(demoFade);
						demoFade.intro = 1;
						demoFade.scalar = 1;
						demoFade.add = 1;
						demoFade.det = 1;
						demoFade = demoFade;

						$introVectorAngleDeg =
							((Math.atan2(egVector[1], egVector[0]) * 180) / Math.PI + 360) %
							360;
						$introVectorLength = Math.hypot(egVector[0], egVector[1]);
						$scalarDemoValue = 1;
					}
				}
			})
			.to(vectorCoords, {
				endArray: [0, 0, 0, ...egVector, 0],
				onUpdate: function () {
					vectorCoords = vectorCoords;
				}
			})
			.to(props, {
				vectorTexOpacity: 1,
				onUpdate: function () {
					props = props;
				}
			})
			.to(
				{},
				{
					duration: delay
				}
			);

		// Animate in scalar-scrubber vector
		gsap
			.timeline({
				...timelineProps,
				scrollTrigger: {
					...stProps,
					trigger: "#st-0b",
					end: `+=${scrollUnit * 1}`,
					onEnter: () => {
						stProps.onEnter();

						// The first "try it" is done — retract that vector
						introVectorRevealed = false;
						gsap.to(demoFade, {
							intro: 0,
							duration,
							onUpdate: () => {
								demoFade = demoFade;
							}
						});
					},
					onLeave: () => {
						stProps.onLeave();

						// Hand control of the vector over to the scalar scrubber
						scalarVectorRevealed = true;
					},
					onLeaveBack: () => {
						stProps.onLeaveBack();

						scalarVectorRevealed = false;
						$scalarDemoValue = 1;

						// Bring the first vector back as we re-enter its section
						introVectorRevealed = true;
						gsap.to(demoFade, {
							intro: 1,
							duration,
							onUpdate: () => {
								demoFade = demoFade;
							}
						});
					}
				}
			})
			.to(scalarVectorCoords, {
				endArray: [0, 0, 0, ...scalarDemoVector, 0],
				onUpdate: function () {
					scalarVectorCoords = scalarVectorCoords;
				}
			})
			.to(props, {
				scalarLabelOpacity: 1,
				onUpdate: function () {
					props = props;
				}
			})
			.to(
				{},
				{
					duration: delay
				}
			);

		// Clear the scalar-scrubber vector, animate in the two vectors to add
		gsap
			.timeline({
				...timelineProps,
				scrollTrigger: {
					...stProps,
					trigger: "#st-0c",
					end: `+=${scrollUnit * 1}`,
					onEnter: () => {
						stProps.onEnter();

						// The second "try it" is done — retract that vector
						scalarVectorRevealed = false;
						gsap.to(demoFade, {
							scalar: 0,
							duration,
							onUpdate: () => {
								demoFade = demoFade;
							}
						});
					},
					onLeaveBack: () => {
						stProps.onLeaveBack();

						scalarVectorRevealed = true;
						gsap.to(demoFade, {
							scalar: 1,
							duration,
							onUpdate: () => {
								demoFade = demoFade;
							}
						});
					}
				}
			})
			.add("step-1")
			.to(
				addVectorACoords,
				{
					endArray: [0, 0, 0, ...addVectorA, 0],
					onUpdate: function () {
						addVectorACoords = addVectorACoords;
					}
				},
				"step-1"
			)
			.to(
				addVectorBCoords,
				{
					endArray: [0, 0, 0, ...addVectorB, 0],
					onUpdate: function () {
						addVectorBCoords = addVectorBCoords;
					}
				},
				"step-1"
			)
			.to(
				addProps,
				{
					aOpacity: 1,
					bOpacity: 1,
					aTex: 1,
					bTex: 1,
					onUpdate: function () {
						addProps = addProps;
					}
				},
				"step-1"
			)
			.to(
				{},
				{
					duration: delay
				}
			);

		// Slide vector b's tail to vector a's tip (head-to-tail)
		gsap
			.timeline({
				...timelineProps,
				scrollTrigger: {
					...stProps,
					trigger: "#st-0d",
					end: `+=${scrollUnit * 1}`
				}
			})
			.add("step-1")
			.to(
				addVectorBCoords,
				{
					endArray: [addVectorA[0], addVectorA[1], 0, ...addVectorSum, 0],
					onUpdate: function () {
						addVectorBCoords = addVectorBCoords;
					}
				},
				"step-1"
			)
			// Their coordinate columns would sit right on the joint — drop them
			.to(
				addProps,
				{
					aTex: 0,
					bTex: 0,
					onUpdate: function () {
						addProps = addProps;
					}
				},
				"step-1"
			)
			.to(
				{},
				{
					duration: delay
				}
			);

		// Animate in the sum vector
		gsap
			.timeline({
				...timelineProps,
				scrollTrigger: {
					...stProps,
					trigger: "#st-0e",
					end: `+=${scrollUnit * 1}`
				}
			})
			.to(addSumCoords, {
				endArray: [0, 0, 0, ...addVectorSum, 0],
				onUpdate: function () {
					addSumCoords = addSumCoords;
				}
			})
			.to(addProps, {
				sumOpacity: 1,
				onUpdate: function () {
					addProps = addProps;
				}
			})
			.to(
				{},
				{
					duration: delay
				}
			);

		// Addition demo is done — retract it and introduce the vector v that
		// carries the rest of the narrative. Scrubbed, so it reverses on scroll.
		gsap
			.timeline({
				...timelineProps,
				scrollTrigger: {
					...stProps,
					trigger: "#st-1",
					end: `+=${scrollUnit * 1}`,
					onEnter: () => {
						stProps.onEnter();

						// The scrubbers left this vector wherever the reader dragged
						// it. The text here promises a fresh v = -i + 2j, so put it
						// back. Safe to snap: it is still retracted at this point.
						resetExampleVector();
					},
					onEnterBack: () => {
						stProps.onEnterBack();

						resetExampleVector();
					}
				}
			})
			.add("step-1")
			.fromTo(
				demoFade,
				{ add: 1 },
				{
					add: 0,
					immediateRender: false,
					onUpdate: function () {
						demoFade = demoFade;
					}
				},
				"step-1"
			)
			.fromTo(
				demoFade,
				{ intro: 0 },
				{
					intro: 1,
					immediateRender: false,
					onUpdate: function () {
						demoFade = demoFade;
					}
				},
				"step-1+=0.3"
			)
			.to(
				{},
				{
					duration: delay
				}
			);

		// Animate in basis vectors
		gsap
			.timeline({
				...timelineProps,
				scrollTrigger: {
					...stProps,
					trigger: "#st-2",
					end: `+=${scrollUnit * 1}`
				}
			})
			.to(xCoords, {
				endArray: [0, 0, 0, 1, 0, 0],
				onUpdate: function () {
					xCoords = xCoords;
				},
				delay
			})
			.to(
				yCoords,
				{
					endArray: [0, 0, 0, 0, 1, 0],
					onUpdate: function () {
						yCoords = yCoords;
					}
				},
				"<"
			)
			.to(props, {
				xTexOpacity: 1,
				onUpdate: function () {
					props = props;
				}
			})
			.to(
				props,
				{
					yTexOpacity: 1,
					onUpdate: function () {
						props = props;
					}
				},
				"<"
			)
			.to(
				{},
				{
					duration: delay
				}
			);

		// Scale basis vectors to example vector
		gsap
			.timeline({
				...timelineProps,
				scrollTrigger: {
					...stProps,
					trigger: "#st-3",
					end: `+=${scrollUnit * 3}`,
					preventOverlaps: true
				}
			})
			// Animate out Tex
			.to(props, {
				xTexOpacity: 0,
				onUpdate: function () {
					props = props;
				}
			})
			.to(
				props,
				{
					yTexOpacity: 0,
					onUpdate: function () {
						props = props;
					}
				},
				"<"
			)
			// Scale basis vectors
			.add("step-2")
			.to(
				props,
				{
					duration: 0.2,
					xScalarOpacity: 1,
					onUpdate: function () {
						props = props;
					}
				},
				"step-2"
			)
			.to(
				props,
				{
					duration: 0.2,
					yScalarOpacity: 1,
					onUpdate: function () {
						props = props;
					}
				},
				"step-2"
			)
			.to(
				xCoords,
				{
					endArray: [0, 0, 0, egVector[0], 0, 0],
					onUpdate: function () {
						xCoords = xCoords;
					}
				},
				"step-2"
			)
			.to(
				yCoords,
				{
					endArray: [0, 0, 0, 0, egVector[1], 0],
					onUpdate: function () {
						yCoords = yCoords;
					}
				},
				"step-2"
			)
			.to(
				props,
				{
					xScalar: egVector[0],
					onUpdate: function () {
						props = props;
					}
				},
				"step-2"
			)
			.to(
				props,
				{
					yScalar: egVector[1],
					onUpdate: function () {
						props = props;
					}
				},
				"step-2"
			)
			.to({}, { duration: delay })
			// Shift y basis vector
			.add("step-3")
			.to(
				props,
				{
					duration: 0.2,
					xScalarOpacity: 0,
					onUpdate: function () {
						props = props;
					}
				},
				"step-3"
			)
			.to(
				props,
				{
					duration: 0.2,
					yScalarOpacity: 0,
					onUpdate: function () {
						props = props;
					}
				},
				"step-3"
			)
			.to(
				yCoords,
				{
					endArray: [egVector[0], 0, 0, ...egVector, 0],
					onUpdate: function () {
						yCoords = yCoords;
					}
				},
				"step-3"
			)
			.to({}, { duration: delay });

		// Animate basis vectors back
		gsap
			.timeline({
				scrollTrigger: {
					...stPropsAlt,
					trigger: "#st-3"
				},
				timelinePropsAlt
			})
			.add("step-1")
			// Reset scalar values
			.to(
				props,
				{
					duration,
					xScalar: 1,
					yScalar: 1
				},
				"step-1"
			)
			.to(
				xCoords,
				{
					duration,
					endArray: [0, 0, 0, 1, 0, 0],
					onUpdate: function () {
						xCoords = xCoords;
					}
				},
				"step-1"
			)
			.to(
				yCoords,
				{
					duration,
					endArray: [0, 0, 0, 0, 1, 0],
					onUpdate: function () {
						yCoords = yCoords;
					}
				},
				"step-1"
			)
			.to(props, {
				duration,
				xTexOpacity: 1,
				onUpdate: function () {
					props = props;
				}
			})
			.to(
				props,
				{
					duration,
					yTexOpacity: 1,
					onUpdate: function () {
						props = props;
					}
				},
				"<"
			);

		// Transform to new basis vectors
		gsap
			.timeline({
				...timelineProps,
				scrollTrigger: {
					...stProps,
					trigger: "#st-4",
					end: `+=${scrollUnit * 1}`
				}
			})
			// Animate to new basis vectors
			.to(xCoords, {
				endArray: [0, 0, 0, ...egMatrixX, 0],
				onUpdate: function () {
					xCoords = xCoords;
				}
			})
			.to(
				yCoords,
				{
					endArray: [0, 0, 0, ...egMatrixY, 0],
					onUpdate: function () {
						yCoords = yCoords;
					}
				},
				"<"
			)
			// Animate to output vector
			.to(
				vectorCoords,
				{
					endArray: [0, 0, 0, ...egOutputVector, 0],
					onUpdate: function () {
						vectorCoords = vectorCoords;
					}
				},
				"<"
			)
			.to(
				{},
				{
					duration: delay
				}
			);

		// Scale the basis vectors to the transformed vector
		gsap
			.timeline({
				...timelineProps,
				scrollTrigger: {
					...stProps,
					trigger: "#st-5",
					end: `+=${scrollUnit * 3}`
				}
			})
			.add("step-1")
			.to(
				props,
				{
					xScalarAlign: "left",
					yScalarAlign: "top"
				},
				"step-1"
			)
			// Animate out Tex
			.to(
				props,
				{
					xTexOpacity: 0,
					onUpdate: function () {
						props = props;
					}
				},
				"step-1"
			)
			.to(
				props,
				{
					yTexOpacity: 0,
					onUpdate: function () {
						props = props;
					}
				},
				"step-1"
			)
			// Scale basis vectors
			.add("step-2")
			.to(
				props,
				{
					duration: 0.2,
					xScalarOpacity: 1,
					onUpdate: function () {
						props = props;
					}
				},
				"step-2"
			)
			.to(
				props,
				{
					duration: 0.2,
					yScalarOpacity: 1,
					onUpdate: function () {
						props = props;
					}
				},
				"step-2"
			)
			.to(
				xCoords,
				{
					endArray: [
						0,
						0,
						0,
						egVector[0] * egMatrixX[0],
						egVector[0] * egMatrixX[1],
						0
					],
					onUpdate: function () {
						xCoords = xCoords;
					}
				},
				"step-2"
			)
			.to(
				yCoords,
				{
					endArray: [
						0,
						0,
						0,
						egVector[1] * egMatrixY[0],
						egVector[1] * egMatrixY[1],
						0
					],
					onUpdate: function () {
						yCoords = yCoords;
					}
				},
				"step-2"
			)
			.to(
				props,
				{
					xScalar: egVector[0],
					onUpdate: function () {
						props = props;
					}
				},
				"step-2"
			)
			.to(
				props,
				{
					yScalar: egVector[1],
					onUpdate: function () {
						props = props;
					}
				},
				"step-2"
			)
			.to({}, { duration: delay })
			// Shift y basis vector
			.add("step-3")
			.to(
				props,
				{
					duration: 0.2,
					xScalarOpacity: 0,
					onUpdate: function () {
						props = props;
					}
				},
				"step-3"
			)
			.to(
				props,
				{
					duration: 0.2,
					yScalarOpacity: 0,
					onUpdate: function () {
						props = props;
					}
				},
				"step-3"
			)
			.to(
				yCoords,
				{
					endArray: [
						egVector[0] * egMatrixX[0],
						egVector[0] * egMatrixX[1],
						0,
						...egOutputVector,
						0
					],
					onUpdate: function () {
						yCoords = yCoords;
					}
				},
				"step-3"
			)
			.to({}, { duration: delay });

		// Animate basis vectors back
		gsap
			.timeline({
				scrollTrigger: {
					...stPropsAlt,
					trigger: "#st-5"
				},
				timelinePropsAlt
			})
			.add("step-1")
			// Remove example vector
			.to(
				props,
				{
					duration,
					vectorTexOpacity: 0,
					onUpdate: function () {
						props = props;
					}
				},
				"step-1"
			)
			.to(
				vectorCoords,
				{
					duration,
					endArray: [0, 0, 0, 0, 0, 0],
					onUpdate: function () {
						vectorCoords = vectorCoords;
					}
				},
				"step-1"
			)
			// Animate back x basis
			.to(
				xCoords,
				{
					duration,
					endArray: [0, 0, 0, 1, 0, 0],
					onUpdate: function () {
						xCoords = xCoords;
					}
				},
				"step-1"
			)
			// Animate back y basis
			.to(
				yCoords,
				{
					duration,
					endArray: [0, 0, 0, 0, 1, 0],
					onUpdate: function () {
						yCoords = yCoords;
					}
				},
				"step-1"
			)
			.add("step-2")
			.to(
				props,
				{
					duration,
					xTexOpacity: 1,
					onUpdate: function () {
						props = props;
					}
				},
				"step-2"
			)
			.to(
				props,
				{
					duration,
					yTexOpacity: 1,
					onUpdate: function () {
						props = props;
					}
				},
				"step-2"
			);

		// Animate in points
		// FIXME: Animate vectors too?
		gsap
			.timeline({
				...timelineProps,
				scrollTrigger: {
					...stProps,
					trigger: "#st-6",
					end: `+=${scrollUnit * 4}`,
					onLeaveBack: () => {
						stProps.onLeaveBack();

						$dataToggled = undefined;
						$transformedGridToggled = false;
					}
				}
			})
			.add("step-1")
			// Animate in vectors
			.to(
				vectorsProps,
				{
					enter: 1,
					onUpdate: function () {
						vectorsProps = vectorsProps;
					}
				},
				"step-1"
			)
			// Animate out vectors
			.to(
				vectorsProps,
				{
					exit: 0,
					onUpdate: function () {
						vectorsProps = vectorsProps;
					}
				},
				"step-1+=0.1"
			)
			// Animate in points
			.to(
				pointsProps,
				{
					t: 1,
					onUpdate: function () {
						pointsProps = pointsProps;
					}
				},
				"step-1+=0.15"
			)
			// Animate in transformed grid
			.to(
				gridVars,
				{
					transformedFadeDistance: gridProps.fadeDistance,
					onUpdate: function () {
						gridVars = gridVars;
					}
				},
				"step-1+=0.15"
			)
			.to(
				{},
				{
					duration: delay
				}
			);

		// Perform linear transformation
		// TODO: Use afterimage for animation of points?
		gsap
			.timeline({
				...timelineProps,
				scrollTrigger: {
					...stProps,
					trigger: "#st-7",
					end: `+=${scrollUnit * 1}`,
					onToggle: (self) => {
						// $dataToggled = self.isActive ? "points" : undefined;
						$dataToggled = "points";
						$transformedGridToggled = true;
					}
				}
			})
			.add("step-1")
			// Perform linear transformation
			.to(
				$matrixTween,
				{
					progress: 1.0
				},
				"step-1"
			)
			// .fromTo(
			// 	$customMatrix,
			// 	{
			// 		endArray: initMatrix
			// 	},
			// 	{
			// 		endArray: egEndMatrix,
			// 		onUpdate: () => {
			// 			$matrixTransform = $customMatrix;
			// 		},
			// 	},
			// 	"step-1"
			// )
			// .to(
			// 	$customMatrix,
			// 	{
			// 		endArray: egEndMatrix,
			// 		onUpdate: () => {
			// 			$customMatrix = $customMatrix;
			// 		}
			// 	},
			// 	"step-1"
			// )
			// Animate to new basis vectors
			.to(
				xCoords,
				{
					endArray: [0, 0, 0, ...egMatrixX, 0],
					onUpdate: function () {
						xCoords = xCoords;
					}
				},
				"step-1"
			)
			.to(
				yCoords,
				{
					endArray: [0, 0, 0, ...egMatrixY, 0],
					onUpdate: function () {
						yCoords = yCoords;
					}
				},
				"step-1"
			)
			.to(
				{},
				{
					duration: delay
				}
			);

		// --- Determinant ---

		// 1. Back to an untransformed grid, with just the basis vectors
		gsap
			.timeline({
				...timelineProps,
				scrollTrigger: {
					...stProps,
					trigger: "#st-det-1",
					end: `+=${scrollUnit * 1}`,
					onEnter: () => {
						stProps.onEnter();

						$dataToggled = undefined;
						$transformedGridToggled = false;
					},
					onLeaveBack: () => {
						stProps.onLeaveBack();

						$dataToggled = "points";
						$transformedGridToggled = true;
					}
				}
			})
			.add("step-1")
			// Retract v — this section is about areas, not a single vector
			.fromTo(
				demoFade,
				{ intro: 1 },
				{
					intro: 0,
					immediateRender: false,
					onUpdate: function () {
						demoFade = demoFade;
					}
				},
				"step-1"
			)
			// Rewind the transformation
			.fromTo(
				$matrixTween,
				{ progress: 1 },
				{
					progress: 0,
					immediateRender: false
				},
				"step-1"
			)
			.to(
				xCoords,
				{
					endArray: [0, 0, 0, 1, 0, 0],
					onUpdate: function () {
						xCoords = xCoords;
					}
				},
				"step-1"
			)
			.to(
				yCoords,
				{
					endArray: [0, 0, 0, 0, 1, 0],
					onUpdate: function () {
						yCoords = yCoords;
					}
				},
				"step-1"
			)
			.to(
				{},
				{
					duration: delay
				}
			);

		// 2. Apply the transformation again, same treatment as before
		gsap
			.timeline({
				...timelineProps,
				scrollTrigger: {
					...stProps,
					trigger: "#st-det-2",
					end: `+=${scrollUnit * 1}`,
					onEnter: () => {
						stProps.onEnter();

						$transformedGridToggled = true;
						$dataToggled = undefined;
					},
					onLeaveBack: () => {
						stProps.onLeaveBack();

						$transformedGridToggled = false;
					}
				}
			})
			.add("step-1")
			.fromTo(
				$matrixTween,
				{ progress: 0 },
				{
					progress: 1,
					immediateRender: false
				},
				"step-1"
			)
			.to(
				xCoords,
				{
					endArray: [0, 0, 0, ...egMatrixX, 0],
					onUpdate: function () {
						xCoords = xCoords;
					}
				},
				"step-1"
			)
			.to(
				yCoords,
				{
					endArray: [0, 0, 0, ...egMatrixY, 0],
					onUpdate: function () {
						yCoords = yCoords;
					}
				},
				"step-1"
			)
			.to(
				{},
				{
					duration: delay
				}
			);

		// 3. Shade the transformed unit parallelogram (the "after" area)
		gsap
			.timeline({
				...timelineProps,
				scrollTrigger: {
					...stProps,
					trigger: "#st-det-3",
					end: `+=${scrollUnit * 1}`,
					onToggle: () => {
						$dataToggled = undefined;
					}
				}
			})
			.to(detProps, {
				para: 1,
				onUpdate: function () {
					detProps = detProps;
				}
			})
			.to(
				{},
				{
					duration: delay
				}
			);

		// 4. Shade the original unit square (the "before" area)
		gsap
			.timeline({
				...timelineProps,
				scrollTrigger: {
					...stProps,
					trigger: "#st-det-4",
					end: `+=${scrollUnit * 1}`,
					onEnterBack: () => {
						stProps.onEnterBack();

						// Coming back up from the playground, which restores the
						// sample points — the area demo wants a clean grid
						$dataToggled = undefined;
					}
				}
			})
			.to(detProps, {
				square: 1,
				onUpdate: function () {
					detProps = detProps;
				}
			})
			.to(
				{},
				{
					duration: delay
				}
			);

		// 5. A negative determinant: space gets flipped over
		gsap
			.timeline({
				...timelineProps,
				scrollTrigger: {
					...stProps,
					trigger: "#st-det-5",
					end: `+=${scrollUnit * 1}`,
					onEnter: () => {
						stProps.onEnter();

						detMorphActive = true;
						$dataToggled = undefined;
					},
					onLeaveBack: () => {
						stProps.onLeaveBack();

						detMorphActive = false;
					}
				}
			})
			.to(detMorph, {
				neg: 1,
				onUpdate: function () {
					detMorph = detMorph;
				}
			})
			.to(
				{},
				{
					duration: delay
				}
			);

		// 6. A zero determinant: space collapses onto a line
		gsap
			.timeline({
				...timelineProps,
				scrollTrigger: {
					...stProps,
					trigger: "#st-det-6",
					end: `+=${scrollUnit * 1}`,
					onToggle: () => {
						$dataToggled = undefined;
					}
				}
			})
			.to(detMorph, {
				zero: 1,
				onUpdate: function () {
					detMorph = detMorph;
				}
			})
			.to(
				{},
				{
					duration: delay
				}
			);

		// 7. Back to the original matrix before the recap and the playground
		gsap
			.timeline({
				...timelineProps,
				scrollTrigger: {
					...stProps,
					trigger: "#st-det-7",
					end: `+=${scrollUnit * 1}`,
					onLeave: () => {
						stProps.onLeave();

						// Hand the matrix back for the recap and the playground,
						// snapping to exact values the scrub may not have reached
						detMorphActive = false;

						egEndMatrix.forEach((v, i) => {
							$endMatrix[i] = v;
						});
						$endMatrix = $endMatrix;

						xCoords[3] = egMatrixX[0];
						xCoords[4] = egMatrixX[1];
						xCoords = xCoords;

						yCoords[3] = egMatrixY[0];
						yCoords[4] = egMatrixY[1];
						yCoords = yCoords;
					},
					onEnterBack: () => {
						stProps.onEnterBack();

						detMorphActive = true;
					}
				}
			})
			.to(detMorph, {
				back: 1,
				onUpdate: function () {
					detMorph = detMorph;
				}
			})
			.to(
				{},
				{
					duration: delay
				}
			);

		// Let users do some input!
		gsap
			.timeline({
				scrollTrigger: {
					...stPropsAlt,
					trigger: "#st-8",
					start: "top center",
					onEnter: () => {
						$showPlayground = true;

						$inputVectorToggled = true;
					},
					onLeaveBack: () => {
						// When going back from playground to interactive

						$showPlayground = false;

						$cameraControls.reset(true);

						// FIXME: Cache settings!
						// Reset input settings
						$dataToggled = "points";
						$gridToggled = true;
						$transformedGridToggled = true;
						$inputVectorToggled = false;

						// Reset playhead
						$matrixTween.progress(1);

						// Reset matrix transform
						gsap.to($endMatrix, {
							endArray: egEndMatrix,
							onUpdate: () => {
								$endMatrix = $endMatrix;
							},
							duration
						});
					}
				},
				timelinePropsAlt
			})
			.add("step-1")
			// Make canvas interactable
			.to(
				"#canvas-wrapper",
				{
					pointerEvents: "auto",
					// cursor: "move",
					duration
				},
				"step-1"
			)
			// Show input
			.from(
				"#inputs",
				{
					autoAlpha: 0,
					x: -40,
					duration
				},
				"step-1"
			)
			// Animate basis vectors to interactive position
			.fromTo(
				xCoords,
				{
					endArray: [0, 0, 0, ...egMatrixX, 0]
				},
				{
					endArray: () => [0, 0, 0, matrix[0], matrix[4], 0],
					onUpdate: () => {
						xCoords = xCoords;
					},
					immediateRender: false,
					duration
				},
				"step-1"
			)
			.fromTo(
				yCoords,
				{
					endArray: [0, 0, 0, ...egMatrixY, 0]
				},
				{
					endArray: () => [0, 0, 0, matrix[1], matrix[5], 0],
					onUpdate: () => {
						yCoords = yCoords;
					},
					immediateRender: false,
					duration
				},
				"step-1"
			)
			// Hide basis vectors
			// FIXME: Animate opacity of vectors
			.to(
				props,
				{
					duration,
					xTexOpacity: 0,
					yTexOpacity: 0,
					// xVisible: false,
					// yVisible: false,
					onUpdate: function () {
						props = props;
					}
				},
				"step-1"
			)
			// Show alt basis vectors
			.to(
				basisAltProps,
				{
					duration: 0.001,
					xVisible: true,
					yVisible: true,
					onUpdate: function () {
						basisAltProps = basisAltProps;
					}
				},
				"step-1"
			)
			.to(
				props,
				{
					duration: 0.001,
					xVisible: false,
					yVisible: false,
					onUpdate: function () {
						props = props;
					}
				},
				"step-1"
			);
		// Show example vector

		// Animate back
		gsap
			.timeline({
				scrollTrigger: {
					...stPropsAlt,
					trigger: "#section-2",
					start: "top center",
					// FIXME:
					// onToggle: () => {
					onEnter: () => {
						// stProps.onEnter();

						$showPlayground = false;

						// Return to default camera position
						$cameraControls.reset(true);

						// Reset input settings
						// cachePlaygroundSettings.dataToggled = $dataToggled;
						$dataToggled = undefined;
						$gridToggled = true;
						$transformedGridToggled = false;
						$inputVectorToggled = false;

						// Reset playhead
						$matrixTween.progress(1);

						// Reset matrix transform
						gsap.to($endMatrix, {
							endArray: initMatrix,
							onUpdate: () => {
								$endMatrix = $endMatrix;
							},
							duration
						});
					},
					onLeaveBack: () => {
						// stProps.onLeaveBack();

						$showPlayground = true;

						// $vectorCoordsInput[0] = egVector[0];
						// $vectorCoordsInput[1] = egVector[1];
						// $vectorCoordsInput[2] = 0;

						// $inputVectorToggled = false;
						// onInputVectorToggle(false);
						basisAltProps.vectorVisible = true;

						// $dataToggled = cachePlaygroundSettings.dataToggled;
					}
				},
				timelinePropsAlt
			})
			.add("step-1")
			// Change grid settings
			.to(
				gridVars,
				{
					duration,
					fadeDistance: grid3dProps.fadeDistance,
					onUpdate: () => {
						gridVars = gridVars;
					}
				},
				"step-1"
			)
			// Disable inputs
			.to(
				"#canvas-wrapper",
				{
					pointerEvents: "none",
					duration
				},
				"step-1"
			)
			.to(
				"#inputs",
				{
					autoAlpha: 0,
					x: -40,
					duration
				},
				"step-1"
			)
			// Reset basis vectors
			.to(
				xCoords,
				{
					endArray: () => [0, 0, 0, 1, 0, 0],
					onUpdate: () => {
						xCoords = xCoords;
					},
					duration: 0.001
				},
				"step-1"
			)
			.to(
				yCoords,
				{
					endArray: () => [0, 0, 0, 0, 1, 0],
					onUpdate: () => {
						yCoords = yCoords;
					},
					duration: 0.001
				},
				"step-1"
			)
			.add("step-2")
			.to(
				basisAltProps,
				{
					duration: 0.001,
					xVisible: false,
					yVisible: false,
					onUpdate: function () {
						basisAltProps = basisAltProps;
					}
				},
				"step-2"
			)
			.to(
				props,
				{
					duration: 0.001,
					xVisible: true,
					yVisible: true,
					onUpdate: function () {
						props = props;
					}
				},
				"step-2"
			);

		// --- Inverse ---

		// 1. Take the matrix back from the playground and reset to a plain grid
		gsap
			.timeline({
				...timelineProps,
				scrollTrigger: {
					...stProps,
					trigger: "#st-inv-1",
					end: `+=${scrollUnit * 1}`,
					onEnter: () => {
						stProps.onEnter();

						// The try-it is over: close the playground before taking
						// the matrix back, or this fights the reader's own edits
						$showPlayground = false;
						gsap.to("#inputs", { autoAlpha: 0, x: -40, duration });
						gsap.to("#canvas-wrapper", { pointerEvents: "none", duration });

						invMorphActive = true;
						$dataToggled = undefined;
						$transformedGridToggled = true;
					},
					onEnterBack: () => {
						stProps.onEnterBack();

						invMorphActive = true;
					},
					onLeaveBack: () => {
						stProps.onLeaveBack();

						invMorphActive = false;

						// Hand it back to the playground
						$showPlayground = true;
						gsap.to("#inputs", { autoAlpha: 1, x: 0, duration });
						gsap.to("#canvas-wrapper", { pointerEvents: "auto", duration });
					}
				}
			})
			.to(detProps, {
				square: 1,
				para: 1,
				onUpdate: function () {
					detProps = detProps;
				}
			})
			.to(
				{},
				{
					duration: delay
				}
			);

		// 2. Apply A — the unit square becomes the parallelogram again
		gsap
			.timeline({
				...timelineProps,
				scrollTrigger: {
					...stProps,
					trigger: "#st-inv-2",
					end: `+=${scrollUnit * 1}`
				}
			})
			.to(invMorph, {
				a: 1,
				onUpdate: function () {
					invMorph = invMorph;
				}
			})
			.to(
				{},
				{
					duration: delay
				}
			);

		// 3. Apply the inverse on top — everything returns to where it started
		gsap
			.timeline({
				...timelineProps,
				scrollTrigger: {
					...stProps,
					trigger: "#st-inv-3",
					end: `+=${scrollUnit * 1}`
				}
			})
			.to(invMorph, {
				back: 1,
				onUpdate: function () {
					invMorph = invMorph;
				}
			})
			.to(
				{},
				{
					duration: delay
				}
			);

		// 4. Two distinct vectors, still distinct
		gsap
			.timeline({
				...timelineProps,
				scrollTrigger: {
					...stProps,
					trigger: "#st-inv-4",
					end: `+=${scrollUnit * 1}`,
					onEnter: () => {
						stProps.onEnter();

						// Four arrows end up on the collapse line otherwise, and
						// the point is about p and q specifically
						props.xVisible = false;
						props.yVisible = false;
						props = props;
					},
					onLeaveBack: () => {
						stProps.onLeaveBack();

						props.xVisible = true;
						props.yVisible = true;
						props = props;
					}
				}
			})
			.to(demoFade, {
				singular: 1,
				onUpdate: function () {
					demoFade = demoFade;
				}
			})
			.to(
				{},
				{
					duration: delay
				}
			);

		// 5. A singular matrix lands them both on the same point
		gsap
			.timeline({
				...timelineProps,
				scrollTrigger: {
					...stProps,
					trigger: "#st-inv-5",
					end: `+=${scrollUnit * 1}`
				}
			})
			.to(invMorph, {
				singular: 1,
				onUpdate: function () {
					invMorph = invMorph;
				}
			})
			.to(
				{},
				{
					duration: delay
				}
			);

		// Show third dimension
		gsap
			.timeline({
				...timelineProps,
				scrollTrigger: {
					...stProps,
					trigger: "#st-9",
					end: `+=${scrollUnit * 3}`,
					onEnter: () => {
						stProps.onEnter();

						detMorphActive = false;
						invMorphActive = false;

						// Restore what the singular demo switched off
						props.xVisible = true;
						props.yVisible = true;
						props = props;

						// The collapsing pair is a 2D argument
						gsap.to(demoFade, {
							singular: 0,
							duration,
							onUpdate: () => {
								demoFade = demoFade;
							}
						});

						$show3d = true;
            $show2d = false
						basisAltProps.zVisible = false;

						// // Update matrix transform
						// gsap.to($endMatrix, {
						// 	endArray: eg3dMatrix,
						// 	onUpdate: () => {
						// 		$endMatrix = $endMatrix;
						// 	},
						// 	duration
						// });

						basisAltProps.vectorVisible = false;

						// The shaded unit areas are a 2D-only idea
						gsap.to(demoFade, {
							det: 0,
							duration,
							onUpdate: () => {
								demoFade = demoFade;
							}
						});

						// $inputVectorToggled = true;

						// $vectorCoordsInput[0] = eg3dVector[0];
						// $vectorCoordsInput[1] = eg3dVector[1];
						// $vectorCoordsInput[2] = eg3dVector[2];
					},
					onLeaveBack: () => {
						stProps.onLeaveBack();

						gsap.to(demoFade, {
							det: 1,
							duration,
							onUpdate: () => {
								demoFade = demoFade;
							}
						});

						$show3d = false;
            $show2d = true
						$grid3dToggled = false;

						$inputVectorToggled = false;
						onInputVectorToggle(false);

						// basisAltProps.vectorVisible = true;

						// $vectorCoordsInput = egVector;
						// $vectorCoordsInput[0] = egVector[0];
						// $vectorCoordsInput[1] = egVector[1];
						// $vectorCoordsInput[2] = 0;

						// $inputVectorToggled = false;

						// // Reset matrix transform
						// gsap.to($endMatrix, {
						// 	endArray: initMatrix,
						// 	onUpdate: () => {
						// 		$endMatrix = $endMatrix;
						// 	},
						// 	duration
						// });
					},
					onLeave: () => {
						stProps.onLeave();

						$cameraAutoRotate = true;
						$grid3dToggled = true;
					},
					onEnterBack: () => {
						stProps.onEnterBack();

						$cameraAutoRotate = false;
						gsap.to($cameraControls, {
							azimuthAngle: Math.PI * 0.3
						});
					}
				}
			})
			.add("step-0")
			.to(
				$cameraControls.mouseButtons,
				{
					right: CameraControls.ACTION.ROTATE,
					duration: 0.001
				},
				"step-0"
			)
			// Update matrix
			.to(
				{},
				{
					duration: delay
				},
				"step-0"
			)
			.add("step-1")
			// Change camera position
			.to(
				$cameraControls,
				{
					// distance: 8.5,
					distance: 15,
					polarAngle: Math.PI * 0.35,
					// azimuthAngle: `+=${Math.PI * 0.3}`
					azimuthAngle: Math.PI * 0.3
				},
				"step-1"
			)
			// Animate in z basis
			.to(
				zCoords,
				{
					endArray: [0, 0, 0, 0, 0, 1],
					onUpdate: function () {
						zCoords = zCoords;
					}
				},
				"step-1"
			)
			.to(
				props,
				{
					xTexOpacity: 1,
					yTexOpacity: 1,
					xDim3: true,
					yDim3: true,
					zDim3: true,
					vectorDim3: true,
					onUpdate: function () {
						props = props;
					}
				},
				"step-1"
			)
			// Animate in example vector
			.to(
				vectorCoords,
				{
					endArray: [0, 0, 0, ...eg3dVector],
					onUpdate: function () {
						vectorCoords = vectorCoords;
					}
				},
				"step-1"
			)
			// .to(
			// 	$vectorCoordsInput,
			// 	{
			// 		endArray: eg3dVector,
			// 		onUpdate: function () {
			// 			$vectorCoordsInput = $vectorCoordsInput;
			// 		}
			// 	},
			// 	"step-1"
			// )
			.add("step-2")
			.to(
				$matrixTween,
				{
					progress: 0,
					duration: 0.001
				},
				"step-2"
			)
			.to(
				$endMatrix,
				{
					endArray: eg3dMatrix,
					duration: 0.001,
					onUpdate: function () {
						$endMatrix = $endMatrix;
					}
				},
				"step-2"
			)
			.to(
				props,
				{
					zTexOpacity: 1,
					onUpdate: function () {
						props = props;
					}
				},
				"step-2"
			)
			.to(
				props,
				{
					vectorTexOpacity: 1,
					onUpdate: function () {
						props = props;
					}
				},
				"step-2"
			)
			// Animate in 3d grid
			.to(
				grid3dProps,
				{
					cellThickness: defaultGridProps.cellThickness,
					sectionThickness: defaultGridProps.sectionThickness,
					onUpdate: function () {
						grid3dProps = grid3dProps;
					}
				},
				"step-2"
			)
			.add("step-3")
			.to(
				grid3dProps,
				{
					t: 1,
					onUpdate: function () {
						grid3dProps = grid3dProps;
					}
				},
				"step-3"
			)
			.to(
				{},
				{
					duration: delay
				}
			);

		// Perform linear transformation; in 3D!
		gsap
			.timeline({
				...timelineProps,
				scrollTrigger: {
					...stProps,
					trigger: "#st-10",
					end: `+=${scrollUnit * 1}`,
					onEnter: () => {
						stProps.onEnter();

						$vectorCoordsInput[0] = eg3dVector[0];
						$vectorCoordsInput[1] = eg3dVector[1];
						$vectorCoordsInput[2] = eg3dVector[2];
					},
					onLeaveBack: () => {
						stProps.onLeaveBack();

						$vectorCoordsInput[0] = egVector[0];
						$vectorCoordsInput[1] = egVector[1];
						$vectorCoordsInput[2] = 0;
					}
				}
			})
			.add("step-1")
			.to(
				$matrixTween,
				{
					progress: 1.0
				},
				"step-1"
			)
			// Animate to new basis vectors
			.to(
				xCoords,
				{
					endArray: [0, 0, 0, ...eg3dMatrixX],
					onUpdate: function () {
						xCoords = xCoords;
					}
				},
				"step-1"
			)
			.to(
				yCoords,
				{
					endArray: [0, 0, 0, ...eg3dMatrixY],
					onUpdate: function () {
						yCoords = yCoords;
					}
				},
				"step-1"
			)
			.to(
				zCoords,
				{
					endArray: [0, 0, 0, ...eg3dMatrixZ],
					onUpdate: function () {
						zCoords = zCoords;
					}
				},
				"step-1"
			)
			// Animate output vector
			.to(
				vectorCoords,
				{
					endArray: [0, 0, 0, ...eg3dOutputVector],
					onUpdate: function () {
						vectorCoords = vectorCoords;
					}
				},
				"step-1"
			)
			.to(
				{},
				{
					duration: delay
				}
			);

		// TODO: What is the best way to show transformations of space in 3D?
		// FIXME: Do we need this animation again?
		// Show linear combination;  Scale the basis vectors to the transformed vector
		// gsap
		// 	.timeline({
		// 		...timelineProps,
		// 		scrollTrigger: {
		// 			...stProps,
		// 			trigger: "#st-11",
		// 			end: `+=${scrollUnit * 3}`
		// 		}
		// 	})
		// 	.add("step-1")
		// 	// Animate out Tex
		// 	.to(
		// 		props,
		// 		{
		// 			xTexOpacity: 0,
		// 			yTexOpacity: 0,
		// 			zTexOpacity: 0,
		// 			onUpdate: function () {
		// 				props = props;
		// 			}
		// 		},
		// 		"step-1"
		// 	)
		// 	.add("step-2")
		// 	// Show scalars
		// 	.to(
		// 		props,
		// 		{
		// 			duration: 0.2,
		// 			xScalarOpacity: 1,
		// 			yScalarOpacity: 1,
		// 			zScalarOpacity: 1,
		// 			onUpdate: function () {
		// 				props = props;
		// 			}
		// 		},
		// 		"step-2"
		// 	)
		// 	// Scale basis vectors
		// 	.to(
		// 		xCoords,
		// 		{
		// 			endArray: [
		// 				0,
		// 				0,
		// 				0,
		// 				eg3dVector[0] * eg3dMatrixX[0],
		// 				eg3dVector[0] * eg3dMatrixX[1],
		// 				eg3dVector[0] * eg3dMatrixX[2]
		// 			],
		// 			onUpdate: function () {
		// 				xCoords = xCoords;
		// 			}
		// 		},
		// 		"step-2"
		// 	)
		// 	.to(
		// 		yCoords,
		// 		{
		// 			endArray: [
		// 				0,
		// 				0,
		// 				0,
		// 				eg3dVector[1] * eg3dMatrixY[0],
		// 				eg3dVector[1] * eg3dMatrixY[1],
		// 				eg3dVector[1] * eg3dMatrixY[2]
		// 			],
		// 			onUpdate: function () {
		// 				yCoords = yCoords;
		// 			}
		// 		},
		// 		"step-2"
		// 	)
		// 	.to(
		// 		zCoords,
		// 		{
		// 			endArray: [
		// 				0,
		// 				0,
		// 				0,
		// 				eg3dVector[2] * eg3dMatrixZ[0],
		// 				eg3dVector[2] * eg3dMatrixZ[1],
		// 				eg3dVector[2] * eg3dMatrixZ[2]
		// 			],
		// 			onUpdate: function () {
		// 				zCoords = zCoords;
		// 			}
		// 		},
		// 		"step-2"
		// 	)
		// 	// Animate scalar text too
		// 	.to(
		// 		props,
		// 		{
		// 			xScalar: eg3dVector[0],
		// 			yScalar: eg3dVector[1],
		// 			zScalar: eg3dVector[2],
		// 			onUpdate: function () {
		// 				props = props;
		// 			}
		// 		},
		// 		"step-2"
		// 	)
		// 	.to({}, { duration: delay });

		// Determinant in 3D: rewind to the unit cube
		gsap
			.timeline({
				...timelineProps,
				scrollTrigger: {
					...stProps,
					trigger: "#st-det3d-1",
					end: `+=${scrollUnit * 1}`,
					onToggle: () => {
						$dataToggled = undefined;
					}
				}
			})
			.add("step-1")
			.fromTo(
				$matrixTween,
				{ progress: 1 },
				{ progress: 0, immediateRender: false },
				"step-1"
			)
			.to(
				xCoords,
				{
					endArray: [0, 0, 0, 1, 0, 0],
					onUpdate: function () {
						xCoords = xCoords;
					}
				},
				"step-1"
			)
			.to(
				yCoords,
				{
					endArray: [0, 0, 0, 0, 1, 0],
					onUpdate: function () {
						yCoords = yCoords;
					}
				},
				"step-1"
			)
			.to(
				zCoords,
				{
					endArray: [0, 0, 0, 0, 0, 1],
					onUpdate: function () {
						zCoords = zCoords;
					}
				},
				"step-1"
			)
			.to(detProps, {
				cube: 1,
				box: 1,
				onUpdate: function () {
					detProps = detProps;
				}
			})
			.to(
				{},
				{
					duration: delay
				}
			);

		// ...then apply the transformation and watch the volume grow
		gsap
			.timeline({
				...timelineProps,
				scrollTrigger: {
					...stProps,
					trigger: "#st-det3d-2",
					end: `+=${scrollUnit * 1}`,
					onToggle: () => {
						$dataToggled = undefined;
					}
				}
			})
			.add("step-1")
			.fromTo(
				$matrixTween,
				{ progress: 0 },
				{ progress: 1, immediateRender: false },
				"step-1"
			)
			.to(
				xCoords,
				{
					endArray: [0, 0, 0, ...eg3dMatrixX],
					onUpdate: function () {
						xCoords = xCoords;
					}
				},
				"step-1"
			)
			.to(
				yCoords,
				{
					endArray: [0, 0, 0, ...eg3dMatrixY],
					onUpdate: function () {
						yCoords = yCoords;
					}
				},
				"step-1"
			)
			.to(
				zCoords,
				{
					endArray: [0, 0, 0, ...eg3dMatrixZ],
					onUpdate: function () {
						zCoords = zCoords;
					}
				},
				"step-1"
			)
			.to(
				{},
				{
					duration: delay
				}
			);

		// Maxwell the carryable cat
		gsap
			.timeline({
				...timelineProps,
				scrollTrigger: {
					...stProps,
					trigger: "#st-12",
					end: `+=${scrollUnit * 1}`,
					onLeave: () => {
						stProps.onLeave();

						$dataToggled = "model";

						$inputVectorToggled = true;
					},
					onLeaveBack: () => {
						stProps.onLeaveBack();

						$dataToggled = undefined;
					}
				}
			})
			.add("step-1")
			// Clear the shaded volume before the cat takes over the scene. This
			// needs its own scalar: a fromTo on detProps would assert its start
			// value every time this timeline renders at progress 0, which is the
			// whole way down the page before this beat is reached.
			.to(
				demoFade,
				{
					det3d: 0,
					onUpdate: function () {
						demoFade = demoFade;
					}
				},
				"step-1"
			)
			.to(
				modelProps,
				{
					scale: 0.25,
					onUpdate: function () {
						modelProps = modelProps;
					}
				},
				"step-1"
			)
			.to(
				{},
				{
					duration: delay
				}
			);

		// Show playground
		const playgroundTl = gsap
			.timeline({
				scrollTrigger: {
					...stPropsAlt,
					trigger: "#st-13",
					start: "top center",
					onEnter: () => {
						$cameraAutoRotate = false;

						$showPlayground = true;

						basisAltProps.vectorVisible = true;
						props.vectorVisible = true;

						// The cat sits on the origin and hides the cube. Start with
						// it off; the toolbar toggle still brings it back.
						$dataToggled = undefined;
						gsap.to(modelProps, {
							scale: 0,
							duration,
							onUpdate: () => {
								modelProps = modelProps;
							}
						});

						// Bring the shaded unit cube back so the reader can watch
						// the volume — and the determinant — change as they edit
						gsap.to(demoFade, {
							det3dPlay: 1,
							duration,
							onUpdate: () => {
								demoFade = demoFade;
							}
						});
					},
					onLeaveBack: () => {
						$cameraAutoRotate = true;

						$showPlayground = false;

						gsap.to(demoFade, {
							det3dPlay: 0,
							duration,
							onUpdate: () => {
								demoFade = demoFade;
							}
						});
						gsap.to(modelProps, {
							scale: 0.25,
							duration,
							onUpdate: () => {
								modelProps = modelProps;
							}
						});

						// Reset
						$dataToggled = "model";
						$grid3dToggled = true;
						$gridToggled = true;
						$transformedGridToggled = false;

						$show3d = true;

						// Reset playhead
						$matrixTween.progress(1);

						// Reset matrix transform
						gsap.to($endMatrix, {
							endArray: eg3dMatrix,
							onUpdate: () => {
								$endMatrix = $endMatrix;
							},
							duration
						});

						basisAltProps.vectorVisible = false;
						props.vectorVisible = false;
					}
				},
				timelinePropsAlt
			})
			.add("step-1")
			// Make canvas interactable
			.to(
				"#canvas-wrapper",
				{
					pointerEvents: "auto",
					// cursor: "move",
					duration
				},
				"step-1"
			)
			// Show input
			.to(
				"#inputs",
				{
					autoAlpha: 1,
					x: 0,
					duration
				},
				"step-1"
			)
			// Hide basis vectors
			.to(
				props,
				{
					duration,
					xTexOpacity: 0,
					yTexOpacity: 0,
					zTexOpacity: 0,
					vectorTexOpacity: 0,
					xVisible: false,
					yVisible: false,
					zVisible: false,
					onUpdate: function () {
						props = props;
					}
				},
				"step-1"
			)
			// Show alt basis vectors
			.to(
				basisAltProps,
				{
					duration,
					xVisible: true,
					yVisible: true,
					zVisible: true,
					onUpdate: function () {
						basisAltProps = basisAltProps;
					}
				},
				"step-1"
			);

		// $playgroundSt = playgroundTl.scrollTrigger;

		// ScrollTrigger.create({
		// 	trigger: "#article",
		// 	start: "bottom bottom",
		// 	onEnter: () => {
		// 		console.log("enter");
		// 		$showPlayground = false;
		// 	},
		// 	onLeaveBack: () => {
		// 		$showPlayground = true;
		// 	}
		// });

		const test = gsap
			.timeline({
				scrollTrigger: {
					...stPropsAlt,
					trigger: "#article",
					start: "bottom bottom",
					onEnter: () => {
						$showPlayground = false;
					},
					onLeaveBack: () => {
						$showPlayground = true;
					}
				},
				timelinePropsAlt
			})
			.to(
				"#inputs",
				{
					autoAlpha: 0,
					x: -40,
					duration
				},
				"step-1"
			);

		$playgroundSt = test.scrollTrigger;

		// ScrollTrigger.refresh()

		// $arcadeMounted = true

		// Text animations
		gsap.utils.toArray("#article section.animate > *").forEach((el) => {
			let animation;

			if (el.className === "exclude") {
				animation = gsap
					.timeline({ paused: true })
					.from(el, {
						opacity: 0,
						y: 100,
						duration: 0.6
					})
					.from(el.querySelectorAll("li"), {
						x: -40,
						opacity: 0,
						stagger: {
							amount: 0.3
						}
					});
			} else {
				animation = gsap.from(el, {
					opacity: 0,
					y: 20,
					paused: true
				});
			}

			ScrollTrigger.create({
				trigger: el,
				start: "top center",
				animation,
				pinnedContainer: "#article"
			});
		});
	}

	function updateStProgress(progress) {
		gsap.set("#st-progress", {
			scaleY: progress
		});
	}
	function animateInStProgress() {
		gsap.to("#st-progress", {
			opacity: 1,
			duration: 0.5
		});
	}
	function animateOutStProgress() {
		gsap.to("#st-progress", {
			opacity: 0,
			duration: 0.5
		});
	}

	// TODO: Make sure ScrollTriggers are in order
	// DOM / Layout is already mounted
	$: if (!$debug && mounted && $sceneMounted) animate();

	onMount(() => {
		mounted = true;
	});
</script>

{#if $showHero}
	<Hero />
{/if}

<!-- TODO: Shadows? -->

<!-- TODO: Add sky? -->
<!-- <Sky /> -->

<!-- Peripherals -->
<!-- <Grid {view} {dim} opacity={0.2} {gridColor} {axisColor} />
<Grid view={transformedView} {dim} {gridColor} {axisColor} /> -->

<!-- Determinant: unit square before, unit parallelogram after -->
<!-- Drawn in front: with this matrix the unit square sits inside the
     parallelogram, so it needs to stay readable on top of it -->
<UnitArea
	{view}
	color={colorAreaOld}
	t={detProps.square * demoFade.det}
	zBias={4}
	outline
/>
<UnitArea
	view={transformedView}
	color={areaColor}
	t={detProps.para * demoFade.det}
	zBias={-3}
	outline
/>

<!-- Determinant in 3D: unit cube before, parallelepiped after -->
<UnitCube
	{view}
	color={colorAreaOld}
	t={detProps.cube * cubeFade}
	zBias={-2}
/>
<UnitCube
	view={transformedView}
	color={volumeColor}
	t={detProps.box * cubeFade}
	zBias={-3}
	outline
/>

<!-- Example vector -->
<Vector
	{view}
	coords={introVectorRender}
	color={colorVector}
	texOpacity={props.vectorTexOpacity * demoFade.intro}
	visible={props.xVisible}
	dim3={props.vectorDim3}
	label={"\\vec{v}"}
	labelOpacity={props.vectorTexOpacity * demoFade.intro}
/>

<!-- Fixed vector, scaled by the scalar scrubber -->
<Vector
	{view}
	coords={scalarVectorRender}
	color={colorVector}
	texOpacity={0}
	scalar={scalarVectorRevealed ? $scalarDemoValue : false}
	scalarOpacity={demoFade.scalar}
	scalarAlign="right"
	label={"\\vec{u}"}
	labelOpacity={props.scalarLabelOpacity * demoFade.scalar}
/>

<!-- Vector addition demo -->
<Vector
	{view}
	coords={addVectorARender}
	color={colorAddA}
	texOpacity={addProps.aTex * demoFade.add}
	label={"\\vec{a}"}
	labelOpacity={addProps.aOpacity * demoFade.add}
/>
<Vector
	{view}
	coords={addVectorBRender}
	color={colorAddB}
	texOpacity={addProps.bTex * demoFade.add}
	label={"\\vec{b}"}
	labelOpacity={addProps.bOpacity * demoFade.add}
/>
<Vector
	{view}
	coords={addSumRender}
	color={colorVector}
	texOpacity={addProps.sumOpacity * demoFade.add}
	label={"\\vec{a+b}"}
	labelOpacity={addProps.sumOpacity * demoFade.add}
	labelSide={-1}
/>

<!-- Two vectors a singular matrix sends to the same point. They ride the
     transformed view, so the matrix collapses them onto each other for free -->
<Vector
	{view}
	coords={singularPRender}
	color={colorAddA}
	tex={false}
	label={"\\vec{p}"}
	labelOpacity={demoFade.singular}
	visible={demoFade.singular > 0.01}
/>
<Vector
	{view}
	coords={singularQRender}
	color={colorAddB}
	tex={false}
	label={"\\vec{q}"}
	labelOpacity={demoFade.singular}
	labelSide={-1}
	visible={demoFade.singular > 0.01}
/>

<!-- Example vector that animates on input -->
<Vector
	view={transformedView}
	coords={[0, 0, 0, ...$vectorCoordsSpring]}
	color={colorVector}
	tex={false}
	visible={basisAltProps.vectorVisible}
/>

<!-- Basis vectors -->
<Vector
	{view}
	coords={xCoords}
	color={colorX}
	texOpacity={props.xTexOpacity}
	scalar={props.xScalar}
	scalarOpacity={props.xScalarOpacity}
	scalarAlign={props.xScalarAlign}
	visible={props.xVisible}
	dim3={props.xDim3}
	label={"\\hat{\\imath}"}
	labelOpacity={props.xTexOpacity}
/>
<Vector
	{view}
	coords={yCoords}
	color={colorY}
	texOpacity={props.yTexOpacity}
	scalar={props.yScalar}
	scalarOpacity={props.yScalarOpacity}
	scalarAlign={props.yScalarAlign}
	visible={props.yVisible}
	dim3={props.yDim3}
	label={"\\hat{\\jmath}"}
	labelOpacity={props.yTexOpacity}
/>
<Vector
	{view}
	coords={zCoords}
	color={colorZ}
	texOpacity={props.zTexOpacity}
	scalar={props.zScalar}
	scalarOpacity={props.zScalarOpacity}
	scalarAlign={props.zScalarAlign}
	visible={props.zVisible}
	dim3={props.zDim3}
	label={"\\hat{k}"}
	labelOpacity={props.zTexOpacity}
/>

<!-- Basis vectors (that animate on input) -->
<Vector
	view={transformedView}
	coords={[0, 0, 0, 1, 0, 0]}
	color={colorX}
	tex={false}
	visible={basisAltProps.xVisible}
/>
<Vector
	view={transformedView}
	coords={[0, 0, 0, 0, 1, 0]}
	color={colorY}
	tex={false}
	visible={basisAltProps.yVisible}
/>
<Vector
	view={transformedView}
	coords={[0, 0, 0, 0, 0, 1]}
	color={colorZ}
	tex={false}
	visible={basisAltProps.zVisible}
/>

<!-- FIXME: Change blending mode of grid? -->
<T.Group renderOrder={-3}>
	<Grid {...gridProps} axes={"xyz"} />
</T.Group>

<!-- Transformed elements -->
<!-- TODO: Overlay another grid in the hero for a cool effect? -->
<T.Group renderOrder={-2} matrix={$matrixTransform} matrixAutoUpdate={false}>
	<!-- Grids -->
	<!-- FIXME: Don't do infinite grid? A bit confusing -->

	<Grid {...transformedGridProps} axes={"xyz"} />
</T.Group>

<T.Group renderOrder={-4} matrix={$matrixTransform} matrixAutoUpdate={false}>
	<!-- 3d grid -->
	<Grid
		axes={"xzy"}
		position.z={gridSectionSize * 0}
		position.y={gridSectionSize}
		{...grid3dProps}
	/>
	<Grid
		axes={"zyx"}
		position.z={gridSectionSize * 0}
		position.x={-gridSectionSize}
		{...grid3dProps}
	/>
</T.Group>

<!-- Maxwell the carryable cat -->
<T.Group renderOrder={-4} matrix={$matrixTransform} matrixAutoUpdate={false}>
	{#await useGltf(`${assets}/maxwell.glb`) then model}
		<T
			is={model.scene}
			position.z={0}
			rotation={[Math.PI / 2, 0, 0]}
			{...modelProps}
		/>
	{/await}

	<T.Mesh {...imageProps}>
		<T.PlaneGeometry args={[6, 6]} />
		<!-- {#await useTexture("/maxwell.jpg") then texture}
			<T.MeshBasicMaterial map={texture}>
				<T.DoubleSide attach="side" />
			</T.MeshBasicMaterial>
		{/await} -->
		{#await map then value}
			<T.MeshBasicMaterial map={value}>
				<T.DoubleSide attach="side" />
			</T.MeshBasicMaterial>
		{/await}
	</T.Mesh>
</T.Group>

<!-- Add a plane -->
<!-- <T.Mesh position.z={-0.02}>
	<T.PlaneGeometry args={[40, 40]} />
	<T.MeshStandardMaterial
		color={new Color("hsl(231, 15%, 18%)")}
		opacity={0.8}
		transparent={true}
	>
		<T.DoubleSide attach="side" />
	</T.MeshStandardMaterial>
</T.Mesh> -->

<!-- TODO: Remove objects that are not visible? -->
<!-- Data -->
<Planes view={transformedView} t={planesProps.t} />
<Points view={transformedView} t={pointsProps.t} />
<Planes view={transformedView} t={planes3dProps.t} dim3 />
<Points view={transformedView} t={points3dProps.t} dim3 />
<!-- <Sphere view={transformedView} /> -->
<!-- <Circle view={transformedView} /> -->

<!-- <Plane
	view={transformedView}
	dim={planeDim}
	position={[-planeDim / 2 - 0.5, -planeDim / 2, -planeDim / 2]}
	rotation={[0, -Math.PI / 2, 0]}
	t={grid3dProps.t}
/>
<Plane
	view={transformedView}
	dim={planeDim}
	position={[-planeDim / 2, planeDim / 2 + 0.5, planeDim / 2]}
	rotation={[-Math.PI / 2, 0, 0]}
	t={grid3dProps.t}
/> -->
<Plane
	view={transformedView}
	dim={planeDim}
	position={[-planeDim / 2, -planeDim / 2, -planeDim / 2]}
	rotation={[0, -Math.PI / 2, 0]}
	t={grid3dProps.t}
/>
<Plane
	view={transformedView}
	dim={planeDim}
	position={[-planeDim / 2, planeDim / 2, planeDim / 2]}
	rotation={[-Math.PI / 2, 0, 0]}
	t={grid3dProps.t}
/>

<Vectors
	view={transformedView}
	enter={vectorsProps.enter}
	exit={vectorsProps.exit}
/>
