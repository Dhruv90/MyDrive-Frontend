import React from "react";
import classes from "./Photos.module.css";

const Photos = (props) => {
  
  return (
    <div className={classes.PhotosContainer}>
        {props.photos.map((photo) => {
          const thumbPath = `http://localhost:3001/files/thumbnail/${photo.filename}`;
          return (
            <div key={photo.filename} className={classes.photoContainer}>
              <img
                src="https://image.flaticon.com/icons/svg/261/261935.svg"
                className={classes.deleteButton}
                onClick={() => props.deleteFile(photo._id, photo.filename)}
                alt=""
              />
              <img
                src="https://image.flaticon.com/icons/svg/892/892634.svg"
                className={classes.downloadButton}
                onClick={() => props.downloadFile(photo.filename)}
              />
              <img
                className={classes.photo}
                src={thumbPath}
                alt={photo.filename}
              />
            </div>
          );
        })}
      </div>
  );
};

export default Photos;
