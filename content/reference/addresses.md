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

One Hub with the Lend Spoke and eight CDP Spokes: five on Uniswap v3 and three on Uniswap v4.

### Hub

| Contract | Purpose | Address |
| --- | --- | --- |
| Avana Ethereum Hub | Standard, unmodified Aave V4 Hub behind a proxy owned by the Aave DAO; it holds the lent assets and the vault-token collateral of every Avana Spoke on Ethereum and runs no Avana code (REQ-HUB-001, EXT-001). | 0x0000000000000000000000000000000000001001 |

### Spokes

Every Spoke is a standard Aave V4 Spoke owned by the Aave DAO and attached to the Hub above. Borrowers reach a CDP Spoke only through the AaveAdapter, which gives each wallet its own PositionProxy per Spoke and market.

| Contract | Purpose | Markets | Address |
| --- | --- | --- | --- |
| Lend Spoke | Supply-only Aave V4 Spoke, owned by the Aave DAO, where any lender, the Aave DAO treasury included, supplies the assets Avana borrowers draw; there is one per chain (REQ-HUB-016). | Set by governance | 0x0000000000000000000000000000000000001002 |
| Uniswap v3 Stable | Aave V4 CDP Spoke, owned by the Aave DAO, where positions in Uniswap v3 stablecoin pools are used as collateral to borrow (REQ-HUB-003). | USDC/USDT, AUSD/USDC, DAI/USDC, DAI/USDT | 0x0000000000000000000000000000000000001003 |
| Uniswap v3 Blue-chip | Aave V4 CDP Spoke, owned by the Aave DAO, where positions in Uniswap v3 ETH, BTC and stablecoin pools are used as collateral to borrow (REQ-HUB-003). | WETH/USDC, WETH/USDT, WBTC/WETH, WBTC/USDT, WBTC/USDC | 0x0000000000000000000000000000000000001004 |
| Uniswap v3 Correlated ETH | Aave V4 CDP Spoke, owned by the Aave DAO, where positions in Uniswap v3 ETH staking token/WETH pools are used as collateral to borrow (REQ-HUB-003). | wstETH/WETH, weETH/WETH, rETH/WETH | 0x0000000000000000000000000000000000001005 |
| Uniswap v3 Correlated BTC | Aave V4 CDP Spoke, owned by the Aave DAO, where positions in Uniswap v3 BTC token/WBTC pools are used as collateral to borrow (REQ-HUB-003). | cirBTC/WBTC, kBTC/WBTC, tBTC/WBTC | 0x0000000000000000000000000000000000001006 |
| Uniswap v3 Gov/DeFi | Aave V4 CDP Spoke, owned by the Aave DAO, where positions in Uniswap v3 governance and DeFi token pools are used as collateral to borrow (REQ-HUB-003). | UNI/WETH, LINK/WETH, AAVE/WETH, ENA/WETH, ONDO/WETH, SKY/WETH | 0x0000000000000000000000000000000000001007 |
| Uniswap v4 Stable | Aave V4 CDP Spoke, owned by the Aave DAO, where positions in Uniswap v4 stablecoin pools are used as collateral to borrow; it can list markets only once a Uniswap v4 integration exists (REQ-HUB-003, EXT-032). | PYUSD/USDS, USDT/USDS, RLUSD/USDS, USDe/USDC, GHO/USDC | 0x0000000000000000000000000000000000001008 |
| Uniswap v4 Correlated BTC | Aave V4 CDP Spoke, owned by the Aave DAO, where positions in Uniswap v4 BTC token/cbBTC pools are used as collateral to borrow; it can list markets only once a Uniswap v4 integration exists (REQ-HUB-003, EXT-032). | WBTC/cbBTC, LBTC/cbBTC, BTC.b/cbBTC | 0x0000000000000000000000000000000000001009 |
| Uniswap v4 Gov/DeFi | Aave V4 CDP Spoke, owned by the Aave DAO, where positions in Uniswap v4 governance and DeFi token pools are used as collateral to borrow; it can list markets only once a Uniswap v4 integration exists (REQ-HUB-003, EXT-032). | UNI/USDC, AAVE/USDC, SKY/USDC | 0x0000000000000000000000000000000000001010 |

> Each CDP Spoke has its own AaveOracle, created with the Spoke; read its address from the Spoke's `ORACLE()` (EXT-003).

### Avana core

The contracts Avana deploys on this chain. MarketRegistry, ParameterStore, RiskModule, AaveAdapter and LPVaultSwap are upgradeable: the address below is the fixed proxy, and the AvanaTimelock is its only admin.

