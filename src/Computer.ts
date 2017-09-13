import * as paillier from '../lib/paillier';
import { BigInteger } from 'jsbn';
import { Credentials } from './model';

/**
 * 
 * 
 * @class Computer
 */
class Computer {
  private publicKey: any;
  private privateKey: any;

  /**
   * Creates an instance of Computer.
   * @param {Credentials} credentials 
   * @memberof Computer
   */
  constructor(publicKey, privateKey) {
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }

  /**
   * Precompute values to make future invokations of encrypt and randomize (significantly) faster.
   * @param {number} numberOfPrimes
   * @returns {Promise<any>}
   * 
   * @memberof Computer
   */
  precompute = (numberOfPrimes: number): Promise<any> => {
    return Promise.resolve(this.publicKey.precompute(numberOfPrimes));
  }

  /**
   * Returns sum of value1 and value2
   * @param {string|number} value1
   * @param {string|number} value2
   * @returns {string}
   * 
   * @memberof Computer
   */
  add = (value1: string | number, value2: string | number): string => {
    return this.publicKey.add(
      this.getEncryptedStringFromValue(value1),
      this.getEncryptedStringFromValue(value2)
    ).toString();
  }

  /**
   * Returns multiplication of value by num
   * @param {string|number} value
   * @param {number} num
   * @returns {string}
   * 
   * @memberof Computer
   */
  multiply = (value: string | number, num: number): string => {
    return this.publicKey.mult(
      this.getEncryptedStringFromValue(value),
      new BigInteger(num.toString(), 10)
    ).toString();
  }

  /**
   * Returns string if val is string. If val is number then it returns encrypted BigInteger.
   * @param {string | number} val
   * @returns {string}
   * 
   * @private
   * @memberof Computer
   */
  public getEncryptedStringFromValue = (val: string | number): string => {
    if (typeof val === 'string') {
      return val as string;
    }

    if (typeof val === 'number') {
      const bigInt = new BigInteger(val.toString(), 10);
      return this.publicKey.encrypt(bigInt).toString();
    }

    throw Error('Input must be number or string');
  }
}

export default Computer;