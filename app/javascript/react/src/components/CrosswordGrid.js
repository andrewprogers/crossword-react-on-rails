import React from 'react';
import Cell from './Cell';
import {createRelativeFontUpdater, getCustomSheetUpdater} from '../modules/dynamicFont'

class CrosswordGrid extends React.Component {
  constructor(props) {
    super(props);
  }

  createCells() {
    let selectedClue = this.props.crossword.getSelectedClue(this.props.clueDirection, this.props.selectedCellRow, this.props.selectedCellColumn)
    let cells = this.props.crossword.userLetters.map((row, rIndex) => {
      let cellRow = row.map((letter, cIndex) => {
        let selected = ((this.props.selectedCellRow === rIndex) && (this.props.selectedCellColumn === cIndex))
        return(
          <Cell
            key={rIndex + " " + cIndex}
            crossword={this.props.crossword}
            row={rIndex}
            column={cIndex}
            selectedCellRow={this.props.selectedCellRow}
            selectedCellColumn={this.props.selectedCellColumn}
            selectedClue={selectedClue}
            puzzleRevealed={this.props.puzzleRevealed}
            on={this.props.on}
             />
         )
      }, this)
      return cellRow;
    }, this)
    return cells;
  }

  componentDidMount() {
    let gridElement = document.getElementById('grid-container');
    let cellFontUpdater = createRelativeFontUpdater(gridElement, '#grid-container .cell', 1.3 * this.props.crossword.grid.length);
    cellFontUpdater();
    window.addEventListener('resize', cellFontUpdater);

    let updateSheet = getCustomSheetUpdater();
    let pctWidth = (100 / this.props.crossword.grid.length);
    updateSheet(`#grid-container .cell { width: ${pctWidth}%;}`);

    let secondCell = document.getElementsByClassName('cell-letter')[1]
    secondCell.focus()
  }

  componentDidUpdate() {
    let secondCell = document.getElementsByClassName('cell-letter')[1]
    secondCell.focus()
  }

  render() {
    let cells = this.createCells();
    return(
      <div className="scale-container">
        <div id="grid-container">
          {cells}
        </div>
      </div>
    )
  }
}

export default CrosswordGrid;
