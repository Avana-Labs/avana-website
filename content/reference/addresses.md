---
title: Contract Addresses
description: Addresses of the Avana Hub and Spokes, the contracts Avana deploys, and the external contracts and tokens it depends on, per network.
updated: 2026-11-16
---

Each chain has one Avana Hub on Aave V4, with a Lend Spoke and the CDP Spokes where AMM liquidity positions are collateral. Each release also records its addresses in its release manifest.

Market pools and risk values are on [Market Parameters](/developers/reference/parameters); roles and who can change what are on [Access Control](/developers/reference/access-controls).

Every Avana chain runs the standard, unmodified Aave V4 release pinned at commit `a3ef63ea6415d25237a9775bf66e76e9993561c2`, and Avana's timelock and upgradeable contracts use OpenZeppelin Contracts and Contracts Upgradeable v5.1.0, pinned by commit. The libraries LPPriceMath, SettlementMath and AvanaRoles are compiled into the contracts that use them and have no address of their own.

## Ethereum Sepolia
- network: ethereum-sepolia

One Hub with the Lend Spoke and 6 CDP Spokes listing 10 markets. Market pools and risk parameters are on [Market Parameters](/developers/reference/parameters?network=ethereum-sepolia).

### Hub

| Name | Description | Address |
| --- | --- | --- |
| Avana Ethereum Hub | Standard Aave V4 Hub, the only Avana Hub on this chain. It holds the lent assets and the vault-token collateral of every Spoke below, and each Spoke sets its own risk parameters. Upgradeable by the Aave DAO, which owns its proxy. | @{aave.hubs.ethereum} |

### Uniswap v3 Spokes

| Name | Description | Address |
| --- | --- | --- |
| Uniswap v3 Stable | Aave V4 CDP Spoke where Uniswap v3 positions in stablecoin pools are collateral for borrowing GHO and USDC. Borrowers reach it only through the AaveAdapter. Upgradeable by the Aave DAO, which owns its proxy. | @{aave.borrowSpokes.uniV3Stable} |
| Uniswap v3 Blue-chip | Aave V4 CDP Spoke where Uniswap v3 positions in ETH and BTC pools against stablecoins are collateral for borrowing GHO and USDC. Borrowers reach it only through the AaveAdapter. Upgradeable by the Aave DAO, which owns its proxy. | @{aave.borrowSpokes.uniV3BlueChip} |
| Uniswap v3 Correlated ETH | Aave V4 CDP Spoke where Uniswap v3 positions in pools of ETH staking tokens against WETH are collateral for borrowing GHO and USDC. Borrowers reach it only through the AaveAdapter. Upgradeable by the Aave DAO, which owns its proxy. | @{aave.borrowSpokes.uniV3CorrelatedEth} |
| Uniswap v3 Gov/DeFi | Aave V4 CDP Spoke where Uniswap v3 positions in pools of governance and DeFi tokens against WETH are collateral for borrowing GHO and USDC. Borrowers reach it only through the AaveAdapter. Upgradeable by the Aave DAO, which owns its proxy. | @{aave.borrowSpokes.uniV3GovDefi} |

### Uniswap v4 Spokes

| Name | Description | Address |
| --- | --- | --- |
| Uniswap v4 Stable | Aave V4 CDP Spoke where Uniswap v4 positions in hookless stablecoin pools are collateral for borrowing GHO and USDC. Borrowers reach it only through the AaveAdapter. Upgradeable by the Aave DAO, which owns its proxy. | @{aave.borrowSpokes.uniV4Stable} |
| Uniswap v4 Correlated BTC | Aave V4 CDP Spoke where Uniswap v4 positions in hookless pools of BTC tokens are collateral for borrowing GHO and USDC. Borrowers reach it only through the AaveAdapter. Upgradeable by the Aave DAO, which owns its proxy. | @{aave.borrowSpokes.uniV4CorrelatedBtc} |

### Lend Spoke

| Name | Description | Address |
| --- | --- | --- |
| Lend Spoke | Supply-only Aave V4 Spoke where lenders supply GHO, USDC and USDT for Avana borrowers to draw through the CDP Spokes. Upgradeable by the Aave DAO, which owns its proxy. | @{aave.lendSpokes.lendEthereum} |

