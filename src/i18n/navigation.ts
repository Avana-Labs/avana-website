import { createElement, type ComponentProps } from "react"
import { createNavigation } from "next-intl/navigation"
import { routing } from "@/i18n/routing"

const { Link: IntlLink, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)

// Avoid downloading unrelated pages merely because their links enter the viewport.
// Navigation remains client-side; individual links can opt in with prefetch={true}.
export function Link({ prefetch = false, ...props }: ComponentProps<typeof IntlLink>) {
  return createElement(IntlLink, { ...props, prefetch })
}

export { redirect, usePathname, useRouter, getPathname }
