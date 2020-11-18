import React, { useContext } from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import AllFilesProvider from './context/filesContext'

import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import Drive from './containers/Drive/Drive';
import Auth from './containers/Auth/Auth';
import Register from './containers/Auth/Register';
import IntroPage from './components/IntroPage/IntroPage'
import AuthConfirm from './containers/Auth/AuthConfirm';
import ResetPass from './containers/Auth/ResetPass';
import FolderView from './containers/Drive/FolderView';
import Breadcrumb from './components/Breadcrumb/Breadcrumb'



import {AuthContext} from './context/authContext'


import classes from './App.module.css'


function App() {
  const isAuth = useContext(AuthContext).isAuth;


  let routes =  <Switch>
                  <Route path = '/auth/confirm/:key' component = {AuthConfirm} />
                  <Route path='/auth/resetPass/:key' component = {ResetPass} />
                  <Route path='/auth' component = {Auth} />
                  <Route path='/register' component = {Register} />
                  <Route path='/' component = {IntroPage} />   
                </Switch>

      

  if(isAuth){
    routes = <Switch>
              
              <Route path='/auth/resetPass/:key' component = {ResetPass} />
              <Route path='/auth' exact component = {Auth} />
              <Route path='/register' exact component = {Register} />
              <Route path='/:folder' component = {FolderView} />
              <Route path='/' component = {Drive} />

            </Switch>
  } 

  return (
      <AllFilesProvider>
        <BrowserRouter>
          <div className={classes.App}>
              <Navbar></Navbar> 
              {isAuth ? <Sidebar></Sidebar> : null}
              {routes}
              {isAuth ? <Breadcrumb></Breadcrumb> : null}
          </div>
        </BrowserRouter>
      </AllFilesProvider>
  );
}

export default App;
