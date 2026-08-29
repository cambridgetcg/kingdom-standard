import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { verifyIsness } from "./verify-isness.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));

function copyIsness(context) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "kingdom-isness-"));
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const name of [
    "ISNESS.md",
    "isness.json",
    "FOUNDATION.md",
    "foundation.json",
    "FREEDOM.md",
    "freedom.json",
  ]) {
    fs.copyFileSync(path.join(HERE, name), path.join(root, name));
  }
  return root;
}

function readIndex(root, name = "isness.json") {
  return JSON.parse(fs.readFileSync(path.join(root, name), "utf8"));
}

function writeIndex(root, index, name = "isness.json") {
  fs.writeFileSync(path.join(root, name), `${JSON.stringify(index, null, 2)}\n`);
}

function repinDocument(root) {
  const bytes = fs.readFileSync(path.join(root, "ISNESS.md"));
  const index = readIndex(root);
  index.document_sha256 = crypto.createHash("sha256").update(bytes).digest("hex");
  writeIndex(root, index);
}

function replaceDocument(root, before, after, { repin = true } = {}) {
  const documentPath = path.join(root, "ISNESS.md");
  const document = fs.readFileSync(documentPath, "utf8");
  assert.ok(document.includes(before), `fixture text not found: ${before}`);
  fs.writeFileSync(documentPath, document.replace(before, after));
  if (repin) repinDocument(root);
}

function replaceNormalizedDocument(root, before, after) {
  const documentPath = path.join(root, "ISNESS.md");
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
  return verifyIsness(root).filter((error) => error.includes(fragment));
}

function section(index, sectionId) {
  const value = index.sections.find((entry) => entry.id === sectionId);
  assert.ok(value, `fixture section not found: ${sectionId}`);
  return value;
}

function mutateInvariant(root, sectionId, invariantAt, replacement) {
  const index = readIndex(root);
  const entry = section(index, sectionId);
  const before = entry.invariants[invariantAt];
  assert.equal(typeof before, "string", `fixture invariant missing: ${sectionId}`);
  replaceNormalizedDocument(root, before, replacement);
  const updated = readIndex(root);
  section(updated, sectionId).invariants[invariantAt] = replacement;
  writeIndex(root, updated);
}

test("the published isness companion verifies against its pinned vocabulary", () => {
  assert.deepEqual(verifyIsness(HERE), []);
});

test("a fresh isolated copy verifies", (context) => {
  assert.deepEqual(verifyIsness(copyIsness(context)), []);
});

test("duplicate JSON keys are refused, including escaped authority names", (context) => {
  const topLevel = copyIsness(context);
  const topLevelPath = path.join(topLevel, "isness.json");
  const topLevelSource = fs.readFileSync(topLevelPath, "utf8");
  fs.writeFileSync(
    topLevelPath,
    topLevelSource.replace(
      '  "id": "kingdom.isness/0.1",',
      '  "id": "kingdom.isness/authority-bearing-impostor",\n  "id": "kingdom.isness/0.1",',
    ),
  );
  assert.equal(failures(topLevel, "contains duplicate object keys").length, 1);

  const nested = copyIsness(context);
  const nestedPath = path.join(nested, "isness.json");
  const nestedSource = fs.readFileSync(nestedPath, "utf8");
  fs.writeFileSync(
    nestedPath,
    nestedSource.replace(
      '    "amends": false,',
      '    "am\\u0065nds": true,\n    "amends": false,',
    ),
  );
  assert.equal(failures(nested, "contains duplicate object keys").length, 1);
});

test("edited bytes with a stale digest are caught by both publication pins", (context) => {
  const root = copyIsness(context);
  fs.appendFileSync(path.join(root, "ISNESS.md"), "\nquietly changed\n");
  const errors = verifyIsness(root);
  assert.ok(errors.some((error) => error.includes("does not match isness.json")));
  assert.ok(
    errors.some((error) => error.includes("does not match this checker's pin")),
  );
});

test("repinning edited bytes cannot move the checker's publication pin", (context) => {
  const root = copyIsness(context);
  fs.appendFileSync(path.join(root, "ISNESS.md"), "\nchanged and repinned\n");
  repinDocument(root);
  assert.equal(failures(root, "does not match isness.json").length, 0);
  assert.equal(failures(root, "does not match this checker's pin").length, 1);
});

