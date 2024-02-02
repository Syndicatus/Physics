import { unit, derivedUnit } from "./types";
import { addUnits, powerBaseUnit, powerUnit } from "./number";

//#region Base Units
const meter: unit = {name: "m", power: 1};
const second: unit = {name: "s", power: 1};
const kilogram: unit = {name: "kg", power: 1};
const Ampere: unit = {name: "A", power: 1};
const Kelvin: unit = {name: "K", power: 1};

export const units: {[key: string]: unit} = {
    m: meter, 
    s: second, 
    kg: kilogram, 
    A: Ampere, 
    K: Kelvin};
//#endregion

const lengthUnits: Array<derivedUnit> = [
    {name: "mm", components: [meter], multiplier: 1/1000},
    {name: "km", components: [meter], multiplier: 1000},
];

const otherUnits: Array<derivedUnit> = [
    {name: "N", components: [meter, kilogram, powerBaseUnit(second, -2)]},
    {name: "J", components: [powerBaseUnit(meter, 2), kilogram, powerBaseUnit(second, -2)]},
    {name: "C", components: [Ampere, second]}
];

export const derivedUnits: {[key: string]: derivedUnit} = 
    [...lengthUnits, ...otherUnits].reduce((accumulator, unit) => {return {...accumulator, [unit.name]: unit}},{});

const {N, C} = derivedUnits;

export const constants = {
    k_e: addUnits(8.987551792314*(10**9), [N, powerUnit(C, -2), powerUnit(meter, 2)]),
};