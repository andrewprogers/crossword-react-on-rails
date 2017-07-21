class Clue {
  constructor(row, column, gridNum, text) {
    if (typeof row === 'number') {
      this.row = {start: row, end: row};
    } else {
      this.row = {start: row[0], end: row[1]};
    }

    if (typeof column === 'number') {
      this.column = {start: column, end: column};
    } else {
      this.column = {start: column[0], end: column[1]};
    }

    this.gridNum = gridNum;
    this.text = text;
    this.rowStart = this.row.start;
    this.rowEnd = this.row.end;
    this.columnStart = this.column.start;
    this.columnEnd = this.column.end;
  }

  isAcross() {
    return (this.column.end > this.column.start)
  }

  match(clue) {
    return ((this.rowStart === clue.rowStart)
           && (this.rowEnd === clue.rowEnd)
           && (this.columnStart === clue.columnStart)
           && (this.columnEnd === clue.columnEnd))
  }

  direction() {
    let result = ((this.isAcross()) ? 'across' : 'down')
    return result;
  }

  isLastCell(row, col) {
    let result = ((row === this.row.end) && (col === this.column.end))
    return result;
  }
}

export default Clue;
