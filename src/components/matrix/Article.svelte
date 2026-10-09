<script>
	import Tex from "./Tex.svelte";
	import {
		matrixVectorFormulaColored,
		vectorAsLinearComb,
		matrixVectorFormulaEg,
		matrixVectorFormula3dEg,
		detFormula,
		detEg,
		detAsAreaRatio,
		detAreaEg,
		detNegEg,
		detZeroEg,
		det3dAsVolumeRatio,
		det3dEg,
		inverseFormula,
		inverseEg,
		inverseUndoes,
		singularCollapseEg
	} from "$data/tex";
	import Term from "./Term.svelte";
	import ColorText from "./ColorText.svelte";
	import Insight from "./Insight.svelte";
	import Intro from "./Intro.svelte";
	import P from "./P.svelte";
	import Spacer from "./Spacer.svelte";
	import Action from "./Action.svelte";
	import Section from "./Section.svelte";
	import B from "./B.svelte";
	import { Grab, Grid2x2 } from "lucide-svelte";
	import ActionIcon from "./ActionIcon.svelte";
	import InteractionsList from "./InteractionsList.svelte";
	import { gsap, ScrollTrigger } from "$utils/gsap.js";
	import { onMount } from "svelte";
	import { arcadeMounted } from "$stores";
	import VectorScrubber from "./VectorScrubber.svelte";
	import ScalarScrubber from "./ScalarScrubber.svelte";

	// let mounted;

	// $: if (mounted && $arcadeMounted) animate();

	// onMount(() => {
	// 	mounted = true;
	// });

	// function animate() {
	// 	gsap.utils.toArray("#article section.animate > *").forEach((el) => {
	// 		let animation;

	// 		if (el.className === "exclude") {
  //       animation = gsap.timeline({ paused: true })
  //         .from(el, {
  //           opacity: 0,
  //           y: 100,
  //           duration: 0.6
  //         })
  //         .from(el.querySelectorAll('li'), {
  //           x: -40,
  //           opacity: 0,
  //           stagger: {
  //             amount: 0.3
  //           }
  //         })
	// 		} else {
	// 			animation = gsap.from(el, {
	// 				opacity: 0,
	// 				y: 20,
	// 				paused: true
	// 			});
	// 		}

	// 		ScrollTrigger.create({
	// 			trigger: el,
	// 			start: "top center",
	// 			animation,
	// 			pinnedContainer: "#article"
	// 		});
	// 	});
	// }
</script>

<div
	id="article"
	class="relative max-w-prose bg-gradient-to-l from-base-100 via-base-300 via-90% py-12"
