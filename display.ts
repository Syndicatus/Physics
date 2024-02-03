import { unit, derivedUnit, withUnits } from "./types";
import { toPolar } from "./vector";

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

    if (Math.abs(number) === 1) return `${unit.name}`;
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
        const polar = toPolar(value);
        numeric = `<${value.join(",")}> | ${polar[0]}`;
        end = ` @ ${polar[1]}°`;
    }

    return `${numeric} ${positiveUnits}${hasNegative ? "/":""}${negativeUnits}${end}`;
}