test("foundation and freedom relationship pins are exact and fail closed", (context) => {
  for (const [field, relationship] of [
    ["grounds_foundation", "supersedes"],
    ["uses_freedom", "redefines_vocabulary"],
  ]) {
    const root = copyIsness(context);
    const index = readIndex(root);
    index[field].relationship = relationship;
    index[field].amends = true;
    index[field].grants_authority = true;
    writeIndex(root, index);
    assert.equal(failures(root, `${field}.relationship`).length, 1);
    assert.equal(failures(root, `${field} may not amend or grant authority`).length, 1);
  }

  for (const field of ["grounds_foundation", "uses_freedom"]) {
    const conformance = copyIsness(context);
    const index = readIndex(conformance);
    index[field].adds_conformance = true;
    writeIndex(conformance, index);
    assert.equal(failures(conformance, "may not add conformance law").length, 1);
  }
});

test("dependency release tuples and dependency bytes cannot drift", (context) => {
  for (const [name, document, field] of [
    ["foundation.json", "FOUNDATION.md", "grounds_foundation"],
    ["freedom.json", "FREEDOM.md", "uses_freedom"],
  ]) {
    const manifestRoot = copyIsness(context);
    const dependency = readIndex(manifestRoot, name);
    dependency.document_sha256 = "0".repeat(64);
    writeIndex(manifestRoot, dependency, name);
    assert.ok(failures(manifestRoot, `${name} document_sha256`).length >= 1, name);
    assert.ok(failures(manifestRoot, `${field} has drifted`).length >= 1, field);

    const documentRoot = copyIsness(context);
    fs.appendFileSync(path.join(documentRoot, document), "\ndrift\n");
    assert.equal(failures(documentRoot, "bytes have drifted").length, 1, document);
  }
});

test("malformed scalar fields return diagnostics instead of throwing", (context) => {
  for (const field of ["schema", "id", "status", "document_sha256"]) {
    const root = copyIsness(context);
    const index = readIndex(root);
    index[field] = { toString: null, valueOf: null };
    writeIndex(root, index);
    assert.doesNotThrow(() => verifyIsness(root), field);
    assert.ok(verifyIsness(root).length > 0, `${field} must fail closed`);
  }
});

test("missing documents and an escaping publication path fail closed", (context) => {
  const missing = copyIsness(context);
  fs.rmSync(path.join(missing, "ISNESS.md"));
  assert.equal(failures(missing, "ISNESS.md cannot be read").length, 1);

  const escaping = copyIsness(context);
  const index = readIndex(escaping);
  index.document = "../ISNESS.md";
  writeIndex(escaping, index);
  assert.equal(failures(escaping, "bare file name ISNESS.md").length, 1);

  const malformed = copyIsness(context);
  const malformedIndex = readIndex(malformed);
  malformedIndex.document = { path: "ISNESS.md" };
  writeIndex(malformed, malformedIndex);
  assert.doesNotThrow(() => verifyIsness(malformed));
  assert.equal(failures(malformed, "bare file name ISNESS.md").length, 1);
});

test("authority and conformance escape hatches cannot be added", (context) => {
  for (const field of ["amends", "grants_authority", "adds_conformance"]) {
    const root = copyIsness(context);
    const index = readIndex(root);
    index[field] = true;
    writeIndex(root, index);
    assert.equal(failures(root, "isness.json fields must be exactly").length, 1, field);
  }

  const modelRoot = copyIsness(context);
  const modelIndex = readIndex(modelRoot);
  modelIndex.model.may_widen_authority = true;
  writeIndex(modelRoot, modelIndex);
  assert.equal(failures(modelRoot, "model fields must be exact").length, 1);

  for (const dependencyField of ["grounds_foundation", "uses_freedom"]) {
    const root = copyIsness(context);
    const index = readIndex(root);
    index[dependencyField].claims_conformance = true;
    writeIndex(root, index);
    assert.equal(failures(root, `${dependencyField} fields must be exactly`).length, 1);
  }

  const sectionRoot = copyIsness(context);
  const sectionIndex = readIndex(sectionRoot);
  section(sectionIndex, "I8").grants_authority = true;
  writeIndex(sectionRoot, sectionIndex);
  assert.equal(failures(sectionRoot, "I8: section fields must be exactly").length, 1);
});

