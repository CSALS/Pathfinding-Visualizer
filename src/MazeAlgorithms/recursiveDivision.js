export function recursiveDivision(grid) {
    const visitedNodesInOrder = [];
    const HEIGHT = grid.length;
    const WIDTH = grid[0].length;
    for (let x = 0; x < HEIGHT; ++x) {
        const node1 = grid[x][0], node2 = grid[x][WIDTH - 1];
        node1.isWall = true;
        node2.isWall = true;
        visitedNodesInOrder.push(node1);
        visitedNodesInOrder.push(node2);
    }
    for (let y = 0; y < WIDTH; ++y) {
        const node1 = grid[0][y], node2 = grid[HEIGHT - 1][y];
        node1.isWall = true;
        node2.isWall = true;
        visitedNodesInOrder.push(node1);
        visitedNodesInOrder.push(node2);
    }
    recursiveDivisionUtil(grid, visitedNodesInOrder, 1, HEIGHT - 2, 1, WIDTH - 2);
    return visitedNodesInOrder;
}

/*
params = (x, y) are the top-left coordinates of the grid section.
        (HEIGHT, WIDTH) are the size

function = basically it chooses draws either horizontal or vertical wall line and skips one node to leave a passage
and calls the function on both sides of section.
if HEIGHT > WIDTH use horizontal
else if WIDTH > HEIGHT use vertical
else take random one
*/
function recursiveDivisionUtil(grid, visitedNodesInOrder, startX, endX, startY, endY) {
    const HEIGHT = endX - startX + 1;
    const WIDTH = endY - startY + 1;
    // Base Case
    if (HEIGHT <= 2 || WIDTH <= 2)
        return;
    // Corner Case
    if (startX < 0 || startY < 0 || endX >= grid.length || endY >= grid[0].length || startX > endX || startY > endY)
        return;
    // Choose orientation
    const orientation = getOrientation(HEIGHT, WIDTH);
    // Generate the wall and divide the grid and call recursively
    if (orientation === "Horizontal") {
        // console.log("Horizontal ", startX, startY, endX, endY);
        const wallX = getRandomInteger(startX + 1, endX - 1);
        const skipY = getRandomInteger(startY, endY);
        for (let wallY = startY; wallY <= endY; ++wallY) {
            if (wallY === skipY) continue;
            const node = grid[wallX][wallY];
            node.isWall = true;
            visitedNodesInOrder.push(node);
        }
        recursiveDivisionUtil(grid, visitedNodesInOrder, startX, wallX - 1, startY, endY); //Above
        recursiveDivisionUtil(grid, visitedNodesInOrder, wallX + 1, endX, startY, endY); //Below
    }
    else if (orientation === "Vertical") {
        // console.log("Vertical ", startX, startY, endX, endY);
        const wallY = getRandomInteger(startY + 1, endY - 1);
        const skipX = getRandomInteger(startX, endX);
        for (let wallX = startX; wallX <= endX; ++wallX) {
            if (wallX === skipX) continue;
            const node = grid[wallX][wallY];
            node.isWall = true;
            visitedNodesInOrder.push(node);
        }
        recursiveDivisionUtil(grid, visitedNodesInOrder, startX, endX, startY, wallY - 1); //Left
        recursiveDivisionUtil(grid, visitedNodesInOrder, startX, endX, wallY + 1, endY); //Right
    }
}

const getOrientation = (HEIGHT, WIDTH) => {
    let orientation = null;
    if (HEIGHT > WIDTH) {
        orientation = "Horizontal";
    }
    else if (WIDTH > HEIGHT) {
        orientation = "Vertical";
    }
    else {
        const i = getRandomInteger(1, 2);
        if (i === 1) orientation = "Horizontal";
        else orientation = "Vertical";
    }
    return orientation;
}

const getRandomInteger = (min, max) => {
    max = max + 1;
    return Math.floor(Math.random() * (max - min)) + min;
}