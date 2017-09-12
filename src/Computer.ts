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
      this.getEncryptedStringFromValue(value2),
    );
  }

  multiply = (value: string, num: number): string => {}

  private getEncryptedStringFromValue = (val: string | number): string => {
    
      if(typeof val === 'string') {
        return val as string;
      }
        
      if(typeof val === 'number') {
        const bigInt = new BigInteger(val, 10);
        return this.publicKey.encrypt(bigInt);
      }

      throw Error('Input must be number or string');
    }
  }
}

export default Computer;