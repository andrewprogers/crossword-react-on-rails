 import React from 'react';
import { mount } from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import Clues from '../../src/components/Clues';
import Crossword from '../../src/modules/Crossword'

describe('Clues', () => {
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
  let wrapper;
  let selRow = 0
  let selCol = 0
  let direction = 'across'
  let crossword = new Crossword(square, clues, userSquare)
  let acrossClues = crossword.getAcrossClues();
  beforeEach(() => {
    wrapper = mount(
      <Clues
        crossword={crossword}
        type='across'
        clues={acrossClues}
        clueDirection={direction}
        selectedCellRow={selRow}
        selectedCellColumn={selCol}
        on={onSpies}
        />
    )
  })

  it('renders a div with classname "clue-box unselectable"', () => {
    expect(wrapper.find('div.clue-box')).toBePresent();
    expect(wrapper.find('div.unselectable')).toBePresent();
  })

  it('renders a div with classname "selected-clues, ONLY when type matches clue direction"', () => {
    let wrapper2 = mount(
      <Clues
        crossword={crossword}
        type='down'
        clues={acrossClues}
        clueDirection={direction}
        selectedCellRow={selRow}
        selectedCellColumn={selCol}
        on={onSpies}
        />
    )
    expect(wrapper.find('div.selected-clues')).toBePresent()
    expect(wrapper2.find('div.selected-clues')).not.toBePresent()
  })

  it('renders a label with the type of clues', () => {
    expect(wrapper.find('h3').text()).toEqual('Across')
  })

  it('renders a div with className clues', () => {
    expect(wrapper.find('div.clues')).toBePresent();
  })

  it('renders a ul list of all the clues', () => {
    expect(wrapper.find('ul').children().length).toEqual(6)
  })

  it('renders an li for each clue with the clue text and an onClick callback function', () => {
    expect(wrapper.find('li').length).toEqual(6)
    expect(wrapper.find('li').first().text()).toEqual("1. across1")
    expect(wrapper.find('li').first().props().onClick).toEqual(jasmine.any(Function))
  })

  it('renders an li with classname selected for only the currently selected clue', () => {
    expect(wrapper.find('li').first().hasClass('selected')).toEqual(true)
    expect(wrapper.find('li').last().hasClass('selected')).toEqual(false)
  })
})
