import * as jp from 'jsonpath';
import { AES, enc, mode, pad } from 'crypto-js';
import { BigInteger } from 'jsbn';
import { Credentials, EncryptPayload, EncryptionParameter, EncryptionType } from './model';

/**
 * 
 * 
 * @class Decryptor
 */
class Decryptor {
  private credentials: Credentials;
  private publicKey: any;
  private privateKey: any;

  /**
   * Creates an instance of Decryptor.
   * @param {Credentials} credentials 
   * @param {*} publicKey 
   * @param {*} privateKey 
   * @memberof Decryptor
   */
  constructor(credentials: Credentials, publicKey: any, privateKey: any) {
    this.credentials = credentials;
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }

  /**
   * @param {EncryptPayload} data
   * @returns {Promise<any>}
   * 
   * @memberof Decryptor
   */
  decryptData<T>(data: EncryptPayload<T>): Promise<T> {
    const dataArrayCopy = JSON.parse(JSON.stringify(data.dataArray));

    data.encryptionParameters.forEach(x => {
      jp.apply(dataArrayCopy, this.addAsteriskToArrayInPath(x.jsonPath), val => {
        return this.decryptVal(val, x.encryptionType);
      });
    });

    return Promise.resolve(dataArrayCopy);
  }

  /**
   * @param {string} value
   * @param {EncryptionType} encryptionType
   * @returns {Promise<string>}
   * 
   * @memberof Decryptor
   */
  decryptValue = (value: string, encryptionType: EncryptionType): Promise<string> => {
    const decryptedValue = this.decryptVal(value, encryptionType);
    return Promise.resolve(decryptedValue);
  }

  /**
   * @param {*} data 
   * @param {EncryptionParameter} encryptionParameters 
   * @returns {Promise<string[]>} 
   * 
   * @memberof Decryptor
   */
  getDecryptedValuesForPath(data: any, encryptionParameters: EncryptionParameter): Promise<string[]> {
    if(!encryptionParameters) {
      throw Error('You have to provide encryptionParameters as second argument');
    }
    
    const dataCopy = JSON.parse(JSON.stringify(data));
    const decryptedValues = jp.query(dataCopy, this.addAsteriskToArrayInPath(encryptionParameters.jsonPath))
                              .map(x => this.decryptVal(x, encryptionParameters.encryptionType));

    return Promise.resolve(decryptedValues);
  }

  /**
   * @param {any} val
   * @param {string} encryptionType
   * @returns {string}
   * 
   * @private
   * @memberof Decryptor
   */
  private decryptVal = (val: any, encryptionType: string): string => {
    switch(encryptionType) {
      case 'AES':
        return AES.decrypt(val, enc.Base64.parse(this.credentials.AES.key), { mode: mode.ECB }).toString(enc.Utf8);

      case 'PAILLIER':
        return this.privateKey.decrypt(new BigInteger(val.toString())).toString(10);
        
      default:
        return val;
    }
  }

  /**
   * @param {string} path
   * @returns {string}
   * 
   * @private
   * @memberof Decryptor
   */
  private addAsteriskToArrayInPath = (path: string): string => path.replace('[]', '[*]');
}

export default Decryptor;