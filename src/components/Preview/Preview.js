import React from 'react';
import FileViewer from 'react-file-viewer';
import classes from './Preview.module.css';
import CloseIcon from '@material-ui/icons/Close';


const Preview = props => {

  const extension = props.file.filename.split('.')[1];
  let previewer = null;

  if(extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'gif' ){
    previewer = (
      <img alt={props.file._id} className = {classes.image} src = {`http://localhost:3001/files/${props.file.filename}`}></img>
    )
  } else if(extension === 'pdf'){
    previewer = (
      <FileViewer
        fileType={extension}
        filePath={`http://localhost:3001/files/${props.file.filename}`}
        onError={() => alert('Problem Occured, please try again')}/>
    );
  } else {
    previewer = <h2>Preview Not Available</h2>
  }

  return (
    <div className = {classes.Preview}>
      {previewer}
      <CloseIcon className = {classes.closeIcon} onClick = {props.close}/>
      <div className = {classes.description}>
        <p>Filename: {props.file.metadata.originalname}</p>
        <p>Upload date: {props.file.uploadDate.split('T')[0]}</p>
        <p>Size: {parseInt(props.file.length/1024)} KB</p>
      </div>
    </div>
  )
}

export default Preview;