> Each Spoke has its own AaveOracle, created with the Spoke; read its address from the Spoke's `ORACLE()`. Each vault-token reserve also names the Aave treasury Spoke as its fee receiver, with add and draw caps of 0, so it never holds vault tokens.

### Avana core

The contracts Avana deploys on this chain. For an upgradeable contract the address is its fixed proxy; the current implementation and logic contracts are recorded in the release manifest.

| Name | Description | Address |
| --- | --- | --- |
| AvanaTimelock | Owns and upgrades every Avana contract on this chain. Each change waits out a delay; only the governance Safe and the Aave governance executor can propose one. Immutable. | @{avana.timelock} |
| MarketRegistry | Records every Hub, CDP Spoke, AMM integration, market, debt reserve and swap route Avana lists on this chain, and holds each Hub's pause switch. Upgradeable through the AvanaTimelock. | @{avana.marketRegistry} |
| ParameterStore | Stores every Avana risk parameter on this chain with its hard bounds and the direction in which it may change. Upgradeable through the AvanaTimelock. | @{avana.parameterStore} |
| RiskModule | Runs every Avana risk check (caps, circuit breakers, price freshness, Aave configuration drift) on pledges, borrows and withdrawals; holds no funds. Upgradeable through the AvanaTimelock. | @{avana.riskModule} |
| AaveAdapter | The single entry point for borrowers: pledge, borrow, repay, withdraw, repay with collateral and fee collection go through it to the user's PositionProxy. Upgradeable through the AvanaTimelock. | @{avana.aaveAdapter} |
| LPVaultSwap | Runs every liquidation of an Avana account on this chain and is the only address that can receive seized vault tokens. Upgradeable through the AvanaTimelock. | @{avana.lpVaultSwap} |
| Lock | Shared reentrancy lock of the AaveAdapter and LPVaultSwap. Immutable. | @{avana.lock} |
| Collateralization | Backing ledger of every pledged position, so every vault token stays fully backed. Immutable. | @{avana.collateralization} |
| VaultTokenFactory | Registers each AMM integration's LPVault and deploys one vault token per CDP Spoke and market. Immutable. | @{avana.vaultTokenFactory} |
| ProxyManager | Creates each user's PositionProxy, one per wallet, CDP Spoke and market, at an address fixed by those three values. Immutable. | @{avana.proxyManager} |
| PayoutEscrow | Holds a liquidation payout that could not be sent to its recipient until the recipient claims it. Immutable. | @{avana.payoutEscrow} |
| Avana First-Loss Reserve, GHO | Avana's first-loss capital for GHO on this Hub: it covers deficits Aave records on Avana CDP Spokes before any other layer. Immutable; the Aave DAO controls it through its AccessManager. | @{avana.firstLossReserves.GHO} |
| DAO deficit offset, GHO | Second loss layer for GHO on this Hub, funded by the Aave DAO treasury; it pays only once the GHO First-Loss Reserve is empty or deactivated. Immutable; deployed and controlled by the Aave DAO. | @{avana.daoDeficitOffsets.GHO} |
| Avana First-Loss Reserve, USDC | Avana's first-loss capital for USDC on this Hub: it covers deficits Aave records on Avana CDP Spokes before any other layer. Immutable; the Aave DAO controls it through its AccessManager. | @{avana.firstLossReserves.USDC} |
| DAO deficit offset, USDC | Second loss layer for USDC on this Hub, funded by the Aave DAO treasury; it pays only once the USDC First-Loss Reserve is empty or deactivated. Immutable; deployed and controlled by the Aave DAO. | @{avana.daoDeficitOffsets.USDC} |
| Avana First-Loss Reserve, USDT | Avana's first-loss capital for USDT on this Hub: it covers deficits Aave records on Avana CDP Spokes before any other layer. Immutable; the Aave DAO controls it through its AccessManager. | @{avana.firstLossReserves.USDT} |
| DAO deficit offset, USDT | Second loss layer for USDT on this Hub, funded by the Aave DAO treasury; it pays only once the USDT First-Loss Reserve is empty or deactivated. Immutable; deployed and controlled by the Aave DAO. | @{avana.daoDeficitOffsets.USDT} |
| DebtOracle, USDC | Price source of the USDC debt reserve on every CDP Spoke's AaveOracle, with failover to an alternate and a standby route. GHO is priced at a fixed $1 and needs none. Upgradeable through the AvanaTimelock. | @{debtReserves.USDC.debtOracle} |
| AvanaCreate3Factory | Deploys Avana contracts at addresses that depend only on the deployer and a salt, so every address is known before deployment. Immutable. | @{create3Factory} |

