import {
    setupGamepad,
    rebindGamepad,
    subscribeToGamepadEvents,
    subscribeToGamepadBindingMessages,

} from './gamepad.mjs';
import { UI } from './ui.mjs';
import {
    st,
} from './3d.mjs';

const ui = new UI();

setupGamepad();

//subscribeToGamepadBindingMessages((msg) => console.log('msg', msg));

//const o = await rebindGamepad();
//console.log('o', o);

//const m = new Map(); setGamepadBindings(m);

//subscribeToGamepadEvents((action) => console.log(`action: ${action}`));
subscribeToGamepadEvents(([i, v]) => {
    if (i === 5) { // throttle
        st.throttle = v;
    } else if (i === 0) { // yaw
        st.dYaw = v;
    } else if (i === 4) { // pitch
        st.dPitch = v;
    } else if (i === 3) { // roll
        st.dRoll = v;
    }
    //console.warn(i, v);
    ui.set(i, v);
});

function onTick() {
    requestAnimationFrame(onTick);
    ui.update();
}
onTick();
