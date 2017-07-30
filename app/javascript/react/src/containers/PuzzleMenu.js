import React from 'react';
import MenuButton from '../components/MenuButton'

const PuzzleMenu = props => {
  return(
    <div id="puzzle-menu">
      <MenuButton name="Clear" onClick={props.on.handleClear} />
    </div>
  )
}

export default PuzzleMenu;
