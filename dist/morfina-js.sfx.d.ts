/// <reference types="es6-promise" />
declare module Morfina {
	
	interface Credentials {
	    PAILLIER: {
	        privateKey: {
	            preCalculatedDenominator: string;
	            lambda: string;
	        };
	        publicKey: {
	            nSquared: string;
	            g: string;
	            bits: number;
	            n: string;
	        };
	    };
	    AES: {
	        password: string;
	        salt: string;
	        keyLength: number;
	        key: string;
	    };
	}
	interface Config {
	    baseUrl?: string;
	    webApiKey: string;
	}
	interface AxiosResponse<T> {
	    data: T;
	    status: number;
	    statusText: string;
	    headers: any;
	    config: AxiosRequestConfig;
	}
	interface EncryptionParameter {
	    encryptionType: EncryptionType;
	    jsonPath: string;
	}
	interface EncryptionParameterWithApiKey extends EncryptionParameter {
	    webAPIKey: string;
	}
	interface EncryptPayload<T> {
	    encryptionParameters: EncryptionParameterWithApiKey[];
	    dataArray: T;
	}
	interface EncryptPayloadWithoutApiKeys<T> {
	    encryptionParameters: EncryptionParameter[];
	    dataArray: T;
	}
	export { EncryptionType, Credentials, Config, AxiosResponse, EncryptionParameter, EncryptionParameterWithApiKey, EncryptPayload, EncryptPayloadWithoutApiKeys };

}
declare module Morfina {
	
