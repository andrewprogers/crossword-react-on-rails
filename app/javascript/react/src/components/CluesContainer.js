import React from 'react';
import Clues from './Clues';
import CluesEditor from './CluesEditor'

class CluesContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidUpdate(prevProps, prevState) {
    let startingScrollY = window.scrollY;
    let selected = document.getElementsByClassName('selected');
    selected[0].scrollIntoView();
    scrollTo(0, startingScrollY);
  }

  render() {
    let acrossClues = this.props.crossword.getAcrossClues();
    let downClues = this.props.crossword.getDownClues();

    if (this.props.editMode) {
      return(
        <div id='clues-container'>
          <CluesEditor
            crossword={this.props.crossword}
            type='across'
            clues={acrossClues}
            on={this.props.on}
            />
          <CluesEditor
            crossword={this.props.crossword}
            type='down'
            clues={downClues}
            on={this.props.on}
            />
        </div>
      )
    } else {
      return (
        <div id='clues-container'>
          <div className="small-6 columns">
            <Clues
              crossword={this.props.crossword}
              type='across'
              clues={acrossClues}
              clueDirection={this.props.clueDirection}
              selectedCellRow={this.props.selectedCellRow}
              selectedCellColumn={this.props.selectedCellColumn}
              on={this.props.on}
              />
          </div>

          <div className="small-6 columns">
            <Clues
              crossword={this.props.crossword}
              type='down'
              clues={downClues}
              clueDirection={this.props.clueDirection}
              selectedCellRow={this.props.selectedCellRow}
              selectedCellColumn={this.props.selectedCellColumn}
              on={this.props.on}
              />
          </div>
        </div>
      )
    }
  }
}




export default CluesContainer;
