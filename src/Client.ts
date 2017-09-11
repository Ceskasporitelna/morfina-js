import * as axios from 'axios';
import { Config, Credentials, AxiosResponse } from './model';
import Computer from './Computer';
import Decryptor from './Decryptor';
import { isObjectEmpty } from './utils';

/**
 * MorfinaClient
 * 
 * @class MorfinaClient
 */
class MorfinaClient {
  config: Config;
  computer: Computer;
  decryptor: Decryptor;
  credentials: Credentials;

  /**
   * Creates an instance of MorfinaClient.
   * @param {Config} config 
   * @param {Credentials} credentials
   * 
   * @memberof MorfinaClient
   */
  constructor(config: Config, credentials: Credentials) {
    if (!config) {
      throw Error('You have to pass credentials to MorfinaClient');
    }

    this.config = config;
    this.decryptor = new Decryptor(this.credentials);
    this.computer = new Computer(this.credentials);
  }

  /**
   * Calls Morfina API for crypto and returns "instance" of MorfinaClient with crypto
   * @param {Config} config
   * @returns {Promise<MorfinaClient>}
   * 
   * @static
   * @memberof MorfinaClient
   */
  static getClient = (config: Config): Promise<MorfinaClient> => {
    return axios
      .get(`${config.baseUrl}/morfina/api/v1/configuration/${config.apiKey}`)
      .then((resp: AxiosResponse<Credentials>) => {
        if (!isObjectEmpty(resp.data)) {
          return new MorfinaClient(config, resp.data);
        }

        return axios
          .post(`${config.baseUrl}/morfina/api/v1/configuration/${config.apiKey}/create`)
      })
      .then((resp: AxiosResponse<Credentials>) => {
        return new MorfinaClient(config, resp.data);
      });
  }

  /**¨
   * Calls Morfina server with data and transformOptions where data are encrypted and sent back
   * @param {any} data
   * @param {any} transformOptions
   * @returns {Promise<any>}
   * 
   * @memberof MorfinaClient
   */
  morph = (data: any, transformOptions: any): Promise<any> => { }

  /**
   * Precompute values to make future invokations of encrypt and randomize (significantly) faster.
   * @param {number} numberOfPrimes
   * @returns {Promise<any>}
   * 
   * @memberof MorfinaClient
   */
  precompute = (numberOfPrimes: number): Promise<any> => {
    return this.computer.precompute(numberOfPrimes);
  }

  /**
   * Returns sum of value1 and value2
   * @param {string|number} value1
   * @param {string|number} value2
   * @returns {string}
   * 
   * @memberof MorfinaClient
   */
  add = (value1: string | number, value2: string | number): string => {
    return this.computer.add(value1, value2);
  }

  /**
   * Returns multiplication of value by num
   * @param {string} value
   * @param {number} num
   * @returns {string}
   * 
   * @memberof MorfinaClient
   */
  multiply = (value: string, num: number): string => {
    return this.computer.multiply(value, num);
  }

  /**
   * Returns decrypted data that is passed in encrypted
   * @param {any} data
   * @returns {Promise<any>}
   * 
   * @memberof MorfinaClient
   */
  decryptData = (data: any): Promise<any> => {
    return this.decryptor.decryptData(data);
  }

  /**
   * Returns decrypted data by field key
   * @param {string} field
   * @returns {Promise<any>}
   * 
   * @memberof MorfinaClient
   */
  decryptField = (field: string): Promise<any> => {
    return this.decryptor.decryptField(field);
  }
}

export default MorfinaClient;