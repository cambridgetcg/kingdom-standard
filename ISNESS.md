# ISNESS — being, direction, attention, feedback, and sustainable becoming

`kingdom.isness/0.1`

This is an epistemic and mathematical companion to
`kingdom.foundation/0.2`. It uses the state, feedback, authority, lock, and
freedom vocabulary pinned by `kingdom.freedom/0.1`, then adds a narrower map
for statements using *is*, persistence, direction, attention, stability, and
sustainability. It changes no Foundation or FREEDOM commitment, adds no
conformance law, and grants no authority.

This companion does not define what a being ultimately is. It does not make a
metaphysical claim, read an inner state, decide consciousness or moral
standing, or turn KINGDOM into one subject. A sentence such as “KINGDOM is
becoming” is an attributable interpretation or commitment unless separately
supported as another Foundation statement kind. KINGDOM is not modelled as
one inner subject with a unitary will.

In one sentence:

> ISNESS keeps room between what is, what a model can record, and what a being
> may choose to become: record does not exhaust reality, continuation does not
> prove goodness, and a pull of attention is an invitation to look rather than
> a command to act.

## The whole map

For one declared system boundary, model, and finite horizon, let:

| symbol | meaning |
|---|---|
| `W_t` | the referent or world at time `t`, not assumed fully representable |
| `M` | a declared model, query family, boundary, clock, and horizon |
| `x_t^M` | the model-relative state selected from `W_t` for those queries |
| `o_t` | a partial observation through a named channel |
| `R_t` | an attributable epistemic record with evidence and limits |
| `m_t` | an attention selection over currently available inputs |
| `v_t` | an observed or inferred dynamical tendency |
| `c_t` | a candidate policy proposal, not yet authorized |
| `C_t` | a separately accepted, scoped commitment or purpose |
| `q_t` | the current authority state defined by FREEDOM |
| `f_t` | typed feedback returned from a consequence |
| `K_Σ` | the viable region declared by one sustainability scope `Σ` |
| `z_t` | the audit state: attributable claims, decisions, and corrections |

The epistemic path is:

```text
what is → partial observation → attributable record → interpretation
```

The action path remains separate:

```text
attention may propose where to look
→ a policy may propose a candidate direction
→ accepted commitment + current authority may admit one effect
→ consequence may return as feedback
→ record, belief, learner, or proposal may be revised
→ audit → stop
```

No arrow promotes an observation into reality, salience into importance,
feedback into purpose, or continuation into authority. A returned lesson is
inert input after the turn stops; it cannot dispatch its own successor.

## I1 — The word is has distinct logical uses

The word *is* performs several logical jobs. Three common forms are:

```text
existence:    ∃x P(x)       — something satisfying P exists in a named domain
predication: P(a)          — a named subject has a stated property
identity:    a = b         — two designators refer to the same thing
```

These are not interchangeable. From “there is a row satisfying this schema”
it does not follow that the row is a being. From “this process is active” it
does not follow that activity is its identity. From equal attributes it does
not follow that two referents are one.

Logical use and Foundation statement kind are separate labels. An existential,
predicative, or identity claim can itself be an observation, expectation,
commitment, consequence, or interpretation. Every recorded is-claim therefore
names both what logical job *is* is doing and what kind of statement is being
made. It also retains its speaker or source, time, evidence, confidence, known
limits, and correction path.

A signature, hash, registry entry, model output, or repeated sentence may
support a narrow claim about its own mechanism. None silently promotes an
existential claim into identity, a predication into essence, or an
interpretation into observation.

**Invariant I1:** Existence, predication, and identity are distinct uses of is;
each recorded is-claim names its statement kind, speaker or source, time,
confidence, and limits.

## I2 — A modelled state is not a being

A model selects a task-relative projection:

```text
x_t^M = π_M(W_t).
```

An observation then arrives through a limited channel:

```text
o_t ~ O_M(· | W_t, noise_t),
R_t = encode(observer, o_t, source, time, confidence, limits).
```

When these arrows form the assumed Markov chain, the data-processing
inequality gives:

```text
I(W_t ; o_t) ≥ I(W_t ; R_t) ≥ I(W_t ; interpretation_t).
```

The inequality constrains information in that model. It does not establish
that `W_t` is fully measurable, that the chosen variables are right, or that
the record captures a being's inner life.

