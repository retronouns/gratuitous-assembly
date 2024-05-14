import { Asl } from "./asl.ts";
// const file = await Deno.readTextFile("app.asl");

// const lines = file.split("\n").map((line) => line.split(/\s+/));

// const asl = initAsl();

const asl = new Asl();

const instructions1 = [
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

asl.flashInstructions(instructions1);
asl.run();

const instructions2 = [
  `MOV 'F' OUT`,
  `MOV 'O' OUT`,
  `MOV 'O' OUT`,
  `JEQ '1' '1'`,
  `PRINT`,
  `CLEAROUT`,
  `MOV 'B' OUT`,
  `MOV 'A' OUT`,
  `MOV 'R' OUT`,
  `JEQ '1' '0'`,
  `PRINT`,
  `CLEAROUT`,
];

asl.flashInstructions(instructions2);
asl.run();
