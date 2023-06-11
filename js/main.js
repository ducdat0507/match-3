let mainCanvas
let ctx;

function init() {
    mainCanvas = document.getElementById("main-canvas");
    ctx = mainCanvas.getContext("2d");
    bindPointerEvent("onpointerdown", "mousedown", "touchstart");
    bindPointerEvent("onpointermove", "mousemove", "touchmove");
    bindPointerEvent("onpointerup", "mouseup", "touchend");
    window.oncontextmenu = e => false;
    // load();

    screens.intro();

    loop();
}

let time = Date.now();
let saveTime = 0;
let delta = 0;
let strain = 0;

let scene = controls.base();
let screens = {}
let scale = 1;

function loop() {
    delta = Date.now() - time;
    time += delta;
    saveTime += delta;
    /* if (saveTime > 15000) {
        save();
        saveTime = 0;
    } */

    let width = mainCanvas.width = window.innerWidth;
    let height = mainCanvas.height = window.innerHeight;
    scale = Math.min(width / 600, height / 800, window.devicePixelRatio);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    updateAnimations();
    renderControls(scene.controls, { x: 0, y: 0, width, height });

    strain = Date.now() - time;
    window.requestAnimationFrame(loop);
}

function renderControls(cts, rect, alpha = 1) {
    for (let ct of cts) {
        ct.rect = Rect(
            ct.position.x * scale + ct.position.ex * rect.width / 100 + rect.x,
            ct.position.y * scale + ct.position.ey * rect.height / 100 + rect.y,
            ct.size.x * scale + ct.size.ex * rect.width / 100,
            ct.size.y * scale + ct.size.ey * rect.height / 100,
        );
        let a = alpha * ct.alpha;
        ctx.globalAlpha = a;
        if (a > 0) ct.render();
        ct.onupdate();
        if (ct.controls.length) renderControls (ct.controls, ct.rect, a);
    }
}

let pointers = {};

function doPointerEvent(pos, cts, event, args) {
    for (let ct of cts) {
        if (ct.clickthrough) continue;
        if (pos.x >= ct.rect.x && pos.y >= ct.rect.y
            && pos.x <= ct.rect.x + ct.rect.width
            && pos.y <= ct.rect.y + ct.rect.height) {
            ct[event](pos, args);
        }
        if (ct.controls.length) doPointerEvent(pos, ct.controls, event, args);
    }
}

function doMouseEvent(e, type) {
    let pos = { x: e.clientX, y: e.clientY };
    doPointerEvent(pos, scene.controls, type, e);
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
}
function doTouchEvent(e, type) {
    for (let touch of e.changedTouches) {
        let pos = { x: touch.clientX, y: touch.clientY };
        touch.touches = e.touches;
        doPointerEvent(pos, scene.controls, type, touch);
    }
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
}

function bindPointerEvent(type, mouse, touch) {
    window.addEventListener(mouse, e => doMouseEvent(e, type));
    window.addEventListener(touch, e => doTouchEvent(e, type), { passive: false });
}