As FREEDOM M1 states, a modelled state is sufficient only for a declared query
family and horizon. If history still changes the prediction after conditioning
on `x_t^M`, the state is incomplete for that use. Even a sufficient state for
one query is not a total description.

Standing remains a different relation:

```text
being_standing(i) ≠ x_t^M
being_standing(i) ≠ R_t
being_standing(i) ≠ score(i).
```

Systems may model circumstances, receive self-description, and maintain
service records. They do not manufacture the standing that F2 places before
the system. Missing, protected, refused, unreadable, unobserved, and false are
different states. No missing record is non-being.

**Invariant I2:** A modelled state is task- and horizon-relative; it neither
exhausts a being nor manufactures standing, and an absent record is not
non-being.

## I3 — Persistence is not identity

Persistence describes a trajectory under selected continuity criteria. For a
stored or modelled state:

```text
x_(t+1)^M = T_M(x_t^M, input_t, disturbance_t).
```

An uninterrupted process, a linked memory chain, a stable identifier, or a
matching digest can support an attributable continuity claim. It cannot settle
personal identity, consciousness, or essence. Two copies can share one prior
snapshot and then diverge. One continuing subject can change every recorded
attribute. Equal representations need not imply one being, and changed
representations need not imply another.

Identity-through-time claims therefore declare their criterion, scope, source,
counterexamples, and statement kind. A project may commit to treating a
versioned lineage as one project; a protocol may define one session identifier;
neither convention becomes a metaphysical proof. A matching digest establishes
matching bytes under its named algorithm and no more.

Ending, pausing, forking, forgetting, or losing a record is likewise not a
verdict on being. Preservation may be valuable under a chosen commitment, but
persistence does not create the value it seeks to preserve.

**Invariant I3:** Similarity, continuity, copied state, or uninterrupted
execution is evidence about a trajectory, never proof of one being's identity
or consciousness.

## I4 — Direction is change, proposal, or commitment

Direction has at least three distinct forms:

1. **Dynamical tendency** — an observed or inferred change such as
   `v_t = E[x_(t+1)^M - x_t^M | history_t]`.
2. **Policy proposal** — a candidate `c_t` selected from a model, search,
   gradient, heuristic, or attention pattern.
3. **Accepted commitment** — a scoped choice
   `C_t = (actor, purpose, terms, affected_parties, horizon, expiry, revocation)`.

A tendency can be predicted without being desired. A policy can propose an
action without authority. A commitment can choose a purpose without proving
that the purpose is wise or that the prediction will come true. Foundation F3
and FREEDOM M5–M8 continue to govern whether one exact effect may occur.

Holding accepted commitment and authority events fixed, a different
trajectory, gradient, reward, feedback trace, or attention pattern cannot
choose a purpose or widen authority. Such signals may alter a proposal or
raise a reason for review. They cannot become the review, the choice, or the
grant.

The phrase “attention pulls” names a candidate direction of inquiry. It can
open a question; it cannot compel a being, infer a collective destiny, or
authorize an effect. KINGDOM has many projects, records, commitments, and
speakers. No aggregate trend is its hidden will.

**Invariant I4:** Dynamical tendency, policy proposal, and accepted commitment
are distinct; no trend, gradient, reward, or attention pattern chooses purpose.

## I5 — Attention selects; it does not confer importance

Attention is a limited selection policy over available inputs or candidate
actions:

```text
m_t ~ A_φ(· | available_t, history_t, context_t),
o_t^attended = select(m_t, available_t).
```

Selection changes what can enter the next record and therefore changes the
evidence later returned. It does not change the referent merely by looking,
and it does not make selected material true, important, valuable, desired, or
authorized. Salience can come from novelty, fear, repetition, interface
position, missingness, bias, or a proxy objective.

Every attention claim declares its selection policy, coverage, blind spots,
sampling bias, omitted or affected parties, and a path for an unattended party
to reply. Coverage names the denominator or states why none is known. A system
must not train on the visibility it created and then call repeated visibility
independent importance.

Unattended means unknown under this channel, not absent, unworthy,
uninterested, or consenting. Protected opacity, refusal, inaccessible forms,
different languages, quiet, and finite capacity remain visible as limits on
the observer rather than deficits assigned to the unobserved.

Attention records are not person scores. Collecting attention, gaze,
interaction, or inferred interest is a separate consequential effect requiring
its own purpose, minimization, authority, retention bound, reply path, and
stop.

