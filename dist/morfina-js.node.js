module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	__export(__webpack_require__(1));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var paillier = __webpack_require__(2);
	var jsbn_1 = __webpack_require__(3);
	var Computer_1 = __webpack_require__(5);
	var Decryptor_1 = __webpack_require__(6);
	var ApiClient_1 = __webpack_require__(9);
	var utils_1 = __webpack_require__(11);
	/**
	 * MorfinaClient
	 *
	 * @class MorfinaClient
	 */
	var MorfinaClient = /** @class */ (function () {
	    /**
	     * Creates an instance of MorfinaClient.
	     * @param {Config} config
	     * @param {Credentials} credentials
	     *
	     * @memberof MorfinaClient
	     */
	    function MorfinaClient(config, credentials) {
	        var _this = this;
	        /**
	         * Precompute values to make future invokations of encrypt significantly faster.
	         * @param {number} numberOfPrimes
	         * @returns {Promise<void>}
	         *
	         * @memberof MorfinaClient
	         */
	        this.precompute = function (numberOfPrimes) {
	            return Promise.resolve(_this.computer.precompute(numberOfPrimes));
	        };
	        /**
	         * Returns sum of value1 and value2
	         * @param {string|number} value1
	         * @param {string|number} value2
	         * @returns {Promise<string>}
	         *
	         * @memberof MorfinaClient
	         */
	        this.add = function (value1, value2) {
	            return Promise.resolve(_this.computer.add(value1, value2));
	        };
	        /**
	         * Returns multiplication of value by num
	         * @param {string} value
	         * @param {number} num
	         * @returns {Promise<string>}
	         *
	         * @memberof MorfinaClient
	         */
	        this.multiply = function (value, num) {
	            return Promise.resolve(_this.computer.multiply(value, num));
	        };
	        /**
	         * @param {string} value
	         * @param {EncryptionType} encryptionType
	         * @returns {Promise<string>}
	         *
	         * @memberof Decryptor
	         */
	        this.decryptValue = function (value, encryptionType) {
	            return Promise.resolve(_this.decryptor.decryptValue(value, encryptionType));
	        };
	        this.config = config;
	        this.credentials = credentials;
	        this.apiClient = new ApiClient_1.default(config);
	        var priv = new paillier.PrivateKey(new jsbn_1.BigInteger(credentials.PAILLIER.publicKey.n), new jsbn_1.BigInteger(credentials.PAILLIER.publicKey.g), new jsbn_1.BigInteger(credentials.PAILLIER.privateKey.lambda), new jsbn_1.BigInteger(credentials.PAILLIER.privateKey.preCalculatedDenominator), new jsbn_1.BigInteger(credentials.PAILLIER.publicKey.nSquared));
	        var pub = new paillier.PublicKey(new jsbn_1.BigInteger(credentials.PAILLIER.publicKey.n), new jsbn_1.BigInteger(credentials.PAILLIER.publicKey.g), new jsbn_1.BigInteger(credentials.PAILLIER.publicKey.nSquared));
	        this.computer = new Computer_1.default(pub, priv);
	        this.decryptor = new Decryptor_1.default(this.credentials, pub, priv);
	    }
	    /**¨
	     * Calls Morfina server with payload where data are encrypted and sent back
	     * @param {EncryptPayloadWithoutApiKeys} payload
	     * @returns {Promise<AxiosResponse<any>>}
	     *
	     * @memberof MorfinaClient
	     */
	    MorfinaClient.prototype.morph = function (payload) {
	        var _this = this;
	        var payloadWithApiKeys = {
	            encryptionParameters: payload.encryptionParameters.map(function (x) {
	                x.webAPIKey = _this.config.webApiKey;
	                return x;
	            }),
	            dataArray: payload.dataArray,
	        };
	        return this.apiClient.encryptData(payloadWithApiKeys);
	    };
	    /**
	     * Returns decrypted data that is passed in encrypted
	     * @param {EncryptPayload} data
	     * @returns {Promise<any>}
	     *
	     * @memberof MorfinaClient
	     */
	    MorfinaClient.prototype.decryptData = function (data) {
	        return Promise.resolve(this.decryptor.decryptData(data));
	    };
	    /**
	     * @param {*} data
	     * @param {EncryptionParameter} encryptionParameters
	     * @returns {Promise<string[]>}
	     *
	     * @memberof Decryptor
	     */
	    MorfinaClient.prototype.getDecryptedValuesForPath = function (data, encryptionParameters) {
	        return Promise.resolve(this.decryptor.getDecryptedValuesForPath(data, encryptionParameters));
	    };
	    /**
	     * Calls Morfina API for crypto and returns "instance" of MorfinaClient with crypto
	     * @param {Config} config
	     * @returns {Promise<MorfinaClient>}
	     *
	     * @static
	     * @memberof MorfinaClient
	     */
	    MorfinaClient.getClient = function (config) {
	        var client = new ApiClient_1.default(config);
	        if (!config) {
	            throw Error('You have to pass credentials to MorfinaClient');
	        }
	        return client.getCryptoConfiguration()
	            .then(function (resp) {
	            if (!utils_1.isObjectEmpty(resp.data)) {
	                client = undefined;
	                return new MorfinaClient(config, resp.data);
	            }
	            return client.createCryptoConfiguration()
	                .then(function (resp) {
	                client = undefined;
	                return new MorfinaClient(config, resp.data);
	            });
	        });
	    };
	    return MorfinaClient;
	}());
	exports.MorfinaClient = MorfinaClient;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Implement the Paillier cryptosystem in JavaScript.
	 */
	
	    var BigInteger = __webpack_require__(3).BigInteger;
	
	    var SecureRandom = __webpack_require__(4);
	
	    var rng = new SecureRandom();
	    var TWO = BigInteger.valueOf(2);
	
	    var Paillier = {
	        generate: function (bitLength) {
	            var p, q;
	            do {
	                p = new BigInteger(bitLength, 1, rng);
	                q = new BigInteger(bitLength, 1, rng);
	            } while (p.equals(q));
	
	            var n = p.multiply(q);
	
	            // p - 1
	            var p1 = p.subtract(BigInteger.ONE);
	            // q - 1
	            var q1 = q.subtract(BigInteger.ONE);
	
	            var nSq = n.multiply(n);
	
	            // lambda
	            var l = p1.multiply(q1).divide(p1.gcd(q1));
	
	            var coprimeBitLength = n.bitLength() - Math.floor(Math.random() * 10);
	
	            var alpha = new BigInteger(coprimeBitLength, 1, rng);
	            var beta = new BigInteger(coprimeBitLength, 1, rng);
	
	            var g = alpha.multiply(n).add(BigInteger.ONE)
	                .multiply(beta.modPow(n, nSq)).mod(nSq);
	
	            // mu
	            var m = g.modPow(l, nSq).mod(nSq)
	                .subtract(BigInteger.ONE).divide(n).modInverse(n);
	
	            return new Paillier.PrivateKey(n, g, l, m, nSq);
	        }
	    };
	
	    Paillier.PublicKey = function (n, g, nSq) {
	        this.n = n;
	        this.g = g;
	        this.nSq = nSq || n.multiply(n);
	        this.rncache = [];
	    };
	
	    Paillier.PublicKey.prototype.encrypt = function (i, r) {
	        if (!r) {
	            var rn;
	            if (this.rncache.length > 0) {
	                rn = this.rncache.pop();
	            } else {
	                rn = this.getRandomNumber();
	            }
	            r = rn;
	        }
	        return this.g.modPow(i, this.nSq).multiply(r.modPow(this.n, this.nSq))
	            .mod(this.nSq);
	    };
	
	    Paillier.PublicKey.prototype.add = function (c, f) {
	        return c.multiply(this.encrypt(f)).mod(this.nSq);
	    };
	
	    Paillier.PublicKey.prototype.addCrypt = function (c, f) {
	        return c.multiply(f).mod(this.nSq);
	    };
	
	    Paillier.PublicKey.prototype.multiply = function (c, f) {
	        return c.modPow(f, this.nSq);
	    };
	
	    Paillier.PublicKey.prototype.precompute = function(n) {
	        for (var i = 0; i < n; i++) {
				this.rncache.push(this.getRandomNumber());
			}
	    }
	
	    Paillier.PublicKey.prototype.getRandomNumber = function() {
	        var coprimeBitLength = this.n.bitLength() - Math.floor(Math.random() * 10);
	        return new BigInteger(coprimeBitLength, 1, rng);
	    };
	
	    Paillier.PublicKey.prototype.rerandomize = function (c, r) {
	        if (!r) {
	            var rn;
	            if (this.rncache.length > 0) {
	                rn = this.rncache.pop();
	            } else {
	                rn = this.getRandomNumber();
	            }
	            r = rn;
	        }
	        return c.multiply(r.modPow(this.n, this.nSq)).mod(this.nSq);
	    };
	
	    Paillier.PrivateKey = function (n, g, l, m, nSq) {
	        this.l = l;
	        this.m = m;
	        this.n = n;
	        this.nSq = nSq || n.multiply(n);
	        this.pub = new Paillier.PublicKey(n, g, this.nSq);
	    };
	
	    Paillier.PrivateKey.prototype.decrypt = function (c) {
	        return c.modPow(this.l, this.nSq).subtract(BigInteger.ONE)
	            .divide(this.n).multiply(this.m).mod(this.n);
	    };
	
	    Paillier.PrivateKey.prototype.decryptR = function (c, i) {
	        if (!i) {
	            i = this.decrypt(c);
	        }
	        var rn = c.multiply(this.pub.g.modPow(i, this.nSq).modInverse(this.nSq))
	            .mod(this.nSq);
	        var a = this.l.modInverse(this.n).multiply(this.n.subtract(BigInteger.ONE));
	        var e = a.multiply(this.l).add(BigInteger.ONE).divide(this.n);
	        return rn.modPow(e, this.n);
	    };
	
	    function createProxyMethod(name) {
	        return function () {
	            return this.pub[name].apply(this.pub,
	                Array.prototype.slice.apply(arguments));
	        };
	    }
	
	    var a = ["add", "addCrypt", "multiply", "rerandomize", "encrypt"];
	    for (var i = 0, l = a.length; i < l; i++) {
	        Paillier.PrivateKey.prototype[a[i]] = createProxyMethod(a[i]);
	    }
	
	    module.exports = Paillier;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	module.exports = require("jsbn");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	// Random number generator - requires a PRNG backend, e.g. prng4.js
	
	
	// prng4.js - uses Arcfour as a PRNG
	
	function Arcfour() {
	  this.i = 0;
	  this.j = 0;
	  this.S = new Array();
	}
	
	// Initialize arcfour context from key, an array of ints, each from [0..255]
	function ARC4init(key) {
	  var i, j, t;
	  for(i = 0; i < 256; ++i)
	    this.S[i] = i;
	  j = 0;
	  for(i = 0; i < 256; ++i) {
	    j = (j + this.S[i] + key[i % key.length]) & 255;
	    t = this.S[i];
	    this.S[i] = this.S[j];
	    this.S[j] = t;
	  }
	  this.i = 0;
	  this.j = 0;
	}
	
	function ARC4next() {
	  var t;
	  this.i = (this.i + 1) & 255;
	  this.j = (this.j + this.S[this.i]) & 255;
	  t = this.S[this.i];
	  this.S[this.i] = this.S[this.j];
	  this.S[this.j] = t;
	  return this.S[(t + this.S[this.i]) & 255];
	}
	
	Arcfour.prototype.init = ARC4init;
	Arcfour.prototype.next = ARC4next;
	
	// Plug in your RNG constructor here
	function prng_newstate() {
	  return new Arcfour();
	}
	
	// Pool size must be a multiple of 4 and greater than 32.
	// An array of bytes the size of the pool will be passed to init()
	var rng_psize = 256;
	
	
	// For best results, put code like
	// <body onClick='rng_seed_time();' onKeyPress='rng_seed_time();'>
	// in your main HTML document.
	
	var rng_state;
	var rng_pool;
	var rng_pptr;
	var window = {}
	var navigator = {}
	// Mix in a 32-bit integer into the pool
	function rng_seed_int(x) {
	  rng_pool[rng_pptr++] ^= x & 255;
	  rng_pool[rng_pptr++] ^= (x >> 8) & 255;
	  rng_pool[rng_pptr++] ^= (x >> 16) & 255;
	  rng_pool[rng_pptr++] ^= (x >> 24) & 255;
	  if(rng_pptr >= rng_psize) rng_pptr -= rng_psize;
	}
	
	// Mix in the current time (w/milliseconds) into the pool
	function rng_seed_time() {
	  rng_seed_int(new Date().getTime());
	}
	
	// Initialize the pool with junk if needed.
	if(rng_pool == null) {
	  rng_pool = new Array();
	  rng_pptr = 0;
	  var t;
	  if(window && window.crypto && window.crypto.getRandomValues) {
	    // Use webcrypto if available
	    var ua = new Uint8Array(32);
	    window.crypto.getRandomValues(ua);
	    for(t = 0; t < 32; ++t)
	      rng_pool[rng_pptr++] = ua[t];
	  }
	  if(navigator.appName == "Netscape" && navigator.appVersion < "5" && window.crypto) {
	    // Extract entropy (256 bits) from NS4 RNG if available
	    var z = window.crypto.random(32);
	    for(t = 0; t < z.length; ++t)
	      rng_pool[rng_pptr++] = z.charCodeAt(t) & 255;
	  }
	  while(rng_pptr < rng_psize) {  // extract some randomness from Math.random()
	    t = Math.floor(65536 * Math.random());
	    rng_pool[rng_pptr++] = t >>> 8;
	    rng_pool[rng_pptr++] = t & 255;
	  }
	  rng_pptr = 0;
	  rng_seed_time();
	  //rng_seed_int(window.screenX);
	  //rng_seed_int(window.screenY);
	}
	
	function rng_get_byte() {
	  if(rng_state == null) {
	    rng_seed_time();
	    rng_state = prng_newstate();
	    rng_state.init(rng_pool);
	    for(rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr)
	      rng_pool[rng_pptr] = 0;
	    rng_pptr = 0;
	    //rng_pool = null;
	  }
	  // TODO: allow reseeding after first request
	  return rng_state.next();
	}
	
	function rng_get_bytes(ba) {
	  var i;
	  for(i = 0; i < ba.length; ++i) ba[i] = rng_get_byte();
	}
	
	function SecureRandom() {}
	
	SecureRandom.prototype.nextBytes = rng_get_bytes;
	
	module.exports = SecureRandom;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var jsbn_1 = __webpack_require__(3);
	/**
	 *
	 *
	 * @class Computer
	 */
	var Computer = /** @class */ (function () {
	    /**
	     * Creates an instance of Computer.
	     * @param {Credentials} credentials
	     * @memberof Computer
	     */
	    function Computer(publicKey, privateKey) {
	        var _this = this;
	        /**
	         * Precompute values to make future invokations of encrypt significantly faster.
	         * @param {number} numberOfPrimes
	         * @returns {void}
	         *
	         * @memberof Computer
	         */
	        this.precompute = function (numberOfPrimes) {
	            return _this.publicKey.precompute(numberOfPrimes);
	        };
	        /**
	         * Returns sum of value1 and value2
	         * @param {string|number} value1
	         * @param {string|number} value2
	         * @returns {string}
	         *
	         * @memberof Computer
	         */
	        this.add = function (value1, value2) {
	            return _this.publicKey.addCrypt(_this.getEncryptedBigIntegerFromValue(value1), _this.getEncryptedBigIntegerFromValue(value2)).toString();
	        };
	        /**
	         * Returns multiplication of value by num
	         * @param {string|number} value
	         * @param {number} num
	         * @returns {string}
	         *
	         * @memberof Computer
	         */
	        this.multiply = function (value, num) {
	            return _this.publicKey.multiply(_this.getEncryptedBigIntegerFromValue(value), new jsbn_1.BigInteger(num.toString(), 10)).toString();
	        };
	        /**
	         * If passed in value is string then it assumes that passed in value is encrypted so it creates BigInteger.
	         * If passed in values is number then in returns decrypted BigInteger.
	         * @param {string | number} val
	         * @returns {BigInteger}
	         *
	         * @private
	         * @memberof Computer
	         */
	        this.getEncryptedBigIntegerFromValue = function (val) {
	            if (typeof val === 'string') {
	                return new jsbn_1.BigInteger(val, 10);
	            }
	            if (typeof val === 'number') {
	                var bigInt = new jsbn_1.BigInteger(val.toString(), 10);
	                return _this.publicKey.encrypt(bigInt);
	            }
	            throw Error('Input must be number or string');
	        };
	        this.publicKey = publicKey;
	        this.privateKey = privateKey;
	    }
	    return Computer;
	}());
	exports.default = Computer;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var jp = __webpack_require__(7);
	var crypto_js_1 = __webpack_require__(8);
	var jsbn_1 = __webpack_require__(3);
	/**
	 *
	 *
	 * @class Decryptor
	 */
	var Decryptor = /** @class */ (function () {
	    /**
	     * Creates an instance of Decryptor.
	     * @param {Credentials} credentials
	     * @param {*} publicKey
	     * @param {*} privateKey
	     * @memberof Decryptor
	     */
	    function Decryptor(credentials, publicKey, privateKey) {
	        var _this = this;
	        /**
	         * @param {string} value
	         * @param {EncryptionType} encryptionType
	         * @returns {string}
	         *
	         * @memberof Decryptor
	         */
	        this.decryptValue = function (value, encryptionType) {
	            var decryptedValue = _this.decryptVal(value, encryptionType);
	            return decryptedValue;
	        };
	        /**
	         * @param {any} val
	         * @param {string} encryptionType
	         * @returns {string}
	         *
	         * @private
	         * @memberof Decryptor
	         */
	        this.decryptVal = function (val, encryptionType) {
	            switch (encryptionType) {
	                case 'AES':
	                    return crypto_js_1.AES.decrypt(val, crypto_js_1.enc.Base64.parse(_this.credentials.AES.key), { mode: crypto_js_1.mode.ECB }).toString(crypto_js_1.enc.Utf8);
	                case 'PAILLIER':
	                    return _this.privateKey.decrypt(new jsbn_1.BigInteger(val.toString())).toString(10);
	                default:
	                    return val;
	            }
	        };
	        /**
	         * @param {string} path
	         * @returns {string}
	         *
	         * @private
	         * @memberof Decryptor
	         */
	        this.addAsteriskToArrayInPath = function (path) { return path.replace('[]', '[*]'); };
	        this.credentials = credentials;
	        this.publicKey = publicKey;
	        this.privateKey = privateKey;
	    }
	    /**
	     * @param {EncryptPayload} data
	     * @returns {T}
	     *
	     * @memberof Decryptor
	     */
	    Decryptor.prototype.decryptData = function (data) {
	        var _this = this;
	        var dataArrayCopy = JSON.parse(JSON.stringify(data.dataArray));
	        data.encryptionParameters.forEach(function (x) {
	            jp.apply(dataArrayCopy, _this.addAsteriskToArrayInPath(x.jsonPath), function (val) {
	                return _this.decryptVal(val, x.encryptionType);
	            });
	        });
	        return dataArrayCopy;
	    };
	    /**
	     * @param {*} data
	     * @param {EncryptionParameter} encryptionParameters
	     * @returns {string[]}
	     *
	     * @memberof Decryptor
	     */
	    Decryptor.prototype.getDecryptedValuesForPath = function (data, encryptionParameters) {
	        var _this = this;
	        if (!encryptionParameters) {
	            throw Error('You have to provide encryptionParameters as second argument');
	        }
	        var dataCopy = JSON.parse(JSON.stringify(data));
	        var decryptedValues = jp.query(dataCopy, this.addAsteriskToArrayInPath(encryptionParameters.jsonPath))
	            .map(function (x) { return _this.decryptVal(x, encryptionParameters.encryptionType); });
	        return decryptedValues;
	    };
	    return Decryptor;
	}());
	exports.default = Decryptor;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

	module.exports = require("jsonpath");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	module.exports = require("crypto-js");

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var axios = __webpack_require__(10);
	/**
	 *
	 * @class ApiClient
	 */
	var ApiClient = /** @class */ (function () {
	    /**
	     * Creates an instance of ApiClient.
	     * @param {any} config
	     * @memberof ApiClient
	     */
	    function ApiClient(config) {
	        var _this = this;
	        /**
	         * Create crypto configuration
	         * @returns {Promise<AxiosResponse<Credentials>>}
	         *
	         * @memberof ApiClient
	         */
	        this.createCryptoConfiguration = function () {
	            return axios.post(_this.config.baseUrl + "/morfina/api/v1/configuration/" + _this.config.webApiKey + "/create", null, { headers: ApiClient.headers });
	        };
	        /**
	         * Get crypto configuration
	         * @returns {Promise<AxiosResponse<Credentials>>}
	         *
	         * @memberof ApiClient
	         */
	        this.getCryptoConfiguration = function () {
	            return axios.get(_this.config.baseUrl + "/morfina/api/v1/configuration/" + _this.config.webApiKey, { headers: ApiClient.headers });
	        };
	        this.config = config;
	    }
	    /**
	     * Encrypt data
	     * @param {EncryptPayload} payload
	     * @returns {Promise<AxiosResponse<EncryptPayload>>}
	     *
	     * @memberof ApiClient
	     */
	    ApiClient.prototype.encryptData = function (payload) {
	        return axios.post(this.config.baseUrl + "/morfina/api/v1/encrypt", payload, { headers: ApiClient.headers });
	    };
	    ApiClient.headers = {};
	    return ApiClient;
	}());
	exports.ApiClient = ApiClient;
	var Client = /** @class */ (function (_super) {
	    __extends(Client, _super);
	    function Client(config) {
	        return _super.call(this, config) || this;
	    }
	    return Client;
	}(ApiClient));
	exports.default = Client;


/***/ }),
/* 10 */
/***/ (function(module, exports) {

	module.exports = require("axios");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var isObjectEmpty = function (obj) { return Object.keys(obj).length === 0 && obj.constructor === Object; };
	exports.isObjectEmpty = isObjectEmpty;


/***/ })
/******/ ]);