import React from 'react';
import { mount, shallow } from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import PuzzleTitle from '../../src/components/PuzzleTitle'

describe('PuzzleTitle', () => {
  let wrapper, spy;

  beforeEach(() => {
    spy = jasmine.createSpy("titleChange")
    wrapper = mount(<PuzzleTitle value={"My Puzzle"} editMode={false} onChange={spy} />)
  })

  it("should render a div#puzzle-title", () => {
    expect(wrapper.find("div#puzzle-title")).toBePresent();
  })

  it("should render an input#title-input", () => {
    expect(wrapper.find("input#title-input")).toBePresent();
  })

  describe("when editMode is false", () => {
    it("should not have the className .editable", () => {
      expect(wrapper.find(".editable")).not.toBePresent();
    })

    it("should not call the onChange prop when the input field is changed", () => {
      wrapper.find('input').simulate('change');
      expect(spy).not.toHaveBeenCalled();
    })
  })

  describe("when editMode is true", () => {
    let wrapper2;
    beforeEach(() => {
      wrapper2 = mount(<PuzzleTitle value={"My Puzzle"} editMode={true} onChange={spy} />)
    })

    it("should have the className .editable", () => {
      expect(wrapper2.find(".editable")).toBePresent();
    })

    it("should call the onChange prop when the input field is changed", () => {
      wrapper2.find('input').simulate('change');
      expect(spy).toHaveBeenCalled();
    })
  })
})
