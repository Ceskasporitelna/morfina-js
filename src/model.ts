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

export {
  Credentials,
  Config,
  AxiosResponse,
}