<script>
	import A from "./A.svelte";
	import B from "./B.svelte";
	import IconLink from "./IconLink.svelte";
	import { Twitter, Linkedin, Mail, Github } from "lucide-svelte";

	const iconSize = 36;
</script>

<!-- TODO: Mention SOME3 -->

<!-- TODO: Credits, source of the models etc. -->

<footer class="max-w-prose mx-auto p-5 prose prose-xl pt-16 pb-28">
	<section class="prose-lg pb-10">
		<h3>About this version</h3>

		<p>
			<B>The Matrix Arcade</B> was created by <A
				href="https://yizhe-ang.github.io/">Yi Zhe Ang</A
			>. Everything up to and including the matrix transformation playground is
			his work — the writing, the visual design, and the 3D scene it all runs
			on.
		</p>

		<p>
			This version is an extended fork by <A
				href="https://github.com/kanikasure">Kanika</A
			>, built as a course project. The sections added here are:
		</p>

		<ul>
			<li>
				An introduction to vectors — direction and magnitude, scaling, and
				head-to-tail addition, each with its own interactive demo.
			</li>
			<li>
				<B>The Determinant</B> — area scaling, worked through the unit square
				and the shaded parallelogram, including the negative and zero cases.
			</li>
			<li>
				<B>The Inverse</B> — undoing a transformation, and a visual argument
				for why a determinant of zero makes that impossible.
			</li>
			<li>
				<B>The Determinant in 3D</B> — the same idea as volume, with a shaded
				unit cube.
			</li>
			<li>
				Live determinant and inverse readouts in the playgrounds, and vector
				labels throughout.
			</li>
		</ul>

		<p>
			If you enjoyed this, the links below are to the original author's work —
			please support him rather than this fork.
		</p>
	</section>

	<div class="divider" />

	<section class="flex flex-col items-center gap-8 text-center pb-10">
		<div>
			<p>Like Yi Zhe's work? :)</p>
			<div class="kofi-button grid place-content-center">
				<a class="kofi-link" href="https://ko-fi.com/U7U4NH69A" target="_blank"
					><img
						class="m-0"
						height="48"
						style="border:0px;height:48px;"
						src="https://storage.ko-fi.com/cdn/kofi5.png?v=3"
						border="0"
						alt="Buy Me a Coffee at ko-fi.com"
					/></a
				>
			</div>
		</div>
		<div>
			<p>Connect with the original author:</p>
			<div class="flex gap-5 justify-center">
				<IconLink href="https://twitter.com/yizhe_ang">
					<Twitter slot="icon" size={iconSize} />
					<svelte:fragment slot="label">Twitter</svelte:fragment>
				</IconLink>
				<IconLink href="https://www.linkedin.com/in/yizhe-ang/">
					<Linkedin slot="icon" size={iconSize} />
					<svelte:fragment slot="label">LinkedIn</svelte:fragment>
				</IconLink>
				<IconLink href="mailto:ang.yizhe@u.nus.edu">
					<Mail slot="icon" size={iconSize} />
					<svelte:fragment slot="label">Email</svelte:fragment>
				</IconLink>
				<IconLink href="https://github.com/yizhe-ang">
					<Github slot="icon" size={iconSize} />
					<svelte:fragment slot="label">Github</svelte:fragment>
				</IconLink>
			</div>
		</div>
		<div class="flex flex-col items-center">
			<p>
				His <A href="https://yizhe-ang.github.io/">portfolio</A> and other
				explorables:
			</p>
			<div>
				<div>
					<a
						href="https://k-means-explorable.vercel.app/"
						target="_blank"
						rel="noopener noreferrer"
						class="flex flex-col gap-5 items-start"
					>
						<img
							src="https://yizhe-ang.github.io/imgs/bg-7.png"
							alt="thumbnail"
							class="w-72 h-40 object-cover rounded-xl m-0 shadow-lg shadow-neutral-content/10"
						/>
						<span class="block text-2xl">K-Means Clustering</span>
					</a>
				</div>
			</div>
		</div>
	</section>

	<div class="divider" />

	<section class="prose-lg">
		<p>
			Source code: <A href="https://github.com/yizhe-ang/matrix-explorable"
				>the original</A
			>
			by Yi Zhe Ang, and <A
				href="https://github.com/kanikasure/matrix-explorable">this fork</A
			>.
		</p>

		<p>
			The original article was directly inspired by explainer videos of matrices
			and linear transformations by <A href="https://youtu.be/kYB8IZa5AuE"
				>3Blue1Brown</A
			> and <A href="https://youtu.be/7Gtxd-ew4lk">Visual Kernel</A>, and was
			written as an interactive complement to those resources.
		</p>

		<p>
			The <A href="https://knowyourmeme.com/memes/maxwell-the-cat-spinning-cat"
				>Maxwell the Cat</A
			> model was taken from <A href="https://leodog896.github.io/maxwell/"
				>here</A
			>. The project is built on <A
				href="https://github.com/the-pudding/svelte-starter">The Pudding's</A
			> Svelte starter template and is MIT licensed.
		</p>
	</section>
</footer>
