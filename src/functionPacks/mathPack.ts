import { FunctionPack } from '../utils/functionPacks';

const mathPack: FunctionPack = {
  name: 'Math Pack',
  description: 'Basic mathematical operations',
  functions: {
    add: (a: number, b: number) => {
      /**
       * Adds two numbers.
       * @param a The first number.
       * @param b The second number.
       * @returns The sum of a and b.
       */
      return a + b;
    },
    subtract: (a: number, b: number) => {
      /**
       * Subtracts the second number from the first.
       * @param a The number to subtract from.
       * @param b The number to subtract.
       * @returns The difference between a and b.
       */
      return a - b;
    },
    multiply: (a: number, b: number) => {
      /**
       * Multiplies two numbers.
       * @param a The first number.
       * @param b The second number.
       * @returns The product of a and b.
       */
      return a * b;
    },
    divide: (a: number, b: number) => {
      /**
       * Divides the first number by the second.
       * @param a The dividend.
       * @param b The divisor.
       * @returns The quotient of a divided by b.
       * @throws {Error} If b is zero.
       */
      if (b === 0) {
        throw new Error('Division by zero');
      }
      return a / b;
    },
  },
};

export default mathPack;