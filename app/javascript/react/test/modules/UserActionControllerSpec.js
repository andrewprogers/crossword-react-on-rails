import UserActionController from '../../src/modules/UserActionController'
import Crossword from '../../src/modules/Crossword';

class FakeState {
  constructor(grid) {
    if (grid === undefined) {
      this.grid =
      [['a','b','c','d'],
       ['e','f','.','h'],
       ['i','j','k','l'],
       ['m','n','o','.']];
    } else {
      this.grid = grid;
    }
    this.clues = {
      across: ['across1', 'across2'],
      down: ['down1', 'down2']
    }
    this.userLetters = Crossword.generateEmptyGrid(this.grid.length)
    this.selectedCellRow = 0;
    this.selectedCellColumn = 0;
    this.clueDirection = 'across';
    this.isSolved = false;
    this.editMode = false;
  }

  setCell(row, col) {
    this.selectedCellRow = row;
    this.selectedCellColumn = col;
    return;
  }
}

describe('UserActionController', () => {
  describe('.constructor', () => {
    let controller, fakeState
    beforeEach(() => {
      fakeState = new FakeState();
      controller = new UserActionController(fakeState)
    })

    it('creates a new UserActionController object', () => {
      expect(controller).toEqual(jasmine.any(UserActionController))
    })

    it('has a state property with copies of the application state', () => {
      expect(controller.state.grid).toEqual(fakeState.grid)
      expect(controller.state.grid).not.toBe(fakeState.grid)

      expect(controller.state.clues).toEqual(fakeState.clues)
      expect(controller.state.clues).not.toBe(fakeState.clues)

      expect(controller.state.userLetters).toEqual(fakeState.userLetters)
      expect(controller.state.userLetters).not.toBe(fakeState.userLetters)

      expect(controller.state.selectedCellRow).toEqual(jasmine.any(Number))
      expect(controller.state.selectedCellColumn).toEqual(jasmine.any(Number))
    })
  })

  describe('.keyPress returns an object for updating state', () => {
    let controller, grid, clues, fakeState
    beforeEach(() => {
      fakeState = new FakeState();
    })

    describe('backspace', () => {
      it('clears the current user letter when there is a letter in that cell', () => {
        fakeState.userLetters[0][0] = 'z'
        controller = new UserActionController(fakeState)
        let newState = controller.keyPress('Backspace');
        expect(newState.userLetters[0][0]).toEqual(' ')
      })

      it('does not update user letters once the puzzle is solved', () => {
        fakeState.isSolved = true
        let controller = new UserActionController(fakeState)
        expect(controller.keyPress('Backspace').userLetters).toBeUndefined()
      })

      describe('when direction is across and the current cell is blank', () => {
        beforeEach(() => {
          fakeState.clueDirection = 'across'
          fakeState.grid =
          [['.','.','c','d'],
           ['e','f','g','h'],
           ['i','j','k','.'],
           ['m','n','o','.']];
        })

        it('when not the first cell, deletes and selects previous cell in the current clue', () => {
          fakeState.setCell(2, 2)
          fakeState.userLetters[2][1] = 'a'
          controller = new UserActionController(fakeState);
          let newState = controller.keyPress('Backspace');
          expect(newState.userLetters[2][1]).toEqual(' ');
          expect(newState.selectedCellRow).toEqual(2);
          expect(newState.selectedCellColumn).toEqual(1);
        })
        it('when the first cell, deletes and selects last cell in previous clue', () => {
          fakeState.setCell(0, 2)
          fakeState.userLetters[3][1] = 'a'
          controller = new UserActionController(fakeState);
          let newState = controller.keyPress('Backspace');
          expect(newState.userLetters[3][1]).toEqual(' ');
          expect(newState.selectedCellRow).toEqual(3);
          expect(newState.selectedCellColumn).toEqual(1);
          expect(newState.clueDirection).toEqual('down');
        })
      })

      describe('when direction is down and the current cell is blank', () => {
        beforeEach(() => {
          fakeState.clueDirection = 'down'
          fakeState.grid =
          [['.','.','c','d'],
           ['e','f','g','h'],
           ['i','j','k','.'],
           ['m','n','o','.']];
        })

        it('when not the first cell, deletes and selects previous cell in the current clue', () => {
          fakeState.setCell(2, 2)
          fakeState.userLetters[1][2] = 'a'
          controller = new UserActionController(fakeState);
          let newState = controller.keyPress('Backspace');
          expect(newState.userLetters[1][2]).toEqual(' ');
          expect(newState.selectedCellRow).toEqual(1);
          expect(newState.selectedCellColumn).toEqual(2);
        })

        it('when the first cell, deletes and selects last cell in previous clue', () => {
          fakeState.setCell(0, 2)
          fakeState.userLetters[3][2] = 'a'
          controller = new UserActionController(fakeState);
          let newState = controller.keyPress('Backspace');
          expect(newState.userLetters[3][2]).toEqual(' ');
          expect(newState.selectedCellRow).toEqual(3);
          expect(newState.selectedCellColumn).toEqual(2);
          expect(newState.clueDirection).toEqual('across');
        })
      })
    })

    describe('spacebar', () => {
      it('changes clueDirection from across to down', () => {
        controller = new UserActionController(fakeState);
        let newState = controller.keyPress(' ');
        expect(newState.clueDirection).toEqual('down');
      })

      it('changes clueDirection from down to across', () => {
        fakeState.clueDirection = 'down'
        controller = new UserActionController(fakeState);
        let newState = controller.keyPress(' ');
        expect(newState.clueDirection).toEqual('across');
      })
    })

    describe('letter', () => {
      let newState;

      it('changes the letter in the current cell to the capital version of the pressed letter', () => {
        fakeState.userLetters[0][0] = 'z'
        let controller1 = new UserActionController(fakeState)
        newState = controller1.keyPress('f');
        expect(newState.userLetters[0][0]).toEqual('F');

        fakeState.userLetters[0][1] = 'e'
        fakeState.setCell(0, 1);
        let controller2 = new UserActionController(fakeState)
        newState = controller2.keyPress('G');
        expect(newState.userLetters[0][1]).toEqual('G');
      })

      describe('changes the selected cell', () => {
        describe('when clue direction is across', () => {
          beforeEach(() => {
            fakeState.clueDirection = 'across'
          });
          it('returns next cell within clue when there are no empty cells and not on last cell of clue', () => {
            fakeState.userLetters =
            [['a','b','c','d'],
             ['e','f','.','h'],
             ['i','j','k','l'],
             ['m','n','o','.']];
            fakeState.setCell(0, 0);
            controller = new UserActionController(fakeState);
            newState = controller.keyPress('a')
            expect(newState.selectedCellRow).toEqual(0)
            expect(newState.selectedCellColumn).toEqual(1)
          })
          it('returns first cell of next clue when there are no empty cells and on last cell of clue', () => {
            fakeState.userLetters =
            [['a','b','c','d'],
             ['e','f','.','h'],
             ['i','j','k','l'],
             ['m','n','o','.']];
            fakeState.setCell(1, 1);
            controller = new UserActionController(fakeState);
            newState = controller.keyPress('a')
            expect(newState.selectedCellRow).toEqual(1)
            expect(newState.selectedCellColumn).toEqual(3)
          })
          it('returns next cell in clue when current is not empty and not last in clue', () => {
            fakeState.userLetters =
            [['','b','c','d'],
             ['e','f','.','h'],
             ['i','j','k','l'],
             ['m','n','o','.']];
            fakeState.setCell(0, 2);
            controller = new UserActionController(fakeState);
            newState = controller.keyPress('a')
            expect(newState.selectedCellRow).toEqual(0)
            expect(newState.selectedCellColumn).toEqual(3)
          })
          it('returns next empty cell in clue if current is empty', () => {
            fakeState.userLetters =
            [['','b','','d'],
             ['e','f','.','h'],
             ['i','j','k','l'],
             ['m','n','o','.']];
            fakeState.setCell(0, 2);
            controller = new UserActionController(fakeState);
            newState = controller.keyPress('a')
            expect(newState.selectedCellRow).toEqual(0)
            expect(newState.selectedCellColumn).toEqual(0)
          })
          it('returns first empty cell from subsequent across clues when current cell empty', () => {
            fakeState.userLetters =
            [['a','b','','d'],
             ['e','f','.','h'],
             ['i','','k','l'],
             ['m','n','o','.']];
            fakeState.setCell(0, 2);
            controller = new UserActionController(fakeState);
            newState = controller.keyPress('a')
            expect(newState.selectedCellRow).toEqual(2)
            expect(newState.selectedCellColumn).toEqual(1)
          })
          it('returns first empty cell of down clues if none in subsequent across clues', () => {
            fakeState.userLetters =
            [['','b','','d'],
             ['e','f','.','h'],
             ['i','j','k','l'],
             ['m','','o','.']];
            fakeState.setCell(3, 1);
            controller = new UserActionController(fakeState);
            newState = controller.keyPress('a')
            expect(newState.selectedCellRow).toEqual(0)
            expect(newState.selectedCellColumn).toEqual(0)
            expect(newState.clueDirection).toEqual('down')
          })
        })
        describe('when clue direction is down', () => {
          beforeEach(() => {
            fakeState = new FakeState(
              [['a','b','c','.'],
               ['e','f','g','h'],
               ['i','j','k','l'],
               ['.','n','o','.']]
            )
            fakeState.clueDirection = 'down'
          });

          it('returns next cell within clue when there are no empty cells and not on last cell of clue', () => {
            fakeState.userLetters =
            [['a','b','c','.'],
             ['e','f','g','h'],
             ['i','j','k','l'],
             ['.','n','o','.']];
            fakeState.setCell(1, 1);
            controller = new UserActionController(fakeState);
            newState = controller.keyPress('a')
            expect(newState.selectedCellRow).toEqual(2)
            expect(newState.selectedCellColumn).toEqual(1)
          })
          it('returns first cell of next clue when there are no empty cells and on last cell of clue', () => {
            fakeState.userLetters =
            [['a','b','c','.'],
             ['e','f','g','h'],
             ['i','j','k','l'],
             ['.','n','o','.']];
            fakeState.setCell(3, 2);
            controller = new UserActionController(fakeState);
            newState = controller.keyPress('a')
            expect(newState.selectedCellRow).toEqual(1)
            expect(newState.selectedCellColumn).toEqual(3)
          })
          it('returns next cell in clue when current is not empty and not last in clue', () => {
            fakeState.userLetters =
            [['a','b','c','.'],
             ['e','f','g','h'],
             ['','j','k','l'],
             ['.','n','o','.']];
            fakeState.setCell(0, 0);
            controller = new UserActionController(fakeState);
            newState = controller.keyPress('a')
            expect(newState.selectedCellRow).toEqual(1)
            expect(newState.selectedCellColumn).toEqual(0)
          })
          it('returns next empty cell in clue if current is empty', () => {
            fakeState.userLetters =
            [['','b','c','.'],
             ['e','f','g','h'],
             ['','j','k','l'],
             ['.','n','o','.']];
            fakeState.setCell(0, 0);
            controller = new UserActionController(fakeState);
            newState = controller.keyPress('a')
            expect(newState.selectedCellRow).toEqual(2)
            expect(newState.selectedCellColumn).toEqual(0)
          })
          it('returns first empty cell from subsequent down clues when current cell empty', () => {
            fakeState.userLetters =
            [['a','b','','.'],
             ['e','f','g','h'],
             ['','j','k','l'],
             ['.','n','o','.']];
            fakeState.setCell(2, 0);
            controller = new UserActionController(fakeState);
            newState = controller.keyPress('a')
            expect(newState.selectedCellRow).toEqual(0)
            expect(newState.selectedCellColumn).toEqual(2)
          })
          it('returns first empty cell of across clues if none in subsequent down clues', () => {
            fakeState.userLetters =
            [['a','b','','.'],
             ['e','','g','h'],
             ['i','j','k','l'],
             ['.','n','o','.']];
            fakeState.setCell(0, 2);
            controller = new UserActionController(fakeState);
            newState = controller.keyPress('a')
            expect(newState.selectedCellRow).toEqual(1)
            expect(newState.selectedCellColumn).toEqual(1)
          })
        })
      })

      it('updates state when puzzle is solved', () => {
        fakeState.userLetters =
          [[' ','b','c','d'],
           ['e','f','','h'],
           ['i','j','k','l'],
           ['m','n','o','']];
        let controller1 = new UserActionController(fakeState)
        newState = controller1.keyPress('a');
        expect(newState.isSolved).toEqual(true);
      })

      it('does not update user letters once the puzzle is solved', () => {
        fakeState.isSolved = true
        let controller = new UserActionController(fakeState)
        expect(controller.keyPress('a').userLetters).toBeUndefined()
      })
    })

    describe('arrow keys', () => {
      let crossword
      beforeEach(() => {
        fakeState.setCell(2, 1);
        controller = new UserActionController(fakeState)
        crossword = new Crossword(fakeState.grid, fakeState.clues, fakeState.userLetters)
      })

      it('updates the cell position upward with ArrowUp', () => {
        let nextCell = crossword.nextCell('up', 2, 1)
        let expectedCell = {
          selectedCellRow: nextCell.row,
          selectedCellColumn: nextCell.column
        }
        let newState = controller.keyPress('ArrowUp');
        expect(newState).toEqual(expectedCell);
      })

      it('updates the cell position upward with ArrowDown', () => {
        let nextCell = crossword.nextCell('down', 2, 1)
        let expectedCell = {
          selectedCellRow: nextCell.row,
          selectedCellColumn: nextCell.column
        }
        let newState = controller.keyPress('ArrowDown');
        expect(newState).toEqual(expectedCell);
      })

      it('updates the cell position upward with ArrowLeft', () => {
        let nextCell = crossword.nextCell('left', 2, 1)
        let expectedCell = {
          selectedCellRow: nextCell.row,
          selectedCellColumn: nextCell.column
        }
        let newState = controller.keyPress('ArrowLeft');
        expect(newState).toEqual(expectedCell);
      })

      it('updates the cell position upward with ArrowRight', () => {
        let nextCell = crossword.nextCell('right', 2, 1)
        let expectedCell = {
          selectedCellRow: nextCell.row,
          selectedCellColumn: nextCell.column
        }
        let newState = controller.keyPress('ArrowRight');
        expect(newState).toEqual(expectedCell);
      })
    })
  })

  describe('.mouseClick returns an object for updating state', () => {
    let clickedCell, fakeState, controller
    beforeEach(() => {
      fakeState = new FakeState();
      clickedCell = {row: 1, column: 1};
    })

    it('updates clue direction when the current cell is clicked', () => {
      fakeState.setCell(1, 1);
      controller = new UserActionController(fakeState);
      let newState = controller.mouseClick(clickedCell, false);
      expect(newState).toEqual({clueDirection: 'down'})
    })

    it('updates selected cell when a new cell is clicked', () => {
      controller = new UserActionController(fakeState);
      let newState = controller.mouseClick(clickedCell, false);
      expect(newState).toEqual({
        selectedCellRow: 1,
        selectedCellColumn: 1
      })
    })

    it('does not update selected cell if a black cell is clicked', () => {
      controller = new UserActionController(fakeState);
      clickedCell = {row: 1, column: 2};
      let newState = controller.mouseClick(clickedCell, false);
      expect(newState).toEqual({})
    })

    it('updates the clicked cell to black (and reverse) when in edit mode and when metaKey is true', () => {
      fakeState.editMode = true
      controller = new UserActionController(fakeState);
      clickedCell = {row: 1, column: 2};
      let newState = controller.mouseClick(clickedCell, true);
      expect(newState.grid[1][2]).toEqual(' ')

      clickedCell = {row: 1, column: 1};
      newState = controller.mouseClick(clickedCell, true);
      expect(newState.grid[1][1]).toEqual('.')
    })

    it('maintains radial symmetry', () => {
      fakeState.editMode = true
      controller = new UserActionController(fakeState);
      clickedCell = {row: 1, column: 2};
      let newState = controller.mouseClick(clickedCell, true);
      expect(newState.grid[1][2]).not.toEqual('.')
      expect(newState.grid[2][1]).not.toEqual('.')

      clickedCell = {row: 1, column: 1};
      newState = controller.mouseClick(clickedCell, true);
      expect(newState.grid[1][1]).toEqual('.')
      expect(newState.grid[2][2]).toEqual('.')
    })

    it('moves selected cell to next open square when a black square is placed in it', () => {
      fakeState.editMode = true
      controller = new UserActionController(fakeState);
      clickedCell = {row: 0, column: 0};
      let newState = controller.mouseClick(clickedCell, true);
      expect(newState.grid[0][0]).toEqual('.')

      expect(newState.selectedCellRow).toEqual(0);
      expect(newState.selectedCellColumn).toEqual(1);
    })
  })

  describe('.clear', () => {
    let controller, newState;
    beforeEach(() => {
      controller = new UserActionController(new FakeState());
      newState = controller.clear()
    })

    it("returns a state with empty user letters", () => {
      expect(newState.userLetters).toEqual(Crossword.generateEmptyGrid(4))
    })

    it("resets is_solved to false", () => {
      expect(newState.isSolved).toEqual(false)
    })
  })
})
