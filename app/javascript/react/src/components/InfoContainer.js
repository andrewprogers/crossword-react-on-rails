import React from 'react';

const InfoContainer = props => {
  let wordsList;
  if (props.words) {
    wordsList = props.words.map(word => <li key={word.word}>{word.word}</li>)
  }
  return(
    <div id="info-container">
      <span className="title">{props.status}</span>
      <div className="words">
        <ul>
          {wordsList}
        </ul>
      </div>
    </div>
  )
}

export default InfoContainer;
