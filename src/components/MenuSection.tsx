import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MENU_ITEMS, MenuItemData } from '../data/menu';
import { MenuItem } from './MenuItem';
import { DishModal } from './DishModal';
import { AlertCircle } from 'lucide-react';

export const MenuSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedDish, setSelectedDish] = useState<MenuItemData | null>(null);

  const categories = [
    { id: 'ALL', label: 'FULL MENU' },
    { id: 'Main', label: 'MAINS' },
    { id: 'Side', label: 'SIDES' },
    { id: 'Dessert', label: 'DESSERTS' },
    { id: 'Drinks', label: 'DRINKS' },
  ];

  const filteredItems = activeCategory === 'ALL'
    ? MENU_ITEMS
    : MENU_ITEMS.filter((item) => item.course === activeCategory || (activeCategory === 'Main' && item.course === 'TBD'));

  const courseGroups = [
    { id: 'Main', title: '01 / MAINS', subtitle: 'Primary courses & heart of the table' },
    { id: 'Side', title: '02 / SIDES', subtitle: 'Accompaniments & shared plates' },
    { id: 'Dessert', title: '03 / DESSERTS', subtitle: 'Sweet finishes & pastry' },
    { id: 'Drinks', title: '04 / DRINKS', subtitle: 'Artisanal beverages & refreshments' },
  ];

  return (
    <section id="menu" className="py-28 px-6 sm:px-8 bg-[#11100E] text-[#F3EBDD] relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-sans tracking-wide-editorial text-[#AA8654] uppercase block mb-3">
            THE TASTING MENU
          </span>
          <h2 className="font-serif text-4xl sm:text-6xl text-[#F3EBDD] font-normal mb-4">
            Prepared by the table.
          </h2>
          <p className="font-serif italic text-xl text-[#E5D8C5]/80 font-light">
            August 12, 2026 · Exclusive Private Tasting
          </p>
        </div>

        {/* Typographic Filter Tabs */}
        <div className="flex items-center justify-center border-b border-[#AA8654]/25 mb-16 overflow-x-auto pb-1 gap-8 sm:gap-12">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative py-4 text-xs font-sans tracking-aristocrat transition-all whitespace-nowrap focus:outline-none ${
                  isActive ? 'text-[#AA8654] font-semibold' : 'text-[#A79C8C] hover:text-[#E5D8C5]'
                }`}
              >
                {cat.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#AA8654]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Menu Rendering Logic */}
        {activeCategory === 'ALL' ? (
          <div className="space-y-20">
            {courseGroups.map((group) => {
              const groupItems = MENU_ITEMS.filter(
                (item) => item.course === group.id || (group.id === 'Main' && item.course === 'TBD')
              );

              if (groupItems.length === 0) return null;

              return (
                <div key={group.id} className="space-y-8">
                  {/* Luxury Section Header */}
                  <div className="border-b border-[#AA8654]/30 pb-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <h3 className="font-serif text-3xl sm:text-4xl text-[#F3EBDD] tracking-wide">
                      {group.title}
                    </h3>
                    <span className="text-xs font-sans tracking-widest text-[#AA8654] uppercase italic font-serif">
                      {group.subtitle}
                    </span>
                  </div>

                  {/* Items Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {groupItems.map((item) => (
                      <MenuItem key={item.id} item={item} onSelect={setSelectedDish} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredItems.map((item) => (
              <MenuItem key={item.id} item={item} onSelect={setSelectedDish} />
            ))}
          </div>
        )}

        {/* Dietary & Allergen Disclaimer */}
        <div className="mt-20 p-6 rounded-lg bg-[#211A16]/50 border border-[#AA8654]/20 flex items-start gap-4 max-w-3xl mx-auto">
          <AlertCircle className="w-5 h-5 text-[#AA8654] shrink-0 mt-0.5" />
          <p className="text-xs font-sans text-[#A79C8C] leading-relaxed font-light">
            Ingredient and dietary information is provided by individual contributors and has not been independently verified. Guests with severe allergies or specific dietary restrictions should confirm details directly before dining.
          </p>
        </div>
      </div>

      {/* Dish Detail Modal */}
      <DishModal dish={selectedDish} onClose={() => setSelectedDish(null)} />
    </section>
  );
};
