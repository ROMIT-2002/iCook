import { z } from 'zod';

const reservationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80, 'Name max 80 characters'),
  partySize: z.string().min(1, 'Party size required'),
  dietaryNote: z.string().max(300, 'Dietary note max 300 characters').optional().or(z.literal('')),
  message: z.string().max(500, 'Message max 500 characters').optional().or(z.literal('')),
  website_url: z.string().optional() // Honeypot field
});

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

    // The email itself is sent from the browser, because the relay rejects
    // server-side requests. This route exists purely so every reservation is
    // also captured in the Vercel runtime logs as a backup record.
    return res.status(200).json({
      success: true,
      message: 'Reservation confirmed for August 12, 2026',
      logged: true,
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
