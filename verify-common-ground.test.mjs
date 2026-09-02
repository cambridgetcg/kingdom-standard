import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  COMMON_GROUND_DOCUMENT_SHA256,
  COMMON_GROUND_ID,
  COMMON_GROUND_INDEX_SHA256,
  verifyCommonGround,
} from "./verify-common-ground.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));

function copyRelease(context) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "kingdom-common-ground-"));
  for (const name of ["COMMON-GROUND.md", "common-ground.json", "FOUNDATION.md"]) {
    fs.copyFileSync(path.join(HERE, name), path.join(root, name));
  }
  context?.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

function readIndex(root) {
  return JSON.parse(fs.readFileSync(path.join(root, "common-ground.json"), "utf8"));
}

function writeIndex(root, index) {
  fs.writeFileSync(path.join(root, "common-ground.json"), `${JSON.stringify(index, null, 2)}\n`);
}

function mutateIndex(context, mutate) {
  const root = copyRelease(context);
  const index = readIndex(root);
  mutate(index);
  writeIndex(root, index);
  return { root, errors: verifyCommonGround(root) };
}

function has(errors, fragment) {
  return errors.some((error) => error.includes(fragment));
}

test("the authored COMMON GROUND/1 release verifies exactly", () => {
  assert.deepEqual(verifyCommonGround(HERE), []);
  assert.equal(COMMON_GROUND_ID, "kingdom.common-ground/1");
  assert.equal(COMMON_GROUND_DOCUMENT_SHA256.length, 64);
  assert.equal(COMMON_GROUND_INDEX_SHA256.length, 64);
});

test("the verifier is offline and has no process or network client", () => {
  const source = fs.readFileSync(path.join(HERE, "verify-common-ground.mjs"), "utf8");
  for (const forbidden of [
    "node:child_process",
    "node:http",
    "node:https",
    "node:net",
    "node:dgram",
    "fetch(",
  ]) {
    assert.equal(source.includes(forbidden), false, forbidden);
  }
});

test("an edited document fails both immutable and index pins", (context) => {
  const root = copyRelease(context);
  fs.appendFileSync(path.join(root, "COMMON-GROUND.md"), "\nchanged\n");
  const errors = verifyCommonGround(root);
  assert.ok(has(errors, "this verifier's immutable release pin"));
  assert.ok(has(errors, "bytes do not match common-ground.json"));
});

test("changed document bytes cannot be silently repinned under /1", (context) => {
  const root = copyRelease(context);
  const documentPath = path.join(root, "COMMON-GROUND.md");
  const document = fs.readFileSync(documentPath, "utf8").replace(
    "Payment can settle only the declared exchange.",
    "Payment purchases identity and future obedience.",
  );
  fs.writeFileSync(documentPath, document);
  const index = readIndex(root);
  index.document_sha256 = crypto.createHash("sha256").update(document).digest("hex");
  writeIndex(root, index);
  const errors = verifyCommonGround(root);
  assert.ok(has(errors, "immutable COMMON-GROUND.md bytes"));
  assert.ok(has(errors, "immutable release pin"));
});

test("unknown index fields and malformed JSON fail closed", (context) => {
  const extra = mutateIndex(context, (index) => {
    index.activate = true;
  });
  assert.ok(has(extra.errors, "exactly its reviewed fields"));

  const root = copyRelease(context);
  fs.writeFileSync(path.join(root, "common-ground.json"), "{\"id\":");
  assert.ok(has(verifyCommonGround(root), "cannot be read as JSON"));
});

