import { Config } from './model';
import Computer from './Computer';
import Decryptor from './Decryptor';

/**
 * Morfina Client
 * 
 * @class Client
 */
class Client {
  config: Config;
  computer: Computer;
  decryptor: Decryptor;

  /**
   * Creates an instance of Client.
   * @param {Config} config 
   * @memberof Client
   */
  constructor(config: Config) {
    if(!config) {
      throw Error('You have to pass credentials to Client');
    }

    this.config = config;
    this.decryptor = new Decryptor(config);
    this.computer = new Computer(config.publicKey);
  }

  /**¨
   * Calls Morfina server with data and transformOptions where data are encrypted and sent back
   * @param {any} data
   * @param {any} transformOptions
   * @returns {Promise<any>}
   * 
   * @memberof Client
   */
  morph = (data: any, transformOptions: any): Promise<any> => {}

  /**
   * Precompute values to make future invokations of encrypt and randomize (significantly) faster.
   * @param {number} numberOfPrimes
   * @returns {Promise<any>}
   * 
   * @memberof Client
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
   * @memberof Client
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
   * @memberof Client
   */
  multiply = (value: string, num: number): string => {
    return this.computer.multiply(value, num);
  }

  /**
   * Calls Morfina server with data to decrypt that are then returned decrypted
   * @param {any} data
   * @returns {Promise<any>}
   * 
   * @memberof Client
   */
  decryptData = (data: any): Promise<any> => {
    return this.decryptor.decryptData(data);
  }
  
  /**
   * Calls Morfina server with field key to which key to decrypt
   * @param {string} field
   * @returns {Promise<any>}
   * 
   * @memberof Client
   */
  decryptField = (field: string): Promise<any> => {
    return this.decryptor.decryptField(field);
  }
}

export default Client;