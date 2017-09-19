# MorfinaJS

MorfinaJS allows you to encrypt and decrypt data in Morfina Service. It also allows you to add to and multiply numbers encrypted with Paillier encryption type.

## Get client

Get Morgina client by calling the static [`getClient`](../src/Client.ts) method of class [`MorfinaClient`](../src/Client.ts) passing it your `webApiKey` and `baseUrl` in [config: Config](../src/model.ts). The method returns new [`MorfinaClient`](../src/Client.ts) wrapped in `Promise`.

```js

  // async/await
  const client = await Morfina.getClient({
    baseUrl: 'path/to/morfina/service',
    webApiKey: 'YOUR_API_KEY',
  });

  // Promises
  Morfina.getClient({
    baseUrl: 'path/to/morfina/service',
    webApiKey: 'YOUR_API_KEY',
  }).then(...);

```

## Morph

Encrypt data by calling the [`morph`](../src/Client.ts) method with [`payload: EncryptPayloadWithoutApiKeys`](../src/model.ts) that includes encryption parameters under the key `encryptionParameters` and data to encrypt under the key `dataArray`.

```js

  const payload = {
    encryptionParameters: [
      {
        encryptionType: 'AES',
        jsonPath: 'transactions[].amount.value',
      }
    ],
    dataArray: {
      transactions: [
        {
          amount: {
            currency: 'CZK',
            precision: 2,
            value: 100
          }
        }
      ]
    }
  }

  Morfina.getClient({
    baseUrl: 'path/to/morfina/service',
    webApiKey: 'YOUR_API_KEY',
  }).then(client => {
    return client.morph(payload);
  }).then(...);

```

## decryptData

Decrypt all data from server by calling the method [`decryptData`](../src/Client.ts). It takes one [`data: EncryptPayload`](../src/model.ts) argument that is in format that the `morph` method returns. It returns data wrapped in `Promise`.

```js

  const encryptedData = {
    dataArray: {
      transactions: [
        {
          amount: {
            precision: 2,
            currency: 'CZK',
            value: '5Ui9mNfn4yn+igbDERh//Q=='
          }
        }
      ]
    },
    encryptionParameters: [
      {
        webAPIKey: 'TEST_API_KEY',
        encryptionType: 'AES',
        jsonPath: 'transactions[].amount.value'
      }
    ]
  }

  client.decryptData(data)
    .then(result => {
      const value = result.transactions[0].amount.value; // '100'
    });

```

## decryptValue

Decrypt single value with [`decryptValue`](../src/Client.ts) method that takes encrypted value as first argument and encryption method as second.

```js

  const encryptedValue = '5Ui9mNfn4yn+igbDERh//Q==';
  client.decryptValue(encryptedValue, 'AES')
    .then(result => {
      result === '100'
    });

```

## getDecryptedValuesForPath

Get all decrypted values in `Array` for given encryptionParameters with the [`getDecryptedValuesForPath`](../src/Client.ts) method. 

```js

  const encryptedData = {
    transactions: [
      {
        amount: {
          precision: 2,
          currency: 'CZK',
          value: '5Ui9mNfn4yn+igbDERh//Q=='
        }
      }
    ]
  }

  const encryptionParameters = {
    encryptionType: 'AES',
    jsonPath: 'transactions[].amount.value'
  }

  client.getDecryptedValuesForPath(encryptedData.dataArray, encryptionParameters)
    .then(result => {
      result === ['100']
    });

```

## Precompute

[`precompute`](../src/Client.ts) values to make future invokations of encrypt significantly faster.

```js

  client.precompute(4);

```

## Paillier Add

[`add`](../src/Client.ts) returns encrypted sum of given numbers that can be either encrypted or not.

```js

  // paillier encrypted number
  const encryptedNum = '878967865867576578657657657865875786587531'
  client.add(encryptedNum, 21);


```

## Paillier Multiply

[`multiply`](../src/Client.ts) multiplies either encrypted number in string or number as first argument by second argument that is of type number.

```js

  // paillier encrypted number
  const encryptedNum = '878967865867576578657657657865875786587531'
  client.multiply(encryptedNum, 3);

```