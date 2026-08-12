import { z } from 'zod';

const ratingSchema = z.number().int().min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5');

const feedbackSchema = z.object({
  attribution: z.enum(['named', 'anonymous']),
  name: z.string().max(80, 'Name max 80 characters').optional().or(z.literal('')),
  decorations: ratingSchema,
  eventPlanning: ratingSchema,
  foodQuality: ratingSchema,
  foodDiversity: ratingSchema,
  comments: z.string().max(800, 'Comments max 800 characters').optional().or(z.literal('')),
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
    const parseResult = feedbackSchema.safeParse(body);

    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: parseResult.error.errors
      });
    }

    const {
      attribution,
      name,
      decorations,
      eventPlanning,
      foodQuality,
      foodDiversity,
      comments,
      website_url
    } = parseResult.data;

    // Honeypot anti-bot check
    if (website_url && website_url.trim() !== '') {
      console.warn('[FEEDBACK] Honeypot triggered by bot submission.');
      return res.status(200).json({ success: true, message: 'Feedback received' });
    }

    const guest = attribution === 'anonymous' ? 'Anonymous Guest' : (name || '').trim() || 'Unnamed Guest';
    const scores = [decorations, eventPlanning, foodQuality, foodDiversity];
    const average = (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1);

    const timestampLA = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Los_Angeles',
      dateStyle: 'full',
      timeStyle: 'medium'
    }).format(new Date());

    // Logged before sending so feedback is never lost to a relay outage.
    // Recoverable from the Vercel runtime logs if email delivery ever fails.
    console.log(
      '[FEEDBACK]',
      JSON.stringify({
        guest,
        attribution,
        decorations,
        eventPlanning,
        foodQuality,
        foodDiversity,
        average,
        comments,
        timestampLA
      })
    );

    // The email itself is sent from the browser, because the relay rejects
    // server-side requests. This route exists purely so every submission is
    // also captured in the Vercel runtime logs as a backup record.
    return res.status(200).json({
      success: true,
      message: 'Feedback recorded for The Potluck Society',
      logged: true,
      data: { guest, average, timestamp: timestampLA }
    });
  } catch (err: any) {
    console.error('[SERVER ERROR]', err?.message || err);
    return res.status(500).json({
      success: false,
      error: 'We couldn’t submit your feedback. Please try again.'
    });
  }
}
