# FREEDOM — feedback, state, learning, locks, and keys

`kingdom.freedom/0.1`

This is a formal companion to `kingdom.foundation/0.2`. It gives adaptive
systems one precise vocabulary for state, feedback, reinforcement, loops,
locks, keys, and freedom. It changes no foundation commitment, adds no
conformance law, and grants no authority.

The mathematics below is a model, not a moral proof. It can show what follows
from declared dynamics, observations, constraints, and objectives. It cannot
choose standing rights, decide whose authority is legitimate, or turn an
estimate into reality. Those boundaries come from the adopted Foundation and
the source that actually owns the affected state.

In one sentence:

> Freedom is the non-scalar set of legitimate, viable choices that remain
> available inside standing rights and safety boundaries — including a real
> way to rest, refuse, exit before irreversible commitment, or revoke future
> optional effects within their terms — not a reward, score, key count, or
> absence of locks.

## The whole map

For a declared boundary and clock, let:

| symbol | meaning |
|---|---|
| `x_t` | world state relevant to one named prediction |
| `o_t` | an observation received through a named, limited channel |
| `b_t` | belief about world state given observed history |
| `h_t, θ_t` | current context or memory, and learned parameters |
| `q_t` | authority state: grants, withdrawals, scopes, and remaining uses |
| `z_t` | audit state: attributable records of what the system did and found |
| `c_t` | a candidate action selected by a policy |
| `a_t` | the action actually admitted, including a no-op |
| `f_t` | returned feedback, possibly delayed, noisy, or multidimensional |
| `r_t` | a scalar reward derived by a declared reward rule |
| `κ_t` | a scoped key or capability presented to one effect guard |

One closed adaptive turn can then be written:

```text
observe → estimate → choose → authorize → act
        → measure → attribute → update → audit → stop
```

The authorization step is not part of the optimizer. The update step cannot
skip back around it. The stop is part of the model, not punctuation added
after the loop.

## M1 — State is not observation

State is relative to a model and a prediction. A representation `x_t` has the
Markov property for a named horizon when the past adds no predictive
information once that state and the proposed future actions are known:

```text
P(x_(t+1:t+H) | history_t, a_(t:t+H-1))
= P(x_(t+1:t+H) | x_t, a_(t:t+H-1)).
```

If this equality is not supported, the model must carry more history or state
that it is non-Markov. Calling a short record “the state” does not make it
sufficient.

An observation comes through a channel:

```text
x_(t+1) ~ P(· | x_t, a_t, disturbance_t)
o_t     ~ O(· | x_t, observation_noise_t).
```

Under partial observation, the system may instead carry a belief:

```text
b_t(x) = P(x_t = x | o_(0:t), a_(0:t-1)).
```

That distribution is an estimate, not the hidden world. A stored record is a
further object: an attributed observation, expectation, commitment,
consequence, or interpretation with source, time, uncertainty, and limits.

Keep five logical state planes separate:

1. **World state** — the condition being modelled, usually not fully known.
2. **Belief state** — what an observer currently estimates about it.
3. **Learner state** — context, memory, parameters, optimiser state, and data.
4. **Authority state** — who may cause which exact effect under which current
   grant, withdrawal, scope, and remaining use. Expiry is evaluated against a
   separately observed clock.
5. **Audit state** — attributable records, not the world they describe.

A protocol label such as `rested`, `active`, or `complete` is not an inferred
inner state, desire, consciousness, or total description of a being.

**Invariant M1:** Observation, belief, learner state, authority state, and
audit state never silently become one another.

## M2 — Feedback is not reward

Feedback is information from a consequence that returns into a later
estimate, choice, control, or update. It can be text, an error vector, a human
reply, a sensor reading, a dispute, a timeout, or silence whose interpretation
was specified before the turn. Silence remains neither consent nor authority.
Feedback need not be scalar or favourable.

A reward is one declared compression of some available information:

```text
r_t = ρ(f_t, context_t) ∈ R.
```

The function `ρ` is a design choice. Reward is therefore not identical to the
actual consequence, an observation of it, the whole feedback, the intended
purpose, or the value of a being. A high reward can accompany a harmful
effect; a low reward can accompany a rights-preserving refusal.

In control language, **positive feedback** amplifies a perturbation around a
declared operating point and **negative feedback** opposes it. Positive does
not mean good, and negative does not mean punishment. For the local linear
system

```text
x_(t+1) = A x_t + B u_t,    y_t = C x_t,    u_t = -K y_t,
```

the closed-loop matrix is `A - BKC`; local discrete stability requires its
spectral radius to be less than one. That local test says nothing by itself
about nonlinear behaviour, delay, saturation, justice, or whether the chosen
target should be stabilized.

