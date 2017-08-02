import React from 'react';
import { mount, shallow } from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import PuzzleMenu from '../../src/containers/PuzzleMenu'
import MenuButton from '../../src/components/MenuButton'
import PuzzleTitle from '../../src/components/PuzzleTitle'

describe('PuzzleMenu', () => {
  let wrapper;
  let onSpies = jasmine.createSpyObj('on', ['handleClear']);

  beforeEach(() => {
    wrapper = mount(<PuzzleMenu on={onSpies} />)
  })

  it("should render a div#puzzle-menu", () => {
    expect(wrapper.find("div#puzzle-menu")).toBePresent();
  })

  it("should render a PuzzleTitle component", () => {
    expect(wrapper.find(PuzzleTitle)).toBePresent();
  })

  it("should render a Clear MenuButton with correct props", () => {
    expect(wrapper.find(MenuButton).props().name).toEqual("CLEAR")
    expect(wrapper.find(MenuButton).props().onClick).toEqual(onSpies.handleClear)
  })
})
