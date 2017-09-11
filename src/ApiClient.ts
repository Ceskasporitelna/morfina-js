import * as axios from 'axios';
import { Credentials, AxiosResponse, EncryptPayload, Config } from './model';

/**
 * 
 * @class ApiClient
 */
class ApiClient {
  config: Config;

  /**
   * Creates an instance of ApiClient.
   * @param {any} config 
   * @memberof ApiClient
   */
  constructor(config) {
    this.config = config;
  }

  /**
   * Create crypto configuration
   * @returns {Promise<AxiosResponse<Credentials>>}
   * 
   * @memberof ApiClient
   */
  createCryptoConfiguration = (): Promise<AxiosResponse<Credentials>> => {
    return axios.post(`${this.config.baseUrl}/morfina/api/v1/configuration/${this.config.webApiKey}/create`);
  }

  /**
   * Get crypto configuration
   * @returns {Promise<AxiosResponse<Credentials>>}
   * 
   * @memberof ApiClient
   */
  getCryptoConfiguration = (): Promise<AxiosResponse<Credentials>> => {
    return axios.get(`${this.config.baseUrl}/morfina/api/v1/configuration/${this.config.webApiKey}`);
  }

  /**
   * Encrypt data
   * @param {EncryptPayload} payload
   * @returns {Promise<AxiosResponse<EncryptPayload>>}
   * 
   * @memberof ApiClient
   */
  encryptData = (payload: EncryptPayload): Promise<AxiosResponse<EncryptPayload>> => {
    return axios.post(`${this.config.baseUrl}/morfina/api/v1/encrypt`, payload);
  }
}

export default ApiClient;