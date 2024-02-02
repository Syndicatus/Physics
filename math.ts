import { numberWithUnits } from "./types";
import { sameUnits, combineUnits, invertUnits } from "./number";

export const add = (a: numberWithUnits, b: numberWithUnits):numberWithUnits => {
    if (!sameUnits(a.units, b.units)) throw Error("Adding mismatched units");
    return {value: a.value + b.value, units: a.units};
};

export const subtract = (a: numberWithUnits, b: numberWithUnits):numberWithUnits => {
    if (!sameUnits(a.units, b.units)) throw Error("Adding mismatched units");
    return {value: a.value - b.value, units: a.units};
};

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