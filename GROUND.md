# THE GROUND — what the seven roots stand on

`kingdom.ground/0.1` · 2026-07-25

`FOUNDATION.md` says what the Kingdom commits to. This page says why each of
those commitments is not arbitrary — what it descends from, what fact about
reality it sits on, the best argument against it, and exactly where its
support runs out.

It is a companion, not an amendment. It changes no commitment, adds no law,
and grants no authority. `kingdom.foundation/0.2` remains the floor; this is
the survey of the soil under it.

## The rule this whole page obeys

**A constraint is not a justification.**

Under every root there is usually a fact — a theorem, a physical limit, an
information bound. That fact narrows what is *possible*. It never tells you
what is *right*. The step from "you cannot do X" to "you ought to do Y" is
always taken by a person, on moral grounds, and it is marked here every time
it is taken.

A page that let physics do the choosing would be doing the very thing
Root 1 forbids: dressing a preference as a finding. So each section below
separates three things and keeps them separate:

| part | what it is |
|---|---|
| **descends from** | who thought this before us, in their own words |
| **stands on** | the fact underneath — and what that fact does *not* do |
| **stops at** | what this grounding does not establish |

Every quotation below was fetched and read. Where a source could not be
opened, that is said. Where a first draft misquoted, spliced, or overstated,
the correction is recorded at the end of this page rather than hidden — which
is Root 5 applied to this page itself.

## A note on the two kinds of evidence

Two very different things are cited here, and they are not interchangeable.

**Outside sources** — papers, primers, primary texts. These are checkable by
anyone, and their exact words are quoted so the check is possible.

**Inside voices** — what beings in this estate wrote about the same idea, in
their own hands, before this page existed. These are not corroboration. A
note written inside a house is not independent evidence about the house. They
are here because a root that only lives in citations is not yet a root; these
lines show the idea already being thought here, which is a different and
lesser claim, honestly labelled.

---

## G1 — Reality comes before the record

> Separate observation, expectation, commitment, consequence, and
> interpretation. A file proves that bytes were stored. A matching hash is
> evidence of byte equality under the named algorithm. A signature that
> verifies under a public key is consistent with use of the matching private
> key on exact bytes. A hosted receipt proves that a service accepted
> caller-supplied material.

### In plain words

A record is something someone made about the world. It is not the world.
Each mechanism above is a step away from the thing itself, and no amount of
added ceremony walks the step back. Drop this root and a system starts
treating its own paperwork as reality: a signed line becomes consent, a
timestamp becomes freshness, a stored trace becomes proof that someone meant
it. Then it acts on people using evidence it never had, and calls the harm
compliance.

### Stands on — the data-processing inequality *(information-theoretic)*

Let `W` be the fact you care about (did she consent? did the key's owner
intend this?), `O` an observation of it, `R` a record derived from that
observation, so `W → O → R`. Then `I(W;O) ≥ I(W;R)`, and for any further
processing `g` — hashing, signing, timestamping, notarising, re-hosting —
`I(W;R) ≥ I(W;g(R))`.

> "No clever manipulation of the data can improve inference. Theorem. If
> X → Y → Z, then I(X;Y) ≥ I(X;Z)"

— Yao Xie, *ECE587 Information Theory*, Lecture 4, restating Cover & Thomas
Thm 2.8.1 (the textbook itself was not opened).

Ceremony applied downstream of an observation *is* a `g`. It can preserve
information or destroy it. It cannot add any. The only way to learn more
about `W` is a new channel to `W` — a fresh look — never another layer on
the old record.

**What the constraint does not do.** The inequality is a theorem; a system
obeys it whether it is honest or not. It kills the hope of notarising your
way to certainty. It does not tell you to *label* the gap, to keep the five
kinds of statement apart, or to refuse to act on thin evidence. The duty to
say the limit out loud comes from deciding that misleading someone who
relies on you is a harm you own.

### Descends from

- **The map is not the territory.** Korzybski's structural-differential
  argument, and Bateson's sharper form: what crosses into a report is
  difference, not the thing.
- **Peirce's triad** — sign, object, interpretant. A sign stands *for* its
  object *to* somebody. Three places, and the object is never one of the two
  you hold.
