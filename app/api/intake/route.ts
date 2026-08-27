/* Local stub standing in for the n8n webhook.

   It logs the payload and returns ok, which is enough to build and test the
   form against. It deliberately does not write anywhere. Capture first is
   the n8n pipeline's job, and a stub that half implements it would be worse
   than one that clearly does nothing. */
export async function POST(request: Request) {
  const payload = await request.json()

  console.log('[intake stub] received:\n' + JSON.stringify(payload, null, 2))

  return Response.json({ ok: true })
}
