export function dfsMaze(grid, start_x, start_y) {
    const start_node = grid[start_x][start_y];
    start_node.isVisited = true;
    start_node.isWall = true;
    const visitedNodesInOrder = [start_node];
    console.log(start_x, start_y);
    dfsMazeUtil(grid, start_x, start_y, visitedNodesInOrder);
    return visitedNodesInOrder;
}


function dfsMazeUtil(grid, x, y, visitedNodesInOrder) {
    const node = grid[x][y];
    // Shuffling indexes
    const array = [0, 1, 2, 3];
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    console.log(array);
    const side_nodes_x1 = [0, 0, 1, -1];
    const side_nodes_y1 = [1, -1, 0, 0];
    const side_nodes_x2 = [0, 0, 2, -2];
    const side_nodes_y2 = [2, -2, 0, 0];
    const stack_child = [];
    for (let k = 0; k <= 3; ++k) {
        const i = array[k];
        const { col, row } = node;
        const new_x2 = row + side_nodes_x2[i];
        const new_y2 = col + side_nodes_y2[i];
        if (!(new_x2 >= 0 && new_y2 >= 0 && new_x2 < grid.length && new_y2 < grid[0].length)) continue;
        const neighbor = grid[new_x2][new_y2];
        if (neighbor.isVisited === true || neighbor.isWall === true) continue;
        const new_x1 = row + side_nodes_x1[i];
        const new_y1 = col + side_nodes_y1[i];
        if ((new_x1 >= 0 && new_y1 >= 0 && new_x1 < grid.length && new_y1 < grid[0].length)) {
            grid[new_x1][new_y1].isWall = true;
            grid[new_x1][new_y1].isVisited = true;
            visitedNodesInOrder.push(grid[new_x1][new_y1]);
        }
        stack_child.push({ 'x': new_x2, 'y': new_y2 });
        const childNode = grid[new_x2][new_y2];
        childNode.isVisited = true;
        childNode.isWall = true;
        visitedNodesInOrder.push(grid[new_x2][new_y2]);
        // dfsMazeUtil(grid, new_x2, new_y2, visitedNodesInOrder);
    }
    // console.log(stack_child)
    while (stack_child.length != 0) {
        const node = stack_child.pop();
        dfsMazeUtil(grid, node['x'], node['y'], visitedNodesInOrder);
    }
}