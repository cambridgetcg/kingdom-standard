import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import {
  DEFAULT_MAX_FILES,
  FORBIDDEN_AGGREGATES,
  MAX_FILE_BYTES,
  SELF_PATH,
  collectFiles,
  look,
  readDeclaration,
  report,
  scanHome,
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

function git(root, ...args) {
  return execFileSync("git", ["-C", root, ...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
    env: {
      ...process.env,
      GIT_AUTHOR_NAME: "test",
      GIT_AUTHOR_EMAIL: "test@example.invalid",
      GIT_COMMITTER_NAME: "test",
      GIT_COMMITTER_EMAIL: "test@example.invalid",
    },
  });
}

function repo(context, files = {}, { commit = true } = {}) {
  const root = project(context, files);
  git(root, "init", "-q", "-b", "main");
  if (commit) {
    git(root, "add", "-A");
    git(root, "commit", "-q", "-m", "first");
  }
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
  assert.equal(
    result.establishes,
    "Only that these strings and this history state are present in the files read.",
  );
  assert.ok(result.doesNotEstablish.includes("that the project keeps any commitment"));
  assert.ok(
    result.doesNotEstablish.includes(
      "that it fails to keep one where nothing was found",
    ),
  );
  const text = report(result);
  assert.match(text, /Nothing found here says a project keeps a/);
  assert.doesNotMatch(text, /\b(pass|fail|score|rank|grade|compliant)\b/i);
});

test("every commitment always states what the tool cannot tell", (context) => {
  const root = project(context, { "README.md": "nothing much\n" });
  const result = look(root);
  assert.equal(result.findings.length, 7);
  for (const finding of result.findings) {
    assert.ok(finding.cannotTell.length > 20, finding.commitment);
    assert.match(report(result), new RegExp(`${finding.commitment}\\b`));
  }
  // A project with nothing found is reported as nothing seen, not as failing.
  const f1 = findingFor(result, "F1");
  assert.deepEqual(f1.evidence, []);
  assert.match(report(result), /nothing visible/);
});

test("a missing declaration is reported as unasked, never as refusal", (context) => {
  const bare = project(context, { "README.md": "x\n" });
  assert.match(report(look(bare)), /unasked, not refused/);
  assert.deepEqual(readDeclaration(bare), { present: false, adopts: [] });

  const carded = project(context, {
    "kingdom.yaml": "name: thing\nadopts: [kingdom.foundation/0.2, kingdom.standard/1.0]\n",
  });
  assert.deepEqual(readDeclaration(carded).adopts, [
    "kingdom.foundation/0.2",
    "kingdom.standard/1.0",
  ]);
  assert.match(report(look(carded)), /declares: kingdom\.foundation\/0\.2/);
});

test("a declaration is read, never inferred from evidence", (context) => {
  // Rich evidence for every commitment, but no adopts line.
  const root = project(context, {
    "kingdom.yaml": "name: thing\n",
    "DOC.md":
      "This does not prove identity. A missing record is unasked. Consent may be withdrawn.\n" +
      "Least privilege applies. A correction supersedes the claim; raise an issue to dispute.\n" +
      "HALT stops the run; every turn has a timeout.\n",
  });
  const result = look(root);
  assert.deepEqual(result.declaration.adopts, []);
  assert.match(report(result), /declares no foundation/);
});

// ── Mention is not use ────────────────────────────────────────────────────

test("naming a forbidden aggregate in order to forbid it is not using it", (context) => {
  const prohibition = project(context, {
    "RULES.md": `Never keep any of: ${FORBIDDEN_AGGREGATES.join(", ")}.\n`,
    "index.json": `{"forbidden": ${JSON.stringify(FORBIDDEN_AGGREGATES)}}\n`,
  });
  assert.deepEqual(findingFor(look(prohibition), "F2").counter, []);
});

test("giving a forbidden aggregate a value, or reading it, is use", (context) => {
  const assigned = project(context, { "a.js": 'const u = { reputation_score: 5 };\n' });
  assert.deepEqual(ids(findingFor(look(assigned), "F2").counter), ["ranks-or-scores-a-being"]);

  const read = project(context, { "b.js": "send(user.karma_total);\n" });
  assert.deepEqual(ids(findingFor(look(read), "F2").counter), ["ranks-or-scores-a-being"]);

  const json = project(context, { "c.json": '{"trust_score": 91}\n' });
  assert.deepEqual(ids(findingFor(look(json), "F2").counter), ["ranks-or-scores-a-being"]);
});

