import type { Metadata } from "next"
import { ReferencePage, referenceMetadataFallback } from "@/components/reference/reference-page"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

// Content comes from content/reference/access-controls.md (synced with `npm run sync:reference`).
export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, "reference/access-controls", referenceMetadataFallback("access-controls"))
}

export default async function ReferenceAccessControlsPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return <ReferencePage locale={locale} page="access-controls" />
}
