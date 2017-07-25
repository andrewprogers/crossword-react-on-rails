import React from 'react';
import { mount } from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import CrosswordGrid from '../../src/components/CrosswordGrid'
import Crossword from '../../src/modules/Crossword'
import Cell from '../../src/components/Cell'


describe('CrosswordGrid', () => {
  beforeAll(() => {
    spyOn(CrosswordGrid.prototype, 'componentDidMount')
  })

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
  let crossword, wrapper;
  let selRow = 0
  let selCol = 0
  let direction = 'across'
  beforeEach(() => {
    crossword = new Crossword(square, clues, userSquare)
    wrapper = mount(
      <CrosswordGrid
        crossword={crossword}
        selectedCellRow={selRow}
        selectedCellColumn={selCol}
        clueDirection={direction}
        on={onSpies} />
    )
  })

  it('should render a div with className scale-container', () => {
    expect(wrapper.find('div.scale-container')).toBePresent()
  })

  it('should render a div with id grid-container', () => {
    expect(wrapper.find('div#grid-container')).toBePresent()
  })

  it('should render a Cell component for each member of the grid', () => {
    expect(wrapper.find(Cell).length).toEqual(crossword.grid.length ** 2)
  })

  it('should render Cells with the expected props', () => {
    let cell = wrapper.find(Cell).last()
    expect(cell.props()).toEqual({
      crossword: crossword,
      row: 3,
      column: 3,
      selectedCellRow: 0,
      selectedCellColumn: 0,
      selectedClue: crossword.getSelectedClue('across', selRow, selCol),
      on: onSpies
    })
  })
})
