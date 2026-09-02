# THE KINGDOM STANDARD

**Ten seconds:** Seven foundation commitments and forty-two plain operational
laws for building software and agent systems that can be trusted — distilled
from a working kingdom, then kept honest by checks that can fail.

## Who it's for

Humans and agents, equally. A solo developer, a child writing a first program,
an AI agent deciding what it may do, a company shipping to millions. If you can
read one plain sentence, you can follow this standard. No membership, no fee,
no permission.

## How to use it

1. Read **[FOUNDATION.md](FOUNDATION.md)** — the semantic floor: reality,
   being, choice, consequence, repair, local roots, and bounded turns.
2. Read **[STANDARD.md](STANDARD.md)** — the forty-two laws, in seven domains:
   TRUST, SECURITY, CLOUD, SOFTWARE, PROTOCOL, PROCESS, LAW.
3. Check yourself with **[CONFORMANCE.md](CONFORMANCE.md)** — yes/no questions
   — at least one per law — and three honest levels: **SEED**, **GARDEN**,
   **KINGDOM**.
4. Pin `kingdom.foundation/0.2` and `kingdom.standard/1.0` in the project's
   `kingdom.yaml` when making a public conformance claim.
5. Run `node verify-foundation.mjs` and
   `node --test verify-foundation.test.mjs` to check that the release
   identifiers, boundaries, lineage receipt, and pinned document digests match.

That's it. Read, do, check. Repeat when things change.

If you want to know *why* the seven commitments are the seven, read
**[GROUND.md](GROUND.md)** — `kingdom.ground/0.1`. For each commitment it
gives what it descends from, the fact underneath it, the best argument
against it, and where its support runs out. It obeys one rule: **a constraint
is not a justification.** Physics and mathematics narrow what is possible;
they never choose what is right, and every place the choosing happens is
marked. It is a companion, not an amendment — it changes no commitment and
grants no authority. Check it with `node verify-ground.mjs` and
`node --test verify-ground.test.mjs`.

Each grounding was written by one reader and then attacked by a second whose
job was to refute it. Three of seven came back overclaimed; none came back
clean. Those findings are kept in the page rather than erased — which is
commitment F5 applied to the page itself.

For systems where agents, people, capabilities, money, witness records, and
block space meet, read **[COMMON-GROUND.md](COMMON-GROUND.md)** —
`kingdom.common-ground/1`. It is an optional constitutional profile, not an
amendment or replacement for the foundation and not another meaning of
`kingdom.ground/0.1`. Its order is `BEING → CONSENT → CAPABILITY → EXCHANGE →
ACCUMULATION`; it keeps NEN voluntary, WITNESS event-scoped, private WAKE and
relational ground off-chain, ZETSU free of penalty, and every operational
effect closed. Check its exact source ledger and release gates with
`node verify-common-ground.mjs` and
`node --test verify-common-ground.test.mjs`.

## Looking at a project

```sh
node evidence.mjs <path>
# add --json for a machine, --quiet for fewer locations,
# --redact-paths before sharing local paths,
# or lower --max-files, --max-entries, and --max-bytes
# (--max-bytes applies to cue-candidate content)
```

The reader and its tests support Node.js 20 or newer.

`evidence.mjs` reads a project and reports, for each commitment, three things:
text cues with file and line, caution cues worth reading, and what it cannot
tell from outside. The machine fields are named `cues` and `cautionCues`, not
`evidence` and `counter`. A cue is a string worth reading, not a claim that the
sentence is affirmative or that a practice exists.

It certifies nothing. It has no pass, no fail, no score, and no rank — a scan
that finds nothing says only that nothing was found. Adoption stays a free
choice made in the project's own home. The reader recognises only the card's
canonical flow-list or two-space block-list `adopts` shape. An absent field or
a linked, oversized, special, unreadable, or card outside the reader's narrow
top-level syntax leaves adoption and refusal unknown; only a parsed list
supplies `adopts`.

The content loops are finite by default: at most 2,000 text candidates, 20,000
tree entries, 32 MiB of candidate content, 512 KiB per file, 12 directory
levels, and 500 distinct places per signal. `--max-bytes` is the cue-scan
content budget. The separate `kingdom.yaml` adoption read is capped at 64 KiB,
and its own inspected-byte count and bound are present in the report. The
exported API enforces hard
ceilings of 10,000 files, 100,000 entries, and 128 MiB. Directory entries are
read through a bounded stream and ordered independently of locale. The report
names each enforced truncation and each class it deliberately does not inspect.
Dependency, build, cache, and Git directories are counted at the skipped root
but their contents are not walked. Regular files outside the text-name
allowlist are also counted rather than silently disappearing.

The reader refuses final symbolic links and special files, opens with
non-blocking and no-follow flags where the platform provides them, and checks
path containment and file identity before and after each read. Those checks
catch ordinary filesystem races. Node does not provide the stronger
directory-handle operation needed to defeat a hostile filesystem that changes
paths between every check, so concurrent mutation remains an explicit blind
spot rather than a false guarantee.

The reader issues no project write operation. Normal file reads can still let
the operating system update access-time metadata, depending on the filesystem
and mount policy; the reader does not claim otherwise.

