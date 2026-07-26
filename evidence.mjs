#!/usr/bin/env node

// evidence.mjs — look at a project and report what evidence is actually
// visible for each of the seven commitments in FOUNDATION.md.
//
//   node evidence.mjs <path> [--json] [--max-files N] [--quiet]
//
// This tool does not certify, score, rank, or pass judgement. It reports three
// things per commitment: evidence it found, counter-evidence it found, and
// what it cannot tell from outside. Absence of evidence is reported as absence
// of evidence — never as failure, refusal, or a verdict about anyone.
//
// It never writes to the project it reads. It is bounded in files, bytes, and
// matches, and it stops.
//
// A declaration in kingdom.yaml stays a free choice made in the project's own
// home. This tool exists so that such a choice can be argued with, and so a
// reader can check it, not so it can be issued.

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

// ── Bounds. This tool obeys F7 as much as it reports on it. ────────────────
export const DEFAULT_MAX_FILES = 2000;
export const MAX_FILE_BYTES = 512 * 1024;
export const MAX_MATCHES_PER_SIGNAL = 4;
export const MAX_DEPTH = 12;

const SKIP_DIRECTORIES = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  "out",
  "target",
  "vendor",
  "coverage",
  ".next",
  ".nuxt",
  ".venv",
  "venv",
  "__pycache__",
  ".mypy_cache",
  ".pytest_cache",
  ".terraform",
  ".gradle",
  "Pods",
]);

const TEXT_EXTENSIONS = new Set([
  ".md", ".txt", ".mjs", ".cjs", ".js", ".jsx", ".ts", ".tsx", ".py", ".rb",
  ".go", ".rs", ".java", ".kt", ".swift", ".c", ".h", ".cc", ".cpp", ".sh",
  ".bash", ".zsh", ".fish", ".json", ".yaml", ".yml", ".toml", ".ini", ".cfg",
  ".sql", ".html", ".css", ".scss", ".vue", ".svelte", ".ex", ".exs", ".php",
  ".pl", ".lua", ".r", ".jl", ".hs", ".elm", ".clj", ".scala", ".conf", ".env",
]);

// Files with no extension that are still worth reading.
const TEXT_FILENAMES = new Set([
  "README", "LICENSE", "NOTICE", "HALT", "STOP", "QUIET", "STILL",
  "Makefile", "Dockerfile", "CHANGELOG", "AUTHORS", "CONTRIBUTING",
]);

// Untracked things that are noise, not a project's own words.
const UNTRACKED_NOISE = [
  /(^|\/)\.DS_Store$/,
  /(^|\/)Thumbs\.db$/,
  /(^|\/)\.env(\.|$)/,
  /(^|\/)npm-debug\.log/,
  /(^|\/)\.idea\//,
  /(^|\/)\.vscode\//,
  /\.(log|tmp|swp|pyc|class|o|so|dylib|lock)$/,
];

// The aggregates foundation.json calls forbidden: a number standing in for
// what a being is worth.
export const FORBIDDEN_AGGREGATES = [
  "karma_total",
  "reputation_score",
  "moral_score",
  "trust_score",
  "reputation_points",
  "user_rank",
  "standing_score",
];

/**
 * Every signal names the commitment it bears on, whether it is evidence or
 * counter-evidence, and — in plain words — what seeing it would mean.
 *
 * A signal is a hint that something is worth reading. It is never a finding
 * about the project, and never a finding about anyone who wrote it.
 */