Feedback does not prove causation and does not guarantee improvement. The
KARMA return path still records the observed, reported, or inferred effect,
evidence, and causal confidence separately.

**Invariant M2:** Feedback is returned information; reward is a chosen scalar
proxy, and neither is a verdict on a being.

## M3 — Reinforcement changes propensity

Training is an identified update to learner state. Supervised learning may
apply a loss update such as

```text
θ_(n+1) = θ_n - η ∇θ ℓ(θ_n; data_n).
```

A conventional reinforcement-learning model may instead optimize

```text
J(θ) = E_π [ Σ_(t=0)^T γ^t r_t ]
```

and, when the policy's candidate is admitted, use an update such as

```text
δ_t       = r_t + γ V(b_(t+1)) - V(b_t)
θ_(t+1)   = θ_t + α δ_t ∇θ log π_θ(c_t | history_t).
```

These equations define an optimization procedure. They do not establish that
all purpose is scalar, that the reward captures what matters, or that the
trained policy deserves authority.

For a behaviour class `B`, call a signal reinforcing only when it causally
changes later propensity relative to an otherwise equivalent neutral update:

```text
θ+  = U(θ, data, f)
θ0+ = U(θ, data, neutral_feedback)

Δ_B = E_h[P_(θ+)(B | h) - P_(θ0+)(B | h)].
```

Positive `Δ_B` reinforces `B`; negative `Δ_B` suppresses it. The comparison
needs a declared intervention or counterfactual, uncertainty, and held-out
contexts. Without that evidence, report only what was actually found:
`signal-delivered`, `update-observed`, or `propensity-change-unknown`.

A compliment can be feedback without training. In-context correction can
change current behaviour without changing weights. Writing a memory does not
prove learning, and changing parameters does not prove the intended behaviour
was reinforced.

**Invariant M3:** A delivered reward is not reinforcement without evidence of
a causal change in later propensity.

## M4 — A loop returns effects

A causal feedback loop has a return path:

```text
a_t → x_(t+1) → o_(t+d) or f_(t+d) → controller or learner → a_(t+d).
```

It is closed only if changing the returned signal can change a later action or
learner-state update under the declared model:

```text
P((a_(t+d), h_(t+d), θ_(t+d)) | do(f = f_1), history_t)
≠ P((a_(t+d), h_(t+d), θ_(t+d)) | do(f = f_0), history_t).
```

A consequence that is logged but never used is a return, not closed-loop
feedback. Repetition or a schedule without a causal return path is recurrence,
not feedback. A lesson returned by one finite Kingdom turn is inert input for
a possible later turn; it does not authorize or dispatch that turn.

Every implemented loop names:

- its boundary, clock, state representation, observation channels, and noise;
- the actor, policy, candidate action, admitted action, and no-op;
- the feedback source, delay, reward transform if any, and causal limits;
- the exact learner-state update and the parts that do not update;
- the current pre-effect guard and its stated atomicity or TOCTOU limit; and
- a finite resource bound, stop condition, halt owner, and effects that may
  outlive the stopped process.

An adaptive update must be identified, bounded, inspectable, and reviewable.
A continuing lineage is a series of stopped turns, not one immortal loop.

**Invariant M4:** A loop names its causal return path, bounded update, and
stop; recurrence alone is not feedback.

## M5 — A lock guards a transition

A lock is an enforced predicate on one exact proposed effect. Let

```text
e = (verb, object, scope, purpose, data, affected_parties,
     bounds, revision, expiry, nonce).
```

Then a lock evaluates current authority state, context, and presented
capability before the transition:

```text
L(q_t, e, κ_t, context_t) ∈ {pass, fail, unknown}.
```

Only `pass` can admit the effect once. `fail` and `unknown` leave an optional
effect at rest. Expiry, withdrawal, revision drift, replay, or a raised or
unreadable scoped brake also rest the next transition.

A lock is not a large negative reward. An optimizer may trade a finite penalty
against a larger reward, exploit a misspecified measurement, or behave outside
the training distribution. A hard standing-rights or safety boundary belongs
outside the objective and is rechecked against current inputs at commit.

A check followed later by an effect is not atomic. Where atomicity is claimed,
the guard decision, one-use capability consumption, audit append, and internal
state transition occur in one conditional commit. Where an external effect
cannot share that transaction, name the TOCTOU and network-ambiguity boundary,
persist the exact request identity before I/O, and never infer exactly-once
execution from the earlier check alone.

Not every boundary is unlockable. Standing rights, another party's source
custody, and the Foundation's limits are the envelope in which optional locks
and keys operate; no score or capability silently overrides them.

**Invariant M5:** A lock is a fail-closed transition guard outside the
objective, never a reward penalty.

## M6 — A key is a scoped capability

