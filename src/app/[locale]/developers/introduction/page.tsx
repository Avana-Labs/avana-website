import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'introduction', {
    title: "Protocol Overview",
    description: "What Avana does, who takes part, how an LP position becomes Aave V4 collateral, where liquidity comes from, and what is in scope on Ethereum and Base at launch.",
  })
}

const sections = [
  { id: "what-avana-does", title: "What Avana Does" },
  { id: "participants", title: "Participants" },
  { id: "collateral-path", title: "Collateral Path" },
  { id: "loan-lifecycle", title: "Loan Lifecycle" },
  { id: "chains-hubs-amms", title: "Chains, Hubs and AMMs" },
  { id: "liquidity", title: "Where Liquidity Comes From" },
  { id: "scope", title: "Scope" },
  { id: "trust", title: "Trust and Governance" },
]

export default async function IntroductionPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "introduction", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Protocol Overview"
          description="Avana lets a liquidity provider borrow GHO, and later other approved assets, on Aave V4 against an AMM position without taking the liquidity out of the pool."
        />

        <section id="what-avana-does" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">What Avana Does</h2>
          <p className="mb-4 type-doc-body">
            A pledged position stays in its pool with its listed range for the life of the pledge and keeps earning trading fees. Where the AMM protocol keeps fees apart from the position, as Uniswap v3 and Aerodrome Slipstream do, the depositor collects them at any time. Avana never compounds, rebalances or otherwise changes pledged liquidity, except to remove exactly the units that are seized, removed by the depositor or used to repay debt.
          </p>
          <p className="mb-4 type-doc-body">
            Aave V4 accepts collateral only as ERC-20 reserves, while an AMM position is an NFT or a pool share. Avana separates custody from collateral accounting: an LPVault holds the position, Collateralization records how many units it backs, and a transfer-restricted vault token stands for those units on an unmodified Aave V4 Spoke owned by the Aave DAO. Aave then values the collateral, lends, tracks the health factor and decides when and how much to liquidate.
          </p>
          <p className="mb-4 type-doc-body">
            GHO is the first debt asset. Any other asset becomes borrowable once the Aave DAO approves its credit line, caps, price source and swap routes.
          </p>
        </section>

        <section id="participants" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Participants</h2>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Participant</th><th className="text-left px-4 py-2 type-doc-subsection-title">What they do</th><th className="text-left px-4 py-2 type-doc-subsection-title">What they risk</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Borrowers (liquidity providers)</td><td className="px-4 py-2">Pledge positions of a listed market, borrow, repay, withdraw and collect fees through the AaveAdapter. The pledging wallet is the depositor of record and the bound wallet of its PositionProxy for that Spoke and market.</td><td className="px-4 py-2">Partial liquidation of one market&apos;s account below health factor 1, including when a debt asset&apos;s price rises. A lost wallet key means the position can never be withdrawn.</td></tr>
                <tr><td className="px-4 py-2">Avana keeper</td><td className="px-4 py-2">Avana&apos;s keeper is the committed operator on each chain at launch and liquidates every account below health factor 1, whatever its size. Further committed operators and a standby keeper can be added through the timelock, up to 32 per chain. Registration gives no power any other caller lacks.</td><td className="px-4 py-2">Gas, swap costs and any recovery a few units below the debt repaid, which Avana pays as an operating cost.</td></tr>
                <tr><td className="px-4 py-2">Other liquidators</td><td className="px-4 py-2">Any address that is not frozen can liquidate an account below health factor 1 through the same entry point, with either swap-route mode, funding the debt asset itself or through the public flash liquidation helper. Any address can also repay any account&apos;s debt or refresh oracle and breaker state.</td><td className="px-4 py-2">Its own funds, gas and conversion outcome, bounded by its debt to cover, shortfall limit, deadline and minimum payout.</td></tr>
                <tr><td className="px-4 py-2">Aave DAO</td><td className="px-4 py-2">Owns and configures every Avana Hub, CDP Spoke, Lend Spoke and Coverage Spoke: collateral factors, caps, rates, flags, the three required settings and which reserves are borrowable. Its executor on each chain can propose to and cancel Avana timelock operations.</td><td className="px-4 py-2">Bad debt beyond the funded First-Loss Reserve of each Hub and debt asset.</td></tr>
                <tr><td className="px-4 py-2">Avana Labs</td><td className="px-4 py-2">Proposes markets and parameters, signs in the 4-of-7 governance multisig with external signers, funds each First-Loss Reserve and runs Avana&apos;s keeper.</td><td className="px-4 py-2">Its First-Loss Reserve capital and its keepers&apos; gas.</td></tr>
                <tr><td className="px-4 py-2">Credit-line suppliers</td><td className="px-4 py-2">The Aave DAO treasury supplies each credit line through the Lend Spoke; for GHO the lender is the GHO Reserve and Aave DAO. All interest accrues to them.</td><td className="px-4 py-2">Losses beyond the First-Loss Reserve on their Hub asset.</td></tr>
                <tr><td className="px-4 py-2">Guardians</td><td className="px-4 py-2">The Emergency Guardian (3-of-5 per chain) and the Aave Protocol Guardian pause or freeze Hubs, freeze addresses, trip breakers, switch to standby price routes and cancel queued operations.</td><td className="px-4 py-2">Not capital providers. They cannot upgrade, change parameters or move funds.</td></tr>
                <tr><td className="px-4 py-2">Risk reviewers</td><td className="px-4 py-2">The Aave V4 risk service providers assess each listing and set pool risk factors, USD caps and minimum pledges in the listing payload.</td><td className="px-4 py-2">None on-chain.</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="collateral-path" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Collateral Path</h2>
          <div className="type-doc-code-block">
            <code className="type-doc-body text-gray-900">{"Position → LPVault (custody) → Collateralization record → vault token minted to PositionProxy → supplied on CDP Spoke → borrow"}</code>
          </div>
          <ol className="mt-4 list-decimal space-y-2 ps-5 type-doc-body">
            <li>The borrower approves the AMM protocol&apos;s LPVault for one position and calls the AaveAdapter to pledge it, naming the CDP Spoke, the market and a deadline.</li>
            <li>On the wallet&apos;s first pledge into that market, the ProxyManager creates the wallet&apos;s PositionProxy at its predicted CREATE2 address.</li>
            <li>The LPVault checks the position against the market (same pool, exact tick range) and takes custody of it.</li>
            <li>Collateralization reads the position&apos;s units, pokes the LPOracle and asks the RiskModule for eligibility, the $10 minimum pledge, circuit breakers and cap charges, then records the credited units.</li>
            <li>The AaveAdapter mints exactly the credited units as vault tokens to the proxy. The proxy supplies them to the CDP Spoke, which moves them into the Hub, and enables them as collateral.</li>
            <li>The borrower then borrows in a separate call. The debt asset moves from the debt reserve&apos;s funding Hub to the proxy and on to the receiver the borrower named.</li>
          </ol>
          <p className="mt-4 type-doc-body">
            Each step of a pledge happens in one transaction. Custody is covered in{" "}
            <Link href="/developers/architecture/custody" className="text-type-accent hover:underline">Custody and Vault Tokens</Link>.
          </p>
        </section>

        <section id="loan-lifecycle" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Loan Lifecycle</h2>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Action</th><th className="text-left px-4 py-2 type-doc-subsection-title">How it works</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Borrow</td><td className="px-4 py-2">The RiskModule checks prices, flags, configuration and breakers; the borrower passes a minimum health factor, and Aave refuses any borrow below 1.00. There is no minimum debt. The Lens shows a recommended borrow at health factor 1.10.</td></tr>
                <tr><td className="px-4 py-2">Collect fees</td><td className="px-4 py-2">The depositor collects separated fees at any time. Units, vault tokens and debt are untouched.</td></tr>
                <tr><td className="px-4 py-2">Repay</td><td className="px-4 py-2">Any payer repays any account&apos;s debt through the AaveAdapter. No Avana pause, freeze, breaker or price state blocks it.</td></tr>
                <tr><td className="px-4 py-2">Withdraw</td><td className="px-4 py-2">The vault tokens are burned and the whole position returns to the depositor with its uncollected fees. A debt-free withdrawal reads no registry state and works in every state.</td></tr>
                <tr><td className="px-4 py-2">Partial removal and re-credit</td><td className="px-4 py-2">The depositor can remove part of a pledged position&apos;s liquidity, or credit liquidity it later added to the position.</td></tr>
                <tr><td className="px-4 py-2">Repay with collateral</td><td className="px-4 py-2">Repays debt from part of one position in one flash-funded call, with no bonus or Avana fee.</td></tr>
                <tr><td className="px-4 py-2">Liquidation</td><td className="px-4 py-2">Below health factor 1, LPVaultSwap takes the debt asset from its caller, calls Aave&apos;s standard liquidation, burns the seized vault tokens, has exactly those units unwound, swaps them into the debt asset and pays out, all in one transaction. The borrower keeps the rest of the position and all of its fees.</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="chains-hubs-amms" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Chains, Hubs and AMMs</h2>
          <p className="mb-4 type-doc-body">
            Avana runs the same contracts on every chain, with one instance of each per-chain contract and every Hub, Spoke and market setting held as data. A chain can host any of the three Hub tiers: Stable LP, Correlated LP and Volatile LP. A CDP Spoke is one standard Aave V4 Spoke per chain, Hub, AMM protocol and risk tier, and lists several markets.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Chain</th><th className="text-left px-4 py-2 type-doc-subsection-title">Hub</th><th className="text-left px-4 py-2 type-doc-subsection-title">CDP Spoke</th><th className="text-left px-4 py-2 type-doc-subsection-title">AMM protocol</th><th className="text-left px-4 py-2 type-doc-subsection-title">First debt asset</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Ethereum</td><td className="px-4 py-2">Avana Stable LP Hub</td><td className="px-4 py-2">Uniswap v3 Stable</td><td className="px-4 py-2">Uniswap v3</td><td className="px-4 py-2">GHO</td></tr>
                <tr><td className="px-4 py-2">Base</td><td className="px-4 py-2">Avana Stable LP Hub</td><td className="px-4 py-2">Aerodrome Slipstream Stable</td><td className="px-4 py-2">Aerodrome Slipstream, unstaked positions only</td><td className="px-4 py-2">GHO</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 mb-4 type-doc-body">
            Each chain has its own AvanaTimelock, governance multisig, Emergency Guardian, committed-operator registry, flash source and public flash liquidation helper. No Avana operation, role or contract on one chain can change state on another, and no account, cap or governance action is shared between chains.
          </p>
          <p className="mb-4 type-doc-body">
            Each wallet gets one PositionProxy per CDP Spoke and market, so every market has its own Aave account and health factor. Example from the specification: on Ethereum, Alice pledges one USDC/USDT position (range [−10, 10]) and one GHO/USDC position (range [−50, 50]) on &quot;Uniswap v3 Stable&quot; and gets two proxies. If the GHO/USDC feed goes stale, only the second account stops borrowing, and the first cannot be liquidated because of it.
          </p>
        </section>

        <section id="liquidity" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Where Liquidity Comes From</h2>
          <p className="mb-4 type-doc-body">
            Every borrowable asset comes from a capped credit line approved by the Aave DAO and supplied by its treasury through each chain&apos;s supply-only Lend Spoke. The CDP Spokes&apos; draw caps sum to at most the line, and each draw cap stays within the asset&apos;s flash liquidity and swap-route depth. The launch line on Ethereum is 2,000,000 GHO, with the final value and the Base line set in the funding ARFC. Interest accrues to the lenders, and Avana charges no fee on it.
          </p>
          <p className="mb-4 type-doc-body">
            Beside each line, the Avana Umbrella (Coverage Spoke) of that Hub and debt asset holds an Avana-funded First-Loss Reserve. It is funded before borrowing opens and covers recorded deficits in its asset. Details are in{" "}
            <Link href="/developers/architecture/lend-spoke" className="text-type-accent hover:underline">Lend Spoke</Link>.
          </p>
        </section>

        <section id="scope" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Scope</h2>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Area</th><th className="text-left px-4 py-2 type-doc-subsection-title">At launch</th><th className="text-left px-4 py-2 type-doc-subsection-title">Supported by the core, listed later</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">AMM protocols</td><td className="px-4 py-2">Uniswap v3 on Ethereum; Aerodrome Slipstream on Base; exact tick range per market</td><td className="px-4 py-2">Uniswap v2, Curve StableSwap-NG, Balancer weighted and stable pools, Uniswap v4, each after its readiness checks</td></tr>
                <tr><td className="px-4 py-2">Pools</td><td className="px-4 py-2">Stablecoin pools meeting the listing rules, such as USDC/USDT and pools containing GHO</td><td className="px-4 py-2">Correlated and volatile pools on the Correlated LP and Volatile LP Hubs</td></tr>
                <tr><td className="px-4 py-2">Hubs and Spokes</td><td className="px-4 py-2">Per chain: one Avana Stable LP Hub, one CDP Spoke, one Lend Spoke, one Coverage Spoke per Hub and debt asset</td><td className="px-4 py-2">Correlated LP and Volatile LP Hubs; more CDP Spokes</td></tr>
                <tr><td className="px-4 py-2">Borrowable assets</td><td className="px-4 py-2">GHO; others such as USDC, USDT or WETH once approved for a CDP Spoke</td><td className="px-4 py-2">Cross-Hub credit lines (specified, off at launch)</td></tr>
                <tr><td className="px-4 py-2">Chains</td><td className="px-4 py-2">Ethereum and Base</td><td className="px-4 py-2">Other networks, each through its own ARFC</td></tr>
                <tr><td className="px-4 py-2">Lending</td><td className="px-4 py-2">Aave DAO credit lines; no public deposits</td><td className="px-4 py-2">Public lending through the Lend Spoke</td></tr>
                <tr><td className="px-4 py-2">Liquidation</td><td className="px-4 py-2">One entry point open to any address, funded by the caller directly or through the public flash liquidation helper, paid in the debt asset repaid; Avana&apos;s keeper is the committed operator on each chain</td><td className="px-4 py-2">None</td></tr>
              </tbody>
            </table>
          </div>
          <h3 className="mt-6 mb-2 type-doc-subsection-title">Not included</h3>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>No Invest Spoke, Multiply or leveraged-LP loop, and no public lender deposits.</li>
            <li>No borrower allowlist, no minimum debt and no daily borrow limit; exposure is limited by caps.</li>
            <li>No function that moves an account to a new proxy, no off-chain signature or permit flows, and no native ETH payouts.</li>
            <li>No conversion of liquidation proceeds through a route that settles outside the liquidation transaction.</li>
            <li>No force-close power and no generic rescue or sweep function.</li>
            <li>Avana does not own or configure any Aave Hub or Spoke, and it is not a lender.</li>
          </ul>
        </section>

        <section id="trust" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Trust and Governance</h2>
          <p className="mb-4 type-doc-body">
            On each chain, the reviewed AaveAdapter, and the timelock that upgrades it, are trusted with custody of every proxy position. PositionProxies carry no logic. Custody and the rule that a position returns only to its depositor live in immutable contracts. Every privileged change executes through the chain&apos;s AvanaTimelock: 5 days for normal operations, 12 hours for a fixed set of risk-reducing calls, with a 14-day execution window. Repayment and debt-free withdrawal are never paused, so borrowers can leave before any upgrade lands.
          </p>
          <p className="mb-4 type-doc-body">
            A pause state per Hub, circuit breakers per market and per debt reserve, and an address freeze per chain contain incidents without trapping a borrower or stopping liquidation. Each concept is introduced in{" "}
            <Link href="/developers/introduction/key-concepts" className="text-type-accent hover:underline">Key Concepts</Link>.
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="What Avana does, who takes part, how a position becomes Aave V4 collateral, where liquidity comes from, and what is in scope on Ethereum and Base at launch."
        sectionColor="blue"
      />
    </div>
  ))
}
