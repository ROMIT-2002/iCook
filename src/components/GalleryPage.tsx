import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowLeft, Maximize2, Sparkles } from 'lucide-react';
import {
  Plate,
  HERO_PLATE,
  MOSAIC_ONE,
  MOSAIC_TWO,
  FEATURE_PLATE,
  CONCLUSION_PLATE,
  PLATES,
  GALLERY_META,
  numeralFor
} from '../data/gallery';
import { Lightbox } from './Lightbox';
import { RouteLink, ROUTES } from '../lib/navigation';

const EASE_LUXE = [0.16, 1, 0.3, 1] as const;

interface PlateTileProps {
  plate: Plate;
  onOpen: () => void;
}

const PlateTile: React.FC<PlateTileProps> = ({ plate, onOpen }) => (
  <motion.button
    type="button"
    onClick={onOpen}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.8, ease: EASE_LUXE }}
    aria-label={`Open plate ${numeralFor(plate.id)}: ${plate.title}`}
    className={`group relative block w-full self-start overflow-hidden aspect-[3/4] border border-[#AA8654]/25 hover:border-[#AA8654]/70 bg-[#211A16] shadow-xl transition-all duration-500 hover:shadow-[0_20px_55px_-12px_rgba(170,134,84,0.35)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C7AA7A] ${plate.tileClass ?? ''}`}
  >
    <img
      src={plate.thumb}
      alt={plate.caption}
      loading="lazy"
      decoding="async"
      className="w-full h-full object-cover object-center brightness-[0.9] transition-all duration-[1400ms] ease-out group-hover:scale-[1.06] group-hover:brightness-105"
    />

    {/* Vignette so the caption always has something to sit on */}
    <span className="absolute inset-0 bg-gradient-to-t from-[#11100E] via-[#11100E]/15 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-500 pointer-events-none" />

    {/* Inset hairline, brass on hover */}
    <span className="absolute inset-3 border border-[#F3EBDD]/10 group-hover:border-[#AA8654]/45 transition-colors duration-500 pointer-events-none" />

    {/* Plate numeral */}
    <span className="absolute top-5 left-5 font-serif text-xl text-[#C7AA7A] leading-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] pointer-events-none">
      {numeralFor(plate.id)}
    </span>

    {/* Expand affordance */}
    <span className="absolute top-4 right-4 p-2 rounded-full border border-[#AA8654]/0 group-hover:border-[#AA8654]/50 bg-[#11100E]/0 group-hover:bg-[#11100E]/70 text-[#AA8654] opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
      <Maximize2 className="w-3.5 h-3.5" />
    </span>

    {/* Caption */}
    <span className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-left pointer-events-none">
      <span className="block text-[9px] font-sans tracking-wide-editorial text-[#AA8654] uppercase mb-1.5 opacity-70">
        Plate {numeralFor(plate.id)}
      </span>
      <span className="block font-serif text-xl sm:text-2xl text-[#F3EBDD] leading-tight">
        {plate.title}
      </span>
      <span className="block font-serif italic text-xs sm:text-sm text-[#E5D8C5]/85 font-light max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100 group-hover:mt-2 transition-all duration-500 overflow-hidden">
        {plate.caption}
      </span>
    </span>
  </motion.button>
);

const MovementHeading: React.FC<{ label: string; title: string }> = ({ label, title }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7, ease: EASE_LUXE }}
    className="flex items-baseline gap-5 mb-12 sm:mb-16"
  >
    <span className="text-[10px] font-sans tracking-wide-editorial text-[#AA8654] uppercase shrink-0">
      {label}
    </span>
    <span className="leader-dots" aria-hidden="true" />
    <h2 className="font-serif italic text-2xl sm:text-3xl text-[#E5D8C5]/90 font-light shrink-0">
      {title}
    </h2>
  </motion.div>
);

