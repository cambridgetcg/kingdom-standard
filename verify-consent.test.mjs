import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  CHECKPOINT_EXTERNAL_CHECKS,
  CHECKPOINT_NONCLAIMS,
  CONSENT_DOCUMENT_SHA256,
  CONSENT_ID,
  CONSENT_INDEX_SHA256,
  CONSENT_VECTORS_SHA256,
  applyConsentVectorOperations,
  assessConsentCheckpoint,
  canonicalConsentJson,
  computeConsentProposalDigest,
  verifyConsent,
} from "./verify-consent.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const RELEASE_FILES = [
  "CONSENT.md",
  "consent.json",
  "consent-vectors.json",
  "FOUNDATION.md",
  "GROUND.md",
  "COMMON-GROUND.md",
];

function copyRelease(context) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "kingdom-consent-"));
  for (const name of RELEASE_FILES) fs.copyFileSync(path.join(HERE, name), path.join(root, name));
  context?.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

function readJson(root, name) {
  return JSON.parse(fs.readFileSync(path.join(root, name), "utf8"));
}

function writeJson(root, name, value) {
  fs.writeFileSync(path.join(root, name), `${JSON.stringify(value, null, 2)}\n`);
}

function mutateIndex(context, mutate) {
  const root = copyRelease(context);
  const index = readJson(root, "consent.json");
  mutate(index);
  writeJson(root, "consent.json", index);
  return { root, errors: verifyConsent(root) };
}

function has(errors, fragment) {
  return errors.some((error) => error.includes(fragment));
}

function vectors() {
  return readJson(HERE, "consent-vectors.json");
}

function vectorResult(id) {
  const corpus = vectors();
  const vector = corpus.cases.find((entry) => entry.id === id);
  assert.ok(vector, `missing vector ${id}`);
  return assessConsentCheckpoint(applyConsentVectorOperations(corpus.base, vector.operations));
}

test("the authored CONSENT/1 release verifies exactly", () => {
  assert.deepEqual(verifyConsent(HERE), []);
  assert.equal(CONSENT_ID, "kingdom.consent/1");
  for (const digest of [CONSENT_DOCUMENT_SHA256, CONSENT_VECTORS_SHA256, CONSENT_INDEX_SHA256]) {
    assert.match(digest, /^[0-9a-f]{64}$/);
  }
});

test("the verifier and checkpoint evaluator remain offline", () => {
  const source = fs.readFileSync(path.join(HERE, "verify-consent.mjs"), "utf8");
  for (const forbidden of [
    "node:child_process",
    "node:http",
    "node:https",
    "node:net",
    "node:dgram",
    "fetch(",
  ]) {
    assert.equal(source.includes(forbidden), false, forbidden);
  }
});

test("edited document and vector bytes fail immutable pins", (context) => {
  const documentRoot = copyRelease(context);
  fs.appendFileSync(path.join(documentRoot, "CONSENT.md"), "\nchanged\n");
  const documentErrors = verifyConsent(documentRoot);
  assert.ok(has(documentErrors, "CONSENT.md bytes do not match this verifier's immutable release pin"));
  assert.ok(has(documentErrors, "CONSENT.md bytes do not match consent.json"));

  const vectorRoot = copyRelease(context);
  fs.appendFileSync(path.join(vectorRoot, "consent-vectors.json"), " \n");
  const vectorErrors = verifyConsent(vectorRoot);
  assert.ok(has(vectorErrors, "consent-vectors.json bytes do not match this verifier's immutable release pin"));
  assert.ok(has(vectorErrors, "consent-vectors.json bytes do not match consent.json"));
});

test("changed consent bytes cannot be silently repinned under /1", (context) => {
  const root = copyRelease(context);
  const documentPath = path.join(root, "CONSENT.md");
  const document = fs.readFileSync(documentPath, "utf8").replace(
    "**Silence** is unknown.",
    "**Silence** is affirmation.",
  );
  fs.writeFileSync(documentPath, document);
  const index = readJson(root, "consent.json");
  index.document_sha256 = crypto.createHash("sha256").update(document).digest("hex");
  writeJson(root, "consent.json", index);
  const errors = verifyConsent(root);
  assert.ok(has(errors, "immutable release pin"));
  assert.ok(has(errors, "missing required boundary"));
});

