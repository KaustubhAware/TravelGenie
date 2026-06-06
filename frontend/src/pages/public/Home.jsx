import HeroSection from "../../sections/landing/HeroSection";

import FeaturedTreksSection from "../../sections/landing/FeaturedTreksSection";

import FeaturedDestinationsSection from "../../sections/landing/FeaturedDestinationsSection";

import WhyChooseUsSection from "../../sections/landing/WhyChooseUsSection";

import TestimonialsSection from "../../sections/landing/TestimonialsSection";

import TopRatedSection from "../../sections/landing/TopRatedSection";

import VendorOnboardingSection from "../../sections/landing/VendorOnboardingSection";

export default function Home() {

  return (

    <main className="landing-page relative overflow-hidden">

      <div className="relative">

        {/* Hero Section */}
        <HeroSection />

        {/* Featured Treks */}
        <FeaturedTreksSection />

        {/* Featured Destinations */}
        <FeaturedDestinationsSection />

        {/* Top Rated */}
        <TopRatedSection />

        {/* Why Choose Us */}
        <WhyChooseUsSection />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Vendor CTA */}
        <VendorOnboardingSection />

      </div>

    </main>

  );

}