# Spec coverage map (temporary)

Working checklist for the docs refresh. Each row maps a source in the Avana monorepo to the site page that covers it. A row is done when the site page states the source's rules, numbers and names at site level. This file is removed in the last commit of the refresh and is never rendered on the site.

Source snapshot: `avana-monorepo` spec, governance, audit, deployments and contract docs as of 2026-11-10.

Status: `todo`, `done`.

## 1. Architecture

| Source | Site page | Status |
|---|---|---|
| 1.1 Protocol overview (participants, collateral path, chains, Hubs, AMM protocols, scope, glossary) | `/developers`, `/developers/introduction/key-concepts`, `/developers/introduction/glossary` | todo |
| 1.2 Contract relationships (instance scope, inventory, calls, asset flow) | `/developers/architecture`, `/developers/reference/contracts` | todo |
| 1.3 Trust boundaries | `/developers/safety/contracts` | todo |
| 1.4 Permissions and roles, delay classes | `/developers/safety/governance` | todo |
| 1.5 Parameters (units, bounds, launch values, per-chain values) | `/developers/reference/parameters` | todo |

## 2. Contracts

| Source | Site page | Status |
|---|---|---|
| 2.1 Avana Hubs, CDP, Lend and Coverage Spokes, credit lines | `/developers/architecture`, `/developers/architecture/lend-spoke` | todo |
| 2.2 LPVault | `/developers/architecture/custody` | todo |
| 2.3 Collateralization | `/developers/architecture/custody` | todo |
| 2.4 Vault tokens and VaultTokenFactory | `/developers/architecture/custody` | todo |
| 2.5 PositionProxy and ProxyManager | `/developers/architecture/custody` | todo |
| 2.6 AaveAdapter | `/developers/integrations/router-contract` | todo |
| 2.7 RiskModule (collateral factor, caps, checks) | `/developers/architecture/collateral-factors`, `/developers/architecture/health-factor` | todo |
| 2.8 MarketRegistry (markets, routes, pause, breakers, freeze) | `/developers/integrations/market-lifecycle`, `/developers/safety/emergency-controls` | todo |
| 2.9 ParameterStore (tighten and loosen setters, bounds) | `/developers/reference/parameters`, `/developers/safety/governance` | todo |
| 2.10 LPOracle, LPPriceMath, DebtOracle | `/developers/integrations/price-oracles`, `/developers/integrations/price-states` | todo |
| 2.11 LPVaultSwap, SettlementMath, flash source | `/developers/liquidation`, `/developers/liquidation/flow` | todo |
| 2.12 Swap routes | `/developers/liquidation/flow` | todo |
| 2.13 SettlementBudget (removed) | `/developers/reference/contracts` (removed list) | todo |
| 2.14 First-Loss Reserve (Coverage Spokes) | `/developers/safety/insurance` | todo |
| 2.15 Governance and AvanaTimelock | `/developers/safety/governance` | todo |
| 2.16 Lock | `/developers/architecture/custody`, `/developers/reference/contracts` | todo |
| 2.17 Lens | `/developers/integrations/lens` | todo |
| 2.18 InKindEscrow | `/developers/liquidation/flow` | todo |
| 2.19 AMM integration interface | `/developers/integrations/allowed-pools` | todo |
| 2.20 Uniswap v3 integration | `/developers/integrations/allowed-pools` | todo |
| 2.21 Aerodrome Slipstream integration | `/developers/integrations/allowed-pools` | todo |
| 2.22 AMM integration readiness (v2, Curve, Balancer, v4) | `/developers/integrations/allowed-pools` | todo |

## 3. Operations

| Source | Site page | Status |
|---|---|---|
| 3.1 Deposit (pledge) | `/developers/getting-started` | todo |
| 3.2 Borrow | `/developers/getting-started/borrow-assets` | todo |
| 3.3 Repay (incl. repay with collateral, third-party repay) | `/developers/getting-started/repay-loans`, `/developers/getting-started/manage-loans` | todo |
| 3.4 Withdraw (incl. partial removal, repayAllAndWithdraw) | `/developers/getting-started/withdraw-collateral`, `/developers/getting-started/manage-loans` | todo |
| 3.5 Liquidation | `/developers/liquidation/*` | todo |
| 3.6 Emergency operations and playbooks | `/developers/safety/emergency-controls` | todo |
| 3.7 Collect fees | `/developers/getting-started/claim-lp-fees` | todo |
| 3.8 Market lifecycle | `/developers/integrations/market-lifecycle` | todo |
| 3.9 Deficit coverage | `/developers/safety/insurance` | todo |

## 4. Security

| Source | Site page | Status |
|---|---|---|
| 4.1 Global invariants | `/developers/reference/security` | todo |
| 4.2 Attack scenarios | `/developers/reference/security` | todo |
| 4.3 External dependencies | `/developers/reference/security`, `/developers/reference/contracts` | todo |
| 4.4 Design decisions | `/developers/reference/security` | todo |

## 5. Verification

| Source | Site page | Status |
|---|---|---|
| 5 README (approach, tools) | `/developers/reference/security` | todo |
| 5.1 Test requirements | `/developers/reference/security` | todo |
| 5.2 Formal properties | `/developers/reference/security` | todo |
| 5.3 Audit findings | `/developers/reference/audits` | todo |

## Other monorepo sources

| Source | Site page | Status |
|---|---|---|
| `contracts/LIFECYCLES.md` flows 1–4 (pledge, borrow, repay, withdraw) | Getting Started pages | todo |
| `contracts/LIFECYCLES.md` flows 5–7 (partial removal, collect fees, repay with collateral) | Manage Loans, Claim LP Fees | todo |
| `contracts/LIFECYCLES.md` flows 8–10 (liquidations, permissionless) | `/developers/liquidation/examples`, `/developers/liquidation/liquidators` | todo |
| `contracts/LIFECYCLES.md` flow 11 (breaker, pause, oracle expiry) | Emergency Controls, Price States | todo |
| `contracts/README.md`, `contracts/src/**/LIFECYCLE.md` | `/developers/reference/contracts` | todo |
| `governance/README.md` | `/developers/safety/governance` | todo |
| `governance/parameters.md` | `/developers/reference/parameters` | todo |
| `governance/arfc-avana-lp-collateral.md` | `/developers/safety/governance`, `/developers/architecture/lend-spoke` | todo |
| `audit/README.md`, `audit/findings-register.md` | `/developers/reference/audits` | todo |
| `deployments/README.md` | `/developers/reference/contracts` (addresses) | todo |

## Pages outside the spec map

| Site page | Action | Status |
|---|---|---|
| `/developers/architecture/platform-fees`, `/developers/architecture/incentives` | Align with spec fee and reserve rules | todo |
| `/developers/integrations`, `/developers/integrations/appkit` | Align with current integration surface | todo |
| `/developers/safety`, `/developers/safety/bug-bounty` | Align names and scope | todo |
| `/developers/legal`, `/developers/legal/disclaimer` | Status wording | todo |
| `/developers/copilot/*` | Remove stale protocol facts | todo |
| `/faq` | Rebuild answers | todo |
| Marketing copy (About, Borrow, Lend, homepage) | Fix stale facts only | todo |
