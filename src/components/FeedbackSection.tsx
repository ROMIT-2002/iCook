import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Loader2, Sparkles } from 'lucide-react';
import { z } from 'zod';
import { StarRating, SCORE_WORDS } from './StarRating';

const RATING_FIELDS = [
  { key: 'decorations', label: 'DECORATIONS', emailLabel: 'Decorations' },
  { key: 'eventPlanning', label: 'EVENT PLANNING', emailLabel: 'Event Planning' },
  { key: 'foodQuality', label: 'FOOD QUALITY', emailLabel: 'Food Quality' },
  { key: 'foodDiversity', label: 'FOOD DIVERSITY', emailLabel: 'Food Diversity' }
] as const;

type RatingKey = (typeof RATING_FIELDS)[number]['key'];

const COMMENTS_LIMIT = 800;

const ratingSchema = z
  .number()
  .int()
  .min(1, 'Please select a rating from one to five stars')
  .max(5);

const feedbackFormSchema = z
  .object({
    attribution: z.enum(['named', 'anonymous']),
    name: z.string().max(80, 'Name cannot exceed 80 characters'),
    decorations: ratingSchema,
    eventPlanning: ratingSchema,
    foodQuality: ratingSchema,
    foodDiversity: ratingSchema,
    comments: z.string().max(COMMENTS_LIMIT, `Comments must be under ${COMMENTS_LIMIT} characters`),
    website_url: z.string().optional() // Honeypot
  })
  .superRefine((data, ctx) => {
    if (data.attribution === 'named' && data.name.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['name'],
        message: 'Please enter your name, or choose to stay anonymous'
      });
    }
  });

type FeedbackFormData = z.infer<typeof feedbackFormSchema>;

// Feedback is emailed through FormSubmit, which requires no account or API key.
// It only accepts browser-originated requests, so this is called from the
// client rather than from the API route, the same relay the RSVP form used.
const FEEDBACK_RELAY_ENDPOINT = 'https://formsubmit.co/ajax/romit.chakraborty2002@gmail.com';

// e.g. 4 -> "★★★★☆ · 4/5 · Refined"
const formatScore = (score: number): string =>
  `${'★'.repeat(score)}${'☆'.repeat(5 - score)} · ${score}/5 · ${SCORE_WORDS[score]}`;