> Each market also has its own vault token, LPOracle proxy and swap routes, with a primary and a backup route per pool token and debt asset. Those belong to the market and are recorded in the MarketRegistry and the release manifest.

### Periphery

| Name | Description | Address |
| --- | --- | --- |
| Lens | The read-only contract apps, keepers and monitoring call for account, market, price, risk and liquidation state in one call. No Avana contract depends on it. Immutable; replaced by a new deployment. | @{avana.lens} |
| Uniswap v3 integration (LPVault) | Holds every Uniswap v3 position pledged on this chain and unwinds it on exit or liquidation. Immutable, with no owner. | @{avana.lpVaults.uniswap-v3} |
| Uniswap v4 integration (LPVault) | Holds every pledged position of a hookless Uniswap v4 pool on this chain and unwinds it on exit or liquidation. Immutable, with no owner. | @{avana.lpVaults.uniswap-v4} |
| AaveV3FlashSource | Lends LPVaultSwap the debt asset from the Aave V3 Pool for one call so a borrower can repay with collateral. Immutable; the AvanaTimelock can replace it. | @{avana.flashSource} |
| FlashLiquidator | Public flash liquidation helper: anyone can liquidate an account without holding the debt asset. Immutable. | @{avana.flashLiquidator} |
| OperatorFlashLiquidator | Avana's keeper's own flash liquidation helper; only its signer can call it. Immutable. | @{avana.operatorHelpers.0} |
| AvanaGasVault | Holds the chain's native gas token and refills Avana's own keeper signers up to a per-signer cap over any 24 hours. Immutable. | @{avana.gasVault} |

#### Lens modules (called only through Lens)

The Lens forwards each view to one of these read-only contracts. Call the Lens, not these.

| Name | Description | Address |
| --- | --- | --- |
| LensAccountModule | Account views and close-account sizing. Immutable. | @{avana.lensModules.LensAccountModule} |
| LensMarketModule | Views of one market. Immutable. | @{avana.lensModules.LensMarketModule} |
| LensPriceModule | Price, debt-price and pause-state views and deleverage sizing. Immutable. | @{avana.lensModules.LensPriceModule} |
| LensLiquidationModule | Liquidation preview. Immutable. | @{avana.lensModules.LensLiquidationModule} |
| LensRiskModule | Risk and Hub-asset views. Immutable. | @{avana.lensModules.LensRiskModule} |
| LensPreviewModule | Action previews. Immutable. | @{avana.lensModules.LensPreviewModule} |
| LensMarketsModule | Market list and fee views. Immutable. | @{avana.lensModules.LensMarketsModule} |
| LensPositionsModule | Position views, available actions and maximum-withdraw sizing. Immutable. | @{avana.lensModules.LensPositionsModule} |
| LensSpeedModule | Speed-limit views: how much a borrow can take now under the RiskModule's speed windows. Immutable. | @{avana.lensModules.LensSpeedModule} |
| LensAaveSizing | Aave V4's liquidation sizing, compiled from the pinned Aave V4 release, used by the liquidation preview. Immutable. | @{avana.lensAaveSizing} |

### External dependencies

Contracts Avana relies on but does not deploy. On the Sepolia networks some are test stand-ins deployed from the pinned sources.

