const NODE_COORDINATES = new Map();    // stores the nodes and their coordinates to be drawn at; example: [node: {x: 0, y: 2}]

const CANVAS = document.getElementById("nodes");
const CONTEXT = CANVAS.getContext('2d');

const EDITOR = ace.edit("editor");

CANVAS.width = window.innerWidth - 30;
CANVAS.height = window.innerHeight - 20;

const X = Math.floor(CANVAS.width / 1.5);
const Y = Math.floor(CANVAS.height / 3);
const CHANGE_X = 50;
const CHANGE_Y = 70;

const NODE_RADIUS = 22;

const NODE_STROKE_WIDTH = 2;
const DEFAULT_NODE_COLOR = '#5DBCD2';
const ACTIVE_NODE_COLOR = '#5DBCD2';
const NODE_FONT = 'bold 15px Courier New';

const EDGE_COLOR = '#BEBDB1';
const EDGE_STROKE_WIDTH = 2;

let TREE = null;

const DEFAULT_CODE =
    'class Node {\n' +
    '    constructor(data) {\n' +
    '        this.data = data;\n' +
    '        this.children = [];\n' +
    '    }\n' +
    '\n' +
    '    add(data) {\n' +
    '        this.children.push(new Node(data));\n' +
    '    }\n' +
    '\n' +
    '    remove(data) {\n' +
    '        this.children = this.children.filter((child) => child.data !== data);\n' +
    '    }\n' +
    '}\n' +
    '\n' +
    'class Tree {\n' +
    '    constructor() {\n' +
    '        this.root = null;\n' +
    '    }\n' +
    '\n' +
    '    traverseBF() {\n' +
    '        let nodes = [this.root];\n' +
    '\n' +
    '        while (nodes.length) {\n' +
    '            let node = nodes.shift();\n' +
    '            nodes.push(...node.children);\n' +
    '        }\n' +
    '    }\n' +
    '}\n' +
    '\n' +
    'let node = new Node(1);\n' +
    'node.add(2);\n' +
    'node.add(3);\n' +
    'node.add(4);\n' +
    'node.children[0].add(5);\n' +
    'node.children[0].add(6);\n' +
    'let tree = new Tree();\n' +
    'tree.root = node;\n' +
    'draw(tree);';
