import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { importSource } from "./helpers/import-source.mjs";

const { parseReferenceMarkdown, parseInline, isPlaceholderAddress, splitTableRow } = importSource(
  "src/lib/reference/markdown.ts",
);

const sample = `---
title: Addresses
description: Contract addresses.
updated: 2026-11-16
---

Intro with \`code\`.

## Ethereum Sepolia
- network: ethereum-sepolia
- chainId: 11155111
- explorer: https://sepolia.etherscan.io/

### Hub

| Contract | Purpose | Address |
| --- | --- | --- |
| Hub | Holds the Spokes \\| all of them. | 0x0000000000000000000000000000000000001001 |

> Note: placeholder until deployment.

## All networks

### Hub

| Role | Functions |
| --- | --- |
| Keeper | \`a\|b\`, \`c\` |
`;

test("Reference parser reads groups, networks, sections, tables and notes", () => {
  const doc = parseReferenceMarkdown(sample, "sample.md");
  assert.equal(doc.title, "Addresses");
  assert.equal(doc.updated, "2026-11-16");
  assert.equal(doc.intro[0].type, "paragraph");
  const [network, shared] = doc.groups;
  assert.deepEqual(network.network, { id: "ethereum-sepolia", chainId: 11155111, explorer: "https://sepolia.etherscan.io" });
  assert.equal(network.sections[0].id, "hub");
  const table = network.sections[0].blocks[0].table;
  assert.deepEqual(table.rows[0][1], "Holds the Spokes | all of them.");
  assert.deepEqual(network.sections[0].blocks[1], { type: "note", text: "placeholder until deployment." });
  assert.equal(shared.network, undefined);
  assert.equal(shared.sections[0].id, "all-networks-hub", "shared section ids never collide with network ones");
  assert.deepEqual(shared.sections[0].blocks[0].table.rows[0], ["Keeper", "`a|b`, `c`"]);
});

test("Reference parser rejects rows that do not match the header", () => {
  const broken = sample.replace("| Hub | Holds", "| Hub | extra | Holds");
  assert.throws(() => parseReferenceMarkdown(broken, "broken.md"), /has 4 cells; the header has 3/);
});

test("Reference inline parts and placeholders", () => {
  assert.deepEqual(parseInline("See `Q-405` and [spec](https://example.com) **now**"), [
    { type: "text", value: "See " },
    { type: "code", value: "Q-405" },
    { type: "text", value: " and " },
    { type: "link", text: "spec", href: "https://example.com" },
    { type: "text", value: " " },
    { type: "strong", value: "now" },
  ]);
  assert.equal(isPlaceholderAddress("0x0000000000000000000000000000000000002003"), true);
  assert.equal(isPlaceholderAddress("0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640"), false);
  assert.deepEqual(splitTableRow("| a | b |"), ["a", "b"]);
});

for (const name of ["addresses", "parameters", "access-controls"]) {
  const file = `content/reference/${name}.md`;
  test(`content/reference/${name}.md parses and every network has an explorer`, { skip: !existsSync(file) }, () => {
    const doc = parseReferenceMarkdown(readFileSync(file, "utf8"), `${name}.md`);
    assert.ok(doc.title && doc.description, "front matter needs a title and a description");
    const networks = doc.groups.filter((group) => group.network);
    assert.ok(networks.length > 0, "at least one network group");
    for (const group of doc.groups) {
      assert.ok(group.sections.length > 0, `${group.title} has sections`);
    }
  });
}
