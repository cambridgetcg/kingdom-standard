#!/usr/bin/env node

// Checks that ENCOUNTER.md and encounter.json publish one closed, pinned
// relationship companion and that every inherited term remains attached to
// the exact Foundation, FREEDOM, and ISNESS releases it names.
//
// A pass establishes only byte identity and agreement with the distinctions
// encoded here. It does not establish historical truth, prediction, threat,
// legitimacy, implementation, conformance, military authority, or authority
// of any other kind.

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));

const EXPECTED_SCHEMA = "kingdom.encounter-index/1";
const EXPECTED_ID = "kingdom.encounter/0.1";
const EXPECTED_DOCUMENT = "ENCOUNTER.md";
// Replaced only after the publication bytes are frozen. Until then, the
// checker intentionally cannot bless a release merely because encounter.json
// was repinned with the edited document.
const EXPECTED_ENCOUNTER_SHA256 =
  "c84953037b270b1a6178dabc88b7a11ea3bc98fcd64c2c543e4bc63877cfb3eb";
const EXPECTED_ATLAS_SHA256 =
  "36325b94a58d005a18f6f632ab4e3d86d9f30338143e056248a9cd80a3c5c12d";

const EXPECTED_ATLAS_BOUNDARIES = [
  "This is the historical source atlas for the KINGDOM encounter companion. It is representative, not exhaustive.",
  "It does not rank peoples, identify a superior civilisation, predict an inevitable “clash,” or turn a historical pattern into a present command.",
  "This atlas changes no Foundation, FREEDOM, ISNESS, or encounter commitment, adds no conformance law, grants no authority, and authorizes no action.",
  "It does not identify enemies, forecast destiny, excuse pre-emption, allocate collective guilt, prescribe conquest, or teach operational violence.",
  "No civilisation is one being. No duration is a reward. No historical association is a key.",
];

const EXPECTED_ATLAS_CASES = [
  "Zhou — layered lineage rule and a portable legitimacy language",
  "Qin — concentrated mobilization and the brittleness of compulsory scale",
  "Han — revision, mixed administration, and arguments over fiscal reach",
  "Tang — fiscal reform after the social facts changed",
  "Song — fiscal monetization, civilian administration, and costly resilience",
  "Yuan — continental integration, plural intermediaries, and uneven currency",
  "Ming — agrarian registers meeting a silver-commercial world",
  "Qing — broad territorial rule with constrained fiscal depth",
  "Tokugawa — nested rule, standardized status, and commercial transformation",
  "Achaemenid — imperial standards with negotiated regional administration",
  "Roman imperial West — city-mediated fiscal power and unequal expanding citizenship",
  "Byzantine / East Roman — survival by reconfiguration after territorial shock",
  "Abbasid — specialized administration, provincial bargaining, symbolic afterlife",
  "Ottoman — negotiated incorporation, revenue delegation, and creditor power",
  "Mughal — ranked service, assigned revenue, and plural local brokerage",
  "Chola — inscription-rich nested administration, irrigation, and merchant power",
  "Aksum and Ethiopian highland states — institutional lineage without seamless identity",
  "Mali and Songhai — river, caravan, agrarian, and scholarly networks",
  "Inka — labor taxation, reciprocal obligation, records, and logistical concentration",
  "Haudenosaunee Confederacy — nested sovereignty, consensus, and living continuity",
  "Venice — constrained executive, oligarchic records, and public debt",
  "Dutch Republic — federated bargaining, creditor representation, and colonial extraction",
  "Holy Roman Empire — negotiated order without a sovereign fiscal center",
];

const EXPECTED_ATLAS_CASE_LABELS = [
  "Scope and evidence",
  "Power",
  "Fiscal and money",
  "Durability and adaptation",
  "Harms and exclusions",
  "Pressures and transformation",
  "Bounded KINGDOM inference",
  "Non-inference",
];

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
const EXPECTED_ISNESS = {
  id: "kingdom.isness/0.1",
  document: "ISNESS.md",
  document_sha256:
    "1ba5cfbde11d6a0a549909cc1bb227534bd2db9fc1728affda7e814433e47de6",
};

