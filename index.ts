import { Asl } from "./asl.ts";
// const file = await Deno.readTextFile("app.asl");

// const lines = file.split("\n").map((line) => line.split(/\s+/));

// const asl = initAsl();

const asl = new Asl();

const instructions = [
  `MOV 'H' OUT`,
  `MOV 'E' OUT`,
  `MOV 'L' OUT`,
  `MOV 'L' OUT`,
  `MOV 'O' OUT`,
  `MOV '_' OUT`,
  `MOV 'W' OUT`,
  `MOV 'O' OUT`,
  `MOV 'R' OUT`,
  `MOV 'L' OUT`,
  `MOV 'D' OUT`,
  `PRINT`,
];
asl.flashInstructions(instructions);
asl.dumpInstructions();
for (const _ of instructions) {
  asl.consumeInstruction();
}
