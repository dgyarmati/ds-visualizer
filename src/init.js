function resizeCanvas() {
    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;
}

/**
 * Tries to parse and execute code provided by the user.
 */
function executeCode() {
    NODE_COORDINATES.clear();
    clearCanvas();
    const code = document.getElementById('code').value;
    const func = new Function(code);
    func();
}

function clearCanvas() {
    const canvas = document.getElementById("nodes");
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function init() {
    document.getElementById('code').innerHTML = DEFAULT_TEXT;
    resizeCanvas();
    executeCode();
}


init();
