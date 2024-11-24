# fpv

## TD;DR

Trying to come up with the simplest FPV simulation possible.

- gets inputs from radio controller via USB using the gamepad API
- uses threejs to display the points of view of the drone and an external cam
- multiple camera layouts
- everything's editable! physics, bindings, maps, etc.


## how to run

`npx http-server -c-1 .`

visit http://localhost:8080


## supported inputs

edit `main.mjs` to change these:
- lite ratio 3 bindings
- keyboard bindings: wasd/keys for throttle/y/p/r
- camera layouts:
    - 1 split
    - 2 fpv
    - 3 stationary
    - 4 fpv with stationary pip


## 3D

- https://threejs.org/docs/index.html#manual/en/
- https://threejs.org/examples/


## TODO

- support abstract 3d drone rendering (better than a cube)
- support 3d model backed drone rendering (easy, just need to create it)
- easily define drone specs and expo config etc.
- load a level via 3d model (easy, model and export from blender...)
- collision detection
- sound?
