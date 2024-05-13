import { MemoryCell } from "./cell.ts";
import {
  wordToUInt,
  uIntToWord,
  wordToInt,
  intToWord,
  wordToChar,
  charToWord,
} from "./util.ts";
import { Asl } from "./asl.ts";
// const file = await Deno.readTextFile("app.asl");

// const lines = file.split("\n").map((line) => line.split(/\s+/));

// const asl = initAsl();

const blankCell = new MemoryCell();
console.log(`blankCell: ${wordToUInt(blankCell.read())}`);

const uIntCell = new MemoryCell();
console.log(`uIntCell: ${wordToUInt(uIntCell.read())}`);
uIntCell.write(uIntToWord(69));
console.log(`uIntCell: ${wordToUInt(uIntCell.read())}`);
uIntCell.write(uIntToWord(-93));
console.log(`uIntCell: ${wordToUInt(uIntCell.read())}`);

const intCell = new MemoryCell();
console.log(`intCell: ${wordToInt(intCell.read())}`);
intCell.write(intToWord(69));
console.log(`intCell: ${wordToInt(intCell.read())}`);
intCell.write(intToWord(-93));
console.log(`intCell: ${wordToInt(intCell.read())}`);

const charCell = new MemoryCell();
console.log(`charCell: ${wordToChar(charCell.read())}`);
charCell.write(charToWord("="));
console.log(`charCell: ${wordToChar(charCell.read())}`);

const newlineCell = new MemoryCell();
newlineCell.write(charToWord("\n"));
console.log(wordToUInt(newlineCell.read()));

const asl = new Asl();

asl.flashInstructions("MOV 1 OUT");
console.log(asl.dumpInstructions());

asl.flashInstructions(`MOV 2 OUT
MOV 3 OUT`);
console.log(asl.dumpInstructions());

asl.flashInstructions(`MOV 4 OUT\nMOV 5 OUT`);
console.log(asl.dumpInstructions());

asl.flashInstructions("MOV 6 OUT");
console.log(asl.dumpInstructions());

asl.flashInstructions("MOV 7 OUT\nMOV 8 OUT");
console.log(asl.consumeInstruction());
