const assert = require("assert");
const d = require("./index");
const near = (a, b, e = 1e-6) => assert.ok(Math.abs(a - b) <= e, `${a} vs ${b}`);
const r = d.size({ cfm: 400, friction: 0.1 });
console.log(r);
// round-trip: friction of the exact diameter equals the requested friction
near(d.friction(400, r.exact), 0.1);
// velocity formula: 400 cfm in a 10 in duct
near(d.velocity(400, 10), 733.2);
// rounding up never raises friction or velocity above the exact-size values
assert.ok(r.std >= r.exact - 0.05);
assert.ok(r.friction <= 0.1 + 0.005);
// velocity mode inverts velocity()
// the two constants (13.541 and 183.3) are rounded, so the round trip is close, not exact
near(d.velocity(400, d.dFromVelocity(400, 900)), 900, 0.5);
// rectangular side solves back to the same equivalent diameter
const b = d.rectSide(10, 8);
near(d.equivalentDiameter(8, b), 10, 1e-6);
assert.strictEqual(d.nextStd(9.8), 10);
assert.strictEqual(d.nextStd(50), 48);
console.log("ok");
