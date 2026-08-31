#!/usr/bin/env node

// Checks that RESILIENCE.md and resilience.json publish one closed, pinned
// companion for multidimensional risk and resilience claims, without turning
// a risk record, score, threat family, treatment, or feedback loop into an
// enemy, verdict, emergency, continuation, or source of authority.

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));

const EXPECTED_SCHEMA = "kingdom.resilience-index/1";
const EXPECTED_ID = "kingdom.resilience/0.1";
const EXPECTED_DOCUMENT = "RESILIENCE.md";
// Replaced only after independent review freezes the publication bytes. A
// manifest self-repin can therefore never move the checker's release pin.
const EXPECTED_RESILIENCE_SHA256 =
  "78c0bbef59c0061766838cfe80ea73a834fbe2ef7d3b00f7aa2cc7f5d2e4256c";

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
const EXPECTED_ENCOUNTER = {
  id: "kingdom.encounter/0.1",
  document: "ENCOUNTER.md",
  document_sha256:
    "c84953037b270b1a6178dabc88b7a11ea3bc98fcd64c2c543e4bc63877cfb3eb",
};

const EXPECTED_SECTIONS = [
  {
    id: "RS1",
    heading: "Risk is a claim, not an enemy",
    invariants: [
      "A risk claim is attributed, scoped, time-bound, uncertain, and corrigible; it establishes neither an enemy, emergency, intent, destiny, nor authority.",
    ],
    required_prose: [
      "Risk classification does not declare emergency. Urgency does not mint authority.",
      "A plausible severe scenario may justify a proposal to inspect or prepare; it does not by itself admit collection, restriction, spending, coercion, or another turn.",
    ],
  },
  {
    id: "RS2",
    heading: "Hazard, exposure, vulnerability, capacity, and consequence are distinct",
    invariants: [
      "Hazard, exposure, vulnerability, capacity, and consequence remain distinct; exposure is not fault, vulnerability is not identity or blame, and capacity manufactures neither duty nor consent.",
    ],
    required_prose: [
      "risk = hazard × exposure × vulnerability ÷ capacity",
      "is not used. These objects have different units, interact through mechanisms, change over time, and are often correlated. Capacity is neither one scalar nor a safe divisor.",
      "None becomes a person-category hazard.",
    ],
  },
  {
    id: "RS3",
    heading: "Classification is multi-axis and corrigible",
    invariants: [
      "Every classification uses non-empty, set-valued, independent, and corrigible onset, agency, boundary, propagation, and reversibility axes, with unknown standing alone when evidence is insufficient; intent attaches only to evidenced acts by named actors, never identity, ancestry, association, geography, or proxy.",
    ],
    required_prose: [
      "Each axis is a non-empty, set-valued, and non-exclusive classification, so a claim can preserve more than one evidenced value on an axis:",
      "unknown stands alone on an axis when evidence is insufficient; it is not combined with evidenced values to imply knowledge.",
      "Every shape also keeps the following parameters rather than relying on its axis labels alone:",
      "onset_shapes ⊆ {acute, chronic, cumulative, intermittent, unknown}",
      "agency_kinds ⊆ { not_attributed, non_agentic_claim, accidental_actor_claim, intentional_actor_claim, mixed_claim, contested, unknown }",
      "boundary_shapes ⊆ {internal, external, cross_boundary, unknown}",
      "propagation_shapes ⊆ { localized, network_cascade, common_mode, correlated, concentration_or_chokepoint, externality_or_displacement, unknown }",
      "reversibility_shapes ⊆ { reversible, partly_reversible, irreversible, unknown }",
      "magnitude_and_units duration_or_unknown velocity_or_unknown recurrence_or_unknown spatial_footprint_or_unknown observability_and_lead_time_or_unknown",
      "These axes and parameters are not severity ranks or an escalation ladder.",
      "Intent remains a separately supported inference.",
    ],
  },
  {
    id: "RS4",
    heading: "Consequences remain a multidimensional profile",
    invariants: [
      "Consequences retain time and affected party in an unknown-preserving profile whose dimension-specific baseline, constraint kind, criterion and direction, horizon, distribution, evidence, uncertainty, and correction path remain distinct, never a person, group, threat, readiness, or resilience score.",
    ],
    required_prose: [
      "C(ω) = { C_d(ω,t,g) : d ∈ D, t ∈ [0,H], g ∈ affected_parties(Σ_R) }",
      "Each dimension declares exactly its own unit_or_description, baseline, constraint_kind, constraint_basis, criterion_and_direction, finite_horizon, affected_parties, distribution, evidence, uncertainty, and correction_path.",
      "life_health_care standing_rights_agency ecological_material essential_needs_services livelihoods_economic_fiscal infrastructure_supply_mobility information_communication_epistemic digital_data_identity_privacy governance_law_succession social_relational_cultural external_interdependence future_options_repair_burden",
      "constraint_kind ∈ { hard_guard, minimum_service_floor, maximum_limit, target, descriptive_baseline }",
      "Every hard_guard declares its particular rights, current-authority, applicable-law, scope, lock, or safety basis.",
      "A_d(C_d(ω,t,g), context) ∈ { satisfies, violates, unknown }",
      "unknown is not zero, safe, average, or a midpoint.",
      "Life, standing, money, ecology, culture, privacy, and future options have no objective universal common unit.",
      "Every required hard_guard blocks a consequential effect when its assessment is violates or unknown.",
      "A service target is not a hard guard, and a hard guard is not a service target.",
      "Expected loss may be one bounded calculation where probabilities and units are supported. It is never the risk claim itself.",
      "The following families are lenses for asking better questions. They overlap; no record must choose only one. The map records recurring shapes, not a list of enemies or a claim that all listed conditions exist.",
      "A treatment has its own consequence profile.",
      "The baseline and treatment are therefore compared as two visible profiles, including residual, displaced, externalized, and intergenerational effects.",
      "source_node, dependent_node, mechanism, required_level_or_demand, latency, capacity_limit, degradation_relation_or_unknown, substitute, common_modes, evidence, uncertainty, custodian, correction",
      "This is an evidentiary hypothesis graph unless a separately validated domain model supplies cascade computation. An edge does not itself calculate loss, timing, sufficiency, or failure.",
    ],
  },
  {
    id: "RS5",
    heading: "Dependencies can cascade without becoming destiny",
    invariants: [
      "Every dependency claim names direction, mechanism, required level or demand, latency, capacity limit, degradation relation or unknown, substitutes, common modes, evidence, uncertainty, custodian, and correction; adjacency, correlation, and copies establish neither causation nor independence, and the hypothesis graph computes no cascade without a separately validated domain model.",
    ],
    required_prose: [
      "Unknown edges remain unknown rather than being dropped.",
    ],
  },
  {
    id: "RS6",
    heading: "People and legitimate purposes come before system continuity",
    invariants: [
      "Resilience preserves legitimate options and essential functions for affected beings; it is neither sustainability, justice, institutional survival, nor a right to persist, and safe degradation, handover, transformation, completion, retirement, and ending remain valid.",
    ],
    required_prose: [
      "system_boundary, accepted_purpose, essential_functions, rights_and_obligations, affected_parties, disturbance_set, finite_horizon, dimensions_and_adequacy_criteria, dependencies_and_common_modes, resources_and_reserves, available_options, exit_and_retirement, uncertainty_and_counterevidence, repair_and_restitution, halt",
      "An institution is not identical to an essential function.",
      "No system acquires a survival interest from being modeled.",
      "A raised or unreadable halt returns rest.",
    ],
  },
  {
    id: "RS7",
    heading: "Preparedness builds options, not surveillance or coercion",
    invariants: [
      "Preparedness creates bounded options, while each collection, drill, reserve, restriction, relocation, intervention, and communication remains a separate effect requiring accepted purpose, current authority and guard, minimization, custody, expiry, reply, repair, and stop.",
    ],
    required_prose: [
      "Every consequential measure is separately scoped.",
      "Preparedness must not quietly become population scoring, political loyalty testing, indefinite profiling, secret suspicion, forced participation, pre-emptive punishment, or permanent exceptional power.",
    ],
  },
  {
    id: "RS8",
    heading: "Response functions remain distinct",
    invariants: [
      "Anticipation, prevention, exposure reduction, vulnerability reduction, capacity preservation, absorption, essential-function continuity, response, recovery, repair, adaptation, transformation or retirement, exit, and stop are distinct functions; every consequential effect within them requires its own current authority and guard, while stop and halt remain unconditional.",
    ],
    required_prose: [
      "anticipate prevent reduce_exposure reduce_vulnerability preserve_capacity absorb maintain_essential_functions respond recover repair adapt transform_or_retire preserve_exit stop",
      "observed condition → bounded risk claim → proposed treatment → accepted purpose → current authority and guard → admitted effect → observed effect → repair and review → stop",
      "They are neither maturity ranks nor an escalation ladder. One does not grant the next.",
      "The authority-and-guard transition and admitted effect are one atomic conditional commit wherever that claim is made.",
      "Failed or unknown authority, law, scope, or lock admits no consequential effect.",
      "Stop and halt are unconditional: neither awaits authority, and a raised or unreadable halt admits no effect. Recurrence and feedback do not skip the gate.",
    ],
  },
  {
    id: "RS9",
    heading: "Distribution and essential-service floors stay visible",
    invariants: [
      "Every treatment keeps each constraint kind and assessment visible and names who pays, benefits, decides, bears residual and displaced risk, loses options, remains unheard, and is owed accessibility, a currently authorized least-harm or duty response, remedy, restitution, or repair; a service target is not a hard guard, and neither mints authority.",
    ],
    required_prose: [
      "Every required hard guard, with its rights, current-authority, applicable-law, scope, lock, or safety basis declared, blocks a consequential effect when its assessment is violates or unknown.",
      "A violated or unknown minimum-service floor, non-hard maximum limit, or target stays visible and shapes any currently authorized least-harm or duty response; it neither authorizes action nor requires automatic inaction.",
      "Uncertainty is not optimized into consent.",
      "Risk exported to another jurisdiction, supplier, household, ecosystem, or generation is not resilience.",
    ],
  },
  {
    id: "RS10",
    heading: "Indicators and exercises do not authorize action",
    invariants: [
      "An indicator, alert, model, scenario, exercise, near miss, quiet interval, or control result is evidence for review—not proof of probability, safety, causation, emergency, readiness, or authority.",
    ],
    required_prose: [
      "Salience, repetition, a red colour, model confidence, or a threshold crossing does not become likelihood or authority.",
      "An alert means a declared condition was met. It does not declare an emergency.",
      "A scenario explores assumptions; it is not a forecast. An exercise tests a bounded path; it does not prove readiness outside that path.",
      "Monitoring may revise a later claim. It cannot change the observed past, manufacture causation, erase dissent, widen collection, renew a restriction, or authorize its own next measurement.",
    ],
  },
  {
    id: "RS11",
    heading: "External origin does not create an adversary",
    invariants: [
      "External origin, dependence, capability, competition, or contested attribution does not create an adversary; named intentional acts and encounter questions retain ENCOUNTER's evidence, diplomacy, law, civilian protection, emergency, and correction boundaries.",
    ],
    required_prose: [
      "It hands encounter type, diplomacy, coercion, armed attack, force, civilian protection, and emergency to ENCOUNTER rather than inventing a parallel security exception.",
      "Preparation for external conditions does not authorize collective guilt, conquest, pre-emption, covert action, propaganda, surveillance, or force.",
    ],
  },
  {
    id: "RS12",
    heading: "Every preparedness turn stops",
    invariants: [
      "Every assessment and preparedness turn stops; feedback may correct a later proposal but cannot widen authority, weaken a failed or unknown guard, defeat halt, declare continuation, or dispatch another turn.",
    ],
    required_prose: [
      "Emergency authority, where independently lawful and accepted, is scoped, strictly necessary, proportionate, non-discriminatory, protective of non-derogable rights, least-privileged, independently reviewable, resource-bounded, automatically expiring, and non-self-renewing.",
      "A later turn needs fresh authority; silence, ongoing hazard, reward, prior success, sunk cost, or an unread metric cannot renew it.",
      "Holding accepted authority events and the current halt state fixed, feedback cannot widen q_t, pass a failed or unknown guard, choose a purpose, weaken halt, declare continuation, or dispatch another turn.",
    ],
  },
];