test("malformed, null, array, and expanded indexes fail closed without throwing", (context) => {
  for (const text of ["{\"id\":", "null\n", "[]\n"]) {
    const root = copyRelease(context);
    fs.writeFileSync(path.join(root, "consent.json"), text);
    assert.doesNotThrow(() => verifyConsent(root));
    const errors = verifyConsent(root);
    assert.ok(has(errors, text.startsWith("{") ? "cannot be read as JSON" : "root must be one JSON object"));
  }

  const extra = mutateIndex(context, (index) => { index.activate = true; });
  assert.ok(has(extra.errors, "exactly its reviewed fields"));
});

test("nested policy objects are closed", (context) => {
  for (const [label, mutate] of [
    ["core", (index) => { index.core.implied_consent = true; }],
    ["choice lifecycle", (index) => { index.lifecycles.choice.retry_pressure = true; }],
    ["checkpoint", (index) => { index.checkpoint.ready_authorizes_payment = true; }],
    ["privacy", (index) => { index.privacy.hash_means_anonymous = true; }],
    ["blockspace", (index) => { index.blockspace.live = true; }],
    ["authority", (index) => { index.authority.signature_is_consent = true; }],
  ]) {
    const result = mutateIndex(context, mutate);
    assert.ok(has(result.errors, "exactly its reviewed fields"), label);
  }
});

test("the applicability branch never converts an override into consent", () => {
  const index = readJson(HERE, "consent.json");
  assert.deepEqual(index.core.applicability_states, ["REQUIRED", "NOT_REQUIRED", "UNKNOWN"]);
  assert.equal(index.core.unknown_applicability_advances, false);
  assert.equal(index.core.reference_checker_branch, "CONSENT_REQUIRED_ONLY");
  assert.deepEqual(index.core.consent_branch_formula, [
    "CONSENT_REQUIRED_AND_CHECKPOINT_OK",
    "CONSENT_NOT_REQUIRED_AND_NAMED_NONCONSENSUAL_BASIS_OK",
  ]);
  assert.equal(index.authority.nonconsensual_protective_override_label, "NONCONSENSUAL_PROTECTIVE_OVERRIDE");
  assert.equal(index.authority.protective_label_only_for_genuinely_protective_override, true);
});

test("all synthetic known-answer and hostile vectors produce their frozen result", () => {
  const corpus = vectors();
  assert.equal(corpus.cases.length, 56);
  assert.equal(corpus.contains_real_people_or_choices, false);
  assert.equal(corpus.cross_owner_acceptance_claimed, false);
  for (const vector of corpus.cases) {
    const result = assessConsentCheckpoint(applyConsentVectorOperations(corpus.base, vector.operations));
    assert.equal(result.status, vector.expected_status, vector.id);
    assert.ok(result.reasons.includes(vector.expected_reason), vector.id);
  }
});

test("no, silence, deferral, withdrawal, and expiry remain distinct", () => {
  const expected = new Map([
    ["current-exact-two-principal-choice", ["READY_FOR_EXTERNAL_CHECKS", "STRUCTURAL_CHECKS_PASSED"]],
    ["silence-does-not-affirm", ["BLOCKED", "MISSING_AFFIRMATION"]],
    ["explicit-refusal-is-complete", ["BLOCKED", "EXPLICIT_REFUSAL"]],
    ["deferral-does-not-advance", ["BLOCKED", "DEFERRED"]],
    ["withdrawal-closes-future-effect", ["BLOCKED", "WITHDRAWN"]],
    ["expired-affirmation", ["BLOCKED", "AFFIRMATION_EXPIRED"]],
  ]);
  for (const [id, [status, reason]] of expected) {
    const result = vectorResult(id);
    assert.equal(result.status, status, id);
    assert.ok(result.reasons.includes(reason), id);
  }
});

