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
	var p = __webpack_require__(1);
	exports.num = 3;
	console.log('paillier', p);


/***/ }),
/* 1 */
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
	var BigInteger = __webpack_require__(2).BigInteger;
	
	var SecureRandom = __webpack_require__(3);
	
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
/* 2 */
/***/ (function(module, exports) {

	module.exports = require("jsbn");

/***/ }),
/* 3 */
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

/***/ })
/******/ ]);