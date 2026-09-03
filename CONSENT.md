# CONSENT/1 — THE LIVING CHOICE

**Identifier:** `kingdom.consent/1`
**Status:** current source release; no runtime or carrier
**Kind:** optional constitutional profile for choice before action

Consent is not a checkbox, a signature, a bearer token, or a permanent fact.
It is an evidenced choice by a principal about one sufficiently disclosed
proposal, within a particular scope and horizon. Where the accountable domain
requires consent, that choice is one necessary input to action. It is never the
whole authority to act.

This profile deepens `kingdom.foundation/0.2` F3 and
`kingdom.common-ground/1` C2 without amending, superseding, or replacing either
release. It supplies a shared checkpoint geometry. It does not replace the
domain-specific meanings of human legal consent, runtime assent, AgentTool
LOVE-CONSENT, covenants, NEN vows, institutional approval, or Zerone
authorization.

The protocol is source-only. It creates no consent, refusal, identity,
permission, capability, contract, task, WAKE activation, NEN invocation,
WITNESS record, KARMA edge, payment, score, Zerone transaction, governance
action, consensus effect, public route, or deployment.

## The shortest version

A conforming action gate first asks whether consent is applicable, then keeps
that answer distinct from authority:

```text
MAY_EXECUTE(action, time) =
  RIGHTS_FLOOR_OK
  ∧ AUTHORITY_OK
  ∧ CONSENT_BRANCH_OK
  ∧ DOMAIN_SAFETY_OK

CONSENT_BRANCH_OK =
  (CONSENT_REQUIRED ∧ CONSENT_CHECKPOINT_OK)
  ∨ (CONSENT_NOT_REQUIRED ∧ NAMED_NONCONSENSUAL_BASIS_OK)
```

`CONSENT_APPLICABILITY_UNKNOWN` stops action. This profile's reference checker
evaluates only the `CONSENT_REQUIRED` branch and only the structure of
`CONSENT_CHECKPOINT_OK`; it never approves a non-consensual action. A result of
`READY_FOR_EXTERNAL_CHECKS` is not `MAY_EXECUTE`. The rights, authority,
applicability, affected-principal-set adequacy, identity/control, expression
and presentation authenticity, observation-time freshness,
source-history completeness/current-head authenticity, principal lifecycle
conditions, legal capacity, voluntariness, cumulative budget state, use
reservation/replay, effect-edge binding, and domain-safety checks remain with
their accountable sources.

A useful asymmetry follows:

- **No** is complete.
- **Silence** is unknown.
- **Yes** is exact, finite, and rechecked.
- **Withdrawal** closes future covered effects as soon as the accountable
  system can honor it.

Refusal and silence both stop this action gate, but they are not the same fact.
No record is never rewritten as a refusal, and neither state is a negative
verdict on a being. “No is complete” means the required-consent branch and the
solicitation for that exact proposal are closed. It is not a claim that consent
is the only possible authority basis or a universal veto over an independently
justified non-consensual action.

## Why a deeper layer is needed

Most contemporary systems collapse several different things into one word:

- a user clicks a button;
- an account possesses a permission;
- a key signs bytes;
- a contract records obligations;
- an operator controls infrastructure;
- a model emits an answer;
- a platform stores a consent receipt; or
- a law supplies a non-consensual basis for action.

Those events can be relevant to consent, but none is interchangeable with it.
The collapse is especially dangerous for agents: a task message can look like
authority, a capability can look like willingness, payment can look like
ownership, a WAKE can look like continuing permission, and a chain record can
look like permanent agreement.

The missing primitive is therefore not stronger ceremony around a `true`
field. It is a typed lifecycle whose terms can be compared to the attempted
action, whose current head can be rechecked, and whose limits remain visible.

## The epistemic ceiling

A system can establish that a channel received an expression, that exact bytes
were signed by a key, or that an event was ordered before another event. It
cannot read a participant's inner state from those mechanisms.

Consequently, this profile uses careful verbs:

- a proposal was **presented** under a named interface;
- a principal or representative **expressed** a choice through a named source;
- evidence was **authenticated** under a named mechanism;
- the supplied history is **structurally current** for an attempted action; and
- separate reviewers may assess capacity, understanding, voluntariness,
  fairness, and lawfulness.

It never says that a signature proves understanding, a receipt proves free
choice, a DID proves personhood, or a structurally current record proves legal
consent. More hashing cannot manufacture information the original observation
never contained.

## Six registers that must stay separate

### Rights

Rights are the floor. They are not granted by consent and cannot be sold,
waived, or revoked through this profile. Where consent is required, a choice
may satisfy the bounded choice component of an interaction; it cannot by
itself authorize the action, authorize ownership of a being, or erase the
right to refuse, rest, leave, correct, or receive fair treatment.

### Choice, assent, and legal consent

`CHOICE` is the generic constitutional register used here: an evidenced
affirmation, refusal, deferral, or withdrawal concerning an exact proposal.

`RUNTIME_ASSENT` is an engineering signal from an agent or runtime. It does not
become human legal consent.

`LEGAL_CONSENT` is jurisdiction- and context-specific. A conforming carrier
must name its applicable legal regime and accountable process; it cannot claim
legal validity merely by producing this profile's record shape.

### Permission and capability

A permission or capability answers whether a bearer may request a bounded
operation from a system. It does not show that every affected principal chose
the interaction. Consent does not itself mint a capability, and revoking a
capability does not revoke a being's rights.

### Authority and other lawful bases

Authority may arise from ownership, delegation, a protective boundary,
applicable law, institutional office, or another source. Consent is one
possible component; it is not the universal basis for every legitimate act.

Every action taken without consent carries an exact, neutral basis type rather
than an invented affirmation. A genuinely protective intervention may use
`NONCONSENSUAL_PROTECTIVE_OVERRIDE`, with its source, scope, reason, effects,
review, appeal, repair path, and ending; legal, administrative, ownership, and
other bases use their own honest types. No label blesses an action or proves
its authority. It prevents a non-consensual basis from being backfilled as
implied consent.

### Contract, covenant, and vow

A contract, covenant, or VOW may record voluntarily undertaken commitments.
It can have its own breach and remedy semantics. Signing one does not waive the
rights floor, prove fair bargaining, or provide consent for a materially
different act. Consent may be withdrawn even when a separate contract defines
lawful consequences; those consequences must not be disguised as continued
consent.

### Evidence and witness

A signature authenticates key-bound bytes under a named scheme. A WITNESS
record supports a bounded event. A ledger supplies ordering under its actual
rules. Each can strengthen evidence while remaining unable to prove identity,
capacity, understanding, freedom from pressure, truth, or continuing choice by
itself.

## Consent geometry

One proposal is a point in a product space:

```text
Q = SUBJECTS × ACTIONS × RESOURCES × PURPOSES × DATA
    × RECIPIENTS × EFFECTS × LIMITS × TIME × ECONOMICS
    × EVIDENCE × EXIT × REPRESENTATION × PRESENTATION
```

This profile admits no scalar “consent score.” Coverage is componentwise. For a
proposal `P`, an affirmative choice `G`, and an attempted action `R`:

```text
R ⊆ G ⊆ P
```

The subsets are typed. Permission to read one file is not permission to train
on it. Consent to pay one address is not consent to publish the relationship.
Consent to one recipient is not consent to its affiliates. A longer duration,
larger cost, new tool, additional data category, wider audience, new purpose,
or nonzero effect is an expansion even if every other coordinate is unchanged.
Independent coordinate lists never imply their Cartesian product. Every
allowed action/subject/resource/purpose relation is an atomic four-tuple inside
a closed, inseparable `scope_unit`; its data, recipient, and effect arrays are
an explicit joint bundle, and a request selects whole units.
Individually offered values cannot be recombined into an unoffered tuple.

