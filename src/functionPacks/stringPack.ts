import { FunctionPack } from '../utils/functionPacks';

const stringPack: FunctionPack = {
  name: 'String Pack',
  description: 'String manipulation functions',
  functions: {
    reverse: (str: string) => {
      /**
       * Reverses a string.
       * @param str The input string.
       * @returns The reversed string.
       */
      return str.split('').reverse().join('');
    },
    capitalize: (str: string) => {
      /**
       * Capitalizes the first letter of a string.
       * @param str The input string.
       * @returns The string with the first letter capitalized.
       */
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    countWords: (str: string) => {
      /**
       * Counts the number of words in a string.
       * @param str The input string.
       * @returns The number of words in the string.
       */
      return str.trim().split(/\s+/).length;
    },
  },
};

export default stringPack;