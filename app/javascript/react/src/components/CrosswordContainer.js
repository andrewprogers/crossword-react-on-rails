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
    let solveStatus = false;
    if ('user_id' in puzzle) {
      this.user_id = puzzle.user_id
      this.solution_id = puzzle.solution_id
      initialSolution = Crossword.parseArrayToGrid(puzzle.user_solution);
      solveStatus = puzzle.is_solved
    } else {
      initialSolution = Crossword.generateEmptyGrid(puzzle.size.rows)
    }

    this.state = {
      grid: Crossword.parseArrayToGrid(puzzle.grid),
      clues: puzzle.clues,
      userLetters: initialSolution,
      selectedCellRow: 0,
      selectedCellColumn: 0,
      clueDirection: "across",
      lastReturnedSolution: puzzle.user_solution,
      isSolved: solveStatus
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

  handleMouseClick(clickedCell) {
    let controller = new UserActionController(this.state)
    this.setState(controller.mouseClick(clickedCell))
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
      // DO a thing
    }
  }

  componentDidMount() {
    if (this.user !== null) {
      this.persistenceInterval = setInterval(() => {
        if (JSON.stringify(this.state.lastReturnedSolution) !== JSON.stringify(this.state.userLetters)) {
          fetch(`/api/v1/users/${this.user_id}/solutions/${this.solution_id}`, {
            method: "PATCH",
            credentials: "same-origin",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              user_solution: this.state.userLetters,
              is_solved: this.state.isSolved
            })
          })
          .then(response => response.json())
          .then(json => {
            this.setState({ lastReturnedSolution: json.user_answers})
          })
        }
      }, 1000)
    }
  }

  componentWillUnmount() {
    clearInterval(this.persistenceInterval)
  }

  render() {
    let crossword = new Crossword(this.state.grid, this.state.clues, this.state.userLetters);
    return(
      <div id='crossword-container' className="row">
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
