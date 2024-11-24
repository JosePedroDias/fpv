export class UI {
    constructor(parentEl = document.body) {
        const el = document.createElement('div');
        el.appendChild(document.createTextNode(' '));
        parentEl.appendChild(el);
        this.el = el;
    }

    update(st) {
        const s = `throttle: ${st.throttle.toFixed(2)} | yaw: ${st.dYaw.toFixed(2)} | pitch: ${st.dPitch.toFixed(2)} | roll: ${st.dRoll.toFixed(2)}`;
        this.el.childNodes[0].nodeValue = s;
    }
}
