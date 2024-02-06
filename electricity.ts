import { addVectors, divide, multiply, scaleVectorWithUnits, subtractVectors } from "./math";
import { addUnits, powerBaseUnit, restateUnits } from "./number";
import { chargedParticle, numberWithUnits, option, vectorWithUnits } from "./types";
import { constants, derivedUnits, units } from "./units";
import { toCartesian, toPolar } from "./vector";

const {A} = units;
const {W, V: Volt, Ohm} = derivedUnits;


const electricalFieldFromParticle = (charge: chargedParticle, position: vectorWithUnits): vectorWithUnits => {
    const {k_e} = constants;
    const {charge: charge1, position: position1} = charge;
    
    const distanceVector = subtractVectors(position1, position).value;
    const [magnitude, direction] = toPolar(distanceVector);
    

    const force = divide(multiply(k_e, charge1), addUnits(magnitude**2, [powerBaseUnit(units.m, 2)]));

    return {
        value: toCartesian([force.value, direction]),
        units: force.units
    };
}

export const electricalField = (charges: Array<chargedParticle>, position: vectorWithUnits) => {
    const effects = charges.map(charge => electricalFieldFromParticle(charge, position));
    return effects.reduce(addVectors);
}

export const electricalForce = (charges: Array<chargedParticle>, target: chargedParticle): vectorWithUnits => {
    const field = electricalField(charges, target.position);
    return scaleVectorWithUnits(field, target.charge);
}

export const ohmsLaw = (power: option<numberWithUnits>, voltage: option<numberWithUnits>, current: option<numberWithUnits>, resistance: option<numberWithUnits>) => {
    const [Pdefined, Vdefined, Idefined, Rdefined] 
            = [power, voltage, current, resistance].map(number => number !== undefined);
    let P = power ?? addUnits(1, [W]);
    let V = voltage ?? addUnits(1, [Volt]);
    let I = current ?? addUnits(1, [A]);
    let R = resistance ?? addUnits(1, [Ohm]);

    if (!Vdefined && !Idefined) throw Error("Not solvable");

    if (Pdefined) {
        if (Vdefined) I = divide(P, V);
        else if (Idefined) V = divide(P, I);
        R = divide(V, I);
    } else {
        if (!Rdefined) R = divide(V, I);
        if (!Idefined) I = divide(V, R);
        if (!Vdefined) V = multiply(I, R);
        P = multiply(V, I);
    }

    return [P, V, I, R];
}