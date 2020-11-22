import React, { useState, useContext, useEffect, useCallback } from "react";
import { AllFilesContext } from "../../context/filesContext";
import { useLocation } from "react-router-dom";
import classes from "./MoveToFolder.module.css";

import FolderIcon from "@material-ui/icons/Folder";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

const MoveToFolder = (props) => {
  const folders = useContext(AllFilesContext).folders;
  const moveMultipleToFolder = useContext(AllFilesContext).moveMultipleToFolder;

  const [currentPathFolders, setCurrentPathFolders] = useState([]);
  const [currentParentFolder, setCurrentParentFolder] = useState(["/"]);

  const obtainCurrentPathFolders = useCallback(
    (currentFolderId) => {
      let childFolders = [];
      setCurrentParentFolder(currentFolderId);

      folders.forEach((folder) => {
        if (folder.parent === currentFolderId) {
          childFolders.push(folder);
        }
      });
      console.log(childFolders);
      setCurrentPathFolders(childFolders);
    },
    [folders]
  );

  const location = useLocation();
  let currentFolderId = location.pathname.split("/")[1] || "/";

  useEffect(() => {
    obtainCurrentPathFolders(currentFolderId);
  }, [currentFolderId, obtainCurrentPathFolders]);

  const goBack = (currentParentFolder) => {
    folders.forEach((folder) => {
      if (folder._id === currentParentFolder) {
        obtainCurrentPathFolders(folder.parent);
      }
    });
  };

  let parentFolderName = null;

  if (currentParentFolder === '/') {
    parentFolderName = 'Home'
  } else {
    parentFolderName = folders.map((folder) => {
      if (folder._id === currentParentFolder) {
        return folder.name;
      } else return null
    })
  }


  return (
    <div className={classes.MoveToFolder}>
      <h3>Select Destination Folder</h3>
      <header className={classes.folderHeader}>
        <ArrowBackIcon
          className={classes.backIcon}
          onClick={() => goBack(currentParentFolder)}
        />
        <span className={classes.currentFolderName}>
          {parentFolderName}
        </span>
        <button
            onClick={() => {
              moveMultipleToFolder(currentParentFolder);
              props.toggle();
            }}
          >
          Move Here
        </button>
      </header>
      {currentPathFolders.map((folder) => {
        return (
          <li
            className={classes.folder}
            onClick={() => obtainCurrentPathFolders(folder._id)}
            key={folder._id}
          >
            <FolderIcon className={classes.folderIcon} />
            <span className={classes.folderName}> {folder.name}</span>
          </li>
        );
      })}
     
    </div>
  );
};

export default MoveToFolder;
