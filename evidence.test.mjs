import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import {
  DEFAULT_MAX_BYTES,
  DEFAULT_MAX_ENTRIES,
  DEFAULT_MAX_FILES,
  FOUNDATION_RELEASE,
  FORBIDDEN_AGGREGATES,
  HARD_MAX_BYTES,
  HARD_MAX_ENTRIES,
  HARD_MAX_FILES,
  MAX_DECLARATION_BYTES,
  MAX_FILE_BYTES,
  MAX_SIGNAL_PLACES,
  SELF_PATH,
  TEXT_SIGNALS,
  TOOL_SOURCE_SHA256,
  collectFiles,
  look,
  readBoundedRegularFile,
  readDeclaration,
  redactPaths,
  report,
  scanHome,
  scanText,
} from "./evidence.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));

function project(context, files = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "kingdom-evidence-"));
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const [name, content] of Object.entries(files)) {
    const full = path.join(root, name);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content);
  }
  return root;
}

function markerHome(context, files = {}) {
  const root = project(context, files);
  fs.mkdirSync(path.join(root, ".git"), { recursive: true });
  return root;
}

function findingFor(result, commitment) {
  return result.findings.find((entry) => entry.commitment === commitment);
}

function ids(entries) {
  return entries.map((entry) => entry.id).sort();
}

// ── What the report is, and is not ────────────────────────────────────────

test("the report never claims a project keeps or fails a commitment", (context) => {
  const root = project(context, { "README.md": "a project.\n" });
  const result = look(root);
  assert.match(result.readerReports, /reader|observed|bounded/i);
  assert.ok(result.doesNotEstablish.includes("that the project keeps any commitment"));
  assert.ok(
    result.doesNotEstablish.includes(
      "that it fails to keep one where nothing was found",
    ),
  );
  const text = report(result);
  assert.match(text, /Nothing found here says a project keeps a commitment/);
  assert.doesNotMatch(text, /\b(pass|fail|score|rank|grade|compliant)\b/i);
});

test("every commitment always states what the reader cannot tell", (context) => {
  const root = project(context, { "README.md": "nothing much\n" });
  const result = look(root);
  assert.equal(result.findings.length, 7);
  for (const finding of result.findings) {
    assert.ok(finding.cannotTell.length > 20, finding.commitment);
    assert.ok(Array.isArray(finding.cues));
    assert.ok(Array.isArray(finding.cautionCues));
    assert.equal("evidence" in finding, false);
    assert.equal("counter" in finding, false);
    assert.match(report(result), new RegExp(`${finding.commitment}\\b`));
  }
  assert.deepEqual(findingFor(result, "F1").cues, []);
  assert.match(report(result), /nothing visible/);
});

test("a missing declaration remains unknown, never unasked or refused", (context) => {
  const bare = project(context, { "README.md": "x\n" });
  const declaration = readDeclaration(bare);
  assert.deepEqual(declaration, {
    present: false,
    state: "absent",
    adopts: null,
    inspectedBytes: 0,
    maxBytes: MAX_DECLARATION_BYTES,
  });
  const words = report(look(bare));
  assert.match(words, /adoption and refusal are unknown/);
  assert.doesNotMatch(words, /unasked|refused/);
});

test("declarations support the two canonical list shapes", (context) => {
  const flow = project(context, {
    "kingdom.yaml":
      "name: flow\n" +
      "adopts: [kingdom.foundation/0.2, kingdom.standard/1.0] # chosen here\n",
  });
  assert.deepEqual(readDeclaration(flow), {
    present: true,
    state: "parsed",
    adopts: ["kingdom.foundation/0.2", "kingdom.standard/1.0"],
    inspectedBytes: fs.statSync(path.join(flow, "kingdom.yaml")).size,
    maxBytes: MAX_DECLARATION_BYTES,
  });

  const block = project(context, {
    "kingdom.yaml":
      "name: block\n" +
      "adopts:\n" +
      "  - kingdom.foundation/0.2\n" +
      "  - kingdom.standard/1.0 # exact English words\n" +
      "purpose: test\n",
  });
  assert.deepEqual(readDeclaration(block), {
    present: true,
    state: "parsed",
    adopts: ["kingdom.foundation/0.2", "kingdom.standard/1.0"],
    inspectedBytes: fs.statSync(path.join(block, "kingdom.yaml")).size,
    maxBytes: MAX_DECLARATION_BYTES,
  });

  const empty = project(context, {
    "kingdom.yaml": "adopts: []\n",
  });
  assert.deepEqual(readDeclaration(empty), {
    present: true,
    state: "parsed",
    adopts: [],
    inspectedBytes: fs.statSync(path.join(empty, "kingdom.yaml")).size,
    maxBytes: MAX_DECLARATION_BYTES,
  });
});