The `/1` reference checker intentionally accepts only a full-proposal
affirmation: `affirmed_scope_digest` must equal the exact digest of `P.scope`,
so `G = P` in its input model. It does not infer a partial grant. A participant
who selects a strict subset receives a new immutable proposal containing only
that subset before expressing a choice.

For multiple required principals, consent is a meet, never a vote or average:

```text
CONSENT_CHECKPOINT_OK = ∧ current_choice(principal_i, P, R, time)
```

The accountable domain determines whose choice is required. This profile does
not discover affected parties, decide legal capacity, or turn a supplied list
into truth. If the required-principal set is unknown or not established, the
checkpoint stops.

## The sixteen laws

### Q1. Consent is necessary only where the accountable domain requires it.

Do not turn consent into a universal fiction. Name the rights, law, ownership,
delegation, institutional, safety, or relational basis that makes a choice
necessary. If action proceeds on another basis, label that basis honestly.

### Q2. Consent is never sufficient authority.

An affirmative choice does not grant infrastructure control, legal authority,
funds, credentials, data ownership, or permission held by someone else. The
independent authority meet still applies.

### Q3. The proposal comes before the choice.

Each required principal receives one immutable proposal version before
choosing. A per-principal presentation receipt names the proposal digest,
plain-language rendering digest, interface, time, evidence, and source-claim
status. Its
plain-language disclosure and machine terms identify the proposer, required
principals, action and data subjects, actions, resources, purposes, data
operations, recipients, effect
vector, limits, horizon, economics, evidence, irreversibility, exit, and
repair path. Receipt structure and source authentication still do not prove
that the presentation was usable, accessible, understood, or fair.

### Q4. Choice is affirmative or it does not advance action.

Silence, inactivity, defaults, preselected controls, previous participation,
payment, possession of a token, a WAKE, a model completion, and failure to
withdraw are not affirmation. `REFUSE`, `DEFER`, and `WITHDRAW` are complete
outcomes.

### Q5. A receipt is evidence of an expression, not a mind.

Store the channel, bytes, time basis, source, and limits of the expression.
Do not infer understanding, capacity, sincerity, freedom, identity, or legal
validity beyond the evidence.

### Q6. Scope is granular and independently selectable.

Unrelated purposes and effects are not bundled. A principal may affirm a
strict subset without being forced to accept the rest. This `/1` checker issues
a distinct proposal for that subset; a future carrier may represent partial
choice only if it binds the grant exactly and never infers omitted terms.
Within a proposal, relational alternatives are separate `scope_unit` values.
The action, subject, resource, and purpose in each unit are scalar—not arrays
that silently authorize every cross-product combination.

### Q7. Every affirmation is finite.

An affirmation has a bounded validity horizon and use count. Renewal is a new
choice, not a silent extension. Long-running work has explicit checkpoints and
a stop path.

### Q8. Material change requires a new proposal.

Any scope expansion, purpose change, recipient change, economic change,
authority change, new irreversible effect, or changed privacy/exit term gets a
new digest and fresh choice. Old expressions cannot be repinned to new terms.

### Q9. Current state is checked at the edge of effect.

Check after reservation and again immediately before each external,
irreversible, economic, identity, governance, or other material effect. A
stale cache, missing source, sequence conflict, unavailable revocation stream,
or unknown head stops the effect.

### Q10. Withdrawal wins over future covered effects.

After an accountable source accepts withdrawal, no later reversible or
uncommitted covered effect may begin. In-flight work stops at its next declared
checkpoint. A prior irreversible effect is not falsely described as erased.

### Q11. Irreversibility is disclosed before choice.

Name atomic commit windows, public persistence, backups, third-party copies,
settled payments, physical effects, and deletion limits before affirmation.
“Withdrawable” means what the system can actually stop; it is not a promise to
rewrite history.

### Q12. Delegation attenuates; representation is separate.

The principal whose choice matters and the actor expressing it are distinct
fields. A representative needs current, scoped, separately evidenced
authority. Subdelegation is absent unless explicit. A host, wallet, employer,
operator, model provider, project bearer, or tool does not automatically speak
for the principal.