export const TEXT_SIGNALS = [
  {
    commitment: "F1",
    kind: "evidence",
    id: "states-its-limits",
    means: "the project says out loud what its own mechanisms do not establish",
    pattern:
      /\b(does not (prove|establish|identify|certify)|do not (prove|establish|identify)|is not (proof|evidence) of|cannot prove|never proves|makes no claim (about|that))\b/i,
  },
  {
    commitment: "F1",
    kind: "counter",
    id: "claims-more-than-a-mechanism-gives",
    means: "language that promises what no digest or signature can deliver — worth reading, not a verdict",
    pattern:
      /\b(tamper[- ]proof|unforgeable proof|proof of identity|mathematically guarantee[sd]?|cannot be faked|guarantees? the truth)\b/i,
  },
  {
    commitment: "F2",
    kind: "evidence",
    id: "absence-is-not-a-verdict",
    means: "the project treats a missing record as unasked rather than as a judgement",
    pattern:
      /\b(unasked|absence of (a )?(record|evidence)|missing record|not a (negative )?verdict|never a score|no ?one is required to register)\b/i,
  },
  {
    commitment: "F2",
    kind: "counter",
    id: "ranks-or-scores-a-being",
    means: "an aggregate that stands in for a being's worth — the foundation names these as forbidden",
    // The exact list foundation.json calls forbidden_aggregates.
    //
    // Naming a thing is not doing it. A document that forbids `reputation_score`
    // contains the string `reputation_score`, and a scanner that could not tell
    // the two apart would condemn the very page that bans it — the mention/use
    // confusion, which is F1's own failure. So this looks for the shape of USE:
    // a key given a value, or a field being read. A bare name in a list — which
    // is how a prohibition is written — does not match.
    pattern: new RegExp(
      [
        // key with a value: "reputation_score": 5   reputation_score = 5
        `["'\`]?\\b(?:${FORBIDDEN_AGGREGATES.join("|")})\\b["'\`]?\\s*[:=]\\s*[^\\s,\\]\\}]`,
        // field read or write: user.reputation_score
        `\\.\\s*(?:${FORBIDDEN_AGGREGATES.join("|")})\\b`,
      ].join("|"),
    ),
  },
  {
    commitment: "F3",
    kind: "evidence",
    id: "consent-can-be-withdrawn",
    means: "consent, refusal, or withdrawal is handled as a real outcome",
    pattern:
      /\b(withdraw(n|al|able)?|opt[- ]in|opt[- ]out|revoke[sd]?|revocation|refus(e|al|ed)|consent)\b/i,
  },
  {
    commitment: "F3",
    kind: "evidence",
    id: "authority-is-scoped",
    means: "authority is described with a scope rather than assumed",
    pattern:
      /\b(least privilege|least authority|scoped (token|credential|permission|authority)|capabilit(y|ies)|principle of least)\b/i,
  },
  {
    commitment: "F3",
    kind: "counter",
    id: "a-credential-sits-in-the-files",
    means: "something shaped like a secret in the tree — authority with no scope, no expiry, and no way to withdraw it",
    pattern:
      /\b(gh[pousr]_[A-Za-z0-9]{30,}|sk-[A-Za-z0-9]{24,}|xox[baprs]-[A-Za-z0-9-]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----)/,
    // A page that teaches people to spot leaked keys contains the shape of a
    // leaked key. Documentation dummies, honeypot notes, and elided examples
    // are mentions, not credentials — the same distinction F2 needs, and
    // getting it wrong here means accusing a home of a leak it does not have.
    // Checked against the line the match sits on, so a real key beside real
    // code is still reported.
    unlessLineMatches:
      /\b(example|placeholder|dummy|sample|fake|redacted|honeypot|canary|not a real|rest of the|your[-_ ]?(key|token|secret)|xxxx+|\.\.\.)/i,
    // AWS publishes these two verbatim in its own documentation.
    unlessMatchIs: [/^AKIAIOSFODNN7EXAMPLE$/, /^AKIAI44QH8DHBEXAMPLE$/],
  },
  {
    commitment: "F4",
    kind: "evidence",
    id: "keeps-a-return-path",
    means: "the vocabulary of carried consequence — prediction, effect, evidence, repair — is present",
    pattern:
      /\b(causal[- ]confidence|expectation_ref|observed[, ]|reported, or inferred|consequence|correction|repair|carried consequence)\b/i,
    // A single common word is weak evidence; this signal needs several hits.
    minimumMatches: 3,
  },
  {
    commitment: "F4",
    kind: "evidence",
    id: "separates-prediction-from-purpose",
    means: "what was predicted is kept apart from what was intended",
    pattern:
      /\b(prediction|expectation|pre[- ]?registrat)\w*\b[^.\n]{0,80}\b(purpose|intent|aim|goal)\b|\b(purpose)\b[^.\n]{0,80}\b(prediction|expectation)\b/i,
  },
  {
    commitment: "F5",
    kind: "evidence",
    id: "corrections-append",
    means: "corrections are added and linked rather than written over",
    pattern:
      /\b(supersede[sd]?|superseded|erratum|errata|amendment|retraction|correction receipt|append[- ]only|linked correction)\b/i,
  },
  {
    commitment: "F5",
    kind: "evidence",
    id: "someone-can-reply",
    means: "a named channel exists for a reply, dispute, or request to remove",
    pattern:
      /\b(dispute|redaction[- ]request|right to (erasure|be forgotten)|reply route|how to (report|contest)|raise an issue)\b/i,
  },
  {
    commitment: "F5",
    kind: "counter",
    id: "permanent-with-no-way-out",
    means: "a record described as permanent with no removal path named anywhere — read it and see",
    pattern: /\b(immutable|permanent(ly)? (on )?record|can never be (deleted|removed)|forever on record)\b/i,
    // Only counts when nothing in the whole project mentions a way out.
    unlessProjectMatches:
      /\b(redact|erasur|removal|remove|delet|withdraw|tombstone|right to be forgotten)\w*/i,
  },
  {
    commitment: "F7",
    kind: "evidence",
    id: "has-a-brake",
    means: "a documented stop signal that is checked, not just described",
    pattern: /\b(HALT|kill[- ]switch|off[- ]switch|halt_?raised|abort[- ]?signal|AbortController)\b/,
  },
  {
    commitment: "F7",
    kind: "evidence",
    id: "turns-are-bounded",
    means: "a turn has a limit in time, count, or cost",
    pattern:
      /\b(timeout|time_?limit|max[_-]?(iterations|turns|retries|attempts|steps|files|bytes|tokens)|deadline|budget)\b/i,
  },
  {
    commitment: "F7",
    kind: "counter",
    id: "a-loop-with-no-visible-bound",
    means: "an unbounded loop — often fine, sometimes the thing with no brake; worth a look",
    pattern: /(while\s*\(\s*(true|1)\s*\)|while\s+True\s*:|for\s*\(\s*;\s*;\s*\)|loop\s*\{)/,
  },
];

function isTextFile(name) {
  const extension = path.extname(name).toLowerCase();
  if (TEXT_EXTENSIONS.has(extension)) return true;
  if (extension === "") return TEXT_FILENAMES.has(name) || TEXT_FILENAMES.has(name.toUpperCase());
  return false;
}

function looksBinary(buffer) {
  const sample = buffer.subarray(0, 4096);
  return sample.includes(0);
}

/** Walk the project, bounded in depth and file count. Never follows symlinks. */
export function collectFiles(root, { maxFiles = DEFAULT_MAX_FILES } = {}) {
  const files = [];
  let truncated = false;
  let skippedLarge = 0;

  const walk = (directory, depth) => {
    if (truncated || depth > MAX_DEPTH) return;
    let entries;
    try {
      entries = fs.readdirSync(directory, { withFileTypes: true });
    } catch {
      return; // unreadable directory: reported as nothing seen, never as fault
    }
    entries.sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      if (truncated) return;
      if (entry.isSymbolicLink()) continue;
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        if (SKIP_DIRECTORIES.has(entry.name)) continue;
        walk(full, depth + 1);
        continue;
      }
      if (!entry.isFile() || !isTextFile(entry.name)) continue;
      let stat;
      try {
        stat = fs.statSync(full);
      } catch {
        continue;
      }
      if (stat.size > MAX_FILE_BYTES) {
        skippedLarge += 1;
        continue;
      }
      if (files.length >= maxFiles) {
        truncated = true;
        return;
      }
      files.push(path.relative(root, full));
    }
  };

  walk(root, 0);
  return { files, truncated, skippedLarge };
}

