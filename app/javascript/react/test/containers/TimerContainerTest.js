import React from 'react';
import { mount, shallow } from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import TimerContainer from '../../src/containers/TimerContainer'
import Timer from '../../src/components/Timer'

describe(TimerContainer, () => {
  let wrapper;
  beforeEach(() => {
    let past = new Date(new Date() - 10 * 1000)
    wrapper = mount(<TimerContainer initialSeconds={63} loadDate={past} />)
  })

  it('renders a Timer component with seconds since load, plus initialSeconds', () => {
    expect(wrapper.find(Timer)).toBePresent();
    let seconds = wrapper.find(Timer).props().seconds
    expect(seconds >= 73).toEqual(true);
  })

  describe('elapsedSeconds()', () => {
    it('calculates time since load', () => {
      expect(wrapper.instance().elapsedSeconds(wrapper.props().loadDate) >= 10)
    })
  })
})
