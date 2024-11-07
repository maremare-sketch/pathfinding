import React from 'react';
import './Node.css';

const Node = ({ node, handleNodeClick }) => {
    const { isStart, isEnd, isBlocked } = node;

    const classNames = `node ${isStart ? 'start' : ''} ${isEnd ? 'end' : ''} ${isBlocked ? 'blocked' : ''}`;

    return (
        <div
            className={classNames}
            onClick={() => handleNodeClick(node.id)}
        ></div>
    );
};

export default Node;