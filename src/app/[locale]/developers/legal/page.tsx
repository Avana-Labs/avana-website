import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'legal', {
    title: "Legal & Compliance - Security Disclosures",
    description: "Avana legal information - access restrictions, restricted jurisdictions, compliance requirements, and security disclosures.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "access-restrictions", title: "Access Restrictions" },
  { id: "restricted-jurisdictions", title: "Restricted Jurisdictions" },
  { id: "compliance", title: "Compliance" },
  { id: "related-policies", title: "Related Policies" },
]

const restrictedJurisdictions = [
  { country: "Iran", reason: "OFAC sanctions" },
  { country: "North Korea", reason: "OFAC sanctions" },
  { country: "Russia", reason: "OFAC sanctions" },
  { country: "Syria", reason: "OFAC sanctions" },
  { country: "Ukraine (Crimea, Donetsk, and Luhansk regions)", reason: "OFAC sanctions" },
  { country: "United States of America", reason: "Pending regulatory clarity" },
]

export default async function SecurityDisclosuresPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "legal", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      {/* Main content */}
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader

          title="Restricted Territories"

          description="This page is maintained to reflect the most current list of Restricted Jurisdictions for the Avana domain."

        />

        <section id="overview" className="mb-10">
          <h2 className="type-doc-section-title mb-4">Overview</h2>
          <p className="type-doc-body mb-4">
            In accordance with our <Link href="/terms" className="text-blue-600 hover:underline">Terms of Use</Link>, 
            access to the Avana website and its associated services is restricted for individuals or entities 
            in certain jurisdictions. This page provides the current list of restricted territories and explains 
            the access restrictions in place.
          </p>
          <p className="type-doc-callout type-doc-callout-danger">
            <strong>Important:</strong> Any attempt to access the Avana platform from a Restricted 
            Jurisdiction will result in immediate redirection to the Terms of Use and a denial of access.
          </p>
        </section>

        <section id="access-restrictions" className="mb-10">
          <h2 className="type-doc-section-title mb-4">Access Restrictions</h2>
          <p className="type-doc-body mb-4">
            Access to the Avana website and its associated services is restricted for individuals or 
            entities who:
          </p>
          
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <ul className="type-doc-body space-y-2">
                <li>• <strong>Reside within</strong> any of the Restricted Jurisdictions</li>
                <li>• <strong>Are citizens of</strong> any of the Restricted Jurisdictions</li>
                <li>• <strong>Are physically located within</strong> any of the Restricted Jurisdictions</li>
                <li>• <strong>Are incorporated within</strong> any of the Restricted Jurisdictions</li>
                <li>• <strong>Maintain a registered office within</strong> any of the Restricted Jurisdictions</li>
              </ul>
            </div>
          </div>

          <p className="type-doc-body mt-4">
            These restrictions are defined in Avana&apos;s <Link href="/terms" className="text-blue-600 hover:underline">Terms of Use</Link> and 
            are enforced to comply with applicable laws and regulations.
          </p>
        </section>

        <section id="restricted-jurisdictions" className="mb-10">
          <h2 className="type-doc-section-title mb-4">Current Restricted Jurisdictions</h2>
          <p className="type-doc-body mb-4">
            The following jurisdictions are currently restricted from accessing Avana services:
          </p>
          
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Jurisdiction</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {restrictedJurisdictions.map((item) => (
                  <tr key={item.country}>
                    <td className="px-4 py-2 text-gray-900 font-medium">{item.country}</td>
                    <td className="px-4 py-2">{item.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 type-doc-body">
            <strong>Note:</strong> This list may be updated from time to time in response to changes in 
            applicable laws, regulations, or sanctions programs. Users are responsible for ensuring their 
            continued compliance with these restrictions.
          </p>
        </section>

        <section id="compliance" className="mb-10">
          <h2 className="type-doc-section-title mb-4">Compliance</h2>
          <p className="type-doc-body mb-4">
            As stated in our Terms of Use (Section 1.2), you may not access or use the Services if you are:
          </p>
          
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <ul className="type-doc-body space-y-2">
              <li>• The subject of any sanctions administered or enforced by the U.S. Department of the 
                Treasury&apos;s Office of Foreign Assets Control (OFAC), the U.S. Department of State, or any 
                other governmental authority with jurisdiction</li>
              <li>• Identified on the Denied Persons, Entity, or Unverified Lists of the U.S. Department 
                of Commerce&apos;s Bureau of Industry and Security</li>
              <li>• Located, organized, or resident in a country or territory that is, or whose government 
                is, the subject of economic sanctions</li>
            </ul>
          </div>

          <p className="type-doc-body mt-4">
            Users are solely responsible for ensuring their use of the protocol complies with all applicable 
            laws and regulations in their jurisdiction.
          </p>
        </section>

        <section id="related-policies" className="mb-10">
          <h2 className="type-doc-section-title mb-4">Related Policies</h2>
          <p className="type-doc-body mb-4">
            For complete information about your rights and obligations when using Avana, please review:
          </p>
          
          <div className="space-y-3">
            <Link href="/terms" className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50/50 transition-colors">
              <h3 className="type-doc-subsection-title mb-1">Terms of Service</h3>
              <p className="type-doc-body">
                Complete terms and conditions governing your use of Avana services, including 
                eligibility requirements, prohibited activities, and dispute resolution.
              </p>
            </Link>

            <Link href="/privacy" className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50/50 transition-colors">
              <h3 className="type-doc-subsection-title mb-1">Privacy Policy</h3>
              <p className="type-doc-body">
                Information about how we collect, use, and protect your personal information when 
                you use our services.
              </p>
            </Link>

            <Link href="/developers/legal/disclaimer" className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50/50 transition-colors">
              <h3 className="type-doc-subsection-title mb-1">Legal Disclaimer</h3>
              <p className="type-doc-body">
                Important disclaimers regarding risks, warranties, and liability limitations.
              </p>
            </Link>
          </div>
        </section>
      </div>

      {/* Right scroll-spy sidebar */}
      <DeveloperScrollSpyRail 
        sections={sections} 
        pageSummary="Restricted territories and access restrictions for Avana services."
        sectionColor="slate"
      />
    </div>
  ))
}
