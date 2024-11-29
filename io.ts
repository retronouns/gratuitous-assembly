import { Readable, Writeable } from "./util.ts";
import { Word } from "./memory.ts";
import { wordToChar } from "./util.ts";
import { uIntToWord } from "./util.ts";

export class Output implements Writeable {
  buffer = "";
  write = (value: Readable) => {
    this.buffer += wordToChar(value.read());
  };

  print = () => {
    console.log(this.buffer);
    this.buffer = "";
  };
}

export class Input implements Readable {
  buffer = "";
  read = () => {
    const cell = new Word();
    cell.write(uIntToWord(this.buffer.charCodeAt(0)));
    return cell.read();
  };
}
