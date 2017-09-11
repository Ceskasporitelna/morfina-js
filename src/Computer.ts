import { Credentials } from './model';

class Computer {
  credentials: Credentials;

  constructor(credentials: Credentials) {
    this.credentials = credentials;
  }

  precompute = (numberOfPrimes: number): Promise<any> => {}

  add = (value1: string|number, value2: string|number): string => {}

  multiply = (value: string, num: number): string => {}
}

export default Computer;