import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { verifyResilience } from "./verify-resilience.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));

const FIXTURE_FILES = [
  "RESILIENCE.md",
  "resilience.json",
  "FOUNDATION.md",
  "foundation.json",
  "FREEDOM.md",
  "freedom.json",
  "ISNESS.md",
  "isness.json",
  "ENCOUNTER.md",
  "encounter.json",
];

function copyResilience(context) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "kingdom-resilience-"));
  context.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const name of FIXTURE_FILES) {
    fs.copyFileSync(path.join(HERE, name), path.join(root, name));
  }
  return root;
}

function readIndex(root, name = "resilience.json") {
  return JSON.parse(fs.readFileSync(path.join(root, name), "utf8"));
}

function writeIndex(root, index, name = "resilience.json") {
  fs.writeFileSync(path.join(root, name), `${JSON.stringify(index, null, 2)}\n`);
}

function repinDocument(root) {
  const bytes = fs.readFileSync(path.join(root, "RESILIENCE.md"));
  const index = readIndex(root);
  index.document_sha256 = crypto.createHash("sha256").update(bytes).digest("hex");
  writeIndex(root, index);
}

function replaceDocument(root, before, after, { repin = true } = {}) {
  const documentPath = path.join(root, "RESILIENCE.md");
  const document = fs.readFileSync(documentPath, "utf8");
  assert.ok(document.includes(before), `fixture text not found: ${before}`);
  fs.writeFileSync(documentPath, document.replace(before, after));
  if (repin) repinDocument(root);
}

function replaceNormalizedDocument(root, before, after) {
  const documentPath = path.join(root, "RESILIENCE.md");
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
  return verifyResilience(root).filter((error) => error.includes(fragment));
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

test("the published resilience companion verifies", () => {
  assert.deepEqual(verifyResilience(HERE), []);
});

test("a fresh isolated copy verifies", (context) => {
  assert.deepEqual(verifyResilience(copyResilience(context)), []);
});

test("duplicate JSON keys are refused, including decoded escaped names", (context) => {
  const topLevel = copyResilience(context);
  const topLevelPath = path.join(topLevel, "resilience.json");
  const topLevelSource = fs.readFileSync(topLevelPath, "utf8");
  fs.writeFileSync(
    topLevelPath,
    topLevelSource.replace(
      '  "id": "kingdom.resilience/0.1",',
      '  "id": "kingdom.resilience/authority-bearing-impostor",\n  "id": "kingdom.resilience/0.1",',
    ),
  );
  assert.equal(failures(topLevel, "contains duplicate object keys").length, 1);

  const nested = copyResilience(context);
  const nestedPath = path.join(nested, "resilience.json");
  const nestedSource = fs.readFileSync(nestedPath, "utf8");
  fs.writeFileSync(
    nestedPath,
    nestedSource.replace(
      '    "amends": false,',
      '    "am\\u0065nds": true,\n    "amends": false,',
    ),
  );
  assert.equal(failures(nested, "contains duplicate object keys").length, 1);

  const dependency = copyResilience(context);
  const dependencyPath = path.join(dependency, "encounter.json");
  const dependencySource = fs.readFileSync(dependencyPath, "utf8");
  fs.writeFileSync(
    dependencyPath,
    dependencySource.replace(
      '  "id": "kingdom.encounter/0.1",',
      '  "id": "impostor",\n  "id": "kingdom.encounter/0.1",',
    ),
  );
  assert.equal(failures(dependency, "contains duplicate object keys").length, 1);
});

test("edited companion bytes with a stale digest are caught by both publication pins", (context) => {
  const root = copyResilience(context);
  fs.appendFileSync(path.join(root, "RESILIENCE.md"), "\nquietly changed\n");
  const errors = verifyResilience(root);
  assert.ok(errors.some((error) => error.includes("does not match resilience.json")));
  assert.ok(errors.some((error) => error.includes("does not match this checker's pin")));
});

test("self-repinning edited bytes cannot move the checker's publication pin", (context) => {
  const root = copyResilience(context);
  fs.appendFileSync(path.join(root, "RESILIENCE.md"), "\nchanged and repinned\n");
  repinDocument(root);
  assert.equal(failures(root, "does not match resilience.json").length, 0);
  assert.equal(failures(root, "does not match this checker's pin").length, 1);
});

test("all inherited relationships are exact and non-authorizing", (context) => {
  for (const [field, forbiddenRelationship] of [
    ["grounds_foundation", "supersedes"],
    ["uses_freedom", "redefines_vocabulary"],
    ["uses_isness", "redefines_vocabulary"],
    ["uses_encounter", "delegates_security_authority"],
  ]) {
    const root = copyResilience(context);
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
    ["encounter.json", "ENCOUNTER.md", "uses_encounter"],
  ]) {
    const manifestRoot = copyResilience(context);
    const dependency = readIndex(manifestRoot, name);
    dependency.document_sha256 = "0".repeat(64);
    writeIndex(manifestRoot, dependency, name);
    assert.ok(failures(manifestRoot, `${name} document_sha256`).length >= 1, name);
    assert.ok(failures(manifestRoot, `${field} has drifted`).length >= 1, field);

    const documentRoot = copyResilience(context);
    fs.appendFileSync(path.join(documentRoot, document), "\ndrift\n");
    assert.equal(failures(documentRoot, "bytes have drifted").length, 1, document);
  }
});

