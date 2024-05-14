import {
  Readable,
  Writeable,
  charToWord,
  uIntToWord,
  wordToUInt,
  wordToChar,
} from "./util.ts";
import { Word, MemoryBlock } from "./cell.ts";
import { Input, Output } from "./io.ts";

export class Asl {
  public readonly instructionPointer = new Word();
  public readonly accumulator = new Word();
  public readonly register = new Word();
  public readonly memory = new MemoryBlock();
  public readonly input = new Input();
  public readonly output = new Output();

  flashInstructions = (instructions: string[]) => {
    this.memory.pointer.write(Asl.ZERO);

    for (let i = 0; i < instructions.length; i++) {
      const instruction = instructions[i];

      this.memory.write(uIntToWord(2)); // STX https://www.ascii-code.com/
      this.memory.pointer.write(Asl.add(this.memory.pointer, Asl.ONE));

      for (let j = 0; j < instruction.length; j++) {
        const char = instruction[j];

        this.memory.write(charToWord(char));
        this.memory.pointer.write(Asl.add(this.memory.pointer, Asl.ONE));
      }

      this.memory.write(uIntToWord(3)); // ETX https://www.ascii-code.com/
      this.memory.pointer.write(Asl.add(this.memory.pointer, Asl.ONE));
    }
    this.memory.write(uIntToWord(4)); // EOT https://www.ascii-code.com/
  };

  dumpInstructions = () => {
    this.memory.pointer.write(Asl.ZERO);

    let instructions = "";
    let charCode = wordToUInt(this.memory.read()); // first char is STX https://www.ascii-code.com/
    while (![0, 4].includes(charCode)) {
      if (charCode !== 2) {
        instructions += charCode === 3 ? "\n" : wordToChar(this.memory.read());
      }
      this.memory.pointer.write(Asl.add(this.memory.pointer, Asl.ONE));
      charCode = wordToUInt(this.memory.read());
    }

    return instructions;
  };

  consumeInstruction = () => {
    // read instruction from memory
    let instruction = "";
    const pc = this.instructionPointer;
    this.memory.pointer.write(pc);
    let charCode = wordToUInt(this.memory.read()); // first char is STX https://www.ascii-code.com/
    while (![0, 3, 4].includes(charCode)) {
      if (charCode !== 2) {
        instruction += wordToChar(this.memory.read());
      }
      this.memory.pointer.write(Asl.add(this.memory.pointer, Asl.ONE));
      charCode = wordToUInt(this.memory.read());
    }
    pc.write(Asl.add(this.memory.pointer, Asl.ONE));

    // parse instruction string
    const symbols = instruction.split(/\s+/);
    if (symbols[0] === "MOV") {
      if (symbols.length !== 3) {
        throw new Error(
          `Syntax error on line ${wordToUInt(this.instructionPointer.read())}`
        );
      }
      const source = this.getSource(symbols[1]);
      const destination = this.getSink(symbols[2]);
      destination.write(source.read());
    }
    if (symbols[0] === "PRINT") {
      if (symbols.length !== 1) {
        throw new Error(
          `Syntax error on line ${wordToUInt(this.instructionPointer.read())}`
        );
      }
      this.output.print();
    }
  };

  getSource = (source: string): Readable => {
    const charLiteral = source.match(/'(.)'/)?.[1];
    if (source === "ACC") {
      return this.accumulator;
    } else if (source === "REG") {
      return this.register;
    } else if (source === "MEM") {
      return this.memory;
    } else if (source === "IDX") {
      return this.memory.pointer;
    } else if (source === "IN") {
      return this.input;
    } else if (charLiteral) {
      return charToWord(charLiteral);
    } else {
      throw new Error(
        `Unknown datasource ${source} on line ${wordToUInt(
          this.instructionPointer.read()
        )}`
      );
    }
  };

  getSink = (sink: string): Writeable => {
    if (sink === "ACC") {
      return this.accumulator;
    } else if (sink === "REG") {
      return this.register;
    } else if (sink === "MEM") {
      return this.memory;
    } else if (sink === "IDX") {
      return this.memory.pointer;
    } else if (sink === "OUT") {
      return this.output;
    } else {
      throw new Error(
        `Unknown datasink ${sink} on line ${wordToUInt(
          this.instructionPointer.read()
        )}`
      );
    }
  };

  executeInstruction = () => {};

  static readonly ONE = (() => {
    const one = new Word();
    one.write(uIntToWord(1));
    return one;
  })();

  static readonly ZERO = (() => {
    const zero = new Word();
    return zero;
  })();

  static add = (a: Readable, b: Readable) => {
    const result = new Word();
    result.write(uIntToWord(wordToUInt(a.read()) + wordToUInt(b.read())));
    return result.read();
  };
}
