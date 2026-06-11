import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { FloatingContact } from "@/components/ui/FloatingContact";
import { WishlistDrawer } from "@/components/wishlist/WishlistDrawer";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { SplashScreen } from "@/components/ui/SplashScreen";
import { StickyCTA } from "@/components/ui/StickyCTA";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LenisProvider>
      <SplashScreen />
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <WishlistDrawer />
      <FloatingContact />
      <StickyCTA />
    </LenisProvider>
  );
}