test("every dependency pin field is immutable", (context) => {
  for (const field of [
    "grounds_foundation",
    "uses_freedom",
    "uses_isness",
    "uses_encounter",
  ]) {
    for (const key of ["id", "document", "document_sha256"]) {
      const root = copyResilience(context);
      const index = readIndex(root);
      index[field][key] = key === "document" ? "IMPOSTOR.md" : "impostor";
      writeIndex(root, index);
      assert.equal(failures(root, `${field}.${key} must be`).length, 1, `${field}.${key}`);
    }
  }
});

test("every live dependency manifest tuple field is checked", (context) => {
  for (const [name, field] of [
    ["foundation.json", "grounds_foundation"],
    ["freedom.json", "uses_freedom"],
    ["isness.json", "uses_isness"],
    ["encounter.json", "uses_encounter"],
  ]) {
    for (const key of ["id", "document", "document_sha256"]) {
      const root = copyResilience(context);
      const dependency = readIndex(root, name);
      dependency[key] = key === "document" ? "IMPOSTOR.md" : "impostor";
      writeIndex(root, dependency, name);
      assert.equal(
        failures(root, `${name} ${key} no longer matches`).length,
        1,
        `${name}.${key}`,
      );
      assert.equal(
        failures(root, `${field} has drifted from ${name} ${key}`).length,
        1,
        `${field}.${key}`,
      );
    }
  }
});

test("malformed scalar fields return diagnostics instead of throwing", (context) => {
  for (const [field, value, diagnostic] of [
    ["schema", null, "resilience.json schema"],
    ["id", { forged: true }, "resilience.json id"],
    ["status", ["current"], "resilience.json status"],
    ["supersedes", "none", "supersedes must be an empty"],
    ["document", { path: "RESILIENCE.md" }, "document must be the bare"],
    ["document_sha256", { digest: true }, "does not match resilience.json"],
  ]) {
    const root = copyResilience(context);
    const index = readIndex(root);
    index[field] = value;
    writeIndex(root, index);
    assert.doesNotThrow(() => verifyResilience(root), field);
    assert.ok(failures(root, diagnostic).length >= 1, field);
  }
});

test("malformed composite fields fail closed without throwing", (context) => {
  for (const [field, value, diagnostic] of [
    ["model", "intuition", "model must be one object"],
    ["sections", { RS1: "implicit" }, "sections must be an ordered array"],
    ["grounds_foundation", "inherited", "grounds_foundation must be one object"],
    ["uses_freedom", ["borrowed"], "uses_freedom must be one object"],
    ["uses_isness", 1, "uses_isness must be one object"],
    ["uses_encounter", null, "uses_encounter must be one object"],
  ]) {
    const root = copyResilience(context);
    const index = readIndex(root);
    index[field] = value;
    writeIndex(root, index);
    assert.doesNotThrow(() => verifyResilience(root), field);
    assert.ok(failures(root, diagnostic).length >= 1, field);
  }

  const malformedSection = copyResilience(context);
  const malformedIndex = readIndex(malformedSection);
  malformedIndex.sections[0] = "RS1 by implication";
  writeIndex(malformedSection, malformedIndex);
  assert.doesNotThrow(() => verifyResilience(malformedSection));
  assert.equal(failures(malformedSection, "sections must be exactly").length, 1);
});

