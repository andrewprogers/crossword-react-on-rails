import React from 'react';
import ClueEditorRow from './ClueEditorRow'

class CluesEditor extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let classString = 'clue-box unselectable';
    let type = this.props.type
    if (this.props.clueDirection === type) {
      classString += ' selected-clues';
    }
    let label = type.charAt(0).toUpperCase() + type.slice(1);

    let clueEditorRows = this.props.clues.map((clue, index) => {
      let changeHandler = (event) => {
        console.log("hi")
        let newClues = this.props.clues.map(clue => clue.text)
        newClues[index] = event.target.value
        this.props.on.updateClues(
          (this.props.type === 'across') ? { across: newClues } : { down: newClues }
        )
      }

      return (
        <ClueEditorRow
          key={clue.gridNum}
          gridnum={clue.gridNum}
          clueText={clue.text}
          onChange={changeHandler}/>
      );
    })

    return(
      <div className={classString}>
        <h3>{label}</h3>
        {clueEditorRows}
      </div>
    )
  }
}

export default CluesEditor;

// const CluesEditor = props => {
//
//   let clueCell = props.crossword.getSelectedClue(props.clueDirection, props.selectedCellRow, props.selectedCellColumn);
//   let selected = clueCell.gridNum;
//   let clues = props.clues.map(clueObj => {
//     let className = (selected === clueObj.gridNum) ? "selected" : "";
//     let clickHandler = () => {
//       props.on.updateSelectedCell(clueObj.row.start, clueObj.column.start)
//       if (props.clueDirection !== props.type) {
//         props.on.changeClueDirection(type)
//       }
//     }
//     return(
//       <li
//         key={clueObj.text}
//         onClick={clickHandler}
//         className={className}>{clueObj.text}</li>
//     )
//   })
//
// }
