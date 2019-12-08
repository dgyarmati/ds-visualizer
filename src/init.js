// canvas panning setup - code is written by https://codereview.stackexchange.com/users/32789/akinuri (see https://jsfiddle.net/akinuri/0Lh671kp/1/ for the original)
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

// reading user input and attempting to parse it as JS code, creating a tree
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
