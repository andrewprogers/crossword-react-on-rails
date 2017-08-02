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
