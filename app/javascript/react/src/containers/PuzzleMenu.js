import React from 'react';
import MenuButton from '../components/MenuButton'
import PuzzleTitle from '../components/PuzzleTitle'
import InfoContainer from '../components/InfoContainer'

class PuzzleMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      info: ""
    }
    this.matchPattern = this.matchPattern.bind(this);
  }

  matchPattern() {
    let row = this.props.selectedCellRow
    let col = this.props.selectedCellColumn
    let userPattern = this.props.crossword.getUserPattern(this.props.clueDirection, row, col)
    let matchPattern = userPattern.replace(/ /g, "?");
    let matchedWords = this.getMatchingWords(matchPattern)
    this.setState({info: `pattern: ${matchPattern}`})
  }

  getMatchingWords(pattern) {
    // fetch(`https://api.datamuse.com/words?sp=${pattern}`)
    // .then(response => {return response.ok ? response.json() : ""})
    // .then(json => console.log(json))
  }

  render() {
    let editModeButtons, infoSection;
    let columnClassNames = "small-12 columns"
    if (this.props.editMode) {
      editModeButtons = [
        <MenuButton key="PUBLISH" name="PUBLISH" onClick={this.props.on.publishPuzzle} />,
        <MenuButton key="MATCH" name="MATCH" onClick={this.matchPattern} />
      ]
      columnClassNames = "small-12 medium-6 columns";
      infoSection = <div className="small-12 medium-6 columns">
        <InfoContainer info={this.state.info} />
      </div>
    }


    return(
      <div id="puzzle-menu" className="row">
        <div className={columnClassNames}>
          <PuzzleTitle
            value={this.props.title}
            editMode={this.props.editMode}
            onChange={this.props.on.updateTitle} />
          <MenuButton name="CLEAR" onClick={this.props.on.handleClear} />
          {editModeButtons}
        </div>
        {infoSection}
      </div>
    )
  }
}

export default PuzzleMenu;
