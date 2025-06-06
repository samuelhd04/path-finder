let rows = 30;
let columns = 30;

let scl;

let nodes = [];

let currentNode;
let startingNode;
let targetNode;

let state = false;

let open = [];
let closed = [];
let path = [];

function newPop(element, array) {
    array.splice(array.indexOf(element));
}

function findNeighbors(node) {
    let neighbors = [
        [node.x - 1, node.y - 1],
        [node.x, node.y - 1],
        [node.x + 1, node.y - 1],
        [node.x - 1, node.y],
        [node.x + 1, node.y],
        [node.x - 1, node.y + 1],
        [node.x, node.y + 1],
        [node.x + 1, node.y + 1]
    ];

    return neighbors;
}

function setup() {
    createCanvas(700, 700);

    createArray(rows, columns);
    createNodes();

    let randRow = Math.floor(Math.random() * rows) + 1;
    let randCol = Math.floor(Math.random() * columns) + 1;
    targetNode = nodes[randRow][randCol];

    randRow = Math.floor(Math.random() * rows) + 1;
    randCol = Math.floor(Math.random() * columns) + 1;
    startingNode = nodes[randRow][randCol];
    startingNode.f =
        (targetNode.x - startingNode.x) * (targetNode.x - startingNode.x) +
        (targetNode.y - startingNode.y) * (targetNode.y - startingNode.y);
    currentNode = startingNode;

    open.push(startingNode);
    path.push(startingNode);
    path.push(targetNode);

    scl = width / rows;
}

function draw() {
    background(255);
    displayGrid();
    findPath();
    frameRate(5);
}

function createArray(rows, columns) {
    for (let i = 0; i <= rows + 1; i++) {
        let array = [];
        for (let j = 0; j <= columns + 1; j++) {
            if (i == 0 || j == 0 || i == rows + 1 || j == columns + 1) {
                array.push(1)
            } else {
                array.push(0)
            }
        }
        nodes.push(array);
    }
}

function createNodes() {
    for (let i = 0; i <= rows + 1; i++) {
        for (let j = 0; j <= columns + 1; j++) {
            if (nodes[i][j] != 1) {
                walkable = Math.random();
                if (walkable < 0.25) {
                    nodes[i][j] = new Node(i, j, 1);
                } else {
                    nodes[i][j] = new Node(i, j, 0);
                }
            } else {
                nodes[i][j] = new Node(i, j, nodes[i][j]);
            }
        }
    }
}

function displayGrid() {
    for (let i = 1; i <= rows; i++) {
        for (let j = 1; j <= columns; j++) {
            if (path.includes(nodes[i][j])) {
                fill(56, 162, 192);
            } else if (open.includes(nodes[i][j])) {
                fill(116, 211, 8);
            } else if (closed.includes(nodes[i][j])) {
                fill(173, 3, 12);
            } else if (nodes[i][j].walkable == 1) {
                fill(0);
            } else {
                fill(255);
            }
            rect((i - 1) * scl, (j - 1) * scl, scl, scl);
        }
    }
}

function findPath() {
    if (state == false) {
        let count = 0;

        for (let i = 0; i < open.length; i++) {
            if (open[i].f < currentNode.f) {
                currentNode = open[i];
            }
        }
        
        closed.push(currentNode);
        newPop(currentNode, open);

        let neighbors = findNeighbors(currentNode);

        for (let i = 0; i < 8; i++) {
            let neighbor = nodes[neighbors[i][0]][neighbors[i][1]];

            if (neighbor.walkable == 1 || closed.includes(neighbor) == true) {
                count = count + 1;
            } else {
                let newG =
                    currentNode.g +
                    ((currentNode.x - neighbor.x) * (currentNode.x - neighbor.x) +
                    (currentNode.y - neighbor.y) * (currentNode.y - neighbor.y));

                if (neighbor == targetNode) {
                    state = true;
                    neighbor.parent = currentNode;
                    break;
                } else if (open.includes(neighbor) == false) {
                    neighbor.g =
                        currentNode.g +
                        ((currentNode.x - neighbor.x) * (currentNode.x - neighbor.x) +
                        (currentNode.y - neighbor.y) * (currentNode.y - neighbor.y));

                    neighbor.h =
                        (targetNode.x - neighbor.x) * (targetNode.x - neighbor.x) +
                        (targetNode.y - neighbor.y) * (targetNode.y - neighbor.y);

                    neighbor.f = neighbor.g + neighbor.h;

                    neighbor.parent = currentNode;

                    open.push(neighbor);
                } else if (open.includes(neighbor) == true && newG < neighbor.g) {
                    neighbor.g =
                        currentNode.g +
                        ((currentNode.x - neighbor.x) * (currentNode.x - neighbor.x) +
                        (currentNode.y - neighbor.y) * (currentNode.y - neighbor.y));

                    neighbor.f = neighbor.g + neighbor.h;

                    neighbor.parent = currentNode;
                } else {
                    count = count + 1;
                }
            }
        } 

        console.log(count);

        if (count == 8) {
            currentNode = open[0];
        }
    } else {
        console.log("yes");
        let newParent = targetNode.parent;
        while (true) {
            if (newParent == startingNode) {
                break;
            }
            path.push(newParent);
            newParent = newParent.parent;
        }
    }
}