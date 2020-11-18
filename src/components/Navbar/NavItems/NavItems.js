import React, { useContext } from 'react';
import NavItem from './NavItem/NavItem';
import classes from './NavItems.module.css'
import TotalStorage from '../../TotalStorage/TotalStorage'
import {AuthContext} from '../../../context/authContext'

const NavItems = () => {
  
  const isAuth = useContext(AuthContext).isAuth;
  const logout = useContext(AuthContext).logout;
  let authItem = <NavItem path='/auth'>Login</NavItem>
  let driveItem = null;
  
  if(isAuth){
    authItem = <a onClick={logout} href='/'>Logout</a>
    driveItem = <NavItem path='/'>Drive</NavItem>
  }

  return (
      <div className = {classes.NavItems}>
       {isAuth ? <TotalStorage /> : null }
        {driveItem}
        {authItem}
      </div>
    )
}

export default NavItems;