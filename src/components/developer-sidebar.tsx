"use client"

/**
 * DeveloperSidebar - The main navigation sidebar for developer documentation.
 * 
 * @description
 * Renders a sticky sidebar with hierarchical navigation for the /developers section.
 * Features include:
 * - Collapsible sections with icons
 * - Active state highlighting based on current route
 * - Color-coded sections for visual distinction
 * - Smooth hover animations on icons and text
 * 
 * @exports
 * - navigationSections: Array of navigation structure (used by PageNavigation)
 * - DeveloperSidebar: The sidebar component
 * 
 * @layout
 * - Hidden on mobile (md:block)
 * - Fixed width: 256px
 * - Sticky positioning below header
 * - Full height with hidden scrollbar
 * 
 * @sections
 * - Introduction (blue)
 * - Getting Started (emerald)
 * - Protocol Architecture (violet)
 * - Liquidation Framework (amber)
 * - Supported Integrations (cyan)
 * - Safety Mechanisms (rose)
 * - Legal & Compliance (slate)
 * 
 * @example
 * // Used in developers layout
 * <DeveloperSidebar />
 * 
 * @see src/app/developers/layout.tsx - Where this component is rendered
 * @see src/components/page-navigation.tsx - Uses exported navigationSections
 */
import { useDesktopLayout } from "@/components/ui/use-desktop-layout"
import { useTranslations } from "next-intl"
import type { CSSProperties } from "react"
import { useEffect, useRef } from "react"
import { Link, usePathname } from "@/i18n/navigation"
import {
  Bug,
  BookOpen,
  Rocket,
  Layers,
  AlertTriangle,
  Plug,
  Shield,
  Scale,
  FileText,
  Lightbulb,
  BookMarked,
  Download,
  Coins,
  Settings,
  CreditCard,
  LogOut,
  Gift,
  Workflow,
  Percent,
  Heart,
  DollarSign,
  Award,
  Flame,
  ArrowRight,
  ListChecks,
  Server,
  Droplets,
  Router,
  BarChart3,
  Gauge,
  Building,
  Umbrella,
  FileWarning,
  Gavel,
  Bot,
  MessageSquare,
} from "lucide-react"

