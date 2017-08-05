import React from 'react';

const Cell = props => {
  let letter;
  let gridLetter = props.crossword.grid[props.row][props.column];
  let userLetter = props.crossword.userLetters[props.row][props.column];
  let classString = 'cell unselectable'

  if(gridLetter === '.') {
    letter = '';
    classString += ' shaded';
  } else if (props.puzzleRevealed){
    letter = gridLetter;
    if (letter !== userLetter) {
      classString += ' revealedLetter';
    }
  } else {
    letter = props.crossword.userLetters[props.row][props.column];
  }

  let clickHandler = (event) => {
    let currentCell = {
      row: props.row,
      column: props.column
    }
    props.on.handleMouseClick(currentCell, event.metaKey)
  };

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