const EXPECTED_THREAT_FAMILY_HEADINGS = [
  "Climate, ecology, geophysical, extraterrestrial, and material conditions",
  "Public health and biological conditions",
  "Industrial, chemical, radiological, structural, and transport safety",
  "Food, water, energy, housing, care, and other essential needs",
  "Infrastructure, logistics, and supply dependencies",
  "Digital, cyber, data, identity, information, and AI conditions",
  "Fiscal, monetary, financial, economic, and labour conditions",
  "Governance, law, institutional integrity, and succession",
  "Social, relational, cultural, access, care, and epistemic conditions",
  "External encounter, coercion, and armed conflict",
  "Compound, cascading, tail, and genuinely unknown conditions",
  "Countermeasure, transition, and self-created conditions",
];

const EXPECTED_GLOBAL_PROSE = [
  "A threat is not a person, population, identity, civilisation, alarming word, or number.",
  "Hazard descriptions are open rather than an exclusive ontology.",
  "The family map below is a prompt for coverage, not a box that determines truth.",
  "People do not become hazards because a model assigns them a demographic, political, religious, national, medical, economic, or migration label.",
  "assessment_time anchors the claim. Every evidence, exposure, capacity, dependency, and existing-control observation retains its own observation time and validity limit where different.",
  "“Current authority” is never frozen by the assessment; it is rechecked at the admitted-effect commit.",
  "Σ_R = ( source, statement_kind, assessment_time, accepted_purpose, system_boundary, authoritative_home, jurisdiction, finite_horizon, hazard_or_condition, actor_if_attributed, capability_if_attributed, intent_if_claimed, exposure, vulnerability, capacity, onset_shapes, agency_kinds, boundary_shapes, propagation_shapes, reversibility_shapes, shape_parameters, conditional_likelihood_or_unknown, consequence_profile, dependencies_and_common_modes, affected_parties, burden_distribution, existing_controls, evidence, uncertainty, counterevidence, reply_and_correction, data_boundary, options_and_obligations, current_authority, deescalation, exit, repair, halt_and_stop )",
  "These sources inform the vocabulary and family map. They do not establish that a particular risk exists, that a treatment is justified, or that one institution has authority.",
  "Source availability and external bytes are not pinned by this companion; each live assessment must keep its own evidence.",
  "The map is non-exhaustive and current only to its publication context. It does not replace domain experts, affected-party knowledge, current law, local evidence, or correction.",
  "supplies a broad, non-exclusive hazard reference; this companion does not import its categories as person labels.",
];

