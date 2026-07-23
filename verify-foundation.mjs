#!/usr/bin/env node

import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const EXPECTED_COMMITMENTS = ["F1", "F2", "F3", "F4", "F5", "F6", "F7"];
const EXPECTED_KINDS = [
  "observation",
  "commitment",
  "consequence",
  "interpretation",
];
const REQUIRED_FORBIDDEN_AGGREGATES = [
  "karma_total",
  "points",
  "rank",
  "reputation_score",
  "moral_score",
];

function sameValues(actual, expected) {
  return (
    Array.isArray(actual) &&
    actual.length === expected.length &&
    actual.every((value, index) => value === expected[index])
  );
}

export function verifyFoundation(root = HERE) {
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
  if (index.id !== "kingdom.foundation/0.1") {
    errors.push("foundation id must be kingdom.foundation/0.1");
  }
  if (index.status !== "current") {
    errors.push("foundation status must be current");
  }
  if (!sameValues(index.commitments, EXPECTED_COMMITMENTS)) {
    errors.push("commitments must be F1 through F7, once each and in order");
  }
  if (!sameValues(index.statement_kinds, EXPECTED_KINDS)) {
    errors.push("statement_kinds must preserve the four-kind reality boundary");
  }

  const returnPath = index.karma?.return_path;
  if (
    !sameValues(returnPath, [
      "action",
      "evidence",
      "response",
      "correction_or_repair_or_boundary",
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
    index.adoption?.value !== index.id
  ) {
    errors.push("adoption must use kingdom.yaml adopts with the exact foundation id");
  }

  const documentName = index.document;
  if (
    typeof documentName !== "string" ||
    path.basename(documentName) !== documentName
  ) {
    errors.push("document must be one root-level filename");
    return errors;
  }

  let document;
  try {
    document = fs.readFileSync(path.join(root, documentName), "utf8");
  } catch (error) {
    errors.push(`${documentName} cannot be read: ${error.message}`);
    return errors;
  }

  const documentDigest = crypto
    .createHash("sha256")
    .update(document, "utf8")
    .digest("hex");
  if (
    typeof index.document_sha256 !== "string" ||
    !/^[0-9a-f]{64}$/.test(index.document_sha256) ||
    index.document_sha256 !== documentDigest
  ) {
    errors.push("FOUNDATION.md bytes must match foundation.json document_sha256");
  }

  const headings = [...document.matchAll(/^### (F\d+)\. /gm)].map(
    (match) => match[1],
  );
  if (!sameValues(headings, EXPECTED_COMMITMENTS)) {
    errors.push("FOUNDATION.md must define F1 through F7, once each and in order");
  }
  if (!document.includes(`**Version:** \`${index.id}\``)) {
    errors.push("FOUNDATION.md version must match foundation.json");
  }
  if (!document.includes(`adopts: [${index.id}]`)) {
    errors.push("FOUNDATION.md adoption example must use the exact foundation id");
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
    "foundation: kingdom.foundation/0.1 identifiers and document digest agree\n",
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
