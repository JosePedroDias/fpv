# fpv

## TD;DR

Trying to come up with the simplest FPV simulation possible.

- gets inputs from radio controller via USB using the gamepad API (currently hardcoded to literadio 3)
- uses threejs to display the points of view of the drone and an external cam
- 1, 2, 3, 4 to change camera layouts


## how to run

`npx http-server -c-1 .`

visit http://localhost:8080


## input

### example - betafpv lite radio 3

- https://betafpv.com/products/literadio-3-radio-transmitter?srsltid=AfmBOooos2bI_7Px6MxRTXDtVoBv5i0wPO_CTO_5HKnlrFVtpaA8hEJv
- https://oscarliang.com/learn-flying-fpv-multirotors/

```
THROTTLE  (left  / yaw  / throttle)   x: #0 (-1, +1), y: #5 (-1, +1)
DIRECTION (right / roll / pitch)      x: #3 (-1, +1), y: #4 (-1, +1)

SB(L)  #2 (-1, 0, +1)
SC(R)  #6 (-1,    +1)
SA(ZL) #1 (-1,    +1)
SD(ZR) ????
```

## 3D

- https://threejs.org/docs/index.html#manual/en/
- https://threejs.org/examples/


## TODO

- ...
