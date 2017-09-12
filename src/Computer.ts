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

  precompute = (numberOfPrimes: number): Promise<any> => {}

  add = (value1: string|number, value2: string|number): string => {}

  multiply = (value: string, num: number): string => {}
}

export default Computer;