import React from 'react';
import { mount } from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import Timer from '../../src/components/Timer';

describe('Timer', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(
      <Timer
        seconds={63}
      />
    )
  })

  it('should recceive seconds as props', () => {
    expect(wrapper.props().seconds).toEqual(63)
  })

  it('should have a timer className', () => {
    expect(wrapper.find('.timer')).toBePresent()
  })

  it('should display time in the mm:ss format when seconds is less than 3600', () => {
    expect(wrapper.find('.timer').text()).toEqual('01:03')
  })

  it('should display time in the hh:mm:ss format when seconds is >= 3600', () => {
    let wrapper2 = mount(
      <Timer
        seconds={3665}
        loadDate={new Date()}
      />
    )
    expect(wrapper2.find('.timer').text()).toEqual('01:01:05')
  })
})
