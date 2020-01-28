function makeElementDraggable(headerID, contentID) {
    document.getElementById(headerID).addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);

    function mouseUp() {
        window.removeEventListener('mousemove', dragWindow, true);
    }

    function mouseDown(e) {
        window.addEventListener('mousemove', dragWindow, true);
    }

    function dragWindow(e) {
        let element = document.getElementById(contentID);
        element.style.position = 'absolute';
        element.style.left = e.clientX + 'px';
        element.style.top = e.clientY + 'px';
    }
}

function positionConsole() {
    const editorWrapperHeight = document.getElementById('editor-wrapper').offsetHeight;
    const menuBarHeight = document.getElementById('menu-bar').offsetHeight;
    let consoleContainer = document.getElementById('console-container');
    consoleContainer.style.top = editorWrapperHeight + menuBarHeight + 25 + 'px';
}

positionConsole();
makeElementDraggable('editor-header', 'ed-dbg');
makeElementDraggable('console-header', 'console-container');

/**
 * Function to make ace editor resizable by dragging.
 */
function makeAceEditorResizable() {
    window.draggingAceEditor = {};

    const editorId = EDITOR.container.id;
    const dragBarId = editorId + '-drag-bar';
    const wrapperElementId = editorId + '-wrapper';
    const menuBarId = 'controls';

    const editorElement = document.getElementById(editorId);
    const wrapperElement = document.getElementById(wrapperElementId);
    const dragBarElement = document.getElementById(dragBarId);
    const controlsBar = document.getElementById(menuBarId);

    const editorBounds = editorElement.getBoundingClientRect();

    const offset = 0;
    window.draggingAceEditor[editorId] = false;

    let mousedownAction = function (event) {

        event.preventDefault();

        window.draggingAceEditor[editorId] = true;
        editorElement.style.opacity = '0';

        controlsBar.style.display = 'none';

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

        controlsBar.style.display = 'none';

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

            controlsBar.style.display = 'block';

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

    // const editorId = EDITOR.container.id;
    // const wrapperElementId = editorId + '-wrapper';
    // document.getElementById(wrapperElementId).style.width = (getLengthOfLongestLine(DEFAULT_CODE) + 4) + 'ch';

    makeAceEditorResizable();
}

// reading user input and attempting to parse it as JS code, creating a tree
function executeInput() {
    try {
        nodePaintInterval = 500;
        visitedNodes.length = 0;
        NODE_COORDINATES.clear();
        clearCanvas();
        const code = EDITOR.getValue();
        const func = new Function(code);
        func();
    } catch (e) {
        handleCommand(e);
    }
}

function clearCanvas() {
    CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);
}

function init() {
    setupCodeEditor();
    setHelpAnimationIconTimeout();
    EDITOR.setValue(DEFAULT_CODE, 1);
    executeInput();
}

function toggle(id, hiddenClass, visibleClass) {
    const element = document.getElementById(id);

    if (element.classList.contains(hiddenClass)) {
        element.classList.remove(hiddenClass);
        element.classList.add(visibleClass);
    } else {
        element.classList.remove(visibleClass);
        element.classList.add(hiddenClass);
    }
}

function toggleConsole() {
    const console = document.querySelector('.simple-console');

    if (console.style.display === "none") {
        console.style.display = "block";
    } else {
        console.style.display = "none";
    }
}

function toggleHelpModal() {
    removeHelpIconAnimation();

    const modal = document.querySelector('.help-modal');
    modal.classList.toggle("show-modal");

    let console = document.getElementById('console-container');
    console.style.display = 'none';

    function windowOnClick(event) {
        if (event.target === modal) {
            modal.classList.toggle("show-modal");
            toggle('help-icon', 'hidden-help', 'visible-help');
            console.style.display = 'block';
            window.removeEventListener("click", windowOnClick);
        }
    }

    window.addEventListener("click", windowOnClick);
}

function switchTheme() {
    if (EDITOR_LIGHT_THEME === EDITOR.getTheme()) {
        EDITOR.setTheme(EDITOR_DARK_THEME);
        editorCurrentTheme = EDITOR_DARK_THEME;
        setDarkThemeDefaults();
        drawTree();
    } else {
        EDITOR.setTheme(EDITOR_LIGHT_THEME);
        editorCurrentTheme = EDITOR_LIGHT_THEME;
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
        themeButtonWidth: '1.8vw',
        consoleBackground: '#262A35',
        consoleColor: '#9EA1AA',
        scrollbarTrackBackground: '#282A36',
        scrollbarBackground: '#888',
        scrollbarBackgroundHover: '#555',
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
        themeButtonWidth: '1.9vw',
        consoleBackground: '#FCF7E3',
        consoleColor: '#000000',
        scrollbarTrackBackground: '#FCF7E3',
        scrollbarBackground: '#DCDCDC',
        scrollbarBackgroundHover: '#D3D3D3',
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
    document.querySelector('.simple-console').style.backgroundColor = themeDefaults.consoleBackground;
    document.querySelector('.simple-console').style.color = themeDefaults.consoleColor;
    document.getElementById('editor-wrapper').style.setProperty('--scrollbar-track-background', themeDefaults.scrollbarTrackBackground);
    document.getElementById('editor-wrapper').style.setProperty('--scrollbar-background', themeDefaults.scrollbarBackground);
    document.getElementById('editor-wrapper').style.setProperty('--scrollbar-background-hover', themeDefaults.scrollbarBackgroundHover);
}

function setHelpAnimationIconTimeout() {
    setTimeout(removeHelpIconAnimation, 10000);
}

function removeHelpIconAnimation() {
    const helpIcon = document.getElementById('help-icon');
    if (helpIcon.classList.contains('help-animation')) {
        helpIcon.classList.remove('help-animation');
    }
}

document.body.style.background = '#F7F7F7';

const console = new SimpleConsole({
    handleCommand: handleCommand,
    storageID: "simple-console",
});

document.getElementById('console-container').appendChild(console.element);

function handleCommand(command) {
    let err;
    let result;
    try {
        result = eval(command);
    } catch (error) {
        err = error;
    }
    if (err) {
        console.error(err);
    } else {
        console.error(result).classList.add("result");
    }
}

function onReady(callback) {
    let intervalId = window.setInterval(function () {
        if (document.readyState === "complete") {
            window.clearInterval(intervalId);
            callback.call(this);
        }
    }, 1000);
}

function setVisible(selector, visible) {
    document.querySelector(selector).style.display = visible ? 'block' : 'none';
}

onReady(function () {
    setVisible('.container', true);
    setVisible('#loading-spinner', false);
});

init();

