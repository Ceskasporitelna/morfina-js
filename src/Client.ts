import * as axios from 'axios';
import * as paillier from '../lib/paillier';
import { BigInteger } from 'jsbn';
import {
  Config,
  Credentials,
  AxiosResponse,
  EncryptPayload,
  EncryptPayloadWithoutApiKeys,
  EncryptionParameterWithApiKey,
  EncryptionParameter,
  EncryptionType,
} from './model';
import Computer from './Computer';
import Decryptor from './Decryptor';
import ApiClient from './ApiClient';
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
  apiClient: ApiClient;

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
    this.apiClient = new ApiClient(config);
    
    const pub = new paillier.publicKey(credentials.PAILLIER.publicKey.bits, new BigInteger(credentials.PAILLIER.publicKey.n));
    const priv = new paillier.privateKey(new BigInteger(credentials.PAILLIER.privateKey.lambda), pub);

    this.computer = new Computer(pub, priv);
    this.decryptor = new Decryptor(this.credentials, pub, priv);
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
    let client = new ApiClient(config);

    if (!config) {
      throw Error('You have to pass credentials to MorfinaClient');
    }

    return client.getCryptoConfiguration()
      .then((resp) => {
        if(!isObjectEmpty(resp.data)) {
          client = undefined;
          return new MorfinaClient(config, resp.data) as any;
        }

        return client.createCryptoConfiguration()
          .then(resp => {
            client = undefined;
            return new MorfinaClient(config, resp.data);
          });
      });
  }

  /**¨
   * Calls Morfina server with payload where data are encrypted and sent back
   * @param {EncryptPayloadWithoutApiKeys} payload
   * @returns {Promise<AxiosResponse<any>>}
   * 
   * @memberof MorfinaClient
   */
  morph<T = any>(payload: EncryptPayloadWithoutApiKeys<T>): Promise<AxiosResponse<EncryptPayload<T>>> {
    const payloadWithApiKeys = {
      encryptionParameters: payload.encryptionParameters.map((x: EncryptionParameterWithApiKey) => {
        x.webAPIKey = this.config.webApiKey;
        return x;
      }),
      dataArray: payload.dataArray,
    };

    return this.apiClient.encryptData<T>(payloadWithApiKeys);
  }

  /**
   * Precompute values to make future invokations of encrypt significantly faster.
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
  multiply = (value: string | number, num: number): string => {
    return this.computer.multiply(value, num);
  }

  /**
   * Returns decrypted data that is passed in encrypted
   * @param {EncryptPayload} data
   * @returns {Promise<any>}
   * 
   * @memberof MorfinaClient
   */
  decryptData<T = any>(data: EncryptPayload<T>): Promise<T> {
    return this.decryptor.decryptData(data);
  }

  /**
   * @param {string} value
   * @param {EncryptionType} encryptionType
   * @returns {Promise<string>}
   * 
   * @memberof Decryptor
   */
  decryptValue = (value: string, encryptionType: EncryptionType): Promise<string> => {
    return this.decryptor.decryptValue(value, encryptionType);
  }

  /**
   * @param {*} data 
   * @param {EncryptionParameter} encryptionParameters 
   * @returns {Promise<string[]>} 
   * 
   * @memberof Decryptor
   */
  getDecryptedValuesForPath<T = any>(data: T, encryptionParameters: EncryptionParameter): Promise<string[]> {
    return this.decryptor.getDecryptedValuesForPath(data, encryptionParameters);
  }
}

export default MorfinaClient;