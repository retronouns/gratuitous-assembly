import { Writeable, Readable } from "./util.ts";
import { Word } from "./cell.ts";
import { wordToChar } from "./util.ts";
import { uIntToWord } from "./util.ts";

export class Output implements Writeable {
  private buffer = "";
  write = (value: Readable) => {
    const cell = new Word();
    cell.write(value);
    const char = wordToChar(cell.read());
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
    const cell = new Word();
    cell.write(uIntToWord(this.buffer.charCodeAt(0)));
    return cell.read();
  };
}
