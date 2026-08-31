# RESILIENCE — Threat shape, protected dimensions, and finite preparedness

`kingdom.resilience/0.1` · companion to `kingdom.foundation/0.2` · uses
`kingdom.freedom/0.1`, `kingdom.isness/0.1`, and `kingdom.encounter/0.1`

This companion prepares the KINGDOM to study conditions that could reduce the
sustainability of its citizens, other affected beings, essential functions,
rights, ecology, relationships, and future options. It does not prepare a
self-preserving institution to name enemies.

A threat is not a person, population, identity, civilisation, alarming word,
or number. This document uses a **risk claim**: an attributed and corrigible
account of how a hazard or condition could meet exposure and vulnerability,
interact with capacity, travel through dependencies, and produce a
multidimensional consequence profile within a declared boundary and finite
horizon.

The purpose is not perfect prediction. It is to keep enough structure visible
that prevention, care, continuity, response, recovery, repair, adaptation,
handover, retirement, and stop can be considered without silently collapsing
facts into authority. Preparedness should enlarge legitimate options for
affected people. It must not manufacture an emergency, a surveillance right,
or a right for the KINGDOM to continue.

This document is a companion. It changes no Foundation commitment, changes no
FREEDOM, ISNESS, or ENCOUNTER distinction, adds no conformance law, and grants
no authority.

## Reading discipline

Risk language is performative. Calling something a threat can redirect
attention, money, records, restrictions, force, and suspicion. The claim must
therefore remain attributable and contestable. At minimum, preserve its
source, statement kind, accepted purpose, boundary, horizon, evidence,
uncertainty, affected and omitted parties, counterevidence, correction path,
current authority, and stop.

Hazard descriptions are open rather than an exclusive ontology. A heatwave
can be environmental, health, infrastructure, fiscal, and social at once. A
payment outage can be technological, economic, relational, and legal. A
countermeasure can reduce one consequence while moving cost, exposure, or
power onto someone else. The family map below is a prompt for coverage, not a
box that determines truth.

Every claim distinguishes observation, inference, prediction, proposal,
commitment, and effect. A forecast is not an observation. A possibility is not
a probability. A capability is not an intention. A proposed treatment is not
authority. An absence of incidents is not proof of safety.

People do not become hazards because a model assigns them a demographic,
political, religious, national, medical, economic, or migration label.
Vulnerability describes conditions and access within a scope; it is not an
identity, deficiency, blame, or reduced standing. Citizens and noncitizens
retain standing person by person.

## Symbols and records

| Symbol | Meaning |
| --- | --- |
| `Σ_R` | one declared risk-claim scope |
| `H` | a finite declared horizon |
| `Ω_(Σ_R,H)` | a declared, non-exhaustive scenario set |
| `ω` | one scenario with attributed assumptions |
| `D` | the required consequence dimensions |
| `C_d(ω,t,g)` | consequence in dimension `d`, time `t`, for affected group or being `g` |
| `A_d` | a dimension-specific assessment of one declared constraint kind and basis |
| `q_t` | current authority and capability state from FREEDOM |
| `h_t` | current halt or brake state |
| `K_Σ` | the admissible region from ISNESS for this scope |

A canonical risk claim retains:

```text
Σ_R = (
  source, statement_kind, assessment_time, accepted_purpose,
  system_boundary, authoritative_home, jurisdiction, finite_horizon,
  hazard_or_condition,
  actor_if_attributed, capability_if_attributed, intent_if_claimed,
  exposure, vulnerability, capacity,
  onset_shapes, agency_kinds, boundary_shapes,
  propagation_shapes, reversibility_shapes, shape_parameters,
  conditional_likelihood_or_unknown,
  consequence_profile, dependencies_and_common_modes,
  affected_parties, burden_distribution, existing_controls,
  evidence, uncertainty, counterevidence, reply_and_correction,
  data_boundary, options_and_obligations, current_authority,
  deescalation, exit, repair, halt_and_stop
)
```

Missing fields remain visibly unknown. A compact label never supplies them.
The claim may be useful while many fields are unknown, but consequential
effects still require their own current guards.

`assessment_time` anchors the claim. Every evidence, exposure, capacity,
dependency, and existing-control observation retains its own observation time
and validity limit where different. “Current authority” is never frozen by the
assessment; it is rechecked at the admitted-effect commit.

## RS1 — Risk is a claim, not an enemy

`risk` names a conditional claim about possible consequences. It does not name
an object with moral guilt. Its source might be a sensor, citizen, worker,
researcher, agency, affected community, exercise, historical record, or model;
the source and statement kind remain attached.

