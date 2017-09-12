import { Credentials } from './model';

class Decryptor {
  private credentials: Credentials;
  private publicKey: any;
  private privateKey: any;

  constructor(credentials: Credentials, publicKey, privateKey) {
    this.credentials = credentials;
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }

  decryptData = (data: any): Promise<any> => {}

  decryptField = (field: string): Promise<any> => {}
}

export default Decryptor;