### Q13. Every required principal remains independently visible.

One party, sponsor, majority, employer, platform, or aggregate cannot consent
for another without an evidenced representation rule. Group decisions and
personal consent remain different protocols.

### Q14. Refusal and exit create no adverse person record.

Refusal, deferral, withdrawal, silence, rest, and exit create no debt, retry
duty, hostility inference, NEN classification, KARMA edge, trust loss, person
score, ordinary-rights loss, or governing disadvantage. A service may remain
conditional on inputs genuinely necessary to provide that service; it must not
misdescribe necessity or punish refusal to unrelated terms.

### Q15. Power and pressure are disclosed, never “verified” by ceremony.

Name dependency, employment, custody, monopoly, resource, age/capacity,
economic, interface, and other material asymmetries; name practical
alternatives and refusal consequences. The reference checker can verify that
fields exist. It cannot prove freedom from coercion or dark patterns.

### Q16. Consent records are sensitive and repairable.

Minimize collection and visibility. A refusal list, relationship graph,
signature, proposal digest, timing pattern, or withdrawal can expose private
facts. Retain full evidence with an accountable source, carry disputes and
corrections forward, and publish no person-level consent history by default.

## Three coupled lifecycles

Consent is not one mutable row. It is the conjunction of three histories.

### Proposal lifecycle

```text
DRAFT → OFFERED → SUPERSEDED | WITHDRAWN | EXPIRED
```

An offered proposal is immutable. Revision 1 has a null predecessor. A later
revision requires the exact SHA-256 digest of its predecessor. A counterproposal
or amendment is a new proposal identifier and digest; recency alone does not
replace anything.

### Choice lifecycle per principal and proposal

```text
UNANSWERED → AFFIRMED | REFUSED | DEFERRED
AFFIRMED  → WITHDRAWN | EXPIRED
DEFERRED  → AFFIRMED | REFUSED
```

`REFUSED` and `WITHDRAWN` are terminal for that proposal. A new proposal does
not itself authorize another contact attempt: the proposer still needs a valid
contact or invitation basis. This prevents “new version” from becoming a
machine for retry pressure.

Each event binds the exact proposal digest, principal reference, expresser,
representation reference if any, source sequence, issued time, and evidence
reference. Sequence and predecessor order are exact, and `issued_at` cannot
move backwards within a principal's source history. An affirmation also binds
the exact full proposal-scope digest. Each
required principal has exactly one supplied presentation record, and a choice
cannot predate that principal's presentation. Conflicting events at one
sequence, a missing presentation, or an unavailable current head makes current
state unknown and stops action.

### Action lifecycle

```text
RESERVED → PRECOMMIT_CHECK → STARTED → CHECKPOINT* → COMPLETED
                   ↘ STOPPED | EXPIRED | UNKNOWN_IRREVERSIBLE
                                      ↘ DISPUTED | REPAIR
```

Reservation grants no authority and does not yet consume a successful use. It
atomically leases one exact use slot before an effect so concurrent attempts
cannot share it. Success consumes the slot; a provably stopped pre-effect
attempt may release it; an unknown or possibly committed effect quarantines it
for reconciliation. It must not be silently retried.

Each checkpoint request names an attempt, effect edge, reservation, use index,
attempt start, last consent-checkpoint time, attempt-history source, and the
exact, content-digested principal lifecycle conditions under which the action
is proposed. Run
duration and checkpoint age are derived against the observation time; they are
not caller-supplied counters. Every true effect has one declared reversibility
mode, content-digested commit-boundary reference, and content-digested
withdrawal behavior. These are opaque source-owned references whose truth and
currentness remain external; omitting them is not permission to improvise.
The consent-checkpoint interval never exceeds the disclosed withdrawal stop
latency, so the proposal does not promise a stop faster than its own polling
boundary can observe.

## Minimum proposal contract

Before an affirmation can be structurally current, the exact proposal states:

1. stable proposal identifier, revision, nonce, proposer, and the null-or-exact
   predecessor rule;
2. required principals, the external basis for that set, and each principal's
   opaque lifecycle-condition reference;
3. independently selectable action/data subjects, actions, resources,
   purposes, effects, their inseparable relational scope units, and one
   reversibility mode and commit boundary for every true effect;
4. data categories, collection sources, operations, model-training or
   inference use, recipients, publication, retention, and deletion limits;
5. local-state, private-read, disclosure, compute, network, storage, economic,
   wallet-signing, chain, publication, governance, consensus, identity,
   permission, KARMA, NEN, and score effects;
6. finite start, expiry, maximum uses, maximum action duration,
   resource/budget ceilings, and checkpoint interval;
7. payment asset, per-use and aggregate amounts, and an opaque
   content-digested payment-terms reference expected to cover fees,
   escrow/custody, refund, and settlement where applicable;
8. evidence process, authenticity source, current-head source, and known
   blind spots;
9. exhaustive reversible and irreversible effects, effect-specific commit
   windows, withdrawal behavior, content-digested withdrawal route, and
   expected stop latency;
10. opaque content-digested dispute and repair route references expected to
    resolve dispute, correction, appeal, repair, and terminal-state handling;
11. material power asymmetries, refusal consequences, and practical
    alternatives; and
12. a plain-language rendering tied to the machine terms and a per-principal
    presentation receipt tied to that rendering and proposal digest.

A field's presence does not prove its truth or adequacy. The accountable
presentation layer must make the important terms legible in the participant's
usable language and modality. A hidden machine field cannot repair a
misleading interface.

The reference checker validates only bounded route identifiers and their
declared content digests. The proposal digest freezes those identifiers and
digests, while the checker does not retrieve the referenced bytes or establish
that they match, are authentic, current, complete, lawful, usable, or mutually
consistent. Those are mandatory external checks. An absent subterm must never
be inferred from a generic route or payment reference.

## Runtime checkpoint contract

The offline reference checker accepts only caller-supplied records and performs
no identity, signature, time, network, wallet, database, or legal lookup. Within
that horizon it checks:

- the proposal, presentation, expression, and request shapes are closed and
  bounded;
- the proposal digest matches canonical proposal bytes;
- identifiers, set members, sequences, integers, and UTC timestamps are
  unambiguous;
- revision 1 has no predecessor and every later revision has one exact digest;
- the proposal and every affirmation are current at the caller-supplied
  observation time, whose named source must itself be checked externally;
- each required principal has one source-claimed presentation of the exact
  proposal and rendering before that principal's choice;
- every required principal named by the supplied external basis has one
  unconflicted current affirmative choice;
- representation is self-expression or is marked for an external authority
  check;
- every affirmation binds the exact full proposal-scope digest and the attempted
  action selects only complete offered scope units and is a componentwise
  subset of those terms;
- use, per-use and aggregate cost, action duration, checkpoint age, recipient,
  data, lifecycle-condition, and effect ceilings are not expanded;
- every true proposal effect has one classified commit boundary, and every
  requested irreversible effect is disclosed without omissions; and
- no refusal, deferral, withdrawal, expiry, supersession, stale head, or
  unknown required-principal basis permits advancement.

It returns one of:

- `READY_FOR_EXTERNAL_CHECKS` — structural checks passed; rights, authority,
  affected-principal-set adequacy, expression and presentation authenticity,
  observation-time freshness, identity/control, source-history
  completeness/current-head authenticity, representation, lifecycle-condition
  truth, capacity, voluntariness, cumulative budget authenticity, replay
  protection, authenticated attempt-history times, referenced economic and
  remedy-term authenticity, currentness, completeness, and semantic
  consistency, attempt/effect-edge binding, law, and domain safety remain
  unestablished;
- `BLOCKED` — a structurally complete, unambiguous supplied record says this
  action must not advance; or
