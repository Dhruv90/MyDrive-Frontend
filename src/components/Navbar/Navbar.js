import React from 'react';
import NavItems from './NavItems/NavItems';
import Logo from './Logo/Logo';
import classes from './Navbar.module.css'

const navbar = props => {
  return(
      <header className = {classes.Navbar}>
        <Logo></Logo>
        <NavItems></NavItems>
      </header>
  )
}

export default navbar;