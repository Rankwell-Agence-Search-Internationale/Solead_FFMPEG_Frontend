import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://167.86.121.201:5000', // Your custom base URL
});

export default axiosInstance;