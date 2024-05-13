// deno-lint-ignore-file require-await
import { WORD_LENGTH, WriteFormatter, ReadFormatter } from "./util.ts";
import { MemoryCell } from "./cell.ts";

const MEMORY_SIZE = 1 << WORD_LENGTH;

export class AslRuntimeEnvironment {
  public readonly instruction = new MemoryCell();
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
      const fmt = new WriteFormatter(this.memory[i]);
      const char = instructions[i];
      fmt.writeChar(char);
    }
    const fmt = new WriteFormatter(this.memory[instructions.length]);
    fmt.writeUInt(3); // ETX https://www.ascii-code.com/
  };

  dumpInstructions = () => {
    let instructions = "";
    let charCode = 2; // STX https://www.ascii-code.com/
    let i = 0;
    while (![0, 3, 4].includes(charCode)) {
      let fmt = new ReadFormatter(this.memory[i++]);
      instructions += fmt.readChar();
      fmt = new ReadFormatter(this.memory[i]);
      charCode = fmt.readUInt();
    }
    return instructions;
  };
}
