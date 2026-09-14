import type { BlogTag } from "@/lib/content"

export type BlogSection = {
  id: string
  eyebrow?: string
  title?: string
  paragraphs: string[]
}

export type BlogPostDefinition = {
  slug: string
  title: string
  date: string
  description: string
  image: string
  category: string
  tag: BlogTag
  sections: BlogSection[]
}

export const blogPosts: readonly BlogPostDefinition[] = [
  {
    slug: "lp-risk-governance",
    title: "How Avana Governs LP Risk",
    date: "September 24, 2026",
    description:
      "How Avana governs LP collateral risk across spoke markets with bounded updates, independent review, and emergency containment.",
    image: "/images/blog/lp-risk-governance.png",
    category: "Developers",
    tag: "Protocol",
    sections: [
      {
        id: "why-lp-risk-is-different",
        title: "Why LP risk is different",
        paragraphs: [
          "Avana cannot govern LP collateral the way a generic lending market governs a list of tokens. Each spoke market has its own pool structure, failure modes, and stress behavior. A stable pool is not the same product as a concentrated range. A weighted Balancer style basket is not the same product as a tightly correlated Curve style market. Avana's risk framework is built around that variety. It watches volatility, peg quality, utilization, liquidity depth, concentration, oracle health, market status, supply and borrow caps, LTV and liquidation thresholds, interest rate models, and position health across the hub and the LP spokes together.",
        ],
      },
      {
        id: "three-roles",
        title: "Three roles, clear jobs",
        paragraphs: [
          "Avana separates routine recommendation, independent review, and emergency containment into three roles: the Risk Initiator, the Risk Guardian, and the Risk Defender. The Initiator proposes routine updates inside approved templates, including caps, collateral settings, rates, and pool onboarding. Each proposal is labeled defensive or growth oriented before it enters the normal path. The Guardian is the review and veto layer. It checks that the public disclosure matches what is queued, confirms the action stays inside policy bounds, and can cancel during the timelock. The Defender is narrow by design. It can reduce caps, freeze borrowing, or disable a compromised adapter when waiting for the routine path would leave Avana exposed.",
        ],
      },
      {
        id: "how-changes-ship",
        title: "How routine changes ship",
        paragraphs: [
          "The standard update path on Avana is public notice, submission, validation against predefined bounds, timelock, Guardian review, and execution if nobody vetoes. Developers, users, and governance participants can read the rationale before a change lands and compare the written policy to the queued action. For a protocol built on complex collateral, that public consistency is a basic requirement rather than a marketing extra.",
          "Not every change uses that path. Cutting risk is meant to be easier than adding risk. Modest tuning inside approved ranges follows the standard flow. Larger moves, such as new spoke families, new LP primitives, new oracle models, or new liquidation adapters, sit outside routine process because they expand Avana's risk surface and need heavier review.",
        ],
      },
      {
        id: "emergency-power",
        title: "When Avana uses emergency power",
        paragraphs: [
          "Emergency cases include oracle inconsistency, liquidation path degradation, abnormal pool behavior, wrapper failure, adapter compromise, or sudden spoke level instability. Even then the framework stays careful. Emergency authority on Avana is narrow, defensive, and reversible. It exists for moments when assumptions are failing faster than timelock governance can respond. It is not a shadow path for everyday optimization.",
          "Taken together, Avana matches governance structure to collateral complexity. LP backed lending needs market templates, bounded execution, transparent disclosure, and a hard line between normal growth, defensive adjustment, and emergency containment. Each spoke keeps its own oracle assumptions, liquidation logic, admission rules, and operational constraints. Avana does not pretend every LP market is interchangeable.",
        ],
      },
    ],
  },
  {
    slug: "why-lp-collateral-needs-smart-agents",
    title: "Why LP Collateral Needs Smart Agents",
    date: "September 21, 2026",
    description:
      "Why Avana uses Smart Agents to monitor health, service venue specific positions, and keep liquidation coverage reliable under stress.",
    image: "/images/blog/smart-agents-lp-collateral.png",
    category: "Developers",
    tag: "Protocol",
    sections: [
      {
        id: "lp-loans-are-operational",
        title: "LP loans are operational work",
        paragraphs: [
          "On Avana, LP collateral is active, path dependent, and operationally demanding. It earns fees, shifts composition, changes risk as markets move, and can require venue specific actions exactly when a position becomes stressed. A standard token market can often reduce liquidation and monitoring to a simpler trigger and swap path. LP collateral is different. The system has to know which positions are active, how debt is drifting, what the collateral would look like under a real unwind, how fees can be realized, which venue specific removal path applies, and whether liquidation is still viable after slippage, routing, and execution cost. Those details are what separate theoretical coverage on paper from coverage that still works when markets get hard.",
        ],
      },
      {
        id: "what-agents-do",
        title: "What Avana Smart Agents do",
        paragraphs: [
          "Avana's node runtime reads onchain activity, keeps a live map of active positions, refreshes drifting debt on short intervals, and runs broader sweeps to catch stale or missed state. The app UI, dashboards, monitoring logic, and liquidation workflows are meant to draw from that same operational picture, rather than each layer inventing its own version of the market.",
          "Liquidation is where this matters most. When an Avana position falls below allowed borrowing capacity, the execution layer has to evaluate whether the job can be serviced profitably, source temporary liquidity, repay debt into the credit layer, claim fees, unwind the collateral through the correct venue path, route the resulting assets, settle the flash path, distribute the liquidation premium, and preserve borrower residual value when anything remains. That is a chain of work, not a single transaction type.",
        ],
      },
      {
        id: "before-and-across-venues",
        title: "Before liquidation, and across venues",
        paragraphs: [
          "Smart Agents also matter before liquidation happens. Indexing Avana positions, watching debt drift, and keeping the protocol aligned with its own oracle and risk assumptions improve readiness. Operational delay is not free when collateral keeps moving with the market.",
          "LP collateral is an adapter problem as much as a valuation problem. Fungible LPs, concentrated ranges, and custom pool designs need different venue aware handling. Smart Agents are Avana's layer for respecting those differences instead of forcing one generic pathway onto every market. The oracle tells Avana what a position might be worth as credit. The agent layer helps determine whether that value can actually be recovered in practice.",
          "Avana does not replace permissionless liquidation. External builders can still monitor and act. Protocol operated runtimes improve baseline coverage for collateral that is structurally harder to service. In stress that matters a lot. The worst moment to discover that a market lacks reliable execution coverage is during the liquidation event itself.",
        ],
      },
    ],
  },
  {
    slug: "how-lp-liquidation-should-work",
    title: "How LP Liquidation Should Work",
    date: "September 18, 2026",
    description:
      "How Avana liquidates LP collateral with controlled unwinds, partial intervention, fees first where possible, and venue specific paths.",
    image: "/images/blog/lp-liquidation-workflow.png",
    category: "Developers",
    tag: "Protocol",
    sections: [
      {
        id: "not-a-token-sale",
        title: "Not a simple token sale",
        paragraphs: [
          "Liquidating LP collateral on Avana is not the same as liquidating a token balance. The collateral may contain multiple assets, uncollected fees, concentrated range exposure, and venue specific exit mechanics. If a position becomes unhealthy, Avana needs a controlled unwind, not a panic sale that treats the LP like a single fungible chip.",
        ],
      },
      {
        id: "runtime-sequence",
        title: "The runtime sequence",
        paragraphs: [
          "In practice, liquidation is a runtime sequence. Unhealthy accounts are detected using Avana's risk adjusted collateral values rather than raw AMM spot state. Execution liquidity is sourced, often through a flashloan style path. Debt is repaid into the credit layer. The position moves into controlled custody. Claimable fees are realized where that helps. The LP is unwound through the correct venue path. After the underlyings are recovered, they are routed into the debt asset, execution liquidity is repaid, the liquidation premium is distributed, and any residual borrower value is returned.",
          "Different LP families on Avana do not share one exit path. Fungible LPs are removed from the pool and broken into underlyings. Concentrated ranges have to be handled according to their actual inventory at unwind time, which can look very different from what users assume if price has pushed the position to one side. Custom or hook based pools may need dedicated adapters before Avana treats them as safe enough for liquidation coverage at all. If Avana cannot unwind a collateral type correctly, it should not pretend the market is fully supported.",
        ],
      },
      {
        id: "partial-and-fees",
        title: "Partial cuts and fees first",
        paragraphs: [
          "Avana aims to restore target health rather than defaulting to full liquidation. Partial liquidation is preferred because it reduces unnecessary borrower loss and limits disruption to the underlying pool. The framework computes the debt needed to put the loan back on safer ground and targets that amount first. Full liquidation remains the fallback when solvency cannot be recovered with a smaller cut.",
          "Fees matter too. LP positions often contain claimable value that has not been realized yet. If fees can reduce how much principal must be unwound, Avana should use them before cutting deeper into the position. That improves borrower outcomes and makes liquidation more precise. LP positions are live financial objects, not passive token balances, and Avana's process is written to match that.",
        ],
      },
      {
        id: "who-runs-it",
        title: "Who runs liquidation",
        paragraphs: [
          "Specialized liquidation runtimes make a difference here. Nodes built for Avana LP liquidation watch active positions, refresh debt drift, index market state, simulate unwind paths, source execution liquidity, route assets, and close transactions atomically. Liquidation remains permissionless, but LP collateral is harder for purely generic liquidators to service because the workflow is longer and more venue specific. Liquidators also have to price in slippage, route depth, flashloan cost, and MEV exposure. Large or unusual unwinds may need quieter execution paths so a recoverable job does not turn into a destructive one.",
        ],
      },
    ],
  },
  {
    slug: "pricing-lp-collateral-oracle-problem",
    title: "Pricing LP Collateral with Better Oracles",
    date: "September 16, 2026",
    description:
      "How Avana Oracle prices LP collateral using recoverable value, deterministic reconstruction, and conservative recovery haircuts.",
    image: "/images/blog/lp-collateral-oracle-problem.png",
    category: "Developers",
    tag: "Protocol",
    sections: [
      {
        id: "what-avana-oracle-asks",
        title: "What Avana Oracle is asking",
        paragraphs: [
          "An LP's value depends on the prices of the underlyings, the structure of the pool, the current inventory split, accrued fees, and for concentrated liquidity the relationship between current price and the active range. For a lending system, the important question is not only what a dashboard mark might say. It is what can realistically be recovered if the position has to cover a loan. If Avana lends against best case assumptions, it is financing collateral inflation. Avana Oracle is built around recoverable value, not optimistic net asset value.",
        ],
      },
      {
        id: "three-step-pipeline",
        title: "How valuation is built",
        paragraphs: [
          "The oracle is a multi layer collateral valuation engine. First, Avana prices the underlying assets from robust external references rather than leaning on raw AMM spot state. Second, it reconstructs the LP position deterministically: pool balance reconstruction for fungible LPs, or direct decomposition of concentrated positions by range, liquidity, and current price. Third, it discounts that reconstructed value with recovery haircuts that reflect liquidation slippage, unwind friction, and impermanent loss risk. Impermanent loss is the difference in value between holding assets in a pool and holding them separately. It grows when the paired assets diverge in price. Borrowing power on Avana comes from the discounted value, not from the most flattering mark.",
        ],
      },
      {
        id: "why-simple-marks-fail",
        title: "Why simple marks fail",
        paragraphs: [
          "LP collateral is one of the easiest places for a lending system to fool itself. AMM pool state can look healthy while being locally distorted. A concentrated position can look strong while sitting in a riskier inventory mix than users assume. Thin depth, same transaction manipulation, and stale inputs can all produce numbers that look precise without being trustworthy. Avana separates apparent value from reliable collateral value by combining external asset pricing, deterministic LP reconstruction, and protocol level safeguards.",
          "The oracle interface can also distinguish reconstructed principal value, fee value, and reserved value used for protocol risk buffers. Those components do not deserve identical treatment inside a lending market. By standardizing them across LP types, the spoke layer can reason about fungible LPs, NFT based LPs, and multi asset positions consistently while still respecting how different venues expose state.",
        ],
      },
      {
        id: "checks-and-safeguards",
        title: "Checks and safeguards",
        paragraphs: [
          "Different AMM families need different verification paths. Curve stable LPs, Uniswap pairs and NFTs, Balancer weighted pools, and Aerodrome pairs all expose collateral state differently. On Avana, external prices remain the main anchor. Pool specific data and time weighted checks help verify whether the reconstructed collateral state is coherent and harder to game. Those time weighted checks are not the primary price Avana relies on for loans. They are an extra consistency check so Avana can tell whether the collateral state still lines up before that state is treated as credit.",
          "Manipulation resistance on Avana includes deviation thresholds, pool price difference constraints, recovery haircuts, open interest caps, and an oracle sentinel that reacts when feed health degrades or verification inputs stop agreeing. LP collateral is unusually exposed to same transaction abuse, thin market distortions, and stale or contradictory signals because the collateral is more structurally complex than a simple token balance. A protocol that supports LP credit has to assume the pricing surface will eventually be tested. Avana Oracle is written for that assumption.",
        ],
      },
    ],
  },
  {
    slug: "security-deep-dive",
    title: "How Avana Manages LP Collateral Risk",
    date: "September 13, 2026",
    description:
      "How Avana structures layered security for LP collateral, from architecture and oracles through health, liquidation, and operations.",
    image: "/images/blog/security-deep-dive.png",
    category: "Developers",
    tag: "Protocol",
    sections: [
      {
        id: "more-than-a-price",
        title: "More than a price and an LTV",
        paragraphs: [
          "A simple token can usually be priced with a direct market reference and liquidated with standard logic. An LP position cannot. Its value depends on underlyings, pool structure, the relationship between those assets, fee accrual, liquidity depth, and for concentrated liquidity the active range. Under stress those variables compound. A protocol that supports LP backed borrowing on Aave v4 has to do more than assign a price and set a loan to value ratio. That is the problem Avana is built around.",
        ],
      },
      {
        id: "architecture-and-oracles",
        title: "Architecture and valuation",
        paragraphs: [
          "The first security layer is architectural. Avana uses Aave v4's hub and spoke structure. The hub holds the common liquidity layer, manages reserve accounting, and enforces solvency constraints. The spoke is where LP specific collateral logic lives: admission, valuation rules, pool specific risk parameters, and liquidation behavior. If an LP market becomes stressed, that stress is meant to stay contained in the spoke rather than rewriting assumptions across unrelated collateral types. On Avana, the spoke is part of the security boundary.",
          "The second layer is oracle and valuation design. LP positions cannot be safely priced with a single flat feed. Avana uses a dual source framework. External price feeds provide the primary reference for underlyings, while AMM derived pricing acts as independent verification. Borrowing power exists only when both sources stay coherent within tolerance. Risk is assigned at the market level. Pool structure, asset correlation, liquidity depth, and range concentration all shape collateral treatment. Borrowing power is anchored to the weaker aspects of the position, with pool level adjustments for volatility, liquidity quality, and stress assumptions.",
        ],
      },
      {
        id: "health-and-liquidation",
        title: "Health and liquidation",
        paragraphs: [
          "The third layer is health monitoring. LP positions remain active after they are posted as collateral, so risk does not freeze once a loan opens. Value changes with price moves, fee generation, range migration, and shifts in pool quality. Avana runs continuous per position health assessment rather than relying on occasional snapshots. Health factor is the live signal of whether the collateral model still holds for that loan.",
          "Liquidation is where the assumptions get tested. LP collateral cannot be liquidated like a normal token. Avana's approach is to collect fees embedded in the position before destroying principal where possible, remove only enough liquidity to repair the loan, and route the unwind through execution paths that favor deterministic settlement. Smart Agents provide the execution infrastructure: monitoring positions, reconciling data, simulating execution, and unwinding under adverse conditions. They are part of Avana's safety system, not an afterthought bolted on later.",
        ],
      },
      {
        id: "operations",
        title: "Operations and change control",
        paragraphs: [
          "The operational layer assumes governance and risk configuration need the same discipline as collateral treatment. Risk parameters change through structured process. Sensitive changes sit behind timelocks and review. Emergency controls exist for genuinely adverse conditions. Monitoring extends beyond individual positions to whole market categories. A protocol that supports LP collateral cannot rely on static configuration alone.",
          "LP collateral is viable on Avana only if security is treated as a system. Architecture isolates risk. Oracles validate reality. Valuation turns complexity into conservative borrowing power. Health checks monitor drift. Liquidation restores solvency with as much precision as the venue allows. Operational controls govern how the framework evolves. None of those layers is enough by itself.",
        ],
      },
    ],
  },
  {
    slug: "hedge-lp-position",
    title: "How to Hedge an LP Position More Thoughtfully",
    date: "September 10, 2026",
    description:
      "How LPs can use Avana to fund buffers, directional offsets, and more disciplined hedge habits without fully exiting the pool.",
    image: "/images/blog/hedge-lp-position.png",
    category: "For LPs",
    tag: "Guides",
    sections: [
      {
        id: "more-than-fees",
        title: "More than fees",
        paragraphs: [
          "An LP position is never only about fees. Price divergence, impermanent loss, range drift, and collateral pressure can all hit the same book at once. Impermanent loss is what happens when the pool's asset mix shifts and the LP ends up worth less than holding the tokens separately. Once a supported position can back borrowing through Avana on Aave v4, borrowed capital can fund protection rather than only leverage. A position that would otherwise need to be fully withdrawn can stay active while the borrowed capital is used to reduce stress or balance exposure.",
        ],
      },
      {
        id: "buffers-and-offsets",
        title: "Buffers and directional offsets",
        paragraphs: [
          "The simplest hedge is often the most practical: a stablecoin buffer. Borrow conservatively on Avana and keep part of the proceeds in stables. If health starts to compress or volatility picks up, that liquidity can repay debt or reduce stress without forcing a reactive sale of the LP. This is not primarily about return enhancement. It is about buying time and preserving control, which on its own can matter a lot.",
          "A second form is directional offset. If the LP already carries clear exposure to one volatile asset, borrowed capital can reduce net directional risk instead of increasing it. Methods vary with user sophistication, but the principle is straightforward. If the LP already embeds market exposure, borrowing can balance that exposure. Hedging works best as risk narrowing, not as a second speculative trade sitting next to the first one.",
        ],
      },
      {
        id: "more-advanced-options",
        title: "Neutrality and softer hedges",
        paragraphs: [
          "A more advanced approach is to think in terms of neutrality: reducing directional sensitivity and leaning on fee income. That kind of structure can be more stable, but it requires active monitoring and rebalancing. LP positions evolve as markets move, so a neutral setup has to be maintained, not declared once. For larger positions, protective downside structures can define worst case scenarios instead of only reacting to them, though they introduce their own costs and timing decisions.",
          "A softer hedge that is often overlooked is reallocating marginal exposure rather than touching the core LP. In practice that means shifting incremental capital toward more defensive pools or stable deployments when conditions deteriorate, without fully unwinding the original position. Avana helps by keeping the core LP available as collateral so every liquidity need does not become an all or nothing exit.",
        ],
      },
      {
        id: "practical-rules",
        title: "Practical rules that travel well",
        paragraphs: [
          "Across approaches, a few habits travel well on Avana. Borrow conservatively. Keep a real buffer. Assume conditions can worsen faster than expected. Treat maximum borrowing capacity as a boundary rather than a target. Use monitoring with predefined de risking rules instead of relying on constant manual reaction. If a hedge strategy becomes so complicated that you no longer understand what is being hedged and what is being added, it has gone too far.",
        ],
      },
    ],
  },
  {
    slug: "yield-looping-playbook",
    title: "Yield Looping with LP Collateral",
    date: "September 8, 2026",
    description:
      "How to think about yield looping with Avana LP collateral, including buffers, stress testing, exit discipline, and sustainable leverage.",
    image: "/images/blog/yield-looping-playbook.png",
    category: "For LPs",
    tag: "Guides",
    sections: [
      {
        id: "what-looping-means",
        title: "What looping means on Avana",
        paragraphs: [
          "Yield looping means holding an LP position, borrowing against it, and redeploying the borrowed capital into another yield producing strategy, or in some cases back into liquidity itself. Avana on Aave v4 makes that collateral step possible for supported LP markets. The attraction is obvious: looping can increase effective exposure and amplify fee generation. The danger is equally obvious: it can compress safety margins, raise liquidation sensitivity, and make a position much more fragile when conditions shift. The real objective should be sustainable amplification, not maximum leverage on day one.",
        ],
      },
      {
        id: "keeping-the-first-loop-modest",
        title: "Keeping the first loop modest",
        paragraphs: [
          "The safest form of looping is modest. Borrow a relatively small amount against a supported Avana LP position and redeploy into a second yield source without pushing near the borrowing limit. That is a controlled extension of the original position, not a recursive bet that conditions stay perfect. For many users, especially early on, that is the right starting point. You still get better capital use, but you leave room if the LP mark, fee income, or borrow rate moves against you.",
          "More advanced versions redeploy borrowed capital back into liquidity. That can increase fee generation in favorable environments, but it also makes the structure more reflexive. You become exposed to a layered book where price movement, collateral quality, and debt safety interact more aggressively. Leverage does not only amplify returns. It also amplifies the speed at which a healthy Avana position can become a stressed one.",
        ],
      },
      {
        id: "stress-and-exit",
        title: "Stress testing and exit discipline",
        paragraphs: [
          "Stress testing is essential. Any serious looping approach should be evaluated under adverse conditions. What happens if one side of the pair moves sharply, if trading volume weakens, if borrow costs rise, or if collateral quality deteriorates faster than expected. A structure that looks attractive when fees are high and volatility is calm can look uncomfortable once those conditions reverse. If the only favorable scenario is a calm fee month, the thinking is not finished.",
          "Exit discipline matters as much as entry. Many poor leverage decisions are not created by the first borrow. They are created by having no plan for reducing risk. If volatility rises, health buffers compress, or the economics weaken, exposure should be reduced in stages rather than defended blindly. Avana Automate can help with fee harvesting, debt reduction, and rule based de risking, but automation only helps if the underlying rules are honest. A looped strategy is only as strong as the assumptions behind it.",
        ],
      },
      {
        id: "balance-sheet-not-magic",
        title: "Balance sheet design, not free yield",
        paragraphs: [
          "Yield looping is a capital structure decision, not a shortcut to free yield. Used carefully on Avana, it lets productive onchain liquidity support a broader set of returns without forcing the original position to be fully unwound. Used carelessly, it turns a healthy LP position into a fragile one. The difference is usually discipline, buffer management, and a willingness to treat leverage as something to control rather than something to maximize.",
        ],
      },
    ],
  },
  {
    slug: "unleashing-lp-tokens",
    title: "What LP Collateral Makes Possible",
    date: "September 5, 2026",
    description:
      "What Avana LP collateral makes possible across borrowing, hedging, treasury flexibility, and more capital efficient use of productive liquidity.",
    image: "/images/blog/unleashing-lp-tokens.png",
    category: "For LPs",
    tag: "Guides",
    sections: [
      {
        id: "from-trapped-to-usable",
        title: "From trapped capital to usable capital",
        paragraphs: [
          "LP positions have traditionally been productive but inflexible. They earn trading fees and support market depth, but if you want liquidity from that position, the usual path is to unwind it: break the position apart, interrupt fee generation, and turn a productive asset into idle balances. LP collateral changes that. Through Avana on Aave v4, supported LP positions can stay active in the underlying AMM while also supporting borrowing.",
        ],
      },
      {
        id: "simple-and-yield-use",
        title: "Conservative liquidity and second yield paths",
        paragraphs: [
          "The most conservative use case is straightforward. You borrow stable assets against a supported Avana LP position and use that liquidity for working capital, reserve management, or lower volatility yield while the LP stays active and keeps earning fees. The main value here is not leverage for its own sake. It is access to cash without forcing a full exit from the original position.",
          "Borrowed stables can also go into conservative onchain yield, such as stable oriented lending, reserve management, or other lower volatility opportunities. The LP keeps generating fees while borrowed capital follows a separate path. That is not yield stacking out of thin air. It is a more efficient use of capital that would otherwise require unwinding the position first.",
        ],
      },
      {
        id: "hedge-and-active",
        title: "Hedging and more active strategies",
        paragraphs: [
          "Hedging is another category. LP positions expose users to changing asset composition and impermanent loss, especially in pools where one side is more volatile. Credit against LP collateral on Avana can create room to manage that exposure: reduce directional concentration, improve liquidity planning, or build a more balanced portfolio around an existing position.",
          "More active strategies redeploy borrowed capital back into liquidity, increasing market exposure and fee generation. That can work, but you are now managing a recursive structure whose risk changes quickly with market conditions. Once borrowed assets are recycled into additional LP exposure, discipline becomes more important than ambition. Avana opens the option set. Health, borrow limits, and liquidation rules still decide what is sane for a given pool.",
        ],
      },
      {
        id: "what-changes",
        title: "What changes for LPs",
        paragraphs: [
          "LP collateral turns liquidity provision from a relatively isolated yield activity into something more connected to broader DeFi capital use. A position that used to be productive only inside its pool can support borrowing, liquidity planning, and portfolio design without first being dismantled. The right use still depends on your risk tolerance and your understanding of how LP value, borrowing capacity, and liquidation thresholds interact on Avana.",
        ],
      },
    ],
  },
  {
    slug: "aerodrome-lp-collateral-aave-v4",
    title: "Borrowing Against Aerodrome LPs on Aave v4",
    date: "September 3, 2026",
    description:
      "How Avana supports Aerodrome LP positions on Base so they can stay active while supporting borrowing through a dedicated Aave v4 spoke.",
    image: "/images/blog/aerodrome-lp-collateral.png",
    category: "Developers",
    tag: "Protocol",
    sections: [
      {
        id: "aerodrome-on-avana",
        title: "Aerodrome liquidity on Avana",
        paragraphs: [
          "Aerodrome LP positions sit at the center of onchain activity on Base, where liquidity supports trading fees, token distribution, and ecosystem depth. As collateral, those positions need evaluation by pool structure, asset quality, liquidity depth, and stress behavior, not by headline TVL or fee generation alone. Avana is built to support this kind of collateral on Aave v4 with market specific rules rather than a venue wide blanket.",
        ],
      },
      {
        id: "hub-spoke-and-pool-quality",
        title: "Hub, spoke, and pool quality",
        paragraphs: [
          "Aave v4's hub and spoke architecture is what makes the product shape work. The hub manages shared liquidity. The Avana spoke handles Aerodrome specific collateral logic. A stable pool on Base should not be treated the same as a volatile ecosystem pair just because both are Aerodrome LPs. The spoke defines how different categories of Aerodrome liquidity are valued, how much borrowing power they support, and how liquidation works if a position becomes unsafe.",
          "Aerodrome pools vary widely. Some involve established assets with stronger liquidity. Others center on faster moving ecosystem tokens with higher volatility and thinner depth. Positions that look similar on the surface can behave very differently as collateral. Avana's spoke model assigns treatment by pool structure and quality, not by venue name alone.",
        ],
      },
      {
        id: "valuation-and-borrow",
        title: "Valuation and the borrow flow",
        paragraphs: [
          "An Aerodrome LP is not a single price token. It is a claim on underlying pool assets whose composition and quality matter directly. Avana judges collateral value conservatively, factoring in liquidity quality, volatility, asset correlation, and how the pool behaves if the market turns. A position may have substantial notional value, but borrowing power reflects what can be recovered under stress.",
          "The borrowing flow is concrete. You supply a supported Aerodrome LP through the Avana spoke, where it stays active and earns fees. The spoke evaluates the position using pool specific collateral logic. Based on that, you can borrow supported assets from hub liquidity. Stable and blue chip style pools may support stronger collateral treatment. Volatile or thinner pairs get tighter limits and lower factors.",
        ],
      },
      {
        id: "if-health-breaks",
        title: "If health breaks",
        paragraphs: [
          "If a position becomes unsafe, Avana unwinds the active liquidity position, accounts for the underlyings, and restores solvency with as little disruption as the market allows. The pool's structure determines how liquidation works. That is another reason Aerodrome collateral belongs in a dedicated spoke rather than as a loose extension of a broader lending market.",
        ],
      },
    ],
  },
  {
    slug: "curve-lp-collateral-aave-v4",
    title: "Borrowing Against Curve LPs on Aave v4",
    date: "August 31, 2026",
    description:
      "How Avana treats Curve LP collateral for stable and correlated pools through a dedicated Aave v4 spoke.",
    image: "/images/blog/curve-lp-collateral.png",
    category: "Developers",
    tag: "Protocol",
    sections: [
      {
        id: "why-curve-matters",
        title: "Why Curve matters on Avana",
        paragraphs: [
          "Curve LP positions often sit at the center of stablecoin markets and correlated asset trading, some of the deepest and lowest slippage pools onchain. That makes them attractive as collateral, but their structural behavior still needs specialized handling inside a lending system. Avana supports Curve LP collateral on Aave v4 through a dedicated spoke with its own collateral treatment, borrowing constraints, and liquidation rules shaped around Curve's market structure.",
        ],
      },
      {
        id: "stable-is-not-riskless",
        title: "Stable looking is not riskless",
        paragraphs: [
          "Curve pools are built around assets that trade with tighter relationships than standard volatile pairs. Stablecoin pools, liquid staking pools, and correlated asset pools can produce deeper and more stable liquidity profiles. Stable relationships can still break, correlations can weaken, and pools that appear conservative can behave badly under stress. Avana's collateral framework has to account for both the relative strength of Curve's pool design and the possibility that stress shows up exactly where users expect stability.",
          "A Curve LP position is a claim on a pool of underlyings, not a simple token with a flat price. Avana determines what assets sit beneath the position, what they are worth, and how much of that value should count toward borrowing power. That last step is critical. Collateral value under a conservative lending framework gives real weight to pool composition, asset correlation, liquidity quality, and how the position would behave in a stressed state.",
        ],
      },
      {
        id: "users-and-flow",
        title: "Who uses it and how borrowing works",
        paragraphs: [
          "Many Curve positions are already used by sophisticated DeFi participants as core liquidity exposure. Stablecoin pools, liquid staking pairs, and correlated asset markets represent large amounts of economically important capital. If these positions can support borrowing without requiring withdrawal, that expands the usefulness of some of the most foundational liquidity in DeFi while leaving it in the pool.",
          "The borrowing flow on Avana is supply a supported Curve LP through the spoke, where it stays active and earns fees. The spoke evaluates the position, and you can borrow supported assets from hub liquidity. Stablecoin pools may support one form of collateral treatment, correlated asset pools another, and pools with weaker liquidity or more fragile relationships get tighter constraints.",
        ],
      },
      {
        id: "liquidation",
        title: "Liquidation follows the pool",
        paragraphs: [
          "If a Curve LP becomes unsafe, Avana unwinds only what is necessary to restore solvency where possible, respects the underlying pool structure, and minimizes disruption while repaying debt. Different pool types require different assumptions. That is the point of the spoke model, and it is how Avana can scale Curve family by family without one generic LP rule for every AMM.",
        ],
      },
    ],
  },
  {
    slug: "balancer-lp-collateral-aave-v4",
    title: "Balancer LP Collateral on Aave v4",
    date: "August 28, 2026",
    description:
      "How Avana supports Balancer weighted pool LPs as collateral on Aave v4 while the exposure stays active.",
    image: "/images/blog/balancer-lp-collateral.png",
    category: "Developers",
    tag: "Protocol",
    sections: [
      {
        id: "portfolio-style-lps",
        title: "Portfolio style LP collateral",
        paragraphs: [
          "A Balancer LP position is often a structured portfolio inside an AMM, with custom weights, diversified exposure, and liquidity that behaves differently from standard two asset pools. That makes Balancer LPs interesting as collateral, and also harder to support in a lending system built for simpler assets. Avana handles this through a dedicated spoke on Aave v4.",
        ],
      },
      {
        id: "weighted-variety",
        title: "Why weighted pools need market rules",
        paragraphs: [
          "Balancer pools are inherently varied. A stable style pool does not behave like an 80/20 weighted pool. A correlated asset basket does not behave like a broader index style composition. Even pools with similar total value can have materially different risk as collateral, depending on liquidity depth, asset concentration, volatility, and the relationship between underlyings. The Avana spoke defines how each weighted pool is valued, how borrowing capacity is constrained, and how liquidation works.",
          "From a collateral perspective, a Balancer LP represents a portfolio rather than a simple asset pair. Its value depends on the underlyings, their relative weights, market pricing, and pool structure. Avana has to understand what sits underneath, how that composition behaves under stress, and what portion of the value translates into safe borrowing power.",
        ],
      },
      {
        id: "borrow-and-unwind",
        title: "Borrowing and unwind",
        paragraphs: [
          "Many Balancer pools express deliberate portfolio views: governance token pairs, weighted index allocations, stable and correlated baskets. If these positions become borrowable collateral on Avana, users do not have to choose between maintaining structured market exposure and accessing liquidity. The same pool position stays active, earns fees, and supports borrowing through Aave v4.",
          "The flow is supply a supported Balancer LP through the Avana spoke, where the position remains active and earns fees. The spoke evaluates it using market specific collateral logic. Safer pool types support stronger treatment. Concentrated or volatile structures get more conservative assumptions. Market structure drives lending treatment, not venue branding alone.",
          "If a position becomes unsafe, Avana cannot assume that unwinding a Balancer LP looks like unwinding a simpler two asset position. It has to account for actual pool structure, underlyings, and the execution path needed to restore solvency with minimal disruption. The collateral determines what safe liquidation looks like.",
        ],
      },
    ],
  },
  {
    slug: "smart-contract-architecture",
    title: "Borrowing Against Uniswap LPs on Aave v4",
    date: "August 25, 2026",
    description:
      "How Avana turns Uniswap LP positions into Aave v4 collateral while they stay in the pool and keep earning fees.",
    image: "/images/blog/uniswap-lp-collateral.png",
    category: "Developers",
    tag: "Protocol",
    sections: [
      {
        id: "uniswap-on-avana",
        title: "Uniswap liquidity on Avana",
        paragraphs: [
          "Uniswap LP positions provide market depth, facilitate trading, and earn fees, but they have traditionally been hard to use inside lending systems without first being withdrawn or restructured. Avana is designed to change that on Aave v4. The hub manages shared liquidity. The Avana spoke is a dedicated market for LP backed borrowing, including Uniswap concentrated liquidity. The spoke defines how collateral is evaluated, how borrowing power is assigned, and how risk is handled at position level.",
        ],
      },
      {
        id: "why-cl-is-hard",
        title: "Why concentrated ranges are hard collateral",
        paragraphs: [
          "Uniswap concentrated liquidity positions are not simple fungible tokens. Value depends on the current price of the underlyings, the amount of liquidity provided, the selected price range, and fees accrued over time. A position can be active and earning, or it can move out of range and behave very differently. Avana has to understand position composition in real time and evaluate what it is worth as collateral under changing conditions, not only as a notional paper value.",
          "Valuation sits at the center. Avana determines what underlyings the position currently represents, applies reliable pricing, and translates that into borrowing capacity through a conservative collateral framework. The important question is not pure paper value. It is collateral value inside a live lending system. Concentrated positions can become nonlinear as price moves through or beyond the active range, which requires deliberate risk treatment.",
        ],
      },
      {
        id: "borrow-monitor-liquidate",
        title: "Borrow, monitor, liquidate",
        paragraphs: [
          "The borrowing flow is supply a supported Uniswap LP through the Avana spoke. The position stays in the AMM and keeps earning fees. The spoke evaluates collateral and applies risk logic. You borrow supported assets from hub liquidity. Collateralizing the position does not turn it off. Liquidity stays deployed, market exposure stays intact, and fees keep accruing.",
          "Because LP positions are live and changing, Avana monitors health continuously. As prices move, fees accumulate, and the position structure shifts, borrowing safety shifts with them. A healthy position today may be less healthy tomorrow even if the user has not touched anything.",
          "If a position becomes too risky, liquidation must unwind part of an active AMM position, account for underlyings, and restore solvency with as little disruption as practical. The collateral's market structure determines the liquidation structure. That is one of the main reasons Uniswap LP collateral belongs in a dedicated Avana spoke rather than a generalized collateral bucket.",
        ],
      },
    ],
  },
  {
    slug: "defi-ux-challenges",
    title: "Making LP Collateral Usable",
    date: "August 23, 2026",
    description:
      "Why Avana product design cares about clear valuation, borrowing limits, and health so LP collateral is operable, not just powerful.",
    image: "/images/blog/making-lp-collateral-usable.png",
    category: "Product",
    tag: "Guides",
    sections: [
      {
        id: "power-is-not-enough",
        title: "Power is not enough",
        paragraphs: [
          "LP collateral is powerful in concept and hard to deliver cleanly. On Avana you are not only managing a loan. You are managing a live liquidity position whose value, composition, and risk all change over time. That makes the product more demanding than a standard lending flow, and it is one of the main reasons LP collateral has been operationally difficult even when the idea sounded appealing.",
        ],
      },
      {
        id: "make-the-lifecycle-legible",
        title: "Make the lifecycle legible",
        paragraphs: [
          "The challenge is making the full lifecycle understandable: collateral valuation, borrowing limits, health monitoring, and what happens as conditions change. If those pieces stay opaque, the product stays limited to highly technical users no matter how strong the underlying mechanism is.",
          "In LP collateral markets, good UX is part of risk design. Users need to understand what a position is worth as collateral, not just its market value. They need to see how borrowing affects flexibility, how range drift or price divergence changes risk, and how close a position is to stress. A platform that hides those realities behind vague dashboards may look simpler on the surface and still create more danger for the user.",
        ],
      },
      {
        id: "one-system",
        title: "One connected system",
        paragraphs: [
          "LP backed borrowing on Avana should present as one connected system. Depositing liquidity, using it as collateral, monitoring health, collecting fees, and managing risk are all part of the same financial object. The relationship between LP position and debt should be visible from the beginning, so you can understand both sides at once rather than stitching the picture together across separate interfaces.",
          "LP positions are not static. They evolve with trading activity, underlying asset movement, and in concentrated liquidity systems with the position range itself. Borrowing against that kind of asset requires a more expressive interface and a more disciplined product structure. Fee generation, collateral quality, and liquidation risk interact in ways that are easy to misunderstand if the product is designed carelessly.",
          "The goal is making advanced financial primitives usable without making them misleading. Avana's LP backed borrowing needs to be clear enough to use, disciplined enough to trust, and coherent enough to become a real part of how onchain capital is managed.",
        ],
      },
    ],
  },
  {
    slug: "avana-lp-collateral",
    title: "Avana and the Next Step for LPs",
    date: "August 20, 2026",
    description:
      "Why liquidity providers should not have to choose between earning fees and accessing capital, and how Avana extends LP collateral on Aave v4.",
    image: "/images/blog/avana-next-step-liquidity-providers.png",
    category: "Community",
    tag: "Strategy",
    sections: [
      {
        id: "the-old-tradeoff",
        title: "The old tradeoff",
        paragraphs: [
          "Liquidity providers supply depth, absorb volatility, and earn trading fees, but the capital inside those positions has often felt trapped. If you wanted access to that capital, the usual answer was still to withdraw, break the position apart, and stop doing the thing that made the position useful in the first place.",
        ],
      },
      {
        id: "what-avana-changes",
        title: "What Avana changes",
        paragraphs: [
          "Avana allows supported LP positions to function as collateral on Aave v4 while keeping the liquidity active in the underlying AMM. Instead of forcing a choice between fee generation and liquidity access, the same position can do both. It stays in the market, keeps earning fees, and supports borrowing capacity inside a lending system designed for LP collateral.",
          "LP positions are more complex than standard collateral. They change with underlying prices, pool composition, fee accrual, and in concentrated liquidity systems with active range placement. Most lending systems were not built to understand that value properly. Treating LPs like ordinary token balances misses how they actually behave. Avana exists because that gap is structural, not cosmetic.",
        ],
      },
      {
        id: "how-the-stack-fits",
        title: "How the stack fits together",
        paragraphs: [
          "Avana uses Aave v4's hub and spoke design. Shared liquidity stays at the hub level. LP specific valuation, collateral treatment, and liquidation logic live inside dedicated spoke markets. Stable pools, correlated asset pools, and concentrated liquidity positions each get appropriate risk treatment rather than being flattened into one generic framework.",
          "For LPs, the result is more capital efficient participation. A supported position stays productive in the AMM while becoming useful inside a credit system. You keep exposure, keep earning, and access liquidity without fully unwinding. For the broader system, LP collateral means DeFi capital can be less fragmented. Liquidity does not have to leave the market every time it needs to become useful elsewhere.",
          "If LP positions can remain active while supporting borrowing, they become more than fee generating pool shares. They function as structured financial positions with fee generation, market exposure, and collateral value. Avana is that bridge between trading infrastructure and credit infrastructure.",
        ],
      },
    ],
  },
  {
    slug: "institutional-use-cases",
    title: "LP Collateral for Institutions",
    date: "August 17, 2026",
    description:
      "How Avana LP collateral can help DAOs, treasuries, funds, and crypto native companies access capital without unwinding productive liquidity.",
    image: "/images/blog/lp-collateral-for-institutions.png",
    category: "For Institutions",
    tag: "Institutions",
    sections: [
      {
        id: "treasury-function",
        title: "Capital efficiency as a treasury function",
        paragraphs: [
          "For institutions operating onchain, capital efficiency is a treasury function. DAOs, protocol treasuries, funds, and crypto native companies often hold large positions across tokens, stable reserves, and liquidity pools, yet much of that capital remains operationally rigid. LP positions may generate fees and support strategic market exposure, but they are still hard to use as flexible treasury assets without withdrawing liquidity and changing market posture.",
        ],
      },
      {
        id: "what-avana-enables",
        title: "What Avana enables for teams",
        paragraphs: [
          "Through Avana, LP positions can stay active in the AMM while supporting borrowing on Aave v4. A DAO treasury can fund grants or contributor payments without reducing core market exposure. A fund can maintain LP positions while accessing stable liquidity for tactical repositioning. A corporate treasury can manage payroll or vendor obligations without forcing a full rebalance of onchain reserves. The common thread is that borrowing creates working capital without realizing positions, without interrupting fee generation, and without forcing every liquidity need to become a sell decision.",
          "For DAOs and protocol treasuries specifically, LP positions held as liquidity support or treasury strategy are often treated as immobile unless governance decides to unwind them. LP collateral offers a more capital efficient path. Treasury positions can stay active while supporting controlled access to liquidity for runway, ecosystem spending, or operational planning.",
        ],
      },
      {
        id: "funds-and-corps",
        title: "Funds and corporate treasuries",
        paragraphs: [
          "Funds and professional managers care about tactical flexibility. In fast moving markets, unwinding a position before accessing capital can be slow, costly, and strategically awkward. Avana LP collateral lets a manager preserve exposure and market presence while freeing liquidity for new deployment, hedging, or repositioning.",
          "Corporate treasuries in crypto native businesses hold onchain reserves but still need predictable access to capital for operations. Payroll, vendor payments, and working capital needs do not always align with ideal market conditions. Borrowing against LP positions allows a treasury to manage obligations without untimely asset sales or over reliance on offchain financing.",
        ],
      },
      {
        id: "controls",
        title: "Controls come first",
        paragraphs: [
          "Institutional adoption depends on controls: clear policy boundaries around what can be borrowed, against which collateral, under what approval path, and with what de risking rules. Avana spoke markets mean risk can be defined around collateral structure. Stables, correlated pairs, concentrated liquidity, and volatile pools can be governed under different assumptions. Operational controls include role separation, permissions, health monitoring, auditability, and multi signature approval thresholds. Those are central to whether LP collateral becomes a credible treasury primitive rather than just a leverage tool.",
          "LP positions already play a major role in how protocols, funds, and crypto native firms allocate capital. The next step is making those positions financially useful beyond fee generation, with the governance surface institutions require. That is the job Avana is built for.",
        ],
      },
    ],
  },
  {
    slug: "integration-guide",
    title: "Building on Avana LP Infrastructure",
    date: "August 14, 2026",
    description:
      "A developer view of Avana LP collateral infrastructure, including monitoring, automation, liquidation services, and builder opportunities.",
    image: "/images/blog/developer-view-lp-collateral.png",
    category: "Developers",
    tag: "Protocol",
    sections: [
      {
        id: "a-new-design-surface",
        title: "A new design surface",
        paragraphs: [
          "Most DeFi infrastructure is built around simple collateral. Single assets are easy to price, monitor, and liquidate. LP positions are active, two sided, and structurally more complex. Their value changes with underlyings, pool composition, fee accrual, and range. That complexity is why LP collateral has been hard to integrate into lending systems, and it is why Avana creates a new design surface for developers.",
        ],
      },
      {
        id: "what-builders-get",
        title: "What builders get from Avana",
        paragraphs: [
          "Avana makes LP positions usable as collateral through Aave v4. Hub and spoke architecture means LP positions are evaluated, risk adjusted, and liquidated according to market specific logic, not a generic lending market that happens to accept LPs. For builders, that opens applications around interfaces, monitoring systems, treasury tools, strategy layers, and risk aware products built on LP backed credit.",
          "Portfolio and monitoring infrastructure is a natural category. LP backed borrowing creates a more dynamic relationship between collateral and debt than most DeFi users are used to. Dashboards can surface health factor, collateral efficiency, fee generation, and liquidation sensitivity, helping users decide when to rebalance, reduce debt, or treat a position as more stressed than its headline value suggests.",
        ],
      },
      {
        id: "automation-liquidation-treasury",
        title: "Automation, liquidation, and treasury tooling",
        paragraphs: [
          "Automation and strategy infrastructure is another line of work. Because LP positions stay active while supporting borrowing, developers can build systems that respond to changing conditions on both sides of the position: maintaining target borrowing bands, monitoring collateral drift, or routing position data into treasury and portfolio systems that sit on top of Avana.",
          "Liquidation and risk infrastructure also matter. LP collateral requires more than simple threshold watching. It requires understanding how position quality changes as markets move and how liquidation paths differ by venue and pool type. External bots, monitoring services, and analytics systems can all become important pieces of the ecosystem around Avana.",
          "For treasury and institutional tooling, if DAOs, funds, or crypto native companies use LP positions as collateral, they will need systems for policy limits, permissions, borrowing conditions, and risk thresholds across wallets or teams. Developers can use Avana as a source of collateral state, debt state, and market level structure rather than treating LP exposure and lending exposure as disconnected worlds.",
        ],
      },
    ],
  },
  {
    slug: "aave-v4-avana-spoke",
    title: "Inside Avana's LP Collateral Architecture",
    date: "August 11, 2026",
    description:
      "Inside Avana's LP collateral architecture on Aave v4, including the hub, spokes, valuation, oracle design, and liquidation logic.",
    image: "/images/blog/inside-avana-architecture.png",
    category: "Developers",
    tag: "Protocol",
    sections: [
      {
        id: "why-hub-and-spoke",
        title: "Why hub and spoke",
        paragraphs: [
          "LP collateral cannot be supported with a generic lending design. It needs a system that handles active liquidity positions, changing collateral composition, market specific valuation, and liquidation paths that differ from standard token collateral. Avana is built on Aave v4's hub and spoke model because LP backed borrowing needs shared liquidity and isolated market logic at the same time.",
        ],
      },
      {
        id: "hub-and-spoke-roles",
        title: "What the hub and spokes do",
        paragraphs: [
          "The hub holds borrowable assets and coordinates shared liquidity across markets: reserve management, utilization tracking, and credit allocation. A hub is how Avana connects LP collateral to a broader lending framework without forcing every collateral type to share the same assumptions. A stable LP market, a concentrated liquidity market, and a volatile AMM pair should not all be governed the same way just because they draw from the same liquidity pool.",
          "Spokes are where LP specific logic lives: collateral registration, valuation, risk adjustment, monitoring, and liquidation. Each spoke defines how different pool types are treated. A Uniswap concentrated position behaves differently from a fungible Curve LP, which behaves differently from a Balancer weighted pool. The spoke is where LP collateral becomes a real lending market with its own rules inside Avana.",
        ],
      },
      {
        id: "valuation-oracle-liquidation",
        title: "Valuation, oracles, and liquidation",
        paragraphs: [
          "Valuation uses a layered approach. First, what does the LP position actually contain at the current market state. Second, price those underlyings from reliable oracle inputs. Third, adjust through collateral logic that reflects actual pool risk rather than notional size. Not every dollar inside an LP position translates into the same borrowing power on Avana.",
          "Oracle design sits close to the core. For LP collateral, the protocol cannot rely on a single number or a simplistic asset feed. Avana uses a dual source philosophy where external price feeds and AMM derived pricing work together for more reliable valuation. The goal is reducing the chance that temporary dislocations, stale updates, or local pool distortions create unsafe collateral assumptions.",
          "For liquidation, Avana must unwind active LP positions in a controlled way, convert the resulting assets, and settle debt without avoidable loss. The spoke specializes liquidation for the underlying market structure. The hub provides liquidity. The spoke defines collateral logic. Each layer does what it is suited for: clean separation, strong isolation, and a realistic path to scaling LP collateral pool by pool.",
        ],
      },
    ],
  },
  {
    slug: "v1-1-release",
    title: "Avana v1.1: Better Collateral, Better Control",
    date: "August 8, 2026",
    description:
      "Avana v1.1 expands multi position collateral, adds more supported pools, improves delegation and alerts, and lowers transaction overhead.",
    image: "/images/blog/avana-v1-1-better-control.png",
    category: "Product",
    tag: "Product",
    sections: [
      {
        id: "what-shipped",
        title: "What shipped in v1.1",
        paragraphs: [
          "Avana v1.1 makes LP backed borrowing more flexible, more efficient, and easier to manage. This update expands how users structure collateral, improves position evaluation, reduces transaction overhead, and refines the dashboard for managing live LP positions on Aave v4.",
        ],
      },
      {
        id: "multi-position-and-markets",
        title: "Multi position collateral and more markets",
        paragraphs: [
          "The main change is multi position collateral. Users can deposit multiple LP positions and have borrowing capacity evaluated across the full collateral set rather than position by position. That gives more flexibility for managing liquidity across different pools, assets, or strategy types. The release also expands supported pools across Uniswap v3 and v4. Each new market still includes additional valuation, collateral treatment, and liquidation work, so broader access does not weaken Avana's risk standards.",
          "Partial position withdrawal is also new. Users can reduce part of an LP position's liquidity without fully exiting the collateral position, provided the remaining collateral still supports the loan safely. That makes capital management less binary. You can adjust exposure, release liquidity, or reshape positions without treating every change as all or nothing.",
        ],
      },
      {
        id: "ops-and-dashboard",
        title: "Ops tools and a clearer dashboard",
        paragraphs: [
          "Delegation support helps DAOs, teams, and structured operators separate responsibilities across wallets or roles: who manages deposits, who handles debt actions, who does operational maintenance. Health factor alerts give earlier visibility into changing position conditions before stress develops. LP collateral can shift quickly, especially when price divergence affects both earning efficiency and collateral quality at the same time.",
          "Performance improvements lower transaction costs across deposits, borrows, repays, and management. Oracle handling improved for latency, fallback behavior, and reliability during changing market conditions. For LP collateral, backend execution quality is as important as frontend features.",
          "The dashboard is refined to show LP backed borrowing as it actually works on Avana: collateral health, position composition, and the relationship between active liquidity and debt. Better transaction previews and a more responsive design make position management more legible before you commit a change onchain.",
        ],
      },
    ],
  },
  {
    slug: "introducing-automate",
    title: "Automate: A Control Layer for LP Collateral",
    date: "August 6, 2026",
    description:
      "How Avana Automate helps users manage LP collateral with non custodial automation for fees, rebalancing, protection, and disciplined maintenance.",
    image: "/images/blog/automate-control-layer-lp-collateral.png",
    category: "Product",
    tag: "Product",
    sections: [
      {
        id: "why-automation",
        title: "Why LP collateral needs automation",
        paragraphs: [
          "Managing an LP position that also serves as collateral is demanding. Fees accumulate but do not always stay productive. Liquidity ranges drift as markets move. Health factors weaken as price divergence changes the collateral profile. Both sides of the balance sheet stay live. The LP position evolves, and the debt against it evolves with borrowing conditions. For users borrowing against LPs through Avana on Aave v4, that is the day to day reality.",
        ],
      },
      {
        id: "what-automate-is",
        title: "What Avana Automate is",
        paragraphs: [
          "Automate is Avana's non custodial automation layer. It executes user approved actions when predefined conditions are met. Users keep full control of assets and permissions. Automate handles repetitive maintenance and enforces position discipline. It is not a replacement for strategy or judgment. It is a way to reduce the operational burden of managing LP collateral on Avana.",
        ],
      },
      {
        id: "fees-ranges-protection",
        title: "Fees, ranges, and protection",
        paragraphs: [
          "Trading fees accumulate gradually, but idle fees do not contribute to position efficiency. Automate can collect and redeploy them according to user preferences, so positions stay more productive without constant manual intervention. Over time, disciplined fee maintenance can matter as much as headline yield, especially for larger LP backed borrowing strategies.",
          "In concentrated liquidity systems, capital stops working efficiently when price moves outside the active range, and the position may also become less efficient as collateral on Avana. Automate can rebalance according to user defined rules, reducing the burden of reacting to every move by hand. That is especially useful because collateral efficiency and liquidity productivity are closely linked.",
          "Positions can also move from healthy to stressed faster than expected, particularly during sharp volatility or when paired assets diverge. Automate monitors conditions and executes defensive actions based on user defined thresholds. Passive neglect of LP collateral that supports debt gets expensive. Avana Automate is built for that earlier response.",
        ],
      },
      {
        id: "day-two-ops",
        title: "Day two operations",
        paragraphs: [
          "Automate is built around the actual nature of LP collateral: positions that earn, drift, and change risk while serving as collateral on Aave v4. It gives users a way to maintain positions consistently, respond to changing conditions with less friction, and manage LP backed borrowing with discipline that would otherwise require constant manual attention. Same non custodial principle throughout. Avana runs your policy. It does not become a black box fund manager.",
        ],
      },
    ],
  },
  {
    slug: "lp-collateral-guide",
    title: "A Beginner's Guide to LP Collateral",
    date: "August 4, 2026",
    description:
      "A beginner's guide to LP collateral on Avana, covering LP behavior, LTV, impermanent loss, liquidation, and conservative first steps.",
    image: "/images/blog/beginners-guide-lp-collateral.png",
    category: "For LPs",
    tag: "Guides",
    sections: [
      {
        id: "the-basic-idea",
        title: "The basic idea",
        paragraphs: [
          "Providing liquidity is one of the most common ways to earn yield in DeFi. You deposit assets into a pool, facilitate trading, and earn fees in return. LP positions have also been inflexible. If you wanted to use that capital elsewhere, you usually withdrew first. LP collateral changes that. Through Avana on Aave v4, supported LP positions can back borrowing while staying active in the pool and earning fees the whole time.",
        ],
      },
      {
        id: "what-an-lp-is",
        title: "What an LP actually is",
        paragraphs: [
          "An LP position is a live position inside a market. Its value depends on the underlyings, how they move relative to each other, accrued fees, and in concentrated liquidity systems whether the position is still in its active price range. It changes over time in ways ordinary token collateral does not. That is why LP collateral needs a more specialized lending model, and why Avana exists for that use case.",
        ],
      },
      {
        id: "ltv-il-liquidation",
        title: "LTV, impermanent loss, and liquidation",
        paragraphs: [
          "Loan to value, often shortened to LTV, is the portion of a position's accepted collateral value that can be borrowed against. A lower LTV means more buffer. If collateral value drops, there is room before the loan becomes stressed. A higher LTV gives more immediate liquidity and less safety margin. In LP markets this matters more because position value can move for several reasons at once: underlying prices, pool composition, fee accrual, and range placement.",
          "Impermanent loss, often shortened to IL, is what happens when the two assets in a pool move relative to each other and the LP position ends up worth less than holding those assets outside the pool. For someone using the LP as collateral on Avana, IL directly affects borrowing capacity. It does not make LP collateral unsafe by definition, but it means users need to understand that positions are dynamic rather than fixed.",
          "If collateral value falls too far relative to debt, Avana restores safety through liquidation. With LP collateral this is more complex than selling a simple token. There is fee accrual, changing asset composition, and venue specific liquidity structure. Avana values and liquidates LP positions according to those realities rather than treating them as generic assets. The practical lesson for beginners is simple. Borrow conservatively, especially at the start.",
        ],
      },
      {
        id: "first-steps",
        title: "A sensible first path",
        paragraphs: [
          "Even as collateral, an LP position keeps earning fees and maintaining market exposure. That is the capital efficiency gain. For beginners, the safest approach is to start conservative on Avana: borrow modestly, use simpler and more stable pool types first, and pay attention to how position health changes as markets move. Once you understand how LP value, debt, and liquidation thresholds interact, the model becomes much more straightforward to use responsibly.",
        ],
      },
    ],
  },
]

export const blogPostsBySlug = new Map(blogPosts.map((post) => [post.slug, post] as const))
