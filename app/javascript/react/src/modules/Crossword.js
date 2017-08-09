import Clue from './Clue'
const EMPTY_CELL = ' ';

class Crossword {
  constructor(gridArray, clues, userLetters) {
    this.grid = gridArray
    this.clues = clues;
    this.userLetters = userLetters;
  }

  getGridNums() {
    if (this.gridNums !== undefined){
      return this.gridNums
    }

    let grid = this.grid
    let gridNums = [];
    let currentNumber = 1;

    for (var r = 0; r < grid.length; r++) {
      let rowNums = [];
      for (var c = 0; c < grid.length; c++) {
        if (grid[r][c] === '.') {
          rowNums.push(0);
        } else if ((r === 0) || (c === 0)) {
          rowNums.push(currentNumber);
          currentNumber += 1;
        } else if ( (grid[r-1][c] !== '.') && (grid[r][c-1] !== '.') ) {
          rowNums.push(0);
        } else {
          rowNums.push(currentNumber);
          currentNumber += 1;
        }
      }
      gridNums.push(rowNums);
    }
    this.gridNums = gridNums;
    return gridNums;
  }

  getAcrossClues() {
    if (this.acrossClues !== undefined) {
      return this.acrossClues
    }
    let acrossClues = [];
    let acrossClueTextCopy = this.clues.across.slice();
    let gridNums = this.getGridNums()
    let length = gridNums.length

    for (var r = 0; r < length; r++) {
      for (var c = 0; c < length; c++) {
        if (gridNums[r][c] === 0){
          continue;
        } else {
          if ((c === 0) || (this.grid[r][c - 1] === '.')) {
            let clue = this.getClueDimensions('across', r, c)
            clue.text = acrossClueTextCopy.shift()  || ''
            let answer = ''
            for (var i = clue.column.start; i <= clue.column.end; i++) {
              answer += this.grid[r][i]
            }
            clue.answer = answer;
            acrossClues.push(clue)
          }
        }
      }
    }
    this.acrossClues = acrossClues;
    return acrossClues;
  }

  getDownClues() {
    if (this.downClues !== undefined) {
      return this.downClues
    }
    let downClues = [];
    let downClueTextCopy = this.clues.down.slice();
    let gridNums = this.getGridNums()
    let length = gridNums.length;

    for (var r = 0; r < length; r++) {
      for (var c = 0; c < length; c++) {
        if (gridNums[r][c] === 0){
          continue;
        } else {
          if ((r === 0) || (this.grid[r - 1][c] === '.')) {
            let clue = this.getClueDimensions('down', r, c)
            clue.text = downClueTextCopy.shift() || ''
            let answer = ''
            for (var i = clue.row.start; i <= clue.row.end; i++) {
              answer += this.grid[i][c]
            }
            clue.answer = answer;
            downClues.push(clue)
          }
        }
      }
    }
    this.downClues = downClues;
    return downClues;
  }

  getSelectedClue(direction, row, column) {
    let selectedClue = this.getClueDimensions(direction, row, column)
    let clues = (direction === 'across') ? this.getAcrossClues() : this.getDownClues()
    return clues.find((clue) => selectedClue.match(clue))
  }

  getUserPattern(direction, row, column){
    let clue = this.getSelectedClue(direction, row, column);
    let pattern = ""
    for (var row = clue.row.start; row <= clue.row.end; row++) {
      for (var col = clue.column.start; col <= clue.column.end; col++) {
        pattern += this.userLetters[row][col]
      }
    }
    return pattern;
  }

  getClueDimensions(direction, row, column) {
    let lastIndex = this.grid.length - 1
    if (direction === 'across') {
      let columnStart = column
      while (columnStart > 0 && this.grid[row][columnStart - 1] !== '.') {
        columnStart -= 1;
      }
      let columnEnd = column
      while (columnEnd < lastIndex && this.grid[row][columnEnd + 1] !== '.') {
        columnEnd += 1;
      }
      return new Clue(row, [columnStart, columnEnd], this.getGridNums()[row][columnStart])
    } else {
      let rowStart = row;
      while (rowStart > 0 && this.grid[rowStart - 1][column] !== '.') {
        rowStart -= 1;
      }
      let rowEnd = row;
      while (rowEnd < lastIndex && this.grid[rowEnd + 1][column] !== '.') {
        rowEnd += 1;
      }
      return new Clue([rowStart, rowEnd], column, this.getGridNums()[rowStart][column])
    }
  }

