## Pathfinding Algorithms
- Breadth First Search = unweighted and gives shortest path
- Depth First Search = unweighted and doesn't give shortest path
- Dijkstra's Algorithm = weighted and gives shortest path

### TODO
**Algorithms side**
- Maybe generate random grid with walls & weights?
UNINFORMED SEARCH
- Iterative Deepening Search
- Bidirectional Search
INFORMED SEARCH (heuristics)
- A* Search = weighted, gives shortest path, uses heuristics to make it faster than dijkstra's
- Greedy best-first search
- RBFS (recursive best-first search)
- SMA* (simplified memory-bounded A*)
MAZE GENERATIONS
- Maze Division Algo = https://stackoverflow.com/questions/41553775/maze-generation-recursive-division-how-it-works

**Frontend side**
- Add use same board button which when clicked displays same board used before an algorithm is visualized
- Update grid size responsively (Help Needed)


## How to add new algorithm?
1. Write the algorithm in algorithms folder and export the function which returns visitedNodesInOrder array
2. Inside PathfindingVisualizer.jsx
            -> 'sidenav' div
                -> dropdown-container div
                 Add 3 buttons in this format given below in the example.
3. Example = For adding Dijkstra's Algorithm, add these 3 buttons
```
<button onClick={() => this.handleEachAlgorithmDropdown("dijkstra")}>
    Visualize Dijkstra's Algorithm
    <button id="dijkstra_d" onClick={() => this.visualizeDijkstra(true)} >Diagonal Movement Allowed</button>
    <button id="dijkstra_nd" onClick={() => this.visualizeDijkstra(false)} >No Diagonal Movement Allowed</button>
</button>
```
4. In PathfindingVisualizer.css, in line no. 68 add #dijkstra_d,#dijkstra_nd to the rest of them.
5. Next add the visualizeDijkstra() function in PathfindingVisualizer.jsx inside the class
```
visualizeDijkstra(diagonal) {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    //This dijkstra function needs to imported from the algorithm you have wrriten
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode, diagonal);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateVisitedNodes(visitedNodesInOrder, nodesInShortestPathOrder, startNode, finishNode);
}
```

## Real life uses
https://www.oreilly.com/library/view/graph-algorithms/9781492047674/ch04.html



Everything below this line was automatically generated by Create React App.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
