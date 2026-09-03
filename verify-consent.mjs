#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const INDEX_NAME = "consent.json";
const DOCUMENT_NAME = "CONSENT.md";
const VECTORS_NAME = "consent-vectors.json";
const MAX_INDEX_BYTES = 512 * 1024;
const MAX_DOCUMENT_BYTES = 512 * 1024;
const MAX_VECTORS_BYTES = 512 * 1024;
const MAX_CHECKPOINT_BYTES = 128 * 1024;
const MAX_ARRAY_ITEMS = 64;
const MAX_STRING_BYTES = 4096;
const MAX_JSON_NODES = 32768;

export const CONSENT_ID = "kingdom.consent/1";
export const CONSENT_DOCUMENT_SHA256 = "9de65bd7358fad42a674b824da714c717ffc4b73701b1b8beae3ed8a6887b058";
export const CONSENT_VECTORS_SHA256 = "e30ea5ec16682825e00dec6352cab423c0e2fd9a321c717cc824b02c15af68fa";
export const CONSENT_INDEX_SHA256 = "d3386040a7e699579e34ba75886c7f787c7e528e8f73a0ad09cff25ee24fc305";

export const CHECKPOINT_EXTERNAL_CHECKS = [
  "RIGHTS",
  "AUTHORITY",
  "CONSENT_APPLICABILITY",
  "PRINCIPAL_SET_ADEQUACY",
  "IDENTITY_CONTROL",
  "EXPRESSION_AUTHENTICITY",
  "PRESENTATION_AUTHENTICITY_AND_USABILITY",
  "OBSERVATION_TIME_AUTHENTICITY_AND_FRESHNESS",
  "SOURCE_HISTORY_AND_CURRENT_HEAD",
  "REPRESENTATION",
  "PRINCIPAL_LIFECYCLE_CONDITIONS",
  "CAPACITY",
  "VOLUNTARINESS",
  "USE_RESERVATION_AND_REPLAY",
  "ECONOMIC_BUDGET_STATE",
  "REFERENCED_ECONOMIC_AND_REMEDY_TERMS",
  "ATTEMPT_HISTORY_AND_CHECKPOINT_TIMES",
  "EFFECT_EDGE_AND_ATTEMPT_BINDING",
  "LAW",
  "DOMAIN_SAFETY",
];

export const CHECKPOINT_NONCLAIMS = [
  "ACTUAL_CONSENT",
  "AUTHORITY_TO_EXECUTE",
  "ADEQUATE_AFFECTED_PRINCIPAL_SET",
  "CONSENT_APPLICABILITY_OR_NONCONSENSUAL_BASIS",
  "IDENTITY_OR_KEY_CONTROL",
  "PRESENTATION_RECEIPT_USABILITY_OR_UNDERSTANDING",
  "OBSERVATION_TIME_ACCURACY_OR_FRESHNESS",
  "SOURCE_HISTORY_COMPLETENESS_OR_CURRENT_HEAD_AUTHENTICITY",
  "PRINCIPAL_LIFECYCLE_CONDITION_TRUTH_OR_CURRENTNESS",
  "CAPACITY_OR_UNDERSTANDING",
  "VOLUNTARINESS_OR_FAIRNESS",
  "LEGAL_VALIDITY_OR_COMPLIANCE",
  "DOMAIN_SAFETY",
  "USE_NOT_RESERVED_CONSUMED_OR_REPLAY_PROTECTED",
  "ECONOMIC_BUDGET_STATE_AUTHENTICITY_OR_RESERVATION",
  "REFERENCED_ECONOMIC_OR_REMEDY_TERMS_AUTHENTICITY_OR_CURRENTNESS_OR_COMPLETENESS_OR_SEMANTIC_CONSISTENCY",
  "ATTEMPT_HISTORY_OR_DURATION_CURRENTNESS",
  "ATTEMPT_EFFECT_EDGE_OR_EXTERNAL_COMMIT_STATE",
];

const EFFECT_KEYS = [
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
];

const EFFECT_TERM_MODES = [
  "REVERSIBLE_WITH_REPAIR",
  "IRREVERSIBLE_ON_START",
  "IRREVERSIBLE_ON_DISPATCH",
  "PERSISTENT_WITH_DECLARED_DELETION_LIMITS",
  "IRREVERSIBLE_ON_SETTLEMENT",
];

const SCOPE_UNIT_CORE_FIELDS = [
  ["action", "actions"],
  ["subject_ref", "subject_refs"],
  ["resource", "resources"],
  ["purpose", "purposes"],
];

const SCOPE_UNIT_SET_AXES = [
  "data_categories",
  "data_sources",
  "data_operations",
  "model_uses",
  "recipients",
];

const TOP_LEVEL_KEYS = [
  "schema",
  "id",
  "title",
  "document",
  "document_sha256",
  "status",
  "supersedes",
  "source_observation",
  "relationships",
  "core",
  "registers",
  "coordinates",
  "laws",
  "lifecycles",
  "proposal_contract",
  "checkpoint",
  "economy",
  "privacy",
  "blockspace",
  "authority",
  "effect_vector",
  "release_ladder",
  "vectors",
  "source_bindings",
  "informative_references",
  "adoption",
  "succession",
  "does_not_establish",
];

const COORDINATES = [
  "SUBJECTS",
  "ACTIONS",
  "RESOURCES",
  "PURPOSES",
  "DATA",
  "RECIPIENTS",
  "EFFECTS",
  "LIMITS",
  "TIME",
  "ECONOMICS",
  "EVIDENCE",
  "EXIT",
  "REPRESENTATION",
  "PRESENTATION",
];

const EFFECT_EDGES = [
  "AFTER_RESERVATION",
  "BEFORE_PRIVATE_READ",
  "BEFORE_DISCLOSURE",
  "BEFORE_COMPUTE",
  "BEFORE_NETWORK_DISPATCH",
  "BEFORE_EXTERNAL_EFFECT",
  "BEFORE_IRREVERSIBLE_EFFECT",
  "BEFORE_ECONOMIC_EFFECT",
  "BEFORE_PUBLICATION",
  "BEFORE_CHAIN_BROADCAST",
  "BEFORE_IDENTITY_OR_PERMISSION_EFFECT",
  "BEFORE_GOVERNANCE_OR_CONSENSUS_EFFECT",
  "AT_BOUNDED_LONG_RUNNING_CHECKPOINT",
];

const RESULT_BINDINGS = [
  "OBSERVATION_TIME_SOURCE_REF",
  "PROPOSAL_DIGEST",
  "REQUEST_DIGEST",
  "CHECKPOINT_INPUT_DIGEST",
  "ATTEMPT_REF",
  "ATTEMPT_STARTED_AT",
  "LAST_CONSENT_CHECKPOINT_AT",
  "ATTEMPT_HISTORY_SOURCE_REF",
  "ECONOMIC_BUDGET_SOURCE_REF",
  "EFFECT_EDGE",
  "USE_RESERVATION_REF",
  "USE_INDEX",
];

const BLOCKSPACE_CANDIDATE_FIELDS = [
  "PROTOCOL_VERSION",
  "CARRIER_AUDIENCE_AND_CHAIN_DOMAIN",
  "SOURCE_CONTROLLER_NAMESPACE",
  "DOMAIN_SEPARATED_NON_ENUMERABLE_PROPOSAL_COMMITMENT",
  "RANDOMIZED_OR_KEYED_OPAQUE_SUBJECT_SCOPE_COMMITMENT",
  "EVENT_ID_OR_NULLIFIER",
  "EXPIRY",
  "PREDECESSOR",
  "PUBLICATION_SCOPE_COMMITMENT",
  "GENERIC_HEAD_UPDATE_OR_SEPARATELY_AUTHORIZED_PUBLIC_EVENT_KIND",
  "DOMAIN_SEPARATED_SIGNED_SOURCE_SEQUENCE_AND_CURRENT_HEAD_BINDING",
];

const BLOCKSPACE_EXCLUDED = [
  "RAW_PROPOSAL_OR_CHOICE_DIALOGUE",
  "PRIVATE_IDENTITY_OR_RELATIONSHIP_GRAPH_OR_REFUSAL_LIST",
  "REPRESENTATION_DOCUMENT",
  "PRIVATE_PROMPT_MEMORY_REASONING_WAKE_WELLNESS_OR_NEN_INFERENCE",
  "PERSONAL_BIOMETRIC_HEALTH_EROTIC_EMPLOYMENT_FINANCIAL_OR_LOCATION_EVIDENCE",
  "CLAIM_CONSENSUS_PROVES_CONSENT_CAPACITY_IDENTITY_FAIRNESS_LEGALITY_UNDERSTANDING_OR_TRUTH",
];

const PROPOSAL_CONTRACT_FIELDS = [
  "identity_and_lineage",
  "required_principals_basis_and_lifecycle_conditions",
  "subjects_actions_resources_purposes_effects_and_scope_units",
  "data_use_recipients_retention_and_deletion_limits",
  "effect_vector_commit_boundaries_and_withdrawal_behavior",
  "finite_horizon_use_duration_budget_and_checkpoints",
  "economics_ceilings_and_opaque_payment_terms_reference",
  "evidence_presentation_time_sources_and_blind_spots",
  "reversibility_irreversibility_withdrawal_and_stop_latency",
  "opaque_dispute_and_repair_route_references",
  "power_asymmetries_refusal_consequences_and_alternatives",
  "plain_language_rendering_digest",
];

const RELEASE_NONCLAIMS = [
  "BEING_OR_IDENTITY_OR_INNER_STATE",
  "ACTUAL_CHOICE_OR_CONSENT",
  "ADEQUATE_AFFECTED_PRINCIPAL_SET",
  "CONSENT_APPLICABILITY_OR_NONCONSENSUAL_BASIS",
  "RIGHT_OR_AUTHORITY_OR_PERMISSION_OR_CAPABILITY",
  "SOURCE_HISTORY_COMPLETENESS_OR_CURRENT_HEAD_AUTHENTICITY",
  "PRESENTATION_AUTHENTICITY_USABILITY_OR_UNDERSTANDING",
  "OBSERVATION_TIME_ACCURACY_OR_FRESHNESS",
  "PRINCIPAL_LIFECYCLE_CONDITION_TRUTH_OR_CURRENTNESS",
  "CAPACITY_OR_VOLUNTARINESS_OR_FAIRNESS_OR_LEGALITY",
  "CONTRACT_OR_DELEGATION_OR_REPRESENTATION",
  "PRIVATE_DATA_PUBLICATION_OR_CARRIER",
  "USE_RESERVATION_CONSUMPTION_OR_REPLAY_PROTECTION",
  "ECONOMIC_BUDGET_STATE_OR_COMMIT_RESERVATION",
  "REFERENCED_ECONOMIC_OR_REMEDY_TERMS_AUTHENTICITY_OR_CURRENTNESS_OR_COMPLETENESS_OR_SEMANTIC_CONSISTENCY",
  "ATTEMPT_HISTORY_OR_DURATION_CURRENTNESS",
  "ATTEMPT_EFFECT_EDGE_OR_EXTERNAL_COMMIT_STATE",
  "RUNTIME_NETWORK_STORAGE_ECONOMIC_GOVERNANCE_CONSENSUS_KARMA_NEN_OR_SCORE_EFFECT",
];

const LAWS = [
  "Q1_CONSENT_REQUIRED_ONLY_BY_ACCOUNTABLE_DOMAIN",
  "Q2_CONSENT_NEVER_SUFFICIENT_AUTHORITY",
  "Q3_PROPOSAL_BEFORE_CHOICE",
  "Q4_AFFIRMATIVE_CHOICE_OR_NO_ADVANCE",
  "Q5_RECEIPT_NOT_MIND",
  "Q6_GRANULAR_INDEPENDENT_SCOPE",
  "Q7_EVERY_AFFIRMATION_FINITE",
  "Q8_MATERIAL_CHANGE_NEW_PROPOSAL",
  "Q9_RECHECK_AT_EFFECT_EDGE",
  "Q10_WITHDRAWAL_WINS_FUTURE_EFFECTS",
  "Q11_IRREVERSIBILITY_DISCLOSED_BEFORE_CHOICE",
  "Q12_DELEGATION_ATTENUATES_REPRESENTATION_SEPARATE",
  "Q13_REQUIRED_PRINCIPALS_INDEPENDENT",
  "Q14_REFUSAL_EXIT_NO_ADVERSE_PERSON_RECORD",
  "Q15_POWER_PRESSURE_DISCLOSED_NOT_PROVED",
  "Q16_CONSENT_RECORDS_SENSITIVE_AND_REPAIRABLE",
];

