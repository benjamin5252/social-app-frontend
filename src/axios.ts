import axios from 'axios';

const makeRequest = axios.create({
  baseURL: process.env.API + '/api',
  withCredentials: true,
});

makeRequest.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Anything except 2XX goes to here
    const status = error.response?.status || 500;
    if (status === 401 || status === 403) {
      localStorage.removeItem('user');
      setTimeout(() => (location.href = '/#/login'), 1000);
    } else {
      return Promise.reject(error); // Delegate error to calling side
    }
  },
);

export default makeRequest;