  nextCell(direction, startRow, startCol) {
    let row = startRow, col = startCol;
    let nextRow, nextCol;
    let length = this.grid.length;
    // find the next cell in the given direction which is not a black square
    let rowChange = 0, colChange = 0;
    switch (direction) {
      case 'right':
        colChange = 1;
        break;
      case 'left':
        colChange = -1;
        break;
      case 'up':
        rowChange = -1;
        break;
      case 'down':
        rowChange = 1;
        break;
      default:
        return undefined;
    }

    while (true) {
      if ((row === length -1 && col === length -1) && (colChange === 1)){
        nextRow = 0;
        nextCol = 0;
      } else if ((row === 0 && col === 0) && (colChange === -1)) {
        nextRow = length - 1;
        nextCol = length - 1;
      } else {
        nextCol = (col + colChange + length) % length;
        nextRow = row + rowChange;
        if (col + colChange === length){
          nextRow += 1 ;
        } else if (col + colChange === -1) {
          nextRow -= 1 ;
        }
        if (nextRow === length) {
          nextRow -= 1;
        } else if(nextRow === -1) {
          nextRow = 0;
        }
      }

      row = nextRow;
      col = nextCol;
      if (this.grid[row][col] !== '.') {
        return {
          row: row,
          column: col
        }
      } else if ((row === 0 || row === length - 1) && (rowChange !== 0)){
        return {
          row: startRow,
          column: startCol
        }
      }
    }
  }

  nextCellWithinClue(clue, row, col) {
    let nextRow = row
    let nextCol = col

    if (clue.rowStart === clue.rowEnd) {
      if (col === clue.columnEnd) {
        nextCol = clue.columnStart
      } else {
        nextCol += 1
      }
    } else {
      if (row === clue.rowEnd) {
        nextRow = clue.rowStart
      } else {
        nextRow += 1
      }
    }

    return {
      row: nextRow,
      column: nextCol
    };
  }

  nextEmptyCellWithinClue(clue, row, col) {
    let nextCell = this.nextCellWithinClue(clue, row, col);
    let currentRow = nextCell.row;
    let currentCol = nextCell.column;

    while(true) {
      if (this.userLetters[nextCell.row][nextCell.column] === ' ') {
        return {
          row: nextCell.row,
          column: nextCell.column
        }
      } else if ((nextCell.row === row) && (nextCell.column === col)) {
        return false;
      }
      nextCell = this.nextCellWithinClue(clue, nextCell.row, nextCell.column);
    }
    return false;
  }

  hasEmptyCells() {
    for (var i = 0; i < this.grid.length; i++) {
      for (var j = 0; j < this.grid.length; j++) {
        if(this.userLetters[i][j] === ' ' && this.grid[i][j] !== '.') {
          return true;
        }
      }
    }
    return false;
  }

  nextClue(clue) {
    let acrossClues = this.getAcrossClues();
    let downClues = this.getDownClues();
    let index = acrossClues.findIndex(el => clue.match(el))

    if (index === -1) {
      index = downClues.findIndex(el => clue.match(el))
      if (index === downClues.length - 1){
        return acrossClues[0];
      } else {
        return downClues[index + 1]
      }
    } else {
      if (index === acrossClues.length - 1){
        return downClues[0];
      } else {
        return acrossClues[index + 1]
      }
    }
  }

  previousClue(clue) {
    let acrossClues = this.getAcrossClues();
    let downClues = this.getDownClues();
    let index = acrossClues.findIndex(el => clue.match(el))

    if (index === -1) {
      index = downClues.findIndex(el => clue.match(el))
      if (index === 0){
        return acrossClues[acrossClues.length - 1];
      } else {
        return downClues[index - 1]
      }
    } else {
      if (index === 0){
        return downClues[downClues.length - 1];
      } else {
        return acrossClues[index - 1]
      }
    }
  }

  isSolved() {
    for (var row = 0; row < this.grid.length; row++) {
      for (var col = 0; col < this.grid.length; col++) {
        let currentCell = this.grid[row][col].toUpperCase();
        if (!(currentCell === '.' || currentCell === this.userLetters[row][col].toUpperCase())) {
          return false;
        }
      }
    }
    return true;
  }
}

Crossword.generateEmptyGrid = (size) => {
    let emptyLetters = []
    for (var r = 0; r < size ; r++) {
      let row = [];
      for (var c = 0; c < size; c++) {
        row.push(' ')
      }
      emptyLetters.push(row);
    }
    return emptyLetters;
  }

Crossword.parseArrayToGrid = (gridArray) => {
    let size = Math.sqrt(gridArray.length);
    if (!Number.isInteger(size)) {
      throw Error("Array cannot be parsed to square grid")
    }
    let newGrid = [];
    for (var i = 0; i < size; i++) {
      let start = i * size
      newGrid.push(gridArray.slice(start, start + size))
    }
    return newGrid;
  }

Crossword.validate = (grid, clues, userLetters) => {
  for (var row = 0; row < grid.length; row++) {
    for (var col = 0; col < grid.length; col++) {
      if (!(grid[row][col] === "." || userLetters[row][col].match(/^[A-Z]$/gi))){
        return false;
      }
    }
  }
  let crossword = new Crossword(grid, clues, userLetters)
  let acrossValid = crossword.getAcrossClues().every(clue => {
    return !(clue.text === '' || clue.text === '')
  })
  let downValid = crossword.getDownClues().every(clue => {
    return !(clue.text === '' || clue.text === '')
  })
  return acrossValid && downValid;
}

export default Crossword;