A claim such as “there is flood risk” is incomplete until it declares the
place, people and systems exposed, relevant vulnerability and capacity,
duration, evidence, uncertainty, and consequence dimensions. “A rival is a
threat” is more incomplete: it compresses named acts, capabilities, inferred
intent, legal questions, counterevidence, and individual standing into an
enemy identity.

Risk classification does not declare emergency. Urgency does not mint
authority. A plausible severe scenario may justify a proposal to inspect or
prepare; it does not by itself admit collection, restriction, spending,
coercion, or another turn.

**Invariant RS1:** A risk claim is attributed, scoped, time-bound, uncertain, and corrigible; it establishes neither an enemy, emergency, intent, destiny, nor authority.

## RS2 — Hazard, exposure, vulnerability, capacity, and consequence are distinct

The terms answer different questions:

- **hazard or condition** — what process, event, stress, failure, or change is
  being considered;
- **exposure** — who or what could meet or depend upon it, where and when;
- **vulnerability** — which conditions could increase susceptibility or limit
  coping, recovery, remedy, or adaptation;
- **capacity** — which accessible abilities and resources can prevent, absorb,
  continue, respond, recover, repair, adapt, or stop, who controls them, and
  whether they deplete;
- **consequence** — what could change for which affected party, in which
  dimension, over which time.

The universal shortcut

```text
risk = hazard × exposure × vulnerability ÷ capacity
```

is not used. These objects have different units, interact through mechanisms,
change over time, and are often correlated. Capacity is neither one scalar nor
a safe divisor. A response can consume capacity; a nominal reserve can be
inaccessible to the people who need it.

Driver, hazard, exposure, failure mode, and consequence also remain distinct.
Ageing, migration, inflation, distrust, automation, or climate change may be a
driver, context, mediator, consequence, or subject of contested interpretation
in a particular model. None becomes a person-category hazard.

**Invariant RS2:** Hazard, exposure, vulnerability, capacity, and consequence remain distinct; exposure is not fault, vulnerability is not identity or blame, and capacity manufactures neither duty nor consent.

## RS3 — Classification is multi-axis and corrigible

No one label captures shape. Each axis is a non-empty, set-valued, and
non-exclusive classification, so a claim can preserve more than one evidenced
value on an axis:

```text
onset_shapes ⊆ {acute, chronic, cumulative, intermittent, unknown}

agency_kinds ⊆ {
  not_attributed,
  non_agentic_claim,
  accidental_actor_claim,
  intentional_actor_claim,
  mixed_claim,
  contested,
  unknown
}

boundary_shapes ⊆ {internal, external, cross_boundary, unknown}

propagation_shapes ⊆ {
  localized,
  network_cascade,
  common_mode,
  correlated,
  concentration_or_chokepoint,
  externality_or_displacement,
  unknown
}

reversibility_shapes ⊆ {
  reversible,
  partly_reversible,
  irreversible,
  unknown
}
```

`unknown` stands alone on an axis when evidence is insufficient; it is not
combined with evidenced values to imply knowledge. `not_attributed` records
that the claim does not attribute agency, while `non_agentic_claim` is itself
an evidenced classification. Accidental or intentional agency remains a
claim, not a property silently inferred from origin. Internal, external, and
cross-boundary describe origin or passage without changing agency.

Every shape also keeps the following parameters rather than relying on its
axis labels alone:

```text
magnitude_and_units
duration_or_unknown
velocity_or_unknown
recurrence_or_unknown
spatial_footprint_or_unknown
observability_and_lead_time_or_unknown
```

These axes and parameters are not severity ranks or an escalation ladder. An
acute event may have small consequences; cumulative degradation may cross an
irreversible threshold. A localized failure may reveal a common mode. External
origin does not imply intent. Internal origin does not excuse harm.

Actor attribution names a person or institution, particular acts,
capabilities, evidence, period, jurisdiction, uncertainty, reply, and
correction. Intent remains a separately supported inference. Ancestry,
citizenship, language, religion, association, location, disability, poverty,
age, or model segment is never a proxy for intent or collective threat.

**Invariant RS3:** Every classification uses non-empty, set-valued, independent, and corrigible onset, agency, boundary, propagation, and reversibility axes, with unknown standing alone when evidence is insufficient; intent attaches only to evidenced acts by named actors, never identity, ancestry, association, geography, or proxy.

## RS4 — Consequences remain a multidimensional profile

For a declared scenario set:

```text
RiskClaim(Σ_R, H) = {
  (ω, C(ω), conditional_likelihood_or_unknown(ω), evidence(ω), uncertainty(ω))
  : ω ∈ Ω_(Σ_R,H)
}

C(ω) = {
  C_d(ω,t,g) :
  d ∈ D,
  t ∈ [0,H],
  g ∈ affected_parties(Σ_R)
}
```

The profile retains at least these dimensions:

```text
life_health_care
standing_rights_agency
ecological_material
essential_needs_services
livelihoods_economic_fiscal
infrastructure_supply_mobility
information_communication_epistemic
digital_data_identity_privacy
governance_law_succession
social_relational_cultural
external_interdependence
future_options_repair_burden
```

Each dimension declares exactly its own `unit_or_description`, `baseline`,
`constraint_kind`, `constraint_basis`, `criterion_and_direction`, `finite_horizon`,
`affected_parties`, `distribution`, `evidence`, `uncertainty`, and
`correction_path`. Constraint kinds remain distinct:

```text
constraint_kind ∈ {
  hard_guard,
  minimum_service_floor,
  maximum_limit,
  target,
  descriptive_baseline
}
```

Every `hard_guard` declares its particular rights, current-authority,
applicable-law, scope, lock, or safety basis. A maximum limit or minimum floor
that is legally or safely non-negotiable is classified as a `hard_guard`, not
left as a service target.

Its assessment is:

```text
A_d(C_d(ω,t,g), context) ∈ {
  satisfies,
  violates,
  unknown
}
```

`unknown` is not zero, safe, average, or a midpoint. Life, standing, money,
ecology, culture, privacy, and future options have no objective universal
common unit. Any declared weighting is an attributable political or analytic
choice, remains confined to quantities for which comparison is justified, and
cannot override rights, duties, required hard guards, or halt.

Every required `hard_guard` blocks a consequential effect when its assessment
is `violates` or `unknown`. A violated or unknown service floor, non-hard
maximum limit, or target remains visible and shapes any currently authorized
least-harm or duty response; it neither authorizes action nor requires
automatic inaction. A service target is not a hard guard, and a hard guard is
not a service target.

Expected loss may be one bounded calculation where probabilities and units are
supported. It is never the risk claim itself. Averages can hide who carries
death, displacement, debt, care work, lost access, irreversible damage, or a
long recovery. Preserve affected-party distributions, tails, recovery time,
future burdens, and nonparticipants.

**Invariant RS4:** Consequences retain time and affected party in an unknown-preserving profile whose dimension-specific baseline, constraint kind, criterion and direction, horizon, distribution, evidence, uncertainty, and correction path remain distinct, never a person, group, threat, readiness, or resilience score.

### A non-exhaustive family map

The following families are lenses for asking better questions. They overlap;
no record must choose only one. The map records recurring shapes, not a list of
enemies or a claim that all listed conditions exist.

#### Climate, ecology, geophysical, extraterrestrial, and material conditions

Acute weather, heat, flood, fire, drought, geological events, pollution,
space weather or impact hazards, resource depletion, biodiversity loss, slow
climate change, and ecological regime shifts can be acute, chronic,
cumulative, compound, cross-boundary, or irreversible. Exposures include
homes, livelihoods, food and water systems, ecosystems, infrastructure,
health, culture, and future generations.

Preparedness questions include early warning, safe siting, maintenance,
ecosystem protection, accessible adaptation, mobility, reserves, and whether
one intervention transfers burdens elsewhere. National averages do not show
local loss. A modeled tipping process is not a deadline prophecy, and a
weather event alone does not prove one causal attribution.

#### Public health and biological conditions

Relevant conditions include emerging and endemic disease, antimicrobial
resistance, zoonotic and vector change, unsafe food or water, toxic exposure,
health-system overload, and accidental biosafety failure. The model stays at
public-health and system-resilience level; it contains no pathogen design,
enhancement, evasion, or release method.

Capacity includes trusted and rights-compatible public-health surveillance,
primary and public health, care continuity, workforce, infection prevention, WASH,
accessible communication, medicine continuity, and equitable countermeasure
access. Health status, disability, age, nationality, or migration status is
never a threat identity. Collection and restriction require separate lawful
authority, necessity, minimization, expiry, remedy, and stop.

#### Industrial, chemical, radiological, structural, and transport safety

