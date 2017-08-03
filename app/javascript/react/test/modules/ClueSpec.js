import Clue from '../../src/modules/Clue';

describe(Clue, () => {
  describe('constructor', () => {
    describe('accepts row and column arrays', () => {
      let row, column, clue
      beforeEach(() => {
        row = [1, 3]
        column = [2, 2]
        clue = new Clue(row, column, 2, "across clue")
      })

      it('creates a new clue object', () => {
        expect(clue).toEqual(jasmine.any(Clue))
      })

      it('has a row property', () => {
        expect(clue.row).toEqual({start: 1, end: 3})
      })

      it('has a column property', () => {
        expect(clue.column).toEqual({start: 2, end: 2})
      })

      it('has a gridNum property', () => {
        expect(clue.gridNum).toEqual(2)
      })

      it('has a text property', () => {
        expect(clue.text).toEqual("across clue")
      })

      it('has an optional answer property', () => {
        let answerClue = new Clue(row, column, 2, "across clue", "ANSWER")
        expect(answerClue.answer).toEqual("ANSWER")
      })

      it('has alias properties for row and column props', () => {
        expect(clue.rowStart).toEqual(1)
        expect(clue.rowEnd).toEqual(3)
        expect(clue.columnStart).toEqual(2)
        expect(clue.columnEnd).toEqual(2)
      })
    })

    describe('accepts row and column numbers', () => {
      let row, column, clue
      beforeEach(() => {
        row = 1
        column = 3
        clue = new Clue(row, column, 2, "across clue")
      })

      it('creates a new clue object', () => {
        expect(clue).toEqual(jasmine.any(Clue))
      })

      it('has a row property', () => {
        expect(clue.row).toEqual({start: 1, end: 1})
      })

      it('has a column property', () => {
        expect(clue.column).toEqual({start: 3, end: 3})
      })

      it('has a gridNum property', () => {
        expect(clue.gridNum).toEqual(2)
      })

      it('has a text property', () => {
        expect(clue.text).toEqual("across clue")
      })
    })

    describe('isAcross', () => {
      it('returns true when the clue is an across clue', () => {
        let clue = new Clue(2, [1, 3], 2, "some clue")
        expect(clue.isAcross()).toBe(true)
      })

      it('returns false when the clue is a down clue', () => {
        let clue = new Clue([1, 3], 2, 2, "some clue")
        expect(clue.isAcross()).toBe(false)
      })
    })

    describe('match', () => {
      it('returns true if this clue has the same dimensions as the clue argument', () => {
        let clue1 = new Clue([1, 3], 2, 2, "some clue")
        let clue2 = new Clue([1, 3], 2, 3, "some other clue")
        expect(clue1.match(clue2)).toBe(true)

        let clue3 = new Clue([0, 3], 2, 2, "some other clue")
        let clue4 = new Clue([0, 3], [2, 2], 4, "some other clue")
        expect(clue3.match(clue4)).toBe(true)
      })

      it('returns false if this clue has different dimesnions from the clue argument', () => {
        let clue3 = new Clue([0, 2], 2, 2, "some other clue")
        let clue4 = new Clue([0, 3], 2, 2, "some other clue")
        expect(clue3.match(clue4)).toBe(false)

        let clue5 = new Clue([0, 2], 3, 3, "some other clue")
        let clue6 = new Clue([0, 2], 2, 3, "some other clue")
        expect(clue5.match(clue6)).toBe(false)
      })
    })

    describe('direction', () => {
      it('returns across when the clue is an across clue', () => {
        let clue = new Clue(2, [1, 3], 2, "some clue")
        expect(clue.direction()).toEqual('across')
      })

      it('returns down when the clue is a down clue', () => {
        let clue = new Clue([1, 3], 2, 2, "some clue")
        expect(clue.direction()).toEqual('down')
      })
    })

    describe('isLastCell', () => {
      it('returns true if the given row and col are the last cell of the clue', () => {
        let clue = new Clue(2, [1, 3], 2, "some clue")
        let clue2 = new Clue([1, 3], 0, 2, "some clue")
        expect(clue.isLastCell(2, 3)).toEqual(true)
        expect(clue2.isLastCell(3, 0)).toEqual(true)
      })

      it('returns false if the given row and col are not the last cell of the clue', () => {
        let clue = new Clue(2, [1, 3], 2, "some clue")
        let clue2 = new Clue([1, 3], 0, 2, "some clue")
        expect(clue.isLastCell(1, 3)).toEqual(false)
        expect(clue2.isLastCell(3, 2)).toEqual(false)
      })
    })
  })
})
