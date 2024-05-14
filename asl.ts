import {
  Readable,
  charToWord,
  uIntToWord,
  wordToUInt,
  wordToChar,
} from "./util.ts";
import { Word, MemoryBlock } from "./cell.ts";

export class Asl {
  public readonly instructionPointer = new Word();
  public readonly accumulator = new Word();
  public readonly register = new Word();
  public readonly memory = new MemoryBlock();

  flashInstructions = (instructions: string) => {
    for (let i = 0; i < instructions.length; i++) {
      const char = instructions[i];
      this.memory.pointer.write(uIntToWord(i));
      this.memory.write(charToWord(char));
    }
    this.memory.pointer.write(uIntToWord(instructions.length));
    this.memory.write(uIntToWord(3)); // ETX https://www.ascii-code.com/
  };

  dumpInstructions = () => {
    let instructions = "";
    let charCode = 2; // STX https://www.ascii-code.com/
    this.memory.pointer.write(Asl.zero);
    while (![0, 3, 4].includes(charCode)) {
      instructions += wordToChar(this.memory.read());
      this.memory.pointer.write(Asl.add(this.memory.pointer, Asl.one));
      charCode = wordToUInt(this.memory.read());
    }
    return instructions;
  };

  resetInstructionPointer = () => {
    this.instructionPointer.write(Asl.zero);
  };

  consumeInstruction = () => {
    let instruction = "";
    let charCode = 2; // STX https://www.ascii-code.com/
    const pc = this.instructionPointer;
    this.memory.pointer.write(pc);
    while (![10, 13].includes(charCode)) {
      instruction += wordToChar(this.memory.read());
      pc.write(Asl.add(pc, Asl.one));
      this.memory.pointer.write(pc);
      charCode = wordToUInt(this.memory.read());
    }
    pc.write(Asl.add(pc, Asl.one));
    return instruction;
  };

  static readonly one = (() => {
    const one = new Word();
    one.write(uIntToWord(1));
    return one;
  })();

  static readonly zero = (() => {
    const zero = new Word();
    return zero;
  })();

  static add = (a: Readable, b: Readable) => {
    const result = new Word();
    result.write(uIntToWord(wordToUInt(a.read()) + wordToUInt(b.read())));
    return result.read();
  };
}
