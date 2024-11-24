const N = 7;
const AXIS_NAMES = [
    'yaw', // 0
    'SA', // 1
    'SB', // 2
    'roll', // 3
    'pitch', // 4
    'throttle', // 5
    'SC', // 6
];

export class UI {
    constructor(parentEl = document.body) {
        const el = document.createElement('div');
        el.appendChild(document.createTextNode('TODO'));
        parentEl.appendChild(el);
        this.el = el;

        const o = new Array(N);
        o.fill(0);
        this.o = o;
    }

    set(idx, value) {
        this.o[idx] = value;
    }

    update() {
        if (!this.o) return;
        const arr = [5, 0, 4, 3].map((i) => [this.o[i], AXIS_NAMES[i]]);
        const s = arr.map(([v, name]) => {
            const V = `${v < 0 ? '' : '+'}${v.toFixed(2)}`;
            return `${name}: ${V}`;
        }).join(' | ');
        this.el.childNodes[0].nodeValue = s;
    }
}
