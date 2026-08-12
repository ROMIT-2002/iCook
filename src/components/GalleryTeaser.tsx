import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Camera } from 'lucide-react';
import { PLATES, GALLERY_META } from '../data/gallery';
import { RouteLink, ROUTES } from '../lib/navigation';

// A handful of plates, fanned out like prints left on the table.
const FAN = [
  { plate: PLATES[0], tilt: '-rotate-6', lift: 'sm:mt-6' },
  { plate: PLATES[2], tilt: 'rotate-3', lift: 'sm:mt-0' },
  { plate: PLATES[6], tilt: '-rotate-2', lift: 'sm:mt-8' },
  { plate: PLATES[10], tilt: 'rotate-6', lift: 'sm:mt-2' }
];

export const GalleryTeaser: React.FC = () => {
  return (
    <section
      id="gallery-teaser"
      className="relative py-24 sm:py-28 px-6 sm:px-8 bg-[#11100E] border-t border-[#AA8654]/25 overflow-hidden"
    >
      {/* Ambient brass wash */}
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 w-[700px] h-[700px] bg-[#AA8654]/10 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-40 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-3 mb-5">
              <Camera className="w-3.5 h-3.5 text-[#AA8654]" />
              <span className="text-[10px] font-sans tracking-wide-editorial text-[#AA8654] uppercase font-semibold">
                The Gallery
              </span>
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl text-[#F3EBDD] font-normal leading-tight mb-4">
              Fourteen frames{' '}
              <span className="italic font-light text-[#C7AA7A] block sm:inline">from the table</span>
            </h2>

            <p className="text-sm sm:text-base font-sans text-[#A79C8C] leading-relaxed font-light mb-8">
              The queue, the plates, the lemonade, and the one group photograph that got everybody
              in. Presented full-frame, in sequence.
            </p>

            <RouteLink
              to={ROUTES.gallery}
              className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#AA8654] hover:bg-[#c49d63] text-[#11100E] font-sans text-xs tracking-aristocrat font-semibold transition-all duration-300 shadow-xl hover:shadow-[0_0_25px_rgba(170,134,84,0.45)]"
            >
              <span>ENTER THE GALLERY</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </RouteLink>

            <p className="text-[10px] font-sans tracking-widest text-[#A79C8C]/70 uppercase mt-5 tabular-nums">
              {GALLERY_META.plateCount} plates · {GALLERY_META.eventDate}
            </p>
          </motion.div>

          {/* Fanned prints */}
          <RouteLink
            to={ROUTES.gallery}
            aria-label="Enter the gallery"
            className="lg:col-span-7 group/fan block"
          >
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              {FAN.map(({ plate, tilt, lift }, index) => (
                <motion.span
                  key={plate.id}
                  initial={{ opacity: 0, y: 34, rotate: 0 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.75, delay: 0.12 * index, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative block w-1/4 shrink-0 overflow-hidden aspect-[3/4] border border-[#AA8654]/30 bg-[#211A16] shadow-[0_18px_45px_-15px_rgba(0,0,0,0.85)] transition-all duration-500 ${tilt} ${lift} group-hover/fan:rotate-0 group-hover/fan:border-[#AA8654]/70`}
                >
                  <img
                    src={plate.thumb}
                    alt={plate.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center brightness-[0.85] transition-all duration-700 group-hover/fan:brightness-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-[#11100E]/85 via-transparent to-transparent" />
                  <span className="absolute inset-2 border border-[#F3EBDD]/10" />
                </motion.span>
              ))}
            </div>
          </RouteLink>
        </div>
      </div>
    </section>
  );
};
