# duct-size-js

Equal-friction duct sizing in plain JavaScript: airflow in, round duct diameter, air velocity and equivalent rectangular duct out. No dependencies, and the same functions run in Node or a browser.

## Formulas

| What | Formula |
|---|---|
| Friction rate (round galvanized duct) | `FR = 0.109136 * Q^1.9 / d^5.02` (in.wg per 100 ft, Q in CFM, d in inches) |
| Velocity | `V = 183.3 * Q / d^2` (fpm) |
| Diameter for a target velocity | `d = 13.541 * sqrt(Q / V)` |
| Equivalent diameter of a rectangle a x b | `De = 1.30 * (a*b)^0.625 / (a+b)^0.25` |

Diameter for a given friction rate is the friction equation solved for `d`. The result is rounded up to the next standard round size (4 to 48 in), which is the safe direction: the real friction and velocity come out at or below the target. The rectangular side is found by bisection.

## Use

```bash
node index.js 400
# 400 CFM @ 0.10 in.wg/100ft: exact 9.83", use 10" round, 733 fpm, 0.092 in.wg/100ft
```

```js
const { size, rectSide } = require("./index");
size({ cfm: 400, friction: 0.1 });      // equal friction
size({ cfm: 400, velocity: 900 });      // velocity target
rectSide(10, 8);                        // other side of a 8 in-high duct equivalent to 10 in round
```

`npm test` checks the round trips (friction of the exact diameter equals the requested friction; the rectangular side solves back to the same equivalent diameter).

## Notes

This is the calculation behind the web-based [duct sizing calculator](https://ductsizingcalculator.com/?utm_source=github&utm_medium=readme); the method and each step are explained at ductsizingcalculator.com/how-we-calculate/. The results are a design aid, not a substitute for a Manual D calculation or local code.

License: MIT
