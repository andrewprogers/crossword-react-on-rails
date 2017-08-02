import React from 'react';

const ClueEditorRow = props => {
  let displayNumber = props.gridnum.toString().padStart(3, "\u00A0")
  return(
    <div className="clue-editor-row">
      <span className="clue-gridnum">{displayNumber}.</span>
      <input
        onChange={props.onChange}
        value={props.clueText}></input>
    </div>
  )
}

export default ClueEditorRow;
