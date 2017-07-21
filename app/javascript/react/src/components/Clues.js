import React from 'react';

const Clues = props => {
  let classString = 'clue-box unselectable';
  if (props.clueDirection === props.type) {
    classString += ' selected-clues';
  }

  let type = props.type
  let label = type.charAt(0).toUpperCase() + type.slice(1);

  let clueCell = props.crossword.getSelectedClue(props.clueDirection, props.selectedCellRow, props.selectedCellColumn);
  let selected = clueCell.gridNum;
  let clues = props.clues.map(clueObj => {
    let className = (selected === clueObj.gridNum) ? "selected" : "";
    let clickHandler = () => {
      props.on.updateSelectedCell(clueObj.row.start, clueObj.column.start)
      if (props.clueDirection !== props.type) {
        props.on.changeClueDirection(type)
      }
    }
    return(
      <li
        key={clueObj.text}
        onClick={clickHandler}
        className={className}>{clueObj.text}</li>
    )
  })

  return(
    <div className={classString}>
      <h3>{label}</h3>
      <div className='clues'>
        <ul>
          {clues}
        </ul>
      </div>
    </div>
  )
}

export default Clues;
