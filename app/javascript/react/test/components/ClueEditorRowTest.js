import React from 'react';
import { mount } from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import ClueEditorRow from '../../src/components/ClueEditorRow';

describe('ClueEditorRow', () => {
  let wrapper, spy;

  beforeEach(() => {
    spy = jasmine.createSpy('onChange')
    wrapper = mount(
      <ClueEditorRow
        gridnum={1}
        clueText={"across clue"}
        onChange={spy} />
      )
  })

  it('should have a div.clue-editor-row', () => {
    expect(wrapper.find('div.clue-editor-row')).toBePresent();
  })

  it('should have a span.clue-gridnum with properly formatted clue number', () => {
    expect(wrapper.find('span.clue-gridnum')).toBePresent();
    expect(wrapper.find('span.clue-gridnum').first().text()).toMatch("1.")
    expect(wrapper.find('span.clue-gridnum').first().text().length).toEqual(4)
  })

  it('should have an input field with clueText which calls onChange on change', () => {
    expect(wrapper.find('input')).toBePresent();
    expect(wrapper.find('input').first().props().value).toEqual("across clue");

    wrapper.find('input').first().simulate('change')
    expect(spy).toHaveBeenCalled();
  })
})
