import {
  add,
  charToWord,
  intToWord,
  Readable,
  uIntToWord,
  wordToChar,
  wordToInt,
  wordToUInt,
  Writeable,
  ZERO,
} from "./util.ts";
import { MemoryBlock, Word } from "./memory.ts";
import { Input, Output } from "./io.ts";

export class Asl {
  public readonly instructionPointer = new Word();
  public readonly accumulator = new Word();
  public readonly register = new Word();
  public readonly memory = new MemoryBlock();
  public readonly input = new Input();
  public readonly output = new Output();

  flashInstructions = (instructions: string[]) => {
    let k = 0;
    for (let i = 0; i < instructions.length; i++) {
      const instruction = instructions[i];
      this.memory[k++].write(uIntToWord(2)); // STX https://www.ascii-code.com/
      for (let j = 0; j < instruction.length; j++) {
        const char = instruction[j];
        this.memory[k++].write(charToWord(char));
      }
      this.memory[k++].write(uIntToWord(3)); // ETX https://www.ascii-code.com/
    }
    this.memory[k++].write(uIntToWord(4)); // EOT https://www.ascii-code.com/
  };

  dumpInstructions = () => {
    let instructions = "";
    let charCode = 2;
    for (let i = 0; i < this.memory.length && ![0, 4].includes(charCode); i++) {
      charCode = wordToUInt(this.memory[i]);
      if (charCode !== 2) {
        instructions += charCode === 3 ? "\n" : wordToChar(this.memory[i]);
      }
    }
    return instructions;
  };

  endOfFile = () => {
    return wordToUInt(this.memory[wordToUInt(this.instructionPointer)]) === 4;
  };

  run = () => {
    this.instructionPointer.write(ZERO);
    while (!this.endOfFile()) {
      this.consumeInstruction();
    }
  };

  consumeInstruction = () => {
    const instruction = this.readInstruction();

    // parse instruction string
    const symbols = instruction.split(/\s+/);
    if (symbols[0] === "MOV") {
      if (symbols.length !== 3) {
        throw new Error(
          `Syntax error on line ${wordToUInt(this.instructionPointer.read())}`,
        );
      }
      const source = this.getReadable(symbols[1]);
      const destination = this.getWriteable(symbols[2]);
      destination.write(source.read());
    } else if (symbols[0] === "ADD") {
      if (symbols.length !== 3) {
        throw new Error(
          `Syntax error on line ${wordToUInt(this.instructionPointer.read())}`,
        );
      }
      const sourceA = this.getReadable(symbols[1]);
      const sourceB = this.getReadable(symbols[2]);
      this.accumulator.write(add(sourceA, sourceB));
    } else if (symbols[0] === "CLEAROUT") {
      this.output.buffer = "";
    } else if (symbols[0] === "CLEARIN") {
      this.input.buffer = "";
    } else if (symbols[0] === "PRINT") {
      if (symbols.length !== 1) {
        throw new Error(
          `Syntax error on line ${wordToUInt(this.instructionPointer.read())}`,
        );
      }
      this.output.print();
    } else if (symbols[0] === "JEQ") {
      if (symbols.length !== 3) {
        throw new Error(
          `Syntax error on line ${wordToUInt(this.instructionPointer.read())}`,
        );
      }
      const sourceA = this.getReadable(symbols[1]);
      const sourceB = this.getReadable(symbols[2]);
      if (wordToUInt(sourceA.read()) === wordToUInt(sourceB.read())) {
        this.readInstruction();
      }
    } else if (symbols[0] === "JNE") {
      if (symbols.length !== 3) {
        throw new Error(
          `Syntax error on line ${wordToUInt(this.instructionPointer.read())}`,
        );
      }
      const sourceA = this.getReadable(symbols[1]);
      const sourceB = this.getReadable(symbols[2]);
      if (wordToUInt(sourceA.read()) !== wordToUInt(sourceB.read())) {
        this.readInstruction();
      }
    } else if (symbols[0] === "JRL") {
      if (symbols.length !== 2) {
        throw new Error(
          `Syntax error on line ${wordToUInt(this.instructionPointer.read())}`,
        );
      }
      const source = this.getReadable(symbols[1]);
      let rel = wordToInt(source.read()) - 1;
      while (rel > 0) {
        rel--;
        this.readInstruction();
      }
      while (rel < 0) {
        rel++;
        this.reverseInstruction();
      }
    } else if (symbols[0] === "NOP") {
      if (symbols.length !== 1) {
        throw new Error(
          `Syntax error on line ${wordToUInt(this.instructionPointer.read())}`,
        );
      }
    }
  };

  readInstruction = () => {
    // read instruction from memory
    let instruction = "";
    let i = wordToUInt(this.instructionPointer);
    let charCode = wordToUInt(this.memory[i]); // first char is STX https://www.ascii-code.com/
    while (i < this.memory.length && ![0, 3, 4].includes(charCode)) {
      if (charCode !== 2) {
        instruction += wordToChar(this.memory[i]);
      }
      charCode = wordToUInt(this.memory[++i]);
    }
    this.instructionPointer.write(uIntToWord(i + 1));
    return instruction;
  };

  reverseInstruction = () => {
    let i = wordToUInt(this.instructionPointer) - 1;
    let charCode = wordToUInt(this.memory[i]); // last char is ETX https://www.ascii-code.com/
    while (i >= 0 && ![0, 2, 4].includes(charCode)) {
      charCode = wordToUInt(this.memory[--i]);
    }
    this.instructionPointer.write(uIntToWord(i));
  };

  getReadable = (readable: string): Readable => {
    const charLiteral = readable.match(/'(.)'/)?.[1];
    const intLiteral = readable.match(/-?[0-9]+/)?.[0];
    if (readable === "ACC") {
      return this.accumulator;
    } else if (readable === "REG") {
      return this.register;
    } else if (readable === "MEM") {
      return this.memory;
    } else if (readable === "IDX") {
      return this.memory.pointer;
    } else if (readable === "IN") {
      return this.input;
    } else if (readable === "IPT") {
      return this.instructionPointer;
    } else if (charLiteral) {
      return charToWord(charLiteral);
    } else if (intLiteral) {
      return intToWord(Number.parseInt(intLiteral));
    } else {
      throw new Error(
        `Unknown Readable ${readable} on line ${
          wordToUInt(
            this.instructionPointer.read(),
          )
        }`,
      );
    }
  };

  getWriteable = (writeable: string): Writeable => {
    if (writeable === "ACC") {
      return this.accumulator;
    } else if (writeable === "REG") {
      return this.register;
    } else if (writeable === "MEM") {
      return this.memory;
    } else if (writeable === "IDX") {
      return this.memory.pointer;
    } else if (writeable === "OUT") {
      return this.output;
    } else if (writeable === "IPT") {
      return this.instructionPointer;
    } else {
      throw new Error(
        `Unknown Writeable ${writeable} on line ${
          wordToUInt(
            this.instructionPointer.read(),
          )
        }`,
      );
    }
  };

  executeInstruction = () => {};
}
