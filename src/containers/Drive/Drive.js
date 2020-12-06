import React, { useContext } from "react";
import Files from "../../components/Files/Files";
import Folders from '../../components/Folders/Folders'
import {AllFilesContext} from '../../context/filesContext';
import Message from '../../components/Message/Message'
import SelectOptions from '../../components/SelectOptions/SelectOptions'
import Spinner from '../../components/Spinner/Spinner'
import classes from "./Drive.module.css";

const Drive = () => {

  const files = useContext(AllFilesContext).files; //obtaining all files from backend
  const folders = useContext(AllFilesContext).folders; //obtaining all files from backend
  const loading = useContext(AllFilesContext).loading; //UI setting to show loading
  const downloading = useContext(AllFilesContext).downloading; //UI setting to show downloading
  const processing = useContext(AllFilesContext).processing
  const selectModeToggle = useContext(AllFilesContext).selectModeToggle;
  const select = useContext(AllFilesContext).select;
  const downloadFiles = useContext(AllFilesContext).downloadFiles;
  const deleteFiles = useContext(AllFilesContext).deleteFiles;
  const resetSelection =  useContext(AllFilesContext).resetSelection;

  let fetchedFiles = null;
  let fetchedFolders = null;
  let quickAccessMessage = null;
  let selectToggle = null;


  if ((!files || files.length === 0)) {
    quickAccessMessage = <h2>Please Upload Files</h2>;
  }

  if (loading) {
    quickAccessMessage = <p>Loading...</p>; //for list of all files loading message while server responds
  }

  let downloadingFile = (
    <Message>...Downloading</Message> //downloading a file message while server responds
  )

  if(downloading === false){
    downloadingFile = null;
  }

  if (!loading && files && files.length > 0) {
    let thisFolderFiles = files.filter(file => {
      return file.metadata.parent === '/'
    })

    if (thisFolderFiles && thisFolderFiles.length !== 0) {
      fetchedFiles = 
        <React.Fragment>
          <br />
          <h2>Files</h2>
          <hr />
          <Files files = {thisFolderFiles} number={thisFolderFiles.length} select={select}/>
        </React.Fragment>
    selectToggle = <SelectOptions download={downloadFiles} delete={deleteFiles} resetSelection = {resetSelection} selectModeToggle={selectModeToggle}/> 
    } 
    
  }

  if (!loading && folders && folders.length > 0) {

    let thisFolderFolders = folders.filter(folder => {
      return folder.parent === '/'
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
      {quickAccessMessage}
      {downloadingFile}
      {/* {quickAccessFiles} */}
      {fetchedFolders}
      {fetchedFiles}
      {processing ? <Spinner /> : null}
    </div>
  );
};

export default Drive;
