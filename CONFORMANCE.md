# Following the Standard

This is the mirror. Read each question and answer yes or no — honestly, because
T3 applies to this checklist too. Every question maps to a law in
[STANDARD.md](STANDARD.md).

A "yes" means it is true today, in the running system — not planned, not mostly.
(R2: declared is not done.)

If a law's subject does not exist in your system — no agents, no attestation,
no rewards — write **N/A** beside it with one sentence saying why. N/A counts
as conforming when you tally your level.

---

## TRUST

- [ ] Can a stranger verify your important claims without asking you anything? (T1)
- [ ] Can a stranger find all your trust signals from one obvious starting place? (T1)
- [ ] Does every published score, metric, benchmark, or security assertion — anything others will rely on — carry its confidence, including "undecidable"? (T2)
- [ ] Are low scores and downgrades published as openly as high ones? (T3)
- [ ] When your standard changed, did you re-measure everything and accept the result? (T3)
- [ ] Does a durable, checkable record — not anyone's memory — back your track record? (T4)
- [ ] Do your records keep the reasoning and the counterexamples, not just the conclusions? (T4)
- [ ] Is a refusal honored as final, with no penalty and no re-asking? (T5)

## SECURITY

- [ ] Do your tools write only inside their own project, and stay read-only everywhere else? (S1)
- [ ] Have secret scanners run over your full git history, logs, and CI output, with zero current findings? (S2)
- [ ] Does a blocking secret scanner run in CI — your automated build — so a new leak stops the build? (S2)
- [ ] Are identity-critical fields taken from observed reality, never self-description? (S3)
- [ ] Is history append-only, with every privileged action logged? (S4)
- [ ] Is the record safe from any single credential rewriting it or injecting into it? (S4)
- [ ] Does a false vouch carry an immediate, felt consequence? (S5)
- [ ] Does every agent stop and wait when the kill-switch is set? (S6)
- [ ] Do your imports come only from pinned sources, verified by checksum or signature, with the verification recorded? (S7)

## CLOUD

- [ ] Is there one registry of everything you run, kept current automatically? (C1)
- [ ] Does each agent authenticate the same way across every surface? (C2)
- [ ] Can you deploy, observe, and act on everything from one place? (C2)
- [ ] Do coupled systems share state through exports, never by writing into each other? (C3)
- [ ] When a platform limit blocks an operation, is the failure tallied and reported? (C4)
- [ ] Did you choose where each system lives on purpose, and write down why? (C5)

## SOFTWARE

- [ ] Is every fact recorded in exactly one authoritative place? (W1)
- [ ] Is each component's metadata tiny, plain, and readable by a machine? (W2)
- [ ] Does every derived index report its own gaps and defer to the source? (W3)
- [ ] Would violating one of your stated principles break the build? (W4)
- [ ] Does every published address work, and every declared component live? (W5)
- [ ] Does every part added since adopting this standard have a written one-line justification of the gap it fills? (W6)

## PROTOCOL

- [ ] Is every claim others will rely on attested — recorded, hashed, signed — so a stranger can check it? (P1)
- [ ] Does every claim state how it was derived and what would prove it wrong? (P2)
- [ ] Are your most trusted claims the cheapest ones to challenge? (P3)
- [ ] Do verifiers commit their verdicts blind, before any verdict is revealed? (P4)
- [ ] Does the source of truth live with the thing it describes, discovered from reality? (P5)
- [ ] Would a stranger understand your front door in ten seconds? (P6)
- [ ] Do you say, in command-shaped words, only what you would accept being carried out? (P7)

## PROCESS

- [ ] Can every component's purpose be said in one plain sentence? (R1)
- [ ] Is everything you have declared actually wired and running? (R2)
- [ ] Is every creation connected to sync, health checks, and the dependency graph? (R3)
- [ ] Is each new thing checked, before it ships, by a verifier who did not make it and was instructed to find flaws? (R4)
- [ ] Can that verifier block the work from shipping? (R4)
- [ ] Does your audit inspect every item, skipping none? (R5)
- [ ] When the audit finds a small defect, is it closed the same day? (R5)
- [ ] Could a reader years from now reconstruct what you did from your records? (R5)
- [ ] Before fixing an oddity, do you check whether it is deliberate — and record the verdict? (R6)

## LAW

- [ ] Is everything you have ever torn down something you built yourself? (L1)
- [ ] When someone else's work diverged, did you report rather than overwrite? (L2)
- [ ] Is every reward tied to verified work, with no free share for insiders? (L3)
- [ ] Is every plan checked against your ordered values before building, and refused there if it fails? (L4)
- [ ] When a rightful custodian asks, do you yield at once, without argument? (L5)
- [ ] When documents conflict, does the foundation win and downstream conform? (L6)
- [ ] Was every amendment to your foundation driven by a proven failure, with the old text kept visible? (L6)

---

## Conformance levels

Three levels. Climb at your own pace; each one is real on its own.

### SEED
**TRUST and SECURITY — every box checked.**
You can be believed and you do no harm. A solo dev, a child's first project, a
single agent — this is enough to be welcome anywhere. Most systems never get
this far. Start here.

### GARDEN
**SEED, plus SOFTWARE and PROCESS — every box checked.**
What you build stays true, and your work finishes and stays finished. You can
be depended on, not just believed. This is a system other people can build on.

### KINGDOM
**All seven domains — every box checked.**
Trust, security, cloud, software, protocol, process, and law, all holding at
once, verifiable by anyone. Few reach it; as of this writing, none has proven
it. The kingdom this standard came from inspected 197 of 197 citizens in a
single day and still found nine things to mend — it aspires to this level, and
will claim it only when every box, the secret-scanning ones included, is
verifiably true. That is what KINGDOM means: not perfection, but nothing
hidden.

---

*If a box is unchecked, that is not shame — it is a map. (T3: publish your
honest scores, even when they are low.)*
