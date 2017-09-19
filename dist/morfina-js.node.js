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
	Object.defineProperty(exports, "__esModule", { value: true });
	var Client_1 = __webpack_require__(1);
	exports.default = Client_1.default;


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
	         * @returns {Promise<any>}
	         *
	         * @memberof MorfinaClient
	         */
	        this.precompute = function (numberOfPrimes) {
	            return _this.computer.precompute(numberOfPrimes);
	        };
	        /**
	         * Returns sum of value1 and value2
	         * @param {string|number} value1
	         * @param {string|number} value2
	         * @returns {string}
	         *
	         * @memberof MorfinaClient
	         */
	        this.add = function (value1, value2) {
	            return _this.computer.add(value1, value2);
	        };
	        /**
	         * Returns multiplication of value by num
	         * @param {string} value
	         * @param {number} num
	         * @returns {string}
	         *
	         * @memberof MorfinaClient
	         */
	        this.multiply = function (value, num) {
	            return _this.computer.multiply(value, num);
	        };
	        /**
	         * @param {string} value
	         * @param {EncryptionType} encryptionType
	         * @returns {Promise<string>}
	         *
	         * @memberof Decryptor
	         */
	        this.decryptValue = function (value, encryptionType) {
	            return _this.decryptor.decryptValue(value, encryptionType);
	        };
	        this.config = config;
	        this.credentials = credentials;
	        this.apiClient = new ApiClient_1.default(config);
	        var pub = new paillier.publicKey(credentials.PAILLIER.publicKey.bits, new jsbn_1.BigInteger(credentials.PAILLIER.publicKey.n));
	        var priv = new paillier.privateKey(new jsbn_1.BigInteger(credentials.PAILLIER.privateKey.lambda), pub);
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
	        return this.decryptor.decryptData(data);
	    };
	    /**
	     * @param {*} data
	     * @param {EncryptionParameter} encryptionParameters
	     * @returns {Promise<string[]>}
	     *
	     * @memberof Decryptor
	     */
	    MorfinaClient.prototype.getDecryptedValuesForPath = function (data, encryptionParameters) {
	        return this.decryptor.getDecryptedValuesForPath(data, encryptionParameters);
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
	exports.default = MorfinaClient;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	////////////////////////////////////////////////////////////////////////////////////
	//
	// paillier.js: a simple proof-of-concept Javascript implementation of the
	// Paillier homomorphic encryption system.
	//
	// Author: Maarten H. Everts (TNO)
	//
	// Dependencies: jsbn, from http://www-cs-students.stanford.edu/~tjw/jsbn/
	//  (you will need at least jsbn.js, jsbn2.js, prng4.js, and rng.js)
	// See the demo page on how to use it.
	//
	////////////////////////////////////////////////////////////////////////////////////
	var BigInteger = __webpack_require__(3).BigInteger;
	
	var SecureRandom = __webpack_require__(4);
	
	function lcm(a,b) {
	  return a.multiply(b).divide(a.gcd(b));
	}
	
	paillier = {
		publicKey: function(bits, n) {
			// bits
			this.bits = bits;
			// n
			this.n = n;
			// n2 (cached n^2)
			this.n2 = n.square();
			// np1 (cached n+1)
			this.np1 = n.add(BigInteger.ONE);
			this.rncache = new Array();
		},
		privateKey: function(lambda, pubkey) {
			// lambda
			this.lambda = lambda;
			this.pubkey = pubkey;
			// x (cached) for decryption
			this.x = pubkey.np1.modPow(this.lambda,pubkey.n2).subtract(BigInteger.ONE).divide(pubkey.n).modInverse(pubkey.n);
		},
		generateKeys: function(modulusbits) {
			var p, q, n, keys = {}, rng = new SecureRandom();
			do {
				do {
					p = new BigInteger(modulusbits>>1,1,rng);
				} while (!p.isProbablePrime(10));
	
				do {
					q = new BigInteger(modulusbits>>1,1,rng);
				} while(!q.isProbablePrime(10));
	
				n = p.multiply(q);
			} while(!(n.testBit(modulusbits - 1)) || (p.compareTo(q) == 0));
			keys.pub = new paillier.publicKey(modulusbits,n);
			lambda = lcm(p.subtract(BigInteger.ONE),q.subtract(BigInteger.ONE));
			keys.sec = new paillier.privateKey(lambda, keys.pub);
			return keys;
		}
	}
	
	
	paillier.publicKey.prototype = {
		encrypt: function(m) {
			return this.randomize(this.n.multiply(m).add(BigInteger.ONE).mod(this.n2));
		},
		add: function(a,b) {
			return a.multiply(b).remainder(this.n2);
		},
		mult: function(a,b) {
			return a.modPow(b, this.n2);
		},
		randomize: function(a) {
			var rn;
			if (this.rncache.length > 0) {
				rn = this.rncache.pop();
			} else {
				rn = this.getRN();
			}
			return (a.multiply(rn)).mod(this.n2);
		},
		getRN: function() {
			var r, rng = new SecureRandom();
			do {
				r = new BigInteger(this.bits,rng);
				// make sure r <= n
			} while(r.compareTo(this.n) >= 0);
			return r.modPow(this.n, this.n2);
		},
		// Precompute values to make future invokations of encrypt and randomize (significantly) faster.
		// n is the number of precomputed values.
		precompute: function(n) {
			for (var i = 0; i < n; i++) {
				this.rncache.push(this.getRN());
			}
		}
	}
	
	paillier.privateKey.prototype = {
		decrypt: function(c) {
			return c.modPow(this.lambda,this.pubkey.n2).subtract(BigInteger.ONE).divide(this.pubkey.n).multiply(this.x).mod(this.pubkey.n);
		}
	}
	
	module.exports = paillier;

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
	         * @returns {Promise<any>}
	         *
	         * @memberof Computer
	         */
	        this.precompute = function (numberOfPrimes) {
	            return Promise.resolve(_this.publicKey.precompute(numberOfPrimes));
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
	            return _this.publicKey.add(_this.getEncryptedBigIntegerFromValue(value1), _this.getEncryptedBigIntegerFromValue(value2)).toString();
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
	            return _this.publicKey.mult(_this.getEncryptedBigIntegerFromValue(value), new jsbn_1.BigInteger(num.toString(), 10)).toString();
	        };
	        this.encrypt = function (x) { return _this.getEncryptedBigIntegerFromValue(x).toString(); };
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
	         * @returns {Promise<string>}
	         *
	         * @memberof Decryptor
	         */
	        this.decryptValue = function (value, encryptionType) {
	            var decryptedValue = _this.decryptVal(value, encryptionType);
	            return Promise.resolve(decryptedValue);
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
	     * @returns {Promise<any>}
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
	        return Promise.resolve(dataArrayCopy);
	    };
	    /**
	     * @param {*} data
	     * @param {EncryptionParameter} encryptionParameters
	     * @returns {Promise<string[]>}
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
	        return Promise.resolve(decryptedValues);
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