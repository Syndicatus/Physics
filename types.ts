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
};

export type numberWithUnits = {
    value: number
    units: Array<unit>
};

export type numberWithDerivedUnits = {
    value: number,
    units: Array<unit | derivedUnit>
};