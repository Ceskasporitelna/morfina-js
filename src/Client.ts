import { Config } from './model';
import Computer from './Computer';
import Decryptor from './Decryptor';

/**
 * MorfinaClient
 * 
 * @class MorfinaClient
 */
class MorfinaClient {
  config: Config;
  computer: Computer;
  decryptor: Decryptor;

  /**
   * Creates an instance of MorfinaClient.
   * @param {Config} config 
   * @memberof MorfinaClient
   */
  constructor(config: Config) {
    if(!config) {
      throw Error('You have to pass credentials to MorfinaClient');
    }

    this.config = config;
    this.decryptor = new Decryptor(config);
    this.computer = new Computer(config.keypair.publicKey);
  }

  /**¨
   * Calls Morfina server with data and transformOptions where data are encrypted and sent back
   * @param {any} data
   * @param {any} transformOptions
   * @returns {Promise<any>}
   * 
   * @memberof MorfinaClient
   */
  morph = (data: any, transformOptions: any): Promise<any> => {}

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
  add = (value1: string|number, value2: string|number): string => {
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