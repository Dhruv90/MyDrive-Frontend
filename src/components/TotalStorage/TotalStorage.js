import React, { useContext } from 'react'
import {AllFilesContext} from '../../context/filesContext'
import classes from './TotalStorage.module.css'


const TotalStorage = () => {
  const getUsedStorage = useContext(AllFilesContext).getUsedStorage;
  const totalStorage = useContext(AllFilesContext).totalStorage
  const usedStorage = getUsedStorage();

  return (
  <div className={classes.TotalStorage}>
    <label htmlFor='storageBar'>{Math.round(usedStorage)} MB of {totalStorage} MB used</label>
    <br />
    <progress id='storageBar' value={usedStorage} max={totalStorage}>{usedStorage}/{totalStorage}</progress>
  </div>  
  )
}

export default TotalStorage;