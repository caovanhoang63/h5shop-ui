import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: 'https://h5shop.com',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});





export default axiosInstance;
