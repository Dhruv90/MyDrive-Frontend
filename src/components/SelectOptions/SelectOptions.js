import React, {useState, useContext} from 'react';
import Button from '@material-ui/core/Button';
import classes from './SelectOptions.module.css';
import ConfirmDeleteModal from './ConfirmDeleteModal'
import MoveToFolder from '../MoveToFolder/MoveToFolder'
import Backdrop from "../Backdrop/Backdrop";
import Switch from '@material-ui/core/Switch';
import Box from '@material-ui/core/Box';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import GetAppIcon from '@material-ui/icons/GetApp';
import {AllFilesContext} from '../../context/filesContext'


const SelectOptions = props => {

  let checked = useContext(AllFilesContext).selectMode;
  const [deleteModal, setDeleteModal] = useState(false);
  const [folderSwitcher, setFolderSwitcher] = useState(false)

  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };

  const toggleFolderSwitcher = () => {
    console.log('FolderSwitcherRunning');
    setFolderSwitcher(!folderSwitcher);
  };

  let options = null;
  let style = classes.SelectOptions
  if(checked) {
    options = <React.Fragment>
                <Box component="span" m={1}>
                  <Button variant="outlined" color="primary" onClick={toggleFolderSwitcher}>Move</Button>
                </Box>
                <span>|</span>
                <Box component="span" m={1}>
                  <GetAppIcon onClick = {props.download} color="primary" style={{width: '1.5rem'}}/>
                </Box>
                <span>|</span>
                <Box component="span" m={1}>
                  <DeleteForeverIcon onClick = {toggleDeleteModal} color="secondary" style={{width: '1.5rem'}}/>
                </Box>
              </React.Fragment>
    
    style = `${classes.SelectOptions} ${classes.checked}`
  }

  const multipleSelectToggleHandler = (e) => {
    props.selectModeToggle();
  }

  return (
    <div className = {style}>
      {deleteModal ? (
        <ConfirmDeleteModal confirm={props.delete} cancel={toggleDeleteModal} open={deleteModal}/>
      ) : null}
      {deleteModal ? <Backdrop click={toggleDeleteModal}/> : null}
      {folderSwitcher ? <MoveToFolder toggle={toggleFolderSwitcher}/> : null}
      {folderSwitcher ? <Backdrop click={toggleFolderSwitcher}/> : null}
      {options}
      <span>Select</span>
      <div>
        <Switch
          checked={checked}
          onClick={multipleSelectToggleHandler}
          name="checked"
          inputProps={{ 'aria-label': 'secondary checkbox' }}
        />
      </div>  
     
    </div>
  )
}

export default SelectOptions;