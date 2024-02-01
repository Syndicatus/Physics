const magnitude = vector => Math.sqrt(vector.reduce((acc, val) => acc + val**2,0));
const convertToPolar = vector => [magnitude(vector), Math.atan2(vector[1], vector[0])];
const convertFromPolar = vector => [vector[0]*Math.cos(vector[1]), vector[0]*Math.sin(vector[1])];
const vectorAdd = (v1, v2) => v1.map((v, i) => v + v2[i]);

const addPolarVectors = (v1, v2) => convertToPolar(vectorAdd(convertFromPolar(v1), convertFromPolar(v2)));
const multiplyPolarVector = ([mag, dir], c) => [mag*c, dir];
const subtractPolarVectors = (v1, v2) => addPolarVectors(v1, multiplyPolarVector(v2, -1));

export const chargeCartesian = (coulombs, position) => {return {charge: coulombs, position: convertToPolar(position)}};
export const chargePolar = (coulombs, position) => {return {charge: coulombs, position}};

export const ePerCoul =  6.241509*(10**18);

const k_e = 8.987551792314*(10**9);

const electricalForce = (c1, c2) => {
    const {charge: charge1, position: position1} = c1;
    const {charge: charge2, position: position2} = c2;
    
    const [magnitude, direction] = subtractPolarVectors(position1, position2);
    
    const force = (k_e*charge1*charge2)/(magnitude**2);

    console.log(c2,[force, direction]);

    return [force, direction];
}

export const netForce = ([charge, ...chargeList]) => 
    chargeList
        .map((thisCharge) => electricalForce(charge, thisCharge))
        .reduce((accumulator, thisForce) => addPolarVectors(accumulator, thisForce),[0,0]);

export const coulombsPerFund = chargeList => chargeList.map(charge => charge/ePerCoul);
export const fundPerCoulombs = chargeList => chargeList.map(charge => charge*ePerCoul);