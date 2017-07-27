import React, { Component } from 'react';
import CrosswordContainer from './components/CrosswordContainer'
import data from './constants/exampleCrossword'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      puzzleData: data,
      puzzleLoaded: false
    }
  }

  fetchPuzzleData(id) {
    fetch(`/api/v1/puzzles/${id}`)
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        throw new Error(`Cannot retrieve data for puzzle ${id}`)
      }
    })
    .then(response => response.json())
    .then(json => json.puzzle)
    .then(puzzle => {
      this.setState({
        puzzleData: puzzle,
        puzzleLoaded: true
      })
    })
    .catch(err => console.error(err.message))
  }

  componentDidMount() {
    let path = location.pathname.split('/')
    let puzzle_id = path[path.indexOf('puzzles') + 1]
    this.fetchPuzzleData(puzzle_id)
  }

  render() {
    let content = "";
    if (this.state.puzzleLoaded) {
      content = <CrosswordContainer initialPuzzle={this.state.puzzleData} />
    }
    
    return (
      <div className="App">
        {content}
      </div>
    );
  }
}

export default App;
