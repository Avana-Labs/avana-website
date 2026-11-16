import { getTranslations } from "next-intl/server"
import type { ReactNode } from "react"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { ReferenceCopyButton } from "@/components/reference/reference-copy-button"
import { ReferenceNetworkView } from "@/components/reference/reference-network-view"
import type { AppLocale } from "@/i18n/locales"
import { loadReferenceDocument, type ReferencePageName } from "@/lib/reference/load"
import {
  isAddress,
  isHash,
  isPlaceholderAddress,
  parseInline,
  type ReferenceBlock,
  type ReferenceNetwork,
  type ReferenceSection,
} from "@/lib/reference/markdown"

type Labels = { placeholder: string; explorer: string }

function shorten(value: string) {
  return `${value.slice(0, 6)}…${value.slice(-4)}`
}

function Inline({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((part, index) => {
        if (part.type === "code") {
          return <code key={index} className="type-doc-inline-code">{part.value}</code>
        }
        if (part.type === "strong") {
          return <strong key={index} className="text-gray-900">{part.value}</strong>
        }
        if (part.type === "link") {
          const external = /^https?:\/\//.test(part.href)
          return (
            <a
              key={index}
              href={part.href}
              className="text-type-accent underline underline-offset-2"
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {part.text}
            </a>
          )
        }
        return <span key={index}>{part.value}</span>
      })}
    </>
  )
}

function AddressValue({ value, network, labels }: { value: string; network?: ReferenceNetwork; labels: Labels }) {
  const placeholder = isPlaceholderAddress(value)
  const short = (
    <span className="font-mono" data-export-skip>
      {shorten(value)}
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap" title={value}>
      {/* The full value is kept in the DOM for the page's Markdown export. */}
      <span className="hidden">{value}</span>
      {network && !placeholder ? (
        <a
          href={`${network.explorer}/address/${value}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${value} (${labels.explorer})`}
          className="text-type-accent underline underline-offset-2"
        >
          {short}
        </a>
      ) : (
        short
      )}
      <ReferenceCopyButton value={value} />
      {placeholder ? (
        <span className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs text-type-secondary">
          {labels.placeholder}
        </span>
      ) : null}
    </span>
  )
}

function HashValue({ value }: { value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap" title={value}>
      <span className="hidden">{value}</span>
      <span className="font-mono" data-export-skip>
        {`${value.slice(0, 10)}…${value.slice(-6)}`}
      </span>
      <ReferenceCopyButton value={value} />
    </span>
  )
}

function Cell({ value, network, labels }: { value: string; network?: ReferenceNetwork; labels: Labels }) {
  if (isAddress(value)) return <AddressValue value={value} network={network} labels={labels} />
  if (isHash(value)) return <HashValue value={value} />
  return <Inline text={value} />
}

function Blocks({ blocks, network, labels }: { blocks: ReferenceBlock[]; network?: ReferenceNetwork; labels: Labels }) {
  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === "paragraph") {
          return (
            <p key={index} className="mb-4 type-doc-body">
              <Inline text={block.text} />
            </p>
          )
        }
        if (block.type === "note") {
          return (
            <div key={index} className="mb-6 type-doc-panel type-doc-body">
              <Inline text={block.text} />
            </div>
          )
        }
        return (
          <div key={index} className="mb-6 overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  {block.table.headers.map((header) => (
                    <th key={header} className="text-left px-4 py-2 type-doc-subsection-title">
                      <Inline text={header} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {block.table.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className={cell.length > 80 ? "min-w-[16rem] px-4 py-2" : "px-4 py-2"}>
                        <Cell value={cell} network={network} labels={labels} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      })}
    </>
  )
}

function Sections({ sections, network, labels }: { sections: ReferenceSection[]; network?: ReferenceNetwork; labels: Labels }) {
  return (
    <>
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="mb-10 scroll-mt-32">
          <h2 className="mb-4 type-doc-section-title">{section.title}</h2>
          <Blocks blocks={section.blocks} network={network} labels={labels} />
        </section>
      ))}
    </>
  )
}

interface ReferencePageProps {
  locale: AppLocale
  page: ReferencePageName
  /** Replaces the default page header (title and description from front matter). */
  pageHeader?: ReactNode
  /** Hand-written, translated sections shown before the Markdown content. */
  lead?: ReactNode
  leadSections?: Array<{ id: string; title: string }>
  pageSummary?: string
}

export async function ReferencePage({
  locale,
  page,
  pageHeader,
  lead,
  leadSections = [],
  pageSummary,
}: ReferencePageProps): Promise<ReactNode> {
  const document = loadReferenceDocument(page)
  const t = await getTranslations({ locale, namespace: "common.docs.reference" })
  const labels: Labels = { placeholder: t("placeholder"), explorer: t("explorer") }

  const networkGroups = document.groups.filter((group) => group.network)
  const sharedGroups = document.groups.filter((group) => !group.network)

  const header = (
    <>
      {pageHeader ?? <DeveloperDocPageHeader title={document.title} description={document.description} />}
      {document.updated ? (
        <p className="-mt-6 mb-8 type-doc-body text-type-secondary">
          {t("updated", { date: document.updated })}
        </p>
      ) : null}
      {lead}
      <Blocks blocks={document.intro} labels={labels} />
    </>
  )

  const shared = sharedGroups.map((group) => (
    <div key={group.id}>
      <p className="mb-6 border-t border-border pt-8 type-doc-body text-foreground">{group.title}</p>
      <Blocks blocks={group.blocks} labels={labels} />
      <Sections sections={group.sections} labels={labels} />
    </div>
  ))

  return (
    <ReferenceNetworkView
      header={header}
      networks={networkGroups.map((group) => ({
        id: group.network!.id,
        title: group.title,
        chainId: group.network!.chainId,
        sections: group.sections.map(({ id, title }) => ({ id, title })),
      }))}
      panels={networkGroups.map((group) => (
        <div key={group.id}>
          <Blocks blocks={group.blocks} network={group.network} labels={labels} />
          <Sections sections={group.sections} network={group.network} labels={labels} />
        </div>
      ))}
      shared={shared}
      leadSections={leadSections}
      sharedSections={sharedGroups.flatMap((group) => group.sections.map(({ id, title }) => ({ id, title })))}
      pageSummary={pageSummary ?? document.description}
    />
  )
}

export function referenceMetadataFallback(name: ReferencePageName) {
  const document = loadReferenceDocument(name)
  return { title: document.title, description: document.description }
}