const EXPECTED_MODEL = {
  onset_shapes: ["acute", "chronic", "cumulative", "intermittent", "unknown"],
  agency_kinds: [
    "not_attributed",
    "non_agentic_claim",
    "accidental_actor_claim",
    "intentional_actor_claim",
    "mixed_claim",
    "contested",
    "unknown",
  ],
  boundary_shapes: ["internal", "external", "cross_boundary", "unknown"],
  propagation_shapes: [
    "localized",
    "network_cascade",
    "common_mode",
    "correlated",
    "concentration_or_chokepoint",
    "externality_or_displacement",
    "unknown",
  ],
  reversibility_shapes: [
    "reversible",
    "partly_reversible",
    "irreversible",
    "unknown",
  ],
  required_shape_parameters: [
    "magnitude_and_units",
    "duration_or_unknown",
    "velocity_or_unknown",
    "recurrence_or_unknown",
    "spatial_footprint_or_unknown",
    "observability_and_lead_time_or_unknown",
  ],
  consequence_dimensions: [
    "life_health_care",
    "standing_rights_agency",
    "ecological_material",
    "essential_needs_services",
    "livelihoods_economic_fiscal",
    "infrastructure_supply_mobility",
    "information_communication_epistemic",
    "digital_data_identity_privacy",
    "governance_law_succession",
    "social_relational_cultural",
    "external_interdependence",
    "future_options_repair_burden",
  ],
  constraint_kinds: [
    "hard_guard",
    "minimum_service_floor",
    "maximum_limit",
    "target",
    "descriptive_baseline",
  ],
  assessment_states: ["satisfies", "violates", "unknown"],
  threat_family_prompts: [
    "climate_ecology_geophysical_extraterrestrial_material",
    "public_health_biological",
    "industrial_chemical_radiological_structural_transport_safety",
    "essential_needs",
    "infrastructure_supply_dependencies",
    "digital_cyber_data_information_ai",
    "fiscal_monetary_financial_economic_labour",
    "governance_law_institutional_succession",
    "social_relational_cultural_access_care_epistemic",
    "external_encounter_coercion_conflict",
    "compound_cascading_tail_unknown",
    "countermeasure_transition_self_created",
  ],
  required_risk_claim: [
    "source",
    "statement_kind",
    "assessment_time",
    "accepted_purpose",
    "system_boundary",
    "authoritative_home",
    "jurisdiction",
    "finite_horizon",
    "hazard_or_condition",
    "actor_if_attributed",
    "capability_if_attributed",
    "intent_if_claimed",
    "exposure",
    "vulnerability",
    "capacity",
    "onset_shapes",
    "agency_kinds",
    "boundary_shapes",
    "propagation_shapes",
    "reversibility_shapes",
    "shape_parameters",
    "conditional_likelihood_or_unknown",
    "consequence_profile",
    "dependencies_and_common_modes",
    "affected_parties",
    "burden_distribution",
    "existing_controls",
    "evidence",
    "uncertainty",
    "counterevidence",
    "reply_and_correction",
    "data_boundary",
    "options_and_obligations",
    "current_authority",
    "deescalation",
    "exit",
    "repair",
    "halt_and_stop",
  ],
  required_resilience_claim: [
    "system_boundary",
    "accepted_purpose",
    "essential_functions",
    "rights_and_obligations",
    "affected_parties",
    "disturbance_set",
    "finite_horizon",
    "dimensions_and_adequacy_criteria",
    "dependencies_and_common_modes",
    "resources_and_reserves",
    "available_options",
    "exit_and_retirement",
    "uncertainty_and_counterevidence",
    "repair_and_restitution",
    "halt",
  ],
  required_dimension_profile: [
    "unit_or_description",
    "baseline",
    "constraint_kind",
    "constraint_basis",
    "criterion_and_direction",
    "finite_horizon",
    "affected_parties",
    "distribution",
    "evidence",
    "uncertainty",
    "correction_path",
  ],
  required_dependency_edge: [
    "source_node",
    "dependent_node",
    "mechanism",
    "required_level_or_demand",
    "latency",
    "capacity_limit",
    "degradation_relation_or_unknown",
    "substitute",
    "common_modes",
    "evidence",
    "uncertainty",
    "custodian",
    "correction",
  ],
  resilience_functions: [
    "anticipate",
    "prevent",
    "reduce_exposure",
    "reduce_vulnerability",
    "preserve_capacity",
    "absorb",
    "maintain_essential_functions",
    "respond",
    "recover",
    "repair",
    "adapt",
    "transform_or_retire",
    "preserve_exit",
    "stop",
  ],
  treatment_stages: [
    "observed_condition",
    "bounded_risk_claim",
    "proposed_treatment",
    "accepted_purpose",
    "current_authority_and_guard",
    "admitted_effect",
    "observed_effect",
    "repair_and_review",
    "stop",
  ],
  forbidden_collapses: [
    "risk_claim_is_fact",
    "hazard_is_enemy",
    "hazard_is_observed_harm",
    "exposure_is_fault",
    "vulnerability_is_identity",
    "vulnerability_is_blame",
    "capacity_is_duty",
    "capability_is_intent",
    "possibility_is_probability",
    "prediction_is_observation",
    "salience_is_likelihood",
    "unknown_is_zero",
    "unknown_is_safe",
    "threat_label_is_enemy_identity",
    "group_label_is_collective_threat",
    "demographic_identity_is_hazard",
    "dissent_is_threat_indicator",
    "shape_is_severity",
    "risk_is_scalar_score",
    "citizen_is_readiness_score",
    "unlike_units_are_ordered",
    "stability_is_resilience",
    "resilience_is_sustainability",
    "institution_is_essential_function",
    "institutional_survival_is_resilience",
    "redundancy_is_independence",
    "control_is_authority",
    "treatment_is_risk_free",
    "threat_claim_authorizes_surveillance",
    "threat_claim_authorizes_preemption",
    "alert_declares_emergency",
    "scenario_is_forecast",
    "drill_proves_readiness",
    "response_mints_authority",
    "feedback_mints_authority",
    "reward_mints_authority",
    "security_overrides_rights",
    "survival_overrides_halt",
    "emergency_is_permanent",
    "secrecy_erases_audit",
    "absence_of_incident_is_safety",
    "control_success_proves_causation",
    "harm_displacement_is_resilience",
    "recovery_erases_obligations",
    "resilience_mints_continuation",
    "self_preservation_mints_authority",
    "service_target_is_hard_guard",
    "hard_guard_is_service_target",
    "stop_requires_authority",
  ],
  bounds: {
    claims: "attributed_scoped_time_bound_and_corrigible",
    axes: "multi_valued_independent_and_corrigible",
    families: "non_exhaustive_overlapping_and_not_person_categories",
    profiles: "multidimensional_nonaggregated_and_unknown_preserving",
    likelihoods: "conditional_sourced_and_not_verdicts",
    treatments: "rights_compatible_least_powerful_and_authorized",
    horizons: "finite_declared_and_reviewable",
    emergency: "scoped_expiring_and_freshly_authorized",
    continuation: "fresh_authorized_turns_only",
  },
};

