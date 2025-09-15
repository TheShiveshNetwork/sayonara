import { BentoDemo } from "@/components/bento-features";
import Features from "@/components/features";
import Hero from "@/components/hero";

export default function Home() {
  return (
    <div className="bg-background">
      <Hero />
      <Features />
      {/* <BentoDemo /> */}
    </div>
  );
}
