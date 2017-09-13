import * as jp from 'jsonpath';
import { AES, enc } from 'crypto-js';
import { BigInteger } from 'jsbn';
import { Credentials, EncryptPayload, EncryptionParameter } from './model';
// var Base64 = require('js-base64').Base64;

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
    const dataArrayCopy = JSON.parse(JSON.stringify(data.dataArray));

    data.encryptionParameters.forEach(x => {
      jp.apply(dataArrayCopy, this.addAsteriskToArrayInPath(x.jsonPath), val => {
        return this.decryptVal(val, x.encryptionType);
      });
    });

    return Promise.resolve(dataArrayCopy);
  }

  decryptField = (data: any, encryptionParameters: EncryptionParameter): Promise<any> => {
    return this.privateKey.decrypt(new BigInteger(data.toString())).toString(10);
  }


  private decryptVal = (val: any, encryptionType: string) => {

    switch(encryptionType) {
      case 'AES':
        console.log('result', AES.decrypt(Base64.decode(val.toString()), Base64.decode(this.credentials.AES.password)).toString(enc.Utf8));
        return AES.decrypt(Base64.decode(val), Base64.decode(this.credentials.AES.password)).toString(enc.Utf8);

      case 'PAILLIER':
        return this.privateKey.decrypt(new BigInteger(val.toString())).toString(10);

      default:
        throw Error('You have to provide supported encryption type.')
    }
  }

  private addAsteriskToArrayInPath = (path: string): string => path.replace('[]', '[*]');
}

var Base64 = {
  characters: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" ,

  encode: function( string )
  {
      var characters = Base64.characters;
      var result     = '';

      var i = 0;
      do {
          var a = string.charCodeAt(i++);
          var b = string.charCodeAt(i++);
          var c = string.charCodeAt(i++);

          a = a ? a : 0;
          b = b ? b : 0;
          c = c ? c : 0;

          var b1 = ( a >> 2 ) & 0x3F;
          var b2 = ( ( a & 0x3 ) << 4 ) | ( ( b >> 4 ) & 0xF );
          var b3 = ( ( b & 0xF ) << 2 ) | ( ( c >> 6 ) & 0x3 );
          var b4 = c & 0x3F;

          if( ! b ) {
              b3 = b4 = 64;
          } else if( ! c ) {
              b4 = 64;
          }

          result += Base64.characters.charAt( b1 ) + Base64.characters.charAt( b2 ) + Base64.characters.charAt( b3 ) + Base64.characters.charAt( b4 );

      } while ( i < string.length );

      return result;
  } ,

  decode: function( string )
  {
      var characters = Base64.characters;
      var result     = '';

      var i = 0;
      do {
          var b1 = Base64.characters.indexOf( string.charAt(i++) );
          var b2 = Base64.characters.indexOf( string.charAt(i++) );
          var b3 = Base64.characters.indexOf( string.charAt(i++) );
          var b4 = Base64.characters.indexOf( string.charAt(i++) );

          var a = ( ( b1 & 0x3F ) << 2 ) | ( ( b2 >> 4 ) & 0x3 );
          var b = ( ( b2 & 0xF  ) << 4 ) | ( ( b3 >> 2 ) & 0xF );
          var c = ( ( b3 & 0x3  ) << 6 ) | ( b4 & 0x3F );

          result += String.fromCharCode(a) + (b?String.fromCharCode(b):'') + (c?String.fromCharCode(c):'');

      } while( i < string.length );

      return result;
  }
};

export default Decryptor;