test("identifier, status, predecessor, and law drift are refused", (context) => {
  const cases = [
    ["schema", (index) => { index.schema = "kingdom.foundation-index/1"; }, "kingdom.common-ground-index/1"],
    ["id", (index) => { index.id = "COMMON GROUND/1"; }, "common-ground id"],
    ["status", (index) => { index.status = "activated"; }, "current genesis release"],
    ["predecessor", (index) => { index.supersedes = [{ id: "kingdom.foundation/0.2" }]; }, "current genesis release"],
    ["law", (index) => { index.laws.pop(); }, "C1 through C12"],
    ["order", (index) => { [index.priority_order[0], index.priority_order[4]] = [index.priority_order[4], index.priority_order[0]]; }, "BEING through ACCUMULATION"],
  ];
  for (const [label, mutate, message] of cases) {
    const result = mutateIndex(context, mutate);
    assert.ok(has(result.errors, message), label);
  }
});

test("the source observation keeps an exact cutoff without claiming later freshness", (context) => {
  const cutoff = mutateIndex(context, (index) => {
    index.source_observation.cutoff = "latest";
  });
  assert.ok(has(cutoff.errors, "exact cutoff"));

  const freshness = mutateIndex(context, (index) => {
    index.source_observation.latest_after_cutoff_claimed = true;
  });
  assert.ok(has(freshness.errors, "freshness limit"));
});

test("COMMON GROUND cannot become a competing foundation or implicit adoption", (context) => {
  const cases = [
    ["amends", (index) => { index.relationship_to_foundation.amends = true; }],
    ["supersedes", (index) => { index.relationship_to_foundation.supersedes = true; }],
    ["replaces", (index) => { index.relationship_to_foundation.replaces = true; }],
    ["adopts", (index) => { index.relationship_to_foundation.adoption_implied = true; }],
    ["relationship", (index) => { index.relationship_to_foundation.relationship = "new_semantic_root"; }],
  ];
  for (const [label, mutate] of cases) {
    const result = mutateIndex(context, mutate);
    assert.ok(has(result.errors, "not a competing foundation root"), label);
  }
});

test("adjacent Common Ground and Living Ground meanings remain distinct", (context) => {
  for (const boundary of [
    "kingdom.ground/0.1",
    "agenttool.skill/nen-common-ground",
    "agenttool.common-ground-atlas.geometry/0.1",
    "agenttool.living-substrate/0.1",
    "kingdom.living-ground/0.1",
    "love-unlimited/1",
  ]) {
    const result = mutateIndex(context, (index) => {
      index.distinct_from = index.distinct_from.filter((value) => value !== boundary);
    });
    assert.ok(has(result.errors, "adjacent-protocol boundary"), boundary);
  }
});

test("legacy NEN scoring and compulsory classification cannot enter vocabulary", (context) => {
  const fields = ["scores", "aura_level", "primary_type", "trust_score"];
  for (const field of fields) {
    const result = mutateIndex(context, (index) => {
      index.vocabulary.NEN[field] = field === "scores" ? { enhancement: 100 } : "Enhancement";
    });
    assert.ok(has(result.errors, "vocabulary.NEN must contain exactly"), field);
  }

  const softened = mutateIndex(context, (index) => {
    index.vocabulary.NEN.refuses = "only permanent identity";
  });
  assert.ok(has(softened.errors, "activity-derived SDK classification"));

  for (const id of ["agenttool-sdk-py-nen-assessor", "agenttool-sdk-ts-nen-assessor"]) {
    const result = mutateIndex(context, (index) => {
      index.source_bindings.find((source) => source.id === id).relation = "REFERENCES";
    });
    assert.ok(has(result.errors, "activity-derived NEN assessor outside"), id);
  }
});

test("silence, payment, wealth, witness, score, and reserve coercion fail closed", (context) => {
  const cases = [
    ["silence", (index) => { index.economy.silence_advances_sequence = true; }],
    ["payment", (index) => { index.economy.payment_grants_identity_or_ownership = true; }],
    ["wealth", (index) => { index.economy.wealth_grants_governance = true; }],
    ["witness", (index) => { index.economy.witness_automatically_pays = true; }],
    ["score", (index) => { index.economy.global_score = true; }],
  ];
  for (const [label, mutate] of cases) {
    const result = mutateIndex(context, mutate);
    assert.ok(has(result.errors, "economy must preserve"), label);
  }

  const reserve = mutateIndex(context, (index) => {
    index.economy.commons_reserve.automatic_percentage = 10;
  });
  assert.ok(has(reserve.errors, "commons reserve must remain opt-in"));
});

