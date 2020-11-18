import React, {useContext} from 'react';
import classes from './Sidebar.module.css';
import {AuthContext} from '../../context/authContext';
import TotalStorage from '../TotalStorage/TotalStorage'


const Sidebar = props => {
  const logout = useContext(AuthContext).logout;

  let sidebar = null;

  if(props.display) {
    sidebar =  <div className={classes.Sidebar}>
                <a onClick={logout} href='/'>Logout</a>
                 <TotalStorage /> 
              </div>
  }

  return sidebar
}

export default Sidebar;