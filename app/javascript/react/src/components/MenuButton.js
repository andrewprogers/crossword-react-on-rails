import React from 'react';

const MenuButton = props => {
  return(
    <div className="menu-button" onClick={props.onClick}>
      {props.name}
    </div>
  )
}

export default MenuButton;
