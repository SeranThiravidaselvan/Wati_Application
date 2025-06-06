import { BASE_URL } from '../config';
import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
   baseURL: BASE_URL,
   headers: {
      'Content-Type': 'application/json',
   },
});

api.interceptors.request.use(
   async (req) => {
      return req;
   },
   async (error) => {
      return Promise.reject(error);
   }
);

api.interceptors.response.use(
   async (res) => {
      return res;
   },
   async (error) => {
      return Promise.reject(error);
   }
);

export default api;
