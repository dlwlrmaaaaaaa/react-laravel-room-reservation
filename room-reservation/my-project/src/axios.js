import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    'Content-Type': 'application/json',
     Accept: 'application/json',
  }
});

axiosClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const {response} = error;
    if(response.status === 401){
      axiosClient.post('/logout').then(() => {
        localStorage.removeItem("room");
        localStorage.removeItem("user");
        localStorage.removeItem("auth");
        localStorage.removeItem("roles");
    }).catch(() => {
        window.location.href = '/login';
    });
    }else if(response.status === 419){
        localStorage.removeItem("user") || null;
        localStorage.removeItem("auth") || null;
        localStorage.removeItem("role") || null;
        window.location.href = '/login'
    }
    throw error;
  }
)

export default axiosClient;

