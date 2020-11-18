import React from 'react';
import {NavLink} from 'react-router-dom';
import classes from './NavItem.module.css'

const navItem = props => {
  return(
    <NavLink className={classes.Navlink} to={props.path}>{props.children}</NavLink>
  )
}

export default navItem;