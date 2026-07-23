import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { verifyFoundation } from "./verify-foundation.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));

function copyFoundation() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "kingdom-foundation-"));
  for (const name of [
    "FOUNDATION.md",
    "AMENDMENT-0.2.md",
    "STANDARD.md",
    "CONFORMANCE.md",
    "foundation.json",
  ]) {
    fs.copyFileSync(path.join(HERE, name), path.join(root, name));
  }
  return root;
}

function verifyFixture(root) {
  return verifyFoundation(root, { verifyGitPredecessor: false });
}

test("the local release index matches all identifiers, Git lineage, and digests", () => {
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
    verifyFixture(root).some((error) => error.includes("FOUNDATION.md bytes")),
  );
}

function repinDocumentDigest(root) {
  const document = fs.readFileSync(path.join(root, "FOUNDATION.md"));
  const indexPath = path.join(root, "foundation.json");
  const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  index.document_sha256 = crypto.createHash("sha256").update(document).digest("hex");
  fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);
}

test("a missing commitment fails closed", (context) => {
  const root = copyFoundation();
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  replaceDocument(root, "### F7. Every turn stops.", "### Every turn stops.");

  assert.ok(
    verifyFixture(root).some((error) => error.includes("F1 through F7")),
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
    "[expectation, if stated] → action",
    "action → rank → punishment",
  );
  assertDigestFailure(root);
});

test("repinning cannot merge a predicted expectation with intended purpose", (context) => {
  const root = copyFoundation();
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  replaceDocument(
    root,
    "intended effect is a separately labelled commitment or purpose",
    "intended effect is the same prediction",
  );
  repinDocumentDigest(root);

  assert.ok(
    verifyFixture(root).some((error) =>
      error.includes(
        "intended effect is a separately labelled commitment or purpose",
      ),
    ),
  );
});

test("repinning cannot remove the actual effect from the KARMA path", (context) => {
  const root = copyFoundation();
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  replaceDocument(
    root,
    "→ observed, reported, or inferred effect\n→ evidence and causal confidence",
    "→ evidence and causal confidence",
  );
  repinDocumentDigest(root);

  const indexPath = path.join(root, "foundation.json");
  const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  index.karma.return_path = index.karma.return_path.filter(
    (stage) => stage !== "observed_reported_or_inferred_effect",
  );
  fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);

  const errors = verifyFixture(root);
  assert.ok(
    errors.some(
      (error) =>
        error.includes("karma return_path") ||
        error.includes("observed, reported, or inferred effect"),
    ),
  );
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

test("repinning changed foundation bytes under 0.2 still fails", (context) => {
  const root = copyFoundation();
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.appendFileSync(path.join(root, "FOUNDATION.md"), "\nchanged and repinned\n");
  repinDocumentDigest(root);

  assert.ok(
    verifyFixture(root).some((error) =>
      error.includes("immutable kingdom.foundation/0.2 document"),
    ),
  );
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
    verifyFixture(root).some((error) =>
      error.includes("aggregate score field"),
    ),
  );
});

test("expectation cannot disappear from the statement kinds", (context) => {
  const root = copyFoundation();
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const indexPath = path.join(root, "foundation.json");
  const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  index.statement_kinds = index.statement_kinds.filter(
    (kind) => kind !== "expectation",
  );
  fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);

  assert.ok(
    verifyFixture(root).some((error) =>
      error.includes("five-kind reality boundary"),
    ),
  );
});

test("the superseded 0.1 receipt cannot be rewritten or extended", () => {
  const mutations = [
    ["document", "OTHER.md"],
    ["document_sha256", "0".repeat(64)],
    ["commit", "0".repeat(40)],
    [
      "content_url",
      "https://raw.githubusercontent.com/cambridgetcg/kingdom-standard/0000000000000000000000000000000000000000/FOUNDATION.md",
    ],
    ["extra", "silent-extension"],
  ];

  for (const [field, value] of mutations) {
    const root = copyFoundation();
    try {
      const indexPath = path.join(root, "foundation.json");
      const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
      index.supersedes[0][field] = value;
      fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);

      assert.ok(
        verifyFixture(root).some((error) =>
          error.includes("exact kingdom.foundation/0.1 receipt"),
        ),
        `mutation of ${field} must fail`,
      );
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  }
});

test("repinning a digest cannot remove the local-authority boundary", (context) => {
  const root = copyFoundation();
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  replaceDocument(
    root,
    "localness alone grants no authority",
    "localness grants authority",
  );
  repinDocumentDigest(root);

  assert.ok(
    verifyFixture(root).some((error) =>
      error.includes("localness alone grants no authority"),
    ),
  );
});

