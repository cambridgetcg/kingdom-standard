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