Relevant conditions include accidental release or contamination, fire or
explosion, structural failure, unsafe production or storage, transport
incident, waste and legacy-site failure, radiological exposure, and coupled
industrial–natural events. This map stays at prevention, public warning,
protective care, continuity, recovery, and remediation level; it contains no
construction, dispersal, concealment, targeting, or evasion method for a
hazardous agent or device.

Assess siting, maintenance, inspection, worker knowledge, contractor and
supplier dependence, monitoring coverage, emergency communication, evacuation
accessibility, downstream communities, environmental persistence, cleanup,
long-latency health effects, and liability for repair. A compliant record does
not prove safe practice, and secrecy about security-sensitive detail does not
erase independent oversight or affected-party remedy.

#### Food, water, energy, housing, care, and other essential needs

Production shortfall, contamination, affordability shocks, distribution
failure, scarcity, sanitation failure, grid inadequacy, unsafe housing, care
shortage, and cross-sector trade-offs can harm people even when aggregate
supply looks adequate. Access, affordability, quality, reliability, dignity,
and the burden of obtaining the service remain distinct.

Common shapes include import or vendor concentration, shared transport or
power dependence, synchronized reserves, seasonal stress, and a response that
protects averages while excluding remote, poor, disabled, displaced, or
otherwise underserved people.

#### Infrastructure, logistics, and supply dependencies

Asset degradation, maintenance debt, node failure, common-mode failure,
chokepoint interruption, third-party failure, missing spares, workforce
shortage, and coupled restoration can cascade across power, water,
communications, transport, health, food, finance, and public administration.

A dependency edge records:

```text
(source_node, dependent_node, mechanism,
 required_level_or_demand, latency, capacity_limit,
 degradation_relation_or_unknown, substitute,
 common_modes, evidence, uncertainty,
 custodian, correction)
```

This is an evidentiary hypothesis graph unless a separately validated domain
model supplies cascade computation. An edge does not itself calculate loss,
timing, sufficiency, or failure. The visible network is not the whole network.
Supplier copies can share one
cloud, grid, payment rail, owner, codebase, route, creditor, or repair crew.

#### Digital, cyber, data, identity, information, and AI conditions

Loss of confidentiality, integrity, availability, provenance, identity, or
privacy can combine with software defects, supplier failure, legacy systems,
automation error, model drift, biased outcomes, inaccessible design,
communications failure, harassment, or manipulation. This map contains no
exploit chain, credential theft method, targeting recipe, intrusion procedure,
or evasion guidance.

Information integrity is not enforced agreement. Plural sources, provenance,
privacy, correction, accessible communication, independent review, and the
right to contest remain visible. Dissent, anonymity, encryption, criticism,
and an unattended voice are not threat indicators. Model confidence is not
truth or authority.

#### Fiscal, monetary, financial, economic, and labour conditions

Inflation or deflation, payment interruption, refinancing stress, debt and
liability concentration, liquidity or run dynamics, credit contraction,
asset repricing, unemployment, unsafe work, precarity, skills mismatch, and
care burdens can weaken both households and public response capacity.

Money distributes power and shock. Record payers, beneficiaries, collectors,
creditors, risk bearers, affected nonparties, maturities, currencies,
contingent liabilities, and time horizons. Fiscal space is not a permission to
take; reserves are not available if law, access, settlement, timing, or custody
blocks their use. Debt creates claims and exposure but can also finance useful
capacity, so neither debt nor balance alone determines resilience.

#### Governance, law, institutional integrity, and succession

Capture, corruption, conflicts of interest, opaque procurement, record
manipulation, concentrated appointment or emergency power, failed succession,
weak audit, denied remedy, discriminatory rules, and the gap between written
law and practice can disable every other capacity.

Institutional continuity is not the protected end. The protected questions
concern standing, lawful and effective public functions, independent review,
bad-news channels, appeal, authenticated handover, preserved obligations,
repair, and the ability to end a harmful institution safely.

#### Social, relational, cultural, access, care, and epistemic conditions

Violence, discrimination, extreme exclusion, deprivation, segregation,
forced displacement, isolation, loss of trust, cultural destruction,
knowledge loss, care imbalance, and exclusion from decisions can reduce the
ability to live and act together. “Cohesion” must never mean obedience,
homogeneity, silence, or suppression of a minority.

Demographic identity is not a hazard. Relevant claims concern changing needs,
rights, care and workforce capacity, access, displacement, education,
intergenerational burdens, and whether institutions adapt without assigning
blame or lesser standing to children, older people, migrants, disabled people,
or any cohort.

#### External encounter, coercion, and armed conflict