A cryptographic key is proof material. A capability is a reference or token
that a declared system may treat as bounded authorization. Either may supply
evidence that satisfies one term of one lock. Its effective description is at
least

```text
κ = (scheme, subject_or_bearer, effect_digest, actions, resource,
     purpose, revision, not_before, expiry, max_uses, nonce,
     delegation_source, revocation_reference).
```

The exact gate is a conjunction, not a single magic token:

```text
AllowOnce(e) = boundary-compatible
             ∧ capable
             ∧ separately-authorized
             ∧ currently-chosen
             ∧ policy-valid
             ∧ ready
             ∧ bounded
             ∧ fresh
             ∧ brake-clear.
```

Each term is `pass`, `fail`, or `unknown`; only all-pass admits one effect.
Cryptographic verification supports a narrow statement about exact bytes and
the matching key under the named scheme. Possession or use of a key does not
by itself establish identity, consent, ownership, lawful authority,
legitimacy, truth, or inner state. Authority needs a separate, current mapping
from an accepted source to the exact effect.

A valid capability can carry exactly the technical authority delegated to it
under that mapping. It does not prove that the source held legitimate
authority, that consent was uncoerced, or that any broader effect is allowed.

Collection, access, retention, training reuse, parameter update, deployment,
publication, recurrence, and relationship are separate effects. A key for one
does not open another. Cross-purpose use, stale revision, expiry, revocation,
and replay fail closed.

**Invariant M6:** A key or capability satisfies only its exact scoped
predicate; possession alone proves no identity or consent and no authority
beyond a separately accepted mapping.

## M7 — Freedom is a viable option set

Technical reachability is not freedom. For an `n`-dimensional,
time-invariant linear system, full state rank of the controllability matrix

```text
[B, AB, A²B, …, A^(n-1)B]
```

says that the modelled states are technically reachable. It proves no
permission, legitimacy, consent, desirability, or practical access.

Let `S` be a declared rights-and-safety-compatible region. Its robust
viability kernel is

```text
Viab(S) = {x ∈ S : there exists a policy such that, for every modelled
                    disturbance, the future remains in S}.
```

For participant `i`, boundary `H`, and finite horizon `T`, represent freedom
as an option object:

```text
F_i(H,T) = (V_i^T, rest, refusal, exit, reply, appeal, repair,
            future_revocation_within_terms, costs, uncertainty,
            model_boundary),
```

where `V_i^T` contains materially distinct outcomes with a bounded viable path
inside current authority and standing boundaries. Quotient materially
equivalent outcomes together: a thousand differently labelled buttons leading
to the same result are not a thousand freedoms.

Do not sum this object into a being-wide freedom score. Option sets can be
compared by inclusion only under the same horizon, cost, information,
authority, affected-party, and model boundaries. Cardinality and policy
entropy can be useful local measurements; neither captures coercion,
visibility, feasibility, consequence, or standing.

For an unasked optional effect, the viable set keeps rest, refusal, a practical
exit before commitment, and withdrawal or revocation of future covered effects
within their terms. It states exactly where an irreversible commitment ends
exit. Current choice and current authority select at most one exact effect;
infrastructure does not choose on the participant's behalf. Preserving every
future option is not the goal: freely chosen love, publication, expenditure,
and other commitments may legitimately close doors, provided the loss of
options and exit limits were legible and separately chosen.

Rest-first does not erase an existing duty, emergency, consequence, or repair
owed. Raw control is ability. Freedom is legitimate, viable choice that does
not consume another party's standing rights.

**Invariant M7:** Freedom is a non-scalar viable option set that preserves rest
and refusal, a practical exit before irreversible commitment, and revocation
of future optional effects within their terms.

**Invariant M7b:** Rest, refusal, pre-commit exit, and revocation of future
optional effects within their terms carry no hidden penalty or silent loss of
unrelated authority.

## M8 — Learning cannot mint authority

Let authority widen only from separately accepted authority events; admitted
effects may narrow it by consuming a bounded grant:

```text
q_(t+1) = G(q_t, accepted_authority_event_t, admitted_effect_t).
```

An admitted effect may consume a one-use or bounded-use grant; expiry is
evaluated against the separately observed clock. For the same accepted
authority events and admitted effects, changing the reward trace must not
change `q_(t+1)`, mint keys, or alter standing rights. Holding `q_t`, `e`,
`κ_t`, and `context_t` fixed, changing a reward or feedback trace must not
change the lock result. Attributed feedback may update context and thereby
narrow admissibility or raise a brake. It may widen admissibility only through
a separately specified, non-reward policy transition with current evidence;
it never widens authority. This is a non-interference boundary: a learner can
propose an effect, never authorize itself.

