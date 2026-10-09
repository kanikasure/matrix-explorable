# The Matrix Arcade — extended

A Visual Explorable of Matrices and Linear Transformations.

> **This is a fork.** The original explainer was created by
> **[Yi Zhe Ang](https://yizhe-ang.github.io/)** and lives at
> **[yizhe-ang/matrix-explorable](https://github.com/yizhe-ang/matrix-explorable)**
> ([read it here](https://yizhe-ang.github.io/matrix-explorable/)).
> All of the original writing, visual design and the 3D scene it runs on are his
> work. This repository extends that article as a course project; the sections
> listed below are the only parts that are new.

## What this fork adds

| Section | What it covers |
| --- | --- |
| **What a vector is** | Direction and magnitude, with sliders to change either one |
| **Scaling** | Multiplying by a scalar, including negative values that flip the vector |
| **Vector addition** | The head-to-tail rule, animated through `a`, `b` and `a + b` |
| **The Determinant** | Area scaling, shown with the unit square and the transformed parallelogram |
| **Negative and zero determinants** | Space flipping over, and space collapsing onto a line |
| **The Inverse** | Undoing a transformation, and where the `1/det` factor comes from |
| **Why det = 0 has no inverse** | Two distinct vectors landing on the same point, so the reverse question has no answer |
| **The Determinant in 3D** | The same idea as a volume scale factor, with a shaded unit cube |

Smaller additions throughout:

- Vector labels (`v`, `a`, `b`, `î`, `ĵ`, `k̂`) that follow each arrow as it moves.
- Live **determinant** readout in both playgrounds — 2D area, 3D volume — which
  turns a warning colour when the transformation becomes singular.
- Live **inverse matrix** in the 2D playground, which switches to *"no inverse"*
  the moment the determinant reaches zero.
- Shaded unit square / parallelogram (and unit cube / parallelepiped in 3D) that
  deform live with the matrix.

## Running it locally

```bash
cd matrix-explorable
npm install
npm run dev
```

Then open the URL it prints.

**Use a desktop-width window** — the 3D canvas and the scrollytelling layout only
render at the `lg` breakpoint and above.

## Credits

- **[Yi Zhe Ang](https://yizhe-ang.github.io/)** — original article, design and
  implementation. If you enjoyed this, please support
  [his work](https://ko-fi.com/U7U4NH69A) rather than this fork.
- The original was inspired by the linear algebra explainers from
  [3Blue1Brown](https://youtu.be/kYB8IZa5AuE) and
  [Visual Kernel](https://youtu.be/7Gtxd-ew4lk).
- Built on The Pudding's [Svelte Starter Template](https://github.com/the-pudding/svelte-starter).
- [Threlte](https://threlte.xyz/), [Mathbox](https://github.com/unconed/mathbox),
  [GSAP](https://greensock.com/gsap/) and [KaTeX](https://katex.org/).
- The [Maxwell the Cat](https://leodog896.github.io/maxwell/) model.

## Licence

MIT, as in the upstream project — see [LICENSE](LICENSE). The licence file
carries The Pudding's copyright from the starter template; the article content
remains the work of its respective authors.
