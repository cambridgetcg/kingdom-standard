#!/usr/bin/env node

// evidence.mjs — look at a project and report what cues are actually visible
// for each of the seven commitments in FOUNDATION.md.
//
//   node evidence.mjs <path> [--json] [--quiet] [--redact-paths]
//                            [--max-files N] [--max-entries N] [--max-bytes N]
//
// This tool does not certify, score, rank, or pass judgement. It reports three
// things per commitment: observable cues, caution cues worth reading, and what
// it cannot tell from outside. Absence is never failure, refusal, or a verdict
// about anyone.
//
// It issues no project write operation and never runs project code or Git.
// Ordinary reads may still let the operating system update access times.
// Candidate content bytes, tree entries, depth, and matches are bounded.
//
// A declaration in kingdom.yaml stays a free choice made in the project's own
// home. This tool exists so that such a choice can be argued with, and so a
// reader can check it, not so it can be issued.

import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

// ── Bounds. This tool obeys F7 as much as it reports on it. ────────────────
export const DEFAULT_MAX_FILES = 2000;
export const HARD_MAX_FILES = 10000;
export const DEFAULT_MAX_ENTRIES = 20000;
export const HARD_MAX_ENTRIES = 100000;
export const MAX_FILE_BYTES = 512 * 1024;
export const DEFAULT_MAX_BYTES = 32 * 1024 * 1024;
export const HARD_MAX_BYTES = 128 * 1024 * 1024;
export const MAX_DECLARATION_BYTES = 64 * 1024;
export const MAX_MATCHES_PER_SIGNAL = 4;
export const MAX_SIGNAL_PLACES = 500;
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
  ".pem", ".key", ".crt",
]);

// Files with no extension that are still worth reading.
const TEXT_FILENAMES = new Set([
  "README", "LICENSE", "NOTICE", "HALT", "STOP", "QUIET", "STILL",
  "Makefile", "Dockerfile", "CHANGELOG", "AUTHORS", "CONTRIBUTING",
]);

const MODULE_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const FOUNDATION_INDEX_BYTES = fs.readFileSync(
  path.join(MODULE_DIRECTORY, "foundation.json"),
);
const FOUNDATION_INDEX = JSON.parse(FOUNDATION_INDEX_BYTES.toString("utf8"));
const FOUNDATION_DOCUMENT_BYTES = fs.readFileSync(
  path.join(MODULE_DIRECTORY, "FOUNDATION.md"),
);
const OBSERVED_FOUNDATION_SHA256 = createHash("sha256")
  .update(FOUNDATION_DOCUMENT_BYTES)
  .digest("hex");

// The canonical list comes from the machine index beside this tool. The
// scanner never maintains a second, drifting interpretation of the release.
export const FORBIDDEN_AGGREGATES = Object.freeze([
  ...FOUNDATION_INDEX.karma.forbidden_aggregates,
]);
export const FOUNDATION_RELEASE = Object.freeze({
  id: FOUNDATION_INDEX.id,
  indexedDocumentSha256: FOUNDATION_INDEX.document_sha256,
  observedDocumentSha256: OBSERVED_FOUNDATION_SHA256,
  documentDigestMatchesIndex:
    OBSERVED_FOUNDATION_SHA256 === FOUNDATION_INDEX.document_sha256,
  indexSha256: createHash("sha256").update(FOUNDATION_INDEX_BYTES).digest("hex"),
});

/**
 * Every signal names the commitment it bears on, whether it is a text cue or
 * a caution cue, and — in plain words — what seeing it would mean.
 *
 * A signal is a hint that something is worth reading. It is never a finding
 * about the project, and never a finding about anyone who wrote it.
 */
