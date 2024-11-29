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
  `MOV 'J' OUT`,
  `MOV 'E' OUT`,
  `MOV 'Q' OUT`,
  `JEQ '1' '0'`,
  `PRINT`,
  `CLEAROUT`,
];

asl.flashInstructions(instructions2);
asl.run();

const instructions3 = [
  `MOV 'H' ACC`,
  `MOV 'I' REG`,
  `MOV ACC OUT`,
  `MOV REG OUT`,
  `PRINT`,
];

asl.flashInstructions(instructions3);
asl.run();

const instructions4 = [
  `MOV 500 IDX`,
  `MOV 'M' MEM`,
  `MOV 'E' MEM`,
  `MOV 'M' MEM`,
  `MOV 'O' MEM`,
  `MOV 'R' MEM`,
  `MOV 'Y' MEM`,
  `MOV 500 IDX`,
  `MOV MEM OUT`,
  `MOV MEM OUT`,
  `MOV MEM OUT`,
  `MOV MEM OUT`,
  `MOV MEM OUT`,
  `MOV MEM OUT`,
  `PRINT`,
];

asl.flashInstructions(instructions4);
asl.run();

const instructions5 = [
  `MOV 1 ACC`,
  `MOV 'L' OUT`,
  `MOV 'O' OUT`,
  `MOV 'O' OUT`,
  `MOV 'P' OUT`,
  `PRINT`,
  `JNE ACC 5`,
  `JRL 3`,
  `ADD 1 ACC`,
  `JRL -8`,
  `NOP`,
];

asl.flashInstructions(instructions5);
asl.run();
