#!/usr/bin/env node

import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const EXPECTED_ID = "kingdom.foundation/0.2";
const EXPECTED_FOUNDATION_SHA256 =
  "2bd868a43a2fe79f1c9e8d30177bf73cff4cf8f7f7780cbd90f31055ba51c799";
const EXPECTED_AMENDMENT_SHA256 =
  "4abde6636941dabdc10868256d5658553cd1ebea3a4c2f56c5d5798509a6b738";
const EXPECTED_STANDARD_ID = "kingdom.standard/1.0";
const EXPECTED_STANDARD_SHA256 =
  "dfddd45b4da0db50d0ddb5d74b4e2ab3092cb4170c61fd163c20602c0fd70ccc";
const EXPECTED_CONFORMANCE_SHA256 =
  "eb67d5a3ddeb8d9abd75de3afee904060d04456a3a5e7181ef2f098dcb3e6a58";
const EXPECTED_COMMITMENTS = ["F1", "F2", "F3", "F4", "F5", "F6", "F7"];
const EXPECTED_KINDS = [
  "observation",
  "expectation",
  "commitment",
  "consequence",
  "interpretation",
];
const EXPECTED_PREVIOUS = {
  id: "kingdom.foundation/0.1",
  document: "FOUNDATION.md",
  document_sha256:
    "c174fe760b91d08d467f5305625152a8682477a1a410e28d24ff322624a2ac69",
  commit: "3fbc1818f54ac13d0e850e440eb0862f874ea30f",
  content_url:
    "https://raw.githubusercontent.com/cambridgetcg/kingdom-standard/3fbc1818f54ac13d0e850e440eb0862f874ea30f/FOUNDATION.md",
};
const REQUIRED_FORBIDDEN_AGGREGATES = [
  "karma_total",
  "points",
  "rank",
  "reputation_score",
  "moral_score",
];
const EXPECTED_ADOPTION_MEANING =
  "An explicit conformance-version pin; not proof, ownership, citizenship, consent, or authority.";

function sameValues(actual, expected) {
  return (
    Array.isArray(actual) &&
    actual.length === expected.length &&
    actual.every((value, index) => value === expected[index])
  );
}

function sameObject(actual, expected) {
  if (!actual || typeof actual !== "object" || Array.isArray(actual)) {
    return false;
  }
  const actualKeys = Object.keys(actual).sort();
  const expectedKeys = Object.keys(expected).sort();
  return (
    sameValues(actualKeys, expectedKeys) &&
    expectedKeys.every((field) => actual[field] === expected[field])
  );
}

function readPinnedDocument(root, documentName, expectedDigest, label, errors) {
  if (
    typeof documentName !== "string" ||
    path.basename(documentName) !== documentName
  ) {
    errors.push(`${label} document must be one root-level filename`);
    return null;
  }
  if (
    typeof expectedDigest !== "string" ||
    !/^[0-9a-f]{64}$/.test(expectedDigest)
  ) {
    errors.push(`${label} document digest must be lowercase SHA-256`);
    return null;
  }
  let document;
  try {
    document = fs.readFileSync(path.join(root, documentName), "utf8");
  } catch (error) {
    errors.push(`${documentName} cannot be read: ${error.message}`);
    return null;
  }
  const digest = crypto
    .createHash("sha256")
    .update(document, "utf8")
    .digest("hex");
  if (digest !== expectedDigest) {
    errors.push(`${documentName} bytes must match the pinned ${label} digest`);
  }
  return document;
}