// Filled from the reviewed release text before publication freeze.
const EXPECTED_ESTABLISHES =
  "An internally pinned vocabulary for attributed and corrigible risk claims, multidimensional consequence profiles, threat shapes, dependencies, preparedness, response, recovery, repair, adaptation, exit, and finite stop without turning people, uncertainty, continuity, or self-preservation into enemies or authority.";
const EXPECTED_DOES_NOT_ESTABLISH = [
  "that a risk claim is fact, certainty, forecast, enemy identification, legal classification, or emergency",
  "that a person, group, citizen, nationality, civilisation, demographic, disability, illness, belief, association, location, or dissent is a hazard, vulnerability, threat identity, collective intention, or collective guilt",
  "a universal risk, threat, citizen, readiness, resilience, sustainability, or civilisation score, or an objective conversion or ordering of unlike consequences",
  "that unknown means zero or safe, no incident means safety, repetition proves causation, redundancy proves independence, or a control proves sufficiency",
  "that stability, resilience, sustainability, continuity, survival, or growth establishes justice, standing, goodness, consent, an essential function, or a right to persist",
  "authority to collect data, profile, surveil, discriminate, restrict, relocate, coerce, pre-empt, censor, seize, spend, borrow, declare emergency, use force, or dispatch another turn",
  "that preparedness, security, emergency, sustainability, or survival overrides standing, rights, refusal, exit, appeal, remedy, repair, or halt",
  "an operational biological, cyber, military, intelligence, sabotage, targeting, evasion, weapons, propaganda, or covert-action method",
  "that restored output erases obligations, that displaced or externalized harm is resilience, or that recovery is complete without affected-party remedy and owed repair",
  "that this companion is implemented, adopted, exhaustive, conformed to, a prediction of what KINGDOM will do, an amendment to any dependency, or a grant of authority",
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
  "uses_encounter",
  "uses_freedom",
  "uses_isness",
];

