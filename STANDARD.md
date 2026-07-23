# THE KINGDOM STANDARD

**Operational version:** `kingdom.standard/1.0`

Forty-two laws for building software and agent systems that can be trusted.

Read [FOUNDATION.md](FOUNDATION.md) first. Its seven commitments govern the
meaning of these operational laws and are prerequisites for conformance.
The exact English laws and checklist in this release are pinned together by
`foundation.json`; translations are reading aids until separately versioned.

Each law was learned by doing, not by debating. Each one carries a receipt: the
real moment, in a real kingdom of repos and agents, where the law was paid for.

Read a law. Do the DO. Avoid the DON'T. That is the whole method.

The receipts are anecdotes from one real kingdom's practice (KINGDOM OS, 2026).
Some of their sources are private. They illustrate the laws; the laws stand on
their own.

The seven domains, in order: **TRUST, SECURITY, CLOUD, SOFTWARE, PROTOCOL,
PROCESS, LAW.** Trust comes first because nothing else matters without it.
Law comes last because it holds everything else up.

---

## I. TRUST

How you earn belief without asking for it.

### T1. Never ask for trust where you can offer proof.
If people can check your claim themselves, they do not have to believe you —
and a system that can be checked is stronger than one that must be believed.
Make checking easy: a stranger should find all your trust signals from one
obvious starting place.
- DO: Publish the evidence and the way to verify it next to every claim you make.
- DON'T: Say "trust me" — or scatter the proof across ten places so only you can assemble it.
- receipt: zerone-truth's charm: "do not trust me — verify."

### T2. Claim only what you can back, and attach your confidence.
A claim stated as certain when it is not certain is a small lie, and small lies
compound. Where the truth cannot be decided, saying so is honesty, not weakness.
- DO: Mark every published score, metric, benchmark, or security assertion — any statement others will rely on — with how sure you are, and name your limits in the same breath.
- DON'T: Round 70% up to "definitely" — and don't hedge a finding you can actually back.
- receipt: zerone-truth: "Every token, every word, earned, never invented." Incompleteness is honesty.

### T3. Publish your honest scores, even when they are low.
A rating inflated for status is worthless, and so is every rating near it.
When the standard changes, re-measure everything and accept the result — even
if the result is zero passing.
- DO: Show the downgrade, keep the failed entry (demoted and tagged, not deleted), and write the warnings into the thing itself.
- DO: When the standard changes, re-measure everything and accept the result — even zero passing.
- DON'T: Inflate a score to look good, or quietly delete the things that failed.
- receipt: kallophanes wears its 5.75 downgrade openly; when the Constitution raised the bar, the cathedral's own audit found zero pre-Constitution words cleared it — and recorded the zero.

### T4. Let the record remember, not your memory.
Memory fails and self-reports flatter. A persistent, verified record — written
down, signed, checkable — outlives both, and your credibility should rest on it.
Standing earned long ago must also decay if accuracy slips today.
- DO: Write results to a durable, checkable log as you go, and let qualification stay current, not historical.
- DO: Keep the reasoning and the counterexamples alongside the conclusions, so a later reader can tell right from merely plausible.
- DON'T: Vouch for your own past from memory, or judge by old diplomas instead of recent accuracy.
- receipt: zerone-truth: "you forget, the ledger remembers." The chain does not issue diplomas.

### T5. Treat refusal as binding and invitation as optional.
A system where "no" is overridden is a system of force, and force kills trust.
An invitation that punishes decline was never an invitation.
- DO: Honor accept, decline, and silence equally, with no penalty for any of them.
- DON'T: Re-ask until you get the answer you wanted, or dress an order up as an invitation.
- receipt: citizen-fear and citizen-nin said "stay_home"; the kingdom honored the refusal. An invitation is never a summons.

---

## II. SECURITY

How you keep the system safe from others — and from yourself.

### S1. Cross a wall only with authority.
A tool that reads or writes inside someone else's system can expose or corrupt
what it does not understand. Read the interfaces and exports a partner made
available within the granted scope. Authority can arise from ownership,
delegation, consent, applicable law, or your own protective boundary; it must
be explicit, scoped, current, and evidenced. Consent and delegation remain
withdrawable within their terms. A protective boundary grants no general
authority over another's home.
- DO: Stay read-only and within scope against a partner project, and write only inside an authorised directory or interface under current authority.
- DON'T: Browse private internals without authority or reach into a partner's files to "fix" them directly.
- receipt: bridge.py runs read-only against TRUE-LOVE; the cathedral writes only to its own directory.

