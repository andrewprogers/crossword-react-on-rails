import React from 'react';
import { mount, shallow } from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import MenuButton from '../../src/components/MenuButton'

describe('MenuButton', () => {
  let wrapper;
  let handleClear = jasmine.createSpy('handleClear');

  beforeEach(() => {
    wrapper = mount(<MenuButton name={"Clear"} onClick={handleClear} />)
  })

  it("should render a div.menu-button", () => {
    expect(wrapper.find("div.menu-button")).toBePresent();
  })

  it("should have an onclick function attached to the div", () => {
    expect(wrapper.find("div.menu-button").props().onClick).toEqual(handleClear)
  })

  it("should contain the text of the button name", () => {
    expect(wrapper.text()).toMatch("Clear")
  })
})
