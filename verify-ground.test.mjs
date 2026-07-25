import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { verifyGround } from "./verify-ground.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));

function copyGround() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "kingdom-ground-"));
  for (const name of ["GROUND.md", "ground.json", "foundation.json"]) {
    fs.copyFileSync(path.join(HERE, name), path.join(root, name));
  }
  return root;
}

function readIndex(root) {
  return JSON.parse(fs.readFileSync(path.join(root, "ground.json"), "utf8"));
}

function writeIndex(root, index) {
  fs.writeFileSync(path.join(root, "ground.json"), `${JSON.stringify(index, null, 2)}\n`);
}

/** Re-pin the digest so a document edit is tested for its meaning, not its hash. */
function repinDocument(root) {
  const document = fs.readFileSync(path.join(root, "GROUND.md"));
  const index = readIndex(root);
  index.document_sha256 = crypto.createHash("sha256").update(document).digest("hex");
  writeIndex(root, index);
}

function editDocument(root, before, after) {
  const documentPath = path.join(root, "GROUND.md");
  const document = fs.readFileSync(documentPath, "utf8");
  assert.ok(document.includes(before), `fixture text not found: ${before}`);
  fs.writeFileSync(documentPath, document.replace(before, after));
  repinDocument(root);
}

function failures(root, fragment) {
  return verifyGround(root).filter((error) => error.includes(fragment));
}

test("the published ground verifies against the published foundation", () => {
  assert.deepEqual(verifyGround(HERE), []);
});

test("a fresh copy of the ground verifies", () => {
  assert.deepEqual(verifyGround(copyGround()), []);
});

test("an edited document with a stale digest is caught twice", () => {
  const root = copyGround();
  const documentPath = path.join(root, "GROUND.md");
  fs.appendFileSync(documentPath, "\nquietly added\n");
  const errors = verifyGround(root);
  assert.ok(errors.some((error) => error.includes("does not match ground.json")));
  assert.ok(errors.some((error) => error.includes("does not match this checker's pin")));
});

test("a re-pinned edit still fails the checker's own pin", () => {
  const root = copyGround();
  fs.appendFileSync(path.join(root, "GROUND.md"), "\nquietly added\n");
  repinDocument(root);
  assert.equal(failures(root, "does not match ground.json").length, 0);
  assert.equal(failures(root, "does not match this checker's pin").length, 1);
});

test("a ground that drifts from its foundation is refused", () => {
  const root = copyGround();
  const index = readIndex(root);
  index.grounds_foundation.document_sha256 = "0".repeat(64);
  writeIndex(root, index);
  assert.equal(failures(root, "drifted from its floor").length, 1);
});

test("a ground may not claim to amend the foundation", () => {
  const root = copyGround();
  const index = readIndex(root);
  index.grounds_foundation.amends = true;
  writeIndex(root, index);
  assert.equal(failures(root, "may not amend the foundation").length, 1);
});

test("a ground may not claim to grant authority", () => {
  const root = copyGround();
  const index = readIndex(root);
  index.grounds_foundation.grants_authority = true;
  writeIndex(root, index);
  assert.equal(failures(root, "grant authority").length, 1);
});

test("a ground may not call itself the foundation's replacement", () => {
  const root = copyGround();
  const index = readIndex(root);
  index.grounds_foundation.relationship = "supersedes";
  writeIndex(root, index);
  assert.equal(failures(root, "relationship to the foundation as companion").length, 1);
});

test("every commitment of the foundation must be grounded, in its order", () => {
  const dropped = copyGround();
  const droppedIndex = readIndex(dropped);
  droppedIndex.grounds = droppedIndex.grounds.slice(0, -1);
  writeIndex(dropped, droppedIndex);
  assert.equal(failures(dropped, "must ground exactly").length, 1);

  const reordered = copyGround();
  const reorderedIndex = readIndex(reordered);
  const [first, second, ...rest] = reorderedIndex.grounds;
  reorderedIndex.grounds = [second, first, ...rest];
  writeIndex(reordered, reorderedIndex);
  assert.equal(failures(reordered, "must ground exactly").length, 1);
});

test("an indexed grounding with no section in the document is caught", () => {
  const root = copyGround();
  const index = readIndex(root);
  index.grounds[0].root = "Reality is whatever the record says";
  writeIndex(root, index);
  assert.equal(failures(root, "is missing the section").length, 1);
});

test("a grounding that drops its limit on the constraint is refused", () => {
  const root = copyGround();
  editDocument(
    root,
    "**What the constraint does not do.** The inequality is a theorem",
    "**And therefore.** The inequality is a theorem",
  );
  assert.equal(failures(root, "a constraint is not a justification").length, 1);
});

