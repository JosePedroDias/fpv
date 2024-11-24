import * as THREE from 'https://threejs.org/build/three.module.js';

const W = window.innerWidth;
const H = window.innerHeight;

export const LAYOUT_SPLIT      = 1; // (fpv | stationary)
export const LAYOUT_FPV        = 2; // (fpv)
export const LAYOUT_STATIONARY = 3; // (stationary)
export const LAYOUT_PIP        = 4; // (fpv, w/ stationary in PIP)

let layout = LAYOUT_PIP;

// COLORS
const WHITE = 0x999999;
const RED   = 0x990000;
const GREEN = 0x009900;
const BLUE  = 0x000099;

// DRONE RELATED
const USE_PHYSICS  = true;
const G_SCALE = 0.0001;
const THROTTLE_SCL = USE_PHYSICS ? 4 * G_SCALE : 0.1;
const YAW_SCL      = 0.5;
const ROLL_SCL     = 0.5;
const PITCH_SCL    = 0.5;
const MAX_VEL      = 10; // TODO

// WORLD RELATED
const SIZE = 120;
const SIZE2 = SIZE / 2;
const DENS = Math.ceil(0.25 * SIZE);

// CAMERAS
const CHASE_CAM_ANGLE = 0; //15;
const CHASE_CAM_POS = [
    0, 0, 0,
    //0, 0.5, 1,
];
const CHASE_CAM_FOV = 90;

const STATIONARY_CAM_FOV = 45;
const STATIONARY_POS = [
    0.8 * SIZE2,
    0.3 * SIZE2,
    0.8 * SIZE2,
];

/////////////////////

// scene setup
const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer();
renderer.autoClear = false;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


function setupBasicLevel() {
    // GRIDS https://threejs.org/docs/index.html?q=ArrowHelper#api/en/helpers/GridHelper
    // floor
    let grid = new THREE.GridHelper(SIZE, DENS, WHITE, GREEN); scene.add(grid);
    // -Z, +Z
    grid = new THREE.GridHelper(SIZE, DENS, WHITE, BLUE); grid.position.y = SIZE2; grid.position.z = -SIZE2; grid.rotation.x = THREE.MathUtils.degToRad(90); scene.add(grid);
    grid = new THREE.GridHelper(SIZE, DENS, WHITE, BLUE); grid.position.y = SIZE2; grid.position.z =  SIZE2; grid.rotation.x = THREE.MathUtils.degToRad(90); scene.add(grid);
    // -X, +X
    grid = new THREE.GridHelper(SIZE, DENS, WHITE, RED); grid.position.y = SIZE2; grid.position.x = -SIZE2; grid.rotation.z = THREE.MathUtils.degToRad(90); scene.add(grid);
    grid = new THREE.GridHelper(SIZE, DENS, WHITE, RED); grid.position.y = SIZE2; grid.position.x =  SIZE2; grid.rotation.z = THREE.MathUtils.degToRad(90); scene.add(grid);

    // multiple random cubes to help understand where we are
    for (let i = 0; i < 200; ++i) {
        const r = 0.6 + 1.4 * Math.random();
        const cubeGeo = new THREE.BoxGeometry(r, r, r);
        const cubeMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color(
                0.5 * Math.random(),
                0.5 * Math.random(),
                0.5 * Math.random(),
            ),
        });
        const cubeMesh = new THREE.Mesh(cubeGeo, cubeMat);
        cubeMesh.position.x = (-0.5 + Math.random()) * SIZE;
        cubeMesh.position.z = (-0.5 + Math.random()) * SIZE;
        cubeMesh.position.y =          Math.random() * SIZE;
        scene.add(cubeMesh);
    }
}

