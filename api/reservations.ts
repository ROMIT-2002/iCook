import { z } from 'zod';

const reservationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80, 'Name max 80 characters'),
  partySize: z.string().min(1, 'Party size required'),
  dietaryNote: z.string().max(300, 'Dietary note max 300 characters').optional().or(z.literal('')),
  message: z.string().max(500, 'Message max 500 characters').optional().or(z.literal('')),
  website_url: z.string().optional() // Honeypot field
});

// Where reservation emails are delivered. Override with RSVP_EMAIL in the
// Vercel project settings to keep the address out of this file.
const RSVP_EMAIL = process.env.RSVP_EMAIL || 'romit.chakraborty2002@gmail.com';

// FormSubmit relays a POST to an email address with no account or API key.
// The first message to a new address triggers a one-time confirmation link.
const RELAY_ENDPOINT = `https://formsubmit.co/ajax/${encodeURIComponent(RSVP_EMAIL)}`;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    // Vercel parses JSON bodies automatically, but be tolerant of a raw string.
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const parseResult = reservationSchema.safeParse(body);

    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: parseResult.error.errors
      });
    }

    const { name, partySize, dietaryNote, message, website_url } = parseResult.data;

    // Honeypot anti-bot check
    if (website_url && website_url.trim() !== '') {
      console.warn('[RESERVATION] Honeypot triggered by bot submission.');
      return res.status(200).json({ success: true, message: 'Reservation received' });
    }

    const timestampLA = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Los_Angeles',
      dateStyle: 'full',
      timeStyle: 'medium'
    }).format(new Date());

    // Logged before sending so a reservation is never lost to a relay outage.
    // Recoverable from the Vercel runtime logs if email delivery ever fails.
    console.log('[RESERVATION]', JSON.stringify({ name, partySize, dietaryNote, message, timestampLA }));

    let notified = false;
    let reason: string | null = null;

    const siteOrigin = process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'https://i-cook-rho.vercel.app';

    try {
      const relayRes = await fetch(RELAY_ENDPOINT, {
        method: 'POST',
        // FormSubmit rejects requests without an Origin/Referer, which a
        // server-side fetch does not send on its own.
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Origin: siteOrigin,
          Referer: `${siteOrigin}/`
        },
        body: JSON.stringify({
          _subject: `Potluck RSVP — ${name} (${partySize})`,
          _template: 'table',
          _captcha: 'false',
          Name: name,
          Party: partySize,
          'Dietary note': dietaryNote && dietaryNote.trim() ? dietaryNote.trim() : 'None',
          Message: message && message.trim() ? message.trim() : 'None',
          Received: timestampLA,
          Event: 'The Potluck Society — August 12, 2026'
        })
      });

      const relayBody = await relayRes.text();

      // The relay answers 200 even when it refuses to send, signalling the
      // real outcome with a "success" field that is the string "true".
      let relaySucceeded = false;
      try {
        relaySucceeded = String(JSON.parse(relayBody)?.success) === 'true';
      } catch {
        relaySucceeded = false;
      }

      if (relayRes.ok && relaySucceeded) {
        notified = true;
        console.log(`[RELAY SUCCESS] ${relayBody.slice(0, 200)}`);
      } else {
        reason = relayRes.ok ? 'relay_refused' : `relay_http_${relayRes.status}`;
        console.error(`[RELAY ERROR] ${relayRes.status} ${relayBody.slice(0, 300)}`);
      }
    } catch (relayErr: any) {
      reason = 'relay_unreachable';
      console.error('[RELAY ERROR]', relayErr?.message || relayErr);
    }

    // The guest is confirmed either way; the reservation is already in the logs.
    return res.status(200).json({
      success: true,
      message: 'Reservation confirmed for August 12, 2026',
      notified,
      ...(notified ? {} : { reason, build: (process.env.VERCEL_GIT_COMMIT_SHA || 'local').slice(0, 7) }),
      data: { name, partySize, timestamp: timestampLA }
    });
  } catch (err: any) {
    console.error('[SERVER ERROR]', err?.message || err);
    return res.status(500).json({
      success: false,
      error: 'We couldn’t complete the reservation. Please try again.'
    });
  }
}
