import React from 'react';
import Timer from '../components/Timer';

class TimerContainer extends React.Component {
  elapsedSeconds(before) {
    return Math.floor((new Date() - before) / 1000);
  }

  componentDidMount() {
    let interval = setInterval(() => {
      this.forceUpdate()
    }, 1000)
  }

  render() {
    let {initialSeconds, loadDate} = this.props
    let seconds = initialSeconds + this.elapsedSeconds(loadDate)
    return(
      <Timer
        seconds={seconds}
      />
    )
  }
}

export default TimerContainer;
