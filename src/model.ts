interface Client {
  apiKey: string;
  publicKey: string;
  privateKey: string;
  aesKey?: string;
  computer: Computer;
  decryptor: Decryptor;

  constructor: (credentials: Credentials) => void;
  morph: (data: any, options: any) => Promise<any>;
}

interface Computer {
  publicKey: string;
  paillier: any;

  constructor: (publicKey: string) => void;
  precompute: (numberOfPrimes: number) => void;
  add: (value1: string|number, value2: string|number) => void;
  multiply: (value: string, num: number) => void;
}

interface Decryptor {
  constructor: (credentials: Credentials) => void;
  decrypt: (data: any) => Promise<void>;
  decryptField: (field: string) => Promise<void>;
}

interface Credentials {
  apiKey: string;
  aesKey?: string;
  keypair: {
    publicKey: string;
    privateKey: string;
  };
}

interface Config extends Credentials {
  baseUrl?: string;
}

export {
  Credentials,
  Config,
}