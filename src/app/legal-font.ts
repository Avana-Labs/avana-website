import localFont from "next/font/local"

/**
 * Preload the above-fold legal heading face only on routes that use it.
 */
export const diatypeItalicFont = localFont({
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
  src: [
    {
      path: "../../public/fonts/diatype/ABCDiatype-RegularItalic-Trial.woff2",
      weight: "400",
      style: "italic",
    },
  ],
})
