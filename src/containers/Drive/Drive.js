import React, { useState, useCallback, useEffect } from "react";
import download from 'downloadjs';
import Photos from "../../components/Photos/Photos";
import Files from "../../components/Files/Files";

import classes from "./Drive.module.css";
import UploadButton from "../../components/UI/Upload/Upload";

const Drive = (props) => {
  const [photos, setPhotos] = useState(null);
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const getAll = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3001/files/", {
        // credentials: "include"
      });
      const data = await response.json();
      const photos = data.photos;
      const files = data.files;
      console.log(photos, files);
      setPhotos(photos);
      setFiles(files);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    getAll();
  }, [getAll]);

  const deleteFile = async (id, filename) => {
    try {
      const response = await fetch("http://localhost:3001/files/delete", {
        method: "post",
        "Content-Type": "application/json",
        body: JSON.stringify({ id: id, filename: filename }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await response.json();
      console.log(response.status);
      if (response.status === 200 || res.status === 201) {
        getAll();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const downloadFile = async (filename) => {
    try {
      setDownloading(true);
      const extension = filename.split('.')[1]
      const response = await fetch(`http://localhost:3001/files/${filename}`);
      const file = await response.blob();
      download(file, filename , extension);
      setDownloading(false);
    } catch (err) {
      console.log(err)
    }
  }

  let fetchedPhotos;
  let fetchedFiles = null;


  if ((!photos || photos.length === 0) && (!files || files.length === 0)) {
    fetchedPhotos = <p>Please upload files/photos</p>;
  }

  if (loading) {
    fetchedPhotos = <p>Loading...</p>;
  }

  let downloadingFile = (
    <div>...Downloading</div>
  )

  if(downloading === false){
    downloadingFile = null;
  }

  if (!loading && photos && photos.length >= 0) {

    fetchedPhotos = (
      <Photos photos = {photos} deleteFile = {deleteFile} downloadFile = {downloadFile}/>
    )
  }

  if (!loading && files && files.length >= 0) {

    fetchedFiles = (
      <Files files = {files} deleteFile = {deleteFile} downloadFile = {downloadFile}/>
    )
  }

  return (
    <div className={classes.DrivePage}>
      <UploadButton fetch={getAll} />
      {downloadingFile}
      {fetchedPhotos}
      {fetchedFiles}
    </div>
  );
};

export default Drive;
