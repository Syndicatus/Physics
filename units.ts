type BaseUnit = "m" | "s" | "kg" | "A" | "K" | "cd";

export type unit = {
    name: BaseUnit,
    power: number
};

export type derivedUnit = {
    name: string,
    components: Array<unit>,
    powerMultiplier?: number,
    multiplier?: number
    offset?: number
}

export type numberWithUnits = {
    value: number
    units: Array<unit>
};

export type numberWithDerivedUnits = {
    value: number,
    units: Array<unit | derivedUnit>
}

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

const emptyUnits: {[key: string]: unit} = {
    m: {name: "m", power: 0},
    s: {name: "s", power: 0},
    kg: {name: "kg", power: 0},
    A: {name: "A", power: 0},
    K: {name: "K", power: 0},
    cd: {name: "cd", power: 0},
};
//#endregion

const lengthUnits: Array<derivedUnit> = [
    {name: "mm", components: [meter], multiplier: 1/1000},
    {name: "km", components: [meter], multiplier: 1000},
];

const otherUnits: Array<derivedUnit> = [
    {name: "N", components: [meter, kilogram, {name: "s", power: -2}]},
    {name: "J", components: [{name: "m", power: 2}, kilogram, {name: "s", power: -2}]},
    {name: "C", components: [Ampere, second]}
];

export const allUnits: {[key: string]: derivedUnit} = 
    [...lengthUnits, ...otherUnits].reduce((accumulator, unit) => {return {...accumulator, [unit.name]: unit}},{});

export const addUnits = (num: number, units: Array<unit | derivedUnit>): numberWithUnits => {
    let number = num;
    const unitList: Array<unit> = units.flatMap((unit) => {
        if ("power" in unit) return unit;
        number += unit.offset ?? 0;
        number *= unit.multiplier ?? 1;
        return unit.components;
    });
    const trueUnits = combineUnits(unitList);

    return {value: number, units: trueUnits};
};

export const restateUnits = (number: numberWithUnits, units: Array<unit | derivedUnit>): numberWithDerivedUnits => {
    const trueUnits: numberWithUnits = addUnits(1, units);
    const remainingUnits = divide(number, trueUnits);

    const finalUnits = [...units, ...remainingUnits.units];

    return {value: number.value, units: finalUnits}
};

const sameUnits = (a: Array<unit>, b: Array<unit>): boolean => {
    if (a.length !== b.length) return false;
    const aSorted = a.map(a => a).sort((c, d) => c.name.localeCompare(d.name));
    const bSorted = b.map(b => b).sort((c, d) => c.name.localeCompare(d.name));
    return aSorted.every((unit, i) => unit.name === bSorted[i].name && unit.power === bSorted[i].power);
};

const combineUnits = (arr: Array<unit>): Array<unit> => {
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

const invertUnits = (arr: Array<unit>): Array<unit> => arr.map(({name, power}) => {return {name, power: power*-1}});
const powerUnit = (unit: unit | derivedUnit, powerMultiplier: number) => 
    ("power" in unit) ? 
        {...unit, power: powerMultiplier}: 
        {...unit, powerMultiplier};

const {N, C} = allUnits;

export const constants = {
    k_e: addUnits(8.987551792314*(10**9), [N, powerUnit(C, -2), powerUnit(meter, 2)]),
};

const add = (a: numberWithUnits, b: numberWithUnits):numberWithUnits => {
    if (!sameUnits(a.units, b.units)) throw Error("Adding mismatched units");
    return {value: a.value + b.value, units: a.units};
};

const subtract = (a: numberWithUnits, b: numberWithUnits):numberWithUnits => {
    if (!sameUnits(a.units, b.units)) throw Error("Adding mismatched units");
    return {value: a.value - b.value, units: a.units};
};

const multiply = (a: numberWithUnits, b: numberWithUnits): numberWithUnits => {
    return {
        value: a.value*b.value,
        units: combineUnits([...a.units, ...b.units])
    };
};

const divide = (a: numberWithUnits, b: numberWithUnits): numberWithUnits => {
    return {
        value: a.value/b.value,
        units: combineUnits([...a.units, ...invertUnits(b.units)]),
    };
};

const power = (a: numberWithUnits, b: number): numberWithUnits => {
    return {
        value: a.value**b,
        units: a.units.map(({name, power}) => {return {name, power: power*b}}),
    }
};

export const math = {add, subtract, multiply, divide, power};