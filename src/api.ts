import * as axios from 'axios';
import { Credentials, AxiosResponse } from './model';

const createCryptoConfiguration = (baseUrl, webApiKey): Promise<AxiosResponse<Credentials>> => {
  return axios.post(`${baseUrl}/morfina/api/v1/configuration/${webApiKey}/create`);
};

const getCryptoConfiguration = (baseUrl, webApiKey): Promise<AxiosResponse<Credentials>> => {
  return axios.get(`${baseUrl}/morfina/api/v1/configuration/${webApiKey}`);
}

export {
  createCryptoConfiguration,
  getCryptoConfiguration,
}