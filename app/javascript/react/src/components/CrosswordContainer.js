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
      this.solution_id = puzzle.solution_id
      initialSolution = Crossword.parseArrayToGrid(puzzle.user_solution);
      solveStatus = puzzle.is_solved
      isDraftPuzzle = puzzle.draft
    } else {
      initialSolution = Crossword.generateEmptyGrid(puzzle.size.rows);
    }
    let initialGrid = Crossword.parseArrayToGrid(puzzle.grid);

    if (puzzle.draft) {
      // load letters from grid into initialSolution
      initialSolution = Crossword.generateEmptyGrid(puzzle.size.rows);
      for (var row = 0; row < initialGrid.length; row++) {
        for (var col = 0; col < initialGrid.length; col++) {
          if (initialGrid[row][col] !== '.') {
            initialSolution[row][col] = initialGrid[row][col];
          }
        }
      }
    }

    // Determine start cell
    let initialRow, initialCol;
    outerLoop:
      for (var row = 0; row < initialGrid.length; row++) {
        for (var col = 0; col < initialGrid.length; col++) {
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
      lastReturnedSolution: puzzle.user_solution,
      isSolved: solveStatus,
      editMode: isDraftPuzzle
    }

    this.on = {
      updateSelectedCell: this.updateSelectedCell.bind(this),
      changeClueDirection: this.changeClueDirection.bind(this),
      handleKeyDown: this.handleKeyDown.bind(this),
      handleMouseClick: this.handleMouseClick.bind(this),
      handleClear: this.handleClear.bind(this)
    }
  }

  handleKeyDown(event) {
    let newState = (new UserActionController(this.state)).keyPress(event.key)
    this.setState(newState)
  }

  handleMouseClick(clickedCell, metaKey) {
    let controller = new UserActionController(this.state)
    this.setState(controller.mouseClick(clickedCell, metaKey))
  }

  updateSelectedCell(row, column) {
    this.setState({
      selectedCellRow: row,
      selectedCellColumn: column
    })
  }

  changeClueDirection(newDirection) {
    if (newDirection === undefined) {
      newDirection = (this.state.clueDirection === 'across') ? 'down' : 'across'
    }
    this.setState({clueDirection: newDirection})
  }

  handleClear() {
    if (confirm("This will clear your entire solution. Are you sure?")) {
      this.setState(new UserActionController(this.state).clear())
    }
  }

  patchPayload() {
    let body = null;
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

      if (JSON.stringify(gridUpdate) !== JSON.stringify(this.state.lastReturnedSolution)) {
        body = { grid_update: gridUpdate }
      }
    } else if (JSON.stringify(this.state.lastReturnedSolution) !== JSON.stringify(this.state.userLetters)) {
      body = {
        user_solution: this.state.userLetters,
        is_solved: this.state.isSolved
      }
    }

    if (body) {
      return {
        method: "PATCH",
        credentials: "same-origin",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
    } else {
      return false;
    }
  }

  apiEndpoint() {
    let solution_api = `/api/v1/users/${this.user_id}/solutions/${this.solution_id}`
    let puzzles_api = `/api/v1/puzzles/${location.pathname.split('/')[2]}`

    return this.state.editMode ? puzzles_api : solution_api
  }

  setLastReturned(json_response) {
    if (this.state.editMode) {
      console.log(json_response.grid)
      this.setState({ lastReturnedSolution: json_response.grid })
    } else {
      this.setState({ lastReturnedSolution: json_response.user_answers })
    }
  }

  componentDidMount() {
    if (this.user !== null) {
      this.persistenceInterval = setInterval(() => {
        let payload = this.patchPayload()
        if (payload) {
          fetch(this.apiEndpoint(), this.patchPayload())
          .then(response => response.json())
          .then(json => this.setLastReturned(json))
        }
      }, 1000)
    }
  }

  componentWillUnmount() {
    clearInterval(this.persistenceInterval)
  }

  render() {
    let crossword = new Crossword(this.state.grid, this.state.clues, this.state.userLetters);
    let notice = this.state.editMode ? "Edit mode active" : ""
    return(
      <div id='crossword-container' className="row">
        <h4>{notice}</h4>
        <div className='small-12 columns'><PuzzleMenu on={this.on} /></div>
        <div className='small-12 large-6 columns'>
          <CrosswordGrid
            crossword={crossword}
            selectedCellRow={this.state.selectedCellRow}
            selectedCellColumn={this.state.selectedCellColumn}
            clueDirection={this.state.clueDirection}
            on={this.on} />
        </div>
        <div className='small-12 large-6 columns'>
          <CluesContainer
            crossword={crossword}
            selectedCellRow={this.state.selectedCellRow}
            selectedCellColumn={this.state.selectedCellColumn}
            clueDirection={this.state.clueDirection}
            on={this.on} />
        </div>
      </div>
    )
  }
}

export default CrosswordContainer;