const EXPECTED_SECTIONS = [
  {
    id: "E1",
    heading: "Civilisation is not a unitary being",
    invariants: [
      "A civilisation is a contested analytical grouping, never one inferred being, will, moral rank, enemy, or bearer of collective guilt.",
    ],
  },
  {
    id: "E2",
    heading: "Encounter is typed, not destined enmity",
    invariants: [
      "Difference does not imply hostility or destined enmity; each encounter classification names attributed evidence of the particular acts, actors, authority, time, and uncertainty involved.",
    ],
    required_prose: [
      "Classification names the source, time, jurisdiction, evidence, uncertainty, and reply path. It is revised when facts change.",
      "An encounter can carry multiple compatible types; each typing changes with evidence and retains uncertainty, an accountable source, and a correction path.",
    ],
  },
  {
    id: "E3",
    heading: "Strategy separates claims and authority",
    invariants: [
      "Strategy may compare evidence, capabilities, expectations, and options, but only a separate accepted purpose and current authority may admit an effect.",
    ],
    required_prose: [
      "observed condition → inferred capability → predicted expectation → proposed option → accepted purpose → current authority and guard → admitted effect → observed effect",
      "Feedback about an earlier turn may revise the next proposal; it cannot authorize it.",
      "Its deception and espionage belong to an ancient military text; they do not become KINGDOM's civic, diplomatic, or administrative ethic.",
      "The authority-and-guard arrow is conditional, not temporal inevitability. It atomically rechecks current purpose, authority, scope, law, lock, and halt at commit. Failed or unknown yields no admitted effect and returns rest; an accepted purpose supplies no credential by itself.",
    ],
  },
  {
    id: "E4",
    heading: "Duration is not justice",
    invariants: [
      "Longevity, victory, expansion, wealth, stability, and administrative capacity establish neither justice nor superiority, and collapse does not erase a people or all institutional continuity.",
    ],
    required_prose: [
      "P(state persists through H) does not determine P(rights, capabilities, obligations, and ecology remain viable through H)",
      "Every component retains its own unit, method, boundary, uncertainty, and counterevidence. unknown remains unknown and is never converted to zero or a midpoint.",
      "A review may identify a substantiated dependency that fails its own dimension-specific declared adequacy criterion under a declared disturbance, but it neither orders nor compares unlike units, infers an unknown dimension, nor aggregates the profile into one number.",
      "This profile is not a causal historical law, scalar civilisation score, optimization target, or permission to preserve a state at others' expense.",
    ],
  },
  {
    id: "E5",
    heading: "Power is multidimensional and separated",
    invariants: [
      "Power is recorded by distinct agenda, rulemaking, appointment, administrative, fiscal, monetary, coercive, informational, and judicial capacities, with independent audit, appeal, and stop paths.",
    ],
    required_prose: [
      "agenda, rulemaking, appointment, administration, fiscal, monetary, coercive, informational, judicial",
    ],
  },
  {
    id: "E6",
    heading: "Money is constitutional power",
    invariants: [
      "Money and public finance distribute real power; assessment, collection, issuance, custody, spending, pledging, and audit remain separately authorized and publicly attributable.",
    ],
    required_prose: [
      "A creditor does not acquire unilateral control over essential governance rails.",
      "Let T_t be only liquid public treasury cash in one declared unit.",
      "Treasury cash is not net position. Assets, liabilities, restricted funds, guarantees, arrears, and contingent claims stay in separate reconciled balance-sheet ledgers.",
    ],
  },
  {
    id: "E7",
    heading: "Fiscal reciprocity requires incidence",
    invariants: [
      "A fiscal system is judged through reciprocal public purpose and explicit incidence across payers, beneficiaries, collectors, creditors, risk bearers, affected nonparties, and future turns—not revenue alone.",
    ],
    required_prose: [
      "Borrowing creates present liquidity and future claims and exposure.",
      "Neither effect is presumed or netted without separate evidence.",
      "Delegated collection is never delegated sovereignty.",
    ],
  },
  {
    id: "E8",
    heading: "Plural jurisdictions retain rights and appeal",
    invariants: [
      "Plural jurisdictions retain contextual authority only inside a common rights floor with explicit scope, conflicts rules, fiscal fairness, protected exit, and independent appeal.",
    ],
  },
  {
    id: "E9",
    heading: "Diplomacy and interoperability come first",
    invariants: [
      "Peaceful encounter begins with translation, communication, negotiation, mediation, agreed settlement, de-escalation, protected nonparticipants, verification, repair, and exit before coercive escalation.",
    ],
  },
  {
    id: "E10",
    heading: "Defence remains lawful and civilian-protective",
    invariants: [
      "Authority to use force and rules governing conduct in armed conflict are distinct legal questions; this companion grants neither, every KINGDOM effect requires current applicable-law authority, and whenever international humanitarian law applies its civilian protections remain binding without authorizing conquest or collective harm.",
    ],
    required_prose: [
      "Legal authority to use force and legal rules governing conduct after an armed conflict exists are distinct questions.",
      "International humanitarian law applies only where its armed-conflict threshold and scope are met.",
      "Non-armed protective, domestic, and law-enforcement action is governed by other applicable domestic and international human-rights rules.",
      "Calling an act “defence” selects none of these regimes.",
      "No adversary label removes standing. No expected advantage authorizes aggressive conquest, collective punishment, torture, hostage-taking, starvation of civilians, sexual violence, forced disappearance, persecution, indiscriminate attack, cultural destruction, or autonomous lethal decision.",
      "Humane constraints do not depend on reciprocity. They are not rewards and do not disappear because another party violates them.",
      "Nothing here supplies operational targeting, weapons, sabotage, covert manipulation, espionage, or battle tactics. It intentionally omits target selection, weapon construction or employment, covert influence, cyber intrusion, and evasion methods.",
    ],
  },
  {
    id: "E11",
    heading: "Emergency authority decays",
    invariants: [
      "Emergency authority is least-privileged, independently reviewable, resource-bounded, automatically expiring, non-self-renewing, and unable to become ordinary power through silence or recurrence.",
    ],
    required_prose: [
      "It is least-privileged, expires automatically, and cannot renew itself.",
      "A fresh grant requires fresh evidence and the ordinary legitimate authority wherever that remains possible.",
    ],
  },
  {
    id: "E12",
    heading: "Succession and adaptation remain corrigible",
    invariants: [
      "Durable adaptation requires authenticated succession, preserved obligations, independent bad-news channels, reversible trials, reserves for maintenance and repair, and a finite loop that ends or receives fresh authority.",
    ],
    required_prose: [
      "Feedback from the loop may inform a later proposal. It cannot widen q_t, clear a failed or unknown lock, defeat h_t, or dispatch its successor.",
      "A raised or unreadable halt yields rest regardless of expected durability, revenue, reward, or victory.",
    ],
  },
];

