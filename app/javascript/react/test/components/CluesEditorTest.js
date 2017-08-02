import React from 'react';
import { mount } from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import CluesEditor from '../../src/components/CluesEditor';
import Crossword from '../../src/modules/Crossword';

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

  it('has an textarea tag', () => {
    expect(wrapper.find('textarea')).toBePresent()
    expect(wrapper.find('textarea')).toBePresent()
  })

  describe('displayCluesAsText', () => {
    let clueText
    beforeEach(() => {
      clueText = wrapper.instance().displayCluesAsText()
    })

    it('returns a string with a line for each clue', () => {
      expect(clueText.split("\n").length).toEqual(clues.across.length)
    })

    it('starts the string with the correct gridnum', () => {
      expect(clueText.split("\n")[1].charAt(0)).toEqual('2')
    })

    it('includes the clue text', () => {
      let str = clues.across[1]
      expect(clueText.split("\n")[1].indexOf(str)).not.toEqual(-1)
    })
  })

  it('calls updateClues callback when text area is changed', () => {
    wrapper.find('textarea').simulate('change')
    expect(onSpies.updateClues).toHaveBeenCalledWith({across: clues.across});
  })
})
