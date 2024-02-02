import { multiply } from "./math";
import { addUnits, display, restateUnits } from "./number";
import { numberWithDerivedUnits, numberWithUnits } from "./types";
import { units, derivedUnits } from "./units";

const {m} = units;
const {N, J} = derivedUnits;

const force: numberWithUnits = addUnits(10, [N]);
const forceInNewton: numberWithDerivedUnits = restateUnits(force, [N]);
const distance: numberWithUnits = addUnits(10, [m]);

const work = multiply(force, distance);

const workInNewton = restateUnits(work, [N]);
const workInJoules = restateUnits(work, [J]);

console.log(`${display(forceInNewton)} * ${display(distance)} =`)
console.log(display(work));
console.log(display(workInNewton));
console.log(display(workInJoules));