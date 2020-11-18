import React, {useState, useEffect, useCallback, useContext} from 'react';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import classes from './Breadcrumb.module.css'
import { useLocation, useHistory } from 'react-router-dom'
import {AllFilesContext} from '../../context/filesContext';


const Breadcrumb = () => {

  const [path, setPath] = useState(['Home']);
  const folders = useContext(AllFilesContext).folders; //obtaining all files from backend 
  const selectMode = useContext(AllFilesContext).selectMode;
  let breadcrumbComponent = null

  const updatePath = useCallback((folderId) => {
    let path = [];
    console.log(folders);
    if(folders && folders.length > 0){
      console.log(folders)
      let folder = folders.find(folder => {
        return folder._id === folderId;
      })  
      path.unshift(folder.name);
  
      if(folder.parent === '/'){
        path.unshift('Home')
      } else {
        path.unshift(...updatePath(folder.parent))
      }
      return path
    }
  }, [folders])

  const location = useLocation();
  const history = useHistory();
  let currentFolderId = location.pathname.split('/')[1] || '/';

  useEffect(() => {
    if(currentFolderId === '/' || currentFolderId === 'auth' || currentFolderId === 'forgotPass' || currentFolderId === 'register') {
      setPath(['Home'])
    } else {
      let currentPath = updatePath(currentFolderId);
      if(currentPath){
        setPath(currentPath);
      }
    }
  }, [updatePath, currentFolderId])


  const handleClick = (event, crumb) => {
    event.preventDefault();
    if(crumb === 'Home'){
      console.log(currentFolderId, 'Redirecting to home');
      history.push('/')
    }
    else{
      console.log(currentFolderId, `Redirecting to ${crumb}`)
      let folder = folders.find(folder => {
        return folder.name === crumb
      })
      history.push(`/${folder._id}`)
    }
  }

  if(!selectMode) {
    breadcrumbComponent = (
      <Breadcrumbs aria-label="breadcrumb" className = {classes.Breadcrumb}>
        {path.map(crumb => {
        return <Link color="inherit" href="#" key={Math.random()} onClick={(e) => handleClick(e, crumb)}>
            {crumb}
          </Link>
        })}
      </Breadcrumbs>
    )
  }

  return breadcrumbComponent
}  

export default Breadcrumb;