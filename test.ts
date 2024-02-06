import { addUnits, addUnitsToVector, restateUnits } from "./number";
import { units, derivedUnits } from "./units";
import { display } from "./display";
import { electricalForce, electricalField, ohmsLaw } from "./electricity";

const {A} = units;
const {V, Ohm, W} = derivedUnits;

const power = undefined;
const voltage = addUnits(12, [V]);
const current = undefined;
const resistance = addUnits(266, [Ohm]);

const [calcPower, calcVotage, calcCurrent, calcResistance] = ohmsLaw(power, voltage, current, resistance);

console.log(`Power: ${display(restateUnits(calcPower, [W]))}`);
console.log(`Voltage: ${display(restateUnits(calcVotage, [V]))}`);
console.log(`Current: ${display(calcCurrent)}`);
console.log(`Resistance: ${display(restateUnits(calcResistance, [Ohm]))}`);