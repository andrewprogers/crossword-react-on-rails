import React from 'react';
import MenuButton from '../components/MenuButton'
import PuzzleTitle from '../components/PuzzleTitle'

const PuzzleMenu = props => {
  return(
    <div id="puzzle-menu">
      <PuzzleTitle
        value={props.title}
        editMode={props.editMode}
        onChange={props.on.updateTitle} />
      <MenuButton name="CLEAR" onClick={props.on.handleClear} />
    </div>
  )
}

export default PuzzleMenu;