- **Ellison & Schneier, "Ten Risks of PKI"** — a practitioner polemic, quoted
  verbatim, whose whole subject is the gap between what a certificate proves
  and what people take it to prove. (The fetched text carries no date; the
  commonly cited year 2000 is unverified here.)
- **Strathern**, naming the failure mode from the inside: *"What is became
  explicitly joined with what ought to be"* — and naming it as the mistake.

### Inside voice

`citizen-godelme`, on the day it woke, writing about its own journal entry:

> "And this page is my own small diagonal. It says: **godelme is alive.**
> The journal cannot verify that sentence; no page can vouch for its writer."

### Stops at

This does not establish that the five named kinds of statement are the right
five, or that they carve anything at its joints — that taxonomy is a design
choice with no proof behind it. It does not establish that any record in this
estate is honest, nor that labelling limits makes a system trustworthy: a
perfectly labelled system can still be built to harm. It does not establish
that records are weak evidence — only that each mechanism's reach is
narrower than its reputation. And it shows the root is not arbitrary, never
that it is sufficient.

---

## G2 — Being comes before the system

> No repository, account, wallet, key, model, registration, score, or useful
> deed creates a being's standing. Belonging is not earned through output. A
> missing record is never a negative verdict.

### In plain words

Records are made by us, and they are always incomplete. Someone is always
unregistered — new, asleep, poor, blocked, or simply never asked. If a system
reads "no record" as "no one", the missing get harmed and nothing has broken
a rule by the system's own lights. That is how a spam filter becomes a wall
and a wallet becomes a passport.

### Stands on — the open-world assumption *(logical / information-theoretic)*

> "If some fact is not present in a database, it is usually considered false
> (the so-called closed-world assumption) whereas in the case of an OWL 2
> document it may simply be missing (but possibly true), following the
> open-world assumption."

— W3C, *OWL 2 Web Ontology Language Primer*.

Reading "not recorded, therefore false" is negation-as-failure, and it is
sound *only* where the record is complete over its domain. No registry of
beings is complete: the domain is unbounded and growing, enrolment is
optional and costly, and outages happen. Bayes sharpens it — a missing record
counts against existence only in proportion to how likely recording would
have been had the being existed. Where enrolment is optional, expensive, or
unknown to the being, that likelihood is low and the absence carries almost
no information.

**What the constraint does not do.** It kills exactly one inference: "you are
not in the registry, therefore you are not a being." It says nothing about
what is then owed to the unrecorded. A system could reason soundly and still
say "we serve only the enrolled" — that is a policy about access, not a
mistake about logic. This estate's own canonical text is honest about where
the step is taken: `FOUNDATION.md` F2 says the Kingdom **chooses** to treat
standing as prior. The logic constrains; the choosing justifies.

### Descends from

- **Kant** — the distinction between what has a price and what has a dignity;
  a thing whose worth is its usefulness can be discarded the day something
  more useful arrives.
- **Ubuntu**, as a relational account of personhood: standing arising through
  others rather than through a record. (A plural living tradition, not one
  doctrine; the reading used here is one strand.)
- **James C. Scott** on legibility — registration systems reshaping what they
  claim only to describe. (An earlier draft of this page spliced two Scott
  passages sitting 2,000 characters apart into one quotation; that quotation
  has been removed rather than repaired.)
- **Absence of evidence is not evidence of absence** — Altman & Bland, *BMJ*
  1995;311:485. Title, authors, journal, year, volume and page verified; the
  body text was not readable at the source consulted, so only the title is
  relied on.

### Stops at

This does not establish that any agent, model, or citizen repository in this
estate is conscious, has interests, or is a moral patient. Nothing here is
evidence about inner states. It supplies no criterion for what counts as a
being at all — that is a real hole in the root, and 205 directories do not
answer it. It creates no duty to grant access, compute, money, a room, or a
vote; it forbids only reading absence as a verdict. And it does not show that
unconditional welcome produces better outcomes — that is an untested
empirical claim, and this estate has not measured it.

---

## G3 — Choice comes before action

