import React, { useState } from 'react';
import Grid from './components/Grid';
import './App.css';

const NUM_ROWS = 20;
const NUM_COLS = 20;

const App = () => {
    const [grid, setGrid] = useState(createInitialGrid());
    const [startNode, setStartNode] = useState(null);
    const [endNode, setEndNode] = useState(null);
    const [speed, setSpeed] = useState('medium'); // Menambahkan state untuk kecepatan

    function createInitialGrid() {
        const initialGrid = [];
        for (let row = 0; row < NUM_ROWS; row++) {
            const currentRow = [];
            for (let col = 0; col < NUM_COLS; col++) {
                currentRow.push({
                    id: `${row}-${col}`,
                    isStart: false,
                    isEnd: false,
                    isBlocked: false,
                    distance: Infinity,
                    previousNode: null,
                    isVisited: false,
                    isPath: false,
                });
            }
            initialGrid.push(currentRow);
        }
        return initialGrid;
    }

    const handleNodeClick = (id) => {
        const [row, col] = id.split('-').map(Number);
        const newGrid = grid.slice();

        if (!startNode) {
            newGrid[row][col].isStart = true;
            setStartNode(newGrid[row][col]);
        } else if (!endNode) {
            newGrid[row][col].isEnd = true;
            setEndNode(newGrid[row][col]);
        } else {
            newGrid[row][col].isBlocked = !newGrid[row][col].isBlocked;
        }

        setGrid(newGrid);
    };

    const resetGrid = () => {
        setGrid(createInitialGrid());
        setStartNode(null);
        setEndNode(null);
    };

    const handleSpeedChange = (event) => {
        setSpeed(event.target.value);
    };

    const getSpeedDelay = () => {
        switch (speed) {
            case 'slow':
                return 100; // 200 ms
            case 'medium':
                return 50; // 100 ms
            case 'fast':
                return 15; // 50 ms
            case 'superfast':
                return 5; // 10 ms
            default:
                return 50; // Default to medium
        }
    };

    const startAlgorithm = async () => {
        if (!startNode || !endNode) {
            alert("Please select both start and end nodes.");
            return;
        }

        const newGrid = grid.slice();
        const visitedNodes = [];
        let unvisitedNodes = [];

        // Initialize distances and unvisited nodes
        for (let row of newGrid) {
            for (let node of row) {
                node.distance = Infinity;
                node.previousNode = null;
                unvisitedNodes.push(node);
            }
        }

        startNode.distance = 0;

        while (unvisitedNodes.length) {
            // Get the node with the lowest distance
            let currentNode = getLowestDistanceNode(unvisitedNodes);
            if (!currentNode || currentNode.distance === Infinity) break;

            // Mark the current node as visited
            visitedNodes.push(currentNode);
            unvisitedNodes = unvisitedNodes.filter((node) => node !== currentNode);

            // Visualize the current node being visited
            const newGridWithVisited = newGrid.slice();
            const [row, col] = currentNode.id.split('-').map(Number);
            newGridWithVisited[row][col].isVisited = true; // Tandai node sebagai dikunjungi
            setGrid(newGridWithVisited);
            await sleep(getSpeedDelay()); // Delay for visualization

            // If we reached the end node, break
            if (currentNode.isEnd) {
                visualizePath(currentNode);
                return; // Exit the function after finding the path
            }

            // Update distances for neighbors
            for (let neighbor of getNeighbors(currentNode, newGrid)) {
                if (neighbor.isBlocked || visitedNodes.includes(neighbor)) continue;

                const distance = currentNode.distance + 1; // Assuming all edges have weight 1
                if (distance < neighbor.distance) {
                    neighbor.distance = distance;
                    neighbor.previousNode = currentNode;
                }
            }
        }
    };

    const getLowestDistanceNode = (nodes) => {
        return nodes.reduce((min, node) => (node.distance < min.distance ? node : min), nodes[0]);
    };

    const getNeighbors = (node, grid) => {
        const [row, col] = node.id.split('-').map(Number);
        const neighbors = [];

        if (row > 0) neighbors.push(grid[row - 1][col]); // Up
        if (row < NUM_ROWS - 1) neighbors.push(grid[row + 1][col]); // Down
        if (col > 0) neighbors.push(grid[row][col - 1]); // Left
        if (col < NUM_COLS - 1) neighbors.push(grid[row][col + 1]); // Right

        return neighbors;
    };

    const sleep = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };

    const visualizePath = (node) => {
        const path = [];
        let currentNode = node;

        while (currentNode) {
            path.push(currentNode);
            currentNode = currentNode.previousNode;
        }

        for (let node of path) {
            const [row, col] = node.id.split('-').map(Number);
            grid[row][col].isPath = true;
        }

        setGrid(grid);
    };

    return (
        <div>
            <Grid grid={grid} handleNodeClick={handleNodeClick} />
            <button onClick={resetGrid}>Reset Grid</button>
            <select value={speed} onChange={handleSpeedChange}>
                <option value="slow">Slow</option>
                <option value="medium">Medium</option>
                <option value="fast">Fast</option>
                <option value="superfast">Superfast</option>
            </select>
            <button onClick={startAlgorithm}>Start Algorithm</button>
        </div>
    );
};

export default App;