import { Credentials } from './model';
import Computer from './Computer';
import Decryptor from './Decryptor';

class Client {
  credentials: Credentials;
  computer: Computer;
  decryptor: Decryptor;

  constructor(credentials: Credentials) {
    if(!credentials) {
      throw Error('You have to pass credentials to Client');
    }

    this.credentials = credentials;
    this.decryptor = new Decryptor(credentials);
    this.computer = new Computer(credentials.publicKey);
  }

  morph = (data: any, transformOptions: any): Promise<any> => {}

  precompute = (numberOfPrimes: number): Promise<any> => {
    return this.computer.precompute(numberOfPrimes);
  }

  add = (value1: string|number, value2: string|number): string => {
    return this.computer.add(value1, value2);
  }

  multiply = (value: string, num: number): string => {
    return this.computer.multiply(value, num);
  }

  decryptData = (data: any): Promise<any> => {
    return this.decryptor.decryptData(data);
  }
  
  decryptField = (field: string): Promise<any> => {
    return this.decryptor.decryptField(field);
  }
}

export default Client;