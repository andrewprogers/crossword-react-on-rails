import React from 'react';
import { mount, shallow } from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import CrosswordContainer from '../../src/components/CrosswordContainer'
import CrosswordGrid from '../../src/components/CrosswordGrid'
import CluesContainer from '../../src/components/CluesContainer'
import PuzzleMenu from '../../src/containers/PuzzleMenu'

import Crossword from '../../src/modules/Crossword'
import UserActionController from '../../src/modules/UserActionController'
import mockData from '../constants/mockData'

describe('CrosswordContainer', () => {
  let wrapper;
  beforeEach(() => {
    spyOn(CrosswordContainer.prototype, 'componentDidUpdate')
  })

  it('assigns solution information when user is given', () => {
    let testData = Object.assign({}, mockData)
    testData.user_id = 3;
    testData.solution_id = 4;
    testData.user_solution = testData.grid
    testData.is_solved = true;
    wrapper = shallow(<CrosswordContainer initialPuzzle={testData} />)
    expect(wrapper.state().userLetters).toEqual(Crossword.parseArrayToGrid(testData.user_solution))
    expect(wrapper.state().isSolved).toEqual(true)
  })

  it('creates blank solution information when user is given', () => {
    wrapper = shallow(<CrosswordContainer initialPuzzle={mockData} />)
    expect(wrapper.state().userLetters).toEqual(Crossword.generateEmptyGrid(21))
  })

  it('should initialize state properties', () => {
    wrapper = shallow(<CrosswordContainer initialPuzzle={mockData} />)
    expect(wrapper.state().grid).toEqual(jasmine.any(Array));
    expect(wrapper.state().grid[0]).toEqual(jasmine.any(Array));
    expect(wrapper.state().grid).toEqual(Crossword.parseArrayToGrid(mockData.grid));

    expect(wrapper.state().clues).toEqual(jasmine.any(Object));
    expect(wrapper.state().clues).toEqual(mockData.clues);

    expect(wrapper.state().selectedCellRow).toEqual(0);
    expect(wrapper.state().selectedCellColumn).toEqual(0);
    expect(wrapper.state().clueDirection).toEqual('across');
    expect(wrapper.state().lastResponse).toBeUndefined();
    expect(wrapper.state().isSolved).toEqual(false);
    expect(wrapper.state().editMode).toEqual(false);
  })

  describe('patchPayload',() => {
    let payload

    it('returns a payload object', () => {
      wrapper = shallow(<CrosswordContainer initialPuzzle={mockData} />)
      payload = wrapper.instance().patchPayload()

      expect(payload.method).toEqual("PATCH")
      expect(payload.credentials).toEqual("same-origin")
      expect(payload.headers).toEqual({'Content-Type': 'application/json'})
      expect(payload.body).toBeDefined();
    })

    describe('when not in edit mode', () => {
      beforeEach(() => {
        let testData = Object.assign({}, mockData)
        testData.user_id = 3;
        testData.solution_id = 4;
        testData.user_solution = testData.grid
        testData.is_solved = true;

        wrapper = shallow(<CrosswordContainer initialPuzzle={testData} />)
        payload = wrapper.instance().patchPayload()
      })

      it("should send the user solution as an array", () => {
        let substring = JSON.stringify(wrapper.state().userLetters)
        expect(payload.body.indexOf(substring)).not.toEqual(-1)
      })

      it("should send the is_solved state", () => {
        let substring = JSON.stringify(wrapper.state().isSolved)
        expect(payload.body.indexOf(substring)).not.toEqual(-1)

        substring = "is_solved"
        expect(payload.body.indexOf(substring)).not.toEqual(-1)
      })
    })

    describe('when in edit mode', () => {
      let testData;

      beforeEach(() => {
        testData = Object.assign({}, mockData)
        testData.user_id = 3;
        testData.solution_id = 4;
        testData.user_solution = testData.grid
        testData.draft = true
        wrapper = shallow(<CrosswordContainer initialPuzzle={testData} />)
        wrapper.setState({
          size: 3,
          grid:
          [['.','.',''],
           ['.','','.'],
           ['','.','.']],
          userLetters:
          [['','','A'],
           ['','B',''],
           ['C','','']],
        })
      })

      it("should send the grid_update as an array", () => {
        payload = wrapper.instance().patchPayload()
        let substring = JSON.stringify(['..A'.split(''), '.B.'.split(''), 'C..'.split('')])

        expect(payload.body.indexOf(substring)).not.toEqual(-1)
        expect(payload.body.indexOf("grid_update")).not.toEqual(-1)
      })
    })
  })

  describe('apiEndpoint', () => {
    it('updates to solution api endpoint when not in edit mode', () => {
      wrapper = shallow(<CrosswordContainer initialPuzzle={mockData} />)
      let endpoint = wrapper.instance().apiEndpoint()

      expect(endpoint.indexOf('/solutions/')).not.toEqual(-1)
    })

    it('updates to puzzle api endpoint when in edit mode', () => {
      let testData = Object.assign({}, mockData)
      testData.user_id = 3;
      testData.solution_id = 4;
      testData.user_solution = testData.grid
      testData.draft = true
      wrapper = shallow(<CrosswordContainer initialPuzzle={testData} />)

      let endpoint = wrapper.instance().apiEndpoint()
      expect(endpoint.indexOf('/puzzles/')).not.toEqual(-1)
    })
  })

  describe('renders', () => {
    beforeEach(() => {
      wrapper = shallow(<CrosswordContainer initialPuzzle={mockData} />)
    })

    it('renders a crossword container div', () => {
      expect(wrapper.find('div#crossword-container')).toBePresent();
    })

    it('renders a crossword grid component', () => {
      expect(wrapper.find(CrosswordGrid)).toBePresent();
      expect(wrapper.find(CrosswordGrid).props().crossword).toEqual(new Crossword(Crossword.parseArrayToGrid(mockData.grid), mockData.clues, Crossword.generateEmptyGrid(21)))
    })

    it('renders a clues container component', () => {
      expect(wrapper.find(CluesContainer)).toBePresent();
      expect(wrapper.find(CluesContainer).props().crossword).toEqual(new Crossword(Crossword.parseArrayToGrid(mockData.grid), mockData.clues, Crossword.generateEmptyGrid(21)))
    })

    it('renders a PuzzleMenu container component with appropriate event handlers', () => {
      expect(wrapper.find(PuzzleMenu)).toBePresent();
      expect(wrapper.find(PuzzleMenu).props().on).toEqual(jasmine.objectContaining({
        handleClear: jasmine.any(Function)
      }))
    })
  })
})