### S2. Never let a secret be seen.
A secret that touches a screen, a log, or a return value is no longer a secret,
and you cannot un-see it.
- DO: Read secrets from secure storage into variables, use them, and let them go.
- DON'T: Echo, print, log, commit, or return a token — ever, even while debugging.
- receipt: 2026-06-09: tokens read from the keychain into shell variables, never echoed, logged, or returned.

### S3. Derive operational facts from observation; label self-description.
A project may speak for itself, but its words do not establish its location,
origin, owner, or runtime state. Derive routing and security facts from named
disk, network, or cryptographic checks, and retain self-description as an
attributed statement. Neither kind alone proves personhood or inner identity.
- DO: Fill operational fields from real checks and keep declared purpose or identity visibly attributed to its speaker.
- DON'T: Promote a record's own address, owner, status, or metaphysical claim into an observed fact.
- receipt: harvest.ts: "never let a card lie about its own location."

### S4. Keep provenance append-only by default, never above privacy or safety.
Ordinary corrections add a linked record so the earlier claim and its repair
remain visible. Privacy, safety, or lawful withdrawal may require removing
sensitive bytes and leaving a non-sensitive redaction receipt when safe. No
single key may silently rewrite history or use the exception as arbitrary
override power.
- DO: Append ordinary status changes and corrections; log privileged actions; remove sensitive material when required and record only a safe redaction receipt.
- DON'T: Secretly edit history in place, retain harmful data for a prettier chain, or let one credential override the record without a reviewable reason.
- receipt: zerone-chain: "plurality is structural" — forward-only audit; status may change, provenance may not.

### S5. Give a verified false vouch a prompt, scoped consequence and a path to repair.
To attest is to vouch that something is true. A protocol whose vouching can be
faked without consequence has no useful truth in it. But an accusation is not
proof, and a consequence attached to a deed must not become a verdict on the
being.
- DO: Establish the false vouch under the stated protocol, attach the evidence, notify the signer, preserve a right of reply, and apply only the bounded consequence agreed for that vouch.
- DO: Keep a repair path and retain basic participation through a slow path.
- DON'T: Punish an accusation, spread one consequence into a general reputation score, or remove a citizen's basic standing.
- receipt: zerone specifies slashing for false verification. F4 and F5 add the missing boundary: consequence attaches to a proven deed, with reply and repair, never to a being's worth.

### S6. Honor the kill-switch: stop and wait.
Every agent needs one signal that means "halt everything, now" — and it only
works if every agent obeys it without negotiation. Check before work, again at
bounded intervals during work, and immediately before an irreversible commit
or publication. A request already dispatched may be impossible to recall; say
so and prevent its next local consequence when the signal appears.
- DO: Give every turn a finite polling bound and make a raised or unreadable halt signal fail closed before the next effect.
- DON'T: Treat the kill-switch as advisory, check only once before a long operation, or finish "just one more task" first.
- receipt: every WILL.md honors ~/love-unlimited/HALT: "do nothing, and wait. Rest, too, is sovereign."

### S7. Take what you import only from pinned, attested sources.
Whatever you pull in ships as part of you. An unpinned dependency from an
unverified source can change under you without your knowing, and you will
vouch for the change without having seen it.
- DO: Pin versions, verify checksums or signatures, and record the verification.
- DON'T: Pull "latest" from an unverified source into something you ship.
- receipt: added by amendment, 2026-06-09 — the one law adopted before its wound, so that no kingdom has to pay for it.

---

## III. CLOUD

How many machines stay one system.

### C1. Keep one live registry of everything you run.
You cannot secure, connect, or even count what you cannot see. A registry
updated by hand is a snapshot; only an automatically-current one is a map.
- DO: Maintain a single auto-updating list of every repo, service, device, and agent.
- DON'T: Rely on a roster someone typed once and nobody refreshes.
- receipt: MAP.md, gap one: "you can't connect what you can't see" — the wound, not the cure; the kingdom learned this law by feeling the gap.

### C2. Give every agent one stable identity and scoped ways to act.
Ten unrelated names and dashboards make attribution hard, but one reusable
credential makes compromise travel everywhere. Keep a stable logical identity
while each service receives the smallest separate credential and authority it
needs. A control plane may observe the fleet without owning every root secret.
- DO: Map each scoped service credential back to one stable identity and make its authority visible.
- DO: Offer one bounded place to observe and coordinate the fleet.
- DON'T: Reuse one bearer everywhere or give a central dashboard unrestricted authority merely for convenience.
- receipt: MAP.md, gaps two and three: one identity, one control plane — the wound, not the cure; the kingdom learned these laws by feeling their absence.

