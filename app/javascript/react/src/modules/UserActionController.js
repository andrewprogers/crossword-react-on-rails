import Crossword from './Crossword';

class UserActionController {
  constructor(state) {
    this.state = {
      grid: [],
      clues: {},
      userLetters: [],
      selectedCellRow: state.selectedCellRow,
      selectedCellColumn: state.selectedCellColumn,
      clueDirection: state.clueDirection
    }
    for (var i = 0; i < state.grid.length; i++) {
      this.state.grid.push(state.grid[i].slice())
      this.state.userLetters.push(state.userLetters[i].slice())
    }
    this.state.clues = {
      across: state.clues.across.slice(),
      down: state.clues.down.slice()
    }
  }

  keyPress(key) {
    let newState = {}
    let next;
    let crossword = new Crossword(this.state.grid, this.state.clues, this.state.userLetters)
    if (key.match(/[a-zA-Z]/) && key.length === 1){
      newState = this.handleLetter(key);
    } else {
      switch (key) {
        case 'Backspace':
          newState = this.handleBackspace();
          break;
        case ' ':
          newState.clueDirection = this.nextDirection();
          break;
        case 'ArrowUp':
          next = crossword.nextCell('up', this.state.selectedCellRow, this.state.selectedCellColumn)
          newState.selectedCellRow = next.row
          newState.selectedCellColumn = next.column
          break;
        case 'ArrowDown':
          next = crossword.nextCell('down', this.state.selectedCellRow, this.state.selectedCellColumn)
          newState.selectedCellRow = next.row
          newState.selectedCellColumn = next.column
          break;
        case 'ArrowLeft':
          next = crossword.nextCell('left', this.state.selectedCellRow, this.state.selectedCellColumn)
          newState.selectedCellRow = next.row
          newState.selectedCellColumn = next.column
          break;
        case 'ArrowRight':
          next = crossword.nextCell('right', this.state.selectedCellRow, this.state.selectedCellColumn)
          newState.selectedCellRow = next.row
          newState.selectedCellColumn = next.column
          break;
        default:

      }
    }
    return newState;
  }

  mouseClick(currentCell) {
    let newState = {};
    if ((currentCell.row === this.state.selectedCellRow)
    && (currentCell.column === this.state.selectedCellColumn)) {
      newState.clueDirection = this.nextDirection();
    } else {
      newState.selectedCellRow = currentCell.row;
      newState.selectedCellColumn = currentCell.column;
    }
    return newState;
  }

  nextDirection() {
    if (this.state.clueDirection === 'across'){
      return 'down';
    } else {
      return 'across';
    }
  }

  handleLetter(key) {
    let newState = {};
    let row = this.state.selectedCellRow;
    let column = this.state.selectedCellColumn;
    let crossword = new Crossword(this.state.grid, this.state.clues, this.state.userLetters)
    let isCellEmpty = (this.state.userLetters[row][column] === '')

    this.state.userLetters[row][column] = key.toUpperCase();
    newState.userLetters = this.state.userLetters;
    let currentClue = crossword.getSelectedClue(this.state.clueDirection, row, column)

    if (crossword.hasEmptyCells() && (isCellEmpty || currentClue.isLastCell(row, column))) {
      let nextEmpty = crossword.nextEmptyCellWithinClue(currentClue, row, column)
      while (!nextEmpty) {
        currentClue = crossword.nextClue(currentClue)
        nextEmpty = crossword.nextEmptyCellWithinClue(currentClue, currentClue.row.end, currentClue.column.end)
      }
      newState.selectedCellRow = nextEmpty.row;
      newState.selectedCellColumn = nextEmpty.column;
    } else {
      if (currentClue.isLastCell(row, column)) {
        let nextClue = crossword.nextClue(currentClue)
        newState.selectedCellRow = nextClue.row.start;
        newState.selectedCellColumn = nextClue.column.start;
      } else {
        let nextCell = crossword.nextCellWithinClue(currentClue, row, column)
        newState.selectedCellRow = nextCell.row;
        newState.selectedCellColumn = nextCell.column;
      }
    }

    if (this.state.clueDirection !== currentClue.direction){
      newState.clueDirection = currentClue.direction();
    }

    return newState;
  }

  handleBackspace() {
    let newState = {}
    let row = this.state.selectedCellRow;
    let column = this.state.selectedCellColumn;
    let currentCellEmpty = (this.state.userLetters[row][column] === ' ')
    let crossword = new Crossword(this.state.grid, this.state.clues, this.state.userLetters)
    let currentClue = crossword.getSelectedClue(this.state.clueDirection, row, column)
    if (currentCellEmpty) {
      if ((currentClue.row.start === row) && (currentClue.column.start === column)) {
        currentClue = crossword.previousClue(currentClue);
        row = currentClue.row.end
        column = currentClue.column.end
      } else {
        if (this.state.clueDirection === 'across') {
          column -= 1;
        } else {
          row -= 1;
        }
      }
      newState.selectedCellRow = row;
      newState.selectedCellColumn = column;

      if (this.state.clueDirection !== currentClue.direction()){
        newState.clueDirection = currentClue.direction();
      }
    }

    this.state.userLetters[row][column] = ' ';
    newState.userLetters = this.state.userLetters;
    return newState;
  }
}

export default UserActionController;
