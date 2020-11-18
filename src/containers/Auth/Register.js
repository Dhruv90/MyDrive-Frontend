import React, {useContext, useState} from "react";
import {AuthContext} from '../../context/authContext';
import { Link } from "react-router-dom";


import classes from "./Auth.module.css";

const Auth = () => {

  const onRegister = useContext(AuthContext).onRegister;

  const [registerSuccessMessage, setRegisterSuccessMessage] = useState(null);
  const [messageStyle, setMessageStyle] = useState(classes.message)


  const registerSubmitHandler = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;
    setRegisterSuccessMessage("Setting up your account")
    let registerStatus = await onRegister(email, password, confirmPassword);
    if(registerStatus.status){
      setRegisterSuccessMessage(`${registerStatus.message}, 
      Didnt Receive Email? Click on Register again to Re-send email`)
      setMessageStyle(`${classes.message} ${classes.success}`)
    } else {
      setRegisterSuccessMessage(registerStatus.message)
      setMessageStyle(`${classes.message} ${classes.failure}`)

    }
  };


  return (
    <React.Fragment>
      <div className={classes.background}></div>
      <div className={classes.LoginForm}>
      {registerSuccessMessage ? <div className={messageStyle}>{registerSuccessMessage}</div> : null}

        <h2>Create Account on MyDrive</h2>
        <form onSubmit={registerSubmitHandler}>
          <div className={classes.formControl}>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" placeholder="Your Email" />
          </div>
          <div className={classes.formControl}>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" placeholder="Password" />
          </div>
          <div className={classes.formControl}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" name="confirmPassword" placeholder="Confirm Password" />
          </div>
          <div className={classes.formControl}>
            <button type="submit">Register</button>
          </div>
          <div className={classes.registerText}>
            Already have an account?
            <Link to="/auth">Click Here to Login</Link> <br />
          </div>
          {/* <div className={classes.registerText}>
            <span className={classes.message}>{registerSuccessMessage}</span>
          </div> */}
        </form>
      </div>
    </React.Fragment>
  );
};

export default Auth;
