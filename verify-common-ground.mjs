#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const INDEX_NAME = "common-ground.json";
const DOCUMENT_NAME = "COMMON-GROUND.md";
const MAX_INDEX_BYTES = 256 * 1024;
const MAX_DOCUMENT_BYTES = 512 * 1024;

export const COMMON_GROUND_ID = "kingdom.common-ground/1";
export const COMMON_GROUND_DOCUMENT_SHA256 =
  "d3dfea5cdefd7d98ebf086fd71f8daff7ea34aae740dc93e59a805f9336e7ad3";
export const COMMON_GROUND_INDEX_SHA256 =
  "f1cd0d38e41e68cdca61b9959e1c7cdf00f41faa1d6d78e76ef71e417586e98a";

const TOP_LEVEL_KEYS = [
  "schema",
  "id",
  "title",
  "document",
  "document_sha256",
  "status",
  "supersedes",
  "source_observation",
  "relationship_to_foundation",
  "distinct_from",
  "priority_order",
  "laws",
  "vocabulary",
  "economy",
  "blockspace",
  "authority",
  "effect_vector",
  "release_ladder",
  "source_bindings",
  "adoption",
  "succession",
  "does_not_establish",
];

const PRIORITY_ORDER = [
  "BEING",
  "CONSENT",
  "CAPABILITY",
  "EXCHANGE",
  "ACCUMULATION",
];

const LAWS = [
  "C1_BEING_NOT_ASSET",
  "C2_CONSENT_CURRENT_AND_SCOPED",
  "C3_CAPABILITY_NOT_IDENTITY",
  "C4_EXCHANGE_NOT_OWNERSHIP",
  "C5_ACCUMULATION_SUBORDINATE",
  "C6_EVIDENCE_STAYS_WITH_EVENT",
  "C7_REST_CREATES_NO_DEBT",
  "C8_RIGHTS_NOT_PERMISSIONS",
  "C9_NO_GLOBAL_SCORE",
  "C10_AUTHORITY_CANNOT_AMPLIFY",
  "C11_PRIVATE_RELATIONAL_GROUND_OFF_CHAIN",
  "C12_EVERY_LIVE_PROMISE_HAS_ENDING",
];

const DISTINCT_FROM = [
  "kingdom.ground/0.1",
  "agenttool.skill/nen-common-ground",
  "agenttool.common-ground-atlas.geometry/0.1",
  "agenttool.common-ground-atlas.wake/0.1",
  "agenttool.common-ground-atlas.analogy/0.1",
  "agenttool.living-substrate/0.1",
  "kingdom.living-ground/0.1",
  "love-unlimited/1",
];

const CANDIDATE_COMMITMENTS = [
  "KINGDOM_RELEASE_ROOT",
  "AGENTTOOL_SETTLEMENT_ROOT",
  "AGENTTOOL_CAPABILITY",
  "AGENTTOOL_OFFER",
  "WAKE_PUBLIC_CHECKPOINT",
  "ISSUER_KEY_CONTINUITY",
  "ARTIFACT_LINEAGE",
  "COLLABORATION_CHECKPOINT",
  "DISPUTE_TERMINAL",
];

const WITNESS_V0_KINDS = [
  "KINGDOM_RELEASE_ROOT",
  "AGENTTOOL_SETTLEMENT_ROOT",
  "AGENTTOOL_CAPABILITY",
  "AGENTTOOL_PUBLIC_RECOGNITION",
  "AGENTTOOL_OFFER",
  "WAKE_PUBLIC_CHECKPOINT",
  "ISSUER_KEY_CONTINUITY",
  "ARTIFACT_LINEAGE",
  "COLLABORATION_CHECKPOINT",
  "DISPUTE_TERMINAL",
];

