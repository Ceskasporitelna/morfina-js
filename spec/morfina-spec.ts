import Morfina from '../src';
import { EncryptPayloadWithoutApiKeys, EncryptionType } from '../src/model';
import { ApiClient } from '../src/ApiClient';

import * as CSCoreSDK from 'cs-core-sdk';
var judge: CSCoreSDK.Judge = null;
var judgeSession: CSCoreSDK.JudgeSession = null;
var logJudgeError = CSCoreSDK.TestUtils.logJudgeError;

const getEncryptPayload = (encryptionType: EncryptionType): EncryptPayloadWithoutApiKeys<Transactions> => {
  return {
    "encryptionParameters": [
      {
        "encryptionType": encryptionType,
        "jsonPath": "transactions[].amount.value",
      }
    ],
    "dataArray": {
      "transactions": [
        {
          "amount": {
            "currency": "CZK",
            "precision": 2,
            "value": 100
          }
        }
      ]
    }
  }
}

async function getClient() {
  await judgeSession.setNextCase('morfina.getCryptoConfig');
  const client = await Morfina.getClient({
    baseUrl: 'http://morfinaagents.westeurope.cloudapp.azure.com',
    webApiKey: 'TEST_API_KEY',
  });
  return client;
}

async function encrypt(judgeCase: string, encryptionType: EncryptionType) {
  const client = await getClient();
  await judgeSession.setNextCase(judgeCase);

  const response = await client.morph(getEncryptPayload(encryptionType));
  return {
    response,
    client,
  };
}

describe("Morfina SDK", function () {
  var originalTimeoutInterval = null;

  beforeAll(function () {
    judge = new CSCoreSDK.Judge();
    //Because Judge starts slowly on the first request
    originalTimeoutInterval = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
  });

  afterAll(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeoutInterval;
  });

  beforeEach(function () {
    judgeSession = judge.startNewSession();
    ApiClient.headers = { 'x-judge-session': judgeSession.sessionId }
  });

  it('Fetches crypto config and creates client', async done => {
    try {
      await getClient();

      done();
    } catch(err) {
      console.log('err', err);
    }
  });


  it('Computer - Encryption/Decryption works with/without precomputed values', async done => {
    //Without precomputation
    let client = await getClient();
    //This method of time computation is accurate enough for our purposes
    var start = new Date().getTime();
    let value = client.computer.encrypt(100);
    value = client.computer.add(100, value);
    let decrypted = await client.decryptor.decryptValue(value, "PAILLIER");
    expect(decrypted).toEqual('200');
    var end = new Date().getTime();
    var withoutPrecomputationTime = end - start;

    //With precomputation
    client = await getClient();
    await client.computer.precompute(2);
    var start = new Date().getTime();
    //WhiteBox testing
    expect((client.computer as any).publicKey.rncache.length).toEqual(2);
    value = client.computer.encrypt(100);
    expect((client.computer as any).publicKey.rncache.length).toEqual(1);
    value = client.computer.add(100, value);
    decrypted = await client.decryptor.decryptValue(value, "PAILLIER");
    expect(decrypted).toEqual('200');
    expect((client.computer as any).publicKey.rncache.length).toEqual(0);
    var end = new Date().getTime();
    var withPrecomputationTime = end - start;
    const threshold = 500;
    expect(withoutPrecomputationTime).toBeGreaterThan(withPrecomputationTime + threshold)
    done();
  });


  it('decrypts data with AES through decryptData method', async done => {
    try {
      const { response, client } = await encrypt('morfina.encrypt.aes', 'AES');
      const result = await client.decryptData<Transactions>(response.data);
      expect(result.transactions[0].amount.value).toEqual('100');

      done();
    } catch(err) {
      console.log('err', logJudgeError(err));
    }
  });

  it('decrypts value with AES through decryptValue method', async done => {
    try {
      const { response, client } = await encrypt('morfina.encrypt.aes', 'AES');
      const result = await client.decryptValue(response.data.dataArray.transactions[0].amount.value as string, 'AES');

      expect(result).toEqual('100');

      done();
    } catch(err) {
      console.log('err', logJudgeError(err));
    }
  });

  it('decrypts value with AES through getDecryptedValuesForPath method', async done => {
    try {
      const { response, client } = await encrypt('morfina.encrypt.aes', 'AES');
      const result = await client.getDecryptedValuesForPath(response.data.dataArray, response.data.encryptionParameters[0]);

      expect(result[0]).toEqual('100');

      done();
    } catch(err) {
      console.log('err', logJudgeError(err));
    }
  });

  it('decrypts data with PAILLIER through decryptData method', async done => {
    try {
      const { response, client } = await encrypt('morfina.encrypt.paillier', 'PAILLIER');
      const result = await client.decryptData(response.data);
      expect(result.transactions[0].amount.value).toEqual('100');

      done();
    } catch(err) {
      console.log('err', logJudgeError(err));
    }
  });

  it('decrypts value with PAILLIER through decryptValue method', async done => {
    try {
      const { response, client } = await encrypt('morfina.encrypt.paillier', 'PAILLIER');
      const result = await client.decryptValue(response.data.dataArray.transactions[0].amount.value as string, 'PAILLIER');

      expect(result).toEqual('100');

      done();
    } catch(err) {
      console.log('err', logJudgeError(err));
    }
  });


  it('decrypts value with PAILLIER through getDecryptedValuesForPath method', async done => {
    try {
      const { response, client } = await encrypt('morfina.encrypt.paillier', 'PAILLIER');
      const result = await client.getDecryptedValuesForPath(response.data.dataArray, response.data.encryptionParameters[0]);

      expect(result[0]).toEqual('100');

      done();
    } catch(err) {
      console.log('err', logJudgeError(err));
    }
  });

  it('encrypts value then adds 10 to it and then decrypts it with PAILLIER through decryptValue method', async done => {
    try {
      const { response, client } = await encrypt('morfina.encrypt.paillier', 'PAILLIER');
      const added = client.add(response.data.dataArray.transactions[0].amount.value, 10);
      const result = await client.decryptValue(added, 'PAILLIER');

      expect(result).toEqual('110');

      done();
    } catch(err) {
      console.log('err', logJudgeError(err));
    }
  });

  it('encrypts value then multiplies it by 2 and then decrypts it with PAILLIER through decryptValue method', async done => {
    try {
      const { response, client } = await encrypt('morfina.encrypt.paillier', 'PAILLIER');
      const multiplied = client.multiply(response.data.dataArray.transactions[0].amount.value, 2);
      const result = await client.decryptValue(multiplied, 'PAILLIER');

      expect(result).toEqual('200');

      done();
    } catch(err) {
      console.log('err', logJudgeError(err));
    }
  });
});

export interface Transactions {
  transactions: Transaction[];
}

export interface Transaction {
  amount: {
    value: string|number;
    currency: string;
    precision: number;
  }
}