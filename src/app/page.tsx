import { Navbar, Footer } from "@/components/layout";
import { HeroSection } from "@/components/features/hero-section";
import { FeaturedAlbum } from "@/components/features/featured-album";
import { QuickLinks } from "@/components/features/quick-links";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="relative z-0">
        <HeroSection />
        <FeaturedAlbum />
        <QuickLinks />
      </main>
      <Footer />
    </>
  );
}
