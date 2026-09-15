import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { createElement } from "react"
import { ImageResponse } from "next/og"

export const dynamic = "force-static"

// A shared, language-neutral preview, rendered once at build time. Query strings
// never become image content or trigger remote image/font requests.
const logo = readFile(join(process.cwd(), "public/Avana PNG/Avana Full (Black) PNG.png"))

export async function GET() {
  const image = await logo
  return new ImageResponse(
    createElement("div", {
      style: {
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #ffffff 30%, #daf6fc 100%)",
      },
    }, createElement("img", {
      src: `data:image/png;base64,${image.toString("base64")}`,
      width: 1000,
      height: 500,
      alt: "Avana",
    })),
    { width: 1200, height: 630 },
  )
}
