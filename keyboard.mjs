/*
const UP = 'ArrowUp';
const DOWN = 'ArrowDown';
const LEFT = 'ArrowLeft';
const RIGHT = 'ArrowRight';
const W = 'w';
const S = 's';
const A = 'a';
const D = 'd';
*/

const relevant = new Set();

let onKeyFn = () => {};

export function onKey(fn) {
    onKeyFn = fn;
}

export function addKeys(keys) {
    for (const k of keys) relevant.add(k);
}

function onKeyFactory(isDown) {
    return function(ev) {
        if (ev.altKey || ev.metaKey || ev.ctrlKey || !relevant.has(ev.key)) return;
        ev.preventDefault();
        ev.stopPropagation();
        onKeyFn(ev.key, isDown);
    }
}

window.addEventListener('keydown', onKeyFactory(true));
window.addEventListener('keyup',   onKeyFactory(false));

/*
window.addEventListener('keydown', (ev) => {
    if (ev.altKey || ev.metaKey || ev.ctrlKey) return;
    switch (ev.key) {
        case '1': setLayout(LAYOUT_SPLIT); break;
        case '2': setLayout(LAYOUT_FPV); break;
        case '3': setLayout(LAYOUT_STATIONARY); break;
        case '4': setLayout(LAYOUT_PIP); break;
        default: return;
    }
    ev.preventDefault();
    ev.stopPropagation();
});

window.addEventListener('keyup', (ev) => {
    if (ev.altKey || ev.metaKey || ev.ctrlKey) return;
    switch (ev.key) {
        case '1': setLayout(LAYOUT_SPLIT); break;
        case '2': setLayout(LAYOUT_FPV); break;
        case '3': setLayout(LAYOUT_STATIONARY); break;
        case '4': setLayout(LAYOUT_PIP); break;
        default: return;
    }
    ev.preventDefault();
    ev.stopPropagation();
});
*/