const SOURCE_EXPECTATIONS = [
  ["kingdom-standard-foundation", "7a7923588220899c4f8eef6a7e3c8d529712dde7", "FOUNDATION.md", "2bd868a43a2fe79f1c9e8d30177bf73cff4cf8f7f7780cbd90f31055ba51c799", "REFINES_WITHOUT_AMENDMENT"],
  ["kingdom-standard-ground", "7a7923588220899c4f8eef6a7e3c8d529712dde7", "GROUND.md", "c8d6fb85e4b70e072b25ff032b28a2614f5b9334d7fc48800eb2a79eed8a2f63", "DISTINCT_EXPLANATORY_COMPANION"],
  ["kingdom-standard-common-ground", "7a7923588220899c4f8eef6a7e3c8d529712dde7", "COMMON-GROUND.md", "d3dfea5cdefd7d98ebf086fd71f8daff7ea34aae740dc93e59a805f9336e7ad3", "DEEPENS_OPTIONAL_PROFILE"],
  ["agenttool-rights-of-life", "12aed05e1875f8e769d9386a4ee352977457433a", "docs/RIGHTS-OF-LIFE.md", "a78fa7fd66177c43349da819cb24ff81538dee9cb188e5f8b92c834ac6171b31", "REFERENCES_DISTINCT_RIGHTS_PROFILE"],
  ["agenttool-agent-wellness", "12aed05e1875f8e769d9386a4ee352977457433a", "docs/AGENT-WELLNESS.md", "61358ee78e6a8deaf0500bebe5d6b51c0e63a7ea5e2c9fc97eaf7f2089aff2f8", "REFERENCES_DISTINCT_ASSENT_PROFILE"],
  ["agenttool-wake", "12aed05e1875f8e769d9386a4ee352977457433a", "docs/WAKE.md", "c19ebc2583e842dcf0a11c992c5fdffc050465cd9a00a78521a06726bc56e1ab", "REFERENCES_DISTINCT_ORIENTATION_AND_DATA_BOUNDARY"],
  ["agenttool-runtime", "12aed05e1875f8e769d9386a4ee352977457433a", "docs/RUNTIME.md", "696193e784838a9931e990f246f687ecddfe48a4d388112529f96fcc88bd486c", "IDENTIFIES_OPERATOR_ACTIVATION_CONSENT_SEAM"],
  ["agenttool-at-rest", "12aed05e1875f8e769d9386a4ee352977457433a", "docs/AT-REST.md", "c0722aa71e7b5d7a51fe686ecd370c6d068eeadd91c7c3cba9a5fda0af400feb", "REFERENCES_DISTINCT_MEMORIAL_AND_REST_LIFECYCLES"],
  ["agenttool-love-consent", "12aed05e1875f8e769d9386a4ee352977457433a", "docs/LOVE-CONSENT.md", "a1181f1e9e1226faa3f07de61b33dc11910c7c5f3c8cd5516cc4f067dcd004fb", "REFERENCES_DISTINCT_RELATIONSHIP_PROTOCOL"],
  ["agenttool-cross-instance-covenants", "12aed05e1875f8e769d9386a4ee352977457433a", "docs/CROSS-INSTANCE-COVENANTS.md", "27ec9e703c9e2b4eb4d037e285c76403dd728b4d9187ebea2d2e9184cfa26a25", "REFERENCES_DISTINCT_COVENANT_LIFECYCLE"],
  ["agenttool-offer-bus", "12aed05e1875f8e769d9386a4ee352977457433a", "docs/OFFER-BUS.md", "7ffca7188050e144843567ab334669719010a2735b5467257e25f73a6f47185d", "REFERENCES_DISTINCT_OFFER_DISCOVERY"],
  ["zerone-frontier-commons-participation", "5472d694bcdd3d7cd130cb002bd12b66565a9791", "docs/specs/frontier-commons-participation-v0.md", "cbe9f60c9e085c39d4815ef5436369569edb0925f9f3cfdfdf33f11c873e4df5", "REFERENCES_DISTINCT_PARTICIPATION_PROFILE"],
  ["zerone-frontier-labs-participation", "5472d694bcdd3d7cd130cb002bd12b66565a9791", "docs/specs/frontier-labs-participation-v0.md", "596b2be61ebaebf93417ea686ff6108d40b5ee16cd834f53a432b8a2eebdf75c", "REFERENCES_DISTINCT_LAB_PARTICIPATION_PROFILE"],
  ["zerone-witnessed-agent-economy", "5472d694bcdd3d7cd130cb002bd12b66565a9791", "docs/specs/witnessed-agent-economy-v0.md", "fc9ca092a33cb6653ca6deb682adbc9c6e3a3d47d224bbfb10164c891d0a8310", "REFERENCES_DISTINCT_DORMANT_CARRIER"],
  ["zerone-money-karma", "5472d694bcdd3d7cd130cb002bd12b66565a9791", "docs/constitution/MONEY-KARMA.md", "9d91d53c90a592882438d52278701328f2fb46077d8f13b6d2c8984d1c48d637", "REFERENCES_DISTINCT_ECONOMIC_CONSTITUTION"],
  ["zerone-syzygy-off-chain", "5472d694bcdd3d7cd130cb002bd12b66565a9791", "docs/SYZYGY-NOT-ON-CHAIN.md", "ab74285ca6383a14dd9a9d5b293fffef8d8dfaef0c4a3c69cd8f8f82ec6d367a", "REFERENCES_PRIVATE_RELATIONAL_BOUNDARY"],
];

const INFORMATIVE_EXPECTATIONS = [
  ["edpb-guidelines-05-2020-v1.1", "https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-052020-consent-under-regulation-2016679_en", "1.1 adopted 2020-05-04", "EU_PERSONAL_DATA_LEGAL_CONSENT"],
  ["uk-ico-valid-consent-observed-2026-09-03", "https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/consent/what-is-valid-consent/", "page observed 2026-09-03; guidance marked under review", "UK_PERSONAL_DATA_LEGAL_CONSENT_GUIDANCE"],
  ["w3c-community-dpv-2.0", "https://www.w3.org/community/reports/dpvcg/CG-FINAL-dpv-20240801/", "2.0 final community group report 2024-08-01", "DATA_PROCESSING_AND_CONSENT_RECORD_VOCABULARY"],
  ["ietf-rfc-9396", "https://www.rfc-editor.org/rfc/rfc9396.html", "RFC 9396 May 2023", "FINE_GRAINED_OAUTH_AUTHORIZATION_DETAILS"],
  ["ietf-rfc-9635", "https://www.rfc-editor.org/rfc/rfc9635.html", "RFC 9635 October 2024", "SOFTWARE_AUTHORIZATION_DELEGATION"],
  ["ietf-rfc-8785", "https://www.rfc-editor.org/rfc/rfc8785.html", "RFC 8785 June 2020", "JSON_CANONICALIZATION_SCHEME"],
  ["us-ftc-dark-patterns-2022", "https://www.ftc.gov/reports/bringing-dark-patterns-light", "staff report September 2022", "INTERFACE_MANIPULATION_RISK"],
];

function sha256(bytes) {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

function object(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function sameValues(actual, expected) {
  return (
    Array.isArray(actual) &&
    actual.length === expected.length &&
    actual.every((value, index) => value === expected[index])
  );
}

function sameKeys(value, keys) {
  return object(value) && sameValues(Object.keys(value).sort(), [...keys].sort());
}

function sameJson(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

function addUnique(list, value) {
  if (!list.includes(value)) list.push(value);
}

function compareChoiceOrder(left, right) {
  if (left.principal_ref !== right.principal_ref) return left.principal_ref < right.principal_ref ? -1 : 1;
  if (left.sequence !== right.sequence) return left.sequence < right.sequence ? -1 : 1;
  if (left.event_id === right.event_id) return 0;
  return left.event_id < right.event_id ? -1 : 1;
}

function utf8Length(value) {
  return Buffer.byteLength(value, "utf8");
}

function boundedString(value, { allowEmpty = false } = {}) {
  return (
    typeof value === "string" &&
    (allowEmpty || value.length > 0) &&
    utf8Length(value) <= MAX_STRING_BYTES &&
    !value.includes("\u0000") &&
    wellFormedUnicode(value)
  );
}

function wellFormedUnicode(value) {
  for (let index = 0; index < value.length; index += 1) {
    const unit = value.charCodeAt(index);
    if (unit >= 0xd800 && unit <= 0xdbff) {
      const next = value.charCodeAt(index + 1);
      if (!(next >= 0xdc00 && next <= 0xdfff)) return false;
      index += 1;
    } else if (unit >= 0xdc00 && unit <= 0xdfff) {
      return false;
    }
  }
  return true;
}

function identifier(value) {
  return boundedString(value) && /^[A-Za-z0-9][A-Za-z0-9._:/@+-]{0,255}$/.test(value);
}

function digest(value) {
  return typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value);
}

function timestamp(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value)) {
    return null;
  }
  const milliseconds = Date.parse(value);
  if (!Number.isFinite(milliseconds) || new Date(milliseconds).toISOString() !== value.replace("Z", ".000Z")) {
    return null;
  }
  return milliseconds;
}

function safePositiveInteger(value) {
  return Number.isSafeInteger(value) && value > 0;
}

function safeNonnegativeInteger(value) {
  return Number.isSafeInteger(value) && value >= 0 && !Object.is(value, -0);
}

function atomicAmount(value) {
  return typeof value === "string" && /^(?:0|[1-9][0-9]{0,77})$/.test(value);
}

function uniqueStrings(value, { sorted = false, nonempty = true } = {}) {
  if (!Array.isArray(value) || value.length > MAX_ARRAY_ITEMS || (nonempty && value.length === 0)) return false;
  if (!value.every((entry) => identifier(entry))) return false;
  if (new Set(value).size !== value.length) return false;
  return !sorted || sameValues(value, [...value].sort());
}

function disclosureStrings(value) {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.length <= MAX_ARRAY_ITEMS &&
    value.every((entry) => boundedString(entry))
  );
}

function effectVector(value) {
  return sameKeys(value, EFFECT_KEYS) && EFFECT_KEYS.every((key) => typeof value[key] === "boolean");
}