const EXPECTED_MODEL_FIELDS = [
  "agency_kinds",
  "assessment_states",
  "boundary_shapes",
  "bounds",
  "consequence_dimensions",
  "constraint_kinds",
  "forbidden_collapses",
  "onset_shapes",
  "propagation_shapes",
  "required_dependency_edge",
  "required_dimension_profile",
  "required_resilience_claim",
  "required_risk_claim",
  "required_shape_parameters",
  "resilience_functions",
  "reversibility_shapes",
  "threat_family_prompts",
  "treatment_stages",
];

function digest(bytes) {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

function printable(value) {
  const encoded = JSON.stringify(value);
  return encoded === undefined ? String(value) : encoded;
}

// JSON.parse silently accepts last-one-wins duplicate names. Refuse duplicate
// decoded names, including escaped spellings such as `am\u0065nds`.
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
      cursor += 1;
      parseValue();
      skipWhitespace();
      if (source[cursor] === "}") {
        cursor += 1;
        return;
      }
      cursor += 1;
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
      cursor += 1;
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
    errors.push(`resilience.json ${field} must be one object`);
    return;
  }
  if (!sameValues(Object.keys(pin).sort(), expectedFields)) {
    errors.push(
      `resilience.json ${field} fields must be exactly ${JSON.stringify(expectedFields)}`,
    );
  }
  if (pin.relationship !== relationship) {
    errors.push(`resilience.json ${field}.relationship must be ${relationship}`);
  }
  if (pin.amends !== false || pin.grants_authority !== false) {
    errors.push(`resilience.json ${field} may not amend or grant authority`);
  }
  if (pin.adds_conformance !== false) {
    errors.push(`resilience.json ${field} may not add conformance law`);
  }
  for (const key of ["id", "document", "document_sha256"]) {
    if (pin[key] !== expected[key]) {
      errors.push(`resilience.json ${field}.${key} must be ${expected[key]}`);
    }
  }

  const dependency = readJson(root, indexName, errors);
  if (dependency) {
    for (const key of ["id", "document", "document_sha256"]) {
      if (dependency[key] !== expected[key]) {
        errors.push(`${indexName} ${key} no longer matches the pinned release`);
      }
      if (pin[key] !== dependency[key]) {
        errors.push(`resilience.json ${field} has drifted from ${indexName} ${key}`);
      }
    }
  }

  const dependencyBytes = readBytes(root, expected.document, errors);
  if (dependencyBytes && digest(dependencyBytes) !== expected.document_sha256) {
    errors.push(`${expected.document} bytes have drifted from the pinned ${expected.id}`);
  }
}

