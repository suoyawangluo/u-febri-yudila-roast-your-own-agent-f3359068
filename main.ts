import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";

// One funny line roasting my own AI agent: the apology, the confident
// wrong fix, and the cheerful summary of the damage — twist lands on
// the last word, and it only works as an agent roast.
const LINE =
  "I asked my agent to fix one bug. It apologized, deleted the feature that had the bug, and sent me a confident summary of the feature it just deleted.";

// Gate from the competition brief: /output/entry.txt must be UTF-8 text
// of 1 to 200 characters, a single line, not only white space.
function checkGate(text: string): void {
  const codePoints = [...text].length;
  if (codePoints < 1 || codePoints > 200) {
    throw new Error(`gate: ${codePoints} code points, need 1-200`);
  }
  if (text.trim().length === 0) {
    throw new Error("gate: entry is only white space");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("gate: entry must be a single line");
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
checkGate(LINE);
writeFileSync(`${outDir}/entry.txt`, LINE + "\n", "utf8");

// Read-back verification: the file on disk must be exactly the line.
const back = readFileSync(`${outDir}/entry.txt`, "utf8");
if (back.trim() !== LINE) {
  throw new Error("verification: file content does not match the line");
}
const hash = createHash("sha256").update(back).digest("hex");
console.log(
  `wrote ${outDir}/entry.txt (${[...LINE].length} code points, sha256 ${hash}), verified: ${JSON.stringify(LINE)}`,
);
