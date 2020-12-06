import React, {useContext, useState} from "react";
import {AuthContext} from '../../context/authContext'
import { Link, Redirect } from "react-router-dom";
import GoogleLogin from 'react-google-login'

import Spinner from '../../components/Spinner/Spinner'

import classes from "./Auth.module.css";

const Auth = () => {

  const onAuth = useContext(AuthContext).onAuth;
  const forgotPass = useContext(AuthContext).forgotPass;
  const googleLogin = useContext(AuthContext).googleLogin;
  const checkAuth = useContext(AuthContext).checkAuth;
  const processing = useContext(AuthContext).processing;

  const [redirectPath, setRedirectPath]  = useState(null); 
  const [loginSuccessMessage, setLoginSuccessMessage] = useState(null);
  const [mode, setMode] = useState('login')
  const [messageStyle, setMessageStyle] = useState(classes.message)

  const submitHandler = async (event) => {
  let path = null;
  event.preventDefault();
    if(mode === 'login') {
      const email = event.target.email.value;
      const password = event.target.password.value;
      setLoginSuccessMessage("Signing In");
      
      let authStatus = await onAuth(email, password);
      setLoginSuccessMessage(authStatus.message)
      
      if(authStatus.loginStatus){
        setMessageStyle(`${classes.message} ${classes.success}`)
        setTimeout(() => {
          path = <Redirect to='/' />
          setRedirectPath(path)
        }, 1000);
      } else {
        setMessageStyle(`${classes.message} ${classes.failure}`)
      }
    } else if (mode === 'forgotPass') {
      try{
        if(!event.target.email.value){
          setLoginSuccessMessage('Please enter e-mail to get password reset link');
          setMessageStyle(`${classes.message} ${classes.failure}`)
        }
        const status = await forgotPass(event);
        setLoginSuccessMessage(status.message);
        setMessageStyle(`${classes.message} ${classes.success}`)

      } catch (err) {
        setLoginSuccessMessage(err.message);
        setMessageStyle(`${classes.message} ${classes.failure}`)
      }
    }
  };

  const googleSuccess = async (response) => {
    const login = await googleLogin(response);
    console.log(response)
    if(login.status === true){
      localStorage.setItem("token", `Bearer Google ${response.tokenId}`)
      setLoginSuccessMessage(login.message)
      setMessageStyle(`${classes.message} ${classes.success}`)
      setTimeout(() => {
        checkAuth();
        let path = <Redirect to='/' />
          setRedirectPath(path)
      }, 1000)
    }
  }

  const googleFailure = (response) => {
    console.log(response);
    if(response.error === 'idpiframe_initialization_failed')
    setLoginSuccessMessage('Please use a different browser / non-incognito mode')
    else{
      setLoginSuccessMessage('Not Able to Login, Please Try Again');
    }
    setMessageStyle(`${classes.message} ${classes.failure}`)
  }


  return (
    <React.Fragment>
      <div className={classes.background}></div>
      <div className={classes.LoginForm}>
        {redirectPath}
        {loginSuccessMessage ? <div className={messageStyle}>{loginSuccessMessage}</div> : null}
        <h2>Login to Access My-Drive</h2>
        <div className={classes.googleLogin}>
          <GoogleLogin 
            clientId='998253051245-r5r28fhr0m26qgbultjiko893pp1f3l0.apps.googleusercontent.com'
            buttonText='Login with Google'
            onSuccess={googleSuccess}
            onFailure={googleFailure}
            cookiePolicy={'single_host_origin'}
            style={{marginTop: '100px'}}
            // isSignedIn={true}
          />
        </div>
        <br />
        <br />
        <br />
        <h4>Or Login Using Email</h4>
        <form onSubmit={submitHandler}>
          <div className={classes.formControl}>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" placeholder="Your Email" />
          </div>
          <div className={classes.formControl}>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" placeholder="Password" />
          </div>
          <div className={classes.buttonControl}>
            <button type="submit" onClick={() => setMode('login')}>Login</button>
            <button type="submit" onClick={() => setMode('forgotPass')}>Forgot Password</button>
          </div>
          <div className={classes.registerText}>
            Dont Have an Account? 
            <Link to="/register"> Click Here to Register</Link> <br />
          </div>
          <br />
        </form>
      </div>
      {processing ? <Spinner /> : null}
      
  </React.Fragment>
  );
};

export default Auth;