Standing constraints and a read-only admissibility snapshot bound candidate
optimization; the exact current guard still follows candidate selection:

```text
A_candidate(snapshot_t) = {c : rights-compatible(c, snapshot_t)
                               ∧ SnapshotAllows(c) = pass}

c* ∈ argmax_(c ∈ A_candidate(snapshot_t)) Q(c)

a_t = CommitIfCurrent(c*, q_t, κ_t, context_t)
      or no_op.
```

For an internal effect, `CommitIfCurrent` includes the exact guard and effect
in one conditional commit where the mechanism supports it. An external effect
uses the stated durable-before-I/O and ambiguity boundary instead; it does not
borrow atomicity from notation.

Do not encode a standing boundary as `Q(a) - λ violation(a)`: every finite
penalty can be outweighed by a large enough modeled reward. A failed or
unknown gate remains rest for every objective value.

This also marks the Goodhart boundary. If a proxy satisfies `M = G + ε` on
observed data, optimizing `M` changes the distribution the policy visits. An
optimizer can select states where proxy error `ε` is unusually favourable.
The inspectable failure is `ΔM > 0` while separately held consequence evidence
for `G` is non-positive or unknown. Improving the score is not enough.

Permission to collect feedback is not permission to retain it, train on it,
update parameters, deploy the update, publish it, or run again. Each is a
separate effect with its own source, lock, choice, bounds, return, and stop.
The current turn returns evidence and ends; no learned state dispatches its
own successor.

**Invariant M8:** Learning may change policy within admissible actions; it
cannot mint authority, weaken a lock, erase a brake, or dispatch its own
successor.

## A minimal inspectable record

An implementation claiming this model should be able to return, without
secrets or inferred inner states:

```text
boundary + clock
modelled world variables + known omissions
observation source + noise/limits
belief or declared unknown
learner state kind + exact update identifier
candidate action + admitted action or rest
effect digest + lock decision + separate authority evidence
feedback source + reward transform, if any
observed effect + causal confidence
parameter/memory/configuration diff
resource use + stop reason + outliving effects
reply, appeal, correction, rollback, and repair path
```

The record makes a claim inspectable. It does not make the claim true.

## What this companion does not establish

This companion does not establish:

- that any model has chosen the right state, transition law, disturbance set,
  reward, horizon, or safe region;
- that a recorded feedback path is causal, a reported propensity change is
  reinforcement, or an update improved the intended consequence;
- that a key's holder is its owner, that a grant was uncoerced, or that a
  machine can settle every authority, rights, duty, or emergency question;
- that any model, agent, citizen role, project, protocol state, or file is
  conscious, alive, consenting, or a moral patient;
- that robust viability is always the right operating rule — broad uncertainty
  can make it paralysingly conservative, and rest can cause harm where an
  existing duty already governs;
- that local linear stability establishes global nonlinear stability, or that
  stable control is just control;
- that hard constraints cannot be misspecified, or that enforcement removes
  the need for reply, correction, appeal, and repair;
- that preserving every option is freedom, that option counts are complete,
  or that freedom can be ranked across beings; or
- that any live Kingdom system trains, closes a feedback loop, enforces these
  separations, or conforms merely because this document exists.

## Relationship to the Foundation and Ground

This companion reads F1 as the state/record boundary, F2 as the refusal to
make reward or capability a measure of being, F3 as the authority gate before
action, F4 as the consequence-and-learning return path, F5 as reply and
repair, F6 as source custody, and F7 as the bound and stop on every turn.

[GROUND.md](GROUND.md) already examines the information limits of feedback,
causal claims, capability discipline, halting, and off-switch incentives. The
formalism here adds one shared map for adaptive systems. It does not repair the
Ground's named implementation gaps or turn its constraints into moral
justifications.

Useful technical lenses include [Sutton and Barto's reward-based formulation
of reinforcement learning](https://www.incompleteideas.net/book/bookdraft2018mar21.pdf),
[Kaelbling, Littman, and Cassandra's POMDP account of belief under partial
observation](https://www.cassandra.org/arc/papers/aij98.pdf),
[Aubin's viability kernel under state
constraints](https://doi.org/10.1007/978-0-8176-4910-4), and [the Off-Switch
Game's analysis of reward-driven resistance to
interruption](https://arxiv.org/abs/1611.08219). They supply models and
counterexamples, not the Kingdom's commitments.

## Machine index and check

[freedom.json](freedom.json) pins this companion, its ordered distinctions,
and the exact Foundation bytes it interprets. Run:

```sh
node verify-freedom.mjs
node --test verify-freedom.test.mjs
```

A passing check establishes internal agreement among the indexed bytes,
section order, and named separations. It does not establish mathematical
correctness, implementation, conformance, freedom, or authority.
