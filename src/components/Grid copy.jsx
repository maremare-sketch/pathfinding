import React from 'react';
import './Grid.css';

const Grid = ({ grid, handleNodeClick }) => {
    return (
        <div className="grid">
            {grid.map((row, rowIndex) => (
                <div key={rowIndex} className="row">
                    {row.map((node, nodeIndex) => (
                        <div
                            key={nodeIndex}
                            className={`node ${node.isStart ? 'start' : ''} ${node.isEnd ? 'end' : ''} ${node.isBlocked ? 'blocked' : ''} ${node.isVisited ? 'visited' : ''} ${node.isPath ? 'path' : ''}`}
                            onClick={() => handleNodeClick(node.id)}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Grid;