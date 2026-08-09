import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Calendar } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'THE TABLE', href: '#gathering' },
    { name: 'THE MENU', href: '#menu' },
    { name: 'EDITORIAL', href: '#editorial' },
    { name: 'RESERVATIONS', href: '#reservations' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#11100E]/95 backdrop-blur-md border-b border-[#AA8654]/25 py-2 shadow-2xl'
            : 'bg-gradient-to-b from-[#11100E]/90 via-[#11100E]/40 to-transparent py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Logo & Brand Crest */}
          <a href="#" className="flex items-center gap-3.5 group text-left">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-[#211A16] border-2 border-[#AA8654]/70 group-hover:border-[#AA8654] transition-all duration-300 shadow-xl overflow-hidden p-1 flex items-center justify-center shrink-0">
              <img
                src="/iCook.png"
                alt="iCook Logo"
                className="w-full h-full object-contain scale-125 filter brightness-[2.8] contrast-[1.3] sepia-[0.5] drop-shadow-[0_0_8px_rgba(170,134,84,0.6)] transition-transform duration-300 group-hover:scale-135"
              />
            </div>
            <div>
              <div className="font-serif text-2xl sm:text-3xl tracking-tight text-[#F3EBDD] group-hover:text-[#AA8654] transition-colors leading-none font-medium">
                iCook
              </div>
              <div className="text-[10px] tracking-widest text-[#AA8654] uppercase font-sans font-semibold mt-1">
                THE POTLUCK SOCIETY
              </div>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-sans tracking-aristocrat text-[#E5D8C5]/80 hover:text-[#AA8654] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#AA8654] hover:after:w-full after:transition-all after:duration-300"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Date Badge & Quick CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 text-[11px] font-sans tracking-widest text-[#A79C8C] border border-[#AA8654]/30 px-3.5 py-1.5 rounded-full bg-[#211A16]/50">
              <Calendar className="w-3.5 h-3.5 text-[#AA8654]" />
              <span>AUG 12 · 2026</span>
            </div>
            <a
              href="#reservations"
              className="text-[11px] font-sans tracking-widest uppercase bg-[#401D20] hover:bg-[#58272b] text-[#F3EBDD] border border-[#AA8654]/40 hover:border-[#AA8654] px-4 py-2 transition-all duration-300 shadow-md hover:shadow-[0_0_15px_rgba(170,134,84,0.25)]"
            >
              Reserve
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="md:hidden text-[#F3EBDD] p-2 hover:text-[#AA8654] transition-colors focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Luxury Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-40 bg-[#11100E]/98 backdrop-blur-xl md:hidden flex flex-col justify-between pt-28 pb-12 px-8 border-b border-[#AA8654]/30"
          >
            <div className="flex flex-col gap-6 text-center">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-[#211A16] border-2 border-[#AA8654] p-1 flex items-center justify-center shadow-xl overflow-hidden">
                <img
                  src="/iCook.png"
                  alt="iCook"
                  className="w-full h-full object-contain scale-125 filter brightness-[2.8] contrast-[1.3] sepia-[0.5] drop-shadow-[0_0_8px_rgba(170,134,84,0.6)]"
                />
              </div>
              <div>
                <h3 className="font-serif text-3xl text-[#F3EBDD]">iCook</h3>
                <p className="text-xs font-sans tracking-widest text-[#AA8654] uppercase mt-1">
                  The Potluck Society
                </p>
              </div>

              <nav className="flex flex-col gap-6 my-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-serif text-2xl tracking-wider text-[#F3EBDD] hover:text-[#AA8654] transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </nav>
            </div>

            <div className="text-center space-y-4 pt-6 border-t border-[#AA8654]/20">
              <div className="flex items-center justify-center gap-2 text-xs font-sans tracking-widest text-[#A79C8C]">
                <Calendar className="w-4 h-4 text-[#AA8654]" />
                <span>AUGUST 12, 2026</span>
              </div>
              <a
                href="#reservations"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-3 bg-[#401D20] text-[#F3EBDD] text-xs tracking-widest uppercase border border-[#AA8654]/50"
              >
                Reserve Your Place
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
