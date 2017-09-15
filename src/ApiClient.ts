import * as axios from 'axios';
import { Credentials, AxiosResponse, EncryptPayload, Config } from './model';

/**
 * 
 * @class ApiClient
 */
export abstract class ApiClient {
  config: Config;
  public static headers: object = {};

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
    return axios.post(`${this.config.baseUrl}/morfina/api/v1/configuration/${this.config.webApiKey}/create`, null, { headers: ApiClient.headers });
  }

  /**
   * Get crypto configuration
   * @returns {Promise<AxiosResponse<Credentials>>}
   * 
   * @memberof ApiClient
   */
  getCryptoConfiguration = (): Promise<AxiosResponse<Credentials>> => {
    return axios.get(`${this.config.baseUrl}/morfina/api/v1/configuration/${this.config.webApiKey}`, { headers: ApiClient.headers });
  }

  /**
   * Encrypt data
   * @param {EncryptPayload} payload
   * @returns {Promise<AxiosResponse<EncryptPayload>>}
   * 
   * @memberof ApiClient
   */
  encryptData<T>(payload: EncryptPayload<T>): Promise<AxiosResponse<EncryptPayload<T>>> {
    return axios.post(`${this.config.baseUrl}/morfina/api/v1/encrypt`, payload, { headers: ApiClient.headers })
  }
}

export default class Client extends ApiClient {
  constructor(config) {
    super(config);
  }
}