// deno-lint-ignore-file require-await
import {
  WORD_LENGTH,
  Readable,
  charToWord,
  uIntToWord,
  wordToUInt,
  wordToChar,
} from "./util.ts";
import { MemoryCell } from "./cell.ts";

const MEMORY_SIZE = 1 << WORD_LENGTH;

export class Asl {
  public readonly instructionPointer = new MemoryCell();
  public readonly accumulator = new MemoryCell();
  public readonly register = new MemoryCell();
  public readonly pointer = new MemoryCell();
  public readonly memory = (() => {
    const array = new Array<MemoryCell>(MEMORY_SIZE);
    for (let i = 0; i < MEMORY_SIZE; i++) {
      array[i] = new MemoryCell();
    }
    return array;
  })();

  flashInstructions = (instructions: string) => {
    for (let i = 0; i < instructions.length; i++) {
      const char = instructions[i];
      this.memory[i].write(charToWord(char));
    }
    this.memory[instructions.length].write(uIntToWord(3)); // ETX https://www.ascii-code.com/
  };

  dumpInstructions = () => {
    let instructions = "";
    let charCode = 2; // STX https://www.ascii-code.com/
    let i = 0;
    while (![0, 3, 4].includes(charCode)) {
      instructions += wordToChar(this.memory[i++].read());
      charCode = wordToUInt(this.memory[i].read());
    }
    return instructions;
  };

  consumeInstruction = () => {
    let instruction = "";
    let charCode = 2; // STX https://www.ascii-code.com/
    const pc = this.instructionPointer;
    while (![10, 13].includes(charCode)) {
      instruction += wordToChar(this.memory[wordToUInt(pc.read())].read());
      pc.write(Asl.add(pc, Asl.one));
      charCode = wordToUInt(this.memory[wordToUInt(pc.read())].read());
    }
    pc.write(Asl.add(pc, Asl.one));
    return instruction;
  };

  static readonly one = (() => {
    const one = new MemoryCell();
    one.write(uIntToWord(1));
    return one;
  })();

  static add = (a: Readable, b: Readable) => {
    const result = new MemoryCell();
    result.write(uIntToWord(wordToUInt(a.read()) + wordToUInt(b.read())));
    return result.read();
  };
}
