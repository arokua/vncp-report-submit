export const runtime = "nodejs";           // Vercel Serverless (Node 18+)

export async function POST(req) {
  const n8n = "https://it-vncp-1.app.n8n.cloud/webhook-test/generate-crm-report";
  const form = await req.formData();       // reads multipart once

  // Re-package so fetch() can resend it
  const out = new FormData();
  for (const [k, v] of form.entries()) out.append(k, v);

  const upstream = await fetch(n8n, { method: "POST", body: out });

  return new Response(
    JSON.stringify({ ok: upstream.ok }),
    { status: upstream.ok ? 200 : 502 }
  );
}
