import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { z } from 'zod';

const reservationFormSchema = z.object({
  name: z.string().min(2, 'Please enter your full name (at least 2 characters)').max(80, 'Name cannot exceed 80 characters'),
  partySize: z.string().min(1, 'Please select your party size'),
  dietaryNote: z.string().max(300, 'Dietary note must be under 300 characters').optional(),
  message: z.string().max(500, 'Message must be under 500 characters').optional(),
  website_url: z.string().optional() // Honeypot
});

type ReservationFormData = z.infer<typeof reservationFormSchema>;

export const ReservationSection: React.FC = () => {
  const [formData, setFormData] = useState<ReservationFormData>({
    name: '',
    partySize: '1',
    dietaryNote: '',
    message: '',
    website_url: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear field error on edit
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate schema
    const result = reservationFormSchema.safeParse(formData);
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

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(resData.error || "We couldn't complete the reservation. Please try again.");
      }
    } catch (err) {
      console.error('[RESERVATION SUBMIT ERROR]', err);
      setStatus('error');
      setErrorMessage("We couldn't complete the reservation. Please try again.");
    }
  };

  return (
    <section id="reservations" className="py-28 px-6 sm:px-8 bg-[#401D20] text-[#F3EBDD] relative overflow-hidden border-t border-[#AA8654]/30">
      {/* Ambient Candlelight Glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#AA8654]/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-sans tracking-wide-editorial text-[#AA8654] uppercase block mb-3">
            YOUR PLACE AT THE TABLE
          </span>
          <h2 className="font-serif text-4xl sm:text-6xl text-[#F3EBDD] font-normal mb-4">
            Reserve Your Place
          </h2>
          <p className="font-serif italic text-lg sm:text-xl text-[#E5D8C5]/90 font-light">
            Join us at the table on August 12, 2026.
          </p>
        </div>

        {/* Card Window */}
        <div className="bg-[#11100E]/90 backdrop-blur-xl border border-[#AA8654]/40 p-8 sm:p-14 shadow-2xl relative">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="py-12 text-center space-y-6"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-[#AA8654]/20 border border-[#AA8654] flex items-center justify-center text-[#AA8654]">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-4xl text-[#F3EBDD]">
                  Your place is reserved.
                </h3>
                <p className="font-serif italic text-xl text-[#E5D8C5]/90">
                  We'll see you at the table on August 12, 2026.
                </p>
                <div className="pt-6 border-t border-[#AA8654]/20 max-w-sm mx-auto text-xs font-sans text-[#A79C8C] space-y-2">
                  <p>Confirmation dispatched via WhatsApp notification service.</p>
                  <p className="text-[#AA8654] uppercase tracking-widest font-medium">iCook · The Potluck Society</p>
                </div>
              </motion.div>
            ) : (
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-sans tracking-widest text-[#AA8654] uppercase block">
                      FULL NAME *
                    </label>
                    <input
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
                  </div>

                  {/* Party Size */}
                  <div className="space-y-2">
                    <label className="text-xs font-sans tracking-widest text-[#AA8654] uppercase block">
                      PARTY SIZE *
                    </label>
                    <select
                      name="partySize"
                      value={formData.partySize}
                      onChange={handleChange}
                      disabled={status === 'submitting'}
                      className="luxury-input bg-[#11100E] text-[#F3EBDD] cursor-pointer"
                    >
                      <option value="1">1 Guest (Single Seat)</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4+">4+ Guests (Group Table)</option>
                    </select>
                  </div>
                </div>

                {/* Event Date (Fixed Display) */}
                <div className="p-4 bg-[#211A16]/80 border border-[#AA8654]/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#AA8654]" />
                    <div>
                      <div className="text-xs font-sans tracking-widest text-[#AA8654] uppercase">EVENT DATE</div>
                      <div className="font-serif text-lg text-[#F3EBDD]">August 12, 2026</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-sans tracking-widest text-[#A79C8C] uppercase border border-[#AA8654]/30 px-3 py-1">
                    FIXED PRIVATE SESSION
                  </span>
                </div>

                {/* Dietary Notes */}
                <div className="space-y-2">
                  <label className="text-xs font-sans tracking-widest text-[#AA8654] uppercase block">
                    DIETARY NOTES / ALLERGY DISCLOSURES (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    name="dietaryNote"
                    value={formData.dietaryNote}
                    onChange={handleChange}
                    placeholder="e.g. Nut allergy, Gluten sensitive, Vegetarian preference"
                    disabled={status === 'submitting'}
                    className="luxury-input"
                  />
                  {errors.dietaryNote && (
                    <p className="text-xs text-[#E5D8C5] bg-[#401D20] px-2 py-1 border border-[#AA8654]/40 mt-1">
                      {errors.dietaryNote}
                    </p>
                  )}
                </div>

                {/* Message to Host */}
                <div className="space-y-2">
                  <label className="text-xs font-sans tracking-widest text-[#AA8654] uppercase block">
                    NOTE FOR THE TABLE (OPTIONAL)
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Share any special notes or dish suggestions for the host..."
                    disabled={status === 'submitting'}
                    className="luxury-input resize-none"
                  />
                  {errors.message && (
                    <p className="text-xs text-[#E5D8C5] bg-[#401D20] px-2 py-1 border border-[#AA8654]/40 mt-1">
                      {errors.message}
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
                      <span>RESERVING...</span>
                    </>
                  ) : (
                    <span>RESERVE MY PLACE</span>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
