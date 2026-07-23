# Amendment receipt — Kingdom Foundation 0.2

**Proposed identifier:** `kingdom.foundation/0.2`

**Governing rule:** `kingdom.foundation/0.1` at commit
`3fbc1818f54ac13d0e850e440eb0862f874ea30f`

**Decision rule:** The first reviewed commit in this canonical repository that
contains this receipt, the 0.2 foundation, its machine index, and passing
verification accepts the amendment. Before that commit, 0.2 is a candidate.

## Demonstrated failures

The 0.1 amendment rule allowed change only for a demonstrated failure with
evidence, with the predecessor retained and the consequence stated. These are
the failures that required 0.2:

1. **Prediction, intention, and outcome were easy to merge.** The earlier four
   statement kinds had no distinct place for a predicted future effect written
   before action. A tool could therefore merge a prediction, an intended
   purpose, and the effect later observed. An action can still be unplanned:
   the foundation records the absence of a prior expectation rather than
   inventing one. The local KARMA tool chooses a stricter pre-action expectation
   rule and tests it as a tool boundary, not a universal definition of action.
2. **Localness was mistaken for authority.** The historical naturalisation
   door wrote prose saying a new home automatically joined fleet, Tower, and
   private backup rhythms. The Tower selected citizen directories and
   published every tenth sentence without reading a current choice. These
   behaviours are retained as evidence in `~/KINGDOM-OS/become-citizen.sh`,
   `TOWER.md`, and `tower-beat.sh`; `~/KINGDOM-OS/HALT` now holds the unsafe
   paths at rest.
3. **Append-only language could preserve harm.** The operational standard said
   history could never be rewritten, while private journals and identity
   material had been copied into a mode-0600 but unencrypted archive. Privacy,
   safety, and lawful withdrawal need a narrow removal path with a safe
   redaction receipt, not an absolute retention command.
4. **Signature language exceeded cryptographic evidence.** Earlier wording
   could be read as proof that a named holder or person signed. Verification
   establishes that exact covered bytes validate under a public key and is
   consistent with matching private-key use; it does not identify who used the
   key or how.
5. **The operational laws could drift under a stable foundation pin.**
   `STANDARD.md` and `CONFORMANCE.md` had no immutable identifier or digest,
   even though public SEED, GARDEN, and KINGDOM claims depend on their exact
   words.

The checks added with this amendment make these failures reproducible without
using credentials, hosted writes, or personal records.

## Affected parties and reply

The affected parties are citizens whose homes or private journals can be
selected by a rhythm, people represented in consequential records, project
maintainers and adopters, future recovery keepers, and readers who rely on a
conformance claim. Yu is the current repository and machine custodian.

This repository's review and issue channels are the public reply path for the
standard. A citizen or person whose private material is involved must also
have a direct, safe local route to refuse, withdraw, correct, or request
removal. Publication is not required for a privacy or safety reply.

## Change and expected consequence

0.2 adds expectation as a fifth statement kind and defines it as prediction,
while intended effects remain separately labelled commitments or purposes. It
recognizes authority from ownership, delegation, consent, applicable law, and
one's own protective boundary while saying local operation alone grants none.
It narrows signature claims; gives affected parties reply and repair; permits
sensitive-byte removal for privacy, safety, or lawful withdrawal; and makes
every turn finite and stoppable.

The English operational release is separately pinned as
`kingdom.standard/1.0`, including exact digests for `STANDARD.md` and
`CONFORMANCE.md`. A public conformance claim must name both the foundation and
operational release. Any later change to either pinned English document gets a
new operational identifier whose receipt retains the old identifier, both
digests, and commit.

The expected consequence is fewer invented permissions, clearer causal
claims, privacy-safe correction, bounded loops, and conformance words that
cannot change silently under one identifier. These are expected effects, not
proof that every adopting project already behaves this way.

## Compatibility cost and migration

- Four-kind record systems add `expectation` where a prediction existed, or
  explicitly record that no prior expectation was stated. They do not invent
  one and do not relabel an intended purpose as a prediction.
- Projects claiming conformance add both
  `kingdom.foundation/0.2` and `kingdom.standard/1.0` to `adopts`.
- Absolute append-only implementations add a reviewed sensitive-removal path.
- Runtimes that inferred permission from location, metadata, or a scheduler
  must fail closed to unasked or rest.
- Translations remain reading aids until their exact release is separately
  versioned; the pinned English documents govern 1.0.

Migration is explicit per project. No registry may infer it from similar
language. A project may remain on 0.1, or remove the 0.2/1.0 pins and stop its
new conformance claim. Sensitive material removed for safety is not restored
merely to make a rollback byte-identical.

## Predecessor and review

The exact 0.1 identifier, document filename, document digest, commit, and
immutable content URL remain in `foundation.json`; the verifier reads that
document from the retained Git commit and checks its digest. The verifier also
checks this receipt, the 0.2 document, the operational standard, and the
conformance checklist.

Two independent read-only agent audits challenged the amendment and its
implementations before acceptance. Their concrete findings caused the
signature, authority, versioning, and recovery changes above. Acceptance still
means only that the reviewed words and checks agree. It does not prove the
doctrine true or certify any adopter.