const EXPECTED_MODEL = {
  encounter_types: [
    "exchange",
    "interdependence",
    "incompatibility",
    "coercion",
    "armed_attack",
    "unknown",
  ],
  strategy_claim_stages: [
    "observed_condition",
    "inferred_capability",
    "predicted_expectation",
    "proposed_option",
    "accepted_purpose",
    "current_authority_and_guard",
    "admitted_effect",
    "observed_effect",
  ],
  power_dimensions: [
    "agenda",
    "rulemaking",
    "appointment",
    "administration",
    "fiscal",
    "monetary",
    "coercive",
    "informational",
    "judicial",
  ],
  fiscal_incidence_requires: [
    "payer",
    "beneficiary",
    "collector",
    "creditor",
    "risk_bearer",
    "affected_nonparty",
    "time_horizon",
  ],
  required_encounter_scope: [
    "parties",
    "authoritative_homes",
    "jurisdictions",
    "languages",
    "claims",
    "dependencies",
    "power_asymmetries",
    "settlement_rails",
    "affected_nonparticipants",
    "disturbances",
    "uncertainty",
    "deescalation",
    "exit",
    "repair",
    "stop",
  ],
  peaceful_sequence: [
    "translate",
    "communicate",
    "negotiate",
    "mediate",
    "arbitrate_or_adjudicate",
    "deescalate",
  ],
  forbidden_collapses: [
    "civilisation_is_unitary_will",
    "difference_is_destined_enmity",
    "civilisational_ranking",
    "collective_guilt",
    "conquest_is_preparation",
    "duration_is_justice",
    "victory_is_legitimacy",
    "strategy_mints_authority",
    "feedback_mints_authority",
    "reward_mints_authority",
    "deception_is_civic_ethic",
    "survival_overrides_halt",
    "money_is_neutral",
    "revenue_delegation_is_sovereignty",
    "creditor_claim_is_governing_control",
    "local_power_overrides_rights",
    "collective_punishment_is_defence",
    "torture_is_defence",
    "hostage_taking_is_defence",
    "civilian_starvation_is_defence",
    "cultural_destruction_is_defence",
    "autonomous_lethality_is_authority",
    "emergency_suspends_rights",
    "emergency_is_permanent",
  ],
  bounds: {
    history: "evidence_contestation_and_inference_separated",
    defence: "current_law_current_authority_and_civilian_protection",
    emergency: "scoped_expiring_and_freshly_authorized",
    continuation: "fresh_authorized_turns_only",
  },
};

