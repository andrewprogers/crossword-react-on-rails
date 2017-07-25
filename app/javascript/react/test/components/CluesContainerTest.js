import React from 'react';
import { mount } from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import CluesContainer from '../../src/components/CluesContainer';
import Clues from '../../src/components/Clues';
import Crossword from '../../src/modules/Crossword'

describe('CluesContainer', () => {
  let wrapper;
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
  let crossword = new Crossword(square, clues, userSquare)
  let selRow = 0
  let selCol = 0
  let direction = 'across'
  beforeEach(() => {
    wrapper = mount(
      <CluesContainer
        crossword={crossword}
        selectedCellRow={selRow}
        selectedCellColumn={selCol}
        clueDirection={direction}
        on={onSpies} />
    )
  })

  it('renders a div with className clues-container', () => {
    expect(wrapper.find('div#clues-container')).toBePresent();
  })

  it('renders a clue component for each type of clues, across and down', () => {
    expect(wrapper.find(Clues).length).toEqual(2)
    expect(wrapper.find(Clues).first().props().type).toEqual('across')
    expect(wrapper.find(Clues).last().props().type).toEqual('down')
  })

  it('renders across Clues with the appropriate props', () => {
    let acrossClues = crossword.getAcrossClues()
    expect(wrapper.find(Clues).first().props()).toEqual({
      crossword: crossword,
      type: 'across',
      clues: acrossClues,
      clueDirection: direction,
      selectedCellRow: selRow,
      selectedCellColumn: selCol,
      on: onSpies
    })
  })
})