// Navigation structure - exported for use in PageNavigation component
export const navigationSections = [
  {
    id: "introduction",
    titleKey: "docs.sections.introduction",
    icon: BookOpen,
    items: [
      { href: "/developers", labelKey: "docs.items.overview", icon: FileText },
      { href: "/developers/introduction/key-concepts", labelKey: "docs.items.keyConcepts", icon: Lightbulb },
      { href: "/developers/introduction/glossary", labelKey: "docs.items.glossary", icon: BookMarked },
    ],
  },
  {
    id: "getting-started",
    titleKey: "docs.sections.gettingStarted",
    icon: Rocket,
    items: [
      { href: "/developers/getting-started", labelKey: "docs.items.depositLp", icon: Download },
      { href: "/developers/getting-started/borrow-assets", labelKey: "docs.items.borrowAssets", icon: Coins },
      { href: "/developers/getting-started/manage-loans", labelKey: "docs.items.manageLoans", icon: Settings },
      { href: "/developers/getting-started/repay-loans", labelKey: "docs.items.repayLoans", icon: CreditCard },
      { href: "/developers/getting-started/withdraw-collateral", labelKey: "docs.items.withdrawCollateral", icon: LogOut },
      { href: "/developers/getting-started/claim-lp-fees", labelKey: "docs.items.claimLpFees", icon: Gift },
    ],
  },
  {
    id: "architecture",
    titleKey: "docs.sections.architecture",
    icon: Layers,
    items: [
      { href: "/developers/architecture", labelKey: "docs.items.borrowSpoke", icon: Workflow },
      { href: "/developers/architecture/lend-spoke", labelKey: "docs.items.lendSpoke", icon: Coins },
      { href: "/developers/architecture/collateral-factors", labelKey: "docs.items.collateralFactors", icon: Percent },
      { href: "/developers/architecture/health-factor", labelKey: "docs.items.healthFactor", icon: Heart },
      { href: "/developers/architecture/platform-fees", labelKey: "docs.items.platformFees", icon: DollarSign },
      { href: "/developers/architecture/incentives", labelKey: "docs.items.incentives", icon: Award },
    ],
  },
  {
    id: "liquidation",
    titleKey: "docs.sections.liquidation",
    icon: AlertTriangle,
    items: [
      { href: "/developers/liquidation", labelKey: "docs.items.liquidationDesign", icon: Flame },
      { href: "/developers/liquidation/liquidators", labelKey: "docs.items.liquidators", icon: Coins },
      { href: "/developers/liquidation/flow", labelKey: "docs.items.liquidationFlow", icon: ArrowRight },
      { href: "/developers/liquidation/examples", labelKey: "docs.items.liquidationExamples", icon: ListChecks },
    ],
  },
  {
    id: "copilot",
    titleKey: "docs.sections.copilot",
    icon: Bot,
    items: [
      { href: "/developers/copilot", labelKey: "docs.items.aiIntroduction", icon: Bot },
      { href: "/developers/copilot/query-example", labelKey: "docs.items.copilotPrompts", icon: MessageSquare },
      { href: "/developers/copilot/workflow", labelKey: "docs.items.copilotWorkflow", icon: Workflow },
    ],
  },
  {
    id: "integrations",
    titleKey: "docs.sections.integrations",
    icon: Plug,
    items: [
      { href: "/developers/integrations", labelKey: "docs.items.integrationsOverview", icon: Server },
      { href: "/developers/integrations/appkit", labelKey: "docs.items.appkit", icon: Plug },
      { href: "/developers/integrations/allowed-pools", labelKey: "docs.items.allowedPools", icon: Droplets },
      { href: "/developers/integrations/router-contract", labelKey: "docs.items.routerAdapters", icon: Router },
      { href: "/developers/integrations/price-oracles", labelKey: "docs.items.priceOracles", icon: BarChart3 },
    ],
  },
  {
    id: "safety",
    titleKey: "docs.sections.safety",
    icon: Shield,
    items: [
      { href: "/developers/safety", labelKey: "docs.items.riskFramework", icon: Gauge },
      { href: "/developers/safety/contracts", labelKey: "docs.items.contractsSecurity", icon: Building },
      { href: "/developers/safety/bug-bounty", labelKey: "docs.items.bugBounty", icon: Bug },
      { href: "/developers/safety/insurance", labelKey: "docs.items.insuranceFunds", icon: Umbrella },
    ],
  },
  {
    id: "legal",
    titleKey: "docs.sections.legal",
    icon: Scale,
    items: [
      { href: "/developers/legal", labelKey: "docs.items.securityDisclosures", icon: FileWarning },
      { href: "/developers/legal/disclaimer", labelKey: "docs.items.legalDisclaimer", icon: Gavel },
    ],
  },
] as const

// Active section styling — accent tints work in both light and dark mode
const activeSectionStyles = {
  headerBg: "bg-type-accent/10",
  headerText: "text-type-accent",
  itemBg: "bg-type-accent/15",
  itemText: "text-type-accent",
  icon: "text-type-accent",
} as const

const sectionColors: Record<string, typeof activeSectionStyles> = {
  introduction: activeSectionStyles,
  "getting-started": activeSectionStyles,
  architecture: activeSectionStyles,
  liquidation: activeSectionStyles,
  copilot: activeSectionStyles,
  integrations: activeSectionStyles,
  safety: activeSectionStyles,
  legal: activeSectionStyles,
}