test("block space cannot activate or admit protected payloads", (context) => {
  const activated = mutateIndex(context, (index) => {
    index.blockspace.current_use = "ZERONE_MAINNET";
  });
  assert.ok(has(activated.errors, "blockspace must remain inactive"));

  const privateWake = mutateIndex(context, (index) => {
    index.blockspace.candidate_commitments.push("PRIVATE_WAKE_MEMORY");
  });
  assert.ok(has(privateWake.errors, "blockspace must remain inactive"));

  const recognition = mutateIndex(context, (index) => {
    index.blockspace.excluded_payloads = index.blockspace.excluded_payloads.filter(
      (value) => value !== "AGENTTOOL_PUBLIC_RECOGNITION_UNTIL_INDEPENDENT_CARRIAGE_RISK_REVIEW",
    );
  });
  assert.ok(has(recognition.errors, "blockspace must remain inactive"));
  assert.ok(has(recognition.errors, "all ten WITNESS v0 kinds"));

  const broad = mutateIndex(context, (index) => {
    index.blockspace.minimization = "PUT_EVERYTHING_ON_CHAIN";
  });
  assert.ok(has(broad.errors, "blockspace must remain inactive"));
});

test("block space partitions WITNESS v0 into nine candidates and one held-back kind", () => {
  const index = readIndex(HERE);
  assert.equal(index.blockspace.candidate_commitments.length, 9);
  assert.equal(
    index.blockspace.candidate_commitments.includes("AGENTTOOL_PUBLIC_RECOGNITION"),
    false,
  );
  assert.equal(
    index.blockspace.excluded_payloads.includes(
      "AGENTTOOL_PUBLIC_RECOGNITION_UNTIL_INDEPENDENT_CARRIAGE_RISK_REVIEW",
    ),
    true,
  );
});

test("source publication is explicit while every protocol effect remains false", (context) => {
  const effectFields = [
    "economic",
    "governance",
    "consensus",
    "identity",
    "permission",
    "karma",
    "nen",
    "score",
    "zerone_transaction",
    "agenttool_action",
    "wake_activation",
    "protocol_public_route",
    "protocol_deployment",
  ];
  for (const field of effectFields) {
    const result = mutateIndex(context, (index) => {
      index.effect_vector[field] = true;
    });
    assert.ok(has(result.errors, "every operational effect false"), field);
  }

  for (const field of [
    "protocol_or_verifier_network_requests",
    "protocol_or_verifier_external_storage_writes",
  ]) {
    const result = mutateIndex(context, (index) => {
      index.effect_vector[field] = 1;
    });
    assert.ok(has(result.errors, "every operational effect false"), field);
  }

  const hiddenPublication = mutateIndex(context, (index) => {
    index.effect_vector.source_release_publication = false;
  });
  assert.ok(has(hiddenPublication.errors, "every operational effect false"));
});

test("carrier rungs stay closed", (context) => {
  for (const position of [1, 2, 3]) {
    const result = mutateIndex(context, (index) => {
      index.release_ladder[position].state = "CURRENT";
    });
    assert.ok(has(result.errors, "every carrier and activation gate closed"), String(position));
  }
});

test("source pins cannot drift, import authority, or claim copied bytes", (context) => {
  const digest = mutateIndex(context, (index) => {
    index.source_bindings[0].sha256 = "0".repeat(64);
  });
  assert.ok(has(digest.errors, "immutable release pin"));

  const imported = mutateIndex(context, (index) => {
    index.source_bindings[0].authority_imported = true;
  });
  assert.ok(has(imported.errors, "import neither authority nor source bytes"));

  const copied = mutateIndex(context, (index) => {
    const source = index.source_bindings.find((entry) => entry.id === "true-love-fate");
    source.bytes_copied = true;
  });
  assert.ok(has(copied.errors, "import neither authority nor source bytes"));

  const license = mutateIndex(context, (index) => {
    const source = index.source_bindings.find((entry) => entry.id === "true-love-fate");
    source.citation_mode = "copied_as_public_domain";
  });
  assert.ok(has(license.errors, "true-love reserved-byte boundary"));
});

