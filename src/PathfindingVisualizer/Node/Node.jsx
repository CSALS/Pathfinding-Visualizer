import React, { Component } from 'react';

import './Node.css';

export default class Node extends Component {
  render() {
    const {
      row, col,
      isEnd,
      isStart,
      isWall,
      isWeight,
      onMouseClick,
      onMouseEnter,
    } = this.props;

    const extraClassName = isEnd ? 'node-finish' : isStart ? 'node-start' : isWall ? 'node-wall' : isWeight ? 'node-weight' : '';

    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        onClick={() => onMouseClick(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
      >
      </div>
    );
  }
}
