// setup ACE editor

/**
 * Function to make ace editor resizable by dragging.
 */
function makeAceEditorResizable() {
    window.draggingAceEditor = {};

    const editorId = EDITOR.container.id;
    const dragBarId = editorId + '-drag-bar';
    const wrapperElementId = editorId + '-wrapper';
    const menuBarId = 'menu-bar';

    const editorElement = document.getElementById(editorId);
    const wrapperElement = document.getElementById(wrapperElementId);
    const dragBarElement = document.getElementById(dragBarId);
    const editorButton = document.getElementById(menuBarId);

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

        dragBarElement.style.opacity = '0.15';
    };

    dragBarElement.addEventListener('mousedown', mousedownAction);

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

            dragBarElement.style.opacity = '1';

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
    EDITOR.setTheme(EDITOR_DARK_THEME);
    setDarkThemeDefaults();
    EDITOR.session.setMode(EDITOR_MODE);
    EDITOR.resize();

    EDITOR.setOptions({
        fontSize: '10pt',
        selectionStyle: 'text',
        showPrintMargin: false,
    });

    const editorId = EDITOR.container.id;
    const wrapperElementId = editorId + '-wrapper';
    document.getElementById(wrapperElementId).style.width = (getLengthOfLongestLine(DEFAULT_CODE) + 4) + 'ch';

    makeAceEditorResizable();
}

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

function toggleMenu(id, hiddenClass, visibleClass) {
    if (document.getElementById(id).classList.contains(hiddenClass)) {
        document.getElementById(id).classList.remove(hiddenClass);
        document.getElementById(id).classList.add(visibleClass);
    } else {
        document.getElementById(id).classList.remove(visibleClass);
        document.getElementById(id).classList.add(hiddenClass);
    }
}

function switchTheme() {
    if (EDITOR_LIGHT_THEME === EDITOR.getTheme()) {
        EDITOR.setTheme(EDITOR_DARK_THEME);
        setDarkThemeDefaults();
        drawTree();
    } else {
        EDITOR.setTheme(EDITOR_LIGHT_THEME);
        setLightThemeDefaults();
        drawTree();
    }
}

function setDarkThemeDefaults() {
    setThemeDefaults({
        bodyBackground: '#1F232C',
        fontColor: '#FFFFFF',
        editorBackground: '#282A36',
        dragBarBackground: '#282A36',
        themeButtonBackground: 'linear-gradient(to right, #282A36 0%, #282A36 50%, #FCF7E3 50%, #FCF7E3 100%)',
        themeButtonHeight: '1.8vw',
        themeButtonWidth: '1.8vw'
    });
}

function setLightThemeDefaults() {
    setThemeDefaults({
        bodyBackground: '#F7F7F7',
        fontColor: '#000000',
        editorBackground: '#FCF7E3',
        dragBarBackground: '#FCF7E3',
        themeButtonBackground: 'linear-gradient(to right, #FCF7E3 0%, #FCF7E3 50%, #282A36 50%, #282A36 100%)',
        themeButtonHeight: '1.9vw',
        themeButtonWidth: '1.9vw'
    });
}

function setThemeDefaults(themeDefaults) {
    document.body.style.background = themeDefaults.bodyBackground;
    CURRENT_FONT_COLOR = themeDefaults.fontColor;
    document.getElementById('editor-wrapper').style.backgroundColor = themeDefaults.editorBackground;
    document.getElementById('editor-drag-bar').style.backgroundColor = themeDefaults.dragBarBackground;
    document.getElementById('theme-button').style.background = themeDefaults.themeButtonBackground;
    document.getElementById('theme-button').style.height = themeDefaults.themeButtonHeight;
    document.getElementById('theme-button').style.width = themeDefaults.themeButtonWidth;
}

document.body.style.background = '#F7F7F7';

setupCodeEditor();

init();
