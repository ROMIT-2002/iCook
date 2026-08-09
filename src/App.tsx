import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { EventIntro } from './components/EventIntro';
import { MenuSection } from './components/MenuSection';
import { EditorialFeatures } from './components/EditorialFeatures';
import { ReservationSection } from './components/ReservationSection';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#11100E] text-[#F3EBDD] font-sans selection:bg-[#AA8654] selection:text-[#11100E]">
      <Navbar />
      <main>
        <Hero />
        <EventIntro />
        <MenuSection />
        <EditorialFeatures />
        <ReservationSection />
      </main>
      <Footer />
    </div>
  );
};

export default App;
