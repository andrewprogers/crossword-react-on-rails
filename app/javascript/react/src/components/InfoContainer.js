import React from 'react';

const InfoContainer = props => {
  let defaultText = <span>
    Place black cells using shift-click <br></br>
    Enter the grid letters using the keyboard<br></br>
    Click on the clues to edit them <br></br>
    Use 'Match' to search for words that fit the highlighted pattern<br></br>
  When finished, click publish to make this puzzle playable<br></br>
  </span>

  if (props.status !== "Getting Started") {
    defaultText = null;
  }

  let wordsList, content;
  if (props.words.length > 0) {
    wordsList = props.words.map(word => {
      word = word.word.toUpperCase();
      let clickHandler = () => {
        props.onWordClick(word)
      }
      return(<li
        key={word}
        onClick={clickHandler}>
        {word}
      </li>)
    })
    content = <div className='words'><ul>{wordsList}</ul></div>
  } else if (props.wordData) {
    let dayStrings = []
    for (var day in props.wordData.days) {
      if (props.wordData.days.hasOwnProperty(day)) {
        dayStrings.push(day.slice(0, 1).toUpperCase() + `: ${props.wordData.days[day]}`)
      }
    }
    let frequencies = <span><b>Daily Frequencies:</b> {dayStrings.join(' ')}</span>
    let clues = props.wordData.clues.map((clue, idx) => <li key={idx}>{clue}</li>)
    content = <div>
      {frequencies}<br></br>
      <b>Difficulty:</b> {props.wordData.difficulty_score}
      <div className='info-list'>
        <ul>{clues}</ul>
      </div>
    </div>
  }

  return(
    <div id="info-container">
      <span className="title">{props.status}</span>
      <div>{defaultText}</div>
      {content}
    </div>
  )
}

export default InfoContainer;
