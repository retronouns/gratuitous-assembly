import type { Writeable, Readable } from "./util.ts";
import { wordToUInt, WORD_LENGTH } from "./util.ts";

const MEMORY_SIZE = 1 << WORD_LENGTH;

export class Word extends Array<boolean> implements Readable {
  constructor() {
    super();
    this.length = WORD_LENGTH;
    this.fill(false);
  }

  read = () => this;
}

export class MemoryCell implements Writeable, Readable {
  private readonly value: Word;

  constructor() {
    this.value = new Word();
  }

  read = () => {
    return this.value;
  };

  write = (value: Readable) => {
    for (let i = 0; i < WORD_LENGTH; i++) {
      this.value[i] = value.read()[i];
    }
  };
}

export class MemoryBlock implements Writeable, Readable {
  public readonly pointer = new MemoryCell();
  private readonly memory = (() => {
    const array = new Array<MemoryCell>(MEMORY_SIZE);
    for (let i = 0; i < MEMORY_SIZE; i++) {
      array[i] = new MemoryCell();
    }
    return array;
  })();

  read = () => {
    return this.memory[wordToUInt(this.pointer.read())].read();
  };

  write = (value: Readable) => {
    this.memory[wordToUInt(this.pointer.read())].write(value);
  };
}
