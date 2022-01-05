import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

export const sendRequest = (config: AxiosRequestConfig): AxiosPromise => {
  return axios(config);
};
