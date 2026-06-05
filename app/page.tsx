import { Hero } from "@/components/sections/Hero";
import { MarqueeBanner } from "@/components/sections/MarqueeBanner";
import { CategorySection } from "@/components/sections/CategorySection";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { ProductCarousel } from "@/components/sections/ProductCarousel";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactBanner } from "@/components/sections/ContactBanner";

export default function Home() {
  return (
    <>
      <Hero />
      <MarqueeBanner />
      <CategorySection />
      <FeaturedProducts />
      <ProductCarousel />
      <AboutSection />
      <ContactBanner />
    </>
  );
}