>
	<div id="title-spacer" class="h-[2500px]" />

	<Intro />

	<div class="h-[500px]" />

	<!-- <section id="section-1" class="prose prose-xl [&>*]:px-10 [&>*]:rounded-xl"> -->
	<Section id="section-1" classNames="animate">
		<!-- <section class="prose prose-xl max-w-[50ch]"> -->
		<!-- <h2>Matrix as Linear Transformations</h2> -->

		<p>
			Multiply a vector by a matrix and you get another vector back — the matrix
			<B>transforms</B> it. That one idea is what this whole piece is about, but
			to get there we need to be comfortable with vectors first. So let's start
			there and build up.
		</p>

		<Spacer />

		<p>
			A <ColorText color="in">vector</ColorText> is an arrow, and it only takes
			two things to pin one down: a <Term>direction</Term> — the way it points —
			and a <Term>magnitude</Term> — how long it is. Change either one and you
			have a different vector.
		</p>

		<P id="st-0a">
			Here's one, drawn in blue. Try changing its direction and its length, and
			watch its coordinates change along with it.
		</P>

		<div class="exclude">
			<Action>
				<p>
					Drag the sliders to change this vector's <B>direction</B> or its
					<B>length</B>.
				</p>
				<VectorScrubber />
			</Action>
		</div>

		<!-- Room to actually play with the sliders before the vector is cleared -->
		<div class="h-[400px]" />

		<p>
			There's a simpler way to change a vector's length: just multiply it by a
			number. A plain number like this is called a <Term>scalar</Term>, and
			multiplying by one is called <Term>scaling</Term>.
		</p>

		<p>
			Scaling is easy to predict. A number bigger than <Tex expr="1" /> stretches
			the vector, a number between <Tex expr="0" /> and <Tex expr="1" /> shrinks
			it, and a negative number flips it around to point the opposite way. What
			never changes is the line the vector lies along.
		</p>

		<P id="st-0b">
			Here's a vector <Tex expr={"\\vec{u}=\\mathbf{i}+2\\mathbf{j}"} />. Scale
			it by different numbers and watch what happens.
		</P>

		<div class="exclude">
			<Action>
				<p>
					Drag the slider to <B>scale</B> this vector — try a negative number to
					flip it.
				</p>
				<ScalarScrubber />
			</Action>
		</div>

		<!-- Room to actually play with the slider before the vector is cleared -->
		<div class="h-[400px]" />

		<Spacer />

		<p>
			Vectors can also be added together, and there's a neat way to picture it
			called the <Term>head-to-tail</Term> rule: slide the second vector so its
			tail sits on the first vector's tip, then draw a new arrow from the very
			start to the very end. That new arrow is the sum.
		</p>

		<P id="st-0c">
			Here are two vectors to try it on — <Tex expr={"\\vec{a}"} /> in red and <Tex
				expr={"\\vec{b}"}
			/> in green, both starting at the origin.
		</P>

		<P id="st-0d">
			Now slide <Tex expr={"\\vec{b}"} /> over so its tail meets <Tex
				expr={"\\vec{a}"}
			/>'s tip. Sliding it doesn't change it: same direction, same length.
		</P>

		<P id="st-0e">
			Draw an arrow from the start of <Tex expr={"\\vec{a}"} /> to the end of <Tex
				expr={"\\vec{b}"}
			/> and you have the sum, <Tex expr={"\\vec{a}+\\vec{b}"} />, in blue. Notice
			its coordinates are just the two sets of coordinates added up.
		</P>

		<Spacer />

		<!-- <h3>Vectors as a Linear Combination of Basis Vectors</h3> -->

		<P id="st-1">
			Let's bring in a fresh vector, <Tex
				expr={"\\vec{v}=-\\mathbf{i}+2\\mathbf{j}"}
			/>, and think about what the coordinates of a <ColorText color="in"
				>vector</ColorText
			> actually represent.
		</P>

		<!-- TODO: Animate the text decoration, syncing it with the rest of the animations -->
		<!-- TODO: On hover, highlights all the matching elements -->
		<P id="st-2">
			In the <Tex expr={"xy"} />-coordinate plane, every vector can be built out
			of just two building blocks: a vector of length <Tex expr="1" /> pointing in
			the <nobr><ColorText color="p"><Tex expr="x" />-direction</ColorText></nobr>,
			called <Tex expr={"\\hat{\\imath}"} />, and one of length <Tex expr="1" /> pointing
			in the <ColorText color="s"><Tex expr="y" />-direction</ColorText>, called <Tex
				expr={"\\hat{\\jmath}"}
			/>.
		</P>

		<!-- <P id="st-3">
			<Tex expr={vectorAsLinearComb} display color />
      The unit-vector in the x-direction is scaled by the x-coordinate of the vector, and the unit-vector in the y-direction is scaled by the y-coordinate of the vector.
    </P> -->

		<!-- <Tex
      expr={vectorAsLinearCombAlt}
      display
    /> -->

		<!-- TODO: Do text highlighting that syncs with the corresponding animation -->
		<P id="st-3">
			<Tex expr={vectorAsLinearComb} display color />
			Together, <Tex expr={"\\hat{\\imath}"} /> and <Tex
				expr={"\\hat{\\jmath}"}
			/> are called the <Term>standard basis vectors</Term>. And now a vector's coordinates
			mean something concrete: they're just the amounts to scale each basis vector
			by before adding the two together.
		</P>

		<p>
			Scaling some vectors and adding the results is called taking a <Term
				>linear combination</Term
			> of them. So every vector in the plane is a linear combination of <Tex
				expr={"\\hat{\\imath}"}
			/> and <Tex expr={"\\hat{\\jmath}"} />.
		</p>

		<Spacer />

		<Tex expr={matrixVectorFormulaColored} display />

		<p>
			Look closely — that's a linear combination too. Multiplying a vector by a
			matrix scales two vectors by the coordinates and adds them, exactly as
			before. The only difference is which two vectors: instead of <Tex
				expr={"\\hat{\\imath}"}
			/> and <Tex expr={"\\hat{\\jmath}"} />, we use the two <B>columns</B> of the
			matrix.
		</p>

		<Tex expr={matrixVectorFormulaEg} display color />

		<P id="st-4">
			So a matrix is really just a way of writing down where you want the basis
			vectors to go. That's the core insight: a matrix transforms a vector by <B
				>transforming the basis vectors underneath it</B
			>, building an entirely new coordinate system.
		</P>

		<P id="st-5">
			The transformed vector is still the same linear combination — the same two
			coordinates doing the scaling — only now it's the new basis vectors being
			scaled and added.
		</P>

		<Spacer />

		<p>
			Because every vector is built from the basis vectors, moving them drags all
			of space along too. To really feel that, let's stop watching one vector and
			watch <B>a whole field of them</B> at once, each multiplied by the same
			matrix.
		</p>

		<P id="st-6">
			Arrows everywhere would be a mess, so we'll draw each vector as just a dot
			at its tip. The grid lines get transformed along with them, with a copy of
			the original grid left underneath for comparison.
		</P>

		<P id="st-7">
			Space rotates and stretches, following wherever the new basis vectors land.
		</P>

		<P>
			A matrix can't warp space just any way it likes. It performs a particular
			kind of transformation, called a <Term>linear transformation</Term>, and
			you can spot one by two tell-tale signs:
		</P>

		<ul class="ml-4 marker:text-info marker:text-2xl">
			<li>Straight lines stay straight — nothing ever curves, and</li>
			<li>the origin stays exactly where it is.</li>
		</ul>

		<p>
			Watch the grid as it moves and you'll see it: the lines stay parallel and
			evenly spaced the whole way through.
		</p>

		<Spacer />

		<h3 class="text-neutral">The Determinant</h3>

		<p>
			Every square matrix has a single number attached to it called its <Term
				>determinant</Term
			>. For a <Tex expr={"2\\times2"} /> matrix you multiply along each diagonal
			and subtract one product from the other:
		</p>

		<Tex expr={detFormula} display />

		<P id="st-det-1">
			Let's clear the board and work it out for the matrix we've been using all
			along. The arithmetic is quick, and it comes to <Tex expr="4" />:
		</P>

		<Tex expr={detEg} display color />

		<div class="h-[300px]" />

		<p>
			So far that's just arithmetic. The interesting question is what the number
			<B>means</B> — and it turns out to mean something very concrete. The
			determinant is the factor by which the transformation scales <B>area</B>.
		</p>

		<Tex expr={detAsAreaRatio} display />

		<P id="st-det-2">
			To see that, let's run the same transformation again, but this time keep
			an eye on one particular patch of the plane rather than the whole thing.
		</P>

		<div class="h-[300px]" />

		<P id="st-det-3">
			Here's the patch, after the transformation: the parallelogram built on the
			two columns of the matrix. Count the grid squares inside it and you get an
			area of <Tex expr="4" />.
		</P>

		<div class="h-[300px]" />

		<P id="st-det-4">
			And here's what that patch was before — the <Term>unit square</Term> built
			on <Tex expr={"\\hat{\\imath}"} /> and <Tex expr={"\\hat{\\jmath}"} />: one
			unit wide, one unit tall, area <Tex expr="1" />.
		</P>

		<div class="h-[300px]" />

		<p>
			Divide one by the other and you get the determinant. And this isn't special
			to the unit square — every region in the plane, whatever its shape, has its
			area multiplied by <Tex expr="4" />.
		</p>

		<Tex expr={detAreaEg} display />

		<p>
			Two special cases are worth seeing for yourself.
		</p>

		<P id="st-det-5">
			First, a <B>negative</B> determinant. This matrix leaves <Tex
				expr={"\\hat{\\imath}"}
			/> pointing right but sends <Tex expr={"\\hat{\\jmath}"} /> downwards, so the
			grid gets turned over like a sheet of paper:
		</P>

		<Tex expr={detNegEg} display color />

		<p>
			The area still grows — by a factor of <Tex expr="2" /> — but the sign
			tells you something extra: the orientation was reversed. What used to be
			counter-clockwise from <Tex expr={"\\hat{\\imath}"} /> to <Tex
				expr={"\\hat{\\jmath}"}
			/> is now clockwise. The size of the number is the area factor; the minus sign
			is the flip.
		</p>

		<div class="h-[300px]" />

		<P id="st-det-6">
			Second, a determinant of <Tex expr="0" />. Here both columns point along
			the same line, so there's nothing to build a parallelogram out of:
		</P>

		<Tex expr={detZeroEg} display color />

		<p>
			Watch the whole grid collapse onto a single line. Every bit of area is
			squashed down to nothing, which is exactly what a determinant of <Tex
				expr="0"
			/> means. The transformation has thrown a dimension away, and once that
			happens there's no way to undo it — you can't tell which of the squashed
			points you started from.
		</p>

		<div class="h-[300px]" />

		<P id="st-det-7">
			Back to our original matrix, then — with a determinant of <Tex expr="4" />
			and space the right way round.
		</P>

		<Spacer />

		<!-- TODO: Have a kind of recap at the end -->
		<div class="exclude">
			<Tex expr={matrixVectorFormulaColored} display />
			<Insight>
				<ul>
					<li>
						Any vector can be expressed as the addition of scaled basis vectors,
						i.e.
						<B>a linear combination of basis vectors</B>.
					</li>
					<li>
						A matrix can be viewed as a way to <B
							>package information about a linear transformation</B
						>. The columns of a matrix represent where the new basis vectors
						land after the transformation.
					</li>
					<li>
						The <B>determinant</B> of a matrix is the factor by which it scales
						area. A negative determinant means space was also flipped over, and
						a determinant of <Tex expr="0" /> means space was squashed flat.
					</li>
					<li>
						Matrix-vector multiplication is a way to compute where a given
						vector lands after the transformation defined by a matrix.
					</li>
				</ul>
			</Insight>
		</div>

		<Spacer />

		<div class="exclude">
			<P id="st-8">
				With our understanding so far, try to tinker about and figure out what
				kinds of transformations are possible with matrices!
			</P>
			<p>
				What basis vectors should you choose in order to scale space uniformly
				in all directions? How about a reflection, rotation or a shear?
			</p>
			<p>
				The shaded <ColorText color="in">parallelogram</ColorText> and the
				running <Tex expr={"\\det"} /> readout update as you go — see if you can
				find a matrix that doubles every area, one that flips space over, and one
				that flattens it completely.
			</p>
			<Action>
				<!-- TODO: Allow users to grab the basis vectors too? -->
				<ul class="list-none">
					<InteractionsList />
					<li>
						<ActionIcon icon={Grid2x2} />
						<B>Watch the det value</B> and the shaded unit area change as you edit
						the matrix
					</li>
				</ul>
			</Action>
		</div>

		<!-- Room for the try-it before the narrative takes the matrix back -->
		<div class="h-[1200px]" />

		<Spacer />

		<h3 class="text-neutral">Undoing a Transformation</h3>

		<p>
			If a matrix moves space around, a natural question is whether you can move
			it back. The matrix that does that is called the <Term>inverse</Term> of
			<Tex expr="A" />, written <Tex expr={"A^{-1}"} />. Apply one and then the
			other and you end up exactly where you started — which is the same as
			saying they multiply to give the matrix that changes nothing.
		</p>

		<Tex expr={inverseUndoes} display />

		<p>
			For a <Tex expr={"2\\times2"} /> matrix there's a recipe: swap the two
			entries on the main diagonal, flip the sign of the other two, and divide
			everything by the determinant.
		</p>

		<Tex expr={inverseFormula} display />

		<P id="st-inv-1">
			Let's watch it happen. Here's the plain grid again, with the unit square
			marked on it.
		</P>

		<div class="h-[800px]" />

		<P id="st-inv-2">
			Apply <Tex expr="A" /> and we get the picture from before: the square is
			sheared into a parallelogram with <Tex expr="4" /> times the area.
		</P>

		<div class="h-[800px]" />

		<P id="st-inv-3">
			Now apply <Tex expr={"A^{-1}"} /> on top of that. Space slides back, the
			parallelogram shrinks to the unit square, and the grid is exactly as it
			was.
		</P>

		<Tex expr={inverseEg} display color />

		<p>
			Look at where the determinant turns up: a factor of <Tex
				expr={"\\tfrac{1}{4}"}
			/> out in front. That makes sense in terms of area. Going forwards, <Tex
				expr="A"
			/> multiplied every area by <Tex expr="4" />; to undo that,
			<Tex expr={"A^{-1}"} /> has to divide every area by <Tex expr="4" />.
		</p>

		<Spacer />

		<h3 class="text-neutral">When There's No Way Back</h3>

		<p>
			That <Tex expr={"\\tfrac{1}{\\det A}"} /> should make you suspicious. If the
			determinant were <Tex expr="0" />, the recipe would ask you to divide by zero
			— so it simply can't be carried out. But that's an answer about algebra. The
			more interesting question is <B>why</B> no such matrix could exist in the first
			place.
		</p>

		<P id="st-inv-4">
			Take two different vectors, <Tex expr={"\\vec{p}"} /> in red and <Tex
				expr={"\\vec{q}"}
			/> in green. Right now they're clearly distinct — they point to different places.
		</P>

		<div class="h-[800px]" />

		<P id="st-inv-5">
			Now apply a matrix with a determinant of <Tex expr="0" />, and watch them.
			Space flattens onto a line, and the two arrows land on top of one another —
			the exact same point.
		</P>

		<Tex expr={singularCollapseEg} display />

		<p>
			And there's the problem. An inverse would have to take that output and give
			back the input. But two different vectors went in and the same vector came
			out, so the question <B>"which one did it come from?"</B> has no single
			answer. No matrix could do it, because there's nothing for it to return.
		</p>

		<p>
			Information was destroyed, and no transformation can invent it again. This
			is what people mean when they call a matrix with <Tex expr={"\\det A = 0"} />
			<Term>singular</Term>: it squashes space, and squashing is a one-way trip.
		</p>

		<p>
			Scroll back up to the playground and drag the matrix until the determinant
			reads <Tex expr="0" />. You'll see <Tex expr={"A^{-1}"} /> disappear the moment
			it gets there.
		</p>
	</Section>

	<!-- TODO: How about 3D? -->
	<Section id="section-2" classNames="animate">
		<h2 class="text-neutral">Beyond Two-Dimensions</h2>

		<p>
			So far we've only been talking about matrix transformations in
			two-dimensions on the <Tex expr="xy" />-plane. Do the same intuitions
			carry over to <B>higher dimensions</B>?
		</p>

		<P id="st-9">
			To make up three dimensions, we have yet another standard basis vector —
			the unit vector in the <ColorText color="a"
				><Tex expr="z" />-direction</ColorText
			>. This also means we're now fiddling around with vectors of length <Tex
				expr="3"
			/> — representing the <Tex expr="xyz" /> coordinates — and matrices of size
			<nobr><Tex expr="3\times3" /></nobr>.
		</P>

		<P id="st-10">
			The concept of matrix transformations in 3D is exactly the same. The three
			basis vectors are transformed to their new locations, warping space along
			with them. These locations are completely determined by the columns of the
			matrix.
		</P>

		<Tex expr={matrixVectorFormula3dEg} display color />

		<P id="st-11">
			Originally, any vector is composed of a linear combination of these three
			standard basis vectors. To figure out the where the vector lands after the
			transformation, it is a linear combination of the transformed basis
			vectors, each scaled by the respective coordinates in the starting vector.
		</P>

		<Spacer />

		<h3 class="text-neutral">The Determinant in 3D</h3>

		<p>
			The determinant carries over too — with one word changed. In 2D it
			measured how much a transformation scales <B>area</B>. In 3D there's an
			extra dimension to stretch, so it measures how much it scales <B
				>volume</B
			>.
		</p>

		<Tex expr={det3dAsVolumeRatio} display />

		<P id="st-det3d-1">
			Instead of the unit square, we start from the <Term>unit cube</Term> — the
			box built on <Tex expr={"\\hat{\\imath}"} />, <Tex
				expr={"\\hat{\\jmath}"}
			/> and <Tex expr={"\\hat{k}"} />, with a volume of <Tex expr="1" />.
		</P>

		<P id="st-det3d-2">
			Apply the transformation and the cube is sheared into a slanted box, built
			on the three columns of the matrix. For this matrix its volume comes out to
			<Tex expr="2" />, so every region of space has its volume doubled:
		</P>

		<Tex expr={det3dEg} display color />

		<p>
			The two special cases carry over as well. A negative determinant means the
			transformation turned space inside out, and a determinant of <Tex
				expr="0"
			/> means the cube was flattened — squashed onto a plane, a line, or even a
			single point.
		</p>

		<!-- Room before the cat's beat, so it doesn't fade in over the cube -->
		<div class="h-[500px]" />

		<Spacer />

		<P id="st-12">
			From these visually-focused examples we've seen thus far, the most obvious application
			of matrix transformations would be that of computer graphics. In fact,
			this is precisely how this article was built! Matrices provide a language
			to rotate, scale and translate vectors and points and consequently entire
			objects in 2D or 3D space.
		</P>

		<!-- <p>
			Talk about application in computer graphics... give a concrete example
			visually. Give other examples of applications of matrices... From the
			visual examples we've seen thus far, the most obvious application of
			matrix transformations would be that of computer. In fact,
		</p> -->
		<Spacer />
		<div class="exclude">
			<p id="st-13">
				Go forth and wrap your head around matrix transformations in 3D! Now you
				have a whole additional dimension to fidget around with.
			</p>
			<Action>
				<ul class="list-none">
					<InteractionsList />
					<li>
						<ActionIcon icon={Grab} />
						<B>Right click and drag</B> to rotate around the space
					</li>
					<li>
						<ActionIcon icon={Grid2x2} />
						<B>Watch the det value</B> and the shaded unit cube — in 3D the determinant
						scales volume
					</li>
				</ul>
			</Action>
		</div>

		<!-- Scroll room for the 3D playground: the article's bottom hitting the
		     viewport bottom is what closes the input panel -->
		<div class="h-[1600px]" />
	</Section>

	<!-- TODO: Composition of matrices -->
</div>
