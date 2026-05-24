import HeroSection from "../../sections/landing/HeroSection";

import FeaturedTreksSection from "../../sections/landing/FeaturedTreksSection";

import WhyChooseUsSection from "../../sections/landing/WhyChooseUsSection";

import AIPlannerBanner from "../../sections/landing/AIPlannerBanner";

import TestimonialsSection from "../../sections/landing/TestimonialsSection";

export default function Home() {

  return (

    <main className="bg-slate-50 overflow-hidden">

      <HeroSection />

      <FeaturedTreksSection />

      <WhyChooseUsSection />

     

      <TestimonialsSection />

    </main>

  );

}