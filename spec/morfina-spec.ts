import { MorfinaClient } from '../src';
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
  const client = await MorfinaClient.getClient({
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

async function sumPaillier(client) {
  
  const response = await client.morph(getEncryptPayload('PAILLIER'));
  const encryptedVal = response.data.dataArray.transactions[0].amount.value;

  //This method of time computation is accurate enough for our purposes
  const start = new Date().getTime();
  const value = await client.computer.add(100, encryptedVal);
  const end = new Date().getTime();

  const decrypted = await client.decryptor.decryptValue(value, "PAILLIER");
  expect(decrypted).toEqual('200');

  return {
    time: end - start,
    decrypted,
  }
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
    const client = await getClient();

    //Without precomputation
    const result1 = await sumPaillier(client);

    //With precomputation
    await client.computer.precompute(1);

    expect((client.computer as any).publicKey.rncache.length).toEqual(1);
    const result2 = await sumPaillier(client);
    expect((client.computer as any).publicKey.rncache.length).toEqual(0);

    const threshold = 500;
    expect(result1.time).toBeGreaterThan(result2.time + threshold);

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
      const added = await client.add(response.data.dataArray.transactions[0].amount.value, 10);
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
      const multiplied = await client.multiply(response.data.dataArray.transactions[0].amount.value, 2);
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