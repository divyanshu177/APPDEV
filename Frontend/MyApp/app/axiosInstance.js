import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const axiosInstance = axios.create({
baseURL: 'http://10.61.90.94:3000',
headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    const userId = await AsyncStorage.getItem('userId');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
