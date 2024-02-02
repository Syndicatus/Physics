import { polarVector, vector } from "./types";

export const magnitude = (vector: vector): number => 
    Math.sqrt(vector.reduce((acc, val) => acc + val**2,0));

export const addVector = (v1: vector, v2: vector): vector => {
    const [x1, y1] = v1;
    const [x2, y2] = v2;

    return [x1 + x2, y1 + y2];
};

export const subVector = (v1: vector, v2: vector): vector => {
    const [x1, y1] = v1;
    const [x2, y2] = v2;

    return [x1 - x2, y1 - y2];
};

//const scaleVector = (vector: vector, scale: number):vector => [vector[0]*scale, vector[1]*scale];
//const scalePolarVector = (vector: polarVector, scale:number): polarVector => [vector[0]*scale, vector[1]];

const degToRad = (deg: number): number => deg*Math.PI/180;
const radToDeg = (rad: number): number => rad*180/Math.PI;

export const toPolar = (vector: vector):polarVector => [
    magnitude(vector), 
    radToDeg(Math.atan2(vector[1], vector[0]))
];
export const toCartesian = (vector: polarVector): vector => [
    vector[0]*Math.cos(degToRad(vector[1])), 
    vector[0]*Math.sin(degToRad(vector[1]))
];