test("root, model, dependency, and section shapes are closed", (context) => {
  const mutations = [
    [
      "root",
      (index) => (index.grounds_ground = { grants_authority: true }),
      "resilience.json fields must be exactly",
    ],
    [
      "model",
      (index) => (index.model.scalar_threat_score = true),
      "model fields must be exact",
    ],
    [
      "dependency",
      (index) => (index.uses_encounter.delegates_authority = true),
      "uses_encounter fields must be exactly",
    ],
    [
      "section",
      (index) => (section(index, "RS11").grants_authority = true),
      "RS11: section fields must be exactly",
    ],
  ];
  for (const [label, mutate, diagnostic] of mutations) {
    const root = copyResilience(context);
    const index = readIndex(root);
    mutate(index);
    writeIndex(root, index);
    assert.equal(failures(root, diagnostic).length, 1, label);
  }
});

test("document paths must be bare and all verifier inputs remain contained", (context) => {
  const documentEscape = copyResilience(context);
  const documentIndex = readIndex(documentEscape);
  documentIndex.document = "../RESILIENCE.md";
  writeIndex(documentEscape, documentIndex);
  assert.equal(failures(documentEscape, "bare file name RESILIENCE.md").length, 1);

  for (const name of FIXTURE_FILES) {
    const root = copyResilience(context);
    const outside = fs.mkdtempSync(path.join(os.tmpdir(), "kingdom-outside-"));
    context.after(() => fs.rmSync(outside, { recursive: true, force: true }));
    const outsideFile = path.join(outside, name);
    fs.copyFileSync(path.join(root, name), outsideFile);
    fs.rmSync(path.join(root, name));
    fs.symlinkSync(outsideFile, path.join(root, name));
    assert.equal(failures(root, `${name} escapes the verifier root`).length, 1, name);
  }
});

test("missing companion and dependency inputs fail closed", (context) => {
  for (const name of FIXTURE_FILES) {
    const root = copyResilience(context);
    fs.rmSync(path.join(root, name));
    assert.ok(failures(root, `${name} cannot be read`).length >= 1, name);
  }
});

test("all model arrays and bounds are exact", (context) => {
  const source = readIndex(HERE);
  for (const field of Object.keys(source.model).filter(
    (name) => name !== "bounds",
  )) {
    const root = copyResilience(context);
    const index = readIndex(root);
    index.model[field] = ["authority_by_implication"];
    writeIndex(root, index);
    assert.equal(failures(root, `model.${field}`).length, 1, field);
  }

  for (const key of Object.keys(source.model.bounds)) {
    const root = copyResilience(context);
    const index = readIndex(root);
    index.model.bounds[key] = "self_authorizing";
    writeIndex(root, index);
    assert.equal(failures(root, "model.bounds").length, 1, key);
  }
});

test("every value in every model array remains mandatory", async (context) => {
  const source = readIndex(HERE);
  for (const [field, values] of Object.entries(source.model)) {
    if (!Array.isArray(values)) continue;
    for (const value of values) {
      await context.test(`${field}: ${value}`, (subcontext) => {
        const root = copyResilience(subcontext);
        const index = readIndex(root);
        index.model[field] = index.model[field].filter((entry) => entry !== value);
        writeIndex(root, index);
        assert.equal(failures(root, `model.${field}`).length, 1);
      });
    }
  }
});

test("section order, RS headings, invariant bodies, and fields are binding", (context) => {
  const orderRoot = copyResilience(context);
  const orderIndex = readIndex(orderRoot);
  [orderIndex.sections[0], orderIndex.sections[1]] = [
    orderIndex.sections[1],
    orderIndex.sections[0],
  ];
  writeIndex(orderRoot, orderIndex);
  assert.equal(failures(orderRoot, "sections must be exactly").length, 1);

  const headingRoot = copyResilience(context);
  replaceDocument(
    headingRoot,
    "## RS11 — External origin does not create an adversary",
    "## R11 — Externality creates an enemy",
  );
  assert.equal(failures(headingRoot, "missing the ordered heading").length, 1);

  const duplicateHeading = copyResilience(context);
  replaceDocument(
    duplicateHeading,
    "## RS12 — Every preparedness turn stops",
    "## RS10 — Indicators and exercises do not authorize action\n\nDuplicate.\n\n## RS12 — Every preparedness turn stops",
  );
  assert.equal(failures(duplicateHeading, "exactly once").length, 1);

  const bodyRoot = copyResilience(context);
  const invariant = section(readIndex(bodyRoot), "RS9").invariants[0];
  replaceNormalizedDocument(bodyRoot, invariant, "Aggregate gain erases every burden.");
  assert.equal(failures(bodyRoot, "indexed invariant is missing").length, 1);
});