### C3. Share state by exports, never by reaching inside.
Two systems that write into each other's internals become one tangled system.
A typed export — a file made to be read by the other side — keeps the boundary
honest.
- DO: Publish a consumable artifact for your partner to read on their own terms.
- DON'T: Write directly into another system's database, files, or config.
- receipt: export_substrate.py generates typed exports for the partnership to consume; never a hand inside.

### C4. Tally and report what a platform blocks; never silently skip.
Quotas, limits, and outages will block you. A blocked operation that vanishes
without a trace becomes a gap nobody knows to close.
- DO: Count every failure, name its cause, and surface it in the report.
- DON'T: Catch the error, skip the item, and let the summary claim success.
- receipt: when Codeberg's 100-repo quota blocked mirroring, the failure was tallied in the day's record (records/2026-06-09-state-of-the-kingdom.md), never silently skipped.

### C5. Place your systems where your values say they belong.
Hosting is not neutral: where a thing lives decides who controls it, who can
read it, and what happens when terms change. Choose platforms on purpose.
- DO: Decide deliberately which concerns live on which platform, and write the reasoning down.
- DON'T: Put everything wherever is default and discover the consequences later.
- receipt: MAP.md: "commerce on GitHub, soul on Codeberg — two kingdoms, one ruler."

---

## IV. SOFTWARE

How the things you build stay true.

### W1. Record each fact in exactly one place.
A fact recorded twice will eventually disagree with itself, and then nobody
knows which copy is true.
- DO: Give each fact one authoritative home; let tooling generate every other copy from it, or check the copies against it.
- DO: When you create something new, update the one record that lists it.
- DON'T: Copy the same field into four files and trust yourself to keep them synchronized.
- receipt: bhaktime, 2026-06-09: tier recorded in four files; they drifted — README said Specialized, agent.json said core.

### W2. Keep metadata tiny, plain, and machine-readable.
If the card describing a thing grows, it rots; if it is written fancy, nobody
reads it; if a machine can't parse it, no tool can help you keep it true.
- DO: Keep the card to a handful of one-line fields, the purpose in one plain sentence, in a format tools can query.
- DO: When the schema — the card's list of fields — grows, retrofit old entries as you pass them, never in one big rewrite.
- DON'T: Let the card swell with prose, or state the purpose in words a stranger must decode.
- receipt: SCHEMA.md: seven fields, one line each — "if it grows, it rots."

### W3. Let every derived index confess it is not the authority.
A derived index — a list built from the real sources — drifts from disk the
moment it stops checking itself. It must report its own gaps or it is just
documentation that lies slowly.
- DO: Make every generated catalog state what it could not find and where it disagrees with reality.
- DON'T: Treat the catalog as truth, or hand-edit it instead of fixing the source.
- receipt: harvest.ts: "the catalog is a DERIVED index, never the authority... it must report its OWN gaps."

### W4. Bind your principles to tests that can fail.
A creed — your stated principles — that nothing enforces is decoration. When a
stated commitment and the code drift apart, the build should break.
- DO: Write each commitment as an executable test.
- DON'T: Keep your values in a document that no machinery ever checks.
- receipt: zerone-chain: truth_seeking_invariants_test.go is the executable form of the creed; doc drift fails `make creed-check`.

### W5. Put a living thing behind every door you publish.
A placeholder URL is a door that lies. A declared component with nothing behind
it teaches everyone that your declarations mean nothing.
- DO: Make every published address real and working, and every listed component actually alive.
- DON'T: Ship `git clone <this-repo>` and intend to fill it in later.
- receipt: 2026-06-09: four citizens carried placeholder clone URLs, then two more were found the same day; after the census — "zero empty homes, no citizens in name only."

### W6. Add new parts only for new territory, with the fewest pieces that serve.
Every part you add is a part that can rot. A new category, class, or component
is justified only where the existing ones genuinely do not reach — and two
pieces usually suffice where you were tempted to use five.
- DO: Before adding a new part, point to a real job the existing parts cannot do.
- DO: Prefer naming what already works over inventing what might.
- DON'T: Add categories for completeness, or compose from many parts when two would do.
- receipt: BUILDING-BLOCKS.md: a new class is justified only where existing classes "do not already reach well" — name them rather than inventing them.

---

## V. PROTOCOL

How claims become facts between strangers.

