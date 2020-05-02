import React, { Component } from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';
import { bfs } from '../algorithms/bfs';
import { dfs } from '../algorithms/dfs';

import './PathfindingVisualizer.css';

var START_NODE_ROW = -1;
var START_NODE_COL = -1;
var FINISH_NODE_ROW = -1;
var FINISH_NODE_COL = -1;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      isPlaceStart: false,
      isPlaceEnd: false,
      startPresent: false,
      endPresent: false,
      isMousePressed: false,
    };
  }
  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }
  placeStartNode() {
    this.setState({ isPlaceStart: true });
  }
  placeEndNode() {
    this.setState({ isPlaceEnd: true });
  }

  handleMouseClick(row, col) {
    console.log("A cell is clicked")
    const { isPlaceStart, isPlaceEnd, endPresent, startPresent, isMousePressed } = this.state;
    let newGrid = null;
    if (isMousePressed) {
      console.log("Back to normal state");
      this.setState({ isMousePressed: false });
      return;
    }
    else if (!isPlaceStart && !isPlaceEnd) {
      console.log("Placing wall node");
      newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ isMousePressed: true });
    }
    else if (isPlaceStart) {
      const isSameNode = (row == START_NODE_ROW && col == START_NODE_COL)
      if (!isSameNode && startPresent) {
        console.log("Start Node already present");
        return;
      }

      newGrid = getNewGridWithStartToggled(this.state.grid, row, col);
      START_NODE_ROW = row;
      START_NODE_COL = col;
      if (isSameNode) {
        this.setState({ startPresent: false });
      }
      else {
        this.setState({ startPresent: true });
      }
    }
    else if (isPlaceEnd) {
      const isSameNode = (row == FINISH_NODE_ROW && col == FINISH_NODE_COL);
      if (!isSameNode && endPresent) {
        console.log("End Node already present");
        return;
      }

      newGrid = getNewGridWithEndToggled(this.state.grid, row, col);
      FINISH_NODE_ROW = row;
      FINISH_NODE_COL = col;
      if (isSameNode) {
        this.setState({ endPresent: false });
      }
      else {
        this.setState({ endPresent: true });
      }
    }

    if (newGrid === null) {
      console.log("Error in handling mouse click");
      return;
    }
    this.setState({ grid: newGrid, isPlaceStart: false, isPlaceEnd: false });
  }

  handleMouseEnter(row, col) {
    const { isPlaceStart, isPlaceEnd, isMousePressed, startPresent, endPresent } = this.state;
    if (isPlaceEnd || isPlaceStart) {
      console.log("Placing start or end node.Cant drag");
      return;
    }
    if (!isMousePressed) {
      console.log("Mouse is not being dragged");
      return;
    }
    if (startPresent && row == START_NODE_ROW && col == START_NODE_COL) {
      console.log("start present on that cell.cant place wall")
      return;
    }
    if (endPresent && row == FINISH_NODE_ROW && col == FINISH_NODE_COL) {
      console.log("end present on that cell.cant place wall")
      return;
    }
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  clearBoard() {
    const grid = getInitialGrid();
    this.setState({ grid: grid, isPlaceStart: false, isPlaceEnd: false, startPresent: false, endPresent: false });
    for (let row = 0; row < grid.length; ++row) {
      for (let col = 0; col < grid[0].length; ++col) {
        document.getElementById(`node-${row}-${col}`).className = 'node';
      }
    }
  }

  handleAlgorithmsDropdown() {
    let algorithmsContainer = document.getElementById("dropdown-container").style;
    if (algorithmsContainer.display === "block") {
      algorithmsContainer.display = "none";
    }
    else {
      algorithmsContainer.display = "block";
    }
  }

  handleEachAlgorithmDropdown(algo) {
    let diagonal = document.getElementById(algo + "_d").style;
    let noDiagonal = document.getElementById(algo + "_nd").style;
    if (diagonal.display === "block") {
      diagonal.display = "none";
    }
    else {
      diagonal.display = "block";
    }
    if (noDiagonal.display === "block") {
      noDiagonal.display = "none";
    }
    else {
      noDiagonal.display = "block";
    }
  }

  render() {
    const { grid } = this.state;

    return (
      <>
        <div className="sidenav">
          <button id="start_node" onClick={() => this.placeStartNode()}>Start Node</button>
          <button id="end_node" onClick={() => this.placeEndNode()}>End Node</button>
          <button className="dropdown-btn" onClick={() => this.handleAlgorithmsDropdown()}>Algorithms<i className="fa fa-caret-down"></i></button>
          <div className="dropdown-container" id="dropdown-container">
            <button onClick={() => this.handleEachAlgorithmDropdown("bfs")}>
              Visualize BFS Algorithm
              <button id="bfs_d" onClick={() => this.visualizeBFS(true)} >Diagonal Movement Allowed</button>
              <button id="bfs_nd" onClick={() => this.visualizeBFS(false)} >No Diagonal Movement Allowed</button>
            </button>
            <button onClick={() => this.handleEachAlgorithmDropdown("dfs")}>
              Visualize DFS Algorithm
              <button id="dfs_d" onClick={() => this.visualizeDFS(true)} >Diagonal Movement Allowed</button>
              <button id="dfs_nd" onClick={() => this.visualizeDFS(false)} >No Diagonal Movement Allowed</button>
            </button>
            <button onClick={() => this.handleEachAlgorithmDropdown("dijkstra")}>
              Visualize Dijkstra's Algorithm
              <button id="dijkstra_d" onClick={() => this.visualizeDijkstra(true)} >Diagonal Movement Allowed</button>
              <button id="dijkstra_nd" onClick={() => this.visualizeDijkstra(false)} >No Diagonal Movement Allowed</button>
            </button>
            <button onClick={() => this.handleEachAlgorithmDropdown("astar")}>
              Visualize A* Search Algorithm
              <button id="astar_d" onClick={() => this.visualizeAStar(true)} >Diagonal Movement Allowed</button>
              <button id="astar_nd" onClick={() => this.visualizeAStar(false)} >No Diagonal Movement Allowed</button>
            </button>
          </div>
          <button id="clear" onClick={() => this.clearBoard()}>Clear Board</button>
        </div>


        <div className="main info">This is where info about algorithm is displayed</div>

        <div className="grid main">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isEnd, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isEnd={isEnd}
                      isStart={isStart}
                      isWall={isWall}
                      onMouseClick={(row, col) => this.handleMouseClick(row, col)}
                      onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }

  // Pathfinding Algorithms Helper FUnctions
  visualizeDijkstra(diagonal) {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode, diagonal);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    // console.log(visitedNodesInOrder);
    // console.log(nodesInShortestPathOrder);
    this.animateVisitedNodes(visitedNodesInOrder, nodesInShortestPathOrder, startNode, finishNode);
  }
  visualizeBFS(diagonal) {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = bfs(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode, diagonal);
    // console.log(visitedNodesInOrder);
    // console.log(nodesInShortestPathOrder);
    this.animateVisitedNodes(visitedNodesInOrder, nodesInShortestPathOrder, startNode, finishNode);
  }
  visualizeDFS(diagonal) {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dfs(grid, startNode, finishNode, diagonal);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    // console.log(visitedNodesInOrder);
    // console.log(nodesInShortestPathOrder);
    this.animateVisitedNodes(visitedNodesInOrder, nodesInShortestPathOrder, startNode, finishNode);
  }
  animateVisitedNodes(visitedNodesInOrder, nodesInShortestPathOrder, startNode, finishNode) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 25 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (node === startNode || node === finishNode) return;
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 25 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    const firstNodeInShortestPath = nodesInShortestPathOrder[0];
    if (!(firstNodeInShortestPath.row === START_NODE_ROW && firstNodeInShortestPath.col === START_NODE_COL)) {
      setTimeout(() => {
        alert("No Shortest Path");
      }, 25)
      return;
    }
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 100 * i);
    }
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: false,
    isEnd: false,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  // This node has isWall=True which makes its className='node-wall' whose color is black as specified in the styling
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithStartToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  // This node has isStart=True which makes its className='node-start' whose color is specified in the styling
  const newNode = {
    ...node,
    isStart: !node.isStart,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithEndToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  // This node has isEnd=True which makes its className='node-end' whose color is specified in the styling
  const newNode = {
    ...node,
    isEnd: !node.isEnd,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
