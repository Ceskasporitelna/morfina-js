import * as axios from 'axios';
import { Config, Credentials, AxiosResponse, EncryptPayload, EncryptPayloadWithoutApiKeys, EncryptionParameterWithApiKey } from './model';
import Computer from './Computer';
import Decryptor from './Decryptor';
import { createCryptoConfiguration, getCryptoConfiguration, encryptData } from './api';
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
    this.config = config;
    this.credentials = credentials;
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
    if (!config) {
      throw Error('You have to pass credentials to MorfinaClient');
    }

    return getCryptoConfiguration(config.baseUrl, config.webApiKey)
      .then((resp) => {
        if(!isObjectEmpty(resp.data)) {
          return new MorfinaClient(config, resp.data) as any;
        }

        return createCryptoConfiguration(config.baseUrl, config.webApiKey);
      })
      .then(resp => {
        return new MorfinaClient(config, resp.data);
      });
  }

  /**¨
   * Calls Morfina server with payload where data are encrypted and sent back
   * @param {EncryptPayloadWithoutApiKeys} payload
   * @returns {Promise<AxiosResponse<any>>}
   * 
   * @memberof MorfinaClient
   */
  morph = (payload: EncryptPayloadWithoutApiKeys): Promise<AxiosResponse<any>> => {
    const payloadWithApiKeys = {
      encryptionParameters: payload.encryptionParameters.map((x: EncryptionParameterWithApiKey) => {
        x.webAPIKey = this.config.webApiKey;
        return x;
      }),
      dataArray: payload.dataArray,
    };

    return encryptData(this.config.baseUrl, this.config.webApiKey, payloadWithApiKeys);
  }

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