export const WORD_LENGTH = 16;

export interface Writeable {
  write: (value: boolean[]) => void;
}

export interface Readable {
  read: () => boolean[];
}

export const wordToUInt = (word: boolean[]) => {
  let number = 0;
  for (let i = 0; i < WORD_LENGTH; i++) {
    number <<= 1;
    number ^= word[i] ? 1 : 0;
  }
  return number;
};

export const wordToInt = (word: boolean[]) => {
  // two's compliment
  let number = word[0] ? -1 : 0;
  for (let i = 1; i < WORD_LENGTH; i++) {
    number <<= 1;
    number ^= word[i] ? 1 : 0;
  }
  return number;
};

export const wordToChar = (word: boolean[]) => {
  return String.fromCharCode(wordToUInt(word));
};

export const uIntToWord = (uInt: number) => {
  const value = new Array<boolean>(WORD_LENGTH);
  let number = uInt;
  for (let i = WORD_LENGTH - 1; i >= 0; i--) {
    value[i] = (number & 1) === 1;
    number >>= 1;
  }
  return value;
};

export const intToWord = (int: number) => {
  // two's compliment
  const value = new Array<boolean>(WORD_LENGTH);
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

export const $ToWord = (
  value: boolean[] | string | number,
  signed?: boolean
) => {
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
