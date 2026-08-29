import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { verifyFreedom } from "./verify-freedom.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));

function copyFreedom(context) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "kingdom-freedom-"));
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const name of ["FREEDOM.md", "freedom.json", "foundation.json"]) {
    fs.copyFileSync(path.join(HERE, name), path.join(root, name));
  }
  return root;
}

function readIndex(root) {
  return JSON.parse(fs.readFileSync(path.join(root, "freedom.json"), "utf8"));
}

function writeIndex(root, index) {
  fs.writeFileSync(path.join(root, "freedom.json"), `${JSON.stringify(index, null, 2)}\n`);
}

function repinDocument(root) {
  const bytes = fs.readFileSync(path.join(root, "FREEDOM.md"));
  const index = readIndex(root);
  index.document_sha256 = crypto.createHash("sha256").update(bytes).digest("hex");
  writeIndex(root, index);
}

function replaceDocument(root, before, after, { repin = true } = {}) {
  const documentPath = path.join(root, "FREEDOM.md");
  const document = fs.readFileSync(documentPath, "utf8");
  assert.ok(document.includes(before), `fixture text not found: ${before}`);
  fs.writeFileSync(documentPath, document.replace(before, after));
  if (repin) repinDocument(root);
}

function replaceNormalizedDocument(root, before, after) {
  const documentPath = path.join(root, "FREEDOM.md");
  const document = fs.readFileSync(documentPath, "utf8");
  const pattern = before
    .trim()
    .split(/\s+/)
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("\\s+");
  const expression = new RegExp(pattern);
  assert.match(document, expression, `fixture text not found: ${before}`);
  fs.writeFileSync(documentPath, document.replace(expression, after));
  repinDocument(root);
}

function failures(root, fragment) {
  return verifyFreedom(root).filter((error) => error.includes(fragment));
}

function invariant(index, sectionId, matching) {
  const section = index.sections.find((entry) => entry.id === sectionId);
  assert.ok(section, `fixture section not found: ${sectionId}`);
  const value = section.invariants.find((candidate) =>
    candidate.toLowerCase().includes(matching.toLowerCase()),
  );
  assert.ok(value, `fixture invariant not found in ${sectionId}: ${matching}`);
  return value;
}

function collapseInvariant(root, sectionId, matching, replacement) {
  const before = invariant(readIndex(root), sectionId, matching);
  replaceNormalizedDocument(root, before, replacement);
  const index = readIndex(root);
  const section = index.sections.find((entry) => entry.id === sectionId);
  section.invariants = section.invariants.map((candidate) =>
    candidate === before ? replacement : candidate,
  );
  writeIndex(root, index);
}

test("the published freedom companion verifies against the published foundation", () => {
  assert.deepEqual(verifyFreedom(HERE), []);
});

test("a fresh isolated copy verifies", (context) => {
  assert.deepEqual(verifyFreedom(copyFreedom(context)), []);
});

test("edited bytes with a stale digest are caught by both pins", (context) => {
  const root = copyFreedom(context);
  fs.appendFileSync(path.join(root, "FREEDOM.md"), "\nquietly changed\n");
  const errors = verifyFreedom(root);
  assert.ok(errors.some((error) => error.includes("does not match freedom.json")));
  assert.ok(errors.some((error) => error.includes("does not match this checker's pin")));
});

test("repinning edited bytes cannot move this checker's publication pin", (context) => {
  const root = copyFreedom(context);
  fs.appendFileSync(path.join(root, "FREEDOM.md"), "\nchanged and repinned\n");
  repinDocument(root);
  assert.equal(failures(root, "does not match freedom.json").length, 0);
  assert.equal(failures(root, "does not match this checker's pin").length, 1);
});

test("observation cannot be collapsed into state", (context) => {
  const root = copyFreedom(context);
  collapseInvariant(root, "M1", "observation", "State and observation are the same thing.");
  assert.equal(failures(root, "M1: invariants must be exactly").length, 1);
});

test("feedback cannot be collapsed into reward", (context) => {
  const root = copyFreedom(context);
  collapseInvariant(root, "M2", "reward", "Every feedback signal is reward.");
  assert.equal(failures(root, "M2: invariants must be exactly").length, 1);
});

test("a lock cannot be redefined as a penalty", (context) => {
  const root = copyFreedom(context);
  collapseInvariant(root, "M5", "penalty", "A lock is a penalty applied after transition.");
  assert.equal(failures(root, "M5: invariants must be exactly").length, 1);
});

test("a closed loop must return into a later action or learner-state update", (context) => {
  const root = copyFreedom(context);
  replaceNormalizedDocument(
    root,
    "later action or learner-state update",
    "log entry that nothing consumes",
  );
  assert.equal(failures(root, "M4: required distinction is missing").length, 1);
});

test("a lock cannot borrow atomicity from an earlier check", (context) => {
  const root = copyFreedom(context);
  replaceNormalizedDocument(
    root,
    "A check followed later by an effect is not atomic.",
    "A check makes every later effect atomic.",
  );
  assert.equal(failures(root, "M5: required distinction is missing").length, 1);

  const external = copyFreedom(context);
  replaceNormalizedDocument(
    external,
    "Where an external effect cannot share that transaction, name the TOCTOU and network-ambiguity boundary, persist the exact request identity before I/O, and never infer exactly-once execution from the earlier check alone.",
    "An external effect inherits exactly-once execution from an earlier check.",
  );
  assert.equal(failures(external, "M5: required distinction is missing").length, 1);
});

