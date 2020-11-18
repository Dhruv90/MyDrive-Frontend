import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import {AllFilesContext} from '../../context/filesContext'

import classes from './Folders.module.css'
import FolderIcon from '@material-ui/icons/Folder';
import {withRouter, Redirect} from 'react-router';


const useStyles = makeStyles({

  checkbox: {
    zIndex: 2,
    position: "absolute",
    left: 0
  }
});

const Folders = props => {

  const [redirectPath, setRedirectPath] = useState(null);
  const selectMode = useContext(AllFilesContext).selectMode;

  const materialClasses = useStyles();
  
  const checkbox = (
    <Checkbox
      className = {materialClasses.checkbox}
      defaultChecked
      color="secondary"
      inputProps={{ 'aria-label': 'secondary checkbox' }}
      />
  )

  const folderClickHandler = (folder) => {
    if(!selectMode){
      setRedirectPath(<Redirect to={`/${folder._id}`} />)
    } else {
      props.select(folder._id)
    }
  }

  return (
    <div className = {classes.folderContainer}>
      {redirectPath}
    {props.folders.length > 0 ? <h2>Folders</h2> : null}
    {props.folders.length > 0 ? <hr /> : null}
      <div className={classes.folderList}>
        {props.folders.map(folder => {
          return(
            <div className={classes.folder} key={folder._id} onClick={() => folderClickHandler(folder)} >
              {folder.select ? checkbox : null}
              <FolderIcon className = {classes.folderIcon}/>
              <span className = {classes.folderTitle}>{folder.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default withRouter(Folders);