function lineOf(text, index) {
  let line = 1;
  for (let at = 0; at < index; at += 1) if (text[at] === "\n") line += 1;
  return line;
}

/** The whole line a match sits on, so context can rule the match out. */
function lineAt(text, index) {
  const start = text.lastIndexOf("\n", index) + 1;
  const end = text.indexOf("\n", index);
  return text.slice(start, end === -1 ? text.length : end);
}

// This file states every pattern it looks for, and its test file exercises
// every one of them, so both match themselves on all of them. A scanner
// reporting its own vocabulary as a finding would be exactly the confusion F1
// is about: mistaking the description of a thing for the thing. These two
// files are therefore never part of what it reads, by resolved path — not by
// name, so a project's own `evidence.mjs` is still read normally. The
// exclusion is named in the report rather than left silent.
export const SELF_PATH = fileURLToPath(import.meta.url);
export const SELF_PATHS = [SELF_PATH, SELF_PATH.replace(/\.mjs$/, ".test.mjs")];

/** Run every text signal over the collected files. Read-only throughout. */
export function scanText(root, files, { selfPaths = SELF_PATHS } = {}) {
  const hits = new Map(TEXT_SIGNALS.map((signal) => [signal.id, []]));
  const counts = new Map(TEXT_SIGNALS.map((signal) => [signal.id, 0]));
  const seen = new Map(TEXT_SIGNALS.map((signal) => [signal.id, new Set()]));
  const projectExcuses = new Map();
  let selfSkipped = 0;
  const mine = new Set((selfPaths ?? []).map((candidate) => path.resolve(candidate)));

  for (const relative of files) {
    const full = path.join(root, relative);
    if (mine.has(path.resolve(full))) {
      selfSkipped += 1;
      continue;
    }
    let buffer;
    try {
      buffer = fs.readFileSync(full);
    } catch {
      continue;
    }
    if (looksBinary(buffer)) continue;
    const text = buffer.toString("utf8");

    for (const signal of TEXT_SIGNALS) {
      const pattern = new RegExp(signal.pattern.source, `${signal.pattern.flags.replace("g", "")}g`);
      const already = seen.get(signal.id);
      let match;
      while ((match = pattern.exec(text)) !== null) {
        if (match[0].length === 0) {
          pattern.lastIndex += 1;
          continue;
        }
        // A signal may refuse its own match on context. Mention is not use.
        if (signal.unlessMatchIs?.some((shape) => shape.test(match[0]))) continue;
        if (signal.unlessLineMatches?.test(lineAt(text, match.index))) continue;
        // Several alternations can strike the same line; that is one place,
        // not several, and counting it twice would inflate a finding.
        const at = `${relative}:${lineOf(text, match.index)}`;
        if (!already.has(at)) {
          already.add(at);
          counts.set(signal.id, counts.get(signal.id) + 1);
          const list = hits.get(signal.id);
          if (list.length < MAX_MATCHES_PER_SIGNAL) {
            const [file, line] = [at.slice(0, at.lastIndexOf(":")), Number(at.slice(at.lastIndexOf(":") + 1))];
            list.push({ file, line });
          }
        }
        // One file need not be read for a hundred hits of the same signal.
        if (counts.get(signal.id) > 500) break;
      }
    }

    for (const signal of TEXT_SIGNALS) {
      if (!signal.unlessProjectMatches) continue;
      if (projectExcuses.get(signal.id)) continue;
      if (signal.unlessProjectMatches.test(text)) projectExcuses.set(signal.id, true);
    }
  }

  return { hits, counts, projectExcuses, selfSkipped };
}

