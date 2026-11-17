import { companyDocResponse } from "@/lib/company-doc"

export const dynamic = "force-dynamic"

/** avana.cc/company: the company document as plain text, read from file storage outside the repository (src/lib/company-doc.ts). */
export async function GET() {
  const { status, body, headers } = await companyDocResponse(process.env.COMPANY_DOC_URL, (url) =>
    fetch(url, { cache: "no-store" }),
  )
  return new Response(body, { status, headers })
}
