// Pseudo Code - https://www.geeksforgeeks.org/a-search-algorithm/

export function astar(grid, startNode, finishNode, diagonal) {
    const visitedNodesInOrder = [];

    const allNodes = getAllNodes(grid);

    for (const node of allNodes) {
        node.f = Infinity;
        node.g = Infinity;
        node.h = heuristic(node, finishNode, "manhattan");
        node.side_neighbor = [];
        node.diagonal_neighbor = [];
    }
    getSideNeighbors(allNodes, grid);
    if (diagonal === true) getDiagonalNeighbors(allNodes, grid);
    const open_list = [startNode];
    startNode.g = 0;
    startNode.f = startNode.h;


    while (open_list.length != 0) {
        // Find the node with least 'f' on the open list
        const current = nodeWithLeast_f(open_list);
        if (current === null) {
            console.log("Error: A* = Unable to retrieve node with least f value")
            return visitedNodesInOrder;
        }
        visitedNodesInOrder.push(current);
        if (current.row === finishNode.row && current.col === finishNode.col) {
            return visitedNodesInOrder;
        }
        // Remove that node from the open list
        const index = open_list.indexOf(current);
        if (index > -1) {
            open_list.splice(index, 1);
        }
        // Generate successors of 'q' and set their parent to 'q'

        // 1. Side Neighbors
        for (const neighbor of current.side_neighbor) {
            let edge_wt = 1;
            if (neighbor.isWeight) edge_wt *= 10;
            const g_temp = current.g + edge_wt;
            if (g_temp < neighbor.g) {
                neighbor.previousNode = current;
                neighbor.g = g_temp;
                neighbor.f = neighbor.g + neighbor.h;
                if (!isNeighborInOpenSet(neighbor, open_list)) {
                    open_list.push(neighbor);
                }
            }
        }
        // 2. Diagonal Neighbors
        if (diagonal === true) {
            for (const neighbor of current.diagonal_neighbor) {
                let edge_wt = 1.2;
                if (neighbor.isWeight) edge_wt *= 10;
                const g_temp = current.g + edge_wt;
                if (g_temp < neighbor.g) {
                    neighbor.previousNode = current;
                    neighbor.g = g_temp;
                    neighbor.f = neighbor.g + neighbor.h;
                    if (!isNeighborInOpenSet(neighbor, open_list)) {
                        open_list.push(neighbor);
                    }
                }
            }
        }
    }
    // No path
    return visitedNodesInOrder;
}

function isNeighborInOpenSet(node, open_list) {
    for (const eachNode of open_list) {
        if (node.row === eachNode.row && node.col === eachNode.col) return true;
    }
    return false;
}

function nodeWithLeast_f(open_list) {
    let closestNode = null;
    let minDistance = Infinity;
    for (const node of open_list) {
        if (node.isWall == true) continue;
        if (node.f < minDistance) {
            closestNode = node;
            minDistance = node.f;
        }
    }
    return closestNode;
}

function heuristic(node, finishNode, type) {
    if (type === "manhattan") {
        return Math.abs(node.row - finishNode.row) + Math.abs(node.col - finishNode.col);
    }
}

function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}

function getSideNeighbors(allNodes, grid) {
    for (const node of allNodes) {
        const side_nodes_x = [0, 0, 1, -1];
        const side_nodes_y = [1, -1, 0, 0];

        for (let i = 0; i < 4; ++i) {
            const { col, row } = node;
            const new_x = row + side_nodes_x[i];
            const new_y = col + side_nodes_y[i];
            if (!(new_x >= 0 && new_y >= 0 && new_x < grid.length && new_y < grid[0].length)) continue;
            const neighbor = grid[new_x][new_y];
            if (neighbor.isWall == true) continue;
            node.side_neighbor.push(neighbor);
        }
    }
}

function getDiagonalNeighbors(allNodes, grid) {
    for (const node of allNodes) {
        const diagonal_nodes_x = [1, 1, -1, -1];
        const diagonal_nodes_y = [1, -1, 1, -1];

        for (let i = 0; i < 4; ++i) {
            const { col, row } = node;
            const new_x = row + diagonal_nodes_x[i];
            const new_y = col + diagonal_nodes_y[i];
            if (!(new_x >= 0 && new_y >= 0 && new_x < grid.length && new_y < grid[0].length)) continue;
            const neighbor = grid[new_x][new_y];
            if (neighbor.isWall == true) continue;
            node.diagonal_neighbor.push(neighbor);
        }
    }
}
