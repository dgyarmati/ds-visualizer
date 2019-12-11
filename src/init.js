// setup ACE editor

/**
 * Function to make ace editor resizable by dragging.
 */

function makeAceEditorResizable() {
    window.draggingAceEditor = {};

    const editorId = EDITOR.container.id;
    const dragbarId = editorId + 'Dragbar';
    const wrapperElementId = editorId + 'Wrapper';

    const offset = 0;

    window.draggingAceEditor[editorId] = false;

    let mousedownAction = function (event) {
        event.preventDefault();

        window.draggingAceEditor[editorId] = true;

        document.getElementById(editorId).style.opacity = '0';

        document.addEventListener("mousemove", mousemoveAction);
    };

    let mousemoveAction = function (event) {
        let editor = document.getElementById(editorId);
        let editorBounds = editor.getBoundingClientRect();

        let resolution = {
            top: editorBounds.top + document.body.scrollTop
        };

        let topOffset = resolution.top - offset;

        let actualY = event.pageY - offset;
        let actualX = event.pageX + offset;

        let editorHeight = actualY - topOffset;
        let editorWidth = actualX + topOffset;

        document.getElementById(wrapperElementId).style.height = editorHeight + "px";
        document.getElementById(wrapperElementId).style.width = editorWidth + "px";

        document.getElementById(dragbarId).style.opacity = '0.15';
    };

    document.getElementById(dragbarId).addEventListener("mousedown", mousedownAction);

    let mouseupAction = function (event) {
        if (window.draggingAceEditor[editorId]) {
            let editor = document.getElementById(editorId);

            let editorBounds = editor.getBoundingClientRect();

            let resolution = {
                top: editorBounds.top + document.body.scrollTop
            };

            let actualY = event.pageY - offset;
            let actualX = event.pageX + offset;

            let topOffset = resolution.top - offset;
            let sideOffset = resolution.top + offset;

            let editorHeight = actualY - topOffset;
            let editorWidth = actualX + sideOffset;

            document.removeEventListener("mousemove", mousemoveAction);

            document.getElementById(dragbarId).style.opacity = '1';

            editor.style.height = editorHeight + "px";
            editor.style.width = editorWidth + "px";
            editor.style.opacity = '1';

            editor.resize();

            window.draggingAceEditor[editorId] = false;
        }
    };

    document.addEventListener("mouseup", mouseupAction);
}

function setupCodeEditor() {
    EDITOR.setTheme("ace/theme/solarized_light");
    EDITOR.session.setMode("ace/mode/javascript");
    EDITOR.resize();

    EDITOR.setOptions({
        fontSize: "10pt",
        selectionStyle: "text",
        showPrintMargin: false,
    });

    makeAceEditorResizable();
}

setupCodeEditor();

// reading user input and attempting to parse it as JS code, creating a tree
function executeInput() {
    NODE_COORDINATES.clear();
    clearCanvas();
    const code = EDITOR.getValue();
    const func = new Function(code);
    func();
}

function clearCanvas() {
    CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);
}

function init() {
    EDITOR.setValue(DEFAULT_TEXT);
    executeInput();
}

init();