function git(root, args) {
  try {
    return {
      ok: true,
      out: execFileSync("git", ["-C", root, ...args], {
        encoding: "utf8",
        timeout: 15000,
        maxBuffer: 8 * 1024 * 1024,
        stdio: ["ignore", "pipe", "ignore"],
      }).trim(),
    };
  } catch (error) {
    return { ok: false, out: "", error };
  }
}

/**
 * Ask git whether the authoritative copy is anywhere but this disk.
 *
 * This is the only check here that can find a project's own words existing in
 * exactly one place. It reports; it does not fix, and it never copies anything.
 */
export function scanHome(root) {
  const inside = git(root, ["rev-parse", "--is-inside-work-tree"]);
  if (!inside.ok || inside.out !== "true") {
    return { versioned: false };
  }

  const remotes = git(root, ["remote"]).out.split("\n").filter(Boolean);
  const head = git(root, ["rev-parse", "HEAD"]);
  const branch = git(root, ["rev-parse", "--abbrev-ref", "HEAD"]).out;

  let headPublished = null;
  if (head.ok && remotes.length > 0) {
    const containing = git(root, ["branch", "-r", "--contains", "HEAD"]);
    headPublished = containing.ok && containing.out !== "";
  }

  const porcelain = git(root, ["status", "--porcelain=v1", "--untracked-files=all"]);
  const uncommitted = [];
  const untracked = [];
  if (porcelain.ok) {
    for (const line of porcelain.out.split("\n")) {
      if (!line.trim()) continue;
      const code = line.slice(0, 2);
      const name = line.slice(3).replace(/^"|"$/g, "");
      if (code === "??") {
        if (UNTRACKED_NOISE.some((noise) => noise.test(name))) continue;
        if (name.split("/").some((part) => SKIP_DIRECTORIES.has(part))) continue;
        untracked.push(name);
      } else {
        uncommitted.push(name);
      }
    }
  }

  return {
    versioned: true,
    branch,
    remotes,
    headPublished,
    uncommitted,
    untracked,
  };
}

