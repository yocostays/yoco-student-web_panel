import { ASSETLINKS_HEADERS, getAssetLinkStatements } from "@/lib/assetlinks";

export const dynamic = "force-dynamic";

export function GET() {
  return new Response(JSON.stringify(getAssetLinkStatements(), null, 2), {
    headers: ASSETLINKS_HEADERS,
  });
}

export function HEAD() {
  return new Response(null, { headers: ASSETLINKS_HEADERS });
}