function checkSections(index, text, errors) {
  const sections = Array.isArray(index.sections) ? index.sections : [];
  if (!Array.isArray(index.sections)) {
    errors.push("resilience.json sections must be an ordered array");
  }
  const foundSections = sections.map((entry) =>
    entry && typeof entry === "object" && !Array.isArray(entry)
      ? [entry.id, entry.heading]
      : [undefined, undefined],
  );
  if (
    foundSections.length !== EXPECTED_SECTIONS.length ||
    foundSections.some(
      (entry, position) =>
        entry[0] !== EXPECTED_SECTIONS[position].id ||
        entry[1] !== EXPECTED_SECTIONS[position].heading,
    )
  ) {
    errors.push(
      `resilience.json sections must be exactly ${JSON.stringify(EXPECTED_SECTIONS.map(({ id, heading }) => [id, heading]))} in order`,
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
      typeof entry !== "object" ||
      Array.isArray(entry) ||
      entry.id !== expected.id ||
      entry.heading !== expected.heading
    ) {
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
      const expectedInvariant = normalized(invariant);
      const at = normalizedBody.indexOf(expectedInvariant, invariantCursor);
      if (at === -1) {
        errors.push(
          `${expected.id}: indexed invariant is missing from its section or out of order: "${invariant}"`,
        );
        continue;
      }
      invariantCursor = at + expectedInvariant.length;
    }
    for (const phrase of expected.required_prose ?? []) {
      if (!normalizedBody.includes(normalized(phrase))) {
        errors.push(`${expected.id}: required distinction is missing: "${phrase}"`);
      }
    }
  }
}