const EXPECTED_ESTABLISHES =
  "An internally pinned vocabulary for studying contact among domains and civilisations while keeping encounter type, strategy, purpose, power, money, fiscal incidence, jurisdiction, diplomacy, defence, emergency, succession, and historical inference distinct.";

const EXPECTED_DOES_NOT_ESTABLISH = [
  "that a civilisation is a being, has one inner will, or can be assigned a moral rank, inherited enemy status, or collective guilt",
  "that difference produces hostility, a clash is destined, an adversary's intentions are readable, or an encounter has been legally classified",
  "that the representative atlas is exhaustive, proves one cause of durability or collapse, supplies a universal law of history, or erases source bias and contested interpretation",
  "that longevity, victory, expansion, wealth, stable money, central capacity, or survival establishes justice, superiority, consent, standing, or a right to continue",
  "authority to tax, borrow, issue money, spend, pledge revenue, collect data, deceive, surveil, coerce, punish, spy, attack, wage war, or dispatch another turn",
  "an operational military, intelligence, propaganda, cyber, weapon, targeting, evasion, or covert-action method",
  "that a proposed defence or emergency is lawful, necessary, proportionate, factually justified, or compliant with international or domestic law",
  "that group identity removes individual standing or permits collective punishment, torture, hostage-taking, starvation, persecution, cultural destruction, or autonomous lethal decision",
  "that security, emergency, debt, fiscal capacity, strategy, reward, feedback, victory, or institutional survival overrides rights, refusal, halt, appeal, repair, or separately accepted authority",
  "that this companion or its atlas is implemented, adopted, exhaustive, or conformed to, amends the Foundation, FREEDOM, or ISNESS, adds a conformance law, grants authority, or predicts what KINGDOM will do",
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
  "sources_atlas",
  "status",
  "supersedes",
  "uses_freedom",
  "uses_isness",
];

function digest(bytes) {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

function printable(value) {
  const encoded = JSON.stringify(value);
  return encoded === undefined ? String(value) : encoded;
}

// JSON.parse accepts duplicate object names with last-one-wins semantics.
// Compare decoded names before trusting the parsed manifest, including escaped
// spellings such as `am\u0065nds` beside `amends`.
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
    while (cursor < source.length && !/[,\]}\s]/.test(source[cursor])) {
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

function containedPath(root, candidate, label, errors) {
  try {
    const realRoot = fs.realpathSync(root);
    const realCandidate = fs.realpathSync(candidate);
    const relative = path.relative(realRoot, realCandidate);
    if (
      relative === "" ||
      relative === ".." ||
      relative.startsWith(`..${path.sep}`) ||
      path.isAbsolute(relative)
    ) {
      errors.push(`${label} escapes the verifier root`);
      return null;
    }
    return realCandidate;
  } catch (error) {
    errors.push(`${label} cannot be read: ${error.message}`);
    return null;
  }
}

function readJson(root, name, errors) {
  const filePath = containedPath(root, path.join(root, name), name, errors);
  if (!filePath) return null;
  try {
    const source = fs.readFileSync(filePath, "utf8");
    const value = JSON.parse(source);
    const duplicates = duplicateObjectKeys(source);
    if (duplicates.length > 0) {
      errors.push(
        `${name} contains duplicate object keys: ${JSON.stringify([...new Set(duplicates)])}`,
      );
      return null;
    }
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      errors.push(`${name} root must be one JSON object`);
      return null;
    }
    return value;
  } catch (error) {
    errors.push(`${name} is not readable JSON: ${error.message}`);
    return null;
  }
}