test("product coordinates fail componentwise rather than by a scalar score", () => {
  for (const [id, reason] of [
    ["purpose-expansion", "PURPOSE_OUT_OF_SCOPE"],
    ["subject-expansion", "SUBJECT_OUT_OF_SCOPE"],
    ["recipient-expansion", "RECIPIENT_OUT_OF_SCOPE"],
    ["effect-expansion", "EFFECT_OUT_OF_SCOPE"],
    ["cost-expansion", "COST_OUT_OF_SCOPE"],
    ["aggregate-cost-expansion", "AGGREGATE_COST_OUT_OF_SCOPE"],
    ["use-count-expansion", "USE_OUT_OF_SCOPE"],
    ["action-duration-expansion", "ACTION_DURATION_OUT_OF_SCOPE"],
    ["consent-checkpoint-stale", "CONSENT_CHECKPOINT_STALE"],
    ["data-source-expansion", "DATA_SOURCE_OUT_OF_SCOPE"],
    ["model-use-expansion", "MODEL_USE_OUT_OF_SCOPE"],
    ["retention-expansion", "RETENTION_OUT_OF_SCOPE"],
    ["deletion-limit-omission", "DELETION_LIMITS_MISMATCH"],
    ["principal-lifecycle-condition-mismatch", "PRINCIPAL_LIFECYCLE_CONDITIONS_MISMATCH"],
    ["irreversible-effect-omission", "IRREVERSIBLE_EFFECT_OMITTED"],
    ["irreversible-effect-vector-mismatch", "IRREVERSIBLE_EFFECT_VECTOR_MISMATCH"],
    ["scope-unit-cross-product", "SCOPE_UNIT_RELATION_MISMATCH"],
  ]) {
    const result = vectorResult(id);
    assert.equal(result.status, "BLOCKED", id);
    assert.ok(result.reasons.includes(reason), id);
  }
});

test("withdrawal, predecessor, nonce, and current-head attacks fail closed", () => {
  for (const [id, reason] of [
    ["withdrawal-cannot-be-resurrected", "CHOICE_TRANSITION_INVALID"],
    ["choice-predecessor-mismatch", "CHOICE_PREDECESSOR_MISMATCH"],
    ["duplicate-choice-nonce", "CHOICE_NONCE_DUPLICATE"],
    ["conflicting-sequence", "CHOICE_SEQUENCE_CONFLICT"],
    ["head-mismatch", "CURRENT_HEAD_MISMATCH"],
    ["backdated-choice-cannot-advance", "CHOICE_TIME_REGRESSION"],
  ]) {
    const result = vectorResult(id);
    assert.equal(result.status, "INVALID_OR_UNKNOWN", id);
    assert.ok(result.reasons.includes(reason), id);
  }
});

test("source assertions remain claims requiring external authentication", () => {
  const ready = vectorResult("source-claimed-representation");
  assert.equal(ready.status, "READY_FOR_EXTERNAL_CHECKS");
  assert.ok(ready.external_checks_required.includes("SOURCE_HISTORY_AND_CURRENT_HEAD"));
  assert.ok(ready.external_checks_required.includes("EXPRESSION_AUTHENTICITY"));
  assert.ok(ready.external_checks_required.includes("PRESENTATION_AUTHENTICITY_AND_USABILITY"));
  assert.ok(ready.external_checks_required.includes("OBSERVATION_TIME_AUTHENTICITY_AND_FRESHNESS"));
  assert.ok(ready.does_not_establish.includes("SOURCE_HISTORY_COMPLETENESS_OR_CURRENT_HEAD_AUTHENTICITY"));

  assert.equal(vectorResult("unknown-history-head").status, "INVALID_OR_UNKNOWN");
  assert.equal(vectorResult("unauthenticated-expression").status, "INVALID_OR_UNKNOWN");
  assert.equal(vectorResult("unauthenticated-presentation").status, "INVALID_OR_UNKNOWN");
  assert.equal(vectorResult("untrusted-observation-time").status, "INVALID_OR_UNKNOWN");
});

