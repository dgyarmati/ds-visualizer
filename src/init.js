// setup ACE editor

/**
 * Function to make ace editor resizable by dragging.
 */
function makeAceEditorResizable() {
    window.draggingAceEditor = {};

    const editorId = EDITOR.container.id;
    const dragbarId = editorId + 'Dragbar';
    const wrapperElementId = editorId + 'Wrapper';
    const editorButtonId = 'editorButton';

    const editorElement = document.getElementById(editorId);
    const wrapperElement = document.getElementById(wrapperElementId);
    const dragbarElement = document.getElementById(dragbarId);
    const editorButton = document.getElementById(editorButtonId);

    const editorBounds = editorElement.getBoundingClientRect();

    const offset = 0;
    window.draggingAceEditor[editorId] = false;

    let mousedownAction = function (event) {

        event.preventDefault();

        window.draggingAceEditor[editorId] = true;
        editorElement.style.opacity = '0';

        editorButton.style.display = 'none';

        document.addEventListener('mousemove', mousemoveAction);
    };

    let mousemoveAction = function (event) {

        const resolution = {
            top: editorBounds.top + document.body.scrollTop
        };

        const topOffset = resolution.top - offset;

        const actualY = event.pageY - offset;
        const actualX = event.pageX + offset;

        const editorHeight = actualY - topOffset;
        const editorWidth = actualX + topOffset;

        wrapperElement.style.height = editorHeight + 'px';
        wrapperElement.style.width = editorWidth + 'px';

        editorButton.style.display = 'none';

        dragbarElement.style.opacity = '0.15';
    };

    dragbarElement.addEventListener('mousedown', mousedownAction);

    let mouseupAction = function (event) {
        if (window.draggingAceEditor[editorId]) {

            const resolution = {
                top: editorBounds.top + document.body.scrollTop
            };

            const actualY = event.pageY - offset;
            const actualX = event.pageX + offset;

            const topOffset = resolution.top - offset;
            const sideOffset = resolution.top + offset;

            const editorHeight = actualY - topOffset;
            const editorWidth = actualX + sideOffset;

            if (editorHeight <= wrapperElement.style.height) editorElement.style.height = editorHeight + 'px';
            if (editorWidth <= wrapperElement.style.width) editorElement.style.width = editorWidth + 'px';
            editorElement.style.opacity = '1';

            editorButton.style.display = 'block';

            dragbarElement.style.opacity = '1';

            EDITOR.resize();

            window.draggingAceEditor[editorId] = false;

            document.removeEventListener('mousemove', mousemoveAction);
        }
    };

    document.addEventListener('mouseup', mouseupAction);
}

function getLengthOfLongestLine(text) {
    return text.split('\n')
        .reduce((a, b) => a.length > b.length ? a : b)
        .length;
}

function setupCodeEditor() {
    EDITOR.setTheme(EDITOR_LIGHT_THEME);
    EDITOR.session.setMode('ace/mode/javascript');
    EDITOR.resize();

    EDITOR.setOptions({
        fontSize: '10pt',
        selectionStyle: 'text',
        showPrintMargin: false,
    });

    const editorId = EDITOR.container.id;
    const wrapperElementId = editorId + 'Wrapper';
    document.getElementById(wrapperElementId).style.width = (getLengthOfLongestLine(DEFAULT_CODE) + 4) + 'ch';

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
    EDITOR.setValue(DEFAULT_CODE, 1);
    executeInput();
}

function changeTheme() {
    if (EDITOR_LIGHT_THEME === EDITOR.getTheme()) {
        EDITOR.setTheme(EDITOR_DARK_THEME);
        document.getElementById('themeButton').style.backgroundColor = '#FCF7E3';
    } else {
        EDITOR.setTheme(EDITOR_LIGHT_THEME);
        document.getElementById('themeButton').style.backgroundColor = '#3C4049';
    }
}

init();
