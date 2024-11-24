const speedMs = 1000 / 60;
let lastT = Date.now();

let state;

let onGamepadEventHandler = () => {};

export function subscribeToGamepadEvents(fn) {
    onGamepadEventHandler = fn;
}

function onButton(i, isDown) {
    // TODO buttons are not needed for literadio 3
    console.warn(`button ${i}: ${isDown}`); return;
}

function onAxis(i, v) {
    //console.warn(`axis ${i}: ${v}`); return;
    onGamepadEventHandler([i, v]);
}

function readGamepad() {
    const gp = navigator.getGamepads()[0];
    if (!gp) return;

    if (!state) {
        state = {
            buttons: [],
            axes: [],
        }
        gp.buttons.forEach((b) => state.buttons.push(b.pressed));
        gp.axes.forEach((a) => state.axes.push(a));
    } else {
        gp.buttons.forEach((b, i) => onButton(i, b.pressed));
        gp.axes.forEach((v, i) => onAxis(i, v));
    }
}

export function setupGamepad() {
    if (!navigator.getGamepads()[0]) return false;

    const onTick = () => {
        requestAnimationFrame(onTick);
        const t = Date.now();
        if (t - lastT >= speedMs) {
            readGamepad();
            lastT = t;
        }
    };
    
    onTick();

    return true;
}