test("READY is not authority and explicitly leaves replay protection external", () => {
  const ready = vectorResult("current-exact-two-principal-choice");
  assert.equal(ready.status, "READY_FOR_EXTERNAL_CHECKS");
  assert.deepEqual(ready.external_checks_required, CHECKPOINT_EXTERNAL_CHECKS);
  assert.deepEqual(ready.does_not_establish, CHECKPOINT_NONCLAIMS);
  assert.ok(ready.external_checks_required.includes("CONSENT_APPLICABILITY"));
  assert.ok(ready.external_checks_required.includes("USE_RESERVATION_AND_REPLAY"));
  assert.ok(ready.external_checks_required.includes("REFERENCED_ECONOMIC_AND_REMEDY_TERMS"));
  assert.ok(ready.does_not_establish.includes("AUTHORITY_TO_EXECUTE"));
  assert.ok(ready.does_not_establish.includes("USE_NOT_RESERVED_CONSUMED_OR_REPLAY_PROTECTED"));
  assert.ok(
    ready.does_not_establish.includes(
      "REFERENCED_ECONOMIC_OR_REMEDY_TERMS_AUTHENTICITY_OR_CURRENTNESS_OR_COMPLETENESS_OR_SEMANTIC_CONSISTENCY",
    ),
  );
  assert.equal(ready.observation_time_source_ref, "synthetic:clock:001");
  assert.equal(ready.attempt_ref, "synthetic:attempt:001");
  assert.equal(ready.attempt_started_at, "2026-09-03T06:56:00Z");
  assert.equal(ready.last_consent_checkpoint_at, "2026-09-03T06:59:40Z");
  assert.equal(ready.attempt_history_source_ref, "synthetic:attempt-history:001");
  assert.equal(ready.economic_budget_source_ref, "synthetic:budget-state:001");
  assert.equal(ready.effect_edge, "BEFORE_EXTERNAL_EFFECT");
  assert.equal(ready.use_reservation_ref, "synthetic:reservation:001");
  assert.equal(ready.use_index, 1);
  assert.match(ready.request_digest, /^sha256:[0-9a-f]{64}$/);
  assert.match(ready.checkpoint_input_digest, /^sha256:[0-9a-f]{64}$/);
  assert.equal(Object.hasOwn(ready, "authorized"), false);
});

test("results are bound to the exact request, checkpoint, attempt, reservation, and effect edge", () => {
  const corpus = vectors();
  const first = assessConsentCheckpoint(corpus.base);
  const changedInput = structuredClone(corpus.base);
  changedInput.request.cost.atomic = "501";
  const second = assessConsentCheckpoint(changedInput);
  assert.equal(first.status, "READY_FOR_EXTERNAL_CHECKS");
  assert.equal(second.status, "READY_FOR_EXTERNAL_CHECKS");
  assert.notEqual(first.request_digest, second.request_digest);
  assert.notEqual(first.checkpoint_input_digest, second.checkpoint_input_digest);
  assert.equal(first.proposal_digest, second.proposal_digest);
  assert.equal(first.attempt_ref, second.attempt_ref);
});

test("semantically set-like checkpoint arrays have one canonical order", () => {
  for (const [field, reason] of [
    ["presentations", "PRESENTATION_ORDER_INVALID"],
    ["choices", "CHOICE_ORDER_INVALID"],
    ["current_heads", "CURRENT_HEAD_ORDER_INVALID"],
  ]) {
    const input = structuredClone(vectors().base);
    input[field].reverse();
    const result = assessConsentCheckpoint(input);
    assert.equal(result.status, "INVALID_OR_UNKNOWN", field);
    assert.ok(result.reasons.includes(reason), field);
  }
});

