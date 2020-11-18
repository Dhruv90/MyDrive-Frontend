import React, { useState, useEffect, useCallback } from "react";
import instance from '../instance'

export const AuthContext = React.createContext({
  isAuth: false,
  confirmUser: () => {},
  checkAuth: () => {},
  onAuth: () => {},
  logout: () => {},
  onRegister: () => {},
  forgotPass: () => {},
  resetPassword: () => {},
  googleLogin: (res)=> {},
  refreshGoogleToken: (res) => {}
});

const AuthContextProvider = (props) => {
  const [isAuth, setisAuth] = useState(false);

  const logout = useCallback(() => {
    if (isAuth) {
      localStorage.removeItem("token");
      localStorage.removeItem("expiryDate");
      setisAuth(false);
    }
  }, [isAuth]);

  const checkAuth = useCallback(() => {
    if(localStorage.getItem('token') !== null) {
      if(localStorage.getItem('expiryDate') !== null){
        const now = new Date();
        const expiryDate = new Date(localStorage.getItem("expiryDate"));
        if (now > expiryDate) {
          logout();
        } else {
          setisAuth(true);
        }
      } else {
        setisAuth(true)
      }
    }
  }, [logout]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const onAuth = async (email, password) => {
    try {
      const res = await instance.post("/auth/login", {
        email: email,
        password: password,
      });
      if(res){
        localStorage.setItem("token", `Bearer Native ${res.data.token}`);
        const remainingMilliseconds = 60 * 60 * 1000;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        localStorage.setItem("expiryDate", expiryDate);
        // setTimeout(() => {
        //   logout();
        // }, remainingMilliseconds);
        setisAuth(true);
        refreshToken(res.data.token)
        return { message: res.data.message, loginStatus: true };
      }
      
    } catch (err) {
      let message = err.data.message;
      if (err.status === 422) {
        err.data.data.forEach((error) => {
          message = message + `, ${error.msg}`;
        });
        return { message: message, loginStatus: false };
      } else if (err.status === 400 || err.status === 404) {
        return { message: message, loginStatus: false };
      } else if (err.status !== 200) {
        alert("Something went wrong, Please try again later");
      }
    }
  };

  const refreshToken = async (token) => {

    const remainingMilliseconds = 3600 * 1000;
    const getNewToken = async () => {
      try{
        const response = await instance.post('/auth/refreshToken', token);
        const newToken = response.token;
        localStorage.setItem("token", `Bearer Native ${newToken}`);
        remainingMilliseconds = 60 * 60 * 1000;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        localStorage.setItem("expiryDate", expiryDate);
        setTimeout(getNewToken, remainingMilliseconds)
     } catch (err) {
       console.log('could not get new token');
     }
    }
    setTimeout(getNewToken, remainingMilliseconds);     
  }  

  const onRegister = async (email, password, confirmPassword) => {
    try {
      const res = await instance.post("/auth/signup", {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      });
      return { message: res.data.message, status: true };
    } catch (err) {
      let message = err.data.message;
      console.log(err.data.message);
      if (err.status === 422) {
        err.data.data.forEach((error) => {
          message = message + `, ${error.msg}`;
        });
        return { message: message, status: false };
      } else {
        return { message: message, status: false };
      }
    }  
  };

  const confirmUser = async (key) => {
    const res = await instance.post("/auth/confirm", {
      token: key,
    });
    if (res.status === 200) {
      return 1;
    } else {
      return -1;
    }
  };

  const forgotPass = async (e) => {
    try {
      const email = e.target.email.value;
      const response = await instance.post(
        "/auth/forgotPass",
        { email: email }
      );
      if (response.status === 200) {
        return {message: 'Reset Password Link Sent to your email', verify: 1};
      } else {
        return {message: response.data.message, verify: 0};
      }
    } catch (err) {
      console.log(err);
    }
  };

  const resetPassword = async (email, key, pass, confirmPass) => {
    try {
      const body = {
        email: email,
        key: key,
        pass: pass,
        confirmPass: confirmPass,
      };
      const res = await instance.post("/auth/resetPass", body);
      let message = res.data.message;
      if (res.status === 200) {
        return { message: message, success: true };
      } 
    } catch (err) {
      let message = err.data.message;
      if (err.status === 422) {
        err.data.data.forEach((error) => {
          message = message + `, ${error.msg}`;
        });
        return { message: message, status: false };
      } else {
        return { message: message, status: false };
      }
    }  
  };

  const googleLogin = async (googleResponse) => {
    try {
      const body = {
        email: googleResponse.profileObj.email,
        token: googleResponse.tokenId
      }
      const res = await instance.post('/auth/googleLogin', body)
      if(res.status === 200){
        refreshGoogleToken(googleResponse)
        return {message: res.data.message, status: true}
      } else {
        throw new Error('Error Logging In, please try again')
      }
    } catch(err) {
      console.log(err)
      return {message: err.message, status: false}
    }
  }

  const refreshGoogleToken = async(googleResponse) => {
    const refreshTime = (googleResponse.tokenObj.expires_in || 55*60) * 1000

    const refreshToken = async () => {
      const newAuthRes = await googleResponse.reloadAuthResponse();

      refreshTime = (newAuthRes.expires_in || 55*60) * 1000

      console.log(newAuthRes.id_token)
      localStorage.setItem('token', `Bearer Google ${newAuthRes.id_token}`)
      setTimeout(refreshToken, refreshTime)
    }

    setTimeout(refreshToken, refreshTime)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuth: isAuth,
        checkAuth: checkAuth,
        onAuth: onAuth,
        logout: logout,
        onRegister: onRegister,
        confirmUser: confirmUser,
        forgotPass: forgotPass,
        resetPassword: resetPassword,
        googleLogin: googleLogin,
        refreshGoogleToken: refreshGoogleToken
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
