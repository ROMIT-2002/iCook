import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { MenuItemData } from '../data/menu';
import { DietaryTag } from './DietaryTag';

interface MenuItemProps {
  item: MenuItemData;
  onSelect: (item: MenuItemData) => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({ item, onSelect }) => {
  // Type B: Tasting Menu Card for TBD Items without Photos
  if (item.layoutType === 'TypeB') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        onClick={() => onSelect(item)}
        className="group cursor-pointer p-5 rounded-xl bg-[#211A16]/50 hover:bg-[#211A16]/90 border border-[#AA8654]/25 hover:border-[#AA8654]/60 transition-all duration-300 relative overflow-hidden flex flex-col justify-between shadow-lg hover:shadow-[0_8px_25px_rgba(170,134,84,0.15)] min-h-[220px]"
      >
        <div>
          <div className="flex items-center justify-between gap-2 mb-2 text-[10px] font-sans tracking-widest uppercase">
            <span className="text-[#AA8654] font-semibold">{item.course}</span>
            <span className="text-[#A79C8C]">BY {item.contributor.toUpperCase()}</span>
          </div>

          <h4 className="font-serif text-2xl text-[#F3EBDD] group-hover:text-[#AA8654] transition-colors leading-tight mb-2">
            {item.dishName}
          </h4>

          <p className="text-xs font-sans text-[#A79C8C] font-light leading-relaxed">
            {item.ingredients}
          </p>
        </div>

        <div className="pt-3 border-t border-[#AA8654]/15 flex items-center justify-between text-xs text-[#A79C8C]">
          <span className="italic font-serif">Selection forthcoming</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#AA8654]" />
        </div>
      </motion.div>
    );
  }

  // Type A: Premium 60/40 Split Card (Default uniform card layout for all dishes with photos)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      onClick={() => onSelect(item)}
      className="group cursor-pointer rounded-xl bg-[#211A16]/60 border border-[#AA8654]/25 hover:border-[#AA8654]/60 transition-all duration-500 overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-xl hover:shadow-[0_10px_30px_rgba(170,134,84,0.15)] min-h-[280px]"
    >
      {/* 60% Image Column */}
      <div className="lg:col-span-7 relative h-[240px] sm:h-[280px] lg:h-full min-h-[240px] overflow-hidden bg-[#11100E]">
        {item.image ? (
          <img
            src={item.image}
            alt={item.dishName}
            className="w-full h-full object-cover object-center filter brightness-95 group-hover:brightness-105 transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-[#A79C8C]">
            <Sparkles className="w-8 h-8 text-[#AA8654]/40 mb-2" />
            <span className="font-serif text-lg text-[#E5D8C5]">Selection Forthcoming</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#211A16] via-transparent to-transparent lg:hidden" />
      </div>

      {/* 40% Content Column */}
      <div className="lg:col-span-5 p-6 sm:p-7 flex flex-col justify-between space-y-4">
        <div>
          {/* Header metadata line with zero text collision */}
          <div className="flex items-center justify-between gap-3 text-[10px] font-sans tracking-widest text-[#AA8654] uppercase mb-3">
            <span className="font-semibold text-[#AA8654]">{item.course}</span>
            <span className="text-[#A79C8C] truncate font-medium">BY {item.contributor.toUpperCase()}</span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl text-[#F3EBDD] group-hover:text-[#AA8654] transition-colors leading-tight mb-2">
            {item.dishName}
          </h3>

          <p className="text-xs font-sans text-[#A79C8C] leading-relaxed font-light mb-4 line-clamp-3">
            {item.ingredients}
          </p>

          {item.dietaryNotes && item.dietaryNotes.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {item.dietaryNotes.map((note) => (
                <DietaryTag key={note} label={note} />
              ))}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-[#AA8654]/20 flex items-center justify-between text-xs font-sans text-[#A79C8C] group-hover:text-[#F3EBDD] transition-colors">
          <span className="italic font-serif text-sm">View tasting notes</span>
          <ArrowUpRight className="w-4 h-4 text-[#AA8654]" />
        </div>
      </div>
    </motion.div>
  );
};
