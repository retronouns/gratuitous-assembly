import type { Writeable, Readable } from "./util.ts";
import { wordToUInt, WORD_LENGTH } from "./util.ts";

const MEMORY_SIZE = 1 << WORD_LENGTH;

export class Word extends Array<boolean> implements Readable, Writeable {
  constructor() {
    super();
    this.length = WORD_LENGTH;
    this.fill(false);
  }

  read = () => this;

  write = (value: Readable) => {
    for (let i = 0; i < WORD_LENGTH; i++) {
      this[i] = value.read()[i];
    }
  };
}

export class MemoryBlock extends Array<Word> implements Writeable, Readable {
  public readonly pointer = new Word();

  constructor() {
    super();
    this.length = MEMORY_SIZE;
    for (let i = 0; i < MEMORY_SIZE; i++) {
      this[i] = new Word();
    }
  }

  read = () => {
    return this[wordToUInt(this.pointer.read())].read();
  };

  write = (value: Readable) => {
    this[wordToUInt(this.pointer.read())].write(value);
  };
}
