import { z } from 'zod';
import twilio from 'twilio';

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

    const formattedMessage =
`🍽️ NEW POTLUCK RESERVATION

Guest: ${name}
Party: ${partySize}
Dietary note: ${dietaryNote && dietaryNote.trim() ? dietaryNote.trim() : 'None'}
Message: ${message && message.trim() ? message.trim() : 'None'}

Event: The Potluck Society
Date: August 12, 2026

Reservation received:
${timestampLA}`;

    // Always log the reservation so it is never lost, even if Twilio fails.
    console.log('[RESERVATION]', JSON.stringify({ name, partySize, dietaryNote, message, timestampLA }));

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';
    const toNumber = process.env.RESERVATION_WHATSAPP_TO || 'whatsapp:+13464558004';
    const contentSid = process.env.TWILIO_CONTENT_SID;

    // `notified` tells you whether WhatsApp actually went out, without leaking
    // internal errors to the guest.
    let notified = false;
    let notifyError: string | null = null;

    if (!accountSid || !authToken || accountSid.includes('xxxx')) {
      notifyError = 'Twilio credentials are not configured in the environment.';
      console.warn('[RESERVATION] ' + notifyError);
    } else {
      try {
        const client = twilio(accountSid, authToken);

        const messagePayload: any = { from: fromNumber, to: toNumber };

        if (contentSid) {
          messagePayload.contentSid = contentSid;
          messagePayload.contentVariables = JSON.stringify({
            1: name,
            2: partySize,
            3: dietaryNote || 'None',
            4: message || 'None'
          });
        } else {
          messagePayload.body = formattedMessage;
        }

        const twilioRes = await client.messages.create(messagePayload);
        notified = true;
        console.log(`[TWILIO SUCCESS] SID ${twilioRes.sid} -> ${toNumber}`);
      } catch (twilioErr: any) {
        notifyError = twilioErr?.message || String(twilioErr);
        console.error(`[TWILIO ERROR] code=${twilioErr?.code} status=${twilioErr?.status} ${notifyError}`);
      }
    }

    // The guest's reservation is recorded regardless of notification delivery.
    return res.status(200).json({
      success: true,
      message: 'Reservation confirmed for August 12, 2026',
      notified,
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
