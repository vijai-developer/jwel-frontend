import React, { useEffect } from 'react';
import '../components/editorial/EditorialStyles.css';

import { TopAnnouncementBar } from '../components/editorial/TopAnnouncementBar';
import { EditorialNavbar } from '../components/editorial/EditorialNavbar';
import { EditorialHero } from '../components/editorial/EditorialHero';
import { EditorialCollage } from '../components/editorial/EditorialCollage';
import { EditorialCollections } from '../components/editorial/EditorialCollections';
import { EditorialStatementBanner } from '../components/editorial/EditorialStatementBanner';
import { EditorialCuratedPicks } from '../components/editorial/EditorialCuratedPicks';
import { EditorialOccasions } from '../components/editorial/EditorialOccasions';
import { EditorialCraftCare } from '../components/editorial/EditorialCraftCare';
import { EditorialReviews } from '../components/editorial/EditorialReviews';
import { EditorialGalleryStrip } from '../components/editorial/EditorialGalleryStrip';
import { EditorialNewsletter } from '../components/editorial/EditorialNewsletter';
import { EditorialFooter } from '../components/editorial/EditorialFooter';

export const HomeNew = () => {
  useEffect(() => {
    // Scroll to top upon landing view mount
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="editorial-page min-h-screen flex flex-col bg-[#F8F3EA] selection:bg-[#B89B5E] selection:text-[#F8F3EA] w-full max-w-full overflow-x-hidden">
      {/* 1. Slim Top Announcement Bar */}
      <TopAnnouncementBar />

      {/* 2. Editorial Navbar */}
      <EditorialNavbar />

      {/* Main Sequential Editorial Sections */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {/* 3. Full-Bleed Hero */}
        <EditorialHero />

        {/* 4. Editorial Collage (01 / Our Story) */}
        <EditorialCollage />

        {/* 5. Collections as Big Image Panels (02 / Curated Categories) */}
        <EditorialCollections />

        {/* 6. Full-Width Statement Banner */}
        <EditorialStatementBanner />

        {/* 7. Curated Picks Lookbook (03 / Atelier Curation) */}
        <EditorialCuratedPicks />

        {/* 8. Shop by Occasion (04 / Style by Occasion Accordion) */}
        <EditorialOccasions />

        {/* 9. Craft and Care (05 / Artisanal Standards) */}
        <EditorialCraftCare />

        {/* 10. Voices (06 / Reviews) */}
        <EditorialReviews />

        {/* 11. Instagram-Style Gallery Strip */}
        <EditorialGalleryStrip />

        {/* 12. Newsletter (Bottle Green Banner) */}
        <EditorialNewsletter />
      </main>

      {/* 13. Footer */}
      <EditorialFooter />
    </div>
  );
};

export default HomeNew;

