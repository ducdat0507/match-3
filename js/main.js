let mainCanvas
let ctx;

function init() {
    mainCanvas = document.getElementById("main-canvas");
    ctx = mainCanvas.getContext("2d");
    bindPointerEvent("onpointerdown", "mousedown", "touchstart");
    bindPointerEvent("onpointermove", "mousemove", "touchmove");
    bindPointerEvent("onpointerup", "mouseup", "touchend");
    window.oncontextmenu = e => false;
    
    load();
    loadRes();
    loadScreen("intro");

    loop();
}

let time = Date.now();
let saveTime = 0;
let delta = 0;
let strain = 0;

let scene = controls.base();
let screens = {}
let scale = 1;

let currentMode = "";

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
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);

    updateAnimations();
    updateInMouseState(scene.controls);
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
        ct.onupdate();
        if (a > 0) ct.render();
        if (ct.controls.length) renderControls (ct.controls, ct.rect, a);
    }
}

let pointers = {};
let mousePos = { x: 0, y: 0 }
let lastArgs;

function updateInMouseState(cts, args) {
    let did = false;
    for (let ct of [...cts].reverse()) {
        if (ct.clickthrough) continue;

        if (!did && mousePos.x >= ct.rect.x && mousePos.y >= ct.rect.y
            && mousePos.x <= ct.rect.x + ct.rect.width
            && mousePos.y <= ct.rect.y + ct.rect.height) {
            if (!ct.__mouseIn) {
                ct.onpointerin(mousePos, lastArgs);
                ct.__mouseIn = true;
            }
            did = true;
        } else {
            if (ct.__mouseIn) {
                ct.onpointerout(mousePos, lastArgs);
                ct.__mouseIn = false;
            }
        }

        if (ct.controls.length) {
            if (updateInMouseState(ct.controls)) did = true;
        }
    }
    return did;
}

function doPointerEvent(pos, cts, event, args) {
    let did = false;
    for (let ct of [...cts].reverse()) {
        if (ct.clickthrough) continue;

        if (!did && pos.x >= ct.rect.x && pos.y >= ct.rect.y
            && pos.x <= ct.rect.x + ct.rect.width
            && pos.y <= ct.rect.y + ct.rect.height) {
            ct[event](pos, args);
            did = true;
        }

        if (ct.controls.length) {
            if (doPointerEvent(pos, ct.controls, event, args)) did = true;
        }
    }
    return did;
}

function doMouseEvent(e, type) {
    let pos = mousePos = { x: e.clientX, y: e.clientY };
    lastArgs = e;
    doPointerEvent(pos, scene.controls, type, e);
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
}
function doTouchEvent(e, type) {
    for (let touch of e.changedTouches) {
        let pos = mousePos = { x: touch.clientX, y: touch.clientY };
        touch.touches = e.touches;
        lastArgs = touch;
        doPointerEvent(pos, scene.controls, type, touch);
    }
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
}

function loadScreen(screenName, clear = true) {
    if (clear) scene = controls.base();
    screens[screenName]();
}

function bindPointerEvent(type, mouse, touch) {
    window.addEventListener(mouse, e => doMouseEvent(e, type));
    window.addEventListener(touch, e => doTouchEvent(e, type), { passive: false });
}