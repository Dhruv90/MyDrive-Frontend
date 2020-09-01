import React from 'react';
import NavItem from '../../NavItem/NavItem';
import classes from './NavItems.module.css'

const navItems = props => {
  
  return (
      <div className = {classes.Navlinks}>
        <NavItem path='/drive'>Drive</NavItem>
        <NavItem path='/auth'>Login</NavItem>
      </div>
    )
}

export default navItems;