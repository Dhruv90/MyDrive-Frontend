import React, { useContext } from "react";
import Files from "../../components/Files/Files";
import Folders from '../../components/Folders/Folders'
import {AllFilesContext} from '../../context/filesContext';
import Message from '../../components/Message/Message'
import SelectOptions from '../../components/SelectOptions/SelectOptions'

import classes from "./Drive.module.css";

const FolderView = (props) => {

  const files = useContext(AllFilesContext).files; //obtaining all files from backend
  const folders = useContext(AllFilesContext).folders; //obtaining all files from backend
  const loading = useContext(AllFilesContext).loading; //UI setting to show loading
  const downloading = useContext(AllFilesContext).downloading; //UI setting to show downloading
  const selectModeToggle = useContext(AllFilesContext).selectModeToggle;
  const select = useContext(AllFilesContext).select;
  const downloadFiles = useContext(AllFilesContext).downloadFiles;
  const deleteFiles = useContext(AllFilesContext).deleteFiles;
  const resetSelection =  useContext(AllFilesContext).resetSelection;

  let fetchedFiles = null;
  let fetchedFolders = null;
  let selectToggle = null;


  if (loading) {
    fetchedFiles = <p>Loading...</p>; //for list of all files loading message while server responds
  }

  let downloadingFile = (
    <Message>...Downloading</Message> //downloading a file message while server responds
  )

  if(downloading === false){
    downloadingFile = null;
  }

  if (!files || files.length === 0) {
    fetchedFiles = <h2>Please upload files</h2>; //default message if no files found
  } 

  if (!loading && files && files.length > 0) {

    let thisFolderFiles = files.filter(file => {
      return file.metadata.parent === props.match.params.folder
    })

    if (!thisFolderFiles || thisFolderFiles.length === 0) {
      fetchedFiles = <h2>Please upload files</h2>; //default message if no files found
    } 
    else {
      fetchedFiles = (
        <React.Fragment>
          <Files files = {thisFolderFiles} number={thisFolderFiles.length} select={select}/>
        </React.Fragment>
      ) 
      selectToggle = (
        <React.Fragment>
            <header className={classes.subheader}>
              <SelectOptions download={downloadFiles} delete={deleteFiles} resetSelection = {resetSelection} selectModeToggle={selectModeToggle}/>
            </header>
        </React.Fragment>
      )
    }
  }

  if (!loading && folders && folders.length > 0) {

    let thisFolderFolders = folders.filter(folder => {
      return folder.parent === props.match.params.folder
    })

    if(thisFolderFolders && thisFolderFolders.length > 0) {
      fetchedFolders = (
        <React.Fragment>
          <Folders folders = {thisFolderFolders} select={select}/>
        </React.Fragment>
      )
      selectToggle = (
        <React.Fragment>
            <header className={classes.subheader}>
              <SelectOptions download={downloadFiles} delete={deleteFiles} resetSelection = {resetSelection} selectModeToggle={selectModeToggle}/>
            </header>
        </React.Fragment>
      )  
    }
  }

  return (
    <div className={classes.DrivePage}>
      <header className={classes.subheader}>
          {selectToggle}
        </header>
      {downloadingFile}
      {fetchedFiles}
      {fetchedFolders}
    </div>
  );
};

export default FolderView;
