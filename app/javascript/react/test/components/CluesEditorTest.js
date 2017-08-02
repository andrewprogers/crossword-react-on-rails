import React from 'react';
import { mount } from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import CluesEditor from '../../src/components/CluesEditor';
import Crossword from '../../src/modules/Crossword';
import ClueEditorRow from '../../src/components/ClueEditorRow';

describe('CluesEditor', () => {
  let wrapper, onSpies, clues;
  beforeEach(() => {
    let square =
      [['a','.','c','d'],
       ['e','.','g','h'],
       ['i','j','k','l'],
       ['m','n','.','.']];
    let userSquare = Crossword.generateEmptyGrid(4);
    clues =
      {
        across: ['1. across1', '2. across2', '4. across3', '5. across4', '6. across5', '8. across6'],
        down: ['1. down1', '2. down2', '3. down3', '7. down4']
      }
    onSpies = jasmine.createSpyObj('on', ['updateSelectedCell', 'changeClueDirection', 'handleKeyDown', 'handleMouseClick', 'updateClues']);
    let crossword = new Crossword(square, clues, userSquare)
    wrapper = mount(
      <CluesEditor
        crossword={crossword}
        type='across'
        clues={crossword.getAcrossClues()}
        on={onSpies}
        />
    )
  })

  it('has an h3 to display the clue direction', () => {
    expect(wrapper.find('h3').text()).toEqual('Across')
  })

  it('has an div.clue-box tag', () => {
    expect(wrapper.find('div.clue-box')).toBePresent()
  })

  it('has an div.clue-box.unselectable tag', () => {
    expect(wrapper.find('div.clue-box.unselectable')).toBePresent()
  })

  it('displays one ClueEditorRow for each clue', () => {
    expect(wrapper.find(ClueEditorRow).length).toEqual(6)
  })

  it('renders a ClueEditorRow with the correct props', () => {
    let editRow = wrapper.find(ClueEditorRow).first()
    console.log()
    expect(editRow.props().gridnum).toEqual(1)
    expect(editRow.props().clueText).toEqual('1. across1')
    expect(editRow.props().onChange).toEqual(jasmine.any(Function))
  })

  it('calls updateClues when ClueEditorRow is changed', () => {
    let editRow = wrapper.find(ClueEditorRow).first()
    editRow.find('input').first().simulate('change')

    expect(onSpies.updateClues).toHaveBeenCalled();
  })
})
