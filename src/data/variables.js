import themeColors from "daisyui/src/theming/themes";
import { color as d3Color } from "d3";
import { Matrix, determinant } from "ml-matrix";

// Data
export const egVector = [-1, 2];
export const scalarDemoVector = [1, 2];

// Vector addition example (head-to-tail)
export const addVectorA = [2, 1];
export const addVectorB = [1, 2];
export const addVectorSum = [
	addVectorA[0] + addVectorB[0],
	addVectorA[1] + addVectorB[1]
];

// Where i-hat and j-hat land. Both stay in the upper-right quadrant so the
// transformation reads as a stretch/shear rather than a flip; det is 4.
export const egMatrixX = [2, 0];
export const egMatrixY = [1, 2];

export const initMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

export const egEndMatrix = [
	egMatrixX[0], egMatrixY[0], 0, 0,
	egMatrixX[1], egMatrixY[1], 0, 0,
	0, 0, 1, 0,
  0, 0, 0, 1
];

// Determinant examples: negative (space flips over) and zero (space collapses)
export const negDetMatrixX = [2, 0];
export const negDetMatrixY = [0, -1];
export const zeroDetMatrixX = [1, 2];
export const zeroDetMatrixY = [2, 4];

function endMatrixFrom(mx, my) {
	return [
		mx[0], my[0], 0, 0,
		mx[1], my[1], 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	];
}

export const negDetEndMatrix = endMatrixFrom(negDetMatrixX, negDetMatrixY);
export const zeroDetEndMatrix = endMatrixFrom(zeroDetMatrixX, zeroDetMatrixY);

export const egDet = egMatrixX[0] * egMatrixY[1] - egMatrixY[0] * egMatrixX[1];

// Inverse of the running example, as the columns i-hat and j-hat land on
export const egInvMatrixX = [egMatrixY[1] / egDet, -egMatrixX[1] / egDet];
export const egInvMatrixY = [-egMatrixY[0] / egDet, egMatrixX[0] / egDet];

// Two distinct vectors that a singular matrix sends to the very same point,
// which is why that transformation cannot be undone
export const singularP = [1, 0];
export const singularQ = [3, -1];
export const negDet =
	negDetMatrixX[0] * negDetMatrixY[1] - negDetMatrixY[0] * negDetMatrixX[1];

const A = new Matrix([egMatrixX, egMatrixY]).transpose();
const v = new Matrix([egVector]).transpose();
const w = A.mmul(v);

export const egOutputVector = [w.get(0, 0), w.get(1, 0)];

// export const eg3dVector = [2, 3, -1];
// export const eg3dMatrixX = [0, 1, -2];
// export const eg3dMatrixY = [1, 2, 4];
// export const eg3dMatrixZ = [1, 3, 4];

// export const eg3dVector = [2, 3, -1];
export const eg3dVector = [-1, 2, 1];
export const eg3dMatrixX = [1, 0, 0];
export const eg3dMatrixY = [1, 1, 1];
// export const eg3dMatrixZ = [0, 0, 1];
export const eg3dMatrixZ = [0, -1, 1];

const B = new Matrix([eg3dMatrixX, eg3dMatrixY, eg3dMatrixZ]).transpose();
const u = new Matrix([eg3dVector]).transpose();
const t = B.mmul(u);

export const eg3dOutputVector = [t.get(0, 0), t.get(1, 0), t.get(2, 0)];

// Volume scale factor of the 3D example transformation
export const eg3dDet = Math.round(determinant(B));

const [x1, x2, x3] = eg3dMatrixX;
const [y1, y2, y3] = eg3dMatrixY;
const [z1, z2, z3] = eg3dMatrixZ;

export const eg3dMatrix = [
	x1, y1, z1, 0,
	x2, y2, z2, 0,
	x3, y3, z3, 0,
	0, 0, 0, 1,
];

// Colors
const dracula = themeColors["[data-theme=dracula]"];

export const colorXAlt = dracula.primary;
export const colorYAlt = dracula.secondary;
export const colorZAlt = dracula.accent;

// export const colorX = d3Color("hsl(326, 100%, 67%)").formatHex();
// export const colorY = d3Color("hsl(265, 89%, 71%)").formatHex();
// export const colorZ = d3Color("hsl(31, 100%, 64%)").formatHex();
export const colorX = colorToHex("hsl(326, 100%, 67%)");
export const colorY = colorToHex("hsl(265, 89%, 71%)");
export const colorZ = colorToHex("hsl(31, 100%, 64%)");

// export const colorVector = dracula.info;
// export const colorVector = "hsl(191, 97%, 77%)";
// export const colorVector = "#04cefb";
export const colorVector = colorToHex("hsl(191, 97%, 50%)");

export const colorAddA = colorToHex("hsl(0, 85%, 65%)");
export const colorAddB = colorToHex("hsl(140, 70%, 45%)");

// Determinant: area before / after the transformation
export const colorAreaOld = colorToHex("hsl(50, 100%, 70%)");
export const colorAreaNew = colorToHex("hsl(191, 97%, 55%)");
// Shown when the determinant is zero and the region has collapsed
export const colorAreaZero = colorToHex("hsl(14, 95%, 58%)");

export const colorGrid = colorToHex("hsl(191, 97%, 30%)");
export const colorGridAlt = colorToHex("hsl(191, 97%, 20%)");

export const colorB1 = "hsl(231, 15%, 18%)";
export const colorB2 = colorToHex("hsl(231, 15%, 11%)");
export const colorB3 = "hsl(231, 15%, 4%)";

export const colorN = "hsl(230, 15%, 30%)";
export const colorNc = "hsl(232, 7%, 85%)";
export const colorNf = "hsl(230, 15%, 23%)";

export const colorIn = "hsl(191, 97%, 77%)"


function colorToHex(color) {
	return d3Color(color).formatHex();
}