| Name | Description | Address |
| --- | --- | --- |
| Aave V4 AccessManager | Holds the Aave V4 roles of this chain and is the authority of every First-Loss Reserve and DAO deficit offset. | @{aave.accessManager} |
| Aave V4 HubConfigurator | Aave DAO payloads configure the Hub through it. | @{external.aave-v4.hubConfigurator} |
| Aave V4 SpokeConfigurator | Aave DAO payloads configure the Spokes through it; the Aave Protocol Guardian freezes or pauses reserves through it. | @{external.aave-v4.spokeConfigurator} |
| Aave governance executor | Owns every Hub and Spoke of this chain, and can propose and cancel AvanaTimelock operations. | @{roles.aaveGovernanceExecutor} |
| Aave Protocol Guardian | Can freeze and pause Avana reserves on Aave, and holds Avana's pause, freeze and cancel roles. | @{roles.aaveProtocolGuardian} |
| Aave V3 Pool | Lends the debt asset to the AaveV3FlashSource and the flash liquidation helpers. | @{aave.v3Pool} |
| Aave V3 ACLManager | Grants the flash borrower role that lets the AaveV3FlashSource and the FlashLiquidator borrow without a fee. | @{external.aave-v3.ACLManager} |
| Uniswap v3 Factory | Avana derives each Uniswap v3 market's pool from it and refuses any pool it did not create; it also creates the v3 reference pools of the Uniswap v4 markets. | @{external.uniswap-v3.UniswapV3Factory} |
| Uniswap v3 NonfungiblePositionManager | Issues the Uniswap v3 position NFTs users pledge; the Uniswap v3 LPVault accepts positions of this contract only. | @{external.uniswap-v3.NonfungiblePositionManager} |
| Uniswap v4 PoolManager | Holds every Uniswap v4 pool; the Uniswap v4 LPVault reads positions and removes liquidity through it. | @{uniswapV4.poolManager} |
| Uniswap v4 PositionManager | Issues the Uniswap v4 position NFTs users pledge. | @{external.uniswap-v4.PositionManager} |
| USDC / USD price feed | Primary USD price feed of USDC, read by the Avana oracles that price it. | @{external.feed.USDC / USD (primary)} |
| USDT / USD price feed | Primary USD price feed of USDT, read by the Avana oracles that price it. | @{external.feed.USDT / USD (primary)} |
| GHO / USD price feed | Primary GHO feed, used for monitoring only; Aave prices GHO at a fixed $1. | @{external.feed.GHO / USD (primary)} |
| DAI / USD price feed | Primary USD price feed of DAI, read by the Avana oracles that price it. | @{external.feed.DAI / USD (primary)} |
| WETH / USD price feed | Primary USD price feed of WETH, read by the Avana oracles that price it. | @{external.feed.WETH / USD (primary)} |
| wstETH / USD price feed | Primary USD price feed of wstETH, read by the Avana oracles that price it. | @{external.feed.wstETH / USD (primary)} |
| WBTC / USD price feed | Primary USD price feed of WBTC, read by the Avana oracles that price it. | @{external.feed.WBTC / USD (primary)} |
| cbBTC / USD price feed | Primary USD price feed of cbBTC, read by the Avana oracles that price it. | @{external.feed.cbBTC / USD (primary)} |
| AAVE / USD price feed | Primary USD price feed of AAVE, read by the Avana oracles that price it. | @{external.feed.AAVE / USD (primary)} |
| UNI / USD price feed | Primary USD price feed of UNI, read by the Avana oracles that price it. | @{external.feed.UNI / USD (primary)} |
| LINK / USD price feed | Primary USD price feed of LINK, read by the Avana oracles that price it. | @{external.feed.LINK / USD (primary)} |

> Each token also has an alternate route, a standby route and an independent second price source; their addresses are in the release manifest. The RiskModule also reads `paused()` on USDC and `basisPointsRate()` on USDT for its issuer-action circuit breaker.

### Assets

The ERC-20 tokens this chain's markets, Lend Spoke and debt reserves use. On the Sepolia networks these are test tokens.

| Name | Description | Address |
| --- | --- | --- |
| USDC | Pool token on the Uniswap v3 Stable, Uniswap v3 Blue-chip, Uniswap v4 Stable Spokes; supplied on the Lend Spoke; borrowable on every CDP Spoke. | @{external.token.USDC} |
| USDT | Pool token on the Uniswap v3 Stable, Uniswap v4 Stable Spokes; supplied on the Lend Spoke. | @{external.token.USDT} |
| GHO | Supplied on the Lend Spoke; borrowable on every CDP Spoke. | @{external.token.GHO} |
| DAI | Pool token on the Uniswap v3 Stable Spoke. | @{external.token.DAI} |
| WETH | Pool token on the Uniswap v3 Blue-chip, Uniswap v3 Correlated ETH, Uniswap v3 Gov/DeFi Spokes. | @{external.token.WETH} |
| wstETH | Pool token on the Uniswap v3 Correlated ETH Spoke. | @{external.token.wstETH} |
| WBTC | Pool token on the Uniswap v3 Blue-chip, Uniswap v4 Correlated BTC Spokes. | @{external.token.WBTC} |
| cbBTC | Pool token on the Uniswap v4 Correlated BTC Spoke. | @{external.token.cbBTC} |
| AAVE | Pool token on the Uniswap v3 Gov/DeFi Spoke. | @{external.token.AAVE} |
| UNI | Pool token on the Uniswap v3 Gov/DeFi Spoke. | @{external.token.UNI} |
| LINK | Pool token on the Uniswap v3 Gov/DeFi Spoke. | @{external.token.LINK} |

