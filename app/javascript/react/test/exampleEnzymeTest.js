import React from 'react';
import { mount } from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import ReactDummy from '../src/reactDummy'

describe('an enzyme test', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<ReactDummy />)
  })

  it('should pass', () => {
    expect(true).toBe(true)
  })

  it('should use enzyme', () => {
    expect(wrapper.find('h1').length).toBe(1)

  })

  it('should use jasmine-enzyme matchers', () => {
    expect(wrapper.find('h1')).toBePresent();
  })
})
