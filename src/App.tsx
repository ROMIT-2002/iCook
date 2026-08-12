import React, { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { EventIntro } from './components/EventIntro';
import { MenuSection } from './components/MenuSection';
import { EditorialFeatures } from './components/EditorialFeatures';
import { GalleryTeaser } from './components/GalleryTeaser';
import { FeedbackSection } from './components/FeedbackSection';
import { Footer } from './components/Footer';
import { GalleryPage } from './components/GalleryPage';
import { useRoute, ROUTES } from './lib/navigation';

const HomePage: React.FC = () => (
  <div className="min-h-screen bg-[#11100E] text-[#F3EBDD] font-sans selection:bg-[#AA8654] selection:text-[#11100E]">
    <Navbar />
    <main>
      <Hero />
      <EventIntro />
      <MenuSection />
      <EditorialFeatures />
      <GalleryTeaser />
      <FeedbackSection />
    </main>
    <Footer />
  </div>
);

export const App: React.FC = () => {
  const route = useRoute();
  // Tolerate a trailing slash so /gallery/ resolves too.
  const isGallery = route.replace(/\/+$/, '') === ROUTES.gallery;

  // A route change is a new page, so start at the top, unless the URL is
  // pointing at a specific section, in which case the browser handles it.
  useEffect(() => {
    if (window.location.hash) return;
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [route]);

  return isGallery ? <GalleryPage /> : <HomePage />;
};

export default App;
