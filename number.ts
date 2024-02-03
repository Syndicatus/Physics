import {unit, derivedUnit, numberWithUnits, numberWithDerivedUnits, vectorWithUnits, vectorWithDerivedUnits, withUnits, vector} from "./types";
import { divide } from "./math";
import { scaleVector } from "./vector";

export const powerUnit = (unit: unit | derivedUnit, powerMultiplier: number) => 
    ("power" in unit) ? 
        {...unit, power: powerMultiplier}: 
        {...unit, powerMultiplier};

export const powerBaseUnit = ({name}: unit, power: number) => {return {name, power}}

const powerUnits = (arr: Array<unit>, multiplier: number): Array<unit> => 
        arr.map(({name, power}) => {return {name, power: power*multiplier}});
 
export const invertUnits = (arr: Array<unit>): Array<unit> => powerUnits(arr, -1);

const emptyUnits: {[key: string]: unit} = {
    m: {name: "m", power: 0},
    s: {name: "s", power: 0},
    kg: {name: "kg", power: 0},
    A: {name: "A", power: 0},
    K: {name: "K", power: 0},
    cd: {name: "cd", power: 0},
};

export const sameUnits = (a: Array<unit>, b: Array<unit>): boolean => {
    if (a.length !== b.length) return false;
    const aSorted = a.map(a => a).sort((c, d) => c.name.localeCompare(d.name));
    const bSorted = b.map(b => b).sort((c, d) => c.name.localeCompare(d.name));
    return aSorted.every((unit, i) => unit.name === bSorted[i].name && unit.power === bSorted[i].power);
};

export const combineUnits = (arr: Array<unit>): Array<unit> => {
    type UnitObject = {[key: symbol | string]: unit};
    const unitObj: UnitObject = arr.reduce((acc, unit) => {
        const {name, power} = unit;
        const newPower = power + acc[name].power;
        return {...acc, [name]: {name, power: newPower}}; 
    }, emptyUnits);

    return Object.keys(unitObj)
            .map((key) => unitObj[key])
            .filter((unit) => unit.power !== 0);
};



export const addUnits = (num: number, units: Array<unit | derivedUnit>): numberWithUnits => {
    let number = num;
    const unitList: Array<unit> = units.flatMap((unit) => {
        if ("power" in unit) return unit;
        number += unit.offset ?? 0;
        number *= unit.multiplier ?? 1;
        return powerUnits(unit.components, (unit.powerMultiplier ?? 1));
    });
    const trueUnits = combineUnits(unitList);

    return {value: number, units: trueUnits};
};

export const addUnitsToVector = (vec: vector, units: Array<unit | derivedUnit>): vectorWithUnits => {
    let vector = vec;
    const unitList: Array<unit> = units.flatMap((unit) => {
        if ("power" in unit) return unit;
        vector = scaleVector(vector, unit.multiplier ?? 1);
        return powerUnits(unit.components, (unit.powerMultiplier ?? 1));
    });
    const trueUnits = combineUnits(unitList);

    return {value: vector, units: trueUnits};
};


export const restateUnits = (number: withUnits, units: Array<unit | derivedUnit>): withUnits => {
    const originalUnits = addUnits(1, number.units);
    const trueUnits: numberWithUnits = addUnits(1, units);
    const remainingUnits = divide(originalUnits, trueUnits);

    const finalUnits = [...units, ...remainingUnits.units];

    const trueValue = finalUnits.reduce((acc, unit) => {
        if ("power" in unit) return acc;
        const divisor = unit.multiplier ?? 1;
        if (Array.isArray(acc)) return scaleVector(acc, 1/divisor);
        return acc/divisor;
    }, number.value)

    if (Array.isArray(trueValue)) return {value: trueValue, units: finalUnits};
    return {value: trueValue, units: finalUnits};
};