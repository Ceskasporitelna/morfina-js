class Computer {
  publicKey: string;

  constructor(publicKey: string) {
    this.publicKey = publicKey;
  }

  precompute = (numberOfPrimes: number): void => {}

  add = (value1: string|number, value2: string|number): string => {}

  multiply = (value: string, num: number): string => {}
}

export default Computer;