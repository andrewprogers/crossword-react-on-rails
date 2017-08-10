import React from 'react';
import CrosswordGrid from './CrosswordGrid';
import CluesContainer from './CluesContainer';
import Crossword from '../modules/Crossword'
import UserActionController from '../modules/UserActionController'
import PuzzleMenu from '../containers/PuzzleMenu'

class CrosswordContainer extends React.Component {
  constructor(props) {
    super(props);

    let puzzle = this.props.initialPuzzle
    let initialSolution, solutionString;
    let solveStatus = false, isDraftPuzzle = false;
    if ('user_id' in puzzle) {
      this.user_id = puzzle.user_id
      isDraftPuzzle = puzzle.draft
    }

    if (puzzle.solution_id) {
      this.solution_id = puzzle.solution_id
      initialSolution = Crossword.parseArrayToGrid(puzzle.user_solution);
      solveStatus = puzzle.is_solved
    } else {
      initialSolution = Crossword.generateEmptyGrid(puzzle.size.rows);
    }
    let initialGrid = Crossword.parseArrayToGrid(puzzle.grid);

    if (isDraftPuzzle) {
      initialSolution = Crossword.generateEmptyGrid(puzzle.size.rows);
      for (let row = 0; row < initialGrid.length; row++) {
        for (let col = 0; col < initialGrid.length; col++) {
          if (initialGrid[row][col] !== '.') {
            initialSolution[row][col] = initialGrid[row][col];
          }
        }
      }
    }

    let initialRow, initialCol;
    outerLoop:
      for (let row = 0; row < initialGrid.length; row++) {
        for (let col = 0; col < initialGrid.length; col++) {
          if (initialGrid[row][col] !== ".") {
            initialRow = row;
            initialCol = col;
            break outerLoop;
          }
        }
      }

    this.state = {
      grid: initialGrid,
      clues: puzzle.clues,
      userLetters: initialSolution,
      selectedCellRow: initialRow,
      selectedCellColumn: initialCol,
      clueDirection: "across",
      isSolved: solveStatus,
      editMode: isDraftPuzzle,
      puzzleTitle: puzzle.title,
      puzzleRevealed: false
    }

    this.on = {
      updateSelectedCell: this.updateSelectedCell.bind(this),
      changeClueDirection: this.changeClueDirection.bind(this),
      handleKeyDown: this.handleKeyDown.bind(this),
      handleMouseClick: this.handleMouseClick.bind(this),
      handleClear: this.handleClear.bind(this),
      updateTitle: this.updateTitle.bind(this),
      updateClues: this.updateClues.bind(this),
      publishPuzzle: this.publishPuzzle.bind(this),
      toggleReveal: this.toggleReveal.bind(this)
    }
  }

  refocus() {
    let hiddenInput = document.getElementById('hidden-input')
    if (hiddenInput !== null) {
      hiddenInput.focus()
    }
  }

  handleKeyDown(event) {
    let newState = (new UserActionController(this.state)).keyPress(event.key, event.shiftKey)
    this.setState(newState)
    this.refocus()
  }

  handleMouseClick(clickedCell, toggleBlack) {
    let controller = new UserActionController(this.state)
    this.setState(controller.mouseClick(clickedCell, toggleBlack))
    this.refocus()
  }

  updateSelectedCell(row, column) {
    this.setState({
      selectedCellRow: row,
      selectedCellColumn: column
    })
    this.refocus();
  }

  changeClueDirection(newDirection) {
    if (newDirection === undefined) {
      newDirection = (this.state.clueDirection === 'across') ? 'down' : 'across'
    }
    this.setState({clueDirection: newDirection})
  }

  handleClear() {
    let confirm = sweetAlert({
      title: "Clear Letters",
      text: "Are you sure you want to clear all letters?",
      type: "warning",
      showCancelButton: true
    }, () => {
      this.setState(new UserActionController(this.state).clear())
    })
    this.refocus()
  }

  updateTitle(value) {
    this.setState({puzzleTitle: value})
  }

  updateClues(clueUpdate) {
    let newClues = Object.assign({}, this.state.clues)
    if (clueUpdate.across !== undefined) {
      newClues.across = clueUpdate.across;
    } else {
      newClues.down = clueUpdate.down;
    }
    this.setState({clues: newClues})
  }

  toggleReveal() {
    this.setState({puzzleRevealed: !this.state.puzzleRevealed})
    this.refocus()
  }