	/**
	 *
	 * @class ApiClient
	 */
	export abstract class ApiClient {
	    config: Config;
	    static headers: object;
	    /**
	     * Creates an instance of ApiClient.
	     * @param {any} config
	     * @memberof ApiClient
	     */
	    constructor(config: any);
	    /**
	     * Create crypto configuration
	     * @returns {Promise<AxiosResponse<Credentials>>}
	     *
	     * @memberof ApiClient
	     */
	    createCryptoConfiguration: () => Promise<AxiosResponse<Credentials>>;
	    /**
	     * Get crypto configuration
	     * @returns {Promise<AxiosResponse<Credentials>>}
	     *
	     * @memberof ApiClient
	     */
	    getCryptoConfiguration: () => Promise<AxiosResponse<Credentials>>;
	    /**
	     * Encrypt data
	     * @param {EncryptPayload} payload
	     * @returns {Promise<AxiosResponse<EncryptPayload>>}
	     *
	     * @memberof ApiClient
	     */
	    encryptData<T>(payload: EncryptPayload<T>): Promise<AxiosResponse<EncryptPayload<T>>>;
	}
	export default class Client extends ApiClient {
	    constructor(config: any);
	}

}
declare module Morfina {
	 class Computer {
	    private publicKey;
	    private privateKey;
	    /**
	     * Creates an instance of Computer.
	     * @param {Credentials} credentials
	     * @memberof Computer
	     */
	    constructor(publicKey: any, privateKey: any);
	    /**
	     * Precompute values to make future invokations of encrypt significantly faster.
	     * @param {number} numberOfPrimes
	     * @returns {void}
	     *
	     * @memberof Computer
	     */
	    precompute: (numberOfPrimes: number) => void;
	    /**
	     * Returns sum of value1 and value2
	     * @param {string|number} value1
	     * @param {string|number} value2
	     * @returns {string}
	     *
	     * @memberof Computer
	     */
	    add: (value1: string | number, value2: string | number) => string;
	    /**
	     * Returns multiplication of value by num
	     * @param {string|number} value
	     * @param {number} num
	     * @returns {string}
	     *
	     * @memberof Computer
	     */
	    multiply: (value: string | number, num: number) => string;
	    /**
	     * If passed in value is string then it assumes that passed in value is encrypted so it creates BigInteger.
	     * If passed in values is number then in returns decrypted BigInteger.
	     * @param {string | number} val
	     * @returns {BigInteger}
	     *
	     * @private
	     * @memberof Computer
	     */
	    private getEncryptedBigIntegerFromValue;
	}
	export default Computer;

}
declare module Morfina {
	 class Decryptor {
	    private credentials;
	    private publicKey;
	    private privateKey;
	    /**
	     * Creates an instance of Decryptor.
	     * @param {Credentials} credentials
	     * @param {*} publicKey
	     * @param {*} privateKey
	     * @memberof Decryptor
	     */
	    constructor(credentials: Credentials, publicKey: any, privateKey: any);
	    /**
	     * @param {EncryptPayload} data
	     * @returns {T}
	     *
	     * @memberof Decryptor
	     */
	    decryptData<T>(data: EncryptPayload<T>): T;
	    /**
	     * @param {string} value
	     * @param {EncryptionType} encryptionType
	     * @returns {string}
	     *
	     * @memberof Decryptor
	     */
	    decryptValue: (value: string, encryptionType: EncryptionType) => string;
	    /**
	     * @param {*} data
	     * @param {EncryptionParameter} encryptionParameters
	     * @returns {string[]}
	     *
	     * @memberof Decryptor
	     */
	    getDecryptedValuesForPath(data: any, encryptionParameters: EncryptionParameter): string[];
	    /**
	     * @param {any} val
	     * @param {string} encryptionType
	     * @returns {string}
	     *
	     * @private
	     * @memberof Decryptor
	     */
	    private decryptVal;
	    /**
	     * @param {string} path
	     * @returns {string}
	     *
	     * @private
	     * @memberof Decryptor
	     */
	    private addAsteriskToArrayInPath;
	}
	export default Decryptor;

}
declare module Morfina {
	 const isObjectEmpty: (obj: object) => boolean;
	export { isObjectEmpty };

}
declare module Morfina {
	
	
	
	
	/**
	 * MorfinaClient
	 *
	 * @class MorfinaClient
	 */
	export class MorfinaClient {
	    config: Config;
	    computer: Computer;
	    decryptor: Decryptor;
	    credentials: Credentials;
	    apiClient: ApiClient;
	    /**
	     * Creates an instance of MorfinaClient.
	     * @param {Config} config
	     * @param {Credentials} credentials
	     *
	     * @memberof MorfinaClient
	     */
	    constructor(config: Config, credentials: Credentials);
	    /**
	     * Calls Morfina API for crypto and returns "instance" of MorfinaClient with crypto
	     * @param {Config} config
	     * @returns {Promise<MorfinaClient>}
	     *
	     * @static
	     * @memberof MorfinaClient
	     */
	    static getClient: (config: Config) => Promise<MorfinaClient>;
	    /**¨
	     * Calls Morfina server with payload where data are encrypted and sent back
	     * @param {EncryptPayloadWithoutApiKeys} payload
	     * @returns {Promise<AxiosResponse<any>>}
	     *
	     * @memberof MorfinaClient
	     */
	    morph<T = any>(payload: EncryptPayloadWithoutApiKeys<T>): Promise<AxiosResponse<EncryptPayload<T>>>;
	    /**
	     * Precompute values to make future invokations of encrypt significantly faster.
	     * @param {number} numberOfPrimes
	     * @returns {Promise<void>}
	     *
	     * @memberof MorfinaClient
	     */
	    precompute: (numberOfPrimes: number) => Promise<void>;
	    /**
	     * Returns sum of value1 and value2
	     * @param {string|number} value1
	     * @param {string|number} value2
	     * @returns {Promise<string>}
	     *
	     * @memberof MorfinaClient
	     */
	    add: (value1: string | number, value2: string | number) => Promise<string>;
	    /**
	     * Returns multiplication of value by num
	     * @param {string} value
	     * @param {number} num
	     * @returns {Promise<string>}
	     *
	     * @memberof MorfinaClient
	     */
	    multiply: (value: string | number, num: number) => Promise<string>;
	    /**
	     * Returns decrypted data that is passed in encrypted
	     * @param {EncryptPayload} data
	     * @returns {Promise<any>}
	     *
	     * @memberof MorfinaClient
	     */
	    decryptData<T = any>(data: EncryptPayload<T>): Promise<T>;
	    /**
	     * @param {string} value
	     * @param {EncryptionType} encryptionType
	     * @returns {Promise<string>}
	     *
	     * @memberof Decryptor
	     */
	    decryptValue: (value: string, encryptionType: EncryptionType) => Promise<string>;
	    /**
	     * @param {*} data
	     * @param {EncryptionParameter} encryptionParameters
	     * @returns {Promise<string[]>}
	     *
	     * @memberof Decryptor
	     */
	    getDecryptedValuesForPath<T = any>(data: T, encryptionParameters: EncryptionParameter): Promise<string[]>;
	}

}
declare module Morfina {
	

}