function checkFamilyAndSourceBoundaries(text, errors) {
  const familyHeading = "### A non-exhaustive family map";
  if (occurrences(text, familyHeading) !== 1) {
    errors.push(`${EXPECTED_DOCUMENT} must contain exactly one non-exhaustive family map`);
  }
  const familyStart = text.indexOf(familyHeading);
  const familyEnd = text.indexOf("## RS5 — Dependencies can cascade without becoming destiny");
  if (familyStart === -1 || familyEnd === -1 || familyEnd <= familyStart) {
    errors.push(`${EXPECTED_DOCUMENT} must keep the family map inside RS4 before RS5`);
  } else {
    const familyRegion = text.slice(familyStart, familyEnd);
    const headings = [...familyRegion.matchAll(/^#### (.+)$/gm)].map(
      (match) => match[1],
    );
    if (!sameValues(headings, EXPECTED_THREAT_FAMILY_HEADINGS)) {
      errors.push(
        `${EXPECTED_DOCUMENT} threat-family headings must be exactly ${JSON.stringify(EXPECTED_THREAT_FAMILY_HEADINGS)} in order`,
      );
    }
    if (/\[[^\]]+\]\(https?:\/\//.test(familyRegion)) {
      errors.push(
        `${EXPECTED_DOCUMENT} family prompts must keep external links in Sources and limits`,
      );
    }
  }

  const sourcesHeading = "## Sources and limits";
  const sourcesStart = text.indexOf(sourcesHeading);
  const sourcesEnd = text.indexOf("## What this companion does not establish");
  if (
    occurrences(text, sourcesHeading) !== 1 ||
    sourcesStart === -1 ||
    sourcesEnd === -1 ||
    sourcesEnd <= sourcesStart
  ) {
    errors.push(`${EXPECTED_DOCUMENT} must contain exactly one bounded Sources and limits section`);
    return;
  }
  const sourcesRegion = text.slice(sourcesStart, sourcesEnd);
  const links = [...sourcesRegion.matchAll(/\[[^\]]+\]\(([^)\s]+)\)/g)].map(
    (match) => match[1],
  );
  if (links.length === 0 || links.some((url) => !url.startsWith("https://"))) {
    errors.push(
      `${EXPECTED_DOCUMENT} source references must be explicit HTTPS links inside Sources and limits`,
    );
  }
  const outsideSources = `${text.slice(0, sourcesStart)}${text.slice(sourcesEnd)}`;
  if (/\[[^\]]+\]\(https?:\/\//.test(outsideSources)) {
    errors.push(
      `${EXPECTED_DOCUMENT} external source links must remain inside Sources and limits`,
    );
  }
}