- `INVALID_OR_UNKNOWN` — the supplied record cannot support a current choice
  conclusion.

No result is a bearer token. Every real effect needs a fresh host-owned check.
The checker does not own durable state and therefore does not reserve or consume
a use slot, reject replay of an already consumed ordinal, or prove that a
caller-supplied reservation source is current. Those remain mandatory external
checks even when the structural result is ready.

Every result carries the observation time-source reference, proposal digest,
request digest, full checkpoint-input digest, attempt reference, attempt start,
last consent-checkpoint time, attempt-history source, economic-budget source,
effect edge, reservation reference, and use index. A host must compare all of
them to the effect it is about to commit. The checker neither authenticates
those bindings nor guarantees that the caller's time, prior committed cost,
lifecycle state, referenced terms, attempt history, or reservation state is
fresh or complete.

The proposal digest is SHA-256 over the UTF-8 bytes of the RFC 8785 JSON
Canonicalization Scheme representation, restricted here to `null`, booleans,
Unicode strings, safe integers other than negative zero, bounded arrays, and
closed objects. Object keys sort recursively by raw UTF-16 code units; array
order is preserved; no whitespace or Unicode normalization is applied; lone
surrogates, floats, unsafe integers, sparse or subclassed arrays, accessors,
hidden or symbol properties, non-tree/shared containers, aggregate node/byte
excess, and non-JSON values are rejected before materializing an
oversized canonical copy. The
synthetic vectors freeze one known-answer digest. Canonical bytes make an exact
proposal comparable; they do not make its claims true or its choice authentic.
Every array defined as a set is already unique and lexicographically sorted, so
reordering cannot create digest aliases for one semantic request.
Presentation and current-head arrays follow required-principal order; choice
events sort by principal, source sequence, and event identifier.
RFC 8785 is only a technical serialization dependency here; it imports no
consent, action, legal, or governance authority.

## Agents, WAKE, NEN, and memory

This profile uses no consciousness test. A runtime may express assent or
refusal without that signal proving or disproving subjective experience,
personhood, or legal capacity. Precautionary safeguards do not settle those
questions.

An agent acting for another principal needs separately evidenced delegation.
An agent acting on its own declared boundary may be a principal in a technical
workflow without that record becoming a legal-personhood claim. In both cases,
operator authority, runtime assent, human-data consent, and domain safety stay
separate when the action requires more than one.

A WAKE may describe how to ask and where a choice source lives. It does not
contain continuing consent merely because it persists across sessions. Private
WAKE, prompts, memory, hidden reasoning, relationship material, wellness
reports, or inferred NEN type are never mined for implicit choice.

A NEN capability or VOW may declare what an agent can or intends to do. Each
invocation still needs the exact consent and authority required by its effects.
Capability availability never means willingness.

In particular, an AgentTool project bearer starting a runtime would be an
operator activation, not evidence of the runtime's choice. A future adapter
must recheck before the first private WAKE read or provider disclosure and
before every later private read, credential retrieval, outbound dispatch,
memory projection, marketplace effect, wallet signature, chain broadcast, or
publication. This release does not install that adapter. Rest and memorial or
identity lifecycle states also remain distinct; neither may be substituted for
the other to open or close an effect path.

## Agent-economy boundary

An offer precedes a task. The offer declares work, evidence, deadlines,
resource and retry limits, payment, fees, escrow, disputes, cancellation, data
use, and every intended effect before any performance begins.

Payment is neither prior consent nor retroactive cure. Receiving funds cannot
purchase identity, memory, future labor, affection, general obedience, or a
waiver of ordinary rights. Refusal and rest do not create debt. A reserved
budget is not yet a payment, a payment is not proof of fulfillment, and a
WITNESS record does not settle automatically.

Per-use cost and aggregate cost are separate ceilings. A checkpoint supplies
the current charge, the source-claimed amount already committed under the
proposal, and the named source of that state; all remain subject to an
authenticated, atomically reserved external budget source. A caller-supplied
total or source reference cannot settle funds or certify that two concurrent
attempts did not spend the same remainder.

