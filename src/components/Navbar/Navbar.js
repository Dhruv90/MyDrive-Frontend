import React, { useState, useContext } from "react";
import NavItems from "./NavItems/NavItems";
import Logo from "./Logo/Logo";
import classes from "./Navbar.module.css";
import UploadButton from "../Upload/Upload";
import HamburgerMenu from "react-hamburger-menu";
import Sidebar from '../Sidebar/Sidebar'
import {AuthContext} from '../../context/authContext';
import NewFolderButton from '../NewFolder/NewFolder'

const Navbar = (props) => {
  const [sideBar, setSideBar] = useState(false);
  const isAuth = useContext(AuthContext).isAuth;

  const toggleSideBar = () => {
    setSideBar(!sideBar);
  }

  let hamburgerMenu = null;
  let navItems = null; 

  if(isAuth) {
  hamburgerMenu = (<div className={classes.HamburgerMenu}>
                    <HamburgerMenu
                      isOpen={sideBar}
                      menuClicked={toggleSideBar}
                      width={36}
                      height={30}
                      strokeWidth={1}
                      rotate={0}
                      color="white"
                      borderRadius={2}
                      animationDuration={0.5}
                    ></HamburgerMenu>
                    </div>);
  navItems = (<div className={classes.NavItems}>
                <NavItems></NavItems>
             </div>);  

  }

  return (
    <header className={classes.Navbar}>
      <Logo></Logo>
      <div className={classes.actionButtons}>
        {isAuth ? <UploadButton /> : null}
        {isAuth ? <NewFolderButton /> : null}
      </div>
      {hamburgerMenu}
      {navItems}
      <Sidebar display = {sideBar}></Sidebar>
    </header>
  );
};

export default Navbar;
