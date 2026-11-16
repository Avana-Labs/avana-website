# Reference page sources

The developer Reference pages render these Markdown files at build time:

| File | Page |
| --- | --- |
| `addresses.md` | `/developers/reference/addresses` |
| `parameters.md` | `/developers/reference/parameters` |
| `access-controls.md` | `/developers/reference/access-controls` |

## Where they come from

The source of truth is kept outside this repository, next to the protocol team's reference notes. These files are copies. Do not edit them here; edit the source and sync.

```bash
# default source: ../avana-internal-references/reference/site-reference
AVANA_REFERENCE_DIR=/path/to/site-reference npm run sync:reference
```

The sync script parses each file before copying it and stops if one does not parse. Commit the updated copies; the build reads only this folder, so CI and Vercel never need the outside folder. `npm run sync:reference -- --check` exits non-zero when the committed copies differ from the source.

When Sepolia (and later mainnet) goes live: replace the placeholder addresses and values in the source files, run the sync, commit and deploy.

## Format

`src/lib/reference/markdown.ts` parses the files:

- Front matter with `title`, `description` and `updated`.
- `## ` starts a group. A group that opens with a `- network:`, `- chainId:`, `- explorer:` list is a network; the page's network selector switches between network groups. Other groups show on every network.
- `### ` starts a section (one entry in the page's section rail). Sections hold paragraphs, GFM tables and `> ` notes.
- Table cells allow plain text, inline `code`, `**bold**` and `[links](https://…)`. Escape a literal pipe as `\|`. Every row needs the header's number of cells.
- A cell holding one 20-byte address renders truncated, with a copy button and a link to the network's explorer. An address whose first 30 hex digits are zero is a placeholder: it gets a "Placeholder" tag and no explorer link. A 32-byte hash (for example a Uniswap v4 PoolId) renders truncated with a copy button.
