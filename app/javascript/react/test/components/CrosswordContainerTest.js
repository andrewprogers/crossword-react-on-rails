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

  describe('publishPayload', () => {
    let payload;
    it('returns a payload object', () => {
      wrapper = shallow(<CrosswordContainer initialPuzzle={mockData} />)
      payload = wrapper.instance().publishPayload()

      expect(payload.method).toEqual("PATCH")
      expect(payload.credentials).toEqual("same-origin")
      expect(payload.headers).toEqual({'Content-Type': 'application/json'})
      expect(payload.body).toBeDefined();
    })

    it('has a body with a clue_numbers object', () => {
      wrapper = shallow(<CrosswordContainer initialPuzzle={mockData} />)
      payload = wrapper.instance().publishPayload()

      expect(JSON.parse(payload.body).clue_numbers).toEqual({
        across: [ 1, 4, 8, 14, 19, 21, 22, 23, 25, 26, 27, 28, 29, 31, 32, 35, 36, 37, 40, 41, 43, 45, 47, 49, 52, 53, 56, 59, 60, 62, 63, 64, 65, 67, 68, 70, 72, 74, 75, 77, 79, 80, 82, 83, 84, 85, 86, 87, 90, 93, 94, 98, 99, 101, 103, 104, 105, 108, 110, 112, 113, 115, 116, 117, 121, 122, 123, 124, 125, 126, 127 ],
        down: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 24, 30, 33, 34, 38, 39, 42, 44, 46, 48, 50, 51, 54, 55, 56, 57, 58, 61, 62, 64, 65, 66, 69, 71, 73, 76, 78, 81, 83, 84, 86, 88, 89, 91, 92, 95, 96, 97, 98, 100, 102, 104, 106, 107, 109, 111, 114, 118, 119, 120 ]
      })
    })
  })

  describe('patchPayload',() => {
    let payload;
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

      it("should send the puzzle title", () => {
        let substring = mockData.title;
        expect(payload.body.indexOf(substring)).not.toEqual(-1)
      })
    })
  })

  describe('apiEndpoint', () => {
    it('provides the publish api when given "publish" as a mode argument', () => {
      wrapper = shallow(<CrosswordContainer initialPuzzle={mockData} />)
      let endpoint = wrapper.instance().apiEndpoint("publish")

      expect(endpoint.indexOf('/puzzles/')).not.toEqual(-1)
      expect(endpoint.indexOf('/publish')).not.toEqual(-1)
    })

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
      expect(endpoint.indexOf('/publish/')).toEqual(-1)

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
