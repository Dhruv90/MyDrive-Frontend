import React, { useContext, useState } from 'react';
import Button from '../Button/Button';
import FolderNameModal from './FolderNameModal'
import {AllFilesContext} from '../../context/filesContext';


const NewFolderButton = props => {

  const createFolder =  useContext(AllFilesContext).createFolder;
  const [open, setOpen] = useState(false);

  const toggleModal = () => {
    console.log('Toggle Modal Running')
    setOpen(!open);
  }

  let modal = null

  if(open){
    modal = <FolderNameModal submit = {createFolder} open={open} toggleModal = {toggleModal}></FolderNameModal>
  }

  return(
    <React.Fragment>
      {modal}
      <Button click = {toggleModal}>
          New Folder
      </Button>
    </React.Fragment>
  )
}

export default NewFolderButton;