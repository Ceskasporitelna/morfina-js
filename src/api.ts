import * as axios from 'axios';
import { Credentials, AxiosResponse, EncryptPayload } from './model';

const createCryptoConfiguration = (baseUrl: string, webApiKey: string): Promise<AxiosResponse<Credentials>> => {
  return axios.post(`${baseUrl}/morfina/api/v1/configuration/${webApiKey}/create`);
};

const getCryptoConfiguration = (baseUrl: string, webApiKey: string): Promise<AxiosResponse<Credentials>> => {
  return axios.get(`${baseUrl}/morfina/api/v1/configuration/${webApiKey}`);
}

const encryptData = (baseUrl: string, webApiKey: string, payload: EncryptPayload): Promise<AxiosResponse<EncryptPayload>> => {
  return axios.post(`${baseUrl}/morfina/api/v1/encrypt`, payload);
}

export {
  createCryptoConfiguration,
  getCryptoConfiguration,
  encryptData,
}