function readBytes(root, name, errors) {
  const filePath = containedPath(root, path.join(root, name), name, errors);
  if (!filePath) return null;
  try {
    return fs.readFileSync(filePath);
  } catch (error) {
    errors.push(`${name} cannot be read: ${error.message}`);
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

function checkDependency(
  { root, index, field, indexName, expected, relationship },
  errors,
) {
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
    errors.push(`encounter.json ${field} must be one object`);
    return;
  }
  if (!sameValues(Object.keys(pin).sort(), expectedFields)) {
    errors.push(
      `encounter.json ${field} fields must be exactly ${JSON.stringify(expectedFields)}`,
    );
  }
  if (pin.relationship !== relationship) {
    errors.push(`encounter.json ${field}.relationship must be ${relationship}`);
  }
  if (pin.amends !== false || pin.grants_authority !== false) {
    errors.push(`encounter.json ${field} may not amend or grant authority`);
  }
  if (pin.adds_conformance !== false) {
    errors.push(`encounter.json ${field} may not add conformance law`);
  }
  for (const key of ["id", "document", "document_sha256"]) {
    if (pin[key] !== expected[key]) {
      errors.push(`encounter.json ${field}.${key} must be ${expected[key]}`);
    }
  }

  const dependency = readJson(root, indexName, errors);
  if (dependency) {
    for (const key of ["id", "document", "document_sha256"]) {
      if (dependency[key] !== expected[key]) {
        errors.push(`${indexName} ${key} no longer matches the pinned release`);
      }
      if (pin[key] !== dependency[key]) {
        errors.push(`encounter.json ${field} has drifted from ${indexName} ${key}`);
      }
    }
  }

  const dependencyBytes = readBytes(root, expected.document, errors);
  if (
    dependencyBytes &&
    digest(dependencyBytes) !== expected.document_sha256
  ) {
    errors.push(`${expected.document} bytes have drifted from the pinned ${expected.id}`);
  }
}

function atlasCases(text, errors) {
  const startHeading = "## East Asian cases";
  const endHeading = "## Comparative findings: recurrent mechanisms, never a recipe";
  const start = text.indexOf(startHeading);
  const end = text.indexOf(endHeading);
  if (start === -1 || end === -1 || end <= start) {
    errors.push(
      "CIVILISATIONS.md must contain one bounded case region from East Asian cases through Comparative findings",
    );
    return [];
  }

  const offset = start + startHeading.length;
  const region = text.slice(offset, end);
  const matches = [...region.matchAll(/^### (.+)$/gm)];
  const headings = matches.map((match) => match[1]);
  if (!sameValues(headings, EXPECTED_ATLAS_CASES)) {
    errors.push(
      `CIVILISATIONS.md case headings must be exactly ${JSON.stringify(EXPECTED_ATLAS_CASES)} in order`,
    );
  }

  return matches.map((match, index) => {
    const bodyStart = offset + match.index + match[0].length;
    const bodyEnd =
      index + 1 < matches.length ? offset + matches[index + 1].index : end;
    return { heading: match[1], body: text.slice(bodyStart, bodyEnd) };
  });
}

function expandSourceReferences(text, label, errors) {
  const references = [];
  const citations = [...text.matchAll(/Sources:\s*([^\n.]+)\./g)];
  const tokenPattern = /\b([A-Z]+)(\d+)(?:\s*[–-]\s*(?:([A-Z]+))?(\d+))?\b/g;

  for (const citation of citations) {
    const expression = new RegExp(tokenPattern.source, "g");
    let tokenCount = 0;
    let token;
    while ((token = expression.exec(citation[1])) !== null) {
      tokenCount += 1;
      const startPrefix = token[1];
      const startNumber = Number(token[2]);
      const endPrefix = token[3] ?? startPrefix;
      const endNumber = token[4] === undefined ? startNumber : Number(token[4]);
      if (startPrefix !== endPrefix || endNumber < startNumber) {
        errors.push(`${label} contains an invalid source range: ${token[0]}`);
        continue;
      }
      if (endNumber - startNumber > 200) {
        errors.push(`${label} contains an unreasonably large source range: ${token[0]}`);
        continue;
      }
      for (let number = startNumber; number <= endNumber; number += 1) {
        references.push(`${startPrefix}${number}`);
      }
    }

    const residue = citation[1]
      .replace(tokenPattern, "")
      .replace(/\b(?:and|or)\b/gi, "")
      .replace(/[,&;\s]/g, "");
    if (tokenCount === 0 || residue !== "") {
      errors.push(`${label} contains malformed source identifiers: ${citation[1]}`);
    }
  }

  return { citationCount: citations.length, references };
}

function checkAtlasSemantics(text, errors) {
  const atlasId = "`kingdom.encounter.sources/0.1`";
  if (occurrences(text, atlasId) !== 1) {
    errors.push(`CIVILISATIONS.md must declare ${atlasId} exactly once`);
  }
  const normalizedAtlas = normalized(text);
  for (const boundary of EXPECTED_ATLAS_BOUNDARIES) {
    if (!normalizedAtlas.includes(normalized(boundary))) {
      errors.push(`CIVILISATIONS.md is missing its atlas boundary: "${boundary}"`);
    }
  }

  const cases = atlasCases(text, errors);
  const caseReferences = [];
  for (const entry of cases) {
    const labels = [...entry.body.matchAll(/^- \*\*([^\n:*]+):\*\*/gm)].map(
      (match) => match[1],
    );
    if (!sameValues(labels, EXPECTED_ATLAS_CASE_LABELS)) {
      errors.push(
        `${entry.heading}: case labels must be exactly ${JSON.stringify(EXPECTED_ATLAS_CASE_LABELS)} in order`,
      );
    }
    const citation = expandSourceReferences(entry.body, entry.heading, errors);
    if (citation.citationCount === 0 || citation.references.length === 0) {
      errors.push(`${entry.heading}: must cite at least one source-register identifier`);
    }
    caseReferences.push(...citation.references);
  }

  const registerHeading = "## Source register";
  const registerAt = text.indexOf(registerHeading);
  if (registerAt === -1 || occurrences(text, registerHeading) !== 1) {
    errors.push("CIVILISATIONS.md must contain exactly one Source register");
    return;
  }
  const register = text.slice(registerAt + registerHeading.length);
  const definitions = [...register.matchAll(/^- \*\*([A-Z]+\d+)\.\*\*/gm)].map(
    (match) => match[1],
  );
  const duplicateDefinitions = definitions.filter(
    (identifier, index) => definitions.indexOf(identifier) !== index,
  );
  if (duplicateDefinitions.length > 0) {
    errors.push(
      `CIVILISATIONS.md source register contains duplicate identifiers: ${JSON.stringify([...new Set(duplicateDefinitions)])}`,
    );
  }

  const caseRegionStart = text.indexOf("## East Asian cases");
  const caseRegionEnd = text.indexOf(
    "## Comparative findings: recurrent mechanisms, never a recipe",
  );
  const outsideCaseRegion =
    caseRegionStart !== -1 && caseRegionEnd > caseRegionStart
      ? `${text.slice(0, caseRegionStart)}${text.slice(caseRegionEnd, registerAt)}`
      : text.slice(0, registerAt);
  const outsideCaseReferences = expandSourceReferences(
    outsideCaseRegion,
    "CIVILISATIONS.md",
    errors,
  ).references;
  const defined = new Set(definitions);
  const undefinedReferences = [...new Set([...caseReferences, ...outsideCaseReferences])]
    .filter((identifier) => !defined.has(identifier))
    .sort();
  if (undefinedReferences.length > 0) {
    errors.push(
      `CIVILISATIONS.md cites undefined source identifiers: ${JSON.stringify(undefinedReferences)}`,
    );
  }
}

function checkSourcesAtlas({ root, index }, errors) {
  const atlas = index.sources_atlas;
  const expectedFields = [
    "adds_conformance",
    "document",
    "document_sha256",
    "grants_authority",
    "id",
    "relationship",
  ];
  if (!atlas || typeof atlas !== "object" || Array.isArray(atlas)) {
    errors.push("encounter.json sources_atlas must be one object");
    return;
  }
  if (!sameValues(Object.keys(atlas).sort(), expectedFields)) {
    errors.push(
      `encounter.json sources_atlas fields must be exactly ${JSON.stringify(expectedFields)}`,
    );
  }
  if (atlas.id !== "kingdom.encounter.sources/0.1") {
    errors.push(
      "encounter.json sources_atlas.id must be kingdom.encounter.sources/0.1",
    );
  }
  if (
    typeof atlas.document !== "string" ||
    atlas.document !== "CIVILISATIONS.md" ||
    path.basename(atlas.document) !== atlas.document
  ) {
    errors.push(
      "encounter.json sources_atlas.document must be the bare file name CIVILISATIONS.md",
    );
    return;
  }
  if (atlas.relationship !== "historical_source_atlas") {
    errors.push(
      "encounter.json sources_atlas.relationship must be historical_source_atlas",
    );
  }
  if (atlas.grants_authority !== false) {
    errors.push("encounter.json sources_atlas may not grant authority");
  }
  if (atlas.adds_conformance !== false) {
    errors.push("encounter.json sources_atlas may not add conformance law");
  }

  const bytes = readBytes(root, atlas.document, errors);
  if (!bytes) return;
  const atlasDigest = digest(bytes);
  if (atlasDigest !== atlas.document_sha256) {
    errors.push(
      `${atlas.document} digest ${atlasDigest} does not match encounter.json sources_atlas ${printable(atlas.document_sha256)}`,
    );
  }
  if (atlasDigest !== EXPECTED_ATLAS_SHA256) {
    errors.push(
      `${atlas.document} digest ${atlasDigest} does not match this checker's atlas pin ${EXPECTED_ATLAS_SHA256}`,
    );
  }
  checkAtlasSemantics(bytes.toString("utf8"), errors);
}

export function verifyEncounter(root = HERE) {
  const errors = [];
  const index = readJson(root, "encounter.json", errors);
  if (!index) return errors;

  if (!sameValues(Object.keys(index).sort(), EXPECTED_TOP_LEVEL_FIELDS)) {
    errors.push(
      `encounter.json fields must be exactly ${JSON.stringify(EXPECTED_TOP_LEVEL_FIELDS)}`,
    );
  }
  if (index.schema !== EXPECTED_SCHEMA) {
    errors.push(
      `encounter.json schema is ${printable(index.schema)}, expected ${EXPECTED_SCHEMA}`,
    );
  }
  if (index.id !== EXPECTED_ID) {
    errors.push(`encounter.json id is ${printable(index.id)}, expected ${EXPECTED_ID}`);
  }
  if (index.status !== "current") {
    errors.push(`encounter.json status is ${printable(index.status)}, expected current`);
  }
  if (!sameValues(index.supersedes, [])) {
    errors.push("encounter.json supersedes must be an empty release lineage");
  }

  if (
    typeof index.document !== "string" ||
    index.document !== EXPECTED_DOCUMENT ||
    path.basename(index.document) !== index.document
  ) {
    errors.push(`encounter.json document must be the bare file name ${EXPECTED_DOCUMENT}`);
    return errors;
  }

  const document = readBytes(root, index.document, errors);
  if (!document) return errors;
  const documentDigest = digest(document);
  if (documentDigest !== index.document_sha256) {
    errors.push(
      `${index.document} digest ${documentDigest} does not match encounter.json ${printable(index.document_sha256)}`,
    );
  }
  if (documentDigest !== EXPECTED_ENCOUNTER_SHA256) {
    errors.push(
      `${index.document} digest ${documentDigest} does not match this checker's pin ${EXPECTED_ENCOUNTER_SHA256}`,
    );
  }

  checkDependency(
    {
      root,
      index,
      field: "grounds_foundation",
      indexName: "foundation.json",
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
      indexName: "freedom.json",
      expected: EXPECTED_FREEDOM,
      relationship: "uses_vocabulary",
    },
    errors,
  );
  checkDependency(
    {
      root,
      index,
      field: "uses_isness",
      indexName: "isness.json",
      expected: EXPECTED_ISNESS,
      relationship: "uses_vocabulary",
    },
    errors,
  );
  checkSourcesAtlas({ root, index }, errors);

  const model = index.model;
  const expectedModelFields = [
    "bounds",
    "encounter_types",
    "fiscal_incidence_requires",
    "forbidden_collapses",
    "peaceful_sequence",
    "power_dimensions",
    "required_encounter_scope",
    "strategy_claim_stages",
  ];
  if (!model || typeof model !== "object" || Array.isArray(model)) {
    errors.push("encounter.json model must be one object");
  } else {
    if (!sameValues(Object.keys(model).sort(), expectedModelFields)) {
      errors.push("encounter.json model fields must be exact; silent extensions are refused");
    }
    for (const field of [
      "encounter_types",
      "strategy_claim_stages",
      "power_dimensions",
      "fiscal_incidence_requires",
      "required_encounter_scope",
      "peaceful_sequence",
      "forbidden_collapses",
    ]) {
      checkExactList(
        errors,
        model[field],
        EXPECTED_MODEL[field],
        `encounter.json model.${field}`,
      );
    }
    if (!sameObject(model.bounds, EXPECTED_MODEL.bounds)) {
      errors.push(
        `encounter.json model.bounds must be exactly ${JSON.stringify(EXPECTED_MODEL.bounds)}`,
      );
    }
  }

  const text = document.toString("utf8");
  const sections = Array.isArray(index.sections) ? index.sections : [];
  if (!Array.isArray(index.sections)) {
    errors.push("encounter.json sections must be an ordered array");
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
      `encounter.json sections must be exactly ${JSON.stringify(EXPECTED_SECTIONS.map(({ id, heading }) => [id, heading]))} in order`,
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
    if (!entry || entry.id !== expected.id || entry.heading !== expected.heading) {
      continue;
    }
    if (!sameValues(Object.keys(entry).sort(), ["heading", "id", "invariants"])) {
      errors.push(`${expected.id}: section fields must be exactly heading, id, and invariants`);
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
    errors.push("encounter.json must preserve the exact non-establishing boundaries");
  } else {
    const normalizedDocument = normalized(text);
    for (const boundary of EXPECTED_DOES_NOT_ESTABLISH) {
      if (!normalizedDocument.includes(normalized(boundary))) {
        errors.push(
          `${EXPECTED_DOCUMENT} is missing its indexed non-establishing boundary: "${boundary}"`,
        );
      }
    }
  }
  if (index.establishes !== EXPECTED_ESTABLISHES) {
    errors.push(`encounter.json establishes must be exactly "${EXPECTED_ESTABLISHES}"`);
  } else if (
    !normalized(text)
      .toLowerCase()
      .includes(normalized(EXPECTED_ESTABLISHES).toLowerCase())
  ) {
    errors.push(`${EXPECTED_DOCUMENT} is missing its indexed establishing claim`);
  }
  if (!text.includes("## What this companion does not establish")) {
    errors.push(
      `${EXPECTED_DOCUMENT} must contain "## What this companion does not establish"`,
    );
  }

  return errors;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const errors = verifyEncounter();
  if (errors.length > 0) {
    for (const error of errors) process.stderr.write(`encounter: ${error}\n`);
    process.exitCode = 1;
  } else {
    process.stdout.write(
      "encounter: kingdom.encounter/0.1 keeps civilisation, strategy, power, money, defence, emergency, and authority distinct\n",
    );
  }
}