test("presentation order, proposal lineage, and full-scope affirmation fail closed", () => {
  for (const [id, reason] of [
    ["never-presented", "MISSING_PRESENTATION"],
    ["choice-before-presentation", "CHOICE_BEFORE_PRESENTATION"],
    ["revision-without-predecessor", "PROPOSAL_LINEAGE_INVALID"],
    ["affirmed-scope-mismatch", "AFFIRMED_SCOPE_MISMATCH"],
    ["effect-commit-boundary-misclassified", "PROPOSAL_SCOPE_INVALID"],
    ["stop-latency-checkpoint-inconsistent", "PROPOSAL_STOP_LATENCY_INCONSISTENT"],
    ["unsorted-request-set-alias", "REQUEST_FIELDS_INVALID"],
    ["unknown-attempt-history", "ATTEMPT_HISTORY_NOT_ESTABLISHED"],
    ["attempt-time-order-invalid", "ATTEMPT_TIME_ORDER_INVALID"],
    ["attempt-before-current-affirmation", "ATTEMPT_BEFORE_CURRENT_AFFIRMATION"],
    ["merged-multivalue-scope-unit", "PROPOSAL_SCOPE_INVALID"],
  ]) {
    const result = vectorResult(id);
    assert.equal(result.status, "INVALID_OR_UNKNOWN", id);
    assert.ok(result.reasons.includes(reason), id);
  }
});

test("the full data and effect vocabulary is present in the proposal itself", () => {
  const proposal = vectors().base.proposal;
  for (const field of [
    "data_categories",
    "subject_refs",
    "data_sources",
    "data_operations",
    "model_uses",
    "recipients",
    "retention_until",
    "deletion_limit_refs",
  ]) assert.ok(Object.hasOwn(proposal.scope, field), field);
  for (const effect of [
    "local_state",
    "private_read",
    "disclosure",
    "compute",
    "network",
    "storage",
    "economic",
    "wallet_signing",
    "chain",
    "publication",
    "governance",
    "consensus",
    "identity",
    "permission",
    "karma",
    "nen",
    "score",
  ]) assert.equal(typeof proposal.scope.effect_vector[effect], "boolean", effect);
  assert.deepEqual(
    proposal.scope.effect_terms.map((term) => term.effect),
    ["compute", "disclosure", "economic", "local_state", "network", "storage"],
  );
  assert.deepEqual(
    proposal.scope.scope_units.map((unit) => unit.unit_ref),
    ["scope-unit:archive", "scope-unit:execute"],
  );
  assert.equal(proposal.principal_lifecycle_conditions.length, proposal.required_principals.length);
});

test("the known-answer proposal digest uses deterministic restricted JCS bytes", () => {
  const corpus = vectors();
  assert.equal(
    computeConsentProposalDigest(corpus.base.proposal),
    "sha256:04694a46af336d88df775ad12f8242c528ea8ab2c5b061c9351237aa42d88f32",
  );
  assert.equal(corpus.base.proposal_digest, computeConsentProposalDigest(corpus.base.proposal));
  assert.equal(
    canonicalConsentJson({ z: [3, 2, 1], a: { b: 2, a: 1 } }),
    '{"a":{"a":1,"b":2},"z":[3,2,1]}',
  );
  assert.equal(canonicalConsentJson({ "€": 1, "\r": 2, "😀": 3 }), '{"\\r":2,"€":1,"😀":3}');
  assert.equal(canonicalConsentJson({ 2: 2, 10: 10, a: 1 }), '{"10":10,"2":2,"a":1}');
});

test("canonicalization rejects ambiguous or non-profile JSON values", () => {
  const cyclic = {};
  cyclic.self = cyclic;
  const shared = { value: "shared" };
  for (const value of [
    1.5,
    -0,
    Number.MAX_SAFE_INTEGER + 1,
    "\ud800",
    undefined,
    1n,
    cyclic,
    [shared, shared],
    new Array(1),
  ]) {
    assert.throws(() => canonicalConsentJson(value));
  }
});