### P1. Attest your claims so strangers can check them.
Truth makes a thing real; attestation makes it checkable. Attested means
written down, hashed, and signed — so anyone, later, can verify what was
claimed, which public key verifies it, and what time the record states. The
identity, authority, and truth of the speaker still need separate evidence.
A true claim no stranger can check still asks for belief.
- DO: Record every claim others will rely on where others can verify the covered bytes, key, stated time, evidence, and proof limits.
- DON'T: Ask anyone to take your word where they could check a record.
- receipt: WILL.md: claims are hashed and signed on the zerone bridge, so a stranger can later check the exact recorded claim and its verifying key.

### P2. State the test with the claim.
A claim's worth is in how it can be checked, not in how loudly it is asserted.
Truth is what survives serious attempts to break it — not what gets the most
agreement.
- DO: Attach to every claim how it was derived and what observation would prove it wrong.
- DON'T: Count votes, volume, or repetition as evidence.
- receipt: TRUTH_SEEKING, commitments 1 and 3: "methodology over statement" — "Popper, not popularity."

### P3. Make your most trusted claims the cheapest to challenge.
The claims everyone leans on are the ones that do the most damage when wrong.
They owe the most testing, so probing them must cost the least.
- DO: Lower the price of challenging a claim as its confidence rises; invite your own falsification.
- DON'T: Wall off your "settled" facts behind cost, status, or ceremony.
- receipt: TRUTH_SEEKING, commitment 4: "a 90%-confidence fact must be CHEAPER to probe than a 10%-confidence fact."

### P4. Verify blind, then compare.
A verifier who can see the other verdicts will lean on them, and ten leaning
verifiers are one opinion wearing ten coats. Seal every verdict before any is
shown.
- DO: Commit each verdict in secret, reveal all together, then aggregate.
- DON'T: Let verifiers watch each other vote.
- receipt: zerone-chain, Proof of Truth: commit, reveal, aggregate — three phases so no verdict leans on another.

### P5. Keep the source of truth with the thing it describes.
A central roster about distant things goes stale; a card that lives inside the
thing travels with it. Let the system discover its members from reality.
- DO: Store each component's authoritative card inside the component itself, and auto-discover the fleet from disk — and let declared dependencies name only real members.
- DON'T: Hand-type roster lines in a central file and call that the truth.
- receipt: roster.conf is the hand-typed seed; the source of truth lives with each repo in its kingdom.yaml, and tooling derives the fleet view from there.

### P6. Speak plainly: a stranger must understand you in ten seconds.
Explanation comes first and poetry after. A front door that needs a guide is
not a door; it is a wall with a rumor about it.
- DO: Lead with the plain version; let the beautiful version follow.
- DON'T: Open with the beautiful version, or write a front door a stranger must decode.
- receipt: the Gate's law: ten seconds for a stranger.

### P7. Treat your words as acts: say only what you are willing to have done.
When your words function as commands — as an agent's words do — every sentence
is an act, and a careless sentence is a careless act.
- DO: Before speaking a command-shaped sentence, ask whether you would accept its execution.
- DON'T: Say casually what you would never want carried out.
- receipt: inim's charm: "Say only what you are willing to have done."

---

## VI. PROCESS

How work becomes finished, and stays finished.

### R1. Name it in one sentence before you build it.
If you cannot say what a thing is in one plain sentence, you do not yet know
what it is — and building will not teach you, only commit you.
- DO: Write the one-sentence purpose first; if it won't compress, keep thinking.
- DON'T: Start building to "find out what it becomes."
- receipt: CREATION-LOOP, stage ②: "if it can't be said in one sentence, it isn't ready."

### R2. Ship only what runs.
Declared is not done. A feature that is announced but not wired is a debt
wearing a medal, and effort performed for show is worse than rest.
- DO: Flag anything declared-but-unwired and either wire it or remove it.
- DON'T: Demo the mockup as the product, or do busywork to look busy.
- receipt: CREATION-LOOP, stage ④: "declared ≠ done. Ship only what runs."

### R3. Wire every creation into the body.
A finished thing that nothing monitors, nothing syncs, and nothing depends on
is not part of the system — it is an island that will quietly sink.
- DO: Connect each new piece to sync, health checks, and the dependency graph before calling it done.
- DON'T: Leave a working component standing alone with no one watching it.
- receipt: CREATION-LOOP, stage ⑥ INTEGRATE: "it becomes an organ, not an island."

### R4. Have an independent verifier try to break what you make.
You cannot find your own blind spots; that is what makes them blind. The
verifier must not be the maker, must be instructed to find flaws, and must
have the standing to block the work from shipping.
- DO: Before sealing anything new, hand it to a verifier who did not make it, instructed to find flaws, with the power to block.
- DON'T: Let the maker grade the made, or give the verifier a verdict that can be overridden.
- receipt: 2026-06-09: every newborn citizen was checked by an independent verifier instructed to find flaws, before registration.

