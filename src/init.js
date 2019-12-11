const editor = ace.edit("editor");
editor.setTheme("ace/theme/solarized_light");
editor.session.setMode("ace/mode/javascript");
editor.resize();
editor.setOptions({
    fontSize: "10pt",
    selectionStyle: "text",
    showPrintMargin: false,
});

/**
 * VanillaJS version to make ace editor vertically resizable.
 *
 * @param editor Ace Editor instance.
 */

window.draggingAceEditor = {};

function makeAceEditorResizable(editor) {
    let id_editor = editor.container.id;
    let id_dragbar = id_editor + '_dragbar';
    let id_wrapper = id_editor + '_wrapper';
    let wpoffset = 0;
    window.draggingAceEditor[id_editor] = false;

    let action_mousedown = function (e) {
        e.preventDefault();

        window.draggingAceEditor[id_editor] = true;

        // Set editor opacity to 0 to make transparent so our wrapper div shows
        document.getElementById(id_editor).style.opacity = '0';

        document.addEventListener("mousemove", action_document_mousemove);
    };

    let action_document_mousemove = function (e) {
        let _editor = document.getElementById(id_editor);
        let rect = _editor.getBoundingClientRect();

        let rsl = {
            top: rect.top + document.body.scrollTop
        };

        let top_offset = rsl.top - wpoffset;

        let actualY = e.pageY - wpoffset;
        let actualX = e.pageX + wpoffset;

        // editor height
        let eheight = actualY - top_offset;
        let ewidth = actualX + top_offset;

        // Set wrapper height
        document.getElementById(id_wrapper).style.height = eheight + "px";
        document.getElementById(id_wrapper).style.width = ewidth + "px";

        // Set dragbar opacity while dragging (set to 0 to not show)
        document.getElementById(id_dragbar).style.opacity = '0.15';
    };

    document.getElementById(id_dragbar).addEventListener("mousedown", action_mousedown);

    let action_mouseup = function (e) {
        if (window.draggingAceEditor[id_editor]) {
            let ctx_editor = document.getElementById(id_editor);

            let rect = ctx_editor.getBoundingClientRect();

            let rsl = {
                top: rect.top + document.body.scrollTop
            };

            let actualY = e.pageY - wpoffset;
            let actualX = e.pageX + wpoffset;
            let top_offset = rsl.top - wpoffset;
            let side_offset = rsl.top + wpoffset;
            let eheight = actualY - top_offset;
            let ewidth = actualX + side_offset;

            document.removeEventListener("mousemove", action_document_mousemove);

            // Set dragbar opacity back to 1
            document.getElementById(id_dragbar).style.opacity = '1';

            // Set height on actual editor element, and opacity back to 1
            ctx_editor.style.height = eheight + "px";
            ctx_editor.style.width = ewidth + "px";
            ctx_editor.style.opacity = '1';

            // Trigger ace editor resize()
            editor.resize();

            window.draggingAceEditor[id_editor] = false;
        }
    };

    document.addEventListener("mouseup", action_mouseup);
}

makeAceEditorResizable(editor);

// reading user input and attempting to parse it as JS code, creating a tree
function executeInput() {
    NODE_COORDINATES.clear();
    clearCanvas();
    const code = editor.getValue();
    const func = new Function(code);
    func();
}

function clearCanvas() {
    CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);
}

function init() {
    editor.setValue(DEFAULT_TEXT);
    executeInput();
}

init();
