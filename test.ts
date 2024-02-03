import { addUnits, addUnitsToVector, restateUnits } from "./number";
import { units, derivedUnits, constants } from "./units";
import { display } from "./display";
import { electricalForce, electricalField } from "./electricity";

const {m} = units;
const {uC, N} = derivedUnits;

const particle1 = {
    charge: addUnits(20, [uC]),
    position: addUnitsToVector([0, 0], [m])
};

const particle2 = {
    charge: addUnits(30, [uC]),
    position: addUnitsToVector([0,5], [m])
};

const field = electricalField([particle2], addUnitsToVector([0,0], [m]));
const force = electricalForce([particle2], particle1);

console.log(`Particle 1: ${display(restateUnits(particle1.charge, [uC]))} @ ${display(particle1.position)}`);
console.log(`Particle 2: ${display(restateUnits(particle2.charge, [uC]))} @ ${display(particle2.position)}`)

console.log("Electrical Field (at Particle 1): " + display(restateUnits(field, [N])));
console.log("Electrical Force (on Particle 1): " + display(restateUnits(force, [N])));