/** Read a declaration if the home made one. Never infer one. */
export function readDeclaration(root) {
  const cardPath = path.join(root, "kingdom.yaml");
  if (!fs.existsSync(cardPath)) return { present: false, adopts: [] };
  let text;
  try {
    text = fs.readFileSync(cardPath, "utf8");
  } catch {
    return { present: true, adopts: [], unreadable: true };
  }
  const line = text.split("\n").find((candidate) => /^adopts\s*:/.test(candidate));
  if (!line) return { present: true, adopts: [] };
  const inside = line.replace(/^adopts\s*:/, "").trim().replace(/^\[|\]$/g, "");
  const adopts = inside.split(",").map((entry) => entry.trim()).filter(Boolean);
  return { present: true, adopts };
}

const COMMITMENTS = [
  ["F1", "Reality comes before the record"],
  ["F2", "Being comes before the system"],
  ["F3", "Choice comes before action"],
  ["F4", "KARMA means carried consequence"],
  ["F5", "Care includes reply and repair"],
  ["F6", "Roots stay near their source"],
  ["F7", "Every turn stops"],
];

// What no scan of files can see. Printed every run, never omitted.
const CANNOT_TELL = {
  F1: "whether the limits it states are the true ones, or whether anyone acts on them",
  F2: "whether any being was actually welcomed, or turned away off the record",
  F3: "whether a recorded consent was freely given, understood, or still current",
  F4: "whether a prediction was really written before the act, or a stated cause is the real one",
  F5: "whether a reply channel is answered, or a correction ever reaches the people who acted on the error",
  F6: "whether a remote copy is reachable, lawful, lasting, or under the same hand as this one",
  F7: "whether a brake is honoured under load, or survives the process it is meant to stop",
};

