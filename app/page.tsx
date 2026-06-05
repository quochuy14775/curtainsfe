import { Hero } from "@/components/sections/Hero";
import { CategorySection } from "@/components/sections/CategorySection";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactBanner } from "@/components/sections/ContactBanner";

export default function Home() {
  return (
    <>
      <Hero />
      <CategorySection />
      <FeaturedProducts />
      <AboutSection />
      <ContactBanner />
    </>
  );
}
