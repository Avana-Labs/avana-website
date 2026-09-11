import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import { Link } from "@/i18n/navigation"
import type { Metadata } from "next"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, "legal/disclaimer", {
    title: "Legal Disclaimer",
    description: "How Avana's Terms of Service apply to its documentation, interface, and protocol integrations.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "general-disclaimer", title: "Services and smart contracts" },
  { id: "no-financial-advice", title: "Information and advice" },
  { id: "developer-responsibilities", title: "Access and developer responsibilities" },
  { id: "risks", title: "Protocol and integration risks" },
  { id: "testnet", title: "Testnet use" },
  { id: "no-warranties", title: "Warranties and availability" },
  { id: "limitation-of-liability", title: "Liability and indemnification" },
  { id: "disputes", title: "Disputes and governing law" },
  { id: "related-policies", title: "Related policies" },
]

const policyLink = "text-[#01AACF] hover:underline"

export default async function LegalDisclaimerPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "legal/disclaimer", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Legal Disclaimer"
          description="The terms that apply when you read the documentation, use Avana's interface, or build a protocol integration."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="type-doc-body">
            This page explains provisions of Avana&apos;s{" "}
            <Link href="/terms" className={policyLink}>Terms of Service</Link>{" "}
            that are relevant to developers. It is a summary, not a replacement for the Terms
            or an amendment to them. Accessing or using the Services constitutes acceptance of
            the Terms, including revisions that take effect when posted. The complete Terms
            define the agreement between you and Avana; refer to them for the applicable
            wording, conditions, and exceptions.
          </p>
        </section>

        <section id="general-disclaimer" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Services and smart contracts</h2>
          <div className="doc-prose">
            <p className="type-doc-body">
              Avana provides technical services, including a test environment, a web interface,
              and informational resources. The protocol consists of open-source smart contracts
              that can receive and hold supported crypto assets. Section 2 distinguishes those
              contracts from the Services and describes use of the contracts as being at the
              user&apos;s own risk. Avana does not control third-party applications built on the
              protocol or the activity of users interacting with it.
            </p>
            <p className="type-doc-body">
              The interface does not hold private keys, control assets on a user&apos;s behalf,
              or modify or reverse submitted blockchain transactions. This is distinct from a
              deposit into a protocol contract, where the contract holds collateral according
              to its rules. Section 3.2 also reserves Avana&apos;s right to charge or modify
              interface fees. See{" "}
              <Link href="/terms#avana-protocol" className={policyLink}>Sections 2 and 3</Link>{" "}
              for the full distinction between the protocol and the interface.
            </p>
          </div>
        </section>

        <section id="no-financial-advice" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Information and advice</h2>
          <p className="type-doc-body">
            Documentation, tutorials, articles, and other resources explain the system for
            informational and educational purposes. They do not replace an independent
            evaluation of an integration or a financial decision, and the Terms state that
            they may not be a complete or exclusive source of information. Avana is not acting
            as a broker, dealer, exchange, investment adviser, custodian, or financial service
            provider and does not undertake a fiduciary obligation to users. Section 4 addresses
            reliance on these resources and responsibility for associated losses.
          </p>
        </section>

        <section id="developer-responsibilities" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Access and developer responsibilities</h2>
          <div className="doc-prose">
            <p className="type-doc-body">
              Access is subject to the eligibility and sanctions restrictions in Section 1.
              Users remain responsible for applicable legal and tax obligations, protecting
              wallet keys, and transactions signed with those keys. Sections 5 and 11 prohibit
              unauthorized access, disruption, abusive request volumes, and misleading
              integrations. Third-party wallets, protocols, and services have their own terms,
              fees, privacy practices, and risks, which also apply when they are used through
              an Avana integration.
            </p>
            <p className="type-doc-body">
              Code availability does not give every part of the Services the same license.
              Section 6 describes the Services license, restrictions on Avana&apos;s marks, and
              the treatment of feedback. Where a software component has a separate open-source
              or business-source license, Section 6.2 provides that the component&apos;s license
              governs it. An integration therefore needs to account for the terms of each
              component it uses as well as the rules for accessing the Services.
            </p>
          </div>
        </section>

        <section id="risks" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Protocol and integration risks</h2>
          <div className="doc-prose">
            <p className="type-doc-body">
              The Terms describe the protocol and its dependencies as experimental technology.
              Contract vulnerabilities, upgrades, network failures, cyberattacks, and service
              interruptions can cause transactions to fail or assets to be lost. Compatible
              assets and networks can also change. The interface does not remove these risks,
              and an example or test result in the documentation does not establish that a
              later transaction will produce the same outcome.
            </p>
            <p className="type-doc-body">
              LP-backed borrowing depends on the value recoverable from the underlying position.
              Market movement, pool inventory, oracle inputs, and liquidation liquidity can
              affect collateral value and account health. If an account crosses its liquidation
              threshold, its collateral may be settled to repay debt. These mechanics explain
              how protocol risk can affect an integration; they do not limit the broader risks
              and user responsibilities described in{" "}
              <Link href="/terms#risks" className={policyLink}>Section 8</Link>.
            </p>
          </div>
        </section>

        <section id="testnet" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Testnet use</h2>
          <p className="type-doc-body">
            The Testnet exists for testing and improving integrations. Under Section 3.1, test
            tokens have no monetary value outside the Testnet and cannot be redeemed or
            converted for fiat, production crypto assets, or other value. Avana may change,
            suspend, or discontinue all or part of the Testnet without notice. Test balances
            and results describe a testing environment, not a claim on assets or confirmation
            of equivalent production behavior.
          </p>
        </section>

        <section id="no-warranties" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Warranties and availability</h2>
          <p className="type-doc-body">
            Section 9.1 provides the Services on an &quot;as-is&quot; and &quot;as-available&quot; basis,
            except as expressly stated in the Terms. It disclaims express, implied, and
            statutory warranties, including fitness for a particular purpose, merchantability,
            non-infringement, and uninterrupted or error-free operation. Where applicable law
            prevents a warranty or condition from being excluded, the Terms limit its scope
            and duration to the minimum extent permitted by that law.
          </p>
        </section>

        <section id="limitation-of-liability" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Liability and indemnification</h2>
          <div className="doc-prose">
            <p className="type-doc-body">
              Section 9.2 excludes specified categories of damages, including consequential,
              indirect, incidental, and special damages, lost data, lost profits, and reductions
              in value. It also limits Avana&apos;s aggregate liability under the Terms to US$100.
              Section 9.3 explains that some exclusions or limits may not apply in jurisdictions
              that do not permit them. These provisions need to be read together with the
              conditions and exceptions in the Terms.
            </p>
            <p className="type-doc-body">
              Section 9.4 sets out indemnification, defense, and reimbursement obligations for
              claims connected with use of the Services or third-party services, breaches of
              the Terms, submitted material, and unauthorized changes or use. The full scope,
              covered parties, and procedures are stated in{" "}
              <Link href="/terms#disclaimer-of-warranties" className={policyLink}>Section 9</Link>.
              This summary does not expand or replace those obligations.
            </p>
          </div>
        </section>

        <section id="disputes" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Disputes and governing law</h2>
          <p className="type-doc-body">
            Section 10 specifies binding arbitration under the JAMS procedures identified in
            the Terms, with arbitration in New York, New York. It includes notice at least 30
            days before an arbitration demand, provisions for provisional remedies, and
            class-action and jury-trial waivers, subject to the stated conditions and applicable
            law. Section 12.8 specifies New York law. Read the complete{" "}
            <Link href="/terms#dispute-resolution" className={policyLink}>dispute-resolution provisions</Link>{" "}
            for the process and exceptions that apply.
          </p>
        </section>

        <section id="related-policies" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Related policies</h2>
          <p className="type-doc-body">
            The <Link href="/terms" className={policyLink}>Terms of Service</Link>{" "}
            contain the complete agreement. The{" "}
            <Link href="/privacy" className={policyLink}>Privacy Policy</Link>{" "}
            explains the handling of personal information, and the{" "}
            <Link href="/developers/legal" className={policyLink}>Restricted Territories</Link>{" "}
            page lists service-access restrictions. Section 12.2 provides the contact for legal
            notices: <a href="mailto:legal@avana.cc" className={policyLink}>legal@avana.cc</a>.
            Refer to the current published policies when evaluating an integration or using
            the Services.
          </p>
        </section>
      </div>
      <DeveloperScrollSpyRail sections={sections} sectionColor="rose" />
    </div>
  ))
}
