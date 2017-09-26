var MorfinaJS =
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
	var ApiClient_1 = __webpack_require__(76);
	var utils_1 = __webpack_require__(94);
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
/***/ (function(module, exports, __webpack_require__) {

	(function(){
	
	    // Copyright (c) 2005  Tom Wu
	    // All Rights Reserved.
	    // See "LICENSE" for details.
	
	    // Basic JavaScript BN library - subset useful for RSA encryption.
	
	    // Bits per digit
	    var dbits;
	
	    // JavaScript engine analysis
	    var canary = 0xdeadbeefcafe;
	    var j_lm = ((canary&0xffffff)==0xefcafe);
	
	    // (public) Constructor
	    function BigInteger(a,b,c) {
	      if(a != null)
	        if("number" == typeof a) this.fromNumber(a,b,c);
	        else if(b == null && "string" != typeof a) this.fromString(a,256);
	        else this.fromString(a,b);
	    }
	
	    // return new, unset BigInteger
	    function nbi() { return new BigInteger(null); }
	
	    // am: Compute w_j += (x*this_i), propagate carries,
	    // c is initial carry, returns final carry.
	    // c < 3*dvalue, x < 2*dvalue, this_i < dvalue
	    // We need to select the fastest one that works in this environment.
	
	    // am1: use a single mult and divide to get the high bits,
	    // max digit bits should be 26 because
	    // max internal value = 2*dvalue^2-2*dvalue (< 2^53)
	    function am1(i,x,w,j,c,n) {
	      while(--n >= 0) {
	        var v = x*this[i++]+w[j]+c;
	        c = Math.floor(v/0x4000000);
	        w[j++] = v&0x3ffffff;
	      }
	      return c;
	    }
	    // am2 avoids a big mult-and-extract completely.
	    // Max digit bits should be <= 30 because we do bitwise ops
	    // on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
	    function am2(i,x,w,j,c,n) {
	      var xl = x&0x7fff, xh = x>>15;
	      while(--n >= 0) {
	        var l = this[i]&0x7fff;
	        var h = this[i++]>>15;
	        var m = xh*l+h*xl;
	        l = xl*l+((m&0x7fff)<<15)+w[j]+(c&0x3fffffff);
	        c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
	        w[j++] = l&0x3fffffff;
	      }
	      return c;
	    }
	    // Alternately, set max digit bits to 28 since some
	    // browsers slow down when dealing with 32-bit numbers.
	    function am3(i,x,w,j,c,n) {
	      var xl = x&0x3fff, xh = x>>14;
	      while(--n >= 0) {
	        var l = this[i]&0x3fff;
	        var h = this[i++]>>14;
	        var m = xh*l+h*xl;
	        l = xl*l+((m&0x3fff)<<14)+w[j]+c;
	        c = (l>>28)+(m>>14)+xh*h;
	        w[j++] = l&0xfffffff;
	      }
	      return c;
	    }
	    var inBrowser = typeof navigator !== "undefined";
	    if(inBrowser && j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
	      BigInteger.prototype.am = am2;
	      dbits = 30;
	    }
	    else if(inBrowser && j_lm && (navigator.appName != "Netscape")) {
	      BigInteger.prototype.am = am1;
	      dbits = 26;
	    }
	    else { // Mozilla/Netscape seems to prefer am3
	      BigInteger.prototype.am = am3;
	      dbits = 28;
	    }
	
	    BigInteger.prototype.DB = dbits;
	    BigInteger.prototype.DM = ((1<<dbits)-1);
	    BigInteger.prototype.DV = (1<<dbits);
	
	    var BI_FP = 52;
	    BigInteger.prototype.FV = Math.pow(2,BI_FP);
	    BigInteger.prototype.F1 = BI_FP-dbits;
	    BigInteger.prototype.F2 = 2*dbits-BI_FP;
	
	    // Digit conversions
	    var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
	    var BI_RC = new Array();
	    var rr,vv;
	    rr = "0".charCodeAt(0);
	    for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
	    rr = "a".charCodeAt(0);
	    for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
	    rr = "A".charCodeAt(0);
	    for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
	
	    function int2char(n) { return BI_RM.charAt(n); }
	    function intAt(s,i) {
	      var c = BI_RC[s.charCodeAt(i)];
	      return (c==null)?-1:c;
	    }
	
	    // (protected) copy this to r
	    function bnpCopyTo(r) {
	      for(var i = this.t-1; i >= 0; --i) r[i] = this[i];
	      r.t = this.t;
	      r.s = this.s;
	    }
	
	    // (protected) set from integer value x, -DV <= x < DV
	    function bnpFromInt(x) {
	      this.t = 1;
	      this.s = (x<0)?-1:0;
	      if(x > 0) this[0] = x;
	      else if(x < -1) this[0] = x+this.DV;
	      else this.t = 0;
	    }
	
	    // return bigint initialized to value
	    function nbv(i) { var r = nbi(); r.fromInt(i); return r; }
	
	    // (protected) set from string and radix
	    function bnpFromString(s,b) {
	      var k;
	      if(b == 16) k = 4;
	      else if(b == 8) k = 3;
	      else if(b == 256) k = 8; // byte array
	      else if(b == 2) k = 1;
	      else if(b == 32) k = 5;
	      else if(b == 4) k = 2;
	      else { this.fromRadix(s,b); return; }
	      this.t = 0;
	      this.s = 0;
	      var i = s.length, mi = false, sh = 0;
	      while(--i >= 0) {
	        var x = (k==8)?s[i]&0xff:intAt(s,i);
	        if(x < 0) {
	          if(s.charAt(i) == "-") mi = true;
	          continue;
	        }
	        mi = false;
	        if(sh == 0)
	          this[this.t++] = x;
	        else if(sh+k > this.DB) {
	          this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
	          this[this.t++] = (x>>(this.DB-sh));
	        }
	        else
	          this[this.t-1] |= x<<sh;
	        sh += k;
	        if(sh >= this.DB) sh -= this.DB;
	      }
	      if(k == 8 && (s[0]&0x80) != 0) {
	        this.s = -1;
	        if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
	      }
	      this.clamp();
	      if(mi) BigInteger.ZERO.subTo(this,this);
	    }
	
	    // (protected) clamp off excess high words
	    function bnpClamp() {
	      var c = this.s&this.DM;
	      while(this.t > 0 && this[this.t-1] == c) --this.t;
	    }
	
	    // (public) return string representation in given radix
	    function bnToString(b) {
	      if(this.s < 0) return "-"+this.negate().toString(b);
	      var k;
	      if(b == 16) k = 4;
	      else if(b == 8) k = 3;
	      else if(b == 2) k = 1;
	      else if(b == 32) k = 5;
	      else if(b == 4) k = 2;
	      else return this.toRadix(b);
	      var km = (1<<k)-1, d, m = false, r = "", i = this.t;
	      var p = this.DB-(i*this.DB)%k;
	      if(i-- > 0) {
	        if(p < this.DB && (d = this[i]>>p) > 0) { m = true; r = int2char(d); }
	        while(i >= 0) {
	          if(p < k) {
	            d = (this[i]&((1<<p)-1))<<(k-p);
	            d |= this[--i]>>(p+=this.DB-k);
	          }
	          else {
	            d = (this[i]>>(p-=k))&km;
	            if(p <= 0) { p += this.DB; --i; }
	          }
	          if(d > 0) m = true;
	          if(m) r += int2char(d);
	        }
	      }
	      return m?r:"0";
	    }
	
	    // (public) -this
	    function bnNegate() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }
	
	    // (public) |this|
	    function bnAbs() { return (this.s<0)?this.negate():this; }
	
	    // (public) return + if this > a, - if this < a, 0 if equal
	    function bnCompareTo(a) {
	      var r = this.s-a.s;
	      if(r != 0) return r;
	      var i = this.t;
	      r = i-a.t;
	      if(r != 0) return (this.s<0)?-r:r;
	      while(--i >= 0) if((r=this[i]-a[i]) != 0) return r;
	      return 0;
	    }
	
	    // returns bit length of the integer x
	    function nbits(x) {
	      var r = 1, t;
	      if((t=x>>>16) != 0) { x = t; r += 16; }
	      if((t=x>>8) != 0) { x = t; r += 8; }
	      if((t=x>>4) != 0) { x = t; r += 4; }
	      if((t=x>>2) != 0) { x = t; r += 2; }
	      if((t=x>>1) != 0) { x = t; r += 1; }
	      return r;
	    }
	
	    // (public) return the number of bits in "this"
	    function bnBitLength() {
	      if(this.t <= 0) return 0;
	      return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));
	    }
	
	    // (protected) r = this << n*DB
	    function bnpDLShiftTo(n,r) {
	      var i;
	      for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];
	      for(i = n-1; i >= 0; --i) r[i] = 0;
	      r.t = this.t+n;
	      r.s = this.s;
	    }
	
	    // (protected) r = this >> n*DB
	    function bnpDRShiftTo(n,r) {
	      for(var i = n; i < this.t; ++i) r[i-n] = this[i];
	      r.t = Math.max(this.t-n,0);
	      r.s = this.s;
	    }
	
	    // (protected) r = this << n
	    function bnpLShiftTo(n,r) {
	      var bs = n%this.DB;
	      var cbs = this.DB-bs;
	      var bm = (1<<cbs)-1;
	      var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
	      for(i = this.t-1; i >= 0; --i) {
	        r[i+ds+1] = (this[i]>>cbs)|c;
	        c = (this[i]&bm)<<bs;
	      }
	      for(i = ds-1; i >= 0; --i) r[i] = 0;
	      r[ds] = c;
	      r.t = this.t+ds+1;
	      r.s = this.s;
	      r.clamp();
	    }
	
	    // (protected) r = this >> n
	    function bnpRShiftTo(n,r) {
	      r.s = this.s;
	      var ds = Math.floor(n/this.DB);
	      if(ds >= this.t) { r.t = 0; return; }
	      var bs = n%this.DB;
	      var cbs = this.DB-bs;
	      var bm = (1<<bs)-1;
	      r[0] = this[ds]>>bs;
	      for(var i = ds+1; i < this.t; ++i) {
	        r[i-ds-1] |= (this[i]&bm)<<cbs;
	        r[i-ds] = this[i]>>bs;
	      }
	      if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;
	      r.t = this.t-ds;
	      r.clamp();
	    }
	
	    // (protected) r = this - a
	    function bnpSubTo(a,r) {
	      var i = 0, c = 0, m = Math.min(a.t,this.t);
	      while(i < m) {
	        c += this[i]-a[i];
	        r[i++] = c&this.DM;
	        c >>= this.DB;
	      }
	      if(a.t < this.t) {
	        c -= a.s;
	        while(i < this.t) {
	          c += this[i];
	          r[i++] = c&this.DM;
	          c >>= this.DB;
	        }
	        c += this.s;
	      }
	      else {
	        c += this.s;
	        while(i < a.t) {
	          c -= a[i];
	          r[i++] = c&this.DM;
	          c >>= this.DB;
	        }
	        c -= a.s;
	      }
	      r.s = (c<0)?-1:0;
	      if(c < -1) r[i++] = this.DV+c;
	      else if(c > 0) r[i++] = c;
	      r.t = i;
	      r.clamp();
	    }
	
	    // (protected) r = this * a, r != this,a (HAC 14.12)
	    // "this" should be the larger one if appropriate.
	    function bnpMultiplyTo(a,r) {
	      var x = this.abs(), y = a.abs();
	      var i = x.t;
	      r.t = i+y.t;
	      while(--i >= 0) r[i] = 0;
	      for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
	      r.s = 0;
	      r.clamp();
	      if(this.s != a.s) BigInteger.ZERO.subTo(r,r);
	    }
	
	    // (protected) r = this^2, r != this (HAC 14.16)
	    function bnpSquareTo(r) {
	      var x = this.abs();
	      var i = r.t = 2*x.t;
	      while(--i >= 0) r[i] = 0;
	      for(i = 0; i < x.t-1; ++i) {
	        var c = x.am(i,x[i],r,2*i,0,1);
	        if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
	          r[i+x.t] -= x.DV;
	          r[i+x.t+1] = 1;
	        }
	      }
	      if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
	      r.s = 0;
	      r.clamp();
	    }
	
	    // (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
	    // r != q, this != m.  q or r may be null.
	    function bnpDivRemTo(m,q,r) {
	      var pm = m.abs();
	      if(pm.t <= 0) return;
	      var pt = this.abs();
	      if(pt.t < pm.t) {
	        if(q != null) q.fromInt(0);
	        if(r != null) this.copyTo(r);
	        return;
	      }
	      if(r == null) r = nbi();
	      var y = nbi(), ts = this.s, ms = m.s;
	      var nsh = this.DB-nbits(pm[pm.t-1]);   // normalize modulus
	      if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
	      else { pm.copyTo(y); pt.copyTo(r); }
	      var ys = y.t;
	      var y0 = y[ys-1];
	      if(y0 == 0) return;
	      var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
	      var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
	      var i = r.t, j = i-ys, t = (q==null)?nbi():q;
	      y.dlShiftTo(j,t);
	      if(r.compareTo(t) >= 0) {
	        r[r.t++] = 1;
	        r.subTo(t,r);
	      }
	      BigInteger.ONE.dlShiftTo(ys,t);
	      t.subTo(y,y);  // "negative" y so we can replace sub with am later
	      while(y.t < ys) y[y.t++] = 0;
	      while(--j >= 0) {
	        // Estimate quotient digit
	        var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
	        if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {   // Try it out
	          y.dlShiftTo(j,t);
	          r.subTo(t,r);
	          while(r[i] < --qd) r.subTo(t,r);
	        }
	      }
	      if(q != null) {
	        r.drShiftTo(ys,q);
	        if(ts != ms) BigInteger.ZERO.subTo(q,q);
	      }
	      r.t = ys;
	      r.clamp();
	      if(nsh > 0) r.rShiftTo(nsh,r); // Denormalize remainder
	      if(ts < 0) BigInteger.ZERO.subTo(r,r);
	    }
	
	    // (public) this mod a
	    function bnMod(a) {
	      var r = nbi();
	      this.abs().divRemTo(a,null,r);
	      if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
	      return r;
	    }
	
	    // Modular reduction using "classic" algorithm
	    function Classic(m) { this.m = m; }
	    function cConvert(x) {
	      if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
	      else return x;
	    }
	    function cRevert(x) { return x; }
	    function cReduce(x) { x.divRemTo(this.m,null,x); }
	    function cMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
	    function cSqrTo(x,r) { x.squareTo(r); this.reduce(r); }
	
	    Classic.prototype.convert = cConvert;
	    Classic.prototype.revert = cRevert;
	    Classic.prototype.reduce = cReduce;
	    Classic.prototype.mulTo = cMulTo;
	    Classic.prototype.sqrTo = cSqrTo;
	
	    // (protected) return "-1/this % 2^DB"; useful for Mont. reduction
	    // justification:
	    //         xy == 1 (mod m)
	    //         xy =  1+km
	    //   xy(2-xy) = (1+km)(1-km)
	    // x[y(2-xy)] = 1-k^2m^2
	    // x[y(2-xy)] == 1 (mod m^2)
	    // if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
	    // should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
	    // JS multiply "overflows" differently from C/C++, so care is needed here.
	    function bnpInvDigit() {
	      if(this.t < 1) return 0;
	      var x = this[0];
	      if((x&1) == 0) return 0;
	      var y = x&3;       // y == 1/x mod 2^2
	      y = (y*(2-(x&0xf)*y))&0xf; // y == 1/x mod 2^4
	      y = (y*(2-(x&0xff)*y))&0xff;   // y == 1/x mod 2^8
	      y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;    // y == 1/x mod 2^16
	      // last step - calculate inverse mod DV directly;
	      // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
	      y = (y*(2-x*y%this.DV))%this.DV;       // y == 1/x mod 2^dbits
	      // we really want the negative inverse, and -DV < y < DV
	      return (y>0)?this.DV-y:-y;
	    }
	
	    // Montgomery reduction
	    function Montgomery(m) {
	      this.m = m;
	      this.mp = m.invDigit();
	      this.mpl = this.mp&0x7fff;
	      this.mph = this.mp>>15;
	      this.um = (1<<(m.DB-15))-1;
	      this.mt2 = 2*m.t;
	    }
	
	    // xR mod m
	    function montConvert(x) {
	      var r = nbi();
	      x.abs().dlShiftTo(this.m.t,r);
	      r.divRemTo(this.m,null,r);
	      if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
	      return r;
	    }
	
	    // x/R mod m
	    function montRevert(x) {
	      var r = nbi();
	      x.copyTo(r);
	      this.reduce(r);
	      return r;
	    }
	
	    // x = x/R mod m (HAC 14.32)
	    function montReduce(x) {
	      while(x.t <= this.mt2) // pad x so am has enough room later
	        x[x.t++] = 0;
	      for(var i = 0; i < this.m.t; ++i) {
	        // faster way of calculating u0 = x[i]*mp mod DV
	        var j = x[i]&0x7fff;
	        var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
	        // use am to combine the multiply-shift-add into one call
	        j = i+this.m.t;
	        x[j] += this.m.am(0,u0,x,i,0,this.m.t);
	        // propagate carry
	        while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
	      }
	      x.clamp();
	      x.drShiftTo(this.m.t,x);
	      if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
	    }
	
	    // r = "x^2/R mod m"; x != r
	    function montSqrTo(x,r) { x.squareTo(r); this.reduce(r); }
	
	    // r = "xy/R mod m"; x,y != r
	    function montMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
	
	    Montgomery.prototype.convert = montConvert;
	    Montgomery.prototype.revert = montRevert;
	    Montgomery.prototype.reduce = montReduce;
	    Montgomery.prototype.mulTo = montMulTo;
	    Montgomery.prototype.sqrTo = montSqrTo;
	
	    // (protected) true iff this is even
	    function bnpIsEven() { return ((this.t>0)?(this[0]&1):this.s) == 0; }
	
	    // (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
	    function bnpExp(e,z) {
	      if(e > 0xffffffff || e < 1) return BigInteger.ONE;
	      var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;
	      g.copyTo(r);
	      while(--i >= 0) {
	        z.sqrTo(r,r2);
	        if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
	        else { var t = r; r = r2; r2 = t; }
	      }
	      return z.revert(r);
	    }
	
	    // (public) this^e % m, 0 <= e < 2^32
	    function bnModPowInt(e,m) {
	      var z;
	      if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
	      return this.exp(e,z);
	    }
	
	    // protected
	    BigInteger.prototype.copyTo = bnpCopyTo;
	    BigInteger.prototype.fromInt = bnpFromInt;
	    BigInteger.prototype.fromString = bnpFromString;
	    BigInteger.prototype.clamp = bnpClamp;
	    BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
	    BigInteger.prototype.drShiftTo = bnpDRShiftTo;
	    BigInteger.prototype.lShiftTo = bnpLShiftTo;
	    BigInteger.prototype.rShiftTo = bnpRShiftTo;
	    BigInteger.prototype.subTo = bnpSubTo;
	    BigInteger.prototype.multiplyTo = bnpMultiplyTo;
	    BigInteger.prototype.squareTo = bnpSquareTo;
	    BigInteger.prototype.divRemTo = bnpDivRemTo;
	    BigInteger.prototype.invDigit = bnpInvDigit;
	    BigInteger.prototype.isEven = bnpIsEven;
	    BigInteger.prototype.exp = bnpExp;
	
	    // public
	    BigInteger.prototype.toString = bnToString;
	    BigInteger.prototype.negate = bnNegate;
	    BigInteger.prototype.abs = bnAbs;
	    BigInteger.prototype.compareTo = bnCompareTo;
	    BigInteger.prototype.bitLength = bnBitLength;
	    BigInteger.prototype.mod = bnMod;
	    BigInteger.prototype.modPowInt = bnModPowInt;
	
	    // "constants"
	    BigInteger.ZERO = nbv(0);
	    BigInteger.ONE = nbv(1);
	
	    // Copyright (c) 2005-2009  Tom Wu
	    // All Rights Reserved.
	    // See "LICENSE" for details.
	
	    // Extended JavaScript BN functions, required for RSA private ops.
	
	    // Version 1.1: new BigInteger("0", 10) returns "proper" zero
	    // Version 1.2: square() API, isProbablePrime fix
	
	    // (public)
	    function bnClone() { var r = nbi(); this.copyTo(r); return r; }
	
	    // (public) return value as integer
	    function bnIntValue() {
	      if(this.s < 0) {
	        if(this.t == 1) return this[0]-this.DV;
	        else if(this.t == 0) return -1;
	      }
	      else if(this.t == 1) return this[0];
	      else if(this.t == 0) return 0;
	      // assumes 16 < DB < 32
	      return ((this[1]&((1<<(32-this.DB))-1))<<this.DB)|this[0];
	    }
	
	    // (public) return value as byte
	    function bnByteValue() { return (this.t==0)?this.s:(this[0]<<24)>>24; }
	
	    // (public) return value as short (assumes DB>=16)
	    function bnShortValue() { return (this.t==0)?this.s:(this[0]<<16)>>16; }
	
	    // (protected) return x s.t. r^x < DV
	    function bnpChunkSize(r) { return Math.floor(Math.LN2*this.DB/Math.log(r)); }
	
	    // (public) 0 if this == 0, 1 if this > 0
	    function bnSigNum() {
	      if(this.s < 0) return -1;
	      else if(this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0;
	      else return 1;
	    }
	
	    // (protected) convert to radix string
	    function bnpToRadix(b) {
	      if(b == null) b = 10;
	      if(this.signum() == 0 || b < 2 || b > 36) return "0";
	      var cs = this.chunkSize(b);
	      var a = Math.pow(b,cs);
	      var d = nbv(a), y = nbi(), z = nbi(), r = "";
	      this.divRemTo(d,y,z);
	      while(y.signum() > 0) {
	        r = (a+z.intValue()).toString(b).substr(1) + r;
	        y.divRemTo(d,y,z);
	      }
	      return z.intValue().toString(b) + r;
	    }
	
	    // (protected) convert from radix string
	    function bnpFromRadix(s,b) {
	      this.fromInt(0);
	      if(b == null) b = 10;
	      var cs = this.chunkSize(b);
	      var d = Math.pow(b,cs), mi = false, j = 0, w = 0;
	      for(var i = 0; i < s.length; ++i) {
	        var x = intAt(s,i);
	        if(x < 0) {
	          if(s.charAt(i) == "-" && this.signum() == 0) mi = true;
	          continue;
	        }
	        w = b*w+x;
	        if(++j >= cs) {
	          this.dMultiply(d);
	          this.dAddOffset(w,0);
	          j = 0;
	          w = 0;
	        }
	      }
	      if(j > 0) {
	        this.dMultiply(Math.pow(b,j));
	        this.dAddOffset(w,0);
	      }
	      if(mi) BigInteger.ZERO.subTo(this,this);
	    }
	
	    // (protected) alternate constructor
	    function bnpFromNumber(a,b,c) {
	      if("number" == typeof b) {
	        // new BigInteger(int,int,RNG)
	        if(a < 2) this.fromInt(1);
	        else {
	          this.fromNumber(a,c);
	          if(!this.testBit(a-1))    // force MSB set
	            this.bitwiseTo(BigInteger.ONE.shiftLeft(a-1),op_or,this);
	          if(this.isEven()) this.dAddOffset(1,0); // force odd
	          while(!this.isProbablePrime(b)) {
	            this.dAddOffset(2,0);
	            if(this.bitLength() > a) this.subTo(BigInteger.ONE.shiftLeft(a-1),this);
	          }
	        }
	      }
	      else {
	        // new BigInteger(int,RNG)
	        var x = new Array(), t = a&7;
	        x.length = (a>>3)+1;
	        b.nextBytes(x);
	        if(t > 0) x[0] &= ((1<<t)-1); else x[0] = 0;
	        this.fromString(x,256);
	      }
	    }
	
	    // (public) convert to bigendian byte array
	    function bnToByteArray() {
	      var i = this.t, r = new Array();
	      r[0] = this.s;
	      var p = this.DB-(i*this.DB)%8, d, k = 0;
	      if(i-- > 0) {
	        if(p < this.DB && (d = this[i]>>p) != (this.s&this.DM)>>p)
	          r[k++] = d|(this.s<<(this.DB-p));
	        while(i >= 0) {
	          if(p < 8) {
	            d = (this[i]&((1<<p)-1))<<(8-p);
	            d |= this[--i]>>(p+=this.DB-8);
	          }
	          else {
	            d = (this[i]>>(p-=8))&0xff;
	            if(p <= 0) { p += this.DB; --i; }
	          }
	          if((d&0x80) != 0) d |= -256;
	          if(k == 0 && (this.s&0x80) != (d&0x80)) ++k;
	          if(k > 0 || d != this.s) r[k++] = d;
	        }
	      }
	      return r;
	    }
	
	    function bnEquals(a) { return(this.compareTo(a)==0); }
	    function bnMin(a) { return(this.compareTo(a)<0)?this:a; }
	    function bnMax(a) { return(this.compareTo(a)>0)?this:a; }
	
	    // (protected) r = this op a (bitwise)
	    function bnpBitwiseTo(a,op,r) {
	      var i, f, m = Math.min(a.t,this.t);
	      for(i = 0; i < m; ++i) r[i] = op(this[i],a[i]);
	      if(a.t < this.t) {
	        f = a.s&this.DM;
	        for(i = m; i < this.t; ++i) r[i] = op(this[i],f);
	        r.t = this.t;
	      }
	      else {
	        f = this.s&this.DM;
	        for(i = m; i < a.t; ++i) r[i] = op(f,a[i]);
	        r.t = a.t;
	      }
	      r.s = op(this.s,a.s);
	      r.clamp();
	    }
	
	    // (public) this & a
	    function op_and(x,y) { return x&y; }
	    function bnAnd(a) { var r = nbi(); this.bitwiseTo(a,op_and,r); return r; }
	
	    // (public) this | a
	    function op_or(x,y) { return x|y; }
	    function bnOr(a) { var r = nbi(); this.bitwiseTo(a,op_or,r); return r; }
	
	    // (public) this ^ a
	    function op_xor(x,y) { return x^y; }
	    function bnXor(a) { var r = nbi(); this.bitwiseTo(a,op_xor,r); return r; }
	
	    // (public) this & ~a
	    function op_andnot(x,y) { return x&~y; }
	    function bnAndNot(a) { var r = nbi(); this.bitwiseTo(a,op_andnot,r); return r; }
	
	    // (public) ~this
	    function bnNot() {
	      var r = nbi();
	      for(var i = 0; i < this.t; ++i) r[i] = this.DM&~this[i];
	      r.t = this.t;
	      r.s = ~this.s;
	      return r;
	    }
	
	    // (public) this << n
	    function bnShiftLeft(n) {
	      var r = nbi();
	      if(n < 0) this.rShiftTo(-n,r); else this.lShiftTo(n,r);
	      return r;
	    }
	
	    // (public) this >> n
	    function bnShiftRight(n) {
	      var r = nbi();
	      if(n < 0) this.lShiftTo(-n,r); else this.rShiftTo(n,r);
	      return r;
	    }
	
	    // return index of lowest 1-bit in x, x < 2^31
	    function lbit(x) {
	      if(x == 0) return -1;
	      var r = 0;
	      if((x&0xffff) == 0) { x >>= 16; r += 16; }
	      if((x&0xff) == 0) { x >>= 8; r += 8; }
	      if((x&0xf) == 0) { x >>= 4; r += 4; }
	      if((x&3) == 0) { x >>= 2; r += 2; }
	      if((x&1) == 0) ++r;
	      return r;
	    }
	
	    // (public) returns index of lowest 1-bit (or -1 if none)
	    function bnGetLowestSetBit() {
	      for(var i = 0; i < this.t; ++i)
	        if(this[i] != 0) return i*this.DB+lbit(this[i]);
	      if(this.s < 0) return this.t*this.DB;
	      return -1;
	    }
	
	    // return number of 1 bits in x
	    function cbit(x) {
	      var r = 0;
	      while(x != 0) { x &= x-1; ++r; }
	      return r;
	    }
	
	    // (public) return number of set bits
	    function bnBitCount() {
	      var r = 0, x = this.s&this.DM;
	      for(var i = 0; i < this.t; ++i) r += cbit(this[i]^x);
	      return r;
	    }
	
	    // (public) true iff nth bit is set
	    function bnTestBit(n) {
	      var j = Math.floor(n/this.DB);
	      if(j >= this.t) return(this.s!=0);
	      return((this[j]&(1<<(n%this.DB)))!=0);
	    }
	
	    // (protected) this op (1<<n)
	    function bnpChangeBit(n,op) {
	      var r = BigInteger.ONE.shiftLeft(n);
	      this.bitwiseTo(r,op,r);
	      return r;
	    }
	
	    // (public) this | (1<<n)
	    function bnSetBit(n) { return this.changeBit(n,op_or); }
	
	    // (public) this & ~(1<<n)
	    function bnClearBit(n) { return this.changeBit(n,op_andnot); }
	
	    // (public) this ^ (1<<n)
	    function bnFlipBit(n) { return this.changeBit(n,op_xor); }
	
	    // (protected) r = this + a
	    function bnpAddTo(a,r) {
	      var i = 0, c = 0, m = Math.min(a.t,this.t);
	      while(i < m) {
	        c += this[i]+a[i];
	        r[i++] = c&this.DM;
	        c >>= this.DB;
	      }
	      if(a.t < this.t) {
	        c += a.s;
	        while(i < this.t) {
	          c += this[i];
	          r[i++] = c&this.DM;
	          c >>= this.DB;
	        }
	        c += this.s;
	      }
	      else {
	        c += this.s;
	        while(i < a.t) {
	          c += a[i];
	          r[i++] = c&this.DM;
	          c >>= this.DB;
	        }
	        c += a.s;
	      }
	      r.s = (c<0)?-1:0;
	      if(c > 0) r[i++] = c;
	      else if(c < -1) r[i++] = this.DV+c;
	      r.t = i;
	      r.clamp();
	    }
	
	    // (public) this + a
	    function bnAdd(a) { var r = nbi(); this.addTo(a,r); return r; }
	
	    // (public) this - a
	    function bnSubtract(a) { var r = nbi(); this.subTo(a,r); return r; }
	
	    // (public) this * a
	    function bnMultiply(a) { var r = nbi(); this.multiplyTo(a,r); return r; }
	
	    // (public) this^2
	    function bnSquare() { var r = nbi(); this.squareTo(r); return r; }
	
	    // (public) this / a
	    function bnDivide(a) { var r = nbi(); this.divRemTo(a,r,null); return r; }
	
	    // (public) this % a
	    function bnRemainder(a) { var r = nbi(); this.divRemTo(a,null,r); return r; }
	
	    // (public) [this/a,this%a]
	    function bnDivideAndRemainder(a) {
	      var q = nbi(), r = nbi();
	      this.divRemTo(a,q,r);
	      return new Array(q,r);
	    }
	
	    // (protected) this *= n, this >= 0, 1 < n < DV
	    function bnpDMultiply(n) {
	      this[this.t] = this.am(0,n-1,this,0,0,this.t);
	      ++this.t;
	      this.clamp();
	    }
	
	    // (protected) this += n << w words, this >= 0
	    function bnpDAddOffset(n,w) {
	      if(n == 0) return;
	      while(this.t <= w) this[this.t++] = 0;
	      this[w] += n;
	      while(this[w] >= this.DV) {
	        this[w] -= this.DV;
	        if(++w >= this.t) this[this.t++] = 0;
	        ++this[w];
	      }
	    }
	
	    // A "null" reducer
	    function NullExp() {}
	    function nNop(x) { return x; }
	    function nMulTo(x,y,r) { x.multiplyTo(y,r); }
	    function nSqrTo(x,r) { x.squareTo(r); }
	
	    NullExp.prototype.convert = nNop;
	    NullExp.prototype.revert = nNop;
	    NullExp.prototype.mulTo = nMulTo;
	    NullExp.prototype.sqrTo = nSqrTo;
	
	    // (public) this^e
	    function bnPow(e) { return this.exp(e,new NullExp()); }
	
	    // (protected) r = lower n words of "this * a", a.t <= n
	    // "this" should be the larger one if appropriate.
	    function bnpMultiplyLowerTo(a,n,r) {
	      var i = Math.min(this.t+a.t,n);
	      r.s = 0; // assumes a,this >= 0
	      r.t = i;
	      while(i > 0) r[--i] = 0;
	      var j;
	      for(j = r.t-this.t; i < j; ++i) r[i+this.t] = this.am(0,a[i],r,i,0,this.t);
	      for(j = Math.min(a.t,n); i < j; ++i) this.am(0,a[i],r,i,0,n-i);
	      r.clamp();
	    }
	
	    // (protected) r = "this * a" without lower n words, n > 0
	    // "this" should be the larger one if appropriate.
	    function bnpMultiplyUpperTo(a,n,r) {
	      --n;
	      var i = r.t = this.t+a.t-n;
	      r.s = 0; // assumes a,this >= 0
	      while(--i >= 0) r[i] = 0;
	      for(i = Math.max(n-this.t,0); i < a.t; ++i)
	        r[this.t+i-n] = this.am(n-i,a[i],r,0,0,this.t+i-n);
	      r.clamp();
	      r.drShiftTo(1,r);
	    }
	
	    // Barrett modular reduction
	    function Barrett(m) {
	      // setup Barrett
	      this.r2 = nbi();
	      this.q3 = nbi();
	      BigInteger.ONE.dlShiftTo(2*m.t,this.r2);
	      this.mu = this.r2.divide(m);
	      this.m = m;
	    }
	
	    function barrettConvert(x) {
	      if(x.s < 0 || x.t > 2*this.m.t) return x.mod(this.m);
	      else if(x.compareTo(this.m) < 0) return x;
	      else { var r = nbi(); x.copyTo(r); this.reduce(r); return r; }
	    }
	
	    function barrettRevert(x) { return x; }
	
	    // x = x mod m (HAC 14.42)
	    function barrettReduce(x) {
	      x.drShiftTo(this.m.t-1,this.r2);
	      if(x.t > this.m.t+1) { x.t = this.m.t+1; x.clamp(); }
	      this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3);
	      this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);
	      while(x.compareTo(this.r2) < 0) x.dAddOffset(1,this.m.t+1);
	      x.subTo(this.r2,x);
	      while(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
	    }
	
	    // r = x^2 mod m; x != r
	    function barrettSqrTo(x,r) { x.squareTo(r); this.reduce(r); }
	
	    // r = x*y mod m; x,y != r
	    function barrettMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
	
	    Barrett.prototype.convert = barrettConvert;
	    Barrett.prototype.revert = barrettRevert;
	    Barrett.prototype.reduce = barrettReduce;
	    Barrett.prototype.mulTo = barrettMulTo;
	    Barrett.prototype.sqrTo = barrettSqrTo;
	
	    // (public) this^e % m (HAC 14.85)
	    function bnModPow(e,m) {
	      var i = e.bitLength(), k, r = nbv(1), z;
	      if(i <= 0) return r;
	      else if(i < 18) k = 1;
	      else if(i < 48) k = 3;
	      else if(i < 144) k = 4;
	      else if(i < 768) k = 5;
	      else k = 6;
	      if(i < 8)
	        z = new Classic(m);
	      else if(m.isEven())
	        z = new Barrett(m);
	      else
	        z = new Montgomery(m);
	
	      // precomputation
	      var g = new Array(), n = 3, k1 = k-1, km = (1<<k)-1;
	      g[1] = z.convert(this);
	      if(k > 1) {
	        var g2 = nbi();
	        z.sqrTo(g[1],g2);
	        while(n <= km) {
	          g[n] = nbi();
	          z.mulTo(g2,g[n-2],g[n]);
	          n += 2;
	        }
	      }
	
	      var j = e.t-1, w, is1 = true, r2 = nbi(), t;
	      i = nbits(e[j])-1;
	      while(j >= 0) {
	        if(i >= k1) w = (e[j]>>(i-k1))&km;
	        else {
	          w = (e[j]&((1<<(i+1))-1))<<(k1-i);
	          if(j > 0) w |= e[j-1]>>(this.DB+i-k1);
	        }
	
	        n = k;
	        while((w&1) == 0) { w >>= 1; --n; }
	        if((i -= n) < 0) { i += this.DB; --j; }
	        if(is1) {    // ret == 1, don't bother squaring or multiplying it
	          g[w].copyTo(r);
	          is1 = false;
	        }
	        else {
	          while(n > 1) { z.sqrTo(r,r2); z.sqrTo(r2,r); n -= 2; }
	          if(n > 0) z.sqrTo(r,r2); else { t = r; r = r2; r2 = t; }
	          z.mulTo(r2,g[w],r);
	        }
	
	        while(j >= 0 && (e[j]&(1<<i)) == 0) {
	          z.sqrTo(r,r2); t = r; r = r2; r2 = t;
	          if(--i < 0) { i = this.DB-1; --j; }
	        }
	      }
	      return z.revert(r);
	    }
	
	    // (public) gcd(this,a) (HAC 14.54)
	    function bnGCD(a) {
	      var x = (this.s<0)?this.negate():this.clone();
	      var y = (a.s<0)?a.negate():a.clone();
	      if(x.compareTo(y) < 0) { var t = x; x = y; y = t; }
	      var i = x.getLowestSetBit(), g = y.getLowestSetBit();
	      if(g < 0) return x;
	      if(i < g) g = i;
	      if(g > 0) {
	        x.rShiftTo(g,x);
	        y.rShiftTo(g,y);
	      }
	      while(x.signum() > 0) {
	        if((i = x.getLowestSetBit()) > 0) x.rShiftTo(i,x);
	        if((i = y.getLowestSetBit()) > 0) y.rShiftTo(i,y);
	        if(x.compareTo(y) >= 0) {
	          x.subTo(y,x);
	          x.rShiftTo(1,x);
	        }
	        else {
	          y.subTo(x,y);
	          y.rShiftTo(1,y);
	        }
	      }
	      if(g > 0) y.lShiftTo(g,y);
	      return y;
	    }
	
	    // (protected) this % n, n < 2^26
	    function bnpModInt(n) {
	      if(n <= 0) return 0;
	      var d = this.DV%n, r = (this.s<0)?n-1:0;
	      if(this.t > 0)
	        if(d == 0) r = this[0]%n;
	        else for(var i = this.t-1; i >= 0; --i) r = (d*r+this[i])%n;
	      return r;
	    }
	
	    // (public) 1/this % m (HAC 14.61)
	    function bnModInverse(m) {
	      var ac = m.isEven();
	      if((this.isEven() && ac) || m.signum() == 0) return BigInteger.ZERO;
	      var u = m.clone(), v = this.clone();
	      var a = nbv(1), b = nbv(0), c = nbv(0), d = nbv(1);
	      while(u.signum() != 0) {
	        while(u.isEven()) {
	          u.rShiftTo(1,u);
	          if(ac) {
	            if(!a.isEven() || !b.isEven()) { a.addTo(this,a); b.subTo(m,b); }
	            a.rShiftTo(1,a);
	          }
	          else if(!b.isEven()) b.subTo(m,b);
	          b.rShiftTo(1,b);
	        }
	        while(v.isEven()) {
	          v.rShiftTo(1,v);
	          if(ac) {
	            if(!c.isEven() || !d.isEven()) { c.addTo(this,c); d.subTo(m,d); }
	            c.rShiftTo(1,c);
	          }
	          else if(!d.isEven()) d.subTo(m,d);
	          d.rShiftTo(1,d);
	        }
	        if(u.compareTo(v) >= 0) {
	          u.subTo(v,u);
	          if(ac) a.subTo(c,a);
	          b.subTo(d,b);
	        }
	        else {
	          v.subTo(u,v);
	          if(ac) c.subTo(a,c);
	          d.subTo(b,d);
	        }
	      }
	      if(v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
	      if(d.compareTo(m) >= 0) return d.subtract(m);
	      if(d.signum() < 0) d.addTo(m,d); else return d;
	      if(d.signum() < 0) return d.add(m); else return d;
	    }
	
	    var lowprimes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997];
	    var lplim = (1<<26)/lowprimes[lowprimes.length-1];
	
	    // (public) test primality with certainty >= 1-.5^t
	    function bnIsProbablePrime(t) {
	      var i, x = this.abs();
	      if(x.t == 1 && x[0] <= lowprimes[lowprimes.length-1]) {
	        for(i = 0; i < lowprimes.length; ++i)
	          if(x[0] == lowprimes[i]) return true;
	        return false;
	      }
	      if(x.isEven()) return false;
	      i = 1;
	      while(i < lowprimes.length) {
	        var m = lowprimes[i], j = i+1;
	        while(j < lowprimes.length && m < lplim) m *= lowprimes[j++];
	        m = x.modInt(m);
	        while(i < j) if(m%lowprimes[i++] == 0) return false;
	      }
	      return x.millerRabin(t);
	    }
	
	    // (protected) true if probably prime (HAC 4.24, Miller-Rabin)
	    function bnpMillerRabin(t) {
	      var n1 = this.subtract(BigInteger.ONE);
	      var k = n1.getLowestSetBit();
	      if(k <= 0) return false;
	      var r = n1.shiftRight(k);
	      t = (t+1)>>1;
	      if(t > lowprimes.length) t = lowprimes.length;
	      var a = nbi();
	      for(var i = 0; i < t; ++i) {
	        //Pick bases at random, instead of starting at 2
	        a.fromInt(lowprimes[Math.floor(Math.random()*lowprimes.length)]);
	        var y = a.modPow(r,this);
	        if(y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
	          var j = 1;
	          while(j++ < k && y.compareTo(n1) != 0) {
	            y = y.modPowInt(2,this);
	            if(y.compareTo(BigInteger.ONE) == 0) return false;
	          }
	          if(y.compareTo(n1) != 0) return false;
	        }
	      }
	      return true;
	    }
	
	    // protected
	    BigInteger.prototype.chunkSize = bnpChunkSize;
	    BigInteger.prototype.toRadix = bnpToRadix;
	    BigInteger.prototype.fromRadix = bnpFromRadix;
	    BigInteger.prototype.fromNumber = bnpFromNumber;
	    BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
	    BigInteger.prototype.changeBit = bnpChangeBit;
	    BigInteger.prototype.addTo = bnpAddTo;
	    BigInteger.prototype.dMultiply = bnpDMultiply;
	    BigInteger.prototype.dAddOffset = bnpDAddOffset;
	    BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
	    BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
	    BigInteger.prototype.modInt = bnpModInt;
	    BigInteger.prototype.millerRabin = bnpMillerRabin;
	
	    // public
	    BigInteger.prototype.clone = bnClone;
	    BigInteger.prototype.intValue = bnIntValue;
	    BigInteger.prototype.byteValue = bnByteValue;
	    BigInteger.prototype.shortValue = bnShortValue;
	    BigInteger.prototype.signum = bnSigNum;
	    BigInteger.prototype.toByteArray = bnToByteArray;
	    BigInteger.prototype.equals = bnEquals;
	    BigInteger.prototype.min = bnMin;
	    BigInteger.prototype.max = bnMax;
	    BigInteger.prototype.and = bnAnd;
	    BigInteger.prototype.or = bnOr;
	    BigInteger.prototype.xor = bnXor;
	    BigInteger.prototype.andNot = bnAndNot;
	    BigInteger.prototype.not = bnNot;
	    BigInteger.prototype.shiftLeft = bnShiftLeft;
	    BigInteger.prototype.shiftRight = bnShiftRight;
	    BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
	    BigInteger.prototype.bitCount = bnBitCount;
	    BigInteger.prototype.testBit = bnTestBit;
	    BigInteger.prototype.setBit = bnSetBit;
	    BigInteger.prototype.clearBit = bnClearBit;
	    BigInteger.prototype.flipBit = bnFlipBit;
	    BigInteger.prototype.add = bnAdd;
	    BigInteger.prototype.subtract = bnSubtract;
	    BigInteger.prototype.multiply = bnMultiply;
	    BigInteger.prototype.divide = bnDivide;
	    BigInteger.prototype.remainder = bnRemainder;
	    BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
	    BigInteger.prototype.modPow = bnModPow;
	    BigInteger.prototype.modInverse = bnModInverse;
	    BigInteger.prototype.pow = bnPow;
	    BigInteger.prototype.gcd = bnGCD;
	    BigInteger.prototype.isProbablePrime = bnIsProbablePrime;
	
	    // JSBN-specific extension
	    BigInteger.prototype.square = bnSquare;
	
	    // Expose the Barrett function
	    BigInteger.prototype.Barrett = Barrett
	
	    // BigInteger interfaces not implemented in jsbn:
	
	    // BigInteger(int signum, byte[] magnitude)
	    // double doubleValue()
	    // float floatValue()
	    // int hashCode()
	    // long longValue()
	    // static BigInteger valueOf(long val)
	
	    // Random number generator - requires a PRNG backend, e.g. prng4.js
	
	    // For best results, put code like
	    // <body onClick='rng_seed_time();' onKeyPress='rng_seed_time();'>
	    // in your main HTML document.
	
	    var rng_state;
	    var rng_pool;
	    var rng_pptr;
	
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
	      if(typeof window !== "undefined" && window.crypto) {
	        if (window.crypto.getRandomValues) {
	          // Use webcrypto if available
	          var ua = new Uint8Array(32);
	          window.crypto.getRandomValues(ua);
	          for(t = 0; t < 32; ++t)
	            rng_pool[rng_pptr++] = ua[t];
	        }
	        else if(navigator.appName == "Netscape" && navigator.appVersion < "5") {
	          // Extract entropy (256 bits) from NS4 RNG if available
	          var z = window.crypto.random(32);
	          for(t = 0; t < z.length; ++t)
	            rng_pool[rng_pptr++] = z.charCodeAt(t) & 255;
	        }
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
	
	    if (true) {
	        exports = module.exports = {
	            default: BigInteger,
	            BigInteger: BigInteger,
	            SecureRandom: SecureRandom,
	        };
	    } else {
	        this.jsbn = {
	          BigInteger: BigInteger,
	          SecureRandom: SecureRandom
	        };
	    }
	
	}).call(this);


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
	var crypto_js_1 = __webpack_require__(42);
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
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(8);


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	var assert = __webpack_require__(9);
	var dict = __webpack_require__(14);
	var Parser = __webpack_require__(15);
	var Handlers = __webpack_require__(23);
	
	var JSONPath = function() {
	  this.initialize.apply(this, arguments);
	};
	
	JSONPath.prototype.initialize = function() {
	  this.parser = new Parser();
	  this.handlers = new Handlers();
	};
	
	JSONPath.prototype.parse = function(string) {
	  assert.ok(_is_string(string), "we need a path");
	  return this.parser.parse(string);
	};
	
	JSONPath.prototype.parent = function(obj, string) {
	
	  assert.ok(obj instanceof Object, "obj needs to be an object");
	  assert.ok(string, "we need a path");
	
	  var node = this.nodes(obj, string)[0];
	  var key = node.path.pop(); /* jshint unused:false */
	  return this.value(obj, node.path);
	}
	
	JSONPath.prototype.apply = function(obj, string, fn) {
	
	  assert.ok(obj instanceof Object, "obj needs to be an object");
	  assert.ok(string, "we need a path");
	  assert.equal(typeof fn, "function", "fn needs to be function")
	
	  var nodes = this.nodes(obj, string).sort(function(a, b) {
	    // sort nodes so we apply from the bottom up
	    return b.path.length - a.path.length;
	  });
	
	  nodes.forEach(function(node) {
	    var key = node.path.pop();
	    var parent = this.value(obj, this.stringify(node.path));
	    var val = node.value = fn.call(obj, parent[key]);
	    parent[key] = val;
	  }, this);
	
	  return nodes;
	}
	
	JSONPath.prototype.value = function(obj, path, value) {
	
	  assert.ok(obj instanceof Object, "obj needs to be an object");
	  assert.ok(path, "we need a path");
	
	  if (arguments.length >= 3) {
	    var node = this.nodes(obj, path).shift();
	    if (!node) return this._vivify(obj, path, value);
	    var key = node.path.slice(-1).shift();
	    var parent = this.parent(obj, this.stringify(node.path));
	    parent[key] = value;
	  }
	  return this.query(obj, this.stringify(path), 1).shift();
	}
	
	JSONPath.prototype._vivify = function(obj, string, value) {
	
	  var self = this;
	
	  assert.ok(obj instanceof Object, "obj needs to be an object");
	  assert.ok(string, "we need a path");
	
	  var path = this.parser.parse(string)
	    .map(function(component) { return component.expression.value });
	
	  var setValue = function(path, value) {
	    var key = path.pop();
	    var node = self.value(obj, path);
	    if (!node) {
	      setValue(path.concat(), typeof key === 'string' ? {} : []);
	      node = self.value(obj, path);
	    }
	    node[key] = value;
	  }
	  setValue(path, value);
	  return this.query(obj, string)[0];
	}
	
	JSONPath.prototype.query = function(obj, string, count) {
	
	  assert.ok(obj instanceof Object, "obj needs to be an object");
	  assert.ok(_is_string(string), "we need a path");
	
	  var results = this.nodes(obj, string, count)
	    .map(function(r) { return r.value });
	
	  return results;
	};
	
	JSONPath.prototype.paths = function(obj, string, count) {
	
	  assert.ok(obj instanceof Object, "obj needs to be an object");
	  assert.ok(string, "we need a path");
	
	  var results = this.nodes(obj, string, count)
	    .map(function(r) { return r.path });
	
	  return results;
	};
	
	JSONPath.prototype.nodes = function(obj, string, count) {
	
	  assert.ok(obj instanceof Object, "obj needs to be an object");
	  assert.ok(string, "we need a path");
	
	  if (count === 0) return [];
	
	  var path = this.parser.parse(string);
	  var handlers = this.handlers;
	
	  var partials = [ { path: ['$'], value: obj } ];
	  var matches = [];
	
	  if (path.length && path[0].expression.type == 'root') path.shift();
	
	  if (!path.length) return partials;
	
	  path.forEach(function(component, index) {
	
	    if (matches.length >= count) return;
	    var handler = handlers.resolve(component);
	    var _partials = [];
	
	    partials.forEach(function(p) {
	
	      if (matches.length >= count) return;
	      var results = handler(component, p, count);
	
	      if (index == path.length - 1) {
	        // if we're through the components we're done
	        matches = matches.concat(results || []);
	      } else {
	        // otherwise accumulate and carry on through
	        _partials = _partials.concat(results || []);
	      }
	    });
	
	    partials = _partials;
	
	  });
	
	  return count ? matches.slice(0, count) : matches;
	};
	
	JSONPath.prototype.stringify = function(path) {
	
	  assert.ok(path, "we need a path");
	
	  var string = '$';
	
	  var templates = {
	    'descendant-member': '..{{value}}',
	    'child-member': '.{{value}}',
	    'descendant-subscript': '..[{{value}}]',
	    'child-subscript': '[{{value}}]'
	  };
	
	  path = this._normalize(path);
	
	  path.forEach(function(component) {
	
	    if (component.expression.type == 'root') return;
	
	    var key = [component.scope, component.operation].join('-');
	    var template = templates[key];
	    var value;
	
	    if (component.expression.type == 'string_literal') {
	      value = JSON.stringify(component.expression.value)
	    } else {
	      value = component.expression.value;
	    }
	
	    if (!template) throw new Error("couldn't find template " + key);
	
	    string += template.replace(/{{value}}/, value);
	  });
	
	  return string;
	}
	
	JSONPath.prototype._normalize = function(path) {
	
	  assert.ok(path, "we need a path");
	
	  if (typeof path == "string") {
	
	    return this.parser.parse(path);
	
	  } else if (Array.isArray(path) && typeof path[0] == "string") {
	
	    var _path = [ { expression: { type: "root", value: "$" } } ];
	
	    path.forEach(function(component, index) {
	
	      if (component == '$' && index === 0) return;
	
	      if (typeof component == "string" && component.match("^" + dict.identifier + "$")) {
	
	        _path.push({
	          operation: 'member',
	          scope: 'child',
	          expression: { value: component, type: 'identifier' }
	        });
	
	      } else {
	
	        var type = typeof component == "number" ?
	          'numeric_literal' : 'string_literal';
	
	        _path.push({
	          operation: 'subscript',
	          scope: 'child',
	          expression: { value: component, type: type }
	        });
	      }
	    });
	
	    return _path;
	
	  } else if (Array.isArray(path) && typeof path[0] == "object") {
	
	    return path
	  }
	
	  throw new Error("couldn't understand path " + path);
	}
	
	function _is_string(obj) {
	  return Object.prototype.toString.call(obj) == '[object String]';
	}
	
	JSONPath.Handlers = Handlers;
	JSONPath.Parser = Parser;
	
	var instance = new JSONPath;
	instance.JSONPath = JSONPath;
	
	module.exports = instance;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
	// original notice:
	
	/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	function compare(a, b) {
	  if (a === b) {
	    return 0;
	  }
	
	  var x = a.length;
	  var y = b.length;
	
	  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
	    if (a[i] !== b[i]) {
	      x = a[i];
	      y = b[i];
	      break;
	    }
	  }
	
	  if (x < y) {
	    return -1;
	  }
	  if (y < x) {
	    return 1;
	  }
	  return 0;
	}
	function isBuffer(b) {
	  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
	    return global.Buffer.isBuffer(b);
	  }
	  return !!(b != null && b._isBuffer);
	}
	
	// based on node assert, original notice:
	
	// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
	//
	// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
	//
	// Originally from narwhal.js (http://narwhaljs.org)
	// Copyright (c) 2009 Thomas Robinson <280north.com>
	//
	// Permission is hereby granted, free of charge, to any person obtaining a copy
	// of this software and associated documentation files (the 'Software'), to
	// deal in the Software without restriction, including without limitation the
	// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
	// sell copies of the Software, and to permit persons to whom the Software is
	// furnished to do so, subject to the following conditions:
	//
	// The above copyright notice and this permission notice shall be included in
	// all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
	// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	var util = __webpack_require__(10);
	var hasOwn = Object.prototype.hasOwnProperty;
	var pSlice = Array.prototype.slice;
	var functionsHaveNames = (function () {
	  return function foo() {}.name === 'foo';
	}());
	function pToString (obj) {
	  return Object.prototype.toString.call(obj);
	}
	function isView(arrbuf) {
	  if (isBuffer(arrbuf)) {
	    return false;
	  }
	  if (typeof global.ArrayBuffer !== 'function') {
	    return false;
	  }
	  if (typeof ArrayBuffer.isView === 'function') {
	    return ArrayBuffer.isView(arrbuf);
	  }
	  if (!arrbuf) {
	    return false;
	  }
	  if (arrbuf instanceof DataView) {
	    return true;
	  }
	  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
	    return true;
	  }
	  return false;
	}
	// 1. The assert module provides functions that throw
	// AssertionError's when particular conditions are not met. The
	// assert module must conform to the following interface.
	
	var assert = module.exports = ok;
	
	// 2. The AssertionError is defined in assert.
	// new assert.AssertionError({ message: message,
	//                             actual: actual,
	//                             expected: expected })
	
	var regex = /\s*function\s+([^\(\s]*)\s*/;
	// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
	function getName(func) {
	  if (!util.isFunction(func)) {
	    return;
	  }
	  if (functionsHaveNames) {
	    return func.name;
	  }
	  var str = func.toString();
	  var match = str.match(regex);
	  return match && match[1];
	}
	assert.AssertionError = function AssertionError(options) {
	  this.name = 'AssertionError';
	  this.actual = options.actual;
	  this.expected = options.expected;
	  this.operator = options.operator;
	  if (options.message) {
	    this.message = options.message;
	    this.generatedMessage = false;
	  } else {
	    this.message = getMessage(this);
	    this.generatedMessage = true;
	  }
	  var stackStartFunction = options.stackStartFunction || fail;
	  if (Error.captureStackTrace) {
	    Error.captureStackTrace(this, stackStartFunction);
	  } else {
	    // non v8 browsers so we can have a stacktrace
	    var err = new Error();
	    if (err.stack) {
	      var out = err.stack;
	
	      // try to strip useless frames
	      var fn_name = getName(stackStartFunction);
	      var idx = out.indexOf('\n' + fn_name);
	      if (idx >= 0) {
	        // once we have located the function frame
	        // we need to strip out everything before it (and its line)
	        var next_line = out.indexOf('\n', idx + 1);
	        out = out.substring(next_line + 1);
	      }
	
	      this.stack = out;
	    }
	  }
	};
	
	// assert.AssertionError instanceof Error
	util.inherits(assert.AssertionError, Error);
	
	function truncate(s, n) {
	  if (typeof s === 'string') {
	    return s.length < n ? s : s.slice(0, n);
	  } else {
	    return s;
	  }
	}
	function inspect(something) {
	  if (functionsHaveNames || !util.isFunction(something)) {
	    return util.inspect(something);
	  }
	  var rawname = getName(something);
	  var name = rawname ? ': ' + rawname : '';
	  return '[Function' +  name + ']';
	}
	function getMessage(self) {
	  return truncate(inspect(self.actual), 128) + ' ' +
	         self.operator + ' ' +
	         truncate(inspect(self.expected), 128);
	}
	
	// At present only the three keys mentioned above are used and
	// understood by the spec. Implementations or sub modules can pass
	// other keys to the AssertionError's constructor - they will be
	// ignored.
	
	// 3. All of the following functions must throw an AssertionError
	// when a corresponding condition is not met, with a message that
	// may be undefined if not provided.  All assertion methods provide
	// both the actual and expected values to the assertion error for
	// display purposes.
	
	function fail(actual, expected, message, operator, stackStartFunction) {
	  throw new assert.AssertionError({
	    message: message,
	    actual: actual,
	    expected: expected,
	    operator: operator,
	    stackStartFunction: stackStartFunction
	  });
	}
	
	// EXTENSION! allows for well behaved errors defined elsewhere.
	assert.fail = fail;
	
	// 4. Pure assertion tests whether a value is truthy, as determined
	// by !!guard.
	// assert.ok(guard, message_opt);
	// This statement is equivalent to assert.equal(true, !!guard,
	// message_opt);. To test strictly for the value true, use
	// assert.strictEqual(true, guard, message_opt);.
	
	function ok(value, message) {
	  if (!value) fail(value, true, message, '==', assert.ok);
	}
	assert.ok = ok;
	
	// 5. The equality assertion tests shallow, coercive equality with
	// ==.
	// assert.equal(actual, expected, message_opt);
	
	assert.equal = function equal(actual, expected, message) {
	  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
	};
	
	// 6. The non-equality assertion tests for whether two objects are not equal
	// with != assert.notEqual(actual, expected, message_opt);
	
	assert.notEqual = function notEqual(actual, expected, message) {
	  if (actual == expected) {
	    fail(actual, expected, message, '!=', assert.notEqual);
	  }
	};
	
	// 7. The equivalence assertion tests a deep equality relation.
	// assert.deepEqual(actual, expected, message_opt);
	
	assert.deepEqual = function deepEqual(actual, expected, message) {
	  if (!_deepEqual(actual, expected, false)) {
	    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
	  }
	};
	
	assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
	  if (!_deepEqual(actual, expected, true)) {
	    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
	  }
	};
	
	function _deepEqual(actual, expected, strict, memos) {
	  // 7.1. All identical values are equivalent, as determined by ===.
	  if (actual === expected) {
	    return true;
	  } else if (isBuffer(actual) && isBuffer(expected)) {
	    return compare(actual, expected) === 0;
	
	  // 7.2. If the expected value is a Date object, the actual value is
	  // equivalent if it is also a Date object that refers to the same time.
	  } else if (util.isDate(actual) && util.isDate(expected)) {
	    return actual.getTime() === expected.getTime();
	
	  // 7.3 If the expected value is a RegExp object, the actual value is
	  // equivalent if it is also a RegExp object with the same source and
	  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
	  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
	    return actual.source === expected.source &&
	           actual.global === expected.global &&
	           actual.multiline === expected.multiline &&
	           actual.lastIndex === expected.lastIndex &&
	           actual.ignoreCase === expected.ignoreCase;
	
	  // 7.4. Other pairs that do not both pass typeof value == 'object',
	  // equivalence is determined by ==.
	  } else if ((actual === null || typeof actual !== 'object') &&
	             (expected === null || typeof expected !== 'object')) {
	    return strict ? actual === expected : actual == expected;
	
	  // If both values are instances of typed arrays, wrap their underlying
	  // ArrayBuffers in a Buffer each to increase performance
	  // This optimization requires the arrays to have the same type as checked by
	  // Object.prototype.toString (aka pToString). Never perform binary
	  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
	  // bit patterns are not identical.
	  } else if (isView(actual) && isView(expected) &&
	             pToString(actual) === pToString(expected) &&
	             !(actual instanceof Float32Array ||
	               actual instanceof Float64Array)) {
	    return compare(new Uint8Array(actual.buffer),
	                   new Uint8Array(expected.buffer)) === 0;
	
	  // 7.5 For all other Object pairs, including Array objects, equivalence is
	  // determined by having the same number of owned properties (as verified
	  // with Object.prototype.hasOwnProperty.call), the same set of keys
	  // (although not necessarily the same order), equivalent values for every
	  // corresponding key, and an identical 'prototype' property. Note: this
	  // accounts for both named and indexed properties on Arrays.
	  } else if (isBuffer(actual) !== isBuffer(expected)) {
	    return false;
	  } else {
	    memos = memos || {actual: [], expected: []};
	
	    var actualIndex = memos.actual.indexOf(actual);
	    if (actualIndex !== -1) {
	      if (actualIndex === memos.expected.indexOf(expected)) {
	        return true;
	      }
	    }
	
	    memos.actual.push(actual);
	    memos.expected.push(expected);
	
	    return objEquiv(actual, expected, strict, memos);
	  }
	}
	
	function isArguments(object) {
	  return Object.prototype.toString.call(object) == '[object Arguments]';
	}
	
	function objEquiv(a, b, strict, actualVisitedObjects) {
	  if (a === null || a === undefined || b === null || b === undefined)
	    return false;
	  // if one is a primitive, the other must be same
	  if (util.isPrimitive(a) || util.isPrimitive(b))
	    return a === b;
	  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
	    return false;
	  var aIsArgs = isArguments(a);
	  var bIsArgs = isArguments(b);
	  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
	    return false;
	  if (aIsArgs) {
	    a = pSlice.call(a);
	    b = pSlice.call(b);
	    return _deepEqual(a, b, strict);
	  }
	  var ka = objectKeys(a);
	  var kb = objectKeys(b);
	  var key, i;
	  // having the same number of owned properties (keys incorporates
	  // hasOwnProperty)
	  if (ka.length !== kb.length)
	    return false;
	  //the same set of keys (although not necessarily the same order),
	  ka.sort();
	  kb.sort();
	  //~~~cheap key test
	  for (i = ka.length - 1; i >= 0; i--) {
	    if (ka[i] !== kb[i])
	      return false;
	  }
	  //equivalent values for every corresponding key, and
	  //~~~possibly expensive deep test
	  for (i = ka.length - 1; i >= 0; i--) {
	    key = ka[i];
	    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
	      return false;
	  }
	  return true;
	}
	
	// 8. The non-equivalence assertion tests for any deep inequality.
	// assert.notDeepEqual(actual, expected, message_opt);
	
	assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
	  if (_deepEqual(actual, expected, false)) {
	    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
	  }
	};
	
	assert.notDeepStrictEqual = notDeepStrictEqual;
	function notDeepStrictEqual(actual, expected, message) {
	  if (_deepEqual(actual, expected, true)) {
	    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
	  }
	}
	
	
	// 9. The strict equality assertion tests strict equality, as determined by ===.
	// assert.strictEqual(actual, expected, message_opt);
	
	assert.strictEqual = function strictEqual(actual, expected, message) {
	  if (actual !== expected) {
	    fail(actual, expected, message, '===', assert.strictEqual);
	  }
	};
	
	// 10. The strict non-equality assertion tests for strict inequality, as
	// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);
	
	assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
	  if (actual === expected) {
	    fail(actual, expected, message, '!==', assert.notStrictEqual);
	  }
	};
	
	function expectedException(actual, expected) {
	  if (!actual || !expected) {
	    return false;
	  }
	
	  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
	    return expected.test(actual);
	  }
	
	  try {
	    if (actual instanceof expected) {
	      return true;
	    }
	  } catch (e) {
	    // Ignore.  The instanceof check doesn't work for arrow functions.
	  }
	
	  if (Error.isPrototypeOf(expected)) {
	    return false;
	  }
	
	  return expected.call({}, actual) === true;
	}
	
	function _tryBlock(block) {
	  var error;
	  try {
	    block();
	  } catch (e) {
	    error = e;
	  }
	  return error;
	}
	
	function _throws(shouldThrow, block, expected, message) {
	  var actual;
	
	  if (typeof block !== 'function') {
	    throw new TypeError('"block" argument must be a function');
	  }
	
	  if (typeof expected === 'string') {
	    message = expected;
	    expected = null;
	  }
	
	  actual = _tryBlock(block);
	
	  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
	            (message ? ' ' + message : '.');
	
	  if (shouldThrow && !actual) {
	    fail(actual, expected, 'Missing expected exception' + message);
	  }
	
	  var userProvidedMessage = typeof message === 'string';
	  var isUnwantedException = !shouldThrow && util.isError(actual);
	  var isUnexpectedException = !shouldThrow && actual && !expected;
	
	  if ((isUnwantedException &&
	      userProvidedMessage &&
	      expectedException(actual, expected)) ||
	      isUnexpectedException) {
	    fail(actual, expected, 'Got unwanted exception' + message);
	  }
	
	  if ((shouldThrow && actual && expected &&
	      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
	    throw actual;
	  }
	}
	
	// 11. Expected to throw an error:
	// assert.throws(block, Error_opt, message_opt);
	
	assert.throws = function(block, /*optional*/error, /*optional*/message) {
	  _throws(true, block, error, message);
	};
	
	// EXTENSION! This is annoying to write outside this module.
	assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
	  _throws(false, block, error, message);
	};
	
	assert.ifError = function(err) { if (err) throw err; };
	
	var objectKeys = Object.keys || function (obj) {
	  var keys = [];
	  for (var key in obj) {
	    if (hasOwn.call(obj, key)) keys.push(key);
	  }
	  return keys;
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	var formatRegExp = /%[sdj%]/g;
	exports.format = function(f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }
	
	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	};
	
	
	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	exports.deprecate = function(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function() {
	      return exports.deprecate(fn, msg).apply(this, arguments);
	    };
	  }
	
	  if (process.noDeprecation === true) {
	    return fn;
	  }
	
	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (process.throwDeprecation) {
	        throw new Error(msg);
	      } else if (process.traceDeprecation) {
	        console.trace(msg);
	      } else {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }
	
	  return deprecated;
	};
	
	
	var debugs = {};
	var debugEnviron;
	exports.debuglog = function(set) {
	  if (isUndefined(debugEnviron))
	    debugEnviron = process.env.NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = process.pid;
	      debugs[set] = function() {
	        var msg = exports.format.apply(exports, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function() {};
	    }
	  }
	  return debugs[set];
	};
	
	
	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    exports._extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}
	exports.inspect = inspect;
	
	
	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};
	
	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};
	
	
	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];
	
	  if (style) {
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}
	
	
	function stylizeNoColor(str, styleType) {
	  return str;
	}
	
	
	function arrayToHash(array) {
	  var hash = {};
	
	  array.forEach(function(val, idx) {
	    hash[val] = true;
	  });
	
	  return hash;
	}
	
	
	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== exports.inspect &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }
	
	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }
	
	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);
	
	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }
	
	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }
	
	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }
	
	  var base = '', array = false, braces = ['{', '}'];
	
	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }
	
	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }
	
	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }
	
	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }
	
	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }
	
	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }
	
	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }
	
	  ctx.seen.push(value);
	
	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }
	
	  ctx.seen.pop();
	
	  return reduceToSingleString(output, base, braces);
	}
	
	
	function formatPrimitive(ctx, value) {
	  if (isUndefined(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value))
	    return ctx.stylize('null', 'null');
	}
	
	
	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}
	
	
	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}
	
	
	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }
	
	  return name + ': ' + str;
	}
	
	
	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = output.reduce(function(prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf('\n') >= 0) numLinesEst++;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);
	
	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }
	
	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}
	
	
	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}
	exports.isArray = isArray;
	
	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;
	
	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;
	
	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;
	
	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;
	
	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;
	
	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;
	
	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;
	
	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;
	
	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;
	
	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;
	
	function isError(e) {
	  return isObject(e) &&
	      (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;
	
	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;
	
	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;
	
	exports.isBuffer = __webpack_require__(12);
	
	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}
	
	
	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}
	
	
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	              'Oct', 'Nov', 'Dec'];
	
	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()),
	              pad(d.getMinutes()),
	              pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}
	
	
	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function() {
	  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
	};
	
	
	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 *     prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = __webpack_require__(13);
	
	exports._extend = function(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;
	
	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	};
	
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(11)))

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	
	
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	
	
	
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;
	
	process.listeners = function (name) { return [] }
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }),
/* 12 */
/***/ (function(module, exports) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

/***/ }),
/* 13 */
/***/ (function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ }),
/* 14 */
/***/ (function(module, exports) {

	module.exports = {
	  identifier: "[a-zA-Z_]+[a-zA-Z0-9_]*",
	  integer: "-?(?:0|[1-9][0-9]*)",
	  qq_string: "\"(?:\\\\[\"bfnrt/\\\\]|\\\\u[a-fA-F0-9]{4}|[^\"\\\\])*\"",
	  q_string: "'(?:\\\\[\'bfnrt/\\\\]|\\\\u[a-fA-F0-9]{4}|[^\'\\\\])*'"
	};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	var grammar = __webpack_require__(16);
	var gparser = __webpack_require__(20);
	
	var Parser = function() {
	
	  var parser = new gparser.Parser();
	
	  var _parseError = parser.parseError;
	  parser.yy.parseError = function() {
	    if (parser.yy.ast) {
	      parser.yy.ast.initialize();
	    }
	    _parseError.apply(parser, arguments);
	  }
	
	  return parser;
	
	};
	
	Parser.grammar = grammar;
	module.exports = Parser;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	var dict = __webpack_require__(14);
	var fs = __webpack_require__(17);
	var grammar = {
	
	    lex: {
	
	        macros: {
	            esc: "\\\\",
	            int: dict.integer
	        },
	
	        rules: [
	            ["\\$", "return 'DOLLAR'"],
	            ["\\.\\.", "return 'DOT_DOT'"],
	            ["\\.", "return 'DOT'"],
	            ["\\*", "return 'STAR'"],
	            [dict.identifier, "return 'IDENTIFIER'"],
	            ["\\[", "return '['"],
	            ["\\]", "return ']'"],
	            [",", "return ','"],
	            ["({int})?\\:({int})?(\\:({int})?)?", "return 'ARRAY_SLICE'"],
	            ["{int}", "return 'INTEGER'"],
	            [dict.qq_string, "yytext = yytext.substr(1,yyleng-2); return 'QQ_STRING';"],
	            [dict.q_string, "yytext = yytext.substr(1,yyleng-2); return 'Q_STRING';"],
	            ["\\(.+?\\)(?=\\])", "return 'SCRIPT_EXPRESSION'"],
	            ["\\?\\(.+?\\)(?=\\])", "return 'FILTER_EXPRESSION'"]
	        ]
	    },
	
	    start: "JSON_PATH",
	
	    bnf: {
	
	        JSON_PATH: [
	                [ 'DOLLAR',                 'yy.ast.set({ expression: { type: "root", value: $1 } }); yy.ast.unshift(); return yy.ast.yield()' ],
	                [ 'DOLLAR PATH_COMPONENTS', 'yy.ast.set({ expression: { type: "root", value: $1 } }); yy.ast.unshift(); return yy.ast.yield()' ],
	                [ 'LEADING_CHILD_MEMBER_EXPRESSION',                 'yy.ast.unshift(); return yy.ast.yield()' ],
	                [ 'LEADING_CHILD_MEMBER_EXPRESSION PATH_COMPONENTS', 'yy.ast.set({ operation: "member", scope: "child", expression: { type: "identifier", value: $1 }}); yy.ast.unshift(); return yy.ast.yield()' ] ],
	
	        PATH_COMPONENTS: [
	                [ 'PATH_COMPONENT',                 '' ],
	                [ 'PATH_COMPONENTS PATH_COMPONENT', '' ] ],
	
	        PATH_COMPONENT: [
	                [ 'MEMBER_COMPONENT',    'yy.ast.set({ operation: "member" }); yy.ast.push()' ],
	                [ 'SUBSCRIPT_COMPONENT', 'yy.ast.set({ operation: "subscript" }); yy.ast.push() ' ] ],
	
	        MEMBER_COMPONENT: [
	                [ 'CHILD_MEMBER_COMPONENT',      'yy.ast.set({ scope: "child" })' ],
	                [ 'DESCENDANT_MEMBER_COMPONENT', 'yy.ast.set({ scope: "descendant" })' ] ],
	
	        CHILD_MEMBER_COMPONENT: [
	                [ 'DOT MEMBER_EXPRESSION', '' ] ],
	
	        LEADING_CHILD_MEMBER_EXPRESSION: [
	                [ 'MEMBER_EXPRESSION', 'yy.ast.set({ scope: "child", operation: "member" })' ] ],
	
	        DESCENDANT_MEMBER_COMPONENT: [
	                [ 'DOT_DOT MEMBER_EXPRESSION', '' ] ],
	
	        MEMBER_EXPRESSION: [
	                [ 'STAR',              'yy.ast.set({ expression: { type: "wildcard", value: $1 } })' ],
	                [ 'IDENTIFIER',        'yy.ast.set({ expression: { type: "identifier", value: $1 } })' ],
	                [ 'SCRIPT_EXPRESSION', 'yy.ast.set({ expression: { type: "script_expression", value: $1 } })' ],
	                [ 'INTEGER',           'yy.ast.set({ expression: { type: "numeric_literal", value: parseInt($1) } })' ],
	                [ 'END',               '' ] ],
	
	        SUBSCRIPT_COMPONENT: [
	                [ 'CHILD_SUBSCRIPT_COMPONENT',      'yy.ast.set({ scope: "child" })' ],
	                [ 'DESCENDANT_SUBSCRIPT_COMPONENT', 'yy.ast.set({ scope: "descendant" })' ] ],
	
	        CHILD_SUBSCRIPT_COMPONENT: [
	                [ '[ SUBSCRIPT ]', '' ] ],
	
	        DESCENDANT_SUBSCRIPT_COMPONENT: [
	                [ 'DOT_DOT [ SUBSCRIPT ]', '' ] ],
	
	        SUBSCRIPT: [
	                [ 'SUBSCRIPT_EXPRESSION', '' ],
	                [ 'SUBSCRIPT_EXPRESSION_LIST', '$1.length > 1? yy.ast.set({ expression: { type: "union", value: $1 } }) : $$ = $1' ] ],
	
	        SUBSCRIPT_EXPRESSION_LIST: [
	                [ 'SUBSCRIPT_EXPRESSION_LISTABLE', '$$ = [$1]'],
	                [ 'SUBSCRIPT_EXPRESSION_LIST , SUBSCRIPT_EXPRESSION_LISTABLE', '$$ = $1.concat($3)' ] ],
	
	        SUBSCRIPT_EXPRESSION_LISTABLE: [
	                [ 'INTEGER',           '$$ = { expression: { type: "numeric_literal", value: parseInt($1) } }; yy.ast.set($$)' ],
	                [ 'STRING_LITERAL',    '$$ = { expression: { type: "string_literal", value: $1 } }; yy.ast.set($$)' ],
	                [ 'ARRAY_SLICE',       '$$ = { expression: { type: "slice", value: $1 } }; yy.ast.set($$)' ] ],
	
	        SUBSCRIPT_EXPRESSION: [
	                [ 'STAR',              '$$ = { expression: { type: "wildcard", value: $1 } }; yy.ast.set($$)' ],
	                [ 'SCRIPT_EXPRESSION', '$$ = { expression: { type: "script_expression", value: $1 } }; yy.ast.set($$)' ],
	                [ 'FILTER_EXPRESSION', '$$ = { expression: { type: "filter_expression", value: $1 } }; yy.ast.set($$)' ] ],
	
	        STRING_LITERAL: [
	                [ 'QQ_STRING', "$$ = $1" ],
	                [ 'Q_STRING',  "$$ = $1" ] ]
	    }
	};
	if (fs.readFileSync) {
	  grammar.moduleInclude = fs.readFileSync(/*require.resolve*/(18));
	  grammar.actionInclude = fs.readFileSync(/*require.resolve*/(19));
	}
	
	module.exports = grammar;


/***/ }),
/* 17 */
/***/ (function(module, exports) {



/***/ }),
/* 18 */
/***/ (function(module, exports) {

	var _ast = {
	
	  initialize: function() {
	    this._nodes = [];
	    this._node = {};
	    this._stash = [];
	  },
	
	  set: function(props) {
	    for (var k in props) this._node[k] = props[k];
	    return this._node;
	  },
	
	  node: function(obj) {
	    if (arguments.length) this._node = obj;
	    return this._node;
	  },
	
	  push: function() {
	    this._nodes.push(this._node);
	    this._node = {};
	  },
	
	  unshift: function() {
	    this._nodes.unshift(this._node);
	    this._node = {};
	  },
	
	  yield: function() {
	    var _nodes = this._nodes;
	    this.initialize();
	    return _nodes;
	  }
	};


/***/ }),
/* 19 */
/***/ (function(module, exports) {

	if (!yy.ast) {
	    yy.ast = _ast;
	    _ast.initialize();
	}


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, module) {/* parser generated by jison 0.4.13 */
	/*
	  Returns a Parser object of the following structure:
	
	  Parser: {
	    yy: {}
	  }
	
	  Parser.prototype: {
	    yy: {},
	    trace: function(),
	    symbols_: {associative list: name ==> number},
	    terminals_: {associative list: number ==> name},
	    productions_: [...],
	    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
	    table: [...],
	    defaultActions: {...},
	    parseError: function(str, hash),
	    parse: function(input),
	
	    lexer: {
	        EOF: 1,
	        parseError: function(str, hash),
	        setInput: function(input),
	        input: function(),
	        unput: function(str),
	        more: function(),
	        less: function(n),
	        pastInput: function(),
	        upcomingInput: function(),
	        showPosition: function(),
	        test_match: function(regex_match_array, rule_index),
	        next: function(),
	        lex: function(),
	        begin: function(condition),
	        popState: function(),
	        _currentRules: function(),
	        topState: function(),
	        pushState: function(condition),
	
	        options: {
	            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
	            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
	            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
	        },
	
	        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
	        rules: [...],
	        conditions: {associative list: name ==> set},
	    }
	  }
	
	
	  token location info (@$, _$, etc.): {
	    first_line: n,
	    last_line: n,
	    first_column: n,
	    last_column: n,
	    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
	  }
	
	
	  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
	    text:        (matched text)
	    token:       (the produced terminal token, if any)
	    line:        (yylineno)
	  }
	  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
	    loc:         (yylloc)
	    expected:    (string describing the set of expected tokens)
	    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
	  }
	*/
	var parser = (function(){
	var parser = {trace: function trace() { },
	yy: {},
	symbols_: {"error":2,"JSON_PATH":3,"DOLLAR":4,"PATH_COMPONENTS":5,"LEADING_CHILD_MEMBER_EXPRESSION":6,"PATH_COMPONENT":7,"MEMBER_COMPONENT":8,"SUBSCRIPT_COMPONENT":9,"CHILD_MEMBER_COMPONENT":10,"DESCENDANT_MEMBER_COMPONENT":11,"DOT":12,"MEMBER_EXPRESSION":13,"DOT_DOT":14,"STAR":15,"IDENTIFIER":16,"SCRIPT_EXPRESSION":17,"INTEGER":18,"END":19,"CHILD_SUBSCRIPT_COMPONENT":20,"DESCENDANT_SUBSCRIPT_COMPONENT":21,"[":22,"SUBSCRIPT":23,"]":24,"SUBSCRIPT_EXPRESSION":25,"SUBSCRIPT_EXPRESSION_LIST":26,"SUBSCRIPT_EXPRESSION_LISTABLE":27,",":28,"STRING_LITERAL":29,"ARRAY_SLICE":30,"FILTER_EXPRESSION":31,"QQ_STRING":32,"Q_STRING":33,"$accept":0,"$end":1},
	terminals_: {2:"error",4:"DOLLAR",12:"DOT",14:"DOT_DOT",15:"STAR",16:"IDENTIFIER",17:"SCRIPT_EXPRESSION",18:"INTEGER",19:"END",22:"[",24:"]",28:",",30:"ARRAY_SLICE",31:"FILTER_EXPRESSION",32:"QQ_STRING",33:"Q_STRING"},
	productions_: [0,[3,1],[3,2],[3,1],[3,2],[5,1],[5,2],[7,1],[7,1],[8,1],[8,1],[10,2],[6,1],[11,2],[13,1],[13,1],[13,1],[13,1],[13,1],[9,1],[9,1],[20,3],[21,4],[23,1],[23,1],[26,1],[26,3],[27,1],[27,1],[27,1],[25,1],[25,1],[25,1],[29,1],[29,1]],
	performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */
	/**/) {
	/* this == yyval */
	if (!yy.ast) {
	    yy.ast = _ast;
	    _ast.initialize();
	}
	
	var $0 = $$.length - 1;
	switch (yystate) {
	case 1:yy.ast.set({ expression: { type: "root", value: $$[$0] } }); yy.ast.unshift(); return yy.ast.yield()
	break;
	case 2:yy.ast.set({ expression: { type: "root", value: $$[$0-1] } }); yy.ast.unshift(); return yy.ast.yield()
	break;
	case 3:yy.ast.unshift(); return yy.ast.yield()
	break;
	case 4:yy.ast.set({ operation: "member", scope: "child", expression: { type: "identifier", value: $$[$0-1] }}); yy.ast.unshift(); return yy.ast.yield()
	break;
	case 5:
	break;
	case 6:
	break;
	case 7:yy.ast.set({ operation: "member" }); yy.ast.push()
	break;
	case 8:yy.ast.set({ operation: "subscript" }); yy.ast.push() 
	break;
	case 9:yy.ast.set({ scope: "child" })
	break;
	case 10:yy.ast.set({ scope: "descendant" })
	break;
	case 11:
	break;
	case 12:yy.ast.set({ scope: "child", operation: "member" })
	break;
	case 13:
	break;
	case 14:yy.ast.set({ expression: { type: "wildcard", value: $$[$0] } })
	break;
	case 15:yy.ast.set({ expression: { type: "identifier", value: $$[$0] } })
	break;
	case 16:yy.ast.set({ expression: { type: "script_expression", value: $$[$0] } })
	break;
	case 17:yy.ast.set({ expression: { type: "numeric_literal", value: parseInt($$[$0]) } })
	break;
	case 18:
	break;
	case 19:yy.ast.set({ scope: "child" })
	break;
	case 20:yy.ast.set({ scope: "descendant" })
	break;
	case 21:
	break;
	case 22:
	break;
	case 23:
	break;
	case 24:$$[$0].length > 1? yy.ast.set({ expression: { type: "union", value: $$[$0] } }) : this.$ = $$[$0]
	break;
	case 25:this.$ = [$$[$0]]
	break;
	case 26:this.$ = $$[$0-2].concat($$[$0])
	break;
	case 27:this.$ = { expression: { type: "numeric_literal", value: parseInt($$[$0]) } }; yy.ast.set(this.$)
	break;
	case 28:this.$ = { expression: { type: "string_literal", value: $$[$0] } }; yy.ast.set(this.$)
	break;
	case 29:this.$ = { expression: { type: "slice", value: $$[$0] } }; yy.ast.set(this.$)
	break;
	case 30:this.$ = { expression: { type: "wildcard", value: $$[$0] } }; yy.ast.set(this.$)
	break;
	case 31:this.$ = { expression: { type: "script_expression", value: $$[$0] } }; yy.ast.set(this.$)
	break;
	case 32:this.$ = { expression: { type: "filter_expression", value: $$[$0] } }; yy.ast.set(this.$)
	break;
	case 33:this.$ = $$[$0]
	break;
	case 34:this.$ = $$[$0]
	break;
	}
	},
	table: [{3:1,4:[1,2],6:3,13:4,15:[1,5],16:[1,6],17:[1,7],18:[1,8],19:[1,9]},{1:[3]},{1:[2,1],5:10,7:11,8:12,9:13,10:14,11:15,12:[1,18],14:[1,19],20:16,21:17,22:[1,20]},{1:[2,3],5:21,7:11,8:12,9:13,10:14,11:15,12:[1,18],14:[1,19],20:16,21:17,22:[1,20]},{1:[2,12],12:[2,12],14:[2,12],22:[2,12]},{1:[2,14],12:[2,14],14:[2,14],22:[2,14]},{1:[2,15],12:[2,15],14:[2,15],22:[2,15]},{1:[2,16],12:[2,16],14:[2,16],22:[2,16]},{1:[2,17],12:[2,17],14:[2,17],22:[2,17]},{1:[2,18],12:[2,18],14:[2,18],22:[2,18]},{1:[2,2],7:22,8:12,9:13,10:14,11:15,12:[1,18],14:[1,19],20:16,21:17,22:[1,20]},{1:[2,5],12:[2,5],14:[2,5],22:[2,5]},{1:[2,7],12:[2,7],14:[2,7],22:[2,7]},{1:[2,8],12:[2,8],14:[2,8],22:[2,8]},{1:[2,9],12:[2,9],14:[2,9],22:[2,9]},{1:[2,10],12:[2,10],14:[2,10],22:[2,10]},{1:[2,19],12:[2,19],14:[2,19],22:[2,19]},{1:[2,20],12:[2,20],14:[2,20],22:[2,20]},{13:23,15:[1,5],16:[1,6],17:[1,7],18:[1,8],19:[1,9]},{13:24,15:[1,5],16:[1,6],17:[1,7],18:[1,8],19:[1,9],22:[1,25]},{15:[1,29],17:[1,30],18:[1,33],23:26,25:27,26:28,27:32,29:34,30:[1,35],31:[1,31],32:[1,36],33:[1,37]},{1:[2,4],7:22,8:12,9:13,10:14,11:15,12:[1,18],14:[1,19],20:16,21:17,22:[1,20]},{1:[2,6],12:[2,6],14:[2,6],22:[2,6]},{1:[2,11],12:[2,11],14:[2,11],22:[2,11]},{1:[2,13],12:[2,13],14:[2,13],22:[2,13]},{15:[1,29],17:[1,30],18:[1,33],23:38,25:27,26:28,27:32,29:34,30:[1,35],31:[1,31],32:[1,36],33:[1,37]},{24:[1,39]},{24:[2,23]},{24:[2,24],28:[1,40]},{24:[2,30]},{24:[2,31]},{24:[2,32]},{24:[2,25],28:[2,25]},{24:[2,27],28:[2,27]},{24:[2,28],28:[2,28]},{24:[2,29],28:[2,29]},{24:[2,33],28:[2,33]},{24:[2,34],28:[2,34]},{24:[1,41]},{1:[2,21],12:[2,21],14:[2,21],22:[2,21]},{18:[1,33],27:42,29:34,30:[1,35],32:[1,36],33:[1,37]},{1:[2,22],12:[2,22],14:[2,22],22:[2,22]},{24:[2,26],28:[2,26]}],
	defaultActions: {27:[2,23],29:[2,30],30:[2,31],31:[2,32]},
	parseError: function parseError(str, hash) {
	    if (hash.recoverable) {
	        this.trace(str);
	    } else {
	        throw new Error(str);
	    }
	},
	parse: function parse(input) {
	    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
	    var args = lstack.slice.call(arguments, 1);
	    this.lexer.setInput(input);
	    this.lexer.yy = this.yy;
	    this.yy.lexer = this.lexer;
	    this.yy.parser = this;
	    if (typeof this.lexer.yylloc == 'undefined') {
	        this.lexer.yylloc = {};
	    }
	    var yyloc = this.lexer.yylloc;
	    lstack.push(yyloc);
	    var ranges = this.lexer.options && this.lexer.options.ranges;
	    if (typeof this.yy.parseError === 'function') {
	        this.parseError = this.yy.parseError;
	    } else {
	        this.parseError = Object.getPrototypeOf(this).parseError;
	    }
	    function popStack(n) {
	        stack.length = stack.length - 2 * n;
	        vstack.length = vstack.length - n;
	        lstack.length = lstack.length - n;
	    }
	    function lex() {
	        var token;
	        token = self.lexer.lex() || EOF;
	        if (typeof token !== 'number') {
	            token = self.symbols_[token] || token;
	        }
	        return token;
	    }
	    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
	    while (true) {
	        state = stack[stack.length - 1];
	        if (this.defaultActions[state]) {
	            action = this.defaultActions[state];
	        } else {
	            if (symbol === null || typeof symbol == 'undefined') {
	                symbol = lex();
	            }
	            action = table[state] && table[state][symbol];
	        }
	                    if (typeof action === 'undefined' || !action.length || !action[0]) {
	                var errStr = '';
	                expected = [];
	                for (p in table[state]) {
	                    if (this.terminals_[p] && p > TERROR) {
	                        expected.push('\'' + this.terminals_[p] + '\'');
	                    }
	                }
	                if (this.lexer.showPosition) {
	                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + this.lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
	                } else {
	                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
	                }
	                this.parseError(errStr, {
	                    text: this.lexer.match,
	                    token: this.terminals_[symbol] || symbol,
	                    line: this.lexer.yylineno,
	                    loc: yyloc,
	                    expected: expected
	                });
	            }
	        if (action[0] instanceof Array && action.length > 1) {
	            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
	        }
	        switch (action[0]) {
	        case 1:
	            stack.push(symbol);
	            vstack.push(this.lexer.yytext);
	            lstack.push(this.lexer.yylloc);
	            stack.push(action[1]);
	            symbol = null;
	            if (!preErrorSymbol) {
	                yyleng = this.lexer.yyleng;
	                yytext = this.lexer.yytext;
	                yylineno = this.lexer.yylineno;
	                yyloc = this.lexer.yylloc;
	                if (recovering > 0) {
	                    recovering--;
	                }
	            } else {
	                symbol = preErrorSymbol;
	                preErrorSymbol = null;
	            }
	            break;
	        case 2:
	            len = this.productions_[action[1]][1];
	            yyval.$ = vstack[vstack.length - len];
	            yyval._$ = {
	                first_line: lstack[lstack.length - (len || 1)].first_line,
	                last_line: lstack[lstack.length - 1].last_line,
	                first_column: lstack[lstack.length - (len || 1)].first_column,
	                last_column: lstack[lstack.length - 1].last_column
	            };
	            if (ranges) {
	                yyval._$.range = [
	                    lstack[lstack.length - (len || 1)].range[0],
	                    lstack[lstack.length - 1].range[1]
	                ];
	            }
	            r = this.performAction.apply(yyval, [
	                yytext,
	                yyleng,
	                yylineno,
	                this.yy,
	                action[1],
	                vstack,
	                lstack
	            ].concat(args));
	            if (typeof r !== 'undefined') {
	                return r;
	            }
	            if (len) {
	                stack = stack.slice(0, -1 * len * 2);
	                vstack = vstack.slice(0, -1 * len);
	                lstack = lstack.slice(0, -1 * len);
	            }
	            stack.push(this.productions_[action[1]][0]);
	            vstack.push(yyval.$);
	            lstack.push(yyval._$);
	            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
	            stack.push(newState);
	            break;
	        case 3:
	            return true;
	        }
	    }
	    return true;
	}};
	var _ast = {
	
	  initialize: function() {
	    this._nodes = [];
	    this._node = {};
	    this._stash = [];
	  },
	
	  set: function(props) {
	    for (var k in props) this._node[k] = props[k];
	    return this._node;
	  },
	
	  node: function(obj) {
	    if (arguments.length) this._node = obj;
	    return this._node;
	  },
	
	  push: function() {
	    this._nodes.push(this._node);
	    this._node = {};
	  },
	
	  unshift: function() {
	    this._nodes.unshift(this._node);
	    this._node = {};
	  },
	
	  yield: function() {
	    var _nodes = this._nodes;
	    this.initialize();
	    return _nodes;
	  }
	};
	/* generated by jison-lex 0.2.1 */
	var lexer = (function(){
	var lexer = {
	
	EOF:1,
	
	parseError:function parseError(str, hash) {
	        if (this.yy.parser) {
	            this.yy.parser.parseError(str, hash);
	        } else {
	            throw new Error(str);
	        }
	    },
	
	// resets the lexer, sets new input
	setInput:function (input) {
	        this._input = input;
	        this._more = this._backtrack = this.done = false;
	        this.yylineno = this.yyleng = 0;
	        this.yytext = this.matched = this.match = '';
	        this.conditionStack = ['INITIAL'];
	        this.yylloc = {
	            first_line: 1,
	            first_column: 0,
	            last_line: 1,
	            last_column: 0
	        };
	        if (this.options.ranges) {
	            this.yylloc.range = [0,0];
	        }
	        this.offset = 0;
	        return this;
	    },
	
	// consumes and returns one char from the input
	input:function () {
	        var ch = this._input[0];
	        this.yytext += ch;
	        this.yyleng++;
	        this.offset++;
	        this.match += ch;
	        this.matched += ch;
	        var lines = ch.match(/(?:\r\n?|\n).*/g);
	        if (lines) {
	            this.yylineno++;
	            this.yylloc.last_line++;
	        } else {
	            this.yylloc.last_column++;
	        }
	        if (this.options.ranges) {
	            this.yylloc.range[1]++;
	        }
	
	        this._input = this._input.slice(1);
	        return ch;
	    },
	
	// unshifts one char (or a string) into the input
	unput:function (ch) {
	        var len = ch.length;
	        var lines = ch.split(/(?:\r\n?|\n)/g);
	
	        this._input = ch + this._input;
	        this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
	        //this.yyleng -= len;
	        this.offset -= len;
	        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
	        this.match = this.match.substr(0, this.match.length - 1);
	        this.matched = this.matched.substr(0, this.matched.length - 1);
	
	        if (lines.length - 1) {
	            this.yylineno -= lines.length - 1;
	        }
	        var r = this.yylloc.range;
	
	        this.yylloc = {
	            first_line: this.yylloc.first_line,
	            last_line: this.yylineno + 1,
	            first_column: this.yylloc.first_column,
	            last_column: lines ?
	                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
	                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
	              this.yylloc.first_column - len
	        };
	
	        if (this.options.ranges) {
	            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
	        }
	        this.yyleng = this.yytext.length;
	        return this;
	    },
	
	// When called from action, caches matched text and appends it on next action
	more:function () {
	        this._more = true;
	        return this;
	    },
	
	// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
	reject:function () {
	        if (this.options.backtrack_lexer) {
	            this._backtrack = true;
	        } else {
	            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
	                text: "",
	                token: null,
	                line: this.yylineno
	            });
	
	        }
	        return this;
	    },
	
	// retain first n characters of the match
	less:function (n) {
	        this.unput(this.match.slice(n));
	    },
	
	// displays already matched input, i.e. for error messages
	pastInput:function () {
	        var past = this.matched.substr(0, this.matched.length - this.match.length);
	        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
	    },
	
	// displays upcoming input, i.e. for error messages
	upcomingInput:function () {
	        var next = this.match;
	        if (next.length < 20) {
	            next += this._input.substr(0, 20-next.length);
	        }
	        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
	    },
	
	// displays the character position where the lexing error occurred, i.e. for error messages
	showPosition:function () {
	        var pre = this.pastInput();
	        var c = new Array(pre.length + 1).join("-");
	        return pre + this.upcomingInput() + "\n" + c + "^";
	    },
	
	// test the lexed token: return FALSE when not a match, otherwise return token
	test_match:function (match, indexed_rule) {
	        var token,
	            lines,
	            backup;
	
	        if (this.options.backtrack_lexer) {
	            // save context
	            backup = {
	                yylineno: this.yylineno,
	                yylloc: {
	                    first_line: this.yylloc.first_line,
	                    last_line: this.last_line,
	                    first_column: this.yylloc.first_column,
	                    last_column: this.yylloc.last_column
	                },
	                yytext: this.yytext,
	                match: this.match,
	                matches: this.matches,
	                matched: this.matched,
	                yyleng: this.yyleng,
	                offset: this.offset,
	                _more: this._more,
	                _input: this._input,
	                yy: this.yy,
	                conditionStack: this.conditionStack.slice(0),
	                done: this.done
	            };
	            if (this.options.ranges) {
	                backup.yylloc.range = this.yylloc.range.slice(0);
	            }
	        }
	
	        lines = match[0].match(/(?:\r\n?|\n).*/g);
	        if (lines) {
	            this.yylineno += lines.length;
	        }
	        this.yylloc = {
	            first_line: this.yylloc.last_line,
	            last_line: this.yylineno + 1,
	            first_column: this.yylloc.last_column,
	            last_column: lines ?
	                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
	                         this.yylloc.last_column + match[0].length
	        };
	        this.yytext += match[0];
	        this.match += match[0];
	        this.matches = match;
	        this.yyleng = this.yytext.length;
	        if (this.options.ranges) {
	            this.yylloc.range = [this.offset, this.offset += this.yyleng];
	        }
	        this._more = false;
	        this._backtrack = false;
	        this._input = this._input.slice(match[0].length);
	        this.matched += match[0];
	        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
	        if (this.done && this._input) {
	            this.done = false;
	        }
	        if (token) {
	            return token;
	        } else if (this._backtrack) {
	            // recover context
	            for (var k in backup) {
	                this[k] = backup[k];
	            }
	            return false; // rule action called reject() implying the next rule should be tested instead.
	        }
	        return false;
	    },
	
	// return next match in input
	next:function () {
	        if (this.done) {
	            return this.EOF;
	        }
	        if (!this._input) {
	            this.done = true;
	        }
	
	        var token,
	            match,
	            tempMatch,
	            index;
	        if (!this._more) {
	            this.yytext = '';
	            this.match = '';
	        }
	        var rules = this._currentRules();
	        for (var i = 0; i < rules.length; i++) {
	            tempMatch = this._input.match(this.rules[rules[i]]);
	            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
	                match = tempMatch;
	                index = i;
	                if (this.options.backtrack_lexer) {
	                    token = this.test_match(tempMatch, rules[i]);
	                    if (token !== false) {
	                        return token;
	                    } else if (this._backtrack) {
	                        match = false;
	                        continue; // rule action called reject() implying a rule MISmatch.
	                    } else {
	                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
	                        return false;
	                    }
	                } else if (!this.options.flex) {
	                    break;
	                }
	            }
	        }
	        if (match) {
	            token = this.test_match(match, rules[index]);
	            if (token !== false) {
	                return token;
	            }
	            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
	            return false;
	        }
	        if (this._input === "") {
	            return this.EOF;
	        } else {
	            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
	                text: "",
	                token: null,
	                line: this.yylineno
	            });
	        }
	    },
	
	// return next match that has a token
	lex:function lex() {
	        var r = this.next();
	        if (r) {
	            return r;
	        } else {
	            return this.lex();
	        }
	    },
	
	// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
	begin:function begin(condition) {
	        this.conditionStack.push(condition);
	    },
	
	// pop the previously active lexer condition state off the condition stack
	popState:function popState() {
	        var n = this.conditionStack.length - 1;
	        if (n > 0) {
	            return this.conditionStack.pop();
	        } else {
	            return this.conditionStack[0];
	        }
	    },
	
	// produce the lexer rule set which is active for the currently active lexer condition state
	_currentRules:function _currentRules() {
	        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
	            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
	        } else {
	            return this.conditions["INITIAL"].rules;
	        }
	    },
	
	// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
	topState:function topState(n) {
	        n = this.conditionStack.length - 1 - Math.abs(n || 0);
	        if (n >= 0) {
	            return this.conditionStack[n];
	        } else {
	            return "INITIAL";
	        }
	    },
	
	// alias for begin(condition)
	pushState:function pushState(condition) {
	        this.begin(condition);
	    },
	
	// return the number of states currently on the stack
	stateStackSize:function stateStackSize() {
	        return this.conditionStack.length;
	    },
	options: {},
	performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START
	/**/) {
	
	var YYSTATE=YY_START;
	switch($avoiding_name_collisions) {
	case 0:return 4
	break;
	case 1:return 14
	break;
	case 2:return 12
	break;
	case 3:return 15
	break;
	case 4:return 16
	break;
	case 5:return 22
	break;
	case 6:return 24
	break;
	case 7:return 28
	break;
	case 8:return 30
	break;
	case 9:return 18
	break;
	case 10:yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2); return 32;
	break;
	case 11:yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2); return 33;
	break;
	case 12:return 17
	break;
	case 13:return 31
	break;
	}
	},
	rules: [/^(?:\$)/,/^(?:\.\.)/,/^(?:\.)/,/^(?:\*)/,/^(?:[a-zA-Z_]+[a-zA-Z0-9_]*)/,/^(?:\[)/,/^(?:\])/,/^(?:,)/,/^(?:((-?(?:0|[1-9][0-9]*)))?\:((-?(?:0|[1-9][0-9]*)))?(\:((-?(?:0|[1-9][0-9]*)))?)?)/,/^(?:(-?(?:0|[1-9][0-9]*)))/,/^(?:"(?:\\["bfnrt/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*")/,/^(?:'(?:\\['bfnrt/\\]|\\u[a-fA-F0-9]{4}|[^'\\])*')/,/^(?:\(.+?\)(?=\]))/,/^(?:\?\(.+?\)(?=\]))/],
	conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13],"inclusive":true}}
	};
	return lexer;
	})();
	parser.lexer = lexer;
	function Parser () {
	  this.yy = {};
	}
	Parser.prototype = parser;parser.Parser = Parser;
	return new Parser;
	})();
	
	
	if (true) {
	exports.parser = parser;
	exports.Parser = parser.Parser;
	exports.parse = function () { return parser.parse.apply(parser, arguments); };
	exports.main = function commonjsMain(args) {
	    if (!args[1]) {
	        console.log('Usage: '+args[0]+' FILE');
	        process.exit(1);
	    }
	    var source = __webpack_require__(17).readFileSync(__webpack_require__(22).normalize(args[1]), "utf8");
	    return exports.parser.parse(source);
	};
	if (typeof module !== 'undefined' && __webpack_require__.c[0] === module) {
	  exports.main(process.argv.slice(1));
	}
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11), __webpack_require__(21)(module)))

/***/ }),
/* 21 */
/***/ (function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	// resolves . and .. elements in a path array with directory names there
	// must be no slashes, empty elements, or device names (c:\) in the array
	// (so also no leading and trailing slashes - it does not distinguish
	// relative and absolute paths)
	function normalizeArray(parts, allowAboveRoot) {
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = parts.length - 1; i >= 0; i--) {
	    var last = parts[i];
	    if (last === '.') {
	      parts.splice(i, 1);
	    } else if (last === '..') {
	      parts.splice(i, 1);
	      up++;
	    } else if (up) {
	      parts.splice(i, 1);
	      up--;
	    }
	  }
	
	  // if the path is allowed to go above the root, restore leading ..s
	  if (allowAboveRoot) {
	    for (; up--; up) {
	      parts.unshift('..');
	    }
	  }
	
	  return parts;
	}
	
	// Split a filename into [root, dir, basename, ext], unix version
	// 'root' is just a slash, or nothing.
	var splitPathRe =
	    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
	var splitPath = function(filename) {
	  return splitPathRe.exec(filename).slice(1);
	};
	
	// path.resolve([from ...], to)
	// posix version
	exports.resolve = function() {
	  var resolvedPath = '',
	      resolvedAbsolute = false;
	
	  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	    var path = (i >= 0) ? arguments[i] : process.cwd();
	
	    // Skip empty and invalid entries
	    if (typeof path !== 'string') {
	      throw new TypeError('Arguments to path.resolve must be strings');
	    } else if (!path) {
	      continue;
	    }
	
	    resolvedPath = path + '/' + resolvedPath;
	    resolvedAbsolute = path.charAt(0) === '/';
	  }
	
	  // At this point the path should be resolved to a full absolute path, but
	  // handle relative paths to be safe (might happen when process.cwd() fails)
	
	  // Normalize the path
	  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
	    return !!p;
	  }), !resolvedAbsolute).join('/');
	
	  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
	};
	
	// path.normalize(path)
	// posix version
	exports.normalize = function(path) {
	  var isAbsolute = exports.isAbsolute(path),
	      trailingSlash = substr(path, -1) === '/';
	
	  // Normalize the path
	  path = normalizeArray(filter(path.split('/'), function(p) {
	    return !!p;
	  }), !isAbsolute).join('/');
	
	  if (!path && !isAbsolute) {
	    path = '.';
	  }
	  if (path && trailingSlash) {
	    path += '/';
	  }
	
	  return (isAbsolute ? '/' : '') + path;
	};
	
	// posix version
	exports.isAbsolute = function(path) {
	  return path.charAt(0) === '/';
	};
	
	// posix version
	exports.join = function() {
	  var paths = Array.prototype.slice.call(arguments, 0);
	  return exports.normalize(filter(paths, function(p, index) {
	    if (typeof p !== 'string') {
	      throw new TypeError('Arguments to path.join must be strings');
	    }
	    return p;
	  }).join('/'));
	};
	
	
	// path.relative(from, to)
	// posix version
	exports.relative = function(from, to) {
	  from = exports.resolve(from).substr(1);
	  to = exports.resolve(to).substr(1);
	
	  function trim(arr) {
	    var start = 0;
	    for (; start < arr.length; start++) {
	      if (arr[start] !== '') break;
	    }
	
	    var end = arr.length - 1;
	    for (; end >= 0; end--) {
	      if (arr[end] !== '') break;
	    }
	
	    if (start > end) return [];
	    return arr.slice(start, end - start + 1);
	  }
	
	  var fromParts = trim(from.split('/'));
	  var toParts = trim(to.split('/'));
	
	  var length = Math.min(fromParts.length, toParts.length);
	  var samePartsLength = length;
	  for (var i = 0; i < length; i++) {
	    if (fromParts[i] !== toParts[i]) {
	      samePartsLength = i;
	      break;
	    }
	  }
	
	  var outputParts = [];
	  for (var i = samePartsLength; i < fromParts.length; i++) {
	    outputParts.push('..');
	  }
	
	  outputParts = outputParts.concat(toParts.slice(samePartsLength));
	
	  return outputParts.join('/');
	};
	
	exports.sep = '/';
	exports.delimiter = ':';
	
	exports.dirname = function(path) {
	  var result = splitPath(path),
	      root = result[0],
	      dir = result[1];
	
	  if (!root && !dir) {
	    // No dirname whatsoever
	    return '.';
	  }
	
	  if (dir) {
	    // It has a dirname, strip trailing slash
	    dir = dir.substr(0, dir.length - 1);
	  }
	
	  return root + dir;
	};
	
	
	exports.basename = function(path, ext) {
	  var f = splitPath(path)[2];
	  // TODO: make this comparison case-insensitive on windows?
	  if (ext && f.substr(-1 * ext.length) === ext) {
	    f = f.substr(0, f.length - ext.length);
	  }
	  return f;
	};
	
	
	exports.extname = function(path) {
	  return splitPath(path)[3];
	};
	
	function filter (xs, f) {
	    if (xs.filter) return xs.filter(f);
	    var res = [];
	    for (var i = 0; i < xs.length; i++) {
	        if (f(xs[i], i, xs)) res.push(xs[i]);
	    }
	    return res;
	}
	
	// String.prototype.substr - negative index don't work in IE8
	var substr = 'ab'.substr(-1) === 'b'
	    ? function (str, start, len) { return str.substr(start, len) }
	    : function (str, start, len) {
	        if (start < 0) start = str.length + start;
	        return str.substr(start, len);
	    }
	;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	var aesprim = __webpack_require__(24);
	var slice = __webpack_require__(25);
	var _evaluate = __webpack_require__(26);
	var _uniq = __webpack_require__(41).uniq;
	
	var Handlers = function() {
	  return this.initialize.apply(this, arguments);
	}
	
	Handlers.prototype.initialize = function() {
	  this.traverse = traverser(true);
	  this.descend = traverser();
	}
	
	Handlers.prototype.keys = Object.keys;
	
	Handlers.prototype.resolve = function(component) {
	
	  var key = [ component.operation, component.scope, component.expression.type ].join('-');
	  var method = this._fns[key];
	
	  if (!method) throw new Error("couldn't resolve key: " + key);
	  return method.bind(this);
	};
	
	Handlers.prototype.register = function(key, handler) {
	
	  if (!handler instanceof Function) {
	    throw new Error("handler must be a function");
	  }
	
	  this._fns[key] = handler;
	};
	
	Handlers.prototype._fns = {
	
	  'member-child-identifier': function(component, partial) {
	    var key = component.expression.value;
	    var value = partial.value;
	    if (value instanceof Object && key in value) {
	      return [ { value: value[key], path: partial.path.concat(key) } ]
	    }
	  },
	
	  'member-descendant-identifier':
	    _traverse(function(key, value, ref) { return key == ref }),
	
	  'subscript-child-numeric_literal':
	    _descend(function(key, value, ref) { return key === ref }),
	
	  'member-child-numeric_literal':
	    _descend(function(key, value, ref) { return String(key) === String(ref) }),
	
	  'subscript-descendant-numeric_literal':
	    _traverse(function(key, value, ref) { return key === ref }),
	
	  'member-child-wildcard':
	    _descend(function() { return true }),
	
	  'member-descendant-wildcard':
	    _traverse(function() { return true }),
	
	  'subscript-descendant-wildcard':
	    _traverse(function() { return true }),
	
	  'subscript-child-wildcard':
	    _descend(function() { return true }),
	
	  'subscript-child-slice': function(component, partial) {
	    if (is_array(partial.value)) {
	      var args = component.expression.value.split(':').map(_parse_nullable_int);
	      var values = partial.value.map(function(v, i) { return { value: v, path: partial.path.concat(i) } });
	      return slice.apply(null, [values].concat(args));
	    }
	  },
	
	  'subscript-child-union': function(component, partial) {
	    var results = [];
	    component.expression.value.forEach(function(component) {
	      var _component = { operation: 'subscript', scope: 'child', expression: component.expression };
	      var handler = this.resolve(_component);
	      var _results = handler(_component, partial);
	      if (_results) {
	        results = results.concat(_results);
	      }
	    }, this);
	
	    return unique(results);
	  },
	
	  'subscript-descendant-union': function(component, partial, count) {
	
	    var jp = __webpack_require__(7);
	    var self = this;
	
	    var results = [];
	    var nodes = jp.nodes(partial, '$..*').slice(1);
	
	    nodes.forEach(function(node) {
	      if (results.length >= count) return;
	      component.expression.value.forEach(function(component) {
	        var _component = { operation: 'subscript', scope: 'child', expression: component.expression };
	        var handler = self.resolve(_component);
	        var _results = handler(_component, node);
	        results = results.concat(_results);
	      });
	    });
	
	    return unique(results);
	  },
	
	  'subscript-child-filter_expression': function(component, partial, count) {
	
	    // slice out the expression from ?(expression)
	    var src = component.expression.value.slice(2, -1);
	    var ast = aesprim.parse(src).body[0].expression;
	
	    var passable = function(key, value) {
	      return evaluate(ast, { '@': value });
	    }
	
	    return this.descend(partial, null, passable, count);
	
	  },
	
	  'subscript-descendant-filter_expression': function(component, partial, count) {
	
	    // slice out the expression from ?(expression)
	    var src = component.expression.value.slice(2, -1);
	    var ast = aesprim.parse(src).body[0].expression;
	
	    var passable = function(key, value) {
	      return evaluate(ast, { '@': value });
	    }
	
	    return this.traverse(partial, null, passable, count);
	  },
	
	  'subscript-child-script_expression': function(component, partial) {
	    var exp = component.expression.value.slice(1, -1);
	    return eval_recurse(partial, exp, '$[{{value}}]');
	  },
	
	  'member-child-script_expression': function(component, partial) {
	    var exp = component.expression.value.slice(1, -1);
	    return eval_recurse(partial, exp, '$.{{value}}');
	  },
	
	  'member-descendant-script_expression': function(component, partial) {
	    var exp = component.expression.value.slice(1, -1);
	    return eval_recurse(partial, exp, '$..value');
	  }
	};
	
	Handlers.prototype._fns['subscript-child-string_literal'] =
		Handlers.prototype._fns['member-child-identifier'];
	
	Handlers.prototype._fns['member-descendant-numeric_literal'] =
	    Handlers.prototype._fns['subscript-descendant-string_literal'] =
	    Handlers.prototype._fns['member-descendant-identifier'];
	
	function eval_recurse(partial, src, template) {
	
	  var jp = __webpack_require__(8);
	  var ast = aesprim.parse(src).body[0].expression;
	  var value = evaluate(ast, { '@': partial.value });
	  var path = template.replace(/\{\{\s*value\s*\}\}/g, value);
	
	  var results = jp.nodes(partial.value, path);
	  results.forEach(function(r) {
	    r.path = partial.path.concat(r.path.slice(1));
	  });
	
	  return results;
	}
	
	function is_array(val) {
	  return Array.isArray(val);
	}
	
	function is_object(val) {
	  // is this a non-array, non-null object?
	  return val && !(val instanceof Array) && val instanceof Object;
	}
	
	function traverser(recurse) {
	
	  return function(partial, ref, passable, count) {
	
	    var value = partial.value;
	    var path = partial.path;
	
	    var results = [];
	
	    var descend = function(value, path) {
	
	      if (is_array(value)) {
	        value.forEach(function(element, index) {
	          if (results.length >= count) { return }
	          if (passable(index, element, ref)) {
	            results.push({ path: path.concat(index), value: element });
	          }
	        });
	        value.forEach(function(element, index) {
	          if (results.length >= count) { return }
	          if (recurse) {
	            descend(element, path.concat(index));
	          }
	        });
	      } else if (is_object(value)) {
	        this.keys(value).forEach(function(k) {
	          if (results.length >= count) { return }
	          if (passable(k, value[k], ref)) {
	            results.push({ path: path.concat(k), value: value[k] });
	          }
	        })
	        this.keys(value).forEach(function(k) {
	          if (results.length >= count) { return }
	          if (recurse) {
	            descend(value[k], path.concat(k));
	          }
	        });
	      }
	    }.bind(this);
	    descend(value, path);
	    return results;
	  }
	}
	
	function _descend(passable) {
	  return function(component, partial, count) {
	    return this.descend(partial, component.expression.value, passable, count);
	  }
	}
	
	function _traverse(passable) {
	  return function(component, partial, count) {
	    return this.traverse(partial, component.expression.value, passable, count);
	  }
	}
	
	function evaluate() {
	  try { return _evaluate.apply(this, arguments) }
	  catch (e) { }
	}
	
	function unique(results) {
	  results = results.filter(function(d) { return d })
	  return _uniq(
	    results,
	    function(r) { return r.path.map(function(c) { return String(c).replace('-', '--') }).join('-') }
	  );
	}
	
	function _parse_nullable_int(val) {
	  var sval = String(val);
	  return sval.match(/^-?[0-9]+$/) ? parseInt(sval) : null;
	}
	
	module.exports = Handlers;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
	  Copyright (C) 2013 Ariya Hidayat <ariya.hidayat@gmail.com>
	  Copyright (C) 2013 Thaddee Tyl <thaddee.tyl@gmail.com>
	  Copyright (C) 2013 Mathias Bynens <mathias@qiwi.be>
	  Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>
	  Copyright (C) 2012 Mathias Bynens <mathias@qiwi.be>
	  Copyright (C) 2012 Joost-Wim Boekesteijn <joost-wim@boekesteijn.nl>
	  Copyright (C) 2012 Kris Kowal <kris.kowal@cixar.com>
	  Copyright (C) 2012 Yusuke Suzuki <utatane.tea@gmail.com>
	  Copyright (C) 2012 Arpad Borsos <arpad.borsos@googlemail.com>
	  Copyright (C) 2011 Ariya Hidayat <ariya.hidayat@gmail.com>
	
	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:
	
	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.
	
	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/
	
	/*jslint bitwise:true plusplus:true */
	/*global esprima:true, define:true, exports:true, window: true,
	throwErrorTolerant: true,
	throwError: true, generateStatement: true, peek: true,
	parseAssignmentExpression: true, parseBlock: true, parseExpression: true,
	parseFunctionDeclaration: true, parseFunctionExpression: true,
	parseFunctionSourceElements: true, parseVariableIdentifier: true,
	parseLeftHandSideExpression: true,
	parseUnaryExpression: true,
	parseStatement: true, parseSourceElement: true */
	
	(function (root, factory) {
	    'use strict';
	
	    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js,
	    // Rhino, and plain browser loading.
	
	    /* istanbul ignore next */
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== 'undefined') {
	        factory(exports);
	    } else {
	        factory((root.esprima = {}));
	    }
	}(this, function (exports) {
	    'use strict';
	
	    var Token,
	        TokenName,
	        FnExprTokens,
	        Syntax,
	        PropertyKind,
	        Messages,
	        Regex,
	        SyntaxTreeDelegate,
	        source,
	        strict,
	        index,
	        lineNumber,
	        lineStart,
	        length,
	        delegate,
	        lookahead,
	        state,
	        extra;
	
	    Token = {
	        BooleanLiteral: 1,
	        EOF: 2,
	        Identifier: 3,
	        Keyword: 4,
	        NullLiteral: 5,
	        NumericLiteral: 6,
	        Punctuator: 7,
	        StringLiteral: 8,
	        RegularExpression: 9
	    };
	
	    TokenName = {};
	    TokenName[Token.BooleanLiteral] = 'Boolean';
	    TokenName[Token.EOF] = '<end>';
	    TokenName[Token.Identifier] = 'Identifier';
	    TokenName[Token.Keyword] = 'Keyword';
	    TokenName[Token.NullLiteral] = 'Null';
	    TokenName[Token.NumericLiteral] = 'Numeric';
	    TokenName[Token.Punctuator] = 'Punctuator';
	    TokenName[Token.StringLiteral] = 'String';
	    TokenName[Token.RegularExpression] = 'RegularExpression';
	
	    // A function following one of those tokens is an expression.
	    FnExprTokens = ['(', '{', '[', 'in', 'typeof', 'instanceof', 'new',
	                    'return', 'case', 'delete', 'throw', 'void',
	                    // assignment operators
	                    '=', '+=', '-=', '*=', '/=', '%=', '<<=', '>>=', '>>>=',
	                    '&=', '|=', '^=', ',',
	                    // binary/unary operators
	                    '+', '-', '*', '/', '%', '++', '--', '<<', '>>', '>>>', '&',
	                    '|', '^', '!', '~', '&&', '||', '?', ':', '===', '==', '>=',
	                    '<=', '<', '>', '!=', '!=='];
	
	    Syntax = {
	        AssignmentExpression: 'AssignmentExpression',
	        ArrayExpression: 'ArrayExpression',
	        BlockStatement: 'BlockStatement',
	        BinaryExpression: 'BinaryExpression',
	        BreakStatement: 'BreakStatement',
	        CallExpression: 'CallExpression',
	        CatchClause: 'CatchClause',
	        ConditionalExpression: 'ConditionalExpression',
	        ContinueStatement: 'ContinueStatement',
	        DoWhileStatement: 'DoWhileStatement',
	        DebuggerStatement: 'DebuggerStatement',
	        EmptyStatement: 'EmptyStatement',
	        ExpressionStatement: 'ExpressionStatement',
	        ForStatement: 'ForStatement',
	        ForInStatement: 'ForInStatement',
	        FunctionDeclaration: 'FunctionDeclaration',
	        FunctionExpression: 'FunctionExpression',
	        Identifier: 'Identifier',
	        IfStatement: 'IfStatement',
	        Literal: 'Literal',
	        LabeledStatement: 'LabeledStatement',
	        LogicalExpression: 'LogicalExpression',
	        MemberExpression: 'MemberExpression',
	        NewExpression: 'NewExpression',
	        ObjectExpression: 'ObjectExpression',
	        Program: 'Program',
	        Property: 'Property',
	        ReturnStatement: 'ReturnStatement',
	        SequenceExpression: 'SequenceExpression',
	        SwitchStatement: 'SwitchStatement',
	        SwitchCase: 'SwitchCase',
	        ThisExpression: 'ThisExpression',
	        ThrowStatement: 'ThrowStatement',
	        TryStatement: 'TryStatement',
	        UnaryExpression: 'UnaryExpression',
	        UpdateExpression: 'UpdateExpression',
	        VariableDeclaration: 'VariableDeclaration',
	        VariableDeclarator: 'VariableDeclarator',
	        WhileStatement: 'WhileStatement',
	        WithStatement: 'WithStatement'
	    };
	
	    PropertyKind = {
	        Data: 1,
	        Get: 2,
	        Set: 4
	    };
	
	    // Error messages should be identical to V8.
	    Messages = {
	        UnexpectedToken:  'Unexpected token %0',
	        UnexpectedNumber:  'Unexpected number',
	        UnexpectedString:  'Unexpected string',
	        UnexpectedIdentifier:  'Unexpected identifier',
	        UnexpectedReserved:  'Unexpected reserved word',
	        UnexpectedEOS:  'Unexpected end of input',
	        NewlineAfterThrow:  'Illegal newline after throw',
	        InvalidRegExp: 'Invalid regular expression',
	        UnterminatedRegExp:  'Invalid regular expression: missing /',
	        InvalidLHSInAssignment:  'Invalid left-hand side in assignment',
	        InvalidLHSInForIn:  'Invalid left-hand side in for-in',
	        MultipleDefaultsInSwitch: 'More than one default clause in switch statement',
	        NoCatchOrFinally:  'Missing catch or finally after try',
	        UnknownLabel: 'Undefined label \'%0\'',
	        Redeclaration: '%0 \'%1\' has already been declared',
	        IllegalContinue: 'Illegal continue statement',
	        IllegalBreak: 'Illegal break statement',
	        IllegalReturn: 'Illegal return statement',
	        StrictModeWith:  'Strict mode code may not include a with statement',
	        StrictCatchVariable:  'Catch variable may not be eval or arguments in strict mode',
	        StrictVarName:  'Variable name may not be eval or arguments in strict mode',
	        StrictParamName:  'Parameter name eval or arguments is not allowed in strict mode',
	        StrictParamDupe: 'Strict mode function may not have duplicate parameter names',
	        StrictFunctionName:  'Function name may not be eval or arguments in strict mode',
	        StrictOctalLiteral:  'Octal literals are not allowed in strict mode.',
	        StrictDelete:  'Delete of an unqualified identifier in strict mode.',
	        StrictDuplicateProperty:  'Duplicate data property in object literal not allowed in strict mode',
	        AccessorDataProperty:  'Object literal may not have data and accessor property with the same name',
	        AccessorGetSet:  'Object literal may not have multiple get/set accessors with the same name',
	        StrictLHSAssignment:  'Assignment to eval or arguments is not allowed in strict mode',
	        StrictLHSPostfix:  'Postfix increment/decrement may not have eval or arguments operand in strict mode',
	        StrictLHSPrefix:  'Prefix increment/decrement may not have eval or arguments operand in strict mode',
	        StrictReservedWord:  'Use of future reserved word in strict mode'
	    };
	
	    // See also tools/generate-unicode-regex.py.
	    Regex = {
	        NonAsciiIdentifierStart: new RegExp('[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]'),
	        NonAsciiIdentifierPart: new RegExp('[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0\u08A2-\u08AC\u08E4-\u08FE\u0900-\u0963\u0966-\u096F\u0971-\u0977\u0979-\u097F\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C01-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C82\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D02\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191C\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1D00-\u1DE6\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA697\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA7B\uAA80-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE26\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]')
	    };
	
	    // Ensure the condition is true, otherwise throw an error.
	    // This is only to have a better contract semantic, i.e. another safety net
	    // to catch a logic error. The condition shall be fulfilled in normal case.
	    // Do NOT use this to enforce a certain condition on any user input.
	
	    function assert(condition, message) {
	        /* istanbul ignore if */
	        if (!condition) {
	            throw new Error('ASSERT: ' + message);
	        }
	    }
	
	    function isDecimalDigit(ch) {
	        return (ch >= 48 && ch <= 57);   // 0..9
	    }
	
	    function isHexDigit(ch) {
	        return '0123456789abcdefABCDEF'.indexOf(ch) >= 0;
	    }
	
	    function isOctalDigit(ch) {
	        return '01234567'.indexOf(ch) >= 0;
	    }
	
	
	    // 7.2 White Space
	
	    function isWhiteSpace(ch) {
	        return (ch === 0x20) || (ch === 0x09) || (ch === 0x0B) || (ch === 0x0C) || (ch === 0xA0) ||
	            (ch >= 0x1680 && [0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF].indexOf(ch) >= 0);
	    }
	
	    // 7.3 Line Terminators
	
	    function isLineTerminator(ch) {
	        return (ch === 0x0A) || (ch === 0x0D) || (ch === 0x2028) || (ch === 0x2029);
	    }
	
	    // 7.6 Identifier Names and Identifiers
	
	    function isIdentifierStart(ch) {
	        return (ch == 0x40) ||  (ch === 0x24) || (ch === 0x5F) ||  // $ (dollar) and _ (underscore)
	            (ch >= 0x41 && ch <= 0x5A) ||         // A..Z
	            (ch >= 0x61 && ch <= 0x7A) ||         // a..z
	            (ch === 0x5C) ||                      // \ (backslash)
	            ((ch >= 0x80) && Regex.NonAsciiIdentifierStart.test(String.fromCharCode(ch)));
	    }
	
	    function isIdentifierPart(ch) {
	        return (ch === 0x24) || (ch === 0x5F) ||  // $ (dollar) and _ (underscore)
	            (ch >= 0x41 && ch <= 0x5A) ||         // A..Z
	            (ch >= 0x61 && ch <= 0x7A) ||         // a..z
	            (ch >= 0x30 && ch <= 0x39) ||         // 0..9
	            (ch === 0x5C) ||                      // \ (backslash)
	            ((ch >= 0x80) && Regex.NonAsciiIdentifierPart.test(String.fromCharCode(ch)));
	    }
	
	    // 7.6.1.2 Future Reserved Words
	
	    function isFutureReservedWord(id) {
	        switch (id) {
	        case 'class':
	        case 'enum':
	        case 'export':
	        case 'extends':
	        case 'import':
	        case 'super':
	            return true;
	        default:
	            return false;
	        }
	    }
	
	    function isStrictModeReservedWord(id) {
	        switch (id) {
	        case 'implements':
	        case 'interface':
	        case 'package':
	        case 'private':
	        case 'protected':
	        case 'public':
	        case 'static':
	        case 'yield':
	        case 'let':
	            return true;
	        default:
	            return false;
	        }
	    }
	
	    function isRestrictedWord(id) {
	        return id === 'eval' || id === 'arguments';
	    }
	
	    // 7.6.1.1 Keywords
	
	    function isKeyword(id) {
	        if (strict && isStrictModeReservedWord(id)) {
	            return true;
	        }
	
	        // 'const' is specialized as Keyword in V8.
	        // 'yield' and 'let' are for compatiblity with SpiderMonkey and ES.next.
	        // Some others are from future reserved words.
	
	        switch (id.length) {
	        case 2:
	            return (id === 'if') || (id === 'in') || (id === 'do');
	        case 3:
	            return (id === 'var') || (id === 'for') || (id === 'new') ||
	                (id === 'try') || (id === 'let');
	        case 4:
	            return (id === 'this') || (id === 'else') || (id === 'case') ||
	                (id === 'void') || (id === 'with') || (id === 'enum');
	        case 5:
	            return (id === 'while') || (id === 'break') || (id === 'catch') ||
	                (id === 'throw') || (id === 'const') || (id === 'yield') ||
	                (id === 'class') || (id === 'super');
	        case 6:
	            return (id === 'return') || (id === 'typeof') || (id === 'delete') ||
	                (id === 'switch') || (id === 'export') || (id === 'import');
	        case 7:
	            return (id === 'default') || (id === 'finally') || (id === 'extends');
	        case 8:
	            return (id === 'function') || (id === 'continue') || (id === 'debugger');
	        case 10:
	            return (id === 'instanceof');
	        default:
	            return false;
	        }
	    }
	
	    // 7.4 Comments
	
	    function addComment(type, value, start, end, loc) {
	        var comment, attacher;
	
	        assert(typeof start === 'number', 'Comment must have valid position');
	
	        // Because the way the actual token is scanned, often the comments
	        // (if any) are skipped twice during the lexical analysis.
	        // Thus, we need to skip adding a comment if the comment array already
	        // handled it.
	        if (state.lastCommentStart >= start) {
	            return;
	        }
	        state.lastCommentStart = start;
	
	        comment = {
	            type: type,
	            value: value
	        };
	        if (extra.range) {
	            comment.range = [start, end];
	        }
	        if (extra.loc) {
	            comment.loc = loc;
	        }
	        extra.comments.push(comment);
	        if (extra.attachComment) {
	            extra.leadingComments.push(comment);
	            extra.trailingComments.push(comment);
	        }
	    }
	
	    function skipSingleLineComment(offset) {
	        var start, loc, ch, comment;
	
	        start = index - offset;
	        loc = {
	            start: {
	                line: lineNumber,
	                column: index - lineStart - offset
	            }
	        };
	
	        while (index < length) {
	            ch = source.charCodeAt(index);
	            ++index;
	            if (isLineTerminator(ch)) {
	                if (extra.comments) {
	                    comment = source.slice(start + offset, index - 1);
	                    loc.end = {
	                        line: lineNumber,
	                        column: index - lineStart - 1
	                    };
	                    addComment('Line', comment, start, index - 1, loc);
	                }
	                if (ch === 13 && source.charCodeAt(index) === 10) {
	                    ++index;
	                }
	                ++lineNumber;
	                lineStart = index;
	                return;
	            }
	        }
	
	        if (extra.comments) {
	            comment = source.slice(start + offset, index);
	            loc.end = {
	                line: lineNumber,
	                column: index - lineStart
	            };
	            addComment('Line', comment, start, index, loc);
	        }
	    }
	
	    function skipMultiLineComment() {
	        var start, loc, ch, comment;
	
	        if (extra.comments) {
	            start = index - 2;
	            loc = {
	                start: {
	                    line: lineNumber,
	                    column: index - lineStart - 2
	                }
	            };
	        }
	
	        while (index < length) {
	            ch = source.charCodeAt(index);
	            if (isLineTerminator(ch)) {
	                if (ch === 0x0D && source.charCodeAt(index + 1) === 0x0A) {
	                    ++index;
	                }
	                ++lineNumber;
	                ++index;
	                lineStart = index;
	                if (index >= length) {
	                    throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	                }
	            } else if (ch === 0x2A) {
	                // Block comment ends with '*/'.
	                if (source.charCodeAt(index + 1) === 0x2F) {
	                    ++index;
	                    ++index;
	                    if (extra.comments) {
	                        comment = source.slice(start + 2, index - 2);
	                        loc.end = {
	                            line: lineNumber,
	                            column: index - lineStart
	                        };
	                        addComment('Block', comment, start, index, loc);
	                    }
	                    return;
	                }
	                ++index;
	            } else {
	                ++index;
	            }
	        }
	
	        throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	    }
	
	    function skipComment() {
	        var ch, start;
	
	        start = (index === 0);
	        while (index < length) {
	            ch = source.charCodeAt(index);
	
	            if (isWhiteSpace(ch)) {
	                ++index;
	            } else if (isLineTerminator(ch)) {
	                ++index;
	                if (ch === 0x0D && source.charCodeAt(index) === 0x0A) {
	                    ++index;
	                }
	                ++lineNumber;
	                lineStart = index;
	                start = true;
	            } else if (ch === 0x2F) { // U+002F is '/'
	                ch = source.charCodeAt(index + 1);
	                if (ch === 0x2F) {
	                    ++index;
	                    ++index;
	                    skipSingleLineComment(2);
	                    start = true;
	                } else if (ch === 0x2A) {  // U+002A is '*'
	                    ++index;
	                    ++index;
	                    skipMultiLineComment();
	                } else {
	                    break;
	                }
	            } else if (start && ch === 0x2D) { // U+002D is '-'
	                // U+003E is '>'
	                if ((source.charCodeAt(index + 1) === 0x2D) && (source.charCodeAt(index + 2) === 0x3E)) {
	                    // '-->' is a single-line comment
	                    index += 3;
	                    skipSingleLineComment(3);
	                } else {
	                    break;
	                }
	            } else if (ch === 0x3C) { // U+003C is '<'
	                if (source.slice(index + 1, index + 4) === '!--') {
	                    ++index; // `<`
	                    ++index; // `!`
	                    ++index; // `-`
	                    ++index; // `-`
	                    skipSingleLineComment(4);
	                } else {
	                    break;
	                }
	            } else {
	                break;
	            }
	        }
	    }
	
	    function scanHexEscape(prefix) {
	        var i, len, ch, code = 0;
	
	        len = (prefix === 'u') ? 4 : 2;
	        for (i = 0; i < len; ++i) {
	            if (index < length && isHexDigit(source[index])) {
	                ch = source[index++];
	                code = code * 16 + '0123456789abcdef'.indexOf(ch.toLowerCase());
	            } else {
	                return '';
	            }
	        }
	        return String.fromCharCode(code);
	    }
	
	    function getEscapedIdentifier() {
	        var ch, id;
	
	        ch = source.charCodeAt(index++);
	        id = String.fromCharCode(ch);
	
	        // '\u' (U+005C, U+0075) denotes an escaped character.
	        if (ch === 0x5C) {
	            if (source.charCodeAt(index) !== 0x75) {
	                throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	            }
	            ++index;
	            ch = scanHexEscape('u');
	            if (!ch || ch === '\\' || !isIdentifierStart(ch.charCodeAt(0))) {
	                throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	            }
	            id = ch;
	        }
	
	        while (index < length) {
	            ch = source.charCodeAt(index);
	            if (!isIdentifierPart(ch)) {
	                break;
	            }
	            ++index;
	            id += String.fromCharCode(ch);
	
	            // '\u' (U+005C, U+0075) denotes an escaped character.
	            if (ch === 0x5C) {
	                id = id.substr(0, id.length - 1);
	                if (source.charCodeAt(index) !== 0x75) {
	                    throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	                }
	                ++index;
	                ch = scanHexEscape('u');
	                if (!ch || ch === '\\' || !isIdentifierPart(ch.charCodeAt(0))) {
	                    throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	                }
	                id += ch;
	            }
	        }
	
	        return id;
	    }
	
	    function getIdentifier() {
	        var start, ch;
	
	        start = index++;
	        while (index < length) {
	            ch = source.charCodeAt(index);
	            if (ch === 0x5C) {
	                // Blackslash (U+005C) marks Unicode escape sequence.
	                index = start;
	                return getEscapedIdentifier();
	            }
	            if (isIdentifierPart(ch)) {
	                ++index;
	            } else {
	                break;
	            }
	        }
	
	        return source.slice(start, index);
	    }
	
	    function scanIdentifier() {
	        var start, id, type;
	
	        start = index;
	
	        // Backslash (U+005C) starts an escaped character.
	        id = (source.charCodeAt(index) === 0x5C) ? getEscapedIdentifier() : getIdentifier();
	
	        // There is no keyword or literal with only one character.
	        // Thus, it must be an identifier.
	        if (id.length === 1) {
	            type = Token.Identifier;
	        } else if (isKeyword(id)) {
	            type = Token.Keyword;
	        } else if (id === 'null') {
	            type = Token.NullLiteral;
	        } else if (id === 'true' || id === 'false') {
	            type = Token.BooleanLiteral;
	        } else {
	            type = Token.Identifier;
	        }
	
	        return {
	            type: type,
	            value: id,
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            start: start,
	            end: index
	        };
	    }
	
	
	    // 7.7 Punctuators
	
	    function scanPunctuator() {
	        var start = index,
	            code = source.charCodeAt(index),
	            code2,
	            ch1 = source[index],
	            ch2,
	            ch3,
	            ch4;
	
	        switch (code) {
	
	        // Check for most common single-character punctuators.
	        case 0x2E:  // . dot
	        case 0x28:  // ( open bracket
	        case 0x29:  // ) close bracket
	        case 0x3B:  // ; semicolon
	        case 0x2C:  // , comma
	        case 0x7B:  // { open curly brace
	        case 0x7D:  // } close curly brace
	        case 0x5B:  // [
	        case 0x5D:  // ]
	        case 0x3A:  // :
	        case 0x3F:  // ?
	        case 0x7E:  // ~
	            ++index;
	            if (extra.tokenize) {
	                if (code === 0x28) {
	                    extra.openParenToken = extra.tokens.length;
	                } else if (code === 0x7B) {
	                    extra.openCurlyToken = extra.tokens.length;
	                }
	            }
	            return {
	                type: Token.Punctuator,
	                value: String.fromCharCode(code),
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                start: start,
	                end: index
	            };
	
	        default:
	            code2 = source.charCodeAt(index + 1);
	
	            // '=' (U+003D) marks an assignment or comparison operator.
	            if (code2 === 0x3D) {
	                switch (code) {
	                case 0x2B:  // +
	                case 0x2D:  // -
	                case 0x2F:  // /
	                case 0x3C:  // <
	                case 0x3E:  // >
	                case 0x5E:  // ^
	                case 0x7C:  // |
	                case 0x25:  // %
	                case 0x26:  // &
	                case 0x2A:  // *
	                    index += 2;
	                    return {
	                        type: Token.Punctuator,
	                        value: String.fromCharCode(code) + String.fromCharCode(code2),
	                        lineNumber: lineNumber,
	                        lineStart: lineStart,
	                        start: start,
	                        end: index
	                    };
	
	                case 0x21: // !
	                case 0x3D: // =
	                    index += 2;
	
	                    // !== and ===
	                    if (source.charCodeAt(index) === 0x3D) {
	                        ++index;
	                    }
	                    return {
	                        type: Token.Punctuator,
	                        value: source.slice(start, index),
	                        lineNumber: lineNumber,
	                        lineStart: lineStart,
	                        start: start,
	                        end: index
	                    };
	                }
	            }
	        }
	
	        // 4-character punctuator: >>>=
	
	        ch4 = source.substr(index, 4);
	
	        if (ch4 === '>>>=') {
	            index += 4;
	            return {
	                type: Token.Punctuator,
	                value: ch4,
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                start: start,
	                end: index
	            };
	        }
	
	        // 3-character punctuators: === !== >>> <<= >>=
	
	        ch3 = ch4.substr(0, 3);
	
	        if (ch3 === '>>>' || ch3 === '<<=' || ch3 === '>>=') {
	            index += 3;
	            return {
	                type: Token.Punctuator,
	                value: ch3,
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                start: start,
	                end: index
	            };
	        }
	
	        // Other 2-character punctuators: ++ -- << >> && ||
	        ch2 = ch3.substr(0, 2);
	
	        if ((ch1 === ch2[1] && ('+-<>&|'.indexOf(ch1) >= 0)) || ch2 === '=>') {
	            index += 2;
	            return {
	                type: Token.Punctuator,
	                value: ch2,
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                start: start,
	                end: index
	            };
	        }
	
	        // 1-character punctuators: < > = ! + - * % & | ^ /
	        if ('<>=!+-*%&|^/'.indexOf(ch1) >= 0) {
	            ++index;
	            return {
	                type: Token.Punctuator,
	                value: ch1,
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                start: start,
	                end: index
	            };
	        }
	
	        throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	    }
	
	    // 7.8.3 Numeric Literals
	
	    function scanHexLiteral(start) {
	        var number = '';
	
	        while (index < length) {
	            if (!isHexDigit(source[index])) {
	                break;
	            }
	            number += source[index++];
	        }
	
	        if (number.length === 0) {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }
	
	        if (isIdentifierStart(source.charCodeAt(index))) {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }
	
	        return {
	            type: Token.NumericLiteral,
	            value: parseInt('0x' + number, 16),
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            start: start,
	            end: index
	        };
	    }
	
	    function scanOctalLiteral(start) {
	        var number = '0' + source[index++];
	        while (index < length) {
	            if (!isOctalDigit(source[index])) {
	                break;
	            }
	            number += source[index++];
	        }
	
	        if (isIdentifierStart(source.charCodeAt(index)) || isDecimalDigit(source.charCodeAt(index))) {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }
	
	        return {
	            type: Token.NumericLiteral,
	            value: parseInt(number, 8),
	            octal: true,
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            start: start,
	            end: index
	        };
	    }
	
	    function scanNumericLiteral() {
	        var number, start, ch;
	
	        ch = source[index];
	        assert(isDecimalDigit(ch.charCodeAt(0)) || (ch === '.'),
	            'Numeric literal must start with a decimal digit or a decimal point');
	
	        start = index;
	        number = '';
	        if (ch !== '.') {
	            number = source[index++];
	            ch = source[index];
	
	            // Hex number starts with '0x'.
	            // Octal number starts with '0'.
	            if (number === '0') {
	                if (ch === 'x' || ch === 'X') {
	                    ++index;
	                    return scanHexLiteral(start);
	                }
	                if (isOctalDigit(ch)) {
	                    return scanOctalLiteral(start);
	                }
	
	                // decimal number starts with '0' such as '09' is illegal.
	                if (ch && isDecimalDigit(ch.charCodeAt(0))) {
	                    throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	                }
	            }
	
	            while (isDecimalDigit(source.charCodeAt(index))) {
	                number += source[index++];
	            }
	            ch = source[index];
	        }
	
	        if (ch === '.') {
	            number += source[index++];
	            while (isDecimalDigit(source.charCodeAt(index))) {
	                number += source[index++];
	            }
	            ch = source[index];
	        }
	
	        if (ch === 'e' || ch === 'E') {
	            number += source[index++];
	
	            ch = source[index];
	            if (ch === '+' || ch === '-') {
	                number += source[index++];
	            }
	            if (isDecimalDigit(source.charCodeAt(index))) {
	                while (isDecimalDigit(source.charCodeAt(index))) {
	                    number += source[index++];
	                }
	            } else {
	                throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	            }
	        }
	
	        if (isIdentifierStart(source.charCodeAt(index))) {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }
	
	        return {
	            type: Token.NumericLiteral,
	            value: parseFloat(number),
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            start: start,
	            end: index
	        };
	    }
	
	    // 7.8.4 String Literals
	
	    function scanStringLiteral() {
	        var str = '', quote, start, ch, code, unescaped, restore, octal = false, startLineNumber, startLineStart;
	        startLineNumber = lineNumber;
	        startLineStart = lineStart;
	
	        quote = source[index];
	        assert((quote === '\'' || quote === '"'),
	            'String literal must starts with a quote');
	
	        start = index;
	        ++index;
	
	        while (index < length) {
	            ch = source[index++];
	
	            if (ch === quote) {
	                quote = '';
	                break;
	            } else if (ch === '\\') {
	                ch = source[index++];
	                if (!ch || !isLineTerminator(ch.charCodeAt(0))) {
	                    switch (ch) {
	                    case 'u':
	                    case 'x':
	                        restore = index;
	                        unescaped = scanHexEscape(ch);
	                        if (unescaped) {
	                            str += unescaped;
	                        } else {
	                            index = restore;
	                            str += ch;
	                        }
	                        break;
	                    case 'n':
	                        str += '\n';
	                        break;
	                    case 'r':
	                        str += '\r';
	                        break;
	                    case 't':
	                        str += '\t';
	                        break;
	                    case 'b':
	                        str += '\b';
	                        break;
	                    case 'f':
	                        str += '\f';
	                        break;
	                    case 'v':
	                        str += '\x0B';
	                        break;
	
	                    default:
	                        if (isOctalDigit(ch)) {
	                            code = '01234567'.indexOf(ch);
	
	                            // \0 is not octal escape sequence
	                            if (code !== 0) {
	                                octal = true;
	                            }
	
	                            if (index < length && isOctalDigit(source[index])) {
	                                octal = true;
	                                code = code * 8 + '01234567'.indexOf(source[index++]);
	
	                                // 3 digits are only allowed when string starts
	                                // with 0, 1, 2, 3
	                                if ('0123'.indexOf(ch) >= 0 &&
	                                        index < length &&
	                                        isOctalDigit(source[index])) {
	                                    code = code * 8 + '01234567'.indexOf(source[index++]);
	                                }
	                            }
	                            str += String.fromCharCode(code);
	                        } else {
	                            str += ch;
	                        }
	                        break;
	                    }
	                } else {
	                    ++lineNumber;
	                    if (ch ===  '\r' && source[index] === '\n') {
	                        ++index;
	                    }
	                    lineStart = index;
	                }
	            } else if (isLineTerminator(ch.charCodeAt(0))) {
	                break;
	            } else {
	                str += ch;
	            }
	        }
	
	        if (quote !== '') {
	            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	        }
	
	        return {
	            type: Token.StringLiteral,
	            value: str,
	            octal: octal,
	            startLineNumber: startLineNumber,
	            startLineStart: startLineStart,
	            lineNumber: lineNumber,
	            lineStart: lineStart,
	            start: start,
	            end: index
	        };
	    }
	
	    function testRegExp(pattern, flags) {
	        var value;
	        try {
	            value = new RegExp(pattern, flags);
	        } catch (e) {
	            throwError({}, Messages.InvalidRegExp);
	        }
	        return value;
	    }
	
	    function scanRegExpBody() {
	        var ch, str, classMarker, terminated, body;
	
	        ch = source[index];
	        assert(ch === '/', 'Regular expression literal must start with a slash');
	        str = source[index++];
	
	        classMarker = false;
	        terminated = false;
	        while (index < length) {
	            ch = source[index++];
	            str += ch;
	            if (ch === '\\') {
	                ch = source[index++];
	                // ECMA-262 7.8.5
	                if (isLineTerminator(ch.charCodeAt(0))) {
	                    throwError({}, Messages.UnterminatedRegExp);
	                }
	                str += ch;
	            } else if (isLineTerminator(ch.charCodeAt(0))) {
	                throwError({}, Messages.UnterminatedRegExp);
	            } else if (classMarker) {
	                if (ch === ']') {
	                    classMarker = false;
	                }
	            } else {
	                if (ch === '/') {
	                    terminated = true;
	                    break;
	                } else if (ch === '[') {
	                    classMarker = true;
	                }
	            }
	        }
	
	        if (!terminated) {
	            throwError({}, Messages.UnterminatedRegExp);
	        }
	
	        // Exclude leading and trailing slash.
	        body = str.substr(1, str.length - 2);
	        return {
	            value: body,
	            literal: str
	        };
	    }
	
	    function scanRegExpFlags() {
	        var ch, str, flags, restore;
	
	        str = '';
	        flags = '';
	        while (index < length) {
	            ch = source[index];
	            if (!isIdentifierPart(ch.charCodeAt(0))) {
	                break;
	            }
	
	            ++index;
	            if (ch === '\\' && index < length) {
	                ch = source[index];
	                if (ch === 'u') {
	                    ++index;
	                    restore = index;
	                    ch = scanHexEscape('u');
	                    if (ch) {
	                        flags += ch;
	                        for (str += '\\u'; restore < index; ++restore) {
	                            str += source[restore];
	                        }
	                    } else {
	                        index = restore;
	                        flags += 'u';
	                        str += '\\u';
	                    }
	                    throwErrorTolerant({}, Messages.UnexpectedToken, 'ILLEGAL');
	                } else {
	                    str += '\\';
	                    throwErrorTolerant({}, Messages.UnexpectedToken, 'ILLEGAL');
	                }
	            } else {
	                flags += ch;
	                str += ch;
	            }
	        }
	
	        return {
	            value: flags,
	            literal: str
	        };
	    }
	
	    function scanRegExp() {
	        var start, body, flags, pattern, value;
	
	        lookahead = null;
	        skipComment();
	        start = index;
	
	        body = scanRegExpBody();
	        flags = scanRegExpFlags();
	        value = testRegExp(body.value, flags.value);
	
	        if (extra.tokenize) {
	            return {
	                type: Token.RegularExpression,
	                value: value,
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                start: start,
	                end: index
	            };
	        }
	
	        return {
	            literal: body.literal + flags.literal,
	            value: value,
	            start: start,
	            end: index
	        };
	    }
	
	    function collectRegex() {
	        var pos, loc, regex, token;
	
	        skipComment();
	
	        pos = index;
	        loc = {
	            start: {
	                line: lineNumber,
	                column: index - lineStart
	            }
	        };
	
	        regex = scanRegExp();
	        loc.end = {
	            line: lineNumber,
	            column: index - lineStart
	        };
	
	        /* istanbul ignore next */
	        if (!extra.tokenize) {
	            // Pop the previous token, which is likely '/' or '/='
	            if (extra.tokens.length > 0) {
	                token = extra.tokens[extra.tokens.length - 1];
	                if (token.range[0] === pos && token.type === 'Punctuator') {
	                    if (token.value === '/' || token.value === '/=') {
	                        extra.tokens.pop();
	                    }
	                }
	            }
	
	            extra.tokens.push({
	                type: 'RegularExpression',
	                value: regex.literal,
	                range: [pos, index],
	                loc: loc
	            });
	        }
	
	        return regex;
	    }
	
	    function isIdentifierName(token) {
	        return token.type === Token.Identifier ||
	            token.type === Token.Keyword ||
	            token.type === Token.BooleanLiteral ||
	            token.type === Token.NullLiteral;
	    }
	
	    function advanceSlash() {
	        var prevToken,
	            checkToken;
	        // Using the following algorithm:
	        // https://github.com/mozilla/sweet.js/wiki/design
	        prevToken = extra.tokens[extra.tokens.length - 1];
	        if (!prevToken) {
	            // Nothing before that: it cannot be a division.
	            return collectRegex();
	        }
	        if (prevToken.type === 'Punctuator') {
	            if (prevToken.value === ']') {
	                return scanPunctuator();
	            }
	            if (prevToken.value === ')') {
	                checkToken = extra.tokens[extra.openParenToken - 1];
	                if (checkToken &&
	                        checkToken.type === 'Keyword' &&
	                        (checkToken.value === 'if' ||
	                         checkToken.value === 'while' ||
	                         checkToken.value === 'for' ||
	                         checkToken.value === 'with')) {
	                    return collectRegex();
	                }
	                return scanPunctuator();
	            }
	            if (prevToken.value === '}') {
	                // Dividing a function by anything makes little sense,
	                // but we have to check for that.
	                if (extra.tokens[extra.openCurlyToken - 3] &&
	                        extra.tokens[extra.openCurlyToken - 3].type === 'Keyword') {
	                    // Anonymous function.
	                    checkToken = extra.tokens[extra.openCurlyToken - 4];
	                    if (!checkToken) {
	                        return scanPunctuator();
	                    }
	                } else if (extra.tokens[extra.openCurlyToken - 4] &&
	                        extra.tokens[extra.openCurlyToken - 4].type === 'Keyword') {
	                    // Named function.
	                    checkToken = extra.tokens[extra.openCurlyToken - 5];
	                    if (!checkToken) {
	                        return collectRegex();
	                    }
	                } else {
	                    return scanPunctuator();
	                }
	                // checkToken determines whether the function is
	                // a declaration or an expression.
	                if (FnExprTokens.indexOf(checkToken.value) >= 0) {
	                    // It is an expression.
	                    return scanPunctuator();
	                }
	                // It is a declaration.
	                return collectRegex();
	            }
	            return collectRegex();
	        }
	        if (prevToken.type === 'Keyword') {
	            return collectRegex();
	        }
	        return scanPunctuator();
	    }
	
	    function advance() {
	        var ch;
	
	        skipComment();
	
	        if (index >= length) {
	            return {
	                type: Token.EOF,
	                lineNumber: lineNumber,
	                lineStart: lineStart,
	                start: index,
	                end: index
	            };
	        }
	
	        ch = source.charCodeAt(index);
	
	        if (isIdentifierStart(ch)) {
	            return scanIdentifier();
	        }
	
	        // Very common: ( and ) and ;
	        if (ch === 0x28 || ch === 0x29 || ch === 0x3B) {
	            return scanPunctuator();
	        }
	
	        // String literal starts with single quote (U+0027) or double quote (U+0022).
	        if (ch === 0x27 || ch === 0x22) {
	            return scanStringLiteral();
	        }
	
	
	        // Dot (.) U+002E can also start a floating-point number, hence the need
	        // to check the next character.
	        if (ch === 0x2E) {
	            if (isDecimalDigit(source.charCodeAt(index + 1))) {
	                return scanNumericLiteral();
	            }
	            return scanPunctuator();
	        }
	
	        if (isDecimalDigit(ch)) {
	            return scanNumericLiteral();
	        }
	
	        // Slash (/) U+002F can also start a regex.
	        if (extra.tokenize && ch === 0x2F) {
	            return advanceSlash();
	        }
	
	        return scanPunctuator();
	    }
	
	    function collectToken() {
	        var loc, token, range, value;
	
	        skipComment();
	        loc = {
	            start: {
	                line: lineNumber,
	                column: index - lineStart
	            }
	        };
	
	        token = advance();
	        loc.end = {
	            line: lineNumber,
	            column: index - lineStart
	        };
	
	        if (token.type !== Token.EOF) {
	            value = source.slice(token.start, token.end);
	            extra.tokens.push({
	                type: TokenName[token.type],
	                value: value,
	                range: [token.start, token.end],
	                loc: loc
	            });
	        }
	
	        return token;
	    }
	
	    function lex() {
	        var token;
	
	        token = lookahead;
	        index = token.end;
	        lineNumber = token.lineNumber;
	        lineStart = token.lineStart;
	
	        lookahead = (typeof extra.tokens !== 'undefined') ? collectToken() : advance();
	
	        index = token.end;
	        lineNumber = token.lineNumber;
	        lineStart = token.lineStart;
	
	        return token;
	    }
	
	    function peek() {
	        var pos, line, start;
	
	        pos = index;
	        line = lineNumber;
	        start = lineStart;
	        lookahead = (typeof extra.tokens !== 'undefined') ? collectToken() : advance();
	        index = pos;
	        lineNumber = line;
	        lineStart = start;
	    }
	
	    function Position(line, column) {
	        this.line = line;
	        this.column = column;
	    }
	
	    function SourceLocation(startLine, startColumn, line, column) {
	        this.start = new Position(startLine, startColumn);
	        this.end = new Position(line, column);
	    }
	
	    SyntaxTreeDelegate = {
	
	        name: 'SyntaxTree',
	
	        processComment: function (node) {
	            var lastChild, trailingComments;
	
	            if (node.type === Syntax.Program) {
	                if (node.body.length > 0) {
	                    return;
	                }
	            }
	
	            if (extra.trailingComments.length > 0) {
	                if (extra.trailingComments[0].range[0] >= node.range[1]) {
	                    trailingComments = extra.trailingComments;
	                    extra.trailingComments = [];
	                } else {
	                    extra.trailingComments.length = 0;
	                }
	            } else {
	                if (extra.bottomRightStack.length > 0 &&
	                        extra.bottomRightStack[extra.bottomRightStack.length - 1].trailingComments &&
	                        extra.bottomRightStack[extra.bottomRightStack.length - 1].trailingComments[0].range[0] >= node.range[1]) {
	                    trailingComments = extra.bottomRightStack[extra.bottomRightStack.length - 1].trailingComments;
	                    delete extra.bottomRightStack[extra.bottomRightStack.length - 1].trailingComments;
	                }
	            }
	
	            // Eating the stack.
	            while (extra.bottomRightStack.length > 0 && extra.bottomRightStack[extra.bottomRightStack.length - 1].range[0] >= node.range[0]) {
	                lastChild = extra.bottomRightStack.pop();
	            }
	
	            if (lastChild) {
	                if (lastChild.leadingComments && lastChild.leadingComments[lastChild.leadingComments.length - 1].range[1] <= node.range[0]) {
	                    node.leadingComments = lastChild.leadingComments;
	                    delete lastChild.leadingComments;
	                }
	            } else if (extra.leadingComments.length > 0 && extra.leadingComments[extra.leadingComments.length - 1].range[1] <= node.range[0]) {
	                node.leadingComments = extra.leadingComments;
	                extra.leadingComments = [];
	            }
	
	
	            if (trailingComments) {
	                node.trailingComments = trailingComments;
	            }
	
	            extra.bottomRightStack.push(node);
	        },
	
	        markEnd: function (node, startToken) {
	            if (extra.range) {
	                node.range = [startToken.start, index];
	            }
	            if (extra.loc) {
	                node.loc = new SourceLocation(
	                    startToken.startLineNumber === undefined ?  startToken.lineNumber : startToken.startLineNumber,
	                    startToken.start - (startToken.startLineStart === undefined ?  startToken.lineStart : startToken.startLineStart),
	                    lineNumber,
	                    index - lineStart
	                );
	                this.postProcess(node);
	            }
	
	            if (extra.attachComment) {
	                this.processComment(node);
	            }
	            return node;
	        },
	
	        postProcess: function (node) {
	            if (extra.source) {
	                node.loc.source = extra.source;
	            }
	            return node;
	        },
	
	        createArrayExpression: function (elements) {
	            return {
	                type: Syntax.ArrayExpression,
	                elements: elements
	            };
	        },
	
	        createAssignmentExpression: function (operator, left, right) {
	            return {
	                type: Syntax.AssignmentExpression,
	                operator: operator,
	                left: left,
	                right: right
	            };
	        },
	
	        createBinaryExpression: function (operator, left, right) {
	            var type = (operator === '||' || operator === '&&') ? Syntax.LogicalExpression :
	                        Syntax.BinaryExpression;
	            return {
	                type: type,
	                operator: operator,
	                left: left,
	                right: right
	            };
	        },
	
	        createBlockStatement: function (body) {
	            return {
	                type: Syntax.BlockStatement,
	                body: body
	            };
	        },
	
	        createBreakStatement: function (label) {
	            return {
	                type: Syntax.BreakStatement,
	                label: label
	            };
	        },
	
	        createCallExpression: function (callee, args) {
	            return {
	                type: Syntax.CallExpression,
	                callee: callee,
	                'arguments': args
	            };
	        },
	
	        createCatchClause: function (param, body) {
	            return {
	                type: Syntax.CatchClause,
	                param: param,
	                body: body
	            };
	        },
	
	        createConditionalExpression: function (test, consequent, alternate) {
	            return {
	                type: Syntax.ConditionalExpression,
	                test: test,
	                consequent: consequent,
	                alternate: alternate
	            };
	        },
	
	        createContinueStatement: function (label) {
	            return {
	                type: Syntax.ContinueStatement,
	                label: label
	            };
	        },
	
	        createDebuggerStatement: function () {
	            return {
	                type: Syntax.DebuggerStatement
	            };
	        },
	
	        createDoWhileStatement: function (body, test) {
	            return {
	                type: Syntax.DoWhileStatement,
	                body: body,
	                test: test
	            };
	        },
	
	        createEmptyStatement: function () {
	            return {
	                type: Syntax.EmptyStatement
	            };
	        },
	
	        createExpressionStatement: function (expression) {
	            return {
	                type: Syntax.ExpressionStatement,
	                expression: expression
	            };
	        },
	
	        createForStatement: function (init, test, update, body) {
	            return {
	                type: Syntax.ForStatement,
	                init: init,
	                test: test,
	                update: update,
	                body: body
	            };
	        },
	
	        createForInStatement: function (left, right, body) {
	            return {
	                type: Syntax.ForInStatement,
	                left: left,
	                right: right,
	                body: body,
	                each: false
	            };
	        },
	
	        createFunctionDeclaration: function (id, params, defaults, body) {
	            return {
	                type: Syntax.FunctionDeclaration,
	                id: id,
	                params: params,
	                defaults: defaults,
	                body: body,
	                rest: null,
	                generator: false,
	                expression: false
	            };
	        },
	
	        createFunctionExpression: function (id, params, defaults, body) {
	            return {
	                type: Syntax.FunctionExpression,
	                id: id,
	                params: params,
	                defaults: defaults,
	                body: body,
	                rest: null,
	                generator: false,
	                expression: false
	            };
	        },
	
	        createIdentifier: function (name) {
	            return {
	                type: Syntax.Identifier,
	                name: name
	            };
	        },
	
	        createIfStatement: function (test, consequent, alternate) {
	            return {
	                type: Syntax.IfStatement,
	                test: test,
	                consequent: consequent,
	                alternate: alternate
	            };
	        },
	
	        createLabeledStatement: function (label, body) {
	            return {
	                type: Syntax.LabeledStatement,
	                label: label,
	                body: body
	            };
	        },
	
	        createLiteral: function (token) {
	            return {
	                type: Syntax.Literal,
	                value: token.value,
	                raw: source.slice(token.start, token.end)
	            };
	        },
	
	        createMemberExpression: function (accessor, object, property) {
	            return {
	                type: Syntax.MemberExpression,
	                computed: accessor === '[',
	                object: object,
	                property: property
	            };
	        },
	
	        createNewExpression: function (callee, args) {
	            return {
	                type: Syntax.NewExpression,
	                callee: callee,
	                'arguments': args
	            };
	        },
	
	        createObjectExpression: function (properties) {
	            return {
	                type: Syntax.ObjectExpression,
	                properties: properties
	            };
	        },
	
	        createPostfixExpression: function (operator, argument) {
	            return {
	                type: Syntax.UpdateExpression,
	                operator: operator,
	                argument: argument,
	                prefix: false
	            };
	        },
	
	        createProgram: function (body) {
	            return {
	                type: Syntax.Program,
	                body: body
	            };
	        },
	
	        createProperty: function (kind, key, value) {
	            return {
	                type: Syntax.Property,
	                key: key,
	                value: value,
	                kind: kind
	            };
	        },
	
	        createReturnStatement: function (argument) {
	            return {
	                type: Syntax.ReturnStatement,
	                argument: argument
	            };
	        },
	
	        createSequenceExpression: function (expressions) {
	            return {
	                type: Syntax.SequenceExpression,
	                expressions: expressions
	            };
	        },
	
	        createSwitchCase: function (test, consequent) {
	            return {
	                type: Syntax.SwitchCase,
	                test: test,
	                consequent: consequent
	            };
	        },
	
	        createSwitchStatement: function (discriminant, cases) {
	            return {
	                type: Syntax.SwitchStatement,
	                discriminant: discriminant,
	                cases: cases
	            };
	        },
	
	        createThisExpression: function () {
	            return {
	                type: Syntax.ThisExpression
	            };
	        },
	
	        createThrowStatement: function (argument) {
	            return {
	                type: Syntax.ThrowStatement,
	                argument: argument
	            };
	        },
	
	        createTryStatement: function (block, guardedHandlers, handlers, finalizer) {
	            return {
	                type: Syntax.TryStatement,
	                block: block,
	                guardedHandlers: guardedHandlers,
	                handlers: handlers,
	                finalizer: finalizer
	            };
	        },
	
	        createUnaryExpression: function (operator, argument) {
	            if (operator === '++' || operator === '--') {
	                return {
	                    type: Syntax.UpdateExpression,
	                    operator: operator,
	                    argument: argument,
	                    prefix: true
	                };
	            }
	            return {
	                type: Syntax.UnaryExpression,
	                operator: operator,
	                argument: argument,
	                prefix: true
	            };
	        },
	
	        createVariableDeclaration: function (declarations, kind) {
	            return {
	                type: Syntax.VariableDeclaration,
	                declarations: declarations,
	                kind: kind
	            };
	        },
	
	        createVariableDeclarator: function (id, init) {
	            return {
	                type: Syntax.VariableDeclarator,
	                id: id,
	                init: init
	            };
	        },
	
	        createWhileStatement: function (test, body) {
	            return {
	                type: Syntax.WhileStatement,
	                test: test,
	                body: body
	            };
	        },
	
	        createWithStatement: function (object, body) {
	            return {
	                type: Syntax.WithStatement,
	                object: object,
	                body: body
	            };
	        }
	    };
	
	    // Return true if there is a line terminator before the next token.
	
	    function peekLineTerminator() {
	        var pos, line, start, found;
	
	        pos = index;
	        line = lineNumber;
	        start = lineStart;
	        skipComment();
	        found = lineNumber !== line;
	        index = pos;
	        lineNumber = line;
	        lineStart = start;
	
	        return found;
	    }
	
	    // Throw an exception
	
	    function throwError(token, messageFormat) {
	        var error,
	            args = Array.prototype.slice.call(arguments, 2),
	            msg = messageFormat.replace(
	                /%(\d)/g,
	                function (whole, index) {
	                    assert(index < args.length, 'Message reference must be in range');
	                    return args[index];
	                }
	            );
	
	        if (typeof token.lineNumber === 'number') {
	            error = new Error('Line ' + token.lineNumber + ': ' + msg);
	            error.index = token.start;
	            error.lineNumber = token.lineNumber;
	            error.column = token.start - lineStart + 1;
	        } else {
	            error = new Error('Line ' + lineNumber + ': ' + msg);
	            error.index = index;
	            error.lineNumber = lineNumber;
	            error.column = index - lineStart + 1;
	        }
	
	        error.description = msg;
	        throw error;
	    }
	
	    function throwErrorTolerant() {
	        try {
	            throwError.apply(null, arguments);
	        } catch (e) {
	            if (extra.errors) {
	                extra.errors.push(e);
	            } else {
	                throw e;
	            }
	        }
	    }
	
	
	    // Throw an exception because of the token.
	
	    function throwUnexpected(token) {
	        if (token.type === Token.EOF) {
	            throwError(token, Messages.UnexpectedEOS);
	        }
	
	        if (token.type === Token.NumericLiteral) {
	            throwError(token, Messages.UnexpectedNumber);
	        }
	
	        if (token.type === Token.StringLiteral) {
	            throwError(token, Messages.UnexpectedString);
	        }
	
	        if (token.type === Token.Identifier) {
	            throwError(token, Messages.UnexpectedIdentifier);
	        }
	
	        if (token.type === Token.Keyword) {
	            if (isFutureReservedWord(token.value)) {
	                throwError(token, Messages.UnexpectedReserved);
	            } else if (strict && isStrictModeReservedWord(token.value)) {
	                throwErrorTolerant(token, Messages.StrictReservedWord);
	                return;
	            }
	            throwError(token, Messages.UnexpectedToken, token.value);
	        }
	
	        // BooleanLiteral, NullLiteral, or Punctuator.
	        throwError(token, Messages.UnexpectedToken, token.value);
	    }
	
	    // Expect the next token to match the specified punctuator.
	    // If not, an exception will be thrown.
	
	    function expect(value) {
	        var token = lex();
	        if (token.type !== Token.Punctuator || token.value !== value) {
	            throwUnexpected(token);
	        }
	    }
	
	    // Expect the next token to match the specified keyword.
	    // If not, an exception will be thrown.
	
	    function expectKeyword(keyword) {
	        var token = lex();
	        if (token.type !== Token.Keyword || token.value !== keyword) {
	            throwUnexpected(token);
	        }
	    }
	
	    // Return true if the next token matches the specified punctuator.
	
	    function match(value) {
	        return lookahead.type === Token.Punctuator && lookahead.value === value;
	    }
	
	    // Return true if the next token matches the specified keyword
	
	    function matchKeyword(keyword) {
	        return lookahead.type === Token.Keyword && lookahead.value === keyword;
	    }
	
	    // Return true if the next token is an assignment operator
	
	    function matchAssign() {
	        var op;
	
	        if (lookahead.type !== Token.Punctuator) {
	            return false;
	        }
	        op = lookahead.value;
	        return op === '=' ||
	            op === '*=' ||
	            op === '/=' ||
	            op === '%=' ||
	            op === '+=' ||
	            op === '-=' ||
	            op === '<<=' ||
	            op === '>>=' ||
	            op === '>>>=' ||
	            op === '&=' ||
	            op === '^=' ||
	            op === '|=';
	    }
	
	    function consumeSemicolon() {
	        var line;
	
	        // Catch the very common case first: immediately a semicolon (U+003B).
	        if (source.charCodeAt(index) === 0x3B || match(';')) {
	            lex();
	            return;
	        }
	
	        line = lineNumber;
	        skipComment();
	        if (lineNumber !== line) {
	            return;
	        }
	
	        if (lookahead.type !== Token.EOF && !match('}')) {
	            throwUnexpected(lookahead);
	        }
	    }
	
	    // Return true if provided expression is LeftHandSideExpression
	
	    function isLeftHandSide(expr) {
	        return expr.type === Syntax.Identifier || expr.type === Syntax.MemberExpression;
	    }
	
	    // 11.1.4 Array Initialiser
	
	    function parseArrayInitialiser() {
	        var elements = [], startToken;
	
	        startToken = lookahead;
	        expect('[');
	
	        while (!match(']')) {
	            if (match(',')) {
	                lex();
	                elements.push(null);
	            } else {
	                elements.push(parseAssignmentExpression());
	
	                if (!match(']')) {
	                    expect(',');
	                }
	            }
	        }
	
	        lex();
	
	        return delegate.markEnd(delegate.createArrayExpression(elements), startToken);
	    }
	
	    // 11.1.5 Object Initialiser
	
	    function parsePropertyFunction(param, first) {
	        var previousStrict, body, startToken;
	
	        previousStrict = strict;
	        startToken = lookahead;
	        body = parseFunctionSourceElements();
	        if (first && strict && isRestrictedWord(param[0].name)) {
	            throwErrorTolerant(first, Messages.StrictParamName);
	        }
	        strict = previousStrict;
	        return delegate.markEnd(delegate.createFunctionExpression(null, param, [], body), startToken);
	    }
	
	    function parseObjectPropertyKey() {
	        var token, startToken;
	
	        startToken = lookahead;
	        token = lex();
	
	        // Note: This function is called only from parseObjectProperty(), where
	        // EOF and Punctuator tokens are already filtered out.
	
	        if (token.type === Token.StringLiteral || token.type === Token.NumericLiteral) {
	            if (strict && token.octal) {
	                throwErrorTolerant(token, Messages.StrictOctalLiteral);
	            }
	            return delegate.markEnd(delegate.createLiteral(token), startToken);
	        }
	
	        return delegate.markEnd(delegate.createIdentifier(token.value), startToken);
	    }
	
	    function parseObjectProperty() {
	        var token, key, id, value, param, startToken;
	
	        token = lookahead;
	        startToken = lookahead;
	
	        if (token.type === Token.Identifier) {
	
	            id = parseObjectPropertyKey();
	
	            // Property Assignment: Getter and Setter.
	
	            if (token.value === 'get' && !match(':')) {
	                key = parseObjectPropertyKey();
	                expect('(');
	                expect(')');
	                value = parsePropertyFunction([]);
	                return delegate.markEnd(delegate.createProperty('get', key, value), startToken);
	            }
	            if (token.value === 'set' && !match(':')) {
	                key = parseObjectPropertyKey();
	                expect('(');
	                token = lookahead;
	                if (token.type !== Token.Identifier) {
	                    expect(')');
	                    throwErrorTolerant(token, Messages.UnexpectedToken, token.value);
	                    value = parsePropertyFunction([]);
	                } else {
	                    param = [ parseVariableIdentifier() ];
	                    expect(')');
	                    value = parsePropertyFunction(param, token);
	                }
	                return delegate.markEnd(delegate.createProperty('set', key, value), startToken);
	            }
	            expect(':');
	            value = parseAssignmentExpression();
	            return delegate.markEnd(delegate.createProperty('init', id, value), startToken);
	        }
	        if (token.type === Token.EOF || token.type === Token.Punctuator) {
	            throwUnexpected(token);
	        } else {
	            key = parseObjectPropertyKey();
	            expect(':');
	            value = parseAssignmentExpression();
	            return delegate.markEnd(delegate.createProperty('init', key, value), startToken);
	        }
	    }
	
	    function parseObjectInitialiser() {
	        var properties = [], property, name, key, kind, map = {}, toString = String, startToken;
	
	        startToken = lookahead;
	
	        expect('{');
	
	        while (!match('}')) {
	            property = parseObjectProperty();
	
	            if (property.key.type === Syntax.Identifier) {
	                name = property.key.name;
	            } else {
	                name = toString(property.key.value);
	            }
	            kind = (property.kind === 'init') ? PropertyKind.Data : (property.kind === 'get') ? PropertyKind.Get : PropertyKind.Set;
	
	            key = '$' + name;
	            if (Object.prototype.hasOwnProperty.call(map, key)) {
	                if (map[key] === PropertyKind.Data) {
	                    if (strict && kind === PropertyKind.Data) {
	                        throwErrorTolerant({}, Messages.StrictDuplicateProperty);
	                    } else if (kind !== PropertyKind.Data) {
	                        throwErrorTolerant({}, Messages.AccessorDataProperty);
	                    }
	                } else {
	                    if (kind === PropertyKind.Data) {
	                        throwErrorTolerant({}, Messages.AccessorDataProperty);
	                    } else if (map[key] & kind) {
	                        throwErrorTolerant({}, Messages.AccessorGetSet);
	                    }
	                }
	                map[key] |= kind;
	            } else {
	                map[key] = kind;
	            }
	
	            properties.push(property);
	
	            if (!match('}')) {
	                expect(',');
	            }
	        }
	
	        expect('}');
	
	        return delegate.markEnd(delegate.createObjectExpression(properties), startToken);
	    }
	
	    // 11.1.6 The Grouping Operator
	
	    function parseGroupExpression() {
	        var expr;
	
	        expect('(');
	
	        expr = parseExpression();
	
	        expect(')');
	
	        return expr;
	    }
	
	
	    // 11.1 Primary Expressions
	
	    function parsePrimaryExpression() {
	        var type, token, expr, startToken;
	
	        if (match('(')) {
	            return parseGroupExpression();
	        }
	
	        if (match('[')) {
	            return parseArrayInitialiser();
	        }
	
	        if (match('{')) {
	            return parseObjectInitialiser();
	        }
	
	        type = lookahead.type;
	        startToken = lookahead;
	
	        if (type === Token.Identifier) {
	            expr =  delegate.createIdentifier(lex().value);
	        } else if (type === Token.StringLiteral || type === Token.NumericLiteral) {
	            if (strict && lookahead.octal) {
	                throwErrorTolerant(lookahead, Messages.StrictOctalLiteral);
	            }
	            expr = delegate.createLiteral(lex());
	        } else if (type === Token.Keyword) {
	            if (matchKeyword('function')) {
	                return parseFunctionExpression();
	            }
	            if (matchKeyword('this')) {
	                lex();
	                expr = delegate.createThisExpression();
	            } else {
	                throwUnexpected(lex());
	            }
	        } else if (type === Token.BooleanLiteral) {
	            token = lex();
	            token.value = (token.value === 'true');
	            expr = delegate.createLiteral(token);
	        } else if (type === Token.NullLiteral) {
	            token = lex();
	            token.value = null;
	            expr = delegate.createLiteral(token);
	        } else if (match('/') || match('/=')) {
	            if (typeof extra.tokens !== 'undefined') {
	                expr = delegate.createLiteral(collectRegex());
	            } else {
	                expr = delegate.createLiteral(scanRegExp());
	            }
	            peek();
	        } else {
	            throwUnexpected(lex());
	        }
	
	        return delegate.markEnd(expr, startToken);
	    }
	
	    // 11.2 Left-Hand-Side Expressions
	
	    function parseArguments() {
	        var args = [];
	
	        expect('(');
	
	        if (!match(')')) {
	            while (index < length) {
	                args.push(parseAssignmentExpression());
	                if (match(')')) {
	                    break;
	                }
	                expect(',');
	            }
	        }
	
	        expect(')');
	
	        return args;
	    }
	
	    function parseNonComputedProperty() {
	        var token, startToken;
	
	        startToken = lookahead;
	        token = lex();
	
	        if (!isIdentifierName(token)) {
	            throwUnexpected(token);
	        }
	
	        return delegate.markEnd(delegate.createIdentifier(token.value), startToken);
	    }
	
	    function parseNonComputedMember() {
	        expect('.');
	
	        return parseNonComputedProperty();
	    }
	
	    function parseComputedMember() {
	        var expr;
	
	        expect('[');
	
	        expr = parseExpression();
	
	        expect(']');
	
	        return expr;
	    }
	
	    function parseNewExpression() {
	        var callee, args, startToken;
	
	        startToken = lookahead;
	        expectKeyword('new');
	        callee = parseLeftHandSideExpression();
	        args = match('(') ? parseArguments() : [];
	
	        return delegate.markEnd(delegate.createNewExpression(callee, args), startToken);
	    }
	
	    function parseLeftHandSideExpressionAllowCall() {
	        var previousAllowIn, expr, args, property, startToken;
	
	        startToken = lookahead;
	
	        previousAllowIn = state.allowIn;
	        state.allowIn = true;
	        expr = matchKeyword('new') ? parseNewExpression() : parsePrimaryExpression();
	        state.allowIn = previousAllowIn;
	
	        for (;;) {
	            if (match('.')) {
	                property = parseNonComputedMember();
	                expr = delegate.createMemberExpression('.', expr, property);
	            } else if (match('(')) {
	                args = parseArguments();
	                expr = delegate.createCallExpression(expr, args);
	            } else if (match('[')) {
	                property = parseComputedMember();
	                expr = delegate.createMemberExpression('[', expr, property);
	            } else {
	                break;
	            }
	            delegate.markEnd(expr, startToken);
	        }
	
	        return expr;
	    }
	
	    function parseLeftHandSideExpression() {
	        var previousAllowIn, expr, property, startToken;
	
	        startToken = lookahead;
	
	        previousAllowIn = state.allowIn;
	        expr = matchKeyword('new') ? parseNewExpression() : parsePrimaryExpression();
	        state.allowIn = previousAllowIn;
	
	        while (match('.') || match('[')) {
	            if (match('[')) {
	                property = parseComputedMember();
	                expr = delegate.createMemberExpression('[', expr, property);
	            } else {
	                property = parseNonComputedMember();
	                expr = delegate.createMemberExpression('.', expr, property);
	            }
	            delegate.markEnd(expr, startToken);
	        }
	
	        return expr;
	    }
	
	    // 11.3 Postfix Expressions
	
	    function parsePostfixExpression() {
	        var expr, token, startToken = lookahead;
	
	        expr = parseLeftHandSideExpressionAllowCall();
	
	        if (lookahead.type === Token.Punctuator) {
	            if ((match('++') || match('--')) && !peekLineTerminator()) {
	                // 11.3.1, 11.3.2
	                if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
	                    throwErrorTolerant({}, Messages.StrictLHSPostfix);
	                }
	
	                if (!isLeftHandSide(expr)) {
	                    throwErrorTolerant({}, Messages.InvalidLHSInAssignment);
	                }
	
	                token = lex();
	                expr = delegate.markEnd(delegate.createPostfixExpression(token.value, expr), startToken);
	            }
	        }
	
	        return expr;
	    }
	
	    // 11.4 Unary Operators
	
	    function parseUnaryExpression() {
	        var token, expr, startToken;
	
	        if (lookahead.type !== Token.Punctuator && lookahead.type !== Token.Keyword) {
	            expr = parsePostfixExpression();
	        } else if (match('++') || match('--')) {
	            startToken = lookahead;
	            token = lex();
	            expr = parseUnaryExpression();
	            // 11.4.4, 11.4.5
	            if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
	                throwErrorTolerant({}, Messages.StrictLHSPrefix);
	            }
	
	            if (!isLeftHandSide(expr)) {
	                throwErrorTolerant({}, Messages.InvalidLHSInAssignment);
	            }
	
	            expr = delegate.createUnaryExpression(token.value, expr);
	            expr = delegate.markEnd(expr, startToken);
	        } else if (match('+') || match('-') || match('~') || match('!')) {
	            startToken = lookahead;
	            token = lex();
	            expr = parseUnaryExpression();
	            expr = delegate.createUnaryExpression(token.value, expr);
	            expr = delegate.markEnd(expr, startToken);
	        } else if (matchKeyword('delete') || matchKeyword('void') || matchKeyword('typeof')) {
	            startToken = lookahead;
	            token = lex();
	            expr = parseUnaryExpression();
	            expr = delegate.createUnaryExpression(token.value, expr);
	            expr = delegate.markEnd(expr, startToken);
	            if (strict && expr.operator === 'delete' && expr.argument.type === Syntax.Identifier) {
	                throwErrorTolerant({}, Messages.StrictDelete);
	            }
	        } else {
	            expr = parsePostfixExpression();
	        }
	
	        return expr;
	    }
	
	    function binaryPrecedence(token, allowIn) {
	        var prec = 0;
	
	        if (token.type !== Token.Punctuator && token.type !== Token.Keyword) {
	            return 0;
	        }
	
	        switch (token.value) {
	        case '||':
	            prec = 1;
	            break;
	
	        case '&&':
	            prec = 2;
	            break;
	
	        case '|':
	            prec = 3;
	            break;
	
	        case '^':
	            prec = 4;
	            break;
	
	        case '&':
	            prec = 5;
	            break;
	
	        case '==':
	        case '!=':
	        case '===':
	        case '!==':
	            prec = 6;
	            break;
	
	        case '<':
	        case '>':
	        case '<=':
	        case '>=':
	        case 'instanceof':
	            prec = 7;
	            break;
	
	        case 'in':
	            prec = allowIn ? 7 : 0;
	            break;
	
	        case '<<':
	        case '>>':
	        case '>>>':
	            prec = 8;
	            break;
	
	        case '+':
	        case '-':
	            prec = 9;
	            break;
	
	        case '*':
	        case '/':
	        case '%':
	            prec = 11;
	            break;
	
	        default:
	            break;
	        }
	
	        return prec;
	    }
	
	    // 11.5 Multiplicative Operators
	    // 11.6 Additive Operators
	    // 11.7 Bitwise Shift Operators
	    // 11.8 Relational Operators
	    // 11.9 Equality Operators
	    // 11.10 Binary Bitwise Operators
	    // 11.11 Binary Logical Operators
	
	    function parseBinaryExpression() {
	        var marker, markers, expr, token, prec, stack, right, operator, left, i;
	
	        marker = lookahead;
	        left = parseUnaryExpression();
	
	        token = lookahead;
	        prec = binaryPrecedence(token, state.allowIn);
	        if (prec === 0) {
	            return left;
	        }
	        token.prec = prec;
	        lex();
	
	        markers = [marker, lookahead];
	        right = parseUnaryExpression();
	
	        stack = [left, token, right];
	
	        while ((prec = binaryPrecedence(lookahead, state.allowIn)) > 0) {
	
	            // Reduce: make a binary expression from the three topmost entries.
	            while ((stack.length > 2) && (prec <= stack[stack.length - 2].prec)) {
	                right = stack.pop();
	                operator = stack.pop().value;
	                left = stack.pop();
	                expr = delegate.createBinaryExpression(operator, left, right);
	                markers.pop();
	                marker = markers[markers.length - 1];
	                delegate.markEnd(expr, marker);
	                stack.push(expr);
	            }
	
	            // Shift.
	            token = lex();
	            token.prec = prec;
	            stack.push(token);
	            markers.push(lookahead);
	            expr = parseUnaryExpression();
	            stack.push(expr);
	        }
	
	        // Final reduce to clean-up the stack.
	        i = stack.length - 1;
	        expr = stack[i];
	        markers.pop();
	        while (i > 1) {
	            expr = delegate.createBinaryExpression(stack[i - 1].value, stack[i - 2], expr);
	            i -= 2;
	            marker = markers.pop();
	            delegate.markEnd(expr, marker);
	        }
	
	        return expr;
	    }
	
	
	    // 11.12 Conditional Operator
	
	    function parseConditionalExpression() {
	        var expr, previousAllowIn, consequent, alternate, startToken;
	
	        startToken = lookahead;
	
	        expr = parseBinaryExpression();
	
	        if (match('?')) {
	            lex();
	            previousAllowIn = state.allowIn;
	            state.allowIn = true;
	            consequent = parseAssignmentExpression();
	            state.allowIn = previousAllowIn;
	            expect(':');
	            alternate = parseAssignmentExpression();
	
	            expr = delegate.createConditionalExpression(expr, consequent, alternate);
	            delegate.markEnd(expr, startToken);
	        }
	
	        return expr;
	    }
	
	    // 11.13 Assignment Operators
	
	    function parseAssignmentExpression() {
	        var token, left, right, node, startToken;
	
	        token = lookahead;
	        startToken = lookahead;
	
	        node = left = parseConditionalExpression();
	
	        if (matchAssign()) {
	            // LeftHandSideExpression
	            if (!isLeftHandSide(left)) {
	                throwErrorTolerant({}, Messages.InvalidLHSInAssignment);
	            }
	
	            // 11.13.1
	            if (strict && left.type === Syntax.Identifier && isRestrictedWord(left.name)) {
	                throwErrorTolerant(token, Messages.StrictLHSAssignment);
	            }
	
	            token = lex();
	            right = parseAssignmentExpression();
	            node = delegate.markEnd(delegate.createAssignmentExpression(token.value, left, right), startToken);
	        }
	
	        return node;
	    }
	
	    // 11.14 Comma Operator
	
	    function parseExpression() {
	        var expr, startToken = lookahead;
	
	        expr = parseAssignmentExpression();
	
	        if (match(',')) {
	            expr = delegate.createSequenceExpression([ expr ]);
	
	            while (index < length) {
	                if (!match(',')) {
	                    break;
	                }
	                lex();
	                expr.expressions.push(parseAssignmentExpression());
	            }
	
	            delegate.markEnd(expr, startToken);
	        }
	
	        return expr;
	    }
	
	    // 12.1 Block
	
	    function parseStatementList() {
	        var list = [],
	            statement;
	
	        while (index < length) {
	            if (match('}')) {
	                break;
	            }
	            statement = parseSourceElement();
	            if (typeof statement === 'undefined') {
	                break;
	            }
	            list.push(statement);
	        }
	
	        return list;
	    }
	
	    function parseBlock() {
	        var block, startToken;
	
	        startToken = lookahead;
	        expect('{');
	
	        block = parseStatementList();
	
	        expect('}');
	
	        return delegate.markEnd(delegate.createBlockStatement(block), startToken);
	    }
	
	    // 12.2 Variable Statement
	
	    function parseVariableIdentifier() {
	        var token, startToken;
	
	        startToken = lookahead;
	        token = lex();
	
	        if (token.type !== Token.Identifier) {
	            throwUnexpected(token);
	        }
	
	        return delegate.markEnd(delegate.createIdentifier(token.value), startToken);
	    }
	
	    function parseVariableDeclaration(kind) {
	        var init = null, id, startToken;
	
	        startToken = lookahead;
	        id = parseVariableIdentifier();
	
	        // 12.2.1
	        if (strict && isRestrictedWord(id.name)) {
	            throwErrorTolerant({}, Messages.StrictVarName);
	        }
	
	        if (kind === 'const') {
	            expect('=');
	            init = parseAssignmentExpression();
	        } else if (match('=')) {
	            lex();
	            init = parseAssignmentExpression();
	        }
	
	        return delegate.markEnd(delegate.createVariableDeclarator(id, init), startToken);
	    }
	
	    function parseVariableDeclarationList(kind) {
	        var list = [];
	
	        do {
	            list.push(parseVariableDeclaration(kind));
	            if (!match(',')) {
	                break;
	            }
	            lex();
	        } while (index < length);
	
	        return list;
	    }
	
	    function parseVariableStatement() {
	        var declarations;
	
	        expectKeyword('var');
	
	        declarations = parseVariableDeclarationList();
	
	        consumeSemicolon();
	
	        return delegate.createVariableDeclaration(declarations, 'var');
	    }
	
	    // kind may be `const` or `let`
	    // Both are experimental and not in the specification yet.
	    // see http://wiki.ecmascript.org/doku.php?id=harmony:const
	    // and http://wiki.ecmascript.org/doku.php?id=harmony:let
	    function parseConstLetDeclaration(kind) {
	        var declarations, startToken;
	
	        startToken = lookahead;
	
	        expectKeyword(kind);
	
	        declarations = parseVariableDeclarationList(kind);
	
	        consumeSemicolon();
	
	        return delegate.markEnd(delegate.createVariableDeclaration(declarations, kind), startToken);
	    }
	
	    // 12.3 Empty Statement
	
	    function parseEmptyStatement() {
	        expect(';');
	        return delegate.createEmptyStatement();
	    }
	
	    // 12.4 Expression Statement
	
	    function parseExpressionStatement() {
	        var expr = parseExpression();
	        consumeSemicolon();
	        return delegate.createExpressionStatement(expr);
	    }
	
	    // 12.5 If statement
	
	    function parseIfStatement() {
	        var test, consequent, alternate;
	
	        expectKeyword('if');
	
	        expect('(');
	
	        test = parseExpression();
	
	        expect(')');
	
	        consequent = parseStatement();
	
	        if (matchKeyword('else')) {
	            lex();
	            alternate = parseStatement();
	        } else {
	            alternate = null;
	        }
	
	        return delegate.createIfStatement(test, consequent, alternate);
	    }
	
	    // 12.6 Iteration Statements
	
	    function parseDoWhileStatement() {
	        var body, test, oldInIteration;
	
	        expectKeyword('do');
	
	        oldInIteration = state.inIteration;
	        state.inIteration = true;
	
	        body = parseStatement();
	
	        state.inIteration = oldInIteration;
	
	        expectKeyword('while');
	
	        expect('(');
	
	        test = parseExpression();
	
	        expect(')');
	
	        if (match(';')) {
	            lex();
	        }
	
	        return delegate.createDoWhileStatement(body, test);
	    }
	
	    function parseWhileStatement() {
	        var test, body, oldInIteration;
	
	        expectKeyword('while');
	
	        expect('(');
	
	        test = parseExpression();
	
	        expect(')');
	
	        oldInIteration = state.inIteration;
	        state.inIteration = true;
	
	        body = parseStatement();
	
	        state.inIteration = oldInIteration;
	
	        return delegate.createWhileStatement(test, body);
	    }
	
	    function parseForVariableDeclaration() {
	        var token, declarations, startToken;
	
	        startToken = lookahead;
	        token = lex();
	        declarations = parseVariableDeclarationList();
	
	        return delegate.markEnd(delegate.createVariableDeclaration(declarations, token.value), startToken);
	    }
	
	    function parseForStatement() {
	        var init, test, update, left, right, body, oldInIteration;
	
	        init = test = update = null;
	
	        expectKeyword('for');
	
	        expect('(');
	
	        if (match(';')) {
	            lex();
	        } else {
	            if (matchKeyword('var') || matchKeyword('let')) {
	                state.allowIn = false;
	                init = parseForVariableDeclaration();
	                state.allowIn = true;
	
	                if (init.declarations.length === 1 && matchKeyword('in')) {
	                    lex();
	                    left = init;
	                    right = parseExpression();
	                    init = null;
	                }
	            } else {
	                state.allowIn = false;
	                init = parseExpression();
	                state.allowIn = true;
	
	                if (matchKeyword('in')) {
	                    // LeftHandSideExpression
	                    if (!isLeftHandSide(init)) {
	                        throwErrorTolerant({}, Messages.InvalidLHSInForIn);
	                    }
	
	                    lex();
	                    left = init;
	                    right = parseExpression();
	                    init = null;
	                }
	            }
	
	            if (typeof left === 'undefined') {
	                expect(';');
	            }
	        }
	
	        if (typeof left === 'undefined') {
	
	            if (!match(';')) {
	                test = parseExpression();
	            }
	            expect(';');
	
	            if (!match(')')) {
	                update = parseExpression();
	            }
	        }
	
	        expect(')');
	
	        oldInIteration = state.inIteration;
	        state.inIteration = true;
	
	        body = parseStatement();
	
	        state.inIteration = oldInIteration;
	
	        return (typeof left === 'undefined') ?
	                delegate.createForStatement(init, test, update, body) :
	                delegate.createForInStatement(left, right, body);
	    }
	
	    // 12.7 The continue statement
	
	    function parseContinueStatement() {
	        var label = null, key;
	
	        expectKeyword('continue');
	
	        // Optimize the most common form: 'continue;'.
	        if (source.charCodeAt(index) === 0x3B) {
	            lex();
	
	            if (!state.inIteration) {
	                throwError({}, Messages.IllegalContinue);
	            }
	
	            return delegate.createContinueStatement(null);
	        }
	
	        if (peekLineTerminator()) {
	            if (!state.inIteration) {
	                throwError({}, Messages.IllegalContinue);
	            }
	
	            return delegate.createContinueStatement(null);
	        }
	
	        if (lookahead.type === Token.Identifier) {
	            label = parseVariableIdentifier();
	
	            key = '$' + label.name;
	            if (!Object.prototype.hasOwnProperty.call(state.labelSet, key)) {
	                throwError({}, Messages.UnknownLabel, label.name);
	            }
	        }
	
	        consumeSemicolon();
	
	        if (label === null && !state.inIteration) {
	            throwError({}, Messages.IllegalContinue);
	        }
	
	        return delegate.createContinueStatement(label);
	    }
	
	    // 12.8 The break statement
	
	    function parseBreakStatement() {
	        var label = null, key;
	
	        expectKeyword('break');
	
	        // Catch the very common case first: immediately a semicolon (U+003B).
	        if (source.charCodeAt(index) === 0x3B) {
	            lex();
	
	            if (!(state.inIteration || state.inSwitch)) {
	                throwError({}, Messages.IllegalBreak);
	            }
	
	            return delegate.createBreakStatement(null);
	        }
	
	        if (peekLineTerminator()) {
	            if (!(state.inIteration || state.inSwitch)) {
	                throwError({}, Messages.IllegalBreak);
	            }
	
	            return delegate.createBreakStatement(null);
	        }
	
	        if (lookahead.type === Token.Identifier) {
	            label = parseVariableIdentifier();
	
	            key = '$' + label.name;
	            if (!Object.prototype.hasOwnProperty.call(state.labelSet, key)) {
	                throwError({}, Messages.UnknownLabel, label.name);
	            }
	        }
	
	        consumeSemicolon();
	
	        if (label === null && !(state.inIteration || state.inSwitch)) {
	            throwError({}, Messages.IllegalBreak);
	        }
	
	        return delegate.createBreakStatement(label);
	    }
	
	    // 12.9 The return statement
	
	    function parseReturnStatement() {
	        var argument = null;
	
	        expectKeyword('return');
	
	        if (!state.inFunctionBody) {
	            throwErrorTolerant({}, Messages.IllegalReturn);
	        }
	
	        // 'return' followed by a space and an identifier is very common.
	        if (source.charCodeAt(index) === 0x20) {
	            if (isIdentifierStart(source.charCodeAt(index + 1))) {
	                argument = parseExpression();
	                consumeSemicolon();
	                return delegate.createReturnStatement(argument);
	            }
	        }
	
	        if (peekLineTerminator()) {
	            return delegate.createReturnStatement(null);
	        }
	
	        if (!match(';')) {
	            if (!match('}') && lookahead.type !== Token.EOF) {
	                argument = parseExpression();
	            }
	        }
	
	        consumeSemicolon();
	
	        return delegate.createReturnStatement(argument);
	    }
	
	    // 12.10 The with statement
	
	    function parseWithStatement() {
	        var object, body;
	
	        if (strict) {
	            // TODO(ikarienator): Should we update the test cases instead?
	            skipComment();
	            throwErrorTolerant({}, Messages.StrictModeWith);
	        }
	
	        expectKeyword('with');
	
	        expect('(');
	
	        object = parseExpression();
	
	        expect(')');
	
	        body = parseStatement();
	
	        return delegate.createWithStatement(object, body);
	    }
	
	    // 12.10 The swith statement
	
	    function parseSwitchCase() {
	        var test, consequent = [], statement, startToken;
	
	        startToken = lookahead;
	        if (matchKeyword('default')) {
	            lex();
	            test = null;
	        } else {
	            expectKeyword('case');
	            test = parseExpression();
	        }
	        expect(':');
	
	        while (index < length) {
	            if (match('}') || matchKeyword('default') || matchKeyword('case')) {
	                break;
	            }
	            statement = parseStatement();
	            consequent.push(statement);
	        }
	
	        return delegate.markEnd(delegate.createSwitchCase(test, consequent), startToken);
	    }
	
	    function parseSwitchStatement() {
	        var discriminant, cases, clause, oldInSwitch, defaultFound;
	
	        expectKeyword('switch');
	
	        expect('(');
	
	        discriminant = parseExpression();
	
	        expect(')');
	
	        expect('{');
	
	        cases = [];
	
	        if (match('}')) {
	            lex();
	            return delegate.createSwitchStatement(discriminant, cases);
	        }
	
	        oldInSwitch = state.inSwitch;
	        state.inSwitch = true;
	        defaultFound = false;
	
	        while (index < length) {
	            if (match('}')) {
	                break;
	            }
	            clause = parseSwitchCase();
	            if (clause.test === null) {
	                if (defaultFound) {
	                    throwError({}, Messages.MultipleDefaultsInSwitch);
	                }
	                defaultFound = true;
	            }
	            cases.push(clause);
	        }
	
	        state.inSwitch = oldInSwitch;
	
	        expect('}');
	
	        return delegate.createSwitchStatement(discriminant, cases);
	    }
	
	    // 12.13 The throw statement
	
	    function parseThrowStatement() {
	        var argument;
	
	        expectKeyword('throw');
	
	        if (peekLineTerminator()) {
	            throwError({}, Messages.NewlineAfterThrow);
	        }
	
	        argument = parseExpression();
	
	        consumeSemicolon();
	
	        return delegate.createThrowStatement(argument);
	    }
	
	    // 12.14 The try statement
	
	    function parseCatchClause() {
	        var param, body, startToken;
	
	        startToken = lookahead;
	        expectKeyword('catch');
	
	        expect('(');
	        if (match(')')) {
	            throwUnexpected(lookahead);
	        }
	
	        param = parseVariableIdentifier();
	        // 12.14.1
	        if (strict && isRestrictedWord(param.name)) {
	            throwErrorTolerant({}, Messages.StrictCatchVariable);
	        }
	
	        expect(')');
	        body = parseBlock();
	        return delegate.markEnd(delegate.createCatchClause(param, body), startToken);
	    }
	
	    function parseTryStatement() {
	        var block, handlers = [], finalizer = null;
	
	        expectKeyword('try');
	
	        block = parseBlock();
	
	        if (matchKeyword('catch')) {
	            handlers.push(parseCatchClause());
	        }
	
	        if (matchKeyword('finally')) {
	            lex();
	            finalizer = parseBlock();
	        }
	
	        if (handlers.length === 0 && !finalizer) {
	            throwError({}, Messages.NoCatchOrFinally);
	        }
	
	        return delegate.createTryStatement(block, [], handlers, finalizer);
	    }
	
	    // 12.15 The debugger statement
	
	    function parseDebuggerStatement() {
	        expectKeyword('debugger');
	
	        consumeSemicolon();
	
	        return delegate.createDebuggerStatement();
	    }
	
	    // 12 Statements
	
	    function parseStatement() {
	        var type = lookahead.type,
	            expr,
	            labeledBody,
	            key,
	            startToken;
	
	        if (type === Token.EOF) {
	            throwUnexpected(lookahead);
	        }
	
	        if (type === Token.Punctuator && lookahead.value === '{') {
	            return parseBlock();
	        }
	
	        startToken = lookahead;
	
	        if (type === Token.Punctuator) {
	            switch (lookahead.value) {
	            case ';':
	                return delegate.markEnd(parseEmptyStatement(), startToken);
	            case '(':
	                return delegate.markEnd(parseExpressionStatement(), startToken);
	            default:
	                break;
	            }
	        }
	
	        if (type === Token.Keyword) {
	            switch (lookahead.value) {
	            case 'break':
	                return delegate.markEnd(parseBreakStatement(), startToken);
	            case 'continue':
	                return delegate.markEnd(parseContinueStatement(), startToken);
	            case 'debugger':
	                return delegate.markEnd(parseDebuggerStatement(), startToken);
	            case 'do':
	                return delegate.markEnd(parseDoWhileStatement(), startToken);
	            case 'for':
	                return delegate.markEnd(parseForStatement(), startToken);
	            case 'function':
	                return delegate.markEnd(parseFunctionDeclaration(), startToken);
	            case 'if':
	                return delegate.markEnd(parseIfStatement(), startToken);
	            case 'return':
	                return delegate.markEnd(parseReturnStatement(), startToken);
	            case 'switch':
	                return delegate.markEnd(parseSwitchStatement(), startToken);
	            case 'throw':
	                return delegate.markEnd(parseThrowStatement(), startToken);
	            case 'try':
	                return delegate.markEnd(parseTryStatement(), startToken);
	            case 'var':
	                return delegate.markEnd(parseVariableStatement(), startToken);
	            case 'while':
	                return delegate.markEnd(parseWhileStatement(), startToken);
	            case 'with':
	                return delegate.markEnd(parseWithStatement(), startToken);
	            default:
	                break;
	            }
	        }
	
	        expr = parseExpression();
	
	        // 12.12 Labelled Statements
	        if ((expr.type === Syntax.Identifier) && match(':')) {
	            lex();
	
	            key = '$' + expr.name;
	            if (Object.prototype.hasOwnProperty.call(state.labelSet, key)) {
	                throwError({}, Messages.Redeclaration, 'Label', expr.name);
	            }
	
	            state.labelSet[key] = true;
	            labeledBody = parseStatement();
	            delete state.labelSet[key];
	            return delegate.markEnd(delegate.createLabeledStatement(expr, labeledBody), startToken);
	        }
	
	        consumeSemicolon();
	
	        return delegate.markEnd(delegate.createExpressionStatement(expr), startToken);
	    }
	
	    // 13 Function Definition
	
	    function parseFunctionSourceElements() {
	        var sourceElement, sourceElements = [], token, directive, firstRestricted,
	            oldLabelSet, oldInIteration, oldInSwitch, oldInFunctionBody, startToken;
	
	        startToken = lookahead;
	        expect('{');
	
	        while (index < length) {
	            if (lookahead.type !== Token.StringLiteral) {
	                break;
	            }
	            token = lookahead;
	
	            sourceElement = parseSourceElement();
	            sourceElements.push(sourceElement);
	            if (sourceElement.expression.type !== Syntax.Literal) {
	                // this is not directive
	                break;
	            }
	            directive = source.slice(token.start + 1, token.end - 1);
	            if (directive === 'use strict') {
	                strict = true;
	                if (firstRestricted) {
	                    throwErrorTolerant(firstRestricted, Messages.StrictOctalLiteral);
	                }
	            } else {
	                if (!firstRestricted && token.octal) {
	                    firstRestricted = token;
	                }
	            }
	        }
	
	        oldLabelSet = state.labelSet;
	        oldInIteration = state.inIteration;
	        oldInSwitch = state.inSwitch;
	        oldInFunctionBody = state.inFunctionBody;
	
	        state.labelSet = {};
	        state.inIteration = false;
	        state.inSwitch = false;
	        state.inFunctionBody = true;
	
	        while (index < length) {
	            if (match('}')) {
	                break;
	            }
	            sourceElement = parseSourceElement();
	            if (typeof sourceElement === 'undefined') {
	                break;
	            }
	            sourceElements.push(sourceElement);
	        }
	
	        expect('}');
	
	        state.labelSet = oldLabelSet;
	        state.inIteration = oldInIteration;
	        state.inSwitch = oldInSwitch;
	        state.inFunctionBody = oldInFunctionBody;
	
	        return delegate.markEnd(delegate.createBlockStatement(sourceElements), startToken);
	    }
	
	    function parseParams(firstRestricted) {
	        var param, params = [], token, stricted, paramSet, key, message;
	        expect('(');
	
	        if (!match(')')) {
	            paramSet = {};
	            while (index < length) {
	                token = lookahead;
	                param = parseVariableIdentifier();
	                key = '$' + token.value;
	                if (strict) {
	                    if (isRestrictedWord(token.value)) {
	                        stricted = token;
	                        message = Messages.StrictParamName;
	                    }
	                    if (Object.prototype.hasOwnProperty.call(paramSet, key)) {
	                        stricted = token;
	                        message = Messages.StrictParamDupe;
	                    }
	                } else if (!firstRestricted) {
	                    if (isRestrictedWord(token.value)) {
	                        firstRestricted = token;
	                        message = Messages.StrictParamName;
	                    } else if (isStrictModeReservedWord(token.value)) {
	                        firstRestricted = token;
	                        message = Messages.StrictReservedWord;
	                    } else if (Object.prototype.hasOwnProperty.call(paramSet, key)) {
	                        firstRestricted = token;
	                        message = Messages.StrictParamDupe;
	                    }
	                }
	                params.push(param);
	                paramSet[key] = true;
	                if (match(')')) {
	                    break;
	                }
	                expect(',');
	            }
	        }
	
	        expect(')');
	
	        return {
	            params: params,
	            stricted: stricted,
	            firstRestricted: firstRestricted,
	            message: message
	        };
	    }
	
	    function parseFunctionDeclaration() {
	        var id, params = [], body, token, stricted, tmp, firstRestricted, message, previousStrict, startToken;
	
	        startToken = lookahead;
	
	        expectKeyword('function');
	        token = lookahead;
	        id = parseVariableIdentifier();
	        if (strict) {
	            if (isRestrictedWord(token.value)) {
	                throwErrorTolerant(token, Messages.StrictFunctionName);
	            }
	        } else {
	            if (isRestrictedWord(token.value)) {
	                firstRestricted = token;
	                message = Messages.StrictFunctionName;
	            } else if (isStrictModeReservedWord(token.value)) {
	                firstRestricted = token;
	                message = Messages.StrictReservedWord;
	            }
	        }
	
	        tmp = parseParams(firstRestricted);
	        params = tmp.params;
	        stricted = tmp.stricted;
	        firstRestricted = tmp.firstRestricted;
	        if (tmp.message) {
	            message = tmp.message;
	        }
	
	        previousStrict = strict;
	        body = parseFunctionSourceElements();
	        if (strict && firstRestricted) {
	            throwError(firstRestricted, message);
	        }
	        if (strict && stricted) {
	            throwErrorTolerant(stricted, message);
	        }
	        strict = previousStrict;
	
	        return delegate.markEnd(delegate.createFunctionDeclaration(id, params, [], body), startToken);
	    }
	
	    function parseFunctionExpression() {
	        var token, id = null, stricted, firstRestricted, message, tmp, params = [], body, previousStrict, startToken;
	
	        startToken = lookahead;
	        expectKeyword('function');
	
	        if (!match('(')) {
	            token = lookahead;
	            id = parseVariableIdentifier();
	            if (strict) {
	                if (isRestrictedWord(token.value)) {
	                    throwErrorTolerant(token, Messages.StrictFunctionName);
	                }
	            } else {
	                if (isRestrictedWord(token.value)) {
	                    firstRestricted = token;
	                    message = Messages.StrictFunctionName;
	                } else if (isStrictModeReservedWord(token.value)) {
	                    firstRestricted = token;
	                    message = Messages.StrictReservedWord;
	                }
	            }
	        }
	
	        tmp = parseParams(firstRestricted);
	        params = tmp.params;
	        stricted = tmp.stricted;
	        firstRestricted = tmp.firstRestricted;
	        if (tmp.message) {
	            message = tmp.message;
	        }
	
	        previousStrict = strict;
	        body = parseFunctionSourceElements();
	        if (strict && firstRestricted) {
	            throwError(firstRestricted, message);
	        }
	        if (strict && stricted) {
	            throwErrorTolerant(stricted, message);
	        }
	        strict = previousStrict;
	
	        return delegate.markEnd(delegate.createFunctionExpression(id, params, [], body), startToken);
	    }
	
	    // 14 Program
	
	    function parseSourceElement() {
	        if (lookahead.type === Token.Keyword) {
	            switch (lookahead.value) {
	            case 'const':
	            case 'let':
	                return parseConstLetDeclaration(lookahead.value);
	            case 'function':
	                return parseFunctionDeclaration();
	            default:
	                return parseStatement();
	            }
	        }
	
	        if (lookahead.type !== Token.EOF) {
	            return parseStatement();
	        }
	    }
	
	    function parseSourceElements() {
	        var sourceElement, sourceElements = [], token, directive, firstRestricted;
	
	        while (index < length) {
	            token = lookahead;
	            if (token.type !== Token.StringLiteral) {
	                break;
	            }
	
	            sourceElement = parseSourceElement();
	            sourceElements.push(sourceElement);
	            if (sourceElement.expression.type !== Syntax.Literal) {
	                // this is not directive
	                break;
	            }
	            directive = source.slice(token.start + 1, token.end - 1);
	            if (directive === 'use strict') {
	                strict = true;
	                if (firstRestricted) {
	                    throwErrorTolerant(firstRestricted, Messages.StrictOctalLiteral);
	                }
	            } else {
	                if (!firstRestricted && token.octal) {
	                    firstRestricted = token;
	                }
	            }
	        }
	
	        while (index < length) {
	            sourceElement = parseSourceElement();
	            /* istanbul ignore if */
	            if (typeof sourceElement === 'undefined') {
	                break;
	            }
	            sourceElements.push(sourceElement);
	        }
	        return sourceElements;
	    }
	
	    function parseProgram() {
	        var body, startToken;
	
	        skipComment();
	        peek();
	        startToken = lookahead;
	        strict = false;
	
	        body = parseSourceElements();
	        return delegate.markEnd(delegate.createProgram(body), startToken);
	    }
	
	    function filterTokenLocation() {
	        var i, entry, token, tokens = [];
	
	        for (i = 0; i < extra.tokens.length; ++i) {
	            entry = extra.tokens[i];
	            token = {
	                type: entry.type,
	                value: entry.value
	            };
	            if (extra.range) {
	                token.range = entry.range;
	            }
	            if (extra.loc) {
	                token.loc = entry.loc;
	            }
	            tokens.push(token);
	        }
	
	        extra.tokens = tokens;
	    }
	
	    function tokenize(code, options) {
	        var toString,
	            token,
	            tokens;
	
	        toString = String;
	        if (typeof code !== 'string' && !(code instanceof String)) {
	            code = toString(code);
	        }
	
	        delegate = SyntaxTreeDelegate;
	        source = code;
	        index = 0;
	        lineNumber = (source.length > 0) ? 1 : 0;
	        lineStart = 0;
	        length = source.length;
	        lookahead = null;
	        state = {
	            allowIn: true,
	            labelSet: {},
	            inFunctionBody: false,
	            inIteration: false,
	            inSwitch: false,
	            lastCommentStart: -1
	        };
	
	        extra = {};
	
	        // Options matching.
	        options = options || {};
	
	        // Of course we collect tokens here.
	        options.tokens = true;
	        extra.tokens = [];
	        extra.tokenize = true;
	        // The following two fields are necessary to compute the Regex tokens.
	        extra.openParenToken = -1;
	        extra.openCurlyToken = -1;
	
	        extra.range = (typeof options.range === 'boolean') && options.range;
	        extra.loc = (typeof options.loc === 'boolean') && options.loc;
	
	        if (typeof options.comment === 'boolean' && options.comment) {
	            extra.comments = [];
	        }
	        if (typeof options.tolerant === 'boolean' && options.tolerant) {
	            extra.errors = [];
	        }
	
	        try {
	            peek();
	            if (lookahead.type === Token.EOF) {
	                return extra.tokens;
	            }
	
	            token = lex();
	            while (lookahead.type !== Token.EOF) {
	                try {
	                    token = lex();
	                } catch (lexError) {
	                    token = lookahead;
	                    if (extra.errors) {
	                        extra.errors.push(lexError);
	                        // We have to break on the first error
	                        // to avoid infinite loops.
	                        break;
	                    } else {
	                        throw lexError;
	                    }
	                }
	            }
	
	            filterTokenLocation();
	            tokens = extra.tokens;
	            if (typeof extra.comments !== 'undefined') {
	                tokens.comments = extra.comments;
	            }
	            if (typeof extra.errors !== 'undefined') {
	                tokens.errors = extra.errors;
	            }
	        } catch (e) {
	            throw e;
	        } finally {
	            extra = {};
	        }
	        return tokens;
	    }
	
	    function parse(code, options) {
	        var program, toString;
	
	        toString = String;
	        if (typeof code !== 'string' && !(code instanceof String)) {
	            code = toString(code);
	        }
	
	        delegate = SyntaxTreeDelegate;
	        source = code;
	        index = 0;
	        lineNumber = (source.length > 0) ? 1 : 0;
	        lineStart = 0;
	        length = source.length;
	        lookahead = null;
	        state = {
	            allowIn: true,
	            labelSet: {},
	            inFunctionBody: false,
	            inIteration: false,
	            inSwitch: false,
	            lastCommentStart: -1
	        };
	
	        extra = {};
	        if (typeof options !== 'undefined') {
	            extra.range = (typeof options.range === 'boolean') && options.range;
	            extra.loc = (typeof options.loc === 'boolean') && options.loc;
	            extra.attachComment = (typeof options.attachComment === 'boolean') && options.attachComment;
	
	            if (extra.loc && options.source !== null && options.source !== undefined) {
	                extra.source = toString(options.source);
	            }
	
	            if (typeof options.tokens === 'boolean' && options.tokens) {
	                extra.tokens = [];
	            }
	            if (typeof options.comment === 'boolean' && options.comment) {
	                extra.comments = [];
	            }
	            if (typeof options.tolerant === 'boolean' && options.tolerant) {
	                extra.errors = [];
	            }
	            if (extra.attachComment) {
	                extra.range = true;
	                extra.comments = [];
	                extra.bottomRightStack = [];
	                extra.trailingComments = [];
	                extra.leadingComments = [];
	            }
	        }
	
	        try {
	            program = parseProgram();
	            if (typeof extra.comments !== 'undefined') {
	                program.comments = extra.comments;
	            }
	            if (typeof extra.tokens !== 'undefined') {
	                filterTokenLocation();
	                program.tokens = extra.tokens;
	            }
	            if (typeof extra.errors !== 'undefined') {
	                program.errors = extra.errors;
	            }
	        } catch (e) {
	            throw e;
	        } finally {
	            extra = {};
	        }
	
	        return program;
	    }
	
	    // Sync with *.json manifests.
	    exports.version = '1.2.2';
	
	    exports.tokenize = tokenize;
	
	    exports.parse = parse;
	
	    // Deep copy.
	   /* istanbul ignore next */
	    exports.Syntax = (function () {
	        var name, types = {};
	
	        if (typeof Object.create === 'function') {
	            types = Object.create(null);
	        }
	
	        for (name in Syntax) {
	            if (Syntax.hasOwnProperty(name)) {
	                types[name] = Syntax[name];
	            }
	        }
	
	        if (typeof Object.freeze === 'function') {
	            Object.freeze(types);
	        }
	
	        return types;
	    }());
	
	}));
	/* vim: set sw=4 ts=4 et tw=80 : */
	


/***/ }),
/* 25 */
/***/ (function(module, exports) {

	module.exports = function(arr, start, end, step) {
	
	  if (typeof start == 'string') throw new Error("start cannot be a string");
	  if (typeof end == 'string') throw new Error("end cannot be a string");
	  if (typeof step == 'string') throw new Error("step cannot be a string");
	
	  var len = arr.length;
	
	  if (step === 0) throw new Error("step cannot be zero");
	  step = step ? integer(step) : 1;
	
	  // normalize negative values
	  start = start < 0 ? len + start : start;
	  end = end < 0 ? len + end : end;
	
	  // default extents to extents
	  start = integer(start === 0 ? 0 : !start ? (step > 0 ? 0 : len - 1) : start);
	  end = integer(end === 0 ? 0 : !end ? (step > 0 ? len : -1) : end);
	
	  // clamp extents
	  start = step > 0 ? Math.max(0, start) : Math.min(len, start);
	  end = step > 0 ? Math.min(end, len) : Math.max(-1, end);
	
	  // return empty if extents are backwards
	  if (step > 0 && end <= start) return [];
	  if (step < 0 && start <= end) return [];
	
	  var result = [];
	
	  for (var i = start; i != end; i += step) {
	    if ((step < 0 && i <= end) || (step > 0 && i >= end)) break;
	    result.push(arr[i]);
	  }
	
	  return result;
	}
	
	function integer(val) {
	  return String(val).match(/^[0-9]+$/) ? parseInt(val) :
	    Number.isFinite(val) ? parseInt(val, 10) : 0;
	}


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	var unparse = __webpack_require__(27).generate;
	
	module.exports = function (ast, vars) {
	    if (!vars) vars = {};
	    var FAIL = {};
	    
	    var result = (function walk (node) {
	        if (node.type === 'Literal') {
	            return node.value;
	        }
	        else if (node.type === 'UnaryExpression'){
	            var val = walk(node.argument)
	            if (node.operator === '+') return +val
	            if (node.operator === '-') return -val
	            if (node.operator === '~') return ~val
	            if (node.operator === '!') return !val
	            return FAIL
	        }
	        else if (node.type === 'ArrayExpression') {
	            var xs = [];
	            for (var i = 0, l = node.elements.length; i < l; i++) {
	                var x = walk(node.elements[i]);
	                if (x === FAIL) return FAIL;
	                xs.push(x);
	            }
	            return xs;
	        }
	        else if (node.type === 'ObjectExpression') {
	            var obj = {};
	            for (var i = 0; i < node.properties.length; i++) {
	                var prop = node.properties[i];
	                var value = prop.value === null
	                    ? prop.value
	                    : walk(prop.value)
	                ;
	                if (value === FAIL) return FAIL;
	                obj[prop.key.value || prop.key.name] = value;
	            }
	            return obj;
	        }
	        else if (node.type === 'BinaryExpression' ||
	                 node.type === 'LogicalExpression') {
	            var l = walk(node.left);
	            if (l === FAIL) return FAIL;
	            var r = walk(node.right);
	            if (r === FAIL) return FAIL;
	            
	            var op = node.operator;
	            if (op === '==') return l == r;
	            if (op === '===') return l === r;
	            if (op === '!=') return l != r;
	            if (op === '!==') return l !== r;
	            if (op === '+') return l + r;
	            if (op === '-') return l - r;
	            if (op === '*') return l * r;
	            if (op === '/') return l / r;
	            if (op === '%') return l % r;
	            if (op === '<') return l < r;
	            if (op === '<=') return l <= r;
	            if (op === '>') return l > r;
	            if (op === '>=') return l >= r;
	            if (op === '|') return l | r;
	            if (op === '&') return l & r;
	            if (op === '^') return l ^ r;
	            if (op === '&&') return l && r;
	            if (op === '||') return l || r;
	            
	            return FAIL;
	        }
	        else if (node.type === 'Identifier') {
	            if ({}.hasOwnProperty.call(vars, node.name)) {
	                return vars[node.name];
	            }
	            else return FAIL;
	        }
	        else if (node.type === 'CallExpression') {
	            var callee = walk(node.callee);
	            if (callee === FAIL) return FAIL;
	            
	            var ctx = node.callee.object ? walk(node.callee.object) : FAIL;
	            if (ctx === FAIL) ctx = null;
	
	            var args = [];
	            for (var i = 0, l = node.arguments.length; i < l; i++) {
	                var x = walk(node.arguments[i]);
	                if (x === FAIL) return FAIL;
	                args.push(x);
	            }
	            return callee.apply(ctx, args);
	        }
	        else if (node.type === 'MemberExpression') {
	            var obj = walk(node.object);
	            if (obj === FAIL) return FAIL;
	            if (node.property.type === 'Identifier') {
	                return obj[node.property.name];
	            }
	            var prop = walk(node.property);
	            if (prop === FAIL) return FAIL;
	            return obj[prop];
	        }
	        else if (node.type === 'ConditionalExpression') {
	            var val = walk(node.test)
	            if (val === FAIL) return FAIL;
	            return val ? walk(node.consequent) : walk(node.alternate)
	        }
	        else if (node.type === 'FunctionExpression') {
	            return Function('return ' + unparse(node))();
	        }
	        else return FAIL;
	    })(ast);
	    
	    return result === FAIL ? undefined : result;
	};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/*
	  Copyright (C) 2012-2013 Yusuke Suzuki <utatane.tea@gmail.com>
	  Copyright (C) 2012-2013 Michael Ficarra <escodegen.copyright@michael.ficarra.me>
	  Copyright (C) 2012-2013 Mathias Bynens <mathias@qiwi.be>
	  Copyright (C) 2013 Irakli Gozalishvili <rfobic@gmail.com>
	  Copyright (C) 2012 Robert Gust-Bardon <donate@robert.gust-bardon.org>
	  Copyright (C) 2012 John Freeman <jfreeman08@gmail.com>
	  Copyright (C) 2011-2012 Ariya Hidayat <ariya.hidayat@gmail.com>
	  Copyright (C) 2012 Joost-Wim Boekesteijn <joost-wim@boekesteijn.nl>
	  Copyright (C) 2012 Kris Kowal <kris.kowal@cixar.com>
	  Copyright (C) 2012 Arpad Borsos <arpad.borsos@googlemail.com>
	
	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:
	
	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.
	
	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/
	
	/*global exports:true, generateStatement:true, generateExpression:true, require:true, global:true*/
	(function () {
	    'use strict';
	
	    var Syntax,
	        Precedence,
	        BinaryPrecedence,
	        Regex,
	        SourceNode,
	        estraverse,
	        isArray,
	        base,
	        indent,
	        json,
	        renumber,
	        hexadecimal,
	        quotes,
	        escapeless,
	        newline,
	        space,
	        parentheses,
	        semicolons,
	        safeConcatenation,
	        directive,
	        extra,
	        parse,
	        sourceMap,
	        FORMAT_MINIFY,
	        FORMAT_DEFAULTS;
	
	    estraverse = __webpack_require__(28);
	
	    Syntax = {
	        AssignmentExpression: 'AssignmentExpression',
	        ArrayExpression: 'ArrayExpression',
	        ArrayPattern: 'ArrayPattern',
	        ArrowFunctionExpression: 'ArrowFunctionExpression',
	        BlockStatement: 'BlockStatement',
	        BinaryExpression: 'BinaryExpression',
	        BreakStatement: 'BreakStatement',
	        CallExpression: 'CallExpression',
	        CatchClause: 'CatchClause',
	        ComprehensionBlock: 'ComprehensionBlock',
	        ComprehensionExpression: 'ComprehensionExpression',
	        ConditionalExpression: 'ConditionalExpression',
	        ContinueStatement: 'ContinueStatement',
	        DirectiveStatement: 'DirectiveStatement',
	        DoWhileStatement: 'DoWhileStatement',
	        DebuggerStatement: 'DebuggerStatement',
	        EmptyStatement: 'EmptyStatement',
	        ExpressionStatement: 'ExpressionStatement',
	        ForStatement: 'ForStatement',
	        ForInStatement: 'ForInStatement',
	        FunctionDeclaration: 'FunctionDeclaration',
	        FunctionExpression: 'FunctionExpression',
	        Identifier: 'Identifier',
	        IfStatement: 'IfStatement',
	        Literal: 'Literal',
	        LabeledStatement: 'LabeledStatement',
	        LogicalExpression: 'LogicalExpression',
	        MemberExpression: 'MemberExpression',
	        NewExpression: 'NewExpression',
	        ObjectExpression: 'ObjectExpression',
	        ObjectPattern: 'ObjectPattern',
	        Program: 'Program',
	        Property: 'Property',
	        ReturnStatement: 'ReturnStatement',
	        SequenceExpression: 'SequenceExpression',
	        SwitchStatement: 'SwitchStatement',
	        SwitchCase: 'SwitchCase',
	        ThisExpression: 'ThisExpression',
	        ThrowStatement: 'ThrowStatement',
	        TryStatement: 'TryStatement',
	        UnaryExpression: 'UnaryExpression',
	        UpdateExpression: 'UpdateExpression',
	        VariableDeclaration: 'VariableDeclaration',
	        VariableDeclarator: 'VariableDeclarator',
	        WhileStatement: 'WhileStatement',
	        WithStatement: 'WithStatement',
	        YieldExpression: 'YieldExpression'
	
	    };
	
	    Precedence = {
	        Sequence: 0,
	        Assignment: 1,
	        Conditional: 2,
	        ArrowFunction: 2,
	        LogicalOR: 3,
	        LogicalAND: 4,
	        BitwiseOR: 5,
	        BitwiseXOR: 6,
	        BitwiseAND: 7,
	        Equality: 8,
	        Relational: 9,
	        BitwiseSHIFT: 10,
	        Additive: 11,
	        Multiplicative: 12,
	        Unary: 13,
	        Postfix: 14,
	        Call: 15,
	        New: 16,
	        Member: 17,
	        Primary: 18
	    };
	
	    BinaryPrecedence = {
	        '||': Precedence.LogicalOR,
	        '&&': Precedence.LogicalAND,
	        '|': Precedence.BitwiseOR,
	        '^': Precedence.BitwiseXOR,
	        '&': Precedence.BitwiseAND,
	        '==': Precedence.Equality,
	        '!=': Precedence.Equality,
	        '===': Precedence.Equality,
	        '!==': Precedence.Equality,
	        'is': Precedence.Equality,
	        'isnt': Precedence.Equality,
	        '<': Precedence.Relational,
	        '>': Precedence.Relational,
	        '<=': Precedence.Relational,
	        '>=': Precedence.Relational,
	        'in': Precedence.Relational,
	        'instanceof': Precedence.Relational,
	        '<<': Precedence.BitwiseSHIFT,
	        '>>': Precedence.BitwiseSHIFT,
	        '>>>': Precedence.BitwiseSHIFT,
	        '+': Precedence.Additive,
	        '-': Precedence.Additive,
	        '*': Precedence.Multiplicative,
	        '%': Precedence.Multiplicative,
	        '/': Precedence.Multiplicative
	    };
	
	    Regex = {
	        NonAsciiIdentifierPart: new RegExp('[\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0300-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u0483-\u0487\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u05d0-\u05ea\u05f0-\u05f2\u0610-\u061a\u0620-\u0669\u066e-\u06d3\u06d5-\u06dc\u06df-\u06e8\u06ea-\u06fc\u06ff\u0710-\u074a\u074d-\u07b1\u07c0-\u07f5\u07fa\u0800-\u082d\u0840-\u085b\u08a0\u08a2-\u08ac\u08e4-\u08fe\u0900-\u0963\u0966-\u096f\u0971-\u0977\u0979-\u097f\u0981-\u0983\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bc-\u09c4\u09c7\u09c8\u09cb-\u09ce\u09d7\u09dc\u09dd\u09df-\u09e3\u09e6-\u09f1\u0a01-\u0a03\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a59-\u0a5c\u0a5e\u0a66-\u0a75\u0a81-\u0a83\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abc-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ad0\u0ae0-\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3c-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b5c\u0b5d\u0b5f-\u0b63\u0b66-\u0b6f\u0b71\u0b82\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd0\u0bd7\u0be6-\u0bef\u0c01-\u0c03\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c58\u0c59\u0c60-\u0c63\u0c66-\u0c6f\u0c82\u0c83\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbc-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0cde\u0ce0-\u0ce3\u0ce6-\u0cef\u0cf1\u0cf2\u0d02\u0d03\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d-\u0d44\u0d46-\u0d48\u0d4a-\u0d4e\u0d57\u0d60-\u0d63\u0d66-\u0d6f\u0d7a-\u0d7f\u0d82\u0d83\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e01-\u0e3a\u0e40-\u0e4e\u0e50-\u0e59\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb9\u0ebb-\u0ebd\u0ec0-\u0ec4\u0ec6\u0ec8-\u0ecd\u0ed0-\u0ed9\u0edc-\u0edf\u0f00\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e-\u0f47\u0f49-\u0f6c\u0f71-\u0f84\u0f86-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u1049\u1050-\u109d\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u135d-\u135f\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176c\u176e-\u1770\u1772\u1773\u1780-\u17d3\u17d7\u17dc\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u1820-\u1877\u1880-\u18aa\u18b0-\u18f5\u1900-\u191c\u1920-\u192b\u1930-\u193b\u1946-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u19d0-\u19d9\u1a00-\u1a1b\u1a20-\u1a5e\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1aa7\u1b00-\u1b4b\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1bf3\u1c00-\u1c37\u1c40-\u1c49\u1c4d-\u1c7d\u1cd0-\u1cd2\u1cd4-\u1cf6\u1d00-\u1de6\u1dfc-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u200c\u200d\u203f\u2040\u2054\u2071\u207f\u2090-\u209c\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d7f-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2de0-\u2dff\u2e2f\u3005-\u3007\u3021-\u302f\u3031-\u3035\u3038-\u303c\u3041-\u3096\u3099\u309a\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua62b\ua640-\ua66f\ua674-\ua67d\ua67f-\ua697\ua69f-\ua6f1\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua827\ua840-\ua873\ua880-\ua8c4\ua8d0-\ua8d9\ua8e0-\ua8f7\ua8fb\ua900-\ua92d\ua930-\ua953\ua960-\ua97c\ua980-\ua9c0\ua9cf-\ua9d9\uaa00-\uaa36\uaa40-\uaa4d\uaa50-\uaa59\uaa60-\uaa76\uaa7a\uaa7b\uaa80-\uaac2\uaadb-\uaadd\uaae0-\uaaef\uaaf2-\uaaf6\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabea\uabec\uabed\uabf0-\uabf9\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe00-\ufe0f\ufe20-\ufe26\ufe33\ufe34\ufe4d-\ufe4f\ufe70-\ufe74\ufe76-\ufefc\uff10-\uff19\uff21-\uff3a\uff3f\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc]')
	    };
	
	    function getDefaultOptions() {
	        // default options
	        return {
	            indent: null,
	            base: null,
	            parse: null,
	            comment: false,
	            format: {
	                indent: {
	                    style: '    ',
	                    base: 0,
	                    adjustMultilineComment: false
	                },
	                newline: '\n',
	                space: ' ',
	                json: false,
	                renumber: false,
	                hexadecimal: false,
	                quotes: 'single',
	                escapeless: false,
	                compact: false,
	                parentheses: true,
	                semicolons: true,
	                safeConcatenation: false
	            },
	            moz: {
	                starlessGenerator: false,
	                parenthesizedComprehensionBlock: false
	            },
	            sourceMap: null,
	            sourceMapRoot: null,
	            sourceMapWithCode: false,
	            directive: false,
	            verbatim: null
	        };
	    }
	
	    function stringToArray(str) {
	        var length = str.length,
	            result = [],
	            i;
	        for (i = 0; i < length; i += 1) {
	            result[i] = str.charAt(i);
	        }
	        return result;
	    }
	
	    function stringRepeat(str, num) {
	        var result = '';
	
	        for (num |= 0; num > 0; num >>>= 1, str += str) {
	            if (num & 1) {
	                result += str;
	            }
	        }
	
	        return result;
	    }
	
	    isArray = Array.isArray;
	    if (!isArray) {
	        isArray = function isArray(array) {
	            return Object.prototype.toString.call(array) === '[object Array]';
	        };
	    }
	
	    // Fallback for the non SourceMap environment
	    function SourceNodeMock(line, column, filename, chunk) {
	        var result = [];
	
	        function flatten(input) {
	            var i, iz;
	            if (isArray(input)) {
	                for (i = 0, iz = input.length; i < iz; ++i) {
	                    flatten(input[i]);
	                }
	            } else if (input instanceof SourceNodeMock) {
	                result.push(input);
	            } else if (typeof input === 'string' && input) {
	                result.push(input);
	            }
	        }
	
	        flatten(chunk);
	        this.children = result;
	    }
	
	    SourceNodeMock.prototype.toString = function toString() {
	        var res = '', i, iz, node;
	        for (i = 0, iz = this.children.length; i < iz; ++i) {
	            node = this.children[i];
	            if (node instanceof SourceNodeMock) {
	                res += node.toString();
	            } else {
	                res += node;
	            }
	        }
	        return res;
	    };
	
	    SourceNodeMock.prototype.replaceRight = function replaceRight(pattern, replacement) {
	        var last = this.children[this.children.length - 1];
	        if (last instanceof SourceNodeMock) {
	            last.replaceRight(pattern, replacement);
	        } else if (typeof last === 'string') {
	            this.children[this.children.length - 1] = last.replace(pattern, replacement);
	        } else {
	            this.children.push(''.replace(pattern, replacement));
	        }
	        return this;
	    };
	
	    SourceNodeMock.prototype.join = function join(sep) {
	        var i, iz, result;
	        result = [];
	        iz = this.children.length;
	        if (iz > 0) {
	            for (i = 0, iz -= 1; i < iz; ++i) {
	                result.push(this.children[i], sep);
	            }
	            result.push(this.children[iz]);
	            this.children = result;
	        }
	        return this;
	    };
	
	    function hasLineTerminator(str) {
	        return (/[\r\n]/g).test(str);
	    }
	
	    function endsWithLineTerminator(str) {
	        var ch = str.charAt(str.length - 1);
	        return ch && isLineTerminator(ch);
	    }
	
	    function updateDeeply(target, override) {
	        var key, val;
	
	        function isHashObject(target) {
	            return typeof target === 'object' && target instanceof Object && !(target instanceof RegExp);
	        }
	
	        for (key in override) {
	            if (override.hasOwnProperty(key)) {
	                val = override[key];
	                if (isHashObject(val)) {
	                    if (isHashObject(target[key])) {
	                        updateDeeply(target[key], val);
	                    } else {
	                        target[key] = updateDeeply({}, val);
	                    }
	                } else {
	                    target[key] = val;
	                }
	            }
	        }
	        return target;
	    }
	
	    function generateNumber(value) {
	        var result, point, temp, exponent, pos;
	
	        if (value !== value) {
	            throw new Error('Numeric literal whose value is NaN');
	        }
	        if (value < 0 || (value === 0 && 1 / value < 0)) {
	            throw new Error('Numeric literal whose value is negative');
	        }
	
	        if (value === 1 / 0) {
	            return json ? 'null' : renumber ? '1e400' : '1e+400';
	        }
	
	        result = '' + value;
	        if (!renumber || result.length < 3) {
	            return result;
	        }
	
	        point = result.indexOf('.');
	        if (!json && result.charAt(0) === '0' && point === 1) {
	            point = 0;
	            result = result.slice(1);
	        }
	        temp = result;
	        result = result.replace('e+', 'e');
	        exponent = 0;
	        if ((pos = temp.indexOf('e')) > 0) {
	            exponent = +temp.slice(pos + 1);
	            temp = temp.slice(0, pos);
	        }
	        if (point >= 0) {
	            exponent -= temp.length - point - 1;
	            temp = +(temp.slice(0, point) + temp.slice(point + 1)) + '';
	        }
	        pos = 0;
	        while (temp.charAt(temp.length + pos - 1) === '0') {
	            pos -= 1;
	        }
	        if (pos !== 0) {
	            exponent -= pos;
	            temp = temp.slice(0, pos);
	        }
	        if (exponent !== 0) {
	            temp += 'e' + exponent;
	        }
	        if ((temp.length < result.length ||
	                    (hexadecimal && value > 1e12 && Math.floor(value) === value && (temp = '0x' + value.toString(16)).length < result.length)) &&
	                +temp === value) {
	            result = temp;
	        }
	
	        return result;
	    }
	
	    // Generate valid RegExp expression.
	    // This function is based on https://github.com/Constellation/iv Engine
	
	    function escapeRegExpCharacter(ch, previousIsBackslash) {
	        // not handling '\' and handling \u2028 or \u2029 to unicode escape sequence
	        if ((ch & ~1) === 0x2028) {
	            return (previousIsBackslash ? 'u' : '\\u') + ((ch === 0x2028) ? '2028' : '2029');
	        } else if (ch === 10 || ch === 13) {  // \n, \r
	            return (previousIsBackslash ? '' : '\\') + ((ch === 10) ? 'n' : 'r');
	        }
	        return String.fromCharCode(ch);
	    }
	
	    function generateRegExp(reg) {
	        var match, result, flags, i, iz, ch, characterInBrack, previousIsBackslash;
	
	        result = reg.toString();
	
	        if (reg.source) {
	            // extract flag from toString result
	            match = result.match(/\/([^/]*)$/);
	            if (!match) {
	                return result;
	            }
	
	            flags = match[1];
	            result = '';
	
	            characterInBrack = false;
	            previousIsBackslash = false;
	            for (i = 0, iz = reg.source.length; i < iz; ++i) {
	                ch = reg.source.charCodeAt(i);
	
	                if (!previousIsBackslash) {
	                    if (characterInBrack) {
	                        if (ch === 93) {  // ]
	                            characterInBrack = false;
	                        }
	                    } else {
	                        if (ch === 47) {  // /
	                            result += '\\';
	                        } else if (ch === 91) {  // [
	                            characterInBrack = true;
	                        }
	                    }
	                    result += escapeRegExpCharacter(ch, previousIsBackslash);
	                    previousIsBackslash = ch === 92;  // \
	                } else {
	                    // if new RegExp("\\\n') is provided, create /\n/
	                    result += escapeRegExpCharacter(ch, previousIsBackslash);
	                    // prevent like /\\[/]/
	                    previousIsBackslash = false;
	                }
	            }
	
	            return '/' + result + '/' + flags;
	        }
	
	        return result;
	    }
	
	    function escapeAllowedCharacter(ch, next) {
	        var code = ch.charCodeAt(0), hex = code.toString(16), result = '\\';
	
	        switch (ch) {
	        case '\b':
	            result += 'b';
	            break;
	        case '\f':
	            result += 'f';
	            break;
	        case '\t':
	            result += 't';
	            break;
	        default:
	            if (json || code > 0xff) {
	                result += 'u' + '0000'.slice(hex.length) + hex;
	            } else if (ch === '\u0000' && '0123456789'.indexOf(next) < 0) {
	                result += '0';
	            } else if (ch === '\x0B') { // '\v'
	                result += 'x0B';
	            } else {
	                result += 'x' + '00'.slice(hex.length) + hex;
	            }
	            break;
	        }
	
	        return result;
	    }
	
	    function escapeDisallowedCharacter(ch) {
	        var result = '\\';
	        switch (ch) {
	        case '\\':
	            result += '\\';
	            break;
	        case '\n':
	            result += 'n';
	            break;
	        case '\r':
	            result += 'r';
	            break;
	        case '\u2028':
	            result += 'u2028';
	            break;
	        case '\u2029':
	            result += 'u2029';
	            break;
	        default:
	            throw new Error('Incorrectly classified character');
	        }
	
	        return result;
	    }
	
	    function escapeDirective(str) {
	        var i, iz, ch, buf, quote;
	
	        buf = str;
	        if (typeof buf[0] === 'undefined') {
	            buf = stringToArray(buf);
	        }
	
	        quote = quotes === 'double' ? '"' : '\'';
	        for (i = 0, iz = buf.length; i < iz; i += 1) {
	            ch = buf[i];
	            if (ch === '\'') {
	                quote = '"';
	                break;
	            } else if (ch === '"') {
	                quote = '\'';
	                break;
	            } else if (ch === '\\') {
	                i += 1;
	            }
	        }
	
	        return quote + str + quote;
	    }
	
	    function escapeString(str) {
	        var result = '', i, len, ch, singleQuotes = 0, doubleQuotes = 0, single;
	
	        if (typeof str[0] === 'undefined') {
	            str = stringToArray(str);
	        }
	
	        for (i = 0, len = str.length; i < len; i += 1) {
	            ch = str[i];
	            if (ch === '\'') {
	                singleQuotes += 1;
	            } else if (ch === '"') {
	                doubleQuotes += 1;
	            } else if (ch === '/' && json) {
	                result += '\\';
	            } else if ('\\\n\r\u2028\u2029'.indexOf(ch) >= 0) {
	                result += escapeDisallowedCharacter(ch);
	                continue;
	            } else if ((json && ch < ' ') || !(json || escapeless || (ch >= ' ' && ch <= '~'))) {
	                result += escapeAllowedCharacter(ch, str[i + 1]);
	                continue;
	            }
	            result += ch;
	        }
	
	        single = !(quotes === 'double' || (quotes === 'auto' && doubleQuotes < singleQuotes));
	        str = result;
	        result = single ? '\'' : '"';
	
	        if (typeof str[0] === 'undefined') {
	            str = stringToArray(str);
	        }
	
	        for (i = 0, len = str.length; i < len; i += 1) {
	            ch = str[i];
	            if ((ch === '\'' && single) || (ch === '"' && !single)) {
	                result += '\\';
	            }
	            result += ch;
	        }
	
	        return result + (single ? '\'' : '"');
	    }
	
	    function isWhiteSpace(ch) {
	        // Use `\x0B` instead of `\v` for IE < 9 compatibility
	        return '\t\x0B\f \xa0'.indexOf(ch) >= 0 || (ch.charCodeAt(0) >= 0x1680 && '\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\ufeff'.indexOf(ch) >= 0);
	    }
	
	    function isLineTerminator(ch) {
	        return '\n\r\u2028\u2029'.indexOf(ch) >= 0;
	    }
	
	    function isIdentifierPart(ch) {
	        return (ch === '$') || (ch === '_') || (ch === '\\') ||
	            (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') ||
	            ((ch >= '0') && (ch <= '9')) ||
	            ((ch.charCodeAt(0) >= 0x80) && Regex.NonAsciiIdentifierPart.test(ch));
	    }
	
	    // takes char code
	    function isDecimalDigit(ch) {
	        return (ch >= 48 && ch <= 57);   // 0..9
	    }
	
	    function toSourceNode(generated, node) {
	        if (node == null) {
	            if (generated instanceof SourceNode) {
	                return generated;
	            } else {
	                node = {};
	            }
	        }
	        if (node.loc == null) {
	            return new SourceNode(null, null, sourceMap, generated, node.name || null);
	        }
	        return new SourceNode(node.loc.start.line, node.loc.start.column, (sourceMap === true ? node.loc.source || null : sourceMap), generated, node.name || null);
	    }
	
	    function noEmptySpace() {
	        return (space) ? space : ' ';
	    }
	
	    function join(left, right) {
	        var leftSource = toSourceNode(left).toString(),
	            rightSource = toSourceNode(right).toString(),
	            leftChar = leftSource.charAt(leftSource.length - 1),
	            rightChar = rightSource.charAt(0);
	
	        if ((leftChar === '+' || leftChar === '-') && leftChar === rightChar ||
	        isIdentifierPart(leftChar) && isIdentifierPart(rightChar) ||
	        leftChar === '/' && rightChar === 'i') { // infix word operators all start with `i`
	            return [left, noEmptySpace(), right];
	        } else if (isWhiteSpace(leftChar) || isLineTerminator(leftChar) || isWhiteSpace(rightChar) || isLineTerminator(rightChar)) {
	            return [left, right];
	        }
	        return [left, space, right];
	    }
	
	    function addIndent(stmt) {
	        return [base, stmt];
	    }
	
	    function withIndent(fn) {
	        var previousBase, result;
	        previousBase = base;
	        base += indent;
	        result = fn.call(this, base);
	        base = previousBase;
	        return result;
	    }
	
	    function calculateSpaces(str) {
	        var i;
	        for (i = str.length - 1; i >= 0; i -= 1) {
	            if (isLineTerminator(str.charAt(i))) {
	                break;
	            }
	        }
	        return (str.length - 1) - i;
	    }
	
	    function adjustMultilineComment(value, specialBase) {
	        var array, i, len, line, j, spaces, previousBase;
	
	        array = value.split(/\r\n|[\r\n]/);
	        spaces = Number.MAX_VALUE;
	
	        // first line doesn't have indentation
	        for (i = 1, len = array.length; i < len; i += 1) {
	            line = array[i];
	            j = 0;
	            while (j < line.length && isWhiteSpace(line[j])) {
	                j += 1;
	            }
	            if (spaces > j) {
	                spaces = j;
	            }
	        }
	
	        if (typeof specialBase !== 'undefined') {
	            // pattern like
	            // {
	            //   var t = 20;  /*
	            //                 * this is comment
	            //                 */
	            // }
	            previousBase = base;
	            if (array[1][spaces] === '*') {
	                specialBase += ' ';
	            }
	            base = specialBase;
	        } else {
	            if (spaces & 1) {
	                // /*
	                //  *
	                //  */
	                // If spaces are odd number, above pattern is considered.
	                // We waste 1 space.
	                spaces -= 1;
	            }
	            previousBase = base;
	        }
	
	        for (i = 1, len = array.length; i < len; i += 1) {
	            array[i] = toSourceNode(addIndent(array[i].slice(spaces))).join('');
	        }
	
	        base = previousBase;
	
	        return array.join('\n');
	    }
	
	    function generateComment(comment, specialBase) {
	        if (comment.type === 'Line') {
	            if (endsWithLineTerminator(comment.value)) {
	                return '//' + comment.value;
	            } else {
	                // Always use LineTerminator
	                return '//' + comment.value + '\n';
	            }
	        }
	        if (extra.format.indent.adjustMultilineComment && /[\n\r]/.test(comment.value)) {
	            return adjustMultilineComment('/*' + comment.value + '*/', specialBase);
	        }
	        return '/*' + comment.value + '*/';
	    }
	
	    function addCommentsToStatement(stmt, result) {
	        var i, len, comment, save, tailingToStatement, specialBase, fragment;
	
	        if (stmt.leadingComments && stmt.leadingComments.length > 0) {
	            save = result;
	
	            comment = stmt.leadingComments[0];
	            result = [];
	            if (safeConcatenation && stmt.type === Syntax.Program && stmt.body.length === 0) {
	                result.push('\n');
	            }
	            result.push(generateComment(comment));
	            if (!endsWithLineTerminator(toSourceNode(result).toString())) {
	                result.push('\n');
	            }
	
	            for (i = 1, len = stmt.leadingComments.length; i < len; i += 1) {
	                comment = stmt.leadingComments[i];
	                fragment = [generateComment(comment)];
	                if (!endsWithLineTerminator(toSourceNode(fragment).toString())) {
	                    fragment.push('\n');
	                }
	                result.push(addIndent(fragment));
	            }
	
	            result.push(addIndent(save));
	        }
	
	        if (stmt.trailingComments) {
	            tailingToStatement = !endsWithLineTerminator(toSourceNode(result).toString());
	            specialBase = stringRepeat(' ', calculateSpaces(toSourceNode([base, result, indent]).toString()));
	            for (i = 0, len = stmt.trailingComments.length; i < len; i += 1) {
	                comment = stmt.trailingComments[i];
	                if (tailingToStatement) {
	                    // We assume target like following script
	                    //
	                    // var t = 20;  /**
	                    //               * This is comment of t
	                    //               */
	                    if (i === 0) {
	                        // first case
	                        result = [result, indent];
	                    } else {
	                        result = [result, specialBase];
	                    }
	                    result.push(generateComment(comment, specialBase));
	                } else {
	                    result = [result, addIndent(generateComment(comment))];
	                }
	                if (i !== len - 1 && !endsWithLineTerminator(toSourceNode(result).toString())) {
	                    result = [result, '\n'];
	                }
	            }
	        }
	
	        return result;
	    }
	
	    function parenthesize(text, current, should) {
	        if (current < should) {
	            return ['(', text, ')'];
	        }
	        return text;
	    }
	
	    function maybeBlock(stmt, semicolonOptional, functionBody) {
	        var result, noLeadingComment;
	
	        noLeadingComment = !extra.comment || !stmt.leadingComments;
	
	        if (stmt.type === Syntax.BlockStatement && noLeadingComment) {
	            return [space, generateStatement(stmt, { functionBody: functionBody })];
	        }
	
	        if (stmt.type === Syntax.EmptyStatement && noLeadingComment) {
	            return ';';
	        }
	
	        withIndent(function () {
	            result = [newline, addIndent(generateStatement(stmt, { semicolonOptional: semicolonOptional, functionBody: functionBody }))];
	        });
	
	        return result;
	    }
	
	    function maybeBlockSuffix(stmt, result) {
	        var ends = endsWithLineTerminator(toSourceNode(result).toString());
	        if (stmt.type === Syntax.BlockStatement && (!extra.comment || !stmt.leadingComments) && !ends) {
	            return [result, space];
	        }
	        if (ends) {
	            return [result, base];
	        }
	        return [result, newline, base];
	    }
	
	    function generateVerbatim(expr, option) {
	        var i, result;
	        result = expr[extra.verbatim].split(/\r\n|\n/);
	        for (i = 1; i < result.length; i++) {
	            result[i] = newline + base + result[i];
	        }
	
	        result = parenthesize(result, Precedence.Sequence, option.precedence);
	        return toSourceNode(result, expr);
	    }
	
	    function generateIdentifier(node) {
	        return toSourceNode(node.name, node);
	    }
	
	    function generateFunctionBody(node) {
	        var result, i, len, expr, arrow;
	
	        arrow = node.type === Syntax.ArrowFunctionExpression;
	
	        if (arrow && node.params.length === 1 && node.params[0].type === Syntax.Identifier) {
	            // arg => { } case
	            result = [generateIdentifier(node.params[0])];
	        } else {
	            result = ['('];
	            for (i = 0, len = node.params.length; i < len; i += 1) {
	                result.push(generateIdentifier(node.params[i]));
	                if (i + 1 < len) {
	                    result.push(',' + space);
	                }
	            }
	            result.push(')');
	        }
	
	        if (arrow) {
	            result.push(space, '=>');
	        }
	
	        if (node.expression) {
	            result.push(space);
	            expr = generateExpression(node.body, {
	                precedence: Precedence.Assignment,
	                allowIn: true,
	                allowCall: true
	            });
	            if (expr.toString().charAt(0) === '{') {
	                expr = ['(', expr, ')'];
	            }
	            result.push(expr);
	        } else {
	            result.push(maybeBlock(node.body, false, true));
	        }
	        return result;
	    }
	
	    function generateExpression(expr, option) {
	        var result,
	            precedence,
	            type,
	            currentPrecedence,
	            i,
	            len,
	            raw,
	            fragment,
	            multiline,
	            leftChar,
	            leftSource,
	            rightChar,
	            allowIn,
	            allowCall,
	            allowUnparenthesizedNew,
	            property;
	
	        precedence = option.precedence;
	        allowIn = option.allowIn;
	        allowCall = option.allowCall;
	        type = expr.type || option.type;
	
	        if (extra.verbatim && expr.hasOwnProperty(extra.verbatim)) {
	            return generateVerbatim(expr, option);
	        }
	
	        switch (type) {
	        case Syntax.SequenceExpression:
	            result = [];
	            allowIn |= (Precedence.Sequence < precedence);
	            for (i = 0, len = expr.expressions.length; i < len; i += 1) {
	                result.push(generateExpression(expr.expressions[i], {
	                    precedence: Precedence.Assignment,
	                    allowIn: allowIn,
	                    allowCall: true
	                }));
	                if (i + 1 < len) {
	                    result.push(',' + space);
	                }
	            }
	            result = parenthesize(result, Precedence.Sequence, precedence);
	            break;
	
	        case Syntax.AssignmentExpression:
	            allowIn |= (Precedence.Assignment < precedence);
	            result = parenthesize(
	                [
	                    generateExpression(expr.left, {
	                        precedence: Precedence.Call,
	                        allowIn: allowIn,
	                        allowCall: true
	                    }),
	                    space + expr.operator + space,
	                    generateExpression(expr.right, {
	                        precedence: Precedence.Assignment,
	                        allowIn: allowIn,
	                        allowCall: true
	                    })
	                ],
	                Precedence.Assignment,
	                precedence
	            );
	            break;
	
	        case Syntax.ArrowFunctionExpression:
	            allowIn |= (Precedence.ArrowFunction < precedence);
	            result = parenthesize(generateFunctionBody(expr), Precedence.ArrowFunction, precedence);
	            break;
	
	        case Syntax.ConditionalExpression:
	            allowIn |= (Precedence.Conditional < precedence);
	            result = parenthesize(
	                [
	                    generateExpression(expr.test, {
	                        precedence: Precedence.LogicalOR,
	                        allowIn: allowIn,
	                        allowCall: true
	                    }),
	                    space + '?' + space,
	                    generateExpression(expr.consequent, {
	                        precedence: Precedence.Assignment,
	                        allowIn: allowIn,
	                        allowCall: true
	                    }),
	                    space + ':' + space,
	                    generateExpression(expr.alternate, {
	                        precedence: Precedence.Assignment,
	                        allowIn: allowIn,
	                        allowCall: true
	                    })
	                ],
	                Precedence.Conditional,
	                precedence
	            );
	            break;
	
	        case Syntax.LogicalExpression:
	        case Syntax.BinaryExpression:
	            currentPrecedence = BinaryPrecedence[expr.operator];
	
	            allowIn |= (currentPrecedence < precedence);
	
	            fragment = generateExpression(expr.left, {
	                precedence: currentPrecedence,
	                allowIn: allowIn,
	                allowCall: true
	            });
	
	            leftSource = fragment.toString();
	
	            if (leftSource.charAt(leftSource.length - 1) === '/' && isIdentifierPart(expr.operator.charAt(0))) {
	                result = [fragment, noEmptySpace(), expr.operator];
	            } else {
	                result = join(fragment, expr.operator);
	            }
	
	            fragment = generateExpression(expr.right, {
	                precedence: currentPrecedence + 1,
	                allowIn: allowIn,
	                allowCall: true
	            });
	
	            if (expr.operator === '/' && fragment.toString().charAt(0) === '/' ||
	            expr.operator.slice(-1) === '<' && fragment.toString().slice(0, 3) === '!--') {
	                // If '/' concats with '/' or `<` concats with `!--`, it is interpreted as comment start
	                result.push(noEmptySpace(), fragment);
	            } else {
	                result = join(result, fragment);
	            }
	
	            if (expr.operator === 'in' && !allowIn) {
	                result = ['(', result, ')'];
	            } else {
	                result = parenthesize(result, currentPrecedence, precedence);
	            }
	
	            break;
	
	        case Syntax.CallExpression:
	            result = [generateExpression(expr.callee, {
	                precedence: Precedence.Call,
	                allowIn: true,
	                allowCall: true,
	                allowUnparenthesizedNew: false
	            })];
	
	            result.push('(');
	            for (i = 0, len = expr['arguments'].length; i < len; i += 1) {
	                result.push(generateExpression(expr['arguments'][i], {
	                    precedence: Precedence.Assignment,
	                    allowIn: true,
	                    allowCall: true
	                }));
	                if (i + 1 < len) {
	                    result.push(',' + space);
	                }
	            }
	            result.push(')');
	
	            if (!allowCall) {
	                result = ['(', result, ')'];
	            } else {
	                result = parenthesize(result, Precedence.Call, precedence);
	            }
	            break;
	
	        case Syntax.NewExpression:
	            len = expr['arguments'].length;
	            allowUnparenthesizedNew = option.allowUnparenthesizedNew === undefined || option.allowUnparenthesizedNew;
	
	            result = join(
	                'new',
	                generateExpression(expr.callee, {
	                    precedence: Precedence.New,
	                    allowIn: true,
	                    allowCall: false,
	                    allowUnparenthesizedNew: allowUnparenthesizedNew && !parentheses && len === 0
	                })
	            );
	
	            if (!allowUnparenthesizedNew || parentheses || len > 0) {
	                result.push('(');
	                for (i = 0; i < len; i += 1) {
	                    result.push(generateExpression(expr['arguments'][i], {
	                        precedence: Precedence.Assignment,
	                        allowIn: true,
	                        allowCall: true
	                    }));
	                    if (i + 1 < len) {
	                        result.push(',' + space);
	                    }
	                }
	                result.push(')');
	            }
	
	            result = parenthesize(result, Precedence.New, precedence);
	            break;
	
	        case Syntax.MemberExpression:
	            result = [generateExpression(expr.object, {
	                precedence: Precedence.Call,
	                allowIn: true,
	                allowCall: allowCall,
	                allowUnparenthesizedNew: false
	            })];
	
	            if (expr.computed) {
	                result.push('[', generateExpression(expr.property, {
	                    precedence: Precedence.Sequence,
	                    allowIn: true,
	                    allowCall: allowCall
	                }), ']');
	            } else {
	                if (expr.object.type === Syntax.Literal && typeof expr.object.value === 'number') {
	                    fragment = toSourceNode(result).toString();
	                    // When the following conditions are all true,
	                    //   1. No floating point
	                    //   2. Don't have exponents
	                    //   3. The last character is a decimal digit
	                    //   4. Not hexadecimal OR octal number literal
	                    // we should add a floating point.
	                    if (
	                            fragment.indexOf('.') < 0 &&
	                            !/[eExX]/.test(fragment) &&
	                            isDecimalDigit(fragment.charCodeAt(fragment.length - 1)) &&
	                            !(fragment.length >= 2 && fragment.charCodeAt(0) === 48)  // '0'
	                            ) {
	                        result.push('.');
	                    }
	                }
	                result.push('.', generateIdentifier(expr.property));
	            }
	
	            result = parenthesize(result, Precedence.Member, precedence);
	            break;
	
	        case Syntax.UnaryExpression:
	            fragment = generateExpression(expr.argument, {
	                precedence: Precedence.Unary,
	                allowIn: true,
	                allowCall: true
	            });
	
	            if (space === '') {
	                result = join(expr.operator, fragment);
	            } else {
	                result = [expr.operator];
	                if (expr.operator.length > 2) {
	                    // delete, void, typeof
	                    // get `typeof []`, not `typeof[]`
	                    result = join(result, fragment);
	                } else {
	                    // Prevent inserting spaces between operator and argument if it is unnecessary
	                    // like, `!cond`
	                    leftSource = toSourceNode(result).toString();
	                    leftChar = leftSource.charAt(leftSource.length - 1);
	                    rightChar = fragment.toString().charAt(0);
	
	                    if (((leftChar === '+' || leftChar === '-') && leftChar === rightChar) || (isIdentifierPart(leftChar) && isIdentifierPart(rightChar))) {
	                        result.push(noEmptySpace(), fragment);
	                    } else {
	                        result.push(fragment);
	                    }
	                }
	            }
	            result = parenthesize(result, Precedence.Unary, precedence);
	            break;
	
	        case Syntax.YieldExpression:
	            if (expr.delegate) {
	                result = 'yield*';
	            } else {
	                result = 'yield';
	            }
	            if (expr.argument) {
	                result = join(
	                    result,
	                    generateExpression(expr.argument, {
	                        precedence: Precedence.Assignment,
	                        allowIn: true,
	                        allowCall: true
	                    })
	                );
	            }
	            break;
	
	        case Syntax.UpdateExpression:
	            if (expr.prefix) {
	                result = parenthesize(
	                    [
	                        expr.operator,
	                        generateExpression(expr.argument, {
	                            precedence: Precedence.Unary,
	                            allowIn: true,
	                            allowCall: true
	                        })
	                    ],
	                    Precedence.Unary,
	                    precedence
	                );
	            } else {
	                result = parenthesize(
	                    [
	                        generateExpression(expr.argument, {
	                            precedence: Precedence.Postfix,
	                            allowIn: true,
	                            allowCall: true
	                        }),
	                        expr.operator
	                    ],
	                    Precedence.Postfix,
	                    precedence
	                );
	            }
	            break;
	
	        case Syntax.FunctionExpression:
	            result = 'function';
	
	            if (expr.id) {
	                result = [result, noEmptySpace(),
	                          generateIdentifier(expr.id),
	                          generateFunctionBody(expr)];
	            } else {
	                result = [result + space, generateFunctionBody(expr)];
	            }
	
	            break;
	
	        case Syntax.ArrayPattern:
	        case Syntax.ArrayExpression:
	            if (!expr.elements.length) {
	                result = '[]';
	                break;
	            }
	            multiline = expr.elements.length > 1;
	            result = ['[', multiline ? newline : ''];
	            withIndent(function (indent) {
	                for (i = 0, len = expr.elements.length; i < len; i += 1) {
	                    if (!expr.elements[i]) {
	                        if (multiline) {
	                            result.push(indent);
	                        }
	                        if (i + 1 === len) {
	                            result.push(',');
	                        }
	                    } else {
	                        result.push(multiline ? indent : '', generateExpression(expr.elements[i], {
	                            precedence: Precedence.Assignment,
	                            allowIn: true,
	                            allowCall: true
	                        }));
	                    }
	                    if (i + 1 < len) {
	                        result.push(',' + (multiline ? newline : space));
	                    }
	                }
	            });
	            if (multiline && !endsWithLineTerminator(toSourceNode(result).toString())) {
	                result.push(newline);
	            }
	            result.push(multiline ? base : '', ']');
	            break;
	
	        case Syntax.Property:
	            if (expr.kind === 'get' || expr.kind === 'set') {
	                result = [
	                    expr.kind, noEmptySpace(),
	                    generateExpression(expr.key, {
	                        precedence: Precedence.Sequence,
	                        allowIn: true,
	                        allowCall: true
	                    }),
	                    generateFunctionBody(expr.value)
	                ];
	            } else {
	                if (expr.shorthand) {
	                    result = generateExpression(expr.key, {
	                        precedence: Precedence.Sequence,
	                        allowIn: true,
	                        allowCall: true
	                    });
	                } else if (expr.method) {
	                    result = [];
	                    if (expr.value.generator) {
	                        result.push('*');
	                    }
	                    result.push(generateExpression(expr.key, {
	                        precedence: Precedence.Sequence,
	                        allowIn: true,
	                        allowCall: true
	                    }), generateFunctionBody(expr.value));
	                } else {
	                    result = [
	                        generateExpression(expr.key, {
	                            precedence: Precedence.Sequence,
	                            allowIn: true,
	                            allowCall: true
	                        }),
	                        ':' + space,
	                        generateExpression(expr.value, {
	                            precedence: Precedence.Assignment,
	                            allowIn: true,
	                            allowCall: true
	                        })
	                    ];
	                }
	            }
	            break;
	
	        case Syntax.ObjectExpression:
	            if (!expr.properties.length) {
	                result = '{}';
	                break;
	            }
	            multiline = expr.properties.length > 1;
	
	            withIndent(function () {
	                fragment = generateExpression(expr.properties[0], {
	                    precedence: Precedence.Sequence,
	                    allowIn: true,
	                    allowCall: true,
	                    type: Syntax.Property
	                });
	            });
	
	            if (!multiline) {
	                // issues 4
	                // Do not transform from
	                //   dejavu.Class.declare({
	                //       method2: function () {}
	                //   });
	                // to
	                //   dejavu.Class.declare({method2: function () {
	                //       }});
	                if (!hasLineTerminator(toSourceNode(fragment).toString())) {
	                    result = [ '{', space, fragment, space, '}' ];
	                    break;
	                }
	            }
	
	            withIndent(function (indent) {
	                result = [ '{', newline, indent, fragment ];
	
	                if (multiline) {
	                    result.push(',' + newline);
	                    for (i = 1, len = expr.properties.length; i < len; i += 1) {
	                        result.push(indent, generateExpression(expr.properties[i], {
	                            precedence: Precedence.Sequence,
	                            allowIn: true,
	                            allowCall: true,
	                            type: Syntax.Property
	                        }));
	                        if (i + 1 < len) {
	                            result.push(',' + newline);
	                        }
	                    }
	                }
	            });
	
	            if (!endsWithLineTerminator(toSourceNode(result).toString())) {
	                result.push(newline);
	            }
	            result.push(base, '}');
	            break;
	
	        case Syntax.ObjectPattern:
	            if (!expr.properties.length) {
	                result = '{}';
	                break;
	            }
	
	            multiline = false;
	            if (expr.properties.length === 1) {
	                property = expr.properties[0];
	                if (property.value.type !== Syntax.Identifier) {
	                    multiline = true;
	                }
	            } else {
	                for (i = 0, len = expr.properties.length; i < len; i += 1) {
	                    property = expr.properties[i];
	                    if (!property.shorthand) {
	                        multiline = true;
	                        break;
	                    }
	                }
	            }
	            result = ['{', multiline ? newline : '' ];
	
	            withIndent(function (indent) {
	                for (i = 0, len = expr.properties.length; i < len; i += 1) {
	                    result.push(multiline ? indent : '', generateExpression(expr.properties[i], {
	                        precedence: Precedence.Sequence,
	                        allowIn: true,
	                        allowCall: true
	                    }));
	                    if (i + 1 < len) {
	                        result.push(',' + (multiline ? newline : space));
	                    }
	                }
	            });
	
	            if (multiline && !endsWithLineTerminator(toSourceNode(result).toString())) {
	                result.push(newline);
	            }
	            result.push(multiline ? base : '', '}');
	            break;
	
	        case Syntax.ThisExpression:
	            result = 'this';
	            break;
	
	        case Syntax.Identifier:
	            result = generateIdentifier(expr);
	            break;
	
	        case Syntax.Literal:
	            if (expr.hasOwnProperty('raw') && parse) {
	                try {
	                    raw = parse(expr.raw).body[0].expression;
	                    if (raw.type === Syntax.Literal) {
	                        if (raw.value === expr.value) {
	                            result = expr.raw;
	                            break;
	                        }
	                    }
	                } catch (e) {
	                    // not use raw property
	                }
	            }
	
	            if (expr.value === null) {
	                result = 'null';
	                break;
	            }
	
	            if (typeof expr.value === 'string') {
	                result = escapeString(expr.value);
	                break;
	            }
	
	            if (typeof expr.value === 'number') {
	                result = generateNumber(expr.value);
	                break;
	            }
	
	            if (typeof expr.value === 'boolean') {
	                result = expr.value ? 'true' : 'false';
	                break;
	            }
	
	            result = generateRegExp(expr.value);
	            break;
	
	        case Syntax.ComprehensionExpression:
	            result = [
	                '[',
	                generateExpression(expr.body, {
	                    precedence: Precedence.Assignment,
	                    allowIn: true,
	                    allowCall: true
	                })
	            ];
	
	            if (expr.blocks) {
	                for (i = 0, len = expr.blocks.length; i < len; i += 1) {
	                    fragment = generateExpression(expr.blocks[i], {
	                        precedence: Precedence.Sequence,
	                        allowIn: true,
	                        allowCall: true
	                    });
	                    result = join(result, fragment);
	                }
	            }
	
	            if (expr.filter) {
	                result = join(result, 'if' + space);
	                fragment = generateExpression(expr.filter, {
	                    precedence: Precedence.Sequence,
	                    allowIn: true,
	                    allowCall: true
	                });
	                if (extra.moz.parenthesizedComprehensionBlock) {
	                    result = join(result, [ '(', fragment, ')' ]);
	                } else {
	                    result = join(result, fragment);
	                }
	            }
	            result.push(']');
	            break;
	
	        case Syntax.ComprehensionBlock:
	            if (expr.left.type === Syntax.VariableDeclaration) {
	                fragment = [
	                    expr.left.kind, noEmptySpace(),
	                    generateStatement(expr.left.declarations[0], {
	                        allowIn: false
	                    })
	                ];
	            } else {
	                fragment = generateExpression(expr.left, {
	                    precedence: Precedence.Call,
	                    allowIn: true,
	                    allowCall: true
	                });
	            }
	
	            fragment = join(fragment, expr.of ? 'of' : 'in');
	            fragment = join(fragment, generateExpression(expr.right, {
	                precedence: Precedence.Sequence,
	                allowIn: true,
	                allowCall: true
	            }));
	
	            if (extra.moz.parenthesizedComprehensionBlock) {
	                result = [ 'for' + space + '(', fragment, ')' ];
	            } else {
	                result = join('for' + space, fragment);
	            }
	            break;
	
	        default:
	            throw new Error('Unknown expression type: ' + expr.type);
	        }
	
	        return toSourceNode(result, expr);
	    }
	
	    function generateStatement(stmt, option) {
	        var i, len, result, node, allowIn, functionBody, directiveContext, fragment, semicolon;
	
	        allowIn = true;
	        semicolon = ';';
	        functionBody = false;
	        directiveContext = false;
	        if (option) {
	            allowIn = option.allowIn === undefined || option.allowIn;
	            if (!semicolons && option.semicolonOptional === true) {
	                semicolon = '';
	            }
	            functionBody = option.functionBody;
	            directiveContext = option.directiveContext;
	        }
	
	        switch (stmt.type) {
	        case Syntax.BlockStatement:
	            result = ['{', newline];
	
	            withIndent(function () {
	                for (i = 0, len = stmt.body.length; i < len; i += 1) {
	                    fragment = addIndent(generateStatement(stmt.body[i], {
	                        semicolonOptional: i === len - 1,
	                        directiveContext: functionBody
	                    }));
	                    result.push(fragment);
	                    if (!endsWithLineTerminator(toSourceNode(fragment).toString())) {
	                        result.push(newline);
	                    }
	                }
	            });
	
	            result.push(addIndent('}'));
	            break;
	
	        case Syntax.BreakStatement:
	            if (stmt.label) {
	                result = 'break ' + stmt.label.name + semicolon;
	            } else {
	                result = 'break' + semicolon;
	            }
	            break;
	
	        case Syntax.ContinueStatement:
	            if (stmt.label) {
	                result = 'continue ' + stmt.label.name + semicolon;
	            } else {
	                result = 'continue' + semicolon;
	            }
	            break;
	
	        case Syntax.DirectiveStatement:
	            if (stmt.raw) {
	                result = stmt.raw + semicolon;
	            } else {
	                result = escapeDirective(stmt.directive) + semicolon;
	            }
	            break;
	
	        case Syntax.DoWhileStatement:
	            // Because `do 42 while (cond)` is Syntax Error. We need semicolon.
	            result = join('do', maybeBlock(stmt.body));
	            result = maybeBlockSuffix(stmt.body, result);
	            result = join(result, [
	                'while' + space + '(',
	                generateExpression(stmt.test, {
	                    precedence: Precedence.Sequence,
	                    allowIn: true,
	                    allowCall: true
	                }),
	                ')' + semicolon
	            ]);
	            break;
	
	        case Syntax.CatchClause:
	            withIndent(function () {
	                result = [
	                    'catch' + space + '(',
	                    generateExpression(stmt.param, {
	                        precedence: Precedence.Sequence,
	                        allowIn: true,
	                        allowCall: true
	                    }),
	                    ')'
	                ];
	            });
	            result.push(maybeBlock(stmt.body));
	            break;
	
	        case Syntax.DebuggerStatement:
	            result = 'debugger' + semicolon;
	            break;
	
	        case Syntax.EmptyStatement:
	            result = ';';
	            break;
	
	        case Syntax.ExpressionStatement:
	            result = [generateExpression(stmt.expression, {
	                precedence: Precedence.Sequence,
	                allowIn: true,
	                allowCall: true
	            })];
	            // 12.4 '{', 'function' is not allowed in this position.
	            // wrap expression with parentheses
	            fragment = toSourceNode(result).toString();
	            if (fragment.charAt(0) === '{' || (fragment.slice(0, 8) === 'function' && ' ('.indexOf(fragment.charAt(8)) >= 0) || (directive && directiveContext && stmt.expression.type === Syntax.Literal && typeof stmt.expression.value === 'string')) {
	                result = ['(', result, ')' + semicolon];
	            } else {
	                result.push(semicolon);
	            }
	            break;
	
	        case Syntax.VariableDeclarator:
	            if (stmt.init) {
	                result = [
	                    generateExpression(stmt.id, {
	                        precedence: Precedence.Assignment,
	                        allowIn: allowIn,
	                        allowCall: true
	                    }),
	                    space,
	                    '=',
	                    space,
	                    generateExpression(stmt.init, {
	                        precedence: Precedence.Assignment,
	                        allowIn: allowIn,
	                        allowCall: true
	                    })
	                ];
	            } else {
	                result = generateIdentifier(stmt.id);
	            }
	            break;
	
	        case Syntax.VariableDeclaration:
	            result = [stmt.kind];
	            // special path for
	            // var x = function () {
	            // };
	            if (stmt.declarations.length === 1 && stmt.declarations[0].init &&
	                    stmt.declarations[0].init.type === Syntax.FunctionExpression) {
	                result.push(noEmptySpace(), generateStatement(stmt.declarations[0], {
	                    allowIn: allowIn
	                }));
	            } else {
	                // VariableDeclarator is typed as Statement,
	                // but joined with comma (not LineTerminator).
	                // So if comment is attached to target node, we should specialize.
	                withIndent(function () {
	                    node = stmt.declarations[0];
	                    if (extra.comment && node.leadingComments) {
	                        result.push('\n', addIndent(generateStatement(node, {
	                            allowIn: allowIn
	                        })));
	                    } else {
	                        result.push(noEmptySpace(), generateStatement(node, {
	                            allowIn: allowIn
	                        }));
	                    }
	
	                    for (i = 1, len = stmt.declarations.length; i < len; i += 1) {
	                        node = stmt.declarations[i];
	                        if (extra.comment && node.leadingComments) {
	                            result.push(',' + newline, addIndent(generateStatement(node, {
	                                allowIn: allowIn
	                            })));
	                        } else {
	                            result.push(',' + space, generateStatement(node, {
	                                allowIn: allowIn
	                            }));
	                        }
	                    }
	                });
	            }
	            result.push(semicolon);
	            break;
	
	        case Syntax.ThrowStatement:
	            result = [join(
	                'throw',
	                generateExpression(stmt.argument, {
	                    precedence: Precedence.Sequence,
	                    allowIn: true,
	                    allowCall: true
	                })
	            ), semicolon];
	            break;
	
	        case Syntax.TryStatement:
	            result = ['try', maybeBlock(stmt.block)];
	            result = maybeBlockSuffix(stmt.block, result);
	            if (stmt.handlers) {
	                // old interface
	                for (i = 0, len = stmt.handlers.length; i < len; i += 1) {
	                    result = join(result, generateStatement(stmt.handlers[i]));
	                    if (stmt.finalizer || i + 1 !== len) {
	                        result = maybeBlockSuffix(stmt.handlers[i].body, result);
	                    }
	                }
	            } else {
	                // new interface
	                if (stmt.handler) {
	                    result = join(result, generateStatement(stmt.handler));
	                    if (stmt.finalizer || stmt.guardedHandlers.length > 0) {
	                        result = maybeBlockSuffix(stmt.handler.body, result);
	                    }
	                }
	
	                for (i = 0, len = stmt.guardedHandlers.length; i < len; i += 1) {
	                    result = join(result, generateStatement(stmt.guardedHandlers[i]));
	                    if (stmt.finalizer || i + 1 !== len) {
	                        result = maybeBlockSuffix(stmt.guardedHandlers[i].body, result);
	                    }
	                }
	            }
	            if (stmt.finalizer) {
	                result = join(result, ['finally', maybeBlock(stmt.finalizer)]);
	            }
	            break;
	
	        case Syntax.SwitchStatement:
	            withIndent(function () {
	                result = [
	                    'switch' + space + '(',
	                    generateExpression(stmt.discriminant, {
	                        precedence: Precedence.Sequence,
	                        allowIn: true,
	                        allowCall: true
	                    }),
	                    ')' + space + '{' + newline
	                ];
	            });
	            if (stmt.cases) {
	                for (i = 0, len = stmt.cases.length; i < len; i += 1) {
	                    fragment = addIndent(generateStatement(stmt.cases[i], {semicolonOptional: i === len - 1}));
	                    result.push(fragment);
	                    if (!endsWithLineTerminator(toSourceNode(fragment).toString())) {
	                        result.push(newline);
	                    }
	                }
	            }
	            result.push(addIndent('}'));
	            break;
	
	        case Syntax.SwitchCase:
	            withIndent(function () {
	                if (stmt.test) {
	                    result = [
	                        join('case', generateExpression(stmt.test, {
	                            precedence: Precedence.Sequence,
	                            allowIn: true,
	                            allowCall: true
	                        })),
	                        ':'
	                    ];
	                } else {
	                    result = ['default:'];
	                }
	
	                i = 0;
	                len = stmt.consequent.length;
	                if (len && stmt.consequent[0].type === Syntax.BlockStatement) {
	                    fragment = maybeBlock(stmt.consequent[0]);
	                    result.push(fragment);
	                    i = 1;
	                }
	
	                if (i !== len && !endsWithLineTerminator(toSourceNode(result).toString())) {
	                    result.push(newline);
	                }
	
	                for (; i < len; i += 1) {
	                    fragment = addIndent(generateStatement(stmt.consequent[i], {semicolonOptional: i === len - 1 && semicolon === ''}));
	                    result.push(fragment);
	                    if (i + 1 !== len && !endsWithLineTerminator(toSourceNode(fragment).toString())) {
	                        result.push(newline);
	                    }
	                }
	            });
	            break;
	
	        case Syntax.IfStatement:
	            withIndent(function () {
	                result = [
	                    'if' + space + '(',
	                    generateExpression(stmt.test, {
	                        precedence: Precedence.Sequence,
	                        allowIn: true,
	                        allowCall: true
	                    }),
	                    ')'
	                ];
	            });
	            if (stmt.alternate) {
	                result.push(maybeBlock(stmt.consequent));
	                result = maybeBlockSuffix(stmt.consequent, result);
	                if (stmt.alternate.type === Syntax.IfStatement) {
	                    result = join(result, ['else ', generateStatement(stmt.alternate, {semicolonOptional: semicolon === ''})]);
	                } else {
	                    result = join(result, join('else', maybeBlock(stmt.alternate, semicolon === '')));
	                }
	            } else {
	                result.push(maybeBlock(stmt.consequent, semicolon === ''));
	            }
	            break;
	
	        case Syntax.ForStatement:
	            withIndent(function () {
	                result = ['for' + space + '('];
	                if (stmt.init) {
	                    if (stmt.init.type === Syntax.VariableDeclaration) {
	                        result.push(generateStatement(stmt.init, {allowIn: false}));
	                    } else {
	                        result.push(generateExpression(stmt.init, {
	                            precedence: Precedence.Sequence,
	                            allowIn: false,
	                            allowCall: true
	                        }), ';');
	                    }
	                } else {
	                    result.push(';');
	                }
	
	                if (stmt.test) {
	                    result.push(space, generateExpression(stmt.test, {
	                        precedence: Precedence.Sequence,
	                        allowIn: true,
	                        allowCall: true
	                    }), ';');
	                } else {
	                    result.push(';');
	                }
	
	                if (stmt.update) {
	                    result.push(space, generateExpression(stmt.update, {
	                        precedence: Precedence.Sequence,
	                        allowIn: true,
	                        allowCall: true
	                    }), ')');
	                } else {
	                    result.push(')');
	                }
	            });
	
	            result.push(maybeBlock(stmt.body, semicolon === ''));
	            break;
	
	        case Syntax.ForInStatement:
	            result = ['for' + space + '('];
	            withIndent(function () {
	                if (stmt.left.type === Syntax.VariableDeclaration) {
	                    withIndent(function () {
	                        result.push(stmt.left.kind + noEmptySpace(), generateStatement(stmt.left.declarations[0], {
	                            allowIn: false
	                        }));
	                    });
	                } else {
	                    result.push(generateExpression(stmt.left, {
	                        precedence: Precedence.Call,
	                        allowIn: true,
	                        allowCall: true
	                    }));
	                }
	
	                result = join(result, 'in');
	                result = [join(
	                    result,
	                    generateExpression(stmt.right, {
	                        precedence: Precedence.Sequence,
	                        allowIn: true,
	                        allowCall: true
	                    })
	                ), ')'];
	            });
	            result.push(maybeBlock(stmt.body, semicolon === ''));
	            break;
	
	        case Syntax.LabeledStatement:
	            result = [stmt.label.name + ':', maybeBlock(stmt.body, semicolon === '')];
	            break;
	
	        case Syntax.Program:
	            len = stmt.body.length;
	            result = [safeConcatenation && len > 0 ? '\n' : ''];
	            for (i = 0; i < len; i += 1) {
	                fragment = addIndent(
	                    generateStatement(stmt.body[i], {
	                        semicolonOptional: !safeConcatenation && i === len - 1,
	                        directiveContext: true
	                    })
	                );
	                result.push(fragment);
	                if (i + 1 < len && !endsWithLineTerminator(toSourceNode(fragment).toString())) {
	                    result.push(newline);
	                }
	            }
	            break;
	
	        case Syntax.FunctionDeclaration:
	            result = [(stmt.generator && !extra.moz.starlessGenerator ? 'function* ' : 'function '),
	                      generateIdentifier(stmt.id),
	                      generateFunctionBody(stmt)];
	            break;
	
	        case Syntax.ReturnStatement:
	            if (stmt.argument) {
	                result = [join(
	                    'return',
	                    generateExpression(stmt.argument, {
	                        precedence: Precedence.Sequence,
	                        allowIn: true,
	                        allowCall: true
	                    })
	                ), semicolon];
	            } else {
	                result = ['return' + semicolon];
	            }
	            break;
	
	        case Syntax.WhileStatement:
	            withIndent(function () {
	                result = [
	                    'while' + space + '(',
	                    generateExpression(stmt.test, {
	                        precedence: Precedence.Sequence,
	                        allowIn: true,
	                        allowCall: true
	                    }),
	                    ')'
	                ];
	            });
	            result.push(maybeBlock(stmt.body, semicolon === ''));
	            break;
	
	        case Syntax.WithStatement:
	            withIndent(function () {
	                result = [
	                    'with' + space + '(',
	                    generateExpression(stmt.object, {
	                        precedence: Precedence.Sequence,
	                        allowIn: true,
	                        allowCall: true
	                    }),
	                    ')'
	                ];
	            });
	            result.push(maybeBlock(stmt.body, semicolon === ''));
	            break;
	
	        default:
	            throw new Error('Unknown statement type: ' + stmt.type);
	        }
	
	        // Attach comments
	
	        if (extra.comment) {
	            result = addCommentsToStatement(stmt, result);
	        }
	
	        fragment = toSourceNode(result).toString();
	        if (stmt.type === Syntax.Program && !safeConcatenation && newline === '' &&  fragment.charAt(fragment.length - 1) === '\n') {
	            result = toSourceNode(result).replaceRight(/\s+$/, '');
	        }
	
	        return toSourceNode(result, stmt);
	    }
	
	    function generate(node, options) {
	        var defaultOptions = getDefaultOptions(), result, pair;
	
	        if (options != null) {
	            // Obsolete options
	            //
	            //   `options.indent`
	            //   `options.base`
	            //
	            // Instead of them, we can use `option.format.indent`.
	            if (typeof options.indent === 'string') {
	                defaultOptions.format.indent.style = options.indent;
	            }
	            if (typeof options.base === 'number') {
	                defaultOptions.format.indent.base = options.base;
	            }
	            options = updateDeeply(defaultOptions, options);
	            indent = options.format.indent.style;
	            if (typeof options.base === 'string') {
	                base = options.base;
	            } else {
	                base = stringRepeat(indent, options.format.indent.base);
	            }
	        } else {
	            options = defaultOptions;
	            indent = options.format.indent.style;
	            base = stringRepeat(indent, options.format.indent.base);
	        }
	        json = options.format.json;
	        renumber = options.format.renumber;
	        hexadecimal = json ? false : options.format.hexadecimal;
	        quotes = json ? 'double' : options.format.quotes;
	        escapeless = options.format.escapeless;
	        newline = options.format.newline;
	        space = options.format.space;
	        if (options.format.compact) {
	            newline = space = indent = base = '';
	        }
	        parentheses = options.format.parentheses;
	        semicolons = options.format.semicolons;
	        safeConcatenation = options.format.safeConcatenation;
	        directive = options.directive;
	        parse = json ? null : options.parse;
	        sourceMap = options.sourceMap;
	        extra = options;
	
	        if (sourceMap) {
	            if (!exports.browser) {
	                // We assume environment is node.js
	                // And prevent from including source-map by browserify
	                SourceNode = __webpack_require__(29).SourceNode;
	            } else {
	                SourceNode = global.sourceMap.SourceNode;
	            }
	        } else {
	            SourceNode = SourceNodeMock;
	        }
	
	        switch (node.type) {
	        case Syntax.BlockStatement:
	        case Syntax.BreakStatement:
	        case Syntax.CatchClause:
	        case Syntax.ContinueStatement:
	        case Syntax.DirectiveStatement:
	        case Syntax.DoWhileStatement:
	        case Syntax.DebuggerStatement:
	        case Syntax.EmptyStatement:
	        case Syntax.ExpressionStatement:
	        case Syntax.ForStatement:
	        case Syntax.ForInStatement:
	        case Syntax.FunctionDeclaration:
	        case Syntax.IfStatement:
	        case Syntax.LabeledStatement:
	        case Syntax.Program:
	        case Syntax.ReturnStatement:
	        case Syntax.SwitchStatement:
	        case Syntax.SwitchCase:
	        case Syntax.ThrowStatement:
	        case Syntax.TryStatement:
	        case Syntax.VariableDeclaration:
	        case Syntax.VariableDeclarator:
	        case Syntax.WhileStatement:
	        case Syntax.WithStatement:
	            result = generateStatement(node);
	            break;
	
	        case Syntax.AssignmentExpression:
	        case Syntax.ArrayExpression:
	        case Syntax.ArrayPattern:
	        case Syntax.BinaryExpression:
	        case Syntax.CallExpression:
	        case Syntax.ConditionalExpression:
	        case Syntax.FunctionExpression:
	        case Syntax.Identifier:
	        case Syntax.Literal:
	        case Syntax.LogicalExpression:
	        case Syntax.MemberExpression:
	        case Syntax.NewExpression:
	        case Syntax.ObjectExpression:
	        case Syntax.ObjectPattern:
	        case Syntax.Property:
	        case Syntax.SequenceExpression:
	        case Syntax.ThisExpression:
	        case Syntax.UnaryExpression:
	        case Syntax.UpdateExpression:
	        case Syntax.YieldExpression:
	
	            result = generateExpression(node, {
	                precedence: Precedence.Sequence,
	                allowIn: true,
	                allowCall: true
	            });
	            break;
	
	        default:
	            throw new Error('Unknown node type: ' + node.type);
	        }
	
	        if (!sourceMap) {
	            return result.toString();
	        }
	
	        pair = result.toStringWithSourceMap({
	            file: options.file,
	            sourceRoot: options.sourceMapRoot
	        });
	
	        if (options.sourceMapWithCode) {
	            return pair;
	        }
	        return pair.map.toString();
	    }
	
	    FORMAT_MINIFY = {
	        indent: {
	            style: '',
	            base: 0
	        },
	        renumber: true,
	        hexadecimal: true,
	        quotes: 'auto',
	        escapeless: true,
	        compact: true,
	        parentheses: false,
	        semicolons: false
	    };
	
	    FORMAT_DEFAULTS = getDefaultOptions().format;
	
	    exports.version = __webpack_require__(40).version;
	    exports.generate = generate;
	    exports.attachComments = estraverse.attachComments;
	    exports.browser = false;
	    exports.FORMAT_MINIFY = FORMAT_MINIFY;
	    exports.FORMAT_DEFAULTS = FORMAT_DEFAULTS;
	}());
	/* vim: set sw=4 ts=4 et tw=80 : */
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
	  Copyright (C) 2012-2013 Yusuke Suzuki <utatane.tea@gmail.com>
	  Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>
	
	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:
	
	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.
	
	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/
	/*jslint vars:false, bitwise:true*/
	/*jshint indent:4*/
	/*global exports:true, define:true*/
	(function (root, factory) {
	    'use strict';
	
	    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js,
	    // and plain browser loading,
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== 'undefined') {
	        factory(exports);
	    } else {
	        factory((root.estraverse = {}));
	    }
	}(this, function (exports) {
	    'use strict';
	
	    var Syntax,
	        isArray,
	        VisitorOption,
	        VisitorKeys,
	        BREAK,
	        SKIP;
	
	    Syntax = {
	        AssignmentExpression: 'AssignmentExpression',
	        ArrayExpression: 'ArrayExpression',
	        ArrowFunctionExpression: 'ArrowFunctionExpression',
	        BlockStatement: 'BlockStatement',
	        BinaryExpression: 'BinaryExpression',
	        BreakStatement: 'BreakStatement',
	        CallExpression: 'CallExpression',
	        CatchClause: 'CatchClause',
	        ClassBody: 'ClassBody',
	        ClassDeclaration: 'ClassDeclaration',
	        ClassExpression: 'ClassExpression',
	        ConditionalExpression: 'ConditionalExpression',
	        ContinueStatement: 'ContinueStatement',
	        DebuggerStatement: 'DebuggerStatement',
	        DirectiveStatement: 'DirectiveStatement',
	        DoWhileStatement: 'DoWhileStatement',
	        EmptyStatement: 'EmptyStatement',
	        ExpressionStatement: 'ExpressionStatement',
	        ForStatement: 'ForStatement',
	        ForInStatement: 'ForInStatement',
	        FunctionDeclaration: 'FunctionDeclaration',
	        FunctionExpression: 'FunctionExpression',
	        Identifier: 'Identifier',
	        IfStatement: 'IfStatement',
	        Literal: 'Literal',
	        LabeledStatement: 'LabeledStatement',
	        LogicalExpression: 'LogicalExpression',
	        MemberExpression: 'MemberExpression',
	        MethodDefinition: 'MethodDefinition',
	        NewExpression: 'NewExpression',
	        ObjectExpression: 'ObjectExpression',
	        Program: 'Program',
	        Property: 'Property',
	        ReturnStatement: 'ReturnStatement',
	        SequenceExpression: 'SequenceExpression',
	        SwitchStatement: 'SwitchStatement',
	        SwitchCase: 'SwitchCase',
	        ThisExpression: 'ThisExpression',
	        ThrowStatement: 'ThrowStatement',
	        TryStatement: 'TryStatement',
	        UnaryExpression: 'UnaryExpression',
	        UpdateExpression: 'UpdateExpression',
	        VariableDeclaration: 'VariableDeclaration',
	        VariableDeclarator: 'VariableDeclarator',
	        WhileStatement: 'WhileStatement',
	        WithStatement: 'WithStatement',
	        YieldExpression: 'YieldExpression'
	    };
	
	    function ignoreJSHintError() { }
	
	    isArray = Array.isArray;
	    if (!isArray) {
	        isArray = function isArray(array) {
	            return Object.prototype.toString.call(array) === '[object Array]';
	        };
	    }
	
	    function deepCopy(obj) {
	        var ret = {}, key, val;
	        for (key in obj) {
	            if (obj.hasOwnProperty(key)) {
	                val = obj[key];
	                if (typeof val === 'object' && val !== null) {
	                    ret[key] = deepCopy(val);
	                } else {
	                    ret[key] = val;
	                }
	            }
	        }
	        return ret;
	    }
	
	    function shallowCopy(obj) {
	        var ret = {}, key;
	        for (key in obj) {
	            if (obj.hasOwnProperty(key)) {
	                ret[key] = obj[key];
	            }
	        }
	        return ret;
	    }
	    ignoreJSHintError(shallowCopy);
	
	    // based on LLVM libc++ upper_bound / lower_bound
	    // MIT License
	
	    function upperBound(array, func) {
	        var diff, len, i, current;
	
	        len = array.length;
	        i = 0;
	
	        while (len) {
	            diff = len >>> 1;
	            current = i + diff;
	            if (func(array[current])) {
	                len = diff;
	            } else {
	                i = current + 1;
	                len -= diff + 1;
	            }
	        }
	        return i;
	    }
	
	    function lowerBound(array, func) {
	        var diff, len, i, current;
	
	        len = array.length;
	        i = 0;
	
	        while (len) {
	            diff = len >>> 1;
	            current = i + diff;
	            if (func(array[current])) {
	                i = current + 1;
	                len -= diff + 1;
	            } else {
	                len = diff;
	            }
	        }
	        return i;
	    }
	    ignoreJSHintError(lowerBound);
	
	    VisitorKeys = {
	        AssignmentExpression: ['left', 'right'],
	        ArrayExpression: ['elements'],
	        ArrowFunctionExpression: ['params', 'body'],
	        BlockStatement: ['body'],
	        BinaryExpression: ['left', 'right'],
	        BreakStatement: ['label'],
	        CallExpression: ['callee', 'arguments'],
	        CatchClause: ['param', 'body'],
	        ClassBody: ['body'],
	        ClassDeclaration: ['id', 'body', 'superClass'],
	        ClassExpression: ['id', 'body', 'superClass'],
	        ConditionalExpression: ['test', 'consequent', 'alternate'],
	        ContinueStatement: ['label'],
	        DebuggerStatement: [],
	        DirectiveStatement: [],
	        DoWhileStatement: ['body', 'test'],
	        EmptyStatement: [],
	        ExpressionStatement: ['expression'],
	        ForStatement: ['init', 'test', 'update', 'body'],
	        ForInStatement: ['left', 'right', 'body'],
	        FunctionDeclaration: ['id', 'params', 'body'],
	        FunctionExpression: ['id', 'params', 'body'],
	        Identifier: [],
	        IfStatement: ['test', 'consequent', 'alternate'],
	        Literal: [],
	        LabeledStatement: ['label', 'body'],
	        LogicalExpression: ['left', 'right'],
	        MemberExpression: ['object', 'property'],
	        MethodDefinition: ['key', 'value'],
	        NewExpression: ['callee', 'arguments'],
	        ObjectExpression: ['properties'],
	        Program: ['body'],
	        Property: ['key', 'value'],
	        ReturnStatement: ['argument'],
	        SequenceExpression: ['expressions'],
	        SwitchStatement: ['discriminant', 'cases'],
	        SwitchCase: ['test', 'consequent'],
	        ThisExpression: [],
	        ThrowStatement: ['argument'],
	        TryStatement: ['block', 'handlers', 'handler', 'guardedHandlers', 'finalizer'],
	        UnaryExpression: ['argument'],
	        UpdateExpression: ['argument'],
	        VariableDeclaration: ['declarations'],
	        VariableDeclarator: ['id', 'init'],
	        WhileStatement: ['test', 'body'],
	        WithStatement: ['object', 'body'],
	        YieldExpression: ['argument']
	    };
	
	    // unique id
	    BREAK = {};
	    SKIP = {};
	
	    VisitorOption = {
	        Break: BREAK,
	        Skip: SKIP
	    };
	
	    function Reference(parent, key) {
	        this.parent = parent;
	        this.key = key;
	    }
	
	    Reference.prototype.replace = function replace(node) {
	        this.parent[this.key] = node;
	    };
	
	    function Element(node, path, wrap, ref) {
	        this.node = node;
	        this.path = path;
	        this.wrap = wrap;
	        this.ref = ref;
	    }
	
	    function Controller() { }
	
	    // API:
	    // return property path array from root to current node
	    Controller.prototype.path = function path() {
	        var i, iz, j, jz, result, element;
	
	        function addToPath(result, path) {
	            if (isArray(path)) {
	                for (j = 0, jz = path.length; j < jz; ++j) {
	                    result.push(path[j]);
	                }
	            } else {
	                result.push(path);
	            }
	        }
	
	        // root node
	        if (!this.__current.path) {
	            return null;
	        }
	
	        // first node is sentinel, second node is root element
	        result = [];
	        for (i = 2, iz = this.__leavelist.length; i < iz; ++i) {
	            element = this.__leavelist[i];
	            addToPath(result, element.path);
	        }
	        addToPath(result, this.__current.path);
	        return result;
	    };
	
	    // API:
	    // return array of parent elements
	    Controller.prototype.parents = function parents() {
	        var i, iz, result;
	
	        // first node is sentinel
	        result = [];
	        for (i = 1, iz = this.__leavelist.length; i < iz; ++i) {
	            result.push(this.__leavelist[i].node);
	        }
	
	        return result;
	    };
	
	    // API:
	    // return current node
	    Controller.prototype.current = function current() {
	        return this.__current.node;
	    };
	
	    Controller.prototype.__execute = function __execute(callback, element) {
	        var previous, result;
	
	        result = undefined;
	
	        previous  = this.__current;
	        this.__current = element;
	        this.__state = null;
	        if (callback) {
	            result = callback.call(this, element.node, this.__leavelist[this.__leavelist.length - 1].node);
	        }
	        this.__current = previous;
	
	        return result;
	    };
	
	    // API:
	    // notify control skip / break
	    Controller.prototype.notify = function notify(flag) {
	        this.__state = flag;
	    };
	
	    // API:
	    // skip child nodes of current node
	    Controller.prototype.skip = function () {
	        this.notify(SKIP);
	    };
	
	    // API:
	    // break traversals
	    Controller.prototype['break'] = function () {
	        this.notify(BREAK);
	    };
	
	    Controller.prototype.__initialize = function(root, visitor) {
	        this.visitor = visitor;
	        this.root = root;
	        this.__worklist = [];
	        this.__leavelist = [];
	        this.__current = null;
	        this.__state = null;
	    };
	
	    Controller.prototype.traverse = function traverse(root, visitor) {
	        var worklist,
	            leavelist,
	            element,
	            node,
	            nodeType,
	            ret,
	            key,
	            current,
	            current2,
	            candidates,
	            candidate,
	            sentinel;
	
	        this.__initialize(root, visitor);
	
	        sentinel = {};
	
	        // reference
	        worklist = this.__worklist;
	        leavelist = this.__leavelist;
	
	        // initialize
	        worklist.push(new Element(root, null, null, null));
	        leavelist.push(new Element(null, null, null, null));
	
	        while (worklist.length) {
	            element = worklist.pop();
	
	            if (element === sentinel) {
	                element = leavelist.pop();
	
	                ret = this.__execute(visitor.leave, element);
	
	                if (this.__state === BREAK || ret === BREAK) {
	                    return;
	                }
	                continue;
	            }
	
	            if (element.node) {
	
	                ret = this.__execute(visitor.enter, element);
	
	                if (this.__state === BREAK || ret === BREAK) {
	                    return;
	                }
	
	                worklist.push(sentinel);
	                leavelist.push(element);
	
	                if (this.__state === SKIP || ret === SKIP) {
	                    continue;
	                }
	
	                node = element.node;
	                nodeType = element.wrap || node.type;
	                candidates = VisitorKeys[nodeType];
	
	                current = candidates.length;
	                while ((current -= 1) >= 0) {
	                    key = candidates[current];
	                    candidate = node[key];
	                    if (!candidate) {
	                        continue;
	                    }
	
	                    if (!isArray(candidate)) {
	                        worklist.push(new Element(candidate, key, null, null));
	                        continue;
	                    }
	
	                    current2 = candidate.length;
	                    while ((current2 -= 1) >= 0) {
	                        if (!candidate[current2]) {
	                            continue;
	                        }
	                        if (nodeType === Syntax.ObjectExpression && 'properties' === candidates[current]) {
	                            element = new Element(candidate[current2], [key, current2], 'Property', null);
	                        } else {
	                            element = new Element(candidate[current2], [key, current2], null, null);
	                        }
	                        worklist.push(element);
	                    }
	                }
	            }
	        }
	    };
	
	    Controller.prototype.replace = function replace(root, visitor) {
	        var worklist,
	            leavelist,
	            node,
	            nodeType,
	            target,
	            element,
	            current,
	            current2,
	            candidates,
	            candidate,
	            sentinel,
	            outer,
	            key;
	
	        this.__initialize(root, visitor);
	
	        sentinel = {};
	
	        // reference
	        worklist = this.__worklist;
	        leavelist = this.__leavelist;
	
	        // initialize
	        outer = {
	            root: root
	        };
	        element = new Element(root, null, null, new Reference(outer, 'root'));
	        worklist.push(element);
	        leavelist.push(element);
	
	        while (worklist.length) {
	            element = worklist.pop();
	
	            if (element === sentinel) {
	                element = leavelist.pop();
	
	                target = this.__execute(visitor.leave, element);
	
	                // node may be replaced with null,
	                // so distinguish between undefined and null in this place
	                if (target !== undefined && target !== BREAK && target !== SKIP) {
	                    // replace
	                    element.ref.replace(target);
	                }
	
	                if (this.__state === BREAK || target === BREAK) {
	                    return outer.root;
	                }
	                continue;
	            }
	
	            target = this.__execute(visitor.enter, element);
	
	            // node may be replaced with null,
	            // so distinguish between undefined and null in this place
	            if (target !== undefined && target !== BREAK && target !== SKIP) {
	                // replace
	                element.ref.replace(target);
	                element.node = target;
	            }
	
	            if (this.__state === BREAK || target === BREAK) {
	                return outer.root;
	            }
	
	            // node may be null
	            node = element.node;
	            if (!node) {
	                continue;
	            }
	
	            worklist.push(sentinel);
	            leavelist.push(element);
	
	            if (this.__state === SKIP || target === SKIP) {
	                continue;
	            }
	
	            nodeType = element.wrap || node.type;
	            candidates = VisitorKeys[nodeType];
	
	            current = candidates.length;
	            while ((current -= 1) >= 0) {
	                key = candidates[current];
	                candidate = node[key];
	                if (!candidate) {
	                    continue;
	                }
	
	                if (!isArray(candidate)) {
	                    worklist.push(new Element(candidate, key, null, new Reference(node, key)));
	                    continue;
	                }
	
	                current2 = candidate.length;
	                while ((current2 -= 1) >= 0) {
	                    if (!candidate[current2]) {
	                        continue;
	                    }
	                    if (nodeType === Syntax.ObjectExpression && 'properties' === candidates[current]) {
	                        element = new Element(candidate[current2], [key, current2], 'Property', new Reference(candidate, current2));
	                    } else {
	                        element = new Element(candidate[current2], [key, current2], null, new Reference(candidate, current2));
	                    }
	                    worklist.push(element);
	                }
	            }
	        }
	
	        return outer.root;
	    };
	
	    function traverse(root, visitor) {
	        var controller = new Controller();
	        return controller.traverse(root, visitor);
	    }
	
	    function replace(root, visitor) {
	        var controller = new Controller();
	        return controller.replace(root, visitor);
	    }
	
	    function extendCommentRange(comment, tokens) {
	        var target;
	
	        target = upperBound(tokens, function search(token) {
	            return token.range[0] > comment.range[0];
	        });
	
	        comment.extendedRange = [comment.range[0], comment.range[1]];
	
	        if (target !== tokens.length) {
	            comment.extendedRange[1] = tokens[target].range[0];
	        }
	
	        target -= 1;
	        if (target >= 0) {
	            comment.extendedRange[0] = tokens[target].range[1];
	        }
	
	        return comment;
	    }
	
	    function attachComments(tree, providedComments, tokens) {
	        // At first, we should calculate extended comment ranges.
	        var comments = [], comment, len, i, cursor;
	
	        if (!tree.range) {
	            throw new Error('attachComments needs range information');
	        }
	
	        // tokens array is empty, we attach comments to tree as 'leadingComments'
	        if (!tokens.length) {
	            if (providedComments.length) {
	                for (i = 0, len = providedComments.length; i < len; i += 1) {
	                    comment = deepCopy(providedComments[i]);
	                    comment.extendedRange = [0, tree.range[0]];
	                    comments.push(comment);
	                }
	                tree.leadingComments = comments;
	            }
	            return tree;
	        }
	
	        for (i = 0, len = providedComments.length; i < len; i += 1) {
	            comments.push(extendCommentRange(deepCopy(providedComments[i]), tokens));
	        }
	
	        // This is based on John Freeman's implementation.
	        cursor = 0;
	        traverse(tree, {
	            enter: function (node) {
	                var comment;
	
	                while (cursor < comments.length) {
	                    comment = comments[cursor];
	                    if (comment.extendedRange[1] > node.range[0]) {
	                        break;
	                    }
	
	                    if (comment.extendedRange[1] === node.range[0]) {
	                        if (!node.leadingComments) {
	                            node.leadingComments = [];
	                        }
	                        node.leadingComments.push(comment);
	                        comments.splice(cursor, 1);
	                    } else {
	                        cursor += 1;
	                    }
	                }
	
	                // already out of owned node
	                if (cursor === comments.length) {
	                    return VisitorOption.Break;
	                }
	
	                if (comments[cursor].extendedRange[0] > node.range[1]) {
	                    return VisitorOption.Skip;
	                }
	            }
	        });
	
	        cursor = 0;
	        traverse(tree, {
	            leave: function (node) {
	                var comment;
	
	                while (cursor < comments.length) {
	                    comment = comments[cursor];
	                    if (node.range[1] < comment.extendedRange[0]) {
	                        break;
	                    }
	
	                    if (node.range[1] === comment.extendedRange[0]) {
	                        if (!node.trailingComments) {
	                            node.trailingComments = [];
	                        }
	                        node.trailingComments.push(comment);
	                        comments.splice(cursor, 1);
	                    } else {
	                        cursor += 1;
	                    }
	                }
	
	                // already out of owned node
	                if (cursor === comments.length) {
	                    return VisitorOption.Break;
	                }
	
	                if (comments[cursor].extendedRange[0] > node.range[1]) {
	                    return VisitorOption.Skip;
	                }
	            }
	        });
	
	        return tree;
	    }
	
	    exports.version = '1.3.2';
	    exports.Syntax = Syntax;
	    exports.traverse = traverse;
	    exports.replace = replace;
	    exports.attachComments = attachComments;
	    exports.VisitorKeys = VisitorKeys;
	    exports.VisitorOption = VisitorOption;
	    exports.Controller = Controller;
	}));
	/* vim: set sw=4 ts=4 et tw=80 : */


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	/*
	 * Copyright 2009-2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE.txt or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	exports.SourceMapGenerator = __webpack_require__(30).SourceMapGenerator;
	exports.SourceMapConsumer = __webpack_require__(36).SourceMapConsumer;
	exports.SourceNode = __webpack_require__(39).SourceNode;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var base64VLQ = __webpack_require__(31);
	var util = __webpack_require__(33);
	var ArraySet = __webpack_require__(34).ArraySet;
	var MappingList = __webpack_require__(35).MappingList;
	
	/**
	 * An instance of the SourceMapGenerator represents a source map which is
	 * being built incrementally. You may pass an object with the following
	 * properties:
	 *
	 *   - file: The filename of the generated source.
	 *   - sourceRoot: A root for all relative URLs in this source map.
	 */
	function SourceMapGenerator(aArgs) {
	  if (!aArgs) {
	    aArgs = {};
	  }
	  this._file = util.getArg(aArgs, 'file', null);
	  this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
	  this._skipValidation = util.getArg(aArgs, 'skipValidation', false);
	  this._sources = new ArraySet();
	  this._names = new ArraySet();
	  this._mappings = new MappingList();
	  this._sourcesContents = null;
	}
	
	SourceMapGenerator.prototype._version = 3;
	
	/**
	 * Creates a new SourceMapGenerator based on a SourceMapConsumer
	 *
	 * @param aSourceMapConsumer The SourceMap.
	 */
	SourceMapGenerator.fromSourceMap =
	  function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
	    var sourceRoot = aSourceMapConsumer.sourceRoot;
	    var generator = new SourceMapGenerator({
	      file: aSourceMapConsumer.file,
	      sourceRoot: sourceRoot
	    });
	    aSourceMapConsumer.eachMapping(function (mapping) {
	      var newMapping = {
	        generated: {
	          line: mapping.generatedLine,
	          column: mapping.generatedColumn
	        }
	      };
	
	      if (mapping.source != null) {
	        newMapping.source = mapping.source;
	        if (sourceRoot != null) {
	          newMapping.source = util.relative(sourceRoot, newMapping.source);
	        }
	
	        newMapping.original = {
	          line: mapping.originalLine,
	          column: mapping.originalColumn
	        };
	
	        if (mapping.name != null) {
	          newMapping.name = mapping.name;
	        }
	      }
	
	      generator.addMapping(newMapping);
	    });
	    aSourceMapConsumer.sources.forEach(function (sourceFile) {
	      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	      if (content != null) {
	        generator.setSourceContent(sourceFile, content);
	      }
	    });
	    return generator;
	  };
	
	/**
	 * Add a single mapping from original source line and column to the generated
	 * source's line and column for this source map being created. The mapping
	 * object should have the following properties:
	 *
	 *   - generated: An object with the generated line and column positions.
	 *   - original: An object with the original line and column positions.
	 *   - source: The original source file (relative to the sourceRoot).
	 *   - name: An optional original token name for this mapping.
	 */
	SourceMapGenerator.prototype.addMapping =
	  function SourceMapGenerator_addMapping(aArgs) {
	    var generated = util.getArg(aArgs, 'generated');
	    var original = util.getArg(aArgs, 'original', null);
	    var source = util.getArg(aArgs, 'source', null);
	    var name = util.getArg(aArgs, 'name', null);
	
	    if (!this._skipValidation) {
	      this._validateMapping(generated, original, source, name);
	    }
	
	    if (source != null) {
	      source = String(source);
	      if (!this._sources.has(source)) {
	        this._sources.add(source);
	      }
	    }
	
	    if (name != null) {
	      name = String(name);
	      if (!this._names.has(name)) {
	        this._names.add(name);
	      }
	    }
	
	    this._mappings.add({
	      generatedLine: generated.line,
	      generatedColumn: generated.column,
	      originalLine: original != null && original.line,
	      originalColumn: original != null && original.column,
	      source: source,
	      name: name
	    });
	  };
	
	/**
	 * Set the source content for a source file.
	 */
	SourceMapGenerator.prototype.setSourceContent =
	  function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
	    var source = aSourceFile;
	    if (this._sourceRoot != null) {
	      source = util.relative(this._sourceRoot, source);
	    }
	
	    if (aSourceContent != null) {
	      // Add the source content to the _sourcesContents map.
	      // Create a new _sourcesContents map if the property is null.
	      if (!this._sourcesContents) {
	        this._sourcesContents = Object.create(null);
	      }
	      this._sourcesContents[util.toSetString(source)] = aSourceContent;
	    } else if (this._sourcesContents) {
	      // Remove the source file from the _sourcesContents map.
	      // If the _sourcesContents map is empty, set the property to null.
	      delete this._sourcesContents[util.toSetString(source)];
	      if (Object.keys(this._sourcesContents).length === 0) {
	        this._sourcesContents = null;
	      }
	    }
	  };
	
	/**
	 * Applies the mappings of a sub-source-map for a specific source file to the
	 * source map being generated. Each mapping to the supplied source file is
	 * rewritten using the supplied source map. Note: The resolution for the
	 * resulting mappings is the minimium of this map and the supplied map.
	 *
	 * @param aSourceMapConsumer The source map to be applied.
	 * @param aSourceFile Optional. The filename of the source file.
	 *        If omitted, SourceMapConsumer's file property will be used.
	 * @param aSourceMapPath Optional. The dirname of the path to the source map
	 *        to be applied. If relative, it is relative to the SourceMapConsumer.
	 *        This parameter is needed when the two source maps aren't in the same
	 *        directory, and the source map to be applied contains relative source
	 *        paths. If so, those relative source paths need to be rewritten
	 *        relative to the SourceMapGenerator.
	 */
	SourceMapGenerator.prototype.applySourceMap =
	  function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
	    var sourceFile = aSourceFile;
	    // If aSourceFile is omitted, we will use the file property of the SourceMap
	    if (aSourceFile == null) {
	      if (aSourceMapConsumer.file == null) {
	        throw new Error(
	          'SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' +
	          'or the source map\'s "file" property. Both were omitted.'
	        );
	      }
	      sourceFile = aSourceMapConsumer.file;
	    }
	    var sourceRoot = this._sourceRoot;
	    // Make "sourceFile" relative if an absolute Url is passed.
	    if (sourceRoot != null) {
	      sourceFile = util.relative(sourceRoot, sourceFile);
	    }
	    // Applying the SourceMap can add and remove items from the sources and
	    // the names array.
	    var newSources = new ArraySet();
	    var newNames = new ArraySet();
	
	    // Find mappings for the "sourceFile"
	    this._mappings.unsortedForEach(function (mapping) {
	      if (mapping.source === sourceFile && mapping.originalLine != null) {
	        // Check if it can be mapped by the source map, then update the mapping.
	        var original = aSourceMapConsumer.originalPositionFor({
	          line: mapping.originalLine,
	          column: mapping.originalColumn
	        });
	        if (original.source != null) {
	          // Copy mapping
	          mapping.source = original.source;
	          if (aSourceMapPath != null) {
	            mapping.source = util.join(aSourceMapPath, mapping.source)
	          }
	          if (sourceRoot != null) {
	            mapping.source = util.relative(sourceRoot, mapping.source);
	          }
	          mapping.originalLine = original.line;
	          mapping.originalColumn = original.column;
	          if (original.name != null) {
	            mapping.name = original.name;
	          }
	        }
	      }
	
	      var source = mapping.source;
	      if (source != null && !newSources.has(source)) {
	        newSources.add(source);
	      }
	
	      var name = mapping.name;
	      if (name != null && !newNames.has(name)) {
	        newNames.add(name);
	      }
	
	    }, this);
	    this._sources = newSources;
	    this._names = newNames;
	
	    // Copy sourcesContents of applied map.
	    aSourceMapConsumer.sources.forEach(function (sourceFile) {
	      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	      if (content != null) {
	        if (aSourceMapPath != null) {
	          sourceFile = util.join(aSourceMapPath, sourceFile);
	        }
	        if (sourceRoot != null) {
	          sourceFile = util.relative(sourceRoot, sourceFile);
	        }
	        this.setSourceContent(sourceFile, content);
	      }
	    }, this);
	  };
	
	/**
	 * A mapping can have one of the three levels of data:
	 *
	 *   1. Just the generated position.
	 *   2. The Generated position, original position, and original source.
	 *   3. Generated and original position, original source, as well as a name
	 *      token.
	 *
	 * To maintain consistency, we validate that any new mapping being added falls
	 * in to one of these categories.
	 */
	SourceMapGenerator.prototype._validateMapping =
	  function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
	                                              aName) {
	    // When aOriginal is truthy but has empty values for .line and .column,
	    // it is most likely a programmer error. In this case we throw a very
	    // specific error message to try to guide them the right way.
	    // For example: https://github.com/Polymer/polymer-bundler/pull/519
	    if (aOriginal && typeof aOriginal.line !== 'number' && typeof aOriginal.column !== 'number') {
	        throw new Error(
	            'original.line and original.column are not numbers -- you probably meant to omit ' +
	            'the original mapping entirely and only map the generated position. If so, pass ' +
	            'null for the original mapping instead of an object with empty or null values.'
	        );
	    }
	
	    if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
	        && aGenerated.line > 0 && aGenerated.column >= 0
	        && !aOriginal && !aSource && !aName) {
	      // Case 1.
	      return;
	    }
	    else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
	             && aOriginal && 'line' in aOriginal && 'column' in aOriginal
	             && aGenerated.line > 0 && aGenerated.column >= 0
	             && aOriginal.line > 0 && aOriginal.column >= 0
	             && aSource) {
	      // Cases 2 and 3.
	      return;
	    }
	    else {
	      throw new Error('Invalid mapping: ' + JSON.stringify({
	        generated: aGenerated,
	        source: aSource,
	        original: aOriginal,
	        name: aName
	      }));
	    }
	  };
	
	/**
	 * Serialize the accumulated mappings in to the stream of base 64 VLQs
	 * specified by the source map format.
	 */
	SourceMapGenerator.prototype._serializeMappings =
	  function SourceMapGenerator_serializeMappings() {
	    var previousGeneratedColumn = 0;
	    var previousGeneratedLine = 1;
	    var previousOriginalColumn = 0;
	    var previousOriginalLine = 0;
	    var previousName = 0;
	    var previousSource = 0;
	    var result = '';
	    var next;
	    var mapping;
	    var nameIdx;
	    var sourceIdx;
	
	    var mappings = this._mappings.toArray();
	    for (var i = 0, len = mappings.length; i < len; i++) {
	      mapping = mappings[i];
	      next = ''
	
	      if (mapping.generatedLine !== previousGeneratedLine) {
	        previousGeneratedColumn = 0;
	        while (mapping.generatedLine !== previousGeneratedLine) {
	          next += ';';
	          previousGeneratedLine++;
	        }
	      }
	      else {
	        if (i > 0) {
	          if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
	            continue;
	          }
	          next += ',';
	        }
	      }
	
	      next += base64VLQ.encode(mapping.generatedColumn
	                                 - previousGeneratedColumn);
	      previousGeneratedColumn = mapping.generatedColumn;
	
	      if (mapping.source != null) {
	        sourceIdx = this._sources.indexOf(mapping.source);
	        next += base64VLQ.encode(sourceIdx - previousSource);
	        previousSource = sourceIdx;
	
	        // lines are stored 0-based in SourceMap spec version 3
	        next += base64VLQ.encode(mapping.originalLine - 1
	                                   - previousOriginalLine);
	        previousOriginalLine = mapping.originalLine - 1;
	
	        next += base64VLQ.encode(mapping.originalColumn
	                                   - previousOriginalColumn);
	        previousOriginalColumn = mapping.originalColumn;
	
	        if (mapping.name != null) {
	          nameIdx = this._names.indexOf(mapping.name);
	          next += base64VLQ.encode(nameIdx - previousName);
	          previousName = nameIdx;
	        }
	      }
	
	      result += next;
	    }
	
	    return result;
	  };
	
	SourceMapGenerator.prototype._generateSourcesContent =
	  function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
	    return aSources.map(function (source) {
	      if (!this._sourcesContents) {
	        return null;
	      }
	      if (aSourceRoot != null) {
	        source = util.relative(aSourceRoot, source);
	      }
	      var key = util.toSetString(source);
	      return Object.prototype.hasOwnProperty.call(this._sourcesContents, key)
	        ? this._sourcesContents[key]
	        : null;
	    }, this);
	  };
	
	/**
	 * Externalize the source map.
	 */
	SourceMapGenerator.prototype.toJSON =
	  function SourceMapGenerator_toJSON() {
	    var map = {
	      version: this._version,
	      sources: this._sources.toArray(),
	      names: this._names.toArray(),
	      mappings: this._serializeMappings()
	    };
	    if (this._file != null) {
	      map.file = this._file;
	    }
	    if (this._sourceRoot != null) {
	      map.sourceRoot = this._sourceRoot;
	    }
	    if (this._sourcesContents) {
	      map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
	    }
	
	    return map;
	  };
	
	/**
	 * Render the source map being generated to a string.
	 */
	SourceMapGenerator.prototype.toString =
	  function SourceMapGenerator_toString() {
	    return JSON.stringify(this.toJSON());
	  };
	
	exports.SourceMapGenerator = SourceMapGenerator;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 *
	 * Based on the Base 64 VLQ implementation in Closure Compiler:
	 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
	 *
	 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
	 * Redistribution and use in source and binary forms, with or without
	 * modification, are permitted provided that the following conditions are
	 * met:
	 *
	 *  * Redistributions of source code must retain the above copyright
	 *    notice, this list of conditions and the following disclaimer.
	 *  * Redistributions in binary form must reproduce the above
	 *    copyright notice, this list of conditions and the following
	 *    disclaimer in the documentation and/or other materials provided
	 *    with the distribution.
	 *  * Neither the name of Google Inc. nor the names of its
	 *    contributors may be used to endorse or promote products derived
	 *    from this software without specific prior written permission.
	 *
	 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
	 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
	 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
	 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
	 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
	 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
	 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 */
	
	var base64 = __webpack_require__(32);
	
	// A single base 64 digit can contain 6 bits of data. For the base 64 variable
	// length quantities we use in the source map spec, the first bit is the sign,
	// the next four bits are the actual value, and the 6th bit is the
	// continuation bit. The continuation bit tells us whether there are more
	// digits in this value following this digit.
	//
	//   Continuation
	//   |    Sign
	//   |    |
	//   V    V
	//   101011
	
	var VLQ_BASE_SHIFT = 5;
	
	// binary: 100000
	var VLQ_BASE = 1 << VLQ_BASE_SHIFT;
	
	// binary: 011111
	var VLQ_BASE_MASK = VLQ_BASE - 1;
	
	// binary: 100000
	var VLQ_CONTINUATION_BIT = VLQ_BASE;
	
	/**
	 * Converts from a two-complement value to a value where the sign bit is
	 * placed in the least significant bit.  For example, as decimals:
	 *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
	 *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
	 */
	function toVLQSigned(aValue) {
	  return aValue < 0
	    ? ((-aValue) << 1) + 1
	    : (aValue << 1) + 0;
	}
	
	/**
	 * Converts to a two-complement value from a value where the sign bit is
	 * placed in the least significant bit.  For example, as decimals:
	 *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
	 *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
	 */
	function fromVLQSigned(aValue) {
	  var isNegative = (aValue & 1) === 1;
	  var shifted = aValue >> 1;
	  return isNegative
	    ? -shifted
	    : shifted;
	}
	
	/**
	 * Returns the base 64 VLQ encoded value.
	 */
	exports.encode = function base64VLQ_encode(aValue) {
	  var encoded = "";
	  var digit;
	
	  var vlq = toVLQSigned(aValue);
	
	  do {
	    digit = vlq & VLQ_BASE_MASK;
	    vlq >>>= VLQ_BASE_SHIFT;
	    if (vlq > 0) {
	      // There are still more digits in this value, so we must make sure the
	      // continuation bit is marked.
	      digit |= VLQ_CONTINUATION_BIT;
	    }
	    encoded += base64.encode(digit);
	  } while (vlq > 0);
	
	  return encoded;
	};
	
	/**
	 * Decodes the next base 64 VLQ value from the given string and returns the
	 * value and the rest of the string via the out parameter.
	 */
	exports.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
	  var strLen = aStr.length;
	  var result = 0;
	  var shift = 0;
	  var continuation, digit;
	
	  do {
	    if (aIndex >= strLen) {
	      throw new Error("Expected more digits in base 64 VLQ value.");
	    }
	
	    digit = base64.decode(aStr.charCodeAt(aIndex++));
	    if (digit === -1) {
	      throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
	    }
	
	    continuation = !!(digit & VLQ_CONTINUATION_BIT);
	    digit &= VLQ_BASE_MASK;
	    result = result + (digit << shift);
	    shift += VLQ_BASE_SHIFT;
	  } while (continuation);
	
	  aOutParam.value = fromVLQSigned(result);
	  aOutParam.rest = aIndex;
	};


/***/ }),
/* 32 */
/***/ (function(module, exports) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');
	
	/**
	 * Encode an integer in the range of 0 to 63 to a single base 64 digit.
	 */
	exports.encode = function (number) {
	  if (0 <= number && number < intToCharMap.length) {
	    return intToCharMap[number];
	  }
	  throw new TypeError("Must be between 0 and 63: " + number);
	};
	
	/**
	 * Decode a single base 64 character code digit to an integer. Returns -1 on
	 * failure.
	 */
	exports.decode = function (charCode) {
	  var bigA = 65;     // 'A'
	  var bigZ = 90;     // 'Z'
	
	  var littleA = 97;  // 'a'
	  var littleZ = 122; // 'z'
	
	  var zero = 48;     // '0'
	  var nine = 57;     // '9'
	
	  var plus = 43;     // '+'
	  var slash = 47;    // '/'
	
	  var littleOffset = 26;
	  var numberOffset = 52;
	
	  // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
	  if (bigA <= charCode && charCode <= bigZ) {
	    return (charCode - bigA);
	  }
	
	  // 26 - 51: abcdefghijklmnopqrstuvwxyz
	  if (littleA <= charCode && charCode <= littleZ) {
	    return (charCode - littleA + littleOffset);
	  }
	
	  // 52 - 61: 0123456789
	  if (zero <= charCode && charCode <= nine) {
	    return (charCode - zero + numberOffset);
	  }
	
	  // 62: +
	  if (charCode == plus) {
	    return 62;
	  }
	
	  // 63: /
	  if (charCode == slash) {
	    return 63;
	  }
	
	  // Invalid base64 digit.
	  return -1;
	};


/***/ }),
/* 33 */
/***/ (function(module, exports) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	/**
	 * This is a helper function for getting values from parameter/options
	 * objects.
	 *
	 * @param args The object we are extracting values from
	 * @param name The name of the property we are getting.
	 * @param defaultValue An optional value to return if the property is missing
	 * from the object. If this is not specified and the property is missing, an
	 * error will be thrown.
	 */
	function getArg(aArgs, aName, aDefaultValue) {
	  if (aName in aArgs) {
	    return aArgs[aName];
	  } else if (arguments.length === 3) {
	    return aDefaultValue;
	  } else {
	    throw new Error('"' + aName + '" is a required argument.');
	  }
	}
	exports.getArg = getArg;
	
	var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.]*)(?::(\d+))?(\S*)$/;
	var dataUrlRegexp = /^data:.+\,.+$/;
	
	function urlParse(aUrl) {
	  var match = aUrl.match(urlRegexp);
	  if (!match) {
	    return null;
	  }
	  return {
	    scheme: match[1],
	    auth: match[2],
	    host: match[3],
	    port: match[4],
	    path: match[5]
	  };
	}
	exports.urlParse = urlParse;
	
	function urlGenerate(aParsedUrl) {
	  var url = '';
	  if (aParsedUrl.scheme) {
	    url += aParsedUrl.scheme + ':';
	  }
	  url += '//';
	  if (aParsedUrl.auth) {
	    url += aParsedUrl.auth + '@';
	  }
	  if (aParsedUrl.host) {
	    url += aParsedUrl.host;
	  }
	  if (aParsedUrl.port) {
	    url += ":" + aParsedUrl.port
	  }
	  if (aParsedUrl.path) {
	    url += aParsedUrl.path;
	  }
	  return url;
	}
	exports.urlGenerate = urlGenerate;
	
	/**
	 * Normalizes a path, or the path portion of a URL:
	 *
	 * - Replaces consecutive slashes with one slash.
	 * - Removes unnecessary '.' parts.
	 * - Removes unnecessary '<dir>/..' parts.
	 *
	 * Based on code in the Node.js 'path' core module.
	 *
	 * @param aPath The path or url to normalize.
	 */
	function normalize(aPath) {
	  var path = aPath;
	  var url = urlParse(aPath);
	  if (url) {
	    if (!url.path) {
	      return aPath;
	    }
	    path = url.path;
	  }
	  var isAbsolute = exports.isAbsolute(path);
	
	  var parts = path.split(/\/+/);
	  for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
	    part = parts[i];
	    if (part === '.') {
	      parts.splice(i, 1);
	    } else if (part === '..') {
	      up++;
	    } else if (up > 0) {
	      if (part === '') {
	        // The first part is blank if the path is absolute. Trying to go
	        // above the root is a no-op. Therefore we can remove all '..' parts
	        // directly after the root.
	        parts.splice(i + 1, up);
	        up = 0;
	      } else {
	        parts.splice(i, 2);
	        up--;
	      }
	    }
	  }
	  path = parts.join('/');
	
	  if (path === '') {
	    path = isAbsolute ? '/' : '.';
	  }
	
	  if (url) {
	    url.path = path;
	    return urlGenerate(url);
	  }
	  return path;
	}
	exports.normalize = normalize;
	
	/**
	 * Joins two paths/URLs.
	 *
	 * @param aRoot The root path or URL.
	 * @param aPath The path or URL to be joined with the root.
	 *
	 * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
	 *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
	 *   first.
	 * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
	 *   is updated with the result and aRoot is returned. Otherwise the result
	 *   is returned.
	 *   - If aPath is absolute, the result is aPath.
	 *   - Otherwise the two paths are joined with a slash.
	 * - Joining for example 'http://' and 'www.example.com' is also supported.
	 */
	function join(aRoot, aPath) {
	  if (aRoot === "") {
	    aRoot = ".";
	  }
	  if (aPath === "") {
	    aPath = ".";
	  }
	  var aPathUrl = urlParse(aPath);
	  var aRootUrl = urlParse(aRoot);
	  if (aRootUrl) {
	    aRoot = aRootUrl.path || '/';
	  }
	
	  // `join(foo, '//www.example.org')`
	  if (aPathUrl && !aPathUrl.scheme) {
	    if (aRootUrl) {
	      aPathUrl.scheme = aRootUrl.scheme;
	    }
	    return urlGenerate(aPathUrl);
	  }
	
	  if (aPathUrl || aPath.match(dataUrlRegexp)) {
	    return aPath;
	  }
	
	  // `join('http://', 'www.example.com')`
	  if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
	    aRootUrl.host = aPath;
	    return urlGenerate(aRootUrl);
	  }
	
	  var joined = aPath.charAt(0) === '/'
	    ? aPath
	    : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);
	
	  if (aRootUrl) {
	    aRootUrl.path = joined;
	    return urlGenerate(aRootUrl);
	  }
	  return joined;
	}
	exports.join = join;
	
	exports.isAbsolute = function (aPath) {
	  return aPath.charAt(0) === '/' || !!aPath.match(urlRegexp);
	};
	
	/**
	 * Make a path relative to a URL or another path.
	 *
	 * @param aRoot The root path or URL.
	 * @param aPath The path or URL to be made relative to aRoot.
	 */
	function relative(aRoot, aPath) {
	  if (aRoot === "") {
	    aRoot = ".";
	  }
	
	  aRoot = aRoot.replace(/\/$/, '');
	
	  // It is possible for the path to be above the root. In this case, simply
	  // checking whether the root is a prefix of the path won't work. Instead, we
	  // need to remove components from the root one by one, until either we find
	  // a prefix that fits, or we run out of components to remove.
	  var level = 0;
	  while (aPath.indexOf(aRoot + '/') !== 0) {
	    var index = aRoot.lastIndexOf("/");
	    if (index < 0) {
	      return aPath;
	    }
	
	    // If the only part of the root that is left is the scheme (i.e. http://,
	    // file:///, etc.), one or more slashes (/), or simply nothing at all, we
	    // have exhausted all components, so the path is not relative to the root.
	    aRoot = aRoot.slice(0, index);
	    if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
	      return aPath;
	    }
	
	    ++level;
	  }
	
	  // Make sure we add a "../" for each component we removed from the root.
	  return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
	}
	exports.relative = relative;
	
	var supportsNullProto = (function () {
	  var obj = Object.create(null);
	  return !('__proto__' in obj);
	}());
	
	function identity (s) {
	  return s;
	}
	
	/**
	 * Because behavior goes wacky when you set `__proto__` on objects, we
	 * have to prefix all the strings in our set with an arbitrary character.
	 *
	 * See https://github.com/mozilla/source-map/pull/31 and
	 * https://github.com/mozilla/source-map/issues/30
	 *
	 * @param String aStr
	 */
	function toSetString(aStr) {
	  if (isProtoString(aStr)) {
	    return '$' + aStr;
	  }
	
	  return aStr;
	}
	exports.toSetString = supportsNullProto ? identity : toSetString;
	
	function fromSetString(aStr) {
	  if (isProtoString(aStr)) {
	    return aStr.slice(1);
	  }
	
	  return aStr;
	}
	exports.fromSetString = supportsNullProto ? identity : fromSetString;
	
	function isProtoString(s) {
	  if (!s) {
	    return false;
	  }
	
	  var length = s.length;
	
	  if (length < 9 /* "__proto__".length */) {
	    return false;
	  }
	
	  if (s.charCodeAt(length - 1) !== 95  /* '_' */ ||
	      s.charCodeAt(length - 2) !== 95  /* '_' */ ||
	      s.charCodeAt(length - 3) !== 111 /* 'o' */ ||
	      s.charCodeAt(length - 4) !== 116 /* 't' */ ||
	      s.charCodeAt(length - 5) !== 111 /* 'o' */ ||
	      s.charCodeAt(length - 6) !== 114 /* 'r' */ ||
	      s.charCodeAt(length - 7) !== 112 /* 'p' */ ||
	      s.charCodeAt(length - 8) !== 95  /* '_' */ ||
	      s.charCodeAt(length - 9) !== 95  /* '_' */) {
	    return false;
	  }
	
	  for (var i = length - 10; i >= 0; i--) {
	    if (s.charCodeAt(i) !== 36 /* '$' */) {
	      return false;
	    }
	  }
	
	  return true;
	}
	
	/**
	 * Comparator between two mappings where the original positions are compared.
	 *
	 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
	 * mappings with the same original source/line/column, but different generated
	 * line and column the same. Useful when searching for a mapping with a
	 * stubbed out mapping.
	 */
	function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
	  var cmp = mappingA.source - mappingB.source;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalLine - mappingB.originalLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalColumn - mappingB.originalColumn;
	  if (cmp !== 0 || onlyCompareOriginal) {
	    return cmp;
	  }
	
	  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.generatedLine - mappingB.generatedLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  return mappingA.name - mappingB.name;
	}
	exports.compareByOriginalPositions = compareByOriginalPositions;
	
	/**
	 * Comparator between two mappings with deflated source and name indices where
	 * the generated positions are compared.
	 *
	 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
	 * mappings with the same generated line and column, but different
	 * source/name/original line and column the same. Useful when searching for a
	 * mapping with a stubbed out mapping.
	 */
	function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
	  var cmp = mappingA.generatedLine - mappingB.generatedLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	  if (cmp !== 0 || onlyCompareGenerated) {
	    return cmp;
	  }
	
	  cmp = mappingA.source - mappingB.source;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalLine - mappingB.originalLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalColumn - mappingB.originalColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  return mappingA.name - mappingB.name;
	}
	exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;
	
	function strcmp(aStr1, aStr2) {
	  if (aStr1 === aStr2) {
	    return 0;
	  }
	
	  if (aStr1 > aStr2) {
	    return 1;
	  }
	
	  return -1;
	}
	
	/**
	 * Comparator between two mappings with inflated source and name strings where
	 * the generated positions are compared.
	 */
	function compareByGeneratedPositionsInflated(mappingA, mappingB) {
	  var cmp = mappingA.generatedLine - mappingB.generatedLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = strcmp(mappingA.source, mappingB.source);
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalLine - mappingB.originalLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalColumn - mappingB.originalColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var util = __webpack_require__(33);
	var has = Object.prototype.hasOwnProperty;
	var hasNativeMap = typeof Map !== "undefined";
	
	/**
	 * A data structure which is a combination of an array and a set. Adding a new
	 * member is O(1), testing for membership is O(1), and finding the index of an
	 * element is O(1). Removing elements from the set is not supported. Only
	 * strings are supported for membership.
	 */
	function ArraySet() {
	  this._array = [];
	  this._set = hasNativeMap ? new Map() : Object.create(null);
	}
	
	/**
	 * Static method for creating ArraySet instances from an existing array.
	 */
	ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
	  var set = new ArraySet();
	  for (var i = 0, len = aArray.length; i < len; i++) {
	    set.add(aArray[i], aAllowDuplicates);
	  }
	  return set;
	};
	
	/**
	 * Return how many unique items are in this ArraySet. If duplicates have been
	 * added, than those do not count towards the size.
	 *
	 * @returns Number
	 */
	ArraySet.prototype.size = function ArraySet_size() {
	  return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
	};
	
	/**
	 * Add the given string to this set.
	 *
	 * @param String aStr
	 */
	ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
	  var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
	  var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
	  var idx = this._array.length;
	  if (!isDuplicate || aAllowDuplicates) {
	    this._array.push(aStr);
	  }
	  if (!isDuplicate) {
	    if (hasNativeMap) {
	      this._set.set(aStr, idx);
	    } else {
	      this._set[sStr] = idx;
	    }
	  }
	};
	
	/**
	 * Is the given string a member of this set?
	 *
	 * @param String aStr
	 */
	ArraySet.prototype.has = function ArraySet_has(aStr) {
	  if (hasNativeMap) {
	    return this._set.has(aStr);
	  } else {
	    var sStr = util.toSetString(aStr);
	    return has.call(this._set, sStr);
	  }
	};
	
	/**
	 * What is the index of the given string in the array?
	 *
	 * @param String aStr
	 */
	ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
	  if (hasNativeMap) {
	    var idx = this._set.get(aStr);
	    if (idx >= 0) {
	        return idx;
	    }
	  } else {
	    var sStr = util.toSetString(aStr);
	    if (has.call(this._set, sStr)) {
	      return this._set[sStr];
	    }
	  }
	
	  throw new Error('"' + aStr + '" is not in the set.');
	};
	
	/**
	 * What is the element at the given index?
	 *
	 * @param Number aIdx
	 */
	ArraySet.prototype.at = function ArraySet_at(aIdx) {
	  if (aIdx >= 0 && aIdx < this._array.length) {
	    return this._array[aIdx];
	  }
	  throw new Error('No element indexed by ' + aIdx);
	};
	
	/**
	 * Returns the array representation of this set (which has the proper indices
	 * indicated by indexOf). Note that this is a copy of the internal array used
	 * for storing the members so that no one can mess with internal state.
	 */
	ArraySet.prototype.toArray = function ArraySet_toArray() {
	  return this._array.slice();
	};
	
	exports.ArraySet = ArraySet;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2014 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var util = __webpack_require__(33);
	
	/**
	 * Determine whether mappingB is after mappingA with respect to generated
	 * position.
	 */
	function generatedPositionAfter(mappingA, mappingB) {
	  // Optimized for most common case
	  var lineA = mappingA.generatedLine;
	  var lineB = mappingB.generatedLine;
	  var columnA = mappingA.generatedColumn;
	  var columnB = mappingB.generatedColumn;
	  return lineB > lineA || lineB == lineA && columnB >= columnA ||
	         util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
	}
	
	/**
	 * A data structure to provide a sorted view of accumulated mappings in a
	 * performance conscious manner. It trades a neglibable overhead in general
	 * case for a large speedup in case of mappings being added in order.
	 */
	function MappingList() {
	  this._array = [];
	  this._sorted = true;
	  // Serves as infimum
	  this._last = {generatedLine: -1, generatedColumn: 0};
	}
	
	/**
	 * Iterate through internal items. This method takes the same arguments that
	 * `Array.prototype.forEach` takes.
	 *
	 * NOTE: The order of the mappings is NOT guaranteed.
	 */
	MappingList.prototype.unsortedForEach =
	  function MappingList_forEach(aCallback, aThisArg) {
	    this._array.forEach(aCallback, aThisArg);
	  };
	
	/**
	 * Add the given source mapping.
	 *
	 * @param Object aMapping
	 */
	MappingList.prototype.add = function MappingList_add(aMapping) {
	  if (generatedPositionAfter(this._last, aMapping)) {
	    this._last = aMapping;
	    this._array.push(aMapping);
	  } else {
	    this._sorted = false;
	    this._array.push(aMapping);
	  }
	};
	
	/**
	 * Returns the flat, sorted array of mappings. The mappings are sorted by
	 * generated position.
	 *
	 * WARNING: This method returns internal data without copying, for
	 * performance. The return value must NOT be mutated, and should be treated as
	 * an immutable borrow. If you want to take ownership, you must make your own
	 * copy.
	 */
	MappingList.prototype.toArray = function MappingList_toArray() {
	  if (!this._sorted) {
	    this._array.sort(util.compareByGeneratedPositionsInflated);
	    this._sorted = true;
	  }
	  return this._array;
	};
	
	exports.MappingList = MappingList;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var util = __webpack_require__(33);
	var binarySearch = __webpack_require__(37);
	var ArraySet = __webpack_require__(34).ArraySet;
	var base64VLQ = __webpack_require__(31);
	var quickSort = __webpack_require__(38).quickSort;
	
	function SourceMapConsumer(aSourceMap) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
	  }
	
	  return sourceMap.sections != null
	    ? new IndexedSourceMapConsumer(sourceMap)
	    : new BasicSourceMapConsumer(sourceMap);
	}
	
	SourceMapConsumer.fromSourceMap = function(aSourceMap) {
	  return BasicSourceMapConsumer.fromSourceMap(aSourceMap);
	}
	
	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	SourceMapConsumer.prototype._version = 3;
	
	// `__generatedMappings` and `__originalMappings` are arrays that hold the
	// parsed mapping coordinates from the source map's "mappings" attribute. They
	// are lazily instantiated, accessed via the `_generatedMappings` and
	// `_originalMappings` getters respectively, and we only parse the mappings
	// and create these arrays once queried for a source location. We jump through
	// these hoops because there can be many thousands of mappings, and parsing
	// them is expensive, so we only want to do it if we must.
	//
	// Each object in the arrays is of the form:
	//
	//     {
	//       generatedLine: The line number in the generated code,
	//       generatedColumn: The column number in the generated code,
	//       source: The path to the original source file that generated this
	//               chunk of code,
	//       originalLine: The line number in the original source that
	//                     corresponds to this chunk of generated code,
	//       originalColumn: The column number in the original source that
	//                       corresponds to this chunk of generated code,
	//       name: The name of the original symbol which generated this chunk of
	//             code.
	//     }
	//
	// All properties except for `generatedLine` and `generatedColumn` can be
	// `null`.
	//
	// `_generatedMappings` is ordered by the generated positions.
	//
	// `_originalMappings` is ordered by the original positions.
	
	SourceMapConsumer.prototype.__generatedMappings = null;
	Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
	  get: function () {
	    if (!this.__generatedMappings) {
	      this._parseMappings(this._mappings, this.sourceRoot);
	    }
	
	    return this.__generatedMappings;
	  }
	});
	
	SourceMapConsumer.prototype.__originalMappings = null;
	Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
	  get: function () {
	    if (!this.__originalMappings) {
	      this._parseMappings(this._mappings, this.sourceRoot);
	    }
	
	    return this.__originalMappings;
	  }
	});
	
	SourceMapConsumer.prototype._charIsMappingSeparator =
	  function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
	    var c = aStr.charAt(index);
	    return c === ";" || c === ",";
	  };
	
	/**
	 * Parse the mappings in a string in to a data structure which we can easily
	 * query (the ordered arrays in the `this.__generatedMappings` and
	 * `this.__originalMappings` properties).
	 */
	SourceMapConsumer.prototype._parseMappings =
	  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	    throw new Error("Subclasses must implement _parseMappings");
	  };
	
	SourceMapConsumer.GENERATED_ORDER = 1;
	SourceMapConsumer.ORIGINAL_ORDER = 2;
	
	SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
	SourceMapConsumer.LEAST_UPPER_BOUND = 2;
	
	/**
	 * Iterate over each mapping between an original source/line/column and a
	 * generated line/column in this source map.
	 *
	 * @param Function aCallback
	 *        The function that is called with each mapping.
	 * @param Object aContext
	 *        Optional. If specified, this object will be the value of `this` every
	 *        time that `aCallback` is called.
	 * @param aOrder
	 *        Either `SourceMapConsumer.GENERATED_ORDER` or
	 *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
	 *        iterate over the mappings sorted by the generated file's line/column
	 *        order or the original's source/line/column order, respectively. Defaults to
	 *        `SourceMapConsumer.GENERATED_ORDER`.
	 */
	SourceMapConsumer.prototype.eachMapping =
	  function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
	    var context = aContext || null;
	    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;
	
	    var mappings;
	    switch (order) {
	    case SourceMapConsumer.GENERATED_ORDER:
	      mappings = this._generatedMappings;
	      break;
	    case SourceMapConsumer.ORIGINAL_ORDER:
	      mappings = this._originalMappings;
	      break;
	    default:
	      throw new Error("Unknown order of iteration.");
	    }
	
	    var sourceRoot = this.sourceRoot;
	    mappings.map(function (mapping) {
	      var source = mapping.source === null ? null : this._sources.at(mapping.source);
	      if (source != null && sourceRoot != null) {
	        source = util.join(sourceRoot, source);
	      }
	      return {
	        source: source,
	        generatedLine: mapping.generatedLine,
	        generatedColumn: mapping.generatedColumn,
	        originalLine: mapping.originalLine,
	        originalColumn: mapping.originalColumn,
	        name: mapping.name === null ? null : this._names.at(mapping.name)
	      };
	    }, this).forEach(aCallback, context);
	  };
	
	/**
	 * Returns all generated line and column information for the original source,
	 * line, and column provided. If no column is provided, returns all mappings
	 * corresponding to a either the line we are searching for or the next
	 * closest line that has any mappings. Otherwise, returns all mappings
	 * corresponding to the given line and either the column we are searching for
	 * or the next closest column that has any offsets.
	 *
	 * The only argument is an object with the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.
	 *   - column: Optional. the column number in the original source.
	 *
	 * and an array of objects is returned, each with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.
	 *   - column: The column number in the generated source, or null.
	 */
	SourceMapConsumer.prototype.allGeneratedPositionsFor =
	  function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
	    var line = util.getArg(aArgs, 'line');
	
	    // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
	    // returns the index of the closest mapping less than the needle. By
	    // setting needle.originalColumn to 0, we thus find the last mapping for
	    // the given line, provided such a mapping exists.
	    var needle = {
	      source: util.getArg(aArgs, 'source'),
	      originalLine: line,
	      originalColumn: util.getArg(aArgs, 'column', 0)
	    };
	
	    if (this.sourceRoot != null) {
	      needle.source = util.relative(this.sourceRoot, needle.source);
	    }
	    if (!this._sources.has(needle.source)) {
	      return [];
	    }
	    needle.source = this._sources.indexOf(needle.source);
	
	    var mappings = [];
	
	    var index = this._findMapping(needle,
	                                  this._originalMappings,
	                                  "originalLine",
	                                  "originalColumn",
	                                  util.compareByOriginalPositions,
	                                  binarySearch.LEAST_UPPER_BOUND);
	    if (index >= 0) {
	      var mapping = this._originalMappings[index];
	
	      if (aArgs.column === undefined) {
	        var originalLine = mapping.originalLine;
	
	        // Iterate until either we run out of mappings, or we run into
	        // a mapping for a different line than the one we found. Since
	        // mappings are sorted, this is guaranteed to find all mappings for
	        // the line we found.
	        while (mapping && mapping.originalLine === originalLine) {
	          mappings.push({
	            line: util.getArg(mapping, 'generatedLine', null),
	            column: util.getArg(mapping, 'generatedColumn', null),
	            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	          });
	
	          mapping = this._originalMappings[++index];
	        }
	      } else {
	        var originalColumn = mapping.originalColumn;
	
	        // Iterate until either we run out of mappings, or we run into
	        // a mapping for a different line than the one we were searching for.
	        // Since mappings are sorted, this is guaranteed to find all mappings for
	        // the line we are searching for.
	        while (mapping &&
	               mapping.originalLine === line &&
	               mapping.originalColumn == originalColumn) {
	          mappings.push({
	            line: util.getArg(mapping, 'generatedLine', null),
	            column: util.getArg(mapping, 'generatedColumn', null),
	            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	          });
	
	          mapping = this._originalMappings[++index];
	        }
	      }
	    }
	
	    return mappings;
	  };
	
	exports.SourceMapConsumer = SourceMapConsumer;
	
	/**
	 * A BasicSourceMapConsumer instance represents a parsed source map which we can
	 * query for information about the original file positions by giving it a file
	 * position in the generated source.
	 *
	 * The only parameter is the raw source map (either as a JSON string, or
	 * already parsed to an object). According to the spec, source maps have the
	 * following attributes:
	 *
	 *   - version: Which version of the source map spec this map is following.
	 *   - sources: An array of URLs to the original source files.
	 *   - names: An array of identifiers which can be referrenced by individual mappings.
	 *   - sourceRoot: Optional. The URL root from which all sources are relative.
	 *   - sourcesContent: Optional. An array of contents of the original source files.
	 *   - mappings: A string of base64 VLQs which contain the actual mappings.
	 *   - file: Optional. The generated file this source map is associated with.
	 *
	 * Here is an example source map, taken from the source map spec[0]:
	 *
	 *     {
	 *       version : 3,
	 *       file: "out.js",
	 *       sourceRoot : "",
	 *       sources: ["foo.js", "bar.js"],
	 *       names: ["src", "maps", "are", "fun"],
	 *       mappings: "AA,AB;;ABCDE;"
	 *     }
	 *
	 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
	 */
	function BasicSourceMapConsumer(aSourceMap) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
	  }
	
	  var version = util.getArg(sourceMap, 'version');
	  var sources = util.getArg(sourceMap, 'sources');
	  // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
	  // requires the array) to play nice here.
	  var names = util.getArg(sourceMap, 'names', []);
	  var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
	  var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
	  var mappings = util.getArg(sourceMap, 'mappings');
	  var file = util.getArg(sourceMap, 'file', null);
	
	  // Once again, Sass deviates from the spec and supplies the version as a
	  // string rather than a number, so we use loose equality checking here.
	  if (version != this._version) {
	    throw new Error('Unsupported version: ' + version);
	  }
	
	  sources = sources
	    .map(String)
	    // Some source maps produce relative source paths like "./foo.js" instead of
	    // "foo.js".  Normalize these first so that future comparisons will succeed.
	    // See bugzil.la/1090768.
	    .map(util.normalize)
	    // Always ensure that absolute sources are internally stored relative to
	    // the source root, if the source root is absolute. Not doing this would
	    // be particularly problematic when the source root is a prefix of the
	    // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
	    .map(function (source) {
	      return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source)
	        ? util.relative(sourceRoot, source)
	        : source;
	    });
	
	  // Pass `true` below to allow duplicate names and sources. While source maps
	  // are intended to be compressed and deduplicated, the TypeScript compiler
	  // sometimes generates source maps with duplicates in them. See Github issue
	  // #72 and bugzil.la/889492.
	  this._names = ArraySet.fromArray(names.map(String), true);
	  this._sources = ArraySet.fromArray(sources, true);
	
	  this.sourceRoot = sourceRoot;
	  this.sourcesContent = sourcesContent;
	  this._mappings = mappings;
	  this.file = file;
	}
	
	BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
	BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;
	
	/**
	 * Create a BasicSourceMapConsumer from a SourceMapGenerator.
	 *
	 * @param SourceMapGenerator aSourceMap
	 *        The source map that will be consumed.
	 * @returns BasicSourceMapConsumer
	 */
	BasicSourceMapConsumer.fromSourceMap =
	  function SourceMapConsumer_fromSourceMap(aSourceMap) {
	    var smc = Object.create(BasicSourceMapConsumer.prototype);
	
	    var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
	    var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
	    smc.sourceRoot = aSourceMap._sourceRoot;
	    smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
	                                                            smc.sourceRoot);
	    smc.file = aSourceMap._file;
	
	    // Because we are modifying the entries (by converting string sources and
	    // names to indices into the sources and names ArraySets), we have to make
	    // a copy of the entry or else bad things happen. Shared mutable state
	    // strikes again! See github issue #191.
	
	    var generatedMappings = aSourceMap._mappings.toArray().slice();
	    var destGeneratedMappings = smc.__generatedMappings = [];
	    var destOriginalMappings = smc.__originalMappings = [];
	
	    for (var i = 0, length = generatedMappings.length; i < length; i++) {
	      var srcMapping = generatedMappings[i];
	      var destMapping = new Mapping;
	      destMapping.generatedLine = srcMapping.generatedLine;
	      destMapping.generatedColumn = srcMapping.generatedColumn;
	
	      if (srcMapping.source) {
	        destMapping.source = sources.indexOf(srcMapping.source);
	        destMapping.originalLine = srcMapping.originalLine;
	        destMapping.originalColumn = srcMapping.originalColumn;
	
	        if (srcMapping.name) {
	          destMapping.name = names.indexOf(srcMapping.name);
	        }
	
	        destOriginalMappings.push(destMapping);
	      }
	
	      destGeneratedMappings.push(destMapping);
	    }
	
	    quickSort(smc.__originalMappings, util.compareByOriginalPositions);
	
	    return smc;
	  };
	
	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	BasicSourceMapConsumer.prototype._version = 3;
	
	/**
	 * The list of original sources.
	 */
	Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
	  get: function () {
	    return this._sources.toArray().map(function (s) {
	      return this.sourceRoot != null ? util.join(this.sourceRoot, s) : s;
	    }, this);
	  }
	});
	
	/**
	 * Provide the JIT with a nice shape / hidden class.
	 */
	function Mapping() {
	  this.generatedLine = 0;
	  this.generatedColumn = 0;
	  this.source = null;
	  this.originalLine = null;
	  this.originalColumn = null;
	  this.name = null;
	}
	
	/**
	 * Parse the mappings in a string in to a data structure which we can easily
	 * query (the ordered arrays in the `this.__generatedMappings` and
	 * `this.__originalMappings` properties).
	 */
	BasicSourceMapConsumer.prototype._parseMappings =
	  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	    var generatedLine = 1;
	    var previousGeneratedColumn = 0;
	    var previousOriginalLine = 0;
	    var previousOriginalColumn = 0;
	    var previousSource = 0;
	    var previousName = 0;
	    var length = aStr.length;
	    var index = 0;
	    var cachedSegments = {};
	    var temp = {};
	    var originalMappings = [];
	    var generatedMappings = [];
	    var mapping, str, segment, end, value;
	
	    while (index < length) {
	      if (aStr.charAt(index) === ';') {
	        generatedLine++;
	        index++;
	        previousGeneratedColumn = 0;
	      }
	      else if (aStr.charAt(index) === ',') {
	        index++;
	      }
	      else {
	        mapping = new Mapping();
	        mapping.generatedLine = generatedLine;
	
	        // Because each offset is encoded relative to the previous one,
	        // many segments often have the same encoding. We can exploit this
	        // fact by caching the parsed variable length fields of each segment,
	        // allowing us to avoid a second parse if we encounter the same
	        // segment again.
	        for (end = index; end < length; end++) {
	          if (this._charIsMappingSeparator(aStr, end)) {
	            break;
	          }
	        }
	        str = aStr.slice(index, end);
	
	        segment = cachedSegments[str];
	        if (segment) {
	          index += str.length;
	        } else {
	          segment = [];
	          while (index < end) {
	            base64VLQ.decode(aStr, index, temp);
	            value = temp.value;
	            index = temp.rest;
	            segment.push(value);
	          }
	
	          if (segment.length === 2) {
	            throw new Error('Found a source, but no line and column');
	          }
	
	          if (segment.length === 3) {
	            throw new Error('Found a source and line, but no column');
	          }
	
	          cachedSegments[str] = segment;
	        }
	
	        // Generated column.
	        mapping.generatedColumn = previousGeneratedColumn + segment[0];
	        previousGeneratedColumn = mapping.generatedColumn;
	
	        if (segment.length > 1) {
	          // Original source.
	          mapping.source = previousSource + segment[1];
	          previousSource += segment[1];
	
	          // Original line.
	          mapping.originalLine = previousOriginalLine + segment[2];
	          previousOriginalLine = mapping.originalLine;
	          // Lines are stored 0-based
	          mapping.originalLine += 1;
	
	          // Original column.
	          mapping.originalColumn = previousOriginalColumn + segment[3];
	          previousOriginalColumn = mapping.originalColumn;
	
	          if (segment.length > 4) {
	            // Original name.
	            mapping.name = previousName + segment[4];
	            previousName += segment[4];
	          }
	        }
	
	        generatedMappings.push(mapping);
	        if (typeof mapping.originalLine === 'number') {
	          originalMappings.push(mapping);
	        }
	      }
	    }
	
	    quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
	    this.__generatedMappings = generatedMappings;
	
	    quickSort(originalMappings, util.compareByOriginalPositions);
	    this.__originalMappings = originalMappings;
	  };
	
	/**
	 * Find the mapping that best matches the hypothetical "needle" mapping that
	 * we are searching for in the given "haystack" of mappings.
	 */
	BasicSourceMapConsumer.prototype._findMapping =
	  function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
	                                         aColumnName, aComparator, aBias) {
	    // To return the position we are searching for, we must first find the
	    // mapping for the given position and then return the opposite position it
	    // points to. Because the mappings are sorted, we can use binary search to
	    // find the best mapping.
	
	    if (aNeedle[aLineName] <= 0) {
	      throw new TypeError('Line must be greater than or equal to 1, got '
	                          + aNeedle[aLineName]);
	    }
	    if (aNeedle[aColumnName] < 0) {
	      throw new TypeError('Column must be greater than or equal to 0, got '
	                          + aNeedle[aColumnName]);
	    }
	
	    return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
	  };
	
	/**
	 * Compute the last column for each generated mapping. The last column is
	 * inclusive.
	 */
	BasicSourceMapConsumer.prototype.computeColumnSpans =
	  function SourceMapConsumer_computeColumnSpans() {
	    for (var index = 0; index < this._generatedMappings.length; ++index) {
	      var mapping = this._generatedMappings[index];
	
	      // Mappings do not contain a field for the last generated columnt. We
	      // can come up with an optimistic estimate, however, by assuming that
	      // mappings are contiguous (i.e. given two consecutive mappings, the
	      // first mapping ends where the second one starts).
	      if (index + 1 < this._generatedMappings.length) {
	        var nextMapping = this._generatedMappings[index + 1];
	
	        if (mapping.generatedLine === nextMapping.generatedLine) {
	          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
	          continue;
	        }
	      }
	
	      // The last mapping for each line spans the entire line.
	      mapping.lastGeneratedColumn = Infinity;
	    }
	  };
	
	/**
	 * Returns the original source, line, and column information for the generated
	 * source's line and column positions provided. The only argument is an object
	 * with the following properties:
	 *
	 *   - line: The line number in the generated source.
	 *   - column: The column number in the generated source.
	 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - source: The original source file, or null.
	 *   - line: The line number in the original source, or null.
	 *   - column: The column number in the original source, or null.
	 *   - name: The original identifier, or null.
	 */
	BasicSourceMapConsumer.prototype.originalPositionFor =
	  function SourceMapConsumer_originalPositionFor(aArgs) {
	    var needle = {
	      generatedLine: util.getArg(aArgs, 'line'),
	      generatedColumn: util.getArg(aArgs, 'column')
	    };
	
	    var index = this._findMapping(
	      needle,
	      this._generatedMappings,
	      "generatedLine",
	      "generatedColumn",
	      util.compareByGeneratedPositionsDeflated,
	      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
	    );
	
	    if (index >= 0) {
	      var mapping = this._generatedMappings[index];
	
	      if (mapping.generatedLine === needle.generatedLine) {
	        var source = util.getArg(mapping, 'source', null);
	        if (source !== null) {
	          source = this._sources.at(source);
	          if (this.sourceRoot != null) {
	            source = util.join(this.sourceRoot, source);
	          }
	        }
	        var name = util.getArg(mapping, 'name', null);
	        if (name !== null) {
	          name = this._names.at(name);
	        }
	        return {
	          source: source,
	          line: util.getArg(mapping, 'originalLine', null),
	          column: util.getArg(mapping, 'originalColumn', null),
	          name: name
	        };
	      }
	    }
	
	    return {
	      source: null,
	      line: null,
	      column: null,
	      name: null
	    };
	  };
	
	/**
	 * Return true if we have the source content for every source in the source
	 * map, false otherwise.
	 */
	BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
	  function BasicSourceMapConsumer_hasContentsOfAllSources() {
	    if (!this.sourcesContent) {
	      return false;
	    }
	    return this.sourcesContent.length >= this._sources.size() &&
	      !this.sourcesContent.some(function (sc) { return sc == null; });
	  };
	
	/**
	 * Returns the original source content. The only argument is the url of the
	 * original source file. Returns null if no original source content is
	 * available.
	 */
	BasicSourceMapConsumer.prototype.sourceContentFor =
	  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	    if (!this.sourcesContent) {
	      return null;
	    }
	
	    if (this.sourceRoot != null) {
	      aSource = util.relative(this.sourceRoot, aSource);
	    }
	
	    if (this._sources.has(aSource)) {
	      return this.sourcesContent[this._sources.indexOf(aSource)];
	    }
	
	    var url;
	    if (this.sourceRoot != null
	        && (url = util.urlParse(this.sourceRoot))) {
	      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
	      // many users. We can help them out when they expect file:// URIs to
	      // behave like it would if they were running a local HTTP server. See
	      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
	      var fileUriAbsPath = aSource.replace(/^file:\/\//, "");
	      if (url.scheme == "file"
	          && this._sources.has(fileUriAbsPath)) {
	        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
	      }
	
	      if ((!url.path || url.path == "/")
	          && this._sources.has("/" + aSource)) {
	        return this.sourcesContent[this._sources.indexOf("/" + aSource)];
	      }
	    }
	
	    // This function is used recursively from
	    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
	    // don't want to throw if we can't find the source - we just want to
	    // return null, so we provide a flag to exit gracefully.
	    if (nullOnMissing) {
	      return null;
	    }
	    else {
	      throw new Error('"' + aSource + '" is not in the SourceMap.');
	    }
	  };
	
	/**
	 * Returns the generated line and column information for the original source,
	 * line, and column positions provided. The only argument is an object with
	 * the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.
	 *   - column: The column number in the original source.
	 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.
	 *   - column: The column number in the generated source, or null.
	 */
	BasicSourceMapConsumer.prototype.generatedPositionFor =
	  function SourceMapConsumer_generatedPositionFor(aArgs) {
	    var source = util.getArg(aArgs, 'source');
	    if (this.sourceRoot != null) {
	      source = util.relative(this.sourceRoot, source);
	    }
	    if (!this._sources.has(source)) {
	      return {
	        line: null,
	        column: null,
	        lastColumn: null
	      };
	    }
	    source = this._sources.indexOf(source);
	
	    var needle = {
	      source: source,
	      originalLine: util.getArg(aArgs, 'line'),
	      originalColumn: util.getArg(aArgs, 'column')
	    };
	
	    var index = this._findMapping(
	      needle,
	      this._originalMappings,
	      "originalLine",
	      "originalColumn",
	      util.compareByOriginalPositions,
	      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
	    );
	
	    if (index >= 0) {
	      var mapping = this._originalMappings[index];
	
	      if (mapping.source === needle.source) {
	        return {
	          line: util.getArg(mapping, 'generatedLine', null),
	          column: util.getArg(mapping, 'generatedColumn', null),
	          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	        };
	      }
	    }
	
	    return {
	      line: null,
	      column: null,
	      lastColumn: null
	    };
	  };
	
	exports.BasicSourceMapConsumer = BasicSourceMapConsumer;
	
	/**
	 * An IndexedSourceMapConsumer instance represents a parsed source map which
	 * we can query for information. It differs from BasicSourceMapConsumer in
	 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
	 * input.
	 *
	 * The only parameter is a raw source map (either as a JSON string, or already
	 * parsed to an object). According to the spec for indexed source maps, they
	 * have the following attributes:
	 *
	 *   - version: Which version of the source map spec this map is following.
	 *   - file: Optional. The generated file this source map is associated with.
	 *   - sections: A list of section definitions.
	 *
	 * Each value under the "sections" field has two fields:
	 *   - offset: The offset into the original specified at which this section
	 *       begins to apply, defined as an object with a "line" and "column"
	 *       field.
	 *   - map: A source map definition. This source map could also be indexed,
	 *       but doesn't have to be.
	 *
	 * Instead of the "map" field, it's also possible to have a "url" field
	 * specifying a URL to retrieve a source map from, but that's currently
	 * unsupported.
	 *
	 * Here's an example source map, taken from the source map spec[0], but
	 * modified to omit a section which uses the "url" field.
	 *
	 *  {
	 *    version : 3,
	 *    file: "app.js",
	 *    sections: [{
	 *      offset: {line:100, column:10},
	 *      map: {
	 *        version : 3,
	 *        file: "section.js",
	 *        sources: ["foo.js", "bar.js"],
	 *        names: ["src", "maps", "are", "fun"],
	 *        mappings: "AAAA,E;;ABCDE;"
	 *      }
	 *    }],
	 *  }
	 *
	 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
	 */
	function IndexedSourceMapConsumer(aSourceMap) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
	  }
	
	  var version = util.getArg(sourceMap, 'version');
	  var sections = util.getArg(sourceMap, 'sections');
	
	  if (version != this._version) {
	    throw new Error('Unsupported version: ' + version);
	  }
	
	  this._sources = new ArraySet();
	  this._names = new ArraySet();
	
	  var lastOffset = {
	    line: -1,
	    column: 0
	  };
	  this._sections = sections.map(function (s) {
	    if (s.url) {
	      // The url field will require support for asynchronicity.
	      // See https://github.com/mozilla/source-map/issues/16
	      throw new Error('Support for url field in sections not implemented.');
	    }
	    var offset = util.getArg(s, 'offset');
	    var offsetLine = util.getArg(offset, 'line');
	    var offsetColumn = util.getArg(offset, 'column');
	
	    if (offsetLine < lastOffset.line ||
	        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
	      throw new Error('Section offsets must be ordered and non-overlapping.');
	    }
	    lastOffset = offset;
	
	    return {
	      generatedOffset: {
	        // The offset fields are 0-based, but we use 1-based indices when
	        // encoding/decoding from VLQ.
	        generatedLine: offsetLine + 1,
	        generatedColumn: offsetColumn + 1
	      },
	      consumer: new SourceMapConsumer(util.getArg(s, 'map'))
	    }
	  });
	}
	
	IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
	IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;
	
	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	IndexedSourceMapConsumer.prototype._version = 3;
	
	/**
	 * The list of original sources.
	 */
	Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
	  get: function () {
	    var sources = [];
	    for (var i = 0; i < this._sections.length; i++) {
	      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
	        sources.push(this._sections[i].consumer.sources[j]);
	      }
	    }
	    return sources;
	  }
	});
	
	/**
	 * Returns the original source, line, and column information for the generated
	 * source's line and column positions provided. The only argument is an object
	 * with the following properties:
	 *
	 *   - line: The line number in the generated source.
	 *   - column: The column number in the generated source.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - source: The original source file, or null.
	 *   - line: The line number in the original source, or null.
	 *   - column: The column number in the original source, or null.
	 *   - name: The original identifier, or null.
	 */
	IndexedSourceMapConsumer.prototype.originalPositionFor =
	  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
	    var needle = {
	      generatedLine: util.getArg(aArgs, 'line'),
	      generatedColumn: util.getArg(aArgs, 'column')
	    };
	
	    // Find the section containing the generated position we're trying to map
	    // to an original position.
	    var sectionIndex = binarySearch.search(needle, this._sections,
	      function(needle, section) {
	        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
	        if (cmp) {
	          return cmp;
	        }
	
	        return (needle.generatedColumn -
	                section.generatedOffset.generatedColumn);
	      });
	    var section = this._sections[sectionIndex];
	
	    if (!section) {
	      return {
	        source: null,
	        line: null,
	        column: null,
	        name: null
	      };
	    }
	
	    return section.consumer.originalPositionFor({
	      line: needle.generatedLine -
	        (section.generatedOffset.generatedLine - 1),
	      column: needle.generatedColumn -
	        (section.generatedOffset.generatedLine === needle.generatedLine
	         ? section.generatedOffset.generatedColumn - 1
	         : 0),
	      bias: aArgs.bias
	    });
	  };
	
	/**
	 * Return true if we have the source content for every source in the source
	 * map, false otherwise.
	 */
	IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
	  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
	    return this._sections.every(function (s) {
	      return s.consumer.hasContentsOfAllSources();
	    });
	  };
	
	/**
	 * Returns the original source content. The only argument is the url of the
	 * original source file. Returns null if no original source content is
	 * available.
	 */
	IndexedSourceMapConsumer.prototype.sourceContentFor =
	  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	
	      var content = section.consumer.sourceContentFor(aSource, true);
	      if (content) {
	        return content;
	      }
	    }
	    if (nullOnMissing) {
	      return null;
	    }
	    else {
	      throw new Error('"' + aSource + '" is not in the SourceMap.');
	    }
	  };
	
	/**
	 * Returns the generated line and column information for the original source,
	 * line, and column positions provided. The only argument is an object with
	 * the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.
	 *   - column: The column number in the original source.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.
	 *   - column: The column number in the generated source, or null.
	 */
	IndexedSourceMapConsumer.prototype.generatedPositionFor =
	  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	
	      // Only consider this section if the requested source is in the list of
	      // sources of the consumer.
	      if (section.consumer.sources.indexOf(util.getArg(aArgs, 'source')) === -1) {
	        continue;
	      }
	      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
	      if (generatedPosition) {
	        var ret = {
	          line: generatedPosition.line +
	            (section.generatedOffset.generatedLine - 1),
	          column: generatedPosition.column +
	            (section.generatedOffset.generatedLine === generatedPosition.line
	             ? section.generatedOffset.generatedColumn - 1
	             : 0)
	        };
	        return ret;
	      }
	    }
	
	    return {
	      line: null,
	      column: null
	    };
	  };
	
	/**
	 * Parse the mappings in a string in to a data structure which we can easily
	 * query (the ordered arrays in the `this.__generatedMappings` and
	 * `this.__originalMappings` properties).
	 */
	IndexedSourceMapConsumer.prototype._parseMappings =
	  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	    this.__generatedMappings = [];
	    this.__originalMappings = [];
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	      var sectionMappings = section.consumer._generatedMappings;
	      for (var j = 0; j < sectionMappings.length; j++) {
	        var mapping = sectionMappings[j];
	
	        var source = section.consumer._sources.at(mapping.source);
	        if (section.consumer.sourceRoot !== null) {
	          source = util.join(section.consumer.sourceRoot, source);
	        }
	        this._sources.add(source);
	        source = this._sources.indexOf(source);
	
	        var name = section.consumer._names.at(mapping.name);
	        this._names.add(name);
	        name = this._names.indexOf(name);
	
	        // The mappings coming from the consumer for the section have
	        // generated positions relative to the start of the section, so we
	        // need to offset them to be relative to the start of the concatenated
	        // generated file.
	        var adjustedMapping = {
	          source: source,
	          generatedLine: mapping.generatedLine +
	            (section.generatedOffset.generatedLine - 1),
	          generatedColumn: mapping.generatedColumn +
	            (section.generatedOffset.generatedLine === mapping.generatedLine
	            ? section.generatedOffset.generatedColumn - 1
	            : 0),
	          originalLine: mapping.originalLine,
	          originalColumn: mapping.originalColumn,
	          name: name
	        };
	
	        this.__generatedMappings.push(adjustedMapping);
	        if (typeof adjustedMapping.originalLine === 'number') {
	          this.__originalMappings.push(adjustedMapping);
	        }
	      }
	    }
	
	    quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
	    quickSort(this.__originalMappings, util.compareByOriginalPositions);
	  };
	
	exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;


/***/ }),
/* 37 */
/***/ (function(module, exports) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	exports.GREATEST_LOWER_BOUND = 1;
	exports.LEAST_UPPER_BOUND = 2;
	
	/**
	 * Recursive implementation of binary search.
	 *
	 * @param aLow Indices here and lower do not contain the needle.
	 * @param aHigh Indices here and higher do not contain the needle.
	 * @param aNeedle The element being searched for.
	 * @param aHaystack The non-empty array being searched.
	 * @param aCompare Function which takes two elements and returns -1, 0, or 1.
	 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
	 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 */
	function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
	  // This function terminates when one of the following is true:
	  //
	  //   1. We find the exact element we are looking for.
	  //
	  //   2. We did not find the exact element, but we can return the index of
	  //      the next-closest element.
	  //
	  //   3. We did not find the exact element, and there is no next-closest
	  //      element than the one we are searching for, so we return -1.
	  var mid = Math.floor((aHigh - aLow) / 2) + aLow;
	  var cmp = aCompare(aNeedle, aHaystack[mid], true);
	  if (cmp === 0) {
	    // Found the element we are looking for.
	    return mid;
	  }
	  else if (cmp > 0) {
	    // Our needle is greater than aHaystack[mid].
	    if (aHigh - mid > 1) {
	      // The element is in the upper half.
	      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
	    }
	
	    // The exact needle element was not found in this haystack. Determine if
	    // we are in termination case (3) or (2) and return the appropriate thing.
	    if (aBias == exports.LEAST_UPPER_BOUND) {
	      return aHigh < aHaystack.length ? aHigh : -1;
	    } else {
	      return mid;
	    }
	  }
	  else {
	    // Our needle is less than aHaystack[mid].
	    if (mid - aLow > 1) {
	      // The element is in the lower half.
	      return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
	    }
	
	    // we are in termination case (3) or (2) and return the appropriate thing.
	    if (aBias == exports.LEAST_UPPER_BOUND) {
	      return mid;
	    } else {
	      return aLow < 0 ? -1 : aLow;
	    }
	  }
	}
	
	/**
	 * This is an implementation of binary search which will always try and return
	 * the index of the closest element if there is no exact hit. This is because
	 * mappings between original and generated line/col pairs are single points,
	 * and there is an implicit region between each of them, so a miss just means
	 * that you aren't on the very start of a region.
	 *
	 * @param aNeedle The element you are looking for.
	 * @param aHaystack The array that is being searched.
	 * @param aCompare A function which takes the needle and an element in the
	 *     array and returns -1, 0, or 1 depending on whether the needle is less
	 *     than, equal to, or greater than the element, respectively.
	 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
	 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
	 */
	exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
	  if (aHaystack.length === 0) {
	    return -1;
	  }
	
	  var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,
	                              aCompare, aBias || exports.GREATEST_LOWER_BOUND);
	  if (index < 0) {
	    return -1;
	  }
	
	  // We have found either the exact element, or the next-closest element than
	  // the one we are searching for. However, there may be more than one such
	  // element. Make sure we always return the smallest of these.
	  while (index - 1 >= 0) {
	    if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
	      break;
	    }
	    --index;
	  }
	
	  return index;
	};


/***/ }),
/* 38 */
/***/ (function(module, exports) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	// It turns out that some (most?) JavaScript engines don't self-host
	// `Array.prototype.sort`. This makes sense because C++ will likely remain
	// faster than JS when doing raw CPU-intensive sorting. However, when using a
	// custom comparator function, calling back and forth between the VM's C++ and
	// JIT'd JS is rather slow *and* loses JIT type information, resulting in
	// worse generated code for the comparator function than would be optimal. In
	// fact, when sorting with a comparator, these costs outweigh the benefits of
	// sorting in C++. By using our own JS-implemented Quick Sort (below), we get
	// a ~3500ms mean speed-up in `bench/bench.html`.
	
	/**
	 * Swap the elements indexed by `x` and `y` in the array `ary`.
	 *
	 * @param {Array} ary
	 *        The array.
	 * @param {Number} x
	 *        The index of the first item.
	 * @param {Number} y
	 *        The index of the second item.
	 */
	function swap(ary, x, y) {
	  var temp = ary[x];
	  ary[x] = ary[y];
	  ary[y] = temp;
	}
	
	/**
	 * Returns a random integer within the range `low .. high` inclusive.
	 *
	 * @param {Number} low
	 *        The lower bound on the range.
	 * @param {Number} high
	 *        The upper bound on the range.
	 */
	function randomIntInRange(low, high) {
	  return Math.round(low + (Math.random() * (high - low)));
	}
	
	/**
	 * The Quick Sort algorithm.
	 *
	 * @param {Array} ary
	 *        An array to sort.
	 * @param {function} comparator
	 *        Function to use to compare two items.
	 * @param {Number} p
	 *        Start index of the array
	 * @param {Number} r
	 *        End index of the array
	 */
	function doQuickSort(ary, comparator, p, r) {
	  // If our lower bound is less than our upper bound, we (1) partition the
	  // array into two pieces and (2) recurse on each half. If it is not, this is
	  // the empty array and our base case.
	
	  if (p < r) {
	    // (1) Partitioning.
	    //
	    // The partitioning chooses a pivot between `p` and `r` and moves all
	    // elements that are less than or equal to the pivot to the before it, and
	    // all the elements that are greater than it after it. The effect is that
	    // once partition is done, the pivot is in the exact place it will be when
	    // the array is put in sorted order, and it will not need to be moved
	    // again. This runs in O(n) time.
	
	    // Always choose a random pivot so that an input array which is reverse
	    // sorted does not cause O(n^2) running time.
	    var pivotIndex = randomIntInRange(p, r);
	    var i = p - 1;
	
	    swap(ary, pivotIndex, r);
	    var pivot = ary[r];
	
	    // Immediately after `j` is incremented in this loop, the following hold
	    // true:
	    //
	    //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
	    //
	    //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
	    for (var j = p; j < r; j++) {
	      if (comparator(ary[j], pivot) <= 0) {
	        i += 1;
	        swap(ary, i, j);
	      }
	    }
	
	    swap(ary, i + 1, j);
	    var q = i + 1;
	
	    // (2) Recurse on each half.
	
	    doQuickSort(ary, comparator, p, q - 1);
	    doQuickSort(ary, comparator, q + 1, r);
	  }
	}
	
	/**
	 * Sort the given array in-place with the given comparator function.
	 *
	 * @param {Array} ary
	 *        An array to sort.
	 * @param {function} comparator
	 *        Function to use to compare two items.
	 */
	exports.quickSort = function (ary, comparator) {
	  doQuickSort(ary, comparator, 0, ary.length - 1);
	};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var SourceMapGenerator = __webpack_require__(30).SourceMapGenerator;
	var util = __webpack_require__(33);
	
	// Matches a Windows-style `\r\n` newline or a `\n` newline used by all other
	// operating systems these days (capturing the result).
	var REGEX_NEWLINE = /(\r?\n)/;
	
	// Newline character code for charCodeAt() comparisons
	var NEWLINE_CODE = 10;
	
	// Private symbol for identifying `SourceNode`s when multiple versions of
	// the source-map library are loaded. This MUST NOT CHANGE across
	// versions!
	var isSourceNode = "$$$isSourceNode$$$";
	
	/**
	 * SourceNodes provide a way to abstract over interpolating/concatenating
	 * snippets of generated JavaScript source code while maintaining the line and
	 * column information associated with the original source code.
	 *
	 * @param aLine The original line number.
	 * @param aColumn The original column number.
	 * @param aSource The original source's filename.
	 * @param aChunks Optional. An array of strings which are snippets of
	 *        generated JS, or other SourceNodes.
	 * @param aName The original identifier.
	 */
	function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
	  this.children = [];
	  this.sourceContents = {};
	  this.line = aLine == null ? null : aLine;
	  this.column = aColumn == null ? null : aColumn;
	  this.source = aSource == null ? null : aSource;
	  this.name = aName == null ? null : aName;
	  this[isSourceNode] = true;
	  if (aChunks != null) this.add(aChunks);
	}
	
	/**
	 * Creates a SourceNode from generated code and a SourceMapConsumer.
	 *
	 * @param aGeneratedCode The generated code
	 * @param aSourceMapConsumer The SourceMap for the generated code
	 * @param aRelativePath Optional. The path that relative sources in the
	 *        SourceMapConsumer should be relative to.
	 */
	SourceNode.fromStringWithSourceMap =
	  function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
	    // The SourceNode we want to fill with the generated code
	    // and the SourceMap
	    var node = new SourceNode();
	
	    // All even indices of this array are one line of the generated code,
	    // while all odd indices are the newlines between two adjacent lines
	    // (since `REGEX_NEWLINE` captures its match).
	    // Processed fragments are accessed by calling `shiftNextLine`.
	    var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
	    var remainingLinesIndex = 0;
	    var shiftNextLine = function() {
	      var lineContents = getNextLine();
	      // The last line of a file might not have a newline.
	      var newLine = getNextLine() || "";
	      return lineContents + newLine;
	
	      function getNextLine() {
	        return remainingLinesIndex < remainingLines.length ?
	            remainingLines[remainingLinesIndex++] : undefined;
	      }
	    };
	
	    // We need to remember the position of "remainingLines"
	    var lastGeneratedLine = 1, lastGeneratedColumn = 0;
	
	    // The generate SourceNodes we need a code range.
	    // To extract it current and last mapping is used.
	    // Here we store the last mapping.
	    var lastMapping = null;
	
	    aSourceMapConsumer.eachMapping(function (mapping) {
	      if (lastMapping !== null) {
	        // We add the code from "lastMapping" to "mapping":
	        // First check if there is a new line in between.
	        if (lastGeneratedLine < mapping.generatedLine) {
	          // Associate first line with "lastMapping"
	          addMappingWithCode(lastMapping, shiftNextLine());
	          lastGeneratedLine++;
	          lastGeneratedColumn = 0;
	          // The remaining code is added without mapping
	        } else {
	          // There is no new line in between.
	          // Associate the code between "lastGeneratedColumn" and
	          // "mapping.generatedColumn" with "lastMapping"
	          var nextLine = remainingLines[remainingLinesIndex];
	          var code = nextLine.substr(0, mapping.generatedColumn -
	                                        lastGeneratedColumn);
	          remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn -
	                                              lastGeneratedColumn);
	          lastGeneratedColumn = mapping.generatedColumn;
	          addMappingWithCode(lastMapping, code);
	          // No more remaining code, continue
	          lastMapping = mapping;
	          return;
	        }
	      }
	      // We add the generated code until the first mapping
	      // to the SourceNode without any mapping.
	      // Each line is added as separate string.
	      while (lastGeneratedLine < mapping.generatedLine) {
	        node.add(shiftNextLine());
	        lastGeneratedLine++;
	      }
	      if (lastGeneratedColumn < mapping.generatedColumn) {
	        var nextLine = remainingLines[remainingLinesIndex];
	        node.add(nextLine.substr(0, mapping.generatedColumn));
	        remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn);
	        lastGeneratedColumn = mapping.generatedColumn;
	      }
	      lastMapping = mapping;
	    }, this);
	    // We have processed all mappings.
	    if (remainingLinesIndex < remainingLines.length) {
	      if (lastMapping) {
	        // Associate the remaining code in the current line with "lastMapping"
	        addMappingWithCode(lastMapping, shiftNextLine());
	      }
	      // and add the remaining lines without any mapping
	      node.add(remainingLines.splice(remainingLinesIndex).join(""));
	    }
	
	    // Copy sourcesContent into SourceNode
	    aSourceMapConsumer.sources.forEach(function (sourceFile) {
	      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	      if (content != null) {
	        if (aRelativePath != null) {
	          sourceFile = util.join(aRelativePath, sourceFile);
	        }
	        node.setSourceContent(sourceFile, content);
	      }
	    });
	
	    return node;
	
	    function addMappingWithCode(mapping, code) {
	      if (mapping === null || mapping.source === undefined) {
	        node.add(code);
	      } else {
	        var source = aRelativePath
	          ? util.join(aRelativePath, mapping.source)
	          : mapping.source;
	        node.add(new SourceNode(mapping.originalLine,
	                                mapping.originalColumn,
	                                source,
	                                code,
	                                mapping.name));
	      }
	    }
	  };
	
	/**
	 * Add a chunk of generated JS to this source node.
	 *
	 * @param aChunk A string snippet of generated JS code, another instance of
	 *        SourceNode, or an array where each member is one of those things.
	 */
	SourceNode.prototype.add = function SourceNode_add(aChunk) {
	  if (Array.isArray(aChunk)) {
	    aChunk.forEach(function (chunk) {
	      this.add(chunk);
	    }, this);
	  }
	  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
	    if (aChunk) {
	      this.children.push(aChunk);
	    }
	  }
	  else {
	    throw new TypeError(
	      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
	    );
	  }
	  return this;
	};
	
	/**
	 * Add a chunk of generated JS to the beginning of this source node.
	 *
	 * @param aChunk A string snippet of generated JS code, another instance of
	 *        SourceNode, or an array where each member is one of those things.
	 */
	SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
	  if (Array.isArray(aChunk)) {
	    for (var i = aChunk.length-1; i >= 0; i--) {
	      this.prepend(aChunk[i]);
	    }
	  }
	  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
	    this.children.unshift(aChunk);
	  }
	  else {
	    throw new TypeError(
	      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
	    );
	  }
	  return this;
	};
	
	/**
	 * Walk over the tree of JS snippets in this node and its children. The
	 * walking function is called once for each snippet of JS and is passed that
	 * snippet and the its original associated source's line/column location.
	 *
	 * @param aFn The traversal function.
	 */
	SourceNode.prototype.walk = function SourceNode_walk(aFn) {
	  var chunk;
	  for (var i = 0, len = this.children.length; i < len; i++) {
	    chunk = this.children[i];
	    if (chunk[isSourceNode]) {
	      chunk.walk(aFn);
	    }
	    else {
	      if (chunk !== '') {
	        aFn(chunk, { source: this.source,
	                     line: this.line,
	                     column: this.column,
	                     name: this.name });
	      }
	    }
	  }
	};
	
	/**
	 * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
	 * each of `this.children`.
	 *
	 * @param aSep The separator.
	 */
	SourceNode.prototype.join = function SourceNode_join(aSep) {
	  var newChildren;
	  var i;
	  var len = this.children.length;
	  if (len > 0) {
	    newChildren = [];
	    for (i = 0; i < len-1; i++) {
	      newChildren.push(this.children[i]);
	      newChildren.push(aSep);
	    }
	    newChildren.push(this.children[i]);
	    this.children = newChildren;
	  }
	  return this;
	};
	
	/**
	 * Call String.prototype.replace on the very right-most source snippet. Useful
	 * for trimming whitespace from the end of a source node, etc.
	 *
	 * @param aPattern The pattern to replace.
	 * @param aReplacement The thing to replace the pattern with.
	 */
	SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
	  var lastChild = this.children[this.children.length - 1];
	  if (lastChild[isSourceNode]) {
	    lastChild.replaceRight(aPattern, aReplacement);
	  }
	  else if (typeof lastChild === 'string') {
	    this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
	  }
	  else {
	    this.children.push(''.replace(aPattern, aReplacement));
	  }
	  return this;
	};
	
	/**
	 * Set the source content for a source file. This will be added to the SourceMapGenerator
	 * in the sourcesContent field.
	 *
	 * @param aSourceFile The filename of the source file
	 * @param aSourceContent The content of the source file
	 */
	SourceNode.prototype.setSourceContent =
	  function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
	    this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
	  };
	
	/**
	 * Walk over the tree of SourceNodes. The walking function is called for each
	 * source file content and is passed the filename and source content.
	 *
	 * @param aFn The traversal function.
	 */
	SourceNode.prototype.walkSourceContents =
	  function SourceNode_walkSourceContents(aFn) {
	    for (var i = 0, len = this.children.length; i < len; i++) {
	      if (this.children[i][isSourceNode]) {
	        this.children[i].walkSourceContents(aFn);
	      }
	    }
	
	    var sources = Object.keys(this.sourceContents);
	    for (var i = 0, len = sources.length; i < len; i++) {
	      aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
	    }
	  };
	
	/**
	 * Return the string representation of this source node. Walks over the tree
	 * and concatenates all the various snippets together to one string.
	 */
	SourceNode.prototype.toString = function SourceNode_toString() {
	  var str = "";
	  this.walk(function (chunk) {
	    str += chunk;
	  });
	  return str;
	};
	
	/**
	 * Returns the string representation of this source node along with a source
	 * map.
	 */
	SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
	  var generated = {
	    code: "",
	    line: 1,
	    column: 0
	  };
	  var map = new SourceMapGenerator(aArgs);
	  var sourceMappingActive = false;
	  var lastOriginalSource = null;
	  var lastOriginalLine = null;
	  var lastOriginalColumn = null;
	  var lastOriginalName = null;
	  this.walk(function (chunk, original) {
	    generated.code += chunk;
	    if (original.source !== null
	        && original.line !== null
	        && original.column !== null) {
	      if(lastOriginalSource !== original.source
	         || lastOriginalLine !== original.line
	         || lastOriginalColumn !== original.column
	         || lastOriginalName !== original.name) {
	        map.addMapping({
	          source: original.source,
	          original: {
	            line: original.line,
	            column: original.column
	          },
	          generated: {
	            line: generated.line,
	            column: generated.column
	          },
	          name: original.name
	        });
	      }
	      lastOriginalSource = original.source;
	      lastOriginalLine = original.line;
	      lastOriginalColumn = original.column;
	      lastOriginalName = original.name;
	      sourceMappingActive = true;
	    } else if (sourceMappingActive) {
	      map.addMapping({
	        generated: {
	          line: generated.line,
	          column: generated.column
	        }
	      });
	      lastOriginalSource = null;
	      sourceMappingActive = false;
	    }
	    for (var idx = 0, length = chunk.length; idx < length; idx++) {
	      if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
	        generated.line++;
	        generated.column = 0;
	        // Mappings end at eol
	        if (idx + 1 === length) {
	          lastOriginalSource = null;
	          sourceMappingActive = false;
	        } else if (sourceMappingActive) {
	          map.addMapping({
	            source: original.source,
	            original: {
	              line: original.line,
	              column: original.column
	            },
	            generated: {
	              line: generated.line,
	              column: generated.column
	            },
	            name: original.name
	          });
	        }
	      } else {
	        generated.column++;
	      }
	    }
	  });
	  this.walkSourceContents(function (sourceFile, sourceContent) {
	    map.setSourceContent(sourceFile, sourceContent);
	  });
	
	  return { code: generated.code, map: map };
	};
	
	exports.SourceNode = SourceNode;


/***/ }),
/* 40 */
/***/ (function(module, exports) {

	module.exports = {"name":"escodegen","description":"ECMAScript code generator","homepage":"http://github.com/Constellation/escodegen.html","main":"escodegen.js","bin":{"esgenerate":"./bin/esgenerate.js","escodegen":"./bin/escodegen.js"},"version":"0.0.28","engines":{"node":">=0.4.0"},"maintainers":[{"name":"Yusuke Suzuki","email":"utatane.tea@gmail.com","web":"http://github.com/Constellation"}],"repository":{"type":"git","url":"http://github.com/Constellation/escodegen.git"},"dependencies":{"esprima":"~1.0.2","estraverse":"~1.3.0"},"optionalDependencies":{"source-map":">= 0.1.2"},"devDependencies":{"esprima-moz":"*","commonjs-everywhere":"~0.8.0","q":"*","bower":"*","semver":"*","chai":"~1.7.2","grunt-contrib-jshint":"~0.5.0","grunt-cli":"~0.1.9","grunt":"~0.4.1","grunt-mocha-test":"~0.6.2"},"licenses":[{"type":"BSD","url":"http://github.com/Constellation/escodegen/raw/master/LICENSE.BSD"}],"scripts":{"test":"grunt travis","unit-test":"grunt test","lint":"grunt lint","release":"node tools/release.js","build-min":"./node_modules/.bin/cjsify -ma path: tools/entry-point.js > escodegen.browser.min.js","build":"./node_modules/.bin/cjsify -a path: tools/entry-point.js > escodegen.browser.js"}}

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.7.0
	//     http://underscorejs.org
	//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	//     Underscore may be freely distributed under the MIT license.
	
	(function() {
	
	  // Baseline setup
	  // --------------
	
	  // Establish the root object, `window` in the browser, or `exports` on the server.
	  var root = this;
	
	  // Save the previous value of the `_` variable.
	  var previousUnderscore = root._;
	
	  // Save bytes in the minified (but not gzipped) version:
	  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
	
	  // Create quick reference variables for speed access to core prototypes.
	  var
	    push             = ArrayProto.push,
	    slice            = ArrayProto.slice,
	    concat           = ArrayProto.concat,
	    toString         = ObjProto.toString,
	    hasOwnProperty   = ObjProto.hasOwnProperty;
	
	  // All **ECMAScript 5** native function implementations that we hope to use
	  // are declared here.
	  var
	    nativeIsArray      = Array.isArray,
	    nativeKeys         = Object.keys,
	    nativeBind         = FuncProto.bind;
	
	  // Create a safe reference to the Underscore object for use below.
	  var _ = function(obj) {
	    if (obj instanceof _) return obj;
	    if (!(this instanceof _)) return new _(obj);
	    this._wrapped = obj;
	  };
	
	  // Export the Underscore object for **Node.js**, with
	  // backwards-compatibility for the old `require()` API. If we're in
	  // the browser, add `_` as a global object.
	  if (true) {
	    if (typeof module !== 'undefined' && module.exports) {
	      exports = module.exports = _;
	    }
	    exports._ = _;
	  } else {
	    root._ = _;
	  }
	
	  // Current version.
	  _.VERSION = '1.7.0';
	
	  // Internal function that returns an efficient (for current engines) version
	  // of the passed-in callback, to be repeatedly applied in other Underscore
	  // functions.
	  var createCallback = function(func, context, argCount) {
	    if (context === void 0) return func;
	    switch (argCount == null ? 3 : argCount) {
	      case 1: return function(value) {
	        return func.call(context, value);
	      };
	      case 2: return function(value, other) {
	        return func.call(context, value, other);
	      };
	      case 3: return function(value, index, collection) {
	        return func.call(context, value, index, collection);
	      };
	      case 4: return function(accumulator, value, index, collection) {
	        return func.call(context, accumulator, value, index, collection);
	      };
	    }
	    return function() {
	      return func.apply(context, arguments);
	    };
	  };
	
	  // A mostly-internal function to generate callbacks that can be applied
	  // to each element in a collection, returning the desired result — either
	  // identity, an arbitrary callback, a property matcher, or a property accessor.
	  _.iteratee = function(value, context, argCount) {
	    if (value == null) return _.identity;
	    if (_.isFunction(value)) return createCallback(value, context, argCount);
	    if (_.isObject(value)) return _.matches(value);
	    return _.property(value);
	  };
	
	  // Collection Functions
	  // --------------------
	
	  // The cornerstone, an `each` implementation, aka `forEach`.
	  // Handles raw objects in addition to array-likes. Treats all
	  // sparse array-likes as if they were dense.
	  _.each = _.forEach = function(obj, iteratee, context) {
	    if (obj == null) return obj;
	    iteratee = createCallback(iteratee, context);
	    var i, length = obj.length;
	    if (length === +length) {
	      for (i = 0; i < length; i++) {
	        iteratee(obj[i], i, obj);
	      }
	    } else {
	      var keys = _.keys(obj);
	      for (i = 0, length = keys.length; i < length; i++) {
	        iteratee(obj[keys[i]], keys[i], obj);
	      }
	    }
	    return obj;
	  };
	
	  // Return the results of applying the iteratee to each element.
	  _.map = _.collect = function(obj, iteratee, context) {
	    if (obj == null) return [];
	    iteratee = _.iteratee(iteratee, context);
	    var keys = obj.length !== +obj.length && _.keys(obj),
	        length = (keys || obj).length,
	        results = Array(length),
	        currentKey;
	    for (var index = 0; index < length; index++) {
	      currentKey = keys ? keys[index] : index;
	      results[index] = iteratee(obj[currentKey], currentKey, obj);
	    }
	    return results;
	  };
	
	  var reduceError = 'Reduce of empty array with no initial value';
	
	  // **Reduce** builds up a single result from a list of values, aka `inject`,
	  // or `foldl`.
	  _.reduce = _.foldl = _.inject = function(obj, iteratee, memo, context) {
	    if (obj == null) obj = [];
	    iteratee = createCallback(iteratee, context, 4);
	    var keys = obj.length !== +obj.length && _.keys(obj),
	        length = (keys || obj).length,
	        index = 0, currentKey;
	    if (arguments.length < 3) {
	      if (!length) throw new TypeError(reduceError);
	      memo = obj[keys ? keys[index++] : index++];
	    }
	    for (; index < length; index++) {
	      currentKey = keys ? keys[index] : index;
	      memo = iteratee(memo, obj[currentKey], currentKey, obj);
	    }
	    return memo;
	  };
	
	  // The right-associative version of reduce, also known as `foldr`.
	  _.reduceRight = _.foldr = function(obj, iteratee, memo, context) {
	    if (obj == null) obj = [];
	    iteratee = createCallback(iteratee, context, 4);
	    var keys = obj.length !== + obj.length && _.keys(obj),
	        index = (keys || obj).length,
	        currentKey;
	    if (arguments.length < 3) {
	      if (!index) throw new TypeError(reduceError);
	      memo = obj[keys ? keys[--index] : --index];
	    }
	    while (index--) {
	      currentKey = keys ? keys[index] : index;
	      memo = iteratee(memo, obj[currentKey], currentKey, obj);
	    }
	    return memo;
	  };
	
	  // Return the first value which passes a truth test. Aliased as `detect`.
	  _.find = _.detect = function(obj, predicate, context) {
	    var result;
	    predicate = _.iteratee(predicate, context);
	    _.some(obj, function(value, index, list) {
	      if (predicate(value, index, list)) {
	        result = value;
	        return true;
	      }
	    });
	    return result;
	  };
	
	  // Return all the elements that pass a truth test.
	  // Aliased as `select`.
	  _.filter = _.select = function(obj, predicate, context) {
	    var results = [];
	    if (obj == null) return results;
	    predicate = _.iteratee(predicate, context);
	    _.each(obj, function(value, index, list) {
	      if (predicate(value, index, list)) results.push(value);
	    });
	    return results;
	  };
	
	  // Return all the elements for which a truth test fails.
	  _.reject = function(obj, predicate, context) {
	    return _.filter(obj, _.negate(_.iteratee(predicate)), context);
	  };
	
	  // Determine whether all of the elements match a truth test.
	  // Aliased as `all`.
	  _.every = _.all = function(obj, predicate, context) {
	    if (obj == null) return true;
	    predicate = _.iteratee(predicate, context);
	    var keys = obj.length !== +obj.length && _.keys(obj),
	        length = (keys || obj).length,
	        index, currentKey;
	    for (index = 0; index < length; index++) {
	      currentKey = keys ? keys[index] : index;
	      if (!predicate(obj[currentKey], currentKey, obj)) return false;
	    }
	    return true;
	  };
	
	  // Determine if at least one element in the object matches a truth test.
	  // Aliased as `any`.
	  _.some = _.any = function(obj, predicate, context) {
	    if (obj == null) return false;
	    predicate = _.iteratee(predicate, context);
	    var keys = obj.length !== +obj.length && _.keys(obj),
	        length = (keys || obj).length,
	        index, currentKey;
	    for (index = 0; index < length; index++) {
	      currentKey = keys ? keys[index] : index;
	      if (predicate(obj[currentKey], currentKey, obj)) return true;
	    }
	    return false;
	  };
	
	  // Determine if the array or object contains a given value (using `===`).
	  // Aliased as `include`.
	  _.contains = _.include = function(obj, target) {
	    if (obj == null) return false;
	    if (obj.length !== +obj.length) obj = _.values(obj);
	    return _.indexOf(obj, target) >= 0;
	  };
	
	  // Invoke a method (with arguments) on every item in a collection.
	  _.invoke = function(obj, method) {
	    var args = slice.call(arguments, 2);
	    var isFunc = _.isFunction(method);
	    return _.map(obj, function(value) {
	      return (isFunc ? method : value[method]).apply(value, args);
	    });
	  };
	
	  // Convenience version of a common use case of `map`: fetching a property.
	  _.pluck = function(obj, key) {
	    return _.map(obj, _.property(key));
	  };
	
	  // Convenience version of a common use case of `filter`: selecting only objects
	  // containing specific `key:value` pairs.
	  _.where = function(obj, attrs) {
	    return _.filter(obj, _.matches(attrs));
	  };
	
	  // Convenience version of a common use case of `find`: getting the first object
	  // containing specific `key:value` pairs.
	  _.findWhere = function(obj, attrs) {
	    return _.find(obj, _.matches(attrs));
	  };
	
	  // Return the maximum element (or element-based computation).
	  _.max = function(obj, iteratee, context) {
	    var result = -Infinity, lastComputed = -Infinity,
	        value, computed;
	    if (iteratee == null && obj != null) {
	      obj = obj.length === +obj.length ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value > result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = _.iteratee(iteratee, context);
	      _.each(obj, function(value, index, list) {
	        computed = iteratee(value, index, list);
	        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
	          result = value;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };
	
	  // Return the minimum element (or element-based computation).
	  _.min = function(obj, iteratee, context) {
	    var result = Infinity, lastComputed = Infinity,
	        value, computed;
	    if (iteratee == null && obj != null) {
	      obj = obj.length === +obj.length ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value < result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = _.iteratee(iteratee, context);
	      _.each(obj, function(value, index, list) {
	        computed = iteratee(value, index, list);
	        if (computed < lastComputed || computed === Infinity && result === Infinity) {
	          result = value;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };
	
	  // Shuffle a collection, using the modern version of the
	  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
	  _.shuffle = function(obj) {
	    var set = obj && obj.length === +obj.length ? obj : _.values(obj);
	    var length = set.length;
	    var shuffled = Array(length);
	    for (var index = 0, rand; index < length; index++) {
	      rand = _.random(0, index);
	      if (rand !== index) shuffled[index] = shuffled[rand];
	      shuffled[rand] = set[index];
	    }
	    return shuffled;
	  };
	
	  // Sample **n** random values from a collection.
	  // If **n** is not specified, returns a single random element.
	  // The internal `guard` argument allows it to work with `map`.
	  _.sample = function(obj, n, guard) {
	    if (n == null || guard) {
	      if (obj.length !== +obj.length) obj = _.values(obj);
	      return obj[_.random(obj.length - 1)];
	    }
	    return _.shuffle(obj).slice(0, Math.max(0, n));
	  };
	
	  // Sort the object's values by a criterion produced by an iteratee.
	  _.sortBy = function(obj, iteratee, context) {
	    iteratee = _.iteratee(iteratee, context);
	    return _.pluck(_.map(obj, function(value, index, list) {
	      return {
	        value: value,
	        index: index,
	        criteria: iteratee(value, index, list)
	      };
	    }).sort(function(left, right) {
	      var a = left.criteria;
	      var b = right.criteria;
	      if (a !== b) {
	        if (a > b || a === void 0) return 1;
	        if (a < b || b === void 0) return -1;
	      }
	      return left.index - right.index;
	    }), 'value');
	  };
	
	  // An internal function used for aggregate "group by" operations.
	  var group = function(behavior) {
	    return function(obj, iteratee, context) {
	      var result = {};
	      iteratee = _.iteratee(iteratee, context);
	      _.each(obj, function(value, index) {
	        var key = iteratee(value, index, obj);
	        behavior(result, value, key);
	      });
	      return result;
	    };
	  };
	
	  // Groups the object's values by a criterion. Pass either a string attribute
	  // to group by, or a function that returns the criterion.
	  _.groupBy = group(function(result, value, key) {
	    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
	  });
	
	  // Indexes the object's values by a criterion, similar to `groupBy`, but for
	  // when you know that your index values will be unique.
	  _.indexBy = group(function(result, value, key) {
	    result[key] = value;
	  });
	
	  // Counts instances of an object that group by a certain criterion. Pass
	  // either a string attribute to count by, or a function that returns the
	  // criterion.
	  _.countBy = group(function(result, value, key) {
	    if (_.has(result, key)) result[key]++; else result[key] = 1;
	  });
	
	  // Use a comparator function to figure out the smallest index at which
	  // an object should be inserted so as to maintain order. Uses binary search.
	  _.sortedIndex = function(array, obj, iteratee, context) {
	    iteratee = _.iteratee(iteratee, context, 1);
	    var value = iteratee(obj);
	    var low = 0, high = array.length;
	    while (low < high) {
	      var mid = low + high >>> 1;
	      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
	    }
	    return low;
	  };
	
	  // Safely create a real, live array from anything iterable.
	  _.toArray = function(obj) {
	    if (!obj) return [];
	    if (_.isArray(obj)) return slice.call(obj);
	    if (obj.length === +obj.length) return _.map(obj, _.identity);
	    return _.values(obj);
	  };
	
	  // Return the number of elements in an object.
	  _.size = function(obj) {
	    if (obj == null) return 0;
	    return obj.length === +obj.length ? obj.length : _.keys(obj).length;
	  };
	
	  // Split a collection into two arrays: one whose elements all satisfy the given
	  // predicate, and one whose elements all do not satisfy the predicate.
	  _.partition = function(obj, predicate, context) {
	    predicate = _.iteratee(predicate, context);
	    var pass = [], fail = [];
	    _.each(obj, function(value, key, obj) {
	      (predicate(value, key, obj) ? pass : fail).push(value);
	    });
	    return [pass, fail];
	  };
	
	  // Array Functions
	  // ---------------
	
	  // Get the first element of an array. Passing **n** will return the first N
	  // values in the array. Aliased as `head` and `take`. The **guard** check
	  // allows it to work with `_.map`.
	  _.first = _.head = _.take = function(array, n, guard) {
	    if (array == null) return void 0;
	    if (n == null || guard) return array[0];
	    if (n < 0) return [];
	    return slice.call(array, 0, n);
	  };
	
	  // Returns everything but the last entry of the array. Especially useful on
	  // the arguments object. Passing **n** will return all the values in
	  // the array, excluding the last N. The **guard** check allows it to work with
	  // `_.map`.
	  _.initial = function(array, n, guard) {
	    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
	  };
	
	  // Get the last element of an array. Passing **n** will return the last N
	  // values in the array. The **guard** check allows it to work with `_.map`.
	  _.last = function(array, n, guard) {
	    if (array == null) return void 0;
	    if (n == null || guard) return array[array.length - 1];
	    return slice.call(array, Math.max(array.length - n, 0));
	  };
	
	  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
	  // Especially useful on the arguments object. Passing an **n** will return
	  // the rest N values in the array. The **guard**
	  // check allows it to work with `_.map`.
	  _.rest = _.tail = _.drop = function(array, n, guard) {
	    return slice.call(array, n == null || guard ? 1 : n);
	  };
	
	  // Trim out all falsy values from an array.
	  _.compact = function(array) {
	    return _.filter(array, _.identity);
	  };
	
	  // Internal implementation of a recursive `flatten` function.
	  var flatten = function(input, shallow, strict, output) {
	    if (shallow && _.every(input, _.isArray)) {
	      return concat.apply(output, input);
	    }
	    for (var i = 0, length = input.length; i < length; i++) {
	      var value = input[i];
	      if (!_.isArray(value) && !_.isArguments(value)) {
	        if (!strict) output.push(value);
	      } else if (shallow) {
	        push.apply(output, value);
	      } else {
	        flatten(value, shallow, strict, output);
	      }
	    }
	    return output;
	  };
	
	  // Flatten out an array, either recursively (by default), or just one level.
	  _.flatten = function(array, shallow) {
	    return flatten(array, shallow, false, []);
	  };
	
	  // Return a version of the array that does not contain the specified value(s).
	  _.without = function(array) {
	    return _.difference(array, slice.call(arguments, 1));
	  };
	
	  // Produce a duplicate-free version of the array. If the array has already
	  // been sorted, you have the option of using a faster algorithm.
	  // Aliased as `unique`.
	  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
	    if (array == null) return [];
	    if (!_.isBoolean(isSorted)) {
	      context = iteratee;
	      iteratee = isSorted;
	      isSorted = false;
	    }
	    if (iteratee != null) iteratee = _.iteratee(iteratee, context);
	    var result = [];
	    var seen = [];
	    for (var i = 0, length = array.length; i < length; i++) {
	      var value = array[i];
	      if (isSorted) {
	        if (!i || seen !== value) result.push(value);
	        seen = value;
	      } else if (iteratee) {
	        var computed = iteratee(value, i, array);
	        if (_.indexOf(seen, computed) < 0) {
	          seen.push(computed);
	          result.push(value);
	        }
	      } else if (_.indexOf(result, value) < 0) {
	        result.push(value);
	      }
	    }
	    return result;
	  };
	
	  // Produce an array that contains the union: each distinct element from all of
	  // the passed-in arrays.
	  _.union = function() {
	    return _.uniq(flatten(arguments, true, true, []));
	  };
	
	  // Produce an array that contains every item shared between all the
	  // passed-in arrays.
	  _.intersection = function(array) {
	    if (array == null) return [];
	    var result = [];
	    var argsLength = arguments.length;
	    for (var i = 0, length = array.length; i < length; i++) {
	      var item = array[i];
	      if (_.contains(result, item)) continue;
	      for (var j = 1; j < argsLength; j++) {
	        if (!_.contains(arguments[j], item)) break;
	      }
	      if (j === argsLength) result.push(item);
	    }
	    return result;
	  };
	
	  // Take the difference between one array and a number of other arrays.
	  // Only the elements present in just the first array will remain.
	  _.difference = function(array) {
	    var rest = flatten(slice.call(arguments, 1), true, true, []);
	    return _.filter(array, function(value){
	      return !_.contains(rest, value);
	    });
	  };
	
	  // Zip together multiple lists into a single array -- elements that share
	  // an index go together.
	  _.zip = function(array) {
	    if (array == null) return [];
	    var length = _.max(arguments, 'length').length;
	    var results = Array(length);
	    for (var i = 0; i < length; i++) {
	      results[i] = _.pluck(arguments, i);
	    }
	    return results;
	  };
	
	  // Converts lists into objects. Pass either a single array of `[key, value]`
	  // pairs, or two parallel arrays of the same length -- one of keys, and one of
	  // the corresponding values.
	  _.object = function(list, values) {
	    if (list == null) return {};
	    var result = {};
	    for (var i = 0, length = list.length; i < length; i++) {
	      if (values) {
	        result[list[i]] = values[i];
	      } else {
	        result[list[i][0]] = list[i][1];
	      }
	    }
	    return result;
	  };
	
	  // Return the position of the first occurrence of an item in an array,
	  // or -1 if the item is not included in the array.
	  // If the array is large and already in sort order, pass `true`
	  // for **isSorted** to use binary search.
	  _.indexOf = function(array, item, isSorted) {
	    if (array == null) return -1;
	    var i = 0, length = array.length;
	    if (isSorted) {
	      if (typeof isSorted == 'number') {
	        i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
	      } else {
	        i = _.sortedIndex(array, item);
	        return array[i] === item ? i : -1;
	      }
	    }
	    for (; i < length; i++) if (array[i] === item) return i;
	    return -1;
	  };
	
	  _.lastIndexOf = function(array, item, from) {
	    if (array == null) return -1;
	    var idx = array.length;
	    if (typeof from == 'number') {
	      idx = from < 0 ? idx + from + 1 : Math.min(idx, from + 1);
	    }
	    while (--idx >= 0) if (array[idx] === item) return idx;
	    return -1;
	  };
	
	  // Generate an integer Array containing an arithmetic progression. A port of
	  // the native Python `range()` function. See
	  // [the Python documentation](http://docs.python.org/library/functions.html#range).
	  _.range = function(start, stop, step) {
	    if (arguments.length <= 1) {
	      stop = start || 0;
	      start = 0;
	    }
	    step = step || 1;
	
	    var length = Math.max(Math.ceil((stop - start) / step), 0);
	    var range = Array(length);
	
	    for (var idx = 0; idx < length; idx++, start += step) {
	      range[idx] = start;
	    }
	
	    return range;
	  };
	
	  // Function (ahem) Functions
	  // ------------------
	
	  // Reusable constructor function for prototype setting.
	  var Ctor = function(){};
	
	  // Create a function bound to a given object (assigning `this`, and arguments,
	  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
	  // available.
	  _.bind = function(func, context) {
	    var args, bound;
	    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
	    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
	    args = slice.call(arguments, 2);
	    bound = function() {
	      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
	      Ctor.prototype = func.prototype;
	      var self = new Ctor;
	      Ctor.prototype = null;
	      var result = func.apply(self, args.concat(slice.call(arguments)));
	      if (_.isObject(result)) return result;
	      return self;
	    };
	    return bound;
	  };
	
	  // Partially apply a function by creating a version that has had some of its
	  // arguments pre-filled, without changing its dynamic `this` context. _ acts
	  // as a placeholder, allowing any combination of arguments to be pre-filled.
	  _.partial = function(func) {
	    var boundArgs = slice.call(arguments, 1);
	    return function() {
	      var position = 0;
	      var args = boundArgs.slice();
	      for (var i = 0, length = args.length; i < length; i++) {
	        if (args[i] === _) args[i] = arguments[position++];
	      }
	      while (position < arguments.length) args.push(arguments[position++]);
	      return func.apply(this, args);
	    };
	  };
	
	  // Bind a number of an object's methods to that object. Remaining arguments
	  // are the method names to be bound. Useful for ensuring that all callbacks
	  // defined on an object belong to it.
	  _.bindAll = function(obj) {
	    var i, length = arguments.length, key;
	    if (length <= 1) throw new Error('bindAll must be passed function names');
	    for (i = 1; i < length; i++) {
	      key = arguments[i];
	      obj[key] = _.bind(obj[key], obj);
	    }
	    return obj;
	  };
	
	  // Memoize an expensive function by storing its results.
	  _.memoize = function(func, hasher) {
	    var memoize = function(key) {
	      var cache = memoize.cache;
	      var address = hasher ? hasher.apply(this, arguments) : key;
	      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
	      return cache[address];
	    };
	    memoize.cache = {};
	    return memoize;
	  };
	
	  // Delays a function for the given number of milliseconds, and then calls
	  // it with the arguments supplied.
	  _.delay = function(func, wait) {
	    var args = slice.call(arguments, 2);
	    return setTimeout(function(){
	      return func.apply(null, args);
	    }, wait);
	  };
	
	  // Defers a function, scheduling it to run after the current call stack has
	  // cleared.
	  _.defer = function(func) {
	    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
	  };
	
	  // Returns a function, that, when invoked, will only be triggered at most once
	  // during a given window of time. Normally, the throttled function will run
	  // as much as it can, without ever going more than once per `wait` duration;
	  // but if you'd like to disable the execution on the leading edge, pass
	  // `{leading: false}`. To disable execution on the trailing edge, ditto.
	  _.throttle = function(func, wait, options) {
	    var context, args, result;
	    var timeout = null;
	    var previous = 0;
	    if (!options) options = {};
	    var later = function() {
	      previous = options.leading === false ? 0 : _.now();
	      timeout = null;
	      result = func.apply(context, args);
	      if (!timeout) context = args = null;
	    };
	    return function() {
	      var now = _.now();
	      if (!previous && options.leading === false) previous = now;
	      var remaining = wait - (now - previous);
	      context = this;
	      args = arguments;
	      if (remaining <= 0 || remaining > wait) {
	        clearTimeout(timeout);
	        timeout = null;
	        previous = now;
	        result = func.apply(context, args);
	        if (!timeout) context = args = null;
	      } else if (!timeout && options.trailing !== false) {
	        timeout = setTimeout(later, remaining);
	      }
	      return result;
	    };
	  };
	
	  // Returns a function, that, as long as it continues to be invoked, will not
	  // be triggered. The function will be called after it stops being called for
	  // N milliseconds. If `immediate` is passed, trigger the function on the
	  // leading edge, instead of the trailing.
	  _.debounce = function(func, wait, immediate) {
	    var timeout, args, context, timestamp, result;
	
	    var later = function() {
	      var last = _.now() - timestamp;
	
	      if (last < wait && last > 0) {
	        timeout = setTimeout(later, wait - last);
	      } else {
	        timeout = null;
	        if (!immediate) {
	          result = func.apply(context, args);
	          if (!timeout) context = args = null;
	        }
	      }
	    };
	
	    return function() {
	      context = this;
	      args = arguments;
	      timestamp = _.now();
	      var callNow = immediate && !timeout;
	      if (!timeout) timeout = setTimeout(later, wait);
	      if (callNow) {
	        result = func.apply(context, args);
	        context = args = null;
	      }
	
	      return result;
	    };
	  };
	
	  // Returns the first function passed as an argument to the second,
	  // allowing you to adjust arguments, run code before and after, and
	  // conditionally execute the original function.
	  _.wrap = function(func, wrapper) {
	    return _.partial(wrapper, func);
	  };
	
	  // Returns a negated version of the passed-in predicate.
	  _.negate = function(predicate) {
	    return function() {
	      return !predicate.apply(this, arguments);
	    };
	  };
	
	  // Returns a function that is the composition of a list of functions, each
	  // consuming the return value of the function that follows.
	  _.compose = function() {
	    var args = arguments;
	    var start = args.length - 1;
	    return function() {
	      var i = start;
	      var result = args[start].apply(this, arguments);
	      while (i--) result = args[i].call(this, result);
	      return result;
	    };
	  };
	
	  // Returns a function that will only be executed after being called N times.
	  _.after = function(times, func) {
	    return function() {
	      if (--times < 1) {
	        return func.apply(this, arguments);
	      }
	    };
	  };
	
	  // Returns a function that will only be executed before being called N times.
	  _.before = function(times, func) {
	    var memo;
	    return function() {
	      if (--times > 0) {
	        memo = func.apply(this, arguments);
	      } else {
	        func = null;
	      }
	      return memo;
	    };
	  };
	
	  // Returns a function that will be executed at most one time, no matter how
	  // often you call it. Useful for lazy initialization.
	  _.once = _.partial(_.before, 2);
	
	  // Object Functions
	  // ----------------
	
	  // Retrieve the names of an object's properties.
	  // Delegates to **ECMAScript 5**'s native `Object.keys`
	  _.keys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    if (nativeKeys) return nativeKeys(obj);
	    var keys = [];
	    for (var key in obj) if (_.has(obj, key)) keys.push(key);
	    return keys;
	  };
	
	  // Retrieve the values of an object's properties.
	  _.values = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var values = Array(length);
	    for (var i = 0; i < length; i++) {
	      values[i] = obj[keys[i]];
	    }
	    return values;
	  };
	
	  // Convert an object into a list of `[key, value]` pairs.
	  _.pairs = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var pairs = Array(length);
	    for (var i = 0; i < length; i++) {
	      pairs[i] = [keys[i], obj[keys[i]]];
	    }
	    return pairs;
	  };
	
	  // Invert the keys and values of an object. The values must be serializable.
	  _.invert = function(obj) {
	    var result = {};
	    var keys = _.keys(obj);
	    for (var i = 0, length = keys.length; i < length; i++) {
	      result[obj[keys[i]]] = keys[i];
	    }
	    return result;
	  };
	
	  // Return a sorted list of the function names available on the object.
	  // Aliased as `methods`
	  _.functions = _.methods = function(obj) {
	    var names = [];
	    for (var key in obj) {
	      if (_.isFunction(obj[key])) names.push(key);
	    }
	    return names.sort();
	  };
	
	  // Extend a given object with all the properties in passed-in object(s).
	  _.extend = function(obj) {
	    if (!_.isObject(obj)) return obj;
	    var source, prop;
	    for (var i = 1, length = arguments.length; i < length; i++) {
	      source = arguments[i];
	      for (prop in source) {
	        if (hasOwnProperty.call(source, prop)) {
	            obj[prop] = source[prop];
	        }
	      }
	    }
	    return obj;
	  };
	
	  // Return a copy of the object only containing the whitelisted properties.
	  _.pick = function(obj, iteratee, context) {
	    var result = {}, key;
	    if (obj == null) return result;
	    if (_.isFunction(iteratee)) {
	      iteratee = createCallback(iteratee, context);
	      for (key in obj) {
	        var value = obj[key];
	        if (iteratee(value, key, obj)) result[key] = value;
	      }
	    } else {
	      var keys = concat.apply([], slice.call(arguments, 1));
	      obj = new Object(obj);
	      for (var i = 0, length = keys.length; i < length; i++) {
	        key = keys[i];
	        if (key in obj) result[key] = obj[key];
	      }
	    }
	    return result;
	  };
	
	   // Return a copy of the object without the blacklisted properties.
	  _.omit = function(obj, iteratee, context) {
	    if (_.isFunction(iteratee)) {
	      iteratee = _.negate(iteratee);
	    } else {
	      var keys = _.map(concat.apply([], slice.call(arguments, 1)), String);
	      iteratee = function(value, key) {
	        return !_.contains(keys, key);
	      };
	    }
	    return _.pick(obj, iteratee, context);
	  };
	
	  // Fill in a given object with default properties.
	  _.defaults = function(obj) {
	    if (!_.isObject(obj)) return obj;
	    for (var i = 1, length = arguments.length; i < length; i++) {
	      var source = arguments[i];
	      for (var prop in source) {
	        if (obj[prop] === void 0) obj[prop] = source[prop];
	      }
	    }
	    return obj;
	  };
	
	  // Create a (shallow-cloned) duplicate of an object.
	  _.clone = function(obj) {
	    if (!_.isObject(obj)) return obj;
	    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
	  };
	
	  // Invokes interceptor with the obj, and then returns obj.
	  // The primary purpose of this method is to "tap into" a method chain, in
	  // order to perform operations on intermediate results within the chain.
	  _.tap = function(obj, interceptor) {
	    interceptor(obj);
	    return obj;
	  };
	
	  // Internal recursive comparison function for `isEqual`.
	  var eq = function(a, b, aStack, bStack) {
	    // Identical objects are equal. `0 === -0`, but they aren't identical.
	    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
	    if (a === b) return a !== 0 || 1 / a === 1 / b;
	    // A strict comparison is necessary because `null == undefined`.
	    if (a == null || b == null) return a === b;
	    // Unwrap any wrapped objects.
	    if (a instanceof _) a = a._wrapped;
	    if (b instanceof _) b = b._wrapped;
	    // Compare `[[Class]]` names.
	    var className = toString.call(a);
	    if (className !== toString.call(b)) return false;
	    switch (className) {
	      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
	      case '[object RegExp]':
	      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
	      case '[object String]':
	        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
	        // equivalent to `new String("5")`.
	        return '' + a === '' + b;
	      case '[object Number]':
	        // `NaN`s are equivalent, but non-reflexive.
	        // Object(NaN) is equivalent to NaN
	        if (+a !== +a) return +b !== +b;
	        // An `egal` comparison is performed for other numeric values.
	        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
	      case '[object Date]':
	      case '[object Boolean]':
	        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
	        // millisecond representations. Note that invalid dates with millisecond representations
	        // of `NaN` are not equivalent.
	        return +a === +b;
	    }
	    if (typeof a != 'object' || typeof b != 'object') return false;
	    // Assume equality for cyclic structures. The algorithm for detecting cyclic
	    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
	    var length = aStack.length;
	    while (length--) {
	      // Linear search. Performance is inversely proportional to the number of
	      // unique nested structures.
	      if (aStack[length] === a) return bStack[length] === b;
	    }
	    // Objects with different constructors are not equivalent, but `Object`s
	    // from different frames are.
	    var aCtor = a.constructor, bCtor = b.constructor;
	    if (
	      aCtor !== bCtor &&
	      // Handle Object.create(x) cases
	      'constructor' in a && 'constructor' in b &&
	      !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
	        _.isFunction(bCtor) && bCtor instanceof bCtor)
	    ) {
	      return false;
	    }
	    // Add the first object to the stack of traversed objects.
	    aStack.push(a);
	    bStack.push(b);
	    var size, result;
	    // Recursively compare objects and arrays.
	    if (className === '[object Array]') {
	      // Compare array lengths to determine if a deep comparison is necessary.
	      size = a.length;
	      result = size === b.length;
	      if (result) {
	        // Deep compare the contents, ignoring non-numeric properties.
	        while (size--) {
	          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
	        }
	      }
	    } else {
	      // Deep compare objects.
	      var keys = _.keys(a), key;
	      size = keys.length;
	      // Ensure that both objects contain the same number of properties before comparing deep equality.
	      result = _.keys(b).length === size;
	      if (result) {
	        while (size--) {
	          // Deep compare each member
	          key = keys[size];
	          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
	        }
	      }
	    }
	    // Remove the first object from the stack of traversed objects.
	    aStack.pop();
	    bStack.pop();
	    return result;
	  };
	
	  // Perform a deep comparison to check if two objects are equal.
	  _.isEqual = function(a, b) {
	    return eq(a, b, [], []);
	  };
	
	  // Is a given array, string, or object empty?
	  // An "empty" object has no enumerable own-properties.
	  _.isEmpty = function(obj) {
	    if (obj == null) return true;
	    if (_.isArray(obj) || _.isString(obj) || _.isArguments(obj)) return obj.length === 0;
	    for (var key in obj) if (_.has(obj, key)) return false;
	    return true;
	  };
	
	  // Is a given value a DOM element?
	  _.isElement = function(obj) {
	    return !!(obj && obj.nodeType === 1);
	  };
	
	  // Is a given value an array?
	  // Delegates to ECMA5's native Array.isArray
	  _.isArray = nativeIsArray || function(obj) {
	    return toString.call(obj) === '[object Array]';
	  };
	
	  // Is a given variable an object?
	  _.isObject = function(obj) {
	    var type = typeof obj;
	    return type === 'function' || type === 'object' && !!obj;
	  };
	
	  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
	  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
	    _['is' + name] = function(obj) {
	      return toString.call(obj) === '[object ' + name + ']';
	    };
	  });
	
	  // Define a fallback version of the method in browsers (ahem, IE), where
	  // there isn't any inspectable "Arguments" type.
	  if (!_.isArguments(arguments)) {
	    _.isArguments = function(obj) {
	      return _.has(obj, 'callee');
	    };
	  }
	
	  // Optimize `isFunction` if appropriate. Work around an IE 11 bug.
	  if (true) {
	    _.isFunction = function(obj) {
	      return typeof obj == 'function' || false;
	    };
	  }
	
	  // Is a given object a finite number?
	  _.isFinite = function(obj) {
	    return isFinite(obj) && !isNaN(parseFloat(obj));
	  };
	
	  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
	  _.isNaN = function(obj) {
	    return _.isNumber(obj) && obj !== +obj;
	  };
	
	  // Is a given value a boolean?
	  _.isBoolean = function(obj) {
	    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
	  };
	
	  // Is a given value equal to null?
	  _.isNull = function(obj) {
	    return obj === null;
	  };
	
	  // Is a given variable undefined?
	  _.isUndefined = function(obj) {
	    return obj === void 0;
	  };
	
	  // Shortcut function for checking if an object has a given property directly
	  // on itself (in other words, not on a prototype).
	  _.has = function(obj, key) {
	    return obj != null && hasOwnProperty.call(obj, key);
	  };
	
	  // Utility Functions
	  // -----------------
	
	  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
	  // previous owner. Returns a reference to the Underscore object.
	  _.noConflict = function() {
	    root._ = previousUnderscore;
	    return this;
	  };
	
	  // Keep the identity function around for default iteratees.
	  _.identity = function(value) {
	    return value;
	  };
	
	  _.constant = function(value) {
	    return function() {
	      return value;
	    };
	  };
	
	  _.noop = function(){};
	
	  _.property = function(key) {
	    return function(obj) {
	      return obj[key];
	    };
	  };
	
	  // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
	  _.matches = function(attrs) {
	    var pairs = _.pairs(attrs), length = pairs.length;
	    return function(obj) {
	      if (obj == null) return !length;
	      obj = new Object(obj);
	      for (var i = 0; i < length; i++) {
	        var pair = pairs[i], key = pair[0];
	        if (pair[1] !== obj[key] || !(key in obj)) return false;
	      }
	      return true;
	    };
	  };
	
	  // Run a function **n** times.
	  _.times = function(n, iteratee, context) {
	    var accum = Array(Math.max(0, n));
	    iteratee = createCallback(iteratee, context, 1);
	    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
	    return accum;
	  };
	
	  // Return a random integer between min and max (inclusive).
	  _.random = function(min, max) {
	    if (max == null) {
	      max = min;
	      min = 0;
	    }
	    return min + Math.floor(Math.random() * (max - min + 1));
	  };
	
	  // A (possibly faster) way to get the current timestamp as an integer.
	  _.now = Date.now || function() {
	    return new Date().getTime();
	  };
	
	   // List of HTML entities for escaping.
	  var escapeMap = {
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    "'": '&#x27;',
	    '`': '&#x60;'
	  };
	  var unescapeMap = _.invert(escapeMap);
	
	  // Functions for escaping and unescaping strings to/from HTML interpolation.
	  var createEscaper = function(map) {
	    var escaper = function(match) {
	      return map[match];
	    };
	    // Regexes for identifying a key that needs to be escaped
	    var source = '(?:' + _.keys(map).join('|') + ')';
	    var testRegexp = RegExp(source);
	    var replaceRegexp = RegExp(source, 'g');
	    return function(string) {
	      string = string == null ? '' : '' + string;
	      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
	    };
	  };
	  _.escape = createEscaper(escapeMap);
	  _.unescape = createEscaper(unescapeMap);
	
	  // If the value of the named `property` is a function then invoke it with the
	  // `object` as context; otherwise, return it.
	  _.result = function(object, property) {
	    if (object == null) return void 0;
	    var value = object[property];
	    return _.isFunction(value) ? object[property]() : value;
	  };
	
	  // Generate a unique integer id (unique within the entire client session).
	  // Useful for temporary DOM ids.
	  var idCounter = 0;
	  _.uniqueId = function(prefix) {
	    var id = ++idCounter + '';
	    return prefix ? prefix + id : id;
	  };
	
	  // By default, Underscore uses ERB-style template delimiters, change the
	  // following template settings to use alternative delimiters.
	  _.templateSettings = {
	    evaluate    : /<%([\s\S]+?)%>/g,
	    interpolate : /<%=([\s\S]+?)%>/g,
	    escape      : /<%-([\s\S]+?)%>/g
	  };
	
	  // When customizing `templateSettings`, if you don't want to define an
	  // interpolation, evaluation or escaping regex, we need one that is
	  // guaranteed not to match.
	  var noMatch = /(.)^/;
	
	  // Certain characters need to be escaped so that they can be put into a
	  // string literal.
	  var escapes = {
	    "'":      "'",
	    '\\':     '\\',
	    '\r':     'r',
	    '\n':     'n',
	    '\u2028': 'u2028',
	    '\u2029': 'u2029'
	  };
	
	  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;
	
	  var escapeChar = function(match) {
	    return '\\' + escapes[match];
	  };
	
	  // JavaScript micro-templating, similar to John Resig's implementation.
	  // Underscore templating handles arbitrary delimiters, preserves whitespace,
	  // and correctly escapes quotes within interpolated code.
	  // NB: `oldSettings` only exists for backwards compatibility.
	  _.template = function(text, settings, oldSettings) {
	    if (!settings && oldSettings) settings = oldSettings;
	    settings = _.defaults({}, settings, _.templateSettings);
	
	    // Combine delimiters into one regular expression via alternation.
	    var matcher = RegExp([
	      (settings.escape || noMatch).source,
	      (settings.interpolate || noMatch).source,
	      (settings.evaluate || noMatch).source
	    ].join('|') + '|$', 'g');
	
	    // Compile the template source, escaping string literals appropriately.
	    var index = 0;
	    var source = "__p+='";
	    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
	      source += text.slice(index, offset).replace(escaper, escapeChar);
	      index = offset + match.length;
	
	      if (escape) {
	        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
	      } else if (interpolate) {
	        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
	      } else if (evaluate) {
	        source += "';\n" + evaluate + "\n__p+='";
	      }
	
	      // Adobe VMs need the match returned to produce the correct offest.
	      return match;
	    });
	    source += "';\n";
	
	    // If a variable is not specified, place data values in local scope.
	    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';
	
	    source = "var __t,__p='',__j=Array.prototype.join," +
	      "print=function(){__p+=__j.call(arguments,'');};\n" +
	      source + 'return __p;\n';
	
	    try {
	      var render = new Function(settings.variable || 'obj', '_', source);
	    } catch (e) {
	      e.source = source;
	      throw e;
	    }
	
	    var template = function(data) {
	      return render.call(this, data, _);
	    };
	
	    // Provide the compiled source as a convenience for precompilation.
	    var argument = settings.variable || 'obj';
	    template.source = 'function(' + argument + '){\n' + source + '}';
	
	    return template;
	  };
	
	  // Add a "chain" function. Start chaining a wrapped Underscore object.
	  _.chain = function(obj) {
	    var instance = _(obj);
	    instance._chain = true;
	    return instance;
	  };
	
	  // OOP
	  // ---------------
	  // If Underscore is called as a function, it returns a wrapped object that
	  // can be used OO-style. This wrapper holds altered versions of all the
	  // underscore functions. Wrapped objects may be chained.
	
	  // Helper function to continue chaining intermediate results.
	  var result = function(obj) {
	    return this._chain ? _(obj).chain() : obj;
	  };
	
	  // Add your own custom functions to the Underscore object.
	  _.mixin = function(obj) {
	    _.each(_.functions(obj), function(name) {
	      var func = _[name] = obj[name];
	      _.prototype[name] = function() {
	        var args = [this._wrapped];
	        push.apply(args, arguments);
	        return result.call(this, func.apply(_, args));
	      };
	    });
	  };
	
	  // Add all of the Underscore functions to the wrapper object.
	  _.mixin(_);
	
	  // Add all mutator Array functions to the wrapper.
	  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      var obj = this._wrapped;
	      method.apply(obj, arguments);
	      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
	      return result.call(this, obj);
	    };
	  });
	
	  // Add all accessor Array functions to the wrapper.
	  _.each(['concat', 'join', 'slice'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      return result.call(this, method.apply(this._wrapped, arguments));
	    };
	  });
	
	  // Extracts the result from a wrapped and chained object.
	  _.prototype.value = function() {
	    return this._wrapped;
	  };
	
	  // AMD registration happens at the end for compatibility with AMD loaders
	  // that may not enforce next-turn semantics on modules. Even though general
	  // practice for AMD registration is to be anonymous, underscore registers
	  // as a named module because, like jQuery, it is a base library that is
	  // popular enough to be bundled in a third party lib, but not be part of
	  // an AMD load request. Those cases could generate an error when an
	  // anonymous define() is called outside of a loader request.
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return _;
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	}.call(this));


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(43), __webpack_require__(44), __webpack_require__(45), __webpack_require__(46), __webpack_require__(47), __webpack_require__(48), __webpack_require__(49), __webpack_require__(50), __webpack_require__(51), __webpack_require__(52), __webpack_require__(53), __webpack_require__(54), __webpack_require__(55), __webpack_require__(56), __webpack_require__(57), __webpack_require__(58), __webpack_require__(59), __webpack_require__(60), __webpack_require__(61), __webpack_require__(62), __webpack_require__(63), __webpack_require__(64), __webpack_require__(65), __webpack_require__(66), __webpack_require__(67), __webpack_require__(68), __webpack_require__(69), __webpack_require__(70), __webpack_require__(71), __webpack_require__(72), __webpack_require__(73), __webpack_require__(74), __webpack_require__(75));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./x64-core", "./lib-typedarrays", "./enc-utf16", "./enc-base64", "./md5", "./sha1", "./sha256", "./sha224", "./sha512", "./sha384", "./sha3", "./ripemd160", "./hmac", "./pbkdf2", "./evpkdf", "./cipher-core", "./mode-cfb", "./mode-ctr", "./mode-ctr-gladman", "./mode-ofb", "./mode-ecb", "./pad-ansix923", "./pad-iso10126", "./pad-iso97971", "./pad-zeropadding", "./pad-nopadding", "./format-hex", "./aes", "./tripledes", "./rc4", "./rabbit", "./rabbit-legacy"], factory);
		}
		else {
			// Global (browser)
			root.CryptoJS = factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		return CryptoJS;
	
	}));

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	;(function (root, factory) {
		if (true) {
			// CommonJS
			module.exports = exports = factory();
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define([], factory);
		}
		else {
			// Global (browser)
			root.CryptoJS = factory();
		}
	}(this, function () {
	
		/**
		 * CryptoJS core components.
		 */
		var CryptoJS = CryptoJS || (function (Math, undefined) {
		    /*
		     * Local polyfil of Object.create
		     */
		    var create = Object.create || (function () {
		        function F() {};
	
		        return function (obj) {
		            var subtype;
	
		            F.prototype = obj;
	
		            subtype = new F();
	
		            F.prototype = null;
	
		            return subtype;
		        };
		    }())
	
		    /**
		     * CryptoJS namespace.
		     */
		    var C = {};
	
		    /**
		     * Library namespace.
		     */
		    var C_lib = C.lib = {};
	
		    /**
		     * Base object for prototypal inheritance.
		     */
		    var Base = C_lib.Base = (function () {
	
	
		        return {
		            /**
		             * Creates a new object that inherits from this object.
		             *
		             * @param {Object} overrides Properties to copy into the new object.
		             *
		             * @return {Object} The new object.
		             *
		             * @static
		             *
		             * @example
		             *
		             *     var MyType = CryptoJS.lib.Base.extend({
		             *         field: 'value',
		             *
		             *         method: function () {
		             *         }
		             *     });
		             */
		            extend: function (overrides) {
		                // Spawn
		                var subtype = create(this);
	
		                // Augment
		                if (overrides) {
		                    subtype.mixIn(overrides);
		                }
	
		                // Create default initializer
		                if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
		                    subtype.init = function () {
		                        subtype.$super.init.apply(this, arguments);
		                    };
		                }
	
		                // Initializer's prototype is the subtype object
		                subtype.init.prototype = subtype;
	
		                // Reference supertype
		                subtype.$super = this;
	
		                return subtype;
		            },
	
		            /**
		             * Extends this object and runs the init method.
		             * Arguments to create() will be passed to init().
		             *
		             * @return {Object} The new object.
		             *
		             * @static
		             *
		             * @example
		             *
		             *     var instance = MyType.create();
		             */
		            create: function () {
		                var instance = this.extend();
		                instance.init.apply(instance, arguments);
	
		                return instance;
		            },
	
		            /**
		             * Initializes a newly created object.
		             * Override this method to add some logic when your objects are created.
		             *
		             * @example
		             *
		             *     var MyType = CryptoJS.lib.Base.extend({
		             *         init: function () {
		             *             // ...
		             *         }
		             *     });
		             */
		            init: function () {
		            },
	
		            /**
		             * Copies properties into this object.
		             *
		             * @param {Object} properties The properties to mix in.
		             *
		             * @example
		             *
		             *     MyType.mixIn({
		             *         field: 'value'
		             *     });
		             */
		            mixIn: function (properties) {
		                for (var propertyName in properties) {
		                    if (properties.hasOwnProperty(propertyName)) {
		                        this[propertyName] = properties[propertyName];
		                    }
		                }
	
		                // IE won't copy toString using the loop above
		                if (properties.hasOwnProperty('toString')) {
		                    this.toString = properties.toString;
		                }
		            },
	
		            /**
		             * Creates a copy of this object.
		             *
		             * @return {Object} The clone.
		             *
		             * @example
		             *
		             *     var clone = instance.clone();
		             */
		            clone: function () {
		                return this.init.prototype.extend(this);
		            }
		        };
		    }());
	
		    /**
		     * An array of 32-bit words.
		     *
		     * @property {Array} words The array of 32-bit words.
		     * @property {number} sigBytes The number of significant bytes in this word array.
		     */
		    var WordArray = C_lib.WordArray = Base.extend({
		        /**
		         * Initializes a newly created word array.
		         *
		         * @param {Array} words (Optional) An array of 32-bit words.
		         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
		         *
		         * @example
		         *
		         *     var wordArray = CryptoJS.lib.WordArray.create();
		         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
		         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
		         */
		        init: function (words, sigBytes) {
		            words = this.words = words || [];
	
		            if (sigBytes != undefined) {
		                this.sigBytes = sigBytes;
		            } else {
		                this.sigBytes = words.length * 4;
		            }
		        },
	
		        /**
		         * Converts this word array to a string.
		         *
		         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
		         *
		         * @return {string} The stringified word array.
		         *
		         * @example
		         *
		         *     var string = wordArray + '';
		         *     var string = wordArray.toString();
		         *     var string = wordArray.toString(CryptoJS.enc.Utf8);
		         */
		        toString: function (encoder) {
		            return (encoder || Hex).stringify(this);
		        },
	
		        /**
		         * Concatenates a word array to this word array.
		         *
		         * @param {WordArray} wordArray The word array to append.
		         *
		         * @return {WordArray} This word array.
		         *
		         * @example
		         *
		         *     wordArray1.concat(wordArray2);
		         */
		        concat: function (wordArray) {
		            // Shortcuts
		            var thisWords = this.words;
		            var thatWords = wordArray.words;
		            var thisSigBytes = this.sigBytes;
		            var thatSigBytes = wordArray.sigBytes;
	
		            // Clamp excess bits
		            this.clamp();
	
		            // Concat
		            if (thisSigBytes % 4) {
		                // Copy one byte at a time
		                for (var i = 0; i < thatSigBytes; i++) {
		                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
		                    thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
		                }
		            } else {
		                // Copy one word at a time
		                for (var i = 0; i < thatSigBytes; i += 4) {
		                    thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
		                }
		            }
		            this.sigBytes += thatSigBytes;
	
		            // Chainable
		            return this;
		        },
	
		        /**
		         * Removes insignificant bits.
		         *
		         * @example
		         *
		         *     wordArray.clamp();
		         */
		        clamp: function () {
		            // Shortcuts
		            var words = this.words;
		            var sigBytes = this.sigBytes;
	
		            // Clamp
		            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
		            words.length = Math.ceil(sigBytes / 4);
		        },
	
		        /**
		         * Creates a copy of this word array.
		         *
		         * @return {WordArray} The clone.
		         *
		         * @example
		         *
		         *     var clone = wordArray.clone();
		         */
		        clone: function () {
		            var clone = Base.clone.call(this);
		            clone.words = this.words.slice(0);
	
		            return clone;
		        },
	
		        /**
		         * Creates a word array filled with random bytes.
		         *
		         * @param {number} nBytes The number of random bytes to generate.
		         *
		         * @return {WordArray} The random word array.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var wordArray = CryptoJS.lib.WordArray.random(16);
		         */
		        random: function (nBytes) {
		            var words = [];
	
		            var r = (function (m_w) {
		                var m_w = m_w;
		                var m_z = 0x3ade68b1;
		                var mask = 0xffffffff;
	
		                return function () {
		                    m_z = (0x9069 * (m_z & 0xFFFF) + (m_z >> 0x10)) & mask;
		                    m_w = (0x4650 * (m_w & 0xFFFF) + (m_w >> 0x10)) & mask;
		                    var result = ((m_z << 0x10) + m_w) & mask;
		                    result /= 0x100000000;
		                    result += 0.5;
		                    return result * (Math.random() > .5 ? 1 : -1);
		                }
		            });
	
		            for (var i = 0, rcache; i < nBytes; i += 4) {
		                var _r = r((rcache || Math.random()) * 0x100000000);
	
		                rcache = _r() * 0x3ade67b7;
		                words.push((_r() * 0x100000000) | 0);
		            }
	
		            return new WordArray.init(words, nBytes);
		        }
		    });
	
		    /**
		     * Encoder namespace.
		     */
		    var C_enc = C.enc = {};
	
		    /**
		     * Hex encoding strategy.
		     */
		    var Hex = C_enc.Hex = {
		        /**
		         * Converts a word array to a hex string.
		         *
		         * @param {WordArray} wordArray The word array.
		         *
		         * @return {string} The hex string.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
		         */
		        stringify: function (wordArray) {
		            // Shortcuts
		            var words = wordArray.words;
		            var sigBytes = wordArray.sigBytes;
	
		            // Convert
		            var hexChars = [];
		            for (var i = 0; i < sigBytes; i++) {
		                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
		                hexChars.push((bite >>> 4).toString(16));
		                hexChars.push((bite & 0x0f).toString(16));
		            }
	
		            return hexChars.join('');
		        },
	
		        /**
		         * Converts a hex string to a word array.
		         *
		         * @param {string} hexStr The hex string.
		         *
		         * @return {WordArray} The word array.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
		         */
		        parse: function (hexStr) {
		            // Shortcut
		            var hexStrLength = hexStr.length;
	
		            // Convert
		            var words = [];
		            for (var i = 0; i < hexStrLength; i += 2) {
		                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
		            }
	
		            return new WordArray.init(words, hexStrLength / 2);
		        }
		    };
	
		    /**
		     * Latin1 encoding strategy.
		     */
		    var Latin1 = C_enc.Latin1 = {
		        /**
		         * Converts a word array to a Latin1 string.
		         *
		         * @param {WordArray} wordArray The word array.
		         *
		         * @return {string} The Latin1 string.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
		         */
		        stringify: function (wordArray) {
		            // Shortcuts
		            var words = wordArray.words;
		            var sigBytes = wordArray.sigBytes;
	
		            // Convert
		            var latin1Chars = [];
		            for (var i = 0; i < sigBytes; i++) {
		                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
		                latin1Chars.push(String.fromCharCode(bite));
		            }
	
		            return latin1Chars.join('');
		        },
	
		        /**
		         * Converts a Latin1 string to a word array.
		         *
		         * @param {string} latin1Str The Latin1 string.
		         *
		         * @return {WordArray} The word array.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
		         */
		        parse: function (latin1Str) {
		            // Shortcut
		            var latin1StrLength = latin1Str.length;
	
		            // Convert
		            var words = [];
		            for (var i = 0; i < latin1StrLength; i++) {
		                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
		            }
	
		            return new WordArray.init(words, latin1StrLength);
		        }
		    };
	
		    /**
		     * UTF-8 encoding strategy.
		     */
		    var Utf8 = C_enc.Utf8 = {
		        /**
		         * Converts a word array to a UTF-8 string.
		         *
		         * @param {WordArray} wordArray The word array.
		         *
		         * @return {string} The UTF-8 string.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
		         */
		        stringify: function (wordArray) {
		            try {
		                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
		            } catch (e) {
		                throw new Error('Malformed UTF-8 data');
		            }
		        },
	
		        /**
		         * Converts a UTF-8 string to a word array.
		         *
		         * @param {string} utf8Str The UTF-8 string.
		         *
		         * @return {WordArray} The word array.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
		         */
		        parse: function (utf8Str) {
		            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
		        }
		    };
	
		    /**
		     * Abstract buffered block algorithm template.
		     *
		     * The property blockSize must be implemented in a concrete subtype.
		     *
		     * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
		     */
		    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
		        /**
		         * Resets this block algorithm's data buffer to its initial state.
		         *
		         * @example
		         *
		         *     bufferedBlockAlgorithm.reset();
		         */
		        reset: function () {
		            // Initial values
		            this._data = new WordArray.init();
		            this._nDataBytes = 0;
		        },
	
		        /**
		         * Adds new data to this block algorithm's buffer.
		         *
		         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
		         *
		         * @example
		         *
		         *     bufferedBlockAlgorithm._append('data');
		         *     bufferedBlockAlgorithm._append(wordArray);
		         */
		        _append: function (data) {
		            // Convert string to WordArray, else assume WordArray already
		            if (typeof data == 'string') {
		                data = Utf8.parse(data);
		            }
	
		            // Append
		            this._data.concat(data);
		            this._nDataBytes += data.sigBytes;
		        },
	
		        /**
		         * Processes available data blocks.
		         *
		         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
		         *
		         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
		         *
		         * @return {WordArray} The processed data.
		         *
		         * @example
		         *
		         *     var processedData = bufferedBlockAlgorithm._process();
		         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
		         */
		        _process: function (doFlush) {
		            // Shortcuts
		            var data = this._data;
		            var dataWords = data.words;
		            var dataSigBytes = data.sigBytes;
		            var blockSize = this.blockSize;
		            var blockSizeBytes = blockSize * 4;
	
		            // Count blocks ready
		            var nBlocksReady = dataSigBytes / blockSizeBytes;
		            if (doFlush) {
		                // Round up to include partial blocks
		                nBlocksReady = Math.ceil(nBlocksReady);
		            } else {
		                // Round down to include only full blocks,
		                // less the number of blocks that must remain in the buffer
		                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
		            }
	
		            // Count words ready
		            var nWordsReady = nBlocksReady * blockSize;
	
		            // Count bytes ready
		            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);
	
		            // Process blocks
		            if (nWordsReady) {
		                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
		                    // Perform concrete-algorithm logic
		                    this._doProcessBlock(dataWords, offset);
		                }
	
		                // Remove processed words
		                var processedWords = dataWords.splice(0, nWordsReady);
		                data.sigBytes -= nBytesReady;
		            }
	
		            // Return processed words
		            return new WordArray.init(processedWords, nBytesReady);
		        },
	
		        /**
		         * Creates a copy of this object.
		         *
		         * @return {Object} The clone.
		         *
		         * @example
		         *
		         *     var clone = bufferedBlockAlgorithm.clone();
		         */
		        clone: function () {
		            var clone = Base.clone.call(this);
		            clone._data = this._data.clone();
	
		            return clone;
		        },
	
		        _minBufferSize: 0
		    });
	
		    /**
		     * Abstract hasher template.
		     *
		     * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
		     */
		    var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
		        /**
		         * Configuration options.
		         */
		        cfg: Base.extend(),
	
		        /**
		         * Initializes a newly created hasher.
		         *
		         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
		         *
		         * @example
		         *
		         *     var hasher = CryptoJS.algo.SHA256.create();
		         */
		        init: function (cfg) {
		            // Apply config defaults
		            this.cfg = this.cfg.extend(cfg);
	
		            // Set initial values
		            this.reset();
		        },
	
		        /**
		         * Resets this hasher to its initial state.
		         *
		         * @example
		         *
		         *     hasher.reset();
		         */
		        reset: function () {
		            // Reset data buffer
		            BufferedBlockAlgorithm.reset.call(this);
	
		            // Perform concrete-hasher logic
		            this._doReset();
		        },
	
		        /**
		         * Updates this hasher with a message.
		         *
		         * @param {WordArray|string} messageUpdate The message to append.
		         *
		         * @return {Hasher} This hasher.
		         *
		         * @example
		         *
		         *     hasher.update('message');
		         *     hasher.update(wordArray);
		         */
		        update: function (messageUpdate) {
		            // Append
		            this._append(messageUpdate);
	
		            // Update the hash
		            this._process();
	
		            // Chainable
		            return this;
		        },
	
		        /**
		         * Finalizes the hash computation.
		         * Note that the finalize operation is effectively a destructive, read-once operation.
		         *
		         * @param {WordArray|string} messageUpdate (Optional) A final message update.
		         *
		         * @return {WordArray} The hash.
		         *
		         * @example
		         *
		         *     var hash = hasher.finalize();
		         *     var hash = hasher.finalize('message');
		         *     var hash = hasher.finalize(wordArray);
		         */
		        finalize: function (messageUpdate) {
		            // Final message update
		            if (messageUpdate) {
		                this._append(messageUpdate);
		            }
	
		            // Perform concrete-hasher logic
		            var hash = this._doFinalize();
	
		            return hash;
		        },
	
		        blockSize: 512/32,
	
		        /**
		         * Creates a shortcut function to a hasher's object interface.
		         *
		         * @param {Hasher} hasher The hasher to create a helper for.
		         *
		         * @return {Function} The shortcut function.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
		         */
		        _createHelper: function (hasher) {
		            return function (message, cfg) {
		                return new hasher.init(cfg).finalize(message);
		            };
		        },
	
		        /**
		         * Creates a shortcut function to the HMAC's object interface.
		         *
		         * @param {Hasher} hasher The hasher to use in this HMAC helper.
		         *
		         * @return {Function} The shortcut function.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
		         */
		        _createHmacHelper: function (hasher) {
		            return function (message, key) {
		                return new C_algo.HMAC.init(hasher, key).finalize(message);
		            };
		        }
		    });
	
		    /**
		     * Algorithm namespace.
		     */
		    var C_algo = C.algo = {};
	
		    return C;
		}(Math));
	
	
		return CryptoJS;
	
	}));

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	;(function (root, factory) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(43));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function (undefined) {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var Base = C_lib.Base;
		    var X32WordArray = C_lib.WordArray;
	
		    /**
		     * x64 namespace.
		     */
		    var C_x64 = C.x64 = {};
	
		    /**
		     * A 64-bit word.
		     */
		    var X64Word = C_x64.Word = Base.extend({
		        /**
		         * Initializes a newly created 64-bit word.
		         *
		         * @param {number} high The high 32 bits.
		         * @param {number} low The low 32 bits.
		         *
		         * @example
		         *
		         *     var x64Word = CryptoJS.x64.Word.create(0x00010203, 0x04050607);
		         */
		        init: function (high, low) {
		            this.high = high;
		            this.low = low;
		        }
	
		        /**
		         * Bitwise NOTs this word.
		         *
		         * @return {X64Word} A new x64-Word object after negating.
		         *
		         * @example
		         *
		         *     var negated = x64Word.not();
		         */
		        // not: function () {
		            // var high = ~this.high;
		            // var low = ~this.low;
	
		            // return X64Word.create(high, low);
		        // },
	
		        /**
		         * Bitwise ANDs this word with the passed word.
		         *
		         * @param {X64Word} word The x64-Word to AND with this word.
		         *
		         * @return {X64Word} A new x64-Word object after ANDing.
		         *
		         * @example
		         *
		         *     var anded = x64Word.and(anotherX64Word);
		         */
		        // and: function (word) {
		            // var high = this.high & word.high;
		            // var low = this.low & word.low;
	
		            // return X64Word.create(high, low);
		        // },
	
		        /**
		         * Bitwise ORs this word with the passed word.
		         *
		         * @param {X64Word} word The x64-Word to OR with this word.
		         *
		         * @return {X64Word} A new x64-Word object after ORing.
		         *
		         * @example
		         *
		         *     var ored = x64Word.or(anotherX64Word);
		         */
		        // or: function (word) {
		            // var high = this.high | word.high;
		            // var low = this.low | word.low;
	
		            // return X64Word.create(high, low);
		        // },
	
		        /**
		         * Bitwise XORs this word with the passed word.
		         *
		         * @param {X64Word} word The x64-Word to XOR with this word.
		         *
		         * @return {X64Word} A new x64-Word object after XORing.
		         *
		         * @example
		         *
		         *     var xored = x64Word.xor(anotherX64Word);
		         */
		        // xor: function (word) {
		            // var high = this.high ^ word.high;
		            // var low = this.low ^ word.low;
	
		            // return X64Word.create(high, low);
		        // },
	
		        /**
		         * Shifts this word n bits to the left.
		         *
		         * @param {number} n The number of bits to shift.
		         *
		         * @return {X64Word} A new x64-Word object after shifting.
		         *
		         * @example
		         *
		         *     var shifted = x64Word.shiftL(25);
		         */
		        // shiftL: function (n) {
		            // if (n < 32) {
		                // var high = (this.high << n) | (this.low >>> (32 - n));
		                // var low = this.low << n;
		            // } else {
		                // var high = this.low << (n - 32);
		                // var low = 0;
		            // }
	
		            // return X64Word.create(high, low);
		        // },
	
		        /**
		         * Shifts this word n bits to the right.
		         *
		         * @param {number} n The number of bits to shift.
		         *
		         * @return {X64Word} A new x64-Word object after shifting.
		         *
		         * @example
		         *
		         *     var shifted = x64Word.shiftR(7);
		         */
		        // shiftR: function (n) {
		            // if (n < 32) {
		                // var low = (this.low >>> n) | (this.high << (32 - n));
		                // var high = this.high >>> n;
		            // } else {
		                // var low = this.high >>> (n - 32);
		                // var high = 0;
		            // }
	
		            // return X64Word.create(high, low);
		        // },
	
		        /**
		         * Rotates this word n bits to the left.
		         *
		         * @param {number} n The number of bits to rotate.
		         *
		         * @return {X64Word} A new x64-Word object after rotating.
		         *
		         * @example
		         *
		         *     var rotated = x64Word.rotL(25);
		         */
		        // rotL: function (n) {
		            // return this.shiftL(n).or(this.shiftR(64 - n));
		        // },
	
		        /**
		         * Rotates this word n bits to the right.
		         *
		         * @param {number} n The number of bits to rotate.
		         *
		         * @return {X64Word} A new x64-Word object after rotating.
		         *
		         * @example
		         *
		         *     var rotated = x64Word.rotR(7);
		         */
		        // rotR: function (n) {
		            // return this.shiftR(n).or(this.shiftL(64 - n));
		        // },
	
		        /**
		         * Adds this word with the passed word.
		         *
		         * @param {X64Word} word The x64-Word to add with this word.
		         *
		         * @return {X64Word} A new x64-Word object after adding.
		         *
		         * @example
		         *
		         *     var added = x64Word.add(anotherX64Word);
		         */
		        // add: function (word) {
		            // var low = (this.low + word.low) | 0;
		            // var carry = (low >>> 0) < (this.low >>> 0) ? 1 : 0;
		            // var high = (this.high + word.high + carry) | 0;
	
		            // return X64Word.create(high, low);
		        // }
		    });
	
		    /**
		     * An array of 64-bit words.
		     *
		     * @property {Array} words The array of CryptoJS.x64.Word objects.
		     * @property {number} sigBytes The number of significant bytes in this word array.
		     */
		    var X64WordArray = C_x64.WordArray = Base.extend({
		        /**
		         * Initializes a newly created word array.
		         *
		         * @param {Array} words (Optional) An array of CryptoJS.x64.Word objects.
		         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
		         *
		         * @example
		         *
		         *     var wordArray = CryptoJS.x64.WordArray.create();
		         *
		         *     var wordArray = CryptoJS.x64.WordArray.create([
		         *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
		         *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
		         *     ]);
		         *
		         *     var wordArray = CryptoJS.x64.WordArray.create([
		         *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
		         *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
		         *     ], 10);
		         */
		        init: function (words, sigBytes) {
		            words = this.words = words || [];
	
		            if (sigBytes != undefined) {
		                this.sigBytes = sigBytes;
		            } else {
		                this.sigBytes = words.length * 8;
		            }
		        },
	
		        /**
		         * Converts this 64-bit word array to a 32-bit word array.
		         *
		         * @return {CryptoJS.lib.WordArray} This word array's data as a 32-bit word array.
		         *
		         * @example
		         *
		         *     var x32WordArray = x64WordArray.toX32();
		         */
		        toX32: function () {
		            // Shortcuts
		            var x64Words = this.words;
		            var x64WordsLength = x64Words.length;
	
		            // Convert
		            var x32Words = [];
		            for (var i = 0; i < x64WordsLength; i++) {
		                var x64Word = x64Words[i];
		                x32Words.push(x64Word.high);
		                x32Words.push(x64Word.low);
		            }
	
		            return X32WordArray.create(x32Words, this.sigBytes);
		        },
	
		        /**
		         * Creates a copy of this word array.
		         *
		         * @return {X64WordArray} The clone.
		         *
		         * @example
		         *
		         *     var clone = x64WordArray.clone();
		         */
		        clone: function () {
		            var clone = Base.clone.call(this);
	
		            // Clone "words" array
		            var words = clone.words = this.words.slice(0);
	
		            // Clone each X64Word object
		            var wordsLength = words.length;
		            for (var i = 0; i < wordsLength; i++) {
		                words[i] = words[i].clone();
		            }
	
		            return clone;
		        }
		    });
		}());
	
	
		return CryptoJS;
	
	}));

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	;(function (root, factory) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(43));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function () {
		    // Check if typed arrays are supported
		    if (typeof ArrayBuffer != 'function') {
		        return;
		    }
	
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var WordArray = C_lib.WordArray;
	
		    // Reference original init
		    var superInit = WordArray.init;
	
		    // Augment WordArray.init to handle typed arrays
		    var subInit = WordArray.init = function (typedArray) {
		        // Convert buffers to uint8
		        if (typedArray instanceof ArrayBuffer) {
		            typedArray = new Uint8Array(typedArray);
		        }
	
		        // Convert other array views to uint8
		        if (
		            typedArray instanceof Int8Array ||
		            (typeof Uint8ClampedArray !== "undefined" && typedArray instanceof Uint8ClampedArray) ||
		            typedArray instanceof Int16Array ||
		            typedArray instanceof Uint16Array ||
		            typedArray instanceof Int32Array ||
		            typedArray instanceof Uint32Array ||
		            typedArray instanceof Float32Array ||
		            typedArray instanceof Float64Array
		        ) {
		            typedArray = new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
		        }
	
		        // Handle Uint8Array
		        if (typedArray instanceof Uint8Array) {
		            // Shortcut
		            var typedArrayByteLength = typedArray.byteLength;
	
		            // Extract bytes
		            var words = [];
		            for (var i = 0; i < typedArrayByteLength; i++) {
		                words[i >>> 2] |= typedArray[i] << (24 - (i % 4) * 8);
		            }
	
		            // Initialize this word array
		            superInit.call(this, words, typedArrayByteLength);
		        } else {
		            // Else call normal init
		            superInit.apply(this, arguments);
		        }
		    };
	
		    subInit.prototype = WordArray;
		}());
	
	
		return CryptoJS.lib.WordArray;
	
	}));

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

	;(function (root, factory) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(43));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function () {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var WordArray = C_lib.WordArray;
		    var C_enc = C.enc;
	
		    /**
		     * UTF-16 BE encoding strategy.
		     */
		    var Utf16BE = C_enc.Utf16 = C_enc.Utf16BE = {
		        /**
		         * Converts a word array to a UTF-16 BE string.
		         *
		         * @param {WordArray} wordArray The word array.
		         *
		         * @return {string} The UTF-16 BE string.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var utf16String = CryptoJS.enc.Utf16.stringify(wordArray);
		         */
		        stringify: function (wordArray) {
		            // Shortcuts
		            var words = wordArray.words;
		            var sigBytes = wordArray.sigBytes;
	
		            // Convert
		            var utf16Chars = [];
		            for (var i = 0; i < sigBytes; i += 2) {
		                var codePoint = (words[i >>> 2] >>> (16 - (i % 4) * 8)) & 0xffff;
		                utf16Chars.push(String.fromCharCode(codePoint));
		            }
	
		            return utf16Chars.join('');
		        },
	
		        /**
		         * Converts a UTF-16 BE string to a word array.
		         *
		         * @param {string} utf16Str The UTF-16 BE string.
		         *
		         * @return {WordArray} The word array.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var wordArray = CryptoJS.enc.Utf16.parse(utf16String);
		         */
		        parse: function (utf16Str) {
		            // Shortcut
		            var utf16StrLength = utf16Str.length;
	
		            // Convert
		            var words = [];
		            for (var i = 0; i < utf16StrLength; i++) {
		                words[i >>> 1] |= utf16Str.charCodeAt(i) << (16 - (i % 2) * 16);
		            }
	
		            return WordArray.create(words, utf16StrLength * 2);
		        }
		    };
	
		    /**
		     * UTF-16 LE encoding strategy.
		     */
		    C_enc.Utf16LE = {
		        /**
		         * Converts a word array to a UTF-16 LE string.
		         *
		         * @param {WordArray} wordArray The word array.
		         *
		         * @return {string} The UTF-16 LE string.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var utf16Str = CryptoJS.enc.Utf16LE.stringify(wordArray);
		         */
		        stringify: function (wordArray) {
		            // Shortcuts
		            var words = wordArray.words;
		            var sigBytes = wordArray.sigBytes;
	
		            // Convert
		            var utf16Chars = [];
		            for (var i = 0; i < sigBytes; i += 2) {
		                var codePoint = swapEndian((words[i >>> 2] >>> (16 - (i % 4) * 8)) & 0xffff);
		                utf16Chars.push(String.fromCharCode(codePoint));
		            }
	
		            return utf16Chars.join('');
		        },
	
		        /**
		         * Converts a UTF-16 LE string to a word array.
		         *
		         * @param {string} utf16Str The UTF-16 LE string.
		         *
		         * @return {WordArray} The word array.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var wordArray = CryptoJS.enc.Utf16LE.parse(utf16Str);
		         */
		        parse: function (utf16Str) {
		            // Shortcut
		            var utf16StrLength = utf16Str.length;
	
		            // Convert
		            var words = [];
		            for (var i = 0; i < utf16StrLength; i++) {
		                words[i >>> 1] |= swapEndian(utf16Str.charCodeAt(i) << (16 - (i % 2) * 16));
		            }
	
		            return WordArray.create(words, utf16StrLength * 2);
		        }
		    };
	
		    function swapEndian(word) {
		        return ((word << 8) & 0xff00ff00) | ((word >>> 8) & 0x00ff00ff);
		    }
		}());
	
	
		return CryptoJS.enc.Utf16;
	
	}));

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	;(function (root, factory) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(43));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function () {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var WordArray = C_lib.WordArray;
		    var C_enc = C.enc;
	
		    /**
		     * Base64 encoding strategy.
		     */
		    var Base64 = C_enc.Base64 = {
		        /**
		         * Converts a word array to a Base64 string.
		         *
		         * @param {WordArray} wordArray The word array.
		         *
		         * @return {string} The Base64 string.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
		         */
		        stringify: function (wordArray) {
		            // Shortcuts
		            var words = wordArray.words;
		            var sigBytes = wordArray.sigBytes;
		            var map = this._map;
	
		            // Clamp excess bits
		            wordArray.clamp();
	
		            // Convert
		            var base64Chars = [];
		            for (var i = 0; i < sigBytes; i += 3) {
		                var byte1 = (words[i >>> 2]       >>> (24 - (i % 4) * 8))       & 0xff;
		                var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
		                var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;
	
		                var triplet = (byte1 << 16) | (byte2 << 8) | byte3;
	
		                for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
		                    base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
		                }
		            }
	
		            // Add padding
		            var paddingChar = map.charAt(64);
		            if (paddingChar) {
		                while (base64Chars.length % 4) {
		                    base64Chars.push(paddingChar);
		                }
		            }
	
		            return base64Chars.join('');
		        },
	
		        /**
		         * Converts a Base64 string to a word array.
		         *
		         * @param {string} base64Str The Base64 string.
		         *
		         * @return {WordArray} The word array.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
		         */
		        parse: function (base64Str) {
		            // Shortcuts
		            var base64StrLength = base64Str.length;
		            var map = this._map;
		            var reverseMap = this._reverseMap;
	
		            if (!reverseMap) {
		                    reverseMap = this._reverseMap = [];
		                    for (var j = 0; j < map.length; j++) {
		                        reverseMap[map.charCodeAt(j)] = j;
		                    }
		            }
	
		            // Ignore padding
		            var paddingChar = map.charAt(64);
		            if (paddingChar) {
		                var paddingIndex = base64Str.indexOf(paddingChar);
		                if (paddingIndex !== -1) {
		                    base64StrLength = paddingIndex;
		                }
		            }
	
		            // Convert
		            return parseLoop(base64Str, base64StrLength, reverseMap);
	
		        },
	
		        _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
		    };
	
		    function parseLoop(base64Str, base64StrLength, reverseMap) {
		      var words = [];
		      var nBytes = 0;
		      for (var i = 0; i < base64StrLength; i++) {
		          if (i % 4) {
		              var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << ((i % 4) * 2);
		              var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> (6 - (i % 4) * 2);
		              words[nBytes >>> 2] |= (bits1 | bits2) << (24 - (nBytes % 4) * 8);
		              nBytes++;
		          }
		      }
		      return WordArray.create(words, nBytes);
		    }
		}());
	
	
		return CryptoJS.enc.Base64;
	
	}));

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

	;(function (root, factory) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(43));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function (Math) {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var WordArray = C_lib.WordArray;
		    var Hasher = C_lib.Hasher;
		    var C_algo = C.algo;
	
		    // Constants table
		    var T = [];
	
		    // Compute constants
		    (function () {
		        for (var i = 0; i < 64; i++) {
		            T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
		        }
		    }());
	
		    /**
		     * MD5 hash algorithm.
		     */
		    var MD5 = C_algo.MD5 = Hasher.extend({
		        _doReset: function () {
		            this._hash = new WordArray.init([
		                0x67452301, 0xefcdab89,
		                0x98badcfe, 0x10325476
		            ]);
		        },
	
		        _doProcessBlock: function (M, offset) {
		            // Swap endian
		            for (var i = 0; i < 16; i++) {
		                // Shortcuts
		                var offset_i = offset + i;
		                var M_offset_i = M[offset_i];
	
		                M[offset_i] = (
		                    (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
		                    (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
		                );
		            }
	
		            // Shortcuts
		            var H = this._hash.words;
	
		            var M_offset_0  = M[offset + 0];
		            var M_offset_1  = M[offset + 1];
		            var M_offset_2  = M[offset + 2];
		            var M_offset_3  = M[offset + 3];
		            var M_offset_4  = M[offset + 4];
		            var M_offset_5  = M[offset + 5];
		            var M_offset_6  = M[offset + 6];
		            var M_offset_7  = M[offset + 7];
		            var M_offset_8  = M[offset + 8];
		            var M_offset_9  = M[offset + 9];
		            var M_offset_10 = M[offset + 10];
		            var M_offset_11 = M[offset + 11];
		            var M_offset_12 = M[offset + 12];
		            var M_offset_13 = M[offset + 13];
		            var M_offset_14 = M[offset + 14];
		            var M_offset_15 = M[offset + 15];
	
		            // Working varialbes
		            var a = H[0];
		            var b = H[1];
		            var c = H[2];
		            var d = H[3];
	
		            // Computation
		            a = FF(a, b, c, d, M_offset_0,  7,  T[0]);
		            d = FF(d, a, b, c, M_offset_1,  12, T[1]);
		            c = FF(c, d, a, b, M_offset_2,  17, T[2]);
		            b = FF(b, c, d, a, M_offset_3,  22, T[3]);
		            a = FF(a, b, c, d, M_offset_4,  7,  T[4]);
		            d = FF(d, a, b, c, M_offset_5,  12, T[5]);
		            c = FF(c, d, a, b, M_offset_6,  17, T[6]);
		            b = FF(b, c, d, a, M_offset_7,  22, T[7]);
		            a = FF(a, b, c, d, M_offset_8,  7,  T[8]);
		            d = FF(d, a, b, c, M_offset_9,  12, T[9]);
		            c = FF(c, d, a, b, M_offset_10, 17, T[10]);
		            b = FF(b, c, d, a, M_offset_11, 22, T[11]);
		            a = FF(a, b, c, d, M_offset_12, 7,  T[12]);
		            d = FF(d, a, b, c, M_offset_13, 12, T[13]);
		            c = FF(c, d, a, b, M_offset_14, 17, T[14]);
		            b = FF(b, c, d, a, M_offset_15, 22, T[15]);
	
		            a = GG(a, b, c, d, M_offset_1,  5,  T[16]);
		            d = GG(d, a, b, c, M_offset_6,  9,  T[17]);
		            c = GG(c, d, a, b, M_offset_11, 14, T[18]);
		            b = GG(b, c, d, a, M_offset_0,  20, T[19]);
		            a = GG(a, b, c, d, M_offset_5,  5,  T[20]);
		            d = GG(d, a, b, c, M_offset_10, 9,  T[21]);
		            c = GG(c, d, a, b, M_offset_15, 14, T[22]);
		            b = GG(b, c, d, a, M_offset_4,  20, T[23]);
		            a = GG(a, b, c, d, M_offset_9,  5,  T[24]);
		            d = GG(d, a, b, c, M_offset_14, 9,  T[25]);
		            c = GG(c, d, a, b, M_offset_3,  14, T[26]);
		            b = GG(b, c, d, a, M_offset_8,  20, T[27]);
		            a = GG(a, b, c, d, M_offset_13, 5,  T[28]);
		            d = GG(d, a, b, c, M_offset_2,  9,  T[29]);
		            c = GG(c, d, a, b, M_offset_7,  14, T[30]);
		            b = GG(b, c, d, a, M_offset_12, 20, T[31]);
	
		            a = HH(a, b, c, d, M_offset_5,  4,  T[32]);
		            d = HH(d, a, b, c, M_offset_8,  11, T[33]);
		            c = HH(c, d, a, b, M_offset_11, 16, T[34]);
		            b = HH(b, c, d, a, M_offset_14, 23, T[35]);
		            a = HH(a, b, c, d, M_offset_1,  4,  T[36]);
		            d = HH(d, a, b, c, M_offset_4,  11, T[37]);
		            c = HH(c, d, a, b, M_offset_7,  16, T[38]);
		            b = HH(b, c, d, a, M_offset_10, 23, T[39]);
		            a = HH(a, b, c, d, M_offset_13, 4,  T[40]);
		            d = HH(d, a, b, c, M_offset_0,  11, T[41]);
		            c = HH(c, d, a, b, M_offset_3,  16, T[42]);
		            b = HH(b, c, d, a, M_offset_6,  23, T[43]);
		            a = HH(a, b, c, d, M_offset_9,  4,  T[44]);
		            d = HH(d, a, b, c, M_offset_12, 11, T[45]);
		            c = HH(c, d, a, b, M_offset_15, 16, T[46]);
		            b = HH(b, c, d, a, M_offset_2,  23, T[47]);
	
		            a = II(a, b, c, d, M_offset_0,  6,  T[48]);
		            d = II(d, a, b, c, M_offset_7,  10, T[49]);
		            c = II(c, d, a, b, M_offset_14, 15, T[50]);
		            b = II(b, c, d, a, M_offset_5,  21, T[51]);
		            a = II(a, b, c, d, M_offset_12, 6,  T[52]);
		            d = II(d, a, b, c, M_offset_3,  10, T[53]);
		            c = II(c, d, a, b, M_offset_10, 15, T[54]);
		            b = II(b, c, d, a, M_offset_1,  21, T[55]);
		            a = II(a, b, c, d, M_offset_8,  6,  T[56]);
		            d = II(d, a, b, c, M_offset_15, 10, T[57]);
		            c = II(c, d, a, b, M_offset_6,  15, T[58]);
		            b = II(b, c, d, a, M_offset_13, 21, T[59]);
		            a = II(a, b, c, d, M_offset_4,  6,  T[60]);
		            d = II(d, a, b, c, M_offset_11, 10, T[61]);
		            c = II(c, d, a, b, M_offset_2,  15, T[62]);
		            b = II(b, c, d, a, M_offset_9,  21, T[63]);
	
		            // Intermediate hash value
		            H[0] = (H[0] + a) | 0;
		            H[1] = (H[1] + b) | 0;
		            H[2] = (H[2] + c) | 0;
		            H[3] = (H[3] + d) | 0;
		        },
	
		        _doFinalize: function () {
		            // Shortcuts
		            var data = this._data;
		            var dataWords = data.words;
	
		            var nBitsTotal = this._nDataBytes * 8;
		            var nBitsLeft = data.sigBytes * 8;
	
		            // Add padding
		            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
	
		            var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
		            var nBitsTotalL = nBitsTotal;
		            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = (
		                (((nBitsTotalH << 8)  | (nBitsTotalH >>> 24)) & 0x00ff00ff) |
		                (((nBitsTotalH << 24) | (nBitsTotalH >>> 8))  & 0xff00ff00)
		            );
		            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
		                (((nBitsTotalL << 8)  | (nBitsTotalL >>> 24)) & 0x00ff00ff) |
		                (((nBitsTotalL << 24) | (nBitsTotalL >>> 8))  & 0xff00ff00)
		            );
	
		            data.sigBytes = (dataWords.length + 1) * 4;
	
		            // Hash final blocks
		            this._process();
	
		            // Shortcuts
		            var hash = this._hash;
		            var H = hash.words;
	
		            // Swap endian
		            for (var i = 0; i < 4; i++) {
		                // Shortcut
		                var H_i = H[i];
	
		                H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
		                       (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
		            }
	
		            // Return final computed hash
		            return hash;
		        },
	
		        clone: function () {
		            var clone = Hasher.clone.call(this);
		            clone._hash = this._hash.clone();
	
		            return clone;
		        }
		    });
	
		    function FF(a, b, c, d, x, s, t) {
		        var n = a + ((b & c) | (~b & d)) + x + t;
		        return ((n << s) | (n >>> (32 - s))) + b;
		    }
	
		    function GG(a, b, c, d, x, s, t) {
		        var n = a + ((b & d) | (c & ~d)) + x + t;
		        return ((n << s) | (n >>> (32 - s))) + b;
		    }
	
		    function HH(a, b, c, d, x, s, t) {
		        var n = a + (b ^ c ^ d) + x + t;
		        return ((n << s) | (n >>> (32 - s))) + b;
		    }
	
		    function II(a, b, c, d, x, s, t) {
		        var n = a + (c ^ (b | ~d)) + x + t;
		        return ((n << s) | (n >>> (32 - s))) + b;
		    }
	
		    /**
		     * Shortcut function to the hasher's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     *
		     * @return {WordArray} The hash.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hash = CryptoJS.MD5('message');
		     *     var hash = CryptoJS.MD5(wordArray);
		     */
		    C.MD5 = Hasher._createHelper(MD5);
	
		    /**
		     * Shortcut function to the HMAC's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     * @param {WordArray|string} key The secret key.
		     *
		     * @return {WordArray} The HMAC.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hmac = CryptoJS.HmacMD5(message, key);
		     */
		    C.HmacMD5 = Hasher._createHmacHelper(MD5);
		}(Math));
	
	
		return CryptoJS.MD5;
	
	}));

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

	;(function (root, factory) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(43));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function () {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var WordArray = C_lib.WordArray;
		    var Hasher = C_lib.Hasher;
		    var C_algo = C.algo;
	
		    // Reusable object
		    var W = [];
	
		    /**
		     * SHA-1 hash algorithm.
		     */
		    var SHA1 = C_algo.SHA1 = Hasher.extend({
		        _doReset: function () {
		            this._hash = new WordArray.init([
		                0x67452301, 0xefcdab89,
		                0x98badcfe, 0x10325476,
		                0xc3d2e1f0
		            ]);
		        },
	
		        _doProcessBlock: function (M, offset) {
		            // Shortcut
		            var H = this._hash.words;
	
		            // Working variables
		            var a = H[0];
		            var b = H[1];
		            var c = H[2];
		            var d = H[3];
		            var e = H[4];
	
		            // Computation
		            for (var i = 0; i < 80; i++) {
		                if (i < 16) {
		                    W[i] = M[offset + i] | 0;
		                } else {
		                    var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
		                    W[i] = (n << 1) | (n >>> 31);
		                }
	
		                var t = ((a << 5) | (a >>> 27)) + e + W[i];
		                if (i < 20) {
		                    t += ((b & c) | (~b & d)) + 0x5a827999;
		                } else if (i < 40) {
		                    t += (b ^ c ^ d) + 0x6ed9eba1;
		                } else if (i < 60) {
		                    t += ((b & c) | (b & d) | (c & d)) - 0x70e44324;
		                } else /* if (i < 80) */ {
		                    t += (b ^ c ^ d) - 0x359d3e2a;
		                }
	
		                e = d;
		                d = c;
		                c = (b << 30) | (b >>> 2);
		                b = a;
		                a = t;
		            }
	
		            // Intermediate hash value
		            H[0] = (H[0] + a) | 0;
		            H[1] = (H[1] + b) | 0;
		            H[2] = (H[2] + c) | 0;
		            H[3] = (H[3] + d) | 0;
		            H[4] = (H[4] + e) | 0;
		        },
	
		        _doFinalize: function () {
		            // Shortcuts
		            var data = this._data;
		            var dataWords = data.words;
	
		            var nBitsTotal = this._nDataBytes * 8;
		            var nBitsLeft = data.sigBytes * 8;
	
		            // Add padding
		            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
		            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
		            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
		            data.sigBytes = dataWords.length * 4;
	
		            // Hash final blocks
		            this._process();
	
		            // Return final computed hash
		            return this._hash;
		        },
	
		        clone: function () {
		            var clone = Hasher.clone.call(this);
		            clone._hash = this._hash.clone();
	
		            return clone;
		        }
		    });
	
		    /**
		     * Shortcut function to the hasher's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     *
		     * @return {WordArray} The hash.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hash = CryptoJS.SHA1('message');
		     *     var hash = CryptoJS.SHA1(wordArray);
		     */
		    C.SHA1 = Hasher._createHelper(SHA1);
	
		    /**
		     * Shortcut function to the HMAC's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     * @param {WordArray|string} key The secret key.
		     *
		     * @return {WordArray} The HMAC.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hmac = CryptoJS.HmacSHA1(message, key);
		     */
		    C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
		}());
	
	
		return CryptoJS.SHA1;
	
	}));

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

	;(function (root, factory) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(43));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function (Math) {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var WordArray = C_lib.WordArray;
		    var Hasher = C_lib.Hasher;
		    var C_algo = C.algo;
	
		    // Initialization and round constants tables
		    var H = [];
		    var K = [];
	
		    // Compute constants
		    (function () {
		        function isPrime(n) {
		            var sqrtN = Math.sqrt(n);
		            for (var factor = 2; factor <= sqrtN; factor++) {
		                if (!(n % factor)) {
		                    return false;
		                }
		            }
	
		            return true;
		        }
	
		        function getFractionalBits(n) {
		            return ((n - (n | 0)) * 0x100000000) | 0;
		        }
	
		        var n = 2;
		        var nPrime = 0;
		        while (nPrime < 64) {
		            if (isPrime(n)) {
		                if (nPrime < 8) {
		                    H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
		                }
		                K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));
	
		                nPrime++;
		            }
	
		            n++;
		        }
		    }());
	
		    // Reusable object
		    var W = [];
	
		    /**
		     * SHA-256 hash algorithm.
		     */
		    var SHA256 = C_algo.SHA256 = Hasher.extend({
		        _doReset: function () {
		            this._hash = new WordArray.init(H.slice(0));
		        },
	
		        _doProcessBlock: function (M, offset) {
		            // Shortcut
		            var H = this._hash.words;
	
		            // Working variables
		            var a = H[0];
		            var b = H[1];
		            var c = H[2];
		            var d = H[3];
		            var e = H[4];
		            var f = H[5];
		            var g = H[6];
		            var h = H[7];
	
		            // Computation
		            for (var i = 0; i < 64; i++) {
		                if (i < 16) {
		                    W[i] = M[offset + i] | 0;
		                } else {
		                    var gamma0x = W[i - 15];
		                    var gamma0  = ((gamma0x << 25) | (gamma0x >>> 7))  ^
		                                  ((gamma0x << 14) | (gamma0x >>> 18)) ^
		                                   (gamma0x >>> 3);
	
		                    var gamma1x = W[i - 2];
		                    var gamma1  = ((gamma1x << 15) | (gamma1x >>> 17)) ^
		                                  ((gamma1x << 13) | (gamma1x >>> 19)) ^
		                                   (gamma1x >>> 10);
	
		                    W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
		                }
	
		                var ch  = (e & f) ^ (~e & g);
		                var maj = (a & b) ^ (a & c) ^ (b & c);
	
		                var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
		                var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7)  | (e >>> 25));
	
		                var t1 = h + sigma1 + ch + K[i] + W[i];
		                var t2 = sigma0 + maj;
	
		                h = g;
		                g = f;
		                f = e;
		                e = (d + t1) | 0;
		                d = c;
		                c = b;
		                b = a;
		                a = (t1 + t2) | 0;
		            }
	
		            // Intermediate hash value
		            H[0] = (H[0] + a) | 0;
		            H[1] = (H[1] + b) | 0;
		            H[2] = (H[2] + c) | 0;
		            H[3] = (H[3] + d) | 0;
		            H[4] = (H[4] + e) | 0;
		            H[5] = (H[5] + f) | 0;
		            H[6] = (H[6] + g) | 0;
		            H[7] = (H[7] + h) | 0;
		        },
	
		        _doFinalize: function () {
		            // Shortcuts
		            var data = this._data;
		            var dataWords = data.words;
	
		            var nBitsTotal = this._nDataBytes * 8;
		            var nBitsLeft = data.sigBytes * 8;
	
		            // Add padding
		            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
		            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
		            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
		            data.sigBytes = dataWords.length * 4;
	
		            // Hash final blocks
		            this._process();
	
		            // Return final computed hash
		            return this._hash;
		        },
	
		        clone: function () {
		            var clone = Hasher.clone.call(this);
		            clone._hash = this._hash.clone();
	
		            return clone;
		        }
		    });
	
		    /**
		     * Shortcut function to the hasher's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     *
		     * @return {WordArray} The hash.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hash = CryptoJS.SHA256('message');
		     *     var hash = CryptoJS.SHA256(wordArray);
		     */
		    C.SHA256 = Hasher._createHelper(SHA256);
	
		    /**
		     * Shortcut function to the HMAC's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     * @param {WordArray|string} key The secret key.
		     *
		     * @return {WordArray} The HMAC.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hmac = CryptoJS.HmacSHA256(message, key);
		     */
		    C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
		}(Math));
	
	
		return CryptoJS.SHA256;
	
	}));

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(43), __webpack_require__(50));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./sha256"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function () {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var WordArray = C_lib.WordArray;
		    var C_algo = C.algo;
		    var SHA256 = C_algo.SHA256;
	
		    /**
		     * SHA-224 hash algorithm.
		     */
		    var SHA224 = C_algo.SHA224 = SHA256.extend({
		        _doReset: function () {
		            this._hash = new WordArray.init([
		                0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
		                0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4
		            ]);
		        },
	
		        _doFinalize: function () {
		            var hash = SHA256._doFinalize.call(this);
	
		            hash.sigBytes -= 4;
	
		            return hash;
		        }
		    });
	
		    /**
		     * Shortcut function to the hasher's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     *
		     * @return {WordArray} The hash.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hash = CryptoJS.SHA224('message');
		     *     var hash = CryptoJS.SHA224(wordArray);
		     */
		    C.SHA224 = SHA256._createHelper(SHA224);
	
		    /**
		     * Shortcut function to the HMAC's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     * @param {WordArray|string} key The secret key.
		     *
		     * @return {WordArray} The HMAC.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hmac = CryptoJS.HmacSHA224(message, key);
		     */
		    C.HmacSHA224 = SHA256._createHmacHelper(SHA224);
		}());
	
	
		return CryptoJS.SHA224;
	
	}));

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(43), __webpack_require__(44));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./x64-core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function () {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var Hasher = C_lib.Hasher;
		    var C_x64 = C.x64;
		    var X64Word = C_x64.Word;
		    var X64WordArray = C_x64.WordArray;
		    var C_algo = C.algo;
	
		    function X64Word_create() {
		        return X64Word.create.apply(X64Word, arguments);
		    }
	
		    // Constants
		    var K = [
		        X64Word_create(0x428a2f98, 0xd728ae22), X64Word_create(0x71374491, 0x23ef65cd),
		        X64Word_create(0xb5c0fbcf, 0xec4d3b2f), X64Word_create(0xe9b5dba5, 0x8189dbbc),
		        X64Word_create(0x3956c25b, 0xf348b538), X64Word_create(0x59f111f1, 0xb605d019),
		        X64Word_create(0x923f82a4, 0xaf194f9b), X64Word_create(0xab1c5ed5, 0xda6d8118),
		        X64Word_create(0xd807aa98, 0xa3030242), X64Word_create(0x12835b01, 0x45706fbe),
		        X64Word_create(0x243185be, 0x4ee4b28c), X64Word_create(0x550c7dc3, 0xd5ffb4e2),
		        X64Word_create(0x72be5d74, 0xf27b896f), X64Word_create(0x80deb1fe, 0x3b1696b1),
		        X64Word_create(0x9bdc06a7, 0x25c71235), X64Word_create(0xc19bf174, 0xcf692694),
		        X64Word_create(0xe49b69c1, 0x9ef14ad2), X64Word_create(0xefbe4786, 0x384f25e3),
		        X64Word_create(0x0fc19dc6, 0x8b8cd5b5), X64Word_create(0x240ca1cc, 0x77ac9c65),
		        X64Word_create(0x2de92c6f, 0x592b0275), X64Word_create(0x4a7484aa, 0x6ea6e483),
		        X64Word_create(0x5cb0a9dc, 0xbd41fbd4), X64Word_create(0x76f988da, 0x831153b5),
		        X64Word_create(0x983e5152, 0xee66dfab), X64Word_create(0xa831c66d, 0x2db43210),
		        X64Word_create(0xb00327c8, 0x98fb213f), X64Word_create(0xbf597fc7, 0xbeef0ee4),
		        X64Word_create(0xc6e00bf3, 0x3da88fc2), X64Word_create(0xd5a79147, 0x930aa725),
		        X64Word_create(0x06ca6351, 0xe003826f), X64Word_create(0x14292967, 0x0a0e6e70),
		        X64Word_create(0x27b70a85, 0x46d22ffc), X64Word_create(0x2e1b2138, 0x5c26c926),
		        X64Word_create(0x4d2c6dfc, 0x5ac42aed), X64Word_create(0x53380d13, 0x9d95b3df),
		        X64Word_create(0x650a7354, 0x8baf63de), X64Word_create(0x766a0abb, 0x3c77b2a8),
		        X64Word_create(0x81c2c92e, 0x47edaee6), X64Word_create(0x92722c85, 0x1482353b),
		        X64Word_create(0xa2bfe8a1, 0x4cf10364), X64Word_create(0xa81a664b, 0xbc423001),
		        X64Word_create(0xc24b8b70, 0xd0f89791), X64Word_create(0xc76c51a3, 0x0654be30),
		        X64Word_create(0xd192e819, 0xd6ef5218), X64Word_create(0xd6990624, 0x5565a910),
		        X64Word_create(0xf40e3585, 0x5771202a), X64Word_create(0x106aa070, 0x32bbd1b8),
		        X64Word_create(0x19a4c116, 0xb8d2d0c8), X64Word_create(0x1e376c08, 0x5141ab53),
		        X64Word_create(0x2748774c, 0xdf8eeb99), X64Word_create(0x34b0bcb5, 0xe19b48a8),
		        X64Word_create(0x391c0cb3, 0xc5c95a63), X64Word_create(0x4ed8aa4a, 0xe3418acb),
		        X64Word_create(0x5b9cca4f, 0x7763e373), X64Word_create(0x682e6ff3, 0xd6b2b8a3),
		        X64Word_create(0x748f82ee, 0x5defb2fc), X64Word_create(0x78a5636f, 0x43172f60),
		        X64Word_create(0x84c87814, 0xa1f0ab72), X64Word_create(0x8cc70208, 0x1a6439ec),
		        X64Word_create(0x90befffa, 0x23631e28), X64Word_create(0xa4506ceb, 0xde82bde9),
		        X64Word_create(0xbef9a3f7, 0xb2c67915), X64Word_create(0xc67178f2, 0xe372532b),
		        X64Word_create(0xca273ece, 0xea26619c), X64Word_create(0xd186b8c7, 0x21c0c207),
		        X64Word_create(0xeada7dd6, 0xcde0eb1e), X64Word_create(0xf57d4f7f, 0xee6ed178),
		        X64Word_create(0x06f067aa, 0x72176fba), X64Word_create(0x0a637dc5, 0xa2c898a6),
		        X64Word_create(0x113f9804, 0xbef90dae), X64Word_create(0x1b710b35, 0x131c471b),
		        X64Word_create(0x28db77f5, 0x23047d84), X64Word_create(0x32caab7b, 0x40c72493),
		        X64Word_create(0x3c9ebe0a, 0x15c9bebc), X64Word_create(0x431d67c4, 0x9c100d4c),
		        X64Word_create(0x4cc5d4be, 0xcb3e42b6), X64Word_create(0x597f299c, 0xfc657e2a),
		        X64Word_create(0x5fcb6fab, 0x3ad6faec), X64Word_create(0x6c44198c, 0x4a475817)
		    ];
	
		    // Reusable objects
		    var W = [];
		    (function () {
		        for (var i = 0; i < 80; i++) {
		            W[i] = X64Word_create();
		        }
		    }());
	
		    /**
		     * SHA-512 hash algorithm.
		     */
		    var SHA512 = C_algo.SHA512 = Hasher.extend({
		        _doReset: function () {
		            this._hash = new X64WordArray.init([
		                new X64Word.init(0x6a09e667, 0xf3bcc908), new X64Word.init(0xbb67ae85, 0x84caa73b),
		                new X64Word.init(0x3c6ef372, 0xfe94f82b), new X64Word.init(0xa54ff53a, 0x5f1d36f1),
		                new X64Word.init(0x510e527f, 0xade682d1), new X64Word.init(0x9b05688c, 0x2b3e6c1f),
		                new X64Word.init(0x1f83d9ab, 0xfb41bd6b), new X64Word.init(0x5be0cd19, 0x137e2179)
		            ]);
		        },
	
		        _doProcessBlock: function (M, offset) {
		            // Shortcuts
		            var H = this._hash.words;
	
		            var H0 = H[0];
		            var H1 = H[1];
		            var H2 = H[2];
		            var H3 = H[3];
		            var H4 = H[4];
		            var H5 = H[5];
		            var H6 = H[6];
		            var H7 = H[7];
	
		            var H0h = H0.high;
		            var H0l = H0.low;
		            var H1h = H1.high;
		            var H1l = H1.low;
		            var H2h = H2.high;
		            var H2l = H2.low;
		            var H3h = H3.high;
		            var H3l = H3.low;
		            var H4h = H4.high;
		            var H4l = H4.low;
		            var H5h = H5.high;
		            var H5l = H5.low;
		            var H6h = H6.high;
		            var H6l = H6.low;
		            var H7h = H7.high;
		            var H7l = H7.low;
	
		            // Working variables
		            var ah = H0h;
		            var al = H0l;
		            var bh = H1h;
		            var bl = H1l;
		            var ch = H2h;
		            var cl = H2l;
		            var dh = H3h;
		            var dl = H3l;
		            var eh = H4h;
		            var el = H4l;
		            var fh = H5h;
		            var fl = H5l;
		            var gh = H6h;
		            var gl = H6l;
		            var hh = H7h;
		            var hl = H7l;
	
		            // Rounds
		            for (var i = 0; i < 80; i++) {
		                // Shortcut
		                var Wi = W[i];
	
		                // Extend message
		                if (i < 16) {
		                    var Wih = Wi.high = M[offset + i * 2]     | 0;
		                    var Wil = Wi.low  = M[offset + i * 2 + 1] | 0;
		                } else {
		                    // Gamma0
		                    var gamma0x  = W[i - 15];
		                    var gamma0xh = gamma0x.high;
		                    var gamma0xl = gamma0x.low;
		                    var gamma0h  = ((gamma0xh >>> 1) | (gamma0xl << 31)) ^ ((gamma0xh >>> 8) | (gamma0xl << 24)) ^ (gamma0xh >>> 7);
		                    var gamma0l  = ((gamma0xl >>> 1) | (gamma0xh << 31)) ^ ((gamma0xl >>> 8) | (gamma0xh << 24)) ^ ((gamma0xl >>> 7) | (gamma0xh << 25));
	
		                    // Gamma1
		                    var gamma1x  = W[i - 2];
		                    var gamma1xh = gamma1x.high;
		                    var gamma1xl = gamma1x.low;
		                    var gamma1h  = ((gamma1xh >>> 19) | (gamma1xl << 13)) ^ ((gamma1xh << 3) | (gamma1xl >>> 29)) ^ (gamma1xh >>> 6);
		                    var gamma1l  = ((gamma1xl >>> 19) | (gamma1xh << 13)) ^ ((gamma1xl << 3) | (gamma1xh >>> 29)) ^ ((gamma1xl >>> 6) | (gamma1xh << 26));
	
		                    // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
		                    var Wi7  = W[i - 7];
		                    var Wi7h = Wi7.high;
		                    var Wi7l = Wi7.low;
	
		                    var Wi16  = W[i - 16];
		                    var Wi16h = Wi16.high;
		                    var Wi16l = Wi16.low;
	
		                    var Wil = gamma0l + Wi7l;
		                    var Wih = gamma0h + Wi7h + ((Wil >>> 0) < (gamma0l >>> 0) ? 1 : 0);
		                    var Wil = Wil + gamma1l;
		                    var Wih = Wih + gamma1h + ((Wil >>> 0) < (gamma1l >>> 0) ? 1 : 0);
		                    var Wil = Wil + Wi16l;
		                    var Wih = Wih + Wi16h + ((Wil >>> 0) < (Wi16l >>> 0) ? 1 : 0);
	
		                    Wi.high = Wih;
		                    Wi.low  = Wil;
		                }
	
		                var chh  = (eh & fh) ^ (~eh & gh);
		                var chl  = (el & fl) ^ (~el & gl);
		                var majh = (ah & bh) ^ (ah & ch) ^ (bh & ch);
		                var majl = (al & bl) ^ (al & cl) ^ (bl & cl);
	
		                var sigma0h = ((ah >>> 28) | (al << 4))  ^ ((ah << 30)  | (al >>> 2)) ^ ((ah << 25) | (al >>> 7));
		                var sigma0l = ((al >>> 28) | (ah << 4))  ^ ((al << 30)  | (ah >>> 2)) ^ ((al << 25) | (ah >>> 7));
		                var sigma1h = ((eh >>> 14) | (el << 18)) ^ ((eh >>> 18) | (el << 14)) ^ ((eh << 23) | (el >>> 9));
		                var sigma1l = ((el >>> 14) | (eh << 18)) ^ ((el >>> 18) | (eh << 14)) ^ ((el << 23) | (eh >>> 9));
	
		                // t1 = h + sigma1 + ch + K[i] + W[i]
		                var Ki  = K[i];
		                var Kih = Ki.high;
		                var Kil = Ki.low;
	
		                var t1l = hl + sigma1l;
		                var t1h = hh + sigma1h + ((t1l >>> 0) < (hl >>> 0) ? 1 : 0);
		                var t1l = t1l + chl;
		                var t1h = t1h + chh + ((t1l >>> 0) < (chl >>> 0) ? 1 : 0);
		                var t1l = t1l + Kil;
		                var t1h = t1h + Kih + ((t1l >>> 0) < (Kil >>> 0) ? 1 : 0);
		                var t1l = t1l + Wil;
		                var t1h = t1h + Wih + ((t1l >>> 0) < (Wil >>> 0) ? 1 : 0);
	
		                // t2 = sigma0 + maj
		                var t2l = sigma0l + majl;
		                var t2h = sigma0h + majh + ((t2l >>> 0) < (sigma0l >>> 0) ? 1 : 0);
	
		                // Update working variables
		                hh = gh;
		                hl = gl;
		                gh = fh;
		                gl = fl;
		                fh = eh;
		                fl = el;
		                el = (dl + t1l) | 0;
		                eh = (dh + t1h + ((el >>> 0) < (dl >>> 0) ? 1 : 0)) | 0;
		                dh = ch;
		                dl = cl;
		                ch = bh;
		                cl = bl;
		                bh = ah;
		                bl = al;
		                al = (t1l + t2l) | 0;
		                ah = (t1h + t2h + ((al >>> 0) < (t1l >>> 0) ? 1 : 0)) | 0;
		            }
	
		            // Intermediate hash value
		            H0l = H0.low  = (H0l + al);
		            H0.high = (H0h + ah + ((H0l >>> 0) < (al >>> 0) ? 1 : 0));
		            H1l = H1.low  = (H1l + bl);
		            H1.high = (H1h + bh + ((H1l >>> 0) < (bl >>> 0) ? 1 : 0));
		            H2l = H2.low  = (H2l + cl);
		            H2.high = (H2h + ch + ((H2l >>> 0) < (cl >>> 0) ? 1 : 0));
		            H3l = H3.low  = (H3l + dl);
		            H3.high = (H3h + dh + ((H3l >>> 0) < (dl >>> 0) ? 1 : 0));
		            H4l = H4.low  = (H4l + el);
		            H4.high = (H4h + eh + ((H4l >>> 0) < (el >>> 0) ? 1 : 0));
		            H5l = H5.low  = (H5l + fl);
		            H5.high = (H5h + fh + ((H5l >>> 0) < (fl >>> 0) ? 1 : 0));
		            H6l = H6.low  = (H6l + gl);
		            H6.high = (H6h + gh + ((H6l >>> 0) < (gl >>> 0) ? 1 : 0));
		            H7l = H7.low  = (H7l + hl);
		            H7.high = (H7h + hh + ((H7l >>> 0) < (hl >>> 0) ? 1 : 0));
		        },
	
		        _doFinalize: function () {
		            // Shortcuts
		            var data = this._data;
		            var dataWords = data.words;
	
		            var nBitsTotal = this._nDataBytes * 8;
		            var nBitsLeft = data.sigBytes * 8;
	
		            // Add padding
		            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
		            dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 30] = Math.floor(nBitsTotal / 0x100000000);
		            dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 31] = nBitsTotal;
		            data.sigBytes = dataWords.length * 4;
	
		            // Hash final blocks
		            this._process();
	
		            // Convert hash to 32-bit word array before returning
		            var hash = this._hash.toX32();
	
		            // Return final computed hash
		            return hash;
		        },
	
		        clone: function () {
		            var clone = Hasher.clone.call(this);
		            clone._hash = this._hash.clone();
	
		            return clone;
		        },
	
		        blockSize: 1024/32
		    });
	
		    /**
		     * Shortcut function to the hasher's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     *
		     * @return {WordArray} The hash.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hash = CryptoJS.SHA512('message');
		     *     var hash = CryptoJS.SHA512(wordArray);
		     */
		    C.SHA512 = Hasher._createHelper(SHA512);
	
		    /**
		     * Shortcut function to the HMAC's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     * @param {WordArray|string} key The secret key.
		     *
		     * @return {WordArray} The HMAC.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hmac = CryptoJS.HmacSHA512(message, key);
		     */
		    C.HmacSHA512 = Hasher._createHmacHelper(SHA512);
		}());
	
	
		return CryptoJS.SHA512;
	
	}));

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(43), __webpack_require__(44), __webpack_require__(52));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./x64-core", "./sha512"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function () {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_x64 = C.x64;
		    var X64Word = C_x64.Word;
		    var X64WordArray = C_x64.WordArray;
		    var C_algo = C.algo;
		    var SHA512 = C_algo.SHA512;
	
		    /**
		     * SHA-384 hash algorithm.
		     */
		    var SHA384 = C_algo.SHA384 = SHA512.extend({
		        _doReset: function () {
		            this._hash = new X64WordArray.init([
		                new X64Word.init(0xcbbb9d5d, 0xc1059ed8), new X64Word.init(0x629a292a, 0x367cd507),
		                new X64Word.init(0x9159015a, 0x3070dd17), new X64Word.init(0x152fecd8, 0xf70e5939),
		                new X64Word.init(0x67332667, 0xffc00b31), new X64Word.init(0x8eb44a87, 0x68581511),
		                new X64Word.init(0xdb0c2e0d, 0x64f98fa7), new X64Word.init(0x47b5481d, 0xbefa4fa4)
		            ]);
		        },
	
		        _doFinalize: function () {
		            var hash = SHA512._doFinalize.call(this);
	
		            hash.sigBytes -= 16;
	
		            return hash;
		        }
		    });
	
		    /**
		     * Shortcut function to the hasher's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     *
		     * @return {WordArray} The hash.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hash = CryptoJS.SHA384('message');
		     *     var hash = CryptoJS.SHA384(wordArray);
		     */
		    C.SHA384 = SHA512._createHelper(SHA384);
	
		    /**
		     * Shortcut function to the HMAC's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     * @param {WordArray|string} key The secret key.
		     *
		     * @return {WordArray} The HMAC.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hmac = CryptoJS.HmacSHA384(message, key);
		     */
		    C.HmacSHA384 = SHA512._createHmacHelper(SHA384);
		}());
	
	
		return CryptoJS.SHA384;
	
	}));

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(43), __webpack_require__(44));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./x64-core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function (Math) {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var WordArray = C_lib.WordArray;
		    var Hasher = C_lib.Hasher;
		    var C_x64 = C.x64;
		    var X64Word = C_x64.Word;
		    var C_algo = C.algo;
	
		    // Constants tables
		    var RHO_OFFSETS = [];
		    var PI_INDEXES  = [];
		    var ROUND_CONSTANTS = [];
	
		    // Compute Constants
		    (function () {
		        // Compute rho offset constants
		        var x = 1, y = 0;
		        for (var t = 0; t < 24; t++) {
		            RHO_OFFSETS[x + 5 * y] = ((t + 1) * (t + 2) / 2) % 64;
	
		            var newX = y % 5;
		            var newY = (2 * x + 3 * y) % 5;
		            x = newX;
		            y = newY;
		        }
	
		        // Compute pi index constants
		        for (var x = 0; x < 5; x++) {
		            for (var y = 0; y < 5; y++) {
		                PI_INDEXES[x + 5 * y] = y + ((2 * x + 3 * y) % 5) * 5;
		            }
		        }
	
		        // Compute round constants
		        var LFSR = 0x01;
		        for (var i = 0; i < 24; i++) {
		            var roundConstantMsw = 0;
		            var roundConstantLsw = 0;
	
		            for (var j = 0; j < 7; j++) {
		                if (LFSR & 0x01) {
		                    var bitPosition = (1 << j) - 1;
		                    if (bitPosition < 32) {
		                        roundConstantLsw ^= 1 << bitPosition;
		                    } else /* if (bitPosition >= 32) */ {
		                        roundConstantMsw ^= 1 << (bitPosition - 32);
		                    }
		                }
	
		                // Compute next LFSR
		                if (LFSR & 0x80) {
		                    // Primitive polynomial over GF(2): x^8 + x^6 + x^5 + x^4 + 1
		                    LFSR = (LFSR << 1) ^ 0x71;
		                } else {
		                    LFSR <<= 1;
		                }
		            }
	
		            ROUND_CONSTANTS[i] = X64Word.create(roundConstantMsw, roundConstantLsw);
		        }
		    }());
	
		    // Reusable objects for temporary values
		    var T = [];
		    (function () {
		        for (var i = 0; i < 25; i++) {
		            T[i] = X64Word.create();
		        }
		    }());
	
		    /**
		     * SHA-3 hash algorithm.
		     */
		    var SHA3 = C_algo.SHA3 = Hasher.extend({
		        /**
		         * Configuration options.
		         *
		         * @property {number} outputLength
		         *   The desired number of bits in the output hash.
		         *   Only values permitted are: 224, 256, 384, 512.
		         *   Default: 512
		         */
		        cfg: Hasher.cfg.extend({
		            outputLength: 512
		        }),
	
		        _doReset: function () {
		            var state = this._state = []
		            for (var i = 0; i < 25; i++) {
		                state[i] = new X64Word.init();
		            }
	
		            this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
		        },
	
		        _doProcessBlock: function (M, offset) {
		            // Shortcuts
		            var state = this._state;
		            var nBlockSizeLanes = this.blockSize / 2;
	
		            // Absorb
		            for (var i = 0; i < nBlockSizeLanes; i++) {
		                // Shortcuts
		                var M2i  = M[offset + 2 * i];
		                var M2i1 = M[offset + 2 * i + 1];
	
		                // Swap endian
		                M2i = (
		                    (((M2i << 8)  | (M2i >>> 24)) & 0x00ff00ff) |
		                    (((M2i << 24) | (M2i >>> 8))  & 0xff00ff00)
		                );
		                M2i1 = (
		                    (((M2i1 << 8)  | (M2i1 >>> 24)) & 0x00ff00ff) |
		                    (((M2i1 << 24) | (M2i1 >>> 8))  & 0xff00ff00)
		                );
	
		                // Absorb message into state
		                var lane = state[i];
		                lane.high ^= M2i1;
		                lane.low  ^= M2i;
		            }
	
		            // Rounds
		            for (var round = 0; round < 24; round++) {
		                // Theta
		                for (var x = 0; x < 5; x++) {
		                    // Mix column lanes
		                    var tMsw = 0, tLsw = 0;
		                    for (var y = 0; y < 5; y++) {
		                        var lane = state[x + 5 * y];
		                        tMsw ^= lane.high;
		                        tLsw ^= lane.low;
		                    }
	
		                    // Temporary values
		                    var Tx = T[x];
		                    Tx.high = tMsw;
		                    Tx.low  = tLsw;
		                }
		                for (var x = 0; x < 5; x++) {
		                    // Shortcuts
		                    var Tx4 = T[(x + 4) % 5];
		                    var Tx1 = T[(x + 1) % 5];
		                    var Tx1Msw = Tx1.high;
		                    var Tx1Lsw = Tx1.low;
	
		                    // Mix surrounding columns
		                    var tMsw = Tx4.high ^ ((Tx1Msw << 1) | (Tx1Lsw >>> 31));
		                    var tLsw = Tx4.low  ^ ((Tx1Lsw << 1) | (Tx1Msw >>> 31));
		                    for (var y = 0; y < 5; y++) {
		                        var lane = state[x + 5 * y];
		                        lane.high ^= tMsw;
		                        lane.low  ^= tLsw;
		                    }
		                }
	
		                // Rho Pi
		                for (var laneIndex = 1; laneIndex < 25; laneIndex++) {
		                    // Shortcuts
		                    var lane = state[laneIndex];
		                    var laneMsw = lane.high;
		                    var laneLsw = lane.low;
		                    var rhoOffset = RHO_OFFSETS[laneIndex];
	
		                    // Rotate lanes
		                    if (rhoOffset < 32) {
		                        var tMsw = (laneMsw << rhoOffset) | (laneLsw >>> (32 - rhoOffset));
		                        var tLsw = (laneLsw << rhoOffset) | (laneMsw >>> (32 - rhoOffset));
		                    } else /* if (rhoOffset >= 32) */ {
		                        var tMsw = (laneLsw << (rhoOffset - 32)) | (laneMsw >>> (64 - rhoOffset));
		                        var tLsw = (laneMsw << (rhoOffset - 32)) | (laneLsw >>> (64 - rhoOffset));
		                    }
	
		                    // Transpose lanes
		                    var TPiLane = T[PI_INDEXES[laneIndex]];
		                    TPiLane.high = tMsw;
		                    TPiLane.low  = tLsw;
		                }
	
		                // Rho pi at x = y = 0
		                var T0 = T[0];
		                var state0 = state[0];
		                T0.high = state0.high;
		                T0.low  = state0.low;
	
		                // Chi
		                for (var x = 0; x < 5; x++) {
		                    for (var y = 0; y < 5; y++) {
		                        // Shortcuts
		                        var laneIndex = x + 5 * y;
		                        var lane = state[laneIndex];
		                        var TLane = T[laneIndex];
		                        var Tx1Lane = T[((x + 1) % 5) + 5 * y];
		                        var Tx2Lane = T[((x + 2) % 5) + 5 * y];
	
		                        // Mix rows
		                        lane.high = TLane.high ^ (~Tx1Lane.high & Tx2Lane.high);
		                        lane.low  = TLane.low  ^ (~Tx1Lane.low  & Tx2Lane.low);
		                    }
		                }
	
		                // Iota
		                var lane = state[0];
		                var roundConstant = ROUND_CONSTANTS[round];
		                lane.high ^= roundConstant.high;
		                lane.low  ^= roundConstant.low;;
		            }
		        },
	
		        _doFinalize: function () {
		            // Shortcuts
		            var data = this._data;
		            var dataWords = data.words;
		            var nBitsTotal = this._nDataBytes * 8;
		            var nBitsLeft = data.sigBytes * 8;
		            var blockSizeBits = this.blockSize * 32;
	
		            // Add padding
		            dataWords[nBitsLeft >>> 5] |= 0x1 << (24 - nBitsLeft % 32);
		            dataWords[((Math.ceil((nBitsLeft + 1) / blockSizeBits) * blockSizeBits) >>> 5) - 1] |= 0x80;
		            data.sigBytes = dataWords.length * 4;
	
		            // Hash final blocks
		            this._process();
	
		            // Shortcuts
		            var state = this._state;
		            var outputLengthBytes = this.cfg.outputLength / 8;
		            var outputLengthLanes = outputLengthBytes / 8;
	
		            // Squeeze
		            var hashWords = [];
		            for (var i = 0; i < outputLengthLanes; i++) {
		                // Shortcuts
		                var lane = state[i];
		                var laneMsw = lane.high;
		                var laneLsw = lane.low;
	
		                // Swap endian
		                laneMsw = (
		                    (((laneMsw << 8)  | (laneMsw >>> 24)) & 0x00ff00ff) |
		                    (((laneMsw << 24) | (laneMsw >>> 8))  & 0xff00ff00)
		                );
		                laneLsw = (
		                    (((laneLsw << 8)  | (laneLsw >>> 24)) & 0x00ff00ff) |
		                    (((laneLsw << 24) | (laneLsw >>> 8))  & 0xff00ff00)
		                );
	
		                // Squeeze state to retrieve hash
		                hashWords.push(laneLsw);
		                hashWords.push(laneMsw);
		            }
	
		            // Return final computed hash
		            return new WordArray.init(hashWords, outputLengthBytes);
		        },
	
		        clone: function () {
		            var clone = Hasher.clone.call(this);
	
		            var state = clone._state = this._state.slice(0);
		            for (var i = 0; i < 25; i++) {
		                state[i] = state[i].clone();
		            }
	
		            return clone;
		        }
		    });
	
		    /**
		     * Shortcut function to the hasher's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     *
		     * @return {WordArray} The hash.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hash = CryptoJS.SHA3('message');
		     *     var hash = CryptoJS.SHA3(wordArray);
		     */
		    C.SHA3 = Hasher._createHelper(SHA3);
	
		    /**
		     * Shortcut function to the HMAC's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     * @param {WordArray|string} key The secret key.
		     *
		     * @return {WordArray} The HMAC.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hmac = CryptoJS.HmacSHA3(message, key);
		     */
		    C.HmacSHA3 = Hasher._createHmacHelper(SHA3);
		}(Math));
	
	
		return CryptoJS.SHA3;
	
	}));

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	;(function (root, factory) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(43));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		/** @preserve
		(c) 2012 by Cédric Mesnil. All rights reserved.
	
		Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
	
		    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
		    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
	
		THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
		*/
	
		(function (Math) {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var WordArray = C_lib.WordArray;
		    var Hasher = C_lib.Hasher;
		    var C_algo = C.algo;
	
		    // Constants table
		    var _zl = WordArray.create([
		        0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15,
		        7,  4, 13,  1, 10,  6, 15,  3, 12,  0,  9,  5,  2, 14, 11,  8,
		        3, 10, 14,  4,  9, 15,  8,  1,  2,  7,  0,  6, 13, 11,  5, 12,
		        1,  9, 11, 10,  0,  8, 12,  4, 13,  3,  7, 15, 14,  5,  6,  2,
		        4,  0,  5,  9,  7, 12,  2, 10, 14,  1,  3,  8, 11,  6, 15, 13]);
		    var _zr = WordArray.create([
		        5, 14,  7,  0,  9,  2, 11,  4, 13,  6, 15,  8,  1, 10,  3, 12,
		        6, 11,  3,  7,  0, 13,  5, 10, 14, 15,  8, 12,  4,  9,  1,  2,
		        15,  5,  1,  3,  7, 14,  6,  9, 11,  8, 12,  2, 10,  0,  4, 13,
		        8,  6,  4,  1,  3, 11, 15,  0,  5, 12,  2, 13,  9,  7, 10, 14,
		        12, 15, 10,  4,  1,  5,  8,  7,  6,  2, 13, 14,  0,  3,  9, 11]);
		    var _sl = WordArray.create([
		         11, 14, 15, 12,  5,  8,  7,  9, 11, 13, 14, 15,  6,  7,  9,  8,
		        7, 6,   8, 13, 11,  9,  7, 15,  7, 12, 15,  9, 11,  7, 13, 12,
		        11, 13,  6,  7, 14,  9, 13, 15, 14,  8, 13,  6,  5, 12,  7,  5,
		          11, 12, 14, 15, 14, 15,  9,  8,  9, 14,  5,  6,  8,  6,  5, 12,
		        9, 15,  5, 11,  6,  8, 13, 12,  5, 12, 13, 14, 11,  8,  5,  6 ]);
		    var _sr = WordArray.create([
		        8,  9,  9, 11, 13, 15, 15,  5,  7,  7,  8, 11, 14, 14, 12,  6,
		        9, 13, 15,  7, 12,  8,  9, 11,  7,  7, 12,  7,  6, 15, 13, 11,
		        9,  7, 15, 11,  8,  6,  6, 14, 12, 13,  5, 14, 13, 13,  7,  5,
		        15,  5,  8, 11, 14, 14,  6, 14,  6,  9, 12,  9, 12,  5, 15,  8,
		        8,  5, 12,  9, 12,  5, 14,  6,  8, 13,  6,  5, 15, 13, 11, 11 ]);
	
		    var _hl =  WordArray.create([ 0x00000000, 0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xA953FD4E]);
		    var _hr =  WordArray.create([ 0x50A28BE6, 0x5C4DD124, 0x6D703EF3, 0x7A6D76E9, 0x00000000]);
	
		    /**
		     * RIPEMD160 hash algorithm.
		     */
		    var RIPEMD160 = C_algo.RIPEMD160 = Hasher.extend({
		        _doReset: function () {
		            this._hash  = WordArray.create([0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0]);
		        },
	
		        _doProcessBlock: function (M, offset) {
	
		            // Swap endian
		            for (var i = 0; i < 16; i++) {
		                // Shortcuts
		                var offset_i = offset + i;
		                var M_offset_i = M[offset_i];
	
		                // Swap
		                M[offset_i] = (
		                    (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
		                    (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
		                );
		            }
		            // Shortcut
		            var H  = this._hash.words;
		            var hl = _hl.words;
		            var hr = _hr.words;
		            var zl = _zl.words;
		            var zr = _zr.words;
		            var sl = _sl.words;
		            var sr = _sr.words;
	
		            // Working variables
		            var al, bl, cl, dl, el;
		            var ar, br, cr, dr, er;
	
		            ar = al = H[0];
		            br = bl = H[1];
		            cr = cl = H[2];
		            dr = dl = H[3];
		            er = el = H[4];
		            // Computation
		            var t;
		            for (var i = 0; i < 80; i += 1) {
		                t = (al +  M[offset+zl[i]])|0;
		                if (i<16){
			            t +=  f1(bl,cl,dl) + hl[0];
		                } else if (i<32) {
			            t +=  f2(bl,cl,dl) + hl[1];
		                } else if (i<48) {
			            t +=  f3(bl,cl,dl) + hl[2];
		                } else if (i<64) {
			            t +=  f4(bl,cl,dl) + hl[3];
		                } else {// if (i<80) {
			            t +=  f5(bl,cl,dl) + hl[4];
		                }
		                t = t|0;
		                t =  rotl(t,sl[i]);
		                t = (t+el)|0;
		                al = el;
		                el = dl;
		                dl = rotl(cl, 10);
		                cl = bl;
		                bl = t;
	
		                t = (ar + M[offset+zr[i]])|0;
		                if (i<16){
			            t +=  f5(br,cr,dr) + hr[0];
		                } else if (i<32) {
			            t +=  f4(br,cr,dr) + hr[1];
		                } else if (i<48) {
			            t +=  f3(br,cr,dr) + hr[2];
		                } else if (i<64) {
			            t +=  f2(br,cr,dr) + hr[3];
		                } else {// if (i<80) {
			            t +=  f1(br,cr,dr) + hr[4];
		                }
		                t = t|0;
		                t =  rotl(t,sr[i]) ;
		                t = (t+er)|0;
		                ar = er;
		                er = dr;
		                dr = rotl(cr, 10);
		                cr = br;
		                br = t;
		            }
		            // Intermediate hash value
		            t    = (H[1] + cl + dr)|0;
		            H[1] = (H[2] + dl + er)|0;
		            H[2] = (H[3] + el + ar)|0;
		            H[3] = (H[4] + al + br)|0;
		            H[4] = (H[0] + bl + cr)|0;
		            H[0] =  t;
		        },
	
		        _doFinalize: function () {
		            // Shortcuts
		            var data = this._data;
		            var dataWords = data.words;
	
		            var nBitsTotal = this._nDataBytes * 8;
		            var nBitsLeft = data.sigBytes * 8;
	
		            // Add padding
		            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
		            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
		                (((nBitsTotal << 8)  | (nBitsTotal >>> 24)) & 0x00ff00ff) |
		                (((nBitsTotal << 24) | (nBitsTotal >>> 8))  & 0xff00ff00)
		            );
		            data.sigBytes = (dataWords.length + 1) * 4;
	
		            // Hash final blocks
		            this._process();
	
		            // Shortcuts
		            var hash = this._hash;
		            var H = hash.words;
	
		            // Swap endian
		            for (var i = 0; i < 5; i++) {
		                // Shortcut
		                var H_i = H[i];
	
		                // Swap
		                H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
		                       (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
		            }
	
		            // Return final computed hash
		            return hash;
		        },
	
		        clone: function () {
		            var clone = Hasher.clone.call(this);
		            clone._hash = this._hash.clone();
	
		            return clone;
		        }
		    });
	
	
		    function f1(x, y, z) {
		        return ((x) ^ (y) ^ (z));
	
		    }
	
		    function f2(x, y, z) {
		        return (((x)&(y)) | ((~x)&(z)));
		    }
	
		    function f3(x, y, z) {
		        return (((x) | (~(y))) ^ (z));
		    }
	
		    function f4(x, y, z) {
		        return (((x) & (z)) | ((y)&(~(z))));
		    }
	
		    function f5(x, y, z) {
		        return ((x) ^ ((y) |(~(z))));
	
		    }
	
		    function rotl(x,n) {
		        return (x<<n) | (x>>>(32-n));
		    }
	
	
		    /**
		     * Shortcut function to the hasher's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     *
		     * @return {WordArray} The hash.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hash = CryptoJS.RIPEMD160('message');
		     *     var hash = CryptoJS.RIPEMD160(wordArray);
		     */
		    C.RIPEMD160 = Hasher._createHelper(RIPEMD160);
	
		    /**
		     * Shortcut function to the HMAC's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     * @param {WordArray|string} key The secret key.
		     *
		     * @return {WordArray} The HMAC.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hmac = CryptoJS.HmacRIPEMD160(message, key);
		     */
		    C.HmacRIPEMD160 = Hasher._createHmacHelper(RIPEMD160);
		}(Math));
	
	
		return CryptoJS.RIPEMD160;
	
	}));

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

	;(function (root, factory) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(43));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function () {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var Base = C_lib.Base;
		    var C_enc = C.enc;
		    var Utf8 = C_enc.Utf8;
		    var C_algo = C.algo;
	
		    /**
		     * HMAC algorithm.
		     */
		    var HMAC = C_algo.HMAC = Base.extend({
		        /**
		         * Initializes a newly created HMAC.
		         *
		         * @param {Hasher} hasher The hash algorithm to use.
		         * @param {WordArray|string} key The secret key.
		         *
		         * @example
		         *
		         *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
		         */
		        init: function (hasher, key) {
		            // Init hasher
		            hasher = this._hasher = new hasher.init();
	
		            // Convert string to WordArray, else assume WordArray already
		            if (typeof key == 'string') {
		                key = Utf8.parse(key);
		            }
	
		            // Shortcuts
		            var hasherBlockSize = hasher.blockSize;
		            var hasherBlockSizeBytes = hasherBlockSize * 4;
	
		            // Allow arbitrary length keys
		            if (key.sigBytes > hasherBlockSizeBytes) {
		                key = hasher.finalize(key);
		            }
	
		            // Clamp excess bits
		            key.clamp();
	
		            // Clone key for inner and outer pads
		            var oKey = this._oKey = key.clone();
		            var iKey = this._iKey = key.clone();
	
		            // Shortcuts
		            var oKeyWords = oKey.words;
		            var iKeyWords = iKey.words;
	
		            // XOR keys with pad constants
		            for (var i = 0; i < hasherBlockSize; i++) {
		                oKeyWords[i] ^= 0x5c5c5c5c;
		                iKeyWords[i] ^= 0x36363636;
		            }
		            oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;
	
		            // Set initial values
		            this.reset();
		        },
	
		        /**
		         * Resets this HMAC to its initial state.
		         *
		         * @example
		         *
		         *     hmacHasher.reset();
		         */
		        reset: function () {
		            // Shortcut
		            var hasher = this._hasher;
	
		            // Reset
		            hasher.reset();
		            hasher.update(this._iKey);
		        },
	
		        /**
		         * Updates this HMAC with a message.
		         *
		         * @param {WordArray|string} messageUpdate The message to append.
		         *
		         * @return {HMAC} This HMAC instance.
		         *
		         * @example
		         *
		         *     hmacHasher.update('message');
		         *     hmacHasher.update(wordArray);
		         */
		        update: function (messageUpdate) {
		            this._hasher.update(messageUpdate);
	
		            // Chainable
		            return this;
		        },
	
		        /**
		         * Finalizes the HMAC computation.
		         * Note that the finalize operation is effectively a destructive, read-once operation.
		         *
		         * @param {WordArray|string} messageUpdate (Optional) A final message update.
		         *
		         * @return {WordArray} The HMAC.
		         *
		         * @example
		         *
		         *     var hmac = hmacHasher.finalize();
		         *     var hmac = hmacHasher.finalize('message');
		         *     var hmac = hmacHasher.finalize(wordArray);
		         */
		        finalize: function (messageUpdate) {
		            // Shortcut
		            var hasher = this._hasher;
	
		            // Compute HMAC
		            var innerHash = hasher.finalize(messageUpdate);
		            hasher.reset();
		            var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));
	
		            return hmac;
		        }
		    });
		}());
	
	
	}));

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(43), __webpack_require__(49), __webpack_require__(56));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./sha1", "./hmac"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function () {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var Base = C_lib.Base;
		    var WordArray = C_lib.WordArray;
		    var C_algo = C.algo;
		    var SHA1 = C_algo.SHA1;
		    var HMAC = C_algo.HMAC;
	
		    /**
		     * Password-Based Key Derivation Function 2 algorithm.
		     */
		    var PBKDF2 = C_algo.PBKDF2 = Base.extend({
		        /**
		         * Configuration options.
		         *
		         * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
		         * @property {Hasher} hasher The hasher to use. Default: SHA1
		         * @property {number} iterations The number of iterations to perform. Default: 1
		         */
		        cfg: Base.extend({
		            keySize: 128/32,
		            hasher: SHA1,
		            iterations: 1
		        }),
	
		        /**
		         * Initializes a newly created key derivation function.
		         *
		         * @param {Object} cfg (Optional) The configuration options to use for the derivation.
		         *
		         * @example
		         *
		         *     var kdf = CryptoJS.algo.PBKDF2.create();
		         *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8 });
		         *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, iterations: 1000 });
		         */
		        init: function (cfg) {
		            this.cfg = this.cfg.extend(cfg);
		        },
	
		        /**
		         * Computes the Password-Based Key Derivation Function 2.
		         *
		         * @param {WordArray|string} password The password.
		         * @param {WordArray|string} salt A salt.
		         *
		         * @return {WordArray} The derived key.
		         *
		         * @example
		         *
		         *     var key = kdf.compute(password, salt);
		         */
		        compute: function (password, salt) {
		            // Shortcut
		            var cfg = this.cfg;
	
		            // Init HMAC
		            var hmac = HMAC.create(cfg.hasher, password);
	
		            // Initial values
		            var derivedKey = WordArray.create();
		            var blockIndex = WordArray.create([0x00000001]);
	
		            // Shortcuts
		            var derivedKeyWords = derivedKey.words;
		            var blockIndexWords = blockIndex.words;
		            var keySize = cfg.keySize;
		            var iterations = cfg.iterations;
	
		            // Generate key
		            while (derivedKeyWords.length < keySize) {
		                var block = hmac.update(salt).finalize(blockIndex);
		                hmac.reset();
	
		                // Shortcuts
		                var blockWords = block.words;
		                var blockWordsLength = blockWords.length;
	
		                // Iterations
		                var intermediate = block;
		                for (var i = 1; i < iterations; i++) {
		                    intermediate = hmac.finalize(intermediate);
		                    hmac.reset();
	
		                    // Shortcut
		                    var intermediateWords = intermediate.words;
	
		                    // XOR intermediate with block
		                    for (var j = 0; j < blockWordsLength; j++) {
		                        blockWords[j] ^= intermediateWords[j];
		                    }
		                }
	
		                derivedKey.concat(block);
		                blockIndexWords[0]++;
		            }
		            derivedKey.sigBytes = keySize * 4;
	
		            return derivedKey;
		        }
		    });
	
		    /**
		     * Computes the Password-Based Key Derivation Function 2.
		     *
		     * @param {WordArray|string} password The password.
		     * @param {WordArray|string} salt A salt.
		     * @param {Object} cfg (Optional) The configuration options to use for this computation.
		     *
		     * @return {WordArray} The derived key.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var key = CryptoJS.PBKDF2(password, salt);
		     *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8 });
		     *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8, iterations: 1000 });
		     */
		    C.PBKDF2 = function (password, salt, cfg) {
		        return PBKDF2.create(cfg).compute(password, salt);
		    };
		}());
	
	
		return CryptoJS.PBKDF2;
	
	}));

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(43), __webpack_require__(49), __webpack_require__(56));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./sha1", "./hmac"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function () {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var Base = C_lib.Base;
		    var WordArray = C_lib.WordArray;
		    var C_algo = C.algo;
		    var MD5 = C_algo.MD5;
	
		    /**
		     * This key derivation function is meant to conform with EVP_BytesToKey.
		     * www.openssl.org/docs/crypto/EVP_BytesToKey.html
		     */
		    var EvpKDF = C_algo.EvpKDF = Base.extend({
		        /**
		         * Configuration options.
		         *
		         * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
		         * @property {Hasher} hasher The hash algorithm to use. Default: MD5
		         * @property {number} iterations The number of iterations to perform. Default: 1
		         */
		        cfg: Base.extend({
		            keySize: 128/32,
		            hasher: MD5,
		            iterations: 1
		        }),
	
		        /**
		         * Initializes a newly created key derivation function.
		         *
		         * @param {Object} cfg (Optional) The configuration options to use for the derivation.
		         *
		         * @example
		         *
		         *     var kdf = CryptoJS.algo.EvpKDF.create();
		         *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
		         *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
		         */
		        init: function (cfg) {
		            this.cfg = this.cfg.extend(cfg);
		        },
	
		        /**
		         * Derives a key from a password.
		         *
		         * @param {WordArray|string} password The password.
		         * @param {WordArray|string} salt A salt.
		         *
		         * @return {WordArray} The derived key.
		         *
		         * @example
		         *
		         *     var key = kdf.compute(password, salt);
		         */
		        compute: function (password, salt) {
		            // Shortcut
		            var cfg = this.cfg;
	
		            // Init hasher
		            var hasher = cfg.hasher.create();
	
		            // Initial values
		            var derivedKey = WordArray.create();
	
		            // Shortcuts
		            var derivedKeyWords = derivedKey.words;
		            var keySize = cfg.keySize;
		            var iterations = cfg.iterations;
	
		            // Generate key
		            while (derivedKeyWords.length < keySize) {
		                if (block) {
		                    hasher.update(block);
		                }
		                var block = hasher.update(password).finalize(salt);
		                hasher.reset();
	
		                // Iterations
		                for (var i = 1; i < iterations; i++) {
		                    block = hasher.finalize(block);
		                    hasher.reset();
		                }
	
		                derivedKey.concat(block);
		            }
		            derivedKey.sigBytes = keySize * 4;
	
		            return derivedKey;
		        }
		    });
	
		    /**
		     * Derives a key from a password.
		     *
		     * @param {WordArray|string} password The password.
		     * @param {WordArray|string} salt A salt.
		     * @param {Object} cfg (Optional) The configuration options to use for this computation.
		     *
		     * @return {WordArray} The derived key.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var key = CryptoJS.EvpKDF(password, salt);
		     *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8 });
		     *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8, iterations: 1000 });
		     */
		    C.EvpKDF = function (password, salt, cfg) {
		        return EvpKDF.create(cfg).compute(password, salt);
		    };
		}());
	
	
		return CryptoJS.EvpKDF;
	
	}));

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(43), __webpack_require__(58));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./evpkdf"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		/**
		 * Cipher core components.
		 */
		CryptoJS.lib.Cipher || (function (undefined) {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var Base = C_lib.Base;
		    var WordArray = C_lib.WordArray;
		    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
		    var C_enc = C.enc;
		    var Utf8 = C_enc.Utf8;
		    var Base64 = C_enc.Base64;
		    var C_algo = C.algo;
		    var EvpKDF = C_algo.EvpKDF;
	
		    /**
		     * Abstract base cipher template.
		     *
		     * @property {number} keySize This cipher's key size. Default: 4 (128 bits)
		     * @property {number} ivSize This cipher's IV size. Default: 4 (128 bits)
		     * @property {number} _ENC_XFORM_MODE A constant representing encryption mode.
		     * @property {number} _DEC_XFORM_MODE A constant representing decryption mode.
		     */
		    var Cipher = C_lib.Cipher = BufferedBlockAlgorithm.extend({
		        /**
		         * Configuration options.
		         *
		         * @property {WordArray} iv The IV to use for this operation.
		         */
		        cfg: Base.extend(),
	
		        /**
		         * Creates this cipher in encryption mode.
		         *
		         * @param {WordArray} key The key.
		         * @param {Object} cfg (Optional) The configuration options to use for this operation.
		         *
		         * @return {Cipher} A cipher instance.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
		         */
		        createEncryptor: function (key, cfg) {
		            return this.create(this._ENC_XFORM_MODE, key, cfg);
		        },
	
		        /**
		         * Creates this cipher in decryption mode.
		         *
		         * @param {WordArray} key The key.
		         * @param {Object} cfg (Optional) The configuration options to use for this operation.
		         *
		         * @return {Cipher} A cipher instance.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
		         */
		        createDecryptor: function (key, cfg) {
		            return this.create(this._DEC_XFORM_MODE, key, cfg);
		        },
	
		        /**
		         * Initializes a newly created cipher.
		         *
		         * @param {number} xformMode Either the encryption or decryption transormation mode constant.
		         * @param {WordArray} key The key.
		         * @param {Object} cfg (Optional) The configuration options to use for this operation.
		         *
		         * @example
		         *
		         *     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
		         */
		        init: function (xformMode, key, cfg) {
		            // Apply config defaults
		            this.cfg = this.cfg.extend(cfg);
	
		            // Store transform mode and key
		            this._xformMode = xformMode;
		            this._key = key;
	
		            // Set initial values
		            this.reset();
		        },
	
		        /**
		         * Resets this cipher to its initial state.
		         *
		         * @example
		         *
		         *     cipher.reset();
		         */
		        reset: function () {
		            // Reset data buffer
		            BufferedBlockAlgorithm.reset.call(this);
	
		            // Perform concrete-cipher logic
		            this._doReset();
		        },
	
		        /**
		         * Adds data to be encrypted or decrypted.
		         *
		         * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
		         *
		         * @return {WordArray} The data after processing.
		         *
		         * @example
		         *
		         *     var encrypted = cipher.process('data');
		         *     var encrypted = cipher.process(wordArray);
		         */
		        process: function (dataUpdate) {
		            // Append
		            this._append(dataUpdate);
	
		            // Process available blocks
		            return this._process();
		        },
	
		        /**
		         * Finalizes the encryption or decryption process.
		         * Note that the finalize operation is effectively a destructive, read-once operation.
		         *
		         * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
		         *
		         * @return {WordArray} The data after final processing.
		         *
		         * @example
		         *
		         *     var encrypted = cipher.finalize();
		         *     var encrypted = cipher.finalize('data');
		         *     var encrypted = cipher.finalize(wordArray);
		         */
		        finalize: function (dataUpdate) {
		            // Final data update
		            if (dataUpdate) {
		                this._append(dataUpdate);
		            }
	
		            // Perform concrete-cipher logic
		            var finalProcessedData = this._doFinalize();
	
		            return finalProcessedData;
		        },
	
		        keySize: 128/32,
	
		        ivSize: 128/32,
	
		        _ENC_XFORM_MODE: 1,
	
		        _DEC_XFORM_MODE: 2,
	
		        /**
		         * Creates shortcut functions to a cipher's object interface.
		         *
		         * @param {Cipher} cipher The cipher to create a helper for.
		         *
		         * @return {Object} An object with encrypt and decrypt shortcut functions.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
		         */
		        _createHelper: (function () {
		            function selectCipherStrategy(key) {
		                if (typeof key == 'string') {
		                    return PasswordBasedCipher;
		                } else {
		                    return SerializableCipher;
		                }
		            }
	
		            return function (cipher) {
		                return {
		                    encrypt: function (message, key, cfg) {
		                        return selectCipherStrategy(key).encrypt(cipher, message, key, cfg);
		                    },
	
		                    decrypt: function (ciphertext, key, cfg) {
		                        return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
		                    }
		                };
		            };
		        }())
		    });
	
		    /**
		     * Abstract base stream cipher template.
		     *
		     * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 1 (32 bits)
		     */
		    var StreamCipher = C_lib.StreamCipher = Cipher.extend({
		        _doFinalize: function () {
		            // Process partial blocks
		            var finalProcessedBlocks = this._process(!!'flush');
	
		            return finalProcessedBlocks;
		        },
	
		        blockSize: 1
		    });
	
		    /**
		     * Mode namespace.
		     */
		    var C_mode = C.mode = {};
	
		    /**
		     * Abstract base block cipher mode template.
		     */
		    var BlockCipherMode = C_lib.BlockCipherMode = Base.extend({
		        /**
		         * Creates this mode for encryption.
		         *
		         * @param {Cipher} cipher A block cipher instance.
		         * @param {Array} iv The IV words.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
		         */
		        createEncryptor: function (cipher, iv) {
		            return this.Encryptor.create(cipher, iv);
		        },
	
		        /**
		         * Creates this mode for decryption.
		         *
		         * @param {Cipher} cipher A block cipher instance.
		         * @param {Array} iv The IV words.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
		         */
		        createDecryptor: function (cipher, iv) {
		            return this.Decryptor.create(cipher, iv);
		        },
	
		        /**
		         * Initializes a newly created mode.
		         *
		         * @param {Cipher} cipher A block cipher instance.
		         * @param {Array} iv The IV words.
		         *
		         * @example
		         *
		         *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
		         */
		        init: function (cipher, iv) {
		            this._cipher = cipher;
		            this._iv = iv;
		        }
		    });
	
		    /**
		     * Cipher Block Chaining mode.
		     */
		    var CBC = C_mode.CBC = (function () {
		        /**
		         * Abstract base CBC mode.
		         */
		        var CBC = BlockCipherMode.extend();
	
		        /**
		         * CBC encryptor.
		         */
		        CBC.Encryptor = CBC.extend({
		            /**
		             * Processes the data block at offset.
		             *
		             * @param {Array} words The data words to operate on.
		             * @param {number} offset The offset where the block starts.
		             *
		             * @example
		             *
		             *     mode.processBlock(data.words, offset);
		             */
		            processBlock: function (words, offset) {
		                // Shortcuts
		                var cipher = this._cipher;
		                var blockSize = cipher.blockSize;
	
		                // XOR and encrypt
		                xorBlock.call(this, words, offset, blockSize);
		                cipher.encryptBlock(words, offset);
	
		                // Remember this block to use with next block
		                this._prevBlock = words.slice(offset, offset + blockSize);
		            }
		        });
	
		        /**
		         * CBC decryptor.
		         */
		        CBC.Decryptor = CBC.extend({
		            /**
		             * Processes the data block at offset.
		             *
		             * @param {Array} words The data words to operate on.
		             * @param {number} offset The offset where the block starts.
		             *
		             * @example
		             *
		             *     mode.processBlock(data.words, offset);
		             */
		            processBlock: function (words, offset) {
		                // Shortcuts
		                var cipher = this._cipher;
		                var blockSize = cipher.blockSize;
	
		                // Remember this block to use with next block
		                var thisBlock = words.slice(offset, offset + blockSize);
	
		                // Decrypt and XOR
		                cipher.decryptBlock(words, offset);
		                xorBlock.call(this, words, offset, blockSize);
	
		                // This block becomes the previous block
		                this._prevBlock = thisBlock;
		            }
		        });
	
		        function xorBlock(words, offset, blockSize) {
		            // Shortcut
		            var iv = this._iv;
	
		            // Choose mixing block
		            if (iv) {
		                var block = iv;
	
		                // Remove IV for subsequent blocks
		                this._iv = undefined;
		            } else {
		                var block = this._prevBlock;
		            }
	
		            // XOR blocks
		            for (var i = 0; i < blockSize; i++) {
		                words[offset + i] ^= block[i];
		            }
		        }
	
		        return CBC;
		    }());
	
		    /**
		     * Padding namespace.
		     */
		    var C_pad = C.pad = {};
	
		    /**
		     * PKCS #5/7 padding strategy.
		     */
		    var Pkcs7 = C_pad.Pkcs7 = {
		        /**
		         * Pads data using the algorithm defined in PKCS #5/7.
		         *
		         * @param {WordArray} data The data to pad.
		         * @param {number} blockSize The multiple that the data should be padded to.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
		         */
		        pad: function (data, blockSize) {
		            // Shortcut
		            var blockSizeBytes = blockSize * 4;
	
		            // Count padding bytes
		            var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;
	
		            // Create padding word
		            var paddingWord = (nPaddingBytes << 24) | (nPaddingBytes << 16) | (nPaddingBytes << 8) | nPaddingBytes;
	
		            // Create padding
		            var paddingWords = [];
		            for (var i = 0; i < nPaddingBytes; i += 4) {
		                paddingWords.push(paddingWord);
		            }
		            var padding = WordArray.create(paddingWords, nPaddingBytes);
	
		            // Add padding
		            data.concat(padding);
		        },
	
		        /**
		         * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
		         *
		         * @param {WordArray} data The data to unpad.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     CryptoJS.pad.Pkcs7.unpad(wordArray);
		         */
		        unpad: function (data) {
		            // Get number of padding bytes from last byte
		            var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;
	
		            // Remove padding
		            data.sigBytes -= nPaddingBytes;
		        }
		    };
	
		    /**
		     * Abstract base block cipher template.
		     *
		     * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 4 (128 bits)
		     */
		    var BlockCipher = C_lib.BlockCipher = Cipher.extend({
		        /**
		         * Configuration options.
		         *
		         * @property {Mode} mode The block mode to use. Default: CBC
		         * @property {Padding} padding The padding strategy to use. Default: Pkcs7
		         */
		        cfg: Cipher.cfg.extend({
		            mode: CBC,
		            padding: Pkcs7
		        }),
	
		        reset: function () {
		            // Reset cipher
		            Cipher.reset.call(this);
	
		            // Shortcuts
		            var cfg = this.cfg;
		            var iv = cfg.iv;
		            var mode = cfg.mode;
	
		            // Reset block mode
		            if (this._xformMode == this._ENC_XFORM_MODE) {
		                var modeCreator = mode.createEncryptor;
		            } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
		                var modeCreator = mode.createDecryptor;
		                // Keep at least one block in the buffer for unpadding
		                this._minBufferSize = 1;
		            }
	
		            if (this._mode && this._mode.__creator == modeCreator) {
		                this._mode.init(this, iv && iv.words);
		            } else {
		                this._mode = modeCreator.call(mode, this, iv && iv.words);
		                this._mode.__creator = modeCreator;
		            }
		        },
	
		        _doProcessBlock: function (words, offset) {
		            this._mode.processBlock(words, offset);
		        },
	
		        _doFinalize: function () {
		            // Shortcut
		            var padding = this.cfg.padding;
	
		            // Finalize
		            if (this._xformMode == this._ENC_XFORM_MODE) {
		                // Pad data
		                padding.pad(this._data, this.blockSize);
	
		                // Process final blocks
		                var finalProcessedBlocks = this._process(!!'flush');
		            } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
		                // Process final blocks
		                var finalProcessedBlocks = this._process(!!'flush');
	
		                // Unpad data
		                padding.unpad(finalProcessedBlocks);
		            }
	
		            return finalProcessedBlocks;
		        },
	
		        blockSize: 128/32
		    });
	
		    /**
		     * A collection of cipher parameters.
		     *
		     * @property {WordArray} ciphertext The raw ciphertext.
		     * @property {WordArray} key The key to this ciphertext.
		     * @property {WordArray} iv The IV used in the ciphering operation.
		     * @property {WordArray} salt The salt used with a key derivation function.
		     * @property {Cipher} algorithm The cipher algorithm.
		     * @property {Mode} mode The block mode used in the ciphering operation.
		     * @property {Padding} padding The padding scheme used in the ciphering operation.
		     * @property {number} blockSize The block size of the cipher.
		     * @property {Format} formatter The default formatting strategy to convert this cipher params object to a string.
		     */
		    var CipherParams = C_lib.CipherParams = Base.extend({
		        /**
		         * Initializes a newly created cipher params object.
		         *
		         * @param {Object} cipherParams An object with any of the possible cipher parameters.
		         *
		         * @example
		         *
		         *     var cipherParams = CryptoJS.lib.CipherParams.create({
		         *         ciphertext: ciphertextWordArray,
		         *         key: keyWordArray,
		         *         iv: ivWordArray,
		         *         salt: saltWordArray,
		         *         algorithm: CryptoJS.algo.AES,
		         *         mode: CryptoJS.mode.CBC,
		         *         padding: CryptoJS.pad.PKCS7,
		         *         blockSize: 4,
		         *         formatter: CryptoJS.format.OpenSSL
		         *     });
		         */
		        init: function (cipherParams) {
		            this.mixIn(cipherParams);
		        },
	
		        /**
		         * Converts this cipher params object to a string.
		         *
		         * @param {Format} formatter (Optional) The formatting strategy to use.
		         *
		         * @return {string} The stringified cipher params.
		         *
		         * @throws Error If neither the formatter nor the default formatter is set.
		         *
		         * @example
		         *
		         *     var string = cipherParams + '';
		         *     var string = cipherParams.toString();
		         *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
		         */
		        toString: function (formatter) {
		            return (formatter || this.formatter).stringify(this);
		        }
		    });
	
		    /**
		     * Format namespace.
		     */
		    var C_format = C.format = {};
	
		    /**
		     * OpenSSL formatting strategy.
		     */
		    var OpenSSLFormatter = C_format.OpenSSL = {
		        /**
		         * Converts a cipher params object to an OpenSSL-compatible string.
		         *
		         * @param {CipherParams} cipherParams The cipher params object.
		         *
		         * @return {string} The OpenSSL-compatible string.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
		         */
		        stringify: function (cipherParams) {
		            // Shortcuts
		            var ciphertext = cipherParams.ciphertext;
		            var salt = cipherParams.salt;
	
		            // Format
		            if (salt) {
		                var wordArray = WordArray.create([0x53616c74, 0x65645f5f]).concat(salt).concat(ciphertext);
		            } else {
		                var wordArray = ciphertext;
		            }
	
		            return wordArray.toString(Base64);
		        },
	
		        /**
		         * Converts an OpenSSL-compatible string to a cipher params object.
		         *
		         * @param {string} openSSLStr The OpenSSL-compatible string.
		         *
		         * @return {CipherParams} The cipher params object.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
		         */
		        parse: function (openSSLStr) {
		            // Parse base64
		            var ciphertext = Base64.parse(openSSLStr);
	
		            // Shortcut
		            var ciphertextWords = ciphertext.words;
	
		            // Test for salt
		            if (ciphertextWords[0] == 0x53616c74 && ciphertextWords[1] == 0x65645f5f) {
		                // Extract salt
		                var salt = WordArray.create(ciphertextWords.slice(2, 4));
	
		                // Remove salt from ciphertext
		                ciphertextWords.splice(0, 4);
		                ciphertext.sigBytes -= 16;
		            }
	
		            return CipherParams.create({ ciphertext: ciphertext, salt: salt });
		        }
		    };
	
		    /**
		     * A cipher wrapper that returns ciphertext as a serializable cipher params object.
		     */
		    var SerializableCipher = C_lib.SerializableCipher = Base.extend({
		        /**
		         * Configuration options.
		         *
		         * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
		         */
		        cfg: Base.extend({
		            format: OpenSSLFormatter
		        }),
	
		        /**
		         * Encrypts a message.
		         *
		         * @param {Cipher} cipher The cipher algorithm to use.
		         * @param {WordArray|string} message The message to encrypt.
		         * @param {WordArray} key The key.
		         * @param {Object} cfg (Optional) The configuration options to use for this operation.
		         *
		         * @return {CipherParams} A cipher params object.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
		         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
		         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
		         */
		        encrypt: function (cipher, message, key, cfg) {
		            // Apply config defaults
		            cfg = this.cfg.extend(cfg);
	
		            // Encrypt
		            var encryptor = cipher.createEncryptor(key, cfg);
		            var ciphertext = encryptor.finalize(message);
	
		            // Shortcut
		            var cipherCfg = encryptor.cfg;
	
		            // Create and return serializable cipher params
		            return CipherParams.create({
		                ciphertext: ciphertext,
		                key: key,
		                iv: cipherCfg.iv,
		                algorithm: cipher,
		                mode: cipherCfg.mode,
		                padding: cipherCfg.padding,
		                blockSize: cipher.blockSize,
		                formatter: cfg.format
		            });
		        },
	
		        /**
		         * Decrypts serialized ciphertext.
		         *
		         * @param {Cipher} cipher The cipher algorithm to use.
		         * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
		         * @param {WordArray} key The key.
		         * @param {Object} cfg (Optional) The configuration options to use for this operation.
		         *
		         * @return {WordArray} The plaintext.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
		         *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
		         */
		        decrypt: function (cipher, ciphertext, key, cfg) {
		            // Apply config defaults
		            cfg = this.cfg.extend(cfg);
	
		            // Convert string to CipherParams
		            ciphertext = this._parse(ciphertext, cfg.format);
	
		            // Decrypt
		            var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);
	
		            return plaintext;
		        },
	
		        /**
		         * Converts serialized ciphertext to CipherParams,
		         * else assumed CipherParams already and returns ciphertext unchanged.
		         *
		         * @param {CipherParams|string} ciphertext The ciphertext.
		         * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
		         *
		         * @return {CipherParams} The unserialized ciphertext.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
		         */
		        _parse: function (ciphertext, format) {
		            if (typeof ciphertext == 'string') {
		                return format.parse(ciphertext, this);
		            } else {
		                return ciphertext;
		            }
		        }
		    });
	
		    /**
		     * Key derivation function namespace.
		     */
		    var C_kdf = C.kdf = {};
	
		    /**
		     * OpenSSL key derivation function.
		     */
		    var OpenSSLKdf = C_kdf.OpenSSL = {
		        /**
		         * Derives a key and IV from a password.
		         *
		         * @param {string} password The password to derive from.
		         * @param {number} keySize The size in words of the key to generate.
		         * @param {number} ivSize The size in words of the IV to generate.
		         * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
		         *
		         * @return {CipherParams} A cipher params object with the key, IV, and salt.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
		         *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
		         */
		        execute: function (password, keySize, ivSize, salt) {
		            // Generate random salt
		            if (!salt) {
		                salt = WordArray.random(64/8);
		            }
	
		            // Derive key and IV
		            var key = EvpKDF.create({ keySize: keySize + ivSize }).compute(password, salt);
	
		            // Separate key and IV
		            var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
		            key.sigBytes = keySize * 4;
	
		            // Return params
		            return CipherParams.create({ key: key, iv: iv, salt: salt });
		        }
		    };
	
		    /**
		     * A serializable cipher wrapper that derives the key from a password,
		     * and returns ciphertext as a serializable cipher params object.
		     */
		    var PasswordBasedCipher = C_lib.PasswordBasedCipher = SerializableCipher.extend({
		        /**
		         * Configuration options.
		         *
		         * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
		         */
		        cfg: SerializableCipher.cfg.extend({
		            kdf: OpenSSLKdf
		        }),
	
		        /**
		         * Encrypts a message using a password.
		         *
		         * @param {Cipher} cipher The cipher algorithm to use.
		         * @param {WordArray|string} message The message to encrypt.
		         * @param {string} password The password.
		         * @param {Object} cfg (Optional) The configuration options to use for this operation.
		         *
		         * @return {CipherParams} A cipher params object.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
		         *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
		         */
		        encrypt: function (cipher, message, password, cfg) {
		            // Apply config defaults
		            cfg = this.cfg.extend(cfg);
	
		            // Derive key and other params
		            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize);
	
		            // Add IV to config
		            cfg.iv = derivedParams.iv;
	
		            // Encrypt
		            var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg);
	
		            // Mix in derived params
		            ciphertext.mixIn(derivedParams);
	
		            return ciphertext;
		        },
	
		        /**
		         * Decrypts serialized ciphertext using a password.
		         *
		         * @param {Cipher} cipher The cipher algorithm to use.
		         * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
		         * @param {string} password The password.
		         * @param {Object} cfg (Optional) The configuration options to use for this operation.
		         *
		         * @return {WordArray} The plaintext.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
		         *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
		         */
		        decrypt: function (cipher, ciphertext, password, cfg) {
		            // Apply config defaults
		            cfg = this.cfg.extend(cfg);
	
		            // Convert string to CipherParams
		            ciphertext = this._parse(ciphertext, cfg.format);
	
		            // Derive key and other params
		            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt);
	
		            // Add IV to config
		            cfg.iv = derivedParams.iv;
	
		            // Decrypt
		            var plaintext = SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);
	
		            return plaintext;
		        }
		    });
		}());
	
	
	}));

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(43), __webpack_require__(59));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./cipher-core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		/**
		 * Cipher Feedback block mode.
		 */
		CryptoJS.mode.CFB = (function () {
		    var CFB = CryptoJS.lib.BlockCipherMode.extend();
	
		    CFB.Encryptor = CFB.extend({
		        processBlock: function (words, offset) {
		            // Shortcuts
		            var cipher = this._cipher;
		            var blockSize = cipher.blockSize;
	
		            generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);
	
		            // Remember this block to use with next block
		            this._prevBlock = words.slice(offset, offset + blockSize);
		        }
		    });
	
		    CFB.Decryptor = CFB.extend({
		        processBlock: function (words, offset) {
		            // Shortcuts
		            var cipher = this._cipher;
		            var blockSize = cipher.blockSize;
	
		            // Remember this block to use with next block
		            var thisBlock = words.slice(offset, offset + blockSize);
	
		            generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);
	
		            // This block becomes the previous block
		            this._prevBlock = thisBlock;
		        }
		    });
	
		    function generateKeystreamAndEncrypt(words, offset, blockSize, cipher) {
		        // Shortcut
		        var iv = this._iv;
	
		        // Generate keystream
		        if (iv) {
		            var keystream = iv.slice(0);
	
		            // Remove IV for subsequent blocks
		            this._iv = undefined;
		        } else {
		            var keystream = this._prevBlock;
		        }
		        cipher.encryptBlock(keystream, 0);
	
		        // Encrypt
		        for (var i = 0; i < blockSize; i++) {
		            words[offset + i] ^= keystream[i];
		        }
		    }
	
		    return CFB;
		}());
	
	
		return CryptoJS.mode.CFB;
	
	}));

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(43), __webpack_require__(59));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./cipher-core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		/**
		 * Counter block mode.
		 */
		CryptoJS.mode.CTR = (function () {
		    var CTR = CryptoJS.lib.BlockCipherMode.extend();
	
		    var Encryptor = CTR.Encryptor = CTR.extend({
		        processBlock: function (words, offset) {
		            // Shortcuts
		            var cipher = this._cipher
		            var blockSize = cipher.blockSize;
		            var iv = this._iv;
		            var counter = this._counter;
	
		            // Generate keystream
		            if (iv) {
		                counter = this._counter = iv.slice(0);
	
		                // Remove IV for subsequent blocks
		                this._iv = undefined;
		            }
		            var keystream = counter.slice(0);
		            cipher.encryptBlock(keystream, 0);
	
		            // Increment counter
		            counter[blockSize - 1] = (counter[blockSize - 1] + 1) | 0
	
		            // Encrypt
		            for (var i = 0; i < blockSize; i++) {
		                words[offset + i] ^= keystream[i];
		            }
		        }
		    });
	
		    CTR.Decryptor = Encryptor;
	
		    return CTR;
		}());
	
	
		return CryptoJS.mode.CTR;
	
	}));

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(43), __webpack_require__(59));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./cipher-core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		/** @preserve
		 * Counter block mode compatible with  Dr Brian Gladman fileenc.c
		 * derived from CryptoJS.mode.CTR
		 * Jan Hruby jhruby.web@gmail.com
		 */
		CryptoJS.mode.CTRGladman = (function () {
		    var CTRGladman = CryptoJS.lib.BlockCipherMode.extend();
	
			function incWord(word)
			{
				if (((word >> 24) & 0xff) === 0xff) { //overflow
				var b1 = (word >> 16)&0xff;
				var b2 = (word >> 8)&0xff;
				var b3 = word & 0xff;
	
				if (b1 === 0xff) // overflow b1
				{
				b1 = 0;
				if (b2 === 0xff)
				{
					b2 = 0;
					if (b3 === 0xff)
					{
						b3 = 0;
					}
					else
					{
						++b3;
					}
				}
				else
				{
					++b2;
				}
				}
				else
				{
				++b1;
				}
	
				word = 0;
				word += (b1 << 16);
				word += (b2 << 8);
				word += b3;
				}
				else
				{
				word += (0x01 << 24);
				}
				return word;
			}
	
			function incCounter(counter)
			{
				if ((counter[0] = incWord(counter[0])) === 0)
				{
					// encr_data in fileenc.c from  Dr Brian Gladman's counts only with DWORD j < 8
					counter[1] = incWord(counter[1]);
				}
				return counter;
			}
	
		    var Encryptor = CTRGladman.Encryptor = CTRGladman.extend({
		        processBlock: function (words, offset) {
		            // Shortcuts
		            var cipher = this._cipher
		            var blockSize = cipher.blockSize;
		            var iv = this._iv;
		            var counter = this._counter;
	
		            // Generate keystream
		            if (iv) {
		                counter = this._counter = iv.slice(0);
	
		                // Remove IV for subsequent blocks
		                this._iv = undefined;
		            }
	
					incCounter(counter);
	
					var keystream = counter.slice(0);
		            cipher.encryptBlock(keystream, 0);
	
		            // Encrypt
		            for (var i = 0; i < blockSize; i++) {
		                words[offset + i] ^= keystream[i];
		            }
		        }
		    });
	
		    CTRGladman.Decryptor = Encryptor;
	
		    return CTRGladman;
		}());
	
	
	
	
		return CryptoJS.mode.CTRGladman;
	
	}));

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(43), __webpack_require__(59));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./cipher-core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		/**
		 * Output Feedback block mode.
		 */
		CryptoJS.mode.OFB = (function () {
		    var OFB = CryptoJS.lib.BlockCipherMode.extend();
	
		    var Encryptor = OFB.Encryptor = OFB.extend({
		        processBlock: function (words, offset) {
		            // Shortcuts
		            var cipher = this._cipher
		            var blockSize = cipher.blockSize;
		            var iv = this._iv;
		            var keystream = this._keystream;
	
		            // Generate keystream
		            if (iv) {
		                keystream = this._keystream = iv.slice(0);
	
		                // Remove IV for subsequent blocks
		                this._iv = undefined;
		            }
		            cipher.encryptBlock(keystream, 0);
	
		            // Encrypt
		            for (var i = 0; i < blockSize; i++) {
		                words[offset + i] ^= keystream[i];
		            }
		        }
		    });
	
		    OFB.Decryptor = Encryptor;
	
		    return OFB;
		}());
	
	
		return CryptoJS.mode.OFB;
	
	}));

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(43), __webpack_require__(59));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./cipher-core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		/**
		 * Electronic Codebook block mode.
		 */
		CryptoJS.mode.ECB = (function () {
		    var ECB = CryptoJS.lib.BlockCipherMode.extend();
	
		    ECB.Encryptor = ECB.extend({
		        processBlock: function (words, offset) {
		            this._cipher.encryptBlock(words, offset);
		        }
		    });
	
		    ECB.Decryptor = ECB.extend({
		        processBlock: function (words, offset) {
		            this._cipher.decryptBlock(words, offset);
		        }
		    });
	
		    return ECB;
		}());
	
	
		return CryptoJS.mode.ECB;
	
	}));

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(43), __webpack_require__(59));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./cipher-core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		/**
		 * ANSI X.923 padding strategy.
		 */
		CryptoJS.pad.AnsiX923 = {
		    pad: function (data, blockSize) {
		        // Shortcuts
		        var dataSigBytes = data.sigBytes;
		        var blockSizeBytes = blockSize * 4;
	
		        // Count padding bytes
		        var nPaddingBytes = blockSizeBytes - dataSigBytes % blockSizeBytes;
	
		        // Compute last byte position
		        var lastBytePos = dataSigBytes + nPaddingBytes - 1;
	
		        // Pad
		        data.clamp();
		        data.words[lastBytePos >>> 2] |= nPaddingBytes << (24 - (lastBytePos % 4) * 8);
		        data.sigBytes += nPaddingBytes;
		    },
	
		    unpad: function (data) {
		        // Get number of padding bytes from last byte
		        var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;
	
		        // Remove padding
		        data.sigBytes -= nPaddingBytes;
		    }
		};
	
	
		return CryptoJS.pad.Ansix923;
	
	}));

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(43), __webpack_require__(59));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./cipher-core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		/**
		 * ISO 10126 padding strategy.
		 */
		CryptoJS.pad.Iso10126 = {
		    pad: function (data, blockSize) {
		        // Shortcut
		        var blockSizeBytes = blockSize * 4;
	
		        // Count padding bytes
		        var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;
	
		        // Pad
		        data.concat(CryptoJS.lib.WordArray.random(nPaddingBytes - 1)).
		             concat(CryptoJS.lib.WordArray.create([nPaddingBytes << 24], 1));
		    },
	
		    unpad: function (data) {
		        // Get number of padding bytes from last byte
		        var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;
	
		        // Remove padding
		        data.sigBytes -= nPaddingBytes;
		    }
		};
	
	
		return CryptoJS.pad.Iso10126;
	
	}));

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(43), __webpack_require__(59));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./cipher-core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		/**
		 * ISO/IEC 9797-1 Padding Method 2.
		 */
		CryptoJS.pad.Iso97971 = {
		    pad: function (data, blockSize) {
		        // Add 0x80 byte
		        data.concat(CryptoJS.lib.WordArray.create([0x80000000], 1));
	
		        // Zero pad the rest
		        CryptoJS.pad.ZeroPadding.pad(data, blockSize);
		    },
	
		    unpad: function (data) {
		        // Remove zero padding
		        CryptoJS.pad.ZeroPadding.unpad(data);
	
		        // Remove one more byte -- the 0x80 byte
		        data.sigBytes--;
		    }
		};
	
	
		return CryptoJS.pad.Iso97971;
	
	}));

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(43), __webpack_require__(59));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./cipher-core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		/**
		 * Zero padding strategy.
		 */
		CryptoJS.pad.ZeroPadding = {
		    pad: function (data, blockSize) {
		        // Shortcut
		        var blockSizeBytes = blockSize * 4;
	
		        // Pad
		        data.clamp();
		        data.sigBytes += blockSizeBytes - ((data.sigBytes % blockSizeBytes) || blockSizeBytes);
		    },
	
		    unpad: function (data) {
		        // Shortcut
		        var dataWords = data.words;
	
		        // Unpad
		        var i = data.sigBytes - 1;
		        while (!((dataWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff)) {
		            i--;
		        }
		        data.sigBytes = i + 1;
		    }
		};
	
	
		return CryptoJS.pad.ZeroPadding;
	
	}));

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(43), __webpack_require__(59));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./cipher-core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		/**
		 * A noop padding strategy.
		 */
		CryptoJS.pad.NoPadding = {
		    pad: function () {
		    },
	
		    unpad: function () {
		    }
		};
	
	
		return CryptoJS.pad.NoPadding;
	
	}));

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(43), __webpack_require__(59));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./cipher-core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function (undefined) {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var CipherParams = C_lib.CipherParams;
		    var C_enc = C.enc;
		    var Hex = C_enc.Hex;
		    var C_format = C.format;
	
		    var HexFormatter = C_format.Hex = {
		        /**
		         * Converts the ciphertext of a cipher params object to a hexadecimally encoded string.
		         *
		         * @param {CipherParams} cipherParams The cipher params object.
		         *
		         * @return {string} The hexadecimally encoded string.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var hexString = CryptoJS.format.Hex.stringify(cipherParams);
		         */
		        stringify: function (cipherParams) {
		            return cipherParams.ciphertext.toString(Hex);
		        },
	
		        /**
		         * Converts a hexadecimally encoded ciphertext string to a cipher params object.
		         *
		         * @param {string} input The hexadecimally encoded string.
		         *
		         * @return {CipherParams} The cipher params object.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var cipherParams = CryptoJS.format.Hex.parse(hexString);
		         */
		        parse: function (input) {
		            var ciphertext = Hex.parse(input);
		            return CipherParams.create({ ciphertext: ciphertext });
		        }
		    };
		}());
	
	
		return CryptoJS.format.Hex;
	
	}));

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(43), __webpack_require__(47), __webpack_require__(48), __webpack_require__(58), __webpack_require__(59));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function () {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var BlockCipher = C_lib.BlockCipher;
		    var C_algo = C.algo;
	
		    // Lookup tables
		    var SBOX = [];
		    var INV_SBOX = [];
		    var SUB_MIX_0 = [];
		    var SUB_MIX_1 = [];
		    var SUB_MIX_2 = [];
		    var SUB_MIX_3 = [];
		    var INV_SUB_MIX_0 = [];
		    var INV_SUB_MIX_1 = [];
		    var INV_SUB_MIX_2 = [];
		    var INV_SUB_MIX_3 = [];
	
		    // Compute lookup tables
		    (function () {
		        // Compute double table
		        var d = [];
		        for (var i = 0; i < 256; i++) {
		            if (i < 128) {
		                d[i] = i << 1;
		            } else {
		                d[i] = (i << 1) ^ 0x11b;
		            }
		        }
	
		        // Walk GF(2^8)
		        var x = 0;
		        var xi = 0;
		        for (var i = 0; i < 256; i++) {
		            // Compute sbox
		            var sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4);
		            sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63;
		            SBOX[x] = sx;
		            INV_SBOX[sx] = x;
	
		            // Compute multiplication
		            var x2 = d[x];
		            var x4 = d[x2];
		            var x8 = d[x4];
	
		            // Compute sub bytes, mix columns tables
		            var t = (d[sx] * 0x101) ^ (sx * 0x1010100);
		            SUB_MIX_0[x] = (t << 24) | (t >>> 8);
		            SUB_MIX_1[x] = (t << 16) | (t >>> 16);
		            SUB_MIX_2[x] = (t << 8)  | (t >>> 24);
		            SUB_MIX_3[x] = t;
	
		            // Compute inv sub bytes, inv mix columns tables
		            var t = (x8 * 0x1010101) ^ (x4 * 0x10001) ^ (x2 * 0x101) ^ (x * 0x1010100);
		            INV_SUB_MIX_0[sx] = (t << 24) | (t >>> 8);
		            INV_SUB_MIX_1[sx] = (t << 16) | (t >>> 16);
		            INV_SUB_MIX_2[sx] = (t << 8)  | (t >>> 24);
		            INV_SUB_MIX_3[sx] = t;
	
		            // Compute next counter
		            if (!x) {
		                x = xi = 1;
		            } else {
		                x = x2 ^ d[d[d[x8 ^ x2]]];
		                xi ^= d[d[xi]];
		            }
		        }
		    }());
	
		    // Precomputed Rcon lookup
		    var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];
	
		    /**
		     * AES block cipher algorithm.
		     */
		    var AES = C_algo.AES = BlockCipher.extend({
		        _doReset: function () {
		            // Skip reset of nRounds has been set before and key did not change
		            if (this._nRounds && this._keyPriorReset === this._key) {
		                return;
		            }
	
		            // Shortcuts
		            var key = this._keyPriorReset = this._key;
		            var keyWords = key.words;
		            var keySize = key.sigBytes / 4;
	
		            // Compute number of rounds
		            var nRounds = this._nRounds = keySize + 6;
	
		            // Compute number of key schedule rows
		            var ksRows = (nRounds + 1) * 4;
	
		            // Compute key schedule
		            var keySchedule = this._keySchedule = [];
		            for (var ksRow = 0; ksRow < ksRows; ksRow++) {
		                if (ksRow < keySize) {
		                    keySchedule[ksRow] = keyWords[ksRow];
		                } else {
		                    var t = keySchedule[ksRow - 1];
	
		                    if (!(ksRow % keySize)) {
		                        // Rot word
		                        t = (t << 8) | (t >>> 24);
	
		                        // Sub word
		                        t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];
	
		                        // Mix Rcon
		                        t ^= RCON[(ksRow / keySize) | 0] << 24;
		                    } else if (keySize > 6 && ksRow % keySize == 4) {
		                        // Sub word
		                        t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];
		                    }
	
		                    keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
		                }
		            }
	
		            // Compute inv key schedule
		            var invKeySchedule = this._invKeySchedule = [];
		            for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
		                var ksRow = ksRows - invKsRow;
	
		                if (invKsRow % 4) {
		                    var t = keySchedule[ksRow];
		                } else {
		                    var t = keySchedule[ksRow - 4];
		                }
	
		                if (invKsRow < 4 || ksRow <= 4) {
		                    invKeySchedule[invKsRow] = t;
		                } else {
		                    invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[(t >>> 16) & 0xff]] ^
		                                               INV_SUB_MIX_2[SBOX[(t >>> 8) & 0xff]] ^ INV_SUB_MIX_3[SBOX[t & 0xff]];
		                }
		            }
		        },
	
		        encryptBlock: function (M, offset) {
		            this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
		        },
	
		        decryptBlock: function (M, offset) {
		            // Swap 2nd and 4th rows
		            var t = M[offset + 1];
		            M[offset + 1] = M[offset + 3];
		            M[offset + 3] = t;
	
		            this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX);
	
		            // Inv swap 2nd and 4th rows
		            var t = M[offset + 1];
		            M[offset + 1] = M[offset + 3];
		            M[offset + 3] = t;
		        },
	
		        _doCryptBlock: function (M, offset, keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX) {
		            // Shortcut
		            var nRounds = this._nRounds;
	
		            // Get input, add round key
		            var s0 = M[offset]     ^ keySchedule[0];
		            var s1 = M[offset + 1] ^ keySchedule[1];
		            var s2 = M[offset + 2] ^ keySchedule[2];
		            var s3 = M[offset + 3] ^ keySchedule[3];
	
		            // Key schedule row counter
		            var ksRow = 4;
	
		            // Rounds
		            for (var round = 1; round < nRounds; round++) {
		                // Shift rows, sub bytes, mix columns, add round key
		                var t0 = SUB_MIX_0[s0 >>> 24] ^ SUB_MIX_1[(s1 >>> 16) & 0xff] ^ SUB_MIX_2[(s2 >>> 8) & 0xff] ^ SUB_MIX_3[s3 & 0xff] ^ keySchedule[ksRow++];
		                var t1 = SUB_MIX_0[s1 >>> 24] ^ SUB_MIX_1[(s2 >>> 16) & 0xff] ^ SUB_MIX_2[(s3 >>> 8) & 0xff] ^ SUB_MIX_3[s0 & 0xff] ^ keySchedule[ksRow++];
		                var t2 = SUB_MIX_0[s2 >>> 24] ^ SUB_MIX_1[(s3 >>> 16) & 0xff] ^ SUB_MIX_2[(s0 >>> 8) & 0xff] ^ SUB_MIX_3[s1 & 0xff] ^ keySchedule[ksRow++];
		                var t3 = SUB_MIX_0[s3 >>> 24] ^ SUB_MIX_1[(s0 >>> 16) & 0xff] ^ SUB_MIX_2[(s1 >>> 8) & 0xff] ^ SUB_MIX_3[s2 & 0xff] ^ keySchedule[ksRow++];
	
		                // Update state
		                s0 = t0;
		                s1 = t1;
		                s2 = t2;
		                s3 = t3;
		            }
	
		            // Shift rows, sub bytes, add round key
		            var t0 = ((SBOX[s0 >>> 24] << 24) | (SBOX[(s1 >>> 16) & 0xff] << 16) | (SBOX[(s2 >>> 8) & 0xff] << 8) | SBOX[s3 & 0xff]) ^ keySchedule[ksRow++];
		            var t1 = ((SBOX[s1 >>> 24] << 24) | (SBOX[(s2 >>> 16) & 0xff] << 16) | (SBOX[(s3 >>> 8) & 0xff] << 8) | SBOX[s0 & 0xff]) ^ keySchedule[ksRow++];
		            var t2 = ((SBOX[s2 >>> 24] << 24) | (SBOX[(s3 >>> 16) & 0xff] << 16) | (SBOX[(s0 >>> 8) & 0xff] << 8) | SBOX[s1 & 0xff]) ^ keySchedule[ksRow++];
		            var t3 = ((SBOX[s3 >>> 24] << 24) | (SBOX[(s0 >>> 16) & 0xff] << 16) | (SBOX[(s1 >>> 8) & 0xff] << 8) | SBOX[s2 & 0xff]) ^ keySchedule[ksRow++];
	
		            // Set output
		            M[offset]     = t0;
		            M[offset + 1] = t1;
		            M[offset + 2] = t2;
		            M[offset + 3] = t3;
		        },
	
		        keySize: 256/32
		    });
	
		    /**
		     * Shortcut functions to the cipher's object interface.
		     *
		     * @example
		     *
		     *     var ciphertext = CryptoJS.AES.encrypt(message, key, cfg);
		     *     var plaintext  = CryptoJS.AES.decrypt(ciphertext, key, cfg);
		     */
		    C.AES = BlockCipher._createHelper(AES);
		}());
	
	
		return CryptoJS.AES;
	
	}));

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(43), __webpack_require__(47), __webpack_require__(48), __webpack_require__(58), __webpack_require__(59));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function () {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var WordArray = C_lib.WordArray;
		    var BlockCipher = C_lib.BlockCipher;
		    var C_algo = C.algo;
	
		    // Permuted Choice 1 constants
		    var PC1 = [
		        57, 49, 41, 33, 25, 17, 9,  1,
		        58, 50, 42, 34, 26, 18, 10, 2,
		        59, 51, 43, 35, 27, 19, 11, 3,
		        60, 52, 44, 36, 63, 55, 47, 39,
		        31, 23, 15, 7,  62, 54, 46, 38,
		        30, 22, 14, 6,  61, 53, 45, 37,
		        29, 21, 13, 5,  28, 20, 12, 4
		    ];
	
		    // Permuted Choice 2 constants
		    var PC2 = [
		        14, 17, 11, 24, 1,  5,
		        3,  28, 15, 6,  21, 10,
		        23, 19, 12, 4,  26, 8,
		        16, 7,  27, 20, 13, 2,
		        41, 52, 31, 37, 47, 55,
		        30, 40, 51, 45, 33, 48,
		        44, 49, 39, 56, 34, 53,
		        46, 42, 50, 36, 29, 32
		    ];
	
		    // Cumulative bit shift constants
		    var BIT_SHIFTS = [1,  2,  4,  6,  8,  10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28];
	
		    // SBOXes and round permutation constants
		    var SBOX_P = [
		        {
		            0x0: 0x808200,
		            0x10000000: 0x8000,
		            0x20000000: 0x808002,
		            0x30000000: 0x2,
		            0x40000000: 0x200,
		            0x50000000: 0x808202,
		            0x60000000: 0x800202,
		            0x70000000: 0x800000,
		            0x80000000: 0x202,
		            0x90000000: 0x800200,
		            0xa0000000: 0x8200,
		            0xb0000000: 0x808000,
		            0xc0000000: 0x8002,
		            0xd0000000: 0x800002,
		            0xe0000000: 0x0,
		            0xf0000000: 0x8202,
		            0x8000000: 0x0,
		            0x18000000: 0x808202,
		            0x28000000: 0x8202,
		            0x38000000: 0x8000,
		            0x48000000: 0x808200,
		            0x58000000: 0x200,
		            0x68000000: 0x808002,
		            0x78000000: 0x2,
		            0x88000000: 0x800200,
		            0x98000000: 0x8200,
		            0xa8000000: 0x808000,
		            0xb8000000: 0x800202,
		            0xc8000000: 0x800002,
		            0xd8000000: 0x8002,
		            0xe8000000: 0x202,
		            0xf8000000: 0x800000,
		            0x1: 0x8000,
		            0x10000001: 0x2,
		            0x20000001: 0x808200,
		            0x30000001: 0x800000,
		            0x40000001: 0x808002,
		            0x50000001: 0x8200,
		            0x60000001: 0x200,
		            0x70000001: 0x800202,
		            0x80000001: 0x808202,
		            0x90000001: 0x808000,
		            0xa0000001: 0x800002,
		            0xb0000001: 0x8202,
		            0xc0000001: 0x202,
		            0xd0000001: 0x800200,
		            0xe0000001: 0x8002,
		            0xf0000001: 0x0,
		            0x8000001: 0x808202,
		            0x18000001: 0x808000,
		            0x28000001: 0x800000,
		            0x38000001: 0x200,
		            0x48000001: 0x8000,
		            0x58000001: 0x800002,
		            0x68000001: 0x2,
		            0x78000001: 0x8202,
		            0x88000001: 0x8002,
		            0x98000001: 0x800202,
		            0xa8000001: 0x202,
		            0xb8000001: 0x808200,
		            0xc8000001: 0x800200,
		            0xd8000001: 0x0,
		            0xe8000001: 0x8200,
		            0xf8000001: 0x808002
		        },
		        {
		            0x0: 0x40084010,
		            0x1000000: 0x4000,
		            0x2000000: 0x80000,
		            0x3000000: 0x40080010,
		            0x4000000: 0x40000010,
		            0x5000000: 0x40084000,
		            0x6000000: 0x40004000,
		            0x7000000: 0x10,
		            0x8000000: 0x84000,
		            0x9000000: 0x40004010,
		            0xa000000: 0x40000000,
		            0xb000000: 0x84010,
		            0xc000000: 0x80010,
		            0xd000000: 0x0,
		            0xe000000: 0x4010,
		            0xf000000: 0x40080000,
		            0x800000: 0x40004000,
		            0x1800000: 0x84010,
		            0x2800000: 0x10,
		            0x3800000: 0x40004010,
		            0x4800000: 0x40084010,
		            0x5800000: 0x40000000,
		            0x6800000: 0x80000,
		            0x7800000: 0x40080010,
		            0x8800000: 0x80010,
		            0x9800000: 0x0,
		            0xa800000: 0x4000,
		            0xb800000: 0x40080000,
		            0xc800000: 0x40000010,
		            0xd800000: 0x84000,
		            0xe800000: 0x40084000,
		            0xf800000: 0x4010,
		            0x10000000: 0x0,
		            0x11000000: 0x40080010,
		            0x12000000: 0x40004010,
		            0x13000000: 0x40084000,
		            0x14000000: 0x40080000,
		            0x15000000: 0x10,
		            0x16000000: 0x84010,
		            0x17000000: 0x4000,
		            0x18000000: 0x4010,
		            0x19000000: 0x80000,
		            0x1a000000: 0x80010,
		            0x1b000000: 0x40000010,
		            0x1c000000: 0x84000,
		            0x1d000000: 0x40004000,
		            0x1e000000: 0x40000000,
		            0x1f000000: 0x40084010,
		            0x10800000: 0x84010,
		            0x11800000: 0x80000,
		            0x12800000: 0x40080000,
		            0x13800000: 0x4000,
		            0x14800000: 0x40004000,
		            0x15800000: 0x40084010,
		            0x16800000: 0x10,
		            0x17800000: 0x40000000,
		            0x18800000: 0x40084000,
		            0x19800000: 0x40000010,
		            0x1a800000: 0x40004010,
		            0x1b800000: 0x80010,
		            0x1c800000: 0x0,
		            0x1d800000: 0x4010,
		            0x1e800000: 0x40080010,
		            0x1f800000: 0x84000
		        },
		        {
		            0x0: 0x104,
		            0x100000: 0x0,
		            0x200000: 0x4000100,
		            0x300000: 0x10104,
		            0x400000: 0x10004,
		            0x500000: 0x4000004,
		            0x600000: 0x4010104,
		            0x700000: 0x4010000,
		            0x800000: 0x4000000,
		            0x900000: 0x4010100,
		            0xa00000: 0x10100,
		            0xb00000: 0x4010004,
		            0xc00000: 0x4000104,
		            0xd00000: 0x10000,
		            0xe00000: 0x4,
		            0xf00000: 0x100,
		            0x80000: 0x4010100,
		            0x180000: 0x4010004,
		            0x280000: 0x0,
		            0x380000: 0x4000100,
		            0x480000: 0x4000004,
		            0x580000: 0x10000,
		            0x680000: 0x10004,
		            0x780000: 0x104,
		            0x880000: 0x4,
		            0x980000: 0x100,
		            0xa80000: 0x4010000,
		            0xb80000: 0x10104,
		            0xc80000: 0x10100,
		            0xd80000: 0x4000104,
		            0xe80000: 0x4010104,
		            0xf80000: 0x4000000,
		            0x1000000: 0x4010100,
		            0x1100000: 0x10004,
		            0x1200000: 0x10000,
		            0x1300000: 0x4000100,
		            0x1400000: 0x100,
		            0x1500000: 0x4010104,
		            0x1600000: 0x4000004,
		            0x1700000: 0x0,
		            0x1800000: 0x4000104,
		            0x1900000: 0x4000000,
		            0x1a00000: 0x4,
		            0x1b00000: 0x10100,
		            0x1c00000: 0x4010000,
		            0x1d00000: 0x104,
		            0x1e00000: 0x10104,
		            0x1f00000: 0x4010004,
		            0x1080000: 0x4000000,
		            0x1180000: 0x104,
		            0x1280000: 0x4010100,
		            0x1380000: 0x0,
		            0x1480000: 0x10004,
		            0x1580000: 0x4000100,
		            0x1680000: 0x100,
		            0x1780000: 0x4010004,
		            0x1880000: 0x10000,
		            0x1980000: 0x4010104,
		            0x1a80000: 0x10104,
		            0x1b80000: 0x4000004,
		            0x1c80000: 0x4000104,
		            0x1d80000: 0x4010000,
		            0x1e80000: 0x4,
		            0x1f80000: 0x10100
		        },
		        {
		            0x0: 0x80401000,
		            0x10000: 0x80001040,
		            0x20000: 0x401040,
		            0x30000: 0x80400000,
		            0x40000: 0x0,
		            0x50000: 0x401000,
		            0x60000: 0x80000040,
		            0x70000: 0x400040,
		            0x80000: 0x80000000,
		            0x90000: 0x400000,
		            0xa0000: 0x40,
		            0xb0000: 0x80001000,
		            0xc0000: 0x80400040,
		            0xd0000: 0x1040,
		            0xe0000: 0x1000,
		            0xf0000: 0x80401040,
		            0x8000: 0x80001040,
		            0x18000: 0x40,
		            0x28000: 0x80400040,
		            0x38000: 0x80001000,
		            0x48000: 0x401000,
		            0x58000: 0x80401040,
		            0x68000: 0x0,
		            0x78000: 0x80400000,
		            0x88000: 0x1000,
		            0x98000: 0x80401000,
		            0xa8000: 0x400000,
		            0xb8000: 0x1040,
		            0xc8000: 0x80000000,
		            0xd8000: 0x400040,
		            0xe8000: 0x401040,
		            0xf8000: 0x80000040,
		            0x100000: 0x400040,
		            0x110000: 0x401000,
		            0x120000: 0x80000040,
		            0x130000: 0x0,
		            0x140000: 0x1040,
		            0x150000: 0x80400040,
		            0x160000: 0x80401000,
		            0x170000: 0x80001040,
		            0x180000: 0x80401040,
		            0x190000: 0x80000000,
		            0x1a0000: 0x80400000,
		            0x1b0000: 0x401040,
		            0x1c0000: 0x80001000,
		            0x1d0000: 0x400000,
		            0x1e0000: 0x40,
		            0x1f0000: 0x1000,
		            0x108000: 0x80400000,
		            0x118000: 0x80401040,
		            0x128000: 0x0,
		            0x138000: 0x401000,
		            0x148000: 0x400040,
		            0x158000: 0x80000000,
		            0x168000: 0x80001040,
		            0x178000: 0x40,
		            0x188000: 0x80000040,
		            0x198000: 0x1000,
		            0x1a8000: 0x80001000,
		            0x1b8000: 0x80400040,
		            0x1c8000: 0x1040,
		            0x1d8000: 0x80401000,
		            0x1e8000: 0x400000,
		            0x1f8000: 0x401040
		        },
		        {
		            0x0: 0x80,
		            0x1000: 0x1040000,
		            0x2000: 0x40000,
		            0x3000: 0x20000000,
		            0x4000: 0x20040080,
		            0x5000: 0x1000080,
		            0x6000: 0x21000080,
		            0x7000: 0x40080,
		            0x8000: 0x1000000,
		            0x9000: 0x20040000,
		            0xa000: 0x20000080,
		            0xb000: 0x21040080,
		            0xc000: 0x21040000,
		            0xd000: 0x0,
		            0xe000: 0x1040080,
		            0xf000: 0x21000000,
		            0x800: 0x1040080,
		            0x1800: 0x21000080,
		            0x2800: 0x80,
		            0x3800: 0x1040000,
		            0x4800: 0x40000,
		            0x5800: 0x20040080,
		            0x6800: 0x21040000,
		            0x7800: 0x20000000,
		            0x8800: 0x20040000,
		            0x9800: 0x0,
		            0xa800: 0x21040080,
		            0xb800: 0x1000080,
		            0xc800: 0x20000080,
		            0xd800: 0x21000000,
		            0xe800: 0x1000000,
		            0xf800: 0x40080,
		            0x10000: 0x40000,
		            0x11000: 0x80,
		            0x12000: 0x20000000,
		            0x13000: 0x21000080,
		            0x14000: 0x1000080,
		            0x15000: 0x21040000,
		            0x16000: 0x20040080,
		            0x17000: 0x1000000,
		            0x18000: 0x21040080,
		            0x19000: 0x21000000,
		            0x1a000: 0x1040000,
		            0x1b000: 0x20040000,
		            0x1c000: 0x40080,
		            0x1d000: 0x20000080,
		            0x1e000: 0x0,
		            0x1f000: 0x1040080,
		            0x10800: 0x21000080,
		            0x11800: 0x1000000,
		            0x12800: 0x1040000,
		            0x13800: 0x20040080,
		            0x14800: 0x20000000,
		            0x15800: 0x1040080,
		            0x16800: 0x80,
		            0x17800: 0x21040000,
		            0x18800: 0x40080,
		            0x19800: 0x21040080,
		            0x1a800: 0x0,
		            0x1b800: 0x21000000,
		            0x1c800: 0x1000080,
		            0x1d800: 0x40000,
		            0x1e800: 0x20040000,
		            0x1f800: 0x20000080
		        },
		        {
		            0x0: 0x10000008,
		            0x100: 0x2000,
		            0x200: 0x10200000,
		            0x300: 0x10202008,
		            0x400: 0x10002000,
		            0x500: 0x200000,
		            0x600: 0x200008,
		            0x700: 0x10000000,
		            0x800: 0x0,
		            0x900: 0x10002008,
		            0xa00: 0x202000,
		            0xb00: 0x8,
		            0xc00: 0x10200008,
		            0xd00: 0x202008,
		            0xe00: 0x2008,
		            0xf00: 0x10202000,
		            0x80: 0x10200000,
		            0x180: 0x10202008,
		            0x280: 0x8,
		            0x380: 0x200000,
		            0x480: 0x202008,
		            0x580: 0x10000008,
		            0x680: 0x10002000,
		            0x780: 0x2008,
		            0x880: 0x200008,
		            0x980: 0x2000,
		            0xa80: 0x10002008,
		            0xb80: 0x10200008,
		            0xc80: 0x0,
		            0xd80: 0x10202000,
		            0xe80: 0x202000,
		            0xf80: 0x10000000,
		            0x1000: 0x10002000,
		            0x1100: 0x10200008,
		            0x1200: 0x10202008,
		            0x1300: 0x2008,
		            0x1400: 0x200000,
		            0x1500: 0x10000000,
		            0x1600: 0x10000008,
		            0x1700: 0x202000,
		            0x1800: 0x202008,
		            0x1900: 0x0,
		            0x1a00: 0x8,
		            0x1b00: 0x10200000,
		            0x1c00: 0x2000,
		            0x1d00: 0x10002008,
		            0x1e00: 0x10202000,
		            0x1f00: 0x200008,
		            0x1080: 0x8,
		            0x1180: 0x202000,
		            0x1280: 0x200000,
		            0x1380: 0x10000008,
		            0x1480: 0x10002000,
		            0x1580: 0x2008,
		            0x1680: 0x10202008,
		            0x1780: 0x10200000,
		            0x1880: 0x10202000,
		            0x1980: 0x10200008,
		            0x1a80: 0x2000,
		            0x1b80: 0x202008,
		            0x1c80: 0x200008,
		            0x1d80: 0x0,
		            0x1e80: 0x10000000,
		            0x1f80: 0x10002008
		        },
		        {
		            0x0: 0x100000,
		            0x10: 0x2000401,
		            0x20: 0x400,
		            0x30: 0x100401,
		            0x40: 0x2100401,
		            0x50: 0x0,
		            0x60: 0x1,
		            0x70: 0x2100001,
		            0x80: 0x2000400,
		            0x90: 0x100001,
		            0xa0: 0x2000001,
		            0xb0: 0x2100400,
		            0xc0: 0x2100000,
		            0xd0: 0x401,
		            0xe0: 0x100400,
		            0xf0: 0x2000000,
		            0x8: 0x2100001,
		            0x18: 0x0,
		            0x28: 0x2000401,
		            0x38: 0x2100400,
		            0x48: 0x100000,
		            0x58: 0x2000001,
		            0x68: 0x2000000,
		            0x78: 0x401,
		            0x88: 0x100401,
		            0x98: 0x2000400,
		            0xa8: 0x2100000,
		            0xb8: 0x100001,
		            0xc8: 0x400,
		            0xd8: 0x2100401,
		            0xe8: 0x1,
		            0xf8: 0x100400,
		            0x100: 0x2000000,
		            0x110: 0x100000,
		            0x120: 0x2000401,
		            0x130: 0x2100001,
		            0x140: 0x100001,
		            0x150: 0x2000400,
		            0x160: 0x2100400,
		            0x170: 0x100401,
		            0x180: 0x401,
		            0x190: 0x2100401,
		            0x1a0: 0x100400,
		            0x1b0: 0x1,
		            0x1c0: 0x0,
		            0x1d0: 0x2100000,
		            0x1e0: 0x2000001,
		            0x1f0: 0x400,
		            0x108: 0x100400,
		            0x118: 0x2000401,
		            0x128: 0x2100001,
		            0x138: 0x1,
		            0x148: 0x2000000,
		            0x158: 0x100000,
		            0x168: 0x401,
		            0x178: 0x2100400,
		            0x188: 0x2000001,
		            0x198: 0x2100000,
		            0x1a8: 0x0,
		            0x1b8: 0x2100401,
		            0x1c8: 0x100401,
		            0x1d8: 0x400,
		            0x1e8: 0x2000400,
		            0x1f8: 0x100001
		        },
		        {
		            0x0: 0x8000820,
		            0x1: 0x20000,
		            0x2: 0x8000000,
		            0x3: 0x20,
		            0x4: 0x20020,
		            0x5: 0x8020820,
		            0x6: 0x8020800,
		            0x7: 0x800,
		            0x8: 0x8020000,
		            0x9: 0x8000800,
		            0xa: 0x20800,
		            0xb: 0x8020020,
		            0xc: 0x820,
		            0xd: 0x0,
		            0xe: 0x8000020,
		            0xf: 0x20820,
		            0x80000000: 0x800,
		            0x80000001: 0x8020820,
		            0x80000002: 0x8000820,
		            0x80000003: 0x8000000,
		            0x80000004: 0x8020000,
		            0x80000005: 0x20800,
		            0x80000006: 0x20820,
		            0x80000007: 0x20,
		            0x80000008: 0x8000020,
		            0x80000009: 0x820,
		            0x8000000a: 0x20020,
		            0x8000000b: 0x8020800,
		            0x8000000c: 0x0,
		            0x8000000d: 0x8020020,
		            0x8000000e: 0x8000800,
		            0x8000000f: 0x20000,
		            0x10: 0x20820,
		            0x11: 0x8020800,
		            0x12: 0x20,
		            0x13: 0x800,
		            0x14: 0x8000800,
		            0x15: 0x8000020,
		            0x16: 0x8020020,
		            0x17: 0x20000,
		            0x18: 0x0,
		            0x19: 0x20020,
		            0x1a: 0x8020000,
		            0x1b: 0x8000820,
		            0x1c: 0x8020820,
		            0x1d: 0x20800,
		            0x1e: 0x820,
		            0x1f: 0x8000000,
		            0x80000010: 0x20000,
		            0x80000011: 0x800,
		            0x80000012: 0x8020020,
		            0x80000013: 0x20820,
		            0x80000014: 0x20,
		            0x80000015: 0x8020000,
		            0x80000016: 0x8000000,
		            0x80000017: 0x8000820,
		            0x80000018: 0x8020820,
		            0x80000019: 0x8000020,
		            0x8000001a: 0x8000800,
		            0x8000001b: 0x0,
		            0x8000001c: 0x20800,
		            0x8000001d: 0x820,
		            0x8000001e: 0x20020,
		            0x8000001f: 0x8020800
		        }
		    ];
	
		    // Masks that select the SBOX input
		    var SBOX_MASK = [
		        0xf8000001, 0x1f800000, 0x01f80000, 0x001f8000,
		        0x0001f800, 0x00001f80, 0x000001f8, 0x8000001f
		    ];
	
		    /**
		     * DES block cipher algorithm.
		     */
		    var DES = C_algo.DES = BlockCipher.extend({
		        _doReset: function () {
		            // Shortcuts
		            var key = this._key;
		            var keyWords = key.words;
	
		            // Select 56 bits according to PC1
		            var keyBits = [];
		            for (var i = 0; i < 56; i++) {
		                var keyBitPos = PC1[i] - 1;
		                keyBits[i] = (keyWords[keyBitPos >>> 5] >>> (31 - keyBitPos % 32)) & 1;
		            }
	
		            // Assemble 16 subkeys
		            var subKeys = this._subKeys = [];
		            for (var nSubKey = 0; nSubKey < 16; nSubKey++) {
		                // Create subkey
		                var subKey = subKeys[nSubKey] = [];
	
		                // Shortcut
		                var bitShift = BIT_SHIFTS[nSubKey];
	
		                // Select 48 bits according to PC2
		                for (var i = 0; i < 24; i++) {
		                    // Select from the left 28 key bits
		                    subKey[(i / 6) | 0] |= keyBits[((PC2[i] - 1) + bitShift) % 28] << (31 - i % 6);
	
		                    // Select from the right 28 key bits
		                    subKey[4 + ((i / 6) | 0)] |= keyBits[28 + (((PC2[i + 24] - 1) + bitShift) % 28)] << (31 - i % 6);
		                }
	
		                // Since each subkey is applied to an expanded 32-bit input,
		                // the subkey can be broken into 8 values scaled to 32-bits,
		                // which allows the key to be used without expansion
		                subKey[0] = (subKey[0] << 1) | (subKey[0] >>> 31);
		                for (var i = 1; i < 7; i++) {
		                    subKey[i] = subKey[i] >>> ((i - 1) * 4 + 3);
		                }
		                subKey[7] = (subKey[7] << 5) | (subKey[7] >>> 27);
		            }
	
		            // Compute inverse subkeys
		            var invSubKeys = this._invSubKeys = [];
		            for (var i = 0; i < 16; i++) {
		                invSubKeys[i] = subKeys[15 - i];
		            }
		        },
	
		        encryptBlock: function (M, offset) {
		            this._doCryptBlock(M, offset, this._subKeys);
		        },
	
		        decryptBlock: function (M, offset) {
		            this._doCryptBlock(M, offset, this._invSubKeys);
		        },
	
		        _doCryptBlock: function (M, offset, subKeys) {
		            // Get input
		            this._lBlock = M[offset];
		            this._rBlock = M[offset + 1];
	
		            // Initial permutation
		            exchangeLR.call(this, 4,  0x0f0f0f0f);
		            exchangeLR.call(this, 16, 0x0000ffff);
		            exchangeRL.call(this, 2,  0x33333333);
		            exchangeRL.call(this, 8,  0x00ff00ff);
		            exchangeLR.call(this, 1,  0x55555555);
	
		            // Rounds
		            for (var round = 0; round < 16; round++) {
		                // Shortcuts
		                var subKey = subKeys[round];
		                var lBlock = this._lBlock;
		                var rBlock = this._rBlock;
	
		                // Feistel function
		                var f = 0;
		                for (var i = 0; i < 8; i++) {
		                    f |= SBOX_P[i][((rBlock ^ subKey[i]) & SBOX_MASK[i]) >>> 0];
		                }
		                this._lBlock = rBlock;
		                this._rBlock = lBlock ^ f;
		            }
	
		            // Undo swap from last round
		            var t = this._lBlock;
		            this._lBlock = this._rBlock;
		            this._rBlock = t;
	
		            // Final permutation
		            exchangeLR.call(this, 1,  0x55555555);
		            exchangeRL.call(this, 8,  0x00ff00ff);
		            exchangeRL.call(this, 2,  0x33333333);
		            exchangeLR.call(this, 16, 0x0000ffff);
		            exchangeLR.call(this, 4,  0x0f0f0f0f);
	
		            // Set output
		            M[offset] = this._lBlock;
		            M[offset + 1] = this._rBlock;
		        },
	
		        keySize: 64/32,
	
		        ivSize: 64/32,
	
		        blockSize: 64/32
		    });
	
		    // Swap bits across the left and right words
		    function exchangeLR(offset, mask) {
		        var t = ((this._lBlock >>> offset) ^ this._rBlock) & mask;
		        this._rBlock ^= t;
		        this._lBlock ^= t << offset;
		    }
	
		    function exchangeRL(offset, mask) {
		        var t = ((this._rBlock >>> offset) ^ this._lBlock) & mask;
		        this._lBlock ^= t;
		        this._rBlock ^= t << offset;
		    }
	
		    /**
		     * Shortcut functions to the cipher's object interface.
		     *
		     * @example
		     *
		     *     var ciphertext = CryptoJS.DES.encrypt(message, key, cfg);
		     *     var plaintext  = CryptoJS.DES.decrypt(ciphertext, key, cfg);
		     */
		    C.DES = BlockCipher._createHelper(DES);
	
		    /**
		     * Triple-DES block cipher algorithm.
		     */
		    var TripleDES = C_algo.TripleDES = BlockCipher.extend({
		        _doReset: function () {
		            // Shortcuts
		            var key = this._key;
		            var keyWords = key.words;
	
		            // Create DES instances
		            this._des1 = DES.createEncryptor(WordArray.create(keyWords.slice(0, 2)));
		            this._des2 = DES.createEncryptor(WordArray.create(keyWords.slice(2, 4)));
		            this._des3 = DES.createEncryptor(WordArray.create(keyWords.slice(4, 6)));
		        },
	
		        encryptBlock: function (M, offset) {
		            this._des1.encryptBlock(M, offset);
		            this._des2.decryptBlock(M, offset);
		            this._des3.encryptBlock(M, offset);
		        },
	
		        decryptBlock: function (M, offset) {
		            this._des3.decryptBlock(M, offset);
		            this._des2.encryptBlock(M, offset);
		            this._des1.decryptBlock(M, offset);
		        },
	
		        keySize: 192/32,
	
		        ivSize: 64/32,
	
		        blockSize: 64/32
		    });
	
		    /**
		     * Shortcut functions to the cipher's object interface.
		     *
		     * @example
		     *
		     *     var ciphertext = CryptoJS.TripleDES.encrypt(message, key, cfg);
		     *     var plaintext  = CryptoJS.TripleDES.decrypt(ciphertext, key, cfg);
		     */
		    C.TripleDES = BlockCipher._createHelper(TripleDES);
		}());
	
	
		return CryptoJS.TripleDES;
	
	}));

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(43), __webpack_require__(47), __webpack_require__(48), __webpack_require__(58), __webpack_require__(59));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function () {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var StreamCipher = C_lib.StreamCipher;
		    var C_algo = C.algo;
	
		    /**
		     * RC4 stream cipher algorithm.
		     */
		    var RC4 = C_algo.RC4 = StreamCipher.extend({
		        _doReset: function () {
		            // Shortcuts
		            var key = this._key;
		            var keyWords = key.words;
		            var keySigBytes = key.sigBytes;
	
		            // Init sbox
		            var S = this._S = [];
		            for (var i = 0; i < 256; i++) {
		                S[i] = i;
		            }
	
		            // Key setup
		            for (var i = 0, j = 0; i < 256; i++) {
		                var keyByteIndex = i % keySigBytes;
		                var keyByte = (keyWords[keyByteIndex >>> 2] >>> (24 - (keyByteIndex % 4) * 8)) & 0xff;
	
		                j = (j + S[i] + keyByte) % 256;
	
		                // Swap
		                var t = S[i];
		                S[i] = S[j];
		                S[j] = t;
		            }
	
		            // Counters
		            this._i = this._j = 0;
		        },
	
		        _doProcessBlock: function (M, offset) {
		            M[offset] ^= generateKeystreamWord.call(this);
		        },
	
		        keySize: 256/32,
	
		        ivSize: 0
		    });
	
		    function generateKeystreamWord() {
		        // Shortcuts
		        var S = this._S;
		        var i = this._i;
		        var j = this._j;
	
		        // Generate keystream word
		        var keystreamWord = 0;
		        for (var n = 0; n < 4; n++) {
		            i = (i + 1) % 256;
		            j = (j + S[i]) % 256;
	
		            // Swap
		            var t = S[i];
		            S[i] = S[j];
		            S[j] = t;
	
		            keystreamWord |= S[(S[i] + S[j]) % 256] << (24 - n * 8);
		        }
	
		        // Update counters
		        this._i = i;
		        this._j = j;
	
		        return keystreamWord;
		    }
	
		    /**
		     * Shortcut functions to the cipher's object interface.
		     *
		     * @example
		     *
		     *     var ciphertext = CryptoJS.RC4.encrypt(message, key, cfg);
		     *     var plaintext  = CryptoJS.RC4.decrypt(ciphertext, key, cfg);
		     */
		    C.RC4 = StreamCipher._createHelper(RC4);
	
		    /**
		     * Modified RC4 stream cipher algorithm.
		     */
		    var RC4Drop = C_algo.RC4Drop = RC4.extend({
		        /**
		         * Configuration options.
		         *
		         * @property {number} drop The number of keystream words to drop. Default 192
		         */
		        cfg: RC4.cfg.extend({
		            drop: 192
		        }),
	
		        _doReset: function () {
		            RC4._doReset.call(this);
	
		            // Drop
		            for (var i = this.cfg.drop; i > 0; i--) {
		                generateKeystreamWord.call(this);
		            }
		        }
		    });
	
		    /**
		     * Shortcut functions to the cipher's object interface.
		     *
		     * @example
		     *
		     *     var ciphertext = CryptoJS.RC4Drop.encrypt(message, key, cfg);
		     *     var plaintext  = CryptoJS.RC4Drop.decrypt(ciphertext, key, cfg);
		     */
		    C.RC4Drop = StreamCipher._createHelper(RC4Drop);
		}());
	
	
		return CryptoJS.RC4;
	
	}));

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(43), __webpack_require__(47), __webpack_require__(48), __webpack_require__(58), __webpack_require__(59));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function () {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var StreamCipher = C_lib.StreamCipher;
		    var C_algo = C.algo;
	
		    // Reusable objects
		    var S  = [];
		    var C_ = [];
		    var G  = [];
	
		    /**
		     * Rabbit stream cipher algorithm
		     */
		    var Rabbit = C_algo.Rabbit = StreamCipher.extend({
		        _doReset: function () {
		            // Shortcuts
		            var K = this._key.words;
		            var iv = this.cfg.iv;
	
		            // Swap endian
		            for (var i = 0; i < 4; i++) {
		                K[i] = (((K[i] << 8)  | (K[i] >>> 24)) & 0x00ff00ff) |
		                       (((K[i] << 24) | (K[i] >>> 8))  & 0xff00ff00);
		            }
	
		            // Generate initial state values
		            var X = this._X = [
		                K[0], (K[3] << 16) | (K[2] >>> 16),
		                K[1], (K[0] << 16) | (K[3] >>> 16),
		                K[2], (K[1] << 16) | (K[0] >>> 16),
		                K[3], (K[2] << 16) | (K[1] >>> 16)
		            ];
	
		            // Generate initial counter values
		            var C = this._C = [
		                (K[2] << 16) | (K[2] >>> 16), (K[0] & 0xffff0000) | (K[1] & 0x0000ffff),
		                (K[3] << 16) | (K[3] >>> 16), (K[1] & 0xffff0000) | (K[2] & 0x0000ffff),
		                (K[0] << 16) | (K[0] >>> 16), (K[2] & 0xffff0000) | (K[3] & 0x0000ffff),
		                (K[1] << 16) | (K[1] >>> 16), (K[3] & 0xffff0000) | (K[0] & 0x0000ffff)
		            ];
	
		            // Carry bit
		            this._b = 0;
	
		            // Iterate the system four times
		            for (var i = 0; i < 4; i++) {
		                nextState.call(this);
		            }
	
		            // Modify the counters
		            for (var i = 0; i < 8; i++) {
		                C[i] ^= X[(i + 4) & 7];
		            }
	
		            // IV setup
		            if (iv) {
		                // Shortcuts
		                var IV = iv.words;
		                var IV_0 = IV[0];
		                var IV_1 = IV[1];
	
		                // Generate four subvectors
		                var i0 = (((IV_0 << 8) | (IV_0 >>> 24)) & 0x00ff00ff) | (((IV_0 << 24) | (IV_0 >>> 8)) & 0xff00ff00);
		                var i2 = (((IV_1 << 8) | (IV_1 >>> 24)) & 0x00ff00ff) | (((IV_1 << 24) | (IV_1 >>> 8)) & 0xff00ff00);
		                var i1 = (i0 >>> 16) | (i2 & 0xffff0000);
		                var i3 = (i2 << 16)  | (i0 & 0x0000ffff);
	
		                // Modify counter values
		                C[0] ^= i0;
		                C[1] ^= i1;
		                C[2] ^= i2;
		                C[3] ^= i3;
		                C[4] ^= i0;
		                C[5] ^= i1;
		                C[6] ^= i2;
		                C[7] ^= i3;
	
		                // Iterate the system four times
		                for (var i = 0; i < 4; i++) {
		                    nextState.call(this);
		                }
		            }
		        },
	
		        _doProcessBlock: function (M, offset) {
		            // Shortcut
		            var X = this._X;
	
		            // Iterate the system
		            nextState.call(this);
	
		            // Generate four keystream words
		            S[0] = X[0] ^ (X[5] >>> 16) ^ (X[3] << 16);
		            S[1] = X[2] ^ (X[7] >>> 16) ^ (X[5] << 16);
		            S[2] = X[4] ^ (X[1] >>> 16) ^ (X[7] << 16);
		            S[3] = X[6] ^ (X[3] >>> 16) ^ (X[1] << 16);
	
		            for (var i = 0; i < 4; i++) {
		                // Swap endian
		                S[i] = (((S[i] << 8)  | (S[i] >>> 24)) & 0x00ff00ff) |
		                       (((S[i] << 24) | (S[i] >>> 8))  & 0xff00ff00);
	
		                // Encrypt
		                M[offset + i] ^= S[i];
		            }
		        },
	
		        blockSize: 128/32,
	
		        ivSize: 64/32
		    });
	
		    function nextState() {
		        // Shortcuts
		        var X = this._X;
		        var C = this._C;
	
		        // Save old counter values
		        for (var i = 0; i < 8; i++) {
		            C_[i] = C[i];
		        }
	
		        // Calculate new counter values
		        C[0] = (C[0] + 0x4d34d34d + this._b) | 0;
		        C[1] = (C[1] + 0xd34d34d3 + ((C[0] >>> 0) < (C_[0] >>> 0) ? 1 : 0)) | 0;
		        C[2] = (C[2] + 0x34d34d34 + ((C[1] >>> 0) < (C_[1] >>> 0) ? 1 : 0)) | 0;
		        C[3] = (C[3] + 0x4d34d34d + ((C[2] >>> 0) < (C_[2] >>> 0) ? 1 : 0)) | 0;
		        C[4] = (C[4] + 0xd34d34d3 + ((C[3] >>> 0) < (C_[3] >>> 0) ? 1 : 0)) | 0;
		        C[5] = (C[5] + 0x34d34d34 + ((C[4] >>> 0) < (C_[4] >>> 0) ? 1 : 0)) | 0;
		        C[6] = (C[6] + 0x4d34d34d + ((C[5] >>> 0) < (C_[5] >>> 0) ? 1 : 0)) | 0;
		        C[7] = (C[7] + 0xd34d34d3 + ((C[6] >>> 0) < (C_[6] >>> 0) ? 1 : 0)) | 0;
		        this._b = (C[7] >>> 0) < (C_[7] >>> 0) ? 1 : 0;
	
		        // Calculate the g-values
		        for (var i = 0; i < 8; i++) {
		            var gx = X[i] + C[i];
	
		            // Construct high and low argument for squaring
		            var ga = gx & 0xffff;
		            var gb = gx >>> 16;
	
		            // Calculate high and low result of squaring
		            var gh = ((((ga * ga) >>> 17) + ga * gb) >>> 15) + gb * gb;
		            var gl = (((gx & 0xffff0000) * gx) | 0) + (((gx & 0x0000ffff) * gx) | 0);
	
		            // High XOR low
		            G[i] = gh ^ gl;
		        }
	
		        // Calculate new state values
		        X[0] = (G[0] + ((G[7] << 16) | (G[7] >>> 16)) + ((G[6] << 16) | (G[6] >>> 16))) | 0;
		        X[1] = (G[1] + ((G[0] << 8)  | (G[0] >>> 24)) + G[7]) | 0;
		        X[2] = (G[2] + ((G[1] << 16) | (G[1] >>> 16)) + ((G[0] << 16) | (G[0] >>> 16))) | 0;
		        X[3] = (G[3] + ((G[2] << 8)  | (G[2] >>> 24)) + G[1]) | 0;
		        X[4] = (G[4] + ((G[3] << 16) | (G[3] >>> 16)) + ((G[2] << 16) | (G[2] >>> 16))) | 0;
		        X[5] = (G[5] + ((G[4] << 8)  | (G[4] >>> 24)) + G[3]) | 0;
		        X[6] = (G[6] + ((G[5] << 16) | (G[5] >>> 16)) + ((G[4] << 16) | (G[4] >>> 16))) | 0;
		        X[7] = (G[7] + ((G[6] << 8)  | (G[6] >>> 24)) + G[5]) | 0;
		    }
	
		    /**
		     * Shortcut functions to the cipher's object interface.
		     *
		     * @example
		     *
		     *     var ciphertext = CryptoJS.Rabbit.encrypt(message, key, cfg);
		     *     var plaintext  = CryptoJS.Rabbit.decrypt(ciphertext, key, cfg);
		     */
		    C.Rabbit = StreamCipher._createHelper(Rabbit);
		}());
	
	
		return CryptoJS.Rabbit;
	
	}));

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

	;(function (root, factory, undef) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(43), __webpack_require__(47), __webpack_require__(48), __webpack_require__(58), __webpack_require__(59));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {
	
		(function () {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var StreamCipher = C_lib.StreamCipher;
		    var C_algo = C.algo;
	
		    // Reusable objects
		    var S  = [];
		    var C_ = [];
		    var G  = [];
	
		    /**
		     * Rabbit stream cipher algorithm.
		     *
		     * This is a legacy version that neglected to convert the key to little-endian.
		     * This error doesn't affect the cipher's security,
		     * but it does affect its compatibility with other implementations.
		     */
		    var RabbitLegacy = C_algo.RabbitLegacy = StreamCipher.extend({
		        _doReset: function () {
		            // Shortcuts
		            var K = this._key.words;
		            var iv = this.cfg.iv;
	
		            // Generate initial state values
		            var X = this._X = [
		                K[0], (K[3] << 16) | (K[2] >>> 16),
		                K[1], (K[0] << 16) | (K[3] >>> 16),
		                K[2], (K[1] << 16) | (K[0] >>> 16),
		                K[3], (K[2] << 16) | (K[1] >>> 16)
		            ];
	
		            // Generate initial counter values
		            var C = this._C = [
		                (K[2] << 16) | (K[2] >>> 16), (K[0] & 0xffff0000) | (K[1] & 0x0000ffff),
		                (K[3] << 16) | (K[3] >>> 16), (K[1] & 0xffff0000) | (K[2] & 0x0000ffff),
		                (K[0] << 16) | (K[0] >>> 16), (K[2] & 0xffff0000) | (K[3] & 0x0000ffff),
		                (K[1] << 16) | (K[1] >>> 16), (K[3] & 0xffff0000) | (K[0] & 0x0000ffff)
		            ];
	
		            // Carry bit
		            this._b = 0;
	
		            // Iterate the system four times
		            for (var i = 0; i < 4; i++) {
		                nextState.call(this);
		            }
	
		            // Modify the counters
		            for (var i = 0; i < 8; i++) {
		                C[i] ^= X[(i + 4) & 7];
		            }
	
		            // IV setup
		            if (iv) {
		                // Shortcuts
		                var IV = iv.words;
		                var IV_0 = IV[0];
		                var IV_1 = IV[1];
	
		                // Generate four subvectors
		                var i0 = (((IV_0 << 8) | (IV_0 >>> 24)) & 0x00ff00ff) | (((IV_0 << 24) | (IV_0 >>> 8)) & 0xff00ff00);
		                var i2 = (((IV_1 << 8) | (IV_1 >>> 24)) & 0x00ff00ff) | (((IV_1 << 24) | (IV_1 >>> 8)) & 0xff00ff00);
		                var i1 = (i0 >>> 16) | (i2 & 0xffff0000);
		                var i3 = (i2 << 16)  | (i0 & 0x0000ffff);
	
		                // Modify counter values
		                C[0] ^= i0;
		                C[1] ^= i1;
		                C[2] ^= i2;
		                C[3] ^= i3;
		                C[4] ^= i0;
		                C[5] ^= i1;
		                C[6] ^= i2;
		                C[7] ^= i3;
	
		                // Iterate the system four times
		                for (var i = 0; i < 4; i++) {
		                    nextState.call(this);
		                }
		            }
		        },
	
		        _doProcessBlock: function (M, offset) {
		            // Shortcut
		            var X = this._X;
	
		            // Iterate the system
		            nextState.call(this);
	
		            // Generate four keystream words
		            S[0] = X[0] ^ (X[5] >>> 16) ^ (X[3] << 16);
		            S[1] = X[2] ^ (X[7] >>> 16) ^ (X[5] << 16);
		            S[2] = X[4] ^ (X[1] >>> 16) ^ (X[7] << 16);
		            S[3] = X[6] ^ (X[3] >>> 16) ^ (X[1] << 16);
	
		            for (var i = 0; i < 4; i++) {
		                // Swap endian
		                S[i] = (((S[i] << 8)  | (S[i] >>> 24)) & 0x00ff00ff) |
		                       (((S[i] << 24) | (S[i] >>> 8))  & 0xff00ff00);
	
		                // Encrypt
		                M[offset + i] ^= S[i];
		            }
		        },
	
		        blockSize: 128/32,
	
		        ivSize: 64/32
		    });
	
		    function nextState() {
		        // Shortcuts
		        var X = this._X;
		        var C = this._C;
	
		        // Save old counter values
		        for (var i = 0; i < 8; i++) {
		            C_[i] = C[i];
		        }
	
		        // Calculate new counter values
		        C[0] = (C[0] + 0x4d34d34d + this._b) | 0;
		        C[1] = (C[1] + 0xd34d34d3 + ((C[0] >>> 0) < (C_[0] >>> 0) ? 1 : 0)) | 0;
		        C[2] = (C[2] + 0x34d34d34 + ((C[1] >>> 0) < (C_[1] >>> 0) ? 1 : 0)) | 0;
		        C[3] = (C[3] + 0x4d34d34d + ((C[2] >>> 0) < (C_[2] >>> 0) ? 1 : 0)) | 0;
		        C[4] = (C[4] + 0xd34d34d3 + ((C[3] >>> 0) < (C_[3] >>> 0) ? 1 : 0)) | 0;
		        C[5] = (C[5] + 0x34d34d34 + ((C[4] >>> 0) < (C_[4] >>> 0) ? 1 : 0)) | 0;
		        C[6] = (C[6] + 0x4d34d34d + ((C[5] >>> 0) < (C_[5] >>> 0) ? 1 : 0)) | 0;
		        C[7] = (C[7] + 0xd34d34d3 + ((C[6] >>> 0) < (C_[6] >>> 0) ? 1 : 0)) | 0;
		        this._b = (C[7] >>> 0) < (C_[7] >>> 0) ? 1 : 0;
	
		        // Calculate the g-values
		        for (var i = 0; i < 8; i++) {
		            var gx = X[i] + C[i];
	
		            // Construct high and low argument for squaring
		            var ga = gx & 0xffff;
		            var gb = gx >>> 16;
	
		            // Calculate high and low result of squaring
		            var gh = ((((ga * ga) >>> 17) + ga * gb) >>> 15) + gb * gb;
		            var gl = (((gx & 0xffff0000) * gx) | 0) + (((gx & 0x0000ffff) * gx) | 0);
	
		            // High XOR low
		            G[i] = gh ^ gl;
		        }
	
		        // Calculate new state values
		        X[0] = (G[0] + ((G[7] << 16) | (G[7] >>> 16)) + ((G[6] << 16) | (G[6] >>> 16))) | 0;
		        X[1] = (G[1] + ((G[0] << 8)  | (G[0] >>> 24)) + G[7]) | 0;
		        X[2] = (G[2] + ((G[1] << 16) | (G[1] >>> 16)) + ((G[0] << 16) | (G[0] >>> 16))) | 0;
		        X[3] = (G[3] + ((G[2] << 8)  | (G[2] >>> 24)) + G[1]) | 0;
		        X[4] = (G[4] + ((G[3] << 16) | (G[3] >>> 16)) + ((G[2] << 16) | (G[2] >>> 16))) | 0;
		        X[5] = (G[5] + ((G[4] << 8)  | (G[4] >>> 24)) + G[3]) | 0;
		        X[6] = (G[6] + ((G[5] << 16) | (G[5] >>> 16)) + ((G[4] << 16) | (G[4] >>> 16))) | 0;
		        X[7] = (G[7] + ((G[6] << 8)  | (G[6] >>> 24)) + G[5]) | 0;
		    }
	
		    /**
		     * Shortcut functions to the cipher's object interface.
		     *
		     * @example
		     *
		     *     var ciphertext = CryptoJS.RabbitLegacy.encrypt(message, key, cfg);
		     *     var plaintext  = CryptoJS.RabbitLegacy.decrypt(ciphertext, key, cfg);
		     */
		    C.RabbitLegacy = StreamCipher._createHelper(RabbitLegacy);
		}());
	
	
		return CryptoJS.RabbitLegacy;
	
	}));

/***/ }),
/* 76 */
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
	var axios = __webpack_require__(77);
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
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(78);

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var defaults = __webpack_require__(79);
	var utils = __webpack_require__(80);
	var dispatchRequest = __webpack_require__(81);
	var InterceptorManager = __webpack_require__(89);
	var isAbsoluteURL = __webpack_require__(90);
	var combineURLs = __webpack_require__(91);
	var bind = __webpack_require__(92);
	var transformData = __webpack_require__(85);
	
	function Axios(defaultConfig) {
	  this.defaults = utils.merge({}, defaultConfig);
	  this.interceptors = {
	    request: new InterceptorManager(),
	    response: new InterceptorManager()
	  };
	}
	
	Axios.prototype.request = function request(config) {
	  /*eslint no-param-reassign:0*/
	  // Allow for axios('example/url'[, config]) a la fetch API
	  if (typeof config === 'string') {
	    config = utils.merge({
	      url: arguments[0]
	    }, arguments[1]);
	  }
	
	  config = utils.merge(defaults, this.defaults, { method: 'get' }, config);
	
	  // Support baseURL config
	  if (config.baseURL && !isAbsoluteURL(config.url)) {
	    config.url = combineURLs(config.baseURL, config.url);
	  }
	
	  // Don't allow overriding defaults.withCredentials
	  config.withCredentials = config.withCredentials || this.defaults.withCredentials;
	
	  // Transform request data
	  config.data = transformData(
	    config.data,
	    config.headers,
	    config.transformRequest
	  );
	
	  // Flatten headers
	  config.headers = utils.merge(
	    config.headers.common || {},
	    config.headers[config.method] || {},
	    config.headers || {}
	  );
	
	  utils.forEach(
	    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
	    function cleanHeaderConfig(method) {
	      delete config.headers[method];
	    }
	  );
	
	  // Hook up interceptors middleware
	  var chain = [dispatchRequest, undefined];
	  var promise = Promise.resolve(config);
	
	  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
	    chain.unshift(interceptor.fulfilled, interceptor.rejected);
	  });
	
	  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
	    chain.push(interceptor.fulfilled, interceptor.rejected);
	  });
	
	  while (chain.length) {
	    promise = promise.then(chain.shift(), chain.shift());
	  }
	
	  return promise;
	};
	
	var defaultInstance = new Axios(defaults);
	var axios = module.exports = bind(Axios.prototype.request, defaultInstance);
	
	// Expose properties from defaultInstance
	axios.defaults = defaultInstance.defaults;
	axios.interceptors = defaultInstance.interceptors;
	
	// Factory for creating new instances
	axios.create = function create(defaultConfig) {
	  return new Axios(defaultConfig);
	};
	
	// Expose all/spread
	axios.all = function all(promises) {
	  return Promise.all(promises);
	};
	axios.spread = __webpack_require__(93);
	
	// Provide aliases for supported request methods
	utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
	  /*eslint func-names:0*/
	  Axios.prototype[method] = function(url, config) {
	    return this.request(utils.merge(config || {}, {
	      method: method,
	      url: url
	    }));
	  };
	  axios[method] = bind(Axios.prototype[method], defaultInstance);
	});
	
	utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	  /*eslint func-names:0*/
	  Axios.prototype[method] = function(url, data, config) {
	    return this.request(utils.merge(config || {}, {
	      method: method,
	      url: url,
	      data: data
	    }));
	  };
	  axios[method] = bind(Axios.prototype[method], defaultInstance);
	});


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(80);
	
	var PROTECTION_PREFIX = /^\)\]\}',?\n/;
	var DEFAULT_CONTENT_TYPE = {
	  'Content-Type': 'application/x-www-form-urlencoded'
	};
	
	module.exports = {
	  transformRequest: [function transformRequestJSON(data, headers) {
	    if (utils.isFormData(data)) {
	      return data;
	    }
	    if (utils.isArrayBuffer(data)) {
	      return data;
	    }
	    if (utils.isArrayBufferView(data)) {
	      return data.buffer;
	    }
	    if (utils.isObject(data) && !utils.isFile(data) && !utils.isBlob(data)) {
	      // Set application/json if no Content-Type has been specified
	      if (!utils.isUndefined(headers)) {
	        utils.forEach(headers, function processContentTypeHeader(val, key) {
	          if (key.toLowerCase() === 'content-type') {
	            headers['Content-Type'] = val;
	          }
	        });
	
	        if (utils.isUndefined(headers['Content-Type'])) {
	          headers['Content-Type'] = 'application/json;charset=utf-8';
	        }
	      }
	      return JSON.stringify(data);
	    }
	    return data;
	  }],
	
	  transformResponse: [function transformResponseJSON(data) {
	    /*eslint no-param-reassign:0*/
	    if (typeof data === 'string') {
	      data = data.replace(PROTECTION_PREFIX, '');
	      try {
	        data = JSON.parse(data);
	      } catch (e) { /* Ignore */ }
	    }
	    return data;
	  }],
	
	  headers: {
	    common: {
	      'Accept': 'application/json, text/plain, */*'
	    },
	    patch: utils.merge(DEFAULT_CONTENT_TYPE),
	    post: utils.merge(DEFAULT_CONTENT_TYPE),
	    put: utils.merge(DEFAULT_CONTENT_TYPE)
	  },
	
	  timeout: 0,
	
	  xsrfCookieName: 'XSRF-TOKEN',
	  xsrfHeaderName: 'X-XSRF-TOKEN',
	
	  maxContentLength: -1
	};


/***/ }),
/* 80 */
/***/ (function(module, exports) {

	'use strict';
	
	/*global toString:true*/
	
	// utils is a library of generic helper functions non-specific to axios
	
	var toString = Object.prototype.toString;
	
	/**
	 * Determine if a value is an Array
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Array, otherwise false
	 */
	function isArray(val) {
	  return toString.call(val) === '[object Array]';
	}
	
	/**
	 * Determine if a value is an ArrayBuffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
	 */
	function isArrayBuffer(val) {
	  return toString.call(val) === '[object ArrayBuffer]';
	}
	
	/**
	 * Determine if a value is a FormData
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an FormData, otherwise false
	 */
	function isFormData(val) {
	  return toString.call(val) === '[object FormData]';
	}
	
	/**
	 * Determine if a value is a view on an ArrayBuffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
	 */
	function isArrayBufferView(val) {
	  var result;
	  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
	    result = ArrayBuffer.isView(val);
	  } else {
	    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
	  }
	  return result;
	}
	
	/**
	 * Determine if a value is a String
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a String, otherwise false
	 */
	function isString(val) {
	  return typeof val === 'string';
	}
	
	/**
	 * Determine if a value is a Number
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Number, otherwise false
	 */
	function isNumber(val) {
	  return typeof val === 'number';
	}
	
	/**
	 * Determine if a value is undefined
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if the value is undefined, otherwise false
	 */
	function isUndefined(val) {
	  return typeof val === 'undefined';
	}
	
	/**
	 * Determine if a value is an Object
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Object, otherwise false
	 */
	function isObject(val) {
	  return val !== null && typeof val === 'object';
	}
	
	/**
	 * Determine if a value is a Date
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Date, otherwise false
	 */
	function isDate(val) {
	  return toString.call(val) === '[object Date]';
	}
	
	/**
	 * Determine if a value is a File
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a File, otherwise false
	 */
	function isFile(val) {
	  return toString.call(val) === '[object File]';
	}
	
	/**
	 * Determine if a value is a Blob
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Blob, otherwise false
	 */
	function isBlob(val) {
	  return toString.call(val) === '[object Blob]';
	}
	
	/**
	 * Trim excess whitespace off the beginning and end of a string
	 *
	 * @param {String} str The String to trim
	 * @returns {String} The String freed of excess whitespace
	 */
	function trim(str) {
	  return str.replace(/^\s*/, '').replace(/\s*$/, '');
	}
	
	/**
	 * Determine if we're running in a standard browser environment
	 *
	 * This allows axios to run in a web worker, and react-native.
	 * Both environments support XMLHttpRequest, but not fully standard globals.
	 *
	 * web workers:
	 *  typeof window -> undefined
	 *  typeof document -> undefined
	 *
	 * react-native:
	 *  typeof document.createElement -> undefined
	 */
	function isStandardBrowserEnv() {
	  return (
	    typeof window !== 'undefined' &&
	    typeof document !== 'undefined' &&
	    typeof document.createElement === 'function'
	  );
	}
	
	/**
	 * Iterate over an Array or an Object invoking a function for each item.
	 *
	 * If `obj` is an Array callback will be called passing
	 * the value, index, and complete array for each item.
	 *
	 * If 'obj' is an Object callback will be called passing
	 * the value, key, and complete object for each property.
	 *
	 * @param {Object|Array} obj The object to iterate
	 * @param {Function} fn The callback to invoke for each item
	 */
	function forEach(obj, fn) {
	  // Don't bother if no value provided
	  if (obj === null || typeof obj === 'undefined') {
	    return;
	  }
	
	  // Force an array if not already something iterable
	  if (typeof obj !== 'object' && !isArray(obj)) {
	    /*eslint no-param-reassign:0*/
	    obj = [obj];
	  }
	
	  if (isArray(obj)) {
	    // Iterate over array values
	    for (var i = 0, l = obj.length; i < l; i++) {
	      fn.call(null, obj[i], i, obj);
	    }
	  } else {
	    // Iterate over object keys
	    for (var key in obj) {
	      if (obj.hasOwnProperty(key)) {
	        fn.call(null, obj[key], key, obj);
	      }
	    }
	  }
	}
	
	/**
	 * Accepts varargs expecting each argument to be an object, then
	 * immutably merges the properties of each object and returns result.
	 *
	 * When multiple objects contain the same key the later object in
	 * the arguments list will take precedence.
	 *
	 * Example:
	 *
	 * ```js
	 * var result = merge({foo: 123}, {foo: 456});
	 * console.log(result.foo); // outputs 456
	 * ```
	 *
	 * @param {Object} obj1 Object to merge
	 * @returns {Object} Result of all merge properties
	 */
	function merge(/* obj1, obj2, obj3, ... */) {
	  var result = {};
	  function assignValue(val, key) {
	    if (typeof result[key] === 'object' && typeof val === 'object') {
	      result[key] = merge(result[key], val);
	    } else {
	      result[key] = val;
	    }
	  }
	
	  for (var i = 0, l = arguments.length; i < l; i++) {
	    forEach(arguments[i], assignValue);
	  }
	  return result;
	}
	
	module.exports = {
	  isArray: isArray,
	  isArrayBuffer: isArrayBuffer,
	  isFormData: isFormData,
	  isArrayBufferView: isArrayBufferView,
	  isString: isString,
	  isNumber: isNumber,
	  isObject: isObject,
	  isUndefined: isUndefined,
	  isDate: isDate,
	  isFile: isFile,
	  isBlob: isBlob,
	  isStandardBrowserEnv: isStandardBrowserEnv,
	  forEach: forEach,
	  merge: merge,
	  trim: trim
	};


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	/**
	 * Dispatch a request to the server using whichever adapter
	 * is supported by the current environment.
	 *
	 * @param {object} config The config that is to be used for the request
	 * @returns {Promise} The Promise to be fulfilled
	 */
	module.exports = function dispatchRequest(config) {
	  return new Promise(function executor(resolve, reject) {
	    try {
	      var adapter;
	
	      if (typeof config.adapter === 'function') {
	        // For custom adapter support
	        adapter = config.adapter;
	      } else if (typeof XMLHttpRequest !== 'undefined') {
	        // For browsers use XHR adapter
	        adapter = __webpack_require__(82);
	      } else if (typeof process !== 'undefined') {
	        // For node use HTTP adapter
	        adapter = __webpack_require__(82);
	      }
	
	      if (typeof adapter === 'function') {
	        adapter(resolve, reject, config);
	      }
	    } catch (e) {
	      reject(e);
	    }
	  });
	};
	
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	var utils = __webpack_require__(80);
	var buildURL = __webpack_require__(83);
	var parseHeaders = __webpack_require__(84);
	var transformData = __webpack_require__(85);
	var isURLSameOrigin = __webpack_require__(86);
	var btoa = (typeof window !== 'undefined' && window.btoa) || __webpack_require__(87);
	
	module.exports = function xhrAdapter(resolve, reject, config) {
	  var requestData = config.data;
	  var requestHeaders = config.headers;
	
	  if (utils.isFormData(requestData)) {
	    delete requestHeaders['Content-Type']; // Let the browser set it
	  }
	
	  var request = new XMLHttpRequest();
	  var loadEvent = 'onreadystatechange';
	  var xDomain = false;
	
	  // For IE 8/9 CORS support
	  // Only supports POST and GET calls and doesn't returns the response headers.
	  // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
	  if (process.env.NODE_ENV !== 'test' && typeof window !== 'undefined' && window.XDomainRequest && !('withCredentials' in request) && !isURLSameOrigin(config.url)) {
	    request = new window.XDomainRequest();
	    loadEvent = 'onload';
	    xDomain = true;
	  }
	
	  // HTTP basic authentication
	  if (config.auth) {
	    var username = config.auth.username || '';
	    var password = config.auth.password || '';
	    requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
	  }
	
	  request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);
	
	  // Set the request timeout in MS
	  request.timeout = config.timeout;
	
	  // For IE 9 CORS support.
	  request.onprogress = function handleProgress() {};
	  request.ontimeout = function handleTimeout() {};
	
	  // Listen for ready state
	  request[loadEvent] = function handleLoad() {
	    if (!request || (request.readyState !== 4 && !xDomain)) {
	      return;
	    }
	
	    // The request errored out and we didn't get a response, this will be
	    // handled by onerror instead
	    if (request.status === 0) {
	      return;
	    }
	
	    // Prepare the response
	    var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
	    var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
	    var response = {
	      data: transformData(
	        responseData,
	        responseHeaders,
	        config.transformResponse
	      ),
	      // IE sends 1223 instead of 204 (https://github.com/mzabriskie/axios/issues/201)
	      status: request.status === 1223 ? 204 : request.status,
	      statusText: request.status === 1223 ? 'No Content' : request.statusText,
	      headers: responseHeaders,
	      config: config,
	      request: request
	    };
	
	    // Resolve or reject the Promise based on the status
	    ((response.status >= 200 && response.status < 300) ||
	     (!('status' in request) && request.responseText) ?
	      resolve :
	      reject)(response);
	
	    // Clean up request
	    request = null;
	  };
	
	  // Handle low level network errors
	  request.onerror = function handleError() {
	    // Real errors are hidden from us by the browser
	    // onerror should only fire if it's a network error
	    reject(new Error('Network Error'));
	
	    // Clean up request
	    request = null;
	  };
	
	  // Handle timeout
	  request.ontimeout = function handleTimeout() {
	    var err = new Error('timeout of ' + config.timeout + 'ms exceeded');
	    err.timeout = config.timeout;
	    err.code = 'ECONNABORTED';
	    reject(err);
	
	    // Clean up request
	    request = null;
	  };
	
	  // Add xsrf header
	  // This is only done if running in a standard browser environment.
	  // Specifically not if we're in a web worker, or react-native.
	  if (utils.isStandardBrowserEnv()) {
	    var cookies = __webpack_require__(88);
	
	    // Add xsrf header
	    var xsrfValue = config.withCredentials || isURLSameOrigin(config.url) ?
	        cookies.read(config.xsrfCookieName) :
	        undefined;
	
	    if (xsrfValue) {
	      requestHeaders[config.xsrfHeaderName] = xsrfValue;
	    }
	  }
	
	  // Add headers to the request
	  if ('setRequestHeader' in request) {
	    utils.forEach(requestHeaders, function setRequestHeader(val, key) {
	      if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
	        // Remove Content-Type if data is undefined
	        delete requestHeaders[key];
	      } else {
	        // Otherwise add header to the request
	        request.setRequestHeader(key, val);
	      }
	    });
	  }
	
	  // Add withCredentials to request if needed
	  if (config.withCredentials) {
	    request.withCredentials = true;
	  }
	
	  // Add responseType to request if needed
	  if (config.responseType) {
	    try {
	      request.responseType = config.responseType;
	    } catch (e) {
	      if (request.responseType !== 'json') {
	        throw e;
	      }
	    }
	  }
	
	  // Handle progress if needed
	  if (config.progress) {
	    if (config.method === 'post' || config.method === 'put') {
	      request.upload.addEventListener('progress', config.progress);
	    } else if (config.method === 'get') {
	      request.addEventListener('progress', config.progress);
	    }
	  }
	
	  // Format request data
	  if (utils.isArrayBuffer(requestData)) {
	    requestData = new DataView(requestData);
	  }
	
	  if (requestData === undefined) {
	    requestData = null;
	  }
	
	  // Send the request
	  request.send(requestData);
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(80);
	
	function encode(val) {
	  return encodeURIComponent(val).
	    replace(/%40/gi, '@').
	    replace(/%3A/gi, ':').
	    replace(/%24/g, '$').
	    replace(/%2C/gi, ',').
	    replace(/%20/g, '+').
	    replace(/%5B/gi, '[').
	    replace(/%5D/gi, ']');
	}
	
	/**
	 * Build a URL by appending params to the end
	 *
	 * @param {string} url The base of the url (e.g., http://www.google.com)
	 * @param {object} [params] The params to be appended
	 * @returns {string} The formatted url
	 */
	module.exports = function buildURL(url, params, paramsSerializer) {
	  /*eslint no-param-reassign:0*/
	  if (!params) {
	    return url;
	  }
	
	  var serializedParams;
	  if (paramsSerializer) {
	    serializedParams = paramsSerializer(params);
	  } else {
	    var parts = [];
	
	    utils.forEach(params, function serialize(val, key) {
	      if (val === null || typeof val === 'undefined') {
	        return;
	      }
	
	      if (utils.isArray(val)) {
	        key = key + '[]';
	      }
	
	      if (!utils.isArray(val)) {
	        val = [val];
	      }
	
	      utils.forEach(val, function parseValue(v) {
	        if (utils.isDate(v)) {
	          v = v.toISOString();
	        } else if (utils.isObject(v)) {
	          v = JSON.stringify(v);
	        }
	        parts.push(encode(key) + '=' + encode(v));
	      });
	    });
	
	    serializedParams = parts.join('&');
	  }
	
	  if (serializedParams) {
	    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
	  }
	
	  return url;
	};
	


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(80);
	
	/**
	 * Parse headers into an object
	 *
	 * ```
	 * Date: Wed, 27 Aug 2014 08:58:49 GMT
	 * Content-Type: application/json
	 * Connection: keep-alive
	 * Transfer-Encoding: chunked
	 * ```
	 *
	 * @param {String} headers Headers needing to be parsed
	 * @returns {Object} Headers parsed into an object
	 */
	module.exports = function parseHeaders(headers) {
	  var parsed = {};
	  var key;
	  var val;
	  var i;
	
	  if (!headers) { return parsed; }
	
	  utils.forEach(headers.split('\n'), function parser(line) {
	    i = line.indexOf(':');
	    key = utils.trim(line.substr(0, i)).toLowerCase();
	    val = utils.trim(line.substr(i + 1));
	
	    if (key) {
	      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
	    }
	  });
	
	  return parsed;
	};


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(80);
	
	/**
	 * Transform the data for a request or a response
	 *
	 * @param {Object|String} data The data to be transformed
	 * @param {Array} headers The headers for the request or response
	 * @param {Array|Function} fns A single function or Array of functions
	 * @returns {*} The resulting transformed data
	 */
	module.exports = function transformData(data, headers, fns) {
	  /*eslint no-param-reassign:0*/
	  utils.forEach(fns, function transform(fn) {
	    data = fn(data, headers);
	  });
	
	  return data;
	};


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(80);
	
	module.exports = (
	  utils.isStandardBrowserEnv() ?
	
	  // Standard browser envs have full support of the APIs needed to test
	  // whether the request URL is of the same origin as current location.
	  (function standardBrowserEnv() {
	    var msie = /(msie|trident)/i.test(navigator.userAgent);
	    var urlParsingNode = document.createElement('a');
	    var originURL;
	
	    /**
	    * Parse a URL to discover it's components
	    *
	    * @param {String} url The URL to be parsed
	    * @returns {Object}
	    */
	    function resolveURL(url) {
	      var href = url;
	
	      if (msie) {
	        // IE needs attribute set twice to normalize properties
	        urlParsingNode.setAttribute('href', href);
	        href = urlParsingNode.href;
	      }
	
	      urlParsingNode.setAttribute('href', href);
	
	      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
	      return {
	        href: urlParsingNode.href,
	        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
	        host: urlParsingNode.host,
	        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
	        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
	        hostname: urlParsingNode.hostname,
	        port: urlParsingNode.port,
	        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
	                  urlParsingNode.pathname :
	                  '/' + urlParsingNode.pathname
	      };
	    }
	
	    originURL = resolveURL(window.location.href);
	
	    /**
	    * Determine if a URL shares the same origin as the current location
	    *
	    * @param {String} requestURL The URL to test
	    * @returns {boolean} True if URL shares the same origin, otherwise false
	    */
	    return function isURLSameOrigin(requestURL) {
	      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
	      return (parsed.protocol === originURL.protocol &&
	            parsed.host === originURL.host);
	    };
	  })() :
	
	  // Non standard browser envs (web workers, react-native) lack needed support.
	  (function nonStandardBrowserEnv() {
	    return function isURLSameOrigin() {
	      return true;
	    };
	  })()
	);


/***/ }),
/* 87 */
/***/ (function(module, exports) {

	'use strict';
	
	// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js
	
	var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	
	function E() {
	  this.message = 'String contains an invalid character';
	}
	E.prototype = new Error;
	E.prototype.code = 5;
	E.prototype.name = 'InvalidCharacterError';
	
	function btoa(input) {
	  var str = String(input);
	  var output = '';
	  for (
	    // initialize result and counter
	    var block, charCode, idx = 0, map = chars;
	    // if the next str index does not exist:
	    //   change the mapping table to "="
	    //   check if d has no fractional digits
	    str.charAt(idx | 0) || (map = '=', idx % 1);
	    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
	    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
	  ) {
	    charCode = str.charCodeAt(idx += 3 / 4);
	    if (charCode > 0xFF) {
	      throw new E();
	    }
	    block = block << 8 | charCode;
	  }
	  return output;
	}
	
	module.exports = btoa;


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(80);
	
	module.exports = (
	  utils.isStandardBrowserEnv() ?
	
	  // Standard browser envs support document.cookie
	  (function standardBrowserEnv() {
	    return {
	      write: function write(name, value, expires, path, domain, secure) {
	        var cookie = [];
	        cookie.push(name + '=' + encodeURIComponent(value));
	
	        if (utils.isNumber(expires)) {
	          cookie.push('expires=' + new Date(expires).toGMTString());
	        }
	
	        if (utils.isString(path)) {
	          cookie.push('path=' + path);
	        }
	
	        if (utils.isString(domain)) {
	          cookie.push('domain=' + domain);
	        }
	
	        if (secure === true) {
	          cookie.push('secure');
	        }
	
	        document.cookie = cookie.join('; ');
	      },
	
	      read: function read(name) {
	        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
	        return (match ? decodeURIComponent(match[3]) : null);
	      },
	
	      remove: function remove(name) {
	        this.write(name, '', Date.now() - 86400000);
	      }
	    };
	  })() :
	
	  // Non standard browser env (web workers, react-native) lack needed support.
	  (function nonStandardBrowserEnv() {
	    return {
	      write: function write() {},
	      read: function read() { return null; },
	      remove: function remove() {}
	    };
	  })()
	);


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(80);
	
	function InterceptorManager() {
	  this.handlers = [];
	}
	
	/**
	 * Add a new interceptor to the stack
	 *
	 * @param {Function} fulfilled The function to handle `then` for a `Promise`
	 * @param {Function} rejected The function to handle `reject` for a `Promise`
	 *
	 * @return {Number} An ID used to remove interceptor later
	 */
	InterceptorManager.prototype.use = function use(fulfilled, rejected) {
	  this.handlers.push({
	    fulfilled: fulfilled,
	    rejected: rejected
	  });
	  return this.handlers.length - 1;
	};
	
	/**
	 * Remove an interceptor from the stack
	 *
	 * @param {Number} id The ID that was returned by `use`
	 */
	InterceptorManager.prototype.eject = function eject(id) {
	  if (this.handlers[id]) {
	    this.handlers[id] = null;
	  }
	};
	
	/**
	 * Iterate over all the registered interceptors
	 *
	 * This method is particularly useful for skipping over any
	 * interceptors that may have become `null` calling `eject`.
	 *
	 * @param {Function} fn The function to call for each interceptor
	 */
	InterceptorManager.prototype.forEach = function forEach(fn) {
	  utils.forEach(this.handlers, function forEachHandler(h) {
	    if (h !== null) {
	      fn(h);
	    }
	  });
	};
	
	module.exports = InterceptorManager;


/***/ }),
/* 90 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * Determines whether the specified URL is absolute
	 *
	 * @param {string} url The URL to test
	 * @returns {boolean} True if the specified URL is absolute, otherwise false
	 */
	module.exports = function isAbsoluteURL(url) {
	  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
	  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
	  // by any combination of letters, digits, plus, period, or hyphen.
	  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
	};


/***/ }),
/* 91 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * Creates a new URL by combining the specified URLs
	 *
	 * @param {string} baseURL The base URL
	 * @param {string} relativeURL The relative URL
	 * @returns {string} The combined URL
	 */
	module.exports = function combineURLs(baseURL, relativeURL) {
	  return baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '');
	};


/***/ }),
/* 92 */
/***/ (function(module, exports) {

	'use strict';
	
	module.exports = function bind(fn, thisArg) {
	  return function wrap() {
	    var args = new Array(arguments.length);
	    for (var i = 0; i < args.length; i++) {
	      args[i] = arguments[i];
	    }
	    return fn.apply(thisArg, args);
	  };
	};


/***/ }),
/* 93 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * Syntactic sugar for invoking a function and expanding an array for arguments.
	 *
	 * Common use case would be to use `Function.prototype.apply`.
	 *
	 *  ```js
	 *  function f(x, y, z) {}
	 *  var args = [1, 2, 3];
	 *  f.apply(null, args);
	 *  ```
	 *
	 * With `spread` this example can be re-written.
	 *
	 *  ```js
	 *  spread(function(x, y, z) {})([1, 2, 3]);
	 *  ```
	 *
	 * @param {Function} callback
	 * @returns {Function}
	 */
	module.exports = function spread(callback) {
	  return function wrap(arr) {
	    return callback.apply(null, arr);
	  };
	};


/***/ }),
/* 94 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var isObjectEmpty = function (obj) { return Object.keys(obj).length === 0 && obj.constructor === Object; };
	exports.isObjectEmpty = isObjectEmpty;


/***/ })
/******/ ]);