import React, { useState } from 'react';
import Grid from './components/Grid';
import './App.css';

const NUM_ROWS = 20;
const NUM_COLS = 20;

const App = () => {
    const [grid, setGrid] = useState(createInitialGrid());
    const [startNode, setStartNode] = useState(null);
    const [endNode, setEndNode] = useState(null);
    const [speed, setSpeed] = useState('medium');

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

    const generateWalls = () => {
        const newGrid = grid.map(row => 
            row.map(node => ({
                ...node,
                isBlocked: false // Reset semua node menjadi tidak terblokir
            }))
        );
    
        // Menjaga node start dan end
        if (startNode) {
            const [startRow, startCol] = startNode.id.split('-').map(Number);
            newGrid[startRow][startCol].isStart = true;
        }
    
        if (endNode) {
            const [endRow, endCol] = endNode.id.split('-').map(Number);
            newGrid[endRow][endCol].isEnd = true;
        }
    
        // Generate walls secara acak
        for (let row = 0; row < NUM_ROWS; row++) {
            for (let col = 0; col < NUM_COLS; col++) {
                // Pastikan tidak menghalangi node start dan end
                if (Math.random() < 0.3) { // 30% chance to be blocked
                    if (!(row === startNode?.id.split('-')[0] && col === startNode?.id.split('-')[1]) &&
                        !(row === endNode?.id.split('-')[0] && col === endNode?.id.split('-')[1])) {
                        newGrid[row][col].isBlocked = true;
                    }
                }
            }
        }
    
        setGrid(newGrid);
    };

    const handleSpeedChange = (event) => {
        setSpeed(event.target.value);
    };

    const getSpeedDelay = () => {
        switch (speed) {
            case 'slow':
                return 100;
            case 'medium':
                return 50;
            case 'fast':
                return 15;
            case 'superfast':
                return 5;
            default:
                return 50;
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

        for (let row of newGrid) {
            for (let node of row) {
                node.distance = Infinity;
                node.previousNode = null;
                unvisitedNodes.push(node);
            }
        }

        startNode.distance = 0;

        while (unvisitedNodes.length) {
            let currentNode = getLowestDistanceNode(unvisitedNodes);
            if (!currentNode || currentNode.distance === Infinity) break;

            visitedNodes.push(currentNode);
            unvisitedNodes = unvisitedNodes.filter((node) => node !== currentNode);

            const newGridWithVisited = newGrid.slice();
            const [row, col] = currentNode.id.split('-').map(Number);
            newGridWithVisited[row][col].isVisited = true;
            setGrid(newGridWithVisited);
            await sleep(getSpeedDelay());

            if (currentNode.isEnd) {
                visualizePath(currentNode);
                return;
            }

            for (let neighbor of getNeighbors(currentNode, newGrid)) {
                if (neighbor.isBlocked || visitedNodes.includes(neighbor)) continue;

                const distance = currentNode.distance + 1;
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
        <div className="app">
            <h1>Pathfinding - Way</h1>
            <Grid grid={grid} handleNodeClick={handleNodeClick} />
            <div className="controls">
                <button onClick={resetGrid}>Reset Grid</button>
                <button onClick={generateWalls}>Generate Walls</button>
                <select value={speed} onChange={handleSpeedChange}>
                    <option value="slow">Slow</option>
                    <option value="medium">Medium</option>
                    <option value="fast">Fast</option>
                    <option value="superfast">Superfast</option>
                </select>
                <button onClick={startAlgorithm}>Start Algorithm</button>
            </div>
        </div>
    );
};


export default App;