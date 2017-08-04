import React from 'react';
import { mount, shallow } from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import InfoContainer from '../../src/components/InfoContainer'

describe('InfoContainer', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<InfoContainer />)
  })

  it('renders a div#info-container component', () => {
    expect(wrapper.find('div#info-container')).toBePresent();
  })
})
