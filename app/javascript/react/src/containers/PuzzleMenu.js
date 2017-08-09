import React from 'react';
import MenuButton from '../components/MenuButton'
import PuzzleTitle from '../components/PuzzleTitle'
import InfoContainer from '../components/InfoContainer'

class PuzzleMenu extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      status: "Getting Started",
      words: []
    }
    this.matchPattern = this.matchPattern.bind(this);
  }

  matchPattern() {
    let row = this.props.selectedCellRow
    let col = this.props.selectedCellColumn
    let userPattern = this.props.crossword.getUserPattern(this.props.clueDirection, row, col)
    let matchPattern = userPattern.replace(/ /g, "?");
    let matchedWords = this.getMatchingWords(matchPattern)
    this.setState({status: `Searching: ${matchPattern}`})
  }

  getMatchingWords(pattern) {
    fetch(`${location.origin}/api/v1/words?pattern=${pattern}`)
    .then(response => {return response.ok ? response.json() : {words: []}})
    .then(json => json.words)
    .then(words => {
      let newState = {words: words}
      newState.status = (words.length > 0) ? "Matches" : "Couldn't match your pattern!"
      this.setState(newState)
    })
  }

  render() {
    let editOnlyButtons, playOnlyButtons, infoSection;
    let columnClassNames = "small-12 columns"
    if (this.props.editMode) {
      editOnlyButtons = [
        <MenuButton key="PUBLISH" name="PUBLISH" onClick={this.props.on.publishPuzzle} />,
        <MenuButton key="MATCH" name="MATCH" onClick={this.matchPattern} />
      ]
      columnClassNames = "small-12 medium-6 columns";
      infoSection = <div className="small-12 medium-6 columns">

        <InfoContainer
          status={this.state.status}
          words={this.state.words} />
      </div>
    } else {
      playOnlyButtons = [
        <MenuButton key="REVEAL" name="REVEAL" onClick={this.props.on.toggleReveal} active={this.props.puzzleRevealed} />
      ]
    }

    return(
      <div id="puzzle-menu" className="row">
        <div className={columnClassNames}>
          <PuzzleTitle
            value={this.props.title}
            editMode={this.props.editMode}
            onChange={this.props.on.updateTitle} />
          <MenuButton name="CLEAR" onClick={this.props.on.handleClear} />
          {editOnlyButtons}
          {playOnlyButtons}
        </div>
        {infoSection}
      </div>
    )
  }
}

export default PuzzleMenu;