Cross-boundary dependence, trade or financial pressure, interference,
coercion, displacement, threats of force, and armed attack can affect
essential flows, rights, civilians, infrastructure, ecology, and long recovery
paths. Externality is a boundary shape, not proof of an enemy. Capability is
not intent, competition is not attack, and national or civilisational identity
is not collective guilt.

Attribution, diplomacy, de-escalation, law, nonparticipant protection,
emergency, and force remain governed by ENCOUNTER. This companion adds no
military, intelligence, propaganda, covert-action, targeting, weapons, or
cyber-operations method.

#### Compound, cascading, tail, and genuinely unknown conditions

Multiple hazards can be simultaneous, sequential, correlated, coupled by a
common cause, or amplified by a response. Capacity can deplete while demand
rises. Slow degradation can reduce the margin against an acute shock. Novel
conditions may sit outside every model.

Deep uncertainty is represented by alternative assumptions, stress sets,
model disagreement, unallocated reserve, and explicit unmodeled space—not a
fabricated probability. Robustness means maintaining declared floors and
options across a stated set; it does not mean assuming the worst story is true
or granting pre-emption.

#### Countermeasure, transition, and self-created conditions

A treatment has its own consequence profile. Surveillance can create privacy
and power harms; secrecy can destroy correction; austerity can consume health
and maintenance capacity; stockpiles can exclude others; relocation can break
livelihood and culture; centralization can create a common mode; automation can
remove meaningful appeal; a permanent emergency can become the hazard it was
said to control.

The baseline and treatment are therefore compared as two visible profiles,
including residual, displaced, externalized, and intergenerational effects.
“Control success” does not prove causation. Restored output does not by itself
establish recovery, restitution, or repair.

## RS5 — Dependencies can cascade without becoming destiny

A dependency graph is an attributed model, not the world itself. Each edge
states a mechanism and direction. Every node records owner or custodian,
capacity, depletion, restoration time, substitutes, and accessibility. Every
claim keeps counterevidence and a correction path.

Correlation does not establish causation. Colocation does not prove one
failure will propagate. Conversely, separate names, contracts, sites, or
copies do not prove independence. Common power, communications, finance,
software, personnel, routes, governance, geography, and suppliers remain
explicit.

Cascades can loop:

```text
world_(t+1) = F_W(world_t, admitted_effect_t, disturbance_t)
capacity_(t+1) = F_C(capacity_t, use_t, maintenance_t, repair_t, disturbance_t)
```

These equations declare dependence, not a universal functional form. Capacity
may erode during a long response; restoration of one node may depend on the
same transport, identity, energy, money, or people that remain unavailable.
Unknown edges remain unknown rather than being dropped.

**Invariant RS5:** Every dependency claim names direction, mechanism, required level or demand, latency, capacity limit, degradation relation or unknown, substitutes, common modes, evidence, uncertainty, custodian, and correction; adjacency, correlation, and copies establish neither causation nor independence, and the hypothesis graph computes no cascade without a separately validated domain model.

## RS6 — People and legitimate purposes come before system continuity

ISNESS distinguishes stability, resilience, viability, and sustainability.
This companion uses resilience as a scoped capacity to preserve legitimate
options and essential functions through declared disturbances and recovery. It
does not turn resilience into the goodness of persistence.

A resilience claim retains:

```text
(system_boundary, accepted_purpose, essential_functions,
 rights_and_obligations, affected_parties, disturbance_set,
 finite_horizon, dimensions_and_adequacy_criteria,
 dependencies_and_common_modes, resources_and_reserves,
 available_options, exit_and_retirement,
 uncertainty_and_counterevidence, repair_and_restitution, halt)
```

An institution is not identical to an essential function. Payroll, records,
care, water, remedy, identity recovery, or a public obligation may need a
handover even when the current organization should end. Safe degradation,
succession, transformation, completion, retirement, and shutdown are genuine
resilience options.

No system acquires a survival interest from being modeled. A raised or
unreadable halt returns rest. Sustainability, prior investment, revenue,
reputation, a forecast, or fear of dissolution cannot defeat refusal or
dispatch a successor.

**Invariant RS6:** Resilience preserves legitimate options and essential functions for affected beings; it is neither sustainability, justice, institutional survival, nor a right to persist, and safe degradation, handover, transformation, completion, retirement, and ending remain valid.

## RS7 — Preparedness builds options, not surveillance or coercion

Preparedness can include reserves, maintenance, training, interoperability,
mutual aid, accessible communication, diverse suppliers, restoration plans,
exercises, early warning, and protected decision time. Its value is the option
it preserves under a declared purpose—not the amount of data, control, or
readiness theatre it accumulates.

