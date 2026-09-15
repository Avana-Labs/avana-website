import localFont from "next/font/local"

/**
 * Load the route-specific legal heading face on demand; the global face remains
 * the only font requested at initial page load.
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