  publishPayload() {
    let crossword = new Crossword(this.state.grid, this.state.clues, this.state.userLetters)
    let acrossNums = crossword.getAcrossClues().map(clue => clue.gridNum)
    let downNums = crossword.getDownClues().map(clue => clue.gridNum)
    let clueNumbers = { across: acrossNums, down: downNums }

    let acrossClues = crossword.getAcrossClues().map(clue => {
      let answer = ""
      for (var col = clue.column.start; col <= clue.column.end; col++) {
        answer += this.state.userLetters[clue.row.start][col]
      }
      return answer;
    })

    let downClues = crossword.getDownClues().map(clue => {
      let answer = ""
      for (var row = clue.row.start; row <= clue.row.end; row++) {
        answer += this.state.userLetters[row][clue.column.start]
      }
      return answer;
    })
    let clueAnswers = { across: acrossClues, down: downClues }
    return({
      method: "PATCH",
      credentials: "same-origin",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clue_numbers: clueNumbers,
        clue_answers: clueAnswers
      })
    })
  }

  publishPuzzle() {
    if (Crossword.validate(this.state.grid, this.state.clues, this.state.userLetters)) {
      fetch(this.apiEndpoint('publish'), this.publishPayload())
      .then(response => response.json())
      .then(json => {
        if (json.errors === undefined){
          location = `http://${location.host}/puzzles/${json.puzzle_id}`
        } else {
          sweetAlert({
            title: "Publish Error",
            text: "There was an error publishing your puzzle",
            type: "error"
          })
        }
      })
    } else {
      sweetAlert({
        title: "Incomplete",
        text: "Your puzzle is not yet complete! Please make sure to fill in all cells and clues",
        type: "error"
      })
    }
  }

  patchPayload() {
    let body;
    if (this.state.editMode) {
      let gridUpdate = Crossword.generateEmptyGrid(this.state.grid.length)
      for (var row = 0; row < this.state.grid.length; row++) {
        for (var col = 0; col < this.state.grid.length; col++) {
          if (this.state.grid[row][col] === ".") {
            gridUpdate[row][col] = '.'
          } else if (this.state.userLetters[row][col].match(/[A-Z]/)) {
            gridUpdate[row][col] = this.state.userLetters[row][col]
          } else {
            gridUpdate[row][col] = ' '
          }
        }
      }
      body = {
        grid_update: gridUpdate,
        title_update: this.state.puzzleTitle,
        clues_update: this.state.clues
      }
    } else {
      body = {
        user_solution: this.state.userLetters,
        is_solved: this.state.isSolved
      }
    }
    return {
      method: "PATCH",
      credentials: "same-origin",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }
  }

  apiEndpoint(mode) {
    let puzzle_id = location.pathname.split('/')[2]
    if (mode === 'publish'){
      return `/api/v1/puzzles/${puzzle_id}/publish`
    }
    let solution_api = `/api/v1/users/${this.user_id}/solutions/${this.solution_id}`
    let puzzles_api = `/api/v1/puzzles/${puzzle_id}`

    return this.state.editMode ? puzzles_api : solution_api
  }

  componentDidUpdate() {
    let payload = this.patchPayload()
    if(this.user !== null && payload) {
      fetch(this.apiEndpoint(), payload)
      .then(response => response.json())
    }
  }

  render() {
    let crossword = new Crossword(this.state.grid, this.state.clues, this.state.userLetters);
    return(
      <div id='crossword-container' className="row">
        <div className='small-12 columns'>
          <PuzzleMenu
            crossword={crossword}
            selectedCellRow={this.state.selectedCellRow}
            selectedCellColumn={this.state.selectedCellColumn}
            clueDirection={this.state.clueDirection}
            on={this.on}
            editMode={this.state.editMode}
            puzzleRevealed={this.state.puzzleRevealed}
            title={this.state.puzzleTitle} />
        </div>
        <div className='small-12 large-6 columns'>
          <CrosswordGrid
            crossword={crossword}
            selectedCellRow={this.state.selectedCellRow}
            selectedCellColumn={this.state.selectedCellColumn}
            clueDirection={this.state.clueDirection}
            puzzleRevealed={this.state.puzzleRevealed}
            on={this.on} />
        </div>
        <div className='small-12 large-6 columns'>
          <CluesContainer
            crossword={crossword}
            selectedCellRow={this.state.selectedCellRow}
            selectedCellColumn={this.state.selectedCellColumn}
            clueDirection={this.state.clueDirection}
            editMode={this.state.editMode}
            on={this.on} />
        </div>
      </div>
    )
  }
}

export default CrosswordContainer;
