import React from 'react';

const MenuButton = props => {
  let squares = props.name.split('').map((letter, index) => {
    return(
      <div className="menu-cell" key={index}>
        <span className='menu-letter'>{letter}</span>
      </div>
    )
  })

  return(
    <div className="menu-button" onClick={props.onClick}>
      <div className="menu-cell first">
        <span className='menu-letter'>C</span>
      </div>
      {squares}
    </div>
  )
}

export default MenuButton;
