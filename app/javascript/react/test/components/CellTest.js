import React from 'react';
import { mount } from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import Cell from '../../src/components/Cell';
import Crossword from '../../src/modules/Crossword'

describe('Cell', () => {
  let onSpies, square, userSquare, clues;
  onSpies = jasmine.createSpyObj('on', ['updateSelectedCell', 'changeClueDirection', 'handleKeyDown', 'handleMouseClick']);
  square =
    [['a','.','c','d'],
     ['e','.','g','h'],
     ['i','j','k','l'],
     ['m','n','.','.']];
  userSquare =
    [['a','.','c','d'],
     ['e','.','g','h'],
     ['i','j','k','l'],
     ['m','n','.','.']];
  clues =
    {
      across: ['across1', 'across2', 'across3', 'across4', 'across5', 'across6'],
      down: ['down1', 'down2', 'down3', 'down4']
    }

  describe('universal behaviors', () => {
    let crossword, wrapper;
    beforeEach(() => {
      crossword = new Crossword(square, clues, userSquare)
      let selRow = 0
      let selCol = 0
      let selClue = crossword.getSelectedClue('across', selRow, selCol)
      wrapper = mount(
        <Cell
          crossword={crossword}
          row={0}
          column={0}
          selectedCellRow={selRow}
          selectedCellColumn={selCol}
          selectedClue={selClue}
          on={onSpies}
           />)
    })

    it('should render a div with classes "cell and unselectable"', () => {
      expect(wrapper.find('div.cell')).toBePresent();
      expect(wrapper.find('div.unselectable')).toBePresent();
    })

    it('should render a div with classes "cell-number" and row', () => {
      expect(wrapper.find('div.cell-number')).toBePresent();
      expect(wrapper.find('div.row')).toBePresent();
    })

    it('should render a div with class "cell-letter"', () => {
      expect(wrapper.find('div.cell-letter')).toBePresent();
    })

    it('should render a div with keydown capture callback', () => {
      expect(wrapper.find('div.cell-letter').props().onKeyDownCapture).toEqual(onSpies.handleKeyDown)
    })
  })

  describe('when the cell has a "." in the grid position id\'d by the row and column', () => {
    let crossword, wrapper;
    beforeEach(() => {
      crossword = new Crossword(square, clues, userSquare)
      let selRow = 0
      let selCol = 0
      let selClue = crossword.getSelectedClue('across', selRow, selCol)
      wrapper = mount(
        <Cell
          crossword={crossword}
          row={0}
          column={1}
          selectedCellRow={selRow}
          selectedCellColumn={selCol}
          selectedClue={selClue}
          on={onSpies}
           />)
    })
    it('should render a div with a class name of "shaded"', () => {
      expect(wrapper.find('div.shaded')).toBePresent();
    })

    it('should render an div with value of empty string', () => {
      expect(wrapper.find('div.cell-letter').text()).toEqual("")
    })

    it('"div.cell" should have an onClick function', () => {
      expect(wrapper.find('div.cell').props().onClick).toEqual(jasmine.any(Function))
    })
  })

  describe('when the cell has " " or letter in the grid position id\'d by the row and column', () => {
    let crossword, wrapper;
    beforeEach(() => {
      crossword = new Crossword(square, clues, userSquare)
      let selRow = 0
      let selCol = 0
      let selClue = crossword.getSelectedClue('across', selRow, selCol)
      wrapper = mount(
        <Cell
          crossword={crossword}
          row={0}
          column={0}
          selectedCellRow={selRow}
          selectedCellColumn={selCol}
          selectedClue={selClue}
          on={onSpies}
           />)
    })

    it('should render a div with value of the userGrid for that coordinate', () => {
      expect(wrapper.find('div.cell-letter').text()).toEqual('a')
    })

    it('should render a div.cell with an onClick callback', () => {
      expect(wrapper.find('div.cell').props().onClick).toEqual(jasmine.any(Function))
    })

    it('should have a div.cell-number with grid Number when the number is not 0', () => {
      expect(wrapper.find('div.cell-number').text()).toEqual('1')
    })
  })

  describe('when the row and column indicate the cell is part of the selected clue, but not the selected cell', () => {
    let crossword, wrapper;
    beforeEach(() => {
      crossword = new Crossword(square, clues, userSquare)
      let selRow = 0
      let selCol = 0
      let selClue = crossword.getSelectedClue('down', selRow, selCol)
      wrapper = mount(
        <Cell
          crossword={crossword}
          row={1}
          column={0}
          selectedCellRow={selRow}
          selectedCellColumn={selCol}
          selectedClue={selClue}
          on={onSpies}
           />)
    })

    it('renders a div with class selectedClue, but not selectedCell', () => {
      expect(wrapper.find('div.selectedClue')).toBePresent();
      expect(wrapper.find('div.selectedCell')).not.toBePresent();
    })
  })

  describe('when the row and column indicate the cell selected', () => {
    let crossword, wrapper;
    beforeEach(() => {
      crossword = new Crossword(square, clues, userSquare)
      let selRow = 1
      let selCol = 0
      let selClue = crossword.getSelectedClue('down', selRow, selCol)
      wrapper = mount(
        <Cell
          crossword={crossword}
          row={1}
          column={0}
          selectedCellRow={selRow}
          selectedCellColumn={selCol}
          selectedClue={selClue}
          on={onSpies}
           />)
    })

    it('renders a div with class selectedClue and selectedCell', () => {
      expect(wrapper.find('div.selectedClue')).toBePresent();
      expect(wrapper.find('div.selectedCell')).toBePresent();
    })
  })

  describe('when puzzleRevealed is true', () => {
    let crossword, wrapper;
    beforeEach(() => {
      userSquare[0][0] = ' '
      userSquare[1][0] = 'Z'
      crossword = new Crossword(square, clues, userSquare)
      let selRow = 1
      let selCol = 0
      let selClue = crossword.getSelectedClue('down', selRow, selCol)
      wrapper = mount(
        <Cell
          crossword={crossword}
          row={0}
          column={0}
          selectedCellRow={selRow}
          selectedCellColumn={selCol}
          selectedClue={selClue}
          puzzleRevealed={true}
          on={onSpies}
           />)
    })

    it('renders a div with class revealedLetter if the user letter is not correct', () => {
      expect(wrapper.find('div.revealedLetter')).toBePresent();

      wrapper.setProps({row: 1})
      expect(wrapper.find('div.revealedLetter')).toBePresent();
    })

    it('does not render a div with class revealedLetter if the user letter is correct', () => {
      wrapper.setProps({row: 2})
      expect(wrapper.find('div.revealedLetter')).not.toBePresent();
    })

    it('displays the correct letter', () => {
      expect(wrapper.find('div.cell-letter').text()).toMatch('a')

      wrapper.setProps({row: 1})
      expect(wrapper.find('div.cell-letter').text()).toMatch('e')

      wrapper.setProps({row: 2})
      expect(wrapper.find('div.cell-letter').text()).toMatch('i')
    })
  })
})
