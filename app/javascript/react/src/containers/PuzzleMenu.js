import React from 'react';
import MenuButton from '../components/MenuButton'
import PuzzleTitle from '../components/PuzzleTitle'
import InfoContainer from '../components/InfoContainer'


const PuzzleMenu = props => {
  let editModeButtons, infoSection;
  let columnClassNames = "small-12 columns"
  if (props.editMode) {
    editModeButtons = [
      <MenuButton key="PUBLISH" name="PUBLISH" onClick={props.on.publishPuzzle} />,
      <MenuButton key="MATCH" name="MATCH" onClick={props.on.matchPattern} />
    ]
    columnClassNames = "small-12 medium-6 columns";
    infoSection = <div className="small-12 medium-6 columns">
      <InfoContainer />
    </div>
  }


  return(
    <div id="puzzle-menu" className="row">
      <div className={columnClassNames}>
        <PuzzleTitle
          value={props.title}
          editMode={props.editMode}
          onChange={props.on.updateTitle} />
        <MenuButton name="CLEAR" onClick={props.on.handleClear} />
        {editModeButtons}
      </div>
      {infoSection}
    </div>
  )
}

export default PuzzleMenu;