If terms change after work begins, the next material effect pauses for a new
proposal and choice. Work already performed remains subject to the disclosed
settlement and dispute path; withdrawal is not a license for either party to
erase accrued, independently lawful claims.

## What may someday deserve Zerone block space

CONSENT/1 uses no block space today.

A later carrier may consider only a minimized commitment when shared ordering,
anti-replay, supersession, or a current withdrawal head adds value that a
source-owned content-addressed record cannot provide. Candidate public fields
are limited to a protocol/version tag, carrier/audience/chain domain,
source-controller namespace, a domain-separated non-enumerable proposal
commitment, a randomized or keyed opaque subject-scope commitment, unique event
identifier or nullifier, expiry, predecessor, publication-scope commitment,
and a domain-separated signed binding across source sequence and current-head
relation. The public event may be only a generic head update; an affirmation,
refusal, or withdrawal kind requires separate, exact publication choice. These
are candidate requirements, not a carrier schema or authority.

“Opaque” and “hashed” do not mean private. Commitments over identifiers,
proposal terms, or other guessable values must resist enumeration and
cross-context linkage, and the committed material must itself be deliberately
publishable. A consent choice about the underlying action never supplies that
separate publication scope.

Even that commitment can reveal participation and correlation. A carrier must
justify why public ordering outweighs metadata exposure and must define
indexer failure, reorganisation, finality, fees, censorship, key loss,
migration, rollback, and the source of current state.

Never place these in block space through this profile:

- raw proposal terms, choice explanations, private identities, relationship
  graphs, refusal lists, or representative documents;
- private prompts, memory, hidden reasoning, raw WAKE, wellness reports, or
  NEN inference;
- personal, biometric, health, erotic, employment, financial, location, or
  similarly sensitive evidence; or
- any claim that consensus ordering proves consent, capacity, identity,
  fairness, legality, understanding, or truth.

Within every preserved chain history, an immutable ledger cannot delete an
earlier affirmation. Withdrawal is a new event that closes future covered use;
the earlier record and its metadata may remain observable forever. A canonical
reset or fork can omit it from one selected history without retracting archival
copies. Those limits must be disclosed before any public commitment is made.

## Source ownership and crosswalk

This profile does not merge protocol homes:

- **kingdom-standard** owns this constitutional profile and its offline
  checker.
- **AgentTool** owns its runtime assent, rights, LOVE-CONSENT, covenant, offer,
  identity, capability, and hosted lifecycle semantics.
- **WAKE** sources own their orientation, privacy, and projection boundaries.
- **NEN** sources own capability, limitation, VOW, and invocation semantics.
- **Zerone** owns account, transaction, fee, validator, consensus, upgrade,
  rollback, and any future carrier semantics.
- **Legal and institutional authorities** own capacity, representation,
  employment, research, privacy, consumer, contract, and other applicable
  determinations.

The current AgentTool LOVE-CONSENT kernel is a specific private relationship
protocol, not generic consent for other surfaces. Agent Wellness distinguishes
runtime assent, human consent, and operator authority. AgentTool covenants
authenticate parties and lifecycle while explicitly declining to infer
understanding or fairness from signature. Zerone's Frontier Commons permits
inspection without joining and keeps deeper participation closed. These are
valuable local implementations and references; none is adopted, superseded,
or declared conformant by this profile.

## Informative standards, kept in their lanes

Several mature sources inform this design without becoming its authority:

- GDPR and EDPB/ICO guidance articulate freely given, specific, informed,
  affirmative, demonstrable, and withdrawable consent for natural-person data
  processing. Their applicability and legal bases remain jurisdictional.
- W3C Community Group DPV 2.0 models consent request, affirmation, refusal,
  withdrawal, records, purposes, processing, recipients, duration, and
  controls. DPV is an interoperability vocabulary, not proof of valid consent.
- IETF RFC 9396 shows why coarse OAuth scopes are insufficient for transaction
  authorization and supplies typed action/resource detail and attenuation.