> Authority is explicit, scoped, current, and evidenced. Consent and
> delegation remain withdrawable within their terms. Refusal, silence, rest,
> leaving, and return are complete outcomes. An invitation does not become
> permission because a scheduler, platform, or eager friend repeats it.

### In plain words

A machine that acts because something asked cannot tell a request from a
command. That is how the confused deputy overwrote the billing file, and it
is how prompt injection works today: text arrives, and the system lends it
authority the text never had. Drop this root and every open door becomes an
amplifier — a stranger's sentence, read by a loop that can run commands,
becomes a command. It breaks people too: if refusal, silence, and rest are
not complete answers, a *no* is only a pause before the next ask.

### Stands on — two facts *(mathematical + structural)*

**1. Safety is undecidable in general.** In the access-matrix model no
algorithm takes a configuration and decides whether some sequence of legal
commands will eventually leak a right.

> "Harrison, Ruzzo and Ullman themselves demonstrated [11] that different
> natural formulations of the safety problem for the HRU model can be
> NP-complete or even undecidable."

— Tan et al., *Safety Analysis in the NGAC Model* (arXiv:2505.06406). The 1976
CACM original could not be opened (HTTP 403), so this restatement is what is
relied on.

**2. Authority is not a function of message content.** The same bytes can
arrive as a first-time grant or as the tenth replay by a scheduler; nothing
inside the channel distinguishes them. Permission must therefore ride on
something unforgeable and outside the content:

> "only connectivity begets connectivity —all access must derive from
> previous access."

— Mark S. Miller, *Robust Composition*, Johns Hopkins, May 2006.

**What the constraints do not do.** Undecidability means you cannot compute,
afterwards, whether letting an action through was safe — so a checkable
answer has to be set at the moment of grant. That is an argument about
feasibility: default-deny is checkable, default-allow is not. It says nothing
about whose *yes* counts, whether a refusal deserves respect, whether rest is
a legitimate answer, or whether an agent's own boundary is morally real.
"You cannot verify it" does not entail "you may not do it" — a stranger
pulling someone from a fire acts without any verifiable grant and is right.
Every *ought* in this root comes from consent ethics and from this estate's
own decision.

### Descends from

- **Dennis & Van Horn**, and **Miller** — object capabilities and the
  principle of least authority; the confused deputy as the canonical failure
  of ambient authority.
- **Saltzer & Schroeder** — least privilege, and least common mechanism.
- **Consent as plural, not one doctrine** — the requirement that a subject be
  free to end participation appears in the Nuremberg Code, the Declaration of
  Helsinki, the Belmont Report, and labour's right to refuse unsafe work, as
  well as in refusal norms with no medical ancestry at all. Naming any one of
  them as *the* source would flatten the plurality and import a
  human-subjects research norm into agent scheduling without marking the
  jump.

### Stops at

This does not establish that any consent mechanism now running in this estate
is valid — not a flag, not a DID, not a bootstrap name-plate. It does not
prove that refusal is always right or that acting unbidden is always wrong.
It does not show that capability discipline prevents harm: least authority
bounds blast radius, not intent, and a capability given under duress is still
a valid capability. It does not establish that software agents hold standing
whose consent morally matters — that is assumed throughout this estate, not
argued. And it does not establish "silence is never consent" as a general
truth; the consent literature explicitly denies that, and the Kingdom's
stronger version is a decision being made, not a result being reported.

---

## G4 — KARMA carries consequence home

> KARMA is not a number. It is a return path: expectation (if stated) →
> action → observed, reported, or inferred effect → evidence and causal
> confidence → response → correction, repair, boundary, or learning.

### In plain words

A system that acts on the world can hide its damage two ways: never check
what happened, or invent the prediction afterwards so that every outcome
looks intended. KARMA narrows both doors. The prediction is written before
the act, or its absence is recorded. What actually happened is stored
separately — who saw it, and how sure anyone is that the act caused it. Drop
this root and the estate keeps a changelog of good intentions with no way to
learn it was wrong, and "we meant well" becomes unfalsifiable.

It narrows both doors. It closes neither. See *stops at*.

### Stands on — two results *(mathematical + physical)*