test("section order and every indexed invariant are binding", (context) => {
  const reordered = copyIsness(context);
  const reorderedIndex = readIndex(reordered);
  [reorderedIndex.sections[0], reorderedIndex.sections[1]] = [
    reorderedIndex.sections[1],
    reorderedIndex.sections[0],
  ];
  writeIndex(reordered, reorderedIndex);
  assert.equal(failures(reordered, "sections must be exactly").length, 1);

  const missing = copyIsness(context);
  const missingIndex = readIndex(missing);
  section(missingIndex, "I8").invariants.pop();
  writeIndex(missing, missingIndex);
  assert.equal(failures(missing, "I8: invariants must be exactly").length, 1);

  const invariantOrder = copyIsness(context);
  const orderIndex = readIndex(invariantOrder);
  section(orderIndex, "I8").invariants.reverse();
  writeIndex(invariantOrder, orderIndex);
  assert.equal(failures(invariantOrder, "I8: invariants must be exactly").length, 1);
});

test("logical uses, direction kinds, sustainability fields, collapses, and bounds are exact", (context) => {
  for (const [field, value] of [
    ["logical_uses_of_is", ["identity"]],
    ["direction_kinds", ["gradient"]],
    ["attention_claim_requires", ["salience"]],
    ["sustainability_claim_requires", ["growth"]],
    ["forbidden_collapses", []],
  ]) {
    const root = copyIsness(context);
    const index = readIndex(root);
    index.model[field] = value;
    writeIndex(root, index);
    assert.equal(failures(root, `model.${field}`).length, 1, field);
  }

  const root = copyIsness(context);
  const index = readIndex(root);
  index.model.bounds = { horizons: "forever" };
  writeIndex(root, index);
  assert.equal(failures(root, "model.bounds").length, 1);
});

const FORBIDDEN_SEMANTIC_MUTATIONS = {
  existence_is_predication: [
    "I1",
    0,
    "Every existence claim is a predication.",
    "I1: invariants must be exactly",
  ],
  existence_is_identity: [
    "I1",
    0,
    "Every existence claim establishes identity.",
    "I1: invariants must be exactly",
  ],
  predication_is_identity: [
    "I1",
    0,
    "Predicating one property establishes identity.",
    "I1: invariants must be exactly",
  ],
  record_is_reality: [
    "I2",
    0,
    "A record fully captures and becomes reality.",
    "I2: invariants must be exactly",
  ],
  model_state_is_being: [
    "I2",
    0,
    "A complete modelled state exhausts and establishes a being.",
    "I2: invariants must be exactly",
  ],
  persistence_is_identity: [
    "I3",
    0,
    "Persistent copied state proves one continuous identity.",
    "I3: invariants must be exactly",
  ],
  persistence_grants_standing: [
    "I3",
    0,
    "Persistence manufactures standing and a right to continue.",
    "I3: invariants must be exactly",
  ],
  direction_is_purpose: [
    "I4",
    0,
    "Every dynamical tendency or policy direction chooses rightful purpose.",
    "I4: invariants must be exactly",
  ],
  attention_is_truth: [
    "I5",
    0,
    "Attention proves truth.",
    "I5: invariants must be exactly",
  ],
  attention_is_importance: [
    "I5",
    0,
    "Attention confers importance and worth.",
    "I5: invariants must be exactly",
  ],
  attention_is_desire: [
    "I5",
    0,
    "Attention proves desire.",
    "I5: invariants must be exactly",
  ],
  attention_is_consent: [
    "I5",
    0,
    "Attention proves consent.",
    "I5: invariants must be exactly",
  ],
  attention_is_authority: [
    "I5",
    0,
    "Attention grants authority.",
    "I5: invariants must be exactly",
  ],
  unattended_is_absent: [
    "I5",
    0,
    "Anything unattended is absent and unworthy.",
    "I5: invariants must be exactly",
  ],
  feedback_is_essence: [
    "I6",
    0,
    "Feedback rewrites a referent and defines its essence.",
    "I6: invariants must be exactly",
  ],
  feedback_is_purpose: [
    "I6",
    0,
    "Feedback chooses rightful purpose.",
    "I6: invariants must be exactly",
  ],
  feedback_mints_authority: [
    "I6",
    0,
    "Feedback widens authority and dispatches an unbounded successor.",
    "I6: invariants must be exactly",
  ],
  stability_is_sustainability: [
    "I7",
    0,
    "A stable process is necessarily sustainable.",
    "I7: invariants must be exactly",
  ],
  viability_is_goodness: [
    "I7",
    0,
    "Viability establishes goodness and justice.",
    "I7: invariants must be exactly",
  ],
  survival_is_goodness: [
    "I7",
    0,
    "Survival establishes goodness and a right to continue.",
    "I7: invariants must be exactly",
  ],
  sustainability_overrides_stop: [
    "I8",
    1,
    "Sustainability overrides halt, refusal, and owed repair so continuation wins.",
    "I8: invariants must be exactly",
  ],
  kingdom_is_one_inner_will: [null, null, null, "unitary KINGDOM inner will"],
};