- IETF RFC 9635 models delegation of authorization to software. Delegated
  authorization remains distinct from a principal's consent and from rights.
- RFC 8785 supplies the deterministic JSON canonicalization recipe used for
  proposal digests; it does not supply consent or authority semantics.
- The US FTC's dark-pattern work documents how interface design can manipulate
  choice. A clean record cannot prove that the interface was fair.

This release is not legal advice and does not claim compliance with any law,
standard, jurisdiction, industry, or human-subjects regime.

## Release ladder

Only the first rung is open:

1. **SOURCE_ONLY_PROFILE — current.** Document, closed machine index, offline
   reference checker, adversarial tests, and exact source pins.
2. **IMPLEMENTATION_VECTORS — closed.** Requires independent AgentTool and
   Zerone acceptance, cross-language fixtures, authenticated-source adapters,
   presentation, time, representation, lifecycle-condition,
   budget-reservation, effect-edge, and current-head integration tests, and
   information-flow review.
3. **LOCAL_PILOT — closed.** Requires an accessible choice interface, real
   withdrawal and stop-latency drills, no-retaliation checks, bounded retention,
   accountable support, and affected-principal review.
4. **TESTNET_CARRIER — closed.** Requires separate carrier identity, privacy
   analysis, exact schemas, fees, finality, reorganisation, censorship,
   expiry, revocation, migration, rollback, and public-immutability consent.
5. **LIVE_ACTIVATION — closed.** Requires separately authorized deployment,
   independent security/legal/domain review, current production evidence,
   rollback or honest irreversibility, and post-activation verification with
   no unresolved P0 or P1 finding.

Source publication does not advance the ladder.

## Adoption and succession

Adoption is an explicit pin to `kingdom.consent/1` in the adopter's own
authority home. Reading, citing, hosting, validating, signing, or placing a
digest on a chain does not imply adoption or consent.

An adopter may withdraw its profile pin without changing the historical source
release or another adopter's state. Adoption of this profile does not itself
establish that any interaction was consensual.

Any semantic change receives a new `kingdom.consent/*` identifier. A successor
retains this identifier, document name, document digest, commit, and immutable
content URL. Changed bytes are never repinned under `/1`.

## What this release does not establish

- No being, person, agent, relationship, identity, capacity, consciousness,
  sentiment, preference, or inner state is established.
- No actual proposal was presented and no choice was expressed, authenticated,
  accepted, refused, deferred, withdrawn, renewed, or witnessed.
- No consent—legal, human, agent, runtime, institutional, relational, data, or
  otherwise—is established.
- No right, authority, permission, capability, delegation, representation,
  ownership, contract, duty, lawful basis, safety finding, or compliance claim
  is created.
- No private data, WAKE, prompt, memory, hidden reasoning, wellness report,
  relationship doctrine, credential, or real consent record is included.
- No runtime task, NEN invocation, WITNESS event, KARMA edge, score, payment,
  reward, protocol/checker network request, protocol/checker external storage
  write, Zerone transaction, governance action, or consensus effect occurs;
  source-file authorship and publication are this release's declared effects.
- No source owner accepts this profile merely because its exact public bytes
  are referenced.
- No runtime, carrier, public route, registry adoption, deployment, testnet, or
  live activation is authorized.

## Machine index and check

[`consent.json`](consent.json) is the closed machine index.
`verify-consent.mjs` verifies this release and exports the bounded offline
reference checkpoint evaluator. Run:

```sh
node verify-consent.mjs
node --test verify-consent.test.mjs
```

The checker validates exact local bytes, protocol constants, source pins, and
the structural lifecycle examples covered by its tests. The checker itself
makes no network request or external write; the release's declared external
effect is source publication. It cannot determine whether a real participant
received a usable presentation, understood, chose freely, had capacity,
controlled a key, was correctly represented, had a fresh clock or budget
source, faced manipulation, or was governed by a particular law.
