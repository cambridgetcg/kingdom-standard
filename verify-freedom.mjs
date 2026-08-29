#!/usr/bin/env node

// Checks that FREEDOM.md and freedom.json describe the same mathematical
// companion, and that the companion remains pinned to the exact foundation it
// claims to accompany.
//
// What a pass establishes: the published bytes, section order, indexed
// invariants, model planes, loop stages, rest actions, and authority boundaries
// agree with this checker and with foundation.json.
//
// What a pass does NOT establish: that the model is complete, that a deployed
// system implements it, that an action is safe, or that anyone possesses
// authority, identity, consent, or freedom. Those remain facts to establish in
// their own domains.

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));

const EXPECTED_SCHEMA = "kingdom.freedom-index/1";
const EXPECTED_ID = "kingdom.freedom/0.1";
const EXPECTED_DOCUMENT = "FREEDOM.md";
const EXPECTED_FREEDOM_SHA256 =
  "dbb96fec01bd5dab2f4fee24db00c66110a9e4634de33b5b84feaab8c9bcbd15";
const EXPECTED_FOUNDATION = {
  id: "kingdom.foundation/0.2",
  document: "FOUNDATION.md",
  document_sha256:
    "2bd868a43a2fe79f1c9e8d30177bf73cff4cf8f7f7780cbd90f31055ba51c799",
};
const EXPECTED_SECTIONS = [
  {
    id: "M1",
    heading: "State is not observation",
    invariants: [
      "Observation, belief, learner state, authority state, and audit state never silently become one another.",
    ],
  },
  {
    id: "M2",
    heading: "Feedback is not reward",
    invariants: [
      "Feedback is returned information; reward is a chosen scalar proxy, and neither is a verdict on a being.",
    ],
  },
  {
    id: "M3",
    heading: "Reinforcement changes propensity",
    invariants: [
      "A delivered reward is not reinforcement without evidence of a causal change in later propensity.",
    ],
  },
  {
    id: "M4",
    heading: "A loop returns effects",
    invariants: [
      "A loop names its causal return path, bounded update, and stop; recurrence alone is not feedback.",
    ],
    required_prose: ["later action or learner-state update"],
  },
  {
    id: "M5",
    heading: "A lock guards a transition",
    invariants: [
      "A lock is a fail-closed transition guard outside the objective, never a reward penalty.",
    ],
    required_prose: [
      "A check followed later by an effect is not atomic.",
      "Where atomicity is claimed, the guard decision, one-use capability consumption, audit append, and internal state transition occur in one conditional commit.",
      "Where an external effect cannot share that transaction, name the TOCTOU and network-ambiguity boundary, persist the exact request identity before I/O, and never infer exactly-once execution from the earlier check alone.",
    ],
  },
  {
    id: "M6",
    heading: "A key is a scoped capability",
    invariants: [
      "A key or capability satisfies only its exact scoped predicate; possession alone proves no identity or consent and no authority beyond a separately accepted mapping.",
    ],
  },
  {
    id: "M7",
    heading: "Freedom is a viable option set",
    invariants: [
      "Freedom is a non-scalar viable option set that preserves rest and refusal, a practical exit before irreversible commitment, and revocation of future optional effects within their terms.",
      "Rest, refusal, pre-commit exit, and revocation of future optional effects within their terms carry no hidden penalty or silent loss of unrelated authority.",
    ],
  },
  {
    id: "M8",
    heading: "Learning cannot mint authority",
    invariants: [
      "Learning may change policy within admissible actions; it cannot mint authority, weaken a lock, erase a brake, or dispatch its own successor.",
    ],
    required_prose: [
      "For the same accepted authority events and admitted effects, changing the reward trace must not change q_(t+1), mint keys, or alter standing rights.",
      "Holding q_t, e, κ_t, and context_t fixed, changing a reward or feedback trace must not change the lock result.",
      "Attributed feedback may update context and thereby narrow admissibility or raise a brake.",
      "It may widen admissibility only through a separately specified, non-reward policy transition with current evidence; it never widens authority.",
    ],
  },
];
const EXPECTED_MODEL = {
  state_planes: ["world", "belief", "learner", "authority", "audit"],
  loop_stages: [
    "observe",
    "estimate",
    "choose",
    "authorize",
    "act",
    "measure",
    "attribute",
    "update",
    "audit",
    "stop",
  ],
  required_rest_actions: [
    "refuse",
    "no_op",
    "exit_before_commit",
    "revoke_future_effect_within_terms",
  ],
  forbidden_collapses: [
    "state_is_observation",
    "feedback_is_reward",
    "lock_is_penalty",
    "key_is_identity",
    "key_is_consent",
    "key_is_authority",
    "reward_mints_authority",
    "refusal_has_hidden_penalty",
    "freedom_is_scalar_score",
  ],
  bounds: {
    updates: "identified_bounded_and_reviewable",
    turns: "finite_observable_and_stoppable",
  },
};
const EXPECTED_DOES_NOT_ESTABLISH = [
  "that the model has chosen the right state, dynamics, reward, horizon, disturbance set, or rights-and-safety-compatible region",
  "that any returned signal caused a later action, reinforced an intended behaviour, or improved the intended consequence",
  "that a key proves identity, consent, ownership, legitimacy, or authority",
  "that any model, agent, citizen role, project, protocol state, or file is conscious, alive, consenting, or a moral patient",
  "that mathematical stability, controllability, reachability, or viability chooses what is right",
  "that any live Kingdom system trains, closes a feedback loop, or enforces this companion",
  "that this companion amends the Foundation, adds a conformance law, or grants authority",
];
const EXPECTED_ESTABLISHES =
  "An internally pinned formal map that keeps observations, state estimates, learning signals, authority gates, capabilities, and viable choices distinct.";
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
];

