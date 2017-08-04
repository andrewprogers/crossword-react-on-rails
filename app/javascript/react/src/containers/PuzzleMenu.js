import React from 'react';
import MenuButton from '../components/MenuButton'
import PuzzleTitle from '../components/PuzzleTitle'

const PuzzleMenu = props => {
  let editModeButtons;
  if (props.editMode) {
    editModeButtons = [
      <MenuButton key="PUBLISH" name="PUBLISH" onClick={props.on.publishPuzzle} />,
      <MenuButton key="MATCH" name="MATCH" onClick={props.on.matchPattern} />
    ]
  }


  return(
    <div id="puzzle-menu">
      <PuzzleTitle
        value={props.title}
        editMode={props.editMode}
        onChange={props.on.updateTitle} />
      <MenuButton name="CLEAR" onClick={props.on.handleClear} />
      {editModeButtons}
    </div>
  )
}

export default PuzzleMenu;
