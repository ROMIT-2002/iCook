import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#11100E] text-[#F3EBDD] py-16 px-6 sm:px-8 border-t border-[#AA8654]/25">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Brand Lockup */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-[#211A16] border-2 border-[#AA8654]/70 p-1 flex items-center justify-center shadow-xl overflow-hidden shrink-0">
            <img
              src="/iCook.png"
              alt="iCook Logo"
              className="w-full h-full object-contain scale-125 filter brightness-[2.8] contrast-[1.3] sepia-[0.5] drop-shadow-[0_0_8px_rgba(170,134,84,0.6)]"
            />
          </div>
          <div>
            <div className="font-serif text-2xl tracking-tight text-[#F3EBDD]">
              iCook <span className="font-light text-[#AA8654]">· The Potluck Society</span>
            </div>
            <p className="text-xs font-sans text-[#A79C8C] tracking-widest uppercase mt-0.5">
              A Private Table · August 12, 2026
            </p>
          </div>
        </div>

        {/* Tagline */}
        <div className="text-center md:text-right">
          <p className="font-serif italic text-lg text-[#E5D8C5]/90 font-light">
            “Prepared by the team. Served with unreasonable standards.”
          </p>
          <p className="text-[11px] font-sans text-[#A79C8C] tracking-widest uppercase mt-1">
            © {new Date().getFullYear()} iCook. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