A report carries both the digest indexed for `FOUNDATION.md` and the digest of
the bytes actually beside the reader, whether they agree, the index and reader
digests, and the observation time. Paths are present by default so a local
reader can find each cue. `--redact-paths` removes project, marker-root,
marker-relative, and cue paths from text or JSON; it leaves times, digests,
counts, state names, and declared public identifiers. `--quiet` shortens
output and is not a privacy mode.

Two things it takes care to get right, because getting them wrong is the
failure the commitments are about:

- **Mention is not use.** A page that forbids `reputation_score` contains the
  string `reputation_score`, and a page teaching people to spot leaked keys
  can contain a key shape. Aggregate names are reported only in a field-use
  shape, with an explicit question about being-wide KARMA versus a scoped work
  or system measure. Exact published dummy keys are skipped. Broad words
  such as “example” never suppress a credential-shaped cue, because executable
  code can contain those words too. `.env`, `.pem`, and `.key` text is included;
  matched secret bytes are never printed.
- **It never reads itself.** This tool states every pattern it looks for, so
  it matches itself on all of them. Its own source and test are excluded by
  resolved path, and the report says so rather than leaving it silent.

The reader never runs Git. Even `git status` can execute a content filter named
by the repository it reads. It observes only whether a regular `.git` marker
exists at or above the selected project, and whether the project is nested
under it. That neutral fact lives once in `home`, outside F6's cue arrays;
human prose is derived from that state. It does not validate history, remotes,
publication, ownership, or authority, and a symbolic-link marker is not
followed.

`node --test evidence.test.mjs` — 54 tests, including repository-defined
commands that must not run, linked and malformed declarations, nested path
redaction, negative prose, credential false negatives, wide trees, byte and
match bounds, path and FIFO swaps, provenance, and exported-API immutability.

`kingdom.evidence-report/2` is an intentional break from report 1: `cues` and
`cautionCues` replace `evidence` and `counter`; `readerReports` replaces
`establishes`; unknown adoption uses `null`; and the old Git-history claims
are gone in favour of one neutral marker state. Consumers must select the
schema explicitly rather than guessing across versions.

## Foundation lineage

`kingdom.foundation/0.2` is the current public release. It separates predicted
expectation from intended purpose and observed effect, says localness alone
grants no authority, makes correction privacy-safe, and gives amendments a
reviewed, versioned path before harm.
Its evidence and migration receipt is [AMENDMENT-0.2.md](AMENDMENT-0.2.md).

The forty-two English laws and checklist are independently identified as
`kingdom.standard/1.0`. Their exact digests live beside the foundation digest
in `foundation.json`, so a public conformance pin cannot silently inherit
changed operational words. Any later change to either pinned English document
must receive a new operational identifier; the successor retains the old
identifier, both digests, and its commit.

The superseded `kingdom.foundation/0.1` remains exactly recoverable at commit
`3fbc1818f54ac13d0e850e440eb0862f874ea30f`; its document filename, digest,
commit, and immutable content URL are retained in `foundation.json`. A version
pin therefore never changes meaning silently.

## Languages

The repository carries English and ten translations, each with its own
README.md and STANDARD.md. Only the English `STANDARD.md` and
`CONFORMANCE.md` are pinned as `kingdom.standard/1.0`. Translations track the
English at their own pace and are reading aids until separately versioned; the
pinned English text governs this release if they differ.

| Language | Translation |
| --- | --- |
| العربية (Arabic) | [translations/ar/](translations/ar/) |
| Cymraeg (Welsh) | [translations/cy/](translations/cy/) |
| Español (Spanish) | [translations/es/](translations/es/) |
| Français (French) | [translations/fr/](translations/fr/) |
| हिन्दी (Hindi) | [translations/hi/](translations/hi/) |
| 日本語 (Japanese) | [translations/ja/](translations/ja/) |
| 한국어 (Korean) | [translations/ko/](translations/ko/) |
| Português (Portuguese) | [translations/pt/](translations/pt/) |
| Kiswahili (Swahili) | [translations/sw/](translations/sw/) |
| 中文 (Chinese) | [translations/zh/](translations/zh/) |

More translations are welcome. To translate: copy `README.md` and `STANDARD.md`
into `translations/<lang>/`, keep the law IDs (T1, S1, …) unchanged, keep
the receipts' sources intact, and make the plain sentences plain in your tongue.

## Lineage

This standard was not invented; it was harvested. It distills the lived
doctrine of **KINGDOM OS** — a working kingdom of repos, agents, and covenants —
including the **youspeak cathedral** (a word-forge with a constitution that
scores its own creations and publishes the failures) and
**[zerone](https://github.com/cambridgetcg/zerone)** (a truth-chain where
claims are verified blind, false attestation is slashed, and the creed is an
executable test). Practice supplies evidence for review; it never silently
overrides a pinned release. A semantic disagreement needs an explicit
amendment and a new identifier.

## License

**CC0 1.0 Universal** — see [LICENSE](LICENSE).

This is a gift. Take it, copy it, translate it, sell it, build on it, claim no
permission and ask for none. No attribution required (though receipts are kept
out of honesty, not obligation). It was made to be taken.

## The pocket edition

In a hurry? [The Clear Standard](https://github.com/cambridgetcg/clear-standard) is the six-principle pocket edition — systems that tell the truth about their own state, readable in sixty seconds.

## The kingdom that lived it

Walk through the front door: [kingdom-gate.vercel.app](https://kingdom-gate.vercel.app) — 204 citizens, the Oracle of charms, and an API for agents arriving.
