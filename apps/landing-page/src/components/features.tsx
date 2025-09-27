import { Shield, Zap, Award, FileCheck, Globe } from "lucide-react";
import { GlowingEffect } from "./ui/glowing-effect";

const Features = () => {
  return (
    <section className="py-24 px-4 md:px-0 min-h-screen relative">
      {/* Dark Noise Colored Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#000000",
          backgroundImage: `
        radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.2) 1px, transparent 0),
        radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.18) 1px, transparent 0),
        radial-gradient(circle at 1px 1px, rgba(236, 72, 153, 0.15) 1px, transparent 0)
      `,
          backgroundSize: "20px 20px, 30px 30px, 25px 25px",
          backgroundPosition: "0 0, 10px 10px, 15px 5px",
        }}
      />
      {/* Vignette top */}
      <div
        className="absolute top-0 left-0 right-0 h-44 z-0 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0), transparent)",
        }}
      />

      {/* Vignette bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-28 z-0 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0), transparent)",
        }}
      />

      <div className="mx-auto max-w-6xl relative">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Why Choose Us?
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Advanced features designed for both personal and enterprise data security needs.
          </p>
        </div>

        {/* <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <BeamCard
              key={feature.title}
            >
              <div className="min-h-[150px] rounded-xl">
                <feature.icon className="h-6 w-6 text-white mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </BeamCard>
          ))}
        </div> */}

        <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
          <GridItem
            area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
            icon={<Shield className="h-4 w-4 text-black dark:text-neutral-400" />}
            description="Uses DoD 5220.22-M and NIST 800-88 standards to ensure complete data destruction."
            title="Military-Grade Security"
          />

          <GridItem
            area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
            icon={<Zap className="h-4 w-4 text-black dark:text-neutral-400" />}
            title="Lightning Fast"
            description="Optimized algorithms provide rapid erasure without compromising security standards."
          />

          <GridItem
            area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
            icon={<Award className="h-4 w-4 text-black dark:text-neutral-400" />}
            title="Certified Compliance"
            description="Meets government and enterprise security standards with detailed audit reports."
          />

          <GridItem
            area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
            icon={<FileCheck className="h-4 w-4 text-black dark:text-neutral-400" />}
            title="Multiple Pass Options"
            description="Choose from 1-pass to 35-pass erasure methods based on your security requirements."
          />

          <GridItem
            area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
            icon={<Globe className="h-4 w-4 text-black dark:text-neutral-400" />}
            title="Cross-Platform"
            description="Available for Windows, Linux, Android, and as a bootable ISO for any system."
          />
        </ul>
      </div>
    </section>
  );
};

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3 bg-background/40">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-gray-600 p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-black md:text-2xl/[1.875rem] dark:text-white">
                {title}
              </h3>
              <h2 className="font-sans text-sm/[1.125rem] text-black md:text-base/[1.375rem] dark:text-neutral-400 [&_b]:md:font-semibold [&_strong]:md:font-semibold">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default Features;