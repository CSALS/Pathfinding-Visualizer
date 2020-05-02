export function bfs(grid, startNode, endNode, diagonal) {
    const visitedNodesInOrder = [];
    const queue = [];
    queue.push(startNode);
    startNode.isVisited = true;
    visitedNodesInOrder.push(startNode);
    while (queue.length != 0) {
        const node = queue.shift();
        if (node === endNode) return visitedNodesInOrder;
        const side_nodes_x = [0, 0, 1, -1];
        const side_nodes_y = [1, -1, 0, 0];

        for (let i = 0; i < 4; ++i) {
            const { col, row } = node;
            const new_x = row + side_nodes_x[i];
            const new_y = col + side_nodes_y[i];
            if (!(new_x >= 0 && new_y >= 0 && new_x < grid.length && new_y < grid[0].length)) continue;
            const neighbor = grid[new_x][new_y];
            if (neighbor.isVisited == true || neighbor.isWall == true) continue;
            neighbor.isVisited = true;
            queue.push(neighbor);
            visitedNodesInOrder.push(neighbor);
            neighbor.previousNode = node;
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
                if (neighbor.isVisited == true || neighbor.isWall == true) continue;
                neighbor.isVisited = true;
                queue.push(neighbor);
                visitedNodesInOrder.push(neighbor);
                neighbor.previousNode = node;
            }
        }
    }
    return visitedNodesInOrder;
}