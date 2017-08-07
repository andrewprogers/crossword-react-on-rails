import React from 'react';

const MenuButton = props => {
  return(
    <div className="menu-button" onClick={props.onClick}>
      <div className='menu-name'>{props.name}</div>
    </div>
  )
}

export default MenuButton;
