import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { verifyFoundation } from "./verify-foundation.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));

function copyFoundation() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "kingdom-foundation-"));
  for (const name of ["FOUNDATION.md", "foundation.json"]) {
    fs.copyFileSync(path.join(HERE, name), path.join(root, name));
  }
  return root;
}

test("the published foundation index matches the document identifiers and digest", () => {
  assert.deepEqual(verifyFoundation(HERE), []);
});

function replaceDocument(root, before, after) {
  const documentPath = path.join(root, "FOUNDATION.md");
  const document = fs.readFileSync(documentPath, "utf8");
  assert.ok(document.includes(before), `fixture text not found: ${before}`);
  fs.writeFileSync(documentPath, document.replace(before, after));
}

function assertDigestFailure(root) {
  assert.ok(
    verifyFoundation(root).some((error) => error.includes("document_sha256")),
  );
}

test("a missing commitment fails closed", (context) => {
  const root = copyFoundation();
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  replaceDocument(root, "### F7. Every turn stops.", "### Every turn stops.");

  assert.ok(
    verifyFoundation(root).some((error) => error.includes("F1 through F7")),
  );
});

test("a changed statement kind breaks the pinned document digest", (context) => {
  const root = copyFoundation();
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  replaceDocument(root, "**Observation**", "**Oracle verdict**");
  assertDigestFailure(root);
});

test("a reversed KARMA boundary breaks the pinned document digest", (context) => {
  const root = copyFoundation();
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  replaceDocument(
    root,
    "It never assigns a moral score or final",
    "It always assigns a moral score and final",
  );
  assertDigestFailure(root);
});

test("a changed return path breaks the pinned document digest", (context) => {
  const root = copyFoundation();
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  replaceDocument(
    root,
    "action → evidence → response → correction, repair, or boundary",
    "action → rank → punishment",
  );
  assertDigestFailure(root);
});

test("a changed adoption limit breaks the pinned document digest", (context) => {
  const root = copyFoundation();
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  replaceDocument(
    root,
    "It does not\nprove conformance",
    "It does\nprove conformance",
  );
  assertDigestFailure(root);
});

test("a KARMA score field cannot disappear from the refusal list", (context) => {
  const root = copyFoundation();
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const indexPath = path.join(root, "foundation.json");
  const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  index.karma.forbidden_aggregates = index.karma.forbidden_aggregates.filter(
    (field) => field !== "reputation_score",
  );
  fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);

  assert.ok(
    verifyFoundation(root).some((error) =>
      error.includes("aggregate score field"),
    ),
  );
});

test("adoption cannot silently point at another version", (context) => {
  const root = copyFoundation();
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const indexPath = path.join(root, "foundation.json");
  const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  index.adoption.value = "kingdom.foundation/9.9";
  fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);

  assert.ok(
    verifyFoundation(root).some((error) => error.includes("exact foundation id")),
  );
});

test("a non-object JSON root returns a plain diagnostic", (context) => {
  const root = copyFoundation();
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.writeFileSync(path.join(root, "foundation.json"), "null\n");
  assert.deepEqual(verifyFoundation(root), [
    "foundation.json root must be one JSON object",
  ]);
});
