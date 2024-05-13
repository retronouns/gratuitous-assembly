import { Writeable, Readable, ReadFormatter, WriteFormatter } from "./util.ts";
import { MemoryCell } from "./cell.ts";

export class Output implements Writeable {
  private buffer = "";
  write = (value: boolean[]) => {
    const cell = new MemoryCell();
    cell.write(value);
    const formatter = new ReadFormatter(cell);
    const char = formatter.readChar();
    if (char === "\n") {
      console.log(this.buffer);
      this.buffer = "";
    } else {
      this.buffer += char;
    }
  };
}

export class Input implements Readable {
  private buffer = "";
  read = () => {
    const cell = new MemoryCell();
    const formatter = new WriteFormatter(cell);
    formatter.writeUInt(this.buffer.charCodeAt(0));
    return cell.read();
  };
}