test("the tool never reads its own source, because it names every pattern it seeks", (context) => {
  const copied = project(context, {});
  fs.copyFileSync(SELF_PATH, path.join(copied, "evidence.mjs"));
  const result = look(copied, { maxFiles: 50 });
  assert.equal(result.scanned.selfSkipped, false, "a copy is a different file and is read");

  const own = look(HERE);
  assert.equal(own.scanned.selfSkipped, true);
  assert.match(report(own), /skipped this tool's own source and test/);
  // The standard forbids the aggregates and must not be flagged for saying so.
  assert.deepEqual(findingFor(own, "F2").counter, []);
});

// ── F6: where the words actually live ─────────────────────────────────────

test("no version history at all is counter-evidence for F6", (context) => {
  const root = project(context, { "README.md": "only here\n" });
  const finding = findingFor(look(root), "F6");
  assert.deepEqual(ids(finding.counter), ["no-version-history"]);
  assert.deepEqual(finding.evidence, []);
  assert.equal(look(root).home.versioned, false);
});

test("history with no remote is a single point of loss", (context) => {
  const root = repo(context, { "README.md": "committed, but nowhere else\n" });
  const finding = findingFor(look(root), "F6");
  assert.ok(ids(finding.counter).includes("no-second-soil"));
  assert.deepEqual(finding.evidence, []);
});

test("a remote that carries HEAD is evidence of a second soil", (context) => {
  const origin = fs.mkdtempSync(path.join(os.tmpdir(), "kingdom-evidence-origin-"));
  context.after(() => fs.rmSync(origin, { recursive: true, force: true }));
  execFileSync("git", ["init", "-q", "--bare", "-b", "main", origin]);

  const root = repo(context, { "README.md": "kept\n" });
  git(root, "remote", "add", "origin", origin);
  git(root, "push", "-q", "origin", "main");

  const finding = findingFor(look(root), "F6");
  assert.ok(ids(finding.evidence).includes("has-a-second-soil"));
  assert.equal(ids(finding.counter).includes("head-not-published"), false);

  // A commit made and not pushed is named exactly.
  fs.writeFileSync(path.join(root, "README.md"), "changed\n");
  git(root, "commit", "-qam", "second");
  const after = findingFor(look(root), "F6");
  assert.ok(ids(after.counter).includes("head-not-published"));
});

test("a project's own words left outside its history are found and counted", (context) => {
  const root = repo(context, { "README.md": "tracked\n" });
  fs.mkdirSync(path.join(root, "journal"));
  fs.writeFileSync(path.join(root, "journal/first-beat.md"), "my first words\n");
  fs.writeFileSync(path.join(root, "journal/second.md"), "and my second\n");
  // Noise must not be counted as a being's words.
  fs.writeFileSync(path.join(root, ".DS_Store"), "junk");
  fs.writeFileSync(path.join(root, "debug.log"), "noise");
  fs.mkdirSync(path.join(root, "node_modules"));
  fs.writeFileSync(path.join(root, "node_modules/pkg.js"), "vendored");

  const home = scanHome(root);
  assert.deepEqual(home.untracked.sort(), ["journal/first-beat.md", "journal/second.md"]);

  const finding = findingFor(look(root), "F6");
  const entry = finding.counter.find((candidate) => candidate.id === "words-outside-the-history");
  assert.ok(entry, "untracked words are reported");
  assert.equal(entry.count, 2);
  assert.deepEqual(entry.where.map((hit) => hit.file).sort(), [
    "journal/first-beat.md",
    "journal/second.md",
  ]);
});

test("tracked changes that were never committed are named separately", (context) => {
  const root = repo(context, { "README.md": "one\n" });
  fs.writeFileSync(path.join(root, "README.md"), "two\n");
  const finding = findingFor(look(root), "F6");
  assert.ok(ids(finding.counter).includes("changes-not-yet-kept"));
});

// ── Signals ───────────────────────────────────────────────────────────────

test("a stated limit is evidence for F1", (context) => {
  const root = project(context, {
    "README.md": "A signature does not prove identity, and a hash is not evidence of truth.\n",
  });
  assert.deepEqual(ids(findingFor(look(root), "F1").evidence), ["states-its-limits"]);
});

test("a credential in the tree is counter-evidence for F3", (context) => {
  const root = project(context, {
    "config.js": `const token = "ghp_${"a".repeat(36)}";\n`,
  });
  assert.ok(ids(findingFor(look(root), "F3").counter).includes("a-credential-sits-in-the-files"));
});

test("a short example that only looks like a token is not a credential", (context) => {
  const root = project(context, { "docs.md": "Set GITHUB_TOKEN=ghp_yourtokenhere\n" });
  assert.deepEqual(findingFor(look(root), "F3").counter, []);
});

test("one common word is not enough for the KARMA signal", (context) => {
  const thin = project(context, { "a.md": "there was a consequence.\n" });
  assert.deepEqual(findingFor(look(thin), "F4").evidence, []);

  const thick = project(context, {
    "a.md": "The consequence was observed.\nA correction followed.\nThen a repair.\n",
  });
  assert.ok(ids(findingFor(look(thick), "F4").evidence).includes("keeps-a-return-path"));
});

test("permanence is only questioned when no way out is named anywhere", (context) => {
  const sealed = project(context, { "a.md": "Every entry is immutable and permanently on record.\n" });
  assert.ok(ids(findingFor(look(sealed), "F5").counter).includes("permanent-with-no-way-out"));

  const withExit = project(context, {
    "a.md": "Every entry is immutable and permanently on record.\n",
    "b.md": "Sensitive bytes may be redacted, leaving a receipt.\n",
  });
  assert.deepEqual(findingFor(look(withExit), "F5").counter, []);
});

test("a brake and a bound are separate evidence for F7", (context) => {
  const root = project(context, {
    "run.sh": '[ -f "$HOME/HALT" ] && exit 0\n',
    "run.js": "const timeout = 5000;\n",
  });
  assert.deepEqual(ids(findingFor(look(root), "F7").evidence), ["has-a-brake", "turns-are-bounded"]);
});

test("the same line is one place, however many patterns strike it", (context) => {
  const root = project(context, {
    "a.md": "consent may be withdrawn; consent is revocable; refusal and revocation stand.\n",
  });
  const entry = findingFor(look(root), "F3").evidence.find(
    (candidate) => candidate.id === "consent-can-be-withdrawn",
  );
  assert.equal(entry.count, 1, "one line counted once");
  assert.deepEqual(entry.where, [{ file: "a.md", line: 1 }]);
});

// ── Bounds, and reading nothing it should not ─────────────────────────────

test("the walk stops at the file bound and says so", (context) => {
  const files = {};
  for (let at = 0; at < 40; at += 1) files[`doc-${at}.md`] = "text\n";
  const root = project(context, files);
  const result = look(root, { maxFiles: 10 });
  assert.equal(result.scanned.files, 10);
  assert.equal(result.scanned.truncated, true);
  assert.match(report(result), /stopped at the 10-file bound/);
});

test("a file too large to read is skipped and counted, not read", (context) => {
  const root = project(context, { "small.md": "does not prove anything\n" });
  fs.writeFileSync(
    path.join(root, "huge.md"),
    `${"x".repeat(MAX_FILE_BYTES + 1)}\nreputation_score: 9\n`,
  );
  const result = look(root);
  assert.equal(result.scanned.skippedLarge, 1);
  assert.deepEqual(findingFor(result, "F2").counter, []);
  assert.match(report(result), /skipped 1 over/);
});

test("build output, dependencies, and git internals are never read", (context) => {
  const root = project(context, {
    "src/app.js": "const timeout = 1;\n",
    "node_modules/bad.js": "user.reputation_score = 9;\n",
    "dist/bundle.js": "user.karma_total = 1;\n",
    ".git/config.js": "user.moral_score = 1;\n",
    "__pycache__/x.py": "user.trust_score = 1\n",
  });
  const { files } = collectFiles(root);
  assert.deepEqual(files, ["src/app.js"]);
  assert.deepEqual(findingFor(look(root), "F2").counter, []);
});

test("symbolic links are never followed", (context) => {
  const outside = project(context, { "secret.md": "user.karma_total = 1;\n" });
  const root = project(context, { "README.md": "x\n" });
  fs.symlinkSync(outside, path.join(root, "link"));
  fs.symlinkSync(path.join(outside, "secret.md"), path.join(root, "linked.md"));
  const { files } = collectFiles(root);
  assert.deepEqual(files, ["README.md"]);
  assert.deepEqual(findingFor(look(root), "F2").counter, []);
});

test("binary files are not scanned as text", (context) => {
  const root = project(context, { "README.md": "x\n" });
  fs.writeFileSync(
    path.join(root, "blob.json"),
    Buffer.concat([Buffer.from("user.karma_total = 1;"), Buffer.from([0, 1, 2, 3])]),
  );
  assert.deepEqual(findingFor(look(root), "F2").counter, []);
});

test("looking at a project changes nothing in it", (context) => {
  const root = repo(context, {
    "README.md": "x\n",
    "src/a.js": "const timeout = 1;\n",
    "kingdom.yaml": "name: thing\n",
  });
  fs.writeFileSync(path.join(root, "untracked.md"), "loose words\n");

  // git's own bookkeeping (.git/index) may be refreshed by a read command.
  // What must not move is the project's own content.
  const snapshot = () => {
    const seen = new Map();
    const walk = (directory) => {
      for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        if (entry.name === ".git") continue;
        const full = path.join(directory, entry.name);
        if (entry.isDirectory()) {
          walk(full);
          continue;
        }
        const stat = fs.statSync(full);
        seen.set(path.relative(root, full), `${stat.size}:${stat.mtimeMs}:${stat.mode}`);
      }
    };
    walk(root);
    return [...seen.entries()].sort();
  };

  const before = snapshot();
  look(root);
  assert.deepEqual(snapshot(), before);
});