## Base Sepolia
- network: base-sepolia

One Hub with the Lend Spoke and 3 CDP Spokes listing 12 markets. Market pools and risk parameters are on [Market Parameters](/developers/reference/parameters?network=base-sepolia).

### Hub

| Name | Description | Address |
| --- | --- | --- |
| Avana Base Hub | Standard Aave V4 Hub, the only Avana Hub on this chain. It holds the lent assets and the vault-token collateral of every Spoke below, and each Spoke sets its own risk parameters. Upgradeable by the Aave DAO, which owns its proxy. | @{aave.hubs.base} |

### Aero Slipstream Spokes

| Name | Description | Address |
| --- | --- | --- |
| Aero Slipstream Blue-chip | Aave V4 CDP Spoke where Aero Slipstream positions in ETH and BTC pools are collateral for borrowing GHO and USDC. Borrowers reach it only through the AaveAdapter. Upgradeable by the Aave DAO, which owns its proxy. | @{aave.borrowSpokes.slipBlueChip} |
| Aero Slipstream Gov/DeFi | Aave V4 CDP Spoke where Aero Slipstream positions in governance and DeFi token pools are collateral for borrowing GHO and USDC. Borrowers reach it only through the AaveAdapter. Upgradeable by the Aave DAO, which owns its proxy. | @{aave.borrowSpokes.slipGovDefi} |
| Aero Slipstream Stocks | Aave V4 CDP Spoke where Aero Slipstream positions in tokenized-stock pools against USDC are collateral for borrowing GHO and USDC. Borrowers reach it only through the AaveAdapter. Upgradeable by the Aave DAO, which owns its proxy. | @{aave.borrowSpokes.slipStocks} |

### Lend Spoke

| Name | Description | Address |
| --- | --- | --- |
| Lend Spoke | Supply-only Aave V4 Spoke where lenders supply GHO, USDC and USDT for Avana borrowers to draw through the CDP Spokes. Upgradeable by the Aave DAO, which owns its proxy. | @{aave.lendSpokes.lendBase} |

> Each Spoke has its own AaveOracle, created with the Spoke; read its address from the Spoke's `ORACLE()`. Each vault-token reserve also names the Aave treasury Spoke as its fee receiver, with add and draw caps of 0, so it never holds vault tokens.

### Avana core

The contracts Avana deploys on this chain. For an upgradeable contract the address is its fixed proxy; the current implementation and logic contracts are recorded in the release manifest.

