import {addUnits, units, allUnits, math} from "./units";

const {divide} = math;
const {m, kg, s} = units;
const {N} = allUnits;

const v1 = addUnits(20, [N]);
const v2 = addUnits(1, [kg]);

const v3 = divide(v1, v2);

console.log(v3);