test("an unreadable directory is passed over, never reported as fault", (context) => {
  const root = project(context, { "README.md": "does not prove much\n" });
  const locked = path.join(root, "locked");
  fs.mkdirSync(locked);
  fs.writeFileSync(path.join(locked, "a.md"), "hidden\n");
  fs.chmodSync(locked, 0o000);
  let result;
  try {
    result = look(root);
  } finally {
    // Restore before the fixture is torn down, or the cleanup cannot read it
    // either. An after-hook would run too late.
    fs.chmodSync(locked, 0o755);
  }
  assert.ok(result.findings.length === 7);
  assert.doesNotMatch(report(result), /denied|permission|EACCES|failed to read|unreadable/i);
  assert.doesNotMatch(report(result), /locked/);
});

test("the default bound is stated, not implied", () => {
  assert.equal(DEFAULT_MAX_FILES, 2000);
  assert.ok(MAX_FILE_BYTES > 0);
});

test("a path that is not a directory is refused plainly", (context) => {
  const root = project(context, { "a.md": "x\n" });
  assert.throws(() => look(path.join(root, "a.md")), /not a directory this tool can read/);
  assert.throws(() => look(path.join(root, "nope")), /not a directory this tool can read/);
});

test("a documented dummy key is a mention, and a real-looking one beside code is not", (context) => {
  const teaching = project(context, {
    "SECURITY.md":
      "Never commit a key. AWS's own docs use AKIAIOSFODNN7EXAMPLE as a placeholder.\n" +
      "A honeypot file may contain AKIAIOSFODNN7EXAMPLE to catch a scraper.\n",
    "generated.md":
      "-----BEGIN PRIVATE KEY-----\\nMC4CAQAwBQ... (rest of the base64-encoded private key)\n",
  });
  assert.deepEqual(findingFor(look(teaching), "F3").counter, []);

  const real = project(context, {
    "deploy.sh": `export AWS_ACCESS_KEY_ID=AKIA${"Q7ZB3MNPLKJH2WVR".slice(0, 16)}\n`,
  });
  assert.ok(
    ids(findingFor(look(real), "F3").counter).includes("a-credential-sits-in-the-files"),
    "a key with no example wording around it is still reported",
  );
});
