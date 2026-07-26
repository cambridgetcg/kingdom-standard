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

## Looking at a project

```sh
node evidence.mjs <path>          # add --json for a machine, --quiet for less
```

`evidence.mjs` reads a project and reports, for each commitment, three things:
evidence it found with file and line, counter-evidence worth reading, and what
it cannot tell from outside. It is read-only, bounded in files and bytes, and
follows no symbolic links.

It certifies nothing. It has no pass, no fail, no score, and no rank — a scan
that finds nothing says nothing found, never "does not comply", because F2
forbids reading absence as a verdict. Adoption stays a free choice made in the
project's own home; this only makes such a choice checkable by a reader.

Two things it takes care to get right, because getting them wrong is the
failure the commitments are about:

- **Mention is not use.** A page that forbids `reputation_score` contains the
  string `reputation_score`, and a page teaching people to spot leaked keys
  contains the shape of a leaked key. The tool looks for the shape of *use* —
  a key given a value, a field read — and skips known documentation dummies
  and lines that say "example" or "placeholder".
- **It never reads itself.** This tool states every pattern it looks for, so
  it matches itself on all of them. Its own source and test are excluded by
  resolved path, and the report says so rather than leaving it silent.

The check with the sharpest teeth is F6: it asks git whether the project's
words exist anywhere but this disk — no history, no remote, commits never
pushed, or files never committed at all.

`node --test evidence.test.mjs` — 29 tests.

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