| Name | Description | Address |
| --- | --- | --- |
| AvanaTimelock | Owns and upgrades every Avana contract on this chain. Each change waits out a delay; only the governance Safe and the Aave governance executor can propose one. Immutable. | @{avana.timelock} |
| MarketRegistry | Records every Hub, CDP Spoke, AMM integration, market, debt reserve and swap route Avana lists on this chain, and holds each Hub's pause switch. Upgradeable through the AvanaTimelock. | @{avana.marketRegistry} |
| ParameterStore | Stores every Avana risk parameter on this chain with its hard bounds and the direction in which it may change. Upgradeable through the AvanaTimelock. | @{avana.parameterStore} |
| RiskModule | Runs every Avana risk check (caps, circuit breakers, price freshness, Aave configuration drift) on pledges, borrows and withdrawals; holds no funds. Upgradeable through the AvanaTimelock. | @{avana.riskModule} |
| AaveAdapter | The single entry point for borrowers: pledge, borrow, repay, withdraw, repay with collateral and fee collection go through it to the user's PositionProxy. Upgradeable through the AvanaTimelock. | @{avana.aaveAdapter} |
| LPVaultSwap | Runs every liquidation of an Avana account on this chain and is the only address that can receive seized vault tokens. Upgradeable through the AvanaTimelock. | @{avana.lpVaultSwap} |
| Lock | Shared reentrancy lock of the AaveAdapter and LPVaultSwap. Immutable. | @{avana.lock} |
| Collateralization | Backing ledger of every pledged position, so every vault token stays fully backed. Immutable. | @{avana.collateralization} |
| VaultTokenFactory | Registers each AMM integration's LPVault and deploys one vault token per CDP Spoke and market. Immutable. | @{avana.vaultTokenFactory} |
| ProxyManager | Creates each user's PositionProxy, one per wallet, CDP Spoke and market, at an address fixed by those three values. Immutable. | @{avana.proxyManager} |
| PayoutEscrow | Holds a liquidation payout that could not be sent to its recipient until the recipient claims it. Immutable. | @{avana.payoutEscrow} |
| Avana First-Loss Reserve, GHO | Avana's first-loss capital for GHO on this Hub: it covers deficits Aave records on Avana CDP Spokes before any other layer. Immutable; the Aave DAO controls it through its AccessManager. | @{avana.firstLossReserves.GHO} |
| DAO deficit offset, GHO | Second loss layer for GHO on this Hub, funded by the Aave DAO treasury; it pays only once the GHO First-Loss Reserve is empty or deactivated. Immutable; deployed and controlled by the Aave DAO. | @{avana.daoDeficitOffsets.GHO} |
| Avana First-Loss Reserve, USDC | Avana's first-loss capital for USDC on this Hub: it covers deficits Aave records on Avana CDP Spokes before any other layer. Immutable; the Aave DAO controls it through its AccessManager. | @{avana.firstLossReserves.USDC} |
| DAO deficit offset, USDC | Second loss layer for USDC on this Hub, funded by the Aave DAO treasury; it pays only once the USDC First-Loss Reserve is empty or deactivated. Immutable; deployed and controlled by the Aave DAO. | @{avana.daoDeficitOffsets.USDC} |
| Avana First-Loss Reserve, USDT | Avana's first-loss capital for USDT on this Hub: it covers deficits Aave records on Avana CDP Spokes before any other layer. Immutable; the Aave DAO controls it through its AccessManager. | @{avana.firstLossReserves.USDT} |
| DAO deficit offset, USDT | Second loss layer for USDT on this Hub, funded by the Aave DAO treasury; it pays only once the USDT First-Loss Reserve is empty or deactivated. Immutable; deployed and controlled by the Aave DAO. | @{avana.daoDeficitOffsets.USDT} |
| DebtOracle, USDC | Price source of the USDC debt reserve on every CDP Spoke's AaveOracle, with failover to an alternate and a standby route. GHO is priced at a fixed $1 and needs none. Upgradeable through the AvanaTimelock. | @{debtReserves.USDC.debtOracle} |
| AvanaCreate3Factory | Deploys Avana contracts at addresses that depend only on the deployer and a salt, so every address is known before deployment. Immutable. | @{create3Factory} |

> Each market also has its own vault token, LPOracle proxy and swap routes, with a primary and a backup route per pool token and debt asset. Those belong to the market and are recorded in the MarketRegistry and the release manifest.

### Periphery

| Name | Description | Address |
| --- | --- | --- |
| Lens | The read-only contract apps, keepers and monitoring call for account, market, price, risk and liquidation state in one call. No Avana contract depends on it. Immutable; replaced by a new deployment. | @{avana.lens} |
| Aero Slipstream integration (LPVault) | Holds every unstaked Aero Slipstream position pledged on this chain, across the four factory generations, and unwinds it on exit or liquidation. Immutable, with no owner. | @{avana.lpVaults.slipstream} |
| AaveV3FlashSource | Lends LPVaultSwap the debt asset from the Aave V3 Pool for one call so a borrower can repay with collateral. Immutable; the AvanaTimelock can replace it. | @{avana.flashSource} |
| FlashLiquidator | Public flash liquidation helper: anyone can liquidate an account without holding the debt asset. Immutable. | @{avana.flashLiquidator} |
| OperatorFlashLiquidator | Avana's keeper's own flash liquidation helper; only its signer can call it. Immutable. | @{avana.operatorHelpers.0} |
| AvanaGasVault | Holds the chain's native gas token and refills Avana's own keeper signers up to a per-signer cap over any 24 hours. Immutable. | @{avana.gasVault} |

#### Lens modules (called only through Lens)

The Lens forwards each view to one of these read-only contracts. Call the Lens, not these.

