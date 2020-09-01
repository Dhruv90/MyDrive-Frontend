import React from 'react';
import NavItem from '../NavItem/NavItem';
import classes from './Sidebar.module.css'
import UploadButton from '../UI/Upload/Upload'

const sidebar = props => {
  return (
    <div className={classes.Sidebar}>
      <NavItem path='/drive/photos'>Photos</NavItem>
      <NavItem path='/drive/files'>Files</NavItem>
      <UploadButton />
    </div>
  )
}

export default sidebar;