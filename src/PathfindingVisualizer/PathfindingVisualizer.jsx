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
var TIME_INTERVAL = 25;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      isPlaceStart: false,
      isPlaceEnd: false,
      isPlaceWeight: false,
      startPresent: false,
      endPresent: false,
      isMousePressed: false,
    };
  }
  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid: grid });
  }
  placeStartNode() {
    this.setState({ isPlaceStart: true });
  }
  placeEndNode() {
    this.setState({ isPlaceEnd: true });
  }
  placeWeightNode() {
    this.setState({ isPlaceWeight: true });
  }

  handleMouseClick(row, col) {
    console.log("A cell is clicked")
    const { isPlaceStart, isPlaceEnd, endPresent, startPresent, isMousePressed, isPlaceWeight } = this.state;
    let newGrid = null;
    if (isMousePressed) {
      console.log("Back to normal state");
      this.setState({ isMousePressed: false });
      return;
    }
    else if (!isPlaceStart && !isPlaceEnd && !isPlaceWeight) {
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
    else if (isPlaceWeight) {
      newGrid = getNewGridWithWeightToggled(this.state.grid, row, col);
    }

    if (newGrid === null) {
      console.log("Error in handling mouse click");
      return;
    }
    this.setState({ grid: newGrid, isPlaceStart: false, isPlaceEnd: false });
  }

  handleMouseEnter(row, col) {
    const { isPlaceStart, isPlaceEnd, isMousePressed, isPlaceWeight, startPresent, endPresent } = this.state;
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
    if (isPlaceWeight) {
      const newGrid = getNewGridWithWeightToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid });
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
    this.enableExceptClearboard();
    START_NODE_ROW = -1;
    START_NODE_COL = -1;
    FINISH_NODE_ROW = -1;
    FINISH_NODE_COL = -1;
  }

  getPrevBoard() {
    console.log("TODO: Implement use previous board function");
  }

  handleAlgorithmsDropdown() {
    let algorithmsContainer = document.getElementsByClassName("dropdown-container")[0].style;
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

  // Util functions
  disableExceptClearboard() {
    // Disable start & end node
    const startNode = document.getElementById("start_node");
    startNode.disabled = true;
    startNode.style.background = "white";
    const endNode = document.getElementById("end_node");
    endNode.disabled = true;
    endNode.style.background = "white";

    // Disable all algorithms buttons
    document.getElementsByClassName("dropdown-btn")[0].style.background = "white";
    const visualizeButtons = document.getElementsByClassName("visualize");
    for (const button of visualizeButtons) {
      button.disabled = true;
    }

    // Disable internal algorithm button
    document.getElementById("bfs_d").disabled = true;
    document.getElementById("bfs_nd").disabled = true;
    document.getElementById("dfs_d").disabled = true;
    document.getElementById("dfs_nd").disabled = true;
    document.getElementById("dijkstra_d").disabled = true;
    document.getElementById("dijkstra_nd").disabled = true;
    document.getElementById("astar_d").disabled = true;
    document.getElementById("astar_nd").disabled = true;

    // Disable clear button
    document.getElementById("clear").disabled = true;
  }
  enableExceptClearboard() {
    // Enable start & end node
    const startNode = document.getElementById("start_node");
    startNode.disabled = false;
    startNode.style.background = "#111";
    const endNode = document.getElementById("end_node");
    endNode.disabled = false;
    endNode.style.background = "#111";

    // Enable all algorithms buttons
    document.getElementsByClassName("dropdown-btn")[0].style.background = "#111";
    const visualizeButtons = document.getElementsByClassName("visualize");
    for (const button of visualizeButtons) {
      button.disabled = false;
    }

    // Disable internal algorithm button
    document.getElementById("bfs_d").disabled = false;
    document.getElementById("bfs_nd").disabled = false;
    document.getElementById("dfs_d").disabled = false;
    document.getElementById("dfs_nd").disabled = false;
    document.getElementById("dijkstra_d").disabled = false;
    document.getElementById("dijkstra_nd").disabled = false;
    document.getElementById("astar_d").disabled = false;
    document.getElementById("astar_nd").disabled = false;

    // Enable clear button
    document.getElementById("clear").disabled = false;
  }

  render() {
    const { grid } = this.state;

    return (
      <>
        <div className="sidenav">
          <button id="start_node" onClick={() => this.placeStartNode()}>Start Node</button>
          <button id="end_node" onClick={() => this.placeEndNode()}>End Node</button>
          <button id="weight_node" onClick={() => this.placeWeightNode()}>Weight Node</button>
          <button className="dropdown-btn" onClick={() => this.handleAlgorithmsDropdown()}>Algorithms<i className="fa fa-caret-down"></i></button>
          <div className="dropdown-container" id="dropdown-container">
            {/* BFS */}
            <button className="visualize" onClick={() => this.handleEachAlgorithmDropdown("bfs")}>Visualize BFS Algorithm</button>
            <button id="bfs_d" onClick={() => this.visualizeBFS(true)} >Diagonal Movement Allowed</button>
            <button id="bfs_nd" onClick={() => this.visualizeBFS(false)} >No Diagonal Movement Allowed</button>
            {/* DFS */}
            <button className="visualize" onClick={() => this.handleEachAlgorithmDropdown("dfs")}>Visualize DFS Algorithm</button>
            <button id="dfs_d" onClick={() => this.visualizeDFS(true)} >Diagonal Movement Allowed</button>
            <button id="dfs_nd" onClick={() => this.visualizeDFS(false)} >No Diagonal Movement Allowed</button>
            {/* Dijkstra's */}
            <button className="visualize" onClick={() => this.handleEachAlgorithmDropdown("dijkstra")}>Visualize Dijkstra's Algorithm</button>
            <button id="dijkstra_d" onClick={() => this.visualizeDijkstra(true)} >Diagonal Movement Allowed</button>
            <button id="dijkstra_nd" onClick={() => this.visualizeDijkstra(false)} >No Diagonal Movement Allowed</button>
            {/* A* Search */}
            <button className="visualize" onClick={() => this.handleEachAlgorithmDropdown("astar")}>Visualize A* Search Algorithm</button>
            <button id="astar_d" onClick={() => this.visualizeAStar(true)} >Diagonal Movement Allowed</button>
            <button id="astar_nd" onClick={() => this.visualizeAStar(false)} >No Diagonal Movement Allowed</button>
          </div>
          <button id="clear" onClick={() => this.clearBoard()}>Clear Board</button>
          <button id="prevGrid" onClick={() => this.getPrevBoard()}>Use Previous Board</button>
        </div>


        <div className="main info">This is where info about algorithm is displayed</div>

        <div className="grid main">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isEnd, isStart, isWall, isWeight } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isEnd={isEnd}
                      isStart={isStart}
                      isWall={isWall}
                      isWeight={isWeight}
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
    if (START_NODE_ROW == -1 || START_NODE_COL == -1) {
      alert("start node isn't selected");
      return;
    }
    if (FINISH_NODE_ROW == -1 || FINISH_NODE_COL == -1) {
      alert("end node isn't selected");
    }
    this.disableExceptClearboard();
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
    if (START_NODE_ROW == -1 || START_NODE_COL == -1) {
      alert("start node isn't selected");
      return;
    }
    if (FINISH_NODE_ROW == -1 || FINISH_NODE_COL == -1) {
      alert("end node isn't selected");
    }
    this.disableExceptClearboard();
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = bfs(grid, startNode, finishNode, diagonal);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    // console.log(visitedNodesInOrder);
    // console.log(nodesInShortestPathOrder);
    this.animateVisitedNodes(visitedNodesInOrder, nodesInShortestPathOrder, startNode, finishNode);
  }
  visualizeDFS(diagonal) {
    if (START_NODE_ROW == -1 || START_NODE_COL == -1) {
      alert("start node isn't selected");
      return;
    }
    if (FINISH_NODE_ROW == -1 || FINISH_NODE_COL == -1) {
      alert("end node isn't selected");
    }
    this.disableExceptClearboard();
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
    for (let i = 1; i <= visitedNodesInOrder.length - 1; i++) {
      if (i === visitedNodesInOrder.length - 1) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
          // Enable clear button
          document.getElementById("clear").disabled = false;
        }, TIME_INTERVAL * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (node === startNode || node === finishNode) return;
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, TIME_INTERVAL * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    const firstNodeInShortestPath = nodesInShortestPathOrder[0];
    if (!(firstNodeInShortestPath.row === START_NODE_ROW && firstNodeInShortestPath.col === START_NODE_COL)) {
      setTimeout(() => {
        alert("No Shortest Path");
      }, TIME_INTERVAL)
      return;
    }
    const node = nodesInShortestPathOrder[0];
    document.getElementById(`node-${node.row}-${node.col}`).className =
      'node node-shortest-path node-start';

    for (let i = 1; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        if (i == nodesInShortestPathOrder.length - 1) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            'node node-shortest-path node-finish';
        }
        else {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            'node node-shortest-path';
        }
      }, 2 * TIME_INTERVAL * i);
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
    isWeight: false,
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

const getNewGridWithWeightToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWeight: !node.isWeight,
  };
  newGrid[row][col] = newNode;
  return newGrid;
}