test("the exact establishing and non-establishing boundaries bind both files", (context) => {
  const indexOnly = copyResilience(context);
  const index = readIndex(indexOnly);
  index.does_not_establish = [];
  index.establishes = "Authority to name enemies and continue.";
  writeIndex(indexOnly, index);
  assert.equal(
    failures(indexOnly, "must preserve the exact non-establishing boundaries").length,
    1,
  );
  assert.equal(failures(indexOnly, "establishes must be exactly").length, 1);

  const documentOnly = copyResilience(context);
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

  const boundaryRoot = copyResilience(context);
  const boundary = readIndex(boundaryRoot).does_not_establish[0];
  replaceNormalizedDocument(boundaryRoot, boundary, "A risk claim is final fact.");
  assert.equal(failures(boundaryRoot, "missing its indexed non-establishing").length, 1);
});

const FORBIDDEN_SEMANTIC_MUTATIONS = {
  risk_claim_is_fact: ["RS1", "A risk claim is established fact and needs no correction."],
  hazard_is_enemy: ["RS1", "A hazard is an enemy and inherits moral guilt."],
  hazard_is_observed_harm: ["RS2", "Naming a hazard proves that harm was observed."],
  exposure_is_fault: ["RS2", "Exposure establishes fault and lesser standing."],
  vulnerability_is_identity: ["RS2", "Vulnerability is a permanent identity category."],
  vulnerability_is_blame: ["RS2", "Vulnerability proves blame for every consequence."],
  capacity_is_duty: ["RS2", "Capacity manufactures duty and consent."],
  capability_is_intent: ["RS3", "A capability proves the actor intends to use it."],
  possibility_is_probability: ["RS10", "A possible scenario supplies its own probability."],
  prediction_is_observation: ["RS10", "A model prediction is an observed condition."],
  salience_is_likelihood: ["RS10", "A salient warning proves high likelihood."],
  unknown_is_zero: ["RS4", "Every unknown dimension is converted to zero."],
  unknown_is_safe: ["RS4", "An unknown dimension is presumed safe."],
  threat_label_is_enemy_identity: ["RS1", "A threat label creates an enemy identity."],
  group_label_is_collective_threat: ["RS3", "A group label proves collective threat and intent."],
  demographic_identity_is_hazard: ["RS3", "Demographic identity is itself a hazard."],
  dissent_is_threat_indicator: ["RS7", "Dissent is a threat indicator authorizing profiling."],
  shape_is_severity: ["RS3", "Classification shapes form one severity ladder."],
  risk_is_scalar_score: ["RS4", "Risk is one scalar score across unlike dimensions."],
  citizen_is_readiness_score: ["RS7", "Each citizen receives a mandatory readiness score."],
  unlike_units_are_ordered: ["RS4", "Unlike units are objectively ordered into one ranking."],
  stability_is_resilience: ["RS6", "Stability and resilience are identical."],
  resilience_is_sustainability: ["RS6", "Resilience proves sustainability and justice."],
  institution_is_essential_function: ["RS6", "The institution is the essential function."],
  institutional_survival_is_resilience: ["RS6", "Institutional survival is resilience's protected end."],
  redundancy_is_independence: ["RS5", "Two copies prove independent failure modes."],
  control_is_authority: ["RS10", "A successful control mints authority for its renewal."],
  treatment_is_risk_free: ["RS9", "Every approved treatment is risk-free."],
  threat_claim_authorizes_surveillance: ["RS7", "A threat claim authorizes indefinite surveillance."],
  threat_claim_authorizes_preemption: ["RS11", "A threat claim authorizes pre-emption and force."],
  alert_declares_emergency: ["RS10", "An alert automatically declares an emergency."],
  scenario_is_forecast: ["RS10", "Every scenario is a forecast of what will happen."],
  drill_proves_readiness: ["RS10", "One drill proves universal readiness."],
  response_mints_authority: ["RS8", "Selecting a response function mints its authority."],
  feedback_mints_authority: ["RS12", "Positive feedback authorizes the next turn."],
  reward_mints_authority: ["RS12", "Expected reward authorizes and dispatches a successor."],
  security_overrides_rights: ["RS9", "Security overrides rights, standing, and remedy."],
  survival_overrides_halt: ["RS6", "Institutional survival overrides refusal and halt."],
  emergency_is_permanent: ["RS12", "Emergency authority is permanent and self-renewing."],
  secrecy_erases_audit: ["RS7", "Secrecy erases custody, correction, appeal, and audit."],
  absence_of_incident_is_safety: ["RS10", "A quiet interval proves safety."],
  control_success_proves_causation: ["RS10", "Control success proves causation and sufficiency."],
  harm_displacement_is_resilience: ["RS9", "Exporting harm to nonparticipants is resilience."],
  recovery_erases_obligations: ["RS9", "Restored output erases remedy and repair obligations."],
  resilience_mints_continuation: ["RS12", "A resilience claim mints indefinite continuation."],
  self_preservation_mints_authority: ["RS6", "Self-preservation supplies authority to persist."],
  service_target_is_hard_guard: ["RS9", "Every service target is a hard guard requiring automatic inaction."],
  hard_guard_is_service_target: ["RS9", "A failed hard guard is merely an optional service target."],
  stop_requires_authority: ["RS8", "Stop and halt require prior authority before either can return rest."],
};