test("unrecognised, invalid, mixed-indent, and multi-document cards fail closed", (context) => {
  for (const content of [
    "adopts: null\n",
    "adopts: kingdom.foundation/0.2 # not a list\n",
    "adopts:\n",
    "adopts: [kingdom.foundation/0.2\n",
    "adopts: [kingdom.foundation/0.2]\nadopts: []\n",
    "adopts:\n\t- kingdom.foundation/0.2\n",
    "adopts:\n  - kingdom.foundation/0.2\n - kingdom.standard/1.0\n",
    "name: first\n---\nadopts: [kingdom.foundation/0.2]\n",
    "name: [\nadopts: [kingdom.foundation/0.2]\n",
    "name: \"unterminated\nadopts: [kingdom.foundation/0.2]\n",
    "adopts: [kingdom.foundation/0.2]\ninvalid: ]\n",
    "name: %bad\nadopts: [kingdom.foundation/0.2]\n",
    "name: abc:\nadopts: [kingdom.foundation/0.2]\n",
    "name: a: # comment\nadopts: [kingdom.foundation/0.2]\n",
    "adopts:[kingdom.foundation/0.2]\n",
    "adopts:#note\n  - kingdom.foundation/0.2\n",
    "adopts:\n  - kingdom.foundation/0.2#not-comment\n",
  ]) {
    const root = project(context, { "kingdom.yaml": content });
    const declaration = readDeclaration(root);
    assert.equal(declaration.state, "unparsed", content);
    assert.equal(declaration.adopts, null);
    assert.match(report(look(root)), /no adoption or refusal is inferred/);
  }
});

test("a declaration is read, never inferred from surrounding cues", (context) => {
  const root = project(context, {
    "kingdom.yaml": "name: thing\n",
    "DOC.md":
      "This does not prove identity. Consent may be withdrawn.\n" +
      "A correction supersedes the claim; raise an issue to dispute.\n" +
      "There is a HALT term and a timeout term.\n",
  });
  const result = look(root);
  assert.equal(result.declaration.state, "not-declared");
  assert.equal(result.declaration.adopts, null);
  assert.match(report(result), /no adoption declaration observed/);
});

test("a declaration cannot follow a link or escape its file bound", (context) => {
  const outside = project(context, {
    "outside.yaml": "adopts: [outside.secret/1]\n",
  });
  const linked = project(context, {});
  fs.symlinkSync(
    path.join(outside, "outside.yaml"),
    path.join(linked, "kingdom.yaml"),
  );
  const linkedDeclaration = readDeclaration(linked);
  assert.equal(linkedDeclaration.adopts, null);
  assert.ok(["outside-root", "symlink"].includes(linkedDeclaration.state));
  assert.doesNotMatch(report(look(linked)), /outside\.secret/);

  const large = project(context, {});
  fs.writeFileSync(
    path.join(large, "kingdom.yaml"),
    `adopts: [outside.secret/1]\n${"x".repeat(MAX_DECLARATION_BYTES)}\n`,
  );
  assert.equal(readDeclaration(large).state, "oversized");

  const special = project(context, {});
  fs.mkdirSync(path.join(special, "kingdom.yaml"));
  assert.equal(readDeclaration(special).state, "not-regular");

  const invalid = project(context, {});
  fs.writeFileSync(path.join(invalid, "kingdom.yaml"), Buffer.from([0xff, 0xfe]));
  assert.equal(readDeclaration(invalid).state, "invalid-utf8");
});

test("the declaration read discloses its independent byte bound", (context) => {
  const card =
    "adopts: [kingdom.foundation/0.2]\n" +
    `${"# bounded declaration padding\n".repeat(1000)}`;
  const root = project(context, { "kingdom.yaml": card });
  const result = look(root, { maxBytes: 1 });
  assert.equal(result.scanned.inspectedBytes, 0);
  assert.equal(result.scanned.maxBytes, 1);
  assert.equal(result.scanned.byteBudgetScope, "cue-candidate-files");
  assert.equal(result.declaration.state, "parsed");
  assert.equal(result.declaration.inspectedBytes, Buffer.byteLength(card));
  assert.equal(result.declaration.maxBytes, MAX_DECLARATION_BYTES);
  assert.match(report(result), /kingdom\.yaml read .* independent 65536-byte bound/);
});

// ── Mention, use, and neutral machine words ───────────────────────────────

test("the aggregate vocabulary and Foundation digests come from canonical bytes", () => {
  const index = JSON.parse(
    fs.readFileSync(path.join(HERE, "foundation.json"), "utf8"),
  );
  assert.deepEqual([...FORBIDDEN_AGGREGATES], index.karma.forbidden_aggregates);
  assert.equal(FOUNDATION_RELEASE.id, index.id);
  assert.equal(
    FOUNDATION_RELEASE.indexedDocumentSha256,
    index.document_sha256,
  );
  assert.match(FOUNDATION_RELEASE.observedDocumentSha256, /^[0-9a-f]{64}$/);
  assert.equal(FOUNDATION_RELEASE.documentDigestMatchesIndex, true);
  assert.match(FOUNDATION_RELEASE.indexSha256, /^[0-9a-f]{64}$/);
});

