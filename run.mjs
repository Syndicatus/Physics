import { chargeCartesian, coulombsPerFund, ePerCoul, fundPerCoulombs, netForce } from "./electricity.mjs";

const charge = [0];

const multCharges = [
    chargeCartesian(0.071, [0,0]),
    chargeCartesian(0.026, [3.8, 0]),
];

console.log(`The es per Coulomb: ${fundPerCoulombs(charge)}\n The coulombs per e: ${coulombsPerFund(charge)}`);

const [m, d] = netForce(multCharges)
console.log(`The netForce on the first charge is: (${m},${(d*180/(Math.PI) + 360) % 360})`);