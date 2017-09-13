import MorfinaClient from './Client';

const payload = {
  encryptionParameters: [
    {
      "encryptionType": "PAILLIER",
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

async function init() {
  try {
    const client = await MorfinaClient.getClient({ 
      baseUrl: 'http://morfinaagents.westeurope.cloudapp.azure.com',
      webApiKey: '21313',
    });

    const result = await client.morph(payload);
    const encrypted = client.computer.getEncryptedStringFromValue(payload.dataArray.transactions[0].amount.value);
    const decrypted = await client.decryptField(encrypted, null);
    const decryptedServer = await client.decryptField(result.data.dataArray.transactions[0].amount.value, null);

    console.log(`
      Original value:               ${payload.dataArray.transactions[0].amount.value}
      Encrypted from server:        ${result.data.dataArray.transactions[0].amount.value}
      Encrypted locally:            ${encrypted}
      Decrypted from server:        ${decryptedServer}
      Decrypted from local encrypt: ${decrypted}
    `);

  } catch(err) {
    console.log(err);
  }
}

init();

export default MorfinaClient;