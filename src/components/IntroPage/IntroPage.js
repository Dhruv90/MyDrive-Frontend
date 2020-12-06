import React from 'react';
import Button from '../Button/Button';
import {useHistory} from 'react-router-dom'

import classes from './IntroPage.module.css'

const IntroPage = () => {

  const history = useHistory();

  const redirectToAuth = () => {
    history.push('/auth')
  }

  return (
    <React.Fragment>
        <div className={classes.IntroBackground}></div>
        <h4 className={classes.Intro}>Save your files and photos to My Drive and access from any device, anywhere</h4>
        <div className = {classes.auth}>
          <Button click = {redirectToAuth}>Log-In</Button>
        </div>
    </React.Fragment>
  )
}

export default IntroPage;