export const FeedbackSection: React.FC = () => {
  const [formData, setFormData] = useState<FeedbackFormData>({
    attribution: 'named',
    name: '',
    decorations: 0,
    eventPlanning: 0,
    foodQuality: 0,
    foodDiversity: 0,
    comments: '',
    website_url: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    clearError(e.target.name);
  };

  const handleRatingChange = (key: RatingKey, value: number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    clearError(key);
  };

  // Switching to anonymous drops any name already typed, so it never reaches
  // the relay or the server log.
  const handleAttributionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const attribution = e.target.value as FeedbackFormData['attribution'];
    setFormData((prev) => ({
      ...prev,
      attribution,
      name: attribution === 'anonymous' ? '' : prev.name
    }));
    setErrors((prev) => ({ ...prev, name: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate schema
    const result = feedbackFormSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    const isAnonymous = formData.attribution === 'anonymous';
    const guestName = isAnonymous ? 'Anonymous Guest' : formData.name.trim();
    const scores = RATING_FIELDS.map((field) => formData[field.key]);
    const average = (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1);

    // The email relay only accepts browser-originated requests, so the
    // notification is sent from here rather than from the API route.
    try {
      // Also record the feedback server-side so it survives in the logs even if
      // the mail relay is unavailable. Failures here are not fatal.
      fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      }).catch(() => undefined);

      const response = await fetch(FEEDBACK_RELAY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `Potluck Feedback: ${guestName} (${average}/5)`,
          _template: 'table',
          _captcha: 'false',
          Guest: guestName,
          Attribution: isAnonymous ? 'Anonymous' : 'Named',
          ...RATING_FIELDS.reduce<Record<string, string>>((acc, field) => {
            acc[field.emailLabel] = formatScore(formData[field.key]);
            return acc;
          }, {}),
          'Overall average': `${average} / 5`,
          Comments: formData.comments.trim() || 'None',
          Event: 'The Potluck Society, August 12, 2026'
        })
      });

      // The relay answers 200 even when it refuses to send, signalling the
      // real outcome with a "success" field that is the string "true".
      const resData = await response.json().catch(() => ({}));

      if (response.ok && String(resData.success) === 'true') {
        setStatus('success');
      } else {
        console.error('[FEEDBACK RELAY]', response.status, resData);
        setStatus('error');
        setErrorMessage("We couldn't submit your feedback. Please try again.");
      }
    } catch (err) {
      console.error('[FEEDBACK SUBMIT ERROR]', err);
      setStatus('error');
      setErrorMessage("We couldn't submit your feedback. Please try again.");
    }
  };

  return (
    <>
      {/* Preserves links shared while the RSVP form was live */}
      <span id="reservations" aria-hidden="true" />

      <section
        id="feedback"
        className="py-28 px-6 sm:px-8 bg-[#401D20] text-[#F3EBDD] relative overflow-hidden border-t border-[#AA8654]/30"
      >
        {/* Ambient Candlelight Glow */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#AA8654]/15 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-sans tracking-wide-editorial text-[#AA8654] uppercase block mb-6">
              AUGUST 12, 2026 · SERVICE CONCLUDED
            </span>

            {/* Brass Medallion Seal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="w-20 h-20 mx-auto mb-7 rounded-full bg-[#11100E]/70 border border-[#AA8654] shadow-[0_0_35px_rgba(170,134,84,0.35)] flex items-center justify-center relative"
            >
              <span className="absolute inset-1.5 rounded-full border border-[#AA8654]/35 pointer-events-none" />
              <CheckCircle2 className="w-9 h-9 text-[#AA8654]" strokeWidth={1.25} />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="font-serif text-4xl sm:text-6xl text-[#F3EBDD] font-normal mb-5 leading-tight"
            >
              Event <span className="italic font-light text-[#C7AA7A]">Successful</span>
            </motion.h2>

            {/* Episode 2.0 Seal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="inline-flex items-center gap-3 px-5 py-2 mb-8 rounded-full border border-[#AA8654]/40 bg-[#11100E]/50 backdrop-blur-md shadow-brass"
            >
              <span className="w-2 h-2 rounded-full bg-[#AA8654] animate-pulse" />
              <span className="font-serif italic text-base sm:text-lg text-[#E5D8C5]">
                Potluck Society ep 2.0 coming soon…
              </span>
              <Sparkles className="w-3.5 h-3.5 text-[#AA8654]" />
            </motion.div>

            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="w-10 h-[1px] bg-[#AA8654]/40" />
              <Sparkles className="w-3.5 h-3.5 text-[#AA8654]/60" />
              <span className="w-10 h-[1px] bg-[#AA8654]/40" />
            </div>

            <p className="text-sm sm:text-base font-sans text-[#E5D8C5]/80 leading-relaxed font-light">
              Before we begin plotting the next table, tell us how this one tasted. Your notes shape
              what ep 2.0 becomes.
            </p>
          </div>

          {/* Card Window */}
          <div className="bg-[#11100E]/90 backdrop-blur-xl border border-[#AA8654]/40 p-8 sm:p-14 shadow-2xl relative">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="py-12 text-center space-y-6"
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#AA8654]/20 border border-[#AA8654] flex items-center justify-center text-[#AA8654]">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="font-serif text-4xl text-[#F3EBDD]">Your notes are received.</h3>
                  <p className="font-serif italic text-xl text-[#E5D8C5]/90">
                    Thank you for dining with us. We'll see you at ep 2.0.
                  </p>
                  <div className="pt-6 border-t border-[#AA8654]/20 max-w-sm mx-auto text-xs font-sans text-[#A79C8C] space-y-2">
                    <p>Your feedback has been dispatched to the host.</p>
                    <p className="text-[#AA8654] uppercase tracking-widest font-medium">
                      iCook · The Potluck Society
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  className="space-y-10"
                >
                  {/* Anti-Bot Honeypot Field */}
                  <input
                    type="text"
                    name="website_url"
                    value={formData.website_url}
                    onChange={handleChange}
                    tabIndex={-1}
                    className="hidden"
                    aria-hidden="true"
                  />

                  {/* Card Heading */}
                  <div className="text-center pb-8 border-b border-[#AA8654]/20">
                    <span className="text-[10px] font-sans tracking-wide-editorial text-[#AA8654] uppercase block mb-2">
                      THE GUEST BOOK
                    </span>
                    <h3 className="font-serif text-3xl sm:text-4xl text-[#F3EBDD]">
                      Leave Your Verdict
                    </h3>
                  </div>

                  {/* Attribution */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label
                        htmlFor="attribution"
                        className="text-xs font-sans tracking-widest text-[#AA8654] uppercase block"
                      >
                        SIGN YOUR NOTES *
                      </label>
                      <select
                        id="attribution"
                        name="attribution"
                        value={formData.attribution}
                        onChange={handleAttributionChange}
                        disabled={status === 'submitting'}
                        className="luxury-input bg-[#11100E] text-[#F3EBDD] cursor-pointer"
                      >
                        <option value="named">Share my name</option>
                        <option value="anonymous">Keep me anonymous</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <AnimatePresence mode="wait" initial={false}>
                        {formData.attribution === 'named' ? (
                          <motion.div
                            key="named"
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-2"
                          >
                            <label
                              htmlFor="name"
                              className="text-xs font-sans tracking-widest text-[#AA8654] uppercase block"
                            >
                              FULL NAME *
                            </label>
                            <input
                              id="name"
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="e.g. Romit Chakraborty"
                              disabled={status === 'submitting'}
                              className="luxury-input"
                            />
                            {errors.name && (
                              <p className="text-xs text-[#E5D8C5] bg-[#401D20] px-2 py-1 border border-[#AA8654]/40 mt-1">
                                {errors.name}
                              </p>
                            )}
                          </motion.div>
                        ) : (
                          <motion.div
                            key="anonymous"
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-2"
                          >
                            <span className="text-xs font-sans tracking-widest text-[#AA8654] uppercase block">
                              ATTRIBUTION
                            </span>
                            <p className="font-serif italic text-base text-[#E5D8C5]/80 border-b border-[#AA8654]/30 py-[0.85rem]">
                              Your verdict will arrive unsigned.
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Ratings */}
                  <div className="space-y-7 pt-2">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-sans tracking-wide-editorial text-[#AA8654] uppercase shrink-0">
                        THE RATINGS
                      </span>
                      <span className="flex-grow h-[1px] bg-[#AA8654]/20" />
                    </div>

                    {RATING_FIELDS.map((field) => (
                      <StarRating
                        key={field.key}
                        label={field.label}
                        value={formData[field.key]}
                        onChange={(value) => handleRatingChange(field.key, value)}
                        disabled={status === 'submitting'}
                        error={errors[field.key]}
                      />
                    ))}
                  </div>

                  {/* Additional Comments */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-baseline justify-between gap-4">
                      <label
                        htmlFor="comments"
                        className="text-xs font-sans tracking-widest text-[#AA8654] uppercase block"
                      >
                        ADDITIONAL COMMENTS (OPTIONAL)
                      </label>
                      <span className="text-[10px] font-sans text-[#A79C8C] tabular-nums shrink-0">
                        {formData.comments.length}/{COMMENTS_LIMIT}
                      </span>
                    </div>
                    <textarea
                      id="comments"
                      name="comments"
                      rows={4}
                      value={formData.comments}
                      onChange={handleChange}
                      placeholder="The standout dish, what you'd change, what ep 2.0 must include..."
                      disabled={status === 'submitting'}
                      className="luxury-input resize-none"
                    />
                    {errors.comments && (
                      <p className="text-xs text-[#E5D8C5] bg-[#401D20] px-2 py-1 border border-[#AA8654]/40 mt-1">
                        {errors.comments}
                      </p>
                    )}
                  </div>

                  {/* Inline Server Error Message */}
                  {status === 'error' && (
                    <div className="p-4 bg-[#401D20] border border-[#AA8654] flex items-center gap-3 text-xs text-[#F3EBDD]">
                      <AlertTriangle className="w-5 h-5 text-[#AA8654] shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full py-4 bg-[#AA8654] hover:bg-[#c49d63] disabled:bg-[#AA8654]/50 text-[#11100E] font-sans text-xs tracking-aristocrat font-semibold transition-all duration-300 shadow-xl hover:shadow-[0_0_25px_rgba(170,134,84,0.4)] flex items-center justify-center gap-3"
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>SENDING...</span>
                      </>
                    ) : (
                      <span>SUBMIT MY FEEDBACK</span>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
};
