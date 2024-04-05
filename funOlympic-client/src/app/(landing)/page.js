import Carousel, { StatsSection } from "@/components/landing/carousel";
import HeroSection from "@/components/landing/heroSection";

export default function Home() {
  return (
    <main className="">
      {/* <HeroSection /> */}
      <Carousel />
      <StatsSection />
    </main>
  );
}