export const GalleryPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const openPlate = (plate: Plate) => {
    setOpenIndex(PLATES.findIndex((entry) => entry.id === plate.id));
  };

  return (
    <div className="min-h-screen bg-[#11100E] text-[#F3EBDD] font-sans selection:bg-[#AA8654] selection:text-[#11100E]">
      {/* Slim gallery header: the marketing nav gives way to a single way back */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#11100E]/85 backdrop-blur-md border-b border-[#AA8654]/20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3 flex items-center justify-between gap-4">
          <RouteLink
            to={ROUTES.home}
            className="flex items-center gap-3 group shrink-0"
            aria-label="Return to The Potluck Society"
          >
            <span className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#211A16] border border-[#AA8654]/70 group-hover:border-[#AA8654] transition-colors p-1 flex items-center justify-center overflow-hidden shrink-0">
              <img
                src="/iCook.png"
                alt="iCook"
                className="w-full h-full object-contain scale-125 filter brightness-[2.8] contrast-[1.3] sepia-[0.5] drop-shadow-[0_0_8px_rgba(170,134,84,0.6)]"
              />
            </span>
            <span className="hidden sm:block">
              <span className="block font-serif text-xl text-[#F3EBDD] group-hover:text-[#AA8654] transition-colors leading-none">
                iCook
              </span>
              <span className="block text-[9px] tracking-widest text-[#AA8654] uppercase font-sans font-semibold mt-1">
                The Potluck Society
              </span>
            </span>
          </RouteLink>

          <span className="text-[10px] sm:text-xs font-sans tracking-wide-editorial text-[#AA8654] uppercase">
            Gallery
          </span>

          <RouteLink
            to={ROUTES.home}
            className="group flex items-center gap-2 text-[10px] sm:text-[11px] font-sans tracking-widest uppercase text-[#E5D8C5]/80 hover:text-[#AA8654] transition-colors shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="hidden sm:inline">Return to the table</span>
            <span className="sm:hidden">Back</span>
          </RouteLink>
        </div>
      </header>

      {/* === Hero === */}
      <section className="relative h-screen min-h-[620px] flex flex-col justify-between overflow-hidden pt-24 pb-6">
        <div className="absolute inset-0 z-0">
          <motion.img
            src={HERO_PLATE.full}
            alt={HERO_PLATE.caption}
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.4, ease: EASE_LUXE }}
            className="w-full h-full object-cover object-center filter brightness-[0.42] contrast-[1.12]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#11100E] via-[#11100E]/60 to-[#11100E]/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#11100E]/85 via-transparent to-[#11100E]/85" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#11100E_92%)] opacity-85" />
          <div className="absolute inset-0 bg-noise opacity-60" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center justify-center my-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-3 mb-5"
          >
            <span className="w-8 sm:w-12 h-[1px] bg-[#AA8654]/60" />
            <span className="text-[10px] sm:text-xs font-sans tracking-wide-editorial text-[#AA8654] uppercase font-medium">
              The Potluck Society
            </span>
            <span className="w-8 sm:w-12 h-[1px] bg-[#AA8654]/60" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: EASE_LUXE }}
            className="font-serif text-6xl sm:text-8xl md:text-9xl tracking-tight text-[#F3EBDD] font-normal leading-[0.95] mb-4"
          >
            Gallery
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="font-serif italic text-lg sm:text-2xl text-[#E5D8C5]/90 font-light mb-6"
          >
            Fourteen frames from one afternoon
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="inline-flex items-center gap-3 px-5 py-2 mb-8 rounded-full border border-[#AA8654]/35 bg-[#211A16]/60 backdrop-blur-md shadow-brass"
          >
            <span className="w-2 h-2 rounded-full bg-[#AA8654] animate-pulse" />
            <span className="text-[10px] sm:text-xs font-sans tracking-aristocrat text-[#F3EBDD]">
              {GALLERY_META.eventDate}
            </span>
            <span className="text-[#AA8654]/40">•</span>
            <span className="text-[10px] sm:text-xs font-sans text-[#A79C8C] font-light tabular-nums">
              {GALLERY_META.plateCount} PLATES
            </span>
          </motion.div>

          <motion.button
            type="button"
            onClick={() => setOpenIndex(0)}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="group px-7 py-3.5 bg-[#AA8654]/95 hover:bg-[#c49d63] text-[#11100E] font-sans text-xs tracking-aristocrat font-semibold transition-all duration-300 shadow-xl hover:shadow-[0_0_28px_rgba(170,134,84,0.45)] flex items-center justify-center gap-2.5"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>VIEW THE FULL FRAME</span>
          </motion.button>
        </div>

        <motion.a
          href="#movement-one"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="relative z-10 flex flex-col items-center gap-1.5 text-[#A79C8C] hover:text-[#AA8654] transition-colors group mt-auto shrink-0"
        >
          <span className="text-[9px] sm:text-[10px] font-sans tracking-widest uppercase opacity-70 group-hover:opacity-100">
            Begin the sequence
          </span>
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-3.5 h-3.5 text-[#AA8654]" />
          </motion.span>
        </motion.a>
      </section>

      {/* === Movement I === */}
      <section
        id="movement-one"
        className="relative py-24 sm:py-32 px-5 sm:px-8 border-t border-[#AA8654]/25 overflow-hidden"
      >
        <div className="absolute left-0 top-1/4 w-[500px] h-[500px] bg-[#AA8654]/8 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <MovementHeading label="Movement One" title="The table is laid" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-start">
            {MOSAIC_ONE.map((plate) => (
              <PlateTile key={plate.id} plate={plate} onOpen={() => openPlate(plate)} />
            ))}
          </div>
        </div>
      </section>

      {/* === Intermission: the triptych, on aged paper === */}
      <section className="relative py-24 sm:py-32 px-5 sm:px-8 bg-aged-paper border-y border-[#AA8654]/30 overflow-hidden">
        <div className="absolute right-8 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.04]">
          <span className="font-serif text-[20rem] leading-none text-[#211A16] font-extrabold">
            {numeralFor(FEATURE_PLATE.id)}
          </span>
        </div>

        <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE_LUXE }}
            className="lg:col-span-5 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-6 h-[1px] bg-[#AA8654]" />
              <span className="text-[10px] font-sans tracking-wide-editorial text-[#AA8654] uppercase font-semibold">
                Intermission
              </span>
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl text-[#211A16] font-normal leading-tight mb-6">
              “Prepared by the team.{' '}
              <span className="italic text-[#401D20] block sm:inline">
                Served with unreasonable standards.”
              </span>
            </h2>

            <p className="text-sm sm:text-base font-sans text-[#211A16]/75 leading-relaxed font-light mb-8">
              Dessert at one end, mains in the middle, the drinks station holding the far corner.
              Three frames that account for the entire table.
            </p>

            <button
              type="button"
              onClick={() => openPlate(FEATURE_PLATE)}
              className="group inline-flex items-center gap-2.5 px-6 py-3 bg-[#401D20] hover:bg-[#58272b] text-[#F3EBDD] border border-[#AA8654]/40 hover:border-[#AA8654] font-sans text-[11px] tracking-aristocrat font-medium transition-all duration-300"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#AA8654]" />
              <span>EXAMINE PLATE {numeralFor(FEATURE_PLATE.id)}</span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE_LUXE }}
            className="lg:col-span-7"
          >
            <button
              type="button"
              onClick={() => openPlate(FEATURE_PLATE)}
              aria-label={`Open plate ${numeralFor(FEATURE_PLATE.id)}: ${FEATURE_PLATE.title}`}
              className="group relative block w-full max-w-md mx-auto overflow-hidden border border-[#211A16]/25 hover:border-[#AA8654] shadow-[0_25px_60px_-20px_rgba(33,26,22,0.55)] transition-all duration-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#401D20]"
            >
              <img
                src={FEATURE_PLATE.thumb}
                alt={FEATURE_PLATE.caption}
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-contain transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
              />
              <span className="absolute inset-3 border border-[#F3EBDD]/25 group-hover:border-[#AA8654]/60 transition-colors duration-500 pointer-events-none" />
              <span className="absolute top-4 left-4 font-serif text-lg text-[#F3EBDD] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] pointer-events-none">
                {numeralFor(FEATURE_PLATE.id)}
              </span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* === Movement II === */}
      <section className="relative py-24 sm:py-32 px-5 sm:px-8 overflow-hidden">
        <div className="absolute right-0 bottom-1/4 w-[500px] h-[500px] bg-[#AA8654]/8 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <MovementHeading label="Movement Two" title="And then it was eaten" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-start">
            {MOSAIC_TWO.map((plate) => (
              <PlateTile key={plate.id} plate={plate} onOpen={() => openPlate(plate)} />
            ))}
          </div>
        </div>
      </section>

      {/* === Curtain Call: the opening frame, reprised === */}
      <section className="relative py-20 sm:py-28 px-5 sm:px-8 border-t border-[#AA8654]/25 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#AA8654]/10 rounded-full blur-[180px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <MovementHeading label="Curtain Call" title="Where we came in" />

          <motion.button
            type="button"
            onClick={() => openPlate(CONCLUSION_PLATE)}
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: EASE_LUXE }}
            aria-label={`Open plate ${numeralFor(CONCLUSION_PLATE.id)}: ${CONCLUSION_PLATE.title}`}
            className="group relative block w-full overflow-hidden border border-[#AA8654]/30 hover:border-[#AA8654]/80 bg-[#211A16] shadow-2xl transition-all duration-500 hover:shadow-[0_28px_70px_-15px_rgba(170,134,84,0.4)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C7AA7A]"
          >
            <img
              src={CONCLUSION_PLATE.full}
              alt={CONCLUSION_PLATE.caption}
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-cover brightness-[0.82] transition-all duration-[1600ms] ease-out group-hover:scale-[1.03] group-hover:brightness-100"
            />

            <span className="absolute inset-0 bg-gradient-to-t from-[#11100E] via-[#11100E]/20 to-transparent opacity-90 pointer-events-none" />
            <span className="absolute inset-4 sm:inset-6 border border-[#F3EBDD]/12 group-hover:border-[#AA8654]/45 transition-colors duration-500 pointer-events-none" />

            <span className="absolute top-6 left-6 sm:top-9 sm:left-9 font-serif text-2xl sm:text-3xl text-[#C7AA7A] leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] pointer-events-none">
              {numeralFor(CONCLUSION_PLATE.id)}
            </span>

            <span className="absolute top-5 right-5 sm:top-8 sm:right-8 p-2.5 rounded-full border border-[#AA8654]/0 group-hover:border-[#AA8654]/50 bg-[#11100E]/0 group-hover:bg-[#11100E]/70 text-[#AA8654] opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
              <Maximize2 className="w-4 h-4" />
            </span>

            <span className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 md:p-14 text-center pointer-events-none">
              <span className="block text-[9px] sm:text-[10px] font-sans tracking-wide-editorial text-[#AA8654] uppercase mb-2 sm:mb-3">
                Plate {numeralFor(CONCLUSION_PLATE.id)} · The Last Frame
              </span>
              <span className="block font-serif text-3xl sm:text-5xl md:text-6xl text-[#F3EBDD] leading-tight mb-2 sm:mb-4">
                {CONCLUSION_PLATE.title}
              </span>
              <span className="block font-serif italic text-sm sm:text-lg text-[#E5D8C5]/85 font-light max-w-2xl mx-auto">
                {CONCLUSION_PLATE.caption}
              </span>
            </span>
          </motion.button>
        </div>
      </section>

      {/* === Colophon === */}
      <section className="relative py-24 px-6 sm:px-8 bg-[#401D20] border-t border-[#AA8654]/30 overflow-hidden text-center">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#AA8654]/12 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-2xl mx-auto relative z-10">
          <div className="flex items-center justify-center gap-4 mb-7">
            <span className="w-10 h-[1px] bg-[#AA8654]/50" />
            <Sparkles className="w-4 h-4 text-[#AA8654]" />
            <span className="w-10 h-[1px] bg-[#AA8654]/50" />
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl text-[#F3EBDD] mb-4">
            That was <span className="italic font-light text-[#C7AA7A]">ep 1.0</span>
          </h2>

          <p className="font-serif italic text-lg text-[#E5D8C5]/85 font-light mb-10">
            Potluck Society ep 2.0 coming soon…
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <RouteLink
              to={ROUTES.home}
              className="group w-full sm:w-auto px-7 py-3.5 bg-[#AA8654] hover:bg-[#c49d63] text-[#11100E] font-sans text-xs tracking-aristocrat font-semibold transition-all duration-300 shadow-xl hover:shadow-[0_0_25px_rgba(170,134,84,0.4)] flex items-center justify-center gap-2.5"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>RETURN TO THE TABLE</span>
            </RouteLink>

            {/* Cross-page anchor: a real navigation is the simplest correct path */}
            <a
              href="/#feedback"
              className="w-full sm:w-auto px-7 py-3.5 bg-[#11100E]/60 hover:bg-[#11100E] text-[#F3EBDD] border border-[#AA8654]/40 hover:border-[#AA8654] font-sans text-xs tracking-aristocrat font-medium transition-all duration-300 backdrop-blur-sm"
            >
              LEAVE YOUR VERDICT
            </a>
          </div>

          <p className="text-[11px] font-sans text-[#A79C8C] tracking-widest uppercase mt-12">
            iCook · The Potluck Society · {GALLERY_META.eventDate}
          </p>
        </div>
      </section>

      <Lightbox index={openIndex} onClose={() => setOpenIndex(null)} onChange={setOpenIndex} />
    </div>
  );
};
