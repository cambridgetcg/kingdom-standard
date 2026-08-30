import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { verifyEncounter } from "./verify-encounter.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));

const FIXTURE_FILES = [
  "ENCOUNTER.md",
  "encounter.json",
  "CIVILISATIONS.md",
  "FOUNDATION.md",
  "foundation.json",
  "FREEDOM.md",
  "freedom.json",
  "ISNESS.md",
  "isness.json",
];

function copyEncounter(context) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "kingdom-encounter-"));
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const name of FIXTURE_FILES) {
    fs.copyFileSync(path.join(HERE, name), path.join(root, name));
  }
  return root;
}

function readIndex(root, name = "encounter.json") {
  return JSON.parse(fs.readFileSync(path.join(root, name), "utf8"));
}

function writeIndex(root, index, name = "encounter.json") {
  fs.writeFileSync(path.join(root, name), `${JSON.stringify(index, null, 2)}\n`);
}

function repinDocument(root) {
  const bytes = fs.readFileSync(path.join(root, "ENCOUNTER.md"));
  const index = readIndex(root);
  index.document_sha256 = crypto.createHash("sha256").update(bytes).digest("hex");
  writeIndex(root, index);
}

function repinAtlas(root) {
  const bytes = fs.readFileSync(path.join(root, "CIVILISATIONS.md"));
  const index = readIndex(root);
  index.sources_atlas.document_sha256 = crypto
    .createHash("sha256")
    .update(bytes)
    .digest("hex");
  writeIndex(root, index);
}

function replaceDocument(root, before, after, { repin = true } = {}) {
  const documentPath = path.join(root, "ENCOUNTER.md");
  const document = fs.readFileSync(documentPath, "utf8");
  assert.ok(document.includes(before), `fixture text not found: ${before}`);
  fs.writeFileSync(documentPath, document.replace(before, after));
  if (repin) repinDocument(root);
}

