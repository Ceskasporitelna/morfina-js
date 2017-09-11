import { AxiosRequestConfig } from 'axios';

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
  encryptionType: string;
  jsonPath: string;
}

interface EncryptionParameterWithApiKey extends EncryptionParameter {
  webAPIKey: string;
}

interface EncryptPayload {
  encryptionParameters: EncryptionParameterWithApiKey[];
  dataArray: any;
}

interface EncryptPayloadWithoutApiKeys {
  encryptionParameters: EncryptionParameter[];
  dataArray: any;
}

export {
  Credentials,
  Config,
  AxiosResponse,
  EncryptionParameter,
  EncryptionParameterWithApiKey,
  EncryptPayload,
  EncryptPayloadWithoutApiKeys,
}