function setupCourse() {
    let grid = new THREE.GridHelper(SIZE, DENS, WHITE, GREEN); scene.add(grid);

    for (let i = 0; i < 20; ++i) {
        const r = 0.6 + 1.4 * Math.random();
        // https://threejs.org/docs/?q=torus#api/en/geometries/TorusGeometry
        const hoopGeo = new THREE.TorusGeometry(2, 0.1, 16, 24); // radius, tube, radialSegments, tubularSegments
        const hoopMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color(
                0.5 * Math.random(),
                0.5 * Math.random(),
                0.5 * Math.random(),
            ),
        });
        const hoopMesh = new THREE.Mesh(hoopGeo, hoopMat);
        hoopMesh.position.x = (-0.5 + Math.random()) * SIZE;
        hoopMesh.position.z = (-0.5 + Math.random()) * SIZE;
        hoopMesh.position.y = 1 + 10 * Math.random();
        hoopMesh.rotation.y = Math.PI * Math.random();
        //hoopMesh.position.y =          Math.random() * SIZE;
        scene.add(hoopMesh);
    }
}

// drone representation
const droneGeo = new THREE.BoxGeometry(1, 1, 1);
const droneMat = new THREE.MeshBasicMaterial({
    color: 0xAA00AA,
    wireframe: true,
});
const droneMesh = new THREE.Mesh(droneGeo, droneMat);
droneMesh.layers.set(1);
scene.add(droneMesh);

// cameras https://threejs.org/docs/index.html?q=PerspectiveCamera#api/en/cameras/PerspectiveCamera
const chaseCam      = new THREE.PerspectiveCamera(CHASE_CAM_FOV,      W / H, 0.1, 1000);
const stationaryCam = new THREE.PerspectiveCamera(STATIONARY_CAM_FOV, W / H, 0.1, 1000);

export function setLayout(l) {
    layout = l;
    chaseCam.aspect      = (l === LAYOUT_SPLIT ? 0.5 : 1) * W / H;
    stationaryCam.aspect = (l === LAYOUT_SPLIT ? 0.5 : 1) * W / H;
    chaseCam.updateProjectionMatrix();
    stationaryCam.updateProjectionMatrix();
}
setLayout(layout);

chaseCam.position.set(...CHASE_CAM_POS);
chaseCam.rotation.x = THREE.MathUtils.degToRad(CHASE_CAM_ANGLE);

stationaryCam.layers.enable(1); // hide this layout from fpv view (drone and front arrow)
stationaryCam.position.set(...STATIONARY_POS); // static position

const chaseGrp = new THREE.Group();
chaseGrp.add(chaseCam);
droneMesh.add(chaseGrp);


// AUXILIARY
// https://threejs.org/docs/index.html?q=ArrowHelper#api/en/helpers/ArrowHelper

// front dir arrow
const frontArrowHelper = new THREE.ArrowHelper(
    new THREE.Vector3(0, 0, -1), // dir
    new THREE.Vector3(0, 0, 0), // orig
    1.5, // length,
    0xFFFF00, // color (yellow)
);
frontArrowHelper.layers.set(1);
//droneMesh.add(frontArrowHelper);

const throttleArrowHelper = new THREE.ArrowHelper(
    new THREE.Vector3(0, 1, 0), // dir
    new THREE.Vector3(0, 0, 0), // orig
    1, // length,
    0x00FFFF, // color (cyan)
);
throttleArrowHelper.layers.set(1);
//droneMesh.add(throttleArrowHelper);

//const camHelper = new THREE.CameraHelper(chaseCam); scene.add(camHelper);
//const camHelper2 = new THREE.CameraHelper(stationaryCam); scene.add(camHelper2);
const axesHelper = new THREE.AxesHelper(); //stationaryCam.add(axesHelper);
scene.add(axesHelper);
axesHelper.position.set(...STATIONARY_POS);

setupBasicLevel();
//setupCourse();

