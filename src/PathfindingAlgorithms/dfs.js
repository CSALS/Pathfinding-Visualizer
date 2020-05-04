export function dfs(grid, startNode, endNode, diagonal) {
    const visitedNodesInOrder = [];
    dfsRecursive(grid, startNode, endNode, visitedNodesInOrder, diagonal);
    return visitedNodesInOrder;
}

function dfsRecursive(grid, node, endNode, visitedNodesInOrder, diagonal) {
    node.isVisited = true;
    visitedNodesInOrder.push(node);

    if (node === endNode) return true;

    const side_nodes_x = [0, 0, 1, -1];
    const side_nodes_y = [1, -1, 0, 0];

    for (let i = 0; i < 4; ++i) {
        const { col, row } = node;
        const new_x = row + side_nodes_x[i];
        const new_y = col + side_nodes_y[i];
        if (!(new_x >= 0 && new_y >= 0 && new_x < grid.length && new_y < grid[0].length)) continue;
        const neighbor = grid[new_x][new_y];
        if (neighbor.isVisited === true || neighbor.isWall === true) continue;
        neighbor.previousNode = node;
        if (dfsRecursive(grid, neighbor, endNode, visitedNodesInOrder, diagonal)) return true;
    }
    if (diagonal === true) {
        const diagonal_nodes_x = [1, 1, -1, -1];
        const diagonal_nodes_y = [1, -1, 1, -1];

        for (let i = 0; i < 4; ++i) {
            const { col, row } = node;
            const new_x = row + diagonal_nodes_x[i];
            const new_y = col + diagonal_nodes_y[i];
            if (!(new_x >= 0 && new_y >= 0 && new_x < grid.length && new_y < grid[0].length)) continue;
            const neighbor = grid[new_x][new_y];
            if (neighbor.isVisited === true || neighbor.isWall === true) continue;
            neighbor.previousNode = node;
            if (dfsRecursive(grid, neighbor, endNode, visitedNodesInOrder, diagonal)) return true;
        }
    }

    return false;

}