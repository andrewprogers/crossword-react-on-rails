import React from 'react';

const InfoContainer = props => {
  let wordsList;
  if (props.words) {
    wordsList = props.words.map(word => <li key={word.word}>{word.word}</li>)
  }
  return(
    <div id="info-container">
      <p>{props.status}</p>
      <ul>
        {wordsList}
      </ul>
    </div>
  )
}

export default InfoContainer;
