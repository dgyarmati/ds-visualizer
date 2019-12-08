/**
 * Attempts to parse and execute JS code provided by the user.
 */

CANVAS.addEventListener("mousedown", startPan);

function pan() {
    CONTEXT.setTransform(1, 0, 0, 1, 0, 0);
    CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);
    CONTEXT.translate(panAttr.offset.x, panAttr.offset.y);
    draw(TREE);
}

function startPan(e) {
    window.addEventListener("mousemove", trackMouse);
    window.addEventListener("mousemove", pan);
    window.addEventListener("mouseup", endPan);
    panAttr.start.x = e.clientX;
    panAttr.start.y = e.clientY;
}

function endPan(e) {
    window.removeEventListener("mousemove", trackMouse);
    window.removeEventListener("mousemove", pan);
    window.removeEventListener("mouseup", endPan);
    panAttr.start.x = null;
    panAttr.start.y = null;
    globalPanAttr.offset.x = panAttr.offset.x;
    globalPanAttr.offset.y = panAttr.offset.y;
}

function trackMouse(e) {
    let offsetX	 = e.clientX - panAttr.start.x;
    let offsetY	 = e.clientY - panAttr.start.y;
    panAttr.offset.x = globalPanAttr.offset.x + offsetX;
    panAttr.offset.y = globalPanAttr.offset.y + offsetY;
}

function executeInput() {
    NODE_COORDINATES.clear();
    clearCanvas();
    const code = document.getElementById('code').value;
    const func = new Function(code);
    func();
}

function clearCanvas() {
    CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);
}

function init() {
    document.getElementById('code').innerHTML = DEFAULT_TEXT;
    executeInput();
}

init();
