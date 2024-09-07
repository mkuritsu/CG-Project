/* ------ Grupo 00 -------
 * Rodrigo Correia - 58180
 * Laura Cunha     - 58188
 * João Pereira    - 58189
 * -----------------------
 */

let pressedKeys = new Set()
let lastPressedKeys = new Set();

let mousePos = {x: 0, y: 0};
let lastMousePos = {x: 0, y: 0};

export function init(canvas) {
    canvas.addEventListener("keydown", e => {
        if (document.pointerLockElement !== canvas)
            return;
        pressedKeys.add(e.key.toLowerCase());
        e.preventDefault();
    });

    canvas.addEventListener("keyup", e => {
        if (document.pointerLockElement !== canvas)
            return;
        pressedKeys.delete(e.key.toLowerCase());
        e.preventDefault();
    });

    canvas.addEventListener("click", () => {
        canvas.requestPointerLock()
    });

    canvas.addEventListener("pointermove", e => {
        if (document.pointerLockElement !== canvas)
            return;
        lastMousePos = mousePos;
        mousePos = {x: mousePos.x + e.movementX, y: mousePos.y + e.movementY};
        e.preventDefault();
    });
}

export function update() {
    lastPressedKeys = pressedKeys;
    pressedKeys = new Set(pressedKeys);
    lastMousePos = mousePos;
    mousePos = {x: mousePos.x, y: mousePos.y};
}

export function isKeyDown(key) {
    return pressedKeys.has(key.toLowerCase());
}

export function isKeyUp(key) {
    return !isKeyDown(key.toLowerCase());
}

export function isKeyPressed(key) {
    return isKeyDown(key.toLowerCase()) && !lastPressedKeys.has(key.toLowerCase());
}

export function getMouseMovement() {
    const x = mousePos.x - lastMousePos.x;
    const y = mousePos.y - lastMousePos.y;
    return {x: x, y: y};
}