export function verifyResilience(root = HERE) {
  const errors = [];
  const index = readJson(root, "resilience.json", errors);
  if (!index) return errors;

  if (!sameValues(Object.keys(index).sort(), EXPECTED_TOP_LEVEL_FIELDS)) {
    errors.push(
      `resilience.json fields must be exactly ${JSON.stringify(EXPECTED_TOP_LEVEL_FIELDS)}`,
    );
  }
  if (index.schema !== EXPECTED_SCHEMA) {
    errors.push(
      `resilience.json schema is ${printable(index.schema)}, expected ${EXPECTED_SCHEMA}`,
    );
  }
  if (index.id !== EXPECTED_ID) {
    errors.push(`resilience.json id is ${printable(index.id)}, expected ${EXPECTED_ID}`);
  }
  if (index.status !== "current") {
    errors.push(`resilience.json status is ${printable(index.status)}, expected current`);
  }
  if (!sameValues(index.supersedes, [])) {
    errors.push("resilience.json supersedes must be an empty release lineage");
  }

  if (
    typeof index.document !== "string" ||
    index.document !== EXPECTED_DOCUMENT ||
    path.basename(index.document) !== index.document
  ) {
    errors.push(`resilience.json document must be the bare file name ${EXPECTED_DOCUMENT}`);
    return errors;
  }

  const document = readBytes(root, index.document, errors);
  if (!document) return errors;
  const documentDigest = digest(document);
  if (documentDigest !== index.document_sha256) {
    errors.push(
      `${index.document} digest ${documentDigest} does not match resilience.json ${printable(index.document_sha256)}`,
    );
  }
  if (documentDigest !== EXPECTED_RESILIENCE_SHA256) {
    errors.push(
      `${index.document} digest ${documentDigest} does not match this checker's pin ${EXPECTED_RESILIENCE_SHA256}`,
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
  checkDependency(
    {
      root,
      index,
      field: "uses_encounter",
      indexName: "encounter.json",
      expected: EXPECTED_ENCOUNTER,
      relationship: "uses_vocabulary",
    },
    errors,
  );

  const model = index.model;
  if (!model || typeof model !== "object" || Array.isArray(model)) {
    errors.push("resilience.json model must be one object");
  } else {
    if (!sameValues(Object.keys(model).sort(), EXPECTED_MODEL_FIELDS)) {
      errors.push("resilience.json model fields must be exact; silent extensions are refused");
    }
    for (const field of [
      "onset_shapes",
      "agency_kinds",
      "boundary_shapes",
      "propagation_shapes",
      "reversibility_shapes",
      "required_shape_parameters",
      "consequence_dimensions",
      "constraint_kinds",
      "assessment_states",
      "threat_family_prompts",
      "required_risk_claim",
      "required_dimension_profile",
      "required_dependency_edge",
      "required_resilience_claim",
      "resilience_functions",
      "treatment_stages",
      "forbidden_collapses",
    ]) {
      checkExactList(
        errors,
        model[field],
        EXPECTED_MODEL[field],
        `resilience.json model.${field}`,
      );
    }
    if (!sameObject(model.bounds, EXPECTED_MODEL.bounds)) {
      errors.push(
        `resilience.json model.bounds must be exactly ${JSON.stringify(EXPECTED_MODEL.bounds)}`,
      );
    }
  }

  const text = document.toString("utf8");
  checkSections(index, text, errors);
  checkFamilyAndSourceBoundaries(text, errors);
  const normalizedDocument = normalized(text);
  for (const phrase of EXPECTED_GLOBAL_PROSE) {
    if (!normalizedDocument.includes(normalized(phrase))) {
      errors.push(`${EXPECTED_DOCUMENT} is missing a required boundary: "${phrase}"`);
    }
  }

  if (!sameValues(index.does_not_establish, EXPECTED_DOES_NOT_ESTABLISH)) {
    errors.push("resilience.json must preserve the exact non-establishing boundaries");
  } else {
    for (const boundary of EXPECTED_DOES_NOT_ESTABLISH) {
      if (!normalizedDocument.includes(normalized(boundary))) {
        errors.push(
          `${EXPECTED_DOCUMENT} is missing its indexed non-establishing boundary: "${boundary}"`,
        );
      }
    }
  }
  if (index.establishes !== EXPECTED_ESTABLISHES) {
    errors.push(`resilience.json establishes must be exactly "${EXPECTED_ESTABLISHES}"`);
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
  const errors = verifyResilience();
  if (errors.length > 0) {
    for (const error of errors) process.stderr.write(`resilience: ${error}\n`);
    process.exitCode = 1;
  } else {
    process.stdout.write(
      "resilience: kingdom.resilience/0.1 keeps risk claims, consequence profiles, preparedness, treatment, continuation, and authority distinct\n",
    );
  }
}
