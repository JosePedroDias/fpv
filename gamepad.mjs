const speedMs = 1000 / 60;
let lastT = Date.now();

let state;
let bindings = new Map();
let inBindingMode = false;
let yetToBind = [];

let onGamepadEventHandler = () => {};
let onGamepadBindingMessage = () => {};

export function subscribeToGamepadEvents(fn) {
    onGamepadEventHandler = fn;
}

export function subscribeToGamepadBindingMessages(fn) {
    onGamepadBindingMessage = fn;
}

function onButton(i, isDown) {
    const k = `b${i}`;
    console.warn(`button ${i}: ${isDown}`); return;

    if (!isDown) return;
    if (inBindingMode) {
        const purpose = yetToBind.shift();
        bindings.set(k, purpose);
        onGamepadBindingMessage(`button #${i} -> ${purpose}`);
        continueBinding();
    } else {
        const purpose = bindings.get(k);
        if (purpose) {
            //console.warn(k, purpose);
            onGamepadEventHandler(purpose);
        }
    }
}

function onAxis(i, v) {
    //console.warn(`axis ${i}: ${v}`); return;
    onGamepadEventHandler([i, v]);
    return;

    if (!v) return;
    const k = `a${i}${v}`;
    //console.warn(`axis ${k}`);
    if (inBindingMode) {
        if (!bindings.get(k)) {
            const purpose = yetToBind.shift();
            bindings.set(k, purpose);
            onGamepadBindingMessage(`axis ${k} -> ${purpose}`);
            continueBinding();
        }
    } else {
        const purpose = bindings.get(k);
        if (purpose) {
            //console.warn(k, purpose);
            onGamepadEventHandler(purpose);
        }
    }
}

let bindingPromise, bindingResolve;

export function rebindGamepad() {
    bindingPromise = new Promise((resolve) => {
        bindingResolve = resolve;
    });
    bindings = new Map();
    inBindingMode = true;
    yetToBind = GP_ACTIONS.slice();
    onGamepadBindingMessage(`define gamepad button/axis for action ${yetToBind[0]}...`);
    return bindingPromise;
}

function continueBinding() {
    if (yetToBind.length > 0) {
        onGamepadBindingMessage(`define gamepad button/axis for action ${yetToBind[0]}...`);
    } else {
        inBindingMode = false;
        bindingResolve();
    }
}

export function getGamepadBindings() {
    // TODO compat?
    return Object.fromEntries(bindings);
}

export function setGamepadBindings(o) {
    bindings = new Map(Object.entries(o));
}

const CUT1 = -0.5;
const CUT2 =  0.5;

function makeDiscrete(v) {
    if (v < CUT1) return 'a';
    if (v > CUT2) return 'b';
    return '';
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
        //gp.axes.forEach((a) => state.axes.push(a));
        gp.axes.forEach((a) => state.axes.push(makeDiscrete(a)));
    } else {
        gp.buttons.forEach((b, i) => {
            const v = b.pressed;
            if (v !== state.buttons[i]) onButton(i, v);
            state.buttons[i] = v;
        });
        gp.axes.forEach((v, i) => {
            //v = makeDiscrete(v);
            if (v !== state.axes[i]) onAxis(i, v);
            state.axes[i] = v;
        });
    }
}

export function setupGamepad() {
    const onTick = () => {
        requestAnimationFrame(onTick);
        const t = Date.now();
        if (t - lastT >= speedMs) {
            readGamepad();
            lastT = t;
        }
    };
    
    onTick();
}