| Name | Description | Address |
| --- | --- | --- |
| LensAccountModule | Account views and close-account sizing. Immutable. | @{avana.lensModules.LensAccountModule} |
| LensMarketModule | Views of one market. Immutable. | @{avana.lensModules.LensMarketModule} |
| LensPriceModule | Price, debt-price and pause-state views and deleverage sizing. Immutable. | @{avana.lensModules.LensPriceModule} |
| LensLiquidationModule | Liquidation preview. Immutable. | @{avana.lensModules.LensLiquidationModule} |
| LensRiskModule | Risk and Hub-asset views. Immutable. | @{avana.lensModules.LensRiskModule} |
| LensPreviewModule | Action previews. Immutable. | @{avana.lensModules.LensPreviewModule} |
| LensMarketsModule | Market list and fee views. Immutable. | @{avana.lensModules.LensMarketsModule} |
| LensPositionsModule | Position views, available actions and maximum-withdraw sizing. Immutable. | @{avana.lensModules.LensPositionsModule} |
| LensSpeedModule | Speed-limit views: how much a borrow can take now under the RiskModule's speed windows. Immutable. | @{avana.lensModules.LensSpeedModule} |
| LensAaveSizing | Aave V4's liquidation sizing, compiled from the pinned Aave V4 release, used by the liquidation preview. Immutable. | @{avana.lensAaveSizing} |

### External dependencies

Contracts Avana relies on but does not deploy. On the Sepolia networks some are test stand-ins deployed from the pinned sources.

| Name | Description | Address |
| --- | --- | --- |
| Aave V4 AccessManager | Holds the Aave V4 roles of this chain and is the authority of every First-Loss Reserve and DAO deficit offset. | @{aave.accessManager} |
| Aave V4 HubConfigurator | Aave DAO payloads configure the Hub through it. | @{external.aave-v4.hubConfigurator} |
| Aave V4 SpokeConfigurator | Aave DAO payloads configure the Spokes through it; the Aave Protocol Guardian freezes or pauses reserves through it. | @{external.aave-v4.spokeConfigurator} |
| Aave governance executor | Owns every Hub and Spoke of this chain, and can propose and cancel AvanaTimelock operations. | @{roles.aaveGovernanceExecutor} |
| Aave Protocol Guardian | Can freeze and pause Avana reserves on Aave, and holds Avana's pause, freeze and cancel roles. | @{roles.aaveProtocolGuardian} |
| Aave V3 Pool | Lends the debt asset to the AaveV3FlashSource and the flash liquidation helpers. | @{aave.v3Pool} |
| Aave V3 ACLManager | Grants the flash borrower role that lets the AaveV3FlashSource and the FlashLiquidator borrow without a fee. | @{external.aave-v3.ACLManager} |
| Uniswap v3 Factory | Creates the Uniswap v3 pools the liquidation swap routes of this chain use. | @{external.uniswap-v3.UniswapV3Factory} |
| Aero Slipstream CLFactory (Initial) | Pool factory of the Initial generation; Avana derives a market's pool from the factory of that market's generation. | @{external.slipstream.CLFactory generation 0} |
| Aero Slipstream position manager (Initial) | Issues the Slipstream position NFTs of the Initial generation that users pledge. | @{external.slipstream.NonfungiblePositionManager generation 0} |
| Aero Slipstream CLFactory (Gauge Caps) | Pool factory of the Gauge Caps generation; Avana derives a market's pool from the factory of that market's generation. | @{external.slipstream.CLFactory generation 1} |
| Aero Slipstream position manager (Gauge Caps) | Issues the Slipstream position NFTs of the Gauge Caps generation that users pledge. | @{external.slipstream.NonfungiblePositionManager generation 1} |
| Aero Slipstream CLFactory (Gauges V3) | Pool factory of the Gauges V3 generation; Avana derives a market's pool from the factory of that market's generation. | @{external.slipstream.CLFactory generation 2} |
| Aero Slipstream position manager (Gauges V3) | Issues the Slipstream position NFTs of the Gauges V3 generation that users pledge. | @{external.slipstream.NonfungiblePositionManager generation 2} |
| Aero Slipstream CLFactory (Aero) | Pool factory of the Aero generation; Avana derives a market's pool from the factory of that market's generation. | @{external.slipstream.CLFactory generation 3} |
| Aero Slipstream position manager (Aero) | Issues the Slipstream position NFTs of the Aero generation that users pledge. | @{external.slipstream.NonfungiblePositionManager generation 3} |
| Chainlink L2 sequencer uptime feed | While it reports the sequencer down, borrow-side prices fail closed and liquidation pauses. | @{sequencerFeed} |
| USDC / USD price feed | Primary USD price feed of USDC, read by the Avana oracles that price it. | @{external.feed.USDC / USD (primary)} |
| USDT / USD price feed | Primary USD price feed of USDT, read by the Avana oracles that price it. | @{external.feed.USDT / USD (primary)} |
| GHO / USD price feed | Primary GHO feed, used for monitoring only; Aave prices GHO at a fixed $1. | @{external.feed.GHO / USD (primary)} |
| WETH / USD price feed | Primary USD price feed of WETH, read by the Avana oracles that price it. | @{external.feed.WETH / USD (primary)} |
| cbBTC / USD price feed | Primary USD price feed of cbBTC, read by the Avana oracles that price it. | @{external.feed.cbBTC / USD (primary)} |
| AERO / USD price feed | Primary USD price feed of AERO, read by the Avana oracles that price it. | @{external.feed.AERO / USD (primary)} |
| LINK / USD price feed | Primary USD price feed of LINK, read by the Avana oracles that price it. | @{external.feed.LINK / USD (primary)} |
| AMZNc / USD price feed | Primary USD price feed of AMZNc, read by the Avana oracles that price it. | @{external.feed.AMZNc / USD (primary)} |
| SNDKc / USD price feed | Primary USD price feed of SNDKc, read by the Avana oracles that price it. | @{external.feed.SNDKc / USD (primary)} |
| GOOGLc / USD price feed | Primary USD price feed of GOOGLc, read by the Avana oracles that price it. | @{external.feed.GOOGLc / USD (primary)} |
| NVDAc / USD price feed | Primary USD price feed of NVDAc, read by the Avana oracles that price it. | @{external.feed.NVDAc / USD (primary)} |
| SPCXc / USD price feed | Primary USD price feed of SPCXc, read by the Avana oracles that price it. | @{external.feed.SPCXc / USD (primary)} |
| METAc / USD price feed | Primary USD price feed of METAc, read by the Avana oracles that price it. | @{external.feed.METAc / USD (primary)} |