| Contract | Purpose | Address |
| --- | --- | --- |
| AvanaTimelock | Owns and upgrades every Avana contract on this chain: each change waits out a delay, and only the Avana governance Safe and the Aave governance executor can propose one (REQ-ACCESS-027). | 0x0000000000000000000000000000000000001011 |
| MarketRegistry | Records every Hub, CDP Spoke, AMM integration, market, debt reserve and swap route Avana lists on this chain, and holds each Hub's pause switch (Q-312). | 0x0000000000000000000000000000000000001012 |
| ParameterStore | Stores every Avana risk parameter on this chain with its hard bounds and the direction in which it may change (Q-317). | 0x0000000000000000000000000000000000001013 |
| RiskModule | Runs every Avana risk check (caps, circuit breakers, price freshness, Aave configuration drift) on pledges, borrows and withdrawals, and holds no funds (Q-308). | 0x0000000000000000000000000000000000001014 |
| AaveAdapter | The single entry point for borrowers: pledge, borrow, repay, withdraw, repay with collateral and fee collection all go through it to the user's PositionProxy (REQ-ADAPTER-001). | 0x0000000000000000000000000000000000001015 |
| LPVaultSwap | Runs every liquidation of an Avana account on this chain and is the only address that can receive seized vault tokens (Q-348, REQ-HUB-055). | 0x0000000000000000000000000000000000001016 |
| Lock | Shared reentrancy lock of the AaveAdapter and LPVaultSwap that stops a second entry into Avana inside one transaction (Q-318). | 0x0000000000000000000000000000000000001017 |
| Collateralization | Backing ledger of every pledged position: it records how many units each position backs, so every vault token stays fully backed (REQ-COLL-001). | 0x0000000000000000000000000000000000001018 |
| VaultTokenFactory | Registers the LPVault of each AMM integration and deploys one vault token per CDP Spoke and market. | 0x0000000000000000000000000000000000001019 |
| ProxyManager | Creates each user's PositionProxy, one per wallet, CDP Spoke and market, at an address fixed by those three values (REQ-PROXY-001). | 0x0000000000000000000000000000000000001020 |
| PayoutEscrow | Holds a liquidation payout that could not be sent to its recipient, such as a borrower's surplus, until the recipient claims it (REQ-ESCROW-001). | 0x0000000000000000000000000000000000001021 |
| Avana Umbrella (First-Loss Reserve), GHO | Avana's first-loss capital for GHO on this Hub: funded by Avana Labs, it covers deficits Aave records on Avana CDP Spokes before any other layer (REQ-FLR-001). | 0x0000000000000000000000000000000000001022 |
| DAO deficit offset, GHO | Second loss layer for GHO on this Hub, funded by the Aave DAO treasury, which pays a deficit only once the Avana Umbrella is empty or deactivated (REQ-FLR-046). | 0x0000000000000000000000000000000000001023 |
| Lens | Read-only contract that returns account, market, price, risk and liquidation state in one call for the app, keepers and monitoring; no Avana contract depends on it (REQ-LENS-001). | 0x0000000000000000000000000000000000001024 |
| AvanaCreate3Factory | Deploys Avana contracts at addresses that depend only on the deployer and a salt, so every address is known before deployment (`00_Factories.s.sol`). | 0x0000000000000000000000000000000000001025 |

> The LPVault of each AMM integration is listed under Periphery and integrations. Further Avana Umbrella and DAO deficit offset pairs are added for each debt asset the Aave DAO approves on this Hub (REQ-HUB-021).

Implementations and logic contracts. These hold the code that the proxies above and the per-market oracle proxies run.

| Contract | Purpose | Address |
| --- | --- | --- |
| MarketRegistry implementation | Current code behind the MarketRegistry proxy; only the AvanaTimelock can replace it (REQ-ACCESS-002). | 0x0000000000000000000000000000000000001026 |
| ParameterStore implementation | Current code behind the ParameterStore proxy; only the AvanaTimelock can replace it (REQ-ACCESS-002). | 0x0000000000000000000000000000000000001027 |
| RiskModule implementation | Current code behind the RiskModule proxy; only the AvanaTimelock can replace it (REQ-ACCESS-002). | 0x0000000000000000000000000000000000001028 |
| AaveAdapter implementation | Current code behind the AaveAdapter proxy; only the AvanaTimelock can replace it (REQ-ACCESS-002). | 0x0000000000000000000000000000000000001029 |
| LPVaultSwap implementation | Current code behind the LPVaultSwap proxy; only the AvanaTimelock can replace it (REQ-ACCESS-002). | 0x0000000000000000000000000000000000001030 |
| LPOracle implementation (Uniswap v3) | Code behind every Uniswap v3 market's LPOracle proxy, which gives AaveOracle the USD price of that market's vault token (Q-321, Q-376). | 0x0000000000000000000000000000000000001031 |
| LPOracle module logic (Uniswap v3) | Concentrated-liquidity pricing code that the LPOracle logic contracts run in each market's LPOracle. | 0x0000000000000000000000000000000000001032 |
| LPOracle poke logic (Uniswap v3) | Code of the LPOracle's `poke()`, which records feed outages and disagreements as they are observed (REQ-ORACLE-026). | 0x0000000000000000000000000000000000001033 |
| LPOracle init logic (Uniswap v3) | Code of the market part of the LPOracle's `initialize`, run once when a market's LPOracle is deployed. | 0x0000000000000000000000000000000000001034 |
| LPOracle listing logic (Uniswap v3) | Code of the LPOracle's configuration checks, run when a market's LPOracle is initialized. | 0x0000000000000000000000000000000000001035 |
| LPOracle view logic (Uniswap v3) | Code of the LPOracle's price views, including the `latestAnswer()` that AaveOracle reads. | 0x0000000000000000000000000000000000001036 |
| DebtOracle implementation | Code behind each DebtOracle proxy, the price source of one non-GHO debt asset (for example USDC or USDT) on every CDP Spoke of this chain (REQ-ORACLE-091). | 0x0000000000000000000000000000000000001037 |