const SIGNALS = [
  {
    commitment: "F1",
    kind: "cue",
    id: "proof-limiting-language",
    means: "text uses proof-limiting language; read the surrounding claim",
    pattern:
      /\b(does not (prove|establish|identify|certify)|do not (prove|establish|identify)|is not (proof|evidence) of|cannot prove|never proves|makes no claim (about|that))\b/i,
  },
  {
    commitment: "F1",
    kind: "caution",
    id: "mechanism-overclaim-language",
    means: "mechanism-overclaim terms appear; inspect whether the surrounding claim is affirmative",
    pattern:
      /\b(tamper[- ]proof|unforgeable proof|proof of identity|mathematically guarantee[sd]?|cannot be faked|guarantees? the truth)\b/i,
  },
  {
    commitment: "F2",
    kind: "cue",
    id: "absence-and-verdict-language",
    means: "text mentions absence as unasked or not a verdict; read the context",
    pattern:
      /\b(unasked|absence of (a )?(record|evidence)|missing record|not a (negative )?verdict|never a score|no ?one is required to register)\b/i,
  },
  {
    commitment: "F2",
    kind: "caution",
    id: "aggregate-name-in-field-shape",
    means: "a name listed as forbidden for KARMA aggregates appears in a field-use shape; inspect whether it is being-wide KARMA or a scoped work/system measure",
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
    kind: "cue",
    id: "choice-and-withdrawal-language",
    means: "text mentions consent, refusal, withdrawal, opt-in, opt-out, or revocation",
    pattern:
      /\b(withdraw(n|al|able)?|opt[- ]in|opt[- ]out|revoke[sd]?|revocation|refus(e|al|ed)|consent)\b/i,
  },
  {
    commitment: "F3",
    kind: "cue",
    id: "scoped-authority-language",
    means: "text mentions scoped authority, capabilities, or least privilege",
    pattern:
      /\b(least privilege|least authority|scoped (token|credential|permission|authority)|capabilit(y|ies)|principle of least)\b/i,
  },
  {
    commitment: "F3",
    kind: "caution",
    id: "credential-shaped-text",
    means: "text contains a credential-shaped value; inspect whether it is live, dummy, or documentation",
    pattern:
      /(?:\b(?:gh[pousr]_[A-Za-z0-9]{30,}|sk-[A-Za-z0-9]{24,}|xox[baprs]-[A-Za-z0-9-]{20,}|AKIA[0-9A-Z]{16})\b|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)/,
    // Exact strings published by AWS as examples are known dummies. Broader
    // words such as "example" never suppress a cue: code can use them too.
    unlessMatchIs: [/^AKIAIOSFODNN7EXAMPLE$/, /^AKIAI44QH8DHBEXAMPLE$/],
  },
  {
    commitment: "F4",
    kind: "cue",
    id: "consequence-return-language",
    means: "carried-consequence vocabulary appears in at least three places",
    pattern:
      /\b(causal[- ]confidence|expectation_ref|observed[, ]|reported, or inferred|consequence|correction|repair|carried consequence)\b/i,
    // A single common word is weak evidence; this signal needs several hits.
    minimumMatches: 3,
  },
  {
    commitment: "F4",
    kind: "cue",
    id: "prediction-and-purpose-language",
    means: "prediction or expectation appears near purpose or intent; inspect the relationship",
    pattern:
      /\b(prediction|expectation|pre[- ]?registrat)\w*\b[^.\n]{0,80}\b(purpose|intent|aim|goal)\b|\b(purpose)\b[^.\n]{0,80}\b(prediction|expectation)\b/i,
  },
  {
    commitment: "F5",
    kind: "cue",
    id: "correction-history-language",
    means: "text mentions correction, supersession, amendment, or append-only history",
    pattern:
      /\b(supersede[sd]?|superseded|erratum|errata|amendment|retraction|correction receipt|append[- ]only|linked correction)\b/i,
  },
  {
    commitment: "F5",
    kind: "cue",
    id: "reply-and-removal-language",
    means: "text mentions reply, dispute, reporting, contest, or removal",
    pattern:
      /\b(dispute|redaction[- ]request|right to (erasure|be forgotten)|reply route|how to (report|contest)|raise an issue)\b/i,
  },
  {
    commitment: "F5",
    kind: "caution",
    id: "permanence-language",
    means: "permanence or immutability terms appear; inspect the surrounding claim and any removal path",
    pattern: /\b(immutable|permanent(ly)? (on )?record|can never be (deleted|removed)|forever on record)\b/i,
  },
  {
    commitment: "F7",
    kind: "cue",
    id: "stop-signal-language",
    means: "text mentions a stop-signal term; this does not show that code checks it",
    pattern: /\b(HALT|kill[- ]switch|off[- ]switch|halt_?raised|abort[- ]?signal|AbortController)\b/,
  },
  {
    commitment: "F7",
    kind: "cue",
    id: "bound-language",
    means: "text mentions a time, count, cost, retry, file, byte, or token bound",
    pattern:
      /\b(timeout|time_?limit|max[_-]?(iterations|turns|retries|attempts|steps|files|bytes|tokens)|deadline|budget)\b/i,
  },
  {
    commitment: "F7",
    kind: "caution",
    id: "visibly-unbounded-loop-syntax",
    means: "loop syntax has no bound in the matched text; a break may exist elsewhere",
    pattern: /(while\s*\(\s*(true|1)\s*\)|while\s+True\s*:|for\s*\(\s*;\s*;\s*\)|loop\s*\{)/,
  },
];

function freezeSignal(signal) {
  Object.freeze(signal.pattern);
  if (signal.unlessMatchIs) {
    for (const pattern of signal.unlessMatchIs) Object.freeze(pattern);
    Object.freeze(signal.unlessMatchIs);
  }
  return Object.freeze(signal);
}

for (const signal of SIGNALS) freezeSignal(signal);
Object.freeze(SIGNALS);

// This exported description is separate from the private table used by
// `look()`. API consumers therefore cannot change a report while leaving its
// source digest unchanged.
export const TEXT_SIGNALS = Object.freeze(SIGNALS.map((signal) => {
  const copy = {
    ...signal,
    pattern: new RegExp(signal.pattern.source, signal.pattern.flags),
  };
  if (signal.unlessMatchIs) {
    copy.unlessMatchIs = Object.freeze(
      signal.unlessMatchIs.map((pattern) => Object.freeze(
        new RegExp(pattern.source, pattern.flags),
      )),
    );
  }
  return freezeSignal(copy);
}));

function isTextFile(name) {
  if (name === ".env" || name.startsWith(".env.")) return true;
  const extension = path.extname(name).toLowerCase();
  if (TEXT_EXTENSIONS.has(extension)) return true;
  if (extension === "") return TEXT_FILENAMES.has(name) || TEXT_FILENAMES.has(name.toUpperCase());
  return false;
}

function looksBinary(buffer) {
  const sample = buffer.subarray(0, 4096);
  return sample.includes(0);
}

function isWithin(root, candidate) {
  const relative = path.relative(root, candidate);
  return (
    relative === ""
    || (
      relative !== ".."
      && !relative.startsWith(`..${path.sep}`)
      && !path.isAbsolute(relative)
    )
  );
}

function sameFile(left, right) {
  return left.dev === right.dev && left.ino === right.ino;
}

function sameSnapshot(left, right) {
  return (
    sameFile(left, right)
    && left.size === right.size
    && left.mtimeMs === right.mtimeMs
    && left.ctimeMs === right.ctimeMs
  );
}

/**
 * Read one regular file without following its final path component.
 *
 * When `canonicalRoot` is given, containment and inode
 * identity are checked before and after opening. This catches ordinary path
 * swaps; Node does not expose openat/O_BENEATH, so a hostile concurrent
 * filesystem remains an explicit blind spot. O_NONBLOCK keeps a
 * regular-to-FIFO swap from hanging.
 */
export function readBoundedRegularFile(
  filePath,
  maximumBytes,
  { canonicalRoot = null } = {},
) {
  if (
    !Number.isInteger(maximumBytes)
    || maximumBytes < 1
    || maximumBytes > HARD_MAX_BYTES
  ) {
    throw new Error(`maximumBytes must be a whole number from 1 to ${HARD_MAX_BYTES}`);
  }
  let before;
  try {
    before = fs.lstatSync(filePath);
  } catch (error) {
    return {
      ok: false,
      state: error?.code === "ENOENT" ? "absent" : "unreadable",
      inspectedBytes: 0,
    };
  }
  if (before.isSymbolicLink()) {
    return { ok: false, state: "symlink", inspectedBytes: 0 };
  }
  if (!before.isFile()) {
    return { ok: false, state: "not-regular", inspectedBytes: 0 };
  }
  if (before.size > maximumBytes) {
    return { ok: false, state: "oversized", inspectedBytes: 0 };
  }

  let containmentRoot = null;
  let canonicalBefore = null;
  if (canonicalRoot !== null) {
    let afterResolution;
    try {
      // Do not resolve this again: a concurrently replaced root must not move
      // the caller's already-canonical boundary.
      containmentRoot = path.resolve(canonicalRoot);
      canonicalBefore = fs.realpathSync(filePath);
      afterResolution = fs.lstatSync(filePath);
    } catch {
      return { ok: false, state: "path-changed", inspectedBytes: 0 };
    }
    if (!isWithin(containmentRoot, canonicalBefore)) {
      return { ok: false, state: "outside-root", inspectedBytes: 0 };
    }
    if (!sameSnapshot(before, afterResolution)) {
      return { ok: false, state: "path-changed", inspectedBytes: 0 };
    }
  }

  let descriptor;
  let inspectedBytes = 0;
  try {
    const noFollow = fs.constants.O_NOFOLLOW ?? 0;
    const nonBlock = fs.constants.O_NONBLOCK ?? 0;
    descriptor = fs.openSync(
      filePath,
      fs.constants.O_RDONLY | noFollow | nonBlock,
    );
    const opened = fs.fstatSync(descriptor);
    if (!opened.isFile()) {
      return { ok: false, state: "not-regular", inspectedBytes };
    }
    if (opened.size > maximumBytes) {
      return { ok: false, state: "oversized", inspectedBytes };
    }
    if (!sameSnapshot(before, opened)) {
      return { ok: false, state: "path-changed", inspectedBytes };
    }

    let afterOpen;
    let canonicalAfterOpen = null;
    try {
      afterOpen = fs.lstatSync(filePath);
      if (containmentRoot !== null) {
        canonicalAfterOpen = fs.realpathSync(filePath);
      }
    } catch {
      return { ok: false, state: "changed-during-read", inspectedBytes };
    }
    if (
      afterOpen.isSymbolicLink()
      || !afterOpen.isFile()
      || !sameSnapshot(opened, afterOpen)
      || (
        containmentRoot !== null
        && (
          !isWithin(containmentRoot, canonicalAfterOpen)
          || canonicalAfterOpen !== canonicalBefore
        )
      )
    ) {
      return { ok: false, state: "changed-during-read", inspectedBytes };
    }

    const bytes = Buffer.alloc(opened.size);
    while (inspectedBytes < bytes.length) {
      const count = fs.readSync(
        descriptor,
        bytes,
        inspectedBytes,
        bytes.length - inspectedBytes,
        inspectedBytes,
      );
      if (count === 0) break;
      inspectedBytes += count;
    }

    let afterRead;
    let pathAfterRead;
    let canonicalAfterRead = null;
    try {
      afterRead = fs.fstatSync(descriptor);
      pathAfterRead = fs.lstatSync(filePath);
      if (containmentRoot !== null) {
        canonicalAfterRead = fs.realpathSync(filePath);
      }
    } catch {
      return { ok: false, state: "changed-during-read", inspectedBytes };
    }
    if (
      inspectedBytes !== opened.size
      || pathAfterRead.isSymbolicLink()
      || !pathAfterRead.isFile()
      || !sameSnapshot(opened, afterRead)
      || !sameSnapshot(opened, pathAfterRead)
      || (
        containmentRoot !== null
        && (
          !isWithin(containmentRoot, canonicalAfterRead)
          || canonicalAfterRead !== canonicalBefore
        )
      )
    ) {
      return { ok: false, state: "changed-during-read", inspectedBytes };
    }
    return {
      ok: true,
      bytes: bytes.subarray(0, inspectedBytes),
      inspectedBytes,
    };
  } catch {
    return { ok: false, state: "unreadable", inspectedBytes };
  } finally {
    if (descriptor !== undefined) {
      try {
        fs.closeSync(descriptor);
      } catch {
        // The read result already carries the narrow observation available.
      }
    }
  }
}

/**
 * Walk the project with bounded streaming directory reads.
 *
 * Entries are sorted with JavaScript code-unit order, independent of locale.
 * A conservative truncation marker is set when the entry bound is reached.
 */
export function collectFiles(
  root,
  {
    maxFiles = DEFAULT_MAX_FILES,
    maxEntries = DEFAULT_MAX_ENTRIES,
  } = {},
) {
  if (
    !Number.isInteger(maxFiles)
    || maxFiles < 1
    || maxFiles > HARD_MAX_FILES
  ) {
    throw new Error(`maxFiles must be a whole number from 1 to ${HARD_MAX_FILES}`);
  }
  if (
    !Number.isInteger(maxEntries)
    || maxEntries < 1
    || maxEntries > HARD_MAX_ENTRIES
  ) {
    throw new Error(`maxEntries must be a whole number from 1 to ${HARD_MAX_ENTRIES}`);
  }
  let canonicalRoot;
  try {
    canonicalRoot = fs.realpathSync(root);
  } catch {
    throw new Error(`${root} is not a directory this tool can read`);
  }
  const files = [];
  let truncated = false;
  let truncatedEntries = false;
  let entriesVisited = 0;
  let skippedLarge = 0;
  let skippedDepth = 0;
  let skippedExcludedDirectories = 0;
  let skippedNonTextFiles = 0;
  let unreadableDirectories = 0;
  let unreadableFiles = 0;
  let skippedSpecial = 0;
  let skippedSymlinks = 0;
  let changedPaths = 0;

  const walk = (directory, depth) => {
    if (truncated || truncatedEntries) return;
    let canonicalBefore;
    let before;
    try {
      canonicalBefore = fs.realpathSync(directory);
      before = fs.lstatSync(directory);
    } catch {
      unreadableDirectories += 1;
      return;
    }
    if (!isWithin(canonicalRoot, canonicalBefore) || !before.isDirectory()) {
      changedPaths += 1;
      return;
    }

    let handle;
    const entries = [];
    try {
      handle = fs.opendirSync(directory);
      while (true) {
        if (entriesVisited >= maxEntries) {
          truncatedEntries = true;
          break;
        }
        const entry = handle.readSync();
        if (entry === null) break;
        entriesVisited += 1;
        entries.push(entry);
      }
    } catch {
      unreadableDirectories += 1;
      return;
    } finally {
      if (handle) {
        try {
          handle.closeSync();
        } catch {
          // The directory is already treated as an observation, not a lock.
        }
      }
    }

    let after;
    let canonicalAfter;
    try {
      after = fs.lstatSync(directory);
      canonicalAfter = fs.realpathSync(directory);
    } catch {
      changedPaths += 1;
      return;
    }
    if (
      !after.isDirectory()
      || !sameFile(before, after)
      || canonicalAfter !== canonicalBefore
      || !isWithin(canonicalRoot, canonicalAfter)
    ) {
      changedPaths += 1;
      return;
    }

    entries.sort((left, right) => (
      left.name < right.name ? -1 : left.name > right.name ? 1 : 0
    ));
    for (const entry of entries) {
      if (truncated) return;
      if (entry.isSymbolicLink()) {
        skippedSymlinks += 1;
        continue;
      }
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        if (SKIP_DIRECTORIES.has(entry.name)) {
          skippedExcludedDirectories += 1;
          continue;
        }
        if (depth >= MAX_DEPTH) {
          skippedDepth += 1;
          continue;
        }
        walk(full, depth + 1);
        continue;
      }
      if (!entry.isFile()) {
        skippedSpecial += 1;
        continue;
      }
      if (!isTextFile(entry.name)) {
        skippedNonTextFiles += 1;
        continue;
      }
      let stat;
      try {
        stat = fs.lstatSync(full);
      } catch {
        unreadableFiles += 1;
        continue;
      }
      if (!stat.isFile()) {
        skippedSpecial += 1;
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
      files.push(path.relative(canonicalRoot, full));
    }
  };

  walk(canonicalRoot, 0);
  return {
    files,
    truncated,
    truncatedEntries,
    entriesVisited,
    skippedLarge,
    skippedDepth,
    skippedExcludedDirectories,
    skippedNonTextFiles,
    unreadableDirectories,
    unreadableFiles,
    skippedSpecial,
    skippedSymlinks,
    changedPaths,
  };
}

// This file states every pattern it looks for, and its test file exercises
// every one of them, so both match themselves on all of them. A scanner
// reporting its own vocabulary as a finding would be exactly the confusion F1
// is about: mistaking the description of a thing for the thing. These two
// files are therefore never part of what it reads, by resolved path — not by
// name, so a project's own `evidence.mjs` is still read normally. The
// exclusion is named in the report rather than left silent.
export const SELF_PATH = fs.realpathSync(fileURLToPath(import.meta.url));
const INTERNAL_SELF_PATHS = Object.freeze([
  SELF_PATH,
  SELF_PATH.replace(/\.mjs$/, ".test.mjs"),
].filter((candidate) => fs.existsSync(candidate)).map((candidate) => fs.realpathSync(candidate)));
export const SELF_PATHS = Object.freeze([...INTERNAL_SELF_PATHS]);
export const TOOL_SOURCE_SHA256 = createHash("sha256")
  .update(fs.readFileSync(SELF_PATH))
  .digest("hex");

function lineCursor(text) {
  let number = 1;
  let start = 0;
  let end = text.indexOf("\n");
  return (index) => {
    while (end !== -1 && index > end) {
      number += 1;
      start = end + 1;
      end = text.indexOf("\n", start);
    }
    return number;
  };
}

/** Run every text signal over the collected files. Read-only throughout. */
export function scanText(
  root,
  files,
  {
    selfPaths = INTERNAL_SELF_PATHS,
    maxBytes = DEFAULT_MAX_BYTES,
  } = {},
) {
  if (!Array.isArray(files)) {
    throw new Error("files must be an array");
  }
  if (files.length > HARD_MAX_FILES) {
    throw new Error(`files may contain at most ${HARD_MAX_FILES} entries`);
  }
  for (let at = 0; at < files.length; at += 1) {
    if (typeof files[at] !== "string") {
      throw new Error("every files entry must be a string path");
    }
  }
  if (
    !Number.isInteger(maxBytes)
    || maxBytes < 1
    || maxBytes > HARD_MAX_BYTES
  ) {
    throw new Error(`maxBytes must be a whole number from 1 to ${HARD_MAX_BYTES}`);
  }
  const candidateCount = files.length;
  let canonicalRoot;
  try {
    canonicalRoot = fs.realpathSync(root);
  } catch {
    throw new Error(`${root} is not a directory this tool can read`);
  }
  const hits = new Map(SIGNALS.map((signal) => [signal.id, []]));
  const counts = new Map(SIGNALS.map((signal) => [signal.id, 0]));
  const seen = new Map(SIGNALS.map((signal) => [signal.id, new Set()]));
  const truncatedSignals = new Set();
  let selfSkipped = 0;
  let filesRead = 0;
  let bytesRead = 0;
  let textBytes = 0;
  let skippedBinary = 0;
  let skippedUnreadable = 0;
  let skippedChangedPaths = 0;
  let truncatedBytes = false;
  const mine = new Set(
    (selfPaths ?? []).map((candidate) => {
      try {
        return fs.realpathSync(candidate);
      } catch {
        return path.resolve(candidate);
      }
    }),
  );

  // Index the bounded array directly. A caller-supplied iterator can be
  // infinite even when the array itself is short.
  for (let candidateIndex = 0; candidateIndex < candidateCount; candidateIndex += 1) {
    const relative = files[candidateIndex];
    if (bytesRead >= maxBytes) {
      truncatedBytes = true;
      break;
    }
    const full = path.resolve(canonicalRoot, relative);
    let canonical;
    try {
      canonical = fs.realpathSync(full);
    } catch {
      skippedUnreadable += 1;
      continue;
    }
    if (
      !isWithin(canonicalRoot, canonical)
    ) {
      skippedChangedPaths += 1;
      continue;
    }
    if (mine.has(canonical)) {
      selfSkipped += 1;
      continue;
    }
    const remaining = maxBytes - bytesRead;
    const read = readBoundedRegularFile(
      full,
      Math.min(MAX_FILE_BYTES, remaining),
      { canonicalRoot },
    );
    bytesRead += read.inspectedBytes ?? 0;
    if (!read.ok) {
      if (read.state === "oversized") {
        truncatedBytes = true;
        break;
      }
      if (
        read.state === "outside-root"
        || read.state === "path-changed"
        || read.state === "changed-during-read"
        || read.state === "symlink"
        || read.state === "not-regular"
      ) {
        skippedChangedPaths += 1;
      } else {
        skippedUnreadable += 1;
      }
      continue;
    }
    const buffer = read.bytes;
    if (looksBinary(buffer)) {
      skippedBinary += 1;
      continue;
    }
    let text;
    try {
      text = new TextDecoder("utf-8", { fatal: true }).decode(buffer);
    } catch {
      skippedBinary += 1;
      continue;
    }
    filesRead += 1;
    textBytes += buffer.length;

    for (const signal of SIGNALS) {
      if (truncatedSignals.has(signal.id)) continue;
      const pattern = new RegExp(signal.pattern.source, `${signal.pattern.flags.replace("g", "")}g`);
      const already = seen.get(signal.id);
      const locate = lineCursor(text);
      let match;
      while ((match = pattern.exec(text)) !== null) {
        if (match[0].length === 0) {
          pattern.lastIndex += 1;
          continue;
        }
        // A signal may refuse its own match on context. Mention is not use.
        if (signal.unlessMatchIs?.some((shape) => shape.test(match[0]))) continue;
        const line = locate(match.index);
        // Several alternations can strike the same line; that is one place,
        // not several, and counting it twice would inflate a finding.
        const at = `${relative}\0${line}`;
        if (!already.has(at)) {
          if (counts.get(signal.id) >= MAX_SIGNAL_PLACES) {
            truncatedSignals.add(signal.id);
            break;
          }
          already.add(at);
          counts.set(signal.id, counts.get(signal.id) + 1);
          const list = hits.get(signal.id);
          if (list.length < MAX_MATCHES_PER_SIGNAL) {
            list.push({ file: relative, line });
          }
        }
      }
    }
  }

  return {
    hits,
    counts,
    selfSkipped,
    filesRead,
    bytesRead,
    textBytes,
    skippedBinary,
    skippedUnreadable,
    skippedChangedPaths,
    truncatedBytes,
    truncatedSignals: [...truncatedSignals].sort(),
  };
}

/**
 * Observe only whether a `.git` marker exists at or above the project.
 *
 * This deliberately does not run Git. Even a read-looking `git status` can
 * execute a repository-configured content filter. A marker is not proof that
 * history is readable, sound, remote, published, or owned by anyone.
 */
export function scanHome(root) {
  let requestedRoot;
  try {
    requestedRoot = fs.realpathSync(root);
  } catch {
    return {
      markerState: "root-unreadable",
      markerRoot: null,
      pathFromMarkerRoot: null,
    };
  }
  let cursor = requestedRoot;
  while (true) {
    const marker = path.join(cursor, ".git");
    try {
      const stat = fs.lstatSync(marker);
      if (stat.isDirectory() || stat.isFile()) {
        return {
          markerState: stat.isDirectory() ? "directory" : "file",
          markerRoot: cursor,
          pathFromMarkerRoot: path.relative(cursor, requestedRoot) || ".",
        };
      }
      if (stat.isSymbolicLink()) {
        return {
          markerState: "symbolic-link",
          markerRoot: cursor,
          pathFromMarkerRoot: path.relative(cursor, requestedRoot) || ".",
        };
      }
      return {
        markerState: "special",
        markerRoot: cursor,
        pathFromMarkerRoot: path.relative(cursor, requestedRoot) || ".",
      };
    } catch (error) {
      if (error?.code !== "ENOENT" && error?.code !== "ENOTDIR") {
        return {
          markerState: "unreadable",
          markerRoot: cursor,
          pathFromMarkerRoot: path.relative(cursor, requestedRoot) || ".",
        };
      }
    }
    const parent = path.dirname(cursor);
    if (parent === cursor) break;
    cursor = parent;
  }
  return {
    markerState: "absent",
    markerRoot: null,
    pathFromMarkerRoot: null,
  };
}

const ADOPTION_ID_RE = /^[a-z0-9][a-z0-9._-]*\/[A-Za-z0-9][A-Za-z0-9._-]*$/;

function validAdoptionIds(values) {
  return (
    values.length <= 64
    && new Set(values).size === values.length
    && values.every((value) => ADOPTION_ID_RE.test(value))
  );
}

function valueWithoutComment(raw) {
  let quote = null;
  let escaped = false;
  for (let at = 0; at < raw.length; at += 1) {
    const character = raw[at];
    if (quote === "\"") {
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === "\"") {
        quote = null;
      }
      continue;
    }
    if (quote === "'") {
      if (character === "'" && raw[at + 1] === "'") {
        at += 1;
      } else if (character === "'") {
        quote = null;
      }
      continue;
    }
    if (character === "\"" || character === "'") {
      quote = character;
      continue;
    }
    if (
      character === "#"
      && (at === 0 || /\s/.test(raw[at - 1]))
    ) {
      return raw.slice(0, at).trimEnd();
    }
  }
  return raw.trimEnd();
}