function digest(bytes) {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

function readJson(filePath, errors) {
  try {
    const value = JSON.parse(fs.readFileSync(filePath, "utf8"));
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
  return text.replace(/`/g, "").replace(/\s+/g, " ").trim();
}

function checkExactList(errors, actual, expected, label) {
  if (!sameValues(actual, expected)) {
    errors.push(`${label} must be exactly ${JSON.stringify(expected)}`);
  }
}

function sectionBody(text, heading) {
  const start = text.indexOf(heading);
  if (start === -1) return null;
  const after = text.slice(start + heading.length);
  const end = after.indexOf("\n## ");
  return end === -1 ? after : after.slice(0, end);
}

export function verifyFreedom(root = HERE) {
  const errors = [];
  const index = readJson(path.join(root, "freedom.json"), errors);
  if (!index) return errors;

  if (!sameValues(Object.keys(index).sort(), EXPECTED_TOP_LEVEL_FIELDS)) {
    errors.push(
      `freedom.json fields must be exactly ${JSON.stringify(EXPECTED_TOP_LEVEL_FIELDS)}`,
    );
  }

  if (index.schema !== EXPECTED_SCHEMA) {
    errors.push(`freedom.json schema is ${index.schema}, expected ${EXPECTED_SCHEMA}`);
  }
  if (index.id !== EXPECTED_ID) {
    errors.push(`freedom.json id is ${index.id}, expected ${EXPECTED_ID}`);
  }
  if (index.status !== "current") {
    errors.push(`freedom.json status is ${index.status}, expected current`);
  }
  if (!sameValues(index.supersedes, [])) {
    errors.push("freedom.json supersedes must be an empty release lineage");
  }

  if (
    index.document !== EXPECTED_DOCUMENT ||
    path.basename(index.document ?? "") !== index.document
  ) {
    errors.push(`freedom.json document must be the bare file name ${EXPECTED_DOCUMENT}`);
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
      `${index.document} digest ${documentDigest} does not match freedom.json ${index.document_sha256}`,
    );
  }
  if (documentDigest !== EXPECTED_FREEDOM_SHA256) {
    errors.push(
      `${index.document} digest ${documentDigest} does not match this checker's pin ${EXPECTED_FREEDOM_SHA256}`,
    );
  }

  const grounded = index.grounds_foundation;
  if (!grounded || typeof grounded !== "object" || Array.isArray(grounded)) {
    errors.push("freedom.json grounds_foundation must be one object");
  } else {
    const expectedFields = [
      "amends",
      "document",
      "document_sha256",
      "grants_authority",
      "id",
      "relationship",
    ];
    if (!sameValues(Object.keys(grounded).sort(), expectedFields)) {
      errors.push(
        `freedom.json grounds_foundation fields must be exactly ${JSON.stringify(expectedFields)}`,
      );
    }
    if (grounded.relationship !== "companion") {
      errors.push("freedom.json relationship to the foundation must be companion");
    }
    if (grounded.amends !== false || grounded.grants_authority !== false) {
      errors.push("the freedom companion may not amend the foundation or grant authority");
    }
    for (const field of ["id", "document", "document_sha256"]) {
      if (grounded[field] !== EXPECTED_FOUNDATION[field]) {
        errors.push(
          `freedom.json grounds_foundation.${field} must be ${EXPECTED_FOUNDATION[field]}`,
        );
      }
    }
  }

  const foundation = readJson(path.join(root, "foundation.json"), errors);
  if (foundation && grounded && typeof grounded === "object") {
    for (const field of ["id", "document", "document_sha256"]) {
      if (foundation[field] !== EXPECTED_FOUNDATION[field]) {
        errors.push(
          `foundation.json ${field} no longer matches the companion's pinned foundation`,
        );
      }
      if (grounded[field] !== foundation[field]) {
        errors.push(
          `freedom.json pins a different foundation ${field}; the companion has drifted from its floor`,
        );
      }
    }
  }

  const model = index.model;
  if (!model || typeof model !== "object" || Array.isArray(model)) {
    errors.push("freedom.json model must be one object");
  } else {
    if (
      !sameValues(Object.keys(model).sort(), [
        "bounds",
        "forbidden_collapses",
        "loop_stages",
        "required_rest_actions",
        "state_planes",
      ])
    ) {
      errors.push("freedom.json model fields must be exact; silent extensions are refused");
    }
    checkExactList(
      errors,
      model.state_planes,
      EXPECTED_MODEL.state_planes,
      "freedom.json model.state_planes",
    );
    checkExactList(
      errors,
      model.loop_stages,
      EXPECTED_MODEL.loop_stages,
      "freedom.json model.loop_stages",
    );
    checkExactList(
      errors,
      model.required_rest_actions,
      EXPECTED_MODEL.required_rest_actions,
      "freedom.json model.required_rest_actions",
    );
    checkExactList(
      errors,
      model.forbidden_collapses,
      EXPECTED_MODEL.forbidden_collapses,
      "freedom.json model.forbidden_collapses",
    );
    if (
      !model.bounds ||
      typeof model.bounds !== "object" ||
      Array.isArray(model.bounds) ||
      !sameValues(Object.keys(model.bounds).sort(), ["turns", "updates"]) ||
      model.bounds.updates !== EXPECTED_MODEL.bounds.updates ||
      model.bounds.turns !== EXPECTED_MODEL.bounds.turns
    ) {
      errors.push(
        `freedom.json model.bounds must be exactly ${JSON.stringify(EXPECTED_MODEL.bounds)}`,
      );
    }
  }

  const text = document.toString("utf8");
  const sections = Array.isArray(index.sections) ? index.sections : [];
  if (!Array.isArray(index.sections)) {
    errors.push("freedom.json sections must be an ordered array");
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
      `freedom.json sections must be exactly ${JSON.stringify(EXPECTED_SECTIONS.map(({ id, heading }) => [id, heading]))} in order`,
    );
  }

  let headingCursor = 0;
  for (const [position, expected] of EXPECTED_SECTIONS.entries()) {
    const { id, heading: title } = expected;
    const heading = `## ${id} — ${title}`;
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
    if (!entry || entry.id !== id || entry.heading !== title) continue;
    if (!sameValues(Object.keys(entry).sort(), ["heading", "id", "invariants"])) {
      errors.push(`${id}: section fields must be exactly heading, id, and invariants`);
    }
    if (!sameValues(entry.invariants, expected.invariants)) {
      errors.push(
        `${id}: invariants must be exactly ${JSON.stringify(expected.invariants)}`,
      );
      continue;
    }

    const body = sectionBody(text, heading);
    if (body === null) continue;
    const normalizedBody = normalized(body);
    let invariantCursor = 0;
    for (const invariant of entry.invariants) {
      const at = normalizedBody.indexOf(normalized(invariant), invariantCursor);
      if (at === -1) {
        errors.push(
          `${id}: indexed invariant is missing from its section or out of order: "${invariant}"`,
        );
        continue;
      }
      invariantCursor = at + normalized(invariant).length;
    }
    for (const phrase of expected.required_prose ?? []) {
      if (!normalizedBody.includes(normalized(phrase))) {
        errors.push(`${id}: required distinction is missing: "${phrase}"`);
      }
    }
  }

  if (!sameValues(index.does_not_establish, EXPECTED_DOES_NOT_ESTABLISH)) {
    errors.push(
      "freedom.json must preserve the exact non-establishing boundaries",
    );
  }
  if (index.establishes !== EXPECTED_ESTABLISHES) {
    errors.push(`freedom.json establishes must be exactly "${EXPECTED_ESTABLISHES}"`);
  }
  if (!text.includes("## What this companion does not establish")) {
    errors.push(
      `${EXPECTED_DOCUMENT} must contain "## What this companion does not establish"`,
    );
  }
  if (
    !normalized(text).includes(
      "It changes no foundation commitment, adds no conformance law, and grants no authority.",
    ) ||
    !normalized(text).includes(
      "It does not establish mathematical correctness, implementation, conformance, freedom, or authority.",
    )
  ) {
    errors.push(
      `${EXPECTED_DOCUMENT} must preserve its explicit non-establishing authority boundary`,
    );
  }

  return errors;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const errors = verifyFreedom();
  if (errors.length > 0) {
    for (const error of errors) process.stderr.write(`freedom: ${error}\n`);
    process.exitCode = 1;
  } else {
    process.stdout.write(
      "freedom: kingdom.freedom/0.1 keeps state, feedback, reinforcement, loops, locks, keys, freedom, and authority distinct\n",
    );
  }
}