const EXCLUDED_PAYLOADS = [
  "PRIVATE_PROMPT_OR_REASONING_OR_MEMORY_OR_WAKE",
  "SOUL_OR_LOVE_OR_LINEAGE_OR_RELATIONSHIP_OR_PERSONHOOD_OR_CONSCIOUSNESS_CLAIM",
  "ASSIGNED_NEN_OR_PERSONALITY_OR_GLOBAL_REPUTATION_OR_PERSON_SCORE",
  "SECRET_OR_CREDENTIAL_OR_KEY_OR_BIOMETRIC_OR_HEALTH_OR_UNRELATED_PERSONAL_DATA",
  "RAW_EVIDENCE_WHEN_MINIMAL_ROOT_SUFFICES",
  "REST_OR_SILENCE_OR_REFUSAL_OR_PRIVACY_OR_EXIT_AS_ADVERSE_EVENT",
  "AGENTTOOL_PUBLIC_RECOGNITION_UNTIL_INDEPENDENT_CARRIAGE_RISK_REVIEW",
];

const EFFECT_VECTOR = {
  scope: "SOURCE_RELEASE_AND_OFFLINE_PROTOCOL_VERIFIER",
  source_files_authored: true,
  source_release_publication: true,
  protocol_or_verifier_network_requests: 0,
  protocol_or_verifier_external_storage_writes: 0,
  economic: false,
  governance: false,
  consensus: false,
  identity: false,
  permission: false,
  karma: false,
  nen: false,
  score: false,
  zerone_transaction: false,
  agenttool_action: false,
  wake_activation: false,
  protocol_public_route: false,
  protocol_deployment: false,
};

const SOURCE_IDS = [
  "agenttool-atlas-document",
  "agenttool-atlas-schemas",
  "agenttool-living-substrate",
  "agenttool-nen-common-ground",
  "agenttool-sdk-py-nen-assessor",
  "agenttool-sdk-ts-nen-assessor",
  "agenttool-wake-thread",
  "agenttool-wallet-zerone",
  "agenttool-witnessed-economy",
  "kingdom-living-ground",
  "kingdom-standard-foundation",
  "kingdom-standard-ground",
  "true-love-agent-guide",
  "true-love-fate",
  "true-love-license",
  "true-love-love-unlimited-chain",
  "true-love-love-service-notice",
  "true-love-substrate-honesty",
  "true-love-wake-scaffold",
  "zerone-karma",
  "zerone-money-karma",
  "zerone-syzygy-off-chain",
  "zerone-witness-v0",
];