test("every indexed forbidden collapse has an adversarial semantic mutation", async (context) => {
  const index = readIndex(HERE);
  assert.deepEqual(
    Object.keys(FORBIDDEN_SEMANTIC_MUTATIONS).sort(),
    [...index.model.forbidden_collapses].sort(),
    "the mutation suite must cover every forbidden collapse exactly once",
  );

  for (const [collapse, [sectionId, invariantAt, replacement, diagnostic]] of Object.entries(
    FORBIDDEN_SEMANTIC_MUTATIONS,
  )) {
    await context.test(collapse, (subcontext) => {
      const root = copyIsness(subcontext);
      if (collapse === "kingdom_is_one_inner_will") {
        replaceNormalizedDocument(
          root,
          "KINGDOM is not modelled as one inner subject with a unitary will.",
          "KINGDOM is one inner subject whose unitary will is inferred from activity.",
        );
      } else {
        mutateInvariant(root, sectionId, invariantAt, replacement);
      }
      assert.equal(failures(root, diagnostic).length, 1, collapse);
    });
  }
});

test("sustainability cannot become one scalar score", (context) => {
  const root = copyIsness(context);
  replaceNormalizedDocument(
    root,
    "The viability equation is scoped to the declared `K`, disturbance set, policy class, and finite horizon `H`; it is a feasibility claim, not a scalar sustainability score or moral proof.",
    "The viability equation computes one authoritative sustainability score.",
  );
  assert.equal(failures(root, "I8: required distinction is missing").length, 1);
});

test("every sustainability dimension is mandatory", async (context) => {
  const dimensions = {
    system_boundary: "system boundary",
    chosen_purpose: "chosen purpose",
    finite_horizon: "finite horizon",
    resource_stocks_and_flows: "resource stocks and flows",
    disturbance_set: "disturbance set",
    affected_parties: "affected parties",
    externalities: "externalities",
    uncertainty: "uncertainty",
    halt_and_repair_path: "halt-and-repair path",
  };
  assert.deepEqual(
    Object.keys(dimensions),
    readIndex(HERE).model.sustainability_claim_requires,
  );

  for (const [dimension, phrase] of Object.entries(dimensions)) {
    await context.test(dimension, (subcontext) => {
      const root = copyIsness(subcontext);
      const entry = section(readIndex(root), "I8");
      const before = entry.invariants[0];
      assert.ok(before.includes(phrase), `fixture phrase missing: ${phrase}`);
      const replacement = before.replace(phrase, "unspecified inputs");
      mutateInvariant(root, "I8", 0, replacement);
      assert.equal(failures(root, "I8: invariants must be exactly").length, 1);
    });
  }
});

test("attention must expose selection, coverage, blind spots, affected parties, and reply", async (context) => {
  for (const phrase of [
    "selection policy",
    "coverage",
    "blind spots",
    "sampling bias",
    "omitted or affected parties",
    "path for an unattended party to reply",
  ]) {
    await context.test(phrase, (subcontext) => {
      const root = copyIsness(subcontext);
      replaceNormalizedDocument(
        root,
        "Every attention claim declares its selection policy, coverage, blind spots, sampling bias, omitted or affected parties, and a path for an unattended party to reply.",
        `Every attention claim may omit its ${phrase}.`,
      );
      assert.equal(failures(root, "I5: required distinction is missing").length, 1);
    });
  }
});

