import HeroSection from "../sections/landing/HeroSection";
import FeaturedTreksSection from "../sections/landing/FeaturedTreksSection";
import WhyChooseUsSection from "../sections/landing/WhyChooseUsSection";
import AIPlannerBanner from "../sections/landing/AIPlannerBanner";
import TestimonialsSection from "../sections/landing/TestimonialsSection";

/** Public homepage — featured treks only; full catalog lives on /treks */
export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedTreksSection />
      <WhyChooseUsSection />
      <AIPlannerBanner />
      <TestimonialsSection />
    </>
  );
}
