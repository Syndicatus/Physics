import {unit, derivedUnit, numberWithUnits, numberWithDerivedUnits, vectorWithUnits, vectorWithDerivedUnits, withUnits} from "./types";
import { divide } from "./math";

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

export const powerUnit = (unit: unit | derivedUnit, powerMultiplier: number) => 
    ("power" in unit) ? 
        {...unit, power: powerMultiplier}: 
        {...unit, powerMultiplier};

export const powerBaseUnit = ({name}: unit, power: number) => {return {name, power}}
 
export const invertUnits = (arr: Array<unit>): Array<unit> => arr.map(({name, power}) => {return {name, power: power*-1}});

const superText = "⁰¹²³⁴⁵⁶⁷⁸⁹".split("");

const convertToSuperText = (n: number) => {
    const number = Math.abs(n);
    const digits = `${number}`.split("").map(Number);
    return digits.map(v => superText[v]).join("");
};

const convertUnitName = (unit: unit | derivedUnit): string => {
    let number: number;
    if ("power" in unit) number = unit.power;
    else number = unit.powerMultiplier ?? 1;

    if (number === 1) return `${unit.name}`;
    return `${unit.name}${convertToSuperText(number)}`;
}

export const display = ({value, units}: withUnits) => {
    const positiveExponent = units.filter((unit) => {
        if ("power" in unit) return unit.power > 0;
        return (unit.powerMultiplier ?? 1) > 0;
    });
    const negativeExponent = units.filter((unit) => {
        if ("power" in unit) return unit.power <= 0;
        return (unit.powerMultiplier ?? 1) <= 0;
    });

    const hasNegative = negativeExponent.length > 0;

    const positiveUnits = positiveExponent.map(convertUnitName).join("");
    const negativeUnits = negativeExponent.map(convertUnitName).join("");

    let numeric = value.toString();
    let end = "";
    if (Array.isArray(value)) {
        numeric = `< ${value.join(",")} > | ${value[0]}`;
        end = ` @ ${value[1]}`;
    }

    return `${numeric} ${positiveUnits}${hasNegative ? "/":""}${negativeUnits}${end}`;
}