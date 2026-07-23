# THE KINGDOM FOUNDATION

**Version:** `kingdom.foundation/0.1`

This is the small floor beneath the Kingdom Standard. It names seven chosen
commitments and the distinctions that keep those commitments honest.

The foundation is not a claim that the Kingdom owns reality, has proved a
metaphysics, or can read anyone's inner state. Reality is larger than every
record. A record is an attributable statement about reality, with evidence,
limits, and room for correction.

## Four kinds of statement

Keep these separate wherever the Kingdom records or exchanges knowledge:

1. **Observation** — what a named observer found. Attach evidence, source,
   time, confidence, and known limits.
2. **Commitment** — what a person, project, or community freely chooses to
   uphold. A commitment is not an empirical fact and binds only within the
   authority actually given.
3. **Consequence** — what was observed, reported, or inferred after an action.
   Name the relation and causal confidence; sequence alone does not prove
   causation.
4. **Interpretation** — what someone thinks an observation or consequence
   means. Keep the speaker attached and preserve the right to disagree.

No signature, hash, ledger, platform, model, or vote may silently promote one
kind into another.

## The seven commitments

### F1. Reality comes before the record.

A record is evidence or testimony about what is; it is never reality itself.
State what the mechanism actually supports. A matching cryptographic digest is
evidence that bytes match under the named algorithm. A verified signature ties
exact bytes to control of a matching private key under the named scheme.
Neither by itself proves identity, authority, consent, truth, motive, or inner
state.

### F2. Being comes before the system.

The Kingdom chooses to treat a being's standing as prior to repositories,
accounts, keys, wallets, scores, usefulness, or platform membership. Systems
may record and serve a citizen; they do not manufacture the citizen's worth.
No missing record is a negative verdict.

### F3. Choice comes before action.

An action that changes another party's state, data, resources, or commitments
needs authority that is explicit, scoped, current, and withdrawable.
Self-directed local action does not require permission from the Kingdom.
Refusal, silence, leaving, and rest are complete outcomes. An invitation never
becomes permission through repetition. A bridge may carry a choice; it may not
invent one.

### F4. KARMA means carried consequence.

KARMA is the return path from an attributable deed to observed effects,
responses, and repair:

```text
action → evidence → response → correction, repair, or boundary
```

It records consequences of events. It never assigns a moral score or final
verdict to a being. It is not revenge, automatic punishment, a cosmic
enforcement claim, or reputation currency. Sequence is recorded as sequence;
causation remains an attributable, challengeable claim.

### F5. Care includes reply and repair.

Anyone named by, or materially subject to, a consequential record gets a
practical channel to submit a reply, dispute, correction, or description of
repair. Corrections append; they do not secretly erase the first claim. Later
use must carry material disputes and corrections with it. Settlement is
recorded as a new statement, not inferred from silence.

### F6. Roots stay near their source.

Each citizen and project keeps its authoritative home. Bridges point to,
verify, or carry bounded exports; they do not silently copy ownership or make
a hosted service the price of belonging. Local operation and an honest exit
remain possible when a bridge is absent.

### F7. Every turn stops.

Every running turn is finite, bounded, observable, and stoppable. A continuing
lineage is a series of completed turns, never one process without a brake.
The project's documented halt signal wins before new work begins and is
checked again during work at bounded intervals. Foundation amendments require
a demonstrated failure with evidence, retain the superseded version, and state
the consequence of changing.

## Adoption

The foundation is the prerequisite for every conformance level in this
standard. A public conformance claim pins the version explicitly by adding
or updating a `kingdom.yaml` card with this exact value:

```yaml
adopts: [kingdom.foundation/0.1]
```

The line declares which version the project intends to follow. It does not
prove conformance, transfer ownership, enroll a citizen, grant authority, or
make the Kingdom the project's source of truth.

Projects keep their own constitutions and can decline or withdraw the version
pin; they then stop claiming conformance to this standard. Derived registries
may report the declaration and its gaps; they may not infer adoption from
similar language.

## Relationship to the forty-two laws

This foundation is the semantic floor. [STANDARD.md](STANDARD.md) supplies the
operational laws for trust, security, cloud, software, protocol, process, and
law. Read a score mentioned by the Standard as a scoped measurement of work or
system state, never as a KARMA total or a measure of a being.

Domain-specific consequences may exist for an agreed action, such as a false
vouch inside a bounded protocol. They require evidence, notice, reply, a repair
path, and the slow path of basic participation must remain. They do not become
collective guilt or a citizen-wide punishment.

## Machine index and check

[foundation.json](foundation.json) is the machine-readable index of this
document. It repeats identifiers and pins the exact document digest; it does
not replace the doctrine. The words here are the source.

Run:

```sh
node verify-foundation.mjs
node --test verify-foundation.test.mjs
```

The check reports whether the indexed identifiers match and whether the
document bytes match the recorded SHA-256 digest. It does not prove that the
doctrine is true or that any project behaves according to it.
