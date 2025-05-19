let rows = 30;
let columns = 30;

let scl;

let nodes = [];

let startingNode;
let targetNode;

let open = [];
let closed = [];

function setup() {
  createCanvas(700, 700);

  createArray(rows, columns);
  createNodes();

  let randRow = Math.floor(Math.random()*rows) + 1;
  let randCol = Math.floor(Math.random()*columns) + 1;
  startingNode = nodes[randRow][randCol];

  randRow = Math.floor(Math.random()*rows) + 1;
  randCol = Math.floor(Math.random()*columns) + 1;
  targetNode = nodes[randRow][randCol];
  targetNode.state = "path";

  open.push(startingNode);

  scl = width / rows;
}

function draw() {
  background(255);
  displayGrid();
  findPath();
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
      if (nodes[i][j].state == "open") {
        fill(116,211,8);
      } else if (nodes[i][j].state == "closed") {
        fill(173,3,12);
      } else if (nodes[i][j].state == "path") {
        fill(56,162,192);
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
  let currentNode = open[0];

  for (let i = 0; i < open.length; i++) {
    if (open[i].f < currentNode.f) {
      currentNode = open[i];
    }
  }
  
  closed.push(currentNode);
  
  if (currentNode != targetNode) {
     currentNode.state = "closed";

     let nghs = [
      [currentNode.x - 1, currentNode.y - 1],
      [currentNode.x, currentNode.y - 1],
      [currentNode.x + 1, currentNode.y - 1],
      [currentNode.x - 1, currentNode.y],
      [currentNode.x + 1, currentNode.y],
      [currentNode.x - 1, currentNode.y + 1],
      [currentNode.x, currentNode.y + 1],
      [currentNode.x + 1, currentNode.y + 1]
    ];

    for (let i = 0; i < 8; i++) {
      let neighbor = nodes[nghs[i][0]][nghs[i][1]];

      if (neighbor != targetNode) {
        if (neighbor.walkable == 1 || closed.includes(neighbor) == true) {
            continue;
        } else {
            let newG = 
            currentNode.g + 
            ((currentNode.x - neighbor.x) * (currentNode.x - neighbor.x) + 
            (currentNode.y - neighbor.y) * (currentNode.y - neighbor.y));

            if (newG < neighbor.g || open.includes(neighbor) == false) {
            neighbor.g = 
            currentNode.g + 
            ((currentNode.x - neighbor.x) * (currentNode.x - neighbor.x) + 
            (currentNode.y - neighbor.y) * (currentNode.y - neighbor.y));

            neighbor.h = 
            (targetNode.x - neighbor.x) * (targetNode.x - neighbor.x) + 
            (targetNode.y - neighbor.y) * (targetNode.y - neighbor.y);

            neighbor.f = neighbor.g + neighbor.h;

            neighbor.parent = currentNode;
            
            if (open.includes(neighbor) == false) {
                open.push(neighbor);
                neighbor.state = "open";
            }
          }
        }
      } else {
            currentNode = neighbor;
            let newParent = targetNode.parent;
            targetNode.state = "path";
        while (true) {
            if (newParent == startingNode) {
                startingNode.state = "path";
                break;
            }
            newParent.state = "path";
            newParent = newParent.parent;
        }
      }
    }
  } 
}