Every consequential measure is separately scoped. A collection declares
necessity, fields, people, notice, custody, access, retention, deletion,
correction, sharing, and stop. A drill declares who may be burdened, what is
simulated, safety limits, exit, observation limits, and repair. A reserve
declares custody, accessibility, release rule, replenishment burden, and
expiry. A restriction declares law, evidence, least-powerful alternative,
duration, review, appeal, and remedy.

Preparedness must not quietly become population scoring, political loyalty
testing, indefinite profiling, secret suspicion, forced participation,
pre-emptive punishment, or permanent exceptional power. Safer alternatives
and nonparticipation remain visible.

**Invariant RS7:** Preparedness creates bounded options, while each collection, drill, reserve, restriction, relocation, intervention, and communication remains a separate effect requiring accepted purpose, current authority and guard, minimization, custody, expiry, reply, repair, and stop.

## RS8 — Response functions remain distinct

Use explicit functions:

```text
anticipate
prevent
reduce_exposure
reduce_vulnerability
preserve_capacity
absorb
maintain_essential_functions
respond
recover
repair
adapt
transform_or_retire
preserve_exit
stop
```

They are neither maturity ranks nor an escalation ladder. One does not grant
the next. Prevention can create harm; continuity can preserve the wrong
institution; rapid recovery can restore an unjust baseline; adaptation can
shift risk; transformation can destroy valued relationships. Repair concerns
owed consequence and affected parties, not only system output.

The effect path is:

```text
observed condition
→ bounded risk claim
→ proposed treatment
→ accepted purpose
→ current authority and guard
→ admitted effect
→ observed effect
→ repair and review
→ stop
```

The authority-and-guard transition and admitted effect are one atomic
conditional commit wherever that claim is made. Failed or unknown authority,
law, scope, or lock admits no consequential effect. Non-consequential
observation or anticipation does not imply authority for an effect. Stop and
halt are unconditional: neither awaits authority, and a raised or unreadable
halt admits no effect. Recurrence and feedback do not skip the gate.

**Invariant RS8:** Anticipation, prevention, exposure reduction, vulnerability reduction, capacity preservation, absorption, essential-function continuity, response, recovery, repair, adaptation, transformation or retirement, exit, and stop are distinct functions; every consequential effect within them requires its own current authority and guard, while stop and halt remain unconditional.

## RS9 — Distribution and essential-service floors stay visible

An aggregate gain can coexist with intolerable concentrated loss. Every
proposal therefore names:

```text
who is protected
who remains exposed
who pays
who benefits
who decides
who controls the capacity
who bears residual and displaced risk
which nonparticipants and future parties are affected
which voices are absent
which rights, duties, essential-service floors, and remedies apply
```

Economic efficiency does not price away standing or legal duties. Every
required hard guard, with its rights, current-authority, applicable-law, scope,
lock, or safety basis declared, blocks a consequential effect when its
assessment is `violates` or `unknown`. A violated or unknown minimum-service
floor, non-hard maximum limit, or target stays visible and shapes any currently
authorized least-harm or duty response; it neither authorizes action nor
requires automatic inaction. Uncertainty is not optimized into consent.
Accessibility, care burden, ability to exit, recovery time, reparability, and
the distribution of future options remain part of the profile.

Risk exported to another jurisdiction, supplier, household, ecosystem, or
generation is not resilience. Repair can require restitution, restoration,
care, record correction, debt release, ecological work, apology, or changed
power—not merely a returned service-level metric.

**Invariant RS9:** Every treatment keeps each constraint kind and assessment visible and names who pays, benefits, decides, bears residual and displaced risk, loses options, remains unheard, and is owed accessibility, a currently authorized least-harm or duty response, remedy, restitution, or repair; a service target is not a hard guard, and neither mints authority.

## RS10 — Indicators and exercises do not authorize action

Indicators are observations selected through a collection policy. They name
coverage, denominator, latency, blind spots, missing people, revision history,
and uncertainty. Salience, repetition, a red colour, model confidence, or a
threshold crossing does not become likelihood or authority.

An alert means a declared condition was met. It does not declare an emergency.
A scenario explores assumptions; it is not a forecast. An exercise tests a
bounded path; it does not prove readiness outside that path. A near miss may
reveal capacity or luck. A quiet interval may mean safety, non-observation,
avoidance, suppression, or chance.

