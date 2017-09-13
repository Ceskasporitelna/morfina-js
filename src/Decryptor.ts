import * as jp from 'jsonpath';
import { BigInteger } from 'jsbn';
import { Credentials, EncryptPayload, EncryptionParameter } from './model';

class Decryptor {
  private credentials: Credentials;
  private publicKey: any;
  private privateKey: any;

  constructor(credentials: Credentials, publicKey: any, privateKey: any) {
    this.credentials = credentials;
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }

  decryptData = (data: EncryptPayload): Promise<any> => {
    const dataArrayCopy = {...data.dataArray};

    data.encryptionParameters.forEach(x => {
      jp.apply(dataArrayCopy, this.addAsteriskToArrayInPath(x.jsonPath), val => {
        return this.decryptVal(val, x);
      });
    });

    return Promise.resolve(dataArrayCopy);
  }

  decryptField = (data: any, encryptionParameters: EncryptionParameter): Promise<any> => {
    return this.privateKey.decrypt(new BigInteger(data)).toString(10);
  }

  private decryptVal = (val: any, encryptionParameters: EncryptionParameter) => {
    switch(encryptionParameters.encryptionType) {
      case 'AES':

      case 'PAILLIER':
        return this.privateKey.decrypt(new BigInteger(val.toString())).toString(10);
      case 'MD5':

      default:
        throw Error('You have to provide supported encryption type.')
    }
  }

  private addAsteriskToArrayInPath = (path: string): string => path.replace('[]', '[*]');
}

export default Decryptor;