import React from 'react';
import { mount, shallow } from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import PuzzleMenu from '../../src/containers/PuzzleMenu'
import MenuButton from '../../src/components/MenuButton'
import PuzzleTitle from '../../src/components/PuzzleTitle'
import InfoContainer from '../../src/components/InfoContainer'
import TimerContainer from '../../src/containers/TimerContainer'

describe('PuzzleMenu', () => {
  let wrapper, matchSpy;
  let onSpies = jasmine.createSpyObj('on', ['handleClear', 'publishPuzzle', 'toggleReveal']);
  beforeEach(() => {
    wrapper = mount(
      <PuzzleMenu
        editMode={false}
        on={onSpies}
        loadDate={new Date()}
        seconds={0}
      />)
  })

  it("should render a div#puzzle-menu", () => {
    expect(wrapper.find("div#puzzle-menu")).toBePresent();
  })

  it("should render a PuzzleTitle component", () => {
    expect(wrapper.find(PuzzleTitle)).toBePresent();
  })

  it("should render a Clear MenuButton with correct props", () => {
    let clear = wrapper.find(MenuButton).filterWhere(n => n.prop('name') == "CLEAR")
    expect(clear).toBePresent()
    expect(clear.props().onClick).toEqual(onSpies.handleClear)
  })


  describe("when not in edit mode", () => {
    it("should render a TimerContainer component", () => {
      expect(wrapper.find(TimerContainer)).toBePresent();
    })

    it("should not render a Publish MenuButton", () => {
      let publish = wrapper.find(MenuButton).filterWhere(n => n.prop('name') == "PUBLISH")
      expect(publish).not.toBePresent()
    })

    it("should not render a Match MenuButton", () => {
      let match = wrapper.find(MenuButton).filterWhere(n => n.prop('name') == "MATCH")
      expect(match).not.toBePresent()
    })

    it('should not render an InfoContainer', () => {
      expect(wrapper.find(InfoContainer)).not.toBePresent();
    })

    it("should render a Reveal MenuButton", () => {
      let reveal = wrapper.find(MenuButton).filterWhere(n => n.prop('name') == "REVEAL")
      expect(reveal).toBePresent()
      expect(reveal.props().onClick).toEqual(jasmine.any(Function))
    })
  })

  describe("when in edit mode", () => {
    beforeEach(() => {
      wrapper = mount(<PuzzleMenu editMode={true} on={onSpies} />)
    })

    it("should not render a TimerContainer component", () => {
      expect(wrapper.find(TimerContainer)).not.toBePresent();
    })

    it("should render a Publish MenuButton with correct props", () => {
      let publish = wrapper.find(MenuButton).filterWhere(n => n.prop('name') == "PUBLISH")
      expect(publish).toBePresent()
      expect(publish.props().onClick).toEqual(onSpies.publishPuzzle)
    })

    it("should render a Match MenuButton", () => {
      let match = wrapper.find(MenuButton).filterWhere(n => n.prop('name') == "MATCH")
      expect(match).toBePresent()
      expect(match.props().onClick).toEqual(jasmine.any(Function))
    })

    it('should render an InfoContainer', () => {
      expect(wrapper.find(InfoContainer)).toBePresent();
    })

    it("should not render a Reveal MenuButton", () => {
      let reveal = wrapper.find(MenuButton).filterWhere(n => n.prop('name') == "REVEAL")
      expect(reveal).not.toBePresent()
    })
  })
})