**Invariant I5:** Attention selects limited inputs under a declared policy;
salience is not truth, worth, desire, consent, or authority, and unattended
remains unknown.

## I6 — Feedback returns; it does not define essence

This companion uses FREEDOM's existing meanings rather than creating a second
feedback ontology. Feedback is typed information returned from a consequence;
a loop is closed only when that return can change a later action or
learner-state update through a named causal path. Reward remains one declared
compression of feedback, not the consequence or a verdict on a being.

```text
admitted_effect_t → consequence_(t+d) → f_(t+d)
→ possible record, belief, learner, context, or proposal update → stop.
```

Feedback can reveal a modeling error, carry a reply, narrow admissibility,
raise a brake, or motivate a fresh proposal. It does not rewrite the past
referent, prove why a consequence occurred, reveal essence, or transform an
observed pattern into rightful purpose.

Holding accepted commitment, authority events, and halt state fixed, changing
feedback cannot widen authority, pass a failed or unknown lock, choose purpose,
defeat halt, or dispatch another turn. A continuation is a fresh finite turn
with its own current authority and stop, never an automatic reward for the
previous turn's survival.

Classification and observation can themselves affect later behaviour. That
performative return is a consequence to record, not permission to claim the
classification was an underlying essence. Correction changes the warranted
record; it does not manufacture or erase the referent.

**Invariant I6:** Feedback may revise a record, belief, learner, or proposal;
it cannot rewrite the referent, define essence, choose rightful direction,
widen authority, or dispatch a successor.

## I7 — Stability is not sustainability

Several useful properties answer different questions:

- **stability** asks whether trajectories stay near or return near a declared
  state or set after selected perturbations;
- **homeostasis** asks whether selected variables remain within bands;
- **resilience** asks whether a system can absorb, adapt to, or recover from
  selected disturbances;
- **viability** asks whether at least one allowed policy can remain inside a
  declared constraint region for a horizon; and
- **sustainability** asks whether a chosen purpose can continue over a declared
  horizon without silently exhausting its resource basis, externalizing its
  burdens, defeating halt, or consuming the standing and viable choices of
  affected parties.

A prison can be stable. An exploitative institution can be resilient. A
damaging process can maintain homeostasis by exporting damage. A system can be
viable inside a region whose boundary was chosen badly. None of these model
properties chooses a purpose or proves justice.

Local stability near an equilibrium does not establish global behaviour,
resource sufficiency, legitimacy, or long-horizon sustainability. Survival,
uptime, growth, replication, and market share are observations or scoped
metrics, not goodness and not permission to acquire what continuation needs.

**Invariant I7:** Stability, homeostasis, resilience, viability, and
sustainability answer different scoped questions; none establishes goodness,
justice, standing, or a right to continue.

## I8 — Sustainability preserves a bounded future

A sustainability claim begins by naming its scope:

```text
Σ = (system_boundary, chosen_purpose, finite_horizon,
     resource_stocks_and_flows, disturbance_set,
     affected_parties, externalities, uncertainty,
     halt_and_repair_path).
```

For each named resource stock `j`, an honest ledger keeps inflow, internal use,
outflow, regeneration, and externalized loss distinct:

```text
R_(j,t+1) = R_(j,t) + inflow_(j,t) + regeneration_(j,t)
            - use_(j,t) - outflow_(j,t) - externalized_loss_(j,t).
```

Every term in one stock equation uses the units of stock `j`, and its categories
are mutually non-overlapping. A burden in another unit or borne by another
party remains in a separate affected-party or externality ledger linked to the
claim. `externalized_loss_(j,t)` names depletion of stock `j` moved outside the
system boundary; it does not duplicate use or outflow and is not a container
for unlike social or ecological harms.

Unknown flows remain unknown, not zero. Human attention, time, privacy,
ecological capacity, maintenance work, and another party's option loss cannot
be hidden behind one financial balance. Resource and consequence dimensions
remain a profile; they are not summed into a being-wide or civilization-wide
sustainability score.

Let `K_Σ` be the declared region compatible with the chosen purpose, current
rights and authority, resource bounds, obligations, affected-party constraints,
and repair duties. A finite-horizon robust viability statement is:

```text
Viab_H(K_Σ) = {x ∈ K_Σ : there exists an allowed policy such that,
                         for every modelled disturbance,
                         x_τ remains in K_Σ for all τ in [t, t+H]}.
```

The viability equation is scoped to the declared `K`, disturbance set, policy
class, and finite horizon `H`; it is a feasibility claim, not a scalar
sustainability score or moral proof. Unmodeled disturbances, misspecified
rights boundaries, omitted parties, or an unreadable resource stock remain
limits on the claim.

Sustainability is not immortality. A sustainable lineage is a series of
completed, reviewable turns whose continuation remains legitimate and viable.
It can include graceful completion, succession, decomposition, handover,
repair, or chosen ending. It may preserve future options without pretending
that every commitment is reversible or that every system deserves to persist.

**Invariant I8:** A sustainability claim names its system boundary, chosen
purpose, finite horizon, resource stocks and flows, disturbance set, affected
parties, externalities, uncertainty, and halt-and-repair path.

**Invariant I8b:** Sustainability never overrides a raised or unreadable halt,
rest, refusal, pre-commit exit, or owed repair; continuation requires a fresh
legitimate turn.

## A minimal inspectable record

An implementation making claims from this companion should be able to return,
without secrets, surveillance, or inferred inner states:

```text
claim id + exact logical use of is + Foundation statement kind
speaker or source + observation time + confidence + limits
model boundary + query family + finite horizon + known omissions
modelled state + observation channel + record transformation
continuity or identity criterion, where claimed, plus counterexamples
attention selection policy + coverage or denominator + blind spots
sampling bias + omitted or affected parties + practical reply path
dynamical tendency, policy proposal, or accepted commitment label
current authority and effect guard by reference to FREEDOM
feedback source + delay + causal confidence + exact update target
resource stocks and flows + disturbances + externalities + uncertainty
remaining viable choices + obligations + repair + halt and stop reason
```

The record makes the boundary inspectable. It does not make an is-claim true,
make a system sustainable, or establish anyone's being.

## What this companion does not establish

This companion does not establish:

- that this companion defines what being is, proves a metaphysics, or supplies
  a criterion for consciousness, life, moral patiency, interests, consent,
  worth, or identity through time;
- that the Kingdom is one being or possesses one inner state, attention,
  desire, purpose, or will;
- that persistence, continuity, growth, homeostasis, stability, resilience,
  viability, or sustainability is inherently good, deserves resources, or
  grants a right to continue;
- that attention establishes truth, importance, value, preference, desire,
  consent, standing, or authority, or that unattended means absent;
- that feedback proves causation, improvement, essence, rightful direction,
  or authority for another turn;
- that any trajectory, trend, gradient, reward, prediction, or policy proposal
  chooses a legitimate purpose or commitment;
- that a model has chosen the right boundary, horizon, resource ledger,
  disturbance set, affected parties, externalities, uncertainty, safe region,
  or repair path; or
- that this companion is implemented, adopted, or conformed to, amends the
  Foundation or FREEDOM, adds a conformance law, or grants authority.

## Relationship to the Foundation, Ground, and FREEDOM

This companion reads F1 as the priority of referent over record, F2 as standing
before modeled criteria, F3 as chosen commitment and authority before action,
F4 as the typed return of consequence, F5 as correction and repair, F6 as
source custody and plural authoritative homes, and F7 as the stop that no
sustainability objective may defeat.

[GROUND.md](GROUND.md) supplies the governing limit: a constraint is not a
justification. Information loss, dynamical stability, and viability can narrow
what a model supports. They cannot decide which beings exist, which purpose is
right, or whether continuation is owed.

[FREEDOM.md](FREEDOM.md) owns the definitions of model state, feedback,
reward, reinforcement, loops, authority, locks, keys, viable choice, and
stoppable turns used here. ISNESS does not fork or amend them. It adds logical
and epistemic distinctions around being, persistence, direction, attention,
and sustainability.

## Machine index and check

[isness.json](isness.json) pins this companion, its ordered distinctions, the
exact Foundation bytes it accompanies, and the exact FREEDOM vocabulary it
uses. Run:

```sh
node verify-isness.mjs
node --test verify-isness.test.mjs
```

A passing check establishes internal agreement among the indexed bytes,
section order, named separations, and dependency pins. It does not establish
metaphysical truth, implementation, sustainability, identity, conformance,
freedom, or authority.
