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
   * @returns {T}
   * 
   * @memberof Decryptor
   */
  decryptData<T>(data: EncryptPayload<T>): T {
    const dataArrayCopy = JSON.parse(JSON.stringify(data.dataArray));

    data.encryptionParameters.forEach(x => {
      jp.apply(dataArrayCopy, this.addAsteriskToArrayInPath(x.jsonPath), val => {
        return this.decryptVal(val, x.encryptionType);
      });
    });

    return dataArrayCopy;
  }

  /**
   * @param {string} value
   * @param {EncryptionType} encryptionType
   * @returns {string}
   * 
   * @memberof Decryptor
   */
  decryptValue = (value: string, encryptionType: EncryptionType): string => {
    const decryptedValue = this.decryptVal(value, encryptionType);
    return decryptedValue;
  }

  /**
   * @param {*} data 
   * @param {EncryptionParameter} encryptionParameters 
   * @returns {string[]} 
   * 
   * @memberof Decryptor
   */
  getDecryptedValuesForPath(data: any, encryptionParameters: EncryptionParameter): string[] {
    if(!encryptionParameters) {
      throw Error('You have to provide encryptionParameters as second argument');
    }
    
    const dataCopy = JSON.parse(JSON.stringify(data));
    const decryptedValues = jp.query(dataCopy, this.addAsteriskToArrayInPath(encryptionParameters.jsonPath))
                              .map(x => this.decryptVal(x, encryptionParameters.encryptionType));

    return decryptedValues;
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