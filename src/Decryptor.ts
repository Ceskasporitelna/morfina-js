import { Credentials } from './model';

class Decryptor {
  credentials: Credentials;

  constructor(credentials: Credentials) {
    this.credentials = credentials;
  }

  decryptData = (data: any): Promise<any> => {}

  decryptField = (field: string): Promise<any> => {}
}

export default Decryptor;