export default function DeveloperSidebar() {
  const isDesktop = useDesktopLayout()
  const t = useTranslations("common")
  const pathname = usePathname()
  const normalizedPathname = pathname || "/"
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const activeItemRef = useRef<HTMLAnchorElement>(null)
  const sidebarTypeScale = {
    "--type-sidebar-link-size": "0.875rem",
  } as CSSProperties

  const isActive = (href: string) => {
    return normalizedPathname === href
  }

  // Section overview at /developers must not match every /developers/* path.
  const isSectionActive = (section: (typeof navigationSections)[number]) => {
    return section.items.some((item) => {
      if (normalizedPathname === item.href) {
        return true
      }

      if (item.href === "/developers") {
        return false
      }

      return normalizedPathname.startsWith(`${item.href}/`)
    })
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    const activeItem = activeItemRef.current
    if (!container || !activeItem) {
      return
    }

    const frame = window.requestAnimationFrame(() => {
      const containerRect = container.getBoundingClientRect()
      const itemRect = activeItem.getBoundingClientRect()
      const isVisible =
        itemRect.top >= containerRect.top + 8 &&
        itemRect.bottom <= containerRect.bottom - 8

      if (isVisible) {
        return
      }

      const nextScrollTop =
        container.scrollTop +
        (itemRect.top - containerRect.top) -
        container.clientHeight / 2 +
        itemRect.height / 2

      container.scrollTo({
        top: Math.max(0, nextScrollTop),
        behavior: "smooth",
      })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [normalizedPathname, isDesktop])

  if (!isDesktop) return null

  return (
    <aside
      className="sticky top-[73px] hidden h-[calc(100vh-73px)] w-64 shrink-0 border-r border-border xl:block"
      style={sidebarTypeScale}
    >
      {/* Scrollable content */}
      <div
        ref={scrollContainerRef}
        className="h-full overflow-y-auto pr-2"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
          @keyframes wiggle {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-12deg); }
            75% { transform: rotate(12deg); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.3); }
          }
          .hover-wiggle:hover {
            animation: wiggle 0.4s ease-in-out;
          }
          .hover-pulse:hover {
            animation: pulse 0.3s ease-in-out;
          }
          .group:hover .group-hover-wiggle {
            animation: wiggle 0.4s ease-in-out;
          }
          .group:hover .group-hover-pulse {
            animation: pulse 0.3s ease-in-out;
          }
        `}</style>
        <nav className="py-6 px-4">
          {navigationSections.map((section) => {
            const SectionIcon = section.icon
            const sectionActive = isSectionActive(section)
            const colors = sectionColors[section.id]

            return (
              <div key={section.id} className="mb-2">
                {/* Section Header */}
                <div
                  className={`type-sidebar-link flex items-center py-2.5 px-3 rounded-lg font-semibold leading-5 transition-all duration-200 group cursor-default ${sectionActive
                      ? `${colors.headerBg} ${colors.headerText}`
                      : "text-type-tertiary hover:bg-muted hover:text-foreground"
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <SectionIcon
                      className={`h-4 w-4 transition-all duration-300 group-hover-wiggle ${sectionActive ? colors.icon : "text-type-tertiary group-hover:text-foreground"
                        }`}
                    />
                    <span className="transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                      {t(section.titleKey)}
                    </span>
                  </div>
                </div>

                {/* Section Items */}
                <ul className="mt-1 ms-3 ps-3 border-s border-border space-y-0.5">
                  {section.items.map((item) => {
                    const ItemIcon = item.icon
                    const itemActive = isActive(item.href)

                    return (
                      <li key={item.href}>
                        <Link
                          ref={itemActive ? activeItemRef : undefined}
                          href={item.href}
                          prefetch={false}
                          className={`type-sidebar-link flex items-center gap-2 py-2 px-2.5 rounded-md font-medium leading-5 transition-all duration-200 group ${itemActive
                              ? `${colors.itemBg} ${colors.itemText} font-medium`
                              : "text-type-tertiary hover:bg-muted hover:text-foreground"
                            }`}
                        >
                          <ItemIcon
                            className={`h-3.5 w-3.5 transition-all duration-300 group-hover-pulse ${itemActive
                                ? colors.icon
                                : "text-type-tertiary group-hover:text-foreground/70"
                              }`}
                          />
                          <span className="transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                            {t(item.labelKey)}
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