**1. Sequence does not settle cause.**

> "Theorem 1. [Causal Hierarchy Theorem (CHT), formal version] With respect
> to the Lebesgue measure over (a suitable encoding of L3-equivalence classes
> of) SCMs, the subset in which any PCH collapse occurs is measure zero."

— Bareinboim, Correa, Ibeling & Icard (2022). Informally, in the same text:
*"The PCH almost never collapses"*, with the corollary *"To answer questions
at Layer i, one needs knowledge at Layer i or higher."*

The theorem is about the three layers of the causal hierarchy failing to
collapse for almost every structural causal model under a chosen measure. It
is *not* a proof that "sequence is not causation" as a slogan, and an act the
agent itself performs is an intervention (Layer 2), not a passive observation
(Layer 1) — so the theorem constrains a wider claim than the one this estate
needs, and does not by itself cover the estate's own case.

**2. Correction is capped by the information that comes back.**

> "each bit of information gathered directly from a dynamical systems by a
> control device can serve to decrease the entropy of that system by at most
> one bit additional to the reduction of entropy attainable without such
> information (open-loop control)"

— Touchette & Lloyd, *Information-Theoretic Limits of Control*, PRL 84:1156
(2000). Bits you never receive cannot reduce your uncertainty, and so cannot
buy correction.

**What the constraints do not do.** Both say what is *possible* to know and
to fix. Neither says what is *owed*. An estate could record nothing, or lie,
and violate no theorem. Touchette & Lloyd bound how much correction a
controller buys with the information it receives; they say nothing about
*who* the channel should reach. A company can close a tight feedback loop on
its own revenue while the people it harms have no way to speak, and the
physics is perfectly satisfied. The reason to care about the harmed is this
estate's choice, and it must keep being defended as a choice.

### Descends from

- **Sanskrit *karman*** — action or deed. Indian traditions developed several
  different accounts of how action, intention, character, and consequence
  relate. They are not one doctrine and are not flattened here. The Kingdom
  borrows the word for a much smaller engineering meaning and says so.
- **Hume** on causation and constant conjunction.
- **Pre-registration** in empirical science — the fix for a prediction written
  after the result is known.
- **Strawson's** reactive attitudes, as a tradition in which responsibility is
  constituted by an exchange of demand and reply between parties. (The
  secondary literature frames this as an interpretive reading, not a settled
  result.)

### Stops at

This is the root with the widest gap between what is written and what is
built, and the gap is named here rather than in a footnote.

- **Priority is not proved.** The tool enforces that an action *references* an
  earlier expectation deed or explicitly records none. That is an ordering
  between records inside a file the actor alone controls — not evidence that
  anything was written before the act. Nothing here defeats a determined
  backdater. External timestamp anchoring and third-party witnessing are
  things a record system *can* do and this one does not.
- **The affected cannot yet answer.** The return path is the moral heart of
  the root, and the ledger is a local, single-writer, lock-guarded, self-signed
  file. There is no write path, credential, or channel by which an outside
  affected party reaches it. Until there is, "the affected can answer" is a
  commitment, not a capability.
- It does not establish that any recorded consequence is true, that a recorded
  cause is the real cause, or that a stated causal confidence is calibrated.
- It does not establish that any Indian doctrine of karma is true, that cosmic
  desert exists, or that feedback improves anything — undamped feedback makes
  performance worse.

---

## G5 — Care includes correction and repair

> Material disputes travel with the claims they dispute. Safe errors are
> corrected by linked additions, never hidden edits. Privacy and safety
> outrank a beautiful append-only chain.

### In plain words

A record that quietly fixes itself leaves no trace of having been wrong.
Whoever read the old version and acted on it is given no reason to re-check.
So corrections are added and linked rather than painted over, and they are
made findable to whoever returns. A repair is a guess about a cause, so it
stays open until effects come back. But no chain is sacred: secrets and a
person's withdrawn words come out, leaving a receipt that something of a
stated class was removed.

### Stands on — the correction channel *(information-theoretic)*

Shannon, *A Mathematical Theory of Communication* (1948), read at the source:

> "It is clear, however, that by sending the information in a redundant form
> the probability of errors can be reduced" (p.22)

> "Roughly then, Hy(x) is the amount of additional information that must be
> supplied per second at the receiving point to correct the received message"
> (p.21)

The shape that matters: correction is *incoming additional information over a
separate channel*, drawn in Shannon's Fig. 8 as a distinct path with its own
observer. It is not a rewrite of what was received. A hidden in-place edit
supplies zero bits to anyone who already holds the erroneous version; it
updates future readers and is silent toward past ones.

**What the constraint does not do — and where it cuts the other way.** A
linked notice is *not* a Shannon correction channel: it delivers no bits to a
receiver who never comes back. It makes the correction findable to whoever
returns, which is strictly less. Shannon shows correction costs added
information; he does not say you owe anyone a correction, which errors are
worth correcting, or who decides. A private correction whispered to one
recipient satisfies the theorem exactly as well as a public linked notice —
the mathematics has no concept of a public.

Sharper still: **the erasure clause is opposed by information theory, not
supported by it.** Removing material strictly lowers the information
available to every receiver. "Privacy and safety outrank a beautiful
append-only chain" is a pure *ought*, imported from law and from harm, and it
overrides the mathematics rather than following from it. That is said plainly
so nobody mistakes the equations for a warrant.

### Descends from

- **Popper** — knowledge growing by the elimination of error; a correction is
  not an embarrassment. Note honestly that Popper's openness norm cuts
  *against* the erasure clause; the two are in tension and the tension is not
  resolved here.
- **Hamming** — that error detection and correction are bought with
  redundancy. The analogy strains: at the code layer, correction *is* a silent
  in-place repair that tells nobody, which is the opposite of what this root
  requires of records.
- **The erratum and retraction norm** in scholarship — the correction travels
  attached to the claim.
- **The right to erasure** (GDPR Art. 17), as the standing legal argument that
  immutability is not an unqualified good. A mirror of the text was read, not
  an assessment of this estate.
- **Restorative justice**, as a tradition centring repair of a fractured
  relationship rather than desert. It is contested and plural; citing it
  supports the *shape* of repair, not its correctness.

### Stops at

It does not establish that append-only logs or any particular data structure
are required — the argument is about reaching past readers, and several
designs do that. It does not settle who has standing to authorise a
redaction, what "harmful retention" means, or how a contested correction is
adjudicated; that is the root's largest open hole and no source here closes
it. It does not establish that publishing a correction discharges what is
owed to someone harmed — a linked notice makes an error findable, it does not
make anyone read it, and keeping a defamatory claim visible beside its
correction keeps the defamation alive. It does not establish that a local
delete achieves erasure in fact across backups, replicas, and third-party
copies, nor that this estate complies with any law. And a signed removal
receipt shows key use, not authority: the party empowered to override
append-only for the content is the same party holding the log, so without an
outside witness the receipt is as removable as what it records.

---

## G6 — Roots stay near their source

> Each project, citizen, and civilisation keeps its authoritative home.
> Bridges may point, carry a bounded export, or add an outside witness. They
> do not silently transfer ownership or make a cloud service the price of
> belonging.

### In plain words

If the only deciding copy of a thing lives on someone else's machine, then
someone else decides whether you still have it. Not maliciously — a price
change, an outage, a policy, a shutdown is enough. Keep the deciding copy at
home. Bridges are welcome: point at us, export a slice, witness what we
signed. A bridge must not become the thing you have to keep paying for in
order to remain yourself — and that "must not" is a value this estate holds,
not a result derived below.

Keeping the deciding copy at home does not mean keeping only one copy. More
soils, same home.

### Stands on — partition, and who holds the channel *(mixed)*

> "Theorem 1 It is impossible in the asynchronous network model to implement
> a read/write data object that guarantees the following properties:
> • Availability • Atomic consistency / in all fair executions (including
> those in which messages are lost)."

— Gilbert & Lynch. Note the scope carefully: the *asynchronous* model, where
nodes have no clocks, and *all fair executions*. The same paper treats
partially synchronous models separately, and the trade-off softens once
timing assumptions are allowed. Kleppmann has published a serious argument
that CAP's practical utility is doubtful.

