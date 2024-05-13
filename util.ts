export const WORD_LENGTH = 16;

export interface Writeable {
  write: (value: boolean[]) => void;
}

export interface Readable {
  read: () => boolean[];
}

export class ReadFormatter implements Readable {
  constructor(private readonly readable: Readable) {}

  read = () => this.readable.read();

  readUInt = () => {
    const word = this.readable.read();
    let number = 0;
    for (let i = 0; i < WORD_LENGTH; i++) {
      number <<= 1;
      number ^= word[i] ? 1 : 0;
    }
    return number;
  };

  readInt = () => {
    // two's compliment
    const word = this.readable.read();
    let number = word[0] ? -1 : 0;
    for (let i = 1; i < WORD_LENGTH; i++) {
      number <<= 1;
      number ^= word[i] ? 1 : 0;
    }
    return number;
  };

  readChar = () => {
    return String.fromCharCode(this.readUInt());
  };
}

export class WriteFormatter implements Writeable {
  constructor(private readonly writable: Writeable) {}

  write = (value: boolean[]) => this.writable.write(value);

  writeUInt = (uInt: number) => {
    const value = new Array<boolean>(WORD_LENGTH);
    let number = uInt;
    for (let i = WORD_LENGTH - 1; i >= 0; i--) {
      value[i] = (number & 1) === 1;
      number >>= 1;
    }
    this.writable.write(value);
  };

  writeInt = (int: number) => {
    // two's compliment
    const value = new Array<boolean>(WORD_LENGTH);
    let number = int;
    value[0] = number < 0;
    for (let i = WORD_LENGTH - 1; i > 0; i--) {
      value[i] = (number & 1) === 1;
      number >>= 1;
    }
    this.writable.write(value);
  };

  writeChar = (char: string) => {
    return this.writeUInt(char.charCodeAt(0));
  };

  $write = (value: boolean[] | string | number, signed?: boolean) => {
    if (typeof value === "string") {
      this.writeChar(value);
    } else if (typeof value === "number") {
      if (signed) {
        this.writeInt(value);
      } else {
        this.writeUInt(value);
      }
    } else {
      this.writable.write(value);
    }
  };
}
