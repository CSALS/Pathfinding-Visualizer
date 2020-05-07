import React, { Component } from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../PathfindingAlgorithms/dijkstra';
import { bfs } from '../PathfindingAlgorithms/bfs';
import { dfs } from '../PathfindingAlgorithms/dfs';
import { astar } from '../PathfindingAlgorithms/astar';
import { dfsMaze } from '../MazeAlgorithms/dfsMaze';

import './PathfindingVisualizer.css';

var START_NODE_ROW = -1;
var START_NODE_COL = -1;
var FINISH_NODE_ROW = -1;
var FINISH_NODE_COL = -1;
var TIME_INTERVAL = 25;
var HEIGHT = 20;
var WIDTH = 50;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      isPlaceStart: false,
      isPlaceEnd: false,
      isPlaceWeight: false,
      isPlaceWall: false,
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
  placeWallNode() {
    this.setState({ isPlaceWall: true });
  }
  placeWeightNode() {
    this.setState({ isPlaceWeight: true });
  }

  handleMouseClick(row, col) {
    console.log("A cell is clicked")
    const { isPlaceStart, isPlaceEnd, endPresent, startPresent, isMousePressed, isPlaceWeight, isPlaceWall } = this.state;
    let newGrid = null;
    if (isMousePressed) {
      console.log("Back to normal state");
      this.setState({ isMousePressed: false, isPlaceWall: false, isPlaceWeight: false });
      return;
    }
    else if (isPlaceWall) {
      console.log("Placing wall node");
      newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ isMousePressed: true });
    }
    else if (isPlaceWeight) {
      newGrid = getNewGridWithWeightToggled(this.state.grid, row, col);
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
    const { isPlaceStart, isPlaceEnd, isMousePressed, isPlaceWeight, isPlaceWall, startPresent, endPresent } = this.state;
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
    let newGrid = null;
    if (isPlaceWall) {
      newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid });
    }
    else if (isPlaceWeight) {
      newGrid = getNewGridWithWeightToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid });
    }
  }

  clearBoard() {
    const grid = getInitialGrid();
    for (let row = 0; row < grid.length; ++row) {
      for (let col = 0; col < grid[0].length; ++col) {
        document.getElementById(`node-${row}-${col}`).className = 'node';
      }
    }
    this.setState({
      grid: grid, isPlaceStart: false,
      isPlaceEnd: false,
      isPlaceWeight: false,
      isPlaceWall: false,
      startPresent: false,
      endPresent: false,
      isMousePressed: false,
    });
    this.enableExceptClearboard();
    START_NODE_ROW = -1;
    START_NODE_COL = -1;
    FINISH_NODE_ROW = -1;
    FINISH_NODE_COL = -1;
  }

  getPrevBoard() {
    console.log("TODO: Implement use previous board function");
  }



  handleAlgorithmsDropdown(index) {
    let algorithmsContainer = document.getElementsByClassName("dropdown-container")[index].style;
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
          <button id="wall_node" onClick={() => this.placeWallNode()} title="Click on any cell and then keep moving to create walls. Click again to stop">Wall Node</button>
          <button id="weight_node" onClick={() => this.placeWeightNode()} title="Click on any cell and then keep moving to create weights. Click again to stop">Weight Node</button>

          {/* Dropdown of pathfinding algorithms BEGIN */}
          <button className="dropdown-btn" onClick={() => this.handleAlgorithmsDropdown(0)}>Pathfinding Algorithms<i className="fa fa-caret-down"></i></button>
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
          {/* Dropdown of pathfinding algorithms END */}

          {/* Dropdown of maze algorithms BEGIN */}
          <button className="dropdown-btn" onClick={() => this.handleAlgorithmsDropdown(1)}>Maze Algorithms<i className="fa fa-caret-down"></i></button>
          <div className="dropdown-container" id="dropdown-container">
            {/* Randomized DFS */}
            <button className="visualize" onClick={() => this.genRandomBoard()}>Visualize Randomized DFS Algorithm</button>
          </div>
          {/* Dropdown of maze algorithms END */}

          <button id="clear" onClick={() => this.clearBoard()}>Clear Board</button>
          <button id="prevGrid" onClick={() => this.getPrevBoard()}>Use Previous Board</button>
        </div>


        <div className="main info">
          Adding WALL on cell makes it <strong>impenetrable</strong> <br></br>
          Adding WEIGHT on cell <strong>increases</strong> the cost to pass throught it. Here the cost is multiplied 10 times.
        </div>

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
  refreshBoardForPathfinding(currGrid) {
    // Defaults visited & distance of each node. Need this before
    // running the pathfinding algorithms
    const grid = currGrid.slice();
    for (const row of grid) {
      for (const node of row) {
        node.distance = Infinity;
        node.isVisited = false;
      }
    }
    return grid;
  }
  visualizeDijkstra(diagonal) {
    if (START_NODE_ROW == -1 || START_NODE_COL == -1) {
      alert("start node isn't selected");
      return;
    }
    if (FINISH_NODE_ROW == -1 || FINISH_NODE_COL == -1) {
      alert("end node isn't selected");
    }
    document.getElementsByClassName("info")[0].innerHTML =
      "Dijkstra's Algorithm is <strong>weighted</strong> algorithm and <strong>guarentees</strong> shortest path";
    this.disableExceptClearboard();
    let { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    grid = this.refreshBoardForPathfinding(grid);
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
    document.getElementsByClassName("info")[0].innerHTML =
      "Breadth First Search Algorithm is <strong>unweighted</strong> algorithm and <strong>guarentees</strong> shortest path";
    this.disableExceptClearboard();
    let { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    grid = this.refreshBoardForPathfinding(grid);
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
    document.getElementsByClassName("info")[0].innerHTML =
      "Depth First Search Algorithm is <strong>unweighted</strong> algorithm and <strong>doesn't</strong> guarentees shortest path";
    this.disableExceptClearboard();
    let { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    grid = this.refreshBoardForPathfinding(grid);
    const visitedNodesInOrder = dfs(grid, startNode, finishNode, diagonal);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    // console.log(visitedNodesInOrder);
    // console.log(nodesInShortestPathOrder);
    this.animateVisitedNodes(visitedNodesInOrder, nodesInShortestPathOrder, startNode, finishNode);
  }
  visualizeAStar(diagonal) {
    // console.log("TODO: Implement A* Algorithm")
    if (START_NODE_ROW == -1 || START_NODE_COL == -1) {
      alert("start node isn't selected");
      return;
    }
    if (FINISH_NODE_ROW == -1 || FINISH_NODE_COL == -1) {
      alert("end node isn't selected");
    }
    document.getElementsByClassName("info")[0].innerHTML =
      "A* Search Algorithm is <strong>weighted</strong> algorithm and <strong>guarentees</strong> shortest path<br></br><strong>Faster</strong> than Dijkstra's since it uses <strong>Heuristics</strong>";
    this.disableExceptClearboard();
    let { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    grid = this.refreshBoardForPathfinding(grid);
    const visitedNodesInOrder = astar(grid, startNode, finishNode, diagonal);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    console.log(visitedNodesInOrder);
    console.log(nodesInShortestPathOrder);
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
        if (node.row === START_NODE_ROW && node.col === START_NODE_COL) return;
        if (node.row === FINISH_NODE_ROW && node.col === FINISH_NODE_COL) return;
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

  refreshBoardForMaze(currGrid) {
    let grid = currGrid.slice();
    for (const row of grid) {
      for (const node of row) {
        node.isVisited = false;
        node.isWall = false;
      }
    }
    return grid;
  }


  genRandomBoard() {
    // this.clearBoard();
    //21*51 board
    let { grid } = this.state;
    grid = this.refreshBoardForMaze(grid);
    let start_x = getRandomInteger(0, HEIGHT);
    let start_y = getRandomInteger(0, WIDTH);
    while (start_x % 2 != 0) {
      start_x = getRandomInteger(0, HEIGHT);
    }
    while (start_y % 2 != 0) {
      start_y = getRandomInteger(0, WIDTH);
    }
    const visitedNodesInOrder = dfsMaze(grid, start_x, start_y);
    grid = this.refreshBoardForMaze(grid);
    for (let i = 0; i < visitedNodesInOrder.length; ++i) {
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        node.isWall = true;
        this.setState({ grid });
      }, 0);
    }
    this.setState({ grid });
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row <= HEIGHT; row++) {
    const currentRow = [];
    for (let col = 0; col <= WIDTH; col++) {
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

const getRandomInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
}