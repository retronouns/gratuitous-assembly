import { Writeable, Readable } from "./util.ts";
import { Word } from "./cell.ts";
import { wordToChar } from "./util.ts";
import { uIntToWord } from "./util.ts";

export class Output implements Writeable {
  private buffer = "";
  write = (value: Readable) => {
    this.buffer += wordToChar(value.read());
  };

  print = () => {
    console.log(this.buffer);
    this.buffer = "";
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
