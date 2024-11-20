import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: 'https://api.h5shop.shop',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});





export default axiosInstance;
