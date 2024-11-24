import { setupGamepad, subscribeToGamepadEvents } from './gamepad.mjs';
import { onKey, addKeys } from './keyboard.mjs';
import { UI } from './ui.mjs';
import { st, setLayout, LAYOUT_SPLIT, LAYOUT_FPV, LAYOUT_STATIONARY, LAYOUT_PIP } from './3d.mjs';

const K_UP    = 'ArrowUp';
const K_DOWN  = 'ArrowDown';
const K_LEFT  = 'ArrowLeft';
const K_RIGHT = 'ArrowRight';
const K_W = 'w';
const K_S = 's';
const K_A = 'a';
const K_D = 'd';
const K_1 = '1';
const K_2 = '2';
const K_3 = '3';
const K_4 = '4';

const ui = new UI();

setupGamepad();

addKeys([
    K_1, K_2, K_3, K_4,
    K_W, K_S, K_A, K_D,
    K_UP, K_DOWN, K_LEFT, K_RIGHT,
]);
onKey((k, isDown) => {
         if (k === K_W) st.throttle = isDown ?  1 : 0;
    else if (k === K_S) st.throttle = isDown ? -1 : 0;
    else if (k === K_A) st.dYaw     = isDown ? -1 : 0;
    else if (k === K_D) st.dYaw     = isDown ?  1 : 0;

    else if (k === K_UP)    st.dPitch = isDown ?  1 : 0;
    else if (k === K_DOWN)  st.dPitch = isDown ? -1 : 0;
    else if (k === K_LEFT)  st.dRoll  = isDown ? -1 : 0;
    else if (k === K_RIGHT) st.dRoll  = isDown ?  1 : 0;

    if (!isDown) return;

    if      (k === K_1) setLayout(LAYOUT_SPLIT);
    else if (k === K_2) setLayout(LAYOUT_FPV);
    else if (k === K_3) setLayout(LAYOUT_STATIONARY);
    else if (k === K_4) setLayout(LAYOUT_PIP);
});

// configure different commands/bidnings by replacing this function
function onLiteRadio3([axis, value]) {
         if (axis === 5) st.throttle = value;
    else if (axis === 0) st.dYaw = value;
    else if (axis === 4) st.dPitch = value;
    else if (axis === 3) st.dRoll = value;
}

subscribeToGamepadEvents(onLiteRadio3);

function onTick() {
    requestAnimationFrame(onTick);
    ui.update(st);
}
onTick();