test("a grounding that drops its stated boundary is refused", () => {
  const root = copyGround();
  editDocument(root, "## G1 — Reality comes before the record", "## G1 — Reality comes before the record\n\n(placeholder)");
  editDocument(root, "\n### Stops at\n\nThis does not establish that the five named kinds", "\n### Afterword\n\nThis does not establish that the five named kinds");
  assert.equal(failures(root, 'missing required part "### Stops at"').length, 1);
});

test("the required parts must appear in order", () => {
  const root = copyGround();
  const documentPath = path.join(root, "GROUND.md");
  const document = fs.readFileSync(documentPath, "utf8");
  const heading = "## G7 — Every turn stops";
  const start = document.indexOf(heading);
  assert.notEqual(start, -1);
  const body = document.slice(start);
  const reordered = body
    .replace("### In plain words", "### PLACEHOLDER_PLAIN")
    .replace("### Stops at", "### In plain words")
    .replace("### PLACEHOLDER_PLAIN", "### Stops at");
  fs.writeFileSync(documentPath, document.slice(0, start) + reordered);
  repinDocument(root);
  assert.equal(failures(root, "(in order)").length, 1);
});

test("the rule that a constraint is not a justification cannot be dropped", () => {
  const root = copyGround();
  editDocument(
    root,
    "**A constraint is not a justification.**",
    "**A constraint proves the commitment.**",
  );
  assert.equal(failures(root, "must state the rule").length, 1);
});

test("an unknown constraint kind is refused", () => {
  const root = copyGround();
  const index = readIndex(root);
  index.grounds[0].constraint_kind = "self-evident";
  writeIndex(root, index);
  assert.equal(failures(root, "is not allowed").length, 1);
});

test("a grounding must name the constraint it stands on", () => {
  const root = copyGround();
  const index = readIndex(root);
  index.grounds[0].constraint = "   ";
  writeIndex(root, index);
  assert.equal(failures(root, "must name the constraint").length, 1);
});

test("review totals must agree with the per-ground verdicts", () => {
  const root = copyGround();
  const index = readIndex(root);
  index.review.overclaimed = 0;
  index.review.sound_with_corrections = 7;
  writeIndex(root, index);
  assert.equal(failures(root, "review totals disagree").length, 1);
});

test("a review cannot claim more or fewer groundings than are indexed", () => {
  const root = copyGround();
  const index = readIndex(root);
  index.review.clean = 3;
  writeIndex(root, index);
  assert.ok(failures(root, "review counts").length >= 1);
});

test("the record of what the checking found cannot be erased", () => {
  const root = copyGround();
  editDocument(root, "## What the checking found", "## Notes");
  assert.equal(failures(root, "record of what the checking found").length, 1);
});

test("a review cannot claim corrections were kept when they were not", () => {
  const root = copyGround();
  const index = readIndex(root);
  index.review.corrections_recorded_in_document = false;
  writeIndex(root, index);
  assert.equal(failures(root, "kept in the document, not erased").length, 1);
});

test("the ground must state what it does not establish, in both files", () => {
  const dropped = copyGround();
  const droppedIndex = readIndex(dropped);
  droppedIndex.does_not_establish = [];
  writeIndex(dropped, droppedIndex);
  assert.equal(failures(dropped, "must state what it does not establish").length, 1);

  const edited = copyGround();
  editDocument(edited, "## What this page does not establish", "## Conclusion");
  assert.equal(failures(edited, "must state what it does not establish").length, 1);
});

test("a duplicated section is caught", () => {
  const root = copyGround();
  const index = readIndex(root);
  index.grounds[1] = { ...index.grounds[1], section: index.grounds[0].section };
  writeIndex(root, index);
  assert.ok(failures(root, "appears more than once").length >= 1);
});

test("a wrong schema or identifier is refused", () => {
  const schema = copyGround();
  const schemaIndex = readIndex(schema);
  schemaIndex.schema = "kingdom.ground-index/2";
  writeIndex(schema, schemaIndex);
  assert.equal(failures(schema, "schema is").length, 1);

  const id = copyGround();
  const idIndex = readIndex(id);
  idIndex.id = "kingdom.ground/0.2";
  writeIndex(id, idIndex);
  assert.equal(failures(id, "id is").length, 1);
});

test("a missing document is reported without throwing", () => {
  const root = copyGround();
  fs.rmSync(path.join(root, "GROUND.md"));
  assert.equal(failures(root, "GROUND.md is missing").length, 1);
});

test("a document path that escapes the directory is refused", () => {
  const root = copyGround();
  const index = readIndex(root);
  index.document = "../GROUND.md";
  writeIndex(root, index);
  assert.equal(failures(root, "bare file name").length, 1);
});