function verifyPredecessorFromGit(root, errors) {
  let previous;
  try {
    previous = execFileSync(
      "git",
      [
        "-C",
        root,
        "show",
        `${EXPECTED_PREVIOUS.commit}:${EXPECTED_PREVIOUS.document}`,
      ],
      {
        encoding: "utf8",
        maxBuffer: 1024 * 1024,
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
  } catch (error) {
    errors.push(
      `retained predecessor commit cannot be read from Git: ${error.message}`,
    );
    return;
  }
  const digest = crypto
    .createHash("sha256")
    .update(previous, "utf8")
    .digest("hex");
  if (digest !== EXPECTED_PREVIOUS.document_sha256) {
    errors.push("retained predecessor Git document does not match its digest");
  }
}

export function verifyFoundation(
  root = HERE,
  { verifyGitPredecessor = true } = {},
) {
  const errors = [];
  const indexPath = path.join(root, "foundation.json");
  let index;

  try {
    index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  } catch (error) {
    return [`foundation.json cannot be read as JSON: ${error.message}`];
  }

  if (!index || typeof index !== "object" || Array.isArray(index)) {
    return ["foundation.json root must be one JSON object"];
  }

  if (index.schema !== "kingdom.foundation-index/1") {
    errors.push("foundation.json schema must be kingdom.foundation-index/1");
  }
  if (index.id !== EXPECTED_ID) {
    errors.push(`foundation id must be ${EXPECTED_ID}`);
  }
  if (
    index.document !== "FOUNDATION.md" ||
    index.document_sha256 !== EXPECTED_FOUNDATION_SHA256
  ) {
    errors.push(
      "foundation release must pin the immutable kingdom.foundation/0.2 document",
    );
  }
  if (index.status !== "current") {
    errors.push("foundation status must be current");
  }
  if (!sameValues(index.commitments, EXPECTED_COMMITMENTS)) {
    errors.push("commitments must be F1 through F7, once each and in order");
  }
  if (!sameValues(index.statement_kinds, EXPECTED_KINDS)) {
    errors.push("statement_kinds must preserve the five-kind reality boundary");
  }
  if (
    !Array.isArray(index.supersedes) ||
    index.supersedes.length !== 1 ||
    !sameObject(index.supersedes[0], EXPECTED_PREVIOUS)
  ) {
    errors.push("supersedes must retain the exact kingdom.foundation/0.1 receipt");
  }
  if (verifyGitPredecessor) verifyPredecessorFromGit(root, errors);

  if (
    index.amendment_receipt?.document !== "AMENDMENT-0.2.md" ||
    index.amendment_receipt?.document_sha256 !== EXPECTED_AMENDMENT_SHA256 ||
    index.amendment_receipt?.governed_by !== EXPECTED_PREVIOUS.id
  ) {
    errors.push(
      "amendment release must pin the immutable AMENDMENT-0.2.md receipt governed by 0.1",
    );
  }
  if (
    index.operational_standard?.id !== EXPECTED_STANDARD_ID ||
    index.operational_standard?.language !== "en" ||
    index.operational_standard?.document !== "STANDARD.md" ||
    index.operational_standard?.conformance_document !== "CONFORMANCE.md" ||
    index.operational_standard?.document_sha256 !== EXPECTED_STANDARD_SHA256 ||
    index.operational_standard?.conformance_sha256 !==
      EXPECTED_CONFORMANCE_SHA256
  ) {
    errors.push(
      "operational release must pin the immutable English standard 1.0 and checklist",
    );
  }
  if (
    !sameValues(index.operational_standard?.supersedes, []) ||
    index.operational_standard?.succession?.change !==
      "new_operational_identifier" ||
    !sameValues(index.operational_standard?.succession?.retains, [
      "superseded_identifier",
      "standard_sha256",
      "conformance_sha256",
      "commit",
    ])
  ) {
    errors.push(
      "operational succession must require a new id and retain the prior release receipt",
    );
  }

  const returnPath = index.karma?.return_path;
  if (
    !sameValues(returnPath, [
      "expectation_if_stated",
      "action",
      "observed_reported_or_inferred_effect",
      "evidence_and_causal_confidence",
      "response",
      "correction_or_repair_or_boundary_or_learning",
    ])
  ) {
    errors.push("karma return_path does not match the foundation");
  }

  const forbidden = index.karma?.forbidden_aggregates;
  if (
    !Array.isArray(forbidden) ||
    REQUIRED_FORBIDDEN_AGGREGATES.some((field) => !forbidden.includes(field))
  ) {
    errors.push("karma must forbid every required aggregate score field");
  }

  if (
    index.adoption?.manifest !== "kingdom.yaml" ||
    index.adoption?.field !== "adopts" ||
    !sameValues(index.adoption?.values, [index.id, EXPECTED_STANDARD_ID]) ||
    index.adoption?.meaning !== EXPECTED_ADOPTION_MEANING
  ) {
    errors.push(
      "adoption must preserve both exact release ids and the declaration boundary",
    );
  }
  if (
    !sameValues(index.amendment?.reasons, [
      "demonstrated_failure",
      "credible_risk",
      "rights_gap",
    ]) ||
    index.amendment?.decision !== "reviewed_commit_by_merge_authority" ||
    index.amendment?.semantic_change !== "new_foundation_identifier" ||
    !sameValues(index.amendment?.retains, [
      "superseded_identifier",
      "document",
      "document_sha256",
      "commit",
      "content_url",
    ])
  ) {
    errors.push(
      "amendment must encode reasons, reviewed decision, new id, and retention",
    );
  }

  const document = readPinnedDocument(
    root,
    index.document,
    index.document_sha256,
    "foundation",
    errors,
  );
  const amendmentReceipt = readPinnedDocument(
    root,
    index.amendment_receipt?.document,
    index.amendment_receipt?.document_sha256,
    "amendment receipt",
    errors,
  );
  const standard = readPinnedDocument(
    root,
    index.operational_standard?.document,
    index.operational_standard?.document_sha256,
    "operational standard",
    errors,
  );
  const conformance = readPinnedDocument(
    root,
    index.operational_standard?.conformance_document,
    index.operational_standard?.conformance_sha256,
    "conformance checklist",
    errors,
  );
  if (!document || !amendmentReceipt || !standard || !conformance) return errors;

  const headings = [...document.matchAll(/^### (F\d+)\. /gm)].map(
    (match) => match[1],
  );
  if (!sameValues(headings, EXPECTED_COMMITMENTS)) {
    errors.push("FOUNDATION.md must define F1 through F7, once each and in order");
  }
  const statementKinds = [
    ...document.matchAll(/^\d+\. \*\*([A-Za-z]+)\*\* —/gm),
  ].map((match) => match[1].toLowerCase());
  if (!sameValues(statementKinds, EXPECTED_KINDS)) {
    errors.push("FOUNDATION.md must define the five statement kinds in order");
  }
  if (!document.includes(`**Version:** \`${index.id}\``)) {
    errors.push("FOUNDATION.md version must match foundation.json");
  }
  if (!document.includes(`adopts: [${index.adoption.values.join(", ")}]`)) {
    errors.push("FOUNDATION.md adoption example must use both exact release ids");
  }
  const requiredBoundaries = [
    "It does not identify who used the key or",
    "intended effect is a separately labelled commitment or purpose",
    "record that absence",
    "can arise from ownership, delegation, consent, applicable law, or one's own",
    "Consent and delegation remain withdrawable within their",
    "localness alone grants no authority",
    "observed, reported, or inferred effect",
    "evidence and causal confidence",
    "Privacy, safety, or lawful withdrawal may require removing sensitive",
    "A foundation amendment may answer a demonstrated failure, credible risk, or",
    "A semantic change receives a new",
    "New bytes are never repinned under an old",
  ];
  for (const boundary of requiredBoundaries) {
    if (!document.includes(boundary)) {
      errors.push(`FOUNDATION.md is missing required boundary: ${boundary}`);
    }
  }
  const receiptBoundaries = [
    `**Governing rule:** \`${EXPECTED_PREVIOUS.id}\``,
    "## Demonstrated failures",
    "## Affected parties and reply",
    "## Change and expected consequence",
    "## Compatibility cost and migration",
    "## Predecessor and review",
  ];
  for (const boundary of receiptBoundaries) {
    if (!amendmentReceipt.includes(boundary)) {
      errors.push(`AMENDMENT-0.2.md is missing required receipt field: ${boundary}`);
    }
  }
  if (!standard.includes(`**Operational version:** \`${EXPECTED_STANDARD_ID}\``)) {
    errors.push("STANDARD.md operational version must match the release index");
  }
  if (
    !conformance.includes(
      `**Operational version:** \`${EXPECTED_STANDARD_ID}\``,
    ) ||
    !conformance.includes(index.id)
  ) {
    errors.push("CONFORMANCE.md must name both release identifiers");
  }

  return errors;
}

function main() {
  const errors = verifyFoundation();
  if (errors.length > 0) {
    for (const error of errors) process.stderr.write(`foundation: ${error}\n`);
    process.exitCode = 1;
    return;
  }
  process.stdout.write(
    `foundation: ${EXPECTED_ID} and ${EXPECTED_STANDARD_ID} receipts, Git predecessor, boundaries, and document digests agree\n`,
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