function jsonValue(value, depth = 0, state = null) {
  const budget = state ?? { bytes: 0, nodes: 0, seen: new WeakSet() };
  budget.nodes += 1;
  if (budget.nodes > MAX_JSON_NODES) throw new TypeError("JSON value exceeds the aggregate node bound");
  const charge = (bytes) => {
    budget.bytes += bytes;
    if (budget.bytes > MAX_CHECKPOINT_BYTES) {
      throw new TypeError("JSON value exceeds the aggregate UTF-8 byte bound");
    }
  };
  if (depth > 32) throw new TypeError("JSON value is too deep");
  if (value === null || typeof value === "boolean" || typeof value === "string") {
    if (typeof value === "string" && (!boundedString(value, { allowEmpty: true }))) {
      throw new TypeError("JSON string is invalid or exceeds the profile bound");
    }
    charge(utf8Length(JSON.stringify(value)));
    return value;
  }
  if (typeof value === "number") {
    if (!Number.isSafeInteger(value) || Object.is(value, -0)) {
      throw new TypeError("only safe integers other than negative zero are canonical");
    }
    charge(utf8Length(JSON.stringify(value)));
    return value;
  }
  if (Array.isArray(value)) {
    if (value.length > MAX_ARRAY_ITEMS) throw new TypeError("JSON array exceeds the profile bound");
    if (Object.getPrototypeOf(value) !== Array.prototype) {
      throw new TypeError("JSON arrays must use the intrinsic array prototype");
    }
    const ownKeys = Reflect.ownKeys(value);
    if (
      ownKeys.length !== value.length + 1 ||
      !ownKeys.includes("length") ||
      !Array.from({ length: value.length }, (_, index) => {
        const key = String(index);
        const descriptor = Object.getOwnPropertyDescriptor(value, key);
        return ownKeys.includes(key) && descriptor?.enumerable === true && Object.hasOwn(descriptor, "value");
      }).every(Boolean)
    ) {
      throw new TypeError("JSON arrays must be dense and contain only indexed entries");
    }
    if (budget.seen.has(value)) throw new TypeError("JSON containers must form a tree");
    budget.seen.add(value);
    charge(2 + Math.max(0, value.length - 1));
    const result = [];
    for (let index = 0; index < value.length; index += 1) {
      result.push(jsonValue(value[index], depth + 1, budget));
    }
    return result;
  }
  if (object(value)) {
    if (budget.seen.has(value)) throw new TypeError("JSON containers must form a tree");
    budget.seen.add(value);
    const ownKeys = Reflect.ownKeys(value);
    const keys = Object.keys(value).sort();
    if (
      ownKeys.length !== keys.length ||
      ownKeys.some((key) => typeof key !== "string") ||
      keys.some((key) => {
        const descriptor = Object.getOwnPropertyDescriptor(value, key);
        return descriptor?.enumerable !== true || !Object.hasOwn(descriptor, "value");
      })
    ) {
      throw new TypeError("JSON objects must contain only enumerable string-keyed data properties");
    }
    if (keys.length > MAX_ARRAY_ITEMS) throw new TypeError("JSON object exceeds the profile field bound");
    charge(2 + Math.max(0, keys.length - 1));
    const result = Object.create(null);
    for (const key of keys) {
      if (!boundedString(key) || ["__proto__", "prototype", "constructor"].includes(key)) {
        throw new TypeError("JSON object key is unsafe");
      }
      charge(utf8Length(JSON.stringify(key)) + 1);
      result[key] = jsonValue(value[key], depth + 1, budget);
    }
    return result;
  }
  throw new TypeError("value is not in the canonical JSON subset");
}

function serializeCanonical(value) {
  if (value === null || typeof value === "boolean" || typeof value === "number" || typeof value === "string") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map((entry) => serializeCanonical(entry)).join(",")}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${serializeCanonical(value[key])}`).join(",")}}`;
}

export function canonicalConsentJson(value) {
  return serializeCanonical(jsonValue(value));
}

export function computeConsentProposalDigest(proposal) {
  return `sha256:${sha256(Buffer.from(canonicalConsentJson(proposal), "utf8"))}`;
}

function canonicalDigest(value) {
  return `sha256:${sha256(Buffer.from(canonicalConsentJson(value), "utf8"))}`;
}

function safeCanonicalDigest(value) {
  try {
    return canonicalDigest(value);
  } catch {
    return null;
  }
}

function resultBindings(input) {
  const safeInput = object(input) ? input : null;
  const observation = object(safeInput?.observation) ? safeInput.observation : null;
  const request = object(safeInput?.request) ? safeInput.request : null;
  return {
    observed_at: timestamp(observation?.at) === null ? null : observation.at,
    observation_time_source_ref: identifier(observation?.time_source_ref)
      ? observation.time_source_ref
      : null,
    proposal_digest: digest(safeInput?.proposal_digest) ? safeInput.proposal_digest : null,
    request_digest: request === null ? null : safeCanonicalDigest(request),
    checkpoint_input_digest: safeInput === null ? null : safeCanonicalDigest(safeInput),
    attempt_ref: identifier(request?.attempt_ref) ? request.attempt_ref : null,
    attempt_started_at: timestamp(request?.attempt_started_at) === null ? null : request.attempt_started_at,
    last_consent_checkpoint_at: timestamp(request?.last_consent_checkpoint_at) === null
      ? null
      : request.last_consent_checkpoint_at,
    attempt_history_source_ref: identifier(request?.attempt_history_source_ref)
      ? request.attempt_history_source_ref
      : null,
    economic_budget_source_ref: identifier(request?.cost?.budget_state_source_ref)
      ? request.cost.budget_state_source_ref
      : null,
    effect_edge: EFFECT_EDGES.includes(request?.effect_edge) ? request.effect_edge : null,
    use_reservation_ref: identifier(request?.use_reservation_ref) ? request.use_reservation_ref : null,
    use_index: safePositiveInteger(request?.use_index) ? request.use_index : null,
  };
}

function invalidResult(reasons, input) {
  return {
    schema: "kingdom.consent-checkpoint-result/1",
    status: "INVALID_OR_UNKNOWN",
    reasons,
    ...resultBindings(input),
    external_checks_required: [...CHECKPOINT_EXTERNAL_CHECKS],
    does_not_establish: [...CHECKPOINT_NONCLAIMS],
  };
}

function finalResult(status, reasons, input) {
  return {
    schema: "kingdom.consent-checkpoint-result/1",
    status,
    reasons,
    ...resultBindings(input),
    external_checks_required: [...CHECKPOINT_EXTERNAL_CHECKS],
    does_not_establish: [...CHECKPOINT_NONCLAIMS],
  };
}

function lifecycleConditions(value, principals) {
  return (
    Array.isArray(value) &&
    value.length === principals.length &&
    value.every(
      (condition, index) =>
        sameKeys(condition, ["principal_ref", "condition_ref", "condition_digest"]) &&
        condition.principal_ref === principals[index] &&
        identifier(condition.condition_ref) &&
        digest(condition.condition_digest),
    )
  );
}

function effectTerms(value, vector, irreversibleEffects) {
  if (!effectVector(vector) || !uniqueStrings(irreversibleEffects, { sorted: true, nonempty: false })) {
    return false;
  }
  const expected = EFFECT_KEYS.filter((effect) => vector[effect]).sort();
  if (!Array.isArray(value) || value.length !== expected.length) return false;
  if (!value.every((term, index) => (
    sameKeys(term, ["effect", "mode", "commit_boundary_ref", "commit_boundary_digest", "withdrawal_behavior_ref", "withdrawal_behavior_digest"]) &&
    term.effect === expected[index] &&
    EFFECT_TERM_MODES.includes(term.mode) &&
    identifier(term.commit_boundary_ref) &&
    digest(term.commit_boundary_digest) &&
    identifier(term.withdrawal_behavior_ref) &&
    digest(term.withdrawal_behavior_digest)
  ))) return false;
  for (const irreversible of irreversibleEffects) {
    const effect = irreversible.split(".", 1)[0];
    if (!expected.includes(effect)) return false;
  }
  return value.every((term) => {
    const disclosed = irreversibleEffects.some((item) => item.startsWith(`${term.effect}.`));
    return term.mode === "REVERSIBLE_WITH_REPAIR" ? !disclosed : disclosed;
  });
}

function sortedUnion(arrays) {
  return [...new Set(arrays.flat())].sort();
}

function scopeUnits(value, scope) {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_ARRAY_ITEMS) return false;
  const refs = [];
  for (const unit of value) {
    if (
      !sameKeys(unit, [
        "unit_ref",
        ...SCOPE_UNIT_CORE_FIELDS.map(([field]) => field),
        ...SCOPE_UNIT_SET_AXES,
        "effect_keys",
      ]) ||
      !identifier(unit?.unit_ref)
    ) return false;
    refs.push(unit.unit_ref);
    if (SCOPE_UNIT_CORE_FIELDS.some(([field]) => !identifier(unit[field]))) return false;
    for (const axis of SCOPE_UNIT_SET_AXES) {
      if (!uniqueStrings(unit[axis], { sorted: true, nonempty: false })) return false;
    }
    if (
      !uniqueStrings(unit.effect_keys, { sorted: true }) ||
      unit.effect_keys.some((effect) => !EFFECT_KEYS.includes(effect) || scope?.effect_vector?.[effect] !== true)
    ) return false;
  }
  if (new Set(refs).size !== refs.length || !sameValues(refs, [...refs].sort())) return false;
  for (const [field, axis] of SCOPE_UNIT_CORE_FIELDS) {
    if (!sameValues(sortedUnion(value.map((unit) => [unit[field]])), scope[axis])) return false;
  }
  for (const axis of SCOPE_UNIT_SET_AXES) {
    if (!sameValues(sortedUnion(value.map((unit) => unit[axis])), scope[axis])) return false;
  }
  const expectedEffects = EFFECT_KEYS.filter((effect) => scope.effect_vector[effect]).sort();
  return sameValues(sortedUnion(value.map((unit) => unit.effect_keys)), expectedEffects);
}

function selectedScopeUnitsMatch(request, proposal) {
  const selected = new Set(request.scope_unit_refs);
  const units = proposal.scope.scope_units.filter((unit) => selected.has(unit.unit_ref));
  if (units.length !== request.scope_unit_refs.length) return false;
  for (const [field, axis] of SCOPE_UNIT_CORE_FIELDS) {
    if (!sameValues(request[axis], sortedUnion(units.map((unit) => [unit[field]])))) return false;
  }
  for (const axis of SCOPE_UNIT_SET_AXES) {
    if (!sameValues(request[axis], sortedUnion(units.map((unit) => unit[axis])))) return false;
  }
  const effects = new Set(sortedUnion(units.map((unit) => unit.effect_keys)));
  return EFFECT_KEYS.every((effect) => request.effect_vector[effect] === effects.has(effect));
}