> Each token also has an alternate route, a standby route and an independent second price source; their addresses are in the release manifest. The RiskModule also reads `paused()` on USDC and `basisPointsRate()` on USDT for its issuer-action circuit breaker.

### Assets

The ERC-20 tokens this chain's markets, Lend Spoke and debt reserves use. On the Sepolia networks these are test tokens.

| Name | Description | Address |
| --- | --- | --- |
| USDC | Pool token on the Aero Slipstream Blue-chip, Aero Slipstream Gov/DeFi, Aero Slipstream Stocks Spokes; supplied on the Lend Spoke; borrowable on every CDP Spoke. | @{external.token.USDC} |
| USDT | Supplied on the Lend Spoke. | @{external.token.USDT} |
| GHO | Supplied on the Lend Spoke; borrowable on every CDP Spoke. | @{external.token.GHO} |
| WETH | Pool token on the Aero Slipstream Blue-chip, Aero Slipstream Gov/DeFi Spokes. | @{external.token.WETH} |
| cbBTC | Pool token on the Aero Slipstream Blue-chip Spoke. | @{external.token.cbBTC} |
| AERO | Pool token on the Aero Slipstream Gov/DeFi Spoke. | @{external.token.AERO} |
| LINK | Pool token on the Aero Slipstream Gov/DeFi Spoke. | @{external.token.LINK} |
| AMZNc | Tokenized stock; pool token on the Aero Slipstream Stocks Spoke. | @{external.token.AMZNc} |
| SNDKc | Tokenized stock; pool token on the Aero Slipstream Stocks Spoke. | @{external.token.SNDKc} |
| GOOGLc | Tokenized stock; pool token on the Aero Slipstream Stocks Spoke. | @{external.token.GOOGLc} |
| NVDAc | Tokenized stock; pool token on the Aero Slipstream Stocks Spoke. | @{external.token.NVDAc} |
| SPCXc | Tokenized stock; pool token on the Aero Slipstream Stocks Spoke. | @{external.token.SPCXc} |
| METAc | Tokenized stock; pool token on the Aero Slipstream Stocks Spoke. | @{external.token.METAc} |

