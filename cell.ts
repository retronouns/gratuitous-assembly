import type { Writeable, Readable } from "./util.ts";

import { WORD_LENGTH } from "./util.ts";

export class MemoryCell implements Writeable, Readable {
  private readonly value: boolean[];

  constructor() {
    this.value = new Array(WORD_LENGTH).fill(false);
  }

  read = () => {
    return this.value;
  };

  write = (value: boolean[]) => {
    for (let i = 0; i < WORD_LENGTH; i++) {
      this.value[i] = value[i];
    }
  };
}
