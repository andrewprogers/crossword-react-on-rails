import React from 'react';

const PuzzleTitle = props => {
  let changeHandler = () => {}
  let inputClass;

  if (props.editMode) {
    changeHandler = (event) => {
      props.onChange(event.target.value);
    }
    inputClass = "editable"
  }

  return(
    <div id="puzzle-title" >
      <input
        type="text"
        id="title-input"
        value={props.value}
        className={inputClass}
        onChange={changeHandler} />
    </div>
  )
}

export default PuzzleTitle;
