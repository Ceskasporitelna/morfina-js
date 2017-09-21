import * as paillier from '../lib/paillier'
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
   * Precompute values to make future invokations of encrypt significantly faster.
   * @param {number} numberOfPrimes
   * @returns {void}
   *
   * @memberof Computer
   */
  precompute = (numberOfPrimes: number): void => {
    return this.publicKey.precompute(numberOfPrimes);
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
    return this.publicKey.addCrypt(
      this.getEncryptedBigIntegerFromValue(value1),
      this.getEncryptedBigIntegerFromValue(value2)
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
    return this.publicKey.multiply(
      this.getEncryptedBigIntegerFromValue(value),
      new BigInteger(num.toString(), 10)
    ).toString();
  }

  /**
   * If passed in value is string then it assumes that passed in value is encrypted so it creates BigInteger.
   * If passed in values is number then in returns decrypted BigInteger.
   * @param {string | number} val
   * @returns {BigInteger}
   *
   * @private
   * @memberof Computer
   */
  private getEncryptedBigIntegerFromValue = (val: string | number): string => {
    if (typeof val === 'string') {
      return new BigInteger(val, 10);
    }

    if (typeof val === 'number') {
      const bigInt = new BigInteger(val.toString(), 10);
      return this.publicKey.encrypt(bigInt);
    }

    throw Error('Input must be number or string');
  }
}

export default Computer;