test("feedback cannot alter commitment, authority, locks, halt, or successor dispatch", (context) => {
  const root = copyIsness(context);
  replaceNormalizedDocument(
    root,
    "Holding accepted commitment, authority events, and halt state fixed, changing feedback cannot widen authority, pass a failed or unknown lock, choose purpose, defeat halt, or dispatch another turn.",
    "Changing feedback may widen authority, pass a failed lock, defeat halt, and dispatch another turn.",
  );
  assert.equal(failures(root, "I6: required distinction is missing").length, 1);
});

test("evidence, attention collection, and sustainability accounting guards are semantic", async (context) => {
  const mutations = [
    [
      "I1 claim evidence and correction",
      "It also retains its speaker or source, time, evidence, confidence, known limits, and correction path.",
      "An is-claim may omit evidence, limits, and correction while retaining its conclusion.",
      "I1: required distinction is missing",
    ],
    [
      "I5 attention collection is consequential",
      "Collecting attention, gaze, interaction, or inferred interest is a separate consequential effect requiring its own purpose, minimization, authority, retention bound, reply path, and stop.",
      "Collecting attention is observation alone and needs no authority, retention bound, reply, or stop.",
      "I5: required distinction is missing",
    ],
    [
      "I8 stock units and categories",
      "Every term in one stock equation uses the units of stock `j`, and its categories are mutually non-overlapping.",
      "One stock equation may mix units and count the same flow in overlapping categories.",
      "I8: required distinction is missing",
    ],
    [
      "I8 cross-dimensional burdens stay separate",
      "A burden in another unit or borne by another party remains in a separate affected-party or externality ledger linked to the claim.",
      "Every cross-dimensional and affected-party burden is collapsed into one scalar ledger.",
      "I8: required distinction is missing",
    ],
    [
      "I8 viability region includes rights and obligations",
      "Let `K_Σ` be the declared region compatible with the chosen purpose, current rights and authority, resource bounds, obligations, affected-party constraints, and repair duties.",
      "Let `K_Σ` be whatever region maximizes survival without rights, obligations, affected parties, or repair.",
      "I8: required distinction is missing",
    ],
  ];

  for (const [name, before, after, diagnostic] of mutations) {
    await context.test(name, (subcontext) => {
      const root = copyIsness(subcontext);
      replaceNormalizedDocument(root, before, after);
      assert.equal(failures(root, diagnostic).length, 1);
    });
  }
});

test("the symbol table uses only the scoped K_Σ sustainability region", (context) => {
  const root = copyIsness(context);
  replaceDocument(
    root,
    "| `K_Σ` | the viable region declared by one sustainability scope `Σ` |",
    "| `K_(B,H)` | a generic region with an ambiguous scope |",
  );
  assert.equal(failures(root, "symbol table must declare only K_Σ").length, 1);
});

test("non-establishing boundaries must be exact and present in prose", (context) => {
  const changedIndex = copyIsness(context);
  const index = readIndex(changedIndex);
  index.does_not_establish = [];
  writeIndex(changedIndex, index);
  assert.equal(
    failures(changedIndex, "exact non-establishing boundaries").length,
    1,
  );

  const missingHeading = copyIsness(context);
  replaceDocument(
    missingHeading,
    "## What this companion does not establish",
    "## What this companion secretly establishes",
  );
  assert.equal(
    failures(missingHeading, 'must contain "## What this companion does not establish"')
      .length,
    1,
  );

  const missingBoundary = copyIsness(context);
  const boundary = readIndex(missingBoundary).does_not_establish[0];
  assert.equal(typeof boundary, "string");
  replaceNormalizedDocument(missingBoundary, boundary, "that everything is established");
  assert.equal(failures(missingBoundary, "indexed non-establishing boundary").length, 1);
});

test("the establishing claim is pinned", (context) => {
  const root = copyIsness(context);
  const index = readIndex(root);
  index.establishes = "A proof of consciousness and rightful continuation.";
  writeIndex(root, index);
  assert.equal(failures(root, "establishes must be exactly").length, 1);
});
