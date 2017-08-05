import React from 'react';

const MenuButton = props => {
  let letter = props.name.charAt(0)
  return(
    <div className="menu-button" onClick={props.onClick}>
      <div className="menu-letter">{letter}</div>
      <div className='menu-name'>{props.name}</div>
    </div>
  )
}

export default MenuButton;
