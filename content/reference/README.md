# Reference page sources

The developer Reference pages render these files at build time:

| File | Page |
| --- | --- |
| `addresses.md` | Contract Addresses, `/developers/reference/addresses` |
| `parameters.md` | Market Parameters, `/developers/reference/parameters` |
| `access-controls.md` | Access Control, `/developers/reference/access-controls` |
| `networks/<network>.json` | Every address the three pages show for one network |

## Where they come from

The source of truth is kept outside this repository, next to the protocol team's reference notes. These files are copies. Do not edit them here; edit the source and sync.

```bash
# default source: ../avana-internal-references/reference/site-reference
AVANA_REFERENCE_DIR=/path/to/site-reference npm run sync:reference
```

The sync script checks every network file, parses each page against them, and stops if a page names a key that a network file lacks. It warns about network-file keys that no page shows. Commit the updated copies; the build reads only this folder, so CI and Vercel never need the outside folder. `npm run sync:reference -- --check` exits non-zero when the committed copies differ from the source.

## Deploying a network

Addresses live only in `networks/<network>.json`, so a deployment swaps those files and nothing else:

1. In the source folder, replace the placeholder values in `networks/ethereum-sepolia.json` and `networks/base-sepolia.json` with the deployed addresses. Each key is the address's path in the release manifest (see below).
2. Run `npm run sync:reference` here and commit the result.

## Network files

```json
{
  "network": "ethereum-sepolia",
  "chainId": 11155111,
  "explorer": "https://sepolia.etherscan.io",
  "addresses": { "aave.hubs.ethereum": "0x…", "avana.timelock": "0x…" }
}
```

Keys follow the release manifest (`packages/protocol/src/manifest/types.ts` in the monorepo). A list entry is named by its label, asset, artifact or kind instead of its index where the manifest has one:

| Key | Manifest value |
| --- | --- |
| `aave.hubs.<label>`, `aave.borrowSpokes.<label>`, `aave.lendSpokes.<label>` | the entry with that `label`, its `address` |
| `avana.<contract>` | `avana.<contract>.address` |
| `avana.lpVaults.<kind>` | the `lpVaults` entry with that `kind` |
| `avana.lensModules.<Contract>` | the `lensModules` entry whose `artifact` is that contract |
| `avana.firstLossReserves.<SYMBOL>`, `avana.daoDeficitOffsets.<SYMBOL>` | the entry whose `asset` is that token |
| `avana.operatorHelpers.0`, `avana.operatorHelpers.0.fundingSafe` | the first operator helper, its `address` and `fundingSafe` |
| `debtReserves.<SYMBOL>.debtOracle` | the debt reserve of that asset, its `debtOracle.address` |
| `markets.<market>.pool`, `.poolId`, `.referencePool` | the market listed under that name in the Hub file, its `pool` (Uniswap v3, Aero Slipstream), `poolId` (Uniswap v4) and Uniswap v3 reference pool |
| `external.<group>.<name>` | the `external` entry with that `group` and `name` |
| `create3Factory`, `feeRecipient`, `sequencerFeed`, `aave.accessManager`, `aave.v3Pool`, `uniswapV4.poolManager` | the top-level value at that path |
| `roles.<holder>`, `roles.keepers.<n>` | the role table value |

Keys starting with `_` are comments. A value must be a 20-byte address or, for a Uniswap v4 PoolId, a 32-byte hash. Placeholders start with 30 zero hex digits (56 for a PoolId): the page tags them "Placeholder" and gives them no explorer link.

## Page format

`src/lib/reference/markdown.ts` parses the pages:

- Front matter with `title`, `description` and `updated`.
- `## ` starts a group. A group that opens with a `- network: <id>` line is a network; its chain ID and explorer come from `networks/<id>.json`. The page's network selector switches between network groups. Other groups show on every network.
- `### ` starts a section (one entry in the page's section rail). Sections hold paragraphs, GFM tables and `> ` notes.
- `#### ` inside a section starts a collapsed group, closed by default, that runs to the next `#### ` heading or the end of the section.
- `@{key}` inside a network group is replaced by that key's value from the network's file. A key the file lacks stops the build.
- Table cells allow plain text, inline `code`, `**bold**` and `[links](https://…)`. A link that starts with `/` stays in the reader's language. Escape a literal pipe as `\|`. Every row needs the header's number of cells.
- A cell holding one 20-byte address renders truncated, with a copy button and a link to the network's explorer. A 32-byte hash (for example a Uniswap v4 PoolId) renders truncated with a copy button.
