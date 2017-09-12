import * as paillier from '../lib/paillier';
import { BigInteger } from 'jsbn';
import { Credentials } from './model';

class Computer {
  credentials: Credentials;
  publicKey: any;
  privateKey: any;

  constructor(credentials: Credentials) {
    const { publicKey, privateKey } = credentials.PAILLIER;

    this.credentials = credentials;
    this.publicKey = new paillier.publicKey(publicKey.bits, new BigInteger(publicKey.n));
    this.privateKey = new paillier.privateKey(new BigInteger(privateKey.lambda), this.publicKey);
  }

  precompute = (numberOfPrimes: number): Promise<any> => {
    return Promise.resolve(this.publicKey.precompute(numberOfPrimes));
  }

  add = (value1: string | number, value2: string | number): string => {
    return this.publicKey.add(
      this.getEncryptedStringFromValue(value1),
      this.getEncryptedStringFromValue(value2)
    ).toString();
  }

  multiply = (value: string | number, num: string | number): string => {
    return this.publicKey.mult(
      this.getEncryptedStringFromValue(value),
      new BigInteger(num.toString(), 10)
    ).toString();
  }

  decrypt = (val: any) => {
    return this.privateKey.decrypt(new BigInteger(val)).toString(10);
  }

  private getEncryptedStringFromValue = (val: string | number): string => {
    if (typeof val === 'string') {
      return val as string;
    }

    if (typeof val === 'number') {
      const bigInt = new BigInteger(val.toString(), 10);
      return this.publicKey.encrypt(bigInt);
    }

    throw Error('Input must be number or string');
  }
}

export default Computer;