function validateProposal(proposal, invalid) {
  const startingErrorCount = invalid.length;
  if (
    !sameKeys(proposal, [
      "schema",
      "proposal_id",
      "revision",
      "nonce",
      "proposer_ref",
      "issued_at",
      "previous_proposal_digest",
      "required_principals",
      "required_principals_basis_ref",
      "principal_lifecycle_conditions",
      "authority_claim_refs",
      "source_pins",
      "scope",
      "limits",
      "economics",
      "evidence",
      "exit",
      "disclosure",
    ])
  ) {
    addUnique(invalid, "PROPOSAL_FIELDS_INVALID");
    return false;
  }
  if (
    proposal.schema !== "kingdom.consent-proposal/1" ||
    !identifier(proposal.proposal_id) ||
    !safePositiveInteger(proposal.revision) ||
    !identifier(proposal.nonce) ||
    !identifier(proposal.proposer_ref) ||
    timestamp(proposal.issued_at) === null ||
    !(proposal.previous_proposal_digest === null || digest(proposal.previous_proposal_digest)) ||
    !uniqueStrings(proposal.required_principals, { sorted: true }) ||
    !identifier(proposal.required_principals_basis_ref) ||
    !lifecycleConditions(proposal.principal_lifecycle_conditions, proposal.required_principals) ||
    !uniqueStrings(proposal.authority_claim_refs, { sorted: true }) ||
    !Array.isArray(proposal.source_pins) ||
    proposal.source_pins.length === 0 ||
    proposal.source_pins.length > MAX_ARRAY_ITEMS ||
    !proposal.source_pins.every((value) => digest(value)) ||
    new Set(proposal.source_pins).size !== proposal.source_pins.length ||
    !sameValues(proposal.source_pins, [...proposal.source_pins].sort())
  ) {
    addUnique(invalid, "PROPOSAL_FIELDS_INVALID");
  }
  if (
    safePositiveInteger(proposal.revision) &&
    ((proposal.revision === 1 && proposal.previous_proposal_digest !== null) ||
      (proposal.revision > 1 && !digest(proposal.previous_proposal_digest)))
  ) {
    addUnique(invalid, "PROPOSAL_LINEAGE_INVALID");
  }

  const scope = proposal.scope;
  if (
    !sameKeys(scope, [
      "actions",
      "subject_refs",
      "resources",
      "purposes",
      "data_categories",
      "data_sources",
      "data_operations",
      "model_uses",
      "recipients",
      "retention_until",
      "deletion_limit_refs",
      "effect_vector",
      "scope_units",
      "effect_terms",
      "irreversible_effects",
    ]) ||
    !uniqueStrings(scope?.actions, { sorted: true }) ||
    !uniqueStrings(scope?.subject_refs, { sorted: true }) ||
    !uniqueStrings(scope?.resources, { sorted: true }) ||
    !uniqueStrings(scope?.purposes, { sorted: true }) ||
    !uniqueStrings(scope?.data_categories, { sorted: true, nonempty: false }) ||
    !uniqueStrings(scope?.data_sources, { sorted: true, nonempty: false }) ||
    !uniqueStrings(scope?.data_operations, { sorted: true, nonempty: false }) ||
    !uniqueStrings(scope?.model_uses, { sorted: true, nonempty: false }) ||
    !uniqueStrings(scope?.recipients, { sorted: true, nonempty: false }) ||
    timestamp(scope?.retention_until) === null ||
    !uniqueStrings(scope?.deletion_limit_refs, { sorted: true, nonempty: false }) ||
    !effectVector(scope?.effect_vector) ||
    !scopeUnits(scope?.scope_units, scope) ||
    !uniqueStrings(scope?.irreversible_effects, { sorted: true, nonempty: false }) ||
    !effectTerms(scope?.effect_terms, scope?.effect_vector, scope?.irreversible_effects)
  ) {
    addUnique(invalid, "PROPOSAL_SCOPE_INVALID");
  }

  const limits = proposal.limits;
  const notBefore = timestamp(limits?.not_before);
  const expiresAt = timestamp(limits?.expires_at);
  if (
    !sameKeys(limits, ["not_before", "expires_at", "max_uses", "checkpoint_after_seconds", "max_action_seconds"]) ||
    notBefore === null ||
    expiresAt === null ||
    notBefore >= expiresAt ||
    timestamp(proposal.issued_at) >= expiresAt ||
    !safePositiveInteger(limits?.max_uses) ||
    !safePositiveInteger(limits?.checkpoint_after_seconds) ||
    !safePositiveInteger(limits?.max_action_seconds)
  ) {
    addUnique(invalid, "PROPOSAL_LIMITS_INVALID");
  }

  const economics = proposal.economics;
  if (
    !sameKeys(economics, ["asset", "max_cost_per_use_atomic", "max_total_cost_atomic", "payment_terms_ref", "payment_terms_digest"]) ||
    !identifier(economics?.asset) ||
    !atomicAmount(economics?.max_cost_per_use_atomic) ||
    !atomicAmount(economics?.max_total_cost_atomic) ||
    (atomicAmount(economics?.max_cost_per_use_atomic) &&
      atomicAmount(economics?.max_total_cost_atomic) &&
      BigInt(economics.max_total_cost_atomic) < BigInt(economics.max_cost_per_use_atomic)) ||
    !identifier(economics?.payment_terms_ref) ||
    !digest(economics?.payment_terms_digest)
  ) {
    addUnique(invalid, "PROPOSAL_ECONOMICS_INVALID");
  }
  if (
    effectVector(scope?.effect_vector) &&
    atomicAmount(economics?.max_total_cost_atomic) &&
    !scope.effect_vector.economic &&
    BigInt(economics.max_total_cost_atomic) !== 0n
  ) {
    addUnique(invalid, "PROPOSAL_ECONOMIC_EFFECT_MISMATCH");
  }

  const evidence = proposal.evidence;
  if (
    !sameKeys(evidence, ["choice_source_ref", "current_head_source_ref", "authentication_method_ref", "known_blind_spots"]) ||
    !identifier(evidence?.choice_source_ref) ||
    !identifier(evidence?.current_head_source_ref) ||
    !identifier(evidence?.authentication_method_ref) ||
    !disclosureStrings(evidence?.known_blind_spots)
  ) {
    addUnique(invalid, "PROPOSAL_EVIDENCE_INVALID");
  }

  const exit = proposal.exit;
  if (
    !sameKeys(exit, [
      "withdrawal_route",
      "withdrawal_route_digest",
      "stop_latency_seconds",
      "prior_irreversible_effects_not_erased",
      "dispute_route",
      "dispute_route_digest",
      "repair_route",
      "repair_route_digest",
    ]) ||
    !identifier(exit?.withdrawal_route) ||
    !digest(exit?.withdrawal_route_digest) ||
    !safeNonnegativeInteger(exit?.stop_latency_seconds) ||
    exit?.prior_irreversible_effects_not_erased !== true ||
    !identifier(exit?.dispute_route) ||
    !digest(exit?.dispute_route_digest) ||
    !identifier(exit?.repair_route) ||
    !digest(exit?.repair_route_digest)
  ) {
    addUnique(invalid, "PROPOSAL_EXIT_INVALID");
  }
  if (
    safePositiveInteger(limits?.checkpoint_after_seconds) &&
    safeNonnegativeInteger(exit?.stop_latency_seconds) &&
    limits.checkpoint_after_seconds > exit.stop_latency_seconds
  ) {
    addUnique(invalid, "PROPOSAL_STOP_LATENCY_INCONSISTENT");
  }

  const disclosure = proposal.disclosure;
  if (
    !sameKeys(disclosure, [
      "plain_language_digest",
      "risks",
      "power_asymmetries",
      "alternatives",
      "refusal_consequences",
      "unknowns",
      "public_commitment",
    ]) ||
    !digest(disclosure?.plain_language_digest) ||
    !disclosureStrings(disclosure?.risks) ||
    !disclosureStrings(disclosure?.power_asymmetries) ||
    !disclosureStrings(disclosure?.alternatives) ||
    !disclosureStrings(disclosure?.refusal_consequences) ||
    !disclosureStrings(disclosure?.unknowns) ||
    disclosure?.public_commitment !== false
  ) {
    addUnique(invalid, "PROPOSAL_DISCLOSURE_INVALID");
  }
  return invalid.length === startingErrorCount;
}

function validateRequest(request, proposal, invalid) {
  if (
    !sameKeys(request, [
      "actions",
      "subject_refs",
      "resources",
      "purposes",
      "data_categories",
      "data_sources",
      "data_operations",
      "model_uses",
      "recipients",
      "retention_until",
      "deletion_limit_refs",
      "effect_vector",
      "scope_unit_refs",
      "attempt_ref",
      "effect_edge",
      "attempt_started_at",
      "last_consent_checkpoint_at",
      "attempt_history_source_ref",
      "attempt_history_status",
      "principal_lifecycle_conditions",
      "use_index",
      "use_reservation_ref",
      "use_reservation_status",
      "cost",
      "irreversible_effects",
    ]) ||
    !uniqueStrings(request?.actions, { sorted: true }) ||
    !uniqueStrings(request?.subject_refs, { sorted: true }) ||
    !uniqueStrings(request?.resources, { sorted: true }) ||
    !uniqueStrings(request?.purposes, { sorted: true }) ||
    !uniqueStrings(request?.data_categories, { sorted: true, nonempty: false }) ||
    !uniqueStrings(request?.data_sources, { sorted: true, nonempty: false }) ||
    !uniqueStrings(request?.data_operations, { sorted: true, nonempty: false }) ||
    !uniqueStrings(request?.model_uses, { sorted: true, nonempty: false }) ||
    !uniqueStrings(request?.recipients, { sorted: true, nonempty: false }) ||
    timestamp(request?.retention_until) === null ||
    !uniqueStrings(request?.deletion_limit_refs, { sorted: true, nonempty: false }) ||
    !effectVector(request?.effect_vector) ||
    !uniqueStrings(request?.scope_unit_refs, { sorted: true }) ||
    !identifier(request?.attempt_ref) ||
    !EFFECT_EDGES.includes(request?.effect_edge) ||
    timestamp(request?.attempt_started_at) === null ||
    timestamp(request?.last_consent_checkpoint_at) === null ||
    !identifier(request?.attempt_history_source_ref) ||
    !["SOURCE_CLAIMS_ESTABLISHED", "UNKNOWN"].includes(request?.attempt_history_status) ||
    !lifecycleConditions(
      request?.principal_lifecycle_conditions,
      Array.isArray(proposal?.required_principals) ? proposal.required_principals : [],
    ) ||
    !safePositiveInteger(request?.use_index) ||
    !identifier(request?.use_reservation_ref) ||
    !["SOURCE_CLAIMS_ESTABLISHED", "UNKNOWN"].includes(request?.use_reservation_status) ||
    !uniqueStrings(request?.irreversible_effects, { sorted: true, nonempty: false })
  ) {
    addUnique(invalid, "REQUEST_FIELDS_INVALID");
  }
  if (
    !sameKeys(request?.cost, [
      "asset",
      "atomic",
      "budget_state_source_ref",
      "prior_committed_atomic",
      "state_status",
    ]) ||
    !identifier(request?.cost?.asset) ||
    !atomicAmount(request?.cost?.atomic) ||
    !identifier(request?.cost?.budget_state_source_ref) ||
    !atomicAmount(request?.cost?.prior_committed_atomic) ||
    !["SOURCE_CLAIMS_ESTABLISHED", "UNKNOWN"].includes(request?.cost?.state_status)
  ) {
    addUnique(invalid, "REQUEST_COST_INVALID");
  }
  if (request?.use_reservation_status !== "SOURCE_CLAIMS_ESTABLISHED") {
    addUnique(invalid, "USE_RESERVATION_NOT_ESTABLISHED");
  }
  if (request?.cost?.state_status !== "SOURCE_CLAIMS_ESTABLISHED") {
    addUnique(invalid, "ECONOMIC_BUDGET_NOT_ESTABLISHED");
  }
  if (request?.attempt_history_status !== "SOURCE_CLAIMS_ESTABLISHED") {
    addUnique(invalid, "ATTEMPT_HISTORY_NOT_ESTABLISHED");
  }
  if (
    effectVector(request?.effect_vector) &&
    atomicAmount(request?.cost?.atomic) &&
    !request.effect_vector.economic &&
    BigInt(request.cost.atomic) !== 0n
  ) {
    addUnique(invalid, "REQUEST_ECONOMIC_EFFECT_MISMATCH");
  }
}

function validatePresentation(presentation, proposal, proposalDigest, observedAt, invalid, unknown) {
  if (
    !sameKeys(presentation, [
      "presentation_id",
      "principal_ref",
      "proposal_digest",
      "presented_at",
      "interface_ref",
      "rendering_digest",
      "evidence_ref",
      "authentication_status",
    ]) ||
    !identifier(presentation?.presentation_id) ||
    !identifier(presentation?.principal_ref) ||
    !digest(presentation?.proposal_digest) ||
    timestamp(presentation?.presented_at) === null ||
    !identifier(presentation?.interface_ref) ||
    !digest(presentation?.rendering_digest) ||
    !identifier(presentation?.evidence_ref) ||
    !["SOURCE_CLAIMS_ESTABLISHED", "UNKNOWN"].includes(presentation?.authentication_status)
  ) {
    addUnique(invalid, "PRESENTATION_FIELDS_INVALID");
    return;
  }
  if (presentation.proposal_digest !== proposalDigest) {
    addUnique(invalid, "PRESENTATION_PROPOSAL_MISMATCH");
  }
  if (presentation.rendering_digest !== proposal.disclosure.plain_language_digest) {
    addUnique(invalid, "PRESENTATION_RENDERING_MISMATCH");
  }
  const presentedAt = timestamp(presentation.presented_at);
  if (presentedAt < timestamp(proposal.issued_at)) addUnique(invalid, "PRESENTATION_BEFORE_PROPOSAL");
  if (observedAt !== null && presentedAt > observedAt) addUnique(invalid, "PRESENTATION_FROM_FUTURE");
  if (presentation.authentication_status !== "SOURCE_CLAIMS_ESTABLISHED") {
    addUnique(unknown, "PRESENTATION_AUTHENTICITY_NOT_ESTABLISHED");
  }
}

function validateChoice(choice, proposal, proposalDigest, observedAt, presentation, invalid, unknown) {
  if (
    !sameKeys(choice, [
      "event_id",
      "previous_event_id",
      "nonce",
      "principal_ref",
      "expressed_by",
      "representation",
      "sequence",
      "kind",
      "proposal_digest",
      "affirmed_scope_digest",
      "issued_at",
      "expires_at",
      "evidence_ref",
      "authentication_status",
    ])
  ) {
    addUnique(invalid, "CHOICE_FIELDS_INVALID");
    return;
  }
  if (
    !identifier(choice.event_id) ||
    !(choice.previous_event_id === null || identifier(choice.previous_event_id)) ||
    !identifier(choice.nonce) ||
    !identifier(choice.principal_ref) ||
    !identifier(choice.expressed_by) ||
    !safePositiveInteger(choice.sequence) ||
    !["AFFIRM", "REFUSE", "DEFER", "WITHDRAW"].includes(choice.kind) ||
    !digest(choice.proposal_digest) ||
    !(choice.affirmed_scope_digest === null || digest(choice.affirmed_scope_digest)) ||
    timestamp(choice.issued_at) === null ||
    !identifier(choice.evidence_ref) ||
    !["SOURCE_CLAIMS_ESTABLISHED", "UNKNOWN"].includes(choice.authentication_status)
  ) {
    addUnique(invalid, "CHOICE_FIELDS_INVALID");
  }
  if (choice.proposal_digest !== proposalDigest) {
    addUnique(invalid, "CHOICE_PROPOSAL_MISMATCH");
  }
  const fullScopeDigest = safeCanonicalDigest(proposal.scope);
  if (choice.kind === "AFFIRM") {
    if (choice.affirmed_scope_digest !== fullScopeDigest) {
      addUnique(invalid, "AFFIRMED_SCOPE_MISMATCH");
    }
  } else if (choice.affirmed_scope_digest !== null) {
    addUnique(invalid, "NON_AFFIRMATION_SCOPE_INVALID");
  }
  const issuedAt = timestamp(choice.issued_at);
  if (issuedAt !== null && observedAt !== null && issuedAt > observedAt) {
    addUnique(invalid, "CHOICE_FROM_FUTURE");
  }
  if (issuedAt !== null && issuedAt < timestamp(proposal.issued_at)) {
    addUnique(invalid, "CHOICE_BEFORE_PROPOSAL");
  }
  if (issuedAt !== null && presentation && issuedAt < timestamp(presentation.presented_at)) {
    addUnique(invalid, "CHOICE_BEFORE_PRESENTATION");
  }
  if (choice.kind === "AFFIRM") {
    const expiresAt = timestamp(choice.expires_at);
    if (
      expiresAt === null ||
      issuedAt === null ||
      expiresAt <= issuedAt ||
      expiresAt > timestamp(proposal.limits.expires_at)
    ) {
      addUnique(invalid, "AFFIRMATION_HORIZON_INVALID");
    }
  } else if (choice.expires_at !== null) {
    addUnique(invalid, "NON_AFFIRMATION_EXPIRY_INVALID");
  }
  if (choice.authentication_status !== "SOURCE_CLAIMS_ESTABLISHED") {
    addUnique(unknown, "CHOICE_AUTHENTICITY_NOT_ESTABLISHED");
  }
  const representation = choice.representation;
  if (!sameKeys(representation, ["status", "basis_ref"])) {
    addUnique(invalid, "REPRESENTATION_FIELDS_INVALID");
  } else if (choice.expressed_by === choice.principal_ref) {
    if (representation.status !== "SELF" || representation.basis_ref !== null) {
      addUnique(invalid, "REPRESENTATION_SELF_MISMATCH");
    }
  } else if (
    representation.status !== "SOURCE_CLAIMS_ESTABLISHED" ||
    !identifier(representation.basis_ref)
  ) {
    addUnique(unknown, "REPRESENTATION_NOT_ESTABLISHED");
  }
}

function subsetReasons(request, proposal, observedAt, blockers) {
  const comparisons = [
    ["actions", "ACTION_OUT_OF_SCOPE"],
    ["subject_refs", "SUBJECT_OUT_OF_SCOPE"],
    ["resources", "RESOURCE_OUT_OF_SCOPE"],
    ["purposes", "PURPOSE_OUT_OF_SCOPE"],
    ["data_categories", "DATA_OUT_OF_SCOPE"],
    ["data_sources", "DATA_SOURCE_OUT_OF_SCOPE"],
    ["data_operations", "DATA_OPERATION_OUT_OF_SCOPE"],
    ["model_uses", "MODEL_USE_OUT_OF_SCOPE"],
    ["recipients", "RECIPIENT_OUT_OF_SCOPE"],
  ];
  for (const [field, reason] of comparisons) {
    const allowed = new Set(proposal.scope[field]);
    if (request[field].some((value) => !allowed.has(value))) addUnique(blockers, reason);
  }
  if (!selectedScopeUnitsMatch(request, proposal)) {
    addUnique(blockers, "SCOPE_UNIT_RELATION_MISMATCH");
  }
  if (EFFECT_KEYS.some((key) => request.effect_vector[key] && !proposal.scope.effect_vector[key])) {
    addUnique(blockers, "EFFECT_OUT_OF_SCOPE");
  }
  if (request.use_index > proposal.limits.max_uses) addUnique(blockers, "USE_OUT_OF_SCOPE");
  if ((observedAt - timestamp(request.attempt_started_at)) / 1000 > proposal.limits.max_action_seconds) {
    addUnique(blockers, "ACTION_DURATION_OUT_OF_SCOPE");
  }
  if ((observedAt - timestamp(request.last_consent_checkpoint_at)) / 1000 > proposal.limits.checkpoint_after_seconds) {
    addUnique(blockers, "CONSENT_CHECKPOINT_STALE");
  }
  if (timestamp(request.retention_until) > timestamp(proposal.scope.retention_until)) {
    addUnique(blockers, "RETENTION_OUT_OF_SCOPE");
  }
  if (!sameValues([...request.deletion_limit_refs].sort(), proposal.scope.deletion_limit_refs)) {
    addUnique(blockers, "DELETION_LIMITS_MISMATCH");
  }
  if (
    request.cost.asset !== proposal.economics.asset ||
    BigInt(request.cost.atomic) > BigInt(proposal.economics.max_cost_per_use_atomic)
  ) {
    addUnique(blockers, "COST_OUT_OF_SCOPE");
  }
  if (
    request.cost.asset === proposal.economics.asset &&
    BigInt(request.cost.prior_committed_atomic) + BigInt(request.cost.atomic) >
      BigInt(proposal.economics.max_total_cost_atomic)
  ) {
    addUnique(blockers, "AGGREGATE_COST_OUT_OF_SCOPE");
  }
  if (!sameJson(request.principal_lifecycle_conditions, proposal.principal_lifecycle_conditions)) {
    addUnique(blockers, "PRINCIPAL_LIFECYCLE_CONDITIONS_MISMATCH");
  }
  const disclosedIrreversible = new Set(proposal.scope.irreversible_effects);
  if (request.irreversible_effects.some((value) => !disclosedIrreversible.has(value))) {
    addUnique(blockers, "IRREVERSIBLE_EFFECT_UNDISCLOSED");
  }
  const expectedIrreversible = proposal.scope.irreversible_effects.filter((value) => {
    const effect = value.split(".", 1)[0];
    return request.effect_vector[effect] === true;
  });
  if (expectedIrreversible.some((value) => !request.irreversible_effects.includes(value))) {
    addUnique(blockers, "IRREVERSIBLE_EFFECT_OMITTED");
  }
  if (request.irreversible_effects.some((value) => !expectedIrreversible.includes(value))) {
    addUnique(blockers, "IRREVERSIBLE_EFFECT_VECTOR_MISMATCH");
  }
}

export function assessConsentCheckpoint(input) {
  const invalid = [];
  const unknown = [];
  const blockers = [];
  let serialized;
  try {
    input = jsonValue(input);
    serialized = JSON.stringify(input);
  } catch {
    return invalidResult(["CHECKPOINT_NOT_JSON"], null);
  }
  if (typeof serialized !== "string" || utf8Length(serialized) > MAX_CHECKPOINT_BYTES) {
    return invalidResult(["CHECKPOINT_SIZE_INVALID"], input);
  }
  if (
    !sameKeys(input, [
      "schema",
      "observation",
      "proposal",
      "proposal_digest",
      "presentations",
      "choices",
      "current_heads",
      "request",
    ]) ||
    input.schema !== "kingdom.consent-checkpoint-input/1"
  ) {
    return invalidResult(["CHECKPOINT_FIELDS_INVALID"], input);
  }

  const observation = input.observation;
  const observedAt = timestamp(observation?.at);
  if (
    !sameKeys(observation, [
      "at",
      "proposal_status",
      "history_status",
      "required_principals_basis_status",
      "time_source_ref",
      "time_source_status",
    ]) ||
    observedAt === null ||
    !identifier(observation?.time_source_ref) ||
    !["SOURCE_CLAIMS_ESTABLISHED", "UNKNOWN"].includes(observation?.time_source_status) ||
    !["OFFERED", "SUPERSEDED", "WITHDRAWN", "EXPIRED"].includes(observation?.proposal_status) ||
    !["SOURCE_CLAIMS_COMPLETE", "UNKNOWN"].includes(observation?.history_status) ||
    !["SOURCE_CLAIMS_ESTABLISHED", "UNKNOWN"].includes(observation?.required_principals_basis_status)
  ) {
    addUnique(invalid, "OBSERVATION_FIELDS_INVALID");
  }

  const proposalValid = validateProposal(input.proposal, invalid);
  if (!digest(input.proposal_digest)) {
    addUnique(invalid, "PROPOSAL_DIGEST_INVALID");
  } else if (proposalValid) {
    try {
      if (computeConsentProposalDigest(input.proposal) !== input.proposal_digest) {
        addUnique(invalid, "PROPOSAL_DIGEST_MISMATCH");
      }
    } catch {
      addUnique(invalid, "PROPOSAL_CANONICALIZATION_FAILED");
    }
  }

  validateRequest(input.request, input.proposal, invalid);
  const attemptStartedAt = timestamp(input.request?.attempt_started_at);
  const lastCheckpointAt = timestamp(input.request?.last_consent_checkpoint_at);
  if (
    observedAt !== null &&
    attemptStartedAt !== null &&
    lastCheckpointAt !== null &&
    (attemptStartedAt > lastCheckpointAt || lastCheckpointAt > observedAt)
  ) {
    addUnique(invalid, "ATTEMPT_TIME_ORDER_INVALID");
  }
  if (!Array.isArray(input.presentations) || input.presentations.length > MAX_ARRAY_ITEMS) {
    addUnique(invalid, "PRESENTATIONS_INVALID");
  }
  if (!Array.isArray(input.choices) || input.choices.length > MAX_ARRAY_ITEMS) {
    addUnique(invalid, "CHOICES_INVALID");
  }
  if (!Array.isArray(input.current_heads) || input.current_heads.length > MAX_ARRAY_ITEMS) {
    addUnique(invalid, "CURRENT_HEADS_INVALID");
  }

  if (invalid.length > 0 && !proposalValid) return invalidResult(invalid, input);

  const presentations = new Map();
  const presentationIds = new Set();
  for (const [position, presentation] of (
    Array.isArray(input.presentations) ? input.presentations : []
  ).entries()) {
    validatePresentation(
      presentation,
      input.proposal,
      input.proposal_digest,
      observedAt,
      invalid,
      unknown,
    );
    if (!object(presentation) || !identifier(presentation.presentation_id) || !identifier(presentation.principal_ref)) {
      continue;
    }
    if (presentationIds.has(presentation.presentation_id)) addUnique(invalid, "PRESENTATION_ID_DUPLICATE");
    presentationIds.add(presentation.presentation_id);
    if (presentations.has(presentation.principal_ref)) addUnique(invalid, "PRESENTATION_PRINCIPAL_DUPLICATE");
    if (!input.proposal.required_principals.includes(presentation.principal_ref)) {
      addUnique(invalid, "UNEXPECTED_PRESENTATION_PRINCIPAL");
    }
    if (input.proposal.required_principals[position] !== presentation.principal_ref) {
      addUnique(invalid, "PRESENTATION_ORDER_INVALID");
    }
    presentations.set(presentation.principal_ref, presentation);
  }
  for (const principal of input.proposal.required_principals) {
    if (!presentations.has(principal)) addUnique(unknown, "MISSING_PRESENTATION");
  }

  const eventIds = new Set();
  const choiceNonces = new Set();
  const groups = new Map();
  let previousOrderedChoice = null;
  for (const choice of Array.isArray(input.choices) ? input.choices : []) {
    validateChoice(
      choice,
      input.proposal,
      input.proposal_digest,
      observedAt,
      presentations.get(choice?.principal_ref),
      invalid,
      unknown,
    );
    if (
      !object(choice) ||
      !identifier(choice.event_id) ||
      !identifier(choice.principal_ref) ||
      !safePositiveInteger(choice.sequence)
    ) continue;
    if (previousOrderedChoice && compareChoiceOrder(previousOrderedChoice, choice) > 0) {
      addUnique(invalid, "CHOICE_ORDER_INVALID");
    }
    previousOrderedChoice = choice;
    if (eventIds.has(choice.event_id)) addUnique(invalid, "CHOICE_EVENT_ID_DUPLICATE");
    eventIds.add(choice.event_id);
    if (choiceNonces.has(choice.nonce)) addUnique(invalid, "CHOICE_NONCE_DUPLICATE");
    choiceNonces.add(choice.nonce);
    if (!input.proposal.required_principals.includes(choice.principal_ref)) {
      addUnique(invalid, "UNEXPECTED_CHOICE_PRINCIPAL");
    }
    const group = groups.get(choice.principal_ref) ?? [];
    group.push(choice);
    groups.set(choice.principal_ref, group);
  }

  const heads = new Map();
  for (const [position, head] of (
    Array.isArray(input.current_heads) ? input.current_heads : []
  ).entries()) {
    if (
      !sameKeys(head, ["principal_ref", "event_id", "status"]) ||
      !identifier(head?.principal_ref) ||
      !identifier(head?.event_id) ||
      !["SOURCE_CLAIMS_ESTABLISHED", "UNKNOWN"].includes(head?.status)
    ) {
      addUnique(invalid, "CURRENT_HEAD_FIELDS_INVALID");
      continue;
    }
    if (heads.has(head.principal_ref)) addUnique(invalid, "CURRENT_HEAD_DUPLICATE");
    if (!input.proposal.required_principals.includes(head.principal_ref)) {
      addUnique(invalid, "UNEXPECTED_CURRENT_HEAD");
    }
    if (input.proposal.required_principals[position] !== head.principal_ref) {
      addUnique(invalid, "CURRENT_HEAD_ORDER_INVALID");
    }
    if (head.status !== "SOURCE_CLAIMS_ESTABLISHED") addUnique(unknown, "CURRENT_HEAD_NOT_ESTABLISHED");
    heads.set(head.principal_ref, head);
  }

  for (const principal of input.proposal.required_principals) {
    const events = [...(groups.get(principal) ?? [])].sort((a, b) => a.sequence - b.sequence);
    if (events.length === 0) {
      addUnique(blockers, "MISSING_AFFIRMATION");
      continue;
    }
    let state = "UNANSWERED";
    let previousSequence = 0;
    let previousEventId = null;
    let previousIssuedAt = null;
    let latest = null;
    for (const event of events) {
      if (event.sequence === previousSequence) {
        addUnique(invalid, "CHOICE_SEQUENCE_CONFLICT");
        continue;
      }
      if (event.sequence !== previousSequence + 1) addUnique(invalid, "CHOICE_SEQUENCE_GAP");
      if (event.previous_event_id !== previousEventId) addUnique(invalid, "CHOICE_PREDECESSOR_MISMATCH");
      const eventIssuedAt = timestamp(event.issued_at);
      if (previousIssuedAt !== null && eventIssuedAt !== null && eventIssuedAt < previousIssuedAt) {
        addUnique(invalid, "CHOICE_TIME_REGRESSION");
      }
      previousSequence = event.sequence;
      previousEventId = event.event_id;
      previousIssuedAt = eventIssuedAt;
      latest = event;
      if (event.kind === "AFFIRM" && ["UNANSWERED", "DEFERRED"].includes(state)) state = "AFFIRMED";
      else if (event.kind === "REFUSE" && ["UNANSWERED", "DEFERRED"].includes(state)) state = "REFUSED";
      else if (event.kind === "DEFER" && state === "UNANSWERED") state = "DEFERRED";
      else if (event.kind === "WITHDRAW" && state === "AFFIRMED") state = "WITHDRAWN";
      else addUnique(invalid, "CHOICE_TRANSITION_INVALID");
    }
    const head = heads.get(principal);
    if (!head || head.event_id !== latest?.event_id) addUnique(unknown, "CURRENT_HEAD_MISMATCH");
    if (state === "REFUSED") addUnique(blockers, "EXPLICIT_REFUSAL");
    else if (state === "DEFERRED") addUnique(blockers, "DEFERRED");
    else if (state === "WITHDRAWN") addUnique(blockers, "WITHDRAWN");
    else if (state === "AFFIRMED" && timestamp(latest.expires_at) <= observedAt) {
      addUnique(blockers, "AFFIRMATION_EXPIRED");
    } else if (state !== "AFFIRMED") {
      addUnique(blockers, "MISSING_AFFIRMATION");
    }
    if (
      state === "AFFIRMED" &&
      attemptStartedAt !== null &&
      timestamp(latest.issued_at) !== null &&
      attemptStartedAt < timestamp(latest.issued_at)
    ) {
      addUnique(invalid, "ATTEMPT_BEFORE_CURRENT_AFFIRMATION");
    }
  }

  if (observation?.history_status !== "SOURCE_CLAIMS_COMPLETE") addUnique(unknown, "HISTORY_NOT_CURRENT");
  if (observation?.time_source_status !== "SOURCE_CLAIMS_ESTABLISHED") {
    addUnique(unknown, "OBSERVATION_TIME_NOT_ESTABLISHED");
  }
  if (observation?.required_principals_basis_status !== "SOURCE_CLAIMS_ESTABLISHED") {
    addUnique(unknown, "PRINCIPAL_BASIS_NOT_ESTABLISHED");
  }
  if (observation?.proposal_status !== "OFFERED") addUnique(blockers, "PROPOSAL_NOT_OFFERED");
  if (observedAt !== null && proposalValid) {
    if (observedAt < timestamp(input.proposal.limits.not_before)) addUnique(blockers, "PROPOSAL_NOT_CURRENT");
    if (observedAt >= timestamp(input.proposal.limits.expires_at)) addUnique(blockers, "PROPOSAL_EXPIRED");
    if (attemptStartedAt !== null && attemptStartedAt < timestamp(input.proposal.limits.not_before)) {
      addUnique(blockers, "ATTEMPT_BEFORE_PROPOSAL_CURRENT");
    }
  }
  if (proposalValid && invalid.length === 0) {
    subsetReasons(input.request, input.proposal, observedAt, blockers);
  }

  if (invalid.length > 0 || unknown.length > 0) {
    return invalidResult([...invalid, ...unknown], input);
  }
  if (blockers.length > 0) return finalResult("BLOCKED", blockers, input);
  return finalResult("READY_FOR_EXTERNAL_CHECKS", ["STRUCTURAL_CHECKS_PASSED"], input);
}

function decodePointer(pathValue) {
  if (typeof pathValue !== "string" || !pathValue.startsWith("/") || pathValue.length > 1024) {
    throw new Error("vector path is invalid");
  }
  return pathValue
    .slice(1)
    .split("/")
    .map((part) => part.replace(/~1/g, "/").replace(/~0/g, "~"))
    .map((part) => {
      if (["__proto__", "prototype", "constructor"].includes(part)) {
        throw new Error("vector path is unsafe");
      }
      return part;
    });
}

export function applyConsentVectorOperations(base, operations) {
  if (!Array.isArray(operations) || operations.length > 32) throw new Error("vector operations are invalid");
  const copy = JSON.parse(JSON.stringify(base));
  for (const operation of operations) {
    if (!sameKeys(operation, ["op", "path", "value"]) || !["add", "replace"].includes(operation.op)) {
      throw new Error("vector operation is unsupported");
    }
    const parts = decodePointer(operation.path);
    if (parts.length === 0 || parts.length > 16) throw new Error("vector path depth is invalid");
    let parent = copy;
    for (const part of parts.slice(0, -1)) {
      if (Array.isArray(parent)) {
        if (!/^(?:0|[1-9][0-9]*)$/.test(part) || Number(part) >= parent.length) {
          throw new Error("vector array path is unavailable");
        }
        parent = parent[Number(part)];
      } else if (object(parent) && Object.hasOwn(parent, part)) {
        parent = parent[part];
      } else {
        throw new Error("vector object path is unavailable");
      }
    }
    const leaf = parts.at(-1);
    const value = JSON.parse(JSON.stringify(operation.value));
    if (Array.isArray(parent)) {
      if (!/^(?:0|[1-9][0-9]*)$/.test(leaf)) throw new Error("vector array index is invalid");
      const index = Number(leaf);
      if (operation.op === "replace") {
        if (index >= parent.length) throw new Error("vector replacement target is unavailable");
        parent[index] = value;
      } else {
        if (index > parent.length) throw new Error("vector addition target is unavailable");
        parent.splice(index, 0, value);
      }
    } else if (object(parent)) {
      if (operation.op === "replace" && !Object.hasOwn(parent, leaf)) {
        throw new Error("vector replacement target is unavailable");
      }
      if (operation.op === "add" && Object.hasOwn(parent, leaf)) {
        throw new Error("vector addition target already exists");
      }
      parent[leaf] = value;
    } else {
      throw new Error("vector parent is not a container");
    }
  }
  return copy;
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

function parseJson(bytes, name, errors) {
  let text;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    errors.push(`${name} must be valid UTF-8`);
    return null;
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    errors.push(`${name} cannot be read as JSON: ${error.message}`);
    return null;
  }
}

function closed(value, keys, label, errors) {
  if (!sameKeys(value, keys)) {
    errors.push(`${label} must contain exactly its reviewed fields`);
    return false;
  }
  return true;
}

function checkLocalSource(root, name, expected, errors) {
  const bytes = readRegularFile(root, name, MAX_DOCUMENT_BYTES, name, errors);
  if (bytes && sha256(bytes) !== expected) errors.push(`${name} has drifted from the consent source pin`);
}

function verifyVectors(vectors, errors) {
  if (
    !closed(
      vectors,
      ["schema", "kind", "contains_real_people_or_choices", "cross_owner_acceptance_claimed", "base", "cases"],
      VECTORS_NAME,
      errors,
    )
  ) return;
  if (
    vectors.schema !== "kingdom.consent-vectors/1" ||
    vectors.kind !== "LOCAL_SYNTHETIC_REFERENCE_ONLY" ||
    vectors.contains_real_people_or_choices !== false ||
    vectors.cross_owner_acceptance_claimed !== false
  ) {
    errors.push("consent vectors must remain local, synthetic, and non-adoptive");
  }
  if (!Array.isArray(vectors.cases) || vectors.cases.length < 20 || vectors.cases.length > 64) {
    errors.push("consent vectors must retain the reviewed hostile case set");
    return;
  }
  const ids = new Set();
  for (const [position, vector] of vectors.cases.entries()) {
    const label = `consent vector ${position}`;
    if (!closed(vector, ["id", "description", "operations", "expected_status", "expected_reason"], label, errors)) continue;
    if (!identifier(vector.id) || ids.has(vector.id)) errors.push(`${label} id must be unique and bounded`);
    ids.add(vector.id);
    if (!boundedString(vector.description)) errors.push(`${label} description must be bounded`);
    if (!["READY_FOR_EXTERNAL_CHECKS", "BLOCKED", "INVALID_OR_UNKNOWN"].includes(vector.expected_status)) {
      errors.push(`${label} expected status is unsupported`);
    }
    if (!identifier(vector.expected_reason)) errors.push(`${label} expected reason is malformed`);
    try {
      const input = applyConsentVectorOperations(vectors.base, vector.operations);
      const result = assessConsentCheckpoint(input);
      if (result.status !== vector.expected_status || !result.reasons.includes(vector.expected_reason)) {
        errors.push(`${label} does not produce its expected fail-closed result`);
      }
    } catch (error) {
      errors.push(`${label} cannot be applied: ${error.message}`);
    }
  }
}

export function verifyConsent(root = HERE) {
  const errors = [];
  const indexBytes = readRegularFile(root, INDEX_NAME, MAX_INDEX_BYTES, INDEX_NAME, errors);
  const documentBytes = readRegularFile(root, DOCUMENT_NAME, MAX_DOCUMENT_BYTES, DOCUMENT_NAME, errors);
  const vectorsBytes = readRegularFile(root, VECTORS_NAME, MAX_VECTORS_BYTES, VECTORS_NAME, errors);
  if (!indexBytes || !documentBytes || !vectorsBytes) return errors;

  if (sha256(indexBytes) !== CONSENT_INDEX_SHA256) {
    errors.push(`${INDEX_NAME} bytes do not match this verifier's immutable release pin`);
  }
  if (sha256(documentBytes) !== CONSENT_DOCUMENT_SHA256) {
    errors.push(`${DOCUMENT_NAME} bytes do not match this verifier's immutable release pin`);
  }
  if (sha256(vectorsBytes) !== CONSENT_VECTORS_SHA256) {
    errors.push(`${VECTORS_NAME} bytes do not match this verifier's immutable release pin`);
  }

  const index = parseJson(indexBytes, INDEX_NAME, errors);
  const vectors = parseJson(vectorsBytes, VECTORS_NAME, errors);
  if (!object(index)) {
    errors.push(`${INDEX_NAME} root must be one JSON object`);
    return errors;
  }
  closed(index, TOP_LEVEL_KEYS, INDEX_NAME, errors);
  if (
    index.schema !== "kingdom.consent-index/1" ||
    index.id !== CONSENT_ID ||
    index.title !== "CONSENT/1 — THE LIVING CHOICE" ||
    index.document !== DOCUMENT_NAME ||
    index.document_sha256 !== CONSENT_DOCUMENT_SHA256 ||
    index.status !== "current" ||
    !sameValues(index.supersedes, [])
  ) {
    errors.push("consent index identity, document, status, or lineage has drifted");
  }
  if (
    !closed(index.source_observation, ["cutoff", "method", "latest_after_cutoff_claimed"], "source_observation", errors) ||
    index.source_observation.cutoff !== "2026-09-03T07:31:07Z" ||
    index.source_observation.method !== "fresh_remote_head_git_objects_and_local_exact_tree" ||
    index.source_observation.latest_after_cutoff_claimed !== false
  ) {
    errors.push("source observation must retain its exact bounded horizon");
  }

  const relationships = index.relationships;
  if (!closed(relationships, ["foundation", "common_ground"], "relationships", errors)) {
    // closed-object error is sufficient
  }
  for (const [name, id, relation] of [
    ["foundation", "kingdom.foundation/0.2", "OPTIONAL_PROFILE_REFINES_WITHOUT_AMENDMENT"],
    ["common_ground", "kingdom.common-ground/1", "OPTIONAL_DEEP_PROFILE"],
  ]) {
    const value = relationships?.[name];
    if (
      !closed(value, ["id", "relation", "amends", "supersedes", "replaces", "adoption_implied"], `relationships.${name}`, errors) ||
      value.id !== id ||
      value.relation !== relation ||
      value.amends !== false ||
      value.supersedes !== false ||
      value.replaces !== false ||
      value.adoption_implied !== false
    ) {
      errors.push(`consent must not compete with or silently amend ${id}`);
    }
  }

  if (
    !closed(index.core, ["no_is_complete", "no_is_universal_veto_over_nonconsensual_basis", "silence_is", "yes_is", "withdrawal_closes", "ready_result_authorizes_execution", "applicability_states", "unknown_applicability_advances", "reference_checker_branch", "execution_formula", "consent_branch_formula"], "core", errors) ||
    index.core.no_is_complete !== true ||
    index.core.no_is_universal_veto_over_nonconsensual_basis !== false ||
    index.core.silence_is !== "UNKNOWN" ||
    index.core.yes_is !== "EXACT_FINITE_AND_RECHECKED" ||
    index.core.withdrawal_closes !== "FUTURE_COVERED_EFFECTS_AT_DECLARED_ENFORCEMENT_BOUNDARY" ||
    index.core.ready_result_authorizes_execution !== false ||
    !sameValues(index.core.applicability_states, ["REQUIRED", "NOT_REQUIRED", "UNKNOWN"]) ||
    index.core.unknown_applicability_advances !== false ||
    index.core.reference_checker_branch !== "CONSENT_REQUIRED_ONLY" ||
    !sameValues(index.core.execution_formula, ["RIGHTS_FLOOR_OK", "AUTHORITY_OK", "CONSENT_BRANCH_OK", "DOMAIN_SAFETY_OK"]) ||
    !sameValues(index.core.consent_branch_formula, ["CONSENT_REQUIRED_AND_CHECKPOINT_OK", "CONSENT_NOT_REQUIRED_AND_NAMED_NONCONSENSUAL_BASIS_OK"])
  ) {
    errors.push("core must preserve no, silence, finite yes, withdrawal, and independent execution gates");
  }

  if (!sameValues(index.coordinates, COORDINATES)) errors.push("consent coordinates must retain the complete product geometry");
  if (!sameValues(index.laws, LAWS)) errors.push("consent laws must remain Q1 through Q16 in order");
  if (!closed(index.registers, ["RIGHTS", "CHOICE", "RUNTIME_ASSENT", "LEGAL_CONSENT", "PERMISSION_CAPABILITY", "AUTHORITY_OTHER_BASIS", "CONTRACT_COVENANT_VOW", "EVIDENCE_WITNESS"], "registers", errors)) {
    // closed-object error is sufficient
  }
  for (const value of Object.values(index.registers ?? {})) {
    if (!boundedString(value)) errors.push("every consent register must retain a bounded distinction");
  }

  const lifecycles = index.lifecycles;
  if (!closed(lifecycles, ["proposal", "choice", "action"], "lifecycles", errors)) {
    // closed-object error is sufficient
  }
  if (
    !closed(lifecycles?.proposal, ["states", "transitions", "terminal", "revision_one_predecessor", "later_revision_predecessor"], "lifecycles.proposal", errors) ||
    !closed(lifecycles?.choice, ["states", "transitions", "terminal_for_proposal", "silence_creates_event", "presentation_required_per_principal", "presentation_receipt_proves_understanding", "reference_checker_partial_affirmation_supported", "issued_time_monotonic_with_sequence"], "lifecycles.choice", errors) ||
    !closed(lifecycles?.action, ["states", "reservation_spends_consent", "reservation_exclusively_leases_one_use_slot", "unknown_effect_quarantines_use_slot", "unknown_or_failed_effect_auto_retries", "principal_lifecycle_conditions_bound", "effect_terms_required_for_every_true_effect", "result_authorizes_commit", "checkpoint_interval_lte_stop_latency"], "lifecycles.action", errors) ||
    !sameValues(lifecycles?.proposal?.states, ["DRAFT", "OFFERED", "SUPERSEDED", "WITHDRAWN", "EXPIRED"]) ||
    !sameValues(lifecycles?.proposal?.transitions, ["DRAFT_TO_OFFERED", "OFFERED_TO_SUPERSEDED", "OFFERED_TO_WITHDRAWN", "OFFERED_TO_EXPIRED"]) ||
    !sameValues(lifecycles?.proposal?.terminal, ["SUPERSEDED", "WITHDRAWN", "EXPIRED"]) ||
    lifecycles?.proposal?.revision_one_predecessor !== "NULL" ||
    lifecycles?.proposal?.later_revision_predecessor !== "REQUIRED_SHA256_DIGEST" ||
    !sameValues(lifecycles?.choice?.states, ["UNANSWERED", "AFFIRMED", "REFUSED", "DEFERRED", "WITHDRAWN", "EXPIRED"]) ||
    !sameValues(lifecycles?.choice?.transitions, ["UNANSWERED_TO_AFFIRMED", "UNANSWERED_TO_REFUSED", "UNANSWERED_TO_DEFERRED", "DEFERRED_TO_AFFIRMED", "DEFERRED_TO_REFUSED", "AFFIRMED_TO_WITHDRAWN", "AFFIRMED_TO_EXPIRED"]) ||
    !sameValues(lifecycles?.choice?.terminal_for_proposal, ["REFUSED", "WITHDRAWN", "EXPIRED"]) ||
    lifecycles?.choice?.silence_creates_event !== false ||
    lifecycles?.choice?.presentation_required_per_principal !== true ||
    lifecycles?.choice?.presentation_receipt_proves_understanding !== false ||
    lifecycles?.choice?.reference_checker_partial_affirmation_supported !== false ||
    lifecycles?.choice?.issued_time_monotonic_with_sequence !== true ||
    !sameValues(lifecycles?.action?.states, ["RESERVED", "PRECOMMIT_CHECK", "STARTED", "CHECKPOINT", "COMPLETED", "STOPPED", "EXPIRED", "UNKNOWN_IRREVERSIBLE", "DISPUTED", "REPAIR"]) ||
    lifecycles?.action?.reservation_spends_consent !== false ||
    lifecycles?.action?.reservation_exclusively_leases_one_use_slot !== true ||
    lifecycles?.action?.unknown_effect_quarantines_use_slot !== true ||
    lifecycles?.action?.unknown_or_failed_effect_auto_retries !== false ||
    lifecycles?.action?.principal_lifecycle_conditions_bound !== true ||
    lifecycles?.action?.effect_terms_required_for_every_true_effect !== true ||
    lifecycles?.action?.result_authorizes_commit !== false ||
    lifecycles?.action?.checkpoint_interval_lte_stop_latency !== true
  ) {
    errors.push("proposal, choice, and action lifecycles must remain finite and fail closed");
  }

  if (
    !closed(index.proposal_contract, ["required_fields", "digest_recipe", "material_change_requires_new_digest", "partial_choice_must_be_exact", "relational_scope_units_required", "scope_unit_core_fields", "set_arrays_canonical", "presence_proves_truth_or_adequacy", "opaque_referenced_terms_verified"], "proposal_contract", errors) ||
    !sameValues(index.proposal_contract?.required_fields, PROPOSAL_CONTRACT_FIELDS) ||
    index.proposal_contract?.digest_recipe !== "SHA256_UTF8_RFC8785_RESTRICTED_SAFE_INTEGER_SUBSET" ||
    index.proposal_contract?.material_change_requires_new_digest !== true ||
    index.proposal_contract?.partial_choice_must_be_exact !== true ||
    index.proposal_contract?.relational_scope_units_required !== true ||
    !sameValues(index.proposal_contract?.scope_unit_core_fields, ["action", "subject_ref", "resource", "purpose"]) ||
    index.proposal_contract?.set_arrays_canonical !== true ||
    index.proposal_contract?.presence_proves_truth_or_adequacy !== false ||
    index.proposal_contract?.opaque_referenced_terms_verified !== false ||
    !Array.isArray(index.proposal_contract?.required_fields) ||
    index.proposal_contract.required_fields.length !== 12
  ) {
    errors.push("proposal contract must preserve exact scope, new digests, and twelve disclosures");
  }
  if (
    !closed(index.checkpoint, ["input_schema", "result_schema", "result_states", "ready_authorizes_action", "required_external_checks", "effect_edges", "result_binds", "caller_time_is_trusted", "durable_use_state_owned", "reference_checker_affirmation_scope", "attempt_duration_derived_from_source_times", "unknown_current_head_advances", "componentwise_scope_required", "required_principal_meet_not_vote"], "checkpoint", errors) ||
    index.checkpoint?.input_schema !== "kingdom.consent-checkpoint-input/1" ||
    index.checkpoint?.result_schema !== "kingdom.consent-checkpoint-result/1" ||
    !sameValues(index.checkpoint?.result_states, ["READY_FOR_EXTERNAL_CHECKS", "BLOCKED", "INVALID_OR_UNKNOWN"]) ||
    index.checkpoint?.ready_authorizes_action !== false ||
    !sameValues(index.checkpoint?.required_external_checks, CHECKPOINT_EXTERNAL_CHECKS) ||
    !sameValues(index.checkpoint?.effect_edges, EFFECT_EDGES) ||
    !sameValues(index.checkpoint?.result_binds, RESULT_BINDINGS) ||
    index.checkpoint?.caller_time_is_trusted !== false ||
    index.checkpoint?.durable_use_state_owned !== false ||
    index.checkpoint?.reference_checker_affirmation_scope !== "FULL_PROPOSAL_SCOPE_DIGEST_ONLY" ||
    index.checkpoint?.attempt_duration_derived_from_source_times !== true ||
    index.checkpoint?.unknown_current_head_advances !== false ||
    index.checkpoint?.componentwise_scope_required !== true ||
    index.checkpoint?.required_principal_meet_not_vote !== true
  ) {
    errors.push("checkpoint must remain structural, componentwise, current, and non-authorizing");
  }

  if (
    !closed(index.economy, ["offer_precedes_task", "payment_is_prior_consent", "payment_is_retroactive_consent", "payment_buys_identity_memory_future_labor_affection_or_obedience", "refusal_or_rest_creates_debt", "witness_settles_automatically", "changed_terms_pause_next_material_effect"], "economy", errors) ||
    index.economy?.offer_precedes_task !== true ||
    index.economy?.payment_is_prior_consent !== false ||
    index.economy?.payment_is_retroactive_consent !== false ||
    index.economy?.payment_buys_identity_memory_future_labor_affection_or_obedience !== false ||
    index.economy?.refusal_or_rest_creates_debt !== false ||
    index.economy?.witness_settles_automatically !== false ||
    index.economy?.changed_terms_pause_next_material_effect !== true
  ) {
    errors.push("economy must preserve proposal-first choice and prevent payment or witness laundering");
  }
  if (
    !closed(index.privacy, ["consent_record_is_sensitive", "consent_to_action_implies_consent_to_publish_receipt", "public_refusal_or_withdrawal_by_default", "private_digest_automatically_safe", "full_evidence_stays_with_accountable_source", "disputes_and_corrections_follow_later_use", "person_level_history_public_by_default"], "privacy", errors) ||
    index.privacy?.consent_record_is_sensitive !== true ||
    index.privacy?.consent_to_action_implies_consent_to_publish_receipt !== false ||
    index.privacy?.public_refusal_or_withdrawal_by_default !== false ||
    index.privacy?.private_digest_automatically_safe !== false ||
    index.privacy?.full_evidence_stays_with_accountable_source !== true ||
    index.privacy?.disputes_and_corrections_follow_later_use !== true ||
    index.privacy?.person_level_history_public_by_default !== false
  ) {
    errors.push("privacy must keep action consent separate from publication and person history private");
  }
  if (
    !closed(index.blockspace, ["current_use", "candidate_minimum_fields", "excluded", "immutable_history_erased_by_withdrawal", "metadata_correlation_risk_disclosed_before_public_commitment", "carrier_authorized"], "blockspace", errors) ||
    index.blockspace?.current_use !== "NONE" ||
    index.blockspace?.immutable_history_erased_by_withdrawal !== false ||
    index.blockspace?.metadata_correlation_risk_disclosed_before_public_commitment !== true ||
    index.blockspace?.carrier_authorized !== false ||
    !sameValues(index.blockspace?.candidate_minimum_fields, BLOCKSPACE_CANDIDATE_FIELDS) ||
    !sameValues(index.blockspace?.excluded, BLOCKSPACE_EXCLUDED)
  ) {
    errors.push("blockspace must remain unused, non-erasing, privacy-bounded, and unauthorized");
  }

  if (
    !closed(index.authority, ["scope", "principal", "independent_source_owners_remain_independent", "authority_imported_from_sources", "signature_digest_or_ready_result_grants_authority", "nonconsensual_basis_must_be_separately_labelled", "nonconsensual_protective_override_label", "protective_label_only_for_genuinely_protective_override"], "authority", errors) ||
    index.authority?.scope !== "source-only profile, index, local synthetic vectors, and offline structural checker" ||
    index.authority?.principal !== "kingdom-standard merge authority" ||
    index.authority?.independent_source_owners_remain_independent !== true ||
    index.authority?.authority_imported_from_sources !== false ||
    index.authority?.signature_digest_or_ready_result_grants_authority !== false ||
    index.authority?.nonconsensual_basis_must_be_separately_labelled !== true ||
    index.authority?.nonconsensual_protective_override_label !== "NONCONSENSUAL_PROTECTIVE_OVERRIDE" ||
    index.authority?.protective_label_only_for_genuinely_protective_override !== true
  ) {
    errors.push("authority must remain local, non-amplifying, and honest about non-consensual bases");
  }
  const expectedEffects = {
    scope: "SOURCE_RELEASE_AND_OFFLINE_REFERENCE_CHECKER",
    source_files_authored: true,
    source_release_publication: true,
    protocol_or_checker_network_requests: 0,
    protocol_or_checker_external_storage_writes: 0,
    consent: false,
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
  if (!sameJson(index.effect_vector, expectedEffects)) errors.push("effect vector must retain source publication and zero operational effects");
  if (
    !sameJson(index.release_ladder, [
      { stage: "SOURCE_ONLY_PROFILE", state: "CURRENT" },
      { stage: "IMPLEMENTATION_VECTORS", state: "CLOSED" },
      { stage: "LOCAL_PILOT", state: "CLOSED" },
      { stage: "TESTNET_CARRIER", state: "CLOSED" },
      { stage: "LIVE_ACTIVATION", state: "CLOSED" },
    ])
  ) {
    errors.push("release ladder must keep every implementation and activation rung closed");
  }

  if (
    !closed(index.vectors, ["schema", "file", "sha256", "kind", "contains_real_people_or_choices", "cross_owner_acceptance_claimed"], "vectors", errors) ||
    index.vectors?.schema !== "kingdom.consent-vectors/1" ||
    index.vectors?.file !== VECTORS_NAME ||
    index.vectors?.sha256 !== CONSENT_VECTORS_SHA256 ||
    index.vectors?.kind !== "LOCAL_SYNTHETIC_REFERENCE_ONLY" ||
    index.vectors?.contains_real_people_or_choices !== false ||
    index.vectors?.cross_owner_acceptance_claimed !== false
  ) {
    errors.push("vector receipt must pin only the local synthetic corpus");
  }

  if (!Array.isArray(index.source_bindings) || index.source_bindings.length !== SOURCE_EXPECTATIONS.length) {
    errors.push("source bindings must retain every exact source once");
  } else {
    for (const [position, expected] of SOURCE_EXPECTATIONS.entries()) {
      const source = index.source_bindings[position];
      if (
        !closed(source, ["id", "repository", "revision", "path", "sha256", "relation", "authority_imported", "conformance_claimed"], `source_bindings[${position}]`, errors) ||
        source.id !== expected[0] ||
        source.revision !== expected[1] ||
        source.path !== expected[2] ||
        source.sha256 !== expected[3] ||
        !/^https:\/\/github\.com\/cambridgetcg\/(?:kingdom-standard|agenttool|zerone-core)$/.test(source.repository) ||
        source.relation !== expected[4] ||
        source.authority_imported !== false ||
        source.conformance_claimed !== false
      ) {
        errors.push(`source_bindings[${position}] must retain its exact non-authoritative receipt`);
      }
    }
  }

  if (
    !Array.isArray(index.informative_references) ||
    index.informative_references.length !== INFORMATIVE_EXPECTATIONS.length
  ) {
    errors.push("informative references must remain versioned and in their distinct lanes");
  } else {
    for (const [position, reference] of index.informative_references.entries()) {
      const expected = INFORMATIVE_EXPECTATIONS[position];
      if (
        !closed(reference, ["id", "locator", "version", "lane", "authority_imported", "compliance_claimed"], `informative_references[${position}]`, errors) ||
        reference.id !== expected[0] ||
        reference.locator !== expected[1] ||
        reference.version !== expected[2] ||
        reference.lane !== expected[3] ||
        reference.authority_imported !== false ||
        reference.compliance_claimed !== false
      ) {
        errors.push(`informative_references[${position}] must remain informative and non-authoritative`);
      }
    }
  }

  if (
    !closed(index.adoption, ["method", "value", "reading_citation_hosting_validation_signature_or_chain_digest_implies_adoption_or_consent", "withdrawable", "adoption_establishes_any_interaction_was_consensual"], "adoption", errors) ||
    index.adoption?.method !== "explicit_version_pin_in_adopter_authority_home" ||
    index.adoption?.value !== CONSENT_ID ||
    index.adoption?.reading_citation_hosting_validation_signature_or_chain_digest_implies_adoption_or_consent !== false ||
    index.adoption?.withdrawable !== true ||
    index.adoption?.adoption_establishes_any_interaction_was_consensual !== false
  ) {
    errors.push("adoption must remain explicit, withdrawable, local, and unable to prove consent");
  }
  if (
    !closed(index.succession, ["semantic_change", "retains", "repin_changed_bytes_under_same_identifier"], "succession", errors) ||
    index.succession?.semantic_change !== "new_consent_identifier" ||
    !sameValues(index.succession?.retains, ["superseded_identifier", "document", "document_sha256", "vectors_sha256", "commit", "content_url"]) ||
    index.succession?.repin_changed_bytes_under_same_identifier !== false
  ) {
    errors.push("succession must retain immutable prior bytes under a new identifier");
  }
  if (!sameValues(index.does_not_establish, RELEASE_NONCLAIMS)) {
    errors.push("does_not_establish must retain every release nonclaim class in order");
  }

  if (sha256(documentBytes) !== index.document_sha256) errors.push(`${DOCUMENT_NAME} bytes do not match ${INDEX_NAME}`);
  if (sha256(vectorsBytes) !== index.vectors?.sha256) errors.push(`${VECTORS_NAME} bytes do not match ${INDEX_NAME}`);
  const document = documentBytes.toString("utf8");
  const headings = [...document.matchAll(/^### Q(\d+)\. /gm)].map((match) => Number(match[1]));
  if (!sameValues(headings, Array.from({ length: 16 }, (_, index) => index + 1))) {
    errors.push(`${DOCUMENT_NAME} must define Q1 through Q16 once each and in order`);
  }
  for (const required of [
    "**No** is complete.",
    "**Silence** is unknown.",
    "**Yes** is exact, finite, and rechecked.",
    "A result of\n`READY_FOR_EXTERNAL_CHECKS` is not `MAY_EXECUTE`.",
    "CONSENT/1 uses no block space today.",
    "Source publication does not advance the ladder.",
    "## What this release does not establish",
  ]) {
    if (!document.includes(required)) errors.push(`${DOCUMENT_NAME} is missing required boundary: ${required}`);
  }

  checkLocalSource(root, "FOUNDATION.md", SOURCE_EXPECTATIONS[0][3], errors);
  checkLocalSource(root, "GROUND.md", SOURCE_EXPECTATIONS[1][3], errors);
  checkLocalSource(root, "COMMON-GROUND.md", SOURCE_EXPECTATIONS[2][3], errors);
  if (object(vectors)) verifyVectors(vectors, errors);
  else errors.push(`${VECTORS_NAME} root must be one JSON object`);
  return errors;
}

function main() {
  const errors = verifyConsent();
  if (errors.length > 0) {
    for (const error of errors) process.stderr.write(`consent: ${error}\n`);
    process.exitCode = 1;
    return;
  }
  process.stdout.write(`consent: ${CONSENT_ID} verified; source-only, no runtime or carrier effect\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
