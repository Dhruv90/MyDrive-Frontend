import React from 'react';
import classes from './Files.module.css'

const Files = (props) => {
  return (
    <div className={classes.filesContainer}>
      { 
        props.files.map((file) => {
          const extension = file.filename.split('.')[1].toLowerCase();
          const iconPath = `http://localhost:3001/files/icons/${extension}`
        
          console.log(file.metadata.originalname)
       return  <div key={file.filename} className={classes.fileContainer}>
            <img
                src="https://image.flaticon.com/icons/svg/261/261935.svg"
                className={classes.deleteButton}
                onClick={() => props.deleteFile(file._id, file.filename)}
                alt=""
              />
              <img
                src="https://image.flaticon.com/icons/svg/892/892634.svg"
                className={classes.downloadButton}
                onClick={() => props.downloadFile(file.filename)}
              />
            <img src={iconPath} className={classes.fileIcon}/>
            <div className={classes.fileTitle}>{file.metadata.originalname}</div>
          </div>
        })
      }
    </div>
  )
}

export default Files;