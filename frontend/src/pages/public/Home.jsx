import HeroSection from "../../sections/landing/HeroSection";

import FeaturedTreksSection from "../../sections/landing/FeaturedTreksSection";

import WhyChooseUsSection from "../../sections/landing/WhyChooseUsSection";

import AIPlannerBanner from "../../sections/landing/AIPlannerBanner";

import TestimonialsSection from "../../sections/landing/TestimonialsSection";

import heroBg from "../../assets/images/backgrounds/hero-bg.jpg";

export default function Home() {

  return (

    <main className="relative overflow-hidden bg-[#ededed]">

      {/* Global Cinematic Background */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroBg})`,
        }}
      >

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Soft Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-[#0b0f1a]/90" />

      </div>

      {/* Main Content */}
      <div className="relative z-10">

        {/* Hero Section */}
        <HeroSection />

        {/* Featured Treks */}
        <FeaturedTreksSection />

        {/* Why Choose Us */}
        <WhyChooseUsSection />

       
        {/* Testimonials */}
        <TestimonialsSection />

      </div>

    </main>

  );

}