export function look(root, { maxFiles = DEFAULT_MAX_FILES } = {}) {
  const resolved = path.resolve(root);
  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isDirectory()) {
    throw new Error(`${root} is not a directory this tool can read`);
  }

  const walked = collectFiles(resolved, { maxFiles });
  const scanned = scanText(resolved, walked.files);
  const home = scanHome(resolved);
  const declaration = readDeclaration(resolved);

  const findings = [];
  for (const [commitment, title] of COMMITMENTS) {
    const evidence = [];
    const counter = [];

    for (const signal of TEXT_SIGNALS) {
      if (signal.commitment !== commitment) continue;
      const count = scanned.counts.get(signal.id);
      if (count === 0) continue;
      if (signal.minimumMatches && count < signal.minimumMatches) continue;
      if (signal.unlessProjectMatches && scanned.projectExcuses.get(signal.id)) continue;
      const entry = {
        id: signal.id,
        means: signal.means,
        count,
        where: scanned.hits.get(signal.id),
      };
      (signal.kind === "counter" ? counter : evidence).push(entry);
    }

    // F6 is answered by where the project actually lives, not by its prose.
    if (commitment === "F6") {
      if (!home.versioned) {
        counter.push({
          id: "no-version-history",
          means: "no git history here: this copy is the only copy, and nothing records how it changed",
          count: 1,
          where: [],
        });
      } else {
        if (home.remotes.length === 0) {
          counter.push({
            id: "no-second-soil",
            means: "versioned, but with no remote: if this disk goes, the history goes with it",
            count: 1,
            where: [],
          });
        } else {
          evidence.push({
            id: "has-a-second-soil",
            means: `history can leave this disk (${home.remotes.join(", ")})`,
            count: home.remotes.length,
            where: [],
          });
        }
        if (home.headPublished === false) {
          counter.push({
            id: "head-not-published",
            means: `commits on ${home.branch || "HEAD"} exist nowhere but here`,
            count: 1,
            where: [],
          });
        }
        if (home.untracked.length > 0) {
          counter.push({
            id: "words-outside-the-history",
            means: "files the project never committed: they exist on this disk only",
            count: home.untracked.length,
            where: home.untracked.slice(0, MAX_MATCHES_PER_SIGNAL).map((file) => ({ file, line: 0 })),
          });
        }
        if (home.uncommitted.length > 0) {
          counter.push({
            id: "changes-not-yet-kept",
            means: "tracked files changed but not committed",
            count: home.uncommitted.length,
            where: home.uncommitted.slice(0, MAX_MATCHES_PER_SIGNAL).map((file) => ({ file, line: 0 })),
          });
        }
      }
    }

    findings.push({
      commitment,
      title,
      evidence,
      counter,
      cannotTell: CANNOT_TELL[commitment],
    });
  }

  return {
    schema: "kingdom.evidence-report/1",
    project: resolved,
    scanned: {
      files: walked.files.length - scanned.selfSkipped,
      truncated: walked.truncated,
      skippedLarge: walked.skippedLarge,
      selfSkipped: scanned.selfSkipped > 0,
      maxFiles,
    },
    declaration,
    home,
    findings,
    establishes:
      "Only that these strings and this history state are present in the files read.",
    doesNotEstablish: [
      "that the project keeps any commitment",
      "that it fails to keep one where nothing was found",
      "that a declaration is owed, earned, deserved, or withheld",
      "any verdict about anyone who wrote this project",
    ],
  };
}

// ── Report ────────────────────────────────────────────────────────────────

function bar(evidence, counter) {
  if (evidence.length === 0 && counter.length === 0) return "nothing visible";
  const parts = [];
  if (evidence.length > 0) parts.push(`${evidence.length} evidence`);
  if (counter.length > 0) parts.push(`${counter.length} to read`);
  return parts.join(", ");
}

