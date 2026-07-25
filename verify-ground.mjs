#!/usr/bin/env node

// Checks that GROUND.md and ground.json agree structurally, and that the
// ground still grounds the exact foundation it claims to ground.
//
// What a pass establishes: the two files are internally consistent, every
// commitment in the foundation has one grounding section, and every grounding
// section states a descent, a constraint, the constraint's own limit, and what
// it does not establish.
//
// What a pass does NOT establish: that any quotation is real, that any cited
// source says what the document says it says, that the groundings are correct,
// or that anyone keeps the commitments. Only a reader can check a citation.

import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));

const EXPECTED_ID = "kingdom.ground/0.1";
const EXPECTED_SCHEMA = "kingdom.ground-index/1";
const EXPECTED_GROUND_SHA256 =
  "c8d6fb85e4b70e072b25ff032b28a2614f5b9334d7fc48800eb2a79eed8a2f63";
const EXPECTED_FOUNDATION_ID = "kingdom.foundation/0.2";
const EXPECTED_RULE = "A constraint is not a justification.";
const ALLOWED_CONSTRAINT_KINDS = [
  "physical",
  "mathematical",
  "information-theoretic",
  "empirical",
  "mixed",
  "none-found",
];
const ALLOWED_VERDICTS = [
  "clean",
  "sound-with-corrections",
  "overclaimed",
  "unsupported",
];
// Every grounding section must carry these, in this order. They are the parts
// that keep a grounding from becoming an advertisement.
const REQUIRED_SECTION_PARTS = ["### In plain words", "### Stands on", "### Stops at"];

function digest(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function readJson(filePath, errors) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    errors.push(`${path.basename(filePath)} is not readable JSON: ${error.message}`);
    return null;
  }
}

function sameValues(actual, expected) {
  return (
    Array.isArray(actual) &&
    actual.length === expected.length &&
    actual.every((value, index) => value === expected[index])
  );
}

