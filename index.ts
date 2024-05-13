import { MemoryCell } from "./cell.ts";
import { ReadFormatter, WriteFormatter } from "./util.ts";
import { AslRuntimeEnvironment } from "./asl.ts";
// const file = await Deno.readTextFile("app.asl");

// const lines = file.split("\n").map((line) => line.split(/\s+/));

// const asl = initAsl();

const blankCell = new MemoryCell();
console.log(`blankCell: ${new ReadFormatter(blankCell).readUInt()}`);

const uIntCell = new MemoryCell();
const uIntCellReader = new ReadFormatter(uIntCell);
const uIntCellWriter = new WriteFormatter(uIntCell);
console.log(`uIntCell: ${uIntCellReader.readUInt()}`);
uIntCellWriter.writeUInt(69);
console.log(`uIntCell: ${uIntCellReader.readUInt()}`);
uIntCellWriter.writeUInt(-93);
console.log(`uIntCell: ${uIntCellReader.readUInt()}`);

const intCell = new MemoryCell();
const intCellReader = new ReadFormatter(intCell);
const intCellWriter = new WriteFormatter(intCell);
console.log(`intCell: ${intCellReader.readInt()}`);
intCellWriter.writeInt(69);
console.log(`intCell: ${intCellReader.readInt()}`);
intCellWriter.writeInt(-93);
console.log(`intCell: ${intCellReader.readInt()}`);

const charCell = new MemoryCell();
const charCellReader = new ReadFormatter(charCell);
const charCellWriter = new WriteFormatter(charCell);
console.log(`charCell: ${charCellReader.readChar()}`);
charCellWriter.writeChar("=");
console.log(`charCell: ${charCellReader.readChar()}`);

const asl = new AslRuntimeEnvironment();

asl.flashInstructions("MOV 1 OUT");
console.log(asl.dumpInstructions());

asl.flashInstructions(`MOV 2 OUT
MOV 3 OUT`);
console.log(asl.dumpInstructions());

asl.flashInstructions(`MOV 4 OUT\nMOV 5 OUT`);
console.log(asl.dumpInstructions());

asl.flashInstructions("MOV 6 OUT");
console.log(asl.dumpInstructions());