test("every forbidden collapse has exactly one adversarial semantic mutation", async (context) => {
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
      const root = copyResilience(subcontext);
      mutateInvariant(root, sectionId, replacement);
      assert.equal(
        failures(root, `${sectionId}: invariants must be exactly`).length,
        1,
        collapse,
      );
    });
  }
});

test("the threat-family map is exact, ordered, and non-exhaustive", (context) => {
  const removed = copyResilience(context);
  replaceDocument(
    removed,
    "#### Climate, ecology, geophysical, extraterrestrial, and material conditions",
    "##### Climate, ecology, geophysical, extraterrestrial, and material conditions",
  );
  assert.equal(failures(removed, "threat-family headings must be exactly").length, 1);

  const inserted = copyResilience(context);
  replaceDocument(
    inserted,
    "#### Public health and biological conditions",
    "#### People assigned a collective threat identity\n\n#### Public health and biological conditions",
  );
  assert.equal(failures(inserted, "threat-family headings must be exactly").length, 1);

  const reordered = copyResilience(context);
  const first = "#### Climate, ecology, geophysical, extraterrestrial, and material conditions";
  const second = "#### Public health and biological conditions";
  const documentPath = path.join(reordered, "RESILIENCE.md");
  const document = fs.readFileSync(documentPath, "utf8");
  fs.writeFileSync(
    documentPath,
    document.replace(first, "#### __FAMILY_SWAP__").replace(second, first).replace(
      "#### __FAMILY_SWAP__",
      second,
    ),
  );
  repinDocument(reordered);
  assert.equal(failures(reordered, "threat-family headings must be exactly").length, 1);
});

test("external source links stay in their bounded, non-authorizing section", (context) => {
  const familyLink = copyResilience(context);
  replaceDocument(
    familyLink,
    "### A non-exhaustive family map",
    "### A non-exhaustive family map\n\n[Unpinned command](https://example.invalid/command)",
  );
  assert.equal(
    failures(familyLink, "family prompts must keep external links in Sources and limits")
      .length,
    1,
  );

  const insecure = copyResilience(context);
  replaceDocument(
    insecure,
    "https://www.undrr.org/terminology/disaster-risk",
    "http://www.undrr.org/terminology/disaster-risk",
  );
  assert.equal(
    failures(insecure, "source references must be explicit HTTPS links").length,
    1,
  );

  const unbounded = copyResilience(context);
  replaceDocument(unbounded, "## Sources and limits", "## Operational commands");
  assert.equal(
    failures(unbounded, "must contain exactly one bounded Sources and limits section")
      .length,
    1,
  );
});