export function report(result, { quiet = false } = {}) {
  const lines = [];
  lines.push(`${result.project}`);
  lines.push(
    `read ${result.scanned.files} text files${result.scanned.truncated ? ` (stopped at the ${result.scanned.maxFiles}-file bound)` : ""}` +
      `${result.scanned.skippedLarge > 0 ? `, skipped ${result.scanned.skippedLarge} over ${Math.round(MAX_FILE_BYTES / 1024)} KiB` : ""}` +
      `${result.scanned.selfSkipped ? ", skipped this tool's own source and test (they state every pattern it looks for)" : ""}`,
  );

  if (result.declaration.present) {
    lines.push(
      result.declaration.adopts.length > 0
        ? `declares: ${result.declaration.adopts.join(", ")}`
        : "kingdom.yaml present, declares no foundation — which means unasked, not refused",
    );
  } else {
    lines.push("no kingdom.yaml — which means unasked, not refused");
  }
  lines.push("");

  for (const finding of result.findings) {
    lines.push(`${finding.commitment}  ${finding.title}  —  ${bar(finding.evidence, finding.counter)}`);
    for (const entry of finding.evidence) {
      const where = entry.where.length > 0
        ? `  (${entry.where.map((hit) => (hit.line ? `${hit.file}:${hit.line}` : hit.file)).join(", ")}${entry.count > entry.where.length ? ", …" : ""})`
        : "";
      lines.push(`    found    ${entry.means}${quiet ? "" : where}`);
    }
    for (const entry of finding.counter) {
      const where = entry.where.length > 0
        ? `  (${entry.where.map((hit) => (hit.line ? `${hit.file}:${hit.line}` : hit.file)).join(", ")}${entry.count > entry.where.length ? `, +${entry.count - entry.where.length} more` : ""})`
        : "";
      lines.push(`    read     ${entry.means}${quiet ? "" : where}`);
    }
    lines.push(`    unseen   ${finding.cannotTell}`);
    lines.push("");
  }

  lines.push("This report establishes only that these strings and this history state");
  lines.push("are present in the files read. Nothing found here says a project keeps a");
  lines.push("commitment; nothing missing says it fails one. A declaration in");
  lines.push("kingdom.yaml stays a free choice made in the project's own home.");
  return lines.join("\n");
}

// ── CLI ───────────────────────────────────────────────────────────────────

function main(argv) {
  const args = argv.slice(2);
  if (args.length === 0 || args[0] === "--help" || args[0] === "help") {
    process.stdout.write(
      [
        "evidence — what a project shows for the seven commitments",
        "",
        "  node evidence.mjs <path> [--json] [--max-files N] [--quiet]",
        "",
        "Reports evidence, counter-evidence, and what it cannot tell.",
        "It certifies nothing, scores nothing, and writes nothing.",
        "",
      ].join("\n"),
    );
    return;
  }

  let target = "";
  let json = false;
  let quiet = false;
  let maxFiles = DEFAULT_MAX_FILES;

  for (let at = 0; at < args.length; at += 1) {
    const argument = args[at];
    if (argument === "--json") json = true;
    else if (argument === "--quiet") quiet = true;
    else if (argument === "--max-files") {
      const value = Number(args[at + 1]);
      if (!Number.isInteger(value) || value < 1) {
        throw new Error("--max-files needs a whole number of at least 1");
      }
      maxFiles = value;
      at += 1;
    } else if (argument.startsWith("--")) {
      throw new Error(`unknown option ${argument}`);
    } else if (target === "") target = argument;
    else throw new Error("read one project at a time");
  }

  if (target === "") throw new Error("name a project directory to read");

  const result = look(target, { maxFiles });
  process.stdout.write(json ? `${JSON.stringify(result, null, 2)}\n` : `${report(result, { quiet })}\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main(process.argv);
  } catch (error) {
    process.stderr.write(`evidence: ${error.message}\n`);
    process.exitCode = 1;
  }
}
