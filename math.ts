import { numberWithUnits, vectorWithUnits } from "./types";
import { sameUnits, combineUnits, invertUnits } from "./number";
import { addVector, subVector } from "./vector";

export const add = (a: numberWithUnits, b: numberWithUnits):numberWithUnits => {
    if (!sameUnits(a.units, b.units)) throw Error("Adding mismatched units");
    return {value: a.value + b.value, units: a.units};
};

export const subtract = (a: numberWithUnits, b: numberWithUnits):numberWithUnits => {
    if (!sameUnits(a.units, b.units)) throw Error("Subtracting mismatched units");
    return {value: a.value - b.value, units: a.units};
};

export const addVectors = (a: vectorWithUnits, b: vectorWithUnits): vectorWithUnits => {
    if (!sameUnits(a.units, b.units)) throw Error("Adding mismatched units");
    return {value: addVector(a.value, b.value), units: a.units};
}

export const subtractVectors = (a: vectorWithUnits, b: vectorWithUnits): vectorWithUnits => {
    if (!sameUnits(a.units, b.units)) throw Error("Subtracting mismatched units");
    return {value: subVector(a.value, b.value), units: a.units};
}

export const multiply = (a: numberWithUnits, b: numberWithUnits): numberWithUnits => {
    return {
        value: a.value*b.value,
        units: combineUnits([...a.units, ...b.units])
    };
};

export const divide = (a: numberWithUnits, b: numberWithUnits): numberWithUnits => {
    return {
        value: a.value/b.value,
        units: combineUnits([...a.units, ...invertUnits(b.units)]),
    };
};

export const power = (a: numberWithUnits, b: number): numberWithUnits => {
    return {
        value: a.value**b,
        units: a.units.map(({name, power}) => {return {name, power: power*b}}),
    }
};