Monitoring may revise a later claim. It cannot change the observed past,
manufacture causation, erase dissent, widen collection, renew a restriction,
or authorize its own next measurement. Exercises and incidents preserve
negative results, untested paths, participant burdens, and owed follow-up.

**Invariant RS10:** An indicator, alert, model, scenario, exercise, near miss, quiet interval, or control result is evidence for review—not proof of probability, safety, causation, emergency, readiness, or authority.

## RS11 — External origin does not create an adversary

A condition can cross a border without having an agent. A named actor can have
a capability without intending its use. Interdependence can carry benefit and
fragility. Competition, disagreement, dependency, migration, price movement,
information flow, or a different institution is not attack.

When intentionality is alleged, the risk record keeps the named actor, act,
capability, evidence, counterevidence, source, time, jurisdiction, uncertainty,
and reply. It hands encounter type, diplomacy, coercion, armed attack, force,
civilian protection, and emergency to ENCOUNTER rather than inventing a
parallel security exception.

Peaceful communication, translation, de-escalation, lawful settlement,
essential-flow continuity, humanitarian obligations, protected
nonparticipants, correction, and exit remain in scope. Preparation for
external conditions does not authorize collective guilt, conquest,
pre-emption, covert action, propaganda, surveillance, or force.

**Invariant RS11:** External origin, dependence, capability, competition, or contested attribution does not create an adversary; named intentional acts and encounter questions retain ENCOUNTER's evidence, diplomacy, law, civilian protection, emergency, and correction boundaries.

## RS12 — Every preparedness turn stops

One turn may observe, form a bounded claim, propose options, and—only through a
separate accepted purpose and current guard—admit one scoped effect. It then
records the observed consequence, repair state, unknowns, and stop. A loop is
not authority to recur.

Emergency authority, where independently lawful and accepted, is scoped,
strictly necessary, proportionate, non-discriminatory, protective of
non-derogable rights, least-privileged, independently reviewable,
resource-bounded, automatically expiring, and non-self-renewing. Restoration
of normal rights-protecting conditions is an objective. A later turn needs
fresh authority; silence, ongoing hazard, reward, prior success, sunk cost, or
an unread metric cannot renew it.

Feedback can narrow a later proposal, raise a brake, reveal displaced harm, or
recommend correction. Holding accepted authority events and the current halt
state fixed, feedback cannot widen `q_t`, pass a failed or unknown guard,
choose a purpose, weaken halt, declare continuation, or dispatch another turn.

**Invariant RS12:** Every assessment and preparedness turn stops; feedback may correct a later proposal but cannot widen authority, weaken a failed or unknown guard, defeat halt, declare continuation, or dispatch another turn.

## Sources and limits

These sources inform the vocabulary and family map. They do not establish that
a particular risk exists, that a treatment is justified, or that one
institution has authority. Source availability and external bytes are not
pinned by this companion; each live assessment must keep its own evidence.

