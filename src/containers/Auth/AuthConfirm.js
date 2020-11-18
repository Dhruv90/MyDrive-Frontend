import React, { useContext, useState, useEffect, useCallback } from 'react';
import classes from './AuthConfirm.module.css';
import { Redirect } from "react-router-dom";

import {AuthContext} from '../../context/authContext';

const AuthConfirm = props => {
  const confirmUser = useContext(AuthContext).confirmUser;
  const [confirming, setConfirming] = useState(0);
  const [redirectPath, setRedirectPath]  = useState(null); 

  const userConfirmFunction = useCallback(async (key) => {
    const conf = await confirmUser(key);
    setConfirming(conf);
     if(conf === 1){
      redirect();
    }
  },[confirmUser])

  const redirect = () => {
    setTimeout(() => {
      let path = <Redirect to='/auth' />
      setRedirectPath(path)
    }, 1000);
  }

  useEffect(() => {
    const key = props.match.params.key;
    userConfirmFunction(key);
  })

  let output = <h3>...Confirming your Account</h3>;

  if(confirming === 0) {
    output = <h3>...Confirming your Account</h3>
  } else if (confirming === 1) {
    output = <h3>Account Confirmed, Redirecting to Login... </h3>
  } else if (confirming === -1) {
    output = <h3>Confirmation Failed.. please try to register again </h3>
  }

  return(
    <div className = {classes.Confirm}>
      {redirectPath}
      {output}
    </div>
  )
}

export default AuthConfirm;