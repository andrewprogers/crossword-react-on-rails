import React from 'react';

const InfoContainer = props => {
  let defaultText = <span>
    Place black cells using option-click <br></br>
    Enter the grid letters using the keyboard<br></br>
    Click on the clues to edit them <br></br>
    Use 'Match' to search for words that fit the highlighted pattern<br></br>
  When finished, click publish to make this puzzle playable<br></br>
  </span>

  if (props.status !== "Getting Started") {
    defaultText = null;
  }

  let wordsList, defaultDisplay;
  if (props.words.length > 0) {
    wordsList = props.words.map(word => <li key={word.word}>{word.word}</li>)
  } else {
    defaultDisplay = defaultText;
  }
  return(
    <div id="info-container">
      <span className="title">{props.status}</span>
      <div>{defaultText}</div>
      <div className="words">
        <ul>
          {wordsList}
        </ul>
      </div>
    </div>
  )
}

export default InfoContainer;
