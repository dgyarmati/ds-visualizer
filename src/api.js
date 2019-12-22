/**
 * A collection of functions which provide the API for the user to do various operations (traversal, drawing on
 * canvas, etc.) on the data structure written by her.
 *
 */


/**
 * A collection of functions which draw a tree structure on the canvas. To be called by the user code.
 *
 * @param  tree                       - tree structure provided by the user
 */
function draw(tree) {
    TREE = tree;
    let matrix = buildMatrix(tree);
    createNodeCoordinates(matrix);
    changeCoordinatesForDefaultTree(matrix);
    drawTree();
    connectNodes(tree);
}

/**
 * Traverses provided tree in a BF manner, collecting nodes of each level into a 2D matrix.
 *
 * @param  tree                       - tree structure provided by the user
 */
function buildMatrix(tree) {
    const LEVEL_DELIMITER = '.';

    let nodes = [tree.root, LEVEL_DELIMITER];
    let matrix = [[tree.root], []];

    while (nodes.length > 1) {
        let node = nodes.shift();

        if (LEVEL_DELIMITER === node) {
            matrix.push([]);
            nodes.push(LEVEL_DELIMITER);
        } else {
            const children = node.children;
            if (children.length) matrix[matrix.length - 1].push(...children);
            nodes.push(...children);
        }
    }

    if (!matrix[matrix.length - 1].length) matrix.pop();    // remove empty subarray, if any

    return matrix;
}

/**
 * Traverses provided matrix, calculating node coordinates and storing them in a map.
 * If we are to draw the tree after the function runs, the result would look like a
 * stairway tapering to the left. Example:
 *
 * *
 * **
 * ***
 * ****
 *
 * @param  matrix                      - matrix of nodes
 */
function createNodeCoordinates(matrix) {
    let y = Y;
    let right = CHANGE_X;
    let down = CHANGE_Y;

    for (let i = 0; i < matrix.length; i++) {
        let x = X;
        if (i > 0) y += down;

        const nodes = matrix[i];

        for (let j = 0; j < nodes.length; j++) {
            const node = nodes[j];

            NODE_COORDINATES.set(node, {x, y});
            x += right;
        }
    }
}

/**
 * Traverses provided matrix, calculating node coordinates and storing them in a map.
 * If we are to draw the tree after the function runs, the result would look like a
 * more or less balanced tree structure, with the parents sitting above their children
 * in mid-distance between them. Example:
 *
 *      *
 *     * *
 *
 * @param  matrix                      - matrix of nodes
 */
function changeCoordinatesForDefaultTree(matrix) {
    for (let i = matrix.length - 2; i >= 0; i--) {    // start traversal from second row from the bottom of the matrix
        const row = matrix[i];
        for (let j = 0; j < row.length; j++) {
            const current = row[j];

            if (current.children.length) {
                if (current.children.length === 1) {    // if node has one child, move node directly above it
                    NODE_COORDINATES.set(current, {
                        x: NODE_COORDINATES.get(current.children[0]).x,
                        y: NODE_COORDINATES.get(current).y
                    });
                } else {
                    if (!current.children.length % 2) {    // if node has even number of children, calculate midpoint coordinate above them, and move node there
                        const lastChildX = NODE_COORDINATES.get(current.children[current.children.length - 1]).x;
                        const firstChildX = NODE_COORDINATES.get(current.children[0]).x;

                        const mid = Math.floor((lastChildX + firstChildX) / 2);

                        NODE_COORDINATES.set(current, {
                            x: mid,
                            y: NODE_COORDINATES.get(current).y
                        });
                    } else {    // if node has odd number of children, calculate index of middle child, and move node there
                        const mid = Math.floor(current.children.length / 2);

                        NODE_COORDINATES.set(current, {
                            x: NODE_COORDINATES.get(current.children[mid]).x,
                            y: NODE_COORDINATES.get(current).y
                        });
                    }
                }
            }

            if (j - 1 >= 0) {
                const previous = row[j - 1];

                if (NODE_COORDINATES.get(previous).x >= NODE_COORDINATES.get(current).x) { // move node after previous node's last child to avoid collision
                    if (previous.children.length) {
                        NODE_COORDINATES.set(current, {
                            x: NODE_COORDINATES.get(previous.children[previous.children.length - 1]).x + 50,
                            y: NODE_COORDINATES.get(current).y
                        });
                    } else {
                        NODE_COORDINATES.set(current, {    // move node after previous node to avoid collision
                            x: NODE_COORDINATES.get(previous).x + 50,
                            y: NODE_COORDINATES.get(current).y
                        });
                    }
                }

            }
        }
    }
}

function drawTree() {
    CONTEXT.strokeStyle = DEFAULT_NODE_COLOR;
    CONTEXT.lineWidth = NODE_STROKE_WIDTH;
    CONTEXT.font = NODE_FONT;
    CONTEXT.textBaseline = 'middle';
    CONTEXT.textAlign = 'center';
    CONTEXT.fillStyle = CURRENT_FONT_COLOR;

    NODE_COORDINATES.forEach((coords, node) => {
        drawCircle(coords.x, coords.y, node.data);
    });
}

/**
 * Paints a circle containing the node value representing a node on the canvas.
 *
 * @param  {int} x                    - x coordinate of the circle
 * @param  {int} y                    - y coordinate of the circle
 * @param  {any} data                 - data to be displayed in the node
 */
function drawCircle(x, y, data) {
    CONTEXT.beginPath();
    CONTEXT.arc(x, y, NODE_RADIUS, 0, 2 * Math.PI);
    CONTEXT.stroke();
    CONTEXT.fillText(data, x, y);
}

/**
 * Traverses given tree in a BS manner, and connects the nodes by drawing lines between them on the canvas.
 *
 * @param  tree                       - tree structure provided by the user
 */
function connectNodes(tree) {
    let nodes = [tree.root];

    CONTEXT.strokeStyle = EDGE_COLOR;
    CONTEXT.lineWidth = EDGE_STROKE_WIDTH;

    while (nodes.length) {
        let node = nodes.shift();
        const origin = NODE_COORDINATES.get(node);

        node.children.forEach((node) => {
            let target = NODE_COORDINATES.get(node);

            let originVector = findIntersect(new Vector(target.x, target.y), new Vector(origin.x, origin.y), NODE_RADIUS);
            let targetVector = findIntersect(new Vector(origin.x, origin.y), new Vector(target.x, target.y), NODE_RADIUS);

            drawLine(originVector, targetVector)
        });

        nodes.push(...node.children);
    }
}

/**
 * Draws a line on the canvas between two points.
 *
 * @param  {Point} origin            - center of the circle and start of the line
 * @param  {Point} target            - radius of the circle
 */
function drawLine(origin, target) {
    CONTEXT.beginPath();
    CONTEXT.moveTo(origin.x, origin.y);
    CONTEXT.lineTo(target.x, target.y);
    CONTEXT.stroke();
}

/**
 * Finds the intersection between a circles border
 * and a line from the origin to the target.
 *
 * @param  {Vector} origin            - center of the circle and start of the line
 * @param  {Vector} target            - end of the line
 * @param  {number} radius            - radius of the circle
 * @return {Vector}                   - point of the intersection
 */
function findIntersect(origin, target, radius) {
    let vector = target.subtract(origin);
    vector = vector.normalize();
    return origin.add(vector.multiplyScalar(radius));
}

/**
 * Paints a node on the canvas. To be called by the user code to display the current node.
 */
// function drawNode() {
//     drawCircle(x, y);
//     y += changeY;
// }
