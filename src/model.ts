import { AxiosRequestConfig } from 'axios';

type EncryptionType = 'AES' | 'PAILLIER';

interface Credentials {
  PAILLIER: {
    privateKey: {
      preCalculatedDenominator: string;
      lambda: string;
    };
    publicKey: {
      nSquared: string;
      g: string;
      bits: number;
      n: string;
    };
  };
  AES: {
    password: string;
    salt: string;
    keyLength: number;
    key: string;
  }
}

interface Config {
  baseUrl?: string;
  webApiKey: string;
}

interface AxiosResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: AxiosRequestConfig;
}

interface EncryptionParameter {
  encryptionType: EncryptionType;
  jsonPath: string;
}

interface EncryptionParameterWithApiKey extends EncryptionParameter {
  webAPIKey: string;
}

interface EncryptPayload<T> {
  encryptionParameters: EncryptionParameterWithApiKey[];
  dataArray: T;
}

interface EncryptPayloadWithoutApiKeys<T> {
  encryptionParameters: EncryptionParameter[];
  dataArray: T;
}

export {
  EncryptionType,
  Credentials,
  Config,
  AxiosResponse,
  EncryptionParameter,
  EncryptionParameterWithApiKey,
  EncryptPayload,
  EncryptPayloadWithoutApiKeys,
}