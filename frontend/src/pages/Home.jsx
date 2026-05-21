import HeroSection from "../sections/landing/HeroSection";

import FeaturedTreksSection from "../sections/landing/FeaturedTreksSection";

import WhyChooseUsSection from "../sections/landing/WhyChooseUsSection";

import AIPlannerBanner from "../sections/landing/AIPlannerBanner";

import TestimonialsSection from "../sections/landing/TestimonialsSection";

// =====================================================
// HOME PAGE
// CLEAN LANDING PAGE
// =====================================================

export default function Home() {

  return (

    <div className="bg-white overflow-hidden">

      {/* HERO SECTION */}

      <HeroSection />

      {/* FEATURED TREKS */}

      <FeaturedTreksSection />

      {/* WHY CHOOSE US */}

      <WhyChooseUsSection />

      {/* AI PLANNER */}

      <AIPlannerBanner />

      {/* TESTIMONIALS */}

      <TestimonialsSection />

    </div>

  );

}