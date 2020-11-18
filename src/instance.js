import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3001'
})

instance.interceptors.response.use(undefined, err=>{
  const error = err.response
    if(error.status === 401){
      alert('Please Login Again');
      localStorage.removeItem('token');
      localStorage.removeItem('expiryDate');
    }
    else {
      return Promise.reject(error)
    }
})

export default instance;