import React from 'react';
import Clues from './Clues';
import CluesEditor from './CluesEditor'

const CluesContainer = props => {
  let acrossClues = props.crossword.getAcrossClues();
  let downClues = props.crossword.getDownClues();

  if (props.editMode) {
    return(
      <div id='clues-container'>
        <CluesEditor
          crossword={props.crossword}
          type='across'
          clues={acrossClues}
          on={props.on}
          />
        <CluesEditor
          crossword={props.crossword}
          type='down'
          clues={downClues}
          on={props.on}
          />
      </div>
    )
  } else {
    return (
      <div id='clues-container'>
        <Clues
          crossword={props.crossword}
          type='across'
          clues={acrossClues}
          clueDirection={props.clueDirection}
          selectedCellRow={props.selectedCellRow}
          selectedCellColumn={props.selectedCellColumn}
          on={props.on}
          />
        <Clues
          crossword={props.crossword}
          type='down'
          clues={downClues}
          clueDirection={props.clueDirection}
          selectedCellRow={props.selectedCellRow}
          selectedCellColumn={props.selectedCellColumn}
          on={props.on}
          />
      </div>
    )
  }
}

export default CluesContainer;
