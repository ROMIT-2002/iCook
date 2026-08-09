import { Handler } from '@netlify/functions';
import { z } from 'zod';
import twilio from 'twilio';

const reservationSchema = z.object({
  name: z.string().min(2).max(80),
  partySize: z.string().min(1),
  dietaryNote: z.string().max(300).optional().or(z.literal('')),
  message: z.string().max(500).optional().or(z.literal('')),
  website_url: z.string().optional()
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const parseResult = reservationSchema.safeParse(body);

    if (!parseResult.success) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: 'Validation failed',
          details: parseResult.error.errors
        })
      };
    }

    const { name, partySize, dietaryNote, message, website_url } = parseResult.data;

    // Anti-bot Honeypot check
    if (website_url && website_url.trim() !== '') {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: 'Reservation received' })
      };
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

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';
    const toNumber = process.env.RESERVATION_WHATSAPP_TO || 'whatsapp:+13465668004';
    const contentSid = process.env.TWILIO_CONTENT_SID;

    if (accountSid && authToken && !accountSid.includes('xxxx')) {
      const client = twilio(accountSid, authToken);

      const messageOptions: any = {
        from: fromNumber,
        to: toNumber
      };

      if (contentSid) {
        messageOptions.contentSid = contentSid;
        messageOptions.contentVariables = JSON.stringify({
          1: name,
          2: partySize,
          3: dietaryNote || 'None',
          4: message || 'None'
        });
      } else {
        messageOptions.body = formattedMessage;
      }

      await client.messages.create(messageOptions);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Reservation confirmed for August 12, 2026',
        data: { name, partySize, timestamp: timestampLA }
      })
    };
  } catch (err: any) {
    console.error('[NETLIFY RESERVATION ERROR]', err?.message || err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: 'We couldn’t complete the reservation. Please try again.'
      })
    };
  }
};