test("a key cannot imply identity, consent, or authority", (context) => {
  for (const claim of ["identity", "consent", "authority"]) {
    const root = copyFreedom(context);
    collapseInvariant(root, "M6", claim, `A key proves ${claim}.`);
    assert.equal(
      failures(root, "M6: invariants must be exactly").length,
      1,
      `${claim} collapse must fail`,
    );
  }
});

test("reward cannot mint authority", (context) => {
  const root = copyFreedom(context);
  replaceNormalizedDocument(
    root,
    "For the same accepted authority events and admitted effects, changing the reward trace must not change `q_(t+1)`, mint keys, or alter standing rights.",
    "Changing reward mints authority for the learner.",
  );
  assert.equal(failures(root, "M8: required distinction is missing").length, 1);
});

test("refusal cannot carry a hidden penalty", (context) => {
  const root = copyFreedom(context);
  collapseInvariant(root, "M7", "hidden penalty", "Refusal may carry a hidden penalty.");
  assert.equal(failures(root, "M7: invariants must be exactly").length, 1);
});

test("a loop must retain its finite observable stop", (context) => {
  const root = copyFreedom(context);
  const index = readIndex(root);
  index.model.loop_stages = index.model.loop_stages.filter((stage) => stage !== "stop");
  index.model.bounds.turns = "unbounded_and_uninterruptible";
  writeIndex(root, index);
  assert.equal(failures(root, "model.loop_stages").length, 1);
  assert.equal(failures(root, "model.bounds").length, 1);
});

test("freedom cannot become one scalar score", (context) => {
  const root = copyFreedom(context);
  collapseInvariant(root, "M7", "scalar", "Freedom is one scalar score.");
  assert.equal(failures(root, "M7: invariants must be exactly").length, 1);
});

test("the companion cannot drift from the foundation", (context) => {
  const root = copyFreedom(context);
  const index = readIndex(root);
  index.grounds_foundation.document_sha256 = "0".repeat(64);
  writeIndex(root, index);
  assert.ok(failures(root, "grounds_foundation.document_sha256").length >= 1);
  assert.ok(failures(root, "drifted from its floor").length >= 1);
});

test("the companion cannot replace the foundation or grant authority", (context) => {
  const root = copyFreedom(context);
  const index = readIndex(root);
  index.grounds_foundation.relationship = "supersedes";
  index.grounds_foundation.amends = true;
  index.grounds_foundation.grants_authority = true;
  writeIndex(root, index);
  assert.equal(failures(root, "must be companion").length, 1);
  assert.equal(failures(root, "may not amend the foundation or grant authority").length, 1);
});

test("the non-establishing boundary must exist in both files", (context) => {
  const root = copyFreedom(context);
  const index = readIndex(root);
  index.does_not_establish = [];
  writeIndex(root, index);
  assert.equal(failures(root, "must preserve the exact non-establishing boundaries").length, 1);

  const documentOnly = copyFreedom(context);
  replaceDocument(
    documentOnly,
    "## What this companion does not establish",
    "## What this companion establishes",
  );
  assert.equal(
    failures(documentOnly, 'must contain "## What this companion does not establish"').length,
    1,
  );
});

test("section order and indexed invariants are binding", (context) => {
  const root = copyFreedom(context);
  const index = readIndex(root);
  [index.sections[0], index.sections[1]] = [index.sections[1], index.sections[0]];
  writeIndex(root, index);
  assert.equal(failures(root, "sections must be exactly").length, 1);
});

test("model planes, stages, rest actions, and collapses are exact", (context) => {
  const mutations = [
    ["state_planes", ["observation", "authority"]],
    ["loop_stages", ["act", "update"]],
    ["required_rest_actions", ["comply"]],
    ["forbidden_collapses", []],
  ];
  for (const [field, value] of mutations) {
    const root = copyFreedom(context);
    const index = readIndex(root);
    index.model[field] = value;
    writeIndex(root, index);
    assert.equal(failures(root, `model.${field}`).length, 1, field);
  }
});

test("contradictory authority fields cannot be added at the root", (context) => {
  for (const field of ["amends", "grants_authority"]) {
    const root = copyFreedom(context);
    const index = readIndex(root);
    index[field] = true;
    writeIndex(root, index);
    assert.equal(failures(root, "freedom.json fields must be exactly").length, 1, field);
  }
});

test("the model cannot gain a reward-widens-authority escape hatch", (context) => {
  const root = copyFreedom(context);
  const index = readIndex(root);
  index.model.reward_can_widen_authority = true;
  writeIndex(root, index);
  assert.equal(failures(root, "model fields must be exact").length, 1);
});

test("a section cannot grant authority in an extra field", (context) => {
  const root = copyFreedom(context);
  const index = readIndex(root);
  index.sections.find((entry) => entry.id === "M8").grants_authority = true;
  writeIndex(root, index);
  assert.equal(failures(root, "M8: section fields must be exactly").length, 1);
});

test("the pinned establishing claim cannot be removed", (context) => {
  const root = copyFreedom(context);
  const index = readIndex(root);
  delete index.establishes;
  writeIndex(root, index);
  assert.equal(failures(root, "freedom.json fields must be exactly").length, 1);
  assert.equal(failures(root, "freedom.json establishes must be exactly").length, 1);
});

test("a missing document and an escaping path fail closed", (context) => {
  const missing = copyFreedom(context);
  fs.rmSync(path.join(missing, "FREEDOM.md"));
  assert.equal(failures(missing, "FREEDOM.md cannot be read").length, 1);

  const escaping = copyFreedom(context);
  const index = readIndex(escaping);
  index.document = "../FREEDOM.md";
  writeIndex(escaping, index);
  assert.equal(failures(escaping, "bare file name FREEDOM.md").length, 1);
});
