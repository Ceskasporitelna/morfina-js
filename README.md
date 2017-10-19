# MorfinaJS

MorfinaJS allows you to encrypt and decrypt data in Morfina Service. It also allows you to add to and multiply numbers encrypted with Paillier encryption type.

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
  }).then(result => {
    return client.decryptData(result);
  }).then(...);

```

# [CHANGELOG](CHANGELOG.md)

# Usage

If you just want to use the SDK, there are compiled files ready to be used in the [`/dist`](./dist) folder.

You can just copy these files directly from the repository or preferably, use `npm` to install it into your project:

```
npm install morfina-js --save

```

## Usage in browser
For usage in browser, pickup the following files from the `/dist` folder:
* `morfina-js.sfx.min.js` - MorfinaJS packaged for browsers
* `morfina-js.sfx.d.ts` - MorfinaJS typings for browsers
* `morfina-js.sfx.min.js.map` - MorfinaJS sourcemap for browsers

The MorfinaJS SDK will be available in global variable `Morfina`.

**IMPORTANT!** MorfinaJS SDK depends on a native ES6 Promise implementation to be [supported](http://caniuse.com/promises).
If your environment doesn't support ES6 Promises, you can [polyfill](https://github.com/jakearchibald/es6-promise).

## Usage in node
For usage in node, install it through `npm` (see above). You can then require it by:

```javascript

var Morfina = require('morfina-js');

``` 

## Usage Guide

**See [Usage Guide](./docs/README.md)** for usage instructions.

# Development
The SDK itself is written in **TypeScript**, packaged by **webpack**, tested by **jasmine** & **karma** and distributed thorugh **npm**. It uses **tsd** for TypeScript definitions.

In order to to develop upon this SDK, you will need the following **installed globally**:

* `node` & `npm`
* `webpack` - For packaging
* `karma` - For testing
* `tsd` - For downloading typescript definitions

## Setup
After cloning the repo, run the following command to initialize the repository for development:

```
npm install
```

You can verify everything worked as expected by running:

```
npm test
```

## Directory structure
This project uses the following directory structure:

* `dist` - Packaged version of this SDK ready for use.
* `build` - Build artifacts (not checked in repository)
* `src` - The SDK itself
* `spec` - Tests for the SDK
* `typings` - Typings used by the SDK
* `tooling` - Commands for building and packaging 

## Development commands

* `npm run clean` - cleans `build` and `dist` folders
* `npm run build` - performs `clean` and builds the SDK into `build` folder. It also generates `.d.ts` files using `generate-tsd` command.
* `npm run dist` - performs `build` command and copies the packaged SDK files into `dist` folder
* `npm run test` - performs `build` and runs tests in node and browser.
* `npm run test-browser` - performs tests only in browser
* `npm run test-node` - performs tests only in node
* `npm version [major|minor|patch]` - releases new version of the SDK. Requires write access to repository. See [npm-version](https://docs.npmjs.com/cli/version) for more details. 



# Contributing
Contributions are more than welcome!

Please read our [contribution guide](CONTRIBUTING.md) to learn how to contribute to this project.

# Terms & conditions
Please read our [**terms & conditions**](LICENSE.md).