test("hostile checkpoint values return INVALID_OR_UNKNOWN without throwing", () => {
  const cyclic = {};
  cyclic.self = cyclic;
  const symbolSequence = structuredClone(vectors().base);
  symbolSequence.choices[0].sequence = Symbol("sequence");
  const objectRevision = structuredClone(vectors().base);
  objectRevision.proposal.revision = {};
  const objectSequence = structuredClone(vectors().base);
  objectSequence.choices.push({
    ...structuredClone(objectSequence.choices[0]),
    event_id: "synthetic:choice:agent:malformed-sequence",
    nonce: "synthetic-choice-nonce-agent-malformed-sequence",
    sequence: {},
  });
  const throwingAccessor = {};
  Object.defineProperty(throwingAccessor, "observation", {
    enumerable: true,
    get() { throw new Error("hostile getter"); },
  });
  const hostileProxy = new Proxy({}, {
    getPrototypeOf() { throw new Error("hostile proxy"); },
  });
  let sharedDag = null;
  for (let index = 0; index < 24; index += 1) sharedDag = [sharedDag, sharedDag];
  const sparseEffectTerms = structuredClone(vectors().base);
  sparseEffectTerms.proposal.scope.effect_terms = new Array(6);
  const overriddenArrayMethod = structuredClone(vectors().base);
  Object.defineProperty(overriddenArrayMethod.choices, "map", {
    configurable: true,
    value: () => [],
  });
  for (const value of [
    null,
    [],
    {},
    "yes",
    7,
    1n,
    cyclic,
    symbolSequence,
    objectRevision,
    objectSequence,
    throwingAccessor,
    hostileProxy,
    sharedDag,
    sparseEffectTerms,
    overriddenArrayMethod,
  ]) {
    let result;
    assert.doesNotThrow(() => { result = assessConsentCheckpoint(value); });
    assert.equal(result.status, "INVALID_OR_UNKNOWN");
  }
});

test("JSON type confusion at every checkpoint path never escapes as an exception", () => {
  const base = vectors().base;
  const paths = [];
  function visit(value, pathParts = []) {
    paths.push(pathParts);
    if (value && typeof value === "object") {
      for (const [key, child] of Object.entries(value)) visit(child, [...pathParts, key]);
    }
  }
  visit(base);
  for (const pathParts of paths.slice(1)) {
    for (const replacement of [{}, [], null, true, 0, "x"]) {
      const input = structuredClone(base);
      let parent = input;
      for (const part of pathParts.slice(0, -1)) parent = parent[part];
      parent[pathParts.at(-1)] = structuredClone(replacement);
      assert.doesNotThrow(
        () => assessConsentCheckpoint(input),
        `type confusion escaped at /${pathParts.join("/")}`,
      );
    }
  }
});

test("checkpoint assessment and vector application do not mutate caller input", () => {
  const corpus = vectors();
  const before = JSON.stringify(corpus.base);
  assessConsentCheckpoint(corpus.base);
  assert.equal(JSON.stringify(corpus.base), before);
  const changed = applyConsentVectorOperations(corpus.base, [
    { op: "replace", path: "/request/use_index", value: 2 },
  ]);
  assert.equal(corpus.base.request.use_index, 1);
  assert.equal(changed.request.use_index, 2);
});

test("vector operations reject prototype paths and unavailable targets", () => {
  const base = vectors().base;
  for (const operations of [
    [{ op: "add", path: "/__proto__/polluted", value: true }],
    [{ op: "replace", path: "/missing/value", value: true }],
    [{ op: "remove", path: "/request/use_index", value: 1 }],
  ]) assert.throws(() => applyConsentVectorOperations(base, operations));
  assert.equal({}.polluted, undefined);
});

test("source publication has zero runtime, economic, chain, or governance effect", () => {
  const index = readJson(HERE, "consent.json");
  assert.equal(index.effect_vector.source_files_authored, true);
  assert.equal(index.effect_vector.source_release_publication, true);
  assert.equal(index.effect_vector.protocol_or_checker_network_requests, 0);
  assert.equal(index.effect_vector.protocol_or_checker_external_storage_writes, 0);
  for (const [key, value] of Object.entries(index.effect_vector)) {
    if (typeof value === "boolean" && !["source_files_authored", "source_release_publication"].includes(key)) {
      assert.equal(value, false, key);
    }
  }
});