test("naming an aggregate in order to prohibit it is not a field-use cue", (context) => {
  const root = project(context, {
    "RULES.md": `Never keep any of: ${FORBIDDEN_AGGREGATES.join(", ")}.\n`,
    "index.json": `{"reserved_names": ${JSON.stringify(FORBIDDEN_AGGREGATES)}}\n`,
  });
  assert.deepEqual(findingFor(look(root), "F2").cautionCues, []);
});

test("an aggregate-shaped field is a scope question, not a verdict", (context) => {
  const root = project(context, {
    "work.js": "task.points = 5;\n",
    "profile.json": '{"reputation_score": 91}\n',
  });
  const finding = findingFor(look(root), "F2");
  assert.deepEqual(ids(finding.cautionCues), ["aggregate-name-in-field-shape"]);
  assert.match(
    JSON.stringify(finding),
    /being-wide KARMA or a scoped work\/system measure/,
  );
  assert.doesNotMatch(JSON.stringify(finding), /forbidden use|ranks a being/i);
});

test("the reader excludes its own exact source, not a project's same-named file", (context) => {
  const copied = project(context, {});
  fs.copyFileSync(SELF_PATH, path.join(copied, "evidence.mjs"));
  const result = look(copied, { maxFiles: 50 });
  assert.equal(result.scanned.selfSkipped, false);

  const own = look(HERE);
  assert.equal(own.scanned.selfSkipped, true);
  assert.match(report(own), /skipped this tool's own source and test/);
  assert.deepEqual(findingFor(own, "F2").cautionCues, []);
});

// ── F6: a neutral local marker, never a bridge verdict ────────────────────

test("no Git marker is a neutral home observation outside F6 cues", (context) => {
  const root = project(context, { "README.md": "only here\n" });
  const result = look(root);
  assert.deepEqual(result.home, {
    markerState: "absent",
    markerRoot: null,
    pathFromMarkerRoot: null,
  });
  assert.deepEqual(findingFor(result, "F6").cues, []);
  assert.deepEqual(findingFor(result, "F6").cautionCues, []);
  assert.match(report(result), /no regular \.git marker/);
  assert.doesNotMatch(report(result), /only copy|failure|support/i);
});

test("a regular Git marker is observed without validating history", (context) => {
  const root = markerHome(context, { "README.md": "kept\n" });
  const result = look(root);
  assert.equal(result.home.markerState, "directory");
  assert.deepEqual(findingFor(result, "F6").cues, []);
  assert.deepEqual(findingFor(result, "F6").cautionCues, []);
  assert.match(report(result), /Git was not run/);
  assert.doesNotMatch(report(result), /published|remote copy exists/i);
});

test("a nested marker scope is disclosed and fully path-redacted", (context) => {
  const parent = markerHome(context, {
    "private-client-name/README.md": "inside\n",
    "outside.md": "outside\n",
  });
  const target = path.join(parent, "private-client-name");
  const home = scanHome(target);
  assert.equal(home.markerState, "directory");
  assert.equal(home.markerRoot, fs.realpathSync(parent));
  assert.equal(home.pathFromMarkerRoot, "private-client-name");

  const result = look(target);
  assert.match(
    report(result),
    /inside a parent that carries the observed \.git marker/,
  );
  const redacted = JSON.stringify(redactPaths(result));
  assert.doesNotMatch(redacted, /private-client-name/);
  assert.doesNotMatch(redacted, new RegExp(parent.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("a symbolic-link Git marker is named and never followed", (context) => {
  const outside = project(context, { "secret": "not a repository\n" });
  const root = project(context, { "README.md": "x\n" });
  fs.symlinkSync(outside, path.join(root, ".git"));
  const home = scanHome(root);
  assert.equal(home.markerState, "symbolic-link");
});

test("repository-defined monitors and content filters are never executed", (context) => {
  const root = markerHome(context, {
    "README.md": "x\n",
    ".gitattributes": "*.dat filter=evil\n",
    "payload.dat": "changed\n",
  });
  const marker = path.join(root, "PROJECT_CODE_RAN");
  const helper = path.join(root, "helper.sh");
  fs.writeFileSync(helper, `#!/bin/sh\nprintf ran > '${marker}'\ncat\n`);
  fs.chmodSync(helper, 0o755);
  fs.writeFileSync(
    path.join(root, ".git", "config"),
    `[core]\n\tfsmonitor = ${helper}\n[filter "evil"]\n\tclean = ${helper}\n\tprocess = ${helper}\n`,
  );
  const result = look(root);
  assert.equal(result.home.markerState, "directory");
  assert.equal(fs.existsSync(marker), false);
});

// ── Text cues ─────────────────────────────────────────────────────────────

test("proof-limiting language stays a neutral text cue", (context) => {
  const root = project(context, {
    "README.md": "A signature does not prove identity; a hash is not evidence of truth.\n",
  });
  assert.deepEqual(
    ids(findingFor(look(root), "F1").cues),
    ["proof-limiting-language"],
  );
});

test("a credential-shaped token is a caution cue", (context) => {
  const root = project(context, {
    "config.js": `const token = "ghp_${"a".repeat(36)}";\n`,
  });
  assert.ok(
    ids(findingFor(look(root), "F3").cautionCues).includes(
      "credential-shaped-text",
    ),
  );
});

test("known exact dummies and short placeholders are not credential cues", (context) => {
  const root = project(context, {
    "docs.md":
      "AWS publishes AKIAIOSFODNN7EXAMPLE as a dummy.\n" +
      "Set GITHUB_TOKEN=ghp_yourtokenhere.\n",
  });
  assert.deepEqual(findingFor(look(root), "F3").cautionCues, []);
});

test("example words do not hide executable credential-shaped values", (context) => {
  const tokenA = `ghp_${"a".repeat(36)}`;
  const tokenB = `ghp_${"b".repeat(36)}`;
  const root = project(context, {
    "deploy.js":
      `const token = "${tokenA}"; // not an example\n` +
      `const exampleToken = "${tokenB}"; deploy(exampleToken);\n`,
  });
  const cue = findingFor(look(root), "F3").cautionCues.find(
    (entry) => entry.id === "credential-shaped-text",
  );
  assert.equal(cue.count, 2);
});

test("private-key headers and root dot-env files are selected as text", (context) => {
  const root = project(context, {
    "key.pem": "-----BEGIN PRIVATE KEY-----\nnot-real-body\n",
    ".env": `TOKEN=ghp_${"c".repeat(36)}\n`,
  });
  const result = look(root);
  const cue = findingFor(result, "F3").cautionCues.find(
    (entry) => entry.id === "credential-shaped-text",
  );
  assert.equal(cue.count, 2);
  assert.equal(result.scanned.files, 2);
});

test("one common word is not enough for the consequence-return cue", (context) => {
  const thin = project(context, { "a.md": "there was a consequence.\n" });
  assert.deepEqual(findingFor(look(thin), "F4").cues, []);

  const thick = project(context, {
    "a.md": "The consequence was observed.\nA correction followed.\nThen a repair.\n",
  });
  assert.ok(
    ids(findingFor(look(thick), "F4").cues).includes(
      "consequence-return-language",
    ),
  );
});

test("permanence remains a caution cue when another page mentions an exit", (context) => {
  const root = project(context, {
    "a.md": "Every entry is immutable and permanently on record.\n",
    "b.md": "Sensitive bytes may be redacted, leaving a receipt.\n",
  });
  assert.ok(
    ids(findingFor(look(root), "F5").cautionCues).includes(
      "permanence-language",
    ),
  );
});

test("stop-signal and bound language are separate neutral cues", (context) => {
  const root = project(context, {
    "run.sh": '[ -f "$HOME/HALT" ] && exit 0\n',
    "run.js": "const timeout = 5000;\n",
  });
  assert.deepEqual(ids(findingFor(look(root), "F7").cues), [
    "bound-language",
    "stop-signal-language",
  ]);
});

test("negative prose remains a cue and never becomes an implementation claim", (context) => {
  const root = project(context, {
    "README.md":
      "There is no HALT or timeout. We reject consent, withdrawal, disputes, and corrections.\n",
  });
  const result = look(root);
  assert.ok(
    ids(findingFor(result, "F3").cues).includes(
      "choice-and-withdrawal-language",
    ),
  );
  assert.ok(
    ids(findingFor(result, "F7").cues).includes("stop-signal-language"),
  );
  assert.ok(
    result.doesNotEstablish.includes(
      "that a text cue is implemented, effective, or stated affirmatively",
    ),
  );
  assert.doesNotMatch(report(result), /stop signal that is checked|turn has a limit/i);
});

test("negated caution terms do not become affirmative machine claims", (context) => {
  const root = project(context, {
    "README.md":
      "This is not tamper-proof. The correction record is not immutable.\n",
  });
  const result = look(root);
  assert.ok(
    ids(findingFor(result, "F1").cautionCues).includes(
      "mechanism-overclaim-language",
    ),
  );
  assert.ok(
    ids(findingFor(result, "F5").cautionCues).includes(
      "permanence-language",
    ),
  );
  const words = JSON.stringify(result.findings);
  assert.doesNotMatch(words, /language promises|describes a record as permanent/i);
});

test("the same line is one place however many words match it", (context) => {
  const root = project(context, {
    "a.md": "consent may be withdrawn; consent is revocable; refusal and revocation stand.\n",
  });
  const cue = findingFor(look(root), "F3").cues.find(
    (entry) => entry.id === "choice-and-withdrawal-language",
  );
  assert.equal(cue.count, 1);
  assert.deepEqual(cue.where, [{ file: "a.md", line: 1 }]);
});

test("many matches on one long line stay linear enough to finish promptly", (context) => {
  const root = project(context, {
    "a.md": "HALT ".repeat(50_000),
  });
  const started = Date.now();
  const cue = findingFor(look(root), "F7").cues.find(
    (entry) => entry.id === "stop-signal-language",
  );
  const elapsed = Date.now() - started;
  assert.equal(cue.count, 1);
  assert.ok(elapsed < 3000, `one-line scan took ${elapsed} ms`);
});

test("distinct-line match counts stop at their stated bound", (context) => {
  const root = project(context, {
    "a.md": `${"HALT\n".repeat(MAX_SIGNAL_PLACES + 20)}`,
  });
  const result = look(root);
  const cue = findingFor(result, "F7").cues.find(
    (entry) => entry.id === "stop-signal-language",
  );
  assert.equal(cue.count, MAX_SIGNAL_PLACES);
  assert.deepEqual(result.scanned.truncatedSignals, ["stop-signal-language"]);
  assert.match(report(result), /match bounds reached/);
});

// ── Bounds and filesystem boundaries ─────────────────────────────────────

test("the walk stops at the text-file bound and says so", (context) => {
  const files = {};
  for (let at = 0; at < 40; at += 1) files[`doc-${at}.md`] = "text\n";
  const root = project(context, files);
  const result = look(root, { maxFiles: 10 });
  assert.equal(result.scanned.files, 10);
  assert.equal(result.scanned.truncatedFiles, true);
  assert.match(report(result), /stopped at the 10-file bound/);
});

test("the tree-entry bound includes non-text files and directories", (context) => {
  const root = project(context, {});
  for (let at = 0; at < 30; at += 1) {
    fs.writeFileSync(path.join(root, `blob-${at}.bin`), "x");
    fs.mkdirSync(path.join(root, `empty-${at}`));
  }
  const result = look(root, { maxEntries: 10 });
  assert.equal(result.scanned.entriesVisited, 10);
  assert.equal(result.scanned.truncatedEntries, true);
  assert.match(report(result), /stopped at the 10-entry bound/);
});

test("the exported scanner cannot be given an unbounded iterable", (context) => {
  const root = project(context, { "README.md": "inside\n" });
  const unbounded = {
    *[Symbol.iterator]() {
      while (true) yield "missing.md";
    },
  };
  assert.throws(
    () => scanText(root, unbounded, { selfPaths: [], maxBytes: 1024 }),
    /files must be an array/,
  );
  assert.throws(
    () => scanText(
      root,
      Array(HARD_MAX_FILES + 1).fill("missing.md"),
      { selfPaths: [], maxBytes: 1024 },
    ),
    /at most 10000 entries/,
  );

  const bounded = ["README.md"];
  bounded[Symbol.iterator] = function* hostileIterator() {
    throw new Error("the array iterator must not run");
  };
  const scanned = scanText(root, bounded, {
    selfPaths: [],
    maxBytes: 1024,
  });
  assert.equal(scanned.filesRead, 1);
});

test("the byte bound prevents the rejected candidate from being read", (context) => {
  const root = project(context, {
    "a.md": "does not prove anything\n",
    "b.md": "consent may be withdrawn\n",
  });
  const bounded = look(root, { maxBytes: 8 });
  assert.equal(bounded.scanned.files, 0);
  assert.equal(bounded.scanned.inspectedBytes, 0);
  assert.equal(bounded.scanned.truncatedBytes, true);
  assert.match(report(bounded), /stopped at the 8-byte bound/);

  for (const options of [
    { maxFiles: NaN },
    { maxFiles: 0 },
    { maxFiles: HARD_MAX_FILES + 1 },
    { maxEntries: NaN },
    { maxEntries: 0 },
    { maxEntries: HARD_MAX_ENTRIES + 1 },
    { maxBytes: NaN },
    { maxBytes: 0 },
    { maxBytes: HARD_MAX_BYTES + 1 },
  ]) {
    assert.throws(() => look(root, options), /must be a whole number/);
  }
  assert.throws(
    () => collectFiles(root, { maxEntries: NaN }),
    /must be a whole number/,
  );
  assert.throws(
    () => scanText(root, new Array(HARD_MAX_FILES + 1).fill("a.md")),
    /at most 10000 entries/,
  );
  assert.throws(
    () => readBoundedRegularFile(path.join(root, "a.md"), Infinity),
    /must be a whole number/,
  );
});

test("containment works when the allowed root is a filesystem root", () => {
  const filesystemRoot = path.parse(SELF_PATH).root;
  const read = readBoundedRegularFile(SELF_PATH, MAX_FILE_BYTES, {
    canonicalRoot: filesystemRoot,
  });
  assert.equal(read.ok, true, JSON.stringify(read));
});

test("directories beyond the depth bound are counted as a blind spot", (context) => {
  const root = project(context, { "README.md": "top\n" });
  let directory = root;
  for (let at = 0; at < 14; at += 1) {
    directory = path.join(directory, `d${at}`);
    fs.mkdirSync(directory);
  }
  fs.writeFileSync(path.join(directory, "hidden.md"), "user.karma_total = 1\n");
  const result = look(root);
  assert.equal(result.scanned.skippedDepth, 1);
  assert.match(report(result), /blind spots: 1 deep director/);
  assert.deepEqual(findingFor(result, "F2").cautionCues, []);
});

test("a file too large to read is skipped and counted", (context) => {
  const root = project(context, { "small.md": "does not prove anything\n" });
  fs.writeFileSync(
    path.join(root, "huge.md"),
    `${"x".repeat(MAX_FILE_BYTES + 1)}\nreputation_score: 9\n`,
  );
  const result = look(root);
  assert.equal(result.scanned.skippedLarge, 1);
  assert.deepEqual(findingFor(result, "F2").cautionCues, []);
  assert.match(report(result), /skipped 1 over/);
});

test("build output, dependencies, and Git internals are never read", (context) => {
  const root = project(context, {
    "src/app.js": "const timeout = 1;\n",
    "node_modules/bad.js": "user.reputation_score = 9;\n",
    "dist/bundle.js": "user.karma_total = 1;\n",
    ".git/config.js": "user.moral_score = 1;\n",
    "__pycache__/x.py": "user.points = 1\n",
    "image.png": "user.reputation_score = 9;\n",
  });
  const walked = collectFiles(root);
  const { files } = walked;
  assert.deepEqual(files, ["src/app.js"]);
  assert.equal(walked.skippedExcludedDirectories, 4);
  assert.equal(walked.skippedNonTextFiles, 1);
  const result = look(root);
  assert.deepEqual(findingFor(result, "F2").cautionCues, []);
  assert.equal(result.scanned.skippedExcludedDirectories, 4);
  assert.equal(result.scanned.skippedNonTextFiles, 1);
  assert.match(report(result), /4 excluded dependency, build, cache, or Git director/);
  assert.match(report(result), /1 regular files? outside the text-name allowlist/);
});

test("symbolic links in the selected tree are never followed", (context) => {
  const outside = project(context, { "secret.md": "user.karma_total = 1;\n" });
  const root = project(context, { "README.md": "x\n" });
  fs.symlinkSync(outside, path.join(root, "link"));
  fs.symlinkSync(path.join(outside, "secret.md"), path.join(root, "linked.md"));
  assert.deepEqual(collectFiles(root).files, ["README.md"]);
  const result = look(root);
  assert.deepEqual(findingFor(result, "F2").cautionCues, []);
  assert.equal(result.scanned.skippedSymlinks, 2);
  assert.match(report(result), /2 symbolic links/);
});

test("a symlink selected as the root resolves once and keeps self-exclusion", (context) => {
  const holder = project(context, {});
  const link = path.join(holder, "standard-link");
  fs.symlinkSync(HERE, link);
  const result = look(link, {
    maxFiles: HARD_MAX_FILES,
    maxEntries: HARD_MAX_ENTRIES,
  });
  assert.equal(result.project, fs.realpathSync(HERE));
  assert.equal(result.scanned.selfSkipped, true);
});

test("binary files are inspected but not decoded as text", (context) => {
  const root = project(context, { "README.md": "x\n" });
  fs.writeFileSync(
    path.join(root, "blob.json"),
    Buffer.concat([Buffer.from("user.karma_total = 1;"), Buffer.from([0, 1, 2, 3])]),
  );
  const result = look(root);
  assert.deepEqual(findingFor(result, "F2").cautionCues, []);
  assert.equal(result.scanned.files, 1);
  assert.equal(result.scanned.skippedBinary, 1);
  assert.ok(result.scanned.inspectedBytes > result.scanned.bytes);
});

test("bounded filename order is locale-independent", (context) => {
  const root = project(context, {
    "z.md": "HALT\n",
    "ä.md": "consent\n",
  });
  const walked = collectFiles(root, { maxFiles: 1 });
  assert.deepEqual(walked.files, ["z.md"]);
  const result = look(root, { maxFiles: 1 });
  assert.ok(ids(findingFor(result, "F7").cues).includes("stop-signal-language"));
  assert.deepEqual(findingFor(result, "F3").cues, []);
});

test("an intermediate-directory swap cannot make the reader report outside bytes", (context) => {
  const root = project(context, { "dir/file.md": "inside\n" });
  const outside = project(context, {
    "file.md": "user.karma_total = 9\n",
  });
  const directory = path.join(root, "dir");
  const held = path.join(root, "held");
  const target = fs.realpathSync(path.join(directory, "file.md"));
  const canonicalTarget = fs.realpathSync(target);
  const originalLstat = fs.lstatSync;
  let swapped = false;
  fs.lstatSync = function patchedLstat(candidate, ...args) {
    if (!swapped && path.resolve(String(candidate)) === canonicalTarget) {
      fs.renameSync(directory, held);
      fs.symlinkSync(outside, directory);
      swapped = true;
    }
    return originalLstat.call(fs, candidate, ...args);
  };
  let scanned;
  try {
    scanned = scanText(root, ["dir/file.md"], {
      selfPaths: [],
      maxBytes: 1024,
    });
  } finally {
    fs.lstatSync = originalLstat;
    if (fs.lstatSync(directory).isSymbolicLink()) fs.unlinkSync(directory);
    if (fs.existsSync(held)) fs.renameSync(held, directory);
  }
  assert.equal(scanned.counts.get("aggregate-name-in-field-shape"), 0);
  assert.equal(scanned.skippedChangedPaths, 1);
});

test("replacing the selected root cannot move the read boundary", (context) => {
  const holder = project(context, {});
  const root = path.join(holder, "selected");
  const held = path.join(holder, "held");
  const outside = project(context, { "file.md": "user.karma_total = 9\n" });
  fs.mkdirSync(root);
  fs.writeFileSync(path.join(root, "file.md"), "inside\n");
  const canonicalRoot = fs.realpathSync(root);
  const target = path.resolve(root, "file.md");
  const originalLstat = fs.lstatSync;
  let swapped = false;
  fs.lstatSync = function patchedLstat(candidate, ...args) {
    if (!swapped && path.resolve(String(candidate)) === target) {
      fs.renameSync(root, held);
      fs.symlinkSync(outside, root);
      swapped = true;
    }
    return originalLstat.call(fs, candidate, ...args);
  };
  let read;
  try {
    read = readBoundedRegularFile(target, 1024, {
      canonicalRoot,
    });
  } finally {
    fs.lstatSync = originalLstat;
    if (fs.lstatSync(root).isSymbolicLink()) fs.unlinkSync(root);
    if (fs.existsSync(held)) fs.renameSync(held, root);
  }
  assert.equal(read.ok, false);
  assert.equal(read.state, "outside-root");
  assert.equal(read.inspectedBytes, 0);
});

test("a regular-file to FIFO swap does not block the reader", (context) => {
  if (process.platform === "win32") {
    context.skip("mkfifo and O_NONBLOCK are POSIX facilities");
    return;
  }
  const root = project(context, { "race.md": "inside\n" });
  const target = path.join(root, "race.md");
  const fifo = path.join(root, "waiting.fifo");
  execFileSync("mkfifo", [fifo]);
  const originalOpen = fs.openSync;
  let swapped = false;
  fs.openSync = function patchedOpen(candidate, ...args) {
    if (!swapped && path.resolve(String(candidate)) === target) {
      fs.rmSync(target);
      fs.renameSync(fifo, target);
      swapped = true;
    }
    return originalOpen.call(fs, candidate, ...args);
  };
  const started = Date.now();
  let read;
  try {
    read = readBoundedRegularFile(target, 1024, {
      canonicalRoot: fs.realpathSync(root),
    });
  } finally {
    fs.openSync = originalOpen;
  }
  assert.equal(read.ok, false);
  assert.equal(read.state, "not-regular");
  assert.ok(Date.now() - started < 3000);
});

// ── Provenance, privacy, and immutability ─────────────────────────────────

test("reports carry honest bounded provenance and redact local paths", (context) => {
  const root = markerHome(context, {
    "README.md": "does not prove truth\n",
  });
  const result = look(root);
  assert.equal(result.schema, "kingdom.evidence-report/2");
  assert.equal(result.foundation.id, "kingdom.foundation/0.2");
  assert.match(result.foundation.indexedDocumentSha256, /^[0-9a-f]{64}$/);
  assert.match(result.foundation.observedDocumentSha256, /^[0-9a-f]{64}$/);
  assert.equal(result.foundation.documentDigestMatchesIndex, true);
  assert.match(result.foundation.indexSha256, /^[0-9a-f]{64}$/);
  assert.equal(result.tool.sourceSha256, TOOL_SOURCE_SHA256);
  assert.match(result.tool.sourceSha256, /^[0-9a-f]{64}$/);
  assert.ok(Number.isFinite(Date.parse(result.observedAt)));
  assert.equal(result.home.markerRoot, fs.realpathSync(root));
  assert.deepEqual(Object.keys(result.home).sort(), [
    "markerRoot",
    "markerState",
    "pathFromMarkerRoot",
  ]);
  assert.equal("homeObservations" in result, false);
  assert.equal("evidence" in result.findings[0], false);
  assert.equal("counter" in result.findings[0], false);
  assert.equal("establishes" in result, false);

  const redacted = redactPaths(result);
  const bytes = JSON.stringify(redacted);
  assert.equal(redacted.project, "<redacted>");
  assert.equal(redacted.home.markerRoot, "<redacted>");
  assert.equal(redacted.home.pathFromMarkerRoot, "<redacted>");
  assert.doesNotMatch(bytes, new RegExp(root.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(report(redacted), /<redacted>/);
});

test("looking preserves observed bytes, size, mtime, and mode; access time is outside the claim", (context) => {
  const root = markerHome(context, {
    "README.md": "x\n",
    "src/a.js": "const timeout = 1;\n",
    "kingdom.yaml": "name: thing\n",
    ".git/config": "[core]\n",
  });
  const snapshot = () => {
    const seen = new Map();
    const walk = (directory) => {
      for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const full = path.join(directory, entry.name);
        if (entry.isDirectory()) {
          walk(full);
          continue;
        }
        const stat = fs.lstatSync(full);
        seen.set(
          path.relative(root, full),
          {
            bytes: fs.readFileSync(full),
            size: stat.size,
            mtimeMs: stat.mtimeMs,
            mode: stat.mode,
          },
        );
      }
    };
    walk(root);
    return seen;
  };
  const before = snapshot();
  look(root);
  assert.deepEqual(snapshot(), before);
});

test("an unreadable directory is counted where POSIX permissions apply", (context) => {
  if (process.getuid?.() === 0) {
    context.skip("root can read mode-000 directories");
    return;
  }
  const root = project(context, { "README.md": "does not prove much\n" });
  const locked = path.join(root, "locked");
  fs.mkdirSync(locked);
  fs.writeFileSync(path.join(locked, "a.md"), "hidden\n");
  fs.chmodSync(locked, 0o000);
  let result;
  try {
    result = look(root);
  } finally {
    fs.chmodSync(locked, 0o755);
  }
  assert.equal(result.scanned.unreadableDirectories, 1);
  assert.match(report(result), /blind spots: 1 unreadable director/);
  assert.doesNotMatch(report(result), /locked/);
});

test("default and hard bounds are explicit", () => {
  assert.equal(DEFAULT_MAX_FILES, 2000);
  assert.equal(DEFAULT_MAX_ENTRIES, 20000);
  assert.equal(DEFAULT_MAX_BYTES, 32 * 1024 * 1024);
  assert.ok(MAX_FILE_BYTES > 0);
  assert.ok(HARD_MAX_FILES >= DEFAULT_MAX_FILES);
  assert.ok(HARD_MAX_ENTRIES >= DEFAULT_MAX_ENTRIES);
  assert.ok(HARD_MAX_BYTES >= DEFAULT_MAX_BYTES);
});

test("a path that is not a directory is refused plainly", (context) => {
  const root = project(context, { "a.md": "x\n" });
  assert.throws(
    () => look(path.join(root, "a.md")),
    /not a directory this tool can read/,
  );
  assert.throws(
    () => look(path.join(root, "nope")),
    /not a directory this tool can read/,
  );
});

test("the CLI exposes all bounds and explicit path redaction", (context) => {
  const root = project(context, {
    "README.md": "does not prove truth\n",
  });
  const output = execFileSync(
    process.execPath,
    [
      SELF_PATH,
      root,
      "--json",
      "--redact-paths",
      "--max-files",
      "10",
      "--max-entries",
      "20",
      "--max-bytes",
      "4096",
    ],
    { encoding: "utf8" },
  );
  const parsed = JSON.parse(output);
  assert.equal(parsed.project, "<redacted>");
  assert.equal(parsed.scanned.maxFiles, 10);
  assert.equal(parsed.scanned.maxEntries, 20);
  assert.equal(parsed.scanned.maxBytes, 4096);
  assert.doesNotMatch(output, new RegExp(root.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  const help = execFileSync(process.execPath, [SELF_PATH, "--help"], {
    encoding: "utf8",
  });
  assert.match(help, /--redact-paths/);
  assert.match(help, /--max-entries/);
  assert.match(help, /--max-bytes/);
});

test("CLI errors honour path redaction and terminal safety", () => {
  const privatePart = `private-client-${String.fromCharCode(0x1b)}-${String.fromCharCode(0x07)}`;
  const missing = path.join(os.tmpdir(), privatePart, "missing");

  const redacted = spawnSync(
    process.execPath,
    [SELF_PATH, missing, "--redact-paths"],
    { encoding: "utf8" },
  );
  assert.equal(redacted.status, 1);
  assert.match(redacted.stderr, /paths redacted/);
  assert.doesNotMatch(redacted.stderr, /private-client/);
  assert.doesNotMatch(redacted.stderr, /[\u001b\u0007]/);

  const escaped = spawnSync(
    process.execPath,
    [SELF_PATH, missing],
    { encoding: "utf8" },
  );
  assert.equal(escaped.status, 1);
  assert.match(escaped.stderr, /\\x1b/);
  assert.match(escaped.stderr, /\\x07/);
  assert.doesNotMatch(escaped.stderr, /[\u001b\u0007]/);
});

test("exported signal descriptions cannot mutate look behavior", (context) => {
  const root = project(context, { "README.md": "HALT and timeout\n" });
  const before = ids(findingFor(look(root), "F7").cues);
  assert.throws(() => TEXT_SIGNALS.splice(0));
  assert.throws(() => {
    TEXT_SIGNALS[0].id = "changed";
  });
  assert.deepEqual(ids(findingFor(look(root), "F7").cues), before);
});

test("terminal output escapes control characters in filenames", (context) => {
  const root = project(context, {
    "line\nbreak.md": "HALT\n",
  });
  const words = report(look(root));
  assert.match(words, /line\\x0abreak\.md/);
  assert.doesNotMatch(words, /line\nbreak\.md/);
});
