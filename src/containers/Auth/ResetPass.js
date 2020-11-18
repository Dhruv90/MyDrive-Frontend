import React, { useState, useContext } from 'react';
import classes from './Auth.module.css';
import { Redirect } from "react-router-dom";


import {AuthContext} from '../../context/authContext';

const ResetPass = props => {

  const [resetSuccessMessage, setResetSuccessMessage] = useState(null);
  const [redirectPath, setRedirectPath] = useState(null);
  const resetPassword = useContext(AuthContext).resetPassword;
  const logout = useContext(AuthContext).logout;


  const resetPassSubmitHandler = async(e) => {
    try{
      e.preventDefault();
      const email = e.target.email.value;
      const password = e.target.password.value;
      const confirmPassword = e.target.confirmPassword.value;
      const key = props.match.params.key;
      const reset = await resetPassword(email, key, password, confirmPassword);
      setResetSuccessMessage(reset.message)
      if(reset.success){
        setTimeout(() => {
          logout();
          let path = <Redirect to='/auth' />
          setRedirectPath(path)
        }, 2000);
      }
    } catch(err) {
      setResetSuccessMessage(err.message);
    }
  } 

  return(
    <div className={classes.LoginForm}>
      {redirectPath}
      <h2>Reset your password</h2>
      <form onSubmit={resetPassSubmitHandler}>
        <div className={classes.formControl}>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" placeholder="Your Email" />
        </div>
        <div className={classes.formControl}>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" placeholder="Password" />
        </div>
        <div className={classes.formControl}>
          <label htmlFor="confirmPassword">Password</label>
          <input type="password" name="confirmPassword" placeholder="Confirm Password" />
        </div>
        <div className={classes.formControl}>
          <button type="submit">Reset</button>
        </div>
        <div className={classes.registerText}>
          <span>{resetSuccessMessage}</span>
        </div>
      </form>
    </div>
  )
}

export default ResetPass;