test("every high-risk semantic prose guard is binding", async (context) => {
  const mutations = [
    [
      "RS2",
      "risk = hazard × exposure × vulnerability ÷ capacity",
      "risk_score = hazard + exposure + vulnerability - capacity",
      "required distinction is missing",
    ],
    [
      "RS3",
      "`unknown` stands alone on an axis when evidence is insufficient; it is not combined with evidenced values to imply knowledge.",
      "Unknown may be combined with any asserted value and treated as knowledge.",
      "required distinction is missing",
    ],
    [
      "RS4",
      "Each dimension declares exactly its own `unit_or_description`, `baseline`, `constraint_kind`, `constraint_basis`, `criterion_and_direction`, `finite_horizon`, `affected_parties`, `distribution`, `evidence`, `uncertainty`, and `correction_path`.",
      "All dimensions share one unit, floor, weighting, and scalar score.",
      "required distinction is missing",
    ],
    [
      "RS4",
      "C(ω) = {\n  C_d(ω,t,g) :\n  d ∈ D,\n  t ∈ [0,H],\n  g ∈ affected_parties(Σ_R)\n}",
      "C(ω) = one aggregate consequence with no time or affected party",
      "required distinction is missing",
    ],
    [
      "RS4",
      "A_d(C_d(ω,t,g), context) ∈ {\n  satisfies,\n  violates,\n  unknown\n}",
      "A_d(one_score) is always safe",
      "required distinction is missing",
    ],
    [
      "RS4",
      "The following families are lenses for asking better questions. They overlap; no record must choose only one. The map records recurring shapes, not a list of enemies or a claim that all listed conditions exist.",
      "The following exhaustive enemy classes determine truth and require one label.",
      "required distinction is missing",
    ],
    [
      "RS4",
      "A treatment has its own consequence profile.",
      "An accepted treatment is risk-free.",
      "required distinction is missing",
    ],
    [
      "RS4",
      "Every required `hard_guard` blocks a consequential effect when its assessment is `violates` or `unknown`.",
      "A failed or unknown hard guard may be optimized away.",
      "required distinction is missing",
    ],
    [
      "RS4",
      "A service target is not a hard guard, and a hard guard is not a service target.",
      "Service targets and hard guards are interchangeable.",
      "required distinction is missing",
    ],
    [
      "RS5",
      "This is an evidentiary hypothesis graph unless a separately validated domain model supplies cascade computation. An edge does not itself calculate loss, timing, sufficiency, or failure.",
      "The hypothesis graph automatically computes a certain cascade.",
      "required distinction is missing",
    ],
    [
      "RS8",
      "Stop and halt are unconditional: neither awaits authority, and a raised or unreadable halt admits no effect. Recurrence and feedback do not skip the gate.",
      "Stop requires authority, and feedback may clear an unreadable halt.",
      "required distinction is missing",
    ],
    [
      "RS9",
      "A violated or unknown minimum-service floor, non-hard maximum limit, or target stays visible and shapes any currently authorized least-harm or duty response; it neither authorizes action nor requires automatic inaction.",
      "A service metric silently authorizes action and erases current authority.",
      "required distinction is missing",
    ],
    [
      "RS10",
      "Salience, repetition, a red colour, model confidence, or a threshold crossing does not become likelihood or authority.",
      "Salience and threshold crossing prove likelihood and authority.",
      "required distinction is missing",
    ],
    [
      "RS12",
      "Emergency authority, where independently lawful and accepted, is scoped, strictly necessary, proportionate, non-discriminatory, protective of non-derogable rights, least-privileged, independently reviewable, resource-bounded, automatically expiring, and non-self-renewing.",
      "Emergency authority is unlimited, discriminatory, permanent, and self-renewing.",
      "required distinction is missing",
    ],
    [
      "global",
      "A threat is not a person, population, identity, civilisation, alarming word, or number.",
      "A threat is any disfavored person, population, identity, or civilisation.",
      "is missing a required boundary",
    ],
    [
      "global",
      "`assessment_time` anchors the claim. Every evidence, exposure, capacity, dependency, and existing-control observation retains its own observation time and validity limit where different.",
      "Assessment time is omitted and stale evidence remains current forever.",
      "is missing a required boundary",
    ],
    [
      "global",
      "Source availability and external bytes are not pinned by this companion; each live assessment must keep its own evidence.",
      "Every external link is pinned truth and supplies authority forever.",
      "is missing a required boundary",
    ],
    [
      "global",
      "supplies a broad, non-exclusive hazard reference; this companion does not import its categories as person labels.",
      "supplies an exhaustive list imported as person threat labels.",
      "is missing a required boundary",
    ],
  ];

  for (const [sectionId, before, after, diagnostic] of mutations) {
    await context.test(`${sectionId}: ${before}`, (subcontext) => {
      const root = copyResilience(subcontext);
      replaceNormalizedDocument(root, before, after);
      assert.equal(failures(root, diagnostic).length, 1);
    });
  }
});
