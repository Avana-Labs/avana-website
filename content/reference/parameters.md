---
title: Market Parameters
description: Each Avana market's pool and risk parameters per Spoke, and the protocol-wide Avana parameters.
updated: 2026-11-16
---

**Testnet values.** The per-market numbers below are the values the Sepolia deployment lists with. On mainnet the Aave DAO sets caps, collateral factors, liquidation bonuses, collateral risk premiums and First-Loss Reserve amounts through its proposals.

## Ethereum Sepolia
- network: ethereum-sepolia

Every Spoke here is on the Avana Ethereum Hub; Hub and Spoke addresses are on [Contract Addresses](/developers/reference/addresses?network=ethereum-sepolia). Spokes are listed by collateral risk, lowest first. Reserves are the debt assets the Hub lists (GHO, USDC, USDT) and one LP collateral reserve per market. `—` means the setting does not apply. Pool risk factors are pending the updated deploy values.

### Interest rate curves

One curve per debt asset on the Avana Ethereum Hub. LP reserves are collateral only and have no curve.

| Hub | Reserve | Base drawn rate | Rate growth before optimal | Rate growth after optimal | Optimal usage ratio | Liquidity fee |
| --- | --- | --- | --- | --- | --- | --- |
| Avana Ethereum Hub | GHO | 0% | 4% | 60% | 90% | 0% |
| Avana Ethereum Hub | USDC | 0% | 4% | 60% | 90% | 0% |
| Avana Ethereum Hub | USDT | 0% | 4% | 60% | 90% | 0% |

### Credit lines

The Aave DAO funds each borrowable asset by supplying it to the Hub through the Lend Spoke, up to the credit line the MarketRegistry records.

| Origin | Target Hub | Reserve | Credit line size |
| --- | --- | --- | --- |
| Aave DAO, through the Lend Spoke | Avana Ethereum Hub | GHO | 50,000,000 GHO |
| Aave DAO, through the Lend Spoke | Avana Ethereum Hub | USDC | 50,000,000 USDC |

### Add and draw caps

Caps in whole tokens. The Lend Spoke takes supply and draws nothing; CDP Spokes draw the borrowable assets and take LP collateral. Avana's own market caps (under LP market parameters) bound LP collateral further.

| Spoke | Reserve | Add cap | Draw cap |
| --- | --- | --- | --- |
| Lend Spoke | GHO | Max | 0 |
| Lend Spoke | USDC | Max | 0 |
| Lend Spoke | USDT | Max | 0 |
| Uniswap v3 Stable | GHO | 0 | 10,000,000 |
| Uniswap v3 Stable | USDC | 0 | 10,000,000 |
| Uniswap v3 Stable | USDT | 0 | 5,000,000 |
| Uniswap v3 Stable | USDC/USDT LP | Max | 0 |
| Uniswap v3 Stable | DAI/USDT LP | Max | 0 |
| Uniswap v4 Stable | GHO | 0 | 10,000,000 |
| Uniswap v4 Stable | USDC | 0 | 10,000,000 |
| Uniswap v4 Stable | USDT | 0 | 5,000,000 |
| Uniswap v4 Stable | USDC/USDT LP | Max | 0 |
| Uniswap v3 Correlated ETH | GHO | 0 | 10,000,000 |
| Uniswap v3 Correlated ETH | USDC | 0 | 10,000,000 |
| Uniswap v3 Correlated ETH | USDT | 0 | 5,000,000 |
| Uniswap v3 Correlated ETH | wstETH/WETH LP | Max | 0 |
| Uniswap v4 Correlated BTC | GHO | 0 | 10,000,000 |
| Uniswap v4 Correlated BTC | USDC | 0 | 10,000,000 |
| Uniswap v4 Correlated BTC | USDT | 0 | 5,000,000 |
| Uniswap v4 Correlated BTC | cbBTC/WBTC LP | Max | 0 |
| Uniswap v3 Blue-chip | GHO | 0 | 10,000,000 |
| Uniswap v3 Blue-chip | USDC | 0 | 10,000,000 |
| Uniswap v3 Blue-chip | USDT | 0 | 5,000,000 |
| Uniswap v3 Blue-chip | WETH/USDC LP | Max | 0 |
| Uniswap v3 Blue-chip | WBTC/USDC LP | Max | 0 |
| Uniswap v3 Gov/DeFi | GHO | 0 | 10,000,000 |
| Uniswap v3 Gov/DeFi | USDC | 0 | 10,000,000 |
| Uniswap v3 Gov/DeFi | USDT | 0 | 5,000,000 |
| Uniswap v3 Gov/DeFi | AAVE/WETH LP | Max | 0 |
| Uniswap v3 Gov/DeFi | UNI/WETH LP | Max | 0 |
| Uniswap v3 Gov/DeFi | LINK/WETH LP | Max | 0 |

> `Max` is Aave V4's largest Spoke cap (`MAX_ALLOWED_SPOKE_CAP`). A debt asset that is not borrowable on a CDP Spoke keeps its draw cap but cannot be drawn.

### Risk parameters

LP reserves are collateral only. Debt reserves are never collateral. The Lend Spoke's reserves carry the borrowable flag, but their draw cap is 0, so nothing is drawn through the Lend Spoke.

| Spoke | Reserve | Collateral factor | Max liquidation bonus | Borrowable | Collateral risk | Liquidation fee | Risk premium threshold | receiveShares |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Lend Spoke | GHO | 0% | — | Yes | — | 0% | Max | No |
| Lend Spoke | USDC | 0% | — | Yes | — | 0% | Max | No |
| Lend Spoke | USDT | 0% | — | Yes | — | 0% | Max | No |
| Uniswap v3 Stable | USDC/USDT LP | 80% | 4% | No | 400 bps | 0% | Max | No |
| Uniswap v3 Stable | DAI/USDT LP | 80% | 4% | No | 400 bps | 0% | Max | No |
| Uniswap v3 Stable | GHO | 0% | — | Yes | — | 0% | Max | No |
| Uniswap v3 Stable | USDC | 0% | — | Yes | — | 0% | Max | No |
| Uniswap v3 Stable | USDT | 0% | — | No | — | 0% | Max | No |
| Uniswap v4 Stable | USDC/USDT LP | 80% | 4% | No | 400 bps | 0% | Max | No |
| Uniswap v4 Stable | GHO | 0% | — | Yes | — | 0% | Max | No |
| Uniswap v4 Stable | USDC | 0% | — | Yes | — | 0% | Max | No |
| Uniswap v4 Stable | USDT | 0% | — | No | — | 0% | Max | No |
| Uniswap v3 Correlated ETH | wstETH/WETH LP | 75% | 5% | No | 600 bps | 0% | Max | No |
| Uniswap v3 Correlated ETH | GHO | 0% | — | Yes | — | 0% | Max | No |
| Uniswap v3 Correlated ETH | USDC | 0% | — | Yes | — | 0% | Max | No |
| Uniswap v3 Correlated ETH | USDT | 0% | — | No | — | 0% | Max | No |
| Uniswap v4 Correlated BTC | cbBTC/WBTC LP | 75% | 5% | No | 600 bps | 0% | Max | No |
| Uniswap v4 Correlated BTC | GHO | 0% | — | Yes | — | 0% | Max | No |
| Uniswap v4 Correlated BTC | USDC | 0% | — | Yes | — | 0% | Max | No |
| Uniswap v4 Correlated BTC | USDT | 0% | — | No | — | 0% | Max | No |
| Uniswap v3 Blue-chip | WETH/USDC LP | 72% | 6.5% | No | 800 bps | 0% | Max | No |
| Uniswap v3 Blue-chip | WBTC/USDC LP | 72% | 6.5% | No | 800 bps | 0% | Max | No |
| Uniswap v3 Blue-chip | GHO | 0% | — | Yes | — | 0% | Max | No |
| Uniswap v3 Blue-chip | USDC | 0% | — | Yes | — | 0% | Max | No |
| Uniswap v3 Blue-chip | USDT | 0% | — | No | — | 0% | Max | No |
| Uniswap v3 Gov/DeFi | AAVE/WETH LP | 68% | 8% | No | 1,000 bps | 0% | Max | No |
| Uniswap v3 Gov/DeFi | UNI/WETH LP | 68% | 8% | No | 1,000 bps | 0% | Max | No |
| Uniswap v3 Gov/DeFi | LINK/WETH LP | 68% | 8% | No | 1,000 bps | 0% | Max | No |
| Uniswap v3 Gov/DeFi | GHO | 0% | — | Yes | — | 0% | Max | No |
| Uniswap v3 Gov/DeFi | USDC | 0% | — | Yes | — | 0% | Max | No |
| Uniswap v3 Gov/DeFi | USDT | 0% | — | No | — | 0% | Max | No |

