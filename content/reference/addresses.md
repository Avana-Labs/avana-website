---
title: Addresses
description: Contract addresses of Avana, the Aave V4 Hub and Spokes it uses, and the external contracts it depends on, per network.
updated: 2026-11-16
---

Avana is a lending protocol on Aave V4: users pledge AMM liquidity positions as collateral and borrow against them. This page lists the contracts of each network: the Avana Hub and its Spokes, the contracts Avana deploys, and the external contracts and tokens Avana depends on.

Avana is deployed first on Ethereum Sepolia and Base Sepolia; Ethereum and Base mainnet follow later. Every address on this page is a placeholder until the Sepolia deployment. Each release's addresses are also recorded in its release manifest.

## Ethereum Sepolia
- network: ethereum-sepolia
- chainId: 11155111
- explorer: https://sepolia.etherscan.io

One Hub with the Lend Spoke and seven CDP Spokes: five on Uniswap v3 with 21 markets, and two on Uniswap v4 with 8 markets that wait for the Uniswap v4 integration.

### Hub

| Contract | Purpose | Address |
| --- | --- | --- |
| Avana Ethereum Hub | Standard, unmodified Aave V4 Hub behind a proxy owned by the Aave DAO, at tier 3 so it takes stable, correlated and volatile markets; it is the only Avana Hub on Ethereum and holds the lent assets and vault-token collateral of every Spoke below (REQ-HUB-001, monorepo #135). | 0x0000000000000000000000000000000000001001 |

### Spokes

Every Spoke is a standard Aave V4 Spoke owned by the Aave DAO and attached to the Hub above. Borrowers reach a CDP Spoke only through the AaveAdapter, which gives each wallet its own PositionProxy per Spoke and market.

| Contract | Purpose | Markets | Status | Address |
| --- | --- | --- | --- | --- |
| Lend Spoke | Supply-only Aave V4 Spoke, owned by the Aave DAO, where any lender, the Aave DAO treasury included, supplies the assets Avana borrowers draw; the Hub has one Lend Spoke (REQ-HUB-016, monorepo #135). | USDC, USDT, GHO, DAI, USDS, WETH, WBTC, cbBTC, wstETH | Planned | 0x0000000000000000000000000000000000001002 |
| Uniswap v3 Stable | Aave V4 CDP Spoke, owned by the Aave DAO, where positions in Uniswap v3 stablecoin pools are collateral for borrowing USDC, USDT and GHO (REQ-HUB-003). | USDC/USDT, AUSD/USDC, DAI/USDC, DAI/USDT | Planned | 0x0000000000000000000000000000000000001003 |
| Uniswap v3 Blue-chip | Aave V4 CDP Spoke, owned by the Aave DAO, where positions in Uniswap v3 ETH, BTC and stablecoin pools are collateral for borrowing USDC, USDT and WETH (REQ-HUB-003). | WETH/USDC, WETH/USDT, WBTC/WETH, WBTC/USDT, WBTC/USDC | Planned | 0x0000000000000000000000000000000000001004 |
| Uniswap v3 Correlated ETH | Aave V4 CDP Spoke, owned by the Aave DAO, where positions in Uniswap v3 ETH staking token/WETH pools are collateral for borrowing WETH (REQ-HUB-003). | wstETH/WETH, weETH/WETH, rETH/WETH | Planned | 0x0000000000000000000000000000000000001005 |
| Uniswap v3 Correlated BTC | Aave V4 CDP Spoke, owned by the Aave DAO, where positions in Uniswap v3 BTC token/WBTC pools are collateral for borrowing WBTC (REQ-HUB-003). | cirBTC/WBTC, kBTC/WBTC, tBTC/WBTC | Planned | 0x0000000000000000000000000000000000001006 |
| Uniswap v3 Gov/DeFi | Aave V4 CDP Spoke, owned by the Aave DAO, where positions in Uniswap v3 governance and DeFi token pools are collateral for borrowing USDC and WETH (REQ-HUB-003). | UNI/WETH, LINK/WETH, AAVE/WETH, ENA/WETH, ONDO/WETH, SKY/WETH | Planned | 0x0000000000000000000000000000000000001007 |
| Uniswap v4 Stable | Aave V4 CDP Spoke, owned by the Aave DAO, where positions in Uniswap v4 stablecoin pools are collateral for borrowing USDC, USDT and GHO; it lists markets once the Uniswap v4 integration is deployed (REQ-HUB-003, REQ-AMM-V4-001). | PYUSD/USDS, USDT/USDS, RLUSD/USDS, USDe/USDC, GHO/USDC | Pending (Uniswap v4 integration) | 0x0000000000000000000000000000000000001008 |
| Uniswap v4 Correlated BTC | Aave V4 CDP Spoke, owned by the Aave DAO, where positions in Uniswap v4 BTC token/cbBTC pools are collateral for borrowing WBTC and cbBTC; it lists markets once the Uniswap v4 integration is deployed (REQ-HUB-003, REQ-AMM-V4-001). | WBTC/cbBTC, LBTC/cbBTC, BTC.b/cbBTC | Pending (Uniswap v4 integration) | 0x0000000000000000000000000000000000001009 |

> The Lend Spoke's Markets cell lists the assets lenders supply. Each CDP Spoke has its own AaveOracle, created with the Spoke; read its address from the Spoke's `ORACLE()` (EXT-003).

### Uniswap v4 markets

The markets of the two Uniswap v4 Spokes, by pool. Each also names a Uniswap v3 reference pool for the TWAP cross-check, since hookless v4 pools keep no price history.

| Market | PoolId | v3 reference pool | Status |
| --- | --- | --- | --- |
| PYUSD/USDS | 0xe63e32b2ae40601662f760d6bf5d771057324fbd97784fe1d3717069f7b75d45 | TBD | Pending (Uniswap v4 integration) |
| USDT/USDS | 0x3b1b1f2e775a6db1664f8e7d59ad568605ea2406312c11aef03146c0cf89d5b9 | TBD | Pending (Uniswap v4 integration) |
| RLUSD/USDS | 0x9035721b23481db3888fd201b9c2b26dbc3af60258bca65e669f2ed98dc8eb4f | TBD | Pending (Uniswap v4 integration) |
| USDe/USDC | 0x56fc29b86900aa0afa6e20b020429bffba1105cfb45070492c67529b46eb48c1 | TBD | Pending (Uniswap v4 integration) |
| GHO/USDC | 0xb3ec039dd452a0c23404fec0bcaf6a6e4e1111469f2bfe7b7b5f41a0e366c03c | TBD | Pending (Uniswap v4 integration) |
| WBTC/cbBTC | 0xbf8fc52a30d6500e86c681f082d3524e35fb4ceb21ded8c13c6ce3968690adc6 | TBD | Pending (Uniswap v4 integration) |
| LBTC/cbBTC | 0x90512722b19945c7ec2746e34f45c301a5dadc830bb669056fa5fd5ad943e06e | TBD | Pending (Uniswap v4 integration) |
| BTC.b/cbBTC | 0x9c25d738109ff9ad10516f5f97ef24b9af51a9aa3db4b3b5728edf18a2d3f11c | TBD | Pending (Uniswap v4 integration) |

### Avana core

The contracts Avana deploys on this chain. MarketRegistry, ParameterStore, RiskModule, AaveAdapter and LPVaultSwap are upgradeable: the address below is the fixed proxy, and the AvanaTimelock is its only admin.

| Contract | Purpose | Address |
| --- | --- | --- |
| AvanaTimelock | Owns and upgrades every Avana contract on this chain: each change waits out a delay, and only the Avana governance Safe and the Aave governance executor can propose one (REQ-ACCESS-027). | 0x0000000000000000000000000000000000001010 |
| MarketRegistry | Records every Hub, CDP Spoke, AMM integration, market, debt reserve and swap route Avana lists on this chain, and holds each Hub's pause switch (Q-312). | 0x0000000000000000000000000000000000001011 |
| ParameterStore | Stores every Avana risk parameter on this chain with its hard bounds and the direction in which it may change (Q-317). | 0x0000000000000000000000000000000000001012 |
| RiskModule | Runs every Avana risk check (caps, circuit breakers, price freshness, Aave configuration drift) on pledges, borrows and withdrawals, and holds no funds (Q-308). | 0x0000000000000000000000000000000000001013 |
| AaveAdapter | The single entry point for borrowers: pledge, borrow, repay, withdraw, repay with collateral and fee collection all go through it to the user's PositionProxy (REQ-ADAPTER-001). | 0x0000000000000000000000000000000000001014 |
| LPVaultSwap | Runs every liquidation of an Avana account on this chain and is the only address that can receive seized vault tokens (Q-348, REQ-HUB-055). | 0x0000000000000000000000000000000000001015 |
| Lock | Shared reentrancy lock of the AaveAdapter and LPVaultSwap that stops a second entry into Avana inside one transaction (Q-318). | 0x0000000000000000000000000000000000001016 |
| Collateralization | Backing ledger of every pledged position: it records how many units each position backs, so every vault token stays fully backed (REQ-COLL-001). | 0x0000000000000000000000000000000000001017 |
| VaultTokenFactory | Registers the LPVault of each AMM integration and deploys one vault token per CDP Spoke and market. | 0x0000000000000000000000000000000000001018 |
| ProxyManager | Creates each user's PositionProxy, one per wallet, CDP Spoke and market, at an address fixed by those three values (REQ-PROXY-001). | 0x0000000000000000000000000000000000001019 |
| PayoutEscrow | Holds a liquidation payout that could not be sent to its recipient, such as a borrower's surplus, until the recipient claims it (REQ-ESCROW-001). | 0x0000000000000000000000000000000000001020 |
| Lens | Read-only contract that returns account, market, price, risk and liquidation state in one call for the app, keepers and monitoring; no Avana contract depends on it (REQ-LENS-001). | 0x0000000000000000000000000000000000001021 |
| AvanaCreate3Factory | Deploys Avana contracts at addresses that depend only on the deployer and a salt, so every address is known before deployment (`00_Factories.s.sol`). | 0x0000000000000000000000000000000000001022 |

> The LPVault of each AMM integration is listed under Periphery and integrations.

Loss layers and debt price sources. One Avana Umbrella and one DAO deficit offset per debt asset of the Hub (USDC, USDT, GHO, WETH, WBTC and cbBTC), and one DebtOracle per debt asset other than GHO (REQ-HUB-021).

| Contract | Purpose | Address |
| --- | --- | --- |
| Avana Umbrella (First-Loss Reserve), USDC | Avana's first-loss capital for USDC on this Hub: funded by Avana Labs, it covers deficits Aave records on Avana CDP Spokes before any other layer (REQ-FLR-001). | 0x0000000000000000000000000000000000001023 |
| DAO deficit offset, USDC | Second loss layer for USDC on this Hub, funded by the Aave DAO treasury, which pays a deficit only once the USDC Avana Umbrella is empty or deactivated (REQ-FLR-046). | 0x0000000000000000000000000000000000001024 |
| Avana Umbrella (First-Loss Reserve), USDT | Avana's first-loss capital for USDT on this Hub: funded by Avana Labs, it covers deficits Aave records on Avana CDP Spokes before any other layer (REQ-FLR-001). | 0x0000000000000000000000000000000000001025 |
| DAO deficit offset, USDT | Second loss layer for USDT on this Hub, funded by the Aave DAO treasury, which pays a deficit only once the USDT Avana Umbrella is empty or deactivated (REQ-FLR-046). | 0x0000000000000000000000000000000000001026 |
| Avana Umbrella (First-Loss Reserve), GHO | Avana's first-loss capital for GHO on this Hub: funded by Avana Labs, it covers deficits Aave records on Avana CDP Spokes before any other layer (REQ-FLR-001). | 0x0000000000000000000000000000000000001027 |
| DAO deficit offset, GHO | Second loss layer for GHO on this Hub, funded by the Aave DAO treasury, which pays a deficit only once the GHO Avana Umbrella is empty or deactivated (REQ-FLR-046). | 0x0000000000000000000000000000000000001028 |
| Avana Umbrella (First-Loss Reserve), WETH | Avana's first-loss capital for WETH on this Hub: funded by Avana Labs, it covers deficits Aave records on Avana CDP Spokes before any other layer (REQ-FLR-001). | 0x0000000000000000000000000000000000001029 |
| DAO deficit offset, WETH | Second loss layer for WETH on this Hub, funded by the Aave DAO treasury, which pays a deficit only once the WETH Avana Umbrella is empty or deactivated (REQ-FLR-046). | 0x0000000000000000000000000000000000001030 |
| Avana Umbrella (First-Loss Reserve), WBTC | Avana's first-loss capital for WBTC on this Hub: funded by Avana Labs, it covers deficits Aave records on Avana CDP Spokes before any other layer (REQ-FLR-001). | 0x0000000000000000000000000000000000001031 |
| DAO deficit offset, WBTC | Second loss layer for WBTC on this Hub, funded by the Aave DAO treasury, which pays a deficit only once the WBTC Avana Umbrella is empty or deactivated (REQ-FLR-046). | 0x0000000000000000000000000000000000001032 |
| Avana Umbrella (First-Loss Reserve), cbBTC | Avana's first-loss capital for cbBTC on this Hub: funded by Avana Labs, it covers deficits Aave records on Avana CDP Spokes before any other layer (REQ-FLR-001). | 0x0000000000000000000000000000000000001033 |
| DAO deficit offset, cbBTC | Second loss layer for cbBTC on this Hub, funded by the Aave DAO treasury, which pays a deficit only once the cbBTC Avana Umbrella is empty or deactivated (REQ-FLR-046). | 0x0000000000000000000000000000000000001034 |
| DebtOracle, USDC | Price source of the USDC debt reserve on every CDP Spoke's AaveOracle, with failover to an alternate and a standby route (REQ-ORACLE-091, REQ-HUB-022). | 0x0000000000000000000000000000000000001035 |
| DebtOracle, USDT | Price source of the USDT debt reserve on every CDP Spoke's AaveOracle, with failover to an alternate and a standby route (REQ-ORACLE-091, REQ-HUB-022). | 0x0000000000000000000000000000000000001036 |
| DebtOracle, WETH | Price source of the WETH debt reserve on every CDP Spoke's AaveOracle, with failover to an alternate and a standby route (REQ-ORACLE-091, REQ-HUB-022). | 0x0000000000000000000000000000000000001037 |
| DebtOracle, WBTC | Price source of the WBTC debt reserve on every CDP Spoke's AaveOracle, with failover to an alternate and a standby route (REQ-ORACLE-091, REQ-HUB-022). | 0x0000000000000000000000000000000000001038 |
| DebtOracle, cbBTC | Price source of the cbBTC debt reserve on every CDP Spoke's AaveOracle, with failover to an alternate and a standby route (REQ-ORACLE-091, REQ-HUB-022). | 0x0000000000000000000000000000000000001039 |

Implementations and logic contracts. These hold the code that the proxies above and the per-market oracle proxies run.

| Contract | Purpose | Address |
| --- | --- | --- |
| MarketRegistry implementation | Current code behind the MarketRegistry proxy; only the AvanaTimelock can replace it (REQ-ACCESS-002). | 0x0000000000000000000000000000000000001040 |
| ParameterStore implementation | Current code behind the ParameterStore proxy; only the AvanaTimelock can replace it (REQ-ACCESS-002). | 0x0000000000000000000000000000000000001041 |
| RiskModule implementation | Current code behind the RiskModule proxy; only the AvanaTimelock can replace it (REQ-ACCESS-002). | 0x0000000000000000000000000000000000001042 |
| AaveAdapter implementation | Current code behind the AaveAdapter proxy; only the AvanaTimelock can replace it (REQ-ACCESS-002). | 0x0000000000000000000000000000000000001043 |
| LPVaultSwap implementation | Current code behind the LPVaultSwap proxy; only the AvanaTimelock can replace it (REQ-ACCESS-002). | 0x0000000000000000000000000000000000001044 |
| LPOracle implementation (Uniswap v3) | Code behind every Uniswap v3 market's LPOracle proxy, which gives AaveOracle the USD price of that market's vault token (Q-321, Q-376). | 0x0000000000000000000000000000000000001045 |
| LPOracle module logic (Uniswap v3) | Concentrated-liquidity pricing code that the LPOracle logic contracts run in each market's LPOracle. | 0x0000000000000000000000000000000000001046 |
| LPOracle poke logic (Uniswap v3) | Code of the LPOracle's `poke()`, which records feed outages and disagreements as they are observed (REQ-ORACLE-026). | 0x0000000000000000000000000000000000001047 |
| LPOracle init logic (Uniswap v3) | Code of the market part of the LPOracle's `initialize`, run once when a market's LPOracle is deployed. | 0x0000000000000000000000000000000000001048 |
| LPOracle listing logic (Uniswap v3) | Code of the LPOracle's configuration checks, run when a market's LPOracle is initialized. | 0x0000000000000000000000000000000000001049 |
| LPOracle view logic (Uniswap v3) | Code of the LPOracle's price views, including the `latestAnswer()` that AaveOracle reads. | 0x0000000000000000000000000000000000001050 |
| DebtOracle implementation | Code behind each DebtOracle proxy above; only the AvanaTimelock can replace it (REQ-ORACLE-091). | 0x0000000000000000000000000000000000001051 |

> The logic contracts each upgradeable proxy forwards to are recorded in the release manifest.

Lens modules. The Lens forwards each view to one of these read-only contracts.

| Contract | Purpose | Address |
| --- | --- | --- |
| LensAccountModule | Serves the Lens account views and close-account sizing. | 0x0000000000000000000000000000000000001052 |
| LensMarketModule | Serves the Lens views of one market. | 0x0000000000000000000000000000000000001053 |
| LensPriceModule | Serves the Lens price, debt-price and pause-state views and deleverage sizing. | 0x0000000000000000000000000000000000001054 |
| LensLiquidationModule | Serves the Lens liquidation preview. | 0x0000000000000000000000000000000000001055 |
| LensRiskModule | Serves the Lens risk and Hub-asset views. | 0x0000000000000000000000000000000000001056 |
| LensPreviewModule | Serves the Lens action previews. | 0x0000000000000000000000000000000000001057 |
| LensMarketsModule | Serves the Lens market list and fee views. | 0x0000000000000000000000000000000000001058 |
| LensPositionsModule | Serves the Lens position views, available actions and maximum-withdraw sizing. | 0x0000000000000000000000000000000000001059 |
| LensSpeedModule | Serves the Lens speed-limit views: how much a borrow can take now under the RiskModule's speed windows (REQ-LENS-061). | 0x0000000000000000000000000000000000001060 |
| LensAaveSizing | Aave V4's liquidation sizing, compiled from the pinned Aave V4 release, that the Lens liquidation preview uses. | 0x0000000000000000000000000000000000001061 |

> Each market also has its own vault token (deployed by the VaultTokenFactory), its own LPOracle proxy and a primary and a backup swap route (`DexPathRoute`) per token and debt asset. Those addresses belong to the market and are listed with it, not here (REQ-ROUTE-001, `09_ListMarkets.s.sol`).

### Periphery and integrations

| Contract | Purpose | Address |
| --- | --- | --- |
| Uniswap v3 integration (LPVault) | Holds every Uniswap v3 position pledged on this chain and unwinds it on exit or liquidation; immutable, with no owner (REQ-VAULT-001, REQ-AMM-V3-001). | 0x0000000000000000000000000000000000001062 |
| Uniswap v4 integration (LPVault) | Will hold every pledged Uniswap v4 position of a hookless pool; pending: its code and spec (2.23 Uniswap v4 integration) are on an open branch and it is not deployed yet (REQ-AMM-V4-001). | TBD |
| AaveV3FlashSource | Lends LPVaultSwap the debt asset from the Aave V3 Pool for one call so a borrower can repay with collateral (`deleverage`) (REQ-FLASH-001). | 0x0000000000000000000000000000000000001063 |
| FlashLiquidator | Public flash liquidation helper: anyone can liquidate an account without holding the debt asset, which the helper borrows from the Aave V3 Pool and repays in the same transaction (REQ-HELPER-010). | 0x0000000000000000000000000000000000001064 |
| OperatorFlashLiquidator | A keeper operator's own flash liquidation helper: only its signer can call it, and funds come from and return to the operator's funding wallet; one is deployed per keeper instance (REQ-HELPER-011). | 0x0000000000000000000000000000000000001065 |
| AvanaGasVault | Holds the chain's native gas token and refills Avana's own keeper signers up to a per-signer cap over any 24 hours; anyone can trigger a top-up, and no core contract calls it (REQ-GASV-001, Q-413). | 0x0000000000000000000000000000000000001066 |

> Swap routes are immutable contracts deployed per market, token and debt asset at listing, one primary and one backup, and recorded in the MarketRegistry (REQ-ROUTE-001, REQ-ROUTE-017).

### External dependencies

Contracts Avana relies on but does not deploy on mainnet. On the Sepolia networks Avana deploys test instances of them from the pinned sources (`01_DeployAaveV4.s.sol`, `02_DeployWorld.s.sol`).

| Contract | Purpose | Address |
| --- | --- | --- |
| Aave V4 AccessManager | Holds the Aave V4 roles of this chain and is the authority of every Avana Umbrella and DAO deficit offset (EXT-005). | 0x0000000000000000000000000000000000003001 |
| Aave V4 standard Spoke implementation | Audited Spoke code every CDP Spoke must run; the MarketRegistry refuses a Spoke whose proxy points elsewhere (REQ-HUB-099). | 0x0000000000000000000000000000000000003002 |
| Aave V4 HubConfigurator | Aave DAO payloads configure the Hub through it; no Avana contract calls it (REQ-HUB-004). | 0x0000000000000000000000000000000000003003 |
| Aave V4 SpokeConfigurator | Aave DAO payloads configure the Spokes through it, and the Aave Protocol Guardian freezes or pauses reserves through it; no Avana contract calls it (REQ-HUB-004). | 0x0000000000000000000000000000000000003004 |
| Aave GHO fixed price source | Price source of the GHO debt reserve on every CDP Spoke's AaveOracle, fixed at $1; a test stand-in on the Sepolia networks (REQ-HUB-022). | 0x0000000000000000000000000000000000003005 |
| Aave governance executor | Owns every Hub and Spoke of this chain, and can propose and cancel Avana timelock operations (REQ-ACCESS-027, EXT-005). | 0x0000000000000000000000000000000000003006 |
| Aave Protocol Guardian | Can freeze and pause Avana reserves on Aave, and holds Avana's pause, freeze and cancel roles (REQ-HUB-066). | 0x0000000000000000000000000000000000003007 |
| Aave V3 Pool | Lends the debt asset to the AaveV3FlashSource and the flash liquidation helpers (EXT-030). | 0x0000000000000000000000000000000000003008 |
| Aave V3 ACLManager | Grants the flash borrower role that lets the AaveV3FlashSource and the public FlashLiquidator borrow without a fee (EXT-012). | 0x0000000000000000000000000000000000003009 |
| Uniswap v3 Factory | Avana derives each Uniswap v3 market's pool from it and refuses any pool it did not create; it also supplies the v3 reference pools of the Uniswap v4 markets (EXT-007). | 0x0000000000000000000000000000000000003010 |
| Uniswap v3 NonfungiblePositionManager | Issues the Uniswap v3 position NFTs that users pledge; the Uniswap v3 LPVault accepts positions of this contract only (EXT-006). | 0x0000000000000000000000000000000000003011 |
| Uniswap v4 PoolManager | Holds every Uniswap v4 pool; the Uniswap v4 integration will read positions and remove liquidity through it once deployed (REQ-AMM-V4-001). | 0x0000000000000000000000000000000000003012 |
| Uniswap v4 StateView | Read-only view of Uniswap v4 pool state, deployed beside the PoolManager; no Avana contract calls it. | 0x0000000000000000000000000000000000003013 |
| Uniswap v4 PositionManager | Issues the Uniswap v4 position NFTs that users will pledge once the Uniswap v4 integration is deployed (REQ-AMM-V4-001). | 0x0000000000000000000000000000000000003014 |
| Chainlink USDC/USD | Primary USD price feed of USDC, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000003015 |
| Chainlink USDT/USD | Primary USD price feed of USDT, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000003016 |
| Chainlink GHO/USD | Primary price feed of GHO, used for monitoring only; Aave prices GHO with its fixed $1 source (EXT-008, `09_ListMarkets.s.sol`). | 0x0000000000000000000000000000000000003017 |
| Chainlink DAI/USD | Primary USD price feed of DAI, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000003018 |
| Chainlink AUSD/USD | Primary USD price feed of AUSD, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000003019 |
| Chainlink USDS/USD | Primary USD price feed of USDS, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000003020 |
| Chainlink PYUSD/USD | Primary USD price feed of PYUSD, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000003021 |
| Chainlink RLUSD/USD | Primary USD price feed of RLUSD, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000003022 |
| Chainlink USDe/USD | Primary USD price feed of USDe, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000003023 |
| Chainlink WETH/USD | Primary USD price feed of WETH, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000003024 |
| Chainlink wstETH/USD | Primary USD price feed of wstETH, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000003025 |
| Chainlink weETH/USD | Primary USD price feed of weETH, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000003026 |
| Chainlink rETH/USD | Primary USD price feed of rETH, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000003027 |
| Chainlink WBTC/USD | Primary USD price feed of WBTC, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000003028 |
| Chainlink cbBTC/USD | Primary USD price feed of cbBTC, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000003029 |
| Chainlink cirBTC/USD | Primary USD price feed of cirBTC, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000003030 |
| Chainlink kBTC/USD | Primary USD price feed of kBTC, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000003031 |
| Chainlink tBTC/USD | Primary USD price feed of tBTC, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000003032 |
| Chainlink LBTC/USD | Primary USD price feed of LBTC, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000003033 |
| Chainlink BTC.b/USD | Primary USD price feed of BTC.b, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000003034 |
| Chainlink UNI/USD | Primary USD price feed of UNI, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000003035 |
| Chainlink AAVE/USD | Primary USD price feed of AAVE, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000003036 |
| Chainlink SKY/USD | Primary USD price feed of SKY, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000003037 |
| Chainlink LINK/USD | Primary USD price feed of LINK, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000003038 |
| Chainlink ENA/USD | Primary USD price feed of ENA, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000003039 |
| Chainlink ONDO/USD | Primary USD price feed of ONDO, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000003040 |

> Each token also has an alternate price route, a standby route and an independent second source, recorded in its listing (EXT-009, EXT-024). Their addresses are added when the tokens are listed.

### Assets

The ERC-20 tokens this chain's markets, Lend Spoke and debt reserves use. On the Sepolia networks these are test tokens.

| Contract | Purpose | Address |
| --- | --- | --- |
| USDC | Pool token on the Uniswap v3 Stable, Uniswap v3 Blue-chip and Uniswap v4 Stable Spokes; supplied by lenders on the Lend Spoke; borrowable on the Uniswap v3 Stable, Uniswap v3 Blue-chip, Uniswap v3 Gov/DeFi and Uniswap v4 Stable Spokes. | 0x0000000000000000000000000000000000003041 |
| USDT | Pool token on the Uniswap v3 Stable, Uniswap v3 Blue-chip and Uniswap v4 Stable Spokes; supplied by lenders on the Lend Spoke; borrowable on the Uniswap v3 Stable, Uniswap v3 Blue-chip and Uniswap v4 Stable Spokes. | 0x0000000000000000000000000000000000003042 |
| GHO | Pool token on the Uniswap v4 Stable Spoke; supplied by lenders on the Lend Spoke; borrowable on the Uniswap v3 Stable and Uniswap v4 Stable Spokes, priced at a fixed $1 (EXT-010). | 0x0000000000000000000000000000000000003043 |
| DAI | Pool token on the Uniswap v3 Stable Spoke; supplied by lenders on the Lend Spoke. | 0x0000000000000000000000000000000000003044 |
| AUSD | Pool token on the Uniswap v3 Stable Spoke. | 0x0000000000000000000000000000000000003045 |
| USDS | Pool token on the Uniswap v4 Stable Spoke; supplied by lenders on the Lend Spoke. | 0x0000000000000000000000000000000000003046 |
| PYUSD | Pool token on the Uniswap v4 Stable Spoke. | 0x0000000000000000000000000000000000003047 |
| RLUSD | Pool token on the Uniswap v4 Stable Spoke. | 0x0000000000000000000000000000000000003048 |
| USDe | Pool token on the Uniswap v4 Stable Spoke. | 0x0000000000000000000000000000000000003049 |
| WETH | Pool token on the Uniswap v3 Blue-chip, Uniswap v3 Correlated ETH and Uniswap v3 Gov/DeFi Spokes; supplied by lenders on the Lend Spoke; borrowable on the Uniswap v3 Blue-chip, Uniswap v3 Correlated ETH and Uniswap v3 Gov/DeFi Spokes. | 0x0000000000000000000000000000000000003050 |
| wstETH | Pool token on the Uniswap v3 Correlated ETH Spoke; supplied by lenders on the Lend Spoke. | 0x0000000000000000000000000000000000003051 |
| weETH | Pool token on the Uniswap v3 Correlated ETH Spoke. | 0x0000000000000000000000000000000000003052 |
| rETH | Pool token on the Uniswap v3 Correlated ETH Spoke. | 0x0000000000000000000000000000000000003053 |
| WBTC | Pool token on the Uniswap v3 Blue-chip, Uniswap v3 Correlated BTC and Uniswap v4 Correlated BTC Spokes; supplied by lenders on the Lend Spoke; borrowable on the Uniswap v3 Correlated BTC and Uniswap v4 Correlated BTC Spokes. | 0x0000000000000000000000000000000000003054 |
| cbBTC | Pool token on the Uniswap v4 Correlated BTC Spoke; supplied by lenders on the Lend Spoke; borrowable on the Uniswap v4 Correlated BTC Spoke. | 0x0000000000000000000000000000000000003055 |
| cirBTC | Pool token on the Uniswap v3 Correlated BTC Spoke. | 0x0000000000000000000000000000000000003056 |
| kBTC | Pool token on the Uniswap v3 Correlated BTC Spoke. | 0x0000000000000000000000000000000000003057 |
| tBTC | Pool token on the Uniswap v3 Correlated BTC Spoke. | 0x0000000000000000000000000000000000003058 |
| LBTC | Pool token on the Uniswap v4 Correlated BTC Spoke. | 0x0000000000000000000000000000000000003059 |
| BTC.b | Pool token on the Uniswap v4 Correlated BTC Spoke. | 0x0000000000000000000000000000000000003060 |
| UNI | Pool token on the Uniswap v3 Gov/DeFi Spoke. | 0x0000000000000000000000000000000000003061 |
| AAVE | Pool token on the Uniswap v3 Gov/DeFi Spoke. | 0x0000000000000000000000000000000000003062 |
| SKY | Pool token on the Uniswap v3 Gov/DeFi Spoke. | 0x0000000000000000000000000000000000003063 |
| LINK | Pool token on the Uniswap v3 Gov/DeFi Spoke. | 0x0000000000000000000000000000000000003064 |
| ENA | Pool token on the Uniswap v3 Gov/DeFi Spoke. | 0x0000000000000000000000000000000000003065 |
| ONDO | Pool token on the Uniswap v3 Gov/DeFi Spoke. | 0x0000000000000000000000000000000000003066 |

## Base Sepolia
- network: base-sepolia
- chainId: 84532
- explorer: https://sepolia.basescan.org

One Hub with the Lend Spoke and three CDP Spokes on Aero Slipstream with 14 markets.

### Hub

| Contract | Purpose | Address |
| --- | --- | --- |
| Avana Base Hub | Standard, unmodified Aave V4 Hub behind a proxy owned by the Aave DAO, at tier 3 so it takes stable, correlated and volatile markets; it is the only Avana Hub on Base and holds the lent assets and vault-token collateral of every Spoke below (REQ-HUB-001, monorepo #135). | 0x0000000000000000000000000000000000002001 |

### Spokes

Every Spoke is a standard Aave V4 Spoke owned by the Aave DAO and attached to the Hub above. Borrowers reach a CDP Spoke only through the AaveAdapter, which gives each wallet its own PositionProxy per Spoke and market.

| Contract | Purpose | Markets | Status | Address |
| --- | --- | --- | --- | --- |
| Lend Spoke | Supply-only Aave V4 Spoke, owned by the Aave DAO, where any lender, the Aave DAO treasury included, supplies the assets Avana borrowers draw; the Hub has one Lend Spoke (REQ-HUB-016, monorepo #135). | USDC, WETH, cbBTC | Planned | 0x0000000000000000000000000000000000002002 |
| Aero Slipstream Blue-chip | Aave V4 CDP Spoke, owned by the Aave DAO, where positions in Aero Slipstream ETH, BTC and stablecoin pools are collateral for borrowing USDC and WETH (REQ-HUB-003). | WETH/USDC, USDC/cbBTC, WETH/cbBTC, WETH/USDT | Planned | 0x0000000000000000000000000000000000002003 |
| Aero Slipstream Gov/DeFi | Aave V4 CDP Spoke, owned by the Aave DAO, where positions in Aero Slipstream governance and DeFi token pools are collateral for borrowing USDC and WETH (REQ-HUB-003). | AERO/WETH, WETH/MORPHO, WETH/AAVE, VIRTUAL/WETH | Planned | 0x0000000000000000000000000000000000002004 |
| Aero Slipstream Stocks | Aave V4 CDP Spoke, owned by the Aave DAO, where positions in Aero Slipstream tokenized stock/USDC pools are collateral for borrowing USDC (REQ-HUB-003). | AMZNc/USDC, SNDKc/USDC, GOOGLc/USDC, NVDAc/USDC, SPCXc/USDC, METAc/USDC | Planned | 0x0000000000000000000000000000000000002005 |

> The Lend Spoke's Markets cell lists the assets lenders supply. Each CDP Spoke has its own AaveOracle, created with the Spoke; read its address from the Spoke's `ORACLE()` (EXT-003).

### Avana core

The contracts Avana deploys on this chain. MarketRegistry, ParameterStore, RiskModule, AaveAdapter and LPVaultSwap are upgradeable: the address below is the fixed proxy, and the AvanaTimelock is its only admin.

| Contract | Purpose | Address |
| --- | --- | --- |
| AvanaTimelock | Owns and upgrades every Avana contract on this chain: each change waits out a delay, and only the Avana governance Safe and the Aave governance executor can propose one (REQ-ACCESS-027). | 0x0000000000000000000000000000000000002006 |
| MarketRegistry | Records every Hub, CDP Spoke, AMM integration, market, debt reserve and swap route Avana lists on this chain, and holds each Hub's pause switch (Q-312). | 0x0000000000000000000000000000000000002007 |
| ParameterStore | Stores every Avana risk parameter on this chain with its hard bounds and the direction in which it may change (Q-317). | 0x0000000000000000000000000000000000002008 |
| RiskModule | Runs every Avana risk check (caps, circuit breakers, price freshness, Aave configuration drift) on pledges, borrows and withdrawals, and holds no funds (Q-308). | 0x0000000000000000000000000000000000002009 |
| AaveAdapter | The single entry point for borrowers: pledge, borrow, repay, withdraw, repay with collateral and fee collection all go through it to the user's PositionProxy (REQ-ADAPTER-001). | 0x0000000000000000000000000000000000002010 |
| LPVaultSwap | Runs every liquidation of an Avana account on this chain and is the only address that can receive seized vault tokens (Q-348, REQ-HUB-055). | 0x0000000000000000000000000000000000002011 |
| Lock | Shared reentrancy lock of the AaveAdapter and LPVaultSwap that stops a second entry into Avana inside one transaction (Q-318). | 0x0000000000000000000000000000000000002012 |
| Collateralization | Backing ledger of every pledged position: it records how many units each position backs, so every vault token stays fully backed (REQ-COLL-001). | 0x0000000000000000000000000000000000002013 |
| VaultTokenFactory | Registers the LPVault of each AMM integration and deploys one vault token per CDP Spoke and market. | 0x0000000000000000000000000000000000002014 |
| ProxyManager | Creates each user's PositionProxy, one per wallet, CDP Spoke and market, at an address fixed by those three values (REQ-PROXY-001). | 0x0000000000000000000000000000000000002015 |
| PayoutEscrow | Holds a liquidation payout that could not be sent to its recipient, such as a borrower's surplus, until the recipient claims it (REQ-ESCROW-001). | 0x0000000000000000000000000000000000002016 |
| Lens | Read-only contract that returns account, market, price, risk and liquidation state in one call for the app, keepers and monitoring; no Avana contract depends on it (REQ-LENS-001). | 0x0000000000000000000000000000000000002017 |
| AvanaCreate3Factory | Deploys Avana contracts at addresses that depend only on the deployer and a salt, so every address is known before deployment (`00_Factories.s.sol`). | 0x0000000000000000000000000000000000002018 |

> The LPVault of each AMM integration is listed under Periphery and integrations.

Loss layers and debt price sources. One Avana Umbrella and one DAO deficit offset per debt asset of the Hub (USDC and WETH), and one DebtOracle per debt asset other than GHO (REQ-HUB-021).

| Contract | Purpose | Address |
| --- | --- | --- |
| Avana Umbrella (First-Loss Reserve), USDC | Avana's first-loss capital for USDC on this Hub: funded by Avana Labs, it covers deficits Aave records on Avana CDP Spokes before any other layer (REQ-FLR-001). | 0x0000000000000000000000000000000000002019 |
| DAO deficit offset, USDC | Second loss layer for USDC on this Hub, funded by the Aave DAO treasury, which pays a deficit only once the USDC Avana Umbrella is empty or deactivated (REQ-FLR-046). | 0x0000000000000000000000000000000000002020 |
| Avana Umbrella (First-Loss Reserve), WETH | Avana's first-loss capital for WETH on this Hub: funded by Avana Labs, it covers deficits Aave records on Avana CDP Spokes before any other layer (REQ-FLR-001). | 0x0000000000000000000000000000000000002021 |
| DAO deficit offset, WETH | Second loss layer for WETH on this Hub, funded by the Aave DAO treasury, which pays a deficit only once the WETH Avana Umbrella is empty or deactivated (REQ-FLR-046). | 0x0000000000000000000000000000000000002022 |
| DebtOracle, USDC | Price source of the USDC debt reserve on every CDP Spoke's AaveOracle, with failover to an alternate and a standby route (REQ-ORACLE-091, REQ-HUB-022). | 0x0000000000000000000000000000000000002023 |
| DebtOracle, WETH | Price source of the WETH debt reserve on every CDP Spoke's AaveOracle, with failover to an alternate and a standby route (REQ-ORACLE-091, REQ-HUB-022). | 0x0000000000000000000000000000000000002024 |

Implementations and logic contracts. These hold the code that the proxies above and the per-market oracle proxies run.

| Contract | Purpose | Address |
| --- | --- | --- |
| MarketRegistry implementation | Current code behind the MarketRegistry proxy; only the AvanaTimelock can replace it (REQ-ACCESS-002). | 0x0000000000000000000000000000000000002025 |
| ParameterStore implementation | Current code behind the ParameterStore proxy; only the AvanaTimelock can replace it (REQ-ACCESS-002). | 0x0000000000000000000000000000000000002026 |
| RiskModule implementation | Current code behind the RiskModule proxy; only the AvanaTimelock can replace it (REQ-ACCESS-002). | 0x0000000000000000000000000000000000002027 |
| AaveAdapter implementation | Current code behind the AaveAdapter proxy; only the AvanaTimelock can replace it (REQ-ACCESS-002). | 0x0000000000000000000000000000000000002028 |
| LPVaultSwap implementation | Current code behind the LPVaultSwap proxy; only the AvanaTimelock can replace it (REQ-ACCESS-002). | 0x0000000000000000000000000000000000002029 |
| LPOracle implementation (Aero Slipstream) | Code behind every Aero Slipstream market's LPOracle proxy, which gives AaveOracle the USD price of that market's vault token (Q-321, Q-376). | 0x0000000000000000000000000000000000002030 |
| LPOracle module logic (Aero Slipstream) | Concentrated-liquidity pricing code that the LPOracle logic contracts run in each market's LPOracle. | 0x0000000000000000000000000000000000002031 |
| LPOracle poke logic (Aero Slipstream) | Code of the LPOracle's `poke()`, which records feed outages and disagreements as they are observed (REQ-ORACLE-026). | 0x0000000000000000000000000000000000002032 |
| LPOracle init logic (Aero Slipstream) | Code of the market part of the LPOracle's `initialize`, run once when a market's LPOracle is deployed. | 0x0000000000000000000000000000000000002033 |
| LPOracle listing logic (Aero Slipstream) | Code of the LPOracle's configuration checks, run when a market's LPOracle is initialized. | 0x0000000000000000000000000000000000002034 |
| LPOracle view logic (Aero Slipstream) | Code of the LPOracle's price views, including the `latestAnswer()` that AaveOracle reads. | 0x0000000000000000000000000000000000002035 |
| DebtOracle implementation | Code behind each DebtOracle proxy above; only the AvanaTimelock can replace it (REQ-ORACLE-091). | 0x0000000000000000000000000000000000002036 |

> The logic contracts each upgradeable proxy forwards to are recorded in the release manifest.

Lens modules. The Lens forwards each view to one of these read-only contracts.

| Contract | Purpose | Address |
| --- | --- | --- |
| LensAccountModule | Serves the Lens account views and close-account sizing. | 0x0000000000000000000000000000000000002037 |
| LensMarketModule | Serves the Lens views of one market. | 0x0000000000000000000000000000000000002038 |
| LensPriceModule | Serves the Lens price, debt-price and pause-state views and deleverage sizing. | 0x0000000000000000000000000000000000002039 |
| LensLiquidationModule | Serves the Lens liquidation preview. | 0x0000000000000000000000000000000000002040 |
| LensRiskModule | Serves the Lens risk and Hub-asset views. | 0x0000000000000000000000000000000000002041 |
| LensPreviewModule | Serves the Lens action previews. | 0x0000000000000000000000000000000000002042 |
| LensMarketsModule | Serves the Lens market list and fee views. | 0x0000000000000000000000000000000000002043 |
| LensPositionsModule | Serves the Lens position views, available actions and maximum-withdraw sizing. | 0x0000000000000000000000000000000000002044 |
| LensSpeedModule | Serves the Lens speed-limit views: how much a borrow can take now under the RiskModule's speed windows (REQ-LENS-061). | 0x0000000000000000000000000000000000002045 |
| LensAaveSizing | Aave V4's liquidation sizing, compiled from the pinned Aave V4 release, that the Lens liquidation preview uses. | 0x0000000000000000000000000000000000002046 |

> Each market also has its own vault token (deployed by the VaultTokenFactory), its own LPOracle proxy and a primary and a backup swap route (`DexPathRoute`) per token and debt asset. Those addresses belong to the market and are listed with it, not here (REQ-ROUTE-001, `09_ListMarkets.s.sol`).

### Periphery and integrations

| Contract | Purpose | Address |
| --- | --- | --- |
| Aero Slipstream integration (LPVault) | Holds every unstaked Aero Slipstream position pledged on this chain, across the four Slipstream factory generations, and unwinds it on exit or liquidation; immutable, with no owner (REQ-VAULT-001, EXT-028). | 0x0000000000000000000000000000000000002047 |
| AaveV3FlashSource | Lends LPVaultSwap the debt asset from the Aave V3 Pool for one call so a borrower can repay with collateral (`deleverage`) (REQ-FLASH-001). | 0x0000000000000000000000000000000000002048 |
| FlashLiquidator | Public flash liquidation helper: anyone can liquidate an account without holding the debt asset, which the helper borrows from the Aave V3 Pool and repays in the same transaction (REQ-HELPER-010). | 0x0000000000000000000000000000000000002049 |
| OperatorFlashLiquidator | A keeper operator's own flash liquidation helper: only its signer can call it, and funds come from and return to the operator's funding wallet; one is deployed per keeper instance (REQ-HELPER-011). | 0x0000000000000000000000000000000000002050 |
| AvanaGasVault | Holds the chain's native gas token and refills Avana's own keeper signers up to a per-signer cap over any 24 hours; anyone can trigger a top-up, and no core contract calls it (REQ-GASV-001, Q-413). | 0x0000000000000000000000000000000000002051 |

> Swap routes are immutable contracts deployed per market, token and debt asset at listing, one primary and one backup, and recorded in the MarketRegistry (REQ-ROUTE-001, REQ-ROUTE-017).

### External dependencies

Contracts Avana relies on but does not deploy on mainnet. On the Sepolia networks Avana deploys test instances of them from the pinned sources (`01_DeployAaveV4.s.sol`, `02_DeployWorld.s.sol`).

| Contract | Purpose | Address |
| --- | --- | --- |
| Aave V4 AccessManager | Holds the Aave V4 roles of this chain and is the authority of every Avana Umbrella and DAO deficit offset (EXT-005). | 0x0000000000000000000000000000000000004001 |
| Aave V4 standard Spoke implementation | Audited Spoke code every CDP Spoke must run; the MarketRegistry refuses a Spoke whose proxy points elsewhere (REQ-HUB-099). | 0x0000000000000000000000000000000000004002 |
| Aave V4 HubConfigurator | Aave DAO payloads configure the Hub through it; no Avana contract calls it (REQ-HUB-004). | 0x0000000000000000000000000000000000004003 |
| Aave V4 SpokeConfigurator | Aave DAO payloads configure the Spokes through it, and the Aave Protocol Guardian freezes or pauses reserves through it; no Avana contract calls it (REQ-HUB-004). | 0x0000000000000000000000000000000000004004 |
| Aave governance executor | Owns every Hub and Spoke of this chain, and can propose and cancel Avana timelock operations (REQ-ACCESS-027, EXT-005). | 0x0000000000000000000000000000000000004005 |
| Aave Protocol Guardian | Can freeze and pause Avana reserves on Aave, and holds Avana's pause, freeze and cancel roles (REQ-HUB-066). | 0x0000000000000000000000000000000000004006 |
| Aave V3 Pool | Lends the debt asset to the AaveV3FlashSource and the flash liquidation helpers (EXT-030). | 0x0000000000000000000000000000000000004007 |
| Aave V3 ACLManager | Grants the flash borrower role that lets the AaveV3FlashSource and the public FlashLiquidator borrow without a fee (EXT-012). | 0x0000000000000000000000000000000000004008 |
| Aero Slipstream factory (Initial) | Slipstream pool factory of the Initial generation; Avana derives a market's pool from the factory of that market's generation (EXT-028). | 0x0000000000000000000000000000000000004009 |
| Aero Slipstream position manager (Initial) | Issues the Slipstream position NFTs of the Initial generation that users pledge; each market binds one factory and position manager pair (EXT-028). | 0x0000000000000000000000000000000000004010 |
| Aero Slipstream factory (Gauge Caps) | Slipstream pool factory of the Gauge Caps generation; Avana derives a market's pool from the factory of that market's generation (EXT-028). | 0x0000000000000000000000000000000000004011 |
| Aero Slipstream position manager (Gauge Caps) | Issues the Slipstream position NFTs of the Gauge Caps generation that users pledge; each market binds one factory and position manager pair (EXT-028). | 0x0000000000000000000000000000000000004012 |
| Aero Slipstream factory (Gauges V3) | Slipstream pool factory of the Gauges V3 generation; Avana derives a market's pool from the factory of that market's generation (EXT-028). | 0x0000000000000000000000000000000000004013 |
| Aero Slipstream position manager (Gauges V3) | Issues the Slipstream position NFTs of the Gauges V3 generation that users pledge; each market binds one factory and position manager pair (EXT-028). | 0x0000000000000000000000000000000000004014 |
| Aero Slipstream factory (Aero) | Slipstream pool factory of the Aero generation; Avana derives a market's pool from the factory of that market's generation (EXT-028). | 0x0000000000000000000000000000000000004015 |
| Aero Slipstream position manager (Aero) | Issues the Slipstream position NFTs of the Aero generation that users pledge; each market binds one factory and position manager pair (EXT-028). | 0x0000000000000000000000000000000000004016 |
| Chainlink L2 Sequencer Uptime feed | Tells Avana whether the Base sequencer is up; prices count as fresh again only after a grace period following a restart (EXT-029). | 0x0000000000000000000000000000000000004017 |
| Chainlink USDC/USD | Primary USD price feed of USDC, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000004018 |
| Chainlink USDT/USD | Primary USD price feed of USDT, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000004019 |
| Chainlink WETH/USD | Primary USD price feed of WETH, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000004020 |
| Chainlink cbBTC/USD | Primary USD price feed of cbBTC, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000004021 |
| Chainlink AERO/USD | Primary USD price feed of AERO, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000004022 |
| Chainlink MORPHO/USD | Primary USD price feed of MORPHO, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000004023 |
| Chainlink AAVE/USD | Primary USD price feed of AAVE, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000004024 |
| Chainlink VIRTUAL/USD | Primary USD price feed of VIRTUAL, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000004025 |
| Chainlink AMZNc/USD | Primary USD price feed of the AMZNc tokenized stock, read by the LPOracle of its market (EXT-008). | 0x0000000000000000000000000000000000004026 |
| Chainlink SNDKc/USD | Primary USD price feed of the SNDKc tokenized stock, read by the LPOracle of its market (EXT-008). | 0x0000000000000000000000000000000000004027 |
| Chainlink GOOGLc/USD | Primary USD price feed of the GOOGLc tokenized stock, read by the LPOracle of its market (EXT-008). | 0x0000000000000000000000000000000000004028 |
| Chainlink NVDAc/USD | Primary USD price feed of the NVDAc tokenized stock, read by the LPOracle of its market (EXT-008). | 0x0000000000000000000000000000000000004029 |
| Chainlink SPCXc/USD | Primary USD price feed of the SPCXc tokenized stock, read by the LPOracle of its market (EXT-008). | 0x0000000000000000000000000000000000004030 |
| Chainlink METAc/USD | Primary USD price feed of the METAc tokenized stock, read by the LPOracle of its market (EXT-008). | 0x0000000000000000000000000000000000004031 |

> Each token also has an alternate price route, a standby route and an independent second source, recorded in its listing (EXT-009, EXT-024). Their addresses are added when the tokens are listed.

### Assets

The ERC-20 tokens this chain's markets, Lend Spoke and debt reserves use. On the Sepolia networks these are test tokens.

| Contract | Purpose | Address |
| --- | --- | --- |
| USDC | Pool token on the Aero Slipstream Blue-chip and Aero Slipstream Stocks Spokes; supplied by lenders on the Lend Spoke; borrowable on the Aero Slipstream Blue-chip, Aero Slipstream Gov/DeFi and Aero Slipstream Stocks Spokes. | 0x0000000000000000000000000000000000004032 |
| USDT | Pool token on the Aero Slipstream Blue-chip Spoke. | 0x0000000000000000000000000000000000004033 |
| WETH | Pool token on the Aero Slipstream Blue-chip and Aero Slipstream Gov/DeFi Spokes; supplied by lenders on the Lend Spoke; borrowable on the Aero Slipstream Blue-chip and Aero Slipstream Gov/DeFi Spokes. | 0x0000000000000000000000000000000000004034 |
| cbBTC | Pool token on the Aero Slipstream Blue-chip Spoke; supplied by lenders on the Lend Spoke. | 0x0000000000000000000000000000000000004035 |
| AERO | Pool token on the Aero Slipstream Gov/DeFi Spoke. | 0x0000000000000000000000000000000000004036 |
| MORPHO | Pool token on the Aero Slipstream Gov/DeFi Spoke. | 0x0000000000000000000000000000000000004037 |
| AAVE | Pool token on the Aero Slipstream Gov/DeFi Spoke. | 0x0000000000000000000000000000000000004038 |
| VIRTUAL | Pool token on the Aero Slipstream Gov/DeFi Spoke. | 0x0000000000000000000000000000000000004039 |
| AMZNc | Tokenized stock; pool token on the Aero Slipstream Stocks Spoke. | 0x0000000000000000000000000000000000004040 |
| SNDKc | Tokenized stock; pool token on the Aero Slipstream Stocks Spoke. | 0x0000000000000000000000000000000000004041 |
| GOOGLc | Tokenized stock; pool token on the Aero Slipstream Stocks Spoke. | 0x0000000000000000000000000000000000004042 |
| NVDAc | Tokenized stock; pool token on the Aero Slipstream Stocks Spoke. | 0x0000000000000000000000000000000000004043 |
| SPCXc | Tokenized stock; pool token on the Aero Slipstream Stocks Spoke. | 0x0000000000000000000000000000000000004044 |
| METAc | Tokenized stock; pool token on the Aero Slipstream Stocks Spoke. | 0x0000000000000000000000000000000000004045 |
