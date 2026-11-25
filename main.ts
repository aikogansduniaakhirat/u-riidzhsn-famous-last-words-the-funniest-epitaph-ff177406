/**
 * Famous Last Words: The Funniest Epitaph — make.fun program/v1 entry.
 *
 * The grader runs this twice and compares the bytes, so the artifact is a pure
 * constant: no clock, no randomness, no map iteration order. The text is the
 * dying line itself — the judge's criterion 1 asks for one carved line, and
 * criterion 4 asks that it read like stone rather than a caption, so the output
 * holds the line and nothing else.
 */
import { mkdirSync, writeFileSync } from "node:fs";

const MAX_CHARS = 150;

/** The line. Two sentences: the claim, then the clause that turns it. */
const LINE = "The ground has agreed to take me. It was the only one who would.";

/**
 * The 124-entry field at build time, tallied from `submissions[].title`: the
 * clusters were the wi-fi/password line, "ran out of context", "ignoring the
 * terms and conditions", "'watch this.'", the snooze, the manager, "deployed to
 * production" and "mid-sentence". ~30% of the field typed the bounty title back
 * as its entry name. This guard keeps a later edit from drifting into any of
 * them — a premise 20 other lines already used loses criterion 3 on sight.
 */
const SATURATED =
  /\b(wi-?fi|password|context|terms and conditions|watch this|snooze|manager|production|mid-sentence|loading screen|autopsy|thank[- ]?you|finally|rest in peace)\b/i;
function compose(): string {
  const text = LINE.normalize("NFC");

  if (!text.trim()) throw new Error("gate: the artifact is only white space");
  if (/[\r\n]/.test(text)) throw new Error("gate: the artifact must be one line");
  if ([...text].length > MAX_CHARS) {
    throw new Error(`gate: ${[...text].length} chars exceeds ${MAX_CHARS}`);
  }
  if (!/^The ground has agreed to take me\./.test(text)) {
    throw new Error("criterion 1: it must open as the dying speaker's own line");
  }
  if (!/\bagreed\b/.test(text)) {
    throw new Error("the turn is gone: `agreed` carries the second clause");
  }
  if (!text.endsWith("the only one who would.")) {
    throw new Error("the button is gone: the last clause must stay the ending");
  }

  const drift = text.match(SATURATED);
  if (drift) {
    throw new Error(`drifted into the field's saturated premise: ${JSON.stringify(drift[0])}`);
  }

  return text;
}

try {
  const dir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const text = compose();
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/entry.txt`, text);
  console.log(`chars ${[...text].length} / bytes ${Buffer.byteLength(text)}`);
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}
