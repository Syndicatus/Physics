import { addVectors, divide, multiply, scaleVectorWithUnits, subtractVectors } from "./math";
import { addUnits, powerBaseUnit } from "./number";
import { chargedParticle, vectorWithUnits } from "./types";
import { constants, units } from "./units";
import { toCartesian, toPolar } from "./vector";


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