> The logic contracts each upgradeable proxy forwards to are recorded in the release manifest. Each non-GHO debt asset gets its own DebtOracle proxy when its debt reserve is listed (REQ-ORACLE-091).

Lens modules. The Lens forwards each view to one of these read-only contracts.

| Contract | Purpose | Address |
| --- | --- | --- |
| LensAccountModule | Serves the Lens account views and close-account sizing. | 0x0000000000000000000000000000000000001038 |
| LensMarketModule | Serves the Lens views of one market. | 0x0000000000000000000000000000000000001039 |
| LensPriceModule | Serves the Lens price, debt-price and pause-state views and deleverage sizing. | 0x0000000000000000000000000000000000001040 |
| LensLiquidationModule | Serves the Lens liquidation preview. | 0x0000000000000000000000000000000000001041 |
| LensRiskModule | Serves the Lens risk and Hub-asset views. | 0x0000000000000000000000000000000000001042 |
| LensPreviewModule | Serves the Lens action previews. | 0x0000000000000000000000000000000000001043 |
| LensMarketsModule | Serves the Lens market list and fee views. | 0x0000000000000000000000000000000000001044 |
| LensPositionsModule | Serves the Lens position views, available actions and maximum-withdraw sizing. | 0x0000000000000000000000000000000000001045 |
| LensSpeedModule | Serves the Lens speed-limit views: how much a borrow can take now under the RiskModule's speed windows (REQ-LENS-061). | 0x0000000000000000000000000000000000001046 |
| LensAaveSizing | Aave V4's liquidation sizing, compiled from the pinned Aave V4 release, that the Lens liquidation preview uses. | 0x0000000000000000000000000000000000001047 |

> Each market also has its own vault token (deployed by the VaultTokenFactory), its own LPOracle proxy and a primary and a backup swap route (`DexPathRoute`) per token and debt asset. Those addresses belong to the market and are listed with it, not here (REQ-ROUTE-001, `09_ListMarkets.s.sol`).

### Periphery and integrations

| Contract | Purpose | Address |
| --- | --- | --- |
| Uniswap v3 integration (LPVault) | Holds every Uniswap v3 position pledged on this chain and unwinds it on exit or liquidation; immutable, with no owner (REQ-VAULT-001, REQ-AMM-V3-001). | 0x0000000000000000000000000000000000001048 |
| Uniswap v4 integration | Not built yet: Avana has no Uniswap v4 integration, so the Uniswap v4 Spokes cannot list markets until one exists (EXT-032). | TBD |
| AaveV3FlashSource | Lends LPVaultSwap the debt asset from the Aave V3 Pool for one call so a borrower can repay with collateral (`deleverage`) (REQ-FLASH-001). | 0x0000000000000000000000000000000000001049 |
| FlashLiquidator | Public flash liquidation helper: anyone can liquidate an account without holding the debt asset, which the helper borrows from the Aave V3 Pool and repays in the same transaction (REQ-HELPER-010). | 0x0000000000000000000000000000000000001050 |
| OperatorFlashLiquidator | A keeper operator's own flash liquidation helper: only its signer can call it, and funds come from and return to the operator's funding wallet; one is deployed per keeper instance (REQ-HELPER-011). | 0x0000000000000000000000000000000000001051 |
| AvanaGasVault | Holds the chain's native gas token and refills Avana's own keeper signers up to a per-signer cap over any 24 hours; anyone can trigger a top-up, and no core contract calls it (REQ-GASV-001, Q-413). | 0x0000000000000000000000000000000000001052 |

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
| Uniswap v3 Factory | Avana derives each Uniswap v3 market's pool from it and refuses any pool it did not create (EXT-007). | 0x0000000000000000000000000000000000003010 |
| Uniswap v3 NonfungiblePositionManager | Issues the Uniswap v3 position NFTs that users pledge; the Uniswap v3 LPVault accepts positions of this contract only (EXT-006). | 0x0000000000000000000000000000000000003011 |
| Uniswap v4 PoolManager | Holds every Uniswap v4 pool; no Avana contract uses it until the Uniswap v4 integration is built (EXT-032). | 0x0000000000000000000000000000000000003012 |
| Uniswap v4 StateView | Read-only view of Uniswap v4 pool state; no Avana contract uses it until the Uniswap v4 integration is built (EXT-032). | 0x0000000000000000000000000000000000003013 |
| Uniswap v4 PositionManager | Issues Uniswap v4 position NFTs; no Avana contract uses it until the Uniswap v4 integration is built (EXT-032). | 0x0000000000000000000000000000000000003014 |
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

The ERC-20 tokens this chain's markets and debt reserves use. On the Sepolia networks these are test tokens.

| Contract | Purpose | Address |
| --- | --- | --- |
| USDC | Pool token on the Uniswap v3 Stable and Blue-chip Spokes and the Uniswap v4 Stable and Gov/DeFi Spokes; it can also be approved as a debt asset (REQ-HUB-002). | 0x0000000000000000000000000000000000003041 |
| USDT | Pool token on the Uniswap v3 Stable and Blue-chip Spokes and the Uniswap v4 Stable Spoke; it can also be approved as a debt asset (REQ-HUB-002). | 0x0000000000000000000000000000000000003042 |
| GHO | Debt asset the Aave DAO may approve on the CDP Spokes, priced at a fixed $1, and a pool token on the Uniswap v4 Stable Spoke (EXT-010). | 0x0000000000000000000000000000000000003043 |
| DAI | Pool token on the Uniswap v3 Stable Spoke. | 0x0000000000000000000000000000000000003044 |
| AUSD | Pool token on the Uniswap v3 Stable Spoke. | 0x0000000000000000000000000000000000003045 |
| USDS | Pool token on the Uniswap v4 Stable Spoke. | 0x0000000000000000000000000000000000003046 |
| PYUSD | Pool token on the Uniswap v4 Stable Spoke. | 0x0000000000000000000000000000000000003047 |
| RLUSD | Pool token on the Uniswap v4 Stable Spoke. | 0x0000000000000000000000000000000000003048 |
| USDe | Pool token on the Uniswap v4 Stable Spoke. | 0x0000000000000000000000000000000000003049 |
| WETH | Pool token on the Uniswap v3 Blue-chip, Correlated ETH and Gov/DeFi Spokes. | 0x0000000000000000000000000000000000003050 |
| wstETH | Pool token on the Uniswap v3 Correlated ETH Spoke. | 0x0000000000000000000000000000000000003051 |
| weETH | Pool token on the Uniswap v3 Correlated ETH Spoke. | 0x0000000000000000000000000000000000003052 |
| rETH | Pool token on the Uniswap v3 Correlated ETH Spoke. | 0x0000000000000000000000000000000000003053 |
| WBTC | Pool token on the Uniswap v3 Blue-chip and Correlated BTC Spokes and the Uniswap v4 Correlated BTC Spoke. | 0x0000000000000000000000000000000000003054 |
| cbBTC | Pool token on the Uniswap v4 Correlated BTC Spoke. | 0x0000000000000000000000000000000000003055 |
| cirBTC | Pool token on the Uniswap v3 Correlated BTC Spoke. | 0x0000000000000000000000000000000000003056 |
| kBTC | Pool token on the Uniswap v3 Correlated BTC Spoke. | 0x0000000000000000000000000000000000003057 |
| tBTC | Pool token on the Uniswap v3 Correlated BTC Spoke. | 0x0000000000000000000000000000000000003058 |
| LBTC | Pool token on the Uniswap v4 Correlated BTC Spoke. | 0x0000000000000000000000000000000000003059 |
| BTC.b | Pool token on the Uniswap v4 Correlated BTC Spoke. | 0x0000000000000000000000000000000000003060 |
| UNI | Pool token on the Uniswap v3 and Uniswap v4 Gov/DeFi Spokes. | 0x0000000000000000000000000000000000003061 |
| AAVE | Pool token on the Uniswap v3 and Uniswap v4 Gov/DeFi Spokes. | 0x0000000000000000000000000000000000003062 |
| SKY | Pool token on the Uniswap v3 and Uniswap v4 Gov/DeFi Spokes. | 0x0000000000000000000000000000000000003063 |
| LINK | Pool token on the Uniswap v3 Gov/DeFi Spoke. | 0x0000000000000000000000000000000000003064 |
| ENA | Pool token on the Uniswap v3 Gov/DeFi Spoke. | 0x0000000000000000000000000000000000003065 |
| ONDO | Pool token on the Uniswap v3 Gov/DeFi Spoke. | 0x0000000000000000000000000000000000003066 |

## Base Sepolia
- network: base-sepolia
- chainId: 84532
- explorer: https://sepolia.basescan.org

One Hub with the Lend Spoke and two CDP Spokes on Aero Slipstream.

### Hub

| Contract | Purpose | Address |
| --- | --- | --- |
| Avana Base Hub | Standard, unmodified Aave V4 Hub behind a proxy owned by the Aave DAO; it holds the lent assets and the vault-token collateral of every Avana Spoke on Base and runs no Avana code (REQ-HUB-001, EXT-001). | 0x0000000000000000000000000000000000002001 |

### Spokes

Every Spoke is a standard Aave V4 Spoke owned by the Aave DAO and attached to the Hub above. Borrowers reach a CDP Spoke only through the AaveAdapter, which gives each wallet its own PositionProxy per Spoke and market.

| Contract | Purpose | Markets | Address |
| --- | --- | --- | --- |
| Lend Spoke | Supply-only Aave V4 Spoke, owned by the Aave DAO, where any lender, the Aave DAO treasury included, supplies the assets Avana borrowers draw; there is one per chain (REQ-HUB-016). | Set by governance | 0x0000000000000000000000000000000000002002 |
| Aero Slipstream Blue-chip | Aave V4 CDP Spoke, owned by the Aave DAO, where positions in Aero Slipstream ETH, BTC and stablecoin pools are used as collateral to borrow (REQ-HUB-003). | WETH/USDC, USDC/cbBTC, WETH/cbBTC, WETH/USDT | 0x0000000000000000000000000000000000002003 |
| Aero Slipstream Gov/DeFi | Aave V4 CDP Spoke, owned by the Aave DAO, where positions in Aero Slipstream governance and DeFi token pools are used as collateral to borrow (REQ-HUB-003). | AERO/WETH, WETH/MORPHO, WETH/AAVE, VIRTUAL/WETH | 0x0000000000000000000000000000000000002004 |

> Each CDP Spoke has its own AaveOracle, created with the Spoke; read its address from the Spoke's `ORACLE()` (EXT-003).

### Avana core

The contracts Avana deploys on this chain. MarketRegistry, ParameterStore, RiskModule, AaveAdapter and LPVaultSwap are upgradeable: the address below is the fixed proxy, and the AvanaTimelock is its only admin.

| Contract | Purpose | Address |
| --- | --- | --- |
| AvanaTimelock | Owns and upgrades every Avana contract on this chain: each change waits out a delay, and only the Avana governance Safe and the Aave governance executor can propose one (REQ-ACCESS-027). | 0x0000000000000000000000000000000000002005 |
| MarketRegistry | Records every Hub, CDP Spoke, AMM integration, market, debt reserve and swap route Avana lists on this chain, and holds each Hub's pause switch (Q-312). | 0x0000000000000000000000000000000000002006 |
| ParameterStore | Stores every Avana risk parameter on this chain with its hard bounds and the direction in which it may change (Q-317). | 0x0000000000000000000000000000000000002007 |
| RiskModule | Runs every Avana risk check (caps, circuit breakers, price freshness, Aave configuration drift) on pledges, borrows and withdrawals, and holds no funds (Q-308). | 0x0000000000000000000000000000000000002008 |
| AaveAdapter | The single entry point for borrowers: pledge, borrow, repay, withdraw, repay with collateral and fee collection all go through it to the user's PositionProxy (REQ-ADAPTER-001). | 0x0000000000000000000000000000000000002009 |
| LPVaultSwap | Runs every liquidation of an Avana account on this chain and is the only address that can receive seized vault tokens (Q-348, REQ-HUB-055). | 0x0000000000000000000000000000000000002010 |
| Lock | Shared reentrancy lock of the AaveAdapter and LPVaultSwap that stops a second entry into Avana inside one transaction (Q-318). | 0x0000000000000000000000000000000000002011 |
| Collateralization | Backing ledger of every pledged position: it records how many units each position backs, so every vault token stays fully backed (REQ-COLL-001). | 0x0000000000000000000000000000000000002012 |
| VaultTokenFactory | Registers the LPVault of each AMM integration and deploys one vault token per CDP Spoke and market. | 0x0000000000000000000000000000000000002013 |
| ProxyManager | Creates each user's PositionProxy, one per wallet, CDP Spoke and market, at an address fixed by those three values (REQ-PROXY-001). | 0x0000000000000000000000000000000000002014 |
| PayoutEscrow | Holds a liquidation payout that could not be sent to its recipient, such as a borrower's surplus, until the recipient claims it (REQ-ESCROW-001). | 0x0000000000000000000000000000000000002015 |
| Avana Umbrella (First-Loss Reserve), GHO | Avana's first-loss capital for GHO on this Hub: funded by Avana Labs, it covers deficits Aave records on Avana CDP Spokes before any other layer (REQ-FLR-001). | 0x0000000000000000000000000000000000002016 |
| DAO deficit offset, GHO | Second loss layer for GHO on this Hub, funded by the Aave DAO treasury, which pays a deficit only once the Avana Umbrella is empty or deactivated (REQ-FLR-046). | 0x0000000000000000000000000000000000002017 |
| Lens | Read-only contract that returns account, market, price, risk and liquidation state in one call for the app, keepers and monitoring; no Avana contract depends on it (REQ-LENS-001). | 0x0000000000000000000000000000000000002018 |
| AvanaCreate3Factory | Deploys Avana contracts at addresses that depend only on the deployer and a salt, so every address is known before deployment (`00_Factories.s.sol`). | 0x0000000000000000000000000000000000002019 |

> The LPVault of each AMM integration is listed under Periphery and integrations. Further Avana Umbrella and DAO deficit offset pairs are added for each debt asset the Aave DAO approves on this Hub (REQ-HUB-021).

Implementations and logic contracts. These hold the code that the proxies above and the per-market oracle proxies run.

| Contract | Purpose | Address |
| --- | --- | --- |
| MarketRegistry implementation | Current code behind the MarketRegistry proxy; only the AvanaTimelock can replace it (REQ-ACCESS-002). | 0x0000000000000000000000000000000000002020 |
| ParameterStore implementation | Current code behind the ParameterStore proxy; only the AvanaTimelock can replace it (REQ-ACCESS-002). | 0x0000000000000000000000000000000000002021 |
| RiskModule implementation | Current code behind the RiskModule proxy; only the AvanaTimelock can replace it (REQ-ACCESS-002). | 0x0000000000000000000000000000000000002022 |
| AaveAdapter implementation | Current code behind the AaveAdapter proxy; only the AvanaTimelock can replace it (REQ-ACCESS-002). | 0x0000000000000000000000000000000000002023 |
| LPVaultSwap implementation | Current code behind the LPVaultSwap proxy; only the AvanaTimelock can replace it (REQ-ACCESS-002). | 0x0000000000000000000000000000000000002024 |
| LPOracle implementation (Aero Slipstream) | Code behind every Aero Slipstream market's LPOracle proxy, which gives AaveOracle the USD price of that market's vault token (Q-321, Q-376). | 0x0000000000000000000000000000000000002025 |
| LPOracle module logic (Aero Slipstream) | Concentrated-liquidity pricing code that the LPOracle logic contracts run in each market's LPOracle. | 0x0000000000000000000000000000000000002026 |
| LPOracle poke logic (Aero Slipstream) | Code of the LPOracle's `poke()`, which records feed outages and disagreements as they are observed (REQ-ORACLE-026). | 0x0000000000000000000000000000000000002027 |
| LPOracle init logic (Aero Slipstream) | Code of the market part of the LPOracle's `initialize`, run once when a market's LPOracle is deployed. | 0x0000000000000000000000000000000000002028 |
| LPOracle listing logic (Aero Slipstream) | Code of the LPOracle's configuration checks, run when a market's LPOracle is initialized. | 0x0000000000000000000000000000000000002029 |
| LPOracle view logic (Aero Slipstream) | Code of the LPOracle's price views, including the `latestAnswer()` that AaveOracle reads. | 0x0000000000000000000000000000000000002030 |
| DebtOracle implementation | Code behind each DebtOracle proxy, the price source of one non-GHO debt asset (for example USDC or USDT) on every CDP Spoke of this chain (REQ-ORACLE-091). | 0x0000000000000000000000000000000000002031 |

> The logic contracts each upgradeable proxy forwards to are recorded in the release manifest. Each non-GHO debt asset gets its own DebtOracle proxy when its debt reserve is listed (REQ-ORACLE-091).

Lens modules. The Lens forwards each view to one of these read-only contracts.

| Contract | Purpose | Address |
| --- | --- | --- |
| LensAccountModule | Serves the Lens account views and close-account sizing. | 0x0000000000000000000000000000000000002032 |
| LensMarketModule | Serves the Lens views of one market. | 0x0000000000000000000000000000000000002033 |
| LensPriceModule | Serves the Lens price, debt-price and pause-state views and deleverage sizing. | 0x0000000000000000000000000000000000002034 |
| LensLiquidationModule | Serves the Lens liquidation preview. | 0x0000000000000000000000000000000000002035 |
| LensRiskModule | Serves the Lens risk and Hub-asset views. | 0x0000000000000000000000000000000000002036 |
| LensPreviewModule | Serves the Lens action previews. | 0x0000000000000000000000000000000000002037 |
| LensMarketsModule | Serves the Lens market list and fee views. | 0x0000000000000000000000000000000000002038 |
| LensPositionsModule | Serves the Lens position views, available actions and maximum-withdraw sizing. | 0x0000000000000000000000000000000000002039 |
| LensSpeedModule | Serves the Lens speed-limit views: how much a borrow can take now under the RiskModule's speed windows (REQ-LENS-061). | 0x0000000000000000000000000000000000002040 |
| LensAaveSizing | Aave V4's liquidation sizing, compiled from the pinned Aave V4 release, that the Lens liquidation preview uses. | 0x0000000000000000000000000000000000002041 |

> Each market also has its own vault token (deployed by the VaultTokenFactory), its own LPOracle proxy and a primary and a backup swap route (`DexPathRoute`) per token and debt asset. Those addresses belong to the market and are listed with it, not here (REQ-ROUTE-001, `09_ListMarkets.s.sol`).

### Periphery and integrations

| Contract | Purpose | Address |
| --- | --- | --- |
| Aero Slipstream integration (LPVault) | Holds every unstaked Aero Slipstream position pledged on this chain, across the four Slipstream factory generations, and unwinds it on exit or liquidation; immutable, with no owner (REQ-VAULT-001, EXT-028). | 0x0000000000000000000000000000000000002042 |
| AaveV3FlashSource | Lends LPVaultSwap the debt asset from the Aave V3 Pool for one call so a borrower can repay with collateral (`deleverage`) (REQ-FLASH-001). | 0x0000000000000000000000000000000000002043 |
| FlashLiquidator | Public flash liquidation helper: anyone can liquidate an account without holding the debt asset, which the helper borrows from the Aave V3 Pool and repays in the same transaction (REQ-HELPER-010). | 0x0000000000000000000000000000000000002044 |
| OperatorFlashLiquidator | A keeper operator's own flash liquidation helper: only its signer can call it, and funds come from and return to the operator's funding wallet; one is deployed per keeper instance (REQ-HELPER-011). | 0x0000000000000000000000000000000000002045 |
| AvanaGasVault | Holds the chain's native gas token and refills Avana's own keeper signers up to a per-signer cap over any 24 hours; anyone can trigger a top-up, and no core contract calls it (REQ-GASV-001, Q-413). | 0x0000000000000000000000000000000000002046 |

> Swap routes are immutable contracts deployed per market, token and debt asset at listing, one primary and one backup, and recorded in the MarketRegistry (REQ-ROUTE-001, REQ-ROUTE-017).

### External dependencies

Contracts Avana relies on but does not deploy on mainnet. On the Sepolia networks Avana deploys test instances of them from the pinned sources (`01_DeployAaveV4.s.sol`, `02_DeployWorld.s.sol`).