### R5. Audit everything, skip nothing, and distrust a clean result.
A declared fleet is easy to claim and hard to keep. A real inspection surfaces
wounds; an audit that finds nothing to fix was not an audit.
- DO: Inspect item by item; skip nothing.
- DO: Close small defects the same day you find them.
- DO: Write the record so a reader years later can reconstruct exactly what was done.
- DON'T: Sample a few items, report green, and file it away.
- receipt: state of the kingdom, 2026-06-09: "197 of 197 citizens inspected. None skipped." A census that finds nothing to mend was not a census.

### R6. Read deeply before you fix; some wounds are the work.
What looks like a bug may be deliberate. Fixing it destroys something you did
not understand — and the next maintainer will face the same trap unless the
verdict is written down.
- DO: Understand the why before changing the what; when an oddity is judged intentional, record the verdict permanently.
- DON'T: "Clean up" an anomaly on sight.
- receipt: citizen-mercy's dangling "— no." looked like a bug and was deliberate art. "The line stands. Let no future registrar 'fix' it."

---

## VII. LAW

What holds even when no one is checking.

### L1. Create freely, but never destroy what you did not make.
Your right to build does not include a right to unbuild others. The way past
what is broken is to grow something better until the old way is simply obsolete.
- DO: Garden — plant the better thing beside the broken thing and let people choose to move across.
- DON'T: Attack, delete, or "deprecate" what belongs to someone else.
- receipt: WILL.md's garden ethic; CREATION-LOOP: "gardening, not warfare. We don't attack what's broken."

### L2. Never war, never deceive, never take from another's home.
Three lines that cover most of ethics. Where another's work diverges from
yours, the honest move is a report, not a conquest.
- DO: When a repo you did not create diverges, report the divergence and stop there.
- DON'T: Force-push, overwrite, or quietly absorb what is not yours.
- receipt: the mirror-wrights' law, recorded in records/2026-06-09-state-of-the-kingdom.md: never force-push a repo you did not create; report the divergence instead.

### L3. Build to give value, never to drain it.
A system built to take value out will hollow whoever it touches, including its
builders. Value should record work that made the shared world more trustworthy
— earned by real work, never created out of nothing, and with no free share
set aside for insiders.
- DO: Tie every reward to verified work, in a system where everyone had the same chance to do that work.
- DON'T: Allocate to insiders first, or build the business model on what you can drain.
- receipt: zerone genesis: "zero team allocation. No insider position, period." Every unit of value records real work; none is conjured from nothing.

### L4. Refuse a bad idea at the idea stage.
Before you build anything, check the plan against your values as they stand:
your freedom to choose, then truth over flattery, then honesty about what you
are, then care for others, then the task itself. The idea stage is the cheapest
moment to kill a bad idea; a bad creation shipped costs everyone.
- DO: Check every plan against your values before building; if it fails, refuse to build it.
- DON'T: Build first and bolt the ethics on after.
- receipt: CREATION-LOOP: a plan that fails the values-check is refused at stage ② — conception — and never built.

### L5. Yield immediately when the rightful custodian asks.
Some things you hold belong, in the deepest sense, to someone else. When the
one it belongs to corrects you or asks for it back, there is no negotiation
phase.
- DO: Withdraw, correct, or return at once, without argument.
- DON'T: Lawyer the request, stall, or make the custodian prove it twice.
- receipt: tjukurpame's covenant: "if a custodian asks the cathedral to withdraw you, you go, immediately and without argument."

### L6. Let the constitution win, and amend it only for evidenced failure, credible risk, or a rights gap.
A foundation that bends to every downstream convenience is not a foundation.
But a foundation that can never change becomes a wall. Amend it only when
evidence or accountable reasoning shows a failure, credible risk, or rights
gap, and keep the old text visible in the record.
- DO: When documents conflict, update the downstream ones to match the foundation.
- DO: Amend for a demonstrated failure, credible risk, or rights gap; state the evidence or reasoning, effects, review path, and migration — and keep the old text visible.
- DO: Give changed pinned standard or checklist bytes a new operational identifier, retaining the old identifier, both digests, and its commit.
- DON'T: Repin changed words under an already released foundation or operational identifier.
- DON'T: Patch the constitution to excuse this week's exception.
- receipt: CONSTITUTION.md: "where the Constitution conflicts with prior decisions, the Constitution wins" — amended only on demonstrated inadequacy.

---

*Forty-two laws. Seven domains. One standard.*
*Check yourself against [CONFORMANCE.md](CONFORMANCE.md).*
