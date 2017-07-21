import React from 'react';

const Cell = props => {
  let letter;
  if(props.crossword.grid[props.row][props.column] === '.') {
    letter = '.';
  } else {
    letter = props.crossword.userLetters[props.row][props.column];
  }
  let classString = 'cell unselectable'

  let clickHandler = () => {
    let currentCell = {
      row: props.row,
      column: props.column
    }
    props.on.handleMouseClick(currentCell)
  };

  if (letter === '.') {
    classString += ' shaded'
    letter = '';
    clickHandler = null;
  }
  if ((props.selectedCellRow === props.row) && (props.selectedCellColumn === props.column)) {
    classString += ' selectedCell'
  }

  let clue = props.selectedClue
  if (((props.row >= clue.rowStart) && (props.row <= clue.rowEnd))
      && ((props.column >= clue.columnStart) && (props.column <= clue.columnEnd))) {
    classString += ' selectedClue'
  }

  let number = props.crossword.getGridNums()[props.row][props.column]
  let displayNumber = (number) ? number : '';
  return(
    <div className={classString} onClick={clickHandler}>
      <div className="cell-number row">{displayNumber}</div>
      <input
        type='text'
        className="cell-letter row"
        value={letter}
        onKeyDownCapture={props.on.handleKeyDown}/>
    </div>
  )
}

export default Cell;
