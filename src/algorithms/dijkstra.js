// visitedNodesInOrder = Stores the order in which nodes are visited


export function dijkstra(grid, startNode, finishNode) {

  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const allNodes = getAllNodes(grid);
  let iterations = allNodes.length;
  while (iterations--) {
    // Get the node with minimum distance and not visited
    const closestNode = getClosestUnvisitedNode(allNodes);

    if (closestNode === null) return visitedNodesInOrder;

    // If this closest node distance is Infinity then we are trapped
    // so we stop and return the nodes visited till now
    if (closestNode.distance === Infinity) return visitedNodesInOrder;

    // Push this closestNode in the visited nodes array and make it visited as true
    visitedNodesInOrder.push(closestNode);
    closestNode.isVisited = true;

    // If the closestNode is the finishNode which is the target we are done
    // so return the nodes visited
    if (closestNode === finishNode) return visitedNodesInOrder;

    // Update the distance of the neighbours of the closestNode
    const side_nodes_x = [0, 0, 1, -1];
    const side_nodes_y = [1, -1, 0, 0];

    for (let i = 0; i < 4; ++i) {
      const { col, row } = closestNode;
      const new_x = row + side_nodes_x[i];
      const new_y = col + side_nodes_y[i];
      if (!(new_x >= 0 && new_y >= 0 && new_x < grid.length && new_y < grid[0].length)) continue;
      const neighbor = grid[new_x][new_y];
      if (neighbor.isVisited == true) continue;
      neighbor.distance = closestNode.distance + 1;
      neighbor.previousNode = closestNode;
    }

    const diagonal_nodes_x = [1, 1, -1, -1];
    const diagonal_nodes_y = [1, -1, 1, -1];

    for (let i = 0; i < 4; ++i) {
      const { col, row } = closestNode;
      const new_x = row + diagonal_nodes_x[i];
      const new_y = col + diagonal_nodes_y[i];
      if (!(new_x >= 0 && new_y >= 0 && new_x < grid.length && new_y < grid[0].length)) continue;
      const neighbor = grid[new_x][new_y];
      if (neighbor.isVisited == true) continue;
      neighbor.distance = closestNode.distance + 1.2;
      neighbor.previousNode = closestNode;
    }
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

function getClosestUnvisitedNode(allNodes) {
  let closestNode = null;
  let minDistance = Infinity;
  for (const node of allNodes) {
    // console.log(node)
    if (node.isVisited == true || node.isWall == true) continue;
    if (node.distance < minDistance) {
      closestNode = node;
      minDistance = node.distance;
    }
  }
  console.log(closestNode);
  return closestNode;
}
// unvisitedNodes.reduce(function (nodeA, nodeB) {
//   return nodeA.distance < nodeB.distance ? nodeA : nodeB;
// });











// // Performs Dijkstra's algorithm; returns *all* nodes in the order
// // in which they were visited. Also makes nodes point back to their
// // previous node, effectively allowing us to compute the shortest path
// // by backtracking from the finish node.
// export function dijkstra(grid, startNode, finishNode) {
//   const visitedNodesInOrder = [];
//   startNode.distance = 0;
//   const unvisitedNodes = getAllNodes(grid);
//   while (!!unvisitedNodes.length) {
//     sortNodesByDistance(unvisitedNodes);
//     const closestNode = unvisitedNodes.shift();
//     // If we encounter a wall, we skip it.
//     if (closestNode.isWall) continue;
//     // If the closest node is at a distance of infinity,
//     // we must be trapped and should therefore stop.
//     if (closestNode.distance === Infinity) return visitedNodesInOrder;
//     closestNode.isVisited = true;
//     visitedNodesInOrder.push(closestNode);
//     if (closestNode === finishNode) return visitedNodesInOrder;
//     updateUnvisitedNeighbors(closestNode, grid);
//   }
// }

// function sortNodesByDistance(unvisitedNodes) {
//   unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
// }

// function updateUnvisitedNeighbors(node, grid) {
//   const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
//   for (const neighbor of unvisitedNeighbors) {
//     neighbor.distance = node.distance + 1;
//     neighbor.previousNode = node;
//   }
// }

// function getUnvisitedNeighbors(node, grid) {
//   const neighbors = [];
//   const { col, row } = node;
//   if (row > 0) neighbors.push(grid[row - 1][col]);
//   if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
//   if (col > 0) neighbors.push(grid[row][col - 1]);
//   if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
//   return neighbors.filter(neighbor => !neighbor.isVisited);
// }

// function getAllNodes(grid) {
//   const nodes = [];
//   for (const row of grid) {
//     for (const node of row) {
//       nodes.push(node);
//     }
//   }
//   return nodes;
// }

// // Backtracks from the finishNode to find the shortest path.
// // Only works when called *after* the dijkstra method above.
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