| Contract | Purpose | Address |
| --- | --- | --- |
| Aave V4 AccessManager | Holds the Aave V4 roles of this chain and is the authority of every Avana Umbrella and DAO deficit offset (EXT-005). | 0x0000000000000000000000000000000000004001 |
| Aave V4 standard Spoke implementation | Audited Spoke code every CDP Spoke must run; the MarketRegistry refuses a Spoke whose proxy points elsewhere (REQ-HUB-099). | 0x0000000000000000000000000000000000004002 |
| Aave V4 HubConfigurator | Aave DAO payloads configure the Hub through it; no Avana contract calls it (REQ-HUB-004). | 0x0000000000000000000000000000000000004003 |
| Aave V4 SpokeConfigurator | Aave DAO payloads configure the Spokes through it, and the Aave Protocol Guardian freezes or pauses reserves through it; no Avana contract calls it (REQ-HUB-004). | 0x0000000000000000000000000000000000004004 |
| Aave GHO fixed price source | Price source of the GHO debt reserve on every CDP Spoke's AaveOracle, fixed at $1; a test stand-in on the Sepolia networks (REQ-HUB-022). | 0x0000000000000000000000000000000000004005 |
| Aave governance executor | Owns every Hub and Spoke of this chain, and can propose and cancel Avana timelock operations (REQ-ACCESS-027, EXT-005). | 0x0000000000000000000000000000000000004006 |
| Aave Protocol Guardian | Can freeze and pause Avana reserves on Aave, and holds Avana's pause, freeze and cancel roles (REQ-HUB-066). | 0x0000000000000000000000000000000000004007 |
| Aave V3 Pool | Lends the debt asset to the AaveV3FlashSource and the flash liquidation helpers (EXT-030). | 0x0000000000000000000000000000000000004008 |
| Aave V3 ACLManager | Grants the flash borrower role that lets the AaveV3FlashSource and the public FlashLiquidator borrow without a fee (EXT-012). | 0x0000000000000000000000000000000000004009 |
| Aero Slipstream factory (Initial) | Slipstream pool factory of the Initial generation; Avana derives a market's pool from the factory of that market's generation (EXT-028). | 0x0000000000000000000000000000000000004010 |
| Aero Slipstream position manager (Initial) | Issues the Slipstream position NFTs of the Initial generation that users pledge; each market binds one factory and position manager pair (EXT-028). | 0x0000000000000000000000000000000000004011 |
| Aero Slipstream factory (Gauge Caps) | Slipstream pool factory of the Gauge Caps generation; Avana derives a market's pool from the factory of that market's generation (EXT-028). | 0x0000000000000000000000000000000000004012 |
| Aero Slipstream position manager (Gauge Caps) | Issues the Slipstream position NFTs of the Gauge Caps generation that users pledge; each market binds one factory and position manager pair (EXT-028). | 0x0000000000000000000000000000000000004013 |
| Aero Slipstream factory (Gauges V3) | Slipstream pool factory of the Gauges V3 generation; Avana derives a market's pool from the factory of that market's generation (EXT-028). | 0x0000000000000000000000000000000000004014 |
| Aero Slipstream position manager (Gauges V3) | Issues the Slipstream position NFTs of the Gauges V3 generation that users pledge; each market binds one factory and position manager pair (EXT-028). | 0x0000000000000000000000000000000000004015 |
| Aero Slipstream factory (Aero) | Slipstream pool factory of the Aero generation; Avana derives a market's pool from the factory of that market's generation (EXT-028). | 0x0000000000000000000000000000000000004016 |
| Aero Slipstream position manager (Aero) | Issues the Slipstream position NFTs of the Aero generation that users pledge; each market binds one factory and position manager pair (EXT-028). | 0x0000000000000000000000000000000000004017 |
| Chainlink L2 Sequencer Uptime feed | Tells Avana whether the Base sequencer is up; prices count as fresh again only after a grace period following a restart (EXT-029). | 0x0000000000000000000000000000000000004018 |
| Chainlink USDC/USD | Primary USD price feed of USDC, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000004019 |
| Chainlink USDT/USD | Primary USD price feed of USDT, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000004020 |
| Chainlink GHO/USD | Primary price feed of GHO, used for monitoring only; Aave prices GHO with its fixed $1 source (EXT-008, `09_ListMarkets.s.sol`). | 0x0000000000000000000000000000000000004021 |
| Chainlink WETH/USD | Primary USD price feed of WETH, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000004022 |
| Chainlink cbBTC/USD | Primary USD price feed of cbBTC, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000004023 |
| Chainlink AERO/USD | Primary USD price feed of AERO, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000004024 |
| Chainlink MORPHO/USD | Primary USD price feed of MORPHO, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000004025 |
| Chainlink AAVE/USD | Primary USD price feed of AAVE, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000004026 |
| Chainlink VIRTUAL/USD | Primary USD price feed of VIRTUAL, read by the Avana oracles that price it (EXT-008). | 0x0000000000000000000000000000000000004027 |

> Each token also has an alternate price route, a standby route and an independent second source, recorded in its listing (EXT-009, EXT-024). Their addresses are added when the tokens are listed.

### Assets

The ERC-20 tokens this chain's markets and debt reserves use. On the Sepolia networks these are test tokens.

| Contract | Purpose | Address |
| --- | --- | --- |
| USDC | Pool token on the Aero Slipstream Blue-chip Spoke; it can also be approved as a debt asset (REQ-HUB-002). | 0x0000000000000000000000000000000000004028 |
| USDT | Pool token on the Aero Slipstream Blue-chip Spoke; it can also be approved as a debt asset (REQ-HUB-002). | 0x0000000000000000000000000000000000004029 |
| GHO | Debt asset the Aave DAO may approve on the CDP Spokes, priced at a fixed $1; on Base it is a cross-chain burn-and-mint token (EXT-010). | 0x0000000000000000000000000000000000004030 |
| WETH | Pool token on the Aero Slipstream Blue-chip and Gov/DeFi Spokes. | 0x0000000000000000000000000000000000004031 |
| cbBTC | Pool token on the Aero Slipstream Blue-chip Spoke. | 0x0000000000000000000000000000000000004032 |
| AERO | Pool token on the Aero Slipstream Gov/DeFi Spoke (the AERO token issued after the Aero migration). | 0x0000000000000000000000000000000000004033 |
| MORPHO | Pool token on the Aero Slipstream Gov/DeFi Spoke. | 0x0000000000000000000000000000000000004034 |
| AAVE | Pool token on the Aero Slipstream Gov/DeFi Spoke. | 0x0000000000000000000000000000000000004035 |
| VIRTUAL | Pool token on the Aero Slipstream Gov/DeFi Spoke. | 0x0000000000000000000000000000000000004036 |
