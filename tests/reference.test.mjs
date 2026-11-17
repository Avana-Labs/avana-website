import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { importSource } from "./helpers/import-source.mjs";

const { parseReferenceMarkdown, parseInline, isPlaceholderAddress, isPlaceholderHash, parseAddressBook, splitTableRow } = importSource(
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

const book = parseAddressBook(
  JSON.stringify({
    _comment: "test",
    network: "ethereum-sepolia",
    chainId: 11155111,
    explorer: "https://sepolia.etherscan.io/",
    addresses: {
      "aave.hubs.ethereum": "0x0000000000000000000000000000000000001001",
      "markets.v4.poolId": "0x0000000000000000000000000000000000000000000000000000000000007101",
    },
  }),
  "ethereum-sepolia.json",
);

const keyed = `---
title: Contract Addresses
---

## Ethereum Sepolia
- network: ethereum-sepolia

### Hub

| Name | Description | Address |
| --- | --- | --- |
| Hub | Tier 3. | @{aave.hubs.ethereum} |

#### Lens modules (called only through Lens)

| Name | Address |
| --- | --- |
| Pool | @{markets.v4.poolId} |
`;

test("Network data files fill @{key} cells, chain ID and explorer", () => {
  const used = new Map();
  const doc = parseReferenceMarkdown(keyed, "keyed.md", { books: { "ethereum-sepolia": book }, usedKeys: used });
  const [network] = doc.groups;
  assert.deepEqual(network.network, { id: "ethereum-sepolia", chainId: 11155111, explorer: "https://sepolia.etherscan.io" });
  const [table, details] = network.sections[0].blocks;
  assert.equal(table.table.rows[0][2], "0x0000000000000000000000000000000000001001");
  assert.equal(details.type, "details");
  assert.equal(details.title, "Lens modules (called only through Lens)");
  assert.equal(details.blocks[0].table.rows[0][1], book.addresses["markets.v4.poolId"]);
  assert.deepEqual([...used.get("ethereum-sepolia")].sort(), ["aave.hubs.ethereum", "markets.v4.poolId"]);
});

test("A missing key or a bad address in a network file stops the build", () => {
  assert.throws(
    () => parseReferenceMarkdown(keyed.replace("aave.hubs.ethereum", "aave.hubs.base"), "x.md", { books: { "ethereum-sepolia": book } }),
    /@\{aave\.hubs\.base\} is not in networks\/ethereum-sepolia\.json/,
  );
  assert.throws(() => parseReferenceMarkdown(keyed, "x.md"), /needs a numeric chainId/, "a network without its data file");
  assert.throws(
    () => parseReferenceMarkdown(`${keyed}\n## All networks\n\n### Shared\n\nSee @{aave.hubs.ethereum}.\n`, "x.md", { books: { "ethereum-sepolia": book } }),
    /needs a network group with a data file/,
  );
  assert.throws(
    () => parseAddressBook(JSON.stringify({ network: "x", chainId: 1, explorer: "https://e.xyz", addresses: { a: "0x12" } })),
    /"a" must be a 20-byte address or a 32-byte hash/,
  );
  assert.equal(isPlaceholderHash(book.addresses["markets.v4.poolId"]), true);
  assert.equal(isPlaceholderHash("0xe63e32b2ae40601662f760d6bf5d771057324fbd97784fe1d3717069f7b75d45"), false);
});

const books = {};
if (existsSync("content/reference/networks")) {
  for (const file of readdirSync("content/reference/networks").filter((name) => name.endsWith(".json"))) {
    const parsed = parseAddressBook(readFileSync(`content/reference/networks/${file}`, "utf8"), file);
    books[parsed.network] = parsed;
  }
}

for (const name of ["addresses", "parameters", "access-controls"]) {
  const file = `content/reference/${name}.md`;
  test(`content/reference/${name}.md parses and every network has an explorer`, { skip: !existsSync(file) }, () => {
    const doc = parseReferenceMarkdown(readFileSync(file, "utf8"), `${name}.md`, { books });
    assert.ok(doc.title && doc.description, "front matter needs a title and a description");
    const networks = doc.groups.filter((group) => group.network);
    assert.ok(networks.length > 0, "at least one network group");
    for (const group of doc.groups) {
      assert.ok(group.sections.length > 0, `${group.title} has sections`);
      for (const section of group.sections) {
        for (const block of section.blocks) {
          if (block.type !== "table") continue;
          assert.ok(!block.table.headers.includes("Status"), `${section.title}: no Status column`);
        }
      }
    }
  });
}

test("Contract Addresses tables have exactly Name, Description and Address", { skip: !existsSync("content/reference/addresses.md") }, () => {
  const doc = parseReferenceMarkdown(readFileSync("content/reference/addresses.md", "utf8"), "addresses.md", { books });
  const tables = doc.groups.flatMap((group) => group.sections.flatMap((section) => section.blocks))
    .flatMap((block) => (block.type === "details" ? block.blocks : [block]))
    .filter((block) => block.type === "table");
  assert.ok(tables.length > 0);
  for (const block of tables) assert.deepEqual(block.table.headers, ["Name", "Description", "Address"]);
});

test("Every network file address is used on a page", { skip: Object.keys(books).length === 0 }, () => {
  const usedKeys = new Map();
  for (const name of ["addresses", "parameters", "access-controls"]) {
    parseReferenceMarkdown(readFileSync(`content/reference/${name}.md`, "utf8"), name, { books, usedKeys });
  }
  for (const [network, data] of Object.entries(books)) {
    const unused = Object.keys(data.addresses).filter((key) => !key.startsWith("_") && !usedKeys.get(network)?.has(key));
    assert.deepEqual(unused, [], `networks/${network}.json has keys no page shows`);
  }
});
