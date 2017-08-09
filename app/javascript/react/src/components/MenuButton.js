import React from 'react';

const MenuButton = props => {
  let className = props.active ? "menu-button active" : "menu-button"
  return(
    <div className={className} onClick={props.onClick}>
      <div className='menu-name'>{props.name}</div>
    </div>
  )
}

export default MenuButton;