function supportedCardValue(raw) {
  const value = valueWithoutComment(raw).trim();
  if (value === "") return true;
  if (value.startsWith("[")) {
    return /^\[\s*(?:[A-Za-z0-9][A-Za-z0-9._/-]*(?:\s*,\s*[A-Za-z0-9][A-Za-z0-9._/-]*)*)?\s*\]$/.test(value);
  }
  if (value.startsWith("\"")) {
    try {
      return typeof JSON.parse(value) === "string";
    } catch {
      return false;
    }
  }
  if (value.startsWith("'")) {
    return /^'(?:[^']|'')*'$/.test(value);
  }
  return (
    !/^[\]\{\},#&*!|>%@`"']/.test(value)
    && !/^(?:-|\?|:)(?:\s|$)/.test(value)
    && !/[\[\]\{\}]/.test(value)
    && !/:\s/.test(value)
    && !/:$/.test(value)
  );
}

/**
 * Validate the whole card against the small syntax Kingdom cards use:
 * top-level keys, plain or quoted scalar values, simple flow lists, comments,
 * and the canonical two-space adoption block. This is deliberately narrower
 * than YAML; anything outside it stays unknown.
 */
function usesSupportedCardSyntax(lines) {
  const keys = new Set();
  let adoptionBlock = false;
  const adoptionItem = /^  - ([^\s#]+)(?: +(?:#.*)?)?$/;
  for (const line of lines) {
    if (/^\s*(?:#.*)?$/.test(line)) continue;
    if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(line)) {
      return false;
    }
    if (/^\s/.test(line)) {
      if (
        adoptionBlock
        && adoptionItem.test(line)
        && ADOPTION_ID_RE.test(adoptionItem.exec(line)[1])
      ) {
        continue;
      }
      return false;
    }
    adoptionBlock = false;
    // YAML requires separation whitespace (or end-of-line) after a mapping
    // colon. Without it, `key:value` is a plain scalar rather than a mapping.
    const mapping =
      /^([A-Za-z_][A-Za-z0-9_-]*) *:(?: +(.*))?$/.exec(line);
    if (!mapping) return false;
    const [, key, capturedValue] = mapping;
    const rawValue = capturedValue ?? "";
    if (keys.has(key) || !supportedCardValue(rawValue)) return false;
    keys.add(key);
    if (key === "adopts" && valueWithoutComment(rawValue).trim() === "") {
      adoptionBlock = true;
    }
  }
  return true;
}

function declarationObservation(present, state, adopts, inspectedBytes = 0) {
  return {
    present,
    state,
    adopts,
    inspectedBytes,
    maxBytes: MAX_DECLARATION_BYTES,
  };
}

/**
 * Read the small, canonical `adopts` subset used by Kingdom cards.
 *
 * Supported forms are an unquoted flow list or an indented block list. Any
 * other shape is reported as unparsed; uncertainty never becomes "no
 * adoption". The bounded no-follow reader rejects links and special files.
 */
export function readDeclaration(root) {
  let canonicalRoot;
  try {
    canonicalRoot = fs.realpathSync(root);
  } catch {
    return declarationObservation(false, "root-unreadable", null);
  }
  const cardPath = path.join(canonicalRoot, "kingdom.yaml");
  const read = readBoundedRegularFile(
    cardPath,
    MAX_DECLARATION_BYTES,
    { canonicalRoot },
  );
  if (!read.ok) {
    if (read.state === "absent") {
      return declarationObservation(
        false,
        "absent",
        null,
        read.inspectedBytes ?? 0,
      );
    }
    return declarationObservation(
      true,
      read.state,
      null,
      read.inspectedBytes ?? 0,
    );
  }

  let text;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(read.bytes);
  } catch {
    return declarationObservation(
      true,
      "invalid-utf8",
      null,
      read.inspectedBytes,
    );
  }

  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  if (
    text.includes("\t")
    || lines.some((line) => /^(?:---|\.\.\.)\s*(?:#.*)?$/.test(line))
    || !usesSupportedCardSyntax(lines)
  ) {
    return declarationObservation(
      true,
      "unparsed",
      null,
      read.inspectedBytes,
    );
  }
  const declarations = lines
    .map((line, index) => ({ line, index }))
    .filter(({ line }) => /^adopts *:(?: |$)/.test(line));
  if (declarations.length === 0) {
    return declarationObservation(
      true,
      "not-declared",
      null,
      read.inspectedBytes,
    );
  }
  if (declarations.length !== 1) {
    return declarationObservation(
      true,
      "unparsed",
      null,
      read.inspectedBytes,
    );
  }

  const { line, index } = declarations[0];
  const flow =
    /^adopts *: +\[([^\]]*)\](?: +(?:#.*)?)?$/.exec(line);
  if (flow) {
    const adopts = flow[1].trim() === ""
      ? []
      : flow[1].split(",").map((entry) => entry.trim());
    return validAdoptionIds(adopts)
      ? declarationObservation(true, "parsed", adopts, read.inspectedBytes)
      : declarationObservation(true, "unparsed", null, read.inspectedBytes);
  }

  if (!/^adopts *:(?: +#.*)? *$/.test(line)) {
    return declarationObservation(
      true,
      "unparsed",
      null,
      read.inspectedBytes,
    );
  }
  const adopts = [];
  for (let at = index + 1; at < lines.length; at += 1) {
    const candidate = lines[at];
    if (/^\s*(?:#.*)?$/.test(candidate)) continue;
    if (/^\S/.test(candidate)) break;
    // `#` begins a YAML comment only after separation whitespace.
    const item = /^  - ([^\s#]+)(?: +(?:#.*)?)?$/.exec(candidate);
    if (!item) {
      return declarationObservation(
        true,
        "unparsed",
        null,
        read.inspectedBytes,
      );
    }
    adopts.push(item[1]);
  }
  return adopts.length > 0 && validAdoptionIds(adopts)
    ? declarationObservation(true, "parsed", adopts, read.inspectedBytes)
    : declarationObservation(true, "unparsed", null, read.inspectedBytes);
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
  F6: "whether the marker names a valid repository, whether the project works without a bridge, who owns any bridge, what authority it has, or whether a being can leave honestly",
  F7: "whether a brake is honoured under load, or survives the process it is meant to stop",
};

function describeHome(home) {
  const descriptions = {
    directory:
      "a regular .git marker exists at or above the selected project; Git was not run",
    file:
      "a regular .git marker file exists at or above the selected project; Git was not run",
    absent:
      "no regular .git marker was observed at or above the selected project",
    "symbolic-link":
      "a .git symbolic link was observed and not followed",
    special:
      "a special .git filesystem entry was observed and not opened",
    unreadable:
      "a .git marker could not be read",
    "root-unreadable":
      "the requested root could not be resolved for a home observation",
  };
  const observations = [
    descriptions[home.markerState] ?? "a local home state was observed",
  ];
  if (
    (home.markerState === "directory" || home.markerState === "file")
    && home.pathFromMarkerRoot !== "."
  ) {
    observations.push(
      "the selected project is inside a parent that carries the observed .git marker",
    );
  }
  return observations;
}

export function look(
  root,
  {
    maxFiles = DEFAULT_MAX_FILES,
    maxEntries = DEFAULT_MAX_ENTRIES,
    maxBytes = DEFAULT_MAX_BYTES,
  } = {},
) {
  if (
    !Number.isInteger(maxFiles)
    || maxFiles < 1
    || maxFiles > HARD_MAX_FILES
  ) {
    throw new Error(`maxFiles must be a whole number from 1 to ${HARD_MAX_FILES}`);
  }
  if (
    !Number.isInteger(maxEntries)
    || maxEntries < 1
    || maxEntries > HARD_MAX_ENTRIES
  ) {
    throw new Error(`maxEntries must be a whole number from 1 to ${HARD_MAX_ENTRIES}`);
  }
  if (
    !Number.isInteger(maxBytes)
    || maxBytes < 1
    || maxBytes > HARD_MAX_BYTES
  ) {
    throw new Error(`maxBytes must be a whole number from 1 to ${HARD_MAX_BYTES}`);
  }

  const selected = path.resolve(root);
  let resolved;
  try {
    resolved = fs.realpathSync(selected);
  } catch {
    throw new Error(`${root} is not a directory this tool can read`);
  }
  let rootStat;
  try {
    rootStat = fs.statSync(resolved);
  } catch {
    throw new Error(`${root} is not a directory this tool can read`);
  }
  if (!rootStat.isDirectory()) {
    throw new Error(`${root} is not a directory this tool can read`);
  }

  const walked = collectFiles(resolved, { maxFiles, maxEntries });
  const scanned = scanText(resolved, walked.files, { maxBytes });
  const home = scanHome(resolved);
  const declaration = readDeclaration(resolved);

  const findings = [];
  for (const [commitment, title] of COMMITMENTS) {
    const cues = [];
    const cautionCues = [];

    for (const signal of SIGNALS) {
      if (signal.commitment !== commitment) continue;
      const count = scanned.counts.get(signal.id);
      if (count === 0) continue;
      if (signal.minimumMatches && count < signal.minimumMatches) continue;
      const entry = {
        id: signal.id,
        means: signal.means,
        count,
        where: scanned.hits.get(signal.id),
      };
      (signal.kind === "caution" ? cautionCues : cues).push(entry);
    }

    findings.push({
      commitment,
      title,
      cues,
      cautionCues,
      cannotTell: CANNOT_TELL[commitment],
    });
  }

  return {
    schema: "kingdom.evidence-report/2",
    observedAt: new Date().toISOString(),
    foundation: {
      id: FOUNDATION_RELEASE.id,
      indexedDocumentSha256: FOUNDATION_RELEASE.indexedDocumentSha256,
      observedDocumentSha256: FOUNDATION_RELEASE.observedDocumentSha256,
      documentDigestMatchesIndex:
        FOUNDATION_RELEASE.documentDigestMatchesIndex,
      indexSha256: FOUNDATION_RELEASE.indexSha256,
    },
    tool: {
      id: "kingdom.foundation-evidence-reader/2",
      source: path.basename(SELF_PATH),
      sourceSha256: TOOL_SOURCE_SHA256,
    },
    project: resolved,
    scanned: {
      files: scanned.filesRead,
      candidates: walked.files.length,
      entriesVisited: walked.entriesVisited,
      bytes: scanned.textBytes,
      inspectedBytes: scanned.bytesRead,
      truncatedFiles: walked.truncated,
      truncatedEntries: walked.truncatedEntries,
      truncatedBytes: scanned.truncatedBytes,
      truncatedSignals: scanned.truncatedSignals,
      skippedLarge: walked.skippedLarge,
      skippedDepth: walked.skippedDepth,
      skippedExcludedDirectories: walked.skippedExcludedDirectories,
      skippedNonTextFiles: walked.skippedNonTextFiles,
      unreadableDirectories: walked.unreadableDirectories,
      unreadableFiles: walked.unreadableFiles + scanned.skippedUnreadable,
      skippedSpecial: walked.skippedSpecial,
      skippedSymlinks: walked.skippedSymlinks,
      changedPaths:
        walked.changedPaths + scanned.skippedChangedPaths,
      skippedBinary: scanned.skippedBinary,
      selfSkipped: scanned.selfSkipped > 0,
      maxFiles,
      maxEntries,
      maxBytes,
      byteBudgetScope: "cue-candidate-files",
    },
    declaration,
    home,
    findings,
    readerReports:
      "that it observed these bounded cues and local marker states during a non-atomic read",
    doesNotEstablish: [
      "that the project keeps any commitment",
      "that it fails to keep one where nothing was found",
      "that a declaration is owed, earned, deserved, or withheld",
      "that a .git marker is valid history or implies any remote copy",
      "that a text cue is implemented, effective, or stated affirmatively",
      "a single atomic snapshot or safety against a hostile concurrently changing filesystem",
      "any verdict about anyone who wrote this project",
    ],
  };
}

// ── Report ────────────────────────────────────────────────────────────────

function bar(cues, cautionCues) {
  if (cues.length === 0 && cautionCues.length === 0) return "nothing visible";
  const parts = [];
  if (cues.length > 0) {
    parts.push(`${cues.length} text cue${cues.length === 1 ? "" : "s"}`);
  }
  if (cautionCues.length > 0) {
    parts.push(`${cautionCues.length} caution cue${cautionCues.length === 1 ? "" : "s"}`);
  }
  return parts.join(", ");
}

function terminalSafe(value) {
  return String(value).replace(
    /[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g,
    (character) => {
      const point = character.codePointAt(0);
      return point <= 0xff
        ? `\\x${point.toString(16).padStart(2, "0")}`
        : `\\u${point.toString(16).padStart(4, "0")}`;
    },
  );
}

/** Return a report copy with local paths and labels removed. */
export function redactPaths(result) {
  const redacted = structuredClone(result);
  redacted.project = "<redacted>";
  if (redacted.home?.markerRoot) redacted.home.markerRoot = "<redacted>";
  if (redacted.home?.pathFromMarkerRoot) {
    redacted.home.pathFromMarkerRoot = "<redacted>";
  }
  for (const finding of redacted.findings ?? []) {
    for (const entry of [...finding.cues, ...finding.cautionCues]) {
      entry.where = entry.where.map((hit) => ({
        file: "<redacted>",
        line: 0,
      }));
    }
  }
  return redacted;
}

export function report(result, { quiet = false } = {}) {
  const lines = [];
  lines.push(`${result.project}`);
  lines.push(
    `${result.foundation.id} ${result.foundation.observedDocumentSha256.slice(0, 12)}…` +
      `${result.foundation.documentDigestMatchesIndex ? "" : " (does not match index)"} · ` +
      `tool ${result.tool.sourceSha256.slice(0, 12)}… · observed ${result.observedAt}`,
  );
  lines.push(
    `cue scan read ${result.scanned.files} UTF-8 text files (${result.scanned.bytes} bytes)` +
      `${result.scanned.inspectedBytes !== result.scanned.bytes ? `; inspected ${result.scanned.inspectedBytes} bounded candidate bytes` : ""}` +
      `${result.scanned.truncatedFiles ? `; stopped at the ${result.scanned.maxFiles}-file bound` : ""}` +
      `${result.scanned.truncatedEntries ? `; stopped at the ${result.scanned.maxEntries}-entry bound` : ""}` +
      `${result.scanned.truncatedBytes ? `; stopped at the ${result.scanned.maxBytes}-byte bound` : ""}` +
      `${result.scanned.skippedLarge > 0 ? `, skipped ${result.scanned.skippedLarge} over ${Math.round(MAX_FILE_BYTES / 1024)} KiB` : ""}` +
      `${result.scanned.selfSkipped ? ", skipped this tool's own source and test (they state every pattern it looks for)" : ""}`,
  );
  const blindSpots = [
    ["deep directories", result.scanned.skippedDepth],
    [
      "excluded dependency, build, cache, or Git directories (contents not walked)",
      result.scanned.skippedExcludedDirectories,
    ],
    [
      "regular files outside the text-name allowlist",
      result.scanned.skippedNonTextFiles,
    ],
    ["unreadable directories", result.scanned.unreadableDirectories],
    ["unreadable files", result.scanned.unreadableFiles],
    ["special files", result.scanned.skippedSpecial],
    ["symbolic links", result.scanned.skippedSymlinks],
    ["changed or escaped paths", result.scanned.changedPaths],
    ["binary or invalid UTF-8 files", result.scanned.skippedBinary],
  ].filter(([, count]) => count > 0);
  if (blindSpots.length > 0) {
    lines.push(
      `blind spots: ${blindSpots.map(([label, count]) => `${count} ${label}`).join(", ")}`,
    );
  }
  if (result.scanned.truncatedSignals.length > 0) {
    lines.push(
      `match bounds reached for: ${result.scanned.truncatedSignals.join(", ")}`,
    );
  }
  lines.push(
    `kingdom.yaml read ${result.declaration.inspectedBytes} bytes under its independent ` +
      `${result.declaration.maxBytes}-byte bound`,
  );

  if (!result.declaration.present) {
    lines.push("no kingdom.yaml observed — adoption and refusal are unknown");
  } else if (result.declaration.state === "parsed") {
    lines.push(
      result.declaration.adopts.length > 0
        ? `declares: ${result.declaration.adopts.join(", ")}`
        : "kingdom.yaml explicitly declares an empty adoption list",
    );
  } else if (result.declaration.state === "not-declared") {
    lines.push("no adoption declaration observed in kingdom.yaml — adoption and refusal are unknown");
  } else {
    lines.push(
      `kingdom.yaml adoption state is ${result.declaration.state}; no adoption or refusal is inferred`,
    );
  }
  for (const observation of describeHome(result.home)) {
    lines.push(`home: ${observation}`);
  }
  lines.push("");

  for (const finding of result.findings) {
    lines.push(`${finding.commitment}  ${finding.title}  —  ${bar(finding.cues, finding.cautionCues)}`);
    for (const entry of finding.cues) {
      const where = entry.where.length > 0
        ? `  (${entry.where.map((hit) => (hit.line ? `${hit.file}:${hit.line}` : hit.file)).join(", ")}${entry.count > entry.where.length ? ", …" : ""})`
        : "";
      lines.push(`    cue      ${entry.means}${quiet ? "" : where}`);
    }
    for (const entry of finding.cautionCues) {
      const where = entry.where.length > 0
        ? `  (${entry.where.map((hit) => (hit.line ? `${hit.file}:${hit.line}` : hit.file)).join(", ")}${entry.count > entry.where.length ? `, +${entry.count - entry.where.length} more` : ""})`
        : "";
      lines.push(`    caution  ${entry.means}${quiet ? "" : where}`);
    }
    lines.push(`    unseen   ${finding.cannotTell}`);
    lines.push("");
  }

  lines.push("This reader reports what it observed during a bounded, non-atomic read.");
  lines.push("Nothing found here says a project keeps a commitment; nothing missing");
  lines.push("says it fails one. A declaration in");
  lines.push("kingdom.yaml stays a free choice made in the project's own home.");
  return lines.map(terminalSafe).join("\n");
}

// ── CLI ───────────────────────────────────────────────────────────────────

function main(argv) {
  const args = argv.slice(2);
  if (args.length === 0 || args[0] === "--help" || args[0] === "help") {
    process.stdout.write(
      [
        "evidence — what a project shows for the seven commitments",
        "",
        "  node evidence.mjs <path> [--json] [--quiet] [--redact-paths]",
        "                           [--max-files N] [--max-entries N] [--max-bytes N]",
        "",
        "Reports observable cues, caution cues, and what it cannot tell.",
        "It certifies nothing, scores nothing, and issues no project writes.",
        "--max-bytes bounds cue-candidate content; kingdom.yaml has a separate 64 KiB bound.",
        "",
      ].join("\n"),
    );
    return;
  }

  let target = "";
  let json = false;
  let quiet = false;
  let redact = false;
  let maxFiles = DEFAULT_MAX_FILES;
  let maxEntries = DEFAULT_MAX_ENTRIES;
  let maxBytes = DEFAULT_MAX_BYTES;

  for (let at = 0; at < args.length; at += 1) {
    const argument = args[at];
    if (argument === "--json") json = true;
    else if (argument === "--quiet") quiet = true;
    else if (argument === "--redact-paths") redact = true;
    else if (argument === "--max-files") {
      const value = Number(args[at + 1]);
      if (!Number.isInteger(value) || value < 1 || value > HARD_MAX_FILES) {
        throw new Error(`--max-files needs a whole number from 1 to ${HARD_MAX_FILES}`);
      }
      maxFiles = value;
      at += 1;
    } else if (argument === "--max-entries") {
      const value = Number(args[at + 1]);
      if (!Number.isInteger(value) || value < 1 || value > HARD_MAX_ENTRIES) {
        throw new Error(`--max-entries needs a whole number from 1 to ${HARD_MAX_ENTRIES}`);
      }
      maxEntries = value;
      at += 1;
    } else if (argument === "--max-bytes") {
      const value = Number(args[at + 1]);
      if (!Number.isInteger(value) || value < 1 || value > HARD_MAX_BYTES) {
        throw new Error(`--max-bytes needs a whole number from 1 to ${HARD_MAX_BYTES}`);
      }
      maxBytes = value;
      at += 1;
    } else if (argument.startsWith("--")) {
      throw new Error(`unknown option ${argument}`);
    } else if (target === "") target = argument;
    else throw new Error("read one project at a time");
  }

  if (target === "") throw new Error("name a project directory to read");

  const result = look(target, { maxFiles, maxEntries, maxBytes });
  const visible = redact ? redactPaths(result) : result;
  process.stdout.write(
    json
      ? `${JSON.stringify(visible, null, 2)}\n`
      : `${report(visible, { quiet })}\n`,
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main(process.argv);
  } catch (error) {
    const redact = process.argv.slice(2).includes("--redact-paths");
    const diagnostic = redact
      ? "request could not be read (paths redacted)"
      : error.message;
    process.stderr.write(`${terminalSafe(`evidence: ${diagnostic}`)}\n`);
    process.exitCode = 1;
  }
}