> Collateral risk is Aave V4's `collateralRisk`: the premium borrowers pay on top of the base rate, and lenders earn, for that collateral. `Max` is Aave V4's `MAX_RISK_PREMIUM_THRESHOLD`. Avana requires a liquidation fee of 0 on every LP reserve; its revenue from a liquidation is the fee share under Fees.

### Price feeds

Each Spoke has its own AaveOracle; these are the sources it reads. Each name links to its address on Contract Addresses. GHO has no feed: Aave prices it at a fixed $1. Each market's LPOracle is recorded in the MarketRegistry.

| Spoke | Reserve | Oracle |
| --- | --- | --- |
| Lend Spoke and every CDP Spoke | GHO | Fixed $1 price (Aave) |
| Lend Spoke and every CDP Spoke | USDC | [DebtOracle, USDC](/developers/reference/addresses?network=ethereum-sepolia#avana-core) |
| Lend Spoke and every CDP Spoke | USDT | [USDT / USD price feed](/developers/reference/addresses?network=ethereum-sepolia#external-dependencies) |
| Uniswap v3 Stable | Each LP reserve | [The market's LPOracle](/developers/reference/addresses?network=ethereum-sepolia#avana-core) |
| Uniswap v4 Stable | Each LP reserve | [The market's LPOracle](/developers/reference/addresses?network=ethereum-sepolia#avana-core) |
| Uniswap v3 Correlated ETH | Each LP reserve | [The market's LPOracle](/developers/reference/addresses?network=ethereum-sepolia#avana-core) |
| Uniswap v4 Correlated BTC | Each LP reserve | [The market's LPOracle](/developers/reference/addresses?network=ethereum-sepolia#avana-core) |
| Uniswap v3 Blue-chip | Each LP reserve | [The market's LPOracle](/developers/reference/addresses?network=ethereum-sepolia#avana-core) |
| Uniswap v3 Gov/DeFi | Each LP reserve | [The market's LPOracle](/developers/reference/addresses?network=ethereum-sepolia#avana-core) |

### LP market parameters

Avana's own settings for each market: the pool it accepts, how much of the pool's value counts as collateral, and how much can be pledged.

| Spoke | Market | Pool | v3 reference pool | Fee tier or tick spacing | Pool risk factor | Market cap | Consistency tolerance |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Uniswap v3 Stable | USDC/USDT | @{markets.uni-USDC-USDT-100.pool} | — | 0.01% | Pending | $5,000,000 | 0.5% |
| Uniswap v3 Stable | DAI/USDT | @{markets.uni-DAI-USDT-100.pool} | — | 0.01% | Pending | $5,000,000 | 1% |
| Uniswap v4 Stable | USDC/USDT | @{markets.univ4-USDC-USDT-100.poolId} | @{markets.univ4-USDC-USDT-100.referencePool} | 0.01% | Pending | $5,000,000 | 1% |
| Uniswap v3 Correlated ETH | wstETH/WETH | @{markets.uni-wstETH-WETH-100.pool} | — | 0.01% | Pending | $5,000,000 | 0.5% |
| Uniswap v4 Correlated BTC | cbBTC/WBTC | @{markets.univ4-cbBTC-WBTC-100.poolId} | @{markets.univ4-cbBTC-WBTC-100.referencePool} | 0.01% | Pending | $5,000,000 | 1% |
| Uniswap v3 Blue-chip | WETH/USDC | @{markets.uni-WETH-USDC-500.pool} | — | 0.05% | Pending | $5,000,000 | 1% |
| Uniswap v3 Blue-chip | WBTC/USDC | @{markets.uni-WBTC-USDC-3000.pool} | — | 0.3% | Pending | $5,000,000 | 1% |
| Uniswap v3 Gov/DeFi | AAVE/WETH | @{markets.uni-AAVE-WETH-3000.pool} | — | 0.3% | Pending | $5,000,000 | 1% |
| Uniswap v3 Gov/DeFi | UNI/WETH | @{markets.uni-UNI-WETH-3000.pool} | — | 0.3% | Pending | $5,000,000 | 1% |
| Uniswap v3 Gov/DeFi | LINK/WETH | @{markets.uni-LINK-WETH-3000.pool} | — | 0.3% | Pending | $5,000,000 | 1% |

> A Uniswap v4 market's Pool is its PoolId. Hookless Uniswap v4 pools keep no price history, so each also reads the same pair's Uniswap v3 reference pool (fee 0.05%) for the price check.

### Lend Spoke

Each debt asset has a First-Loss Reserve and a DAO deficit offset on the Hub.

| Asset | Borrowable on CDP Spokes | First-Loss Reserve minimum | DAO deficit offset minimum |
| --- | --- | --- | --- |
| GHO | Yes | 100,000 GHO | 75,000 GHO |
| USDC | Yes | 100,000 USDC | 75,000 USDC |
| USDT | No | 50,000 USDT | 25,000 USDT |

### Collateral tokens

Each pool token's collateral factor (CF0 and CF1 in the LP collateral factor, `min(CF0, CF1) × poolRiskFactor`) and its exposure cap across every Spoke and market of the Hub.

| Token | Token collateral factor | Token cap |
| --- | --- | --- |
| USDC | 90% | $50,000,000 |
| USDT | 90% | $50,000,000 |
| DAI | 90% | $50,000,000 |
| WETH | 85% | $50,000,000 |
| wstETH | 85% | $50,000,000 |
| WBTC | 84% | $50,000,000 |
| cbBTC | 84% | $50,000,000 |
| AAVE | 76% | $10,000,000 |
| UNI | 76% | $10,000,000 |
| LINK | 76% | $10,000,000 |

### Chain settings

| Parameter | Value | Description |
| --- | --- | --- |
| `CHAIN_BLOCK_TIME` | 12 s | Block interval of the chain. It sizes the observation buffer a pool needs for the time-weighted price check. |
| `twapMinObservations` | 151 | Observation slots a pool must hold for a 1,800 s window at 12 s blocks. |
| `sequencer.feed` | None | Ethereum has no sequencer, so no uptime feed is read. |

## Base Sepolia
- network: base-sepolia

Every Spoke here is on the Avana Base Hub; Hub and Spoke addresses are on [Contract Addresses](/developers/reference/addresses?network=base-sepolia). Spokes are listed by collateral risk, lowest first. Reserves are the debt assets the Hub lists (GHO, USDC, USDT) and one LP collateral reserve per market. `—` means the setting does not apply. Pool risk factors are pending the updated deploy values. Aero Slipstream pools use dynamic fees, so each market is named by its tick spacing.

### Interest rate curves

One curve per debt asset on the Avana Base Hub. LP reserves are collateral only and have no curve.

| Hub | Reserve | Base drawn rate | Rate growth before optimal | Rate growth after optimal | Optimal usage ratio | Liquidity fee |
| --- | --- | --- | --- | --- | --- | --- |
| Avana Base Hub | GHO | 0% | 4% | 60% | 90% | 0% |
| Avana Base Hub | USDC | 0% | 4% | 60% | 90% | 0% |
| Avana Base Hub | USDT | 0% | 4% | 60% | 90% | 0% |

### Credit lines

The Aave DAO funds each borrowable asset by supplying it to the Hub through the Lend Spoke, up to the credit line the MarketRegistry records.

| Origin | Target Hub | Reserve | Credit line size |
| --- | --- | --- | --- |
| Aave DAO, through the Lend Spoke | Avana Base Hub | GHO | 50,000,000 GHO |
| Aave DAO, through the Lend Spoke | Avana Base Hub | USDC | 50,000,000 USDC |

### Add and draw caps

Caps in whole tokens. The Lend Spoke takes supply and draws nothing; CDP Spokes draw the borrowable assets and take LP collateral. Avana's own market caps (under LP market parameters) bound LP collateral further.

| Spoke | Reserve | Add cap | Draw cap |
| --- | --- | --- | --- |
| Lend Spoke | GHO | Max | 0 |
| Lend Spoke | USDC | Max | 0 |
| Lend Spoke | USDT | Max | 0 |
| Aero Slipstream Blue-chip | GHO | 0 | 10,000,000 |
| Aero Slipstream Blue-chip | USDC | 0 | 10,000,000 |
| Aero Slipstream Blue-chip | USDT | 0 | 5,000,000 |
| Aero Slipstream Blue-chip | WETH/USDC LP | Max | 0 |
| Aero Slipstream Blue-chip | cbBTC/USDC LP | Max | 0 |
| Aero Slipstream Blue-chip | cbBTC/WETH LP | Max | 0 |
| Aero Slipstream Gov/DeFi | GHO | 0 | 10,000,000 |
| Aero Slipstream Gov/DeFi | USDC | 0 | 10,000,000 |
| Aero Slipstream Gov/DeFi | USDT | 0 | 5,000,000 |
| Aero Slipstream Gov/DeFi | AERO/USDC LP | Max | 0 |
| Aero Slipstream Gov/DeFi | AERO/WETH LP | Max | 0 |
| Aero Slipstream Gov/DeFi | LINK/WETH LP | Max | 0 |
| Aero Slipstream Stocks | GHO | 0 | 10,000,000 |
| Aero Slipstream Stocks | USDC | 0 | 10,000,000 |
| Aero Slipstream Stocks | USDT | 0 | 5,000,000 |
| Aero Slipstream Stocks | AMZNc/USDC LP | Max | 0 |
| Aero Slipstream Stocks | SNDKc/USDC LP | Max | 0 |
| Aero Slipstream Stocks | GOOGLc/USDC LP | Max | 0 |
| Aero Slipstream Stocks | NVDAc/USDC LP | Max | 0 |
| Aero Slipstream Stocks | SPCXc/USDC LP | Max | 0 |
| Aero Slipstream Stocks | METAc/USDC LP | Max | 0 |

> `Max` is Aave V4's largest Spoke cap (`MAX_ALLOWED_SPOKE_CAP`). A debt asset that is not borrowable on a CDP Spoke keeps its draw cap but cannot be drawn.

### Risk parameters

LP reserves are collateral only. Debt reserves are never collateral. The Lend Spoke's reserves carry the borrowable flag, but their draw cap is 0, so nothing is drawn through the Lend Spoke.

| Spoke | Reserve | Collateral factor | Max liquidation bonus | Borrowable | Collateral risk | Liquidation fee | Risk premium threshold | receiveShares |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Lend Spoke | GHO | 0% | — | Yes | — | 0% | Max | No |
| Lend Spoke | USDC | 0% | — | Yes | — | 0% | Max | No |
| Lend Spoke | USDT | 0% | — | Yes | — | 0% | Max | No |
| Aero Slipstream Blue-chip | WETH/USDC LP | 72% | 6.5% | No | 800 bps | 0% | Max | No |
| Aero Slipstream Blue-chip | cbBTC/USDC LP | 72% | 6.5% | No | 800 bps | 0% | Max | No |
| Aero Slipstream Blue-chip | cbBTC/WETH LP | 72% | 6.5% | No | 800 bps | 0% | Max | No |
| Aero Slipstream Blue-chip | GHO | 0% | — | Yes | — | 0% | Max | No |
| Aero Slipstream Blue-chip | USDC | 0% | — | Yes | — | 0% | Max | No |
| Aero Slipstream Blue-chip | USDT | 0% | — | No | — | 0% | Max | No |
| Aero Slipstream Gov/DeFi | AERO/USDC LP | 68% | 8% | No | 1,000 bps | 0% | Max | No |
| Aero Slipstream Gov/DeFi | AERO/WETH LP | 68% | 8% | No | 1,000 bps | 0% | Max | No |
| Aero Slipstream Gov/DeFi | LINK/WETH LP | 68% | 8% | No | 1,000 bps | 0% | Max | No |
| Aero Slipstream Gov/DeFi | GHO | 0% | — | Yes | — | 0% | Max | No |
| Aero Slipstream Gov/DeFi | USDC | 0% | — | Yes | — | 0% | Max | No |
| Aero Slipstream Gov/DeFi | USDT | 0% | — | No | — | 0% | Max | No |
| Aero Slipstream Stocks | AMZNc/USDC LP | 65% | 10% | No | 1,200 bps | 0% | Max | No |
| Aero Slipstream Stocks | SNDKc/USDC LP | 65% | 10% | No | 1,200 bps | 0% | Max | No |
| Aero Slipstream Stocks | GOOGLc/USDC LP | 65% | 10% | No | 1,200 bps | 0% | Max | No |
| Aero Slipstream Stocks | NVDAc/USDC LP | 65% | 10% | No | 1,200 bps | 0% | Max | No |
| Aero Slipstream Stocks | SPCXc/USDC LP | 65% | 10% | No | 1,200 bps | 0% | Max | No |
| Aero Slipstream Stocks | METAc/USDC LP | 65% | 10% | No | 1,200 bps | 0% | Max | No |
| Aero Slipstream Stocks | GHO | 0% | — | Yes | — | 0% | Max | No |
| Aero Slipstream Stocks | USDC | 0% | — | Yes | — | 0% | Max | No |
| Aero Slipstream Stocks | USDT | 0% | — | No | — | 0% | Max | No |

> Collateral risk is Aave V4's `collateralRisk`: the premium borrowers pay on top of the base rate, and lenders earn, for that collateral. `Max` is Aave V4's `MAX_RISK_PREMIUM_THRESHOLD`. Avana requires a liquidation fee of 0 on every LP reserve; its revenue from a liquidation is the fee share under Fees.

### Price feeds

Each Spoke has its own AaveOracle; these are the sources it reads. Each name links to its address on Contract Addresses. GHO has no feed: Aave prices it at a fixed $1. Each market's LPOracle is recorded in the MarketRegistry.

| Spoke | Reserve | Oracle |
| --- | --- | --- |
| Lend Spoke and every CDP Spoke | GHO | Fixed $1 price (Aave) |
| Lend Spoke and every CDP Spoke | USDC | [DebtOracle, USDC](/developers/reference/addresses?network=base-sepolia#avana-core) |
| Lend Spoke and every CDP Spoke | USDT | [USDT / USD price feed](/developers/reference/addresses?network=base-sepolia#external-dependencies) |
| Aero Slipstream Blue-chip | Each LP reserve | [The market's LPOracle](/developers/reference/addresses?network=base-sepolia#avana-core) |
| Aero Slipstream Gov/DeFi | Each LP reserve | [The market's LPOracle](/developers/reference/addresses?network=base-sepolia#avana-core) |
| Aero Slipstream Stocks | Each LP reserve | [The market's LPOracle](/developers/reference/addresses?network=base-sepolia#avana-core) |

### LP market parameters

Avana's own settings for each market: the pool it accepts, how much of the pool's value counts as collateral, and how much can be pledged.

| Spoke | Market | Pool | Fee tier or tick spacing | Pool risk factor | Market cap | Consistency tolerance |
| --- | --- | --- | --- | --- | --- | --- |
| Aero Slipstream Blue-chip | WETH/USDC | @{markets.slip-WETH-USDC-cl100.pool} | Tick spacing 100 | Pending | $5,000,000 | 1% |
| Aero Slipstream Blue-chip | cbBTC/USDC | @{markets.slip-cbBTC-USDC-cl100.pool} | Tick spacing 100 | Pending | $5,000,000 | 1% |
| Aero Slipstream Blue-chip | cbBTC/WETH | @{markets.slip-cbBTC-WETH-cl100.pool} | Tick spacing 100 | Pending | $5,000,000 | 1% |
| Aero Slipstream Gov/DeFi | AERO/USDC | @{markets.slip-AERO-USDC-cl200.pool} | Tick spacing 200 | Pending | $5,000,000 | 1% |
| Aero Slipstream Gov/DeFi | AERO/WETH | @{markets.slip-AERO-WETH-cl200.pool} | Tick spacing 200 | Pending | $5,000,000 | 1% |
| Aero Slipstream Gov/DeFi | LINK/WETH | @{markets.slip-LINK-WETH-cl200.pool} | Tick spacing 200 | Pending | $5,000,000 | 1% |
| Aero Slipstream Stocks | AMZNc/USDC | @{markets.slip-AMZNc-USDC-cl100.pool} | Tick spacing 100 | Pending | $5,000,000 | 1% |
| Aero Slipstream Stocks | SNDKc/USDC | @{markets.slip-SNDKc-USDC-cl100.pool} | Tick spacing 100 | Pending | $5,000,000 | 1% |
| Aero Slipstream Stocks | GOOGLc/USDC | @{markets.slip-GOOGLc-USDC-cl100.pool} | Tick spacing 100 | Pending | $5,000,000 | 1% |
| Aero Slipstream Stocks | NVDAc/USDC | @{markets.slip-NVDAc-USDC-cl100.pool} | Tick spacing 100 | Pending | $5,000,000 | 1% |
| Aero Slipstream Stocks | SPCXc/USDC | @{markets.slip-SPCXc-USDC-cl100.pool} | Tick spacing 100 | Pending | $5,000,000 | 1% |
| Aero Slipstream Stocks | METAc/USDC | @{markets.slip-METAc-USDC-cl100.pool} | Tick spacing 100 | Pending | $5,000,000 | 1% |

### Lend Spoke

Each debt asset has a First-Loss Reserve and a DAO deficit offset on the Hub.

| Asset | Borrowable on CDP Spokes | First-Loss Reserve minimum | DAO deficit offset minimum |
| --- | --- | --- | --- |
| GHO | Yes | 100,000 GHO | 75,000 GHO |
| USDC | Yes | 100,000 USDC | 75,000 USDC |
| USDT | No | 50,000 USDT | 25,000 USDT |

### Collateral tokens

Each pool token's collateral factor (CF0 and CF1 in the LP collateral factor, `min(CF0, CF1) × poolRiskFactor`) and its exposure cap across every Spoke and market of the Hub.

| Token | Token collateral factor | Token cap |
| --- | --- | --- |
| USDC | 90% | $50,000,000 |
| USDT | 90% | $50,000,000 |
| WETH | 85% | $50,000,000 |
| cbBTC | 84% | $50,000,000 |
| AERO | 76% | $10,000,000 |
| LINK | 76% | $10,000,000 |
| AMZNc | 73% | $5,000,000 |
| SNDKc | 73% | $5,000,000 |
| GOOGLc | 73% | $5,000,000 |
| NVDAc | 73% | $5,000,000 |
| SPCXc | 73% | $5,000,000 |
| METAc | 73% | $5,000,000 |

### Chain settings

| Parameter | Value | Description |
| --- | --- | --- |
| `CHAIN_BLOCK_TIME` | 2 s | Block interval of the chain. It sizes the observation buffer a pool needs for the time-weighted price check. |
| `twapMinObservations` | 901 | Observation slots a pool must hold for a 1,800 s window at 2 s blocks. |
| `sequencer.feed` | Chainlink L2 sequencer uptime feed | While it reports the sequencer down, borrow-side prices fail closed and liquidation pauses. Its address is on [Contract Addresses](/developers/reference/addresses?network=base-sepolia#external-dependencies). |
| `sequencer.gracePeriod` | 3,600 s | Time after a sequencer restart during which borrowing and new pledges are refused (bounds 600–7,200 s). |


## All networks

These parameters have the same rules on every network. Bounds are enforced on-chain unless the description says otherwise. `Set by governance` means the Aave DAO or Avana's timelock decides the value; where Avana proposes a starting value, the description gives it.

### Fees

| Parameter | Value | Bounds | Description | Source |
| --- | --- | --- | --- | --- |
| `avanaFeeShareBps` | 2,000 bps (20%) | 0–5,000 bps | Avana's share of a liquidation's gain over the debt repaid, valued at the oracle price and paid in the repaid debt asset. It never exceeds the surplus the liquidation actually realized, so the debt is always repaid first. | `Q-097`, `Q-196`, `Q-231`, `SPEC-LIQ-009`; `ParameterStoreStorage.sol:84`, `SettlementMath.sol:311-315` |
| `feeRecipient` | Avana treasury | Non-zero address | Avana's treasury receives both the liquidation fee share and the app's frontend fee. It is a separate account from the deployer and the keeper, and changes only through the timelock at the normal delay. | `Q-196`, `Q-409`; `ParameterStoreAdminRiskLogic.sol:89`, `contracts/script/local/lib/chain.ts:132` (#135), `contracts/script/local/lib/keys.ts:52-54` (#135) |
| `defaultBps` (frontend fee) | 10 bps | 0–25 bps | Fee the Avana app adds to every action it builds: supply, withdraw, pledge, withdraw collateral, borrow, repay, repay with collateral and deleverage. The wallet sends it to `feeRecipient` in the action's own batch; no contract charges it, and keeper liquidations pay none. | `Q-409`; `services/convex/convex/lib/fees.ts:29`, `:188` |
| Interest fee | None | — | Avana charges no fee on borrow interest; borrowers pay only the Hub's borrow rate. | `Q-231` |

> The 25 bps frontend fee ceiling is a commitment in the Aave proposal enforced by the app's fee rules, not by a contract. The Joint Configuration Safe can change `avanaFeeShareBps` at once within its bounds; every other change waits the normal delay (`REQ-ROLE-117`, `ParameterStoreAdminRiskLogic.sol:117`).

### Risk module

| Parameter | Value | Bounds | Description | Source |
| --- | --- | --- | --- | --- |
| `hardHealthFloor` | 0 (off) | 0, or 1.00–1.25 | Optional per-market floor on the health factor after a borrow or a withdrawal that leaves debt. It is off, so Aave's health factor of 1.00 is the only on-chain borrow limit; a loosening lowers it by at most 0.03. | `Q-398`; `ParameterStoreStorage.sol:71-72`, `ParameterStoreListingLogic.sol:78-79` |
| `RESCUE_HEALTH_FACTOR` | 1.10 | — | An indebted account below this health factor can add collateral as a rescue top-up, which uses the market's reserved slice when caps are full. It is not a borrow limit. | `Q-398`; `RiskModuleConstants.sol:13` |
| `RECOMMENDED_HEALTH_FACTOR` | 1.10 | — | Health factor of the recommended borrow amount the app shows beside the maximum at 1.00. It is guidance and is not enforced on-chain. | `Q-398`; `LensConstants.sol:19` |
| `minPledgeUsd` | Set by governance | $0–$100,000 | Smallest USD value one pledge, new account or top-up can add, so accounts are not built from dust positions. Avana proposes $10 per market. | `Q-230`, `Q-394`; `ParameterStoreStorage.sol:83` |
| `RESCUE_MIN_PLEDGE_USD` | $10 | — | A rescue top-up needs only the lower of this and `minPledgeUsd`, so a raised minimum never stops a borrower adding collateral to avoid liquidation. | `Q-252`; `RiskModuleConstants.sol:16` |
| `marketUsdCap` | Set by governance | > 0 at listing; 0 or more after a tightening | USD budget for pledges in one market. Tightening it to 0 stops new pledges and leaves repay, exits, liquidation and rescue top-ups open. | `Q-197`; `ParameterStoreLoosenLogic.sol:134` |
| `tokenUsdCap` | Set by governance | > 0 at listing; 0 or more after a tightening | Exposure cap per underlying token across every Spoke and market of a Hub. Each pledge counts its full LP value against both of its tokens. | `Q-197`, `Q-249` |
| `LOOSEN_CAP_STEP_BPS` | 15,000 bps (×1.5) | — | Largest rise of a USD cap in one loosening, at most once per normal delay. A cap below $1,000 can instead be raised straight to $1,000 (`USD_CAP_REOPEN_BASE`). | `Q-246`; `ParameterStoreStorage.sol:73`, `:98` |
| `topUpSliceUsd` | Set by governance | ≤ `marketUsdCap` | Cap room reserved in each market for rescue top-ups, so a full cap never blocks a borrower adding collateral. Avana proposes 10% of the market cap. | `Q-157`, `Q-394` |
| `stressFloorUsd` | Set by governance | > 0 | Lowest price per vault token used when charging caps. Avana proposes $1.00. | `Q-175`, `Q-394` |
| `poolRiskFactor` | Set by governance | 1–4,000 bps | Per-pool discount in the LP collateral factor, `min(CF0, CF1) × poolRiskFactor`. The Aave DAO sets the resulting collateral factor. | `Q-186`; `ParameterStoreStorage.sol:81`, `ParameterStoreAdminRiskLogic.sol:103` |
| `tokenCollateralFactorBps` | Set by governance | 1–9,999 bps | Each token's collateral factor on the Aave V4 Core Hub, recorded at listing as CF0 and CF1 of the LP collateral factor. | `Q-188`; `ParameterStoreStorage.sol:82`, `ParameterStoreAdminRiskLogic.sol:218` |
| `poolShareMaxBps` | 10,000 bps (no limit) | 1–10,000 bps | Largest share of a pool's active liquidity Avana may hold across all its markets on a chain. Off by default; a pool's listing may set a lower cap, and a share above 25% raises a monitoring alert. | `Q-403`; `ParameterStoreAdminRiskLogic.sol:87` |
| `marketSpeedLimits.window` | Set by governance | 3,600–604,800 s | Length of each borrow-speed and pledge-speed window. Any window takes at most one limit, so a mispriced market loses at most one limit before a guardian freeze. Avana proposes 21,600 s (6 hours). | `Q-411`, `SPEC-CAP-011`; `ParameterStoreSpeedRules.sol:18-20` |
| `marketSpeedLimits.borrowRateBps`, `borrowMinUsd`, `borrowMaxUsd` | Set by governance | Rate 0–10,000 bps; min ≤ max | New debt per window in a market, net of repays, is at most the rate times the Spoke's debt, kept between the min and max. Avana proposes 25%, $250,000 and $2,500,000. | `Q-411`, `REQ-RISK-092`; `ParameterStoreSpeedRules.sol:22`, `:31` |
| `marketSpeedLimits.pledgeRateBps`, `pledgeMinUsd`, `pledgeMaxUsd` | Set by governance | Rate 0–10,000 bps; min ≤ max | New collateral per window in a market, net of withdrawals, is at most the rate times the market's booked value, kept between the min and max; rescue top-ups are exempt. Avana proposes 25%, $1,000,000 and $10,000,000. | `Q-411`, `REQ-RISK-093`; `ParameterStoreSpeedRules.sol:22`, `:31` |
| `debtSpeedLimit.rateBps`, `min`, `max` | Set by governance | Rate 0–10,000 bps; min ≤ max | New draws per window of one debt asset from one Hub across every Avana Spoke, net of repays. Avana proposes 25%, 500,000 and 5,000,000 tokens, so credit lines and draw caps bind first. | `Q-411`, `REQ-RISK-092`; `ParameterStoreSpeedRules.sol:42` |
| `gateRecoverySeconds` | Set by governance | 600–7,200 s | Time a temporary gate (oracle, pool share or pool depth) stays closed after its last recorded breach. Avana proposes 1,800 s. | `Q-399`; `ParameterStoreStorage.sol:87-88` |
| `breakerDeficitMax` | Set by governance | 0 to the reserve's `firstLossReserveMinimum` | Outstanding deficit on a debt reserve above which new borrowing of that reserve freezes until an authorized reset. Avana proposes 10,000 GHO for a GHO reserve. | `Q-241`, `Q-399`; `ParameterStoreLoosenLogic.sol:290` |
| `BreakerReasons.TEMPORARY` | `ORACLE`, `POOL_SHARE`, `POOL_DEPTH` | — | Gates that block new borrowing or pledges only while their condition holds, then reopen after `gateRecoverySeconds`. Repay, debt-free exits, rescue top-ups and liquidation stay open. | `Q-399`; `Breaker.sol:23-44` |
| `BreakerReasons.SECURITY`, `MANUAL` | `ISSUER`, `CONFIG_DRIFT`, `DEFICIT`, `MANUAL` | — | Freezes that stay latched until a guardian or a timelock operation resets them. There is no on-chain budget breaker; price drops, seizure surges and route failures are monitoring alerts. | `Q-241`, `Q-399`; `Breaker.sol:15-19`, `:31-46` |
| `ISSUER_PROBE_GAS` | 30,000 gas | — | Gas given to each check of a token issuer's pause or fee switch. A probe that fails counts as tripped, so a token cannot hide an issuer action. | `Q-241`; `RiskModuleConstants.sol:19` |
| `liquidationFee` (Aave, per LP reserve) | 0 | Any other value is drift | Aave V4's native liquidation fee on vault-token reserves must stay 0. | `Q-068`, `Q-281`; `RiskModuleDriftLogic.sol:259`, `MarketRegistryActivationLogic.sol:79` |
| `receiveSharesEnabled` (Aave, per LP reserve) | false | Any other value is drift | A liquidator must receive vault tokens, never Spoke supply shares, so every seizure goes through the vault token's transfer rule. | `Q-281`; `RiskModuleDriftLogic.sol:217` |
| `reinvestmentController` (Aave, per vault-token asset) | `address(0)` | Any other value is drift | No reinvestment controller may hold vault-token assets on the Hub. | `Q-281`; `RiskModuleDriftLogic.sol:246` |

> A configuration drift (`CONFIG_DRIFT`) blocks new pledges, borrowing and withdrawals that leave debt on the Spoke; it never blocks repay, debt-free exits or liquidation (`REQ-RISK-078`).

### Liquidation and settlement

| Parameter | Value | Bounds | Description | Source |
| --- | --- | --- | --- | --- |
| `targetHealthFactor` (expected) | 1.10 | > 1.00 | Health factor Aave's liquidation restores an account to, as Avana records it for each CDP Spoke. The Aave DAO sets the live value; a different live value counts as drift. | `Q-185`, `Q-393`; `09_ListMarkets.s.sol:331`, `ParameterStoreListingLogic.sol:250-251` |
| `minLiquidationBonus` (expected) | 200 bps (2%) | 200–9,999 bps | Bonus just below health factor 1 that Avana's checks assume. It must cover gas, swap costs and Avana's fee share. | `Q-179`, `Q-393`; `09_ListMarkets.s.sol:331`, `ParameterStoreStorage.sol:100` |
| `liquidationBonusFactor`, `healthFactorForMaxBonus` | Set by governance | — | Aave V4 liquidation settings of each CDP Spoke that shape the bonus between its minimum and maximum. The deployment payload uses 5,000 bps and 0.95 on the test networks. | `Q-393`; `06_AaveDeploymentPayload.s.sol` `_hubSpokes` |
| `slippageAllowanceBps` | Set by governance | ≥ `slippageAllowanceMinBps`, < 10,000 bps | Most below oracle value a liquidation's swaps may settle; it is also capped live by the net bonus. Avana proposes 100 bps. | `SPEC-LIQ-003`, `Q-394`; `ParameterStoreListingLogic.sol:71-76` |
| `slippageAllowanceMinBps` | Set by governance | ≥ route fee plus price impact | Floor for `slippageAllowanceBps`, set per market at listing, so a tightening can never make liquidation impossible. | `Q-139`, `Q-209` |
| `LOOSEN_SLIPPAGE_STEP_BPS` | 25 bps | — | Largest rise of `slippageAllowanceBps` in one loosening. | `Q-246`; `ParameterStoreStorage.sol:74` |
| `maxShortfallBps` | Set by governance | 0–5,000 bps | Extra slippage per swap leg a liquidator can buy by adding its own funds. The liquidator also pays any rounding gap this way, since there is no settlement budget. Avana proposes 1,000 bps. | `Q-251`, `Q-397`; `ParameterStoreStorage.sol:86` |
| `floorRoundingAllowance` | Set by governance | > 0 and worth at most $1 | Fixed amount subtracted from the recovery floor of a liquidation, so very small liquidations settle. Avana proposes $1 worth of each debt asset. | `Q-198`, `Q-397`; `ParameterStoreRisk.sol:224` |
| `maxFlashFeeBps` | Set by governance | 0–100 bps | Highest Aave V3 flash-loan premium accepted for `deleverage` and the flash liquidation helper; `liquidate` itself takes no flash loan. Avana proposes 10 bps. | `SPEC-LIQ-015`, `Q-404`; `ParameterStoreStorage.sol:85` |
| `routeDepthThreshold` | Set by governance | > 0 | Amount of the debt asset each approved swap route must deliver within the slippage allowance in the stress case. It is a listing and monitoring criterion. | `Q-244`, `REQ-CONFIG-070` |
| `settlementReserveId` | First debt reserve enabled on the Spoke | An enabled debt reserve of the Spoke | Debt reserve whose asset a market's pending settlement is converted into, and whose First-Loss Reserve receives it. | `Q-338`, `Q-408` |
| `PENDING_SLIPPAGE_CAP_BPS` | 30 bps | — | Cap on swap slippage when value held after a liquidation is settled later. | `SPEC-LIQ-014`; `SettlementMath.sol:39` |
| `PAYOUT_TRANSFER_GAS` | 100,000 gas | — | Gas given to each payout of a liquidation (borrower surplus, Avana's fee, residues). A payout that fails is held in the payout escrow for its recipient to claim. | `Q-214`, `Q-401`; `LPVaultSwapStorage.sol:21` |
| `MAX_REPAY_TRANSFERS` | 4 | — | Most transfers used to repay a flash loan of a debt asset with a transfer fee in `deleverage`. | `Q-390`; `LPVaultSwapStorage.sol:26` |
| `MAX_RECORDS_PER_ACCOUNT_MARKET` | 16 | — | Most open positions one account holds in one market, so seizing a whole account fits within the 7.5M gas liquidation budget. | `Q-287`, `SPEC-CHAIN-001`; `AmmConstants.sol:16` |

### Oracles

| Parameter | Value | Bounds | Description | Source |
| --- | --- | --- | --- | --- |
| `twapWindow` | 1,800 s | > 0 and within the pool's observation history; on an L2 at most `sequencer.gracePeriod` | Window of the check that compares the Chainlink-implied price with the pool's time-weighted price. A hookless Uniswap v4 pool has no time-weighted price, so its market reads the window from the same pair's Uniswap v3 reference pool and also checks the v4 pool's spot price. | `Q-196`, `REQ-PSTORE-034`, `REQ-AMM-V4-005`; `09_ListMarkets.s.sol:868`, `:1074` |
| `consistencyToleranceBps` | Set by governance | 10–10,000 bps | Largest allowed gap between the pool's time-weighted price and the Chainlink-implied price; one tick is about 1 bp. Avana proposes 50 bps. | `Q-196`, `Q-394`; `ParameterStoreStorage.sol:77`, `ParameterStoreListingLogic.sol:72-76` |
| `feedHeartbeat` | Per feed, as Chainlink publishes it | 1–86,400 s | Published heartbeat of each Chainlink feed, recorded at listing. | `Q-182`; `ParameterStoreStorage.sol:79`, `ParameterStoreListingLogic.sol:168` |
| `heartbeatMargin` | Set by governance | 1–3,600 s | Margin added to a feed's heartbeat before its price counts as stale, so a late publication does not stop a healthy feed. Avana proposes 1,800 s. | `SPEC-ORC-019`, `Q-394`; `ParameterStoreStorage.sol:78` |
| `feedMaxAge`, `liquidationPriceMaxAge`, `borrowPriceMaxAge` | `feedHeartbeat` + `heartbeatMargin` | — | Oldest price a route leg, a liquidation or a borrow accepts. Because a price can be a full heartbeat old, a borrow also needs the token's second source to agree. | `SPEC-ORC-019`, `Q-274` |
| `feedAgreementMarginBps` | Set by governance | 0–10,000 bps | Margin added to the two Chainlink routes' deviation thresholds before they count as disagreeing. Avana proposes 50 bps. | `Q-184`, `Q-394`; `ParameterStoreAdminRiskLogic.sol:85` |
| `feedAgreementToleranceBps` | Per token, computed at listing | ≥ both routes' deviation thresholds + `feedAgreementMarginBps` | Allowed difference between a token's primary and alternate Chainlink routes. | `Q-184`, `Q-196` |
| `secondSource.toleranceBps` | Set by governance | 1–500 bps | Each token has an independent second price source that must agree with the served price before a borrow or a withdrawal that leaves debt. Liquidation never reads it. | `Q-287`, `Q-385`; `ParameterStoreStorage.sol:99`, `ParameterStoreAdminRiskLogic.sol:363` |
| `cachedWindow` | Set by governance | > 0 | After both routes of a token fail, the market keeps its last good price for this long before the price expires. Avana proposes 3,600 s, time for a guardian to switch to the standby route. | `Q-183`, `Q-394`; `ParameterStoreAdminRiskLogic.sol:83` |
| `disagreementPauseMax` | Set by governance | 0–3,600 s | Longest liquidation pause while the two routes disagree; after it the market counts as expired for liquidation. Avana proposes 3,600 s. | `Q-183`, `Q-199`; `ParameterStoreStorage.sol:91` |
| `graceDuration` | Set by governance | 0–7,200 s | After a price recovers from expired, only accounts below `graceHealthFactor` can be liquidated for this long, so borrowers can react to a price they could not see. Avana proposes 1,800 s. | `Q-196`, `Q-394`; `ParameterStoreStorage.sol:76` |
| `graceHealthFactor` | Set by governance | 0.90 to below 1.00 | Health factor below which accounts can be liquidated during grace. Avana proposes 0.95. | `Q-196`; `ParameterStoreStorage.sol:75`, `ParameterStoreAdminRiskLogic.sol:81` |
| `usdBandLow`, `usdBandHigh` | Set by governance | Low < $1.00 < high | LP value per $1 at peg outside which a Stable-tier market blocks new borrowing and withdrawals that leave debt. Avana proposes $0.90 and $1.02. | `Q-195`, `Q-206`; `ParameterStoreAdminRiskLogic.sol:83` |
| `STABLE_CEILING_USD` | $1.00 | — | Every USD stablecoin leg is valued at no more than $1, so a premium cannot inflate collateral. | `Q-177`; `LPPriceMath.sol:36` |
| `MAX_QUOTE_CHANGE_BPS` | 100 bps (1%) | — | Largest change of a market's price between two blocks. A larger move is served as cached until a later block confirms it, which stops a one-block spike from opening borrowing or liquidation. | `Q-394`, `REQ-ORACLE-103`; `LPOracleStorage.sol:101`, `09_ListMarkets.s.sol:871` |
| `debtStressRiseBps` | Set by governance | 100–5,000 bps | Once a non-GHO debt asset's price expires, its last price is raised by this much, so debt that cannot be priced counts at a stress price. Avana proposes 500 bps for USDC. | `Q-247`, `Q-248`; `ParameterStoreStorage.sol:89-90` |
| `pokeMinGas` (LPOracle) | 1,000,000 gas | 1,000,000–3,000,000 gas | Minimum gas a `poke()` needs at entry, so a gas-starved call cannot record a wrong price state. The floor is about 16% above the measured worst case and stays provisional until a fork benchmark sets it. | `Q-405`, `SPEC-ORC-023`; `09_ListMarkets.s.sol:82`, `AvanaDeploy.sol:14-15` |
| `pokeMinGas` (DebtOracle) | TBD | 600,000–2,000,000 gas | The same minimum for the DebtOracle of each non-GHO debt asset. | `SPEC-ORC-023`; `DebtOracleStorage.sol:66-67` |
| `FEED_CALL_GAS`, `POOL_CALL_GAS`, `OBSERVE_CALL_GAS`, `CONFIG_CALL_GAS` | 50,000 / 100,000 / 160,000 / 40,000 gas | — | Gas given to each external read of an oracle. A call without enough gas left reverts instead of reading with too little. | `Q-328`; `LPOracleStorage.sol:81-91` |
| `DECIMALS_CHECK_MAX_AGE` | 7,200 s | — | Borrowing needs a token-decimals check within this age, two keeper intervals, so one missed keeper run blocks nothing. | `Q-066`, `Q-370`; `LPOracleStorage.sol:107` |
| `MAX_ROUTE_ANSWER` | $10,000,000,000 per token | — | Largest route price accepted, far above every listable token and small enough that price math cannot overflow. | `Q-191`; `LPPriceMath.sol:41` |

### Market registry

| Parameter | Value | Bounds | Description | Source |
| --- | --- | --- | --- | --- |
| `MAX_MARKET_COUNT` | Set at deployment | ≥ 1 | Most markets the registry ever lists on a chain, closed ones included. It is fixed when the MarketRegistry is deployed and keeps the ParameterStore's chain-wide re-check of every market within one transaction; the local test stack uses 128. | `REQ-MREG-034`; `MarketRegistryStorage.sol:184`, `MarketRegistryListingLogic.sol:187`, `contracts/script/local/lib/chain.ts:131` (#135) |
| `RiskTier` | Stable, Correlated, Volatile | — | Listing class of each Hub and CDP Spoke. A Stable-tier market may hold only USD stablecoins; Correlated pools hold tokens that track each other, and Volatile pools hold uncorrelated tokens. Each chain has one Hub, at tier 3 (Volatile), which takes Spokes of every class. | `Q-058`, `REQ-CONFIG-016`; `RiskTier.sol:10-15`, `MarketRegistryMarketChecks.sol:95-120`, `contracts/script/local/lib/chain.ts:110-113` (#135) |
| `MAX_POOL_TOKENS` | 8 | 2–8 | Most tokens in one market's pool. | `REQ-CONFIG-017`; `AmmConstants.sol:14-15` |
| `approvedDebtReserves` | Listed per Spoke above | The Spoke's borrowable reserves | Debt reserves each CDP Spoke offers. The drift check requires them to equal the Spoke's borrowable reserves on Aave. | `Q-233`, `REQ-HUB-101` |
| `OFFBOARD_NOTICE_SECONDS` | 432,000 s (5 days) | — | Public notice between a market's offboarding and both the Aave DAO's liquidation-threshold drop and the market's closing. | `Q-355`; `MarketRegistryStorage.sol:146` |
| `OFFBOARD_TARGET_SHARE_BPS` | 5,000 bps (50%) | — | Liquidation threshold an offboarded market is lowered to, as a share of its threshold at offboarding. The Aave DAO applies the drop once after the notice. | `Q-355`; `MarketRegistryStorage.sol:149` |
| `crossHubLinesEnabled` | false | — | Whether a debt reserve may draw from a Hub other than its Spoke's home Hub. Off at launch. | `Q-283`; `MarketRegistryDebtChecks.sol:45` |
| `crossHubLineCap` | 0 | 0 to the funding First-Loss Reserve's balance | Most a CDP Spoke homed on another Hub may draw from a funding Hub. Stays 0 while cross-Hub lines are off. | `Q-283`; `MarketRegistryHubsLogic.sol:127` |

### Aave-side settings

The Aave DAO sets these values on Avana's Hub and Spokes. Avana records some of them and checks the rest.

| Parameter | Value | Bounds | Description | Source |
| --- | --- | --- | --- | --- |
| `creditLine` | Set by governance | The CDP Spokes' draw caps on a (Hub, asset) sum to at most the line | Most the CDP Spokes together may borrow of one debt asset from one Hub. Each draw cap is sized against the depth of its swap routes. | `Q-282`, `Q-392`, `Q-407`; `MarketRegistryHubsLogic.sol:253-256` |
| `drawCap` | Set by governance | Within the credit line | Most one CDP Spoke may borrow of one debt asset. Borrowing also needs idle Hub liquidity supplied through the Lend Spoke. | `SPEC-HUB-003`, `Q-407` |
| `addCap` (Lend Spoke) | Set by governance | — | Supply cap of each Lend Spoke asset, which bounds what all lenders together may supply. It is separate from the credit line. | `REQ-HUB-017`, `Q-407` |
| `baseDrawnRate`, `rateGrowthBeforeOptimal`, `rateGrowthAfterOptimal`, `optimalUsageRatio` | Set by governance | Optimal ratio 1–99%; base + before + after ≤ 100,000 bps | Aave V4's kinked interest rate curve for each lend asset: the borrow rate rises gently up to the optimal usage and steeply past it, which draws new supply and pushes borrowers to repay. | `SPEC-HUB-007`, `Q-408` |
| `liquidityFee` (per lend asset) | Set by governance | — | Share of borrow interest on each lend asset that the Hub keeps for the Aave treasury instead of paying to suppliers. | `Q-408`; `06_AaveDeploymentPayload.s.sol` `_liquidityFee` |
| `spokeUserReservesLimit` | Set by governance | — | Most reserves one account can use on a CDP Spoke, counting its collateral reserve and its debt reserves. | `Q-193`, `Q-280` |
| `collateralRisk`, `riskPremiumThreshold` | Set by governance | Threshold ≥ highest `collateralRisk` + 1 | Aave V4 risk premium settings of each CDP Spoke and its reserves. | `Q-111`, `Q-178` |

### Keepers

| Parameter | Value | Bounds | Description | Source |
| --- | --- | --- | --- | --- |
| `KEEPER_FLOOR` | 1 | 1–32 | Fewest active committed keepers on a chain. Removing a keeper below it reverts, and new borrowing halts only while no active keeper remains; liquidation stays open to every address. | `Q-242`, `Q-400`; `LPVaultSwapStorage.sol:80`, `LPVaultSwap.sol:177` |
| `MAX_KEEPERS` | 32 | — | Most registered committed keepers per chain. | `Q-316`, `Q-400`; `LPVaultSwapStorage.sol:28` |
| `SIGNER` (liquidation keeper) | Separate keeper signer | — | Avana's liquidation keeper sends from its own signer, held in a KMS or HSM. Each keeper instance has its own signer and operator flash liquidation helper, and each chain funds a primary and a standby signer. | `REQ-HELPER-011`; `OperatorFlashLiquidator.sol:27`, `services/README.md:246`, `:261`, `:273`, `contracts/script/local/lib/keys.ts:52-54` (#135) |
| `CHECKPOINT_INTERVAL` | 3,600 s | — | Keepers poke every LPOracle and DebtOracle at least this often, or once per heartbeat of the fastest feed if that is shorter. | `REQ-ORACLE-037`; `LPOracleStorage.sol:103` |
| `pokeBreakers`, `pokeConfig` | Every block | — | Avana's keeper simulates the breaker and drift checks every block and sends them only when a breach or drift must be recorded. Anyone may call them. | `REQ-RISK-090`, `REQ-RISK-091`, `Q-413` |
| Shard takeover | 2 blocks on Ethereum, 6 blocks on Base | — | Any primary keeper liquidates an account that its own shard has not liquidated within this time after it became liquidatable. | `Q-082`; `services/README.md:261` |
| Standby keeper | 60 s | — | The standby keeper, on a different provider, sends for any account still liquidatable after this time. | `Q-082`, `Q-147`; `services/README.md:262` |
| `MAX_SIGNERS` (AvanaGasVault) | 8 | 1–8 | Most keeper signers one gas vault refills. | `Q-413`; `AvanaGasVault.sol:32` |
| `PERIOD`, `MAX_SENDS_PER_PERIOD` | 86,400 s; 4 | — | Window of each signer's refill cap and the most refills a signer gets in it. | `Q-413`; `AvanaGasVault.sol:26-29` |
| `minBalance`, `targetBalance`, `periodCap` | Set by governance | 0 < `minBalance` ≤ `targetBalance`; `periodCap` > 0 | A signer below `minBalance` is refilled to `targetBalance`, and at most `periodCap` is sent to it in any 24 hours. They are sized from the signer's measured daily gas spend. | `Q-413`; `AvanaGasVault.sol:387` |

### Governance and timelock

| Parameter | Value | Bounds | Description | Source |
| --- | --- | --- | --- | --- |
| `SHORT_DELAY` | 43,200 s (12 hours) | — | Delay of an operation whose every call is on the short-delay list: tightenings, freezes, pauses, breaker trips, standby switches, keeper removals and market activation. | `Q-228`, `Q-262`; `AvanaTimelock.sol:26` |
| `normalDelay` | 432,000 s (5 days) | 345,600–432,000 s | Delay of every other operation: upgrades, listings, loosenings, fee changes, keeper additions and role changes. A loosening of a step-limited parameter moves one step at most once per normal delay. | `Q-228`, `Q-246`; `AvanaTimelock.sol:72`, `AvanaCoreDeploy.sol:88` |
| `MIN_NORMAL_DELAY` | 345,600 s (4 days) | — | Floor of the normal delay, long enough for borrowers to leave before any normal-delay operation executes. | `Q-262`, `SPEC-GOV-015`; `AvanaTimelock.sol:30` |
| `MAX_DELAY` | 432,000 s (5 days) | — | Ceiling of the normal delay. | `Q-228`; `AvanaTimelock.sol:28` |
| `GRACE_PERIOD` | 1,209,600 s (14 days) | — | Time a ready operation stays executable; after it the operation expires. | `Q-228`; `AvanaTimelock.sol:32` |
| `publicExecution` | true | — | Any address may execute a ready operation. | `Q-228`; `AvanaCoreDeploy.sol:88` |
| `PROPOSER_ROLE` | Governance multisig, Aave governance executor | ≥ 2 proposers | The two proposers of timelock operations. Only the Aave governance executor cancels role changes and restoring operations. | `Q-245`, `REQ-ACCESS-156` |
| Governance multisig | 4-of-7 | At least 4 signers | Proposes and cancels operations; at most 3 signers from Avana Labs, from at least 3 organisations. | `Q-114`, `Q-245`, `Q-285` |
| Emergency Guardian | 3-of-5 | — | Holds the immediate powers: freeze, pause, address freeze, breaker trips and standby route switches, plus cancel. It cannot change a parameter value. | `Q-227`, `Q-228`, `Q-241`, `REQ-ROLE-007` |
| Joint Configuration Safe (`APPLICATION_RISK_STEWARD`) | 2-of-3 | Tightenings only, plus `avanaFeeShareBps` within 0–5,000 bps | One Avana Labs signer, one Aave Labs signer and an independent risk-provider seat. It can tighten ParameterStore values at once, never loosen them. | `REQ-PSTORE-002`, `REQ-ROLE-117` |
| `MAX_ADDRESS_FREEZES_PER_DAY` | 20 | — | Most address freezes one caller can make in about 24 hours, so a compromised guardian cannot freeze addresses at scale. | `Q-242`; `MarketRegistryStorage.sol:130` (`_MAX_FREEZES_PER_DAY`) |
| `STANDBY_RESWITCH_COOLDOWN` | 5 days | — | After the Aave DAO undoes a standby switch, the guardians cannot switch the same token again for this long. | `REQ-MREG-028`; `MarketRegistryStorage.sol:143` (`_STANDBY_RESWITCH_COOLDOWN`) |

> Signer sets of the governance multisig, the Emergency Guardian, the Joint Configuration Safe and the Aave Protocol Guardian do not overlap. Each chain has its own Safes and timelock.

### First-Loss Reserve

Each (Hub, debt asset) has an Avana Umbrella (First-Loss Reserve), funded by Avana Labs, that covers deficits first. A DAO deficit offset funded by the Aave DAO treasury covers what remains.

| Parameter | Value | Bounds | Description | Source |
| --- | --- | --- | --- | --- |
| `firstLossReserveMinimum` | Set by governance | ≥ `coverageRatioBps` × credit line / 10,000 | Minimum funded balance of each Avana Umbrella, set in the funding proposal. | `Q-236`, `Q-353`, `Q-391` |
| `coverageRatioBps` | Set by governance | 0–10,000 bps | Required coverage of each (Hub, asset): the funded balance must be at least this share of the draw caps on it, checked when a debt reserve is enabled and when a draw cap rises. 20% is an illustrative guide only. | `Q-353`, `Q-391`; `ParameterStoreListingLogic.sol:304` |
| `daoDeficitOffset` | Set by governance | ≥ 0 | Size of the Aave DAO's second loss layer for each (Hub, asset), spent only after the Avana Umbrella is empty or deactivated. | `Q-410` |
| `RESERVE_WITHDRAWAL_DELAY` | 1,209,600 s (14 days) | Must equal 14 days | Delay before unused funds can leave an Avana Umbrella or a DAO deficit offset, with DAO approval. | `Q-101`; `AvanaFirstLossReserve.sol:46`, `:101` |
| `deficitCoverageWindow` | Set by governance | — | Longest time from a recorded Hub deficit to its coverage by the Avana Umbrella. Avana proposes 72 hours; monitoring alerts on any deficit at once. | `Q-101`, `Q-394` |
| `COVERAGE_ROLE` | Emergency Guardian, Aave Protocol Guardian | — | Holders of the role that spends an Avana Umbrella to cover a deficit. | `Q-142`; `08_AaveLossLayersPayload.s.sol:53`, `:102` |
