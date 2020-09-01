import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

// import './App.css';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar'
// import Photos from './containers/Photos/Photos'
import Drive from './containers/Drive/Drive'

import classes from './App.module.css'


function App() {
  return (
    <BrowserRouter>
      <div className={classes.App}>
          <Navbar></Navbar>
          <Sidebar></Sidebar>
        <Switch>
          <Route to='/' component = {Drive} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
