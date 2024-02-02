import {addUnits, units, allUnits, math, restateUnits} from "./units";

const {multiply} = math;
const {m, kg, s} = units;
const {N, J} = allUnits;

const v1 = addUnits(20, [N]);
const v2 = addUnits(1, [m]);

const v3 = multiply(v1, v2);

console.log(restateUnits(v3, [J]));