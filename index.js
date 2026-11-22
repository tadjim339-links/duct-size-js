"use strict";
// Round galvanized duct friction: FR = 0.109136 * Q^1.9 / d^5.02
// FR in in.wg per 100 ft, Q in CFM, d in inches. V = 183.3 * Q / d^2 (fpm).
const STD = [4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 40, 42, 48];

const dFromFriction = (Q, FR) => Math.pow((0.109136 * Math.pow(Q, 1.9)) / FR, 1 / 5.02);
const dFromVelocity = (Q, V) => 13.541 * Math.sqrt(Q / V);
const velocity = (Q, d) => (183.3 * Q) / (d * d);
const friction = (Q, d) => (0.109136 * Math.pow(Q, 1.9)) / Math.pow(d, 5.02);

// Next standard size at or above d (small 0.05 in tolerance), else the largest.
function nextStd(d) {
  for (const s of STD) if (s >= d - 0.05) return s;
  return STD[STD.length - 1];
}

// Equivalent diameter of a rectangular duct a x b: De = 1.30 (ab)^0.625 / (a+b)^0.25
const equivalentDiameter = (a, b) => (1.3 * Math.pow(a * b, 0.625)) / Math.pow(a + b, 0.25);

// Solve the other side b for a given equivalent diameter De and side a (bisection).
function rectSide(De, a) {
  let lo = 2, hi = 400;
  for (let i = 0; i < 60; i++) {
    const b = (lo + hi) / 2;
    if (equivalentDiameter(a, b) < De) lo = b; else hi = b;
  }
  return (lo + hi) / 2;
}

function size({ cfm, friction: fr = 0.1, velocity: v = null }) {
  const exact = v ? dFromVelocity(cfm, v) : dFromFriction(cfm, fr);
  const std = nextStd(exact);
  return { exact, std, velocity: velocity(cfm, std), friction: friction(cfm, std) };
}

module.exports = { STD, dFromFriction, dFromVelocity, velocity, friction, nextStd, equivalentDiameter, rectSide, size };

if (require.main === module) {
  const cfm = Number(process.argv[2] || 400);
  const r = size({ cfm });
  console.log(`${cfm} CFM @ 0.10 in.wg/100ft: exact ${r.exact.toFixed(2)}", use ${r.std}" round, ${Math.round(r.velocity)} fpm, ${r.friction.toFixed(3)} in.wg/100ft`);
}
