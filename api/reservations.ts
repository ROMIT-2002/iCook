import { createHash } from 'crypto';
import { z } from 'zod';
import twilio from 'twilio';

// Short, non-reversible fingerprint so configuration can be verified without
// exposing phone numbers or credentials on a public endpoint.
const fingerprint = (v: string | undefined) =>
  v ? createHash('sha256').update(v).digest('hex').slice(0, 8) : 'unset';

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

    // Notifications go out over SMS, not WhatsApp. WhatsApp requires an opt-in
    // that expires every 24 hours, which silently drops reservations that
    // arrive outside the window. SMS has no such restriction.
    //
    // The numbers are read from the existing WhatsApp variables so no
    // environment changes are needed; the "whatsapp:" prefix is stripped.
    const stripChannel = (v: string | undefined) => (v || '').trim().replace(/^whatsapp:\s*/i, '');
    const smsFrom = stripChannel(process.env.TWILIO_SMS_FROM || process.env.TWILIO_WHATSAPP_FROM);
    const smsTo = stripChannel(process.env.RESERVATION_SMS_TO || process.env.RESERVATION_WHATSAPP_TO) || '+13464558004';

    let notified = false;
    let notifyError: string | null = null;
    // Non-sensitive reason code so delivery failures are diagnosable from the
    // response alone. Never contains credentials or phone numbers.
    let reason: string | null = null;

    if (!accountSid || !authToken || accountSid.includes('xxxx')) {
      reason = !accountSid && !authToken
        ? 'credentials_missing_both'
        : (!accountSid ? 'credentials_missing_account_sid' : (!authToken ? 'credentials_missing_auth_token' : 'credentials_placeholder'));
      notifyError = 'Twilio credentials are not configured in the environment.';
      console.warn(`[RESERVATION] ${notifyError} (${reason})`);
    } else if (!accountSid.startsWith('AC')) {
      // An API Key SID (SK...) is a common mix-up and cannot authenticate here.
      reason = `account_sid_wrong_prefix_${accountSid.slice(0, 2)}`;
      notifyError = 'TWILIO_ACCOUNT_SID must be the Account SID beginning with AC.';
      console.error(`[RESERVATION] ${notifyError} (got prefix ${accountSid.slice(0, 2)})`);
    } else if (!smsFrom.startsWith('+') || !smsTo.startsWith('+')) {
      reason = 'numbers_not_e164';
      notifyError = 'Sender and recipient must be E.164 numbers, e.g. +13464558004.';
      console.error('[RESERVATION] ' + notifyError);
    } else {
      try {
        const client = twilio(accountSid, authToken);
        const twilioRes = await client.messages.create({
          from: smsFrom,
          to: smsTo,
          body: formattedMessage
        });
        notified = true;
        console.log(`[TWILIO SUCCESS] SMS ${twilioRes.sid}`);
      } catch (twilioErr: any) {
        notifyError = twilioErr?.message || String(twilioErr);
        reason = twilioErr?.code ? `twilio_${twilioErr.code}` : 'twilio_error';
        console.error(`[TWILIO ERROR] code=${twilioErr?.code} status=${twilioErr?.status} ${notifyError}`);
      }
    }

    // The guest's reservation is recorded regardless of notification delivery.
    return res.status(200).json({
      success: true,
      message: 'Reservation confirmed for August 12, 2026',
      notified,
      ...(notified
        ? {}
        : {
            reason,
            // Which revision is actually serving, and which send path it took.
            // The repo is public, so the commit SHA is not sensitive.
            build: (process.env.VERCEL_GIT_COMMIT_SHA || 'local').slice(0, 7),
            channel: 'sms',
            fromFp: fingerprint(smsFrom),
            toFp: fingerprint(smsTo)
          }),
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