// drone state
export const st = {
    // inputs (deltas)
    throttle: 0, // vertical movement (up/down)
    dYaw: 0,     // rotation around the Y-axis
    dRoll: 0,    // rotation around the Z-axis
    dPitch: 0,   // rotation around the X-axis

    // orientation
    yaw: 0,
    roll: 0,
    pitch: 0,

    // physics
    vel: new THREE.Vector3(0, 0, 0),
    accel: new THREE.Vector3(0, 0, 0),
    grav: new THREE.Vector3(0, -G_SCALE, 0),
};

// Transformation functions
function setThrottle(amount) {
    const localUp = new THREE.Vector3(0, 1, 0);
    const worldUp = localUp.applyQuaternion(droneMesh.quaternion);

    if (USE_PHYSICS) {
        st.accel.add(worldUp.multiplyScalar(amount));
    } else {
        droneMesh.position.add(worldUp.multiplyScalar(amount));
    }
}

function updateOrientation(yaw, pitch, roll) {
    const yawQuat = new THREE.Quaternion();
    const pitchQuat = new THREE.Quaternion();
    const rollQuat = new THREE.Quaternion();
  
    // Yaw (around Y-axis)
    yawQuat.setFromAxisAngle(new THREE.Vector3(0, -1, 0), THREE.MathUtils.degToRad(yaw));
  
    // Pitch (around X-axis)
    pitchQuat.setFromAxisAngle(new THREE.Vector3(-1, 0, 0), THREE.MathUtils.degToRad(pitch));
  
    // Roll (around Z-axis)
    rollQuat.setFromAxisAngle(new THREE.Vector3(0, 0, -1), THREE.MathUtils.degToRad(roll));
  
    // Combine in fixed order: yaw → pitch → roll
    const combinedQuat = new THREE.Quaternion();
    combinedQuat.multiplyQuaternions(yawQuat, pitchQuat);
    combinedQuat.multiplyQuaternions(combinedQuat, rollQuat);
  
    // Apply to the drone
    droneMesh.quaternion.copy(combinedQuat);
}

// animation loop
function onTick() {
    requestAnimationFrame(onTick);

    st.yaw   += YAW_SCL   * st.dYaw;
    st.pitch += PITCH_SCL * st.dPitch;
    st.roll  += ROLL_SCL  * st.dRoll;

    updateOrientation(st.yaw, st.pitch, st.roll);

    setThrottle(THROTTLE_SCL * st.throttle);

    if (USE_PHYSICS) {
        //const aS = st.accel.length(); console.log(aS.toFixed(10));
        st.accel.add(st.grav); // apply gravity to acceleration
        st.vel.add(st.accel); // update velocity based on acceleration
        //const vS = st.vel.length(); console.log(vS.toFixed(2));
        droneMesh.position.add(st.vel); // update position based on velocity
        st.accel.multiplyScalar(0.9); // dampen acceleration (simulate air resistance)
    }

    // Update cams
    stationaryCam.lookAt(droneMesh.position);

    // render
    renderer.clear();
    if (layout === LAYOUT_SPLIT) {
        renderer.setViewport(0, 0, W / 2, H); // 1st/left (chase)
        renderer.render(scene, chaseCam);
        renderer.setViewport(W / 2, 0, W / 2, H); // 2nd/right (stationary)
        renderer.render(scene, stationaryCam);
    } else if (layout === LAYOUT_FPV) {
        renderer.setViewport(0, 0, W, H); // 1st/left (chase)
        renderer.render(scene, chaseCam);
    } else if (layout === LAYOUT_STATIONARY) {
        renderer.setViewport(0, 0, W, H); // 1st/left (chase)
        renderer.render(scene, stationaryCam);
    } else if (layout === LAYOUT_PIP) {
        renderer.setViewport(0, 0, W, H); // 1st/left (chase)
        renderer.render(scene, chaseCam);
        renderer.setViewport(0, 0, W / 4, H / 4); // 2nd/right (stationary)
        renderer.setScissor(0, 0, W / 4, H / 4);
        renderer.setScissorTest(true);
        renderer.clear();
        renderer.render(scene, stationaryCam);
        renderer.setScissorTest(false);
    }
}
onTick();