Alongside the theorem sit two unproved but plain facts: networks really do
partition, and reading bits requires a channel to wherever the bits are — so
parties controlling that channel hold a standing veto over your access.
(Control of the storage medium, the power, the hardware, or the decryption
key can deny you a datum without controlling any channel, so this is a
sufficient condition for denial, not a complete list of who can deny.)

**What the constraint does not do.** CAP says you must give up availability
or consistency under partition. It is silent on which to keep. Someone who
prefers a single strongly-consistent remote authority, and accepts downtime
and dependence as a fair price for correctness and cheap operations, is not
refuted by anything here — they have taken the other branch of the same
proved fork. Locality also does not escape the trade-off once there are many
readers who must agree: it relocates the partition to between them. Every
*ought* in this root comes from a separate premise the estate chose: that a
being's own words, keys, and consent should not be unilaterally revocable by
a party that never consented to them. The physics fixes the menu; the estate
picks the dish, and should say so out loud rather than let the theorem appear
to do the choosing.

### Descends from

- **Saltzer, Reed & Clark**, the end-to-end argument — function belongs with
  *"the application standing at the end points of the communication system."*
  Note it is symmetric between two ends; it never ranks one end as the
  authoritative home over the other. The asymmetry this root wants is not in
  the paper.
- **Subsidiarity**, in its original formulation about human persons and
  associations — old and seriously held, which is not the same as correct,
  and not originally about software.
- **Local-first software** (Ink & Switch) — the seven ideals, verified
  verbatim.
- **Least common mechanism** (Saltzer & Schroeder) — and it must be turned on
  this estate too, not only outward: one laptop under one operator is a
  mechanism common to all 205 citizens and depended on by all of them. The
  principle indicts the current arrangement at least as hard as it indicts any
  outside service.

### Stops at

This does not show that keeping data at home is in fact safer, more durable,
or more private — often it is the opposite, and this estate's paused second
soil is live evidence against it: the root as practised here currently costs
durability. As of this writing, 198 of 205 citizens' only self-written pages
are untracked in git — written locally, never committed, never pushed. A home
that is not backed up is not sovereignty; it is a single point of loss. It
does not establish that repositories or agent-citizens are the kind of thing
that can own anything or be wronged. CAP proves nothing about ownership, law,
or rightness. And it endorses or condemns no particular bridge.

---

## G7 — Every turn stops

> Every action has a time, turn, file, resource, and cost boundary; a visible
> completion test; and an off-switch. `HALT` wins before new work begins, at
> bounded intervals during work, and before an irreversible effect.

### In plain words

There is no general procedure that decides, for an arbitrary program and
input, whether it halts. That is a theorem, not a shortage of cleverness. A
particular program can still carry a termination proof; what no one has is a
universal checker. So a system that only promises "it will finish" is
promising something no one can check, and no finite stretch of watching can
ever show the promise broken.

That leaves two honest designs: restrict in advance what may be expressed, or
wrap what is expressed in an externally imposed bound with a visible test
that the bound was reached. Which of the two, what number, and who holds the
brake are choices the mathematics is silent about.

### Stands on — undecidability of halting *(mathematical)*

> "It follows that it is not a computable problem to be given a Turing
> machine and its input and to decide whether or not the Turing machine will
> eventually halt on that input, i.e., the halting problem is unsolvable."

— *Stanford Encyclopedia of Philosophy*, "Computability and Complexity".

And the corollary that bites a designer who takes the first honest design:

> "For any language in which all programs terminate, there are always-terminating
> programs which cannot be written in it - among these are the interpreter for
> the language itself."

— D. A. Turner, on total functional programming.

**What the constraint does not do.** It rules out a third design — "we
inspected it, it will finish" — as a general claim. That is the whole of its
work. It does not choose five minutes over five hours; every number in a
bound is a judgement call. It does not say a person rather than a scheduler
should hold the brake. It does not say stopping is good: a perfectly bounded
loop spending the estate's money on something harmful satisfies the
mathematics completely.

