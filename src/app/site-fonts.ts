import localFont from "next/font/local"

/**
 * Diatype is the app-wide typeface used across the marketing site.
 * Only the normal variable face is preloaded globally so text-first routes do
 * not pay for every italic face up front.
 */
export const diatypeFont = localFont({
  variable: "--font-diatype",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
  src: [
    {
      path: "../../public/fonts/diatype/ABCDiatypeVariable-Site-Trial.woff2",
      weight: "400 600",
      style: "normal",
    },
  ],
})

/**
 * Italic display moments are isolated to a few editorial surfaces, so the
 * dedicated italic face stays opt-in instead of joining the global preload set.
 */
export const diatypeItalicFont = localFont({
  display: "swap",
  preload: false,
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
  src: [
    {
      path: "../../public/fonts/diatype/ABCDiatype-RegularItalic-Trial.woff2",
      weight: "400",
      style: "italic",
    },
  ],
})
