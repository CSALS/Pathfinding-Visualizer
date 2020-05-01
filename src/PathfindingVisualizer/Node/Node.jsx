import React, { Component } from 'react';

import './Node.css';

export default class Node extends Component {
  render() {
    const {
      row, col,
      isEnd,
      isStart,
      isWall,
      onMouseClick,
    } = this.props;

    const extraClassName = isEnd ? 'node-finish' : isStart ? 'node-start' : isWall ? 'node-wall' : '';

    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        onClick={() => onMouseClick(row, col)}
      >
      </div>
    );
  }
}
