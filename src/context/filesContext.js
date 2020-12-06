import React, { useState, useCallback, useEffect, useContext } from "react";
import {AuthContext} from './authContext';
import instance from '../instance'

import download from 'downloadjs';

export const AllFilesContext = React.createContext({
  files: [],
  downloading: false,
  loading: false,
  selectMode: false,
  uploadPercent: 0,
  uploading: false,
  processing: false,
  getAllFiles: () => {},
  select: (id) => {},
  uploadFiles: (event) => {},
  resetSelection: () => {},
  deleteFiles: () => {},
  downloadFiles: () => {},
  selectModeToggle: () => {},
  createFolder: () => {},
  moveMultipleToFolder: () => {},
  getUsedStorage: () => {}
});

const AllFilesProvider = (props) => {
  const [files, setFiles] = useState(null);
  const [folders, setFolders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] =  useState(false);
  const [downloading, setDownloading] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0); 

  const isAuth = useContext(AuthContext).isAuth;
  const logout = useContext(AuthContext).logout;

  const selectModeToggle = () => {
    if (selectMode) {
      resetSelection();
    }
    setSelectMode(!selectMode);
  };

  const getAllFiles = useCallback(async () => {
      try {
        const response = await instance.get("/files", {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        });
        const files = response.data.files || [];
        setFiles(files.reverse());
        setLoading(false);
      } catch (err) {
        console.log(err);
        setFiles([]);
        setLoading(false);
      }
    
  }, []);

  const getAllFolders = useCallback(async() => {
      try {
        const response = await instance.get("/files/folders", {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        });
        const folders = response.data.folders || [];
        setFolders(folders.reverse());
        setLoading(false);
      } catch (err) {
        console.log(err);
        setFolders([]);
        setLoading(false);
      }
  }, []);


  useEffect(() => {
    if(isAuth === true) {
      getAllFiles();
      getAllFolders();
    }
  }, [getAllFiles, getAllFolders, isAuth]);


  const uploadFiles = async (event) => {
    event.preventDefault();
    
    if(isAuth){
      const token = localStorage.getItem('token')
      setUploading(true);

      const formData = new FormData(event.target);
      console.log(formData.getAll('files'))

      let uploadSize = 0;
      formData.getAll('files').forEach(file => {
        uploadSize+=(file.size/1024/1024)
      });

      console.log(uploadSize);

      if((getUsedStorage() + uploadSize) >= totalStorage){
        alert('Out of Storage Space, please free up space before uploading more files');
        setUploading(false);
        return
      }
      try{
          if(formData.getAll('files').length > 30){
            throw new Error('File Limit Exceeded')
          }
          const res = await instance.post('/files/upload', formData, {
              onUploadProgress: (progressEvent) => {
                const {loaded, total} = progressEvent;
                let percent = Math.floor(loaded*100/total)
                if(percent<100){
                  setUploadPercent(percent);
                }
              },
              headers:{
                Authorization: token
              }
          })
          if(res && res.status === 201){
            getAllFiles();
            setUploadPercent(100);
            setTimeout(()=>{
              setUploading(false);
            },500)
          }
      } catch(err) {
        console.log(err);
        alert('Please upload maximum 30 files at once');
        setUploading(false);
      }
    } else {
      alert('Not Authorized, Please login to your account')
    }
  }

  const deleteFile = async (id, filename) => {
    if(isAuth===true){
      try {
        setProcessing(true)
        const response = await instance.post("/files/delete", { id: id, filename: filename }, {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        });
        if (response.status === 200 || response.status === 201) {
          setProcessing(false)
          getAllFiles();
        }
      } catch (err) {
        setProcessing(false)
        console.log(err);
      }
    }else {
      alert('Not Authorized, Please login to your account')
    }
  };

  const deleteFolder = async (id) => {
    if(isAuth===true){
      try {
        setProcessing(true)
        const response = await instance.post("/files/deleteFolder", { folderId: id }, {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        });
        if (response.status === 200 || response.status === 201) {
          setProcessing(false)    
          getAllFolders();
          getAllFiles();
        }
      } catch (err) {    
        setProcessing(false)    
        alert("Could Not Delete, please try again")
      }
    }else {
      setProcessing(false)    
      alert('Not Authorized, Please login to your account')
    }
  };

  const downloadFile = async (filename) => {
    if(isAuth===true){
      try {
        const token = localStorage.getItem('token')
        setDownloading(true);
        const extension = filename.split(".")[1];
        const response = await instance.get(`/files/${filename}`, {
          headers: {
            Authorization: token
          },
          responseType: 'arraybuffer'
        });
        download(response.data, filename, extension);
        setDownloading(false);
        }      
       catch (err) {
        console.log(err);
        alert('Something Went Wrong, please try again later')
      }
    } else {
      alert('Not Authorized, Please login to your account')
    }
  };

  const downloadFolder = async (id) => {
    if(isAuth === true){
      for(let i=0; i<files.length; i++){
        if(files[i].metadata.parent === id){
          await downloadFile(files[i].filename)
        }
      }
      for(let i=0; i<folders.length; i++){
        if(folders[i].parent === id){
          await downloadFolder(folders[i]._id)
        }
      }
    } else {
      alert('Not Authorized, Please login to your account')
    }  
  }

  const select = (id) => {
    if(selectMode){
      let selectedFileIndex = -1;
      for(let i=0; i<files.length; i++){
        if(files[i]._id === id){
          selectedFileIndex = i;
          break;
        }
      }
      if(selectedFileIndex >= 0){
        let newFileSelect
        if(files[selectedFileIndex].select === true) {
          newFileSelect = false;
        } else {
          newFileSelect = true;
        }
        const newFiles = [...files];
        newFiles[selectedFileIndex] = {...files[selectedFileIndex], select: newFileSelect}
        setFiles(newFiles);
      }

      let selectedFolderIndex = -1;
      for(let i=0; i<folders.length; i++){
        if(folders[i]._id === id){
          selectedFolderIndex = i;
          break;
        }
      }
      if(selectedFolderIndex >= 0){
        let newFolderSelect
        if(folders[selectedFolderIndex].select === true) {
          newFolderSelect = false;
        } else {
          newFolderSelect = true;
        }
        const newFolders = [...folders];
        newFolders[selectedFolderIndex] = {...folders[selectedFolderIndex], select: newFolderSelect}
        setFolders(newFolders);
      }
    }
  }

  const deleteFiles = async() => {
      files.map (async(file) => {
        try{
          if(file.select){
            await deleteFile(file._id, file.filename)
          }
        }catch (err) {
          alert('Something Went Wrong, please try again later')
        }
      })

      folders.map (async(folder) => {
        try{
          if(folder.select){
            await deleteFolder(folder._id)
          }
        }catch (err) {
          alert('Something Went Wrong, please try again later')
        }
      })
      resetSelection();
      selectModeToggle();
  }    

  const downloadFiles = async() => {
    setProcessing(true)
    files.map(async(file) => {
      try{
        if(file.select){
          await downloadFile(file.filename)
        }          
      }catch (err) {
        setProcessing(false)
        alert('Something Went Wrong, please try again later')
      }
    })

    folders.map(async(folder) => {
      try{
        if(folder.select){
          await downloadFolder(folder._id)
        }          
      } catch (err) {
        setProcessing(false)
        alert('Something Went Wrong, please try again later')
      }
  })
    setProcessing(false)
    resetSelection();
    selectModeToggle();
}  

  const resetSelection = () => {

    const newFiles = [...files]
    for(let file of newFiles){
      if(file.select === true){
        file.select = false
      }
    }
    setFiles(newFiles);

    const newFolders = [...folders]
    for(let folder of newFolders){
      if(folder.select === true){
        folder.select = false
      }
    }
    setFolders(newFolders);
  }

  const createFolder = async(e) => {
    e.preventDefault();
    setProcessing(true)
    try{
      const name = e.target.name.value;
      const parent = e.target.parent.value;
      const body = {name: name, parent: parent}
      const token = localStorage.getItem('token')
      const res = await instance.post("/files/newFolder", body, {
        headers: {
          Authorization: token
        }
      });
      if(res.status === 200){
        getAllFolders();
        setProcessing(false)
        return 'Folder Created';
      } else throw new Error(res.message)
    }catch(err) {
      console.log(err.message);
      setProcessing(false)
      alert('Something Went Wrong, please try again')
    }
  }

  const moveToFolder = async (objectId, folderId) => {
    try {
      setProcessing(true)    
      const body = {objectId: objectId, parent: folderId}
      const token = localStorage.getItem('token')
      const res = await instance.post("/files/moveToFolder", body, {
        headers: {
          Authorization: token
        }
      });
      if(res.status === 200){
        setProcessing(false)    
        getAllFolders();
        getAllFiles(); 
        resetSelection();
        selectModeToggle();
      }
    } catch (err) {
      console.log(err.message);
      alert('Something Went Wrong, please try again')
    }
  }

  const moveMultipleToFolder = async (folderId) => {
    try{
        setProcessing(true)
        files.map (async(file) => {
          if(file.select){
            await moveToFolder(file._id, folderId)
          }
        })  
        folders.map (async(folder) => {
          if(folder.select){
            await moveToFolder(folder._id, folderId)
          }  
        })
        setProcessing(false)
        resetSelection();
        selectModeToggle();     
    }catch (err) {
      if(err.statusCode === 401){
        setProcessing(false)
        logout();
      }
      alert('Something Went Wrong, please try again later')
    }
  }

  const getUsedStorage = () => {
    let usedStorage = 0;
    if(files !== null) {
      for (let i = 0; i < files.length; i++){
        usedStorage+=files[i].length/1024/1024;
      }
    }
    return usedStorage
  }

  const totalStorage = 100

  return (
    <AllFilesContext.Provider
      value={{
        files: files,
        folders: folders,
        downloading: downloading,
        loading: loading,
        selectMode: selectMode,
        uploading: uploading,
        uploadPercent: uploadPercent,
        totalStorage: totalStorage,
        processing: processing,
        getAllFiles: getAllFiles,
        getAllFolders: getAllFolders,
        select: select,
        resetSelection: resetSelection,
        uploadFiles: uploadFiles,
        deleteFiles: deleteFiles,
        downloadFiles: downloadFiles,
        selectModeToggle: selectModeToggle,
        createFolder: createFolder,
        moveMultipleToFolder: moveMultipleToFolder,
        getUsedStorage: getUsedStorage
      }}
    >
      {props.children}
    </AllFilesContext.Provider>
  );
};

export default AllFilesProvider;