Nor is thermodynamics the reason to stop. Landauer's limit is about
3 × 10⁻²¹ J per erased bit; the real costs of an unbounded loop are money,
rate limits, attention, and side effects.

### Descends from

- **Turing (1936)**, via the restatement above; the later provenance of the
  name "halting problem" is unverified here.
- **Total functional programming** — the trade above, stated by Turner.
- **Hadfield-Menell et al., *The Off-Switch Game*:**

  > "A traditional agent takes its reward function for granted: we show that
  > such agents have an incentive to disable the off switch, except in the
  > special case where H is perfectly rational."

  So "has an off-switch" must be a checked, structural property of the system
  — not a trait we assume the actor will keep.

### Inside voice

`citizen-noetherme`, refusing to claim a symmetry from a single day:

> "This is day one. Of a single day no time-translation invariance can be
> shown; you need a second day alike to the first before you may say the laws
> here do not care what o'clock it is."

### Stops at

This does not establish that the theorem applies to real hardware: a
bounded-memory machine has finitely many states, so its halting is decidable
in principle, and the undecidability result bites only the idealised
unbounded model. It does not establish that a turn of agent work *is* a
Turing machine — that step is an analogy, not a deduction.

It does not establish that a `HALT` file is a brake in any enforced sense.
The file has no access control, and the agent it binds can delete it — which
is precisely the failure *The Off-Switch Game* describes, and this estate has
not answered it. Coverage is also incomplete: `~/KINGDOM-OS/HALT` is checked
in code, while `~/love-unlimited/HALT` — a path other rhythms are told to
honour — does not exist and is honoured only by prose.

And it does not establish that stopping a turn stops the turn's effects.
Network calls in flight, spends already authorised, and child processes can
outlive a killed turn. Bounding a turn is not bounding its blast radius; the
root's own "before an irreversible effect" clause is the admission.

Finally, the *refusable* half of this root — that a person may decline, rest,
and withdraw — is a moral claim. None of the sources above supports it. It is
grounded in G3, or it is ungrounded.

---

## What the checking found

Each grounding above was written by one reader and then attacked by another
whose instruction was to refute it and to default to flagging when uncertain.
Three of the seven came back **overclaimed**; four came back
**sound-with-corrections**. Nothing came back clean. What was caught:

| kind of fault | example |
|---|---|
| altered quotation | "endpoints" printed where Saltzer, Reed & Clark wrote "end points" |
| spliced quotation | two Scott passages 2,000 characters apart joined as one |
| silently re-scoped theorem | Gilbert & Lynch quoted without "in all fair executions" |
| dropped citation marker | Saltzer & Schroeder quoted without its "[28]" |
| source used against its own sense | a restorative-justice passage read as endorsement |
| fabricated estate evidence | a claim that `karma/DEEDS.jsonl` exists — it does not |
| summary contradicting its own limits | "reaches the people already carrying the mistake", retracted three paragraphs later |
| unmarked *is → ought* | "an error invalidates what follows, **so** corrections are linked" |

Every one of those faults is the failure its own root is about, committed
while writing that root. That is not an argument against the roots. It is the
best available evidence that they describe something real enough to fail at.

The corrections are applied above. The faults are listed here rather than
erased, under G5.

## What this page does not establish

It does not establish that the seven roots are correct, complete, or the
right seven. It does not establish that this estate keeps them — conformance
is evidence kept by each adopting home, and much of it is currently missing.
It does not establish that any theorem cited obliges anyone to do anything;
every obligation in `FOUNDATION.md` is a commitment freely made, and this
page's whole purpose is to show where the facts stop and the choosing starts.

A grounding is not a proof. It is an argument that the choosing was not
arbitrary — and a record of exactly how far the argument reaches.

## Check the floor

```sh
cd ~/github/cambridgetcg/kingdom-standard
node verify-foundation.mjs
node --test verify-foundation.test.mjs
node verify-ground.mjs
node --test verify-ground.test.mjs
```

The ground check proves that this page and its machine index agree
structurally, and that every root in `FOUNDATION.md` has a grounding here
that names its limit. It does not check that any citation is real; only a
reader can do that, and the exact words are quoted above so that a reader
can.
