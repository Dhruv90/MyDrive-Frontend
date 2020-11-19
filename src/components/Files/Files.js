import React, { useContext, useState } from "react";
import Preview from '../Preview/Preview'
import {AllFilesContext}  from '../../context/filesContext'


import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';

import classes from "./Files.module.css";

const useStyles = makeStyles({
  root: {
    width: '25%',
    minWidth: 125,
    maxWidth: 200,
    maxHeight: 150,
    margin: 10,
    position: "relative",
    backgroundColor: '#EFF5F2'
  },
  checkbox: {
    zIndex: 2,
    position: "absolute",
    left: 0
  },
  content: {
    padding: '0.3rem',
    height: '60px'
  },
});

const Files = (props) => {

  const materialClasses = useStyles();
  
  const checkbox = (
    <Checkbox
      className = {materialClasses.checkbox}
      defaultChecked
      color="secondary"
      inputProps={{ 'aria-label': 'secondary checkbox' }}
      />
  )

  const select = useContext(AllFilesContext).select
  const selectMode = useContext(AllFilesContext).selectMode

  const [previewComponent, setPreviewComponent] = useState(null);

  const openPreview = file => {
    setPreviewComponent(<Preview file={file} close = {closePreview} />)
  }

  const closePreview = () => {
    setPreviewComponent(null)
  }

  const fileClickHandler = (file) => {
    if(selectMode){
      select(file._id)
    } else {
      openPreview(file)
    }
  }

  return (
    <div className={classes.filesContainer}>
      {previewComponent}
      {props.files.slice(0, props.number).map((file) => {
        const extension = file.filename.split(".")[1].toLowerCase();
        let iconPath = `https://mydrive-fullstack.herokuapp.com/files/icons/${extension}`
        if(extension === 'jpeg' || extension === 'jpg' || extension === 'png'){
          iconPath = `https://mydrive-fullstack.herokuapp.com/files/thumbnail/${file.filename}`
        } 
        return (
          <Card className={materialClasses.root} sm={6} l={3} onClick={() => fileClickHandler(file)} key={file.filename} >
            {file.select ? checkbox : null}
          <CardActionArea>
            <CardMedia
              component="img"
              alt={file.filename}
              height="100"
              image={iconPath}
              title={file.metadata.originalname}
            />
            <CardContent className = {materialClasses.content}>
              <Typography className={materialClasses.title} variant="body1" color="textSecondary" component="p">
                {file.metadata.originalname}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        );
      })}
    </div>
  );
};

export default Files;