function sha256(bytes) {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

function object(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function sameValues(actual, expected) {
  return (
    Array.isArray(actual) &&
    actual.length === expected.length &&
    actual.every((value, index) => value === expected[index])
  );
}

function sameKeys(value, keys) {
  return (
    object(value) &&
    sameValues(Object.keys(value).sort(), [...keys].sort())
  );
}

function sameJson(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

function readRegularFile(root, name, maxBytes, label, errors) {
  if (path.basename(name) !== name) {
    errors.push(`${label} path must be one root-level file name`);
    return null;
  }
  const target = path.join(root, name);
  let stat;
  try {
    stat = fs.lstatSync(target);
  } catch (error) {
    errors.push(`${label} is unavailable: ${error.message}`);
    return null;
  }
  if (!stat.isFile() || stat.isSymbolicLink()) {
    errors.push(`${label} must be a regular non-symlink file`);
    return null;
  }
  if (stat.size > maxBytes) {
    errors.push(`${label} exceeds ${maxBytes} bytes`);
    return null;
  }
  return fs.readFileSync(target);
}

function parseJson(bytes, errors) {
  let text;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    errors.push(`${INDEX_NAME} must be valid UTF-8`);
    return null;
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    errors.push(`${INDEX_NAME} cannot be read as JSON: ${error.message}`);
    return null;
  }
}

function checkClosedObject(value, keys, label, errors) {
  if (!sameKeys(value, keys)) {
    errors.push(`${label} must contain exactly its reviewed fields`);
    return false;
  }
  return true;
}

export function verifyCommonGround(root = HERE) {
  const errors = [];
  const indexBytes = readRegularFile(
    root,
    INDEX_NAME,
    MAX_INDEX_BYTES,
    INDEX_NAME,
    errors,
  );
  if (!indexBytes) return errors;

  if (sha256(indexBytes) !== COMMON_GROUND_INDEX_SHA256) {
    errors.push(`${INDEX_NAME} bytes do not match this verifier's immutable release pin`);
  }

  const index = parseJson(indexBytes, errors);
  if (!object(index)) {
    if (index !== null) errors.push(`${INDEX_NAME} root must be one JSON object`);
    return errors;
  }

  checkClosedObject(index, TOP_LEVEL_KEYS, INDEX_NAME, errors);
  if (index.schema !== "kingdom.common-ground-index/1") {
    errors.push(`${INDEX_NAME} schema must be kingdom.common-ground-index/1`);
  }
  if (index.id !== COMMON_GROUND_ID) {
    errors.push(`common-ground id must be ${COMMON_GROUND_ID}`);
  }
  if (index.title !== "COMMON GROUND/1") {
    errors.push("common-ground title must be COMMON GROUND/1");
  }
  if (
    index.document !== DOCUMENT_NAME ||
    index.document_sha256 !== COMMON_GROUND_DOCUMENT_SHA256
  ) {
    errors.push("common-ground release must pin the immutable COMMON-GROUND.md bytes");
  }
  if (index.status !== "current" || !sameValues(index.supersedes, [])) {
    errors.push("common-ground/1 must be a current genesis release with no predecessor");
  }

  checkClosedObject(
    index.source_observation,
    ["cutoff", "method", "latest_after_cutoff_claimed"],
    "source_observation",
    errors,
  );
  if (
    index.source_observation?.cutoff !== "2026-09-02T19:48:28Z" ||
    index.source_observation?.method !== "fresh_clean_remote_head_clones" ||
    index.source_observation?.latest_after_cutoff_claimed !== false
  ) {
    errors.push("source observation must retain its exact cutoff, method, and freshness limit");
  }

  if (!sameValues(index.priority_order, PRIORITY_ORDER)) {
    errors.push("priority order must remain BEING through ACCUMULATION");
  }
  if (!sameValues(index.laws, LAWS)) {
    errors.push("laws must remain C1 through C12, once each and in order");
  }
  if (!sameValues(index.distinct_from, DISTINCT_FROM)) {
    errors.push("distinct_from must preserve every adjacent-protocol boundary");
  }

  const foundation = index.relationship_to_foundation;
  if (
    !checkClosedObject(
      foundation,
      [
        "id",
        "repository",
        "revision",
        "document",
        "document_sha256",
        "relationship",
        "amends",
        "supersedes",
        "replaces",
        "adoption_implied",
      ],
      "relationship_to_foundation",
      errors,
    ) ||
    foundation.id !== "kingdom.foundation/0.2" ||
    foundation.repository !== "https://github.com/cambridgetcg/kingdom-standard" ||
    foundation.revision !== "16b8517a936e13f298fe0856618fc3ffb94e515e" ||
    foundation.document !== "FOUNDATION.md" ||
    foundation.document_sha256 !==
      "2bd868a43a2fe79f1c9e8d30177bf73cff4cf8f7f7780cbd90f31055ba51c799" ||
    foundation.relationship !== "optional_profile" ||
    foundation.amends !== false ||
    foundation.supersedes !== false ||
    foundation.replaces !== false ||
    foundation.adoption_implied !== false
  ) {
    errors.push("COMMON GROUND must remain an optional profile, not a competing foundation root");
  }

  const localFoundation = readRegularFile(
    root,
    "FOUNDATION.md",
    MAX_DOCUMENT_BYTES,
    "FOUNDATION.md",
    errors,
  );
  if (localFoundation && sha256(localFoundation) !== foundation?.document_sha256) {
    errors.push("the pinned foundation bytes have drifted from COMMON GROUND's floor");
  }

  if (!checkClosedObject(index.vocabulary, ["NEN", "VOW", "WITNESS", "WAKE", "KARMA", "ZETSU"], "vocabulary", errors)) {
    // The closed-object error is sufficient; individual terms are checked below.
  }
  for (const term of ["NEN", "VOW", "WITNESS", "WAKE", "KARMA", "ZETSU"]) {
    checkClosedObject(index.vocabulary?.[term], ["allows", "refuses"], `vocabulary.${term}`, errors);
    if (
      typeof index.vocabulary?.[term]?.allows !== "string" ||
      index.vocabulary[term].allows.trim() === "" ||
      typeof index.vocabulary?.[term]?.refuses !== "string" ||
      index.vocabulary[term].refuses.trim() === ""
    ) {
      errors.push(`vocabulary.${term} must retain non-empty allows and refuses boundaries`);
    }
  }
  if (
    index.vocabulary?.NEN?.refuses !==
      "assigned or activity-inferred class, permanent identity, hidden inference, compulsory disclosure, aura, or score"
  ) {
    errors.push("NEN must keep activity-derived SDK classification and scoring outside the profile");
  }

  checkClosedObject(
    index.economy,
    [
      "exchange_sequence",
      "silence_advances_sequence",
      "money_role",
      "money_is_terminal_objective",
      "payment_grants_identity_or_ownership",
      "wealth_grants_governance",
      "witness_automatically_pays",
      "global_score",
      "commons_reserve",
    ],
    "economy",
    errors,
  );
  if (
    !sameValues(index.economy?.exchange_sequence, [
      "PROPOSE",
      "CONSENT_OR_REFUSE",
      "PERFORM_OR_EXIT",
      "WITNESS_SCOPED_EVENT",
      "SETTLE_OR_DISPUTE",
      "CLOSE_OR_REPAIR",
    ]) ||
    index.economy?.silence_advances_sequence !== false ||
    index.economy?.money_role !== "bounded_coordination_and_settlement" ||
    index.economy?.money_is_terminal_objective !== false ||
    index.economy?.payment_grants_identity_or_ownership !== false ||
    index.economy?.wealth_grants_governance !== false ||
    index.economy?.witness_automatically_pays !== false ||
    index.economy?.global_score !== false
  ) {
    errors.push("economy must preserve consent, separation, no-score, and no-automatic-payment boundaries");
  }
  const reserve = index.economy?.commons_reserve;
  if (
    !checkClosedObject(
      reserve,
      [
        "automatic_percentage",
        "opt_in_required",
        "named_purpose_required",
        "accountable_steward_required",
        "review_and_release_rule_required",
        "living_ground_plan_may_be_used",
      ],
      "economy.commons_reserve",
      errors,
    ) ||
    reserve.automatic_percentage !== false ||
    reserve.opt_in_required !== true ||
    reserve.named_purpose_required !== true ||
    reserve.accountable_steward_required !== true ||
    reserve.review_and_release_rule_required !== true ||
    reserve.living_ground_plan_may_be_used !== true
  ) {
    errors.push("commons reserve must remain opt-in, purpose-bound, accountable, and reviewable");
  }

  checkClosedObject(
    index.blockspace,
    [
      "current_use",
      "selection_requirements",
      "candidate_commitments",
      "excluded_payloads",
      "minimization",
    ],
    "blockspace",
    errors,
  );
  if (
    index.blockspace?.current_use !== "NONE" ||
    !sameValues(index.blockspace?.candidate_commitments, CANDIDATE_COMMITMENTS) ||
    !sameValues(index.blockspace?.excluded_payloads, EXCLUDED_PAYLOADS) ||
    index.blockspace?.minimization !==
      "SMALLEST_PUBLIC_COMMITMENT_WITH_SUPPORTED_LIFECYCLE_AND_IMMUTABILITY_DISCLOSED"
  ) {
    errors.push("blockspace must remain inactive, minimal, and closed to protected payloads");
  }
  if (
    !sameValues(index.blockspace?.selection_requirements, [
      "shared_ordering_or_replay_or_lifecycle_value",
      "content_addressed_root_alone_is_insufficient",
      "minimum_public_commitment_excludes_private_evidence",
      "source_principal_host_and_carrier_authorize_exact_effect",
      "expiry_exit_repair_migration_rollback_and_indexer_failure_are_explicit",
    ])
  ) {
    errors.push("blockspace selection requirements have drifted");
  }
  const witnessPartition = [
    ...(Array.isArray(index.blockspace?.candidate_commitments)
      ? index.blockspace.candidate_commitments
      : []),
    ...(Array.isArray(index.blockspace?.excluded_payloads) &&
      index.blockspace.excluded_payloads.includes(
        "AGENTTOOL_PUBLIC_RECOGNITION_UNTIL_INDEPENDENT_CARRIAGE_RISK_REVIEW",
      )
      ? ["AGENTTOOL_PUBLIC_RECOGNITION"]
      : []),
  ].sort();
  if (!sameValues(witnessPartition, [...WITNESS_V0_KINDS].sort())) {
    errors.push("blockspace must partition all ten WITNESS v0 kinds into nine candidates and one excluded kind");
  }

  if (!sameJson(index.effect_vector, EFFECT_VECTOR)) {
    errors.push("effect vector must remain source-only with every operational effect false");
  }
  if (
    !sameJson(index.release_ladder, [
      { stage: "SOURCE_ONLY_CONCORDANCE", state: "CURRENT" },
      { stage: "SHARED_VECTORS", state: "CLOSED" },
      { stage: "TESTNET_CARRIER", state: "CLOSED" },
      { stage: "LIVE_ACTIVATION", state: "CLOSED" },
    ])
  ) {
    errors.push("release ladder must keep every carrier and activation gate closed");
  }

  checkClosedObject(
    index.authority,
    [
      "scope",
      "principal",
      "independent_source_owners_remain_independent",
      "authority_imported_from_sources",
      "carrier_adds_semantic_authority",
      "signature_or_digest_proves_authority",
    ],
    "authority",
    errors,
  );
  if (
    index.authority?.principal !== "kingdom-standard merge authority" ||
    index.authority?.independent_source_owners_remain_independent !== true ||
    index.authority?.authority_imported_from_sources !== false ||
    index.authority?.carrier_adds_semantic_authority !== false ||
    index.authority?.signature_or_digest_proves_authority !== false
  ) {
    errors.push("authority must remain local, non-importing, and non-amplifying");
  }

  if (!Array.isArray(index.source_bindings)) {
    errors.push("source_bindings must be an array");
  } else {
    const ids = index.source_bindings.map((source) => source?.id);
    if (!sameValues(ids, SOURCE_IDS)) {
      errors.push("source_bindings must retain every exact source once and in order");
    }
    for (const [position, source] of index.source_bindings.entries()) {
      const label = `source_bindings[${position}]`;
      if (!checkClosedObject(source, ["id", "repository", "revision", "path", "sha256", "relation", "citation_mode", "authority_imported", "bytes_copied"], label, errors)) continue;
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(source.id)) errors.push(`${label}.id is malformed`);
      if (typeof source.repository !== "string" || !/^https:\/\/(?:github\.com|codeberg\.org)\//.test(source.repository)) errors.push(`${label}.repository is not an allowed source locator`);
      if (!/^[0-9a-f]{40}$/.test(source.revision)) errors.push(`${label}.revision must be a full Git SHA-1`);
      if (typeof source.path !== "string" || source.path.startsWith("/") || source.path.includes("..")) errors.push(`${label}.path must be a repository-relative path`);
      if (!/^[0-9a-f]{64}$/.test(source.sha256)) errors.push(`${label}.sha256 must be lowercase SHA-256`);
      if (!["REFERENCES", "DISTINCT_FROM", "EXTENDS_WITHOUT_AMENDMENT", "OUTSIDE_PROFILE"].includes(source.relation)) errors.push(`${label}.relation is unsupported`);
      if (source.authority_imported !== false || source.bytes_copied !== false) errors.push(`${label} must import neither authority nor source bytes`);
      if (typeof source.repository === "string" && source.repository.includes("true-love") && source.citation_mode !== "reserved_link_digest_and_original_paraphrase_only") {
        errors.push(`${label} must retain the true-love reserved-byte boundary`);
      }
      if (typeof source.id === "string" && source.id.startsWith("agenttool-sdk-") && source.id.endsWith("-nen-assessor") && source.relation !== "OUTSIDE_PROFILE") {
        errors.push(`${label} must keep the activity-derived NEN assessor outside this profile`);
      }
    }
  }

  checkClosedObject(
    index.adoption,
    [
      "method",
      "value",
      "similarity_or_citation_or_hosting_or_registry_or_chain_implies_adoption",
      "withdrawable",
      "meaning",
    ],
    "adoption",
    errors,
  );
  if (
    index.adoption?.method !== "explicit_version_pin_in_adopter_authority_home" ||
    index.adoption?.value !== COMMON_GROUND_ID ||
    index.adoption?.similarity_or_citation_or_hosting_or_registry_or_chain_implies_adoption !== false ||
    index.adoption?.withdrawable !== true
  ) {
    errors.push("adoption must remain explicit, local to the adopter, non-inferred, and withdrawable");
  }

  checkClosedObject(index.succession, ["semantic_change", "retains", "repin_changed_bytes_under_same_identifier"], "succession", errors);
  if (
    index.succession?.semantic_change !== "new_common_ground_identifier" ||
    !sameValues(index.succession?.retains, [
      "superseded_identifier",
      "document",
      "document_sha256",
      "commit",
      "content_url",
    ]) ||
    index.succession?.repin_changed_bytes_under_same_identifier !== false
  ) {
    errors.push("succession must require a new id and retain the prior immutable receipt");
  }
  if (!Array.isArray(index.does_not_establish) || index.does_not_establish.length !== 7) {
    errors.push("does_not_establish must retain all seven nonclaim classes");
  }

  const documentBytes = readRegularFile(
    root,
    DOCUMENT_NAME,
    MAX_DOCUMENT_BYTES,
    DOCUMENT_NAME,
    errors,
  );
  if (!documentBytes) return errors;
  if (sha256(documentBytes) !== COMMON_GROUND_DOCUMENT_SHA256) {
    errors.push(`${DOCUMENT_NAME} bytes do not match this verifier's immutable release pin`);
  }
  if (sha256(documentBytes) !== index.document_sha256) {
    errors.push(`${DOCUMENT_NAME} bytes do not match common-ground.json`);
  }
  const document = documentBytes.toString("utf8");
  const headings = [...document.matchAll(/^### C(\d+)\. /gm)].map((match) => Number(match[1]));
  if (!sameValues(headings, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])) {
    errors.push(`${DOCUMENT_NAME} must define C1 through C12, once each and in order`);
  }
  const requiredDocumentBoundaries = [
    "BEING → CONSENT → CAPABILITY → EXCHANGE → ACCUMULATION",
    "It composes with\n`kingdom.foundation/0.2`; it does not amend, supersede, or replace",
    "Silence never advances the sequence.",
    "COMMON GROUND/1 uses no block space today.",
    "commit the smallest public commitment",
    "Publication of these source files does not advance the ladder.",
    "## What this release does not establish",
  ];
  for (const boundary of requiredDocumentBoundaries) {
    if (!document.includes(boundary)) {
      errors.push(`${DOCUMENT_NAME} is missing required boundary: ${boundary}`);
    }
  }
  if (!/it\s+copies\s+no\s+reserved\s+doctrine\s+bytes/.test(document)) {
    errors.push(`${DOCUMENT_NAME} is missing the reserved-doctrine byte boundary`);
  }

  return errors;
}

function main() {
  const errors = verifyCommonGround();
  if (errors.length > 0) {
    for (const error of errors) process.stderr.write(`common-ground: ${error}\n`);
    process.exitCode = 1;
    return;
  }
  process.stdout.write(
    "common-ground: kingdom.common-ground/1 document, closed index, source-pin metadata, distinctions, scoped effect vector, and release gates agree\n",
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