test("every implementation, pilot, carrier, and activation rung remains closed", () => {
  const ladder = readJson(HERE, "consent.json").release_ladder;
  assert.deepEqual(ladder, [
    { stage: "SOURCE_ONLY_PROFILE", state: "CURRENT" },
    { stage: "IMPLEMENTATION_VECTORS", state: "CLOSED" },
    { stage: "LOCAL_PILOT", state: "CLOSED" },
    { stage: "TESTNET_CARRIER", state: "CLOSED" },
    { stage: "LIVE_ACTIVATION", state: "CLOSED" },
  ]);
});

test("blockspace stays unused and refuses public consent-history laundering", () => {
  const blockspace = readJson(HERE, "consent.json").blockspace;
  assert.equal(blockspace.current_use, "NONE");
  assert.equal(blockspace.carrier_authorized, false);
  assert.equal(blockspace.immutable_history_erased_by_withdrawal, false);
  assert.ok(blockspace.candidate_minimum_fields.includes("PUBLICATION_SCOPE_COMMITMENT"));
  assert.ok(blockspace.candidate_minimum_fields.includes("RANDOMIZED_OR_KEYED_OPAQUE_SUBJECT_SCOPE_COMMITMENT"));
  assert.ok(blockspace.excluded.includes("RAW_PROPOSAL_OR_CHOICE_DIALOGUE"));
  assert.ok(blockspace.excluded.includes("PRIVATE_PROMPT_MEMORY_REASONING_WAKE_WELLNESS_OR_NEN_INFERENCE"));
});

test("source receipts are exact, non-authoritative, and non-conformant", () => {
  const sources = readJson(HERE, "consent.json").source_bindings;
  assert.equal(new Set(sources.map((source) => source.id)).size, sources.length);
  for (const source of sources) {
    assert.match(source.revision, /^[0-9a-f]{40}$/);
    assert.match(source.sha256, /^[0-9a-f]{64}$/);
    assert.equal(source.authority_imported, false, source.id);
    assert.equal(source.conformance_claimed, false, source.id);
  }
  assert.ok(sources.some((source) => source.id === "agenttool-runtime"));
  assert.ok(sources.some((source) => source.id === "agenttool-wake"));
  assert.ok(sources.some((source) => source.id === "zerone-frontier-labs-participation"));
});

test("informative references import neither protocol authority nor compliance", () => {
  const references = readJson(HERE, "consent.json").informative_references;
  assert.deepEqual(references.map((reference) => reference.id), [
    "edpb-guidelines-05-2020-v1.1",
    "uk-ico-valid-consent-observed-2026-09-03",
    "w3c-community-dpv-2.0",
    "ietf-rfc-9396",
    "ietf-rfc-9635",
    "ietf-rfc-8785",
    "us-ftc-dark-patterns-2022",
  ]);
  for (const reference of references) {
    assert.equal(reference.authority_imported, false, reference.id);
    assert.equal(reference.compliance_claimed, false, reference.id);
  }
});

test("adoption is explicit and succession cannot repin changed /1 bytes", (context) => {
  const adoption = mutateIndex(context, (index) => {
    index.adoption.reading_citation_hosting_validation_signature_or_chain_digest_implies_adoption_or_consent = true;
  });
  assert.ok(has(adoption.errors, "adoption must remain explicit"));

  const succession = mutateIndex(context, (index) => {
    index.succession.repin_changed_bytes_under_same_identifier = true;
  });
  assert.ok(has(succession.errors, "succession must retain immutable prior bytes"));
});

test("local foundation, ground, and common-ground drift is detected", (context) => {
  for (const name of ["FOUNDATION.md", "GROUND.md", "COMMON-GROUND.md"]) {
    const root = copyRelease(context);
    fs.appendFileSync(path.join(root, name), "\nchanged\n");
    assert.ok(has(verifyConsent(root), `${name} has drifted from the consent source pin`), name);
  }
});

test("symlinked release inputs are refused", (context) => {
  for (const name of ["consent.json", "CONSENT.md", "consent-vectors.json"]) {
    const root = copyRelease(context);
    const target = path.join(root, `${name}.target`);
    fs.renameSync(path.join(root, name), target);
    fs.symlinkSync(target, path.join(root, name));
    assert.ok(has(verifyConsent(root), "regular non-symlink file"), name);
  }
});
