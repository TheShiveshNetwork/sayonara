import { CTA } from "@/components/cta";
import { DemoVideo } from "@/components/demo-video";
import Features from "@/components/features";
import SayonaraFeatures from "@/components/flow";
import Hero from "@/components/hero";

export default function Home() {
  return (
    <div className="bg-background">
      <Hero />
      <SayonaraFeatures />
      <DemoVideo />
      <Features />
      <CTA />
    </div>
  );
}
