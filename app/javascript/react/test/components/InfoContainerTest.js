import React from 'react';
import { mount, shallow } from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import InfoContainer from '../../src/components/InfoContainer'

describe('InfoContainer', () => {
  let wrapper, words;

  beforeEach(() => {
    words =
      [{word: "stop", score: 212},
       {word: "step", score: 199}]
    wrapper = mount(<InfoContainer status={"SomeText"} words={words} />)
  })

  it('renders a div#info-container component', () => {
    expect(wrapper.find('div#info-container')).toBePresent();
  })

  it('displays the status passed to it', () => {
    expect(wrapper.text()).toMatch("SomeText");
  })

  it('displays the words passed to it', () => {
    expect(wrapper.text()).toMatch(words[0].word);
    expect(wrapper.text()).toMatch(words[1].word);
  })
})
