import React from 'react';

const Timer = ({seconds}) => {
  let date = new Date(seconds * 1000);
  let timeString = date.toISOString().slice(11, 19);
  if (seconds < 3600) {
    timeString = timeString.slice(3)
  }
  return(
    <span className='timer'>{timeString}</span>
  )
}

export default Timer;
