export type vector = [x: number, y: number];
export type polarVector = [r: number, theta: number];
type BaseUnit = "m" | "s" | "kg" | "A" | "K" | "cd";

//#region Units
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
//#endregion

//#region withUnits
export type numberWithUnits = {
    value: number
    units: Array<unit>
};

export type numberWithDerivedUnits = {
    value: number,
    units: Array<unit | derivedUnit>
};

export type vectorWithUnits = {
    value: vector,
    units: Array<unit>
};

export type vectorWithDerivedUnits = {
    value: vector,
    units: Array<unit | derivedUnit>
};

export type withUnits = numberWithUnits | numberWithDerivedUnits | vectorWithUnits | vectorWithDerivedUnits;

export type option<type> = type | undefined;
//#endregion

//#region Objects
export type chargedParticle = {
    charge: numberWithUnits,
    position: vectorWithUnits
};
//#endregion