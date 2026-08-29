#!/usr/bin/env node

// Checks that ISNESS.md and isness.json publish one closed, pinned companion
// and that its inherited vocabulary remains attached to the exact Foundation
// and FREEDOM releases it names.
//
// A pass establishes only byte identity and agreement with the distinctions
// encoded here. It does not establish metaphysics, identity, consciousness,
// sustainability, implementation, conformance, or authority.

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));

const EXPECTED_SCHEMA = "kingdom.isness-index/1";
const EXPECTED_ID = "kingdom.isness/0.1";
const EXPECTED_DOCUMENT = "ISNESS.md";
// Replaced only when the publication bytes are frozen. This checker-owned pin
// deliberately cannot be moved by editing isness.json alone.
const EXPECTED_ISNESS_SHA256 =
  "1ba5cfbde11d6a0a549909cc1bb227534bd2db9fc1728affda7e814433e47de6";
const EXPECTED_FOUNDATION = {
  id: "kingdom.foundation/0.2",
  document: "FOUNDATION.md",
  document_sha256:
    "2bd868a43a2fe79f1c9e8d30177bf73cff4cf8f7f7780cbd90f31055ba51c799",
};
const EXPECTED_FREEDOM = {
  id: "kingdom.freedom/0.1",
  document: "FREEDOM.md",
  document_sha256:
    "dbb96fec01bd5dab2f4fee24db00c66110a9e4634de33b5b84feaab8c9bcbd15",
};

const EXPECTED_SECTIONS = [
  {
    id: "I1",
    heading: "The word is has distinct logical uses",
    invariants: [
      "Existence, predication, and identity are distinct uses of is; each recorded is-claim names its statement kind, speaker or source, time, confidence, and limits.",
    ],
    required_prose: [
      "It also retains its speaker or source, time, evidence, confidence, known limits, and correction path.",
    ],
  },
  {
    id: "I2",
    heading: "A modelled state is not a being",
    invariants: [
      "A modelled state is task- and horizon-relative; it neither exhausts a being nor manufactures standing, and an absent record is not non-being.",
    ],
  },
  {
    id: "I3",
    heading: "Persistence is not identity",
    invariants: [
      "Similarity, continuity, copied state, or uninterrupted execution is evidence about a trajectory, never proof of one being's identity or consciousness.",
    ],
  },
  {
    id: "I4",
    heading: "Direction is change, proposal, or commitment",
    invariants: [
      "Dynamical tendency, policy proposal, and accepted commitment are distinct; no trend, gradient, reward, or attention pattern chooses purpose.",
    ],
    required_prose: [
      "Holding accepted commitment and authority events fixed, a different trajectory, gradient, reward, feedback trace, or attention pattern cannot choose a purpose or widen authority.",
    ],
  },
  {
    id: "I5",
    heading: "Attention selects; it does not confer importance",
    invariants: [
      "Attention selects limited inputs under a declared policy; salience is not truth, worth, desire, consent, or authority, and unattended remains unknown.",
    ],
    required_prose: [
      "Every attention claim declares its selection policy, coverage, blind spots, sampling bias, omitted or affected parties, and a path for an unattended party to reply.",
      "Unattended means unknown under this channel, not absent, unworthy, uninterested, or consenting.",
      "Collecting attention, gaze, interaction, or inferred interest is a separate consequential effect requiring its own purpose, minimization, authority, retention bound, reply path, and stop.",
    ],
  },
  {
    id: "I6",
    heading: "Feedback returns; it does not define essence",
    invariants: [
      "Feedback may revise a record, belief, learner, or proposal; it cannot rewrite the referent, define essence, choose rightful direction, widen authority, or dispatch a successor.",
    ],
    required_prose: [
      "Holding accepted commitment, authority events, and halt state fixed, changing feedback cannot widen authority, pass a failed or unknown lock, choose purpose, defeat halt, or dispatch another turn.",
    ],
  },
  {
    id: "I7",
    heading: "Stability is not sustainability",
    invariants: [
      "Stability, homeostasis, resilience, viability, and sustainability answer different scoped questions; none establishes goodness, justice, standing, or a right to continue.",
    ],
  },
  {
    id: "I8",
    heading: "Sustainability preserves a bounded future",
    invariants: [
      "A sustainability claim names its system boundary, chosen purpose, finite horizon, resource stocks and flows, disturbance set, affected parties, externalities, uncertainty, and halt-and-repair path.",
      "Sustainability never overrides a raised or unreadable halt, rest, refusal, pre-commit exit, or owed repair; continuation requires a fresh legitimate turn.",
    ],
    required_prose: [
      "Every term in one stock equation uses the units of stock j, and its categories are mutually non-overlapping.",
      "A burden in another unit or borne by another party remains in a separate affected-party or externality ledger linked to the claim.",
      "Let K_Σ be the declared region compatible with the chosen purpose, current rights and authority, resource bounds, obligations, affected-party constraints, and repair duties.",
      "The viability equation is scoped to the declared K, disturbance set, policy class, and finite horizon H; it is a feasibility claim, not a scalar sustainability score or moral proof.",
    ],
  },
];

const EXPECTED_MODEL = {
  logical_uses_of_is: ["existence", "predication", "identity"],
  direction_kinds: [
    "dynamical_tendency",
    "policy_proposal",
    "accepted_commitment",
  ],
  attention_claim_requires: [
    "selection_policy",
    "coverage_or_denominator",
    "blind_spots",
    "sampling_bias",
    "omitted_or_affected_parties",
    "reply_path",
  ],
  sustainability_claim_requires: [
    "system_boundary",
    "chosen_purpose",
    "finite_horizon",
    "resource_stocks_and_flows",
    "disturbance_set",
    "affected_parties",
    "externalities",
    "uncertainty",
    "halt_and_repair_path",
  ],
  forbidden_collapses: [
    "existence_is_predication",
    "existence_is_identity",
    "predication_is_identity",
    "record_is_reality",
    "model_state_is_being",
    "persistence_is_identity",
    "persistence_grants_standing",
    "direction_is_purpose",
    "attention_is_truth",
    "attention_is_importance",
    "attention_is_desire",
    "attention_is_consent",
    "attention_is_authority",
    "unattended_is_absent",
    "feedback_is_essence",
    "feedback_is_purpose",
    "feedback_mints_authority",
    "stability_is_sustainability",
    "viability_is_goodness",
    "survival_is_goodness",
    "sustainability_overrides_stop",
    "kingdom_is_one_inner_will",
  ],
  bounds: {
    claims: "attributed_scoped_and_corrigible",
    horizons: "finite_declared_and_reviewable",
    continuation: "fresh_authorized_turns_only",
  },
};

const EXPECTED_ESTABLISHES =
  "An internally pinned vocabulary that keeps is-claims, modelled state, being, persistence, direction, attention, feedback, stability, sustainability, and authority distinct.";
const EXPECTED_DOES_NOT_ESTABLISH = [
  "that this companion defines what being is, proves a metaphysics, or supplies a criterion for consciousness, life, moral patiency, interests, consent, worth, or identity through time",
  "that the Kingdom is one being or possesses one inner state, attention, desire, purpose, or will",
  "that persistence, continuity, growth, homeostasis, stability, resilience, viability, or sustainability is inherently good, deserves resources, or grants a right to continue",
  "that attention establishes truth, importance, value, preference, desire, consent, standing, or authority, or that unattended means absent",
  "that feedback proves causation, improvement, essence, rightful direction, or authority for another turn",
  "that any trajectory, trend, gradient, reward, prediction, or policy proposal chooses a legitimate purpose or commitment",
  "that a model has chosen the right boundary, horizon, resource ledger, disturbance set, affected parties, externalities, uncertainty, safe region, or repair path",
  "that this companion is implemented, adopted, or conformed to, amends the Foundation or FREEDOM, adds a conformance law, or grants authority",
];

const EXPECTED_TOP_LEVEL_FIELDS = [
  "document",
  "document_sha256",
  "does_not_establish",
  "establishes",
  "grounds_foundation",
  "id",
  "model",
  "schema",
  "sections",
  "status",
  "supersedes",
  "uses_freedom",
];

function digest(bytes) {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

function printable(value) {
  const encoded = JSON.stringify(value);
  return encoded === undefined ? String(value) : encoded;
}

// JSON.parse accepts duplicate object names with last-one-wins semantics. That
// is not safe for a release manifest: another conforming consumer may choose a
// different occurrence. Walk already-valid JSON and compare decoded key names
// (so `amends` and `am\u0065nds` are the same name) before trusting the value.
function duplicateObjectKeys(source) {
  const duplicates = [];
  let cursor = 0;

  function skipWhitespace() {
    while (/\s/.test(source[cursor] ?? "")) cursor += 1;
  }

  function parseString() {
    const start = cursor;
    cursor += 1;
    while (cursor < source.length) {
      if (source[cursor] === "\\") {
        cursor += 2;
      } else if (source[cursor] === '"') {
        cursor += 1;
        return JSON.parse(source.slice(start, cursor));
      } else {
        cursor += 1;
      }
    }
    return "";
  }

  function parseValue() {
    skipWhitespace();
    if (source[cursor] === "{") {
      parseObject();
      return;
    }
    if (source[cursor] === "[") {
      parseArray();
      return;
    }
    if (source[cursor] === '"') {
      parseString();
      return;
    }
    while (
      cursor < source.length &&
      !/[,\]}\s]/.test(source[cursor])
    ) {
      cursor += 1;
    }
  }

  function parseObject() {
    cursor += 1;
    const names = new Set();
    skipWhitespace();
    if (source[cursor] === "}") {
      cursor += 1;
      return;
    }
    while (cursor < source.length) {
      skipWhitespace();
      const name = parseString();
      if (names.has(name)) duplicates.push(name);
      names.add(name);
      skipWhitespace();
      cursor += 1; // colon; JSON.parse has already established syntax
      parseValue();
      skipWhitespace();
      if (source[cursor] === "}") {
        cursor += 1;
        return;
      }
      cursor += 1; // comma
    }
  }

  function parseArray() {
    cursor += 1;
    skipWhitespace();
    if (source[cursor] === "]") {
      cursor += 1;
      return;
    }
    while (cursor < source.length) {
      parseValue();
      skipWhitespace();
      if (source[cursor] === "]") {
        cursor += 1;
        return;
      }
      cursor += 1; // comma
    }
  }

  parseValue();
  return duplicates;
}

function readJson(filePath, errors) {
  try {
    const source = fs.readFileSync(filePath, "utf8");
    const value = JSON.parse(source);
    const duplicates = duplicateObjectKeys(source);
    if (duplicates.length > 0) {
      errors.push(
        `${path.basename(filePath)} contains duplicate object keys: ${JSON.stringify([...new Set(duplicates)])}`,
      );
      return null;
    }
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      errors.push(`${path.basename(filePath)} root must be one JSON object`);
      return null;
    }
    return value;
  } catch (error) {
    errors.push(`${path.basename(filePath)} is not readable JSON: ${error.message}`);
    return null;
  }
}

function sameValues(actual, expected) {
  return (
    Array.isArray(actual) &&
    actual.length === expected.length &&
    actual.every((value, index) => value === expected[index])
  );
}

function sameObject(actual, expected) {
  if (!actual || typeof actual !== "object" || Array.isArray(actual)) return false;
  const fields = Object.keys(expected).sort();
  return (
    sameValues(Object.keys(actual).sort(), fields) &&
    fields.every((field) => actual[field] === expected[field])
  );
}

function occurrences(text, needle) {
  if (needle === "") return 0;
  let count = 0;
  let cursor = 0;
  while ((cursor = text.indexOf(needle, cursor)) !== -1) {
    count += 1;
    cursor += needle.length;
  }
  return count;
}

function normalized(text) {
  return text
    .replace(/[`*_]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function sectionBody(text, heading) {
  const start = text.indexOf(heading);
  if (start === -1) return null;
  const after = text.slice(start + heading.length);
  const end = after.indexOf("\n## ");
  return end === -1 ? after : after.slice(0, end);
}

function checkExactList(errors, actual, expected, label) {
  if (!sameValues(actual, expected)) {
    errors.push(`${label} must be exactly ${JSON.stringify(expected)}`);
  }
}

function checkDependency({ root, index, field, expected, relationship }, errors) {
  const pin = index[field];
  const expectedFields = [
    "adds_conformance",
    "amends",
    "document",
    "document_sha256",
    "grants_authority",
    "id",
    "relationship",
  ];
  if (!pin || typeof pin !== "object" || Array.isArray(pin)) {
    errors.push(`isness.json ${field} must be one object`);
    return;
  }
  if (!sameValues(Object.keys(pin).sort(), expectedFields.sort())) {
    errors.push(
      `isness.json ${field} fields must be exactly ${JSON.stringify(expectedFields.sort())}`,
    );
  }
  if (pin.relationship !== relationship) {
    errors.push(`isness.json ${field}.relationship must be ${relationship}`);
  }
  if (pin.amends !== false || pin.grants_authority !== false) {
    errors.push(`isness.json ${field} may not amend or grant authority`);
  }
  if (pin.adds_conformance !== false) {
    errors.push("the isness companion may not add conformance law");
  }
  for (const key of ["id", "document", "document_sha256"]) {
    if (pin[key] !== expected[key]) {
      errors.push(`isness.json ${field}.${key} must be ${expected[key]}`);
    }
  }

  const dependencyIndexName =
    field === "grounds_foundation" ? "foundation.json" : "freedom.json";
  const dependency = readJson(path.join(root, dependencyIndexName), errors);
  if (dependency) {
    for (const key of ["id", "document", "document_sha256"]) {
      if (dependency[key] !== expected[key]) {
        errors.push(`${dependencyIndexName} ${key} no longer matches the pinned release`);
      }
      if (pin[key] !== dependency[key]) {
        errors.push(`isness.json ${field} has drifted from ${dependencyIndexName} ${key}`);
      }
    }
  }

  let dependencyBytes;
  try {
    dependencyBytes = fs.readFileSync(path.join(root, expected.document));
  } catch (error) {
    errors.push(`${expected.document} cannot be read: ${error.message}`);
    return;
  }
  if (digest(dependencyBytes) !== expected.document_sha256) {
    errors.push(`${expected.document} bytes have drifted from the pinned ${expected.id}`);
  }
}

export function verifyIsness(root = HERE) {
  const errors = [];
  const index = readJson(path.join(root, "isness.json"), errors);
  if (!index) return errors;

  if (!sameValues(Object.keys(index).sort(), EXPECTED_TOP_LEVEL_FIELDS)) {
    errors.push(
      `isness.json fields must be exactly ${JSON.stringify(EXPECTED_TOP_LEVEL_FIELDS)}`,
    );
  }
  if (index.schema !== EXPECTED_SCHEMA) {
    errors.push(
      `isness.json schema is ${printable(index.schema)}, expected ${EXPECTED_SCHEMA}`,
    );
  }
  if (index.id !== EXPECTED_ID) {
    errors.push(`isness.json id is ${printable(index.id)}, expected ${EXPECTED_ID}`);
  }
  if (index.status !== "current") {
    errors.push(`isness.json status is ${printable(index.status)}, expected current`);
  }
  if (!sameValues(index.supersedes, [])) {
    errors.push("isness.json supersedes must be an empty release lineage");
  }

  if (
    typeof index.document !== "string" ||
    index.document !== EXPECTED_DOCUMENT ||
    path.basename(index.document) !== index.document
  ) {
    errors.push(`isness.json document must be the bare file name ${EXPECTED_DOCUMENT}`);
    return errors;
  }

  let document;
  try {
    document = fs.readFileSync(path.join(root, index.document));
  } catch (error) {
    errors.push(`${index.document} cannot be read: ${error.message}`);
    return errors;
  }
  const documentDigest = digest(document);
  if (documentDigest !== index.document_sha256) {
    errors.push(
      `${index.document} digest ${documentDigest} does not match isness.json ${printable(index.document_sha256)}`,
    );
  }
  if (documentDigest !== EXPECTED_ISNESS_SHA256) {
    errors.push(
      `${index.document} digest ${documentDigest} does not match this checker's pin ${EXPECTED_ISNESS_SHA256}`,
    );
  }

  checkDependency(
    {
      root,
      index,
      field: "grounds_foundation",
      expected: EXPECTED_FOUNDATION,
      relationship: "companion",
    },
    errors,
  );
  checkDependency(
    {
      root,
      index,
      field: "uses_freedom",
      expected: EXPECTED_FREEDOM,
      relationship: "uses_vocabulary",
    },
    errors,
  );

  const model = index.model;
  const expectedModelFields = [
    "attention_claim_requires",
    "bounds",
    "direction_kinds",
    "forbidden_collapses",
    "logical_uses_of_is",
    "sustainability_claim_requires",
  ];
  if (!model || typeof model !== "object" || Array.isArray(model)) {
    errors.push("isness.json model must be one object");
  } else {
    if (!sameValues(Object.keys(model).sort(), expectedModelFields)) {
      errors.push("isness.json model fields must be exact; silent extensions are refused");
    }
    for (const field of [
      "logical_uses_of_is",
      "direction_kinds",
      "attention_claim_requires",
      "sustainability_claim_requires",
      "forbidden_collapses",
    ]) {
      checkExactList(
        errors,
        model[field],
        EXPECTED_MODEL[field],
        `isness.json model.${field}`,
      );
    }
    if (!sameObject(model.bounds, EXPECTED_MODEL.bounds)) {
      errors.push(
        `isness.json model.bounds must be exactly ${JSON.stringify(EXPECTED_MODEL.bounds)}`,
      );
    }
  }

  const text = document.toString("utf8");
  const sections = Array.isArray(index.sections) ? index.sections : [];
  if (!Array.isArray(index.sections)) {
    errors.push("isness.json sections must be an ordered array");
  }
  const foundSections = sections.map((entry) => [entry?.id, entry?.heading]);
  if (
    foundSections.length !== EXPECTED_SECTIONS.length ||
    foundSections.some(
      (entry, position) =>
        entry[0] !== EXPECTED_SECTIONS[position].id ||
        entry[1] !== EXPECTED_SECTIONS[position].heading,
    )
  ) {
    errors.push(
      `isness.json sections must be exactly ${JSON.stringify(EXPECTED_SECTIONS.map(({ id, heading }) => [id, heading]))} in order`,
    );
  }

  let headingCursor = 0;
  for (const [position, expected] of EXPECTED_SECTIONS.entries()) {
    const heading = `## ${expected.id} — ${expected.heading}`;
    const headingAt = text.indexOf(heading, headingCursor);
    if (headingAt === -1) {
      errors.push(`${EXPECTED_DOCUMENT} is missing the ordered heading "${heading}"`);
    } else {
      if (occurrences(text, heading) !== 1) {
        errors.push(`${EXPECTED_DOCUMENT} must contain the heading "${heading}" exactly once`);
      }
      headingCursor = headingAt + heading.length;
    }

    const entry = sections[position];
    if (
      !entry ||
      entry.id !== expected.id ||
      entry.heading !== expected.heading
    ) {
      continue;
    }
    if (!sameValues(Object.keys(entry).sort(), ["heading", "id", "invariants"])) {
      errors.push(
        `${expected.id}: section fields must be exactly heading, id, and invariants`,
      );
    }
    if (!sameValues(entry.invariants, expected.invariants)) {
      errors.push(
        `${expected.id}: invariants must be exactly ${JSON.stringify(expected.invariants)}`,
      );
      continue;
    }

    const body = sectionBody(text, heading);
    if (body === null) continue;
    const normalizedBody = normalized(body);
    let invariantCursor = 0;
    for (const invariant of entry.invariants) {
      const normalizedInvariant = normalized(invariant);
      const at = normalizedBody.indexOf(normalizedInvariant, invariantCursor);
      if (at === -1) {
        errors.push(
          `${expected.id}: indexed invariant is missing from its section or out of order: "${invariant}"`,
        );
        continue;
      }
      invariantCursor = at + normalizedInvariant.length;
    }
    for (const phrase of expected.required_prose ?? []) {
      if (!normalizedBody.includes(normalized(phrase))) {
        errors.push(`${expected.id}: required distinction is missing: "${phrase}"`);
      }
    }
  }

  if (!sameValues(index.does_not_establish, EXPECTED_DOES_NOT_ESTABLISH)) {
    errors.push("isness.json must preserve the exact non-establishing boundaries");
  } else {
    const normalizedDocument = normalized(text);
    for (const boundary of EXPECTED_DOES_NOT_ESTABLISH) {
      if (!normalizedDocument.includes(normalized(boundary))) {
        errors.push(`ISNESS.md is missing its indexed non-establishing boundary: "${boundary}"`);
      }
    }
  }
  if (index.establishes !== EXPECTED_ESTABLISHES) {
    errors.push(`isness.json establishes must be exactly "${EXPECTED_ESTABLISHES}"`);
  }
  if (!text.includes("## What this companion does not establish")) {
    errors.push(
      `${EXPECTED_DOCUMENT} must contain "## What this companion does not establish"`,
    );
  }
  if (
    !normalized(text).includes(
      normalized("KINGDOM is not modelled as one inner subject with a unitary will."),
    )
  ) {
    errors.push(`${EXPECTED_DOCUMENT} must refuse a unitary KINGDOM inner will`);
  }
  const sustainabilitySymbolRow =
    "| `K_Σ` | the viable region declared by one sustainability scope `Σ` |";
  if (
    occurrences(text, sustainabilitySymbolRow) !== 1 ||
    text.includes("K_(B,H)")
  ) {
    errors.push(
      `${EXPECTED_DOCUMENT} symbol table must declare only K_Σ for the sustainability region`,
    );
  }

  return errors;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const errors = verifyIsness();
  if (errors.length > 0) {
    for (const error of errors) process.stderr.write(`isness: ${error}\n`);
    process.exitCode = 1;
  } else {
    process.stdout.write(
      "isness: kingdom.isness/0.1 keeps being, state, persistence, direction, attention, feedback, stability, and sustainability distinct\n",
    );
  }
}