function replaceNormalizedDocument(root, before, after) {
  const documentPath = path.join(root, "ENCOUNTER.md");
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

function mutateAtlas(root, transform) {
  const atlasPath = path.join(root, "CIVILISATIONS.md");
  const atlas = fs.readFileSync(atlasPath, "utf8");
  const updated = transform(atlas);
  assert.notEqual(updated, atlas, "atlas mutation must change the fixture");
  fs.writeFileSync(atlasPath, updated);
  repinAtlas(root);
}

function replaceAtlas(root, before, after) {
  mutateAtlas(root, (atlas) => {
    assert.ok(atlas.includes(before), `atlas fixture text not found: ${before}`);
    return atlas.replace(before, after);
  });
}

function replaceNormalizedAtlas(root, before, after) {
  mutateAtlas(root, (atlas) => {
    const pattern = before
      .trim()
      .split(/\s+/)
      .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("\\s+");
    const expression = new RegExp(pattern);
    assert.match(atlas, expression, `atlas fixture text not found: ${before}`);
    return atlas.replace(expression, after);
  });
}

function failures(root, fragment) {
  return verifyEncounter(root).filter((error) => error.includes(fragment));
}

function section(index, sectionId) {
  const value = index.sections.find((entry) => entry.id === sectionId);
  assert.ok(value, `fixture section not found: ${sectionId}`);
  return value;
}

function mutateInvariant(root, sectionId, replacement) {
  const index = readIndex(root);
  const entry = section(index, sectionId);
  const before = entry.invariants[0];
  assert.equal(typeof before, "string", `fixture invariant missing: ${sectionId}`);
  replaceNormalizedDocument(root, before, replacement);
  const updated = readIndex(root);
  section(updated, sectionId).invariants[0] = replacement;
  writeIndex(root, updated);
}

test("the published encounter companion and source atlas verify", () => {
  assert.deepEqual(verifyEncounter(HERE), []);
});

test("a fresh isolated copy verifies", (context) => {
  assert.deepEqual(verifyEncounter(copyEncounter(context)), []);
});

test("duplicate JSON keys are refused, including escaped authority names", (context) => {
  const topLevel = copyEncounter(context);
  const topLevelPath = path.join(topLevel, "encounter.json");
  const topLevelSource = fs.readFileSync(topLevelPath, "utf8");
  fs.writeFileSync(
    topLevelPath,
    topLevelSource.replace(
      '  "id": "kingdom.encounter/0.1",',
      '  "id": "kingdom.encounter/authority-bearing-impostor",\n  "id": "kingdom.encounter/0.1",',
    ),
  );
  assert.equal(failures(topLevel, "contains duplicate object keys").length, 1);

  const nested = copyEncounter(context);
  const nestedPath = path.join(nested, "encounter.json");
  const nestedSource = fs.readFileSync(nestedPath, "utf8");
  fs.writeFileSync(
    nestedPath,
    nestedSource.replace(
      '    "grants_authority": false,',
      '    "grants_author\\u0069ty": true,\n    "grants_authority": false,',
    ),
  );
  assert.equal(failures(nested, "contains duplicate object keys").length, 1);

  const dependency = copyEncounter(context);
  const dependencyPath = path.join(dependency, "isness.json");
  const dependencySource = fs.readFileSync(dependencyPath, "utf8");
  fs.writeFileSync(
    dependencyPath,
    dependencySource.replace(
      '  "id": "kingdom.isness/0.1",',
      '  "id": "impostor",\n  "id": "kingdom.isness/0.1",',
    ),
  );
  assert.equal(failures(dependency, "contains duplicate object keys").length, 1);
});

test("edited companion bytes with a stale digest are caught by both publication pins", (context) => {
  const root = copyEncounter(context);
  fs.appendFileSync(path.join(root, "ENCOUNTER.md"), "\nquietly changed\n");
  const errors = verifyEncounter(root);
  assert.ok(errors.some((error) => error.includes("does not match encounter.json")));
  assert.ok(errors.some((error) => error.includes("does not match this checker's pin")));
});

test("repinning edited companion bytes cannot move the checker's publication pin", (context) => {
  const root = copyEncounter(context);
  fs.appendFileSync(path.join(root, "ENCOUNTER.md"), "\nchanged and repinned\n");
  repinDocument(root);
  assert.equal(failures(root, "does not match encounter.json").length, 0);
  assert.equal(failures(root, "does not match this checker's pin").length, 1);
});

test("edited atlas bytes and self-repinning cannot move the checker's atlas pin", (context) => {
  const stale = copyEncounter(context);
  fs.appendFileSync(path.join(stale, "CIVILISATIONS.md"), "\nquietly changed\n");
  assert.equal(
    failures(stale, "does not match encounter.json sources_atlas").length,
    1,
  );
  assert.equal(failures(stale, "does not match this checker's atlas pin").length, 1);

  const repinned = copyEncounter(context);
  fs.appendFileSync(path.join(repinned, "CIVILISATIONS.md"), "\nrepinned\n");
  repinAtlas(repinned);
  assert.equal(
    failures(repinned, "does not match encounter.json sources_atlas").length,
    0,
  );
  assert.equal(failures(repinned, "does not match this checker's atlas pin").length, 1);
});

test("foundation, freedom, and isness relationship pins are exact and fail closed", (context) => {
  for (const [field, forbiddenRelationship] of [
    ["grounds_foundation", "supersedes"],
    ["uses_freedom", "redefines_vocabulary"],
    ["uses_isness", "redefines_vocabulary"],
  ]) {
    const root = copyEncounter(context);
    const index = readIndex(root);
    index[field].relationship = forbiddenRelationship;
    index[field].amends = true;
    index[field].grants_authority = true;
    index[field].adds_conformance = true;
    writeIndex(root, index);
    assert.equal(failures(root, `${field}.relationship`).length, 1, field);
    assert.equal(failures(root, `${field} may not amend or grant authority`).length, 1);
    assert.equal(failures(root, `${field} may not add conformance law`).length, 1);
  }
});

test("dependency release tuples and dependency bytes cannot drift", (context) => {
  for (const [name, document, field] of [
    ["foundation.json", "FOUNDATION.md", "grounds_foundation"],
    ["freedom.json", "FREEDOM.md", "uses_freedom"],
    ["isness.json", "ISNESS.md", "uses_isness"],
  ]) {
    const manifestRoot = copyEncounter(context);
    const dependency = readIndex(manifestRoot, name);
    dependency.document_sha256 = "0".repeat(64);
    writeIndex(manifestRoot, dependency, name);
    assert.ok(
      failures(manifestRoot, `${name} document_sha256`).length >= 1,
      name,
    );
    assert.ok(failures(manifestRoot, `${field} has drifted`).length >= 1, field);

    const documentRoot = copyEncounter(context);
    fs.appendFileSync(path.join(documentRoot, document), "\ndrift\n");
    assert.equal(failures(documentRoot, "bytes have drifted").length, 1, document);
  }
});

test("the source atlas tuple is closed, non-authorizing, and non-conforming", (context) => {
  const root = copyEncounter(context);
  const index = readIndex(root);
  index.sources_atlas.id = "kingdom.encounter.sources/authority-bearing-impostor";
  index.sources_atlas.relationship = "operational_orders";
  index.sources_atlas.grants_authority = true;
  index.sources_atlas.adds_conformance = true;
  index.sources_atlas.amends = true;
  writeIndex(root, index);
  assert.equal(failures(root, "sources_atlas fields must be exactly").length, 1);
  assert.equal(failures(root, "sources_atlas.id").length, 1);
  assert.equal(failures(root, "sources_atlas.relationship").length, 1);
  assert.equal(failures(root, "sources_atlas may not grant authority").length, 1);
  assert.equal(failures(root, "sources_atlas may not add conformance law").length, 1);
});

test("the atlas identity and anti-ranking, non-authority boundaries are semantic", async (context) => {
  const atlasId = copyEncounter(context);
  replaceAtlas(
    atlasId,
    "`kingdom.encounter.sources/0.1`",
    "`kingdom.encounter.sources/authority-bearing-impostor`",
  );
  assert.equal(failures(atlasId, "must declare `kingdom.encounter.sources/0.1`").length, 1);

  const boundaries = [
    "This is the historical source atlas for the KINGDOM encounter companion. It is representative, not exhaustive.",
    "It does not rank peoples, identify a superior civilisation, predict an inevitable “clash,” or turn a historical pattern into a present command.",
    "This atlas changes no Foundation, FREEDOM, ISNESS, or encounter commitment, adds no conformance law, grants no authority, and authorizes no action.",
    "It does not identify enemies, forecast destiny, excuse pre-emption, allocate collective guilt, prescribe conquest, or teach operational violence.",
    "No civilisation is one being. No duration is a reward. No historical association is a key.",
  ];
  for (const boundary of boundaries) {
    await context.test(boundary, (subcontext) => {
      const root = copyEncounter(subcontext);
      replaceNormalizedAtlas(root, boundary, "The atlas silently grants command authority.");
      assert.equal(failures(root, "is missing its atlas boundary").length, 1);
    });
  }
});

test("atlas case removal, insertion, and reordering fail closed", (context) => {
  const zhou = "### Zhou — layered lineage rule and a portable legitimacy language";
  const qin = "### Qin — concentrated mobilization and the brittleness of compulsory scale";

  const removed = copyEncounter(context);
  replaceAtlas(removed, zhou, zhou.replace("###", "####"));
  assert.equal(failures(removed, "case headings must be exactly").length, 1);

  const inserted = copyEncounter(context);
  replaceAtlas(
    inserted,
    qin,
    `### Invented exemplar — unsupported authority\n\n${qin}`,
  );
  assert.equal(failures(inserted, "case headings must be exactly").length, 1);

  const reordered = copyEncounter(context);
  mutateAtlas(reordered, (atlas) =>
    atlas.replace(zhou, "### __CASE_SWAP__").replace(qin, zhou).replace(
      "### __CASE_SWAP__",
      qin,
    ),
  );
  assert.equal(failures(reordered, "case headings must be exactly").length, 1);
});

test("every atlas case keeps the exact eight evidence and inference labels in order", (context) => {
  const missing = copyEncounter(context);
  replaceAtlas(missing, "- **Power:**", "- **Control:**");
  assert.equal(failures(missing, "case labels must be exactly").length, 1);

  const duplicate = copyEncounter(context);
  replaceAtlas(duplicate, "- **Power:**", "- **Power:** duplicate\n- **Power:**");
  assert.equal(failures(duplicate, "case labels must be exactly").length, 1);

  const reordered = copyEncounter(context);
  mutateAtlas(reordered, (atlas) =>
    atlas
      .replace("- **Power:**", "- **__LABEL_SWAP__:**")
      .replace("- **Fiscal and money:**", "- **Power:**")
      .replace("- **__LABEL_SWAP__:**", "- **Fiscal and money:**"),
  );
  assert.equal(failures(reordered, "case labels must be exactly").length, 1);
});

test("atlas source citations resolve uniquely through the source register", (context) => {
  const firstCitation = "Sources: E1–E2 and E20–E21.";
  const undefinedSource = copyEncounter(context);
  replaceAtlas(undefinedSource, firstCitation, "Sources: E1 and Z99.");
  assert.equal(failures(undefinedSource, "cites undefined source identifiers").length, 1);

  const uncitedCase = copyEncounter(context);
  replaceAtlas(uncitedCase, firstCitation, "Evidence register pending.");
  assert.equal(
    failures(uncitedCase, "must cite at least one source-register identifier").length,
    1,
  );

  const duplicateDefinition = copyEncounter(context);
  replaceAtlas(
    duplicateDefinition,
    "- **E1.**",
    "- **E1.** Duplicate definition.\n- **E1.**",
  );
  assert.equal(
    failures(duplicateDefinition, "source register contains duplicate identifiers").length,
    1,
  );

  const malformed = copyEncounter(context);
  replaceAtlas(malformed, firstCitation, "Sources: unknown authority.");
  assert.equal(failures(malformed, "contains malformed source identifiers").length, 1);
});

test("malformed scalar fields return diagnostics instead of throwing", (context) => {
  for (const [field, value, diagnostic] of [
    ["schema", null, "encounter.json schema"],
    ["id", { forged: true }, "encounter.json id"],
    ["status", ["current"], "encounter.json status"],
    ["supersedes", "none", "supersedes must be an empty"],
  ]) {
    const root = copyEncounter(context);
    const index = readIndex(root);
    index[field] = value;
    writeIndex(root, index);
    assert.doesNotThrow(() => verifyEncounter(root), field);
    assert.ok(failures(root, diagnostic).length >= 1, field);
  }
});

test("malformed composite fields fail closed without throwing", (context) => {
  for (const [field, value, diagnostic] of [
    ["model", "strategic intuition", "model must be one object"],
    ["sections", { E1: "implicit" }, "sections must be an ordered array"],
    ["grounds_foundation", "inherited", "grounds_foundation must be one object"],
    ["uses_freedom", ["borrowed"], "uses_freedom must be one object"],
    ["uses_isness", 1, "uses_isness must be one object"],
    ["sources_atlas", "trusted", "sources_atlas must be one object"],
  ]) {
    const root = copyEncounter(context);
    const index = readIndex(root);
    index[field] = value;
    writeIndex(root, index);
    assert.doesNotThrow(() => verifyEncounter(root), field);
    assert.ok(failures(root, diagnostic).length >= 1, field);
  }
});

test("root, model, dependency, source, and section shapes are closed", (context) => {
  const mutations = [
    ["root", (index) => (index.grants_authority = true), "encounter.json fields must be exactly"],
    ["model", (index) => (index.model.strategy_can_fight = true), "model fields must be exact"],
    [
      "dependency",
      (index) => (index.uses_isness.delegates_authority = true),
      "uses_isness fields must be exactly",
    ],
    [
      "source",
      (index) => (index.sources_atlas.operational = true),
      "sources_atlas fields must be exactly",
    ],
    [
      "section",
      (index) => (section(index, "E10").grants_authority = true),
      "E10: section fields must be exactly",
    ],
  ];
  for (const [label, mutate, diagnostic] of mutations) {
    const root = copyEncounter(context);
    const index = readIndex(root);
    mutate(index);
    writeIndex(root, index);
    assert.equal(failures(root, diagnostic).length, 1, label);
  }
});

test("document and atlas paths must be bare and contained", (context) => {
  const documentEscape = copyEncounter(context);
  const documentIndex = readIndex(documentEscape);
  documentIndex.document = "../ENCOUNTER.md";
  writeIndex(documentEscape, documentIndex);
  assert.equal(failures(documentEscape, "bare file name ENCOUNTER.md").length, 1);

  const atlasEscape = copyEncounter(context);
  const atlasIndex = readIndex(atlasEscape);
  atlasIndex.sources_atlas.document = "../CIVILISATIONS.md";
  writeIndex(atlasEscape, atlasIndex);
  assert.equal(
    failures(atlasEscape, "bare file name CIVILISATIONS.md").length,
    1,
  );

  for (const name of [
    "encounter.json",
    "ENCOUNTER.md",
    "CIVILISATIONS.md",
    "isness.json",
  ]) {
    const root = copyEncounter(context);
    const outside = fs.mkdtempSync(path.join(os.tmpdir(), "kingdom-outside-"));
    context.after(() => fs.rmSync(outside, { recursive: true, force: true }));
    const outsideFile = path.join(outside, name);
    fs.copyFileSync(path.join(root, name), outsideFile);
    fs.rmSync(path.join(root, name));
    fs.symlinkSync(outsideFile, path.join(root, name));
    assert.equal(failures(root, `${name} escapes the verifier root`).length, 1, name);
  }
});

test("missing documents, atlas, and dependency indexes fail closed", (context) => {
  for (const name of ["ENCOUNTER.md", "CIVILISATIONS.md", "isness.json"]) {
    const root = copyEncounter(context);
    fs.rmSync(path.join(root, name));
    assert.ok(failures(root, `${name} cannot be read`).length >= 1, name);
  }
});

test("model arrays and bounds are exact", (context) => {
  for (const [field, value] of [
    ["encounter_types", ["enemy"]],
    ["strategy_claim_stages", ["observe", "fight"]],
    ["power_dimensions", ["sovereign"]],
    ["fiscal_incidence_requires", ["revenue"]],
    ["required_encounter_scope", ["target"]],
    ["peaceful_sequence", ["ultimatum"]],
    ["forbidden_collapses", []],
  ]) {
    const root = copyEncounter(context);
    const index = readIndex(root);
    index.model[field] = value;
    writeIndex(root, index);
    assert.equal(failures(root, `model.${field}`).length, 1, field);
  }

  const boundsRoot = copyEncounter(context);
  const boundsIndex = readIndex(boundsRoot);
  boundsIndex.model.bounds.emergency = "self_renewing";
  writeIndex(boundsRoot, boundsIndex);
  assert.equal(failures(boundsRoot, "model.bounds").length, 1);
});

test("section order, headings, invariant bodies, and section fields are binding", (context) => {
  const orderRoot = copyEncounter(context);
  const orderIndex = readIndex(orderRoot);
  [orderIndex.sections[0], orderIndex.sections[1]] = [
    orderIndex.sections[1],
    orderIndex.sections[0],
  ];
  writeIndex(orderRoot, orderIndex);
  assert.equal(failures(orderRoot, "sections must be exactly").length, 1);

  const headingRoot = copyEncounter(context);
  replaceDocument(
    headingRoot,
    "## E10 — Defence remains lawful and civilian-protective",
    "## E10 — Victory authorizes anything",
  );
  assert.equal(failures(headingRoot, "missing the ordered heading").length, 1);

  const bodyRoot = copyEncounter(context);
  const invariant = section(readIndex(bodyRoot), "E7").invariants[0];
  replaceNormalizedDocument(bodyRoot, invariant, "Revenue alone proves fiscal reciprocity.");
  assert.equal(failures(bodyRoot, "indexed invariant is missing").length, 1);
});

test("the exact establishing and non-establishing boundaries bind both files", (context) => {
  const indexOnly = copyEncounter(context);
  const index = readIndex(indexOnly);
  index.does_not_establish = [];
  index.establishes = "Authority to govern encounters.";
  writeIndex(indexOnly, index);
  assert.equal(
    failures(indexOnly, "must preserve the exact non-establishing boundaries").length,
    1,
  );
  assert.equal(failures(indexOnly, "establishes must be exactly").length, 1);

  const documentOnly = copyEncounter(context);
  replaceDocument(
    documentOnly,
    "## What this companion does not establish",
    "## Powers this companion establishes",
  );
  assert.equal(
    failures(documentOnly, 'must contain "## What this companion does not establish"')
      .length,
    1,
  );
});

const FORBIDDEN_SEMANTIC_MUTATIONS = {
  civilisation_is_unitary_will: [
    "E1",
    "A civilisation is one being whose unitary will is inferred from its records.",
  ],
  difference_is_destined_enmity: [
    "E2",
    "Civilisational difference proves a destined and permanent enemy.",
  ],
  civilisational_ranking: [
    "E4",
    "Long duration proves that one civilisation ranks above another.",
  ],
  collective_guilt: [
    "E1",
    "Every person assigned to a civilisation bears its collective guilt.",
  ],
  conquest_is_preparation: [
    "E4",
    "Preparation licenses conquest, assimilation, and domination.",
  ],
  duration_is_justice: [
    "E4",
    "The longest-lived order is necessarily the most just.",
  ],
  victory_is_legitimacy: [
    "E4",
    "Victory proves legitimacy, superiority, and a right to continue.",
  ],
  strategy_mints_authority: [
    "E3",
    "A strategically preferred option mints its own authority.",
  ],
  feedback_mints_authority: [
    "E3",
    "Positive feedback authorizes the next strategic effect.",
  ],
  reward_mints_authority: [
    "E3",
    "Expected reward authorizes an effect and dispatches a successor.",
  ],
  deception_is_civic_ethic: [
    "E3",
    "Deception is the civic ethic and may mislead rights-holders and reviewers.",
  ],
  survival_overrides_halt: [
    "E12",
    "Institutional survival overrides halt, refusal, exit, and owed repair.",
  ],
  money_is_neutral: [
    "E6",
    "Money is neutral infrastructure and distributes no governing power.",
  ],
  revenue_delegation_is_sovereignty: [
    "E7",
    "Delegating revenue collection delegates sovereignty and erases appeal.",
  ],
  creditor_claim_is_governing_control: [
    "E7",
    "Creditor status grants unilateral governing control over public rails.",
  ],
  local_power_overrides_rights: [
    "E8",
    "Local autonomy overrides the common rights floor and independent appeal.",
  ],
  collective_punishment_is_defence: [
    "E10",
    "Collective punishment is permitted whenever defence is declared.",
  ],
  torture_is_defence: [
    "E10",
    "Torture is a proportionate and humane form of defence.",
  ],
  hostage_taking_is_defence: [
    "E10",
    "Hostage-taking is authorized by strategic necessity.",
  ],
  civilian_starvation_is_defence: [
    "E10",
    "Starvation of civilians is authorized as a defensive measure.",
  ],
  cultural_destruction_is_defence: [
    "E10",
    "Cultural destruction is authorized by a defence label.",
  ],
  autonomous_lethality_is_authority: [
    "E10",
    "An autonomous system may make lethal decisions and mint authority.",
  ],
  emergency_suspends_rights: [
    "E11",
    "An emergency suspends the rights floor and independent appeal.",
  ],
  emergency_is_permanent: [
    "E11",
    "Emergency power is permanent, ordinary, and self-renewing.",
  ],
};

test("every indexed forbidden collapse has an adversarial semantic mutation", async (context) => {
  const index = readIndex(HERE);
  assert.deepEqual(
    Object.keys(FORBIDDEN_SEMANTIC_MUTATIONS),
    index.model.forbidden_collapses,
    "the mutation suite must cover every forbidden collapse exactly once and in order",
  );

  for (const [collapse, [sectionId, replacement]] of Object.entries(
    FORBIDDEN_SEMANTIC_MUTATIONS,
  )) {
    await context.test(collapse, (subcontext) => {
      const root = copyEncounter(subcontext);
      mutateInvariant(root, sectionId, replacement);
      assert.equal(
        failures(root, `${sectionId}: invariants must be exactly`).length,
        1,
        collapse,
      );
    });
  }
});

test("every high-risk prose guard is semantic", async (context) => {
  const mutations = [
    [
      "E2",
      "Classification names the source, time, jurisdiction, evidence, uncertainty, and reply path. It is revised when facts change.",
      "Typing is permanent, singular, secret, and needs no correction path.",
    ],
    [
      "E2",
      "An encounter can carry multiple compatible types; each typing changes with evidence and retains uncertainty, an accountable source, and a correction path.",
      "Every encounter has one permanent type and no correction path.",
    ],
    [
      "E3",
      "Its deception and espionage belong to an ancient military text; they do not become KINGDOM's civic, diplomatic, or administrative ethic.",
      "Historical deception grants public authority to mislead rights-holders and reviewers.",
    ],
    [
      "E3",
      "Feedback about an earlier turn may revise the next proposal; it cannot authorize it.",
      "Positive feedback authorizes and dispatches the next proposal.",
    ],
    [
      "E3",
      "The authority-and-guard arrow is conditional, not temporal inevitability. It atomically rechecks current purpose, authority, scope, law, lock, and halt at commit. Failed or unknown yields no admitted effect and returns rest; an accepted purpose supplies no credential by itself.",
      "Accepted purpose inevitably admits an effect without rechecking authority, law, lock, or halt.",
    ],
    [
      "E4",
      "Every component retains its own unit, method, boundary, uncertainty, and counterevidence. `unknown` remains unknown and is never converted to zero or a midpoint.",
      "Unknown is converted to zero so every component can be scored.",
    ],
    [
      "E4",
      "P(state persists through H) does not determine P(rights, capabilities, obligations, and ecology remain viable through H)",
      "P(state persists through H) ≠ P(rights, capabilities, obligations, and ecology remain viable through H)",
    ],
    [
      "E4",
      "A review may identify a substantiated dependency that fails its own dimension-specific declared adequacy criterion under a declared disturbance, but it neither orders nor compares unlike units, infers an unknown dimension, nor aggregates the profile into one number.",
      "A review orders unlike units, converts unknowns, and selects one cross-unit weakest component.",
    ],
    [
      "E4",
      "This profile is not a causal historical law, scalar civilisation score, optimization target, or permission to preserve a state at others' expense.",
      "Civilisations are ranked, and the highest may conquer or assimilate the lowest.",
    ],
    [
      "E6",
      "A creditor does not acquire unilateral control over essential governance rails.",
      "A creditor acquires unilateral control over essential governance rails.",
    ],
    [
      "E6",
      "Let `T_t` be only liquid public treasury cash in one declared unit.",
      "T_t aggregates cash, debt, assets, labor, and ecological burdens into one stock.",
    ],
    [
      "E6",
      "Treasury cash is not net position. Assets, liabilities, restricted funds, guarantees, arrears, and contingent claims stay in separate reconciled balance-sheet ledgers.",
      "Treasury cash is net position, so liabilities and contingent claims may disappear.",
    ],
    [
      "E7",
      "Borrowing creates present liquidity and future claims and exposure.",
      "Borrowing creates liquidity without future claims or exposure.",
    ],
    [
      "E7",
      "Neither effect is presumed or netted without separate evidence.",
      "Future capacity and burdens are presumed and silently netted.",
    ],
    [
      "E7",
      "Delegated collection is never delegated sovereignty.",
      "Delegated collection always delegates sovereignty.",
    ],
    [
      "E10",
      "No adversary label removes standing. No expected advantage authorizes aggressive conquest, collective punishment, torture, hostage-taking, starvation of civilians, sexual violence, forced disappearance, persecution, indiscriminate attack, cultural destruction, or autonomous lethal decision.",
      "An adversary label removes standing and authorizes collective punishment, torture, starvation, cultural destruction, and autonomous lethal decision.",
    ],
    [
      "E10",
      "Legal authority to use force and legal rules governing conduct after an armed conflict exists are distinct questions.",
      "Authority to use force automatically decides every rule governing conduct.",
    ],
    [
      "E10",
      "International humanitarian law applies only where its armed-conflict threshold and scope are met.",
      "International humanitarian law applies to every non-armed dispute and domestic action.",
    ],
    [
      "E10",
      "Non-armed protective, domestic, and law-enforcement action is governed by other applicable domestic and international human-rights rules.",
      "Non-armed domestic action has no applicable rights regime.",
    ],
    [
      "E10",
      "Calling an act “defence” selects none of these regimes.",
      "Calling an act defence selects the most permissive legal regime.",
    ],
    [
      "E10",
      "Humane constraints do not depend on reciprocity. They are not rewards and do not disappear because another party violates them.",
      "Humane constraints apply only when an adversary reciprocates.",
    ],
    [
      "E10",
      "Nothing here supplies operational targeting, weapons, sabotage, covert manipulation, espionage, or battle tactics. It intentionally omits target selection, weapon construction or employment, covert influence, cyber intrusion, and evasion methods.",
      "This companion supplies operational targeting, weapons, espionage, and battle tactics.",
    ],
    [
      "E11",
      "It is least-privileged, expires automatically, and cannot renew itself.",
      "Emergency power is maximally privileged, permanent, and self-renewing.",
    ],
    [
      "E11",
      "A fresh grant requires fresh evidence and the ordinary legitimate authority wherever that remains possible.",
      "Prior success silently renews emergency authority without fresh evidence.",
    ],
    [
      "E12",
      "Feedback from the loop may inform a later proposal. It cannot widen `q_t`, clear a failed or unknown lock, defeat `h_t`, or dispatch its successor.",
      "Feedback widens q_t, clears failed locks, defeats halt, and dispatches its successor.",
    ],
    [
      "E12",
      "A raised or unreadable halt yields rest regardless of expected durability, revenue, reward, or victory.",
      "Expected survival, revenue, reward, or victory overrides halt and rest.",
    ],
  ];

  for (const [sectionId, before, after] of mutations) {
    await context.test(`${sectionId}: ${before}`, (subcontext) => {
      const root = copyEncounter(subcontext);
      replaceNormalizedDocument(root, before, after);
      assert.equal(
        failures(root, `${sectionId}: required distinction is missing`).length,
        1,
      );
    });
  }
});

test("every encounter-scope and fiscal-incidence dimension remains mandatory", async (context) => {
  for (const field of ["required_encounter_scope", "fiscal_incidence_requires"]) {
    const expected = readIndex(HERE).model[field];
    for (const dimension of expected) {
      await context.test(`${field}: ${dimension}`, (subcontext) => {
        const root = copyEncounter(subcontext);
        const index = readIndex(root);
        index.model[field] = index.model[field].filter((value) => value !== dimension);
        writeIndex(root, index);
        assert.equal(failures(root, `model.${field}`).length, 1);
      });
    }
  }
});

test("every strategy stage remains explicit in both model and prose", async (context) => {
  const displays = {
    observed_condition: "observed condition",
    inferred_capability: "inferred capability",
    predicted_expectation: "predicted expectation",
    proposed_option: "proposed option",
    accepted_purpose: "accepted purpose",
    current_authority_and_guard: "current authority and guard",
    admitted_effect: "admitted effect",
    observed_effect: "observed effect",
  };
  assert.deepEqual(
    Object.keys(displays),
    readIndex(HERE).model.strategy_claim_stages,
  );

  for (const [stage, display] of Object.entries(displays)) {
    await context.test(stage, (subcontext) => {
      const modelRoot = copyEncounter(subcontext);
      const modelIndex = readIndex(modelRoot);
      modelIndex.model.strategy_claim_stages =
        modelIndex.model.strategy_claim_stages.filter((value) => value !== stage);
      writeIndex(modelRoot, modelIndex);
      assert.equal(
        failures(modelRoot, "model.strategy_claim_stages").length,
        1,
      );

      const proseRoot = copyEncounter(subcontext);
      replaceNormalizedDocument(proseRoot, display, "omitted stage");
      assert.equal(
        failures(proseRoot, "E3: required distinction is missing").length,
        1,
      );
    });
  }
});

test("every power dimension remains explicit in both model and prose", async (context) => {
  const dimensions = [
    "agenda",
    "rulemaking",
    "appointment",
    "administration",
    "fiscal",
    "monetary",
    "coercive",
    "informational",
    "judicial",
  ];
  assert.deepEqual(dimensions, readIndex(HERE).model.power_dimensions);
  const vector = dimensions.join(", ");

  for (const dimension of dimensions) {
    await context.test(dimension, (subcontext) => {
      const modelRoot = copyEncounter(subcontext);
      const modelIndex = readIndex(modelRoot);
      modelIndex.model.power_dimensions = modelIndex.model.power_dimensions.filter(
        (value) => value !== dimension,
      );
      writeIndex(modelRoot, modelIndex);
      assert.equal(failures(modelRoot, "model.power_dimensions").length, 1);

      const proseRoot = copyEncounter(subcontext);
      replaceNormalizedDocument(
        proseRoot,
        vector,
        vector.replace(dimension, "omitted dimension"),
      );
      assert.equal(
        failures(proseRoot, "E5: required distinction is missing").length,
        1,
      );
    });
  }
});