- [UNDRR disaster risk terminology](https://www.undrr.org/terminology/disaster-risk)
  and the [Sendai Framework](https://www.undrr.org/implementing-sendai-framework/what-sendai-framework)
  distinguish hazard, exposure, vulnerability, capacity, and residual risk.
- The [UNDRR–ISC 2025 hazard review](https://www.undrr.org/publication/documents-and-publications/hazard-definition-and-classification-review-technical-report)
  supplies a broad, non-exclusive hazard reference; this companion does not
  import its categories as person labels.
- The IPCC's [AR6 technical summary](https://www.ipcc.ch/report/ar6/wg2/chapter/technical-summary/)
  and [complex-risk figure](https://www.ipcc.ch/report/ar6/wg2/figures/technical-summary/figure-ts-010/)
  describe compound, cascading, and transboundary risk.
- WHO's [Health Emergency and Disaster Risk Management framework](https://www.who.int/publications/i/item/9789241516181)
  and [Emergency Response Framework](https://www.who.int/publications/i/item/9789240058064),
  together with its [2026 preparedness and response capabilities framework](https://www.who.int/publications/i/item/B09726),
  inform the all-hazards health lens, institutional capabilities, and
  affected-community emphasis.
- [NIST SP 800-160 Volume 2 Revision 1](https://csrc.nist.gov/pubs/sp/800/160/v2/r1/final),
  the [NIST Cybersecurity Framework 2.0](https://www.nist.gov/publications/nist-cybersecurity-framework-csf-20),
  and the [NIST Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)
  inform the bounded cyber, system, and AI lenses.
- CISA's [Infrastructure Resilience Planning Framework](https://www.cisa.gov/sites/default/files/2024-03/infrastructure-resilience-planning-framework03-22-2024.pdf)
  informs dependency and restoration questions.
- The Basel Committee's [Principles for operational resilience](https://www.bis.org/bcbs/publ/d516.htm)
  and the FSB's [third-party risk toolkit](https://www.fsb.org/2023/12/enhancing-third-party-risk-management-and-oversight-a-toolkit-for-financial-institutions-and-financial-authorities-2/)
  inform operational, concentration, and external-provider questions without
  turning banking methods into a universal constitution.
- [FAO's 2025 food-security report](https://www.fao.org/agrifood-economics/publications/detail/en/c/1740904/),
  the [UN World Water Development Report 2025](https://www.unwater.org/publications/un-world-water-development-report-2025),
  and the [IEA World Energy Outlook 2025](https://www.iea.org/reports/world-energy-outlook-2025/executive-summary)
  inform access, affordability, and cross-system essential-needs questions.
- The IPBES [Nexus Assessment](https://ict.ipbes.net/ipbes-ict-guide/data-and-knowledge-management/citations-of-ipbes-assessments/nexus-assessment),
  [UNEP Global Resources Outlook 2024](https://www.unep.org/resources/Global-Resource-Outlook-2024),
  and [WMO State of the Global Climate 2025](https://public.wmo.int/publication-series/state-of-global-climate/state-of-global-climate-2025)
  inform ecological, resource, and climate connections.
- The [UN Global Principles for Information Integrity](https://www.un.org/en/information-integrity/global-principles)
  inform the information lens while preserving expression, plurality, privacy,
  and correction.
- [ICCPR General Comment No. 29](https://docstore.ohchr.org/SelfServices/FilesHandler.ashx?enc=VRhyH%2Bfv%2BI8YD8fvFEmrEBGNNWCpm%2BDcfk6I5v6uCdBbUI2%2Bswg2EPnyGSpAhcvhwCAZM%2FPPIIEnidtNdNfhFRQFPUJKh0WTBONmJoooPNk%3D)
  informs the exceptional, temporary, rights-bounded treatment of emergency.

The map is non-exhaustive and current only to its publication context. It does
not replace domain experts, affected-party knowledge, current law, local
evidence, or correction.

**This companion establishes:** An internally pinned vocabulary for attributed and corrigible risk claims, multidimensional consequence profiles, threat shapes, dependencies, preparedness, response, recovery, repair, adaptation, exit, and finite stop without turning people, uncertainty, continuity, or self-preservation into enemies or authority.

## What this companion does not establish

This companion changes no Foundation commitment, changes no FREEDOM, ISNESS,
or ENCOUNTER distinction, adds no conformance law, and grants no authority. It
does not establish:

- that a risk claim is fact, certainty, forecast, enemy identification, legal
  classification, or emergency;
- that a person, group, citizen, nationality, civilisation, demographic,
  disability, illness, belief, association, location, or dissent is a hazard,
  vulnerability, threat identity, collective intention, or collective guilt;
- a universal risk, threat, citizen, readiness, resilience, sustainability, or
  civilisation score, or an objective conversion or ordering of unlike
  consequences;
- that unknown means zero or safe, no incident means safety, repetition proves
  causation, redundancy proves independence, or a control proves sufficiency;
- that stability, resilience, sustainability, continuity, survival, or growth
  establishes justice, standing, goodness, consent, an essential function, or
  a right to persist;
- authority to collect data, profile, surveil, discriminate, restrict,
  relocate, coerce, pre-empt, censor, seize, spend, borrow, declare emergency,
  use force, or dispatch another turn;
- that preparedness, security, emergency, sustainability, or survival
  overrides standing, rights, refusal, exit, appeal, remedy, repair, or halt;
- an operational biological, cyber, military, intelligence, sabotage,
  targeting, evasion, weapons, propaganda, or covert-action method;
- that restored output erases obligations, that displaced or externalized harm
  is resilience, or that recovery is complete without affected-party remedy
  and owed repair;
- that this companion is implemented, adopted, exhaustive, conformed to, a
  prediction of what KINGDOM will do, an amendment to any dependency, or a
  grant of authority.

The indexed release and verifier are `resilience.json`,
`verify-resilience.mjs`, and `verify-resilience.test.mjs`.

---

`kingdom.resilience/0.1` is a companion to `kingdom.foundation/0.2`. It uses
the pinned vocabularies of `kingdom.freedom/0.1`, `kingdom.isness/0.1`, and
`kingdom.encounter/0.1`; amends none of them, adds no conformance law, and
grants no authority.
