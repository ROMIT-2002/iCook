const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { z } = require('zod');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const reservationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80, 'Name max 80 characters'),
  partySize: z.string().min(1, 'Party size required'),
  dietaryNote: z.string().max(300, 'Dietary note max 300 characters').optional().or(z.literal('')),
  message: z.string().max(500, 'Message max 500 characters').optional().or(z.literal('')),
  website_url: z.string().optional() // Honeypot field
});

app.post('/api/reservations', async (req, res) => {
  try {
    const parseResult = reservationSchema.safeParse(req.body);
    
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

    // Format LA Timestamp
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

    console.log('\n--- NEW RESERVATION RECEIVED ---');
    console.log(formattedMessage);
    console.log('--------------------------------\n');

    // Send Twilio WhatsApp if credentials exist
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';
    const toNumber = process.env.RESERVATION_WHATSAPP_TO || 'whatsapp:+13464558004';
    // Ignore a placeholder Content SID; sending contentVariables without a
    // valid contentSid fails with Twilio error 21654.
    const rawContentSid = process.env.TWILIO_CONTENT_SID && process.env.TWILIO_CONTENT_SID.trim();
    const contentSid =
      rawContentSid && rawContentSid.startsWith('HX') && !rawContentSid.toLowerCase().includes('xxxx')
        ? rawContentSid
        : undefined;

    if (accountSid && authToken && !accountSid.includes('xxxx')) {
      try {
        const twilio = require('twilio');
        const client = twilio(accountSid, authToken);

        let messagePayload = {
          from: fromNumber,
          to: toNumber
        };

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
        console.log(`[TWILIO SUCCESS] Message SID: ${twilioRes.sid}`);
      } catch (twilioErr) {
        console.error('[TWILIO ERROR]', twilioErr.message);
        // We log the error but still return success to guest after internal logging, or log diagnostic warning
      }
    } else {
      console.log('[DEV MODE] Twilio credentials not active in environment. Notification logged to server console.');
    }

    return res.status(200).json({
      success: true,
      message: 'Reservation confirmed for August 12, 2026',
      data: { name, partySize, timestamp: timestampLA }
    });

  } catch (err) {
    console.error('[SERVER ERROR]', err);
    return res.status(500).json({
      success: false,
      error: 'We couldn’t complete the reservation. Please try again.'
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`[iCook API] Backend running on http://localhost:${PORT}`);
});