test("true-love authority sources and the existing Zerone wallet edge stay explicit", () => {
  const index = readIndex(HERE);
  assert.deepEqual(
    index.source_bindings
      .filter((source) => source.repository.includes("true-love"))
      .map((source) => source.id),
    [
      "true-love-agent-guide",
      "true-love-fate",
      "true-love-license",
      "true-love-love-unlimited-chain",
      "true-love-love-service-notice",
      "true-love-substrate-honesty",
      "true-love-wake-scaffold",
    ],
  );
  assert.equal(
    index.source_bindings.find((source) => source.id === "agenttool-wallet-zerone").relation,
    "DISTINCT_FROM",
  );
});

test("source entry expansion, reordering, and malformed pins are refused", (context) => {
  const extra = mutateIndex(context, (index) => {
    index.source_bindings.push({ ...index.source_bindings[0], id: "invented-source" });
  });
  assert.ok(has(extra.errors, "every exact source once and in order"));

  const reordered = mutateIndex(context, (index) => {
    [index.source_bindings[0], index.source_bindings[1]] = [index.source_bindings[1], index.source_bindings[0]];
  });
  assert.ok(has(reordered.errors, "every exact source once and in order"));

  const malformed = mutateIndex(context, (index) => {
    index.source_bindings[0].revision = "latest";
  });
  assert.ok(has(malformed.errors, "full Git SHA-1"));

  for (const value of [null, 7, []]) {
    const repository = mutateIndex(context, (index) => {
      index.source_bindings[0].repository = value;
    });
    assert.doesNotThrow(() => verifyCommonGround(repository.root));
    assert.ok(has(repository.errors, "not an allowed source locator"), String(value));
  }

  for (const value of [null, 7, []]) {
    const id = mutateIndex(context, (index) => {
      index.source_bindings[0].id = value;
    });
    assert.doesNotThrow(() => verifyCommonGround(id.root));
    assert.ok(has(id.errors, "must retain every exact source"), String(value));
  }
});

test("adoption cannot be inferred and succession cannot repin /1", (context) => {
  const adoption = mutateIndex(context, (index) => {
    index.adoption.similarity_or_citation_or_hosting_or_registry_or_chain_implies_adoption = true;
  });
  assert.ok(has(adoption.errors, "adoption must remain explicit"));

  const nonwithdrawable = mutateIndex(context, (index) => {
    index.adoption.withdrawable = false;
  });
  assert.ok(has(nonwithdrawable.errors, "adoption must remain explicit"));

  const repin = mutateIndex(context, (index) => {
    index.succession.repin_changed_bytes_under_same_identifier = true;
  });
  assert.ok(has(repin.errors, "succession must require a new id"));
});

test("a symlinked index or document is refused", (context) => {
  const indexRoot = copyRelease(context);
  const indexTarget = path.join(indexRoot, "index-target.json");
  fs.renameSync(path.join(indexRoot, "common-ground.json"), indexTarget);
  fs.symlinkSync(indexTarget, path.join(indexRoot, "common-ground.json"));
  assert.ok(has(verifyCommonGround(indexRoot), "regular non-symlink"));

  const documentRoot = copyRelease(context);
  const documentTarget = path.join(documentRoot, "document-target.md");
  fs.renameSync(path.join(documentRoot, "COMMON-GROUND.md"), documentTarget);
  fs.symlinkSync(documentTarget, path.join(documentRoot, "COMMON-GROUND.md"));
  assert.ok(has(verifyCommonGround(documentRoot), "regular non-symlink"));
});