test("repinning cannot erase the valid authority sources", (context) => {
  const root = copyFoundation();
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  replaceDocument(
    root,
    "can arise from ownership, delegation, consent, applicable law, or one's own",
    "can arise from local possession alone, never from another source or one's own",
  );
  repinDocumentDigest(root);

  assert.ok(
    verifyFixture(root).some((error) =>
      error.includes(
        "can arise from ownership, delegation, consent, applicable law, or one's own",
      ),
    ),
  );
});

test("repinning cannot make consent or delegation permanent", (context) => {
  const root = copyFoundation();
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  replaceDocument(
    root,
    "Consent and delegation remain withdrawable within their",
    "Consent and delegation become permanent within their",
  );
  repinDocumentDigest(root);

  assert.ok(
    verifyFixture(root).some((error) =>
      error.includes("Consent and delegation remain withdrawable within their"),
    ),
  );
});

test("repinning a digest cannot turn signature verification into identity proof", (context) => {
  const root = copyFoundation();
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  replaceDocument(
    root,
    "It does not identify who used the key or",
    "It identifies who used the key and",
  );
  repinDocumentDigest(root);

  assert.ok(
    verifyFixture(root).some((error) =>
      error.includes("It does not identify who used the key or"),
    ),
  );
});

test("adoption cannot silently point at another version", (context) => {
  const root = copyFoundation();
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const indexPath = path.join(root, "foundation.json");
  const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  index.adoption.values[0] = "kingdom.foundation/9.9";
  fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);

  assert.ok(
    verifyFixture(root).some((error) =>
      error.includes("both exact release ids"),
    ),
  );
});

test("the operational laws cannot drift under the same standard id", (context) => {
  const root = copyFoundation();
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.appendFileSync(path.join(root, "STANDARD.md"), "\nchanged law\n");

  assert.ok(
    verifyFixture(root).some((error) =>
      error.includes("STANDARD.md bytes"),
    ),
  );
});

test("the conformance checklist cannot drift under the same standard id", (context) => {
  const root = copyFoundation();
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.appendFileSync(path.join(root, "CONFORMANCE.md"), "\nchanged check\n");

  assert.ok(
    verifyFixture(root).some((error) =>
      error.includes("CONFORMANCE.md bytes"),
    ),
  );
});

test("repinning changed operational bytes under standard 1.0 still fails", (context) => {
  const root = copyFoundation();
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const standardPath = path.join(root, "STANDARD.md");
  fs.appendFileSync(standardPath, "\nchanged and repinned law\n");
  const indexPath = path.join(root, "foundation.json");
  const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  index.operational_standard.document_sha256 = crypto
    .createHash("sha256")
    .update(fs.readFileSync(standardPath))
    .digest("hex");
  fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);

  assert.ok(
    verifyFixture(root).some((error) =>
      error.includes("immutable English standard 1.0"),
    ),
  );
});

test("operational succession cannot lose its new-id and retention rule", (context) => {
  const root = copyFoundation();
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const indexPath = path.join(root, "foundation.json");
  const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  index.operational_standard.succession.change = "repin_same_identifier";
  fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);

  assert.ok(
    verifyFixture(root).some((error) =>
      error.includes("operational succession"),
    ),
  );
});

test("the amendment evidence receipt cannot drift after acceptance", (context) => {
  const root = copyFoundation();
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.appendFileSync(path.join(root, "AMENDMENT-0.2.md"), "\nchanged evidence\n");

  assert.ok(
    verifyFixture(root).some((error) =>
      error.includes("AMENDMENT-0.2.md bytes"),
    ),
  );
});

test("repinning changed amendment bytes under 0.2 still fails", (context) => {
  const root = copyFoundation();
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const amendmentPath = path.join(root, "AMENDMENT-0.2.md");
  fs.appendFileSync(amendmentPath, "\nchanged and repinned receipt\n");
  const indexPath = path.join(root, "foundation.json");
  const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  index.amendment_receipt.document_sha256 = crypto
    .createHash("sha256")
    .update(fs.readFileSync(amendmentPath))
    .digest("hex");
  fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);

  assert.ok(
    verifyFixture(root).some((error) =>
      error.includes("immutable AMENDMENT-0.2.md receipt"),
    ),
  );
});

test("the machine adoption boundary cannot become proof", (context) => {
  const root = copyFoundation();
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const indexPath = path.join(root, "foundation.json");
  const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  index.adoption.meaning = "The pins prove consent and conformance.";
  fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);

  assert.ok(
    verifyFixture(root).some((error) =>
      error.includes("declaration boundary"),
    ),
  );
});

test("a non-object JSON root returns a plain diagnostic", (context) => {
  const root = copyFoundation();
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.writeFileSync(path.join(root, "foundation.json"), "null\n");
  assert.deepEqual(verifyFixture(root), [
    "foundation.json root must be one JSON object",
  ]);
});