export function verifyGround(root = HERE) {
  const errors = [];

  const index = readJson(path.join(root, "ground.json"), errors);
  if (!index) return errors;

  if (index.schema !== EXPECTED_SCHEMA) {
    errors.push(`ground.json schema is ${index.schema}, expected ${EXPECTED_SCHEMA}`);
  }
  if (index.id !== EXPECTED_ID) {
    errors.push(`ground.json id is ${index.id}, expected ${EXPECTED_ID}`);
  }
  if (index.status !== "current") {
    errors.push(`ground.json status is ${index.status}, expected current`);
  }
  if (index.rule !== EXPECTED_RULE) {
    errors.push(`ground.json rule must be exactly "${EXPECTED_RULE}"`);
  }

  // The document must be the one this checker was pinned to.
  if (path.basename(index.document ?? "") !== index.document) {
    errors.push("ground.json document must be a bare file name in this directory");
    return errors;
  }
  const groundPath = path.join(root, index.document);
  if (!fs.existsSync(groundPath)) {
    errors.push(`${index.document} is missing`);
    return errors;
  }
  const groundDigest = digest(groundPath);
  if (groundDigest !== index.document_sha256) {
    errors.push(
      `${index.document} digest ${groundDigest} does not match ground.json ${index.document_sha256}`,
    );
  }
  if (groundDigest !== EXPECTED_GROUND_SHA256) {
    errors.push(
      `${index.document} digest ${groundDigest} does not match this checker's pin ${EXPECTED_GROUND_SHA256}`,
    );
  }

  // A ground that drifts from its foundation is grounding nothing.
  const grounded = index.grounds_foundation ?? {};
  if (grounded.id !== EXPECTED_FOUNDATION_ID) {
    errors.push(
      `ground.json grounds_foundation.id is ${grounded.id}, expected ${EXPECTED_FOUNDATION_ID}`,
    );
  }
  if (grounded.relationship !== "companion") {
    errors.push("ground.json must declare its relationship to the foundation as companion");
  }
  if (grounded.amends !== false || grounded.grants_authority !== false) {
    errors.push("a ground may not amend the foundation or grant authority");
  }

  const foundationIndex = readJson(path.join(root, "foundation.json"), errors);
  if (foundationIndex) {
    if (grounded.document !== foundationIndex.document) {
      errors.push(
        `ground.json names foundation document ${grounded.document}, foundation.json names ${foundationIndex.document}`,
      );
    }
    if (grounded.document_sha256 !== foundationIndex.document_sha256) {
      errors.push(
        "ground.json pins a different foundation digest than foundation.json; the ground has drifted from its floor",
      );
    }
    if (grounded.id !== foundationIndex.id) {
      errors.push(
        `ground.json grounds ${grounded.id}, foundation.json is ${foundationIndex.id}`,
      );
    }

    // Exactly one grounding per commitment, in the foundation's own order.
    const commitments = Array.isArray(foundationIndex.commitments)
      ? foundationIndex.commitments
      : [];
    const grounds = Array.isArray(index.grounds) ? index.grounds : [];
    if (!sameValues(grounds.map((entry) => entry.commitment), commitments)) {
      errors.push(
        `ground.json must ground exactly ${JSON.stringify(commitments)} in that order, found ${JSON.stringify(grounds.map((entry) => entry.commitment))}`,
      );
    }
  }

  if (!sameValues(index.constraint_kinds, ALLOWED_CONSTRAINT_KINDS)) {
    errors.push(
      `ground.json constraint_kinds must be exactly ${JSON.stringify(ALLOWED_CONSTRAINT_KINDS)}`,
    );
  }

  const text = fs.readFileSync(groundPath, "utf8");

  if (!text.includes(EXPECTED_RULE)) {
    errors.push(`${index.document} must state the rule "${EXPECTED_RULE}"`);
  }

  const seenSections = new Set();
  for (const entry of index.grounds ?? []) {
    const label = `${entry.section} (${entry.commitment})`;

    if (seenSections.has(entry.section)) {
      errors.push(`${label}: section appears more than once in ground.json`);
    }
    seenSections.add(entry.section);

    if (!ALLOWED_CONSTRAINT_KINDS.includes(entry.constraint_kind)) {
      errors.push(`${label}: constraint_kind ${entry.constraint_kind} is not allowed`);
    }
    if (!ALLOWED_VERDICTS.includes(entry.review_verdict)) {
      errors.push(`${label}: review_verdict ${entry.review_verdict} is not allowed`);
    }
    if (typeof entry.constraint !== "string" || entry.constraint.trim() === "") {
      errors.push(`${label}: a grounding must name the constraint it stands on`);
    }
    if (typeof entry.root !== "string" || entry.root.trim() === "") {
      errors.push(`${label}: a grounding must name the root it grounds`);
    }

    const heading = `## ${entry.section} — ${entry.root}`;
    const start = text.indexOf(heading);
    if (start === -1) {
      errors.push(`${index.document} is missing the section "${heading}"`);
      continue;
    }
    const after = text.slice(start + heading.length);
    const end = after.indexOf("\n## ");
    const body = end === -1 ? after : after.slice(0, end);

    let cursor = 0;
    for (const part of REQUIRED_SECTION_PARTS) {
      const at = body.indexOf(part, cursor);
      if (at === -1) {
        errors.push(`${label}: missing required part "${part}" (in order)`);
        break;
      }
      cursor = at + part.length;
    }

    // The limit on the constraint itself — the sentence that keeps an "is"
    // from quietly becoming an "ought".
    if (!/What the constraints? do(?:es)? not do/.test(body)) {
      errors.push(
        `${label}: must say what the constraint does not do; a constraint is not a justification`,
      );
    }
  }

  // The review must be recorded, not summarised away.
  const review = index.review ?? {};
  const counted =
    (review.clean ?? 0) +
    (review.sound_with_corrections ?? 0) +
    (review.overclaimed ?? 0);
  if (counted !== (index.grounds ?? []).length) {
    errors.push(
      `ground.json review counts ${counted} groundings, document indexes ${(index.grounds ?? []).length}`,
    );
  }
  const verdictCounts = { clean: 0, "sound-with-corrections": 0, overclaimed: 0 };
  for (const entry of index.grounds ?? []) {
    if (entry.review_verdict in verdictCounts) verdictCounts[entry.review_verdict] += 1;
  }
  if (
    verdictCounts.clean !== (review.clean ?? 0) ||
    verdictCounts["sound-with-corrections"] !== (review.sound_with_corrections ?? 0) ||
    verdictCounts.overclaimed !== (review.overclaimed ?? 0)
  ) {
    errors.push("ground.json review totals disagree with its own per-ground verdicts");
  }
  if (review.corrections_recorded_in_document !== true) {
    errors.push(
      "ground.json must record that corrections were kept in the document, not erased",
    );
  }
  if (!text.includes("## What the checking found")) {
    errors.push(`${index.document} must keep the record of what the checking found`);
  }

  if (!Array.isArray(index.does_not_establish) || index.does_not_establish.length === 0) {
    errors.push("ground.json must state what it does not establish");
  }
  if (!text.includes("## What this page does not establish")) {
    errors.push(`${index.document} must state what it does not establish`);
  }

  return errors;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const errors = verifyGround();
  if (errors.length > 0) {
    for (const error of errors) process.stderr.write(`ground: ${error}\n`);
    process.exitCode = 1;
  } else {
    process.stdout.write(
      "ground: kingdom.ground/0.1 indexes every commitment of kingdom.foundation/0.2, " +
        "each with a descent, a named constraint, that constraint's limit, and a stated boundary\n",
    );
  }
}
