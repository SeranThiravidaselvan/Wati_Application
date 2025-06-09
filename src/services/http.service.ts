import { AxiosRequestConfig, AxiosResponse } from 'axios';
import api from './interceptors';

const httpClient = {
   async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
      const response: AxiosResponse<T> = await api.get(url, config);
      return response.data;
   },
   async post<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T | null> {
      const response: AxiosResponse<T> = await api.post<T>(url, data, config);
      return response.data;
   },
   async put<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
      const response: AxiosResponse<T> = await api.put<T>(url, data, config);
      return response.data;
   },
   async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
      const response: AxiosResponse<T> = await api.delete<T>(url, config);
      return response.data;
   },
};
export { httpClient as http };
