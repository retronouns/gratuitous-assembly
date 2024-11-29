import { Word, WORD_LENGTH } from "./memory.ts";

export interface Writeable {
  write: (value: Readable) => void;
}

export interface Readable {
  read: () => Word;
}

export const wordToUInt = (word: Word) => {
  let number = 0;
  for (let i = 0; i < WORD_LENGTH; i++) {
    number <<= 1;
    number ^= word[i] ? 1 : 0;
  }
  return number;
};

export const wordToInt = (word: Word) => {
  // two's compliment
  let number = word[0] ? -1 : 0;
  for (let i = 1; i < WORD_LENGTH; i++) {
    number <<= 1;
    number ^= word[i] ? 1 : 0;
  }
  return number;
};

export const wordToChar = (word: Word) => {
  return String.fromCharCode(wordToUInt(word));
};

export const uIntToWord = (uInt: number) => {
  const value = new Word();
  let number = uInt;
  for (let i = WORD_LENGTH - 1; i >= 0; i--) {
    value[i] = (number & 1) === 1;
    number >>= 1;
  }
  return value;
};

export const intToWord = (int: number) => {
  // two's compliment
  const value = new Word();
  let number = int;
  value[0] = number < 0;
  for (let i = WORD_LENGTH - 1; i > 0; i--) {
    value[i] = (number & 1) === 1;
    number >>= 1;
  }
  return value;
};

export const charToWord = (char: string) => {
  return uIntToWord(char.charCodeAt(0));
};

export const $ToWord = (value: Word | string | number, signed?: boolean) => {
  if (typeof value === "string") {
    return charToWord(value);
  } else if (typeof value === "number") {
    if (signed) {
      return intToWord(value);
    } else {
      return uIntToWord(value);
    }
  } else {
    return value;
  }
};

export const add = (a: Readable, b: Readable) => {
  const result = new Word();
  result.write(uIntToWord(wordToUInt(a.read()) + wordToUInt(b.read())));
  return result.read();
};

export const ONE = (() => {
  const one = new Word();
  one.write(uIntToWord(1));
  return one;
})();

export const ZERO = (